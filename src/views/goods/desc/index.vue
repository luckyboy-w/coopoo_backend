<template>
  <div>
    <div class="ly-container" v-if="showList">
      <div class="ly-tool-panel">
        <table>
          <tr>
            <td>售后说明名称:</td>
            <td>
              <el-input v-model="searchParam.name" width="180px"></el-input>
            </td>
            <td>
              <el-button icon="el-icon-search" @click="search()">搜索</el-button>
              <el-button plain type="primary" @click="addOrEdit('add')" icon="el-icon-document-add">新建</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table
            ref="mainTable"
            :data="tableData.list"
            style="width: 1260px;margin-bottom: 20px;"
            row-key="id"
            border
            default-expand-all
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <!--            <el-table-column type="selection" width="55"></el-table-column>-->
            <el-table-column prop="id" label="序号" width="150px"></el-table-column>
            <el-table-column prop="name" label="售后说明名称" width="150px"></el-table-column>
            <el-table-column prop="imgUrl" label="图片" width="150px">
              <template slot-scope="scope">
                <el-image
                  style="width: 100px; height: 100px"
                  :src="scope.row.imgUrl"
                  :preview-src-list="[scope.row.imgUrl]">
                </el-image>
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="修改时间" width="150px">
              <template slot-scope="scope">
                {{ scope.row.updateTime | formatDate }}
              </template>
            </el-table-column>

            <el-table-column prop="id" label="操作" width="200px">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="addOrEdit('edit',scope.$index, tableData)"
                  type="text"
                  size="small"
                >编辑
                </el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button
                  @click.native.prevent="deleteRow(scope.row, tableData)"
                  type="text"
                  size="small"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="ly-data-pagination">
          <el-pagination
            background
            v-show="!showPagination"
            layout="prev, pager, next"
            @current-change="currentPage"
            @prev-click="currentPage"
            @next-click="currentPage"
            :page-size="searchParam.pageSize"
            :total="tableData.total"
          ></el-pagination>
        </div>
      </div>
      <div class="list-panel"></div>
    </div>
    <saveOrEdit v-if="showAddOrEdit" @showListPanel="showListPanel" :editData="editData"></saveOrEdit>
  </div>
</template>

<script>
import saveOrEdit from "./saveOrEdit";
import {getMethod, postMethod, putMethod, deleteMethod, formatDate} from "@/api/request";

export default {
  filters: {
    formatDate(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  computed: {},
  mounted() {
    this.initLoad();
  },
  components: {saveOrEdit},
  created() {
  },
  data() {
    return {
      showList: true,
      showAddOrEdit: false,
      showPagination: false,
      editData: {},
      searchParam: {
        name: "",
        pageSize: 10,
        pageNum: 0
      },
      tableData: {
        list: []
      },
      dataList: []
    };
  },
  methods: {
    initLoad() {
      this.loadList();
    },
    search() {
      this.loadList();
    },
    async loadList() {
      const {data} = await getMethod("/backend/goodSalesDesc/list", this.searchParam)
      this.tableData = data;
      this.showPagination = this.tableData.total == 0;
    },
    async deleteRow(rowData, data) {
      try {
        await this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const res = await deleteMethod(`/backend/goodSalesDesc/${rowData.id}`)
        this.loadList();
        this.$message.success("删除成功");

      } catch (e) {
      }
    },
    async addOrEdit(oper, rowIndex, data) {

      if (oper == "edit") {
        const res = await getMethod(`/backend/goodSalesDesc/${data.list[rowIndex].id}`)
        this.editData = res.data;
        this.showList = false;
        this.showAddOrEdit = true;
      } else {
        this.editData = {};
        this.showList = false;
        this.showAddOrEdit = true;
      }
    },
    showListPanel(isCancel) {
      this.showList = true;
      this.showAddOrEdit = false;
      this.loadList();
    },
    currentPage(pageNum) {
      this.searchParam.pageNum = pageNum;
      this.loadList();
    },
    fmtSpecValue(specList) {
      specList = specList || []
      let returnList = [];
      for (let i = 0; i < specList.length; i++) {
        returnList.push(specList[i].skuText);
      }
      return returnList.join(",");
    }
  }
};
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
