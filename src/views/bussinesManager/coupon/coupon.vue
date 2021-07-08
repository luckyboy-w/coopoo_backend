<template>
  <div>
    <div v-if="showList" class="ly-container">
      <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
        <div class="tabTd">
          <div>优惠券名称：</div>
          <div>
            <el-input v-model="searchParam.couponName" width="180px" placeholder="请输入" />
          </div>
        </div>
        <div class="tabTd">
          <div>状态：</div>
          <div>
            <el-select v-model="searchParam.isSale" placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option label="已上架" value="1" />
              <el-option label="未上架" value="0" />
            </el-select>
          </div>
        </div>
        <div class="tabTd">
          <el-button icon="el-icon-search" @click="search()">
            搜索
          </el-button>
          <el-button plain type="primary" icon="el-icon-document-add" @click="addOrEdit('add')">
            新增
          </el-button>
        </div>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table ref="mainTable" :data="tableData.list" style="width: 100%; margin-bottom: 20px;" row-key="id" border
            default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column prop="couponName" label="优惠券名称" width="150px" />
            <el-table-column prop="buyPrice" label="价格" width="150px" />
            <el-table-column prop="totalSales" label="销量" width="150px" />>
            <el-table-column prop="isSale" label="状态" width="150px">
              <template slot-scope="scope">
                <span v-if="scope.row.isSale==0">未上架</span>
                <span v-if="scope.row.isSale==1">已上架</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="170px" />
            <el-table-column prop="id" label="操作" width="150px">
              <template slot-scope="scope">
                <el-button v-if="scope.row.isSale==0" type="text" size="small" @click.native.prevent="addOrEdit('edit',scope.$index, tableData)">
                  编辑
                </el-button>
                <el-button v-if="scope.row.isSale==1" type="text" size="small" @click.native.prevent="addOrEdit('detail',scope.$index, tableData)">
                  查看
                </el-button>
                <el-button v-if="scope.row.isSale==0" type="text" size="small" @click.native.prevent="updateEnable(scope.row)">
                  上架
                </el-button>
                <el-button v-if="scope.row.isSale==1" type="text" size="small" @click.native.prevent="updateEnable(scope.row)">
                  下架
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="ly-data-pagination">
          <el-pagination v-show="!showPagination" background layout="prev, pager, next" :total="tableData.total"
            @current-change="currentPage" @prev-click="currentPage" @next-click="currentPage" />
        </div>
      </div>
      <div class="list-panel" />
    </div>
    <saveOrEdit v-if="showAddOrEdit" :edit-data="editData" @showListPanel="showListPanel" />
  </div>
</template>

<script>
  import saveOrEdit from './saveOrEdit'
  import {
    getMethod,
    postMethod
  } from '@/api/request'
  import {
    getToken
  } from '@/utils/auth'

  export default {
    components: {
      saveOrEdit
    },
    data() {
      return {
        shopStatusList: [],
        enableList: [],
        showList: true,
        showAddOrEdit: false,
        showPagination: false,
        editData: {},
        searchParam: {
          storeName: '',
          phone: '',
          enable: '',
          pageSize: 10,
          pageNum: 1
        },
        tableData: {
          list: []
        },
      }
    },
    computed: {},
    mounted() {
      this.initLoad()
    },
    created() {},
    methods: {
      updateEnable(row) {
        console.log(row.isSale)
        if (row.isSale == '1') {
          postMethod('/coupon/down-shelves',{id:row.id}).then(res => {
            this.loadList()
            this.$message({
              type: 'success',
              message: '操作成功'
            })
          })
        } else if (row.isSale == '0') {
          postMethod('/coupon/up-shelves',{id:row.id}).then(res => {
            this.loadList()
            this.$message({
              type: 'success',
              message: '操作成功'
            })
          })
        }
      },
      downQrcode(rowObj) {
        window.open(process.env.VUE_APP_BASE_API + '/backend/storeManage/storeQr?id=' + rowObj.id + '&storeName=' +
          rowObj.storeName + '&token=' + getToken())
      },
      search() {
        this.loadList()
      },
      addOrEdit(oper, rowIndex, data) {
        const scope = this
        if (oper=='add') {
         scope.editData = {}
         this.showList = false
         this.showAddOrEdit = true
        } else if(oper=="edit"){
          let param = {
            id: data.list[rowIndex].id
          }
          getMethod('/coupon/get-coupon-info', param).then(res => {
            scope.editData = res.data
            this.showList = false
            this.showAddOrEdit = true
          })
        }else if(oper=="detail"){
          let param = {
            id: data.list[rowIndex].id
          }
          getMethod('/coupon/get-coupon-info', param).then(res => {
            scope.editData = res.data
            this.editData.disabled=true
            this.showList = false
            this.showAddOrEdit = true
          })
          }
      },
      showListPanel(isCancel) {
        this.showList = true
        this.showAddOrEdit = false
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
        const scope = this
        getMethod('/coupon/search-coupon-list', this.searchParam).then(res => {
          scope.tableData.list = res.data.records
          scope.tableData.total = res.data.total
          scope.showPagination = scope.tableData.total == 0
        })
      },
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
