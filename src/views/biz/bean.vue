<template>
  <div style="padding:20px 10px">
    <el-row style="line-height:40px;padding:0px 25px 5px 25px">
      <el-col
        :span="3"
        style="font-size:14px;"
      >
        平台运营至今
      </el-col>
      <el-col
        :span="2"
        style="font-size:14px;"
      />
      <el-col
        :span="5"
        style="font-size:14px;backgroud-color:#F0F0F0;"
      >
        平台发放总靠谱豆：{{ allBean }}
      </el-col>
      <el-col
        :span="2"
        style="font-size:14px;"
      />
      <el-col
        :span="5"
        style="font-size:14px;"
      >
        累计平台回收靠谱豆：{{ returnBean }}
      </el-col>
      <el-col
        :span="2"
        style="font-size:14px;"
      />
      <el-col
        :span="5"
        style="font-size:14px;"
      >
        会员剩余总靠谱豆：{{ memberBean }}
      </el-col>
      <el-col
        :span="2"
        style="font-size:14px;"
      />
      <el-col
        :span="5"
        style="font-size:14px;"
      >
        门店所得总靠谱豆：{{ storeBean }}
      </el-col>
    </el-row>
    <el-tabs type="border-card">
      <el-tab-pane label="靠谱豆交易">
        <div v-if="showList">
          <el-row
            v-if="def"
            style="line-height:40px;padding:10px 0px "
          >
            <el-col
              :span="1.5"
              style="font-size:14px;"
            >
              会员名
            </el-col>
            <el-col :span="3">
              <el-input
                v-model="searchParams.memName"
                style="width:120px"
                placeholder=""
              />
            </el-col>
            <el-col
              :span="1.5"
              style="font-size:14px;"
            >
              手机号码
            </el-col>
            <el-col :span="3">
              <el-input
                v-model="searchParams.phoneNo"
                style="width:120px"
                placeholder=""
              />
            </el-col>
            <el-col
              :span="1.5"
              style="font-size:14px;"
            >
              类型
            </el-col>
            <el-col :span="3">
              <el-select
                v-model="searchParams.memberType"
                placeholder="请选择服务商"
              >
                <el-option
                  v-for="item in providerList"
                  :label="item.provinceName"
                  :value="item.id"
                />
              </el-select>
            </el-col>
            <el-col
              :span="9"
              style="padding-left:10px"
            >
              <el-button
                type="primary"
                @click="search()"
              >
                搜索
              </el-button>
            </el-col>
          </el-row>
          <el-table
            v-if="def"
            ref="noBillData"
            stripe
            :data="noBillData.list"
            style="width: 100%; margin-bottom: 20px;"
            row-key="id"
          >
            <el-table-column
              type="index"
              width="50"
              label="序号"
            />
            <el-table-column
              prop="nickname"
              label="会员名称"
              min-width="15%"
            >
              <template slot-scope="scope">
                {{ scope.row.nickname }}
              </template>
            </el-table-column>
            <el-table-column
              prop="phoneNo"
              label="手机号"
              min-width="20%"
            >
              <template slot-scope="scope">
                {{ scope.row.phoneNo }}
              </template>
            </el-table-column>
            <el-table-column
              prop="provinceRole"
              label="服务商类型"
              min-width="10%"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.memberType == '10' && scope.row.provinceRole ==undefined ">会员</span>
                <span v-if="scope.row.memberType == '30' && scope.row.provinceRole =='1' ">A类服务商</span>
                <span v-if="scope.row.memberType == '20' && scope.row.provinceRole =='2' ">B类服务商</span>
                <span v-if="scope.row.memberType == '20' && scope.row.provinceRole =='3' ">C类服务商</span>
                <span v-if="scope.row.memberType == '20' && scope.row.provinceRole =='4' ">D类服务商</span>
                <span v-if="scope.row.memberType == '20' && scope.row.provinceRole =='5' ">E类服务商</span>
                <span v-if="scope.row.memberType == '20' && scope.row.provinceRole =='6' ">EA类服务商</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="beanNum"
              label="剩余靠谱豆数"
              min-width="20%"
            >
              <template slot-scope="scope">
                {{ scope.row.beanNum }}
              </template>
            </el-table-column>
            <el-table-column
              prop="pkBillId"
              label="操作"
              min-width="24%"
            >
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  @click="transdetails(scope.row)"
                >
                  交易明细
                </el-link>
              </template>
            </el-table-column>
          </el-table>


          <el-row style="line-height:40px;padding:10px 0px ">
            <el-col
              :span="24"
              style="padding-left:10px"
            >
              <el-button
                v-if="!allFeeDataShow"
                type="primary"
                icon="el-icon-back"
                @click="backToAllFee()"
              >
                返回列表
              </el-button>
            </el-col>
          </el-row>
          <el-row
            v-if="det"
            style="line-height:40px;padding:10px 0px "
          >
            <el-col
              :span="1.5"
              style="font-size:14px;"
            >
              交易路径
            </el-col>
            <el-col :span="3">
              <el-select
                v-model="searchParams_.type"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in typeList"
                  :label="item.typeName"
                  :value="item.id"
                />
              </el-select>
            </el-col>
            <el-col
              :span="1.5"
              style="font-size:14px;"
            >
              交易方式
            </el-col>
            <el-col :span="3">
              <el-select
                v-model="searchParams_.opType"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in opTypeList"
                  :label="item.opTypeName"
                  :value="item.id"
                />
              </el-select>
            </el-col>
            <el-col
              :span="1.5"
              style="font-size:14px;"
            >
              入账时间
            </el-col>
            <el-col :span="6">
              <el-date-picker
                v-model="searchParams_.startCreateTime"
                value-format="yyyy-MM-dd"
                type="date"
                width="80px"
                placeholder="选择开始日期"
              />
              -
              <el-date-picker
                v-model="searchParams_.endCreateTime"
                value-format="yyyy-MM-dd"
                type="date"
                width="80px"
                placeholder="选择结束日期"
              />
            </el-col>
            <el-col
              :span="4"
              style="padding-left:10px"
            >
              <el-button
                type="primary"
                @click="search_()"
              >
                搜索
              </el-button>
            </el-col>
          </el-row>
          <el-row
            v-if="det"
            style="line-height:40px;padding:0px 25px 5px 25px"
          >
            <el-col
              :span="2"
              style="font-size:14px;"
            />
            <el-col
              :span="5"
              style="font-size:14px;backgroud-color:#F0F0F0;"
            >
              会员名称：{{ memName }}
            </el-col>
            <el-col
              :span="2"
              style="font-size:14px;"
            />
            <el-col
              :span="5"
              style="font-size:14px;"
            >
              剩余靠谱豆：{{ availableBean }}
            </el-col>
            <el-col
              :span="2"
              style="font-size:14px;"
            />
            <el-col
              :span="5"
              style="font-size:14px;"
            >
              收入靠谱豆：{{ incomeBean }}
            </el-col>
            <el-col
              :span="2"
              style="font-size:14px;"
            />
            <el-col
              :span="5"
              style="font-size:14px;"
            >
              支出靠谱豆：{{ consumeBean }}
            </el-col>
          </el-row>
          <el-table
            v-if="det"
            stripe
            :data="detailsListData.list"
            style="width: 100%; margin-bottom: 20px;"
            row-key="id"
          >
            <el-table-column
              type="index"
              width="50"
              label="序号"
            />
            <el-table-column
              prop="type"
              label="交易路径"
              min-width="15%"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.type == '1'">购买会员</span>
                <span v-if="scope.row.type == '2'">邀请好友购买</span>
                <span v-if="scope.row.type == '3'">购买门店服务</span>
                <span v-if="scope.row.type == '4'">退门店服务</span>
                <span v-if="scope.row.type == '5'">服务商门店所得</span>
                <span v-if="scope.row.type == '6'">赠送好友</span>
                <span v-if="scope.row.type == '7'">好友赠予</span>
                <span v-if="scope.row.type == '8'">参加活动</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="opType"
              label="交易方式"
              min-width="20%"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.opType =='1'">收入</span>
                <span v-if="scope.row.opType == '2'">支出</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="beanNum"
              label="靠谱豆数量"
              min-width="20%"
            >
              <template slot-scope="scope">
                {{ scope.row.beanNum }}
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="交易时间"
              min-width="24%"
            >
              <template slot-scope="scope">
                {{ scope.row.createTime | _formateDate }}
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            v-if="def"
            :total="noBillData.total"
            background
            layout="prev, pager, next"
            @current-change="currentPage"
            @prev-click="currentPage"
            @next-click="currentPage"
          />
          <el-pagination
            v-if="det"
            :total="detailsListData.total"
            background
            layout="prev, pager, next"
            @current-change="currentPage_"
            @prev-click="currentPage_"
            @next-click="currentPage_"
          />
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
      }
    },
    props: {

    },
    data() {
      return {
        tabIndex: 0,
        showList: true,
        allFeeDataShow: true,
        def: true,
        det: false,
        memId: '',
        detailList: [],
        titleList: [],
        storeList: [],
        providerList: [{
            id: 1,
            provinceName: 'A类'
          },
          {
            id: 2,
            provinceName: 'B类'
          },
          {
            id: 3,
            provinceName: 'C类'
          },
          {
            id: 4,
            provinceName: 'D类'
          },
          {
            id: 5,
            provinceName: 'E类'
          },
          {
            id: 6,
            provinceName: 'EA类'
          },
        ],
        typeList: [{
            id: 1,
            typeName: '购买会员'
          },
          {
            id: 2,
            typeName: '邀请好友购买'
          },
          {
            id: 3,
            typeName: '购买门店服务'
          },
          {
            id: 4,
            typeName: '退门店服务'
          },
          {
            id: 5,
            typeName: '服务商门店所得'
          },
          {
            id: 6,
            typeName: '赠送好友'
          },
          {
            id: 7,
            typeName: '好友赠予'
          },
          {
            id: 8,
            typeName: '参加活动'
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
          memName: '',
          phoneNo: '',
          memberType: '',
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
        availableBean: '',
        incomeBean: '',
        consumeBean: '',
        //10:未结算;20:结算中;30:已结算
        searchParam: {
          billType: '10',
          billNo: "",
          dataType: '',
          orderNo: "",
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
        activeName: 'noBill'
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
      backToList() {
        this.showList = true
      },
      backToAllFee() {
        this.allFeeDataShow = true
        this.def = true,
          this.det = false,
          this.loadList();
      },
      transdetails(row) {
        this.memId = row.memId
        this.memName = row.nickname
        this.allFeeDataShow = false
        this.def = false,
          this.det = true
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
        getMethod("/backend/siteData/memberBeanDetailList", param).then(res => {
          scope.detailsListData = res.data
        });
      },
      loadPlatFee() {
        let scope = this
        getMethod('/backend/siteData/beanStatistics', {}).then(res => {
          let platData = res.data
          scope.allBean = platData.allBean
          scope.returnBean = platData.returnBean
          scope.memberBean = platData.memberBean
          scope.storeBean = platData.storeBean
        })
      },
      loadPlatFee_() {
        let scope = this
        getMethod('/backend/siteData/memberBeanStatistics', {
          memId: this.memId
        }).then(res => {
          let platData = res.data
          scope.availableBean = platData.availableBean
          scope.incomeBean = platData.incomeBean
          scope.consumeBean = platData.consumeBean
        })
      },
      // batchBill(){
      //     let selData = this.$refs.noBillData.selection
      //     let id = [];
      //     selData.forEach(data=>{
      //         id.push(data.pkBillId)
      //     });
      //     this.billOrd(id.join(","))
      //   },
      //   singleBill(row){
      //     this.billOrd(row.pkBillId)
      //   },
      // findBillDtl(row){
      //   let scope = this
      //   let param = {
      //       billIds:row.pkBillIds
      //   }
      //   getMethod("/backend/orderBill/findBillDtl", param).then(res => {
      //       scope.showList = false
      //       scope.detailList = res.data
      //   });
      // },
      handleClick(tab, event) {
        this.tabIndex = tab.index
        if (tab.index == 0) {
          this.searchParam.billType = "10"
        } else if (tab.index == 1) {
          this.searchParam.billType = "20"
        } else {
          this.searchParam.billType = "30"
        }
        this.loadList();
      },
      currentPage(pageNum) {
        this.searchParam.pageNum = pageNum;
        this.loadList();
      },
      currentPage_(pageNum) {
        this.searchParam.pageNum = pageNum;
        this.loadDetailsList();
      },
      search() {
        let that = this
        let param = {
          pageSize: 10,
          pageNum: 1,
          memName: that.searchParams.memName,
          phoneNo: that.searchParams.phoneNo,
          memberType: that.searchParams.memberType
        }
        getMethod("/backend/siteData/memberBeanList", param).then(res => {
          let obj=res.data.list
          for(let i = 0; i < obj.length; i++){
            if(obj[i].beanNum!=undefined&&obj[i].consumeBean!=undefined){
              obj[i].beanNum=obj[i].beanNum-obj[i].consumeBean
            }
          }
          that.noBillData = res.data // 返回的数据

        })
      },
      search_() {
        let that = this
        let param = {
          type: that.searchParams_.type,
          opType: that.searchParams_.opType,
          startCreateTime: that.searchParams_.startCreateTime,
          endCreateTime: that.searchParams_.endCreateTime,
          memId: this.memId
        }
        getMethod("/backend/siteData/memberBeanDetailList", param).then(res => {
          that.detailsListData = res.data // 返回的数据
        })
      },
      loadList() {
        let scope = this
        let param = this.searchParam
        param.billType = 10
        getMethod("/backend/siteData/memberBeanList", param).then(res => {
          let obj=res.data.list
          for(let i = 0; i < obj.length; i++){
            if(obj[i].beanNum!=undefined&&obj[i].consumeBean!=undefined){
              obj[i].beanNum=obj[i].beanNum-obj[i].consumeBean
            }
          }
          scope.noBillData = res.data
        });
      },
      loadRecTitle() {
        let scope = this
        let param = this.searchParam
        getMethod("/backend/siteData/findRecTypeList", param).then(res => {
          scope.titleList = res.data
        });

        getMethod("/backend/storeManage/findList", param).then(res => {
          scope.storeList = res.data
        });
      }
    }
  };
</script>
