<template>
  <div>
    <div class="head-wrap">
      <a href="javascript:;" class="text-link" @click="back">&lt;&lt; 返回列表</a>
      <span class="order-no">订单号：{{surveyDetail.orderNo}}</span>
    </div>
    <div class="cnt-wrap">
      <div class="line-title">
        <span>候选人信息</span>
      </div>
      <el-form label-width="120px">
        <el-form-item label="姓名：">
          <span>{{surveyDetail.name}}</span>
        </el-form-item>
        <el-form-item label="手机号：">
          <span>{{surveyDetail.mobile}}</span>
        </el-form-item>
        <el-form-item label="候选人简历：">
          <a v-if="surveyDetail.uploadedResume" :href="surveyDetail.uploadedResume | filterMooreResume" class="text-link" target="_blank">点击查看</a>
          <span v-if="!surveyDetail.uploadedResume">无</span>
        </el-form-item>
        <el-form-item label="标准库简历：">
          <a v-if="standardResumeUrl" :href="standardResumeUrl" class="text-link" target="_blank">点击查看</a>
          <span v-if="!standardResumeUrl">无</span>
        </el-form-item>
        <el-form-item label="启动背调原因：">
          <span>{{surveyDetail.bgCheckReason}}</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="cnt-wrap">
      <div class="line-title">
        <span>背调方案</span>
      </div>
      <el-form label-width="100px">
        <el-form-item label="方案类型：">
          <span>{{surveyDetail.jobRank | filterJobRank}}</span>
        </el-form-item>
        <el-form-item label="订单费用：">
          <span>{{surveyDetail.price}}</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="cnt-wrap candidates-wrap">
      <div class="line-title">
        <span>授权信息</span>
      </div>
      <el-form label-width="100px">
        <el-form-item label="证明方式：">
          <span>授权证明</span>
        </el-form-item>
        <el-form-item label="查看证明：">
          <a :href="(authorizationAddress || surveyDetail.authorizationAddress) | filterFileAddress" target="_blank" class="text-link" v-if="surveyDetail.authorizationAddress">{{authorizationName || '点击查看'}}</a>
          <span v-if="!surveyDetail.authorizationAddress">无</span>
          <el-upload
            class="file-uploader"
            :multiple="false"
            action="http://upload.qiniup.com/"
            :show-file-list="false"
            :on-success="handleFileSuccess"
            :on-error="handleFileError"
            :on-progress="handleFileProgress"
            :data="uploadData"
            :before-upload="beforeFileUpload">
            <el-button size="small" type="primary">点击上传</el-button>
            <span v-if="fileUploading">文件上传中...</span>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
    <div class="cnt-wrap">
      <div class="line-title">
        <span>公司信息</span>
        <el-button type="primary" size="small" @click="editCompanyInfo">编辑</el-button>
      </div>
      <el-form class="form-inline" label-width="100px">
        <el-form-item label="公司：">
          <span>{{surveyDetail.companyShortname}}</span>
        </el-form-item>
        <el-form-item label="对接人：">
          <span>{{surveyDetail.hrContactName}}</span>
        </el-form-item>
        <el-form-item label="联系电话：">
          <span>{{surveyDetail.hrContactMobile}}</span>
        </el-form-item>
        <el-form-item label="邮箱：">
          <span>{{surveyDetail.hrContactEmail}}</span>
        </el-form-item>
      </el-form>
    </div>

    <!-- 编辑公司信息 -->
    <el-dialog title="编辑公司信息" :visible.sync="editCompanyInfoDialog" width="35%">
      <el-form :model="companyInfoForm" ref="companyInfoForm" :rules="rules">
        <el-form-item label="对接人" label-width="140px" prop="contactName">
          <el-input v-model.trim="companyInfoForm.contactName"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" label-width="140px" prop="contactMobile">
          <el-input v-model.trim="companyInfoForm.contactMobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="140px" prop="contactEmail">
          <el-input v-model.trim="companyInfoForm.contactEmail"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer center">
        <el-button @click="cancelEditCompany">取 消</el-button>
        <el-button type="primary" @click="sureEditCompany('companyInfoForm')">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Global from 'assets/js/global'

export default {
  data () {
    return {
      surveyId: this.$route.params.id,
      surveyDetail: {}, // 背调详情
      rules: {
        contactName: [
          { required: true, message: '请输入对接人姓名', trigger: 'blur' },
          { max: 30, message: '名字长度不能超过30个字符', trigger: 'blur' }
        ],
        contactMobile: [
          { required: true, message: '请填写联系电话', trigger: 'blur' },
          { pattern: Global.REGEX.MOBILE, message: '手机号格式不正确', trigger: 'blur' }
        ],
        contactEmail: [
          { required: true, message: '请填写邮箱地址', trigger: 'blur' },
          { pattern: Global.REGEX.EMAIL, message: '邮箱格式不正确', trigger: 'blur' }
        ]
      },
      uploadData: {
        token: '',
        key: ''
      },
      adminInfo: {}, // 当前用户adminInfo, 判断是否是主管会用到
      fileUploading: false,
      emailSending: false,
      editCompanyInfoDialog: false,
      companyInfoForm: {},
      authorizationAddress: '',
      authorizationName: '',
      standardResumeUrl: '' // 标准库简历地址
    }
  },
  created () {
    this.fetchSurveyDetail()
    this.fetchAdminInfo()
  },
  filters: {
    filterJobRank (val) {
      if (val === 2) return '工程师'
      if (val === 3) return '经理级'
    },
    filterFileAddress (val) {
      // 七牛文件路径
      let qiniuUrl = ''
      if (val) {
        if (val.startsWith('cloud/')) {
          // 需要拼接七牛域名
          qiniuUrl = Global.CONFIG.QINIU_BUCKET_MOORE_FILE_URL + '/' + val
        } else {
          qiniuUrl = val
        }
      }
      return qiniuUrl
    },
    filterMooreResume (val) {
      // 七牛文件路径
      let qiniuUrl = ''
      if (val) {
        if (val.startsWith('cloud/')) {
          // 需要拼接七牛域名
          qiniuUrl = Global.CONFIG.QINIU_BUCKET_MOORE_FILE_URL + '/' + val
        } else {
          qiniuUrl = val
        }
      }
      return qiniuUrl
    }
  },
  methods: {
    fetchSurveyDetail () {
      let _vue = this
      _vue.$http.get('/api/v1.0/survey/order-detail?id=' + _vue.surveyId).then(function (response) {
        console.log(response)
        _vue.surveyDetail = response.data.data.info
        _vue.standardResumeUrl = response.data.data.url
      })
    },
    fetchAdminInfo () {
      // 获取当前用户的adminInfo
      let _vue = this
      _vue.$http.get('/api/v1.0/ensure/manager').then((response) => {
        _vue.adminInfo = response.data.data.infoManger
      })
    },
    editCompanyInfo () {
      // 编辑公司信息
      this.companyInfoForm = {
        contactName: this.surveyDetail.hrContactName,
        contactMobile: this.surveyDetail.hrContactMobile,
        contactEmail: this.surveyDetail.hrContactEmail
      }
      this.editCompanyInfoDialog = true
    },
    back () {
      window.history.go(-1)
    },
    beforeFileUpload (file) {
      // 简历上传
      let _vue = this
      if (file.size / 1024 / 1024 >= 10) {
        _vue.$message({
          type: 'error',
          message: '文件大小需小于10M',
          center: true
        })
        return false
      } else {
        let key = 'cloud/file/prove/' + (new Date().getTime()) + '_' + file.name
        return _vue.$http.get('/api/v1.0/qiniu/token/file?bucket=moore').then(response => {
          _vue.uploadData.token = response.data.data.token
          _vue.uploadData.key = key
        })
      }
    },
    handleFileError () {
      // 简历上传失败
      let _vue = this
      _vue.$message({
        type: 'error',
        message: '请稍后重试',
        center: true
      })
      this.fileUploading = false
    },
    handleFileProgress () {
      this.fileUploading = true
    },
    handleFileSuccess (res, file) {
      // 简历上传成功
      console.log('上传成功')
      console.log(file)
      console.log(res)
      let _vue = this
      _vue.fileUploading = false
      _vue.authorizationName = file.name
      _vue.authorizationAddress = res.key
      // 提交上传授权文件
      _vue.$http.post('/api/v1.0/survey/order/upload', {
        id: _vue.surveyId,
        authorizationAddress: _vue.authorizationAddress
      }).then(() => {
        _vue.$message({
          type: 'success',
          message: '上传成功',
          center: true
        })
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    cancelEditCompany () {
      this.editCompanyInfoDialog = false
    },
    sureEditCompany (formName) {
      // 提交编辑信息
      let _vue = this
      _vue.$refs[formName].validate((valid) => {
        if (valid) {
          _vue.$http.put('/api/v1.0/survey/edit-company-info', {
            hrContactName: _vue.companyInfoForm.contactName,
            hrContactMobile: _vue.companyInfoForm.contactMobile,
            hrContactEmail: _vue.companyInfoForm.contactEmail,
            id: _vue.surveyId
          }).then(() => {
            _vue.$message({
              type: 'success',
              message: '编辑成功',
              center: true
            })
            _vue.editCompanyInfoDialog = false
            _vue.fetchSurveyDetail()
          }).catch(() => {
            _vue.$message({
              type: 'error',
              message: '请稍后重试',
              center: true
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";
  .order-no {
    font-size: 16px;
    color: #333;
    font-weight: bold;
    margin-left: 50px;
  }
  .cnt-wrap {
    padding-bottom: 30px;
    border-bottom: 1px solid $border-color;

    &.consume-wrap {
      border-bottom: none;
    }
  }
  .line-title {
    border-left: 3px solid $primary-color;
    padding-left: 10px;
    margin-bottom: 30px;
    margin-top: 30px;

    span {
      font-size: 16px;
      height: 20px;
      display: inline-block;
      vertical-align: middle;
      color: $primary-color;
    }
    button {
      margin-left: 100px;
      vertical-align: middle;
    }
  }
  .order-info-cnt {
    margin-top: 40px;
    max-width: 1200px;
    padding-left: 20px;
    .el-row {
      margin-bottom: 15px;
      .el-col {
        span {
          display: inline-block;
          &.title {
            height: 20px;
            line-height: 20px;
          }
          &.cnt {
            max-width: 90%;
            vertical-align: top;
          }
        }
      }
    }
  }
  .data-summary {
    margin-bottom: 30px;
    padding-left: 16px;

    .item {
      display: inline-block;
      margin-right: 30px;

      &.count-info {
        .count {
          color: $primary-color;
        }
      }
      &.price-info {
        .price {
          color: $bright-color;
        }
      }
    }
  }
  .upload-tip {
    font-size: 13px;
    color: $bright-color;
  }
</style>
