<template>
  <div class="app-container">
  <div v-loading="loading">
    <div v-if="!isEdit" style="display: flex;align-items: center;margin:0 0 10px 10px;">
      角色名称：
      <div>
        <el-input placeholder="请输入" v-model="searchParam.name" clearable />
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
          <el-table :data="roleData.list" style="width: 100%;margin-bottom: 20px;" :row-key="id" border default-expand-all>
            <el-table-column prop="name" label="角色名称" width="230" />
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
      <tr v-if="!isEdit">
        <div class="ly-data-pagination">
          <el-pagination background v-show="!showPagination" layout="prev, pager, next" @current-change="currentPage" :current-page="searchParam.pageNum"
            @prev-click="currentPage" @next-click="currentPage" :total="roleData.total"></el-pagination>
        </div>
      </tr>
      <tr v-if="isEdit">
        <td colspan="2">
          <el-form label-width="80px">
            <el-form-item label="角色名称">
              <el-input v-model="roleName">
              </el-input>
            </el-form-item>
            <el-form-item label="权限分配">
              <el-table :data="roleMenuData" style="width: 100%;margin-bottom: 20px;" :row-key="id" border
                default-expand-all>
                <el-table-column prop="menuName" label="模块名称" width="230" />
                <el-table-column prop="isSelect" label="访问权限" width="100">
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
  </div>
</template>

<script>
  import {
    getMethod,
    postMethod
  } from '@/api/request-new'
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
        roleName: '',
        saveOrEdit: '保存',
        roleData: {
          list:[]
        },
        roleValue: '',
        newRoleName: '',
        roleMenuData: [],
        existRoleMenuId: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        searchParam:{
          pageNum:1,
          pageSize:10,
          accountType:'1',
          name:''
        },
        showPagination: false,
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
        this.loadRole()
      },
      // 删除角色
      deleteRole(row){
        let that = this
        console.log(row)
        postMethod('/permission/delete-role', {id:row.id}).then(res => {
          that.loadRole()
          that.$message({
            type: 'success',
            message: '删除成功!'
          })

        })
      },
      // 分页
      currentPage(pageNum) {
        this.searchParam.pageNum = pageNum;
        this.loadUser();
      },
      backToList() {
        this.isEdit = false
        this.loadRole()
      },
      editRole(row) {
        console.log('row',row);
        const scope = this
        scope.roleName = row.name
        const param = {
          id: row.id
        }
        this.rid = row.id
        getMethod('/permission/get-role-info', param).then(res => {
          let params={
            accountType:res.data.accountType,
            roleId:res.data.id
          }
          getMethod('/permission/get-permission-list', params).then(result => {
            scope.roleMenuData = result.data
            scope.roleMenuData.forEach(item=>{
              item.isSelect=String(item.isSelect)
              if (item.children.length>=1) {
                item.children.forEach(i=>{
                  i.isSelect=String(i.isSelect)
                })
              }
            })
            this.isEdit = true
          })
        })
      },
      loadRole() {
        const scope = this
        getMethod('permission/get-role-list', this.searchParam).then(res => {
          scope.roleData.list = res.data.records
          scope.roleData.total=res.data.total
          scope.showPagination = scope.roleData.total == 0;
        })
      },
      changeAccess(val, row) {
        console.log("权限",val, row)
        if (row.parentId != '0') {
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
        console.log(selectMenu,'selectMenu')
        if (this.rid=='') {
          scope.loading = true
        const param = {
          permissionIds: selectMenu,
          name: this.roleName,
          accountType:'1'
        }
        postMethod('/permission/add-role', param).then(res => {
          scope.loading = false
          scope.isEdit = false
          scope.loadRole()
          this.$message({
            type: 'success',
            message: '保存成功!'
          })

        })
        } else{
          scope.loading = true
          let param={
            id:this.rid,
            permissionIds: selectMenu,
            name: this.roleName,
          }
          postMethod('/permission/update-role', param).then(res => {
            scope.loading = false
            scope.isEdit = false
            scope.loadRole()
            this.$message({
              type: 'success',
              message: '保存成功!'
            })

          })
        }

      },
      addRole() {
        let scope = this;
        this.isEdit = true
        scope.roleName = ''
        scope.rid = ''
        getMethod('/permission/get-permission-list', {
         accountType:1
        }).then(res => {
          console.log(res,'res')
          scope.roleMenuData = res.data
          res.data.forEach(i => {
            i.isSelect="1"
            i.children.forEach(o => {
              o.isSelect="1"
            })
          })
          // scope.loadRole()
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
