<template>
  <div v-loading="loading">
    <div v-if="!isEdit" style="display: flex;align-items: center;margin:0 0 10px 10px;">
      角色名称：
      <div>
        <el-input placeholder="请输入" v-model="testName" clearable />
      </div>
      <div style="margin-left: 20px;">
        <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
      </div>
    </div>
    <table>
      <tr>
        <td>
          <el-button @click="addRole()" type="primary" v-if="!isEdit">新增角色</el-button>
          <el-button @click="saveMenuRole()" type="primary" v-if="isEdit">{{saveOrEdit}}</el-button>
          <el-button @click="backToList()" plain icon="el-icon-back" v-if="isEdit">返回列表</el-button>
        </td>
        <td>
        </td>
      </tr>
      <tr v-if="!isEdit">
        <td colspan="2">
          <el-table :data="roleData" style="width: 100%;margin-bottom: 20px;" :row-key="id" border default-expand-all>
            <el-table-column prop="roleName" label="角色名称" width="230" />
            <el-table-column prop="roleDesc" label="备注信息" width="230" />
            <el-table-column label="创建时间" width="230" prop="createTime">
              <template slot-scope="scope">
                {{scope.row.createTime |_formatDate}}
              </template>
            </el-table-column>
            <el-table-column prop="oper" label="操作" width="480">
              <template slot-scope="scope">
                <el-link type="primary" @click="editRole(scope.row)">编辑</el-link>
                <el-divider direction="vertical"></el-divider>
                <el-link type="primary" @click="deleteRole(scope.row)">删除</el-link>
              </template>
            </el-table-column>
          </el-table>
        </td>
      </tr>
      <tr v-if="isEdit">
        <td colspan="2">
          <el-form label-width="80px">
            <el-form-item label="角色名称">
              <el-input v-model="roleName">
              </el-input>
            </el-form-item>
            <el-form-item label="备注信息">
              <el-input type="textarea" :rows="2" v-model="roleDesc">
              </el-input>
            </el-form-item>
            <el-form-item label="权限分配">
              <el-table :data="roleMenuData" style="width: 100%;margin-bottom: 20px;" :row-key="id" border
                default-expand-all>
                <el-table-column prop="name" label="模块名称" width="230" />
                <el-table-column prop="access" label="访问权限" width="100">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.isSelect" active-value="1" inactive-value="0" active-color="#13ce66"
                      inactive-color="#ff4949" @change="changeAccess($event,scope.row)" />
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
        </td>
      </tr>
    </table>

  </div>
</template>

<script>
  import {
    getMethod,
    postMethod
  } from '@/api/request'
  import {
    treeChildToList
  } from '@/utils/util'
  import {
    formatDate
  } from '@/api/tools.js'
  export default {
    data() {
      return {
        testName: '',
        loading: false,
        id: 'id',
        isEdit: false,
        checked: false,
        rid: '',
        roleDesc: '',
        roleName: '',
        saveOrEdit: '保存',
        roleData: [],
        roleValue: '',
        newRoleName: '',
        roleMenuData: [],
        existRoleMenuId: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    computed: {},
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
    mounted() {
      this.loadRole()
    },
    created() {},
    methods: {
      // 条件查询
      search() {
        let that = this
        console.log(that.testName)
      },
      // 删除角色
      deleteRole(row){
        console.log(row)
      },
      backToList() {
        this.isEdit = false
        this.loadRole()
      },
      editRole(row) {
        const scope = this
        scope.roleName = row.roleName
        scope.roleDesc = row.roleDesc
        const param = {
          id: row.id
        }
        this.rid = row.id
        getMethod('/backend/menu/getMenuByRole', param).then(res => {
          scope.roleMenuData = res.data
          this.isEdit = true
        })
      },
      loadRole() {
        const scope = this
        getMethod('/backend/role/getRole', '').then(res => {
          scope.roleData = res.data
        })
      },
      changeAccess(val, row) {

        if (row.parentId != '-1') {
          if (val == 1) {
            //如果是非一級菜單被打開
            for (let rowIndex in this.roleMenuData) {
              if (this.roleMenuData[rowIndex].id == row.parentId) {
                this.roleMenuData[rowIndex].isSelect = val
                break;
              }
            }
          } else {

            let parentNode = null;
            //如果是非一級菜單被打開
            for (let rowIndex in this.roleMenuData) {
              if (this.roleMenuData[rowIndex].id == row.parentId) {
                //找到父节点,跳出去
                parentNode = this.roleMenuData[rowIndex]
                break;
              }
            }
            let unSelectCount = false;
            for (let rowIndex in parentNode.children) {
              if (parentNode.children[rowIndex].isSelect == '1') {
                unSelectCount = true
                break
              }
            }
            parentNode.isSelect = unSelectCount ? '1' : '0';
          }

        } else {
          //如果是非一級菜單被打開
          for (let childObj in row.children) {
            row.children[childObj].isSelect = val;
          }
        }
      },
      evalAccess(tree) {
        for (let i = 0; i < this.roleMenuData.length; i++) {
          const menuObj = this.roleMenuData[i]
          if (menuObj.children.length == 0) {
            if (this.existRoleMenuId.indexOf(menuObj.id) != -1) {
              menuObj.access = true
            }
          } else {
            this.evalAccess(menuObj.children)
          }
        }
      },
      saveMenuRole() {
        let scope = this
        const selectMenu = []
        const childList = []
        treeChildToList(this.roleMenuData, childList)
        for (let i = 0; i < childList.length; i++) {
          if (childList[i].isSelect == '1') {
            selectMenu.push(childList[i].id)
          }
        }

        for (let i = 0; i < this.roleMenuData.length; i++) {
          if (this.roleMenuData[i].isSelect == '1') {
            selectMenu.push(this.roleMenuData[i].id)
          }
        }
        if (this.roleName == '') {
          this.$message({
            type: 'warning',
            message: '请输入角色名称!'
          })
          return false;
        }
        const param = {
          mids: selectMenu.join(','),
          roleName: this.roleName,
          roleDesc: this.roleDesc,
          roleId: this.rid
        }
        if (param.roleId == '') delete param.roleId
        scope.loading = true
        postMethod('/backend/role/saveRoleMenu', param).then(res => {
          scope.loading = false
          scope.isEdit = false
          scope.loadRole()
          this.$message({
            type: 'success',
            message: '保存成功!'
          })

        })
      },
      addRole() {
        let scope = this;
        this.isEdit = true
        scope.roleDesc = ''
        scope.roleName = ''
        scope.rid = ''
        getMethod('/backend/menu/getMenu', {
          roleId: -1
        }).then(res => {
          scope.roleMenuData = res.data
          scope.loadRole()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .permission-title {
    float: left;
  }

  .permission-detail {
    float: left;
  }
</style>
