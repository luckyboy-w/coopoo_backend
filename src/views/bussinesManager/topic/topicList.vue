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
            <el-table-column prop="subjectName" label="话题名称"></el-table-column>
            <el-table-column prop="subjectContent" label="话题内容"> </el-table-column>
            <el-table-column prop="relPosts" label="发布笔记数" ></el-table-column>
            <el-table-column prop="id" label="操作">
              <template slot-scope="scope">
                <el-button v-if="scope.row.subjectStatus==1" @click="addOrEdit('detail',scope.$index, tableData)" type="text" size="small">查看</el-button>
                <el-button v-if="scope.row.subjectStatus==0" @click="addOrEdit('edit',scope.$index, tableData)" type="text" size="small">编辑</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button @click="goNotesList(scope.row)" type="text" size="small">查看笔记</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button v-if="scope.row.subjectStatus==1" @click="enable('1',scope.row)" type="text" size="small">禁用</el-button>
                <el-button v-if="scope.row.subjectStatus==0" @click="enable('0',scope.row)" type="text" size="small">启用</el-button>
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
    <notesList v-if="noteList" @showListPanel="showListPanel" :editData_="editData_"></notesList>
  </div>
</template>

<script>
  import saveOrEdit from "./topicDetail";
  import notesList from "./notesListDetail";
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
      saveOrEdit,
      notesList
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
        noteList:false,
        showPagination: false,
        editData: {},
        editData_: {},
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
            subjectId: data.list[rowIndex].subjectId
          };
          getMethod("/town-talk/detail", param).then(res => {
            scope.editData = res.data;
            this.showList = false;
            this.showAddOrEdit = true;
          });
        }else if(oper == "detail"){
          let param = {
            subjectId: data.list[rowIndex].subjectId
          };
          getMethod("/town-talk/detail", param).then(res => {
            scope.editData = res.data;
            this.editData.isDisabled = true
            this.showList = false;
            this.showAddOrEdit = true;
          });
        } else {
          scope.editData = {};
          this.showList = false;
          this.showAddOrEdit = true;
        }
      },
      enable(val,row){
        if (val=="1") {
          getMethod('/town-talk/disable', {subjectId:row.subjectId}).then(res => {
            this.$message({
              message: "禁用成功",
              type: "success"
            });
            this.loadList();
          });
        } else if(val=="0"){
        getMethod('/town-talk/enable', {subjectId:row.subjectId}).then(res => {
          this.$message({
            message: "启用成功",
            type: "success"
          });
          this.loadList();
        });
        }
      },
      goNotesList(row) {
          let scope = this;
          scope.editData_ =row;
          this.showList = false;
          this.noteList = true;
      },
      showListPanel(isCancel) {
        this.showList = true;
        this.showAddOrEdit = false;
        this.noteList = false;
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
        postMethod("/town-talk/page", this.searchParam).then(res => {
          scope.$set(this.tableData, 'list', res.data.records)
          // scope.tableData.list = res.data.records;
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
