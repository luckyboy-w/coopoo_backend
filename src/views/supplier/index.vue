<template>
  <div>
    <div class="ly-container" v-if="showList">
      <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
        <div class="tabTd">
          <div>供应商名称：</div>
          <div>
            <el-input v-model="searchParam.supplierName" width="180px" placeholder="请输入" />
          </div>
        </div>
        <div class="tabTd">
          <div>供应商编号：</div>
          <div>
            <el-input v-model="searchParam.supplierNo" width="180px" placeholder="请输入" />
          </div>
        </div>
        <div class="tabTd">
          <div>联系人：</div>
          <div>
            <el-input v-model="searchParam.userName" width="180px" placeholder="请输入" />
          </div>
        </div>
        <div class="tabTd">
          <el-button icon="el-icon-search" @click="search()">搜索</el-button>
          <el-button plain type="primary" @click="addOrEdit('add')" icon="el-icon-document-add">新建</el-button>
          <!-- <el-button plain type="normal" @click="exportData()" icon="el-icon-download">导出</el-button> -->
        </div>
      </div>
      <div class="ly-table-panel">
        <div class="ly-data-list">
          <el-table
            ref="mainTable"
            :data="tableData.list"
            style="width: 100%; margin-bottom: 20px;"
            row-key="id"
            border
            default-expand-all
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column prop="supplierName" label="供应商名称" width="150px"></el-table-column>
            <el-table-column prop="supplierNo" label="供应商编号" width="150px"></el-table-column>
            <el-table-column prop="loginAccount" label="登陆账号" width="150px"></el-table-column>
            <el-table-column prop="userName" label="联系人" width="150px"></el-table-column>
            <el-table-column prop="phoneNo" label="手机号" width="150px"></el-table-column>
            <el-table-column prop="enable" label="状态" width="150px">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.enable"
                  inactive-value="0"
                  active-value="1"
                  @change="enableSupply(scope.row)"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="160px"></el-table-column>

            <el-table-column prop="id" label="操作" width="200px">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="addOrEdit('edit',scope.$index, tableData)"
                  type="text"
                  size="small"
                >编辑
                </el-button>
                <el-button
                  @click.native.prevent="showResetPwd(scope.row)"
                  type="text"
                  size="small"
                >重置密码
                </el-button>
               <!-- <el-button
                  @click.native.prevent="deleteRow(scope.$index, tableData)"
                  type="text"
                  size="small"
                >删除
                </el-button> -->
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
    <el-dialog :visible="showReset" @close="showReset=false" v-if="showReset" title="密码重置" width="600px">
      <el-form ref="dataForm" :model="resetFrm" label-width="100px" style="width:500px">
        <el-form-item label="登录账号">
          <el-input v-model="resetFrm.loginName" disabled/>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="resetFrm.newPwd" placeholder="请输入密码" show-password clearable/>
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input v-model="resetFrm.reppwd" placeholder show-password clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitReset()">提交</el-button>
          <el-button @click="showReset = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <saveOrEdit v-if="showAddOrEdit" @showListPanel="showListPanel" :editData="editData"></saveOrEdit>
  </div>
</template>

<script>
import saveOrEdit from "./saveOrEdit";
import {getMethod, postMethod} from "@/api/request";
import {getToken} from '@/utils/auth'

export default {
  computed: {},
  mounted() {
    this.initLoad();
  },
  components: {saveOrEdit},
  created() {
  },
  data() {
    return {
      showReset: false,
      goodTypeList: [],
      goodBrandList: [],
      provinceList: [],
      showList: true,
      showAddOrEdit: false,
      showPagination: false,
      editData: {},
      searchParam: {
        supplierNo: '',
        supplierName: "",
        userName: "",
        pageSize: 10,
        pageNum: 1
      },
      resetFrm: {
        id:'',
        loginName: '',
        newPwd: ''
      },
      tableData: {
        list: []
      },
      dataList: []
    };
  },
  methods: {
    exportData() {
      let exportParam = [];
      for (let key in this.searchParam) {
        exportParam.push(key + "=" + this.searchParam[key]);
      }
      exportParam.push("token=" + getToken())
      window.open(process.env.VUE_APP_BASE_API + "/backend/supplier/export?" + exportParam.join("&"));
    },
    showResetPwd(row) {
      // this.resetFrm.id=row.id
      // this.resetFrm.loginName = row.loginAccount
      // this.showReset = true;
      console.log('row',row);
      let param = {
        id:row.superAccount,
        newPwd:'123456'
      }
      this.$confirm('是否重置密码为‘123456’?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postMethod('/permission/change-password', param).then(res => {
          this.$message({
            type: 'success',
            message: '密码重置成功'
          })
        })
      })
    },
    submitReset() {
      if (this.resetFrm.newPwd != this.resetFrm.reppwd) {
        this.$message({
          type: 'warning',
          message: '俩次输入的密码不一样'
        })
        return;
      }
      console.log(this.resetFrm);
      delete this.resetFrm.loginName
      delete this.resetFrm.reppwd
      postMethod('/permission/change-password', this.resetFrm).then(res => {
        this.showReset = false;
        this.$message({
          type: 'success',
          message: '密码重置成功'
        })
      })
    },
    enableSupply(row) {
      console.log(row.enable)
      if(row.enable=='0'){
      postMethod('/supplier/disable-supplier?id='+row.id).then(res => {
        this.loadList()
        this.$message({
          type: 'success',
          message: '操作成功'
        })
      })
      }else if(row.enable=='1'){
      postMethod('/supplier/enable-supplier?id='+row.id).then(res => {
        this.loadList()
        this.$message({
          type: 'success',
          message: '操作成功'
        })
      })
      }
    },
    // deleteRow(rowIndex, data) {
    //   let param = {
    //     id: data.list[rowIndex].id
    //   };
    //   this.$confirm("是否继续删除操作?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   }).then(() => {
    //     postMethod("/backend/supplier/delete", param).then(res => {
    //       this.loadList();
    //       this.$message("删除成功");
    //     });
    //   });
    // },
    search() {
		this.searchParam.pageNum = 1;
      this.loadList();
    },
    addOrEdit(oper, rowIndex, data) {
      let scope = this;

      if (oper == "edit") {
        let param = {
          id: data.list[rowIndex].id
        };
        getMethod("/supplier/get-supplier-info", param).then(res => {
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
      getMethod("/supplier/search-supplier-list", this.searchParam).then(
        res => {
          scope.tableData.list = res.data.records;
          scope.tableData.list.map(i=>{
            i.enable=String(i.enable)
          })
          scope.tableData.total = res.data.total;
          scope.showPagination = scope.tableData.total == 0;
        }
      );
    }
  }
};
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
