<template>
  <div class="center-content">
    <el-form class="form" :model="infoForm" ref="infoForm" :rules="rules" label-width="80px">
      <el-form-item prop="oldPwd" label="当前密码">
        <el-input
          type="password"
          placeholder="当前密码"
          v-model="infoForm.oldPwd"
          clearable>
        </el-input>
      </el-form-item>
      <el-form-item prop="pwd" label="新密码">
        <el-input
          type="password"
          placeholder="新密码"
          v-model="infoForm.pwd"
          clearable
          @input="checkPwd('infoForm')">
        </el-input>
        <div class="pwd-check" v-show="pwdStrongLevel > 0">
          <pwd-strong :level="pwdStrongLevel"></pwd-strong>
        </div>
      </el-form-item>
      <el-form-item prop="RePwd" label="确认密码">
        <el-input
          type="password"
          placeholder="确认密码"
          v-model="infoForm.RePwd"
          clearable>
        </el-input>
      </el-form-item>
    </el-form>
    <div class="action-wrap right">
      <el-button type="primary" @click="updatePwd('infoForm')">保存修改</el-button>
    </div>
  </div>
</template>

<script>
import Global from 'assets/js/global'
import PwdStrong from '../common/PwdStrong'

export default {
  components: {
    PwdStrong
  },
  data () {
    let checkRePwd = (rule, value, callback) => {
      if (value !== '' && value !== this.infoForm.pwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      pwdStrongLevel: 0,
      infoForm: {
        oldPwd: '',
        pwd: '',
        RePwd: ''
      },
      rules: {
        oldPwd: [
          { required: true, message: '请填写当前密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度6-16位', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请填写新密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度6-16位', trigger: 'blur' }
        ],
        RePwd: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: checkRePwd, trigger: 'blur, change' }
        ]
      }
    }
  },
  created () {
  },
  methods: {
    checkPwd (formName) {
      let _vue = this
      _vue.$refs[formName].validateField('pwd', (error) => {
        if (!error) {
          _vue.pwdStrongLevel = Global.checkPwdStrong(_vue.infoForm.pwd)
        } else {
          _vue.pwdStrongLevel = 0
        }
      })
    },
    updatePwd (formName) {
      let _vue = this
      // TODO: 修改密码
      _vue.$refs[formName].validate((valid) => {
        if (valid) {
          _vue.$http.put('/api/v1.0/customer/password', {
            oldPwd: _vue.infoForm.oldPwd,
            newPwd: _vue.infoForm.pwd
          })
            .then(function () {
              _vue.$message({
                type: 'success',
                message: '修改密码成功',
                center: true
              })
            })
            .catch(function (error) {
              let field = Global.extractErrorField(error)
              if (field === 'oldPwd') {
                _vue.$message({
                  type: 'error',
                  message: '当前密码错误，请重新输入',
                  center: true
                })
                _vue.infoForm.oldPwd = ''
              } else {
                _vue.$message({
                  type: 'error',
                  message: '请稍后重试',
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
  @import "~assets/css/variable";
  .center-content {

    .center-title {
      font-size: 18px;
    }
    .form {
      width: 50%;
      margin-top: 30px;
    }
    .action-wrap {
      width: 50%;

      &.right {
        text-align: right;
      }
    }
  }
  .pwd-check {
    height: 25px;
    text-align: right;
  }
</style>
