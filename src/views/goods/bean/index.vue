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
              <el-button icon="el-icon-search" @click="addOrEdit('add')">
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
          <el-table ref="mainTable" :data="tableData.list" style="width: 100%; margin-bottom: 20px;" row-key="id"
                    border :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
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

              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <saveOrEdit v-if="showAddOrEdit" :edit-data="editData" :oper="oper" @showListPanel="showListPanel"/>
    <configuration v-if="showConfiguration" @showListPanel="showListPanel"/>
  </div>
</template>

<script>
    import { getMethod, postMethod, getUploadUrl } from '@/api/request-new'
    import saveOrEdit from "./saveOrEdit";
    import configuration from "./configuration";

    export default {
      name: "index",
      components: { saveOrEdit, configuration },
      mounted() {
        this.loadList()
      },
      data() {
        return {
          showList: true,
          showAddOrEdit: false,
          showConfiguration: false,
          isLoading: false,
          oper: '',
          editData: {},
          searchParam: {

          },
          tableData: {
            list: []
          }
        }
      },
      methods: {
        search() {

        },

        loadList() {
          getMethod("/exchange_goods/list", this.searchParam).then(res => {
              console.info(res)
          });
        },

        showListPanel() {
          this.showList = true;
          this.showAddOrEdit = false
          this.showConfiguration = false
          this.loadList();
        },

        addOrEdit(oper, changeGoodsId) {
          this.oper = oper
          this.showAddOrEdit = true
          this.showList = false;
        },

        configuration() {
          this.showConfiguration = true
          this.showList = false;
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
