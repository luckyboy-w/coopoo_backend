<template>
  <div>
    <div
      v-if="showList"
      class="ly-container"
    >
     <div class="ly-tool-panel" style="display: flex;flex-wrap: wrap;">
       <div class="tabTd">
         <div>门店名称：</div>
         <div>
           <el-input v-model="searchParam.storeName" width="180px" placeholder="请输入" />
         </div>
       </div>
       <div class="tabTd">
         <div>手机号：</div>
         <div>
           <el-input v-model="searchParam.phone" width="180px" placeholder="请输入" />
         </div>
       </div>
       <div class="tabTd">
         <div>状态：</div>
         <div>
          <el-select
            v-model="searchParam.enable"
            placeholder="请选择"
          >
          <el-option label="全部" value="" />
            <el-option label="禁用" value="0" />
            <el-option label="启用" value="1" />
          </el-select>
         </div>
       </div>
      <!-- <div class="tabTd">
         <div>门店状态：</div>
         <div>
         <el-select
           v-model="searchParam.status"
           placeholder="请选择"
         >
           <el-option
             v-for="item in shopStatusList "
             :key="item.id"
             :value-key="item.label"
             :label="item.label"
             :value="item.id"
           />
         </el-select>
         </div>
       </div> -->
       <div class="tabTd">
         <el-button
           icon="el-icon-search"
           @click="search()"
         >
           搜索
         </el-button>
         <el-button
           plain
           type="primary"
           icon="el-icon-document-add"
           @click="addOrEdit('add')"
         >
           新建
         </el-button>
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
            <el-table-column
              prop="storeName"
              label="门店名称"
              width="150px"
            />
            <el-table-column
              prop="userName"
              label="店主姓名"
              width="150px"
            />
            <el-table-column
              prop="phoneNo"
              label="店主手机号"
              width="150px"
            />
            <el-table-column
              prop="loginAccount"
              label="登录账号"
              width="150px"
            />
            <!-- <el-table-column prop="provinceName" label="省份" width="150px"></el-table-column>
            <el-table-column prop="cityName" label="城市" width="150px"></el-table-column> -->
            <el-table-column
              prop="address"
              label="详细地址"
              width="250px"
            />
            <el-table-column
              prop="enable"
              label="状态"
              width="150px"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.enable"
                  inactive-value="0"
                  active-value="1"
                  @change="updateEnable(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              width="170px"
            />
            <el-table-column
              prop="id"
              label="操作"
              width="150px"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click.native.prevent="addOrEdit('edit',scope.$index, tableData)"
                >
                  编辑门店
                </el-button>
                <el-button
                  @click.native.prevent="showResetPwd(scope.row)"
                  type="text"
                  size="small"
                >重置密码
                </el-button>
              <!--  <el-button
                  v-show="false"
                  type="text"
                  size="small"
                  @click.native.prevent="editEmp(scope.row, tableData)"
                >
                  编辑店员
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click.native.prevent="editStoreService(scope.row, tableData)"
                >
                  编辑门店服务
                </el-button> -->
                <!-- <el-button
                  type="text"
                  size="small"
                  @click.native.prevent="downQrcode(scope.row, tableData)"
                >
                  下载二维码
                </el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="ly-data-pagination">
          <el-pagination
            v-show="!showPagination"
            background
            layout="prev, pager, next"
            :total="tableData.total"
            @current-change="currentPage"
            @prev-click="currentPage"
			:current-page="searchParam.pageNum"
            @next-click="currentPage"
          />
        </div>
      </div>
      <div class="list-panel" />
    </div>
    <saveOrEdit
      v-if="showAddOrEdit"
      :edit-data="editData"
      @showListPanel="showListPanel"
    />
  </div>
</template>

<script>
import saveOrEdit from './saveOrEdit'
import { getMethod, postMethod } from '@/api/request'
import {getToken} from '@/utils/auth'

export default {
  components: { saveOrEdit },
  data() {
    return {
      shopStatusList: [],
      enableList: [],
      showList: true,
      showAddOrEdit:false,
      showPagination: false,
      editData: {},
      searchParam: {
        storeName:'',
        phone:'',
        enable:'',
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
      if(row.enable=='0'){
      postMethod('/store/disable-store?id='+row.id).then(res => {
        this.loadList()
        this.$message({
          type: 'success',
          message: '操作成功'
        })
      })
      }else if(row.enable=='1'){
      postMethod('/store/enable-store?id='+row.id).then(res => {
        this.loadList()
        this.$message({
          type: 'success',
          message: '操作成功'
        })
      })
      }
    },
    downQrcode(rowObj){
      window.open( process.env.VUE_APP_BASE_API+'/backend/storeManage/storeQr?id='+rowObj.id+'&storeName='+rowObj.storeName+'&token='+ getToken())
    },
    showResetPwd(row){
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
    search() {
		this.searchParam.pageNum = 1
      this.loadList()
    },
    addOrEdit(oper, rowIndex, data) {
      const scope = this

      if (oper == 'edit') {
        const param = {
          id: data.list[rowIndex].id
        }
        getMethod('/store/get-store-info', param).then(res => {
          scope.editData = res.data
          scope.editData.isDisabled = true
          this.showList = false
          this.showAddOrEdit = true
        })
      } else {
        scope.editData = {}
        this.showList = false
        this.showAddOrEdit = true
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
      getMethod('/store/search-store-list', this.searchParam).then(res => {
        scope.tableData.list = res.data.records
        scope.tableData.list.map(i=>{
          i.enable=String(i.enable)
        })
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
