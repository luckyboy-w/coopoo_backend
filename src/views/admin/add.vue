<template>
  <div class="update-form-panel" v-loading="loading">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="姓名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="登录账号" >
        <el-input
          :disabled="disabledLoginName"
          v-model="form.loginName"
          placeholder="请输入登录账号"
          clearable
        />
      </el-form-item>
      <el-form-item label="邮箱地址">
        <el-input
          v-model="form.email"
          placeholder="请输入邮箱地址"
          clearable
        />
      </el-form-item>
      <el-form-item label="密码" v-if="showPwd">
        <el-input
          v-model="form.password"
          placeholder="请输入密码"
          show-password
          clearable
        />
      </el-form-item>
      <el-form-item label="确认密码" v-if="showPwd">
        <el-input
          v-model="form.reppwd"
          placeholder=""
          show-password
          clearable/>
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="form.roleId" placeholder="请选择角色">
          <el-option
            v-for="item in roleData"
            :key="item.id"
            :value-key="id"
            :label="item.roleName"
            :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitUpdate">提交</el-button>
        <el-button @click="cancelUpdate">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getMethod, postMethod } from '@/api/request'
export default {
  data() {
    return {
      loading:false,
      roleData: [],
      showPwd:true,
      disabledLoginName:false,
      form: {
        name: '',
        loginName: '',
        email: '',
        password: '',
        reppwd: '',
        roleId: ''
      }
    }
  },
  props:{
    editData: {
      type: Object,
      required: false
    }
  },
  computed: {
  },
  mounted() {
    this.loadRole()

    if(this.editData.sysUserId){
      this.disabledLoginName = true
      this.form = this.editData
      this.showPwd = false
    }
  },
  created() {},
  methods: {
    loadRole() {
      const scope = this

      getMethod('/backend/role/getRole', '').then(res => {
        scope.roleData = res.data
      })
    },
    cancelUpdate() {
      this.$emit('showListPanel', true)
    },
    submitUpdate() {
      let scope = this
      if(this.form.reppwd != this.form.password){
        this.$message({
					message: "两次输入的密码不一致",
					type: "warring"
				});
        return;
      }
      this.loading = true
      postMethod('/backend/user/addUser', this.form).then(res => {
        this.loading = false
        scope.roleData = res.data

        if(res.code != 200){
          this.$message({
            message: res.message,
            type: "warning"
          });
          return
        }
        this.$emit('showListPanel', true)
        this.$message({
					message: "保存成功",
					type: "success"
        });

      })

    }
  }
}
</script>
<style lang="scss" scoped>
.update-form-panel{
  padding:30px 20px;
  width: 600px;
}
</style>
