<template>
  <div>
    <div
      v-if="showList"
      class="ly-container"
    >
      <div class="ly-tool-panel">
        <table>
          <tr>
            <td>门店名称:</td>
            <td>
              <el-input
                v-model="searchParam.storeName"
                width="180px"
              />
            </td>
            <td>状态:</td>
            <td>
              <el-select
                v-model="searchParam.enable"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in enableList "
                  :key="item.id"
                  :value-key="item.label"
                  :label="item.label"
                  :value="item.id"
                />
              </el-select>
            </td>
            <td>门店状态:</td>
            <td>
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
            </td>
            <td>
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
            </td>
          </tr>
        </table>
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
              prop="owerUserName"
              label="店主姓名"
              width="150px"
            />
            <el-table-column
              prop="mobilePhone"
              label="店主手机号"
              width="150px"
            />
            <el-table-column
              prop="empCnt"
              label="店员数"
              width="100px"
            />
            <!-- <el-table-column prop="provinceName" label="省份" width="150px"></el-table-column>
            <el-table-column prop="cityName" label="城市" width="150px"></el-table-column> -->
            <el-table-column
              prop="address"
              label="详细地址"
              width="250px"
            />
            <el-table-column
              prop="statusText"
              label="门店状态"
              width="100px"
            />
            <el-table-column
              prop="enable"
              label="是否启用"
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
              prop="id"
              label="操作"
              width="360px"
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
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click.native.prevent="downQrcode(scope.row, tableData)"
                >
                  下载二维码
                </el-button>
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
    <empIndex
      v-if="showEditEmp"
      :store-data="storeData"
      @backToStoreIndex="backToStoreIndex"
    />
    <addStoreService
      v-if="showStoreService"
      :store-data="storeData"
      @backToStoreIndex="backToStoreIndex"
    />
  </div>
</template>

<script>
import saveOrEdit from './saveOrEdit'
import addStoreService from './addStoreService'
import empIndex from './emp/index'
import { getMethod, postMethod } from '@/api/request'
import {getToken} from '@/utils/auth'

export default {
  components: { saveOrEdit, empIndex, addStoreService },
  data() {
    return {
      storeData: {},
      shopStatusList: [],
      enableList: [],
      showList: true,
      showAddOrEdit: false,
      showEditEmp: false,
      showStoreService: false,
      showPagination: false,
      editData: {},
      searchParam: {
        typeName: '',
        pageSize: 10,
        pageNum: 0
      },
      tableData: {
        list: []
      },
      dataList: []
    }
  },
  computed: {},
  mounted() {
    this.initLoad()

    this.shopStatusList.push({
      label: '全部'
    })

    this.enableList.push({
      label: '全部'
    })

    this.shopStatusList = this.shopStatusList.concat(
      this.GLOBAL.shopStatusList
    )
    this.enableList = this.enableList.concat(this.GLOBAL.enableList)
  },
  created() {},
  methods: {
    updateEnable(rowObj) {
      const param = {
        id: rowObj.id,
        enable: rowObj.enable
      }
      postMethod('/backend/storeManage/updateEnable', param).then(res => {})
    },
    downQrcode(rowObj){
      window.open( process.env.VUE_APP_BASE_API+'/backend/storeManage/storeQr?id='+rowObj.id+'&storeName='+rowObj.storeName+'&token='+ getToken())
    },
    deleteRow(rowIndex, data) {
      const param = {
        id: data.list[rowIndex].id
      }
      this.$confirm('是否继续删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postMethod('/backend/storeManage/delete', param).then(res => {
          this.loadList()
          this.$message('删除成功')
        })
      })
    },
    batchDeleteRow(rowIndex, data) {
      const selectList = this.$refs.mainTable.selection
      const idArr = []
      for (let i = 0; i < selectList.length; i++) {
        idArr.push(selectList[i].id)
      }
      const param = {
        delType: '2',
        ids: idArr.join(',')
      }
      postMethod('/backend/storeManage/delete', param).then(res => {
        scope.editData = res.data[0]
        this.showList = false
        this.showAddOrEdit = true
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      })
      this.searchParam.pageSize = 10
      this.searchParam.pageNum = 0
      this.loadList()
    },
    search() {
      this.loadList()
    },
    addOrEdit(oper, rowIndex, data) {
      const scope = this

      if (oper == 'edit') {
        const param = {
          id: data.list[rowIndex].id
        }
        getMethod('/backend/storeManage/findObject', param).then(res => {
          scope.editData = res.data[0]
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
    backToStoreIndex() {
      this.showList = true
      this.showEditEmp = false
      this.showStoreService = false
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
      getMethod('/backend/storeManage/findPage', this.searchParam).then(res => {
        scope.tableData = res.data
        const dataList = scope.tableData.list
        for (let i = 0; i < dataList.length; i++) {
          dataList[i].statusText = this.GLOBAL.shopStatusMap[
            dataList[i].status
          ]
        }
        scope.showPagination = scope.tableData.total == 0
      })
    },
    editEmp(rowData, tableData) {
      this.storeData = rowData
      this.showList = false
      this.showEditEmp = true
    },
    editStoreService(rowData, tableData) {
      this.storeData = rowData
      this.showList = false
      this.showStoreService = true
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
