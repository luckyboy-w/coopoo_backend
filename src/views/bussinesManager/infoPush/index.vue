<template>
  <div>
    <div class="ly-container" v-if="showList">
      <div class="ly-tool-panel">
        <el-button plain type="primary" @click="addOrEdit('add')" icon="el-icon-document-add">新建</el-button>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table ref="mainTable" :data="tableData.list" style="width: 100%;margin-bottom: 20px;" row-key="id" border
            default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <el-table-column prop="title" label="推送标题" width="250px"></el-table-column>
            <!-- <el-table-column prop="infoContent" label="推送内容" width="600px"></el-table-column> -->
            <el-table-column prop="createTime" label="推送时间" width="150px">
              <template slot-scope="scope">
                {{scope.row.createTime | fmtDateStr}}
              </template>
            </el-table-column>
            <el-table-column prop="id" label="操作" width="600px">
              <template slot-scope="scope">
                <el-button @click="addOrEdit('edit',scope.$index, tableData)" type="text" size="small">查看</el-button>
              </template>
            </el-table-column>


          </el-table>
        </div>
        <div class="ly-data-pagination">
          <el-pagination background v-show="!showPagination" layout="prev, pager, next" @current-change="currentPage"
            @prev-click="currentPage" :current-page="searchParam.pageNum"  @next-click="currentPage" :total="tableData.total"></el-pagination>
        </div>
      </div>
      <div class="list-panel"></div>
    </div>
    <saveOrEdit v-if="showAddOrEdit" @showListPanel="showListPanel" :editData="editData"></saveOrEdit>
  </div>
</template>

<script>
  import saveOrEdit from "./saveOrEdit";
  import {
    getMethod,
    postMethod
  } from "@/api/request";
  import {
    formatDate
  } from '@/api/tools.js'

  export default {
    computed: {},
    mounted() {
      this.initLoad();
    },
    components: {
      saveOrEdit
    },
    created() {},
    filters: {
      fmtDateStr(val) {
        let dt = new Date(val);
        return formatDate(dt, 'yyyy-MM-dd hh:mm');
      }
    },
    data() {
      return {
        pushTypeList: [],
        showList: true,
        showAddOrEdit: false,
        showPagination: false,
        editData: {},
        searchParam: {
          pageSize: 10,
          pageNum: 1
        },
        tableData: {
          list: []
        },
        dataList: []
      };
    },
    methods: {
      search() {
        this.searchParam.pageNum = 1;
        this.loadList();
      },
      addOrEdit(oper, rowIndex, data) {
        let scope = this;
        if (oper == "edit") {
          let param = {
            id: data.list[rowIndex].id
          };
          getMethod("/operate/get-active-info", param).then(res => {
            scope.editData = res.data;
            this.showList = false;
            this.showAddOrEdit = true;
          });
        } else {
          scope.editData = {};
          this.showList = false;
          this.showAddOrEdit = true;
        }
      },
      showListPanel(isCancel) {
        this.showList = true;
        this.showAddOrEdit = false;
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
        if (this.searchParam.pushType == '0') {
          this.searchParam.pushType = null
        }
        getMethod("/operate/search-active-list", this.searchParam).then(res => {
          scope.tableData.list = res.data.records;
          scope.tableData.total = res.data.total;
          scope.showPagination = scope.tableData.total == 0;
          // let dataList = scope.tableData.list
          // for(let i = 0 ; i < dataList.length ; i++){
          //     dataList[i].pushType = this.GLOBAL.pushTypeMap[dataList[i].pushType]
          // }
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
  .ly-container {
    padding: 10px 20px;
    font-size: 14px;

    .ly-tool-panel {
      div {
        display: inline;
      }

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
