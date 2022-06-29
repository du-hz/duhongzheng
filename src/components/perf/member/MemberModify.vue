<template>
  <div>
    <el-dialog
      title="团队成员修改"
      :visible.sync="dialogVisible"
      class="teammodify"
      width="900px">
      <el-form class="form" :model="form" ref="infoForm" :rules="rules" label-width="70px" label-position="left">
        <el-row>
          <el-col :span="6">
            <el-form-item label="姓名" label-width="40px">
              <el-input v-model="form.name" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset='1'>
            <el-form-item label="性别" label-width="40px">
              <el-radio-group v-model="form.sex" :disabled="true" label-width="20px">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset='1'>
            <el-form-item label="出生年月" label-width="80px">
              <el-date-picker
                :disabled="true"
                v-model="form.birth"
                type="month"
                id="birth"
                placeholder="请选择出生年月">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="工作年限"  label-width="70px">
              <el-input-number size="small" v-model="form.workingYear" :disabled="true"></el-input-number>
              <span class="el-hint">年</span>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset='1'>
            <el-form-item label="职位名称"  label-width="70px">
              <el-input v-model="form.post" :disabled="true" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9" align="right">
            <el-form-item label="入职时间"  label-width="70px">
              <el-date-picker id="jointime" type="date" placeholder="选择日期" v-model="form.joinTime" :disabled="true"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset='1'>
            <el-form-item label="主管负责人"  label-width="90px">
              <el-input v-model="form.leader" :disabled="true" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7"  :offset='1'>
            <el-form-item label="手机号码"  label-width="70px">
              <el-input v-model="form.mobile" :disabled="true" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item prop="password" label="登录密码"  label-width="80px">
              <el-input v-model="form.password" type="password" clearable width="70px" placeholder="********"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8"  :offset='1'>
            <el-form-item label="就职状态"  label-width="70px">
                <el-radio-group v-model="form.status" :disabled="true" label-width="20px">
                  <el-radio label="正式员工">正式员工</el-radio>
                  <el-radio label="离职">离职</el-radio>
                </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="上传头像" label-width="70px">
              <el-upload
                class="avatar-uploader"
                :multiple="false"
                action="http://upload.qiniup.com/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :on-error="handleAvatarError"
                :data="uploadData"
                :before-upload="beforeAvatarUpload">
                <img v-if="form.headUrl" :src="form.headUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item align="right">
          <el-button type="primary" @click="onSubmit('infoForm')">立即修改</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Global from '../../../assets/js/global'
export default {
  componentName: 'TeamModify',
  props: ['form'],
  data () {
    return {
      dialogVisible: false,
      uploadData: {
        key: '',
        token: ''
      },
      rules: {
        password: [
          { min: 6, max: 8, message: '密码长度在6到8个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit (formName) {
      var _vue = this
      _vue.$refs[formName].validate((valid) => {
        if (valid) {
          _vue.$http.put('/api/v1.0/perf/engineer/' + _vue.form.id, {
            password: _vue.form.password,
            headUrl: _vue.uploadData.key
          })
            .then(function () {
              _vue.dialogVisible = false
              _vue.$message({
                message: '恭喜您，信息提交成功',
                type: 'success'
              })
            })
            .catch(function () {
              _vue.$message({
                type: 'error',
                message: '信息提交失败，请稍后重试',
                center: true,
                showClose: true
              })
            })
        }
      })
    },
    close () {
      this.dialogVisible = false
    },
    beforeAvatarUpload (file) {
      let _vue = this
      if (file.size / 1024 / 1024 >= 10) {
        this.$message({
          type: 'error',
          message: '图片大小需小于10M，请重新上传头像',
          center: true,
          showClose: true
        })
        return false
      } else if (['image/jpeg', 'image/png', 'image/gif'].indexOf(file.type) === -1) {
        this.$message({
          type: 'error',
          message: '图片格式只支持jpg,jpeg,png,gif，请重新上传头像',
          center: true,
          showClose: true
        })
        return false
      } else {
        let key = 'cloud/avatar/' + (new Date().getTime()) + '_' + file.name
        return _vue.$http.post('/api/v1.0/qiniu/token/img', {
          type: 1
        }).then(response => {
          _vue.uploadData.token = response.data.data.token
          _vue.uploadData.key = key
        })
      }
    },
    handleAvatarError () {
      let _vue = this
      _vue.$message({
        type: 'error',
        message: '头像上传失败，请稍后重试',
        center: true,
        showClose: true
      })
    },
    handleAvatarSuccess (res, file) {
      let _vue = this
      console.log(Global.CONFIG)
      _vue.form.headUrl = URL.createObjectURL(file.raw)
      _vue.$message({
        message: '恭喜你，头像上传成功',
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss">
  .teammodify{
    .el-row {
      margin-bottom: 5px;
    }
    .el-input.is-disabled .el-input__inner{
      color: #777;
    }
    .el-hint{
      margin-left: 5px;
    }

    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 130px;
      height: 130px;
      line-height: 130px;
      text-align: center;
    }
    .avatar {
      width: 130px;
      height: 130px;
      display: block;
    }
  }
</style>
