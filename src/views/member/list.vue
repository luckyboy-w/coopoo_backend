<template>
  <div>
    <div class="ly-container" v-if="showList">
      <div class="ly-tool-panel" v-if="showDtl">
        <div class="tabTd">
          <div>会员昵称：</div>
          <div>
            <el-input v-model="searchParam.userName" placeholder="请输入" width="180px" />
          </div>
        </div>
        <div class="tabTd">
          <div>手机号：</div>
          <div>
            <el-input v-model="searchParam.phoneNo" placeholder="请输入" width="180px" />
          </div>
        </div>
        <div class="tabTd">
          <div>会员类型：</div>
          <div>
            <el-select v-model="searchParam.accountType" placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option label="普通会员" value="0" />
              <el-option label="门店" value="3" />
              <el-option label="专属会员" value="5" />
            </el-select>
          </div>
        </div>
        <div class="tabTd">
          <div>状态：</div>
          <div>
            <el-select v-model="searchParam.enable" placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option label="启用" value="1" />
              <el-option label="禁用" value="2" />
            </el-select>
          </div>
        </div>
        <div class="tabTd">
          <div>所属门店：</div>
          <div>
            <el-input v-model="searchParam.storeName" placeholder="请输入" width="180px" />
          </div>
        </div>
        <div class="tabTd">
          <div>注册时间：</div>
          <div>
            <el-date-picker style="width:200px" value-format="yyyy-MM-dd" v-model="searchParam.startRegisterTime"
              type="date" placeholder="开始时间">
            </el-date-picker>
          </div>
          <div style="padding: 0 6px;">至</div>
          <div>
            <el-date-picker style="width:200px" value-format="yyyy-MM-dd" v-model="searchParam.endRegisterTime" type="date"
              placeholder="结束时间">
            </el-date-picker>
          </div>
        </div>
        <div class="tabTd">
          <div>
            <el-button icon="el-icon-search" type="primary" @click="search()">搜索</el-button>
            <el-button icon="el-icon-download" type="primary" @click="exportData()">
              导出
            </el-button>
          </div>
        </div>
      </div>
      <div class="ly-table-panel" v-if="showDtl">
        <div class="ly-data-list">
          <el-table ref="mainTable" :data="tableData" style="width: 100%; margin-bottom: 20px;" row-key="id"
            :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" border>
            <el-table-column prop="userName" label="会员昵称"></el-table-column>
            <el-table-column prop="phoneNo" label="手机号" width="150px"></el-table-column>
            <el-table-column prop="memberTypeStr" label="会员类型"></el-table-column>
            <el-table-column prop="storeName" label="所属门店" >
              <template slot-scope="scope">
                {{ scope.row.storeName?scope.row.storeName:"暂无" }}
              </template>
            </el-table-column>
            <el-table-column prop="orderPayAmount" label="订单消费金额"></el-table-column>
            <el-table-column prop="currBeanQty" label="靠谱豆" ></el-table-column>
            <el-table-column prop="createTime" label="注册时间" width="150px">
              <template slot-scope="scope">
                {{ scope.row.createTime }}
              </template>
            </el-table-column>
            <el-table-column prop="enable" label="状态" >
              <template slot-scope="scope">
                <el-switch v-model="scope.row.enable" active-value="1" inactive-value="0" @change="enable(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column prop="pkMemberId" label="操作" fixed="right" width="250px">
              <template slot-scope="scope">
                <el-link @click="consumeDtl(scope.row)" type="primary">消费明细</el-link>
                <el-divider direction="vertical"></el-divider>
                <el-link v-if="scope.row.isBigShot=='0'||!scope.row.isBigShot" @click="bigShotState(scope.row,1)" type="primary">成为大咖说
                </el-link>
                <el-link v-if="scope.row.isBigShot=='1'" @click="bigShotState(scope.row,2)" type="primary">取消大咖说
                </el-link>
                <el-divider v-if="scope.row.canChangeStore" direction="vertical"></el-divider>
                <el-link v-if="scope.row.canChangeStore" @click="changeStore(scope.row)" type="primary">更换门店</el-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="ly-data-pagination">
          <el-pagination background  layout="prev, pager, next" @current-change="currentPage"
            :current-page="searchParam.pageNum" @prev-click="currentPage" @next-click="currentPage"
            :total="tableData.total"></el-pagination>
        </div>
      </div>

      <div class="ly-tool-panel" v-if="!showDtl">
        <div class="tabTd">
          <div>订单编号：</div>
          <div>
            <el-input v-model="searchDtlParam.orderNo" placeholder="请输入" width="180px"></el-input>
          </div>
        </div>
        <div class="tabTd">
          <div>
            <el-button icon="el-icon-search" type="primary" @click="search_()">搜索</el-button>
            <el-button @click="backUp" v-if="!showDtl">返回</el-button>
          </div>
        </div>
      </div>
      <div style="padding: 0 20px 10px;" v-if="!showDtl">
        用户名称：{{memberName}}
      </div>
      <div class="ly-table-panel" v-if="!showDtl">
        <div class="ly-data-list">
          <div class="content1">
           <el-table :data="tableData2.list" border  style="width: 100%">
             <el-table-column width="1">
               <template slot-scope="scope">
                 <div class="item">
                   <span style="margin-left:150px">订单编号：{{ scope.row.orderNo }}</span>
                   <span style="margin-left:150px">订单总额：{{ scope.row.orderPayAmount }}</span>
                   <span style="margin-left:150px">下单时间：{{ scope.row.createTime }}</span>
                   <span style="margin-left:150px">注册手机号：{{ scope.row.registerPhoneNo }}</span>
                 </div>
               </template>
             </el-table-column>
             <el-table-column label="商品" align="center" width="400">
               <template slot-scope="scope">
                 <div v-for="(item, index) in scope.row.orderItemList" :key="index" class="mesSty">
                   <div style="position: relative;">
                     <img class="imgSty"  :src="item.goodsImage" alt="">
                     <div v-if="scope.row.isVipOrder==1" style="width: 50px;background-color: #409EFF;position: absolute;top: 0;right: 0;color:white;border-radius: 5px;">
                       专属
                     </div>
                   </div>
                   <div class="mesFont">
                     <p>{{ item.goodsName }}</p>
                     <p style="font-size: 12px;color:#909399;margin-top: 10px;">{{ item.skuText }}</p>
                   </div>
                 </div>
               </template>
             </el-table-column>
             <el-table-column align="center" min-width="60" label="单价">
               <template slot-scope="scope">
                 <div v-for="(item, index) in scope.row.orderItemList" :key="index" class="mesSty2">
                   <div>{{ item.goodsPrice}}</div>
                 </div>
               </template>
             </el-table-column>
             <el-table-column align="center" min-width="60" label="数量">
               <template slot-scope="scope">
                 <div v-for="(item, index) in scope.row.orderItemList" :key="index" class="mesSty2">
                   <div>{{item.goodsNum}}</div>
                 </div>
               </template>
             </el-table-column>
             <el-table-column align="center" min-width="70" label="商品状态">
               <template slot-scope="scope">
                 <div v-for="(item, index) in scope.row.orderItemList" :key="index" class="mesSty2">
                   <div>{{ item.orderItemStatus| goodsText }}</div>
                 </div>
               </template>
             </el-table-column>
             <el-table-column align="center" min-width="70" label="实付金额">
               <template slot-scope="scope">
                 <div v-for="(item, index) in scope.row.orderItemList" :key="index" class="mesSty2">
                   <div>{{ item.goodsPrice*item.goodsNum}}</div>
                 </div>
               </template>
             </el-table-column>
             <el-table-column min-width="100" align="center" label="买家">
               <template slot-scope="scope">
                 <div class="mesSty2">
                   <div>{{ scope.row.buyerName }}<br />{{ scope.row.buyerMobile }}</div>
                 </div>
               </template>
             </el-table-column>
             <el-table-column min-width="140" align="center" label="门店名称">
               <template slot-scope="scope">
                 <div class="mesSty2">
                   {{ scope.row.storeName}}
                 </div>
               </template>
             </el-table-column>
             <el-table-column label="状态" align="center" fixed="right" min-width="230">
               <template slot-scope="scope">
                 <div class="mesSty2">
                   <template>
                     <div>
                       <div>
                         {{ scope.row.orderStatus | statuts2Text }}
                       </div>
                       <div>
                         <el-button type="text" size="mini" @click="toOrderDtl(scope.row)">订单详情
                         </el-button>
                       </div>
                       <div>
                       </div>
                     </div>
                   </template>
                 </div>
               </template>
             </el-table-column>
           </el-table>
          </div>
        </div>
        <div class="ly-data-pagination" style="margin: 15px 0;">
          <el-pagination background layout="prev, pager, next" @current-change="currentPage_"
            :current-page="searchDtlParam.pageNum" @prev-click="currentPage_" @next-click="currentPage_"
            :total="tableData2.total"></el-pagination>
        </div>
      </div>
    </div>
    <!-- 更换门店弹框 -->
    <el-dialog title="更换门店" :visible.sync="changeStoreDialog" width="40%" destroy-on-close :before-close="StoreClose">
      <el-form label-width="80px">
        <el-form-item label="会员昵称: ">{{storeFrm.userName}}
        </el-form-item>
        <el-form-item label="手机号: ">{{storeFrm.phoneNo}}
        </el-form-item>
        <el-form-item label="门店名称">
          <el-autocomplete popper-class="my-autocomplete" v-model="storeFrm.storeName"
           :trigger-on-focus="false" clearable style="width: 300px;"
            :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect">
            </i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.storeName }}</div>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="commit()">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <orderDtl v-if="!showList" ref="orderDtl" :orderNo="orderNo" @backToList="backToList" />
  </div>
</template>

<script>
  import {
    getMethod,
    postMethod,
    formatDate
  } from "@/api/request";
  import {
    getToken
  } from '@/utils/auth'
  import orderDtl from './orderDtl'
  export default {
    components: {
      orderDtl
    },
    computed: {},
    mounted() {
      this.initLoad();
      this.storeList()
    },
    created() {},
    data() {
      return {
        orderNo:'',
        tableData2: [],
        memberName: '',
        row: null,
        showDtl: true,
        showList: true,
        searchParam: {
          accountType:'',
          enable:'',
          endRegisterTime:'',
          startRegisterTime:'',
          userName:'',
          phoneNo:'',
          storeName:'',
          pageSize: 10,
          pageNum: 1
        },
        searchDtlParam: {
          orderNo: "",
          pageSize: 10,
          pageNum: 1
        },
        dtlTableData: [],
        tableData: [],
        dataList: [],
        changeStoreDialog: false,
        storeFrm: {},
        restaurants: [],
      };
    },
    filters: {
      formatDate(time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      },
      memberType(data) {
        let typeText = ''
        if (data == "0") {
          typeText = "普通会员"
        } else if (data == "3") {
          typeText = "门店"
        }else if (data == "4") {
          typeText = "专属会员"
        } else if (data == "1") {
          typeText = "平台"
        }else if (data == "2") {
          typeText = "供应商"
        }
        return typeText
      },
      statuts2Text(status) {
        // 订单状态 0:已取消 1:已提交 2:待支付 3:退款中 4:退款完成 5:待取件 6:待发货 7:待收货 8:交易完成 9:拒收 10:拒收完成 11:退货中 12:退货完成
        let statusText = ''
        if (status == '0') {
          statusText = '已取消'
        } else if (status == '1') {
          statusText = '已提交'
        } else if (status == '2') {
          statusText = '待支付'
        } else if (status == '3') {
          statusText = '退款中'
        } else if (status == '4') {
          statusText = '退款完成'
        } else if (status == '5') {
          statusText = '待取件'
        } else if (status == '6') {
          statusText = '待发货'
        } else if (status == '7') {
          statusText = '待收货'
        } else if (status == '8') {
          statusText = '交易完成'
        } else if (status == '9') {
          statusText = '拒收'
        } else if (status == '10') {
          statusText = '拒收完成'
        } else if (status == '11') {
          statusText = '退货中'
        } else if (status == '12') {
          statusText = '退货完成'
        } else if (status == '13') {
          statusText = '退货退款中'
        } else if (status == '14') {
          statusText = '拒收退款中'
        } else if (status == '15') {
          statusText = '待确认'
        }
        return statusText
      },
      goodsText(status) {
        // 商品状态 0:已提交 1:可退款 2:发货中 3:退款中 4:退款失败 5:退款完成 6:待评价 7:已评价 8:退货待接单 9:退货已接单 10:拒收 11:拒收完成 12:退货中 13:退货完成
        let statusText = ''
        if (status == '0') {
          statusText = '已提交'
        } else if (status == '1') {
          statusText = '可退款'
        } else if (status == '2') {
          statusText = '发货中'
        } else if (status == '3') {
          statusText = '退款中'
        } else if (status == '4') {
          statusText = '退款失败'
        } else if (status == '5') {
          statusText = '退款完成'
        } else if (status == '6') {
          statusText = '待评价'
        } else if (status == '7') {
          statusText = '已评价'
        } else if (status == '8') {
          statusText = '退货待接单'
        } else if (status == '9') {
          statusText = '退货已接单'
        } else if (status == '10') {
          statusText = '退货中'
        } else if (status == '11') {
          statusText = '退货完成'
        } else if (status == '12') {
          statusText = '拒收'
        } else if (status == '13') {
          statusText = '拒收完成'
        } else if (status == '14') {
          statusText = '退货退款中'
        } else if (status == '15') {
          statusText = '拒收退款中'
        }
        return statusText
      },
    },
    methods: {
      exportData() {
        let exportParam = [];

        let param = JSON.parse(JSON.stringify(this.searchParam));
        delete param.pageSize
        delete param.pageNum

        for (let key in param) {
          exportParam.push(key + "=" + param[key]);
        }
        exportParam.push("token=" + getToken())
        window.open(process.env.VUE_APP_BASE_API_NEW + "/excel/member-list/export?" + exportParam.join("&"));
      },
      //  启用禁用
      enable(row) {
        let scope = this
        if (row.enable == "1") {
          postMethod('/member/enable-member?pkMemberId=' + row.pkMemberId).then(res => {
            scope.loadList()
            this.$message({
              message: "启用成功",
              type: "success"
            });
          });
        } else if (row.enable == "0") {
          postMethod('/member/disable-member?pkMemberId=' + row.pkMemberId).then(res => {
            scope.loadList()
            this.$message({
              message: "禁用成功",
              type: "success"
            });
          });
        }
      },
      //修改大咖说状态
      bigShotState(row, bigShotVal) {
        let that = this
        if (bigShotVal == "1") {
          postMethod('/member/enable-big-shot?pkMemberId=' + row.pkMemberId).then(res => {
            that.loadList()
            this.$message({
              message: "修改成功",
              type: "success"
            });
          });
        } else if (bigShotVal == "2") {
          postMethod('/member/disable-big-shot?pkMemberId=' + row.pkMemberId).then(res => {
            that.loadList()
            this.$message({
              message: "修改成功",
              type: "success"
            });
          });
        }

      },
      //更换门店
      changeStore(row) {
        let that = this
        that.changeStoreDialog = true
        that.storeFrm={
          userName:row.userName,
          phoneNo:row.phoneNo,
          pkMemberId:row.pkMemberId
        }
      },
      storeList() {
        getMethod("/store/search-store-list", {
          pageSize: 500,
          pageNum: 1
        }).then(
          res => {
            this.restaurants = res.data.records
          }
        );
      },
      querySearch(queryString, cb) {
        let restaurants = this.restaurants;
        let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.storeName.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        this.storeFrm.storeName=item.storeName
        this.storeFrm.storeId=item.id
      },
      commit(){
        let that= this
        if(that.storeFrm.storeId&&that.storeFrm.storeId!=''){
          postMethod('/member/change-store?pkMemberId='+that.storeFrm.pkMemberId+"&storeId="+that.storeFrm.storeId).then(res => {
            that.loadList()
            that.StoreClose()
            that.$message({
              message: "修改成功",
              type: "success"
            });
          });
        }else{
          that.$message({
            message: "请选择正确的门店",
            type: "warning"
          });
        }
      },
      //关闭修改门店彈框
      StoreClose() {
        this.changeStoreDialog = false
      },
      //跳转订单详情
      toOrderDtl(row) {
        let scope = this
        scope.orderNo=row.orderNo
        scope.showList = false
      },
      consumeDtl(row) {
        this.loadDtlList(row)
      },
      search() {
        this.searchParam.pageNum = 1;
        this.loadList();
      },
      search_() {
        this.searchDtlParam.pageNum = 1
        this.searchConsume();
      },
      currentPage(pageNum) {
        this.searchParam.pageNum = pageNum;
        this.loadList();
      },
      currentPage_(pageNum) {
        // console.log(pageNum,'1341654')
        this.searchDtlParam.pageNum = pageNum;
        this.searchConsume();
      },
      initLoad() {
        this.loadList();
      },
      loadList() {
        let scope = this;
        let param=JSON.parse(JSON.stringify(this.searchParam))
        if(this.searchParam.accountType==5){
          param.accountType=''
          param.vipLevel=1
        }else{
          param.vipLevel=''
        }
        getMethod("/member/search-member-list",param).then(
          res => {
            scope.tableData = res.data.records;
            scope.tableData.forEach(i => {
              i.enable = JSON.stringify(i.enable)
            })
            scope.tableData.total = res.data.total
          }
        );
      },
      backToList() {
        this.showList = true
      },
      backUp(){
        this.showDtl = true
        this.searchDtlParam={
          orderNo: "",
          pageSize: 10,
          pageNum: 1
        }
      },
      searchConsume() {
        let that = this
        postMethod('/order/goods-order-list', that.searchDtlParam).then(res => {
          this.$set(this.tableData2, 'list', res.data.records)
          // that.tableData2.list = res.data.records
          that.tableData2.total = res.data.total
        })
      },
      loadDtlList(row) {
        let scope = this;
        scope.memberName=row.userName
        scope.searchDtlParam.memberId=row.pkMemberId
        postMethod('/order/goods-order-list', scope.searchDtlParam).then(res => {
          this.$set(this.tableData2, 'list', res.data.records)
          // scope.tableData2.list = res.data.records
          scope.tableData2.total = res.data.total
          scope.showDtl = false;
        })
      }
    }
  };
</script>
<style lang="scss" scoped>
  .ly-container {
    padding: 10px 20px;
    font-size: 14px;

    .ly-tool-panel {
      display: flex;
      flex-wrap: wrap;
      line-height: "60px";
      height: "60px";
      width: 100%;
      padding: 10px 10px;

      .ly-tool-btn {
        padding-left: 20px;
        display: inline;
      }
    }
  }

  .tabTd {
    display: flex;
    flex-wrap: nowrap;
    margin: 7px 10px;
    align-items: center;
  }

  .my-autocomplete {
    li {
      line-height: normal;
      padding: 7px;

      .name {
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .addr {
        font-size: 12px;
        color: #b4b4b4;
      }

      .highlighted .addr {
        color: #ddd;
      }
    }
  }
</style>
<style scoped>
  .el-table--enable-row-transition /deep/ .cell {
    padding: 0;
  }

  .item {
    width: 100vw;
    background: #f1f1f1;
    position: absolute;
    top: 0;
    left: -55px;
    z-index: 1;
    height: 50px;
    line-height: 50px;
  }

  .imgSty {
    width: 100px;
    height: 100px;
    display: block;
    margin-left: 10px;
  }

  .mesSty {
    height: 150px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-left: 10px;
    border-bottom: 1px solid #ebeef5;
  }

  .mesSty:first-child {
    margin-top: 50px;
  }

  .mesSty:last-child {
    border-bottom: none;
  }

  .mesSty2 {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1px;
    height: 150px;
    border-bottom: 1px solid #ebeef5;
  }

  .mesSty2:last-child {
    border-bottom: none;
  }

  .content1>>>.el-table--border td:nth-child(2) {
    padding: 0;
  }

  .content1 /deep/ .el-table__row td:nth-child(n+3) .cell {
    position: absolute !important;
    top: 50px !important;
    width: 100%;
    text-align: center;
  }

  .content1 /deep/ .el-table__row td:nth-child(1) .cell {
    position: absolute !important;
    top: 0px !important;
    z-index: 999;
    width: 100vw;
    height: 50px;
    line-height: 50px;
  }

  .pb_sty span {
    background: #1dc8de;
    padding: 2px 8px;
    border-radius: 4px;
    color: #fff;
  }

  .mesFont p {
    text-align: left !important;
    margin-block-start: 0;
    margin-block-end: 0;
    padding: 0 10px;
  }

  .mesFont p:nth-child(2) {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
</style>
