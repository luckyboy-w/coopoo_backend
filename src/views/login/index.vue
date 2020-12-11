<template>

  <div class="container">
    <div class="home">
      <div class="loginbg">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on"
          label-position="left">

          <lang-select style="margin-right:-300px;margin-top: 50px;" class="set-language" />

          <el-form-item prop="username">
            <!-- <span class="svg-container">
            <svg-icon icon-class="user" />
          </span> -->
            <el-input style="margin-top: 10px;" ref="username" v-model="loginForm.username" :placeholder="$t('login.username')"
              name="username" type="text" tabindex="1" autocomplete="on" />
          </el-form-item>

          <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
            <el-form-item prop="password">
              <!-- <span class="svg-container">
              <svg-icon icon-class="password" />
            </span> -->
              <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType"
                :placeholder="$t('login.password')" name="password" tabindex="2" autocomplete="on" @keyup.native="checkCapslock"
                @blur="capsTooltip = false" @keyup.enter.native="handleLogin" />
              <span class="show-pwd" @click="showPwd">
                <svg-icon style="position: absolute;margin-top: 40px;right: 55px;" :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
          </el-tooltip>

          <el-button :loading="loading" type="primary" style="margin-top: 20px;width:85%;margin-bottom:30px;height:50px;border-radius: 25px;background-color: #A49E83;"
            @click.native.prevent="handleLogin">
            {{ $t('login.logIn') }}
          </el-button>

        </el-form>
      </div>
      <div class="text">欢迎登录&nbsp;&nbsp;靠谱家后台管理系统</div>

    </div>
  </div>

  <!--
	<div style="text-align: center;">
		<img class="login" />
		<div style="display: inline-flex;">
      <div>
        <img class="lgbg" />
      </div>
			<div class="txt">
				<span>欢迎登录&nbsp;&nbsp;靠谱家后台管理系统</span>
			</div>
			<div class="dl">

			</div>
		</div>
	</div>
 -->



</template>

<script>
  import {
    validUsername
  } from '@/utils/validate'
  import LangSelect from '@/components/LangSelect'
  import SocialSign from './components/SocialSignin'

  export default {
    name: 'Login',
    components: {
      LangSelect,
      SocialSign
    },
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!validUsername(value)) {
          callback(new Error('Please enter the correct user name'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('The password can not be less than 6 digits'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        loginRules: {
          username: [{
            required: true,
            trigger: 'blur',
            validator: validateUsername
          }],
          password: [{
            required: true,
            trigger: 'blur',
            validator: validatePassword
          }]
        },
        passwordType: 'password',
        capsTooltip: false,
        loading: false,
        buLoading: false,
        showDialog: false,
        redirect: undefined,
        otherQuery: {}
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          const query = route.query
          if (query) {
            this.redirect = query.redirect
            this.otherQuery = this.getOtherQuery(query)
          }
        },
        immediate: true
      }
    },
    created() {
      // window.addEventListener('storage', this.afterQRScan)
    },
    mounted() {
      if (this.loginForm.username === '') {
        this.$refs.username.focus()
      } else if (this.loginForm.password === '') {
        this.$refs.password.focus()
      }
    },
    destroyed() {
      // window.removeEventListener('storage', this.afterQRScan)
    },
    methods: {
      checkCapslock(e) {
        const {
          key
        } = e
        this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleBULogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.buLoading = true
            this.$store.dispatch('user/buLogin', this.loginForm)
              .then(() => {
                this.$router.push({
                  path: this.redirect || '/',
                  query: this.otherQuery
                })
                this.buLoading = false
              })
              .catch(() => {
                this.buLoading = false
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('user/login', this.loginForm)
              .then(() => {
                this.$router.push({
                  path: this.redirect || '/',
                  query: this.otherQuery
                })
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      getOtherQuery(query) {
        return Object.keys(query).reduce((acc, cur) => {
          if (cur !== 'redirect') {
            acc[cur] = query[cur]
          }
          return acc
        }, {})
      }
      // afterQRScan() {
      //   if (e.key === 'x-admin-oauth-code') {
      //     const code = getQueryObject(e.newValue)
      //     const codeMap = {
      //       wechat: 'code',
      //       tencent: 'code'
      //     }
      //     const type = codeMap[this.auth_type]
      //     const codeName = code[type]
      //     if (codeName) {
      //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //         this.$router.push({ path: this.redirect || '/' })
      //       })
      //     } else {
      //       alert('第三方登录失败')
      //     }
      //   }
      // }
    }
  }
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  .container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    min-width: 1000px;
    zoom: 1;
    background-color: #fff;
    background: url(../../icons/login.png) no-repeat;
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
    background-position: center 0;
  }

  .home {
    width: 825px;
    height: 376px;
    /* background:skyblue; */
    position: absolute;
    background: url(../../icons/lgbg.png);
    background-size: cover;
    left: 50%;
    top: 50%;
    margin-left: -300px;
    margin-top: -300px;
  }

  .loginbg {
    margin-top: -25px;
    margin-left: 390px;
    width: 409px;
    height: 430px;
    background: white;
    border-radius: 10px;
    text-align: center;

    .el-input--medium .el-input__inner {
      margin-top: 20px;
      width: 85%;
      border-radius: 30px;
      background-color: #F0F0F0;
      height: 50px;
      line-height: 36px;
    }

    .el-button--primary {
      color: #fff;
      border-color: #A49E83;
      font-size: 20px;
    }
  }

  .text {
    margin-top: -120px;
    margin-left: 46px;
    width: 300px;
    // height: 20px;
    color: white;
    font-size: 22px;
    // background: greenyellow;
  }
</style>

<style lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;



  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }

      .set-language {
        color: #fff;
        position: absolute;
        top: 3px;
        font-size: 18px;
        right: 0px;
        cursor: pointer;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }
</style>
