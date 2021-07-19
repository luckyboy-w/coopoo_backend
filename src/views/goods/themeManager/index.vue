<template>
  <div>
    <div v-if="showList" class="list-panel">
      <div style="display: flex;flex-wrap: wrap;">
        <div class="tabTd">
          <div>主题名称：</div>
          <div>
            <el-input v-model="searchParam.themeName" width="180px" placeholder="请输入" clearable />
          </div>
        </div>
        <div class="tabTd">
          <div>主题状态：</div>
          <div>
            <el-select v-model="searchParam.isSale" placeholder="请选择主题状态">
              <el-option label="已上架" :value="1" />
              <el-option label="未上架" :value="0" />
            </el-select>
          </div>
        </div>
        <div class="tabTd">
          <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
        </div>
      </div>
      <table>
        <tr>
          <td>
            <el-button type="primary" @click="homeEdit()">新增主题</el-button>
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <el-table :data="themeList.list" style="width: 100%; margin-bottom: 20px;" row-key="id" border>
              <el-table-column label="主题名称" width="180" prop="themeName"></el-table-column>
              <el-table-column label="主题状态" width="180" prop="isSale">
                <template slot-scope="scope">
                  {{scope.row.isSale=="1"?"已上架":"未上架"}}
                </template>
              </el-table-column>
              <el-table-column label="创建时间" width="180" prop="createTime"></el-table-column>
              <el-table-column label="操作" width="280">
                <template slot-scope="scope">
                <el-link v-if="scope.row.isSale=='0'" type="primary" @click="enable(scope.row)">上架</el-link>
                <el-link v-else type="primary" @click="enable(scope.row)">下架</el-link>
                    <el-divider direction="vertical"></el-divider>
                  <el-link v-if="scope.row.isSale=='0'" type="primary" @click="homeEdit(scope.row,1)">首页编辑</el-link>
                  <el-link v-else type="primary" @click="homeEdit(scope.row,2)">首页详情</el-link>
                      <el-divider direction="vertical"></el-divider>
                  <el-link v-if="scope.row.isSale=='0'" type="primary" @click="insideEdit(scope.row,1)">内页编辑</el-link>
                  <el-link v-else type="primary" @click="insideEdit(scope.row,2)">内页详情</el-link>
                </template>
              </el-table-column>
            </el-table>
          </td>
        </tr>
        <tr>
          <div class="ly-data-pagination">
            <el-pagination background v-show="!showPagination" layout="prev, pager, next" @current-change="currentPage" :current-page="searchParam.pageNum"
              @prev-click="currentPage" @next-click="currentPage" :total="themeList.total"></el-pagination>
          </div>
        </tr>
      </table>
    </div>
    <homeSaveOrEdit ref="addOrEditRef" v-if="showHome" :edit-data="editData" @showListPanel="showListPanel" />
    <insideSaveOrEdit ref="addOrEditRef" v-if="showInside" :edit-data="editData" @showListPanel="showListPanel" />
  </div>
</template>

<script>
  import homeSaveOrEdit from './homeSaveOrEdit'
  import insideSaveOrEdit from './insideSaveOrEdit'
  import {
    getMethod,
    postMethod
  } from '@/api/request'
  import {
    formatDate
  } from '@/api/tools.js'

  export default {
    components: {
      homeSaveOrEdit,
      insideSaveOrEdit
    },
    data() {
      return {
        editData: {
          test:111
        },
        searchParam:{
          pageNum:1,
          pageSize:10,
        },
        resetFrm: {},
        showList: true,
        showHome: false,
        showInside: false,
        themeList: {
          list:[]
        },
        testName:'',
        showPagination: false,
      }
    },
    computed: {},
    mounted() {
      this.loadTheme()
    },
    filters: {
      _formatDate(time) {
        if (time == '' ||
          time == undefined) {
          return ''
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    created() {},
    methods: {
      // 条件查询
      search(){
        this.searchParam.pageNum=1
        this.loadTheme();
      },
      // 分页
      currentPage(pageNum) {
        this.searchParam.pageNum = pageNum;
        this.loadTheme();
      },
      //  上架下架
      enable(row) {
        console.log("888",row)
        let scope = this
        if (row.isSale=="0") {
          getMethod('/goods/theme/on-sale-goods-theme', {goodsThemeId:row.id}).then(res => {
            scope.loadTheme()
            this.$message({
              message: "上架成功",
              type: "success"
            });
          });
        } else if(row.isSale=="1"){
        getMethod('/goods/theme/off-sale-goods-theme', {goodsThemeId:row.id}).then(res => {
          scope.loadTheme()
          this.$message({
            message: "下架成功",
            type: "success"
          });
        });
        }
      },

      // 首页编辑和详情
      homeEdit(row,val){
        console.log(row,val,'列表参数')
        if (val==1) {
          getMethod('/goods/theme/outer-detail', {goodsThemeId:row.id}).then(res => {
            
          this.editData=res.data
          this.editData.operation="edit"
          this.showHome=true
          });
        } else if(val==2){
          getMethod('/goods/theme/outer-detail', {goodsThemeId:row.id}).then(res => {
          this.editData=res.data
          this.editData.operation="detail"
          this.showHome=true
          });
        }else if(!val){
          this.editData={}
          this.editData.operation="add"
          this.showHome=true
        }
        this.showList = false
      },
      // 内页编辑和详情
      insideEdit(row,val){
        console.log(row,val,'列表参数')
        if (val==1) {
          getMethod('/goods/theme/inner-detail', {goodsThemeId:row.id}).then(res => {
            this.editData={}
          this.editData.allData=res.data
          this.editData.operation="edit"
          this.editData.goodsThemeId=row.id
          this.showList = false
          this.showInside=true
          });
        } else if(val==2){
          getMethod('/goods/theme/inner-detail', {goodsThemeId:row.id}).then(res => {
            this.editData={}
          this.editData.allData=res.data
          this.editData.operation="detail"
          this.editData.goodsThemeId=row.id
          this.showList = false
          this.showInside=true
          });
        }
      },
      showListPanel(isCancel) {
        this.showList = true
        this.showHome = false
        this.showInside = false
        this.loadTheme()
      },
      loadTheme() {
        const scope = this
        postMethod('/goods/theme/list', this.searchParam).then(res => {
          scope.themeList.list = res.data.records
          scope.themeList.total=res.data.total
          scope.showPagination = scope.themeList.total == 0;
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .list-panel {
    padding: 30px 20px
  }
  .tabTd {
    display: flex;
    flex-wrap: nowrap;
    margin: 7px 10px;
    align-items: center;

  }
  .el-dialog {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .el-dialog .el-dialog__body {
    flex: 1;
    overflow: auto;
  }
</style>
