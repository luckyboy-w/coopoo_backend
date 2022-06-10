<template>
  <div>
    <div class="ly-container">
      <div>
        <div class="tabTd">
          <el-button type="primary" size="small" icon="el-icon-back" @click="backToList()">返回列表</el-button>
        </div>
       </div>
      <div class="ly-tool-panel" >
        <div class="tabTd">
          <div>交易路径：</div>
          <div>
            <el-select v-model="searchParam.accountRecordType" clearable placeholder="请选择">
              <el-option v-for="item in typeList" :key="item.id" :label="item.typeName" :value="item.id" />
            </el-select>
          </div>
        </div>
        <div class="tabTd">
          <div>交易方式：</div>
          <div>
            <el-select v-model="searchParam.operation" clearable placeholder="请选择">
              <el-option v-for="item in opTypeList" :key="item.id" :label="item.opTypeName" :value="item.id" />
            </el-select>
          </div>
        </div>
        <div class="tabTd">
          <div>交易时间：</div>
          <div>
            <el-date-picker v-model="searchParam.startTradeTime" clearable value-format="yyyy-MM-dd" type="date"
              width="60px" placeholder="选择开始日期" />
            -
            <el-date-picker v-model="searchParam.endTradeTime" clearable value-format="yyyy-MM-dd" type="date"
              width="60px" placeholder="选择结束日期" />
          </div>
        </div>
        <div class="tabTd">
          <div>
            <el-button icon="el-icon-search" type="primary" @click="search()">搜索</el-button>
          </div>
        </div>
      </div>
      <div style="display: flex;flex-wrap: wrap;color: #686868;font-size: 15px;">
        <div class="tabTd">
          <div>会员名称：{{ userName?userName:'暂无' }}</div>
        </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <div class="tabTd">
          <div>剩余余额：{{ remainingBalance?remainingBalance:'0' }}</div>
        </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <div class="tabTd">
          <div>收入余额：{{ incomeBalance?incomeBalance:'0' }}</div>
        </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <div class="tabTd">
          <div>支出余额：{{ expenditureBalance?expenditureBalance:'0' }}</div>
        </div>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table ref="mainTable" :data="tableData" style="width: 100%; margin-bottom: 20px;" row-key="id"
            :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" border>
            <el-table-column prop="accountRecordType" label="交易路径">
              <template slot-scope="scope">
                {{ scope.row.accountRecordType | recordType }}
              </template>
            </el-table-column>
            <el-table-column prop="operation" label="交易方式" width="150px">
              <template slot-scope="scope">
                <span v-if="scope.row.operation==1">收入</span>
                <span v-if="scope.row.operation==2">支出</span>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="金额"></el-table-column>
            <el-table-column prop="tradeTime" label="交易时间">
              <template slot-scope="scope">
                {{ scope.row.tradeTime | _formateDate}}
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
      </div>
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
  export default {
    computed: {},
    mounted() {
      console.log(this.onlyId)
      this.searchParam.id=this.onlyId
      this.initLoad();
    },
    created() {},
    data() {
      return {
        showDtlList: false,
        searchParam: {
          id:'',
          accountRecordType:'',
          endTradeTime:'',
          startTradeTime:'',
          operation:'',
          pageSize: 10,
          pageNum: 1
        },
        typeList: [
          {
            id: 1,
            typeName: '充值'
          },
          {
            id: 2,
            typeName: '返利'
          },
          {
            id: 4,
            typeName: '购买商品'
          },
          {
            id: 5,
            typeName: '退货'
          },
        ],
        opTypeList: [{
          id: 1,
          opTypeName: '收入'
        }, {
          id: 2,
          opTypeName: '支出'
        }],
        expenditureBalance: 0,
        incomeBalance: 0,
        remainingBalance: 0,
        userName: "",
        tableData: [],
      };
    },
    filters: {
      _formateDate(time) {
        if (time == undefined) {
          return '';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      recordType(data) {
        let typeText = ''
        if (data == "1") {
          typeText = "充值"
        } else if (data == "2") {
          typeText = "返利已结算"
        }else if (data == "3") {
          typeText = "返利未结算"
        }else if (data == "4") {
          typeText = "购买商品"
        }else if (data == "5") {
          typeText = "退货"
        }
        return typeText
      },
    },
    props: {
      onlyId:[String,Number]
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
      loadList() {
        let scope = this;
        postMethod("/balance/get-balance-detail", this.searchParam).then(
          res => {
            scope.tableData = res.data.balanceDetailVOPage.records;
            scope.expenditureBalance=res.data.expenditureBalance
            scope.incomeBalance=res.data.incomeBalance
            scope.remainingBalance=res.data.remainingBalance
            scope.userName=res.data.userName
            scope.tableData.total = res.data.balanceDetailVOPage.total
          }
        );
      },
      backToList() {
        this.$emit("backToList");
      },
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

</style>
