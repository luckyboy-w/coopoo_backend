<template>
  <div>
    <div v-if="!showOrdDtl"
      v-loading="loading"
      class="ly-container">
      <div class="ly-tool-panel">
        <table>
          <tr>
            <td>订单编号:</td>
            <td>
              <el-input
                v-model="searchParam.orderNo"
                width="180px"
              />
            </td>
            <td>会员昵称：</td>
            <td>
              <el-input
                v-model="searchParam.recUname"
                width="180px"
              />
            </td>
            <!-- <td>会员手机号：</td>
             <td>
               <el-input
                 v-model="searchParam.recMobile"
                 width="180px"
               />
             </td> -->
            <td>订单状态:</td>
            <td>
              <el-select
                v-model="searchParam.status"
                placeholder="请选择"
              >
                <el-option
                  value=""
                  label="全部"
                />
                <el-option
                  value="50"
                  label="已完成"
                />
                <el-option
                  value="0"
                  label="已取消"
                />
              </el-select>
            </td>
            </td>
            <td>支付方式：</td>
            <td>
              <el-select v-model="searchParam.payType" placeholder="请选择">
                <el-option value="" label="全部"></el-option>
                <el-option value="2" label="微信"></el-option>
                <el-option value="1" label="支付宝"></el-option>
              </el-select>
            </td>
            <td colspan="2">
              <el-button
                icon="el-icon-search"
                @click="search()"
              >
                搜索
              </el-button>
             <!-- <el-button
                icon="el-icon-download"
                @click="exportData()"
              >
                导出
              </el-button> -->
            </td>
          </tr>
        </table>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table
            ref="mainTable"
            :data="tableData.list"
            style="width: 100%; margin-bottom: 20px;"
            row-key="orderId"
            border
          >
            <el-table-column
              prop="orderNo"
              label="订单编号"
              width="220px"
            />
            <el-table-column
              prop="ordPayPrice"
              label="会员金额"
              width="150px"
            >
              <template slot-scope="scope">
                {{ scope.row | fmtPrice }}
              </template>
            </el-table-column>
            <el-table-column
              prop="totalAmount"
              label="支付金额"
              width="150px"
            >
              <template slot-scope="scope">
                {{ scope.row | fmtPayPrice }}
              </template>
            </el-table-column>
            <el-table-column
              prop="payType"
              label="支付方式"
              width="150px"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.payType == 1">支付宝</span>
                <span v-if="scope.row.payType == 2 || scope.row.payType == 3">微信</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="recUname"
              label="买家姓名"
              width="120px"
            />
            <el-table-column
              prop="recPhone"
              label="买家手机号码"
              width="150px"
            />
            <el-table-column
              prop="createTime"
              label="下单时间"
              width="150px"
            >
              <template slot-scope="scope">
                {{ scope.row.createTime | _formatDate }}
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              label="订单状态"
              width="150px"
            >
              <template slot-scope="scope">
                {{ scope.row.status | statuts2Text }}
              </template>
            </el-table-column>
            <!-- 订单状态;0:订单被取消;10:已提交,待发货20;已发货,待收货;30:已收货;待支付;40:退货/售后;50:交易完成/未评价;51:交易完成/已评价; -->
          </el-table>
        </div>
        <div class="ly-data-pagination">
          <el-pagination
            v-show="!showPagination"
            :total="tableData.total"
            background
            layout="prev, pager, next"
            @current-change="currentPage"
            @prev-click="currentPage"
            @next-click="currentPage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getMethod,
  postMethod
} from '@/api/request'

import {
  getMethod as getMethodNew,
  postMethod as postMethodNew
} from '@/api/request'


import {
  formatDate
} from '@/api/tools.js'
import {getToken} from '@/utils/auth'

export default {
  components: {},
  filters: {
    taxType2Text(type) {

    },
    _formatDate(time) {
      if (time == undefined) {
        return '尚未支付，暂无时间'
      }
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },

    fmtPrice(row) {
      if (row.orderType != 4) {
        return row.ordPrice
      }
      if (row.ordPrice == 0) {
        return '待定价'
      }
      return row.ordPrice
    },
    fmtPayPrice(row) {
      if (row.orderType != 4) {
        return row.totalAmount
      }
      if (row.ordPayPrice == 0) {
        return '待定价'
      }
      return row.totalAmount
    },
    statuts2Text(status) {
      // 订单状态;0:订单被取消;10:已提交,待发货20;已付款,待发货;30:已收货;待支付;40:退货/售后;50:交易完成/未评价;51:交易完成/已评价;
      // 52:交易完成/退货
      let statusText = ''
      if (status == '0') {
        statusText = '已取消'
      } else if (status == '10') {
        statusText = '待发货'
      } else if (status == '20') {
        statusText = '待收货'
      } else if (status == '30') {
        statusText = '待支付'
      } else if (status == '40') {
        statusText = '已退货'
      } else if (status == '60') {
        statusText = '定制信息确认中'
      } else if (status == '50' || status == '51' || status == '52') {
        statusText = '交易完成'
      }
      return statusText
    },
  },
  data() {
    return {
      loading: true,
      supplyList: [],
      showOrdDtl: false,
      dealPrice: false,
      addrList: [],
      ordStep: 1,
      ptStep: false,
      lpStep: false,
      dzStep: false,
      isCancelTitle: '已完成',
      dealPriceFrm: {
        orderNo: '',
        orderId: '',
        ordPrice: ''
      },
      //订单状态;0:订单被取消;10:已提交,待发货20;已付款,待发货;30:已收货;待支付;40:退货/售后;50:交易完成/未评价;51:交易完成/已评价
      ordMarks: {
        10: '待发货',
        20: '待收货',
        30: '待付款',
        60: '待沟通',
        50: '完成'
      },
      sendOrderFrm: {
        orderNo: '',
        expressId: '',
        expressName: '',
        sendAddress: '',
        expressNo: '',
        opContent: ''
      },
      ordDtl: {
        status: 10,
        tax: {
          taxTitle: ''
        },
        supplierList: [{
          dtlList: []
        }]
      },
      sendOrder: false,
      pushStockBatch: false,
      pushStock: false,
      typeId2List: [],
      typeIdList: [],
      orderId_: '',
      goodBrandList: [],
      showPagination: false,
      editData: {},
      isGift: '1',
      stockForm: {
        stockNum: ''
      },
      searchParam: {
        payType: '',
        status: '',
        isRisk: 0,
        orderNo: '',
        recUname: '',
        recMobile: '',
        orderType: '5',
        dataType: '',
        riskOrder: '',
        pageSize: 10,
        pageNum: 1
      },
      tableData: {
        list: []
      },
      dataList: [],
    }
  },
  computed: {},
  mounted() {
    this.initLoad()
  },
  created() {

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
      window.open(process.env.VUE_APP_BASE_API_NEW + "/order/export?" + exportParam.join("&"));
    },
    search() {
      this.searchParam.pageSize = 10
      this.searchParam.pageNum = 1
      this.searchParam.dataType = ''
      this.loadList()
    },

    currentPage(pageNum) {
      this.searchParam.pageNum = pageNum
      this.loadList()
    },
    initLoad() {
      this.loadList()
    },
    loadList() {
      const scope = this
      this.sendOrderFrm = {
        orderNo: '',
        expressName: '',
        sendAddress: '',
        expressNo: '',
        opContent: ''
      },
        getMethodNew('/order/findPage', this.searchParam).then(res => {
          scope.tableData = res.data
          scope.sendOrder = false
          scope.showPagination = scope.tableData.total == 0
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.ly-container {
  padding: 10px 20px;
  font-size: 14px;

  .ly-tool-panel {
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
</style>
<style lang="scss">
.el-step__title {
  font-size: 12px;
}

.main-title {
  font-size: 14px;
}

.sub-title {
  font-size: 12px;
}

.steps-view {
  padding: 0 20px;
  margin-top: 20px;
  position: relative;
  z-index: 1;
}

.steps-view::before {
  content: "";
  position: absolute;
  width: 2px;
  background-color: #d8d8d8;
  height: calc(100% - 0px);
  left: 138px;
  z-index: 2;
}

.dataTitle {
  padding: 0 20px;
  line-height: 50px;
  height: 50px;
  width: 100%;
  border: 1px solid #e6e6e6;
  display: flex;

  .item {
    padding-right: 80px;
    font-size: 15px;
  }
}
</style>
