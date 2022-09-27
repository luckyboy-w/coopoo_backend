<template>
  <div>
    <div class="ly-container" v-if="!showDtlList">
      <div class="ly-tool-panel" >
        <div class="tabTd">
          <div>会员昵称：</div>
          <div>
            <el-input v-model="searchParam.userName" placeholder="请输入" width="180px" />
          </div>
        </div>
        <div class="tabTd">
          <div>手机号：</div>
          <div>
            <el-input v-model="searchParam.phone" placeholder="请输入" width="180px" />
          </div>
        </div>
        <div class="tabTd">
          <div>所属门店：</div>
          <div>
            <el-input v-model="searchParam.storeName" placeholder="请输入" width="180px" />
          </div>
        </div>
        <div class="tabTd">
          <div>上级手机号：</div>
          <div>
            <el-input v-model="searchParam.inviteMemberPhone" placeholder="请输入" width="180px" />
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
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table ref="mainTable" :data="tableData" style="width: 100%; margin-bottom: 20px;" row-key="id"
            :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" border>
            <el-table-column prop="userName" label="会员昵称"></el-table-column>
            <el-table-column prop="phone" label="手机号" width="150px"></el-table-column>
            <el-table-column prop="inviteMemberPhone" label="上级手机号" width="150px">
              <template slot-scope="scope">
                {{ scope.row.inviteMemberPhone?scope.row.inviteMemberPhone:"暂无" }}
              </template>
            </el-table-column>
            <el-table-column prop="storeName" label="所属门店" >
              <template slot-scope="scope">
                {{ scope.row.storeName?scope.row.storeName:"暂无" }}
              </template>
            </el-table-column>
            <el-table-column prop="currentBalance" label="当前余额"></el-table-column>
            <el-table-column label="操作" fixed="right" width="250px">
              <template slot-scope="scope">
                <el-link @click="toBalanceDtl(scope.row)" type="primary">查看明细</el-link>
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
    <balanceDtl v-if="showDtlList" ref="balanceDtl" :onlyId="onlyId" @backToList="backToList" />
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
  import balanceDtl from './balanceDtl'
  export default {
    components: {
      balanceDtl
    },
    computed: {},
    mounted() {
      this.initLoad();
    },
    created() {},
    data() {
      return {
        onlyId:'',
        showDtlList: false,
        searchParam: {
          inviteMemberPhone:'',
          phone:'',
          storeName:'',
          userName:'',
          pageSize: 10,
          pageNum: 1
        },
        tableData: [],
      };
    },
    filters: {
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
        window.open(process.env.VUE_APP_BASE_API_NEW + "/excel/balance/export?" + exportParam.join("&"));
      },
      //跳转详情
      toBalanceDtl(row) {
        let scope = this
        scope.onlyId=row.id
        scope.showDtlList = true
      },
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
       postMethod("/balance/get-balance", this.searchParam).then(
          res => {
            scope.tableData = res.data.records;
            scope.tableData.total = res.data.total
          }
        );
      },
      backToList() {
        this.showDtlList = false
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
