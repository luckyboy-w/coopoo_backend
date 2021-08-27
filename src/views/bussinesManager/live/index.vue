<template>
  <div>
    <div v-if="showList" class="list-panel">
      <div style="display: flex;flex-wrap: wrap;">
        <div class="tabTd">
          <div>直播名称：</div>
          <div>
            <el-input v-model="searchParam.liveName " width="180px" placeholder="请输入" clearable />
          </div>
        </div>
        <div class="tabTd">
          <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
        </div>
      </div>
      <table>
        <tr>
          <td>
            <el-button type="primary" @click="homeEdit()">新建直播</el-button>
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <el-table :data="liveList.list" style="width: 100%; margin-bottom: 20px;" row-key="id" border>
              <el-table-column label="直播名称" width="180" prop="liveName"></el-table-column>
              <el-table-column label="直播时间" width="180">
                <template slot-scope="scope">
                  {{ scope.row.liveBegin}} 至 {{ scope.row.liveEnd}}
                </template>
              </el-table-column>
              <el-table-column label="获赞数" width="180" prop="likesCount"></el-table-column>
              <el-table-column label="下单数" width="180" prop="orderCount"></el-table-column>
              <el-table-column label="观看人数" width="180" prop="watchCount"></el-table-column>
              <el-table-column label="创建时间" width="180" prop="createTime"></el-table-column>
              <el-table-column label="操作" width="280">
                <template slot-scope="scope">
                  <el-link v-if="scope.row.isSale=='0'" type="primary" @click="homeEdit(scope.row,1)">编辑</el-link>
                    <el-divider direction="vertical"></el-divider>
                  <el-link v-if="scope.row.isSale=='0'" type="primary" @click="enable(scope.row)">删除</el-link>
                  <el-divider direction="vertical"></el-divider>
                  <el-link  type="primary" @click="homeEdit(scope.row,2)">查看</el-link>
                </template>
              </el-table-column>
            </el-table>
          </td>
        </tr>
        <tr>
          <div class="ly-data-pagination">
            <el-pagination background v-show="!showPagination" layout="prev, pager, next" @current-change="currentPage" :current-page="searchParam.pageNum"
              @prev-click="currentPage" @next-click="currentPage" :total="liveList.total"></el-pagination>
          </div>
        </tr>
      </table>
    </div>
    <liveDetail ref="addOrEditRef" v-if="showHome" :edit-data="editData" @showListPanel="showListPanel" />
  </div>
</template>

<script>
  import liveDetail from './liveDetail'
  import {
    getMethod,
    postMethod
  } from '@/api/request'
  import {
    formatDate
  } from '@/api/tools.js'

  export default {
    components: {
      liveDetail
    },
    data() {
      return {
        editData: {
        },
        searchParam:{
          liveName:'',
          pageNum:1,
          pageSize:10,
        },
        resetFrm: {},
        showList: true,
        showHome: false,
        liveList: {
          list:[]
        },
        testName:'',
        showPagination: false,
      }
    },
    computed: {},
    mounted() {
      this.loadLive()
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
        this.loadLive();
      },
      // 分页
      currentPage(pageNum) {
        this.searchParam.pageNum = pageNum;
        this.loadLive();
      },
      //  上架下架
      enable(row) {
        console.log("888",row)
        let scope = this
        if (row.isSale=="0") {
          getMethod('/goods/theme/on-sale-goods-theme', {goodsThemeId:row.id}).then(res => {
            scope.loadLive()
            this.$message({
              message: "上架成功",
              type: "success"
            });
          });
        } else if(row.isSale=="1"){
        getMethod('/goods/theme/off-sale-goods-theme', {goodsThemeId:row.id}).then(res => {
          scope.loadLive()
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
          });
        } else if(val==2){
          getMethod('/goods/theme/inner-detail', {goodsThemeId:row.id}).then(res => {
            this.editData={}
          this.editData.allData=res.data
          this.editData.operation="detail"
          this.editData.goodsThemeId=row.id
          this.showList = false
          });
        }
      },
      showListPanel(isCancel) {
        this.showList = true
        this.showHome = false
        this.loadLive()
      },
      loadLive() {
        const scope = this
        getMethod('/live/search-live-list', this.searchParam).then(res => {
          scope.liveList.list = res.data.records
          scope.liveList.total=res.data.total
          scope.showPagination = scope.liveList.total == 0;
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
