<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
      @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <div style="font-size:14px;float:left;padding:5px 40px 0px 0px">
        <el-row style="width:400px">
          <el-col></el-col>
        </el-row>
        <el-row style="width:800px">
          <el-col :span="6" style="font-size:14px"></el-col>
          <el-col :span="1">
            <div class="grid-content bg-purple-light"></div>
          </el-col>
          <el-col :span="6" style="font-size:14px">登录账号：{{loginName}}</el-col>
          <el-col :span="1">
            <div class="grid-content bg-purple-light"></div>
          </el-col>
          <el-col :span="10" style="font-size:14px">最后一次登录时间：{{loginDate|_formatDate}}</el-col>
        </el-row>
      </div>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="showResetPwd">修改密码</el-dropdown-item>
          <!-- <router-link to="/profile/index"></router-link> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dialog :visible="showReset" @close="close()" v-if="showReset" title="密码重置" width="600px">
        <el-form ref="dataForm" :model="resetFrm" label-width="100px" style="width:500px">
          <el-form-item label="旧密码">
            <el-input v-model="resetFrm.oldPwd" placeholder="请输入密码" show-password clearable />
          </el-form-item>
          <el-form-item label="新密码">
            <el-input v-model="resetFrm.newPwd" placeholder="请输入密码" show-password clearable />
          </el-form-item>
          <el-form-item label="确认新密码">
            <el-input v-model="resetFrm.reppwd" placeholder show-password clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitReset()">提交</el-button>
            <el-button @click="showReset = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import {
    getMethod,
    postMethod
  } from "@/api/request";
  import {
    formatDate
  } from "@/api/tools.js";
  import {
    mapGetters
  } from "vuex";
  import Breadcrumb from "@/components/Breadcrumb";
  import Hamburger from "@/components/Hamburger";
  import ErrorLog from "@/components/ErrorLog";
  import Screenfull from "@/components/Screenfull";
  import SizeSelect from "@/components/SizeSelect";
  import LangSelect from "@/components/LangSelect";
  import Search from "@/components/HeaderSearch";

  export default {
    components: {
      Breadcrumb,
      Hamburger,
      ErrorLog,
      Screenfull,
      SizeSelect,
      LangSelect,
      Search,
    },
	filters: {
	  _formatDate(time) {
	    if (time == '' ||
	      time == undefined) {
	      return ''
	    }
	    let date = new Date(time);
	    return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
	  }
	},
    computed: {
      obj() {
        return this.resetFrm.newPwd.length
      },
      ...mapGetters(["sidebar", "avatar", "device"]),
    },
    data() {
      return {
        loginName: store.getters.account,
        loginDate: store.getters.lastLoginTime ? store.getters.lastLoginTime : "暂无",
        showReset: false,
        resetFrm: {
          oldPwd: "",
          newPwd: "",
          reppwd: "",
        }
      };
    },
    mounted() {
      // this.getUser();
      // console.log(store.getters.lastLoginTime,store.getters.account)
    },
    methods: {
      submitReset() {
        let scope = this;
        if (this.resetFrm.newPwd == "" || this.resetFrm.oldPwd == "") {
          this.$message({
            message: "密码不能为空",
            type: "warning",
          });
          return
        }
        if (this.obj < 6) {
          this.$message({
            message: "密码不能小于6位数",
            type: "warning",
          });
          return
        }
        if (this.resetFrm.newPwd != this.resetFrm.reppwd) {
          this.$message({
            message: "俩次输入的新密码不一致",
            type: "warning",
          });
          return
        }
        postMethod("/login/reset-pwd", this.resetFrm).then((res) => {
          if (res.errCode !== 0) {
            this.$message({
              message: res,
              type: "warning",
            });
          } else {
            this.$message({
              message: '修改成功',
              type: "success",
            });
            this.showReset = false;
            this.logout()
          }

        });
      },
      showResetPwd() {
        this.showReset = true;
      },
      close() {
        this.showReset = false;
      },
      // getUser() {
      //   let scope = this;
      //   getMethod("/backend/web/getUser", {}).then((res) => {
      //     let user = res.data.sysUser;
      //     scope.resetFrm.sysUserId = user.sysUserId;
      //     scope.loginName = user.loginName;
      //     scope.loginDate = scope.fmtDate(user.loginDate);
      //   });
      // },
      fmtDate(date) {
        let dt = new Date(date);
        if (date == undefined) {
          dt = new Date();
        }
        return formatDate(dt, "yyyy-MM-dd hh:mm");
      },
      toggleSideBar() {
        this.$store.dispatch("app/toggleSideBar");
      },
      async logout() {
        await this.$store.dispatch("user/logout");
        //this.$router.push(`/login?redirect=${this.$route.fullPath}`);
        this.$router.push('/login');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background 0.3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background 0.3s;

          &:hover {
            background: rgba(0, 0, 0, 0.025);
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
