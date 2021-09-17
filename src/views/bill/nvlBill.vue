<template>
  <div style="padding:20px 10px">
    <div v-if="showList">
      <div style="display: flex;flex-wrap: wrap;">
        <div class="tabTd">
          <div>供应商名称：</div>
          <div>
            <el-input v-model="searchParam.supplierName" placeholder="请输入" width="180px" />
          </div>
        </div>
        <div class="tabTd">
          <el-button @click="search()" type="primary">
            搜索
          </el-button>
        </div>
      </div>
      <el-table border ref="noBillData" :data="noBillData.list" style="width: 100%; margin-bottom: 20px;" row-key="id">
        <!-- <el-table-column type="index" width="50" label="序号" /> -->
        <el-table-column prop="supplierName" label="供应商名称" min-width="20%" />
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
        <el-table-column prop="platformServiceAmount" label="服务金额" min-width="24%">
          <template slot-scope="scope">
            {{ scope.row.platformServiceAmount | fmtFee }}
          </template>
        </el-table-column>
        <el-table-column prop="pkBillId" label="操作" min-width="24%">
          <template slot-scope="scope">
            <el-link type="primary" @click="findBillDtl(scope.row)">
              查看明细
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :total="noBillData.total" background layout="prev, pager, next" @current-change="currentPage"
        @prev-click="currentPage" @next-click="currentPage" />
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
  import billDetail from './nvlDtl'

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

    },
    data() {
      return {
        tabIndex: 0,
        showList: true,
        detailData: {},
        //10:未结算;20:结算中;30:已结算
        searchParam: {
          supplierName: '',
          pageSize: 10,
          pageNum: 1
        },
        noBillData: {
          list: [],
          total: 0
        },
      };
    },
    mounted() {
      this.loadList();
    },
    methods: {
      search() {
        this.searchParam.pageNum = '1'
        this.loadList();
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
      singleBill(row) {
        this.billOrd(row.pkBillId)
      },
      findBillDtl(row) {
        let scope = this
        scope.detailData={
            supplierId:row.supplierId,
            supplierName:row.supplierName
        }
        scope.showList = false
      },
      currentPage(pageNum) {
        this.searchParam.pageNum = pageNum;
        this.loadList();
      },
      loadList() {
        let scope = this
        let param = this.searchParam
        getMethod("/settlement/supplier-wait-list", param).then(res => {
          scope.noBillData.list = res.data.records
          scope.noBillData.total = res.data.total;
          scope.showPagination = scope.noBillData.total == 0;
        });
      }
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
