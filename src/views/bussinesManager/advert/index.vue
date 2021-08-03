<template>
  <div>
    <div class="ly-container" v-if="showList">
      <div class="ly-tool-panel">
        <table>
          <tr>
            <td>
              <el-button
                plain
                type="primary"
                @click="addOrEdit('add')"
                icon="el-icon-document-add"
              >新建</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table
            ref="mainTable"
            :data="tableData.list"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border
            default-expand-all
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >

            <el-table-column prop="name" label="广告名称" width="150px"></el-table-column>
            <el-table-column label="关联数据" width="220px">
              <template slot-scope="scope">
                <span v-if="scope.row.dataType=='0'">不跳转</span>
                <span v-if="scope.row.dataType==3">商品主题</span>
                <span v-if="scope.row.dataType==2">链接地址</span>
                <span v-if="scope.row.dataType==4">文本编辑器</span>
                <span v-if="scope.row.dataType==5">限时秒杀</span>
                <span v-if="scope.row.dataType==6">大佬说</span>
                <span v-if="scope.row.dataType==7">平台直播</span>
                <span v-if="scope.row.dataType==8">优惠卷</span>
              </template>
            </el-table-column>
            <el-table-column prop="image" label="BANNER图" width="350px">
                <template slot-scope="scope">
                    <img  width="300px" height="180px" :src="scope.row.image" />
                </template>
            </el-table-column>
            <el-table-column prop="location" label="广告位置" width="150px">
              <template slot-scope="scope">
                <span v-if="scope.row.location==1">首页banner</span>
                <span v-if="scope.row.location==2">首页-限时抢购</span>
                <span v-if="scope.row.location==5">首页-靠谱豆商城</span>
                <span v-if="scope.row.location==4">我的-线下门店</span>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="操作" width="200px">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="addOrEdit('edit',scope.$index, tableData)"
                  type="text"
                  size="small"
                >编辑</el-button>

                <el-button
                  @click="enableAdv(scope.row,0)"
                  type="text"
                  size="small"
                  v-if="scope.row.enable == 1"
                >禁用</el-button>

                <el-button
                  @click="enableAdv(scope.row,1)"
                  type="text"
                  size="small"
                  v-if="scope.row.enable != 1"
                >启用</el-button>

                <el-button
                  @click.native.prevent="deleteRow(scope.$index, tableData)"
                  type="text"
                  size="small"
                >删除</el-button>
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
import { getMethod, postMethod } from "@/api/request";

export default {
  computed: {},
  mounted() {
    this.initLoad();
  },
  components: { saveOrEdit },
  created() {},
  data() {
    return {
      advertLocationList: [],
      showList: true,
      showAddOrEdit: false,
      showPagination: false,
      editData: {},
      searchParam: {
        pageSize: 10,
        pageNum: 1
      },
      tableData: {
        list: []
      },
      dataList: []
    };
  },
  methods: {
    deleteRow(rowIndex, data) {
    this.$confirm('是否继续删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        postMethod("/operate/delete-advert?id="+data.list[rowIndex].id).then(res => {
        this.$message({
            message: "删除成功",
            type: "success"
        });
        this.loadList();
    });
    });

    },
    batchDeleteRow(rowIndex, data) {
      let selectList = this.$refs.mainTable.selection;
      let idArr = [];
      for (let i = 0; i < selectList.length; i++) {
        idArr.push(selectList[i].id);
      }
      let param = {
        delType: "2",
        ids: idArr.join(",")
      };
      postMethod("/backend/advert/delete", param).then(res => {
        scope.editData = res.data[0];
        this.showList = false;
        this.showAddOrEdit = true;
        this.$message("删除成功");
      });
      this.searchParam.pageSize = 10;
      this.searchParam.pageNum = 0;
      this.loadList();
    },
    search() {
      this.loadList();
    },
    enableAdv(row,val){
        let scope = this
        if (val==1) {
          postMethod("/operate/enable-advert?id="+row.id).then(res => {
          this.$message({
              message: "操作成功.",
              type: "success"
          });
          scope.loadList()
        });
        } else{
          postMethod("/operate/disable-advert?id="+row.id).then(res => {
            this.$message({
                message: "操作成功.",
                type: "success"
            });
            scope.loadList()
          });
        }

    },
    addOrEdit(oper, rowIndex, data) {
      let scope = this;

      if (oper == "edit") {
        let param = {
          id: data.list[rowIndex].id
        };
        getMethod("/operate/get-advert-info", param).then(res => {
          scope.editData = res.data;
          this.showList = false;
          this.showAddOrEdit = true;
        });
      } else {
        scope.editData = {};
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
    initLoad() {
      this.loadList();
    },
    loadList() {
      let scope = this;
      getMethod("/operate/search-advert-list", this.searchParam).then(res => {
        scope.tableData.list = res.data.records;
        scope.tableData.total = res.data.total;
        for(let i = 0 ; i < scope.tableData.list.length ; i++){
            let rowObj = scope.tableData.list[i];
            rowObj.locationText = this.GLOBAL.advertLocationMap[rowObj.advertLocation]
        }
        scope.showPagination = scope.tableData.total == 0;
      });
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
