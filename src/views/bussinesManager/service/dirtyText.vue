<template>
  <div>
    <div class="ly-container">
      <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
        <div class="tabTd">
          <el-button type="primary" @click="replyMsg()" icon="el-icon-circle-plus-outline">新增</el-button>
        </div>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table ref="mainTable" :data="tableData.list" style="width:460px; margin-bottom: 20px;" row-key="id"
            :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" border
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="keyWord" label="屏蔽字" width="200px"></el-table-column>
            <el-table-column fixed="right" prop="id" label="操作" width="200px">
              <template slot-scope="scope">
                <el-button @click="deleteOne(scope.row)" size="mini" type="primary">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="ly-data-pagination">
          <el-pagination background v-show="!showPagination" layout="prev, pager, next" @current-change="currentPage"
            @prev-click="currentPage" @next-click="currentPage" :total="tableData.total"
            :page-size="searchParam.pageSize" :current-page="searchParam.pageNum"></el-pagination>
        </div>
      </div>
      <div class="list-panel"></div>
    </div>
    <el-dialog title="新增屏蔽字" width="400px" :visible="sendEval" v-if="sendEval" :before-close="handleClose">
      <el-form ref="form" :model="replyFrm">
        <el-form-item>
          <el-input placeholder="请输入要屏蔽的字" v-model="replyFrm.keyWord">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sendReply()">确认</el-button>
          <el-button plain type="primary" @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getMethod,
    postMethod
  } from '@/api/request'

  export default {
    computed: {},
    filters: {},
    created() {},
    data() {
      return {
        sendEval: false,
        showPagination: false,
        replyFrm: {
          keyWord: ''
        },
        searchParam: {
          pageSize: 10,
          pageNum: 1
        },
        tableData: {
          list: []
        },
      }
    },
    mounted() {
      this.initLoad()
    },
    methods: {
      handleClose() {
        this.sendEval = false
        this.replyFrm.keyWord = ''
      },
      sendReply() {
        let scope = this
        let param = {
          keyWord: this.replyFrm.keyWord
        }
        if (param.keyWord == '') {
          this.$message({
            message: "内容不能为空",
            type: "success"
          });
          return false;
        } else {
          getMethod('/posts/filter-word/save', param).then(res => {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.loadList()
            scope.handleClose()
          })
        }
      },
      deleteOne(row) {
        console.log("8888", row)
        let scope = this
        getMethod('/posts/filter-word/delete', {
          id: row.id
        }).then(res => {
          scope.loadList()
          scope.$message({
            message: "删除成功",
            type: "success"
          });
        });
      },
      replyMsg() {
        this.sendEval = true
      },
      search() {
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
        let scope = this
        postMethod('/posts/filter-word/page', this.searchParam).then(
          res => {
            scope.tableData.list = res.data.records
            scope.tableData.total = res.data.total
            scope.showPagination = scope.tableData.total == 0
          }
        )
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
      width: 450px;
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

  .el-pagination>>>.btn-prev {
    margin: 0 5px 0 0;
    background-color: #f4f4f5;
    color: #606266;
    min-width: 30px;
    border-radius: 2px;
  }
</style>
