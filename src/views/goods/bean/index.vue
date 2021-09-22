<template>
  <div>
    <div v-if="showList" :loading="isLoading" class="ly-container">
    <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
      <div class="tabTd">
        <div>商品名称：</div>
        <div>
          <el-input v-model="searchParam.goodsName" placeholder="请输入" width="180px" />
        </div>
      </div>
      <div class="tabTd">
        <el-button icon="el-icon-search" @click="search()">
          搜索
        </el-button>
        <el-button plain="" type="primary" icon="el-icon-circle-plus-outline" @click="save('add')">
          新增
        </el-button>
        <el-button icon="el-icon-date" @click="configuration()">
          活动配置
        </el-button>
      </div>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table ref="mainTable" :loading="isLoading" :data="tableData.records"
                    style="width: 100%; margin-bottom: 20px;" row-key="id"
                    border :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column prop="goodsName" label="商品名称" width="300px"/>
            <el-table-column prop="needBeanQty" label="靠谱豆" width="150px"/>
            <el-table-column prop="createTime" label="创建时间" width="170px"/>
            <el-table-column prop="isSale" label="状态" width="150px">
              <template slot-scope="scope">
                <span v-if="scope.row.isSale == 0">下架</span>
                <span v-if="scope.row.isSale == 1">上架</span>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="操作" width="200px">
              <template slot-scope="scope">
                <el-button type="text" v-if="scope.row.isSale == 1" size="small"
                           @click.native.prevent="downShelve(scope.row.goodsId)"
                >下架
                </el-button>
                <el-button type="text" v-if="scope.row.isSale == 0" size="small"
                           @click.native.prevent="upShelve(scope.row.goodsId)"
                >上架
                </el-button>
                <el-button type="text" v-if="scope.row.isSale == 1"  size="small" @click.native.prevent="save('detail',scope.row.goodsId)">查看</el-button>
                <el-button type="text" v-if="scope.row.isSale == 0" size="small" @click.native.prevent="save('edit',scope.row.goodsId)">修改</el-button>
                <el-button v-if="scope.row.isSale == 0" type="text" size="small" @click.native.prevent="deleteBean(scope.row.goodsId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="ly-data-pagination">
            <el-pagination
              background
              v-show="!showPagination"
              layout="prev, pager, next"
              @current-change="currentPage"
              @prev-click="currentPage"
              @next-click="currentPage"
              :total="tableData.total"
              :page-size="searchParam.pageSize"
              :current-page="searchParam.pageNum"
            />
          </div>
        </div>
      </div>
    </div>

    <save v-if="showAdd" :editData="editData" @showListPanel="showListPanel"/>
    <configuration v-if="showConfiguration" @showListPanel="showListPanel"/>
  </div>
</template>

<script>
import {getMethod,postMethod} from '@/api/request'
import save from "./save";
import configuration from "./configuration";

export default {
  name: "index",
  components: {save, configuration},
  mounted() {
    this.loadList()
  },
  data() {
    return {
      showList: true,
      showAdd: false,
      showPagination: false,
      showConfiguration: false,
      isLoading: false,
      goodsId: null,
      editData: {},
      searchParam: {
        orderColumn: 'create_time',
        orderSeq: 'DESC',
        pageSize: 10,
        pageNum: 1
      },
      tableData: {
        records: [],
        hasNextPage: false,
        hasPreviousPage: false
      }
    }
  },
  methods: {
    search() {
		this.searchParam.pageNum = 1;
      this.loadList()
    },

    loadList() {
      this.loading = true

      getMethod("/bean_goods/list", this.searchParam).then(res => {
        this.loading = false
        if (res.errCode != 0) {
          this.$message({
            message: res.message,
            type: 'warning'
          })
          return;
        }
        this.tableData.records= res.data.records
        this.tableData.total= res.data.total
        this.showPagination = this.tableData.total == 0
      });
    },

    showListPanel() {
      this.showList = true;
      this.showAdd = false
      this.showConfiguration = false
      this.loadList();
    },

    currentPage(pageNum) {
      this.searchParam.pageNum = pageNum;
      this.loadList();
    },
    deleteBean(goodsId){
      this.loading = true
      postMethod(`/bean_goods/delete?id=${goodsId}`).then(res => {
        this.loading = false
        if (res.errCode != 0) {
          this.$message({
            message: res.message,
            type: 'warning'
          })
          return;
        }
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.loadList();
      })
    },
    save(val,goodsId) {
      if (val=='add') {
        this.editData={}
        this.showAdd = true
        this.showList = false;
      } else if(val=="edit"){
        getMethod("/bean_goods/detail?id="+goodsId).then(res => {
          this.editData=res.data
          this.showAdd = true
          this.showList = false;
        });
      }else if(val=="detail"){
        getMethod("/bean_goods/detail?id="+goodsId).then(res => {
          this.editData=res.data
          this.editData.disabled=true
          this.showAdd = true
          this.showList = false;
        });
        }
    },
    configuration() {
      this.showConfiguration = true
      this.showList = false;
    },

    upShelve(goodsId) {
      this.loading = true
      postMethod(`/bean_goods/up_shelves?id=${goodsId}`).then(res => {
        this.loading = false
        if (res.errCode != 0) {
          this.$message({
            message: res.message,
            type: 'warning'
          })
          return;
        }
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.loadList();
      })
    },

    downShelve(goodsId) {
      this.loading = true
        postMethod(`/bean_goods/down_shelves?id=${goodsId}`).then(res => {
        this.loading = false
        if (res.errCode != 0) {
          this.$message({
            message: res.message,
            type: 'warning'
          })
          return;
        }
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.loadList();
      })
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
