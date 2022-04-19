<template>
  <div>
    <div class="ly-container">
      <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
        <div class="tabTd">
          <div>类目名称：</div>
          <div>
            <el-input v-model="searchParam.name" placeholder="请输入" width="180px" />
          </div>
        </div>
        <div class="tabTd">
          <el-button icon="el-icon-search" type="primary" @click="search()">
            搜索
          </el-button>
        </div>
        <div class="tabTd">
          <el-button type="primary" @click="addType('add')" icon="el-icon-circle-plus-outline">新增</el-button>
        </div>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table ref="mainTable" :data="tableData.list" style="width: 700px; margin-bottom: 20px;" row-key="id"
            :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" border
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="name" label="类目名称" ></el-table-column>
            <el-table-column prop="updateTime" label="修改时间" ></el-table-column>
            <el-table-column fixed="right" prop="id" label="操作">
              <template slot-scope="scope">
                <el-button @click="addType('edit',scope.row)" size="mini" type="text">編輯
                </el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button v-if="scope.row.enable=='1'" @click="enable('1',scope.row)" size="mini" type="text">禁用
                </el-button>
                <el-button v-if="scope.row.enable=='0'" @click="enable('0',scope.row)" size="mini" type="text">启用
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
    <el-dialog title="新增一级类目" width="500px"  :visible="typePopup" v-if="typePopup" :close-on-click-modal='false' :before-close="handleClose">
      <el-form ref="form" label-width="100px">
        <el-form-item label="类目名称" >
          <el-input placeholder="一级类目名称" v-model="name">
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="排序">
          <el-input placeholder="排序" v-model="sort">
          </el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="addSubmit()">确认</el-button>
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
        typePopup: false,
        showPagination: false,
        name:'',
        // sort:'',
        state:'',
        rowData:{},
        searchParam: {
          name:'',
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
        this.typePopup = false
        this.rowData = {}
        this.name=''
      },
      addSubmit(row) {
        let scope = this
        let param = {
          name: this.name,
        }
        if (param.name == '') {
          this.$message({
            message: "内容不能为空",
            type: "warning"
          });
          return false;
        }
        let categoryList =[]
        if (this.state=='add') {
         param.enable=1
         param.sort=1
        categoryList.push(param)
          postMethod('/goods/category/add', categoryList).then(res => {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.loadList()
            scope.handleClose()
          })
        } else if(this.state=='edit'){
          param.id =this.rowData.id
          categoryList.push(param)
          postMethod('/goods/category/update', categoryList).then(res => {
            this.$message({
              message: "保存成功",
              type: "success"
            });
            this.loadList()
            scope.handleClose()
          })
        }

      },
      enable(num,row) {
        let scope = this
        let params={
          id:row.id
        }
        if (num=='1') {
          params.enable='0'
        } else if(num=='0'){
          params.enable='1'
        }
        postMethod('/goods/category/update',params).then(res => {
          scope.loadList()
          scope.$message({
            message: "操作成功",
            type: "success"
          });
        });
      },
      addType(state,row) {
        if(row){
          this.rowData=row
        }
        this.state=state
        this.typePopup = true
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
        postMethod('/exclusive/category/list', this.searchParam).then(
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
