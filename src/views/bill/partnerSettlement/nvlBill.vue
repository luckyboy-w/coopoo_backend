<template>
  <div style="padding:20px 10px">
    <div v-if="showList">
      <div style="display: flex;flex-wrap: wrap;">
        <div class="tabTd">
          <div>合伙人名称：</div>
          <div><el-input v-model="searchParam.supplierName" placeholder="请输入"/></div>
        </div>
        <div class="tabTd">
          <div>合伙人手机号：</div>
          <div><el-input v-model="searchParam.supplierName" placeholder="请输入" /></div>
        </div>
        <div class="tabTd">
          <div>门店名称：</div>
          <div><el-input v-model="searchParam.supplierName" placeholder="请输入" /></div>
        </div>
        <div class="tabTd">
          <el-button @click="search()" type="primary">查询</el-button>
          <el-button @click="exportData()" icon="el-icon-download">导出</el-button>
        </div>
      </div>
      <el-table border ref="noBillData" :data="noBillData.list" style="width: 100%; margin-bottom: 20px;" row-key="id">
        <el-table-column prop="supplierName" label="合伙人名称" />
        <el-table-column prop="orderAmount" label="合伙人手机号" />
        <el-table-column prop="orderAmount" label="门店名称" />
        <el-table-column prop="orderAmount" label="订单金额" />
        <el-table-column prop="orderAmount" label="实付金额" />
        <el-table-column prop="orderAmount" label="结算金额" />
        <el-table-column prop="pkBillId" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="findBillDtl(scope.row)">查看明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="searchParam.pageNum"
        :total="noBillData.total"
        background
        layout="prev, pager, next"
        @current-change="currentPage"
        @prev-click="currentPage"
        @next-click="currentPage"
      />
    </div>
    <billDetail v-if="!showList" ref="billDetail" :detail-data="detailData" @backToList="backToList" />
  </div>
</template>
<script>
import { getMethod, postMethod } from '@/api/request';
import { formatDate } from '@/api/tools.js';
import billDetail from './nvlDtl';

export default {
  components: {
    billDetail
  },
  props: {},
  data() {
    return {
      showList: true,
      detailData: {},
      searchParam: {
        pageSize: 10,
        pageNum: 1
      },
      noBillData: {
        list: [],
        total: 0
      }
    };
  },
  mounted() {
    this.loadList();
  },
  methods: {
    exportData() {
      let exportParam = [];

      let param = JSON.parse(JSON.stringify(this.searchParam));
      delete param.pageSize;
      delete param.pageNum;

      for (let key in param) {
        exportParam.push(key + '=' + param[key]);
      }
      exportParam.push('token=' + getToken());
      window.open(process.env.VUE_APP_BASE_API_NEW + '/excel/supplier-settlement/export?' + exportParam.join('&'));
    },
    search() {
      this.searchParam.pageNum = 1;
      this.loadList();
    },
    backToList() {
      this.showList = true;
    },
    findBillDtl(row) {
      let scope = this;
      scope.detailData = {
        supplierId: row.supplierId
      };
      scope.showList = false;
    },
    currentPage(pageNum) {
      this.searchParam.pageNum = pageNum;
      this.loadList();
    },
    loadList() {
      let scope = this;
      let param = scope.searchParam;
      getMethod('/settlement/supplier-wait-list', param).then(res => {
        scope.noBillData.list = res.data.records;
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
