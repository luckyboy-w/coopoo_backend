<template>
  <div style="padding:0px 10px">
    <div v-if="showList">
     <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
       <div class="tabTd">
         <div>结算单号：</div>
         <div>
           <el-input v-model="searchParam.settleNo" style="width:150px" placeholder="请输入..." />
         </div>
       </div>
       <div class="tabTd">
         <div>供应商名称：</div>
         <div>
           <el-input v-model="searchParam.supplierName" style="width:150px" placeholder="请输入..." />
         </div>
       </div>
       <div class="tabTd">
         <div>结算时间：</div>
         <div>
           <el-date-picker v-model="searchParam.startTime" value-format="yyyy-MM-dd" type="date" style="width:140px"
             placeholder="开始日期" />
           &nbsp;&nbsp;至&nbsp;&nbsp;
           <el-date-picker v-model="searchParam.endTime" value-format="yyyy-MM-dd" type="date" style="width:140px"
             placeholder="结束日期" />
         </div>
       </div>
       <div class="tabTd">
         <div>入账月份：</div>
         <div>
           <el-date-picker
                 v-model="searchParam.accountDate"
                 type="month"
                 value-format="yyyy-MM"
                 placeholder="选择月">
               </el-date-picker>
         </div>
       </div>
       <div class="tabTd">
         <el-button @click="search()" type="primary">
           查询
         </el-button>
         <!-- <el-button icon="el-icon-download" @click="exportData()">
           导出
         </el-button> -->
       </div>
      </div>
      <el-table border ref="noBillData" :data="noBillData.list" style="width: 100%; margin-bottom: 20px;" row-key="id">
        <!-- <el-table-column type="index" width="50" label="序号" /> -->
        <el-table-column prop="settleNo" label="结算单号" min-width="20%" />
        <el-table-column prop="supplierName" label="供应商名称" min-width="20%" />
        <el-table-column prop="settleDate" label="结算时间" min-width="20%">
          <template slot-scope="scope">
            {{ scope.row.settleDate | _formateDate }}
          </template>
        </el-table-column>
        <el-table-column prop="accountDate" label="入账月份" min-width="20%" />
        <el-table-column prop="orderAmount" label="订单金额" min-width="24%">
          <template slot-scope="scope">
            {{ scope.row.orderAmount | fmtFee }}
          </template>
        </el-table-column>
        <el-table-column prop="orderPayAmount" label="支付金额" min-width="24%">
          <template slot-scope="scope">
            {{ scope.row.orderPayAmount | fmtFee }}
          </template>
        </el-table-column>
        <el-table-column prop="settleAmount" label="结算金额" min-width="24%">
          <template slot-scope="scope">
            {{ scope.row.settleAmount | fmtFee }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="platformServiceAmount" label="服务金额" min-width="24%">
          <template slot-scope="scope">
            {{ scope.row.platformServiceAmount | fmtFee }}
          </template>
        </el-table-column> -->
        <el-table-column prop="pkBillId" label="操作" min-width="24%">
          <template slot-scope="scope">
            <el-link type="primary" @click="findBillDtl(scope.row)">
              查看明细
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :total="noBillData.total" background layout="prev, pager, next" @current-change="currentPage"
        @prev-click="currentPage" :current-page="searchParam.pageNum"  @next-click="currentPage" />
    </div>
    <billDetail v-if="!showList" ref="billDetail" :detail-data="detailData" @backToList="backToList" />
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
  import billDetail from './finishDtl'
  import {
    getToken
  } from '@/utils/auth'

  export default {
    components: {
      billDetail
    },
    filters: {
      _formateDate(time) {
        if (time == undefined) {
          return '';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd')
      },
      fmtFee(fee) {
        if (fee == undefined) {
          return '';
        }
        fee = fee + ''
        if (fee.indexOf(".") == -1) {
          return fee + ".00";
        }
        return fee;
      }
    },
    data() {
      return {
        showList: true,
        detailData: {},
        tabIndex: 0,
        //10:未结算;20:结算中;30:已结算
        searchParam: {
          isVipOrder:1,
          settleStatus: 2,
          startTime: '',
          endTime: '',
          accountDate:'',
          supplierName:'',
          settleNo	:'',
          pageSize: 10,
          pageNum: 1
        },
        activeName: 'noBill',
        noBillData: {
          list: [],
          total: 0
        },
        billCashData: {
          list: []
        },
        settleFinshData: {
          list: []
        },
        settleEndData: {
          list: []
        }
      };
    },
    mounted() {
      this.loadList();
    },
    methods: {
      exportData() {
        if (this.searchParam.startTime == null) {
          this.searchParam.startTime = ''
        }
        if (this.searchParam.endTime == null) {
          this.searchParam.endTime = ''
        }
        let param = {
          billType: this.searchParam.billType,
          billNo: this.searchParam.billNo,
          startTime: this.searchParam.startTime,
          endTime: this.searchParam.endTime,
          isVipOrder:1,
        }
        let exportParam = [];
        for (let key in param) {
          exportParam.push(key + "=" + param[key]);
        }
        exportParam.push("token=" + getToken())
        window.open(process.env.VUE_APP_BASE_API + "/backend/orderBill/export?" + exportParam.join("&"));
      },
      search() {
        this.searchParam.pageNum = 1
        this.loadList();
      },
      findBillDtl(row) {
        let scope = this
        scope.detailData={
            supplierName:row.supplierName,
            settleNo:row.settleNo
        }
          scope.showList = false
      },
      backToList() {
        this.showList = true
      },
      batchBill() {
        let selData = this.$refs.noBillData.selection
        let id = [];
        selData.forEach(data => {
          id.push(data.pkBillId)
        });
        this.billOrd(id.join(","))
      },
      billDtl(row) {

      },
      billFee(row) {
        let scope = this
        let param = {
          billIds: row.pkBillIds
        }
        postMethod("/backend/orderBill/billFee", param).then(res => {
          this.$message({
            message: '已完成结算',
            type: 'success'
          })
          scope.loadList()
        });
      },
      billOrd(billId) {
        let scope = this
        let param = {
          pkBillId: billId
        }
        postMethod("/bu/orderBill/billOrd", param).then(res => {
          scope.loadList()
        });
      },
      currentPage(pageNum) {
        this.searchParam.pageNum = pageNum;
        this.loadList();
      },
      loadList() {
        let scope = this
        let param = this.searchParam
        getMethod("/settlement/supplier-process-list", param).then(res => {
          scope.noBillData.list = res.data.records
          scope.noBillData.total = res.data.total;
          scope.showPagination = scope.noBillData.total == 0;
        });
      }
    }
  };
</script>
