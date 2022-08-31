<template>
  <div>
    <div class="ly-container" v-if="!showAddOrEdit">
      <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
        <div class="tabTd">
          <div>类目名称：</div>
          <div><el-input v-model="searchParam.name" clearable placeholder="请输入" width="180px" /></div>
        </div>
        <div class="tabTd"><el-button icon="el-icon-search" type="primary" @click="search()">搜索</el-button></div>
        <div class="tabTd"><el-button type="primary" @click="addType('add')" icon="el-icon-circle-plus-outline">新增</el-button></div>
      </div>
      <div class="ly-table-panel">
        <el-table
          v-if="renderComponent"
          ref="deptTreeTable"
          :data="tableData.list"
          style="width: 700px; margin-bottom: 20px;"
          row-key="id"
          :header-cell-style="{ 'text-align': 'center' }"
          border
          :tree-props="{ children: 'goodsCategoryTree', hasChildren: 'hasChildren' }"
        >
          <!-- @row-click="expandRowClick" -->
          <el-table-column label="类目名称">
            <template slot-scope="scope">
              <span v-if="scope.row.level == 1" style="font-weight: 600;font-size: 16px;">{{ scope.row.sort }}、{{ scope.row.name }}</span>
              <span v-if="scope.row.level == 2" style="color: #909399;font-weight: 600;font-size: 15px;">{{ scope.row.sort }}、{{ scope.row.name }}</span>
              <span v-if="scope.row.level == 3" style="margin-left: 40px;">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click="addType('edit', scope.row)" size="mini" type="text">编辑</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button v-if="scope.row.enable == '1'" @click="disable(scope.row)" size="mini" type="text">禁用</el-button>
              <el-button v-if="scope.row.enable == '0'" @click="enable(scope.row)" size="mini" type="text">启用</el-button>
              <el-divider v-if="scope.row.level == '1'" direction="vertical"></el-divider>
              <el-button v-if="scope.row.level == '1'" @click="addType('add', scope.row)" size="mini" type="text">二级类目</el-button>
              <el-divider v-if="scope.row.level == '2'" direction="vertical"></el-divider>
              <el-button v-if="scope.row.level == '2'" @click="thirdType(scope.row)" size="mini" type="text">三级类目</el-button>
              <el-divider v-if="scope.row.level == '1'" direction="vertical"></el-divider>
              <el-button v-if="scope.row.level == '1'" @click="categoryRenovation(scope.row)" size="mini" type="text">装修页面</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="list-panel"></div>
    </div>
    <el-dialog title="类目" width="500px" :visible="typePopup" v-if="typePopup" :close-on-click-modal="false" :before-close="handleClose">
      <el-form ref="form" label-width="100px">
        <el-form-item label="类目名称"><el-input placeholder="类目名称" v-model="name"></el-input></el-form-item>
        <el-form-item label="排序"><el-input placeholder="排序" oninput="value=value.replace(/^(0+)|[^\d]+/g,'')" v-model="sort"></el-input></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSubmit()">确认</el-button>
          <el-button plain type="primary" @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog width="500px" :visible="thirdTypePopup" :close-on-click-modal="false" :before-close="handleClose_">
      <el-form ref="form" label-width="100px">
        <el-form-item label="二级类目名称">
          <span>{{ rowData.name }}</span>
        </el-form-item>
        <div class="attr-content"><el-button @click="addCategoryNameInput" type="primary">添加行</el-button></div>
        <div v-for="(categoryItem, index) in addCategoryParam" :key="index">
          <div class="attr-content" style="display: ;">
            <div style="width: 100px;">三级类目名称</div>
            &nbsp;&nbsp;
            <el-input placeholder="序号" v-model="categoryItem.sort" oninput="value=value.replace(/^(0+)|[^\d]+/g,'')" style="width: 60px;"></el-input>
            &nbsp;&nbsp;
            <el-input placeholder="类目名称" v-model="categoryItem.name" style="width: 200px;"></el-input>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <el-button v-if="index !== 0" type="danger" size="mini" @click="deleteCategoryNameInput(categoryItem, index)" icon="el-icon-delete">删除</el-button>
          </div>
        </div>
        <el-form-item>
          <el-button type="primary" @click="submitThirdType()">确认</el-button>
          <el-button plain type="primary" @click="handleClose_()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <saveOrEdit v-if="showAddOrEdit" :edit-data="editData" @showListPanel="showListPanel" />
  </div>
</template>

<script>
import saveOrEdit from './categoryRenovation';
import { getMethod, postMethod } from '@/api/request';

export default {
  components: {
    saveOrEdit
  },
  computed: {},
  filters: {},
  created() {},
  data() {
    return {
      editData: {},
      showAddOrEdit: false,
      thirdTypePopup: false,
      typePopup: false,
      showPagination: false,
      addCategoryParam: [
        {
          enable: 1,
          name: '',
          parentId: '',
          level: 3,
          sort: ''
        }
      ],
      thirdCategorySort: '',
      name: '',
      sort: '',
      state: '',
      rowData: {},
      searchParam: {
        name: ''
      },
      tableData: {
        list: []
      },
      renderComponent: true
    };
  },
  mounted() {
    this.initLoad();
  },
  methods: {
    // expandRowClick(row, column, event){
    //   this.tableData.list.forEach((element, index) => {
    //     if (row.id==element.id) {
    //       if (event.currentTarget.querySelector('.el-table__expand-icon')) {
    //         event.currentTarget.querySelector('.el-table__expand-icon').click();
    //       }
    //     }
    //     if (element.goodsCategoryTree&&element.goodsCategoryTree!=null) {
    //       element.goodsCategoryTree.forEach((deptElement, idx) => {
    //         if (row.id==deptElement.id) {
    //           if (event.currentTarget.querySelector('.el-table__expand-icon')) {
    //             event.currentTarget.querySelector('.el-table__expand-icon').click();
    //           }
    //         }
    //       })
    //     }
    //   });
    // },
    expandableListView(data) {
      if (data.length > 0) {
        data.forEach((element, index) => {
          // if (element.searchFlag && element.searchFlag == true) {
          //   this.$refs.deptTreeTable.toggleRowExpansion(this.tableData.list[index], true);
          // }
          if (element.goodsCategoryTree) {
            element.goodsCategoryTree.forEach((deptElement, idx) => {
              if (deptElement.searchFlag && deptElement.searchFlag == true) {
                this.$refs.deptTreeTable.toggleRowExpansion(this.tableData.list[index], true);
                // this.$refs.deptTreeTable.toggleRowExpansion(this.tableData.list[index].children[idx], true);
              }
              if (deptElement.goodsCategoryTree) {
                deptElement.goodsCategoryTree.forEach((sonElement, i) => {
                  if (sonElement.searchFlag && sonElement.searchFlag == true) {
                    this.$refs.deptTreeTable.toggleRowExpansion(this.tableData.list[index], true);
                    this.$refs.deptTreeTable.toggleRowExpansion(this.tableData.list[index].goodsCategoryTree[idx], true);
                  }
                });
              }
            });
          }
        });
      }
    },

    addCategoryNameInput() {
      let sort = Number(this.addCategoryParam[this.addCategoryParam.length - 1].sort) + 1;
      let itemObj = {
        // 各个属性 id为空表示新增
        // id: '',
        enable: 1,
        name: '',
        level: 3,
        parentId: this.rowData.id,
        sort: sort++
      };
      this.addCategoryParam.push(itemObj);
    },
    deleteCategoryNameInput(categoryItem, index) {
      let sort = Number(this.thirdCategorySort);
      this.addCategoryParam.splice(index, 1);
      this.addCategoryParam.forEach(item => {
        item.sort = sort++;
      });
    },
    submitThirdType() {
      let sortArr = [];
      let sortArr_ = [];
      for (let i = 0; i < this.addCategoryParam.length; i++) {
        if (this.addCategoryParam[i].sort == '' || !this.addCategoryParam[i].sort) {
          let index = i + 1;
          this.$message({
            message: '第' + index + '行序号不能为空',
            type: 'warning'
          });
          return;
        }
        if (this.addCategoryParam[i].name == '' || !this.addCategoryParam[i].name) {
          let index = i + 1;
          this.$message({
            message: '第' + index + '行类目名称不能为空',
            type: 'warning'
          });
          return;
        }
        sortArr.push(Number(this.addCategoryParam[i].sort));
        sortArr_ = [...new Set(sortArr)];
      }
      if (sortArr.length != sortArr_.length) {
        let repeatSort = [];
        sortArr.forEach(elem => {
          if (sortArr.indexOf(elem) !== sortArr.lastIndexOf(elem) && repeatSort.indexOf(elem) === -1) {
            repeatSort.push(elem);
          }
        });
        this.$message({
          message: '类目序号"' + repeatSort + '"重复',
          type: 'warning'
        });
        return false;
      }
      postMethod('/exclusive/category/add', {
        categoryList: this.addCategoryParam
      }).then(res => {
        this.$message({
          message: '添加成功',
          type: 'success'
        });
        this.loadList();
        this.handleClose_();
      });
    },
    handleClose() {
      this.typePopup = false;
      this.rowData = {};
      this.name = '';
      this.sort = '';
    },
    handleClose_() {
      this.thirdTypePopup = false;
      this.rowData = {};
      this.addCategoryParam = [
        {
          enable: 1,
          name: '',
          parentId: '',
          sort: 1,
          level: 3
        }
      ];
      // this.name=''
    },
    categoryRenovation(row) {
      this.editData = row;
      this.showAddOrEdit = true;
    },
    showListPanel() {
      this.showAddOrEdit = false;
    },
    addSubmit(row) {
      let scope = this;
      let param = {
        name: this.name,
        sort: this.sort
      };
      if (param.name == '') {
        this.$message({
          message: '请输入类目名称',
          type: 'warning'
        });
        return false;
      }
      if (param.sort == '') {
        this.$message({
          message: '请输入序号',
          type: 'warning'
        });
        return false;
      }
      let categoryList = [];
      if (this.state == 'add') {
        param.enable = 1;
        param.level = this.rowData && this.rowData.level ? Number(this.rowData.level) + 1 : 1;
        param.parentId = this.rowData && this.rowData.id ? this.rowData.id : 0;
        categoryList.push(param);
        postMethod('/exclusive/category/add', {
          categoryList: categoryList
        }).then(res => {
          this.$message({
            message: '添加成功',
            type: 'success'
          });
          this.loadList();
          scope.handleClose();
        });
      } else if (this.state == 'edit') {
        param.id = this.rowData.id;
        postMethod('/exclusive/category/update', param).then(res => {
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          this.loadList();
          scope.handleClose();
        });
      }
    },
    enable(row) {
      let scope = this;
      getMethod('/exclusive/category/enable', { id: row.id }).then(res => {
        scope.loadList();
        scope.$message({
          message: '启用成功',
          type: 'success'
        });
      });
    },
    disable(row) {
      let scope = this;
      getMethod('/exclusive/category/disable', { id: row.id }).then(res => {
        scope.loadList();
        scope.$message({
          message: '禁用成功',
          type: 'success'
        });
      });
    },
    addType(state, row) {
      if (row && state == 'edit') {
        this.rowData = row;
        this.sort = row.sort;
        this.name = row.name;
      } else if (row && state == 'add') {
        this.rowData = row;
      }
      this.state = state;
      this.typePopup = true;
    },
    thirdType(row) {
      this.rowData = row;
      this.thirdCategorySort = row.goodsCategoryTree && row.goodsCategoryTree.length > 0 ? Number(row.goodsCategoryTree[row.goodsCategoryTree.length - 1].sort) + 1 : '';
      this.addCategoryParam[0].parentId = row.id;
      this.addCategoryParam[0].sort = this.thirdCategorySort;
      this.thirdTypePopup = true;
    },
    search() {
      this.renderComponent = false;
      this.loadList();
    },
    initLoad() {
      this.loadList();
    },
    loadList() {
      let scope = this;
      postMethod('/exclusive/category/list', this.searchParam).then(res => {
        this.renderComponent = true;
        scope.tableData.list = res.data;
        this.$nextTick(function() {
          this.expandableListView(scope.tableData.list);
          this.$forceUpdate();
        });
        // scope.tableData.total = res.data.total;
        // scope.showPagination = scope.tableData.total == 0;
      });
    }
  }
};
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
    line-height: '60px';
    height: '60px';
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

.el-pagination >>> .btn-prev {
  margin: 0 5px 0 0;
  background-color: #f4f4f5;
  color: #606266;
  min-width: 30px;
  border-radius: 2px;
}
</style>
<style lang="scss">
.ly-table-panel {
  .el-table [class*='el-table__row--level'] .el-table__expand-icon {
  width: 40px;
  font-size: 17px !important;
  margin-right: 10px !important;
}
}
</style>
