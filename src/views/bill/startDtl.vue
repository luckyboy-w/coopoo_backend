<template>
  <div style="width:100%">
    <div class="ly-tool-panel">
    <el-button type="normal" @click="backToList()">
      返回列表
    </el-button>
    </div>
    <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
      <!-- <div class="tabTd">
        <div>申请时间：</div>
        <div>
          <el-date-picker v-model="searchParam.startTime" value-format="yyyy-MM-dd" type="date" placeholder="开始日期" />
           &nbsp;&nbsp;至&nbsp;&nbsp;
           <el-date-picker v-model="searchParam.endTime" value-format="yyyy-MM-dd" type="date" placeholder="结束日期" />
        </div>
      </div> -->
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
            搜索
          </el-button>
          <el-button @click="exportData()" type="primary">
            导出Excel
          </el-button>
      </div>
     </div>
     <div class="ly-tool-panel">
       <div class="tabTd">
        供应商名称：{{supplierName}}&nbsp;&nbsp;&nbsp;&nbsp;结算单号：{{settleNo}}
       </div>
     </div>
    <el-table border ref="dtlTable" :data="dataList.list" style="width: 100%; margin-bottom: 20px;" row-key="id">
      <!-- <el-table-column type="index" width="50" label="序号" /> -->
      <el-table-column prop="orderNo" label="订单编号" min-width="20%" />
      <el-table-column prop="accountTime" label="入账月份" min-width="15%">
        <template slot-scope="scope">
          {{ scope.row.accountTime }}
        </template>
      </el-table-column>
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
    </el-table>
    <el-pagination :total="dataList.total" background layout="prev, pager, next" @current-change="currentPage"
      @prev-click="currentPage" :current-page="searchParam.pageNum"  @next-click="currentPage" />
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
  import {getToken} from '@/utils/auth'

  export default {
    filters: {
      _formateDate(time) {
        if (time == undefined) {
          return '';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
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
    props: {
      detailData: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        billType: '',
        billMem: '',
        tenantId: '',
        tabIndex: 0,
        //10:未结算;20:结算中;30:已结算
        searchParam: {
			settleNo:'',
          settleStatus:2,
          startTime: '',
          endTime: '',
          accountDate:'',
          isVipOrder:0,
          pageSize: 10,
          pageNum: 1
        },
        supplierName:'蓝丝羽',
        dataList:{
          list:[]
        },
        settleNo:''
      };
    },
    mounted() {
        this.loadList()
        this.supplierName=this.detailData.supplierName
        this.settleNo=this.detailData.settleNo
    },
    methods: {
      // 未结算
      loadList(){
        this.searchParam.settleNo=this.detailData.settleNo
        getMethod("/settlement/supplier-wait-detail-list", this.searchParam).then(res => {
          let scope = this
          scope.dataList.list = res.data.records
          scope.dataList.total = res.data.total;
          scope.showPagination = scope.dataList.total == 0;
        });
      },
      search(val) {
        this.searchParam.pageNum=1
        this.loadList()
      },
      currentPage(pageNum) {
        this.searchParam.pageNum = pageNum;
        this.loadList();
      },
      exportData(val) {
        if (this.searchParam.startTime == null) {
          this.searchParam.startTime = ''
        }
        if (this.searchParam.endTime == null) {
          this.searchParam.endTime = ''
        }
        let exportParam = [];

        let param = JSON.parse(JSON.stringify(this.searchParam));
        delete param.pageSize
        delete param.pageNum
        for (let key in param) {
          exportParam.push(key + "=" + param[key]);
        }
        exportParam.push("token=" + getToken())
		window.open(process.env.VUE_APP_BASE_API_NEW + "/excel/supplier-wait-detail-list/export?" + exportParam.join("&"));
      },
      backToList() {
        this.$emit("backToList");
      }
    }
  };
</script>
<style>
  .tabTd {
     display: flex;
     flex-wrap: nowrap;
     margin: 7px 10px;
     align-items: center;

   }
</style>
