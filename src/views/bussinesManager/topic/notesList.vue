<template>
  <div>
    <div class="ly-container" v-if="showList">
      <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
        <div class="tabTd">
          <div>标题：</div>
          <div>
            <el-select v-model="searchParam.postsTitle" placeholder="请选择">
              <el-option value="" label="全部"></el-option>
              <el-option value="1" label="已回复"></el-option>
              <el-option value="0" label="未回复"></el-option>
            </el-select>
          </div>
        </div>
        <div class="tabTd">
          <div>用户名称：</div>
          <div>
           <el-input v-model="searchParam.userName" placeholder="请输入" width="180px" />
          </div>
        </div>
		<div class="tabTd">
		  <div>发布时间：</div>
		  <div>
		    <el-date-picker v-model="searchParam.startCreateTime" value-format="yyyy-MM-dd" type="date"
		                      placeholder="选择开始日期"
		      /> &nbsp;&nbsp;至&nbsp;&nbsp;
		      <el-date-picker v-model="searchParam.endCreateTime" value-format="yyyy-MM-dd" type="date"
		                      placeholder="选择结束日期"
		      />
		  </div>
		</div>
        <div class="tabTd">
          <el-button type="primary" @click="search()" icon="el-icon-search">搜索</el-button>
        </div>
       </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table ref="mainTable" :data="tableData.list" style="width: 100%;margin-bottom: 20px;" row-key="id" border
            default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <el-table-column prop="postTitle" label="标题"></el-table-column>
            <el-table-column prop="subjectName" label="话题"></el-table-column>
            <el-table-column prop="memberNickname" label="用户名称"></el-table-column>
            <el-table-column prop="collectCount" label="收藏数" ></el-table-column>
            <el-table-column prop="likesCount" label="点赞数" ></el-table-column>
            <el-table-column prop="commentCount" label="评论数" ></el-table-column>
            <el-table-column prop="createTime" label="发布时间" width="150px">
              <template slot-scope="scope">
                {{scope.row.createTime | fmtDateStr}}
              </template>
            </el-table-column>
            <el-table-column prop="id" label="操作" width="150px">
              <template slot-scope="scope">
                <el-button @click="addOrEdit('detail',scope.$index, tableData)" type="text" size="small">查看</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button v-if="scope.row.postStatus==1" @click="enable('1',scope.row)" type="text" size="small">禁用</el-button>
                <el-button v-if="scope.row.postStatus==0" @click="enable('0',scope.row)" type="text" size="small">启用</el-button>
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
  import saveOrEdit from "./noteDetail";
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
      if (this.$route.query.startCreateTime != undefined) {
        this.searchParam.startCreateTime = this.$route.query.startCreateTime
        this.searchParam.endCreateTime = this.$route.query.endCreateTime
      }
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
          startCreateTime:'',
          endCreateTime:"",
          postsTitle:'',
          userName:'',
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
        if (oper == "detail") {
          let param = {
            postsId: data.list[rowIndex].postsId
          };
          getMethod("/posts/detail", param).then(res => {
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
      enable(val,row){
        if (val=="1") {
          getMethod('/posts/disable', {postsId:row.postsId}).then(res => {
            this.$message({
              message: "禁用成功",
              type: "success"
            });
            this.loadList();
          });
        } else if(val=="0"){
        getMethod('/posts/enable', {postsId:row.postsId}).then(res => {
          this.$message({
            message: "启用成功",
            type: "success"
          });
          this.loadList();
        });
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
        postMethod("/posts/page", this.searchParam).then(res => {
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
