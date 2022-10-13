<template>
  <div>
    <div class="ly-container">
      <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
        <div class="tabTd">
          <div>优惠券名称：</div>
          <div><el-input v-model="searchParam.goodsName" width="180px" placeholder="请输入" /></div>
        </div>
        <div class="tabTd">
          <div>门店名称：</div>
          <div>
            <el-select v-model="searchParam.storeId" style="width:180px" filterable clearable placeholder="请选择">
              <el-option v-for="item in storeList" :key="item.id" :label="item.storeName" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>
        <div class="tabTd">
          <div>入账时间：</div>
          <div><el-date-picker v-model="searchParam.accountTime" type="month" value-format="yyyy-MM" placeholder="选择月" /></div>
        </div>
        <div class="tabTd">
          <div>订单类型：</div>
          <div>
            <el-select v-model="searchParam.orderType" placeholder="请选择">
              <el-option value="" label="全部"></el-option>
              <el-option value="5" label="会员订单"></el-option>
              <el-option value="4" label="线上优惠券订单"></el-option>
              <el-option value="3" label="线下优惠券订单"></el-option>
            </el-select>
          </div>
        </div>
        <div class="tabTd">
          <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
          <el-button type="primary" icon="el-icon-download" style="margin-left:20px" @click="exportData()">导出明细</el-button>
        </div>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table ref="mainTable" :data="tableData.list" style="width: 100%; margin-bottom: 20px;" row-key="id" border>
            <el-table-column prop="orderNo" label="订单编号" />
            <el-table-column prop="goodsName" label="商品名称">
            </el-table-column>
            <el-table-column prop="orderType" label="订单类型">
              <template slot-scope="scope">
                <span v-if="scope.row.orderType == 3">线下优惠券订单</span>
                <span v-if="scope.row.orderType == 4">线上优惠券订单</span>
                <span v-if="scope.row.orderType == 5">会员订单</span>
              </template>
            </el-table-column>
            <el-table-column prop="orderAmount" label="订单金额" />
            <el-table-column prop="accountTime" label="入账时间" />
            <el-table-column prop="storeName" label="门店名称" />
            <el-table-column prop="storeProfitRatio" label="门店利润分佣比例" />
            <el-table-column prop="storePreSettlePrice" label="门店预计分佣金额" />
            <el-table-column prop="storePlatformPrice" label="门店平台服务费" />
            <el-table-column prop="partnerSettleAmount" label="合伙人佣金" />
            <el-table-column prop="storeSettlePrice" label="门店实际分佣金额" />
          </el-table>
        </div>
        <div class="ly-data-pagination">
          <el-pagination
            v-show="!showPagination"
            background
            layout="prev, pager, next"
            :total="tableData.total"
            :page-size="searchParam.pageSize"
            :current-page="searchParam.pageNum"
            @current-change="currentPage"
            @prev-click="currentPage"
            @next-click="currentPage"
          />
        </div>
      </div>
      <div class="list-panel" />
    </div>
  </div>
</template>

<script>
import { getMethod, postMethod } from '@/api/request';
import { getToken } from '@/utils/auth.js';

export default {
  data() {
    return {
      showPagination: false,
      searchParam: {
        accountTime: '',
        goodsName: '',
        orderType: '',
        storeId: '',
        pageSize: 10,
        pageNum: 1
      },
      tableData: {
        list: []
      },
      storeList:[],
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.initLoad();
    this.initStoreList()
  },
  methods: {
    search() {
      this.searchParam.pageNum = 1;
      this.loadList();
    },
    currentPage(pageNum) {
      this.searchParam.pageNum = pageNum;
      this.loadList();
    },
    initLoad() {
      this.loadList();
    },
    exportData() {
      let exportParam = [];
      let param = JSON.parse(JSON.stringify(this.searchParam));
      delete param.pageSize;
      delete param.pageNum;

      for (let key in param) {
        exportParam.push(key + '=' + param[key]);
      }
      exportParam.push('token=' + getToken());
      window.open(process.env.VUE_APP_BASE_API_NEW + '/excel/coupon-and-vip-settlement-detail/export?' + exportParam.join('&'));
    },
    loadList() {
      let scope = this;
      postMethod('/settlement/coupon-and-vip-settlement-detail', this.searchParam).then(res => {
        scope.tableData.list = res.data.records;
        scope.tableData.total = res.data.total;
        scope.showPagination = scope.tableData.total == 0;
      });
    },
    initStoreList() {
      getMethod("/store/search-store-list", {
        pageSize: 500,
        pageNum: 1
      }).then(
        res => {
          this.storeList = res.data.records
        }
      );
    },
  }
};
</script>
<style lang="scss" scoped>
.ly-container {
  padding: 10px 20px;
  font-size: 14px;

  .ly-tool-panel {
    line-height: '60px';
    height: '60px';
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

.el-pagination {
  white-space: nowrap;
  padding: 2px 0px;
  color: #303133;
  font-weight: bold;
}

.el-pagination > .btn-prev {
  margin: 0 5px 0 0;
  background-color: #f4f4f5;
  color: #606266;
  min-width: 30px;
  border-radius: 2px;
}
</style>
