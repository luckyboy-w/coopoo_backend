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
            <el-select v-model="searchParam.type" clearable placeholder="请选择">
              <el-option v-for="item in typeList" :key="item.id" :label="item.typeName" :value="item.id" />
            </el-select>
          </div>
        </div>
        <div class="tabTd">
          <div>交易方式：</div>
          <div>
            <el-select v-model="searchParam.opType" clearable placeholder="请选择">
              <el-option v-for="item in opTypeList" :key="item.id" :label="item.opTypeName" :value="item.id" />
            </el-select>
          </div>
        </div>
        <div class="tabTd">
          <div>交易时间：</div>
          <div>
            <el-date-picker v-model="searchParam.startCreateTime" clearable value-format="yyyy-MM-dd" type="date"
              width="60px" placeholder="选择开始日期" />
            -
            <el-date-picker v-model="searchParam.endCreateTime" clearable value-format="yyyy-MM-dd" type="date"
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
          <div>会员名称：{{ memberName?memberName:'暂无' }}</div>
        </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <div class="tabTd">
          <div>剩余余额：{{ test?test:'0' }}</div>
        </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <div class="tabTd">
          <div>收入余额：{{ test?test:'0' }}</div>
        </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <div class="tabTd">
          <div>支出余额：{{ test?test:'0' }}</div>
        </div>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table ref="mainTable" :data="tableData" style="width: 100%; margin-bottom: 20px;" row-key="id"
            :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" border>
            <el-table-column prop="userName" label="交易路径">
              <template slot-scope="scope">
                {{ scope.row.userName?scope.row.userName:"暂无" }}
              </template>
            </el-table-column>
            <el-table-column prop="phoneNo" label="交易方式" width="150px">
              <template slot-scope="scope">
                {{ scope.row.phoneNo?scope.row.phoneNo:"暂无" }}
              </template>
            </el-table-column>
            <el-table-column prop="orderPayAmount" label="金额"></el-table-column>
            <el-table-column prop="createTime" label="交易时间"></el-table-column>
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
      console.log(this.pkMemberId)
      this.initLoad();
    },
    created() {},
    data() {
      return {
        showDtlList: false,
        searchParam: {

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
            id: 3,
            typeName: '购买商品'
          },
          {
            id: 4,
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
        memberName:'',
        test:'',
        tableData: [],
      };
    },
    filters: {
    },
    props: {
      pkMemberId: {
        type: String,
        required: false,
        default: null
      }
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
        getMethod("/member/search-member-list", this.searchParam).then(
          res => {
            scope.tableData = res.data.records;
            scope.tableData.total = res.data.total
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
