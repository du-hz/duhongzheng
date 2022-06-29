<template>
  <div class="page sign-in">
    <div class="page-main-container">
      <div class="head">
        <img class="logo" src="../assets/images/logo.png" alt="">
      </div>
      <div class="signup-container">
        <div class="welcome-wrap">
          <h2 class="title">欢迎来到摩尔云平台</h2>
          <div class="desc">
            <p>半导体领域 打造一站式解决方案</p>
          </div>
        </div>
        <el-row>
          <el-col :span="24">
            <div class="signup-form-wrap">
              <div class="signup-form">
                <!-- 用户登录 -->
                <el-form :model="userTable" :rules="rules" ref="userTable">
                  <el-form-item label="账号" :label-width="formLabelWidth" prop="account">
                    <el-input v-model="userTable.account" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="密码" :label-width="formLabelWidth" prop="pwd">
                    <el-input v-model="userTable.pwd" auto-complete="off" type="password"></el-input>
                  </el-form-item>
                </el-form>
                <el-button type="primary" class="long" @click="signinfo('userTable')">登 录</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import Global from '../assets/js/global'

export default {
  data () {
    return {
      userTable: {
        account: '',
        pwd: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      formLabelWidth: '180'
    }
  },
  created () {
    if (Global.checkLogin()) {
      this.$router.push({
        path: '/'
      })
    }
  },
  methods: {
    signinfo: function (formName) {
      var _vue = this
      _vue.$refs[formName].validate((valid) => {
        if (valid) {
          _vue.$http.post('/api/v1.0/admin/login', {
            username: _vue.userTable.account.toLowerCase(),
            password: _vue.userTable.pwd
          }).then(function (response) {
            if (response && response.data.code === 200) {
              Global.setItem('token', response.data.data.jwt)
              _vue.$router.push({
                path: '/'
              })
            }
          }).catch(function (error) {
            var errorMsg = Global.extractErrorField(error)
            if (errorMsg === 'admin') {
              _vue.$message({
                type: 'error',
                message: '账号或密码错误',
                center: true
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../assets/css/variable";

  .page.sign-in {
    position: absolute;
    z-index: 2;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #f6f6f6;
    padding-top: 120px;
  }
  .page-main-container {
    width: 500px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid $border-color;
  }
  .head {
    text-align: center;
    margin-top: 40px;
    .logo {
      height: 42px;
    }
  }
  .signup-container {
    padding: 30px 80px 60px 80px;

    .welcome-wrap {
      color: #333;
      text-align: center;
      margin-bottom: 25px;

      .title {
        font-size: 20px;
      }
      .desc {
        margin-top: 10px;
        font-size: 15px;
        color: #666;
      }
    }
    .right-part {
      text-align: right;
    }
  }
  .signup-form-wrap {
    padding: 15px;
    background-color: #fff;

    .signup-form {

      .forget {
        text-align: right;

        &.left {
          text-align: left;
          padding-top: 20px;
        }
        a {
          color: #999;
          font-size: 14px;
        }
      }
      .long {
        width: 100%;
        margin: 25px 0;
      }
    }
  }
  .signup-wrap {
    .inner {
      text-align: center;
      background-color: $bg-color;
      padding: 20px 0;
      color: $primary-color;

      .icon-circle {
        width: 16px;
        height: 16px;
        display: inline-block;
        vertical-align: middle;
        border-radius: 100%;
        background-color: $primary-color;
        color: #fff;
      }
      a {
        color: $primary-color;
        vertical-align: middle;
      }
    }
  }
  .form-item-line {
    border-top: 1px solid $border-color;
    margin-bottom: 22px;
  }
  .pwd-check {
    position: absolute;
    right: 0;
    padding-top: 4px;
    line-height: 16px;
  }
</style>
