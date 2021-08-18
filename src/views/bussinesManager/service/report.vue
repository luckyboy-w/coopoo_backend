<template>
  <div>
    <div class="ly-container" v-if="showList">
      <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
        <div class="tabTd">
          <div>举报类型：</div>
          <div>
            <el-select v-model="searchParam.reportType" placeholder="请选择">
              <el-option value="" label="全部"></el-option>
              <el-option value="1" label="广告内容"></el-option>
              <el-option value="2" label="搬运抄袭"></el-option>
              <el-option value="3" label="不友善内容"></el-option>
              <el-option value="4" label="造谣，伪科学"></el-option>
              <el-option value="5" label="虚假互动数据"></el-option>
              <el-option value="6" label="色情低俗"></el-option>
              <el-option value="7" label="违法违规"></el-option>
              <el-option value="8" label="青少年不宜"></el-option>
              <el-option value="9" label="其他"></el-option>
            </el-select>
          </div>
        </div>
        <div class="tabTd">
          <div>举报对象：</div>
          <div>
            <el-select v-model="searchParam.reportObjectType" placeholder="请选择">
              <el-option value="" label="全部"></el-option>
              <el-option value="1" label="笔记"></el-option>
              <el-option value="0" label="评论"></el-option>
            </el-select>
          </div>
        </div>
        <div class="tabTd">
          <el-button type="primary" @click="search()" icon="el-icon-search">搜索</el-button>
        </div>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table ref="mainTable" :data="tableData.list" style="margin-bottom: 20px;" row-key="id" border
            default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <el-table-column prop="reportType" label="举报类型">
              <template slot-scope="scope">
                {{ scope.row.reportType | typeText }}
              </template>
            </el-table-column>
            <el-table-column prop="reportObjectType" label="举报对象">
              <template slot-scope="scope">
                {{ scope.row.reportObjectType==1?"笔记":"评论" }}
              </template>
            </el-table-column>
            <el-table-column prop="reportContent" label="举报内容"></el-table-column>
            <el-table-column prop="createTime" label="举报时间" width="150px">
              <template slot-scope="scope">
                {{scope.row.createTime | fmtDateStr}}
              </template>
            </el-table-column>
            <el-table-column prop="id" label="操作">
              <template slot-scope="scope">
                <el-button @click="addOrEdit('edit',scope.$index, tableData)" type="text" size="small">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="ly-data-pagination">
          <el-pagination background v-show="!showPagination" layout="prev, pager, next" @current-change="currentPage"
            @prev-click="currentPage" @next-click="currentPage" :total="tableData.total"></el-pagination>
        </div>
      </div>
      <div class="list-panel"></div>
    </div>
    <saveOrEdit v-if="showAddOrEdit" @showListPanel="showListPanel" :editData="editData"></saveOrEdit>
  </div>
</template>

<script>
  import saveOrEdit from "./reportDetail";
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
      typeText(type) {
        //举报类型【1 广告内容】【 2 搬运抄袭】【 3 不友善内容】【 4 造谣, 伪科学】【 5 虚假互动数据】【 6 色情低俗】【 7 违法违规】【 8 青少年不宜】【 9 其他】
        let typeText = ''
        if (type == '1') {
          typeText = '广告内容'
        } else if (type == '2') {
          typeText = '搬运抄袭'
        } else if (type == '3') {
          typeText = '不友善内容'
        } else if (type == '4') {
          typeText = '造谣, 伪科学'
        } else if (type == '5') {
          typeText = '虚假互动数据'
        } else if (type == '6') {
          typeText = '色情低俗'
        } else if (type == '7') {
          typeText = '违法违规'
        } else if (type == '8') {
          typeText = '青少年不宜'
        } else if (type == '9') {
          typeText = '其他'
        }
        return typeText
      },
    },
    data() {
      return {
        pushTypeList: [],
        showList: true,
        showAddOrEdit: false,
        showPagination: false,
        editData: {},
        searchParam: {
          reportObjectType:'',
          reportType:'',
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
        getMethod("/report/search-report-list", this.searchParam).then(res => {
          scope.tableData.list = res.data.records;
          scope.tableData.total = res.data.total;
          scope.showPagination = scope.tableData.total == 0;
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

      line-height: "60px";
      height: "60px";
      width: 100%;
      padding: 10px 10px;

      .ly-tool-btn {
        padding-left: 20px;
        display: inline;
      }
    }

    .tabTd {
      display: flex;
      flex-wrap: nowrap;
      margin: 7px 10px;
      align-items: center;

    }
  }
</style>
