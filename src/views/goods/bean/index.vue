<template>
  <div>
    <div v-if="showList" :loading="isLoading" class="ly-container">
      <div class="ly-tool-panel">
        <table>
          <tr>
            <td>商品名称:</td>
            <td>
              <el-input v-model="searchParam.goodsName" width="180px"/>
            </td>
            <td>
              <el-button icon="el-icon-search" @click="search()">
                搜索
              </el-button>
            </td>
            <td>
              <el-button icon="el-icon-search" @click="save()">
                新增
              </el-button>
            </td>
            <td>
              <el-button icon="el-icon-search" @click="configuration()">
                活动配置
              </el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table ref="mainTable" :loading="isLoading" :data="tableData.records"
                    style="width: 100%; margin-bottom: 20px;" row-key="id"
                    border :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column prop="goodsName" label="商品名称" width="300px"/>
            <el-table-column prop="needBeanQty" label="靠谱豆" width="150px"/>
            <el-table-column prop="createTime" label="创建时间" width="150px"/>
            <el-table-column prop="isSale" label="状态" width="150px">
              <template slot-scope="scope">
                <span v-if="scope.row.isSale == 0">下架</span>
                <span v-if="scope.row.isSale == 1">上架</span>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="操作" width="200px">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click.native.prevent="present(scope.row.goodsId)">查看</el-button>
                <el-button type="text" size="small" @click.native.prevent="update(scope.row.goodsId)">修改</el-button>
                <el-button type="text" v-if="scope.row.isSale == 1" size="small"
                           @click.native.prevent="downShelve(scope.row.goodsId)"
                >下架
                </el-button>
                <el-button type="text" v-if="scope.row.isSale == 0" size="small"
                           @click.native.prevent="upShelve(scope.row.goodsId)"
                >上架
                </el-button>
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
              :page-size="this.searchParam.pageSize"
              :current-page="this.searchParam.pageNum"
            />
          </div>
        </div>
      </div>
    </div>

    <save v-if="showAdd" @showListPanel="showListPanel"/>
    <update v-if="showUpdate" :goodsId="goodsId" @showListPanel="showListPanel"/>
    <present v-if="showPresent" :goodsId="goodsId" @showListPanel="showListPanel"/>
    <configuration v-if="showConfiguration" @showListPanel="showListPanel"/>
  </div>
</template>

<script>
import {getMethod, putMethod} from '@/api/request-new'
import save from "./save";
import update from "./update";
import present from "./present";
import configuration from "./configuration";

export default {
  name: "index",
  components: {save, update, present, configuration},
  mounted() {
    this.loadList()
  },
  data() {
    return {
      showList: true,
      showAdd: false,
      showUpdate: false,
      showPresent: false,
      showPagination: false,
      showConfiguration: false,
      isLoading: false,
      goodsId: null,
      editData: {},
      searchParam: {
        orderColumn: 'create_time',
        orderSeq: 'DESC',
        pageSize: 10,
        pageNum: 0
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
      this.loadList()
    },

    loadList() {
      this.loading = true

      getMethod("/exchange_goods/list", this.searchParam).then(res => {
        this.loading = false
        if (res.code != 200) {
          this.$message({
            message: res.message,
            type: 'warning'
          })
          return;
        }
        this.tableData = res.data
        this.showPagination = this.tableData.total == 0
      });
    },

    showListPanel() {
      this.showList = true;
      this.showAdd = false
      this.showUpdate = false
      this.showPresent = false
      this.showConfiguration = false
      this.loadList();
    },

    currentPage(pageNum) {
      this.searchParam.pageNum = pageNum;
      this.loadList();
    },

    save() {
      this.showAdd = true
      this.showList = false;
    },

    update(goodsId) {
      this.showList = false;
      this.showUpdate = true;
      this.goodsId = goodsId
    },

    present(goodsId) {
      this.showList = false;
      this.showPresent = true;
      this.goodsId = goodsId
    },

    configuration() {
      this.showConfiguration = true
      this.showList = false;
    },

    upShelve(goodsId) {
      this.loading = true
      putMethod('/exchange_goods//up_shelves', {'id': goodsId}).then(res => {
        this.loading = false
        if (res.code != 200) {
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
      putMethod('/exchange_goods/down_shelves', {'id': goodsId}).then(res => {
        this.loading = false
        if (res.code != 200) {
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
