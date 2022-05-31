<template>
  <div>
    <div class="ly-container" v-if="!showAddOrEdit">
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
            :header-cell-style="{'text-align':'center'}" border
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <!-- <el-table-column type="index" width="50">
            </el-table-column> -->
            <el-table-column label="类目名称">
              <template slot-scope="scope">
                <span v-if="scope.row.categoryLevel=='1'">{{scope.row.sort}}、</span>
                <span v-if="scope.row.categoryLevel=='2'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="updateTime" label="修改时间" ></el-table-column> -->
            <el-table-column fixed="right" prop="id" label="操作">
              <template slot-scope="scope">
                <el-button @click="addType('edit',scope.row)" size="mini" type="text">编辑
                </el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button v-if="scope.row.enable=='1'" @click="disable(scope.row)" size="mini" type="text">禁用
                </el-button>
                <el-button v-if="scope.row.enable=='0'" @click="enable(scope.row)" size="mini" type="text">启用
                </el-button>
                <el-divider v-if="scope.row.categoryLevel=='1'" direction="vertical"></el-divider>
                <el-button v-if="scope.row.categoryLevel=='1'" @click="secondType(scope.row)" size="mini" type="text">
                  二级类目
                </el-button>
                <el-divider v-if="scope.row.categoryLevel=='1'" direction="vertical"></el-divider>
                <el-button v-if="scope.row.categoryLevel=='1'" @click="categoryRenovation(scope.row)" size="mini"
                  type="text">装修页面
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
    <el-dialog title="类目" width="500px" :visible="typePopup" v-if="typePopup" :close-on-click-modal='false'
      :before-close="handleClose">
      <el-form ref="form" label-width="100px">
        <el-form-item label="类目名称">
          <el-input placeholder="类目名称" v-model="name">
          </el-input>
        </el-form-item>
        <el-form-item label="排序" v-if="rowData.categoryLevel!=2">
          <el-input placeholder="排序" oninput="value=value.replace(/^(0+)|[^\d]+/g,'')" v-model="sort">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSubmit()">确认</el-button>
          <el-button plain type="primary" @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog width="500px" :visible="secondTypePopup" v-if="secondTypePopup" :close-on-click-modal='false'
      :before-close="handleClose_">
      <el-form ref="form" label-width="100px">
        <el-form-item label="一级类目名称">
          <span> {{rowData.name}}</span>
        </el-form-item>
        <div class="attr-content">
          <el-button @click="addAttrNameInput" type="primary">添加行</el-button>
        </div>
        <div v-for="(attrItem,index) in addAttrParam">
          <div class="attr-content" style="display: ;">
            <div style="width: 100px;">二级类目名称</div>
            <el-input placeholder="类目名称" v-model="attrItem.name" style="width: 200px;">
            </el-input>
            <el-button v-if="index!==0" type="danger" size='mini' @click="deleteAttrNameInput(attrItem,index)"
              icon="el-icon-delete">删除
            </el-button>
          </div>
        </div>
        <el-form-item>
          <el-button type="primary" @click="submitSecondType()">确认</el-button>
          <el-button plain type="primary" @click="handleClose_()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <saveOrEdit v-if="showAddOrEdit" :edit-data="editData" @showListPanel="showListPanel" />
  </div>
</template>

<script>
  import saveOrEdit from "./categoryRenovation"
  import {
    getMethod,
    postMethod
  } from '@/api/request'

  export default {
    components: {
      saveOrEdit,
    },
    computed: {},
    filters: {},
    created() {},
    data() {
      return {
        editData: {},
        showAddOrEdit: false,
        secondTypePopup: false,
        typePopup: false,
        showPagination: false,
        addAttrParam: [{
          enable: 1,
          name: '',
          parentId: '',
          sort: 1,
        }],
        name: '',
        sort:'',
        state: '',
        rowData: {},
        searchParam: {
          name: '',
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

      addAttrNameInput() {
        let itemObj = {
          // 各个属性 id为空表示新增
          // id: '',
          enable: 1,
          name: '',
          parentId: this.rowData.id,
          sort: 1,
        }
        this.addAttrParam.push(itemObj)
      },
      deleteAttrNameInput(attrItem, index) {
        this.addAttrParam.splice(index, 1)

      },
      submitSecondType() {
        console.log('二级类目数组', this.addAttrParam)
        for (let i = 0; i < this.addAttrParam.length; i++) {
          this.addAttrParam[i].sort = i
          if (this.addAttrParam[i].name == '' || !this.addAttrParam[i].name) {
            let index = i + 1
            this.$message({
              message: "第" + index + "行类目名称不能为空",
              type: "warning"
            });
            return
          }
        }
        console.log('参数', this.addAttrParam)
        postMethod('/exclusive/category/add', {
          categoryList: this.addAttrParam
        }).then(res => {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.loadList()
          this.handleClose_()
        })

      },
      handleClose() {
        this.typePopup = false
        this.rowData = {}
        this.name = ''
        this.sort = ''
      },
      handleClose_() {
        this.secondTypePopup = false
        this.rowData = {}
        this.addAttrParam = [{
          enable: 1,
          name: '',
          parentId: '',
          sort: 1,
        }]
        // this.name=''
      },
      categoryRenovation(row) {
        this.editData = row
        this.showAddOrEdit = true
      },
      showListPanel() {
        this.showAddOrEdit = false
      },
      addSubmit(row) {
        let scope = this
        let param = {
          name: this.name,
          sort:this.sort
        }
        if (param.name == '') {
          this.$message({
            message: "请输入类目名称",
            type: "warning"
          });
          return false;
        }
        if (param.sort == ''&&this.rowData.categoryLevel!=2) {
          this.$message({
            message: "请输入序号",
            type: "warning"
          });
          return false;
        }
        let categoryList = []
        if (this.state == 'add') {
          param.enable = 1
          categoryList.push(param)
          postMethod('/exclusive/category/add', {
            categoryList: categoryList
          }).then(res => {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.loadList()
            scope.handleClose()
          })
        } else if (this.state == 'edit') {
          // if(this.rowData.categoryLevel==2){
          //   delete param.sort
          // }
          param.id = this.rowData.id
          postMethod('/exclusive/category/update',param).then(res => {
            this.$message({
              message: "保存成功",
              type: "success"
            });
            this.loadList()
            scope.handleClose()
          })
        }

      },
      enable(row) {
        let scope = this
        getMethod('/exclusive/category/enable', {id:row.id}).then(res => {
          scope.loadList()
          scope.$message({
            message: "启用成功",
            type: "success"
          });
        });
      },
      disable(row) {
        let scope = this
        getMethod('/exclusive/category/disable', {id:row.id}).then(res => {
          scope.loadList()
          scope.$message({
            message: "禁用成功",
            type: "success"
          });
        });
      },
      addType(state, row) {
        if (row) {
          this.rowData = row
          this.name = row.name.replace('|--', '')
          this.sort = row.sort
        }
        this.state = state
        this.typePopup = true
      },
      secondType(row) {
        console.log(row)
        this.rowData = row
        this.addAttrParam[0].parentId = row.id
        this.secondTypePopup = true
      },
      search() {
        this.searchParam.pageNum = 1
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
  .attr-content {
    display: flex;
    flex-wrap: wrap;
    width: 60vw;
    align-items: center;
    // margin-left: calc(#{$attrTitleWidth} + 4px);
    margin-bottom: 1vh;
  }

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
