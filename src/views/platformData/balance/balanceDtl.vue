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
