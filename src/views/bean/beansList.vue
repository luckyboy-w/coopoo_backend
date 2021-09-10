<template>
  <div style="padding:20px 10px">
    <el-row style="line-height:40px;padding:0px 25px 5px 25px">
      <el-col :span="3" style="font-size:14px;">
        平台运营至今
      </el-col>
      <el-col :span="2" style="font-size:14px;" />
      <el-col :span="5" style="font-size:14px;backgroud-color:#F0F0F0;">
        平台发放总靠谱豆：{{ allBean }}
      </el-col>
      <el-col :span="2" style="font-size:14px;" />
      <el-col :span="5" style="font-size:14px;">
        累计平台回收靠谱豆：{{ returnBean }}
      </el-col>
      <el-col :span="2" style="font-size:14px;" />
      <el-col :span="5" style="font-size:14px;">
        会员剩余总靠谱豆：{{ memberBean }}
      </el-col>
    </el-row>
    <el-tabs type="border-card">
      <el-tab-pane label="靠谱豆交易">
        <div>
          <div v-if="allFeeDataShow">
            <div style="display: flex;flex-wrap: wrap;">
              <div class="tabTd">
                <div>会员昵称：</div>
                <div>
                  <el-input v-model="searchParams.userName" width="180px" placeholder="请输入" clearable />
                </div>
              </div>
              <div class="tabTd">
                <div>手机号：</div>
                <div>
                  <el-input v-model="searchParams.phoneNo" width="180px" placeholder="请输入" clearable />
                </div>
              </div>
              <div class="tabTd">
                <div>会员类型：</div>
                <div>
                  <el-select v-model="searchParams.accountType" placeholder="请选择">
                    <el-option label="全部" value="" />
                    <el-option label="会员" value="0" />
                    <el-option label="门店" value="3" />
                  </el-select>
                </div>
              </div>
              <div class="tabTd">
                <el-button type="primary" @click="search()">
                  搜索
                </el-button>
                <el-button @click="resetMain()">
                  重置
                </el-button>
              </div>
            </div>
            <el-table ref="noBillData" stripe border :data="noBillData.list" style="width: 100%; margin-bottom: 20px;"
              row-key="id">
              <el-table-column prop="userName" label="会员名称">
                <template slot-scope="scope">
                  {{ scope.row.userName }}
                </template>
              </el-table-column>
              <el-table-column prop="mobile" label="手机号">
                <template slot-scope="scope">
                  {{ scope.row.mobile }}
                </template>
              </el-table-column>
              <el-table-column prop="accountType" label="会员类型">
                <template slot-scope="scope">
                  {{ scope.row.accountType | memberType}}
                </template>
              </el-table-column>
              <el-table-column prop="beanNum" label="靠谱豆数量">
                <template slot-scope="scope">
                  {{ scope.row.currBeanQty }}
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-link type="primary" @click="transdetails(scope.row)">
                    交易明细
                  </el-link>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination :total="noBillData.total" background :page-size="searchParams.pageSize"
              :current-page="searchParams.pageNum" layout="prev, pager, next" @current-change="currentPage"
              @prev-click="currentPage" @next-click="currentPage" />
          </div>
          <div v-if="!allFeeDataShow">
            <el-row style="line-height:40px;padding:10px 0px ">
              <el-col :span="24" style="padding-left:10px">
                <el-button type="primary" icon="el-icon-back" @click="backToAllFee()">
                  返回列表
                </el-button>
              </el-col>
            </el-row>
            <div style="display: flex;flex-wrap: wrap;">
              <div class="tabTd">
                <div>交易路径：</div>
                <div>
                  <el-select v-model="searchParams_.type" placeholder="请选择">
                    <el-option v-for="item in typeList" :key="item.id" :label="item.typeName" :value="item.id" />
                  </el-select>
                </div>
              </div>
              <div class="tabTd">
                <div>交易方式：</div>
                <div>
                  <el-select v-model="searchParams_.opType" placeholder="请选择">
                    <el-option v-for="item in opTypeList" :key="item.id" :label="item.opTypeName" :value="item.id" />
                  </el-select>
                </div>
              </div>
              <div class="tabTd">
                <div>交易时间：</div>
                <div>
                  <el-date-picker v-model="searchParams_.startCreateTime" value-format="yyyy-MM-dd" type="date"
                    width="60px" placeholder="选择开始日期" />
                  -
                  <el-date-picker v-model="searchParams_.endCreateTime" value-format="yyyy-MM-dd" type="date"
                    width="60px" placeholder="选择结束日期" />
                </div>
              </div>
              <div class="tabTd">
                <el-button type="primary" @click="search_()">
                  搜索
                </el-button>
                <el-button @click="reset()">
                  重置
                </el-button>
              </div>
            </div>
            <div style="display: flex;flex-wrap: wrap;color: #686868;font-size: 15px;">
              <div class="tabTd">
                <div>会员名称：{{ memName }}</div>
              </div>
              <div class="tabTd">
                <div>剩余靠谱豆：{{ currBeanQty?currBeanQty:'0' }}</div>
              </div>
              <div class="tabTd">
                <div>收入靠谱豆：{{ totalBeanQty?totalBeanQty:'0' }}</div>
              </div>
              <div class="tabTd">
                <div>支出靠谱豆：{{ consumeBean?consumeBean:'0' }}</div>
              </div>
            </div>
            <el-table stripe :data="detailsListData.list" border style="width: 100%; margin-bottom: 20px;" row-key="id">
              <!-- <el-table-column type="index" width="50" label="序号" /> -->
              <el-table-column prop="type" label="交易路径" min-width="15%">
                <template slot-scope="scope">
                  <span v-if="scope.row.type == '2'">邀请好友购买</span>
                  <span v-if="scope.row.type == '10'">签到</span>
                  <span v-if="scope.row.type == '11'">注册</span>
                  <span v-if="scope.row.type == '12'">浏览商品</span>
                  <span v-if="scope.row.type == '13'">分享笔记</span>
                  <span v-if="scope.row.type == '14'">点赞笔记</span>
                  <span v-if="scope.row.type == '15'">评论商品</span>
                  <span v-if="scope.row.type == '16'">获赞</span>
                  <span v-if="scope.row.type == '9'">购买靠谱豆商品</span>
                </template>
              </el-table-column>
              <el-table-column prop="opType" label="交易方式" min-width="20%">
                <template slot-scope="scope">
                  <span v-if="scope.row.opType =='1'">收入</span>
                  <span v-if="scope.row.opType == '2'">支出</span>
                </template>
              </el-table-column>
              <el-table-column prop="beanNum" label="靠谱豆数量" min-width="20%">
                <template slot-scope="scope">
                  {{ scope.row.beanNum }}
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="交易时间" min-width="24%">
                <template slot-scope="scope">
                  {{ scope.row.createTime | _formateDate }}
                </template>
              </el-table-column>
            </el-table>
            <el-pagination :total="detailsListData.total" background layout="prev, pager, next"
              @current-change="currentPage_" @prev-click="currentPage_" @next-click="currentPage_" />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import {
    getMethod,
    postMethod
  } from "@/api/request";
  import {
    formatDate
  } from "@/api/tools.js"

  export default {
    components: {},
    filters: {
      _formateDate(time) {
        if (time == undefined) {
          return '';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      memberType(data) {
        let typeText = ''
        if (data != "3") {
          typeText = "会员"
        } else if (data == "3") {
          typeText = "门店"
        }
        return typeText
      },
    },
    props: {},
    data() {
      return {
        tabIndex: 0,
        allFeeDataShow: true,
        memId: '',
        detailList: [],
        typeList: [{
            id: '',
            typeName: '请选择'
          },
          {
            id: 2,
            typeName: '邀请好友购买'
          },
          {
            id: 10,
            typeName: '签到'
          },
          {
            id: 11,
            typeName: '注册'
          },
          {
            id: 12,
            typeName: '浏览商品'
          },
          {
            id: 13,
            typeName: '分享笔记'
          },
          {
            id: 14,
            typeName: '点赞笔记'
          },
          {
            id: 15,
            typeName: '评论商品'
          },
          {
            id: 16,
            typeName: '获赞'
          },
          {
            id: 9,
            typeName: '购买靠谱豆商品'
          }
        ],
        opTypeList: [{
          id: 1,
          opTypeName: '新增'
        }, {
          id: 2,
          opTypeName: '减少'
        }],
        searchParams: {
          pageSize: 10,
          pageNum: 1,
          userName: '',
          phoneNo: '',
          accountType: '',
        },
        searchParams_: {
          type: '',
          opType: '',
          startCreateTime: '',
          endCreateTime: '',
        },
        allBean: '',
        returnBean: '',
        memberBean: '',
        storeBean: '',
        memName: '',
        currBeanQty: '',
        totalBeanQty: '',
        consumeBean: '',
        //10:未结算;20:结算中;30:已结算
        searchParam: {
          pageSize: 10,
          pageNum: 1
        },
        noBillData: {
          list: [],
          total: 0
        },
        detailsListData: {
          list: [],
          total: 0
        },
      };
    },
    mounted() {
      if (this.$route.query.dt != undefined) {
        this.searchParam.dataType = this.$route.query.dt
      }
      this.loadList();
      // this.loadRecTitle();
      this.loadPlatFee()
    },

    methods: {
      backToAllFee() {
        this.allFeeDataShow = true
        // this.loadList();
      },
      transdetails(row) {
        this.memId = row.memberId
        this.memName = row.userName
        this.allFeeDataShow = false
        this.loadDetailsList(row)
        this.loadPlatFee_()
      },
      loadDetailsList(row) {
        let scope = this
        let param = {
          memId: this.memId,
          pageSize: this.searchParam.pageSize,
          pageNum: this.searchParam.pageNum
        }
        getMethod("/bean/search-bean-rec-list", param).then(res => {
          scope.detailsListData.list = res.data.records
          scope.detailsListData.total = res.data.total
        });
      },
      loadPlatFee() {
        let scope = this
        getMethod('/bean/get-bean-list-count').then(res => {
          let platData = res.data
          scope.allBean = platData.provider
          scope.returnBean = platData.recovery
          scope.memberBean = platData.memberSurplus
        })
      },
      loadPlatFee_() {
        let scope = this
        getMethod('/bean/get-bean-rec-list-count?member_id=' + this.memId).then(res => {
          let platData = res.data
          scope.currBeanQty = platData.memberSurplus
          scope.totalBeanQty = platData.add
          scope.consumeBean = platData.reduce
        })
      },
      currentPage(pageNum) {
        this.searchParams.pageNum = pageNum;
        this.loadList();
      },
      currentPage_(pageNum) {
        this.searchParam.pageNum = pageNum;
        this.loadDetailsList();
      },
      resetMain() {
        this.searchParams = {
          memName: '',
          phoneNo: '',
          memberType: '',
          pageSize: 10,
          pageNum: 1
        }
      },
      search() {
        let that = this
        this.searchParams.pageNum = 1
        this.loadList()
      },
      reset() {
        this.searchParams_ = {
          type: '',
          opType: '',
          startCreateTime: '',
          endCreateTime: '',
          pageSize: 10,
          pageNum: 1
        }
      },
      search_() {
        let that = this
        let param = {
          type: that.searchParams_.type,
          opType: that.searchParams_.opType,
          startCreateTime: that.searchParams_.startCreateTime,
          endCreateTime: that.searchParams_.endCreateTime,
          memId: this.memId,
          pageSize: 10,
          pageNum: 1
        }
        getMethod("/bean/search-bean-rec-list", param).then(res => {
          that.detailsListData.list = res.data.records // 返回的数据
          that.detailsListData.total = res.data.total
        })
      },
      loadList() {
        let scope = this
        let param = this.searchParams
        getMethod("/bean/search-bean-list", param).then(res => {
          scope.noBillData.list = res.data.records
          scope.noBillData.total = res.data.total
        });
      },
    }
  };
</script>
<style scoped>
  .tabTd {
    display: flex;
    flex-wrap: nowrap;
    margin: 7px 10px;
    align-items: center;

  }
</style>
