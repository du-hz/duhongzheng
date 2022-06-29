<template>
  <div>
    <el-dialog
      title="附件简历修改"
      :visible.sync="dialogVisible"
      class="labelModify"
      width="500px">
      <el-form class="form" ref="infoForm" label-width="70px" label-position="left">
        <el-row class="personinfo">
          <el-col>
            <span style="font-size: 1.1rem;">{{form.staffname}}</span><span style="margin-left: 10px;">{{form.sexText}}</span>
          </el-col>
          <el-col class="relativeinfo">
            <span>{{form.birthdateText}}</span> <span>|</span> <span>{{form.workingYear}}年</span> <span>|</span> <span>{{form.postname}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="附件简历A:" label-width="85px">
            <el-upload
              class="upload-resume_a"
              action="http://upload.qiniup.com/"
              :data="uploadData"
              :class="info.fileList_1.length > 0 ? 'notupload' : ''"
              :on-preview="handlePreview"
              :on-remove="handleRemove_1"
              :on-exceed="handleExceed"
              :on-success="uploadSuccess_1"
              :before-upload="beforeUpload"
              :file-list="info.fileList_1">
              <el-button size="mini" type="primary">点击上传<i class="el-icon-upload el-icon--right"></i></el-button>
            </el-upload>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="附件简历B:" label-width="85px">
            <el-upload
              class="upload-resume_a"
              action="http://upload.qiniup.com/"
              :data="uploadData"
              :class="info.fileList_2.length > 0 ? 'notupload' : ''"
              :on-preview="handlePreview"
              :on-remove="handleRemove_2"
              :on-exceed="handleExceed"
              :on-success="uploadSuccess_2"
              :before-upload="beforeUpload"
              :file-list="info.fileList_2">
              <el-button size="mini" type="primary">点击上传<i class="el-icon-upload el-icon--right"></i></el-button>
            </el-upload>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="附件简历C:" label-width="85px">
            <el-upload
              class="upload-resume_a"
              action="http://upload.qiniup.com/"
              :data="uploadData"
              :class="info.fileList_3.length > 0 ? 'notupload' : ''"
              :on-preview="handlePreview"
              :on-remove="handleRemove_3"
              :on-exceed="handleExceed"
              :on-success="uploadSuccess_3"
              :before-upload="beforeUpload"
              :file-list="info.fileList_3">
              <el-button size="mini" type="primary">点击上传<i class="el-icon-upload el-icon--right"></i></el-button>
            </el-upload>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="附件简历D:" label-width="85px">
            <el-upload
              class="upload-resume_a"
              action="http://upload.qiniup.com/"
              :data="uploadData"
              :class="info.fileList_4.length > 0 ? 'notupload' : ''"
              :on-preview="handlePreview"
              :on-remove="handleRemove_4"
              :on-exceed="handleExceed"
              :on-success="uploadSuccess_4"
              :before-upload="beforeUpload"
              :file-list="info.fileList_4">
              <el-button size="mini" type="primary">点击上传<i class="el-icon-upload el-icon--right"></i></el-button>
            </el-upload>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="附件简历E:" label-width="85px">
            <el-upload
              class="upload-resume_a"
              action="http://upload.qiniup.com/"
              :data="uploadData"
              :class="info.fileList_5.length > 0 ? 'notupload' : ''"
              :on-preview="handlePreview"
              :on-remove="handleRemove_5"
              :on-exceed="handleExceed"
              :on-success="uploadSuccess_5"
              :before-upload="beforeUpload"
              :file-list="info.fileList_5">
              <el-button size="mini" type="primary">点击上传<i class="el-icon-upload el-icon--right"></i></el-button>
            </el-upload>
          </el-form-item>
        </el-row>
        <el-form-item align="right" style="margin-top: 40px;">
          <el-button type="primary" @click="onSubmit('infoForm')">立即保存</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Global from '@/assets/js/global'
export default {
  componentName: 'LabelModify',
  props: ['form', 'info'],
  data () {
    return {
      dialogVisible: false,
      uploadData: {
        key: '',
        token: ''
      }
    }
  },
  methods: {
    onSubmit (formName) {
      var _vue = this
      _vue.$http.put('/api/v1.0/perf/engineer/edit_relation_info/' + _vue.form.adminUserId, {
        type: 2,
        uploadResumeFirstUrl: _vue.info.fileList_1.length > 0 ? _vue.info.fileList_1[0].url : null,
        uploadResumeFirstName: _vue.info.fileList_1.length > 0 ? _vue.info.fileList_1[0].name : null,
        uploadResumeSecondUrl: _vue.info.fileList_2.length > 0 ? _vue.info.fileList_2[0].url : null,
        uploadResumeSecondName: _vue.info.fileList_2.length > 0 ? _vue.info.fileList_2[0].name : null,
        uploadResumeThirdUrl: _vue.info.fileList_3.length > 0 ? _vue.info.fileList_3[0].url : null,
        uploadResumeThirdName: _vue.info.fileList_3.length > 0 ? _vue.info.fileList_3[0].name : null,
        uploadResumeFourthUrl: _vue.info.fileList_4.length > 0 ? _vue.info.fileList_4[0].url : null,
        uploadResumeFourthName: _vue.info.fileList_4.length > 0 ? _vue.info.fileList_4[0].name : null,
        uploadResumeFifthUrl: _vue.info.fileList_5.length > 0 ? _vue.info.fileList_5[0].url : null,
        uploadResumeFifthName: _vue.info.fileList_5.length > 0 ? _vue.info.fileList_5[0].name : null
      })
        .then(function () {
          _vue.dialogVisible = false
          _vue.form.attachmentResumeFirstUrl = _vue.info.fileList_1.length > 0 ? _vue.info.fileList_1[0].url : null
          _vue.form.attachmentResumeFirstName = _vue.info.fileList_1.length > 0 ? _vue.info.fileList_1[0].name : null
          _vue.form.attachmentResumeFirstName = _vue.info.fileList_1.length > 0 ? _vue.info.fileList_1[0].name : null
          _vue.form.attachmentResumeSecondUrl = _vue.info.fileList_2.length > 0 ? _vue.info.fileList_2[0].url : null
          _vue.form.attachmentResumeSecondName = _vue.info.fileList_2.length > 0 ? _vue.info.fileList_2[0].name : null
          _vue.form.attachmentResumeThirdUrl = _vue.info.fileList_3.length > 0 ? _vue.info.fileList_3[0].url : null
          _vue.form.attachmentResumeThirdName = _vue.info.fileList_3.length > 0 ? _vue.info.fileList_3[0].name : null
          _vue.form.attachmentResumeFourthUrl = _vue.info.fileList_4.length > 0 ? _vue.info.fileList_4[0].url : null
          _vue.form.attachmentResumeFourthName = _vue.info.fileList_4.length > 0 ? _vue.info.fileList_4[0].name : null
          _vue.form.attachmentResumeFifthUrl = _vue.info.fileList_5.length > 0 ? _vue.info.fileList_5[0].url : null
          _vue.form.attachmentResumeFifthName = _vue.info.fileList_5.length > 0 ? _vue.info.fileList_5[0].name : null
          _vue.$message({
            message: '恭喜您，提交成功',
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
    },
    close () {
      this.dialogVisible = false
    },
    handleRemove_1 (file, fileList) {
      this.info.fileList_1 = []
    },
    handleRemove_2 (file, fileList) {
      this.info.fileList_2 = []
    },
    handleRemove_3 (file, fileList) {
      this.info.fileList_3 = []
    },
    handleRemove_4 (file, fileList) {
      this.info.fileList_4 = []
    },
    handleRemove_5 (file, fileList) {
      this.info.fileList_5 = []
    },
    handlePreview (file) {
      try {
        window.open(URL.createObjectURL(file.raw))
      } catch (err) {
        window.open(Global.CONFIG.QINIU_BUCKET_FILE_URL + '/' + file.url)
      }
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    successhint () {
      let _vue = this
      _vue.$message({
        message: '恭喜你，简历上传成功',
        type: 'success'
      })
    },
    beforeUpload (file) {
      let _vue = this
      if (file.size / 1024 / 1024 >= 10) {
        this.$message({
          type: 'warning',
          message: '附件简历文件需小于10M，请重新选择文件',
          center: true,
          showClose: true
        })
        return false
      } else if (['pdf', 'doc', 'xls', 'xlsx', 'jpeg', 'png', 'gif', 'jpg'].indexOf(file.name.split('.')[1]) === -1) {
        this.$message({
          type: 'warning',
          message: '附件简历文件只支持 pdf,doc,xls,xlsx,jpg,jpeg,png,gif，请重新选择文件',
          center: true,
          showClose: true
        })
        return false
      } else {
        let key = 'cloud/upload_resume/' + (new Date().getTime()) + '_' + file.name
        return _vue.$http.post('/api/v1.0/qiniu/token/file', {
          type: 1
        }).then(response => {
          _vue.uploadData.token = response.data.data.token
          _vue.uploadData.key = key
        })
      }
    },
    uploadSuccess_1 (response, file, fileList) {
      this.info.fileList_1.push(file)
      this.info.fileList_1[0].url = this.uploadData.key
      this.successhint()
    },
    uploadSuccess_2 (response, file, fileList) {
      this.info.fileList_2.push(file)
      this.info.fileList_2[0].url = this.uploadData.key
      this.successhint()
    },
    uploadSuccess_3 (response, file, fileList) {
      this.info.fileList_3.push(file)
      this.info.fileList_3[0].url = this.uploadData.key
      this.successhint()
    },
    uploadSuccess_4 (response, file, fileList) {
      this.info.fileList_4.push(file)
      this.info.fileList_4[0].url = this.uploadData.key
      this.successhint()
    },
    uploadSuccess_5 (response, file, fileList) {
      this.info.fileList_5.push(file)
      this.info.fileList_5[0].url = this.uploadData.key
      this.successhint()
    }
  }
}
</script>

<style lang="scss">
  .labelModify{
    .el-dialog__body{
      padding: 20px 20px;
    }

    .notupload .el-upload{
      display: none;
    }

    .el-row{
      margin-bottom: 5px;

      .el-form-item{
        margin-bottom: 0px;
      }

      .el-rate{
        line-height: 50px;
      }

      .el-tag {
        margin-right: 5px;
      }
      .button-new-tag {
        margin-right: 5px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
      }
      .el-tag + button{
        margin-right: 0px;
      }
      .input-new-tag {
        width: 90px;
        margin-right: 5px;
        vertical-align: bottom;
      }
    }

    .personinfo{
      font-size: 1rem;
      line-height: 1.1rem;
      margin-bottom: 15px;
      font-weight: 800;

      .relativeinfo{
        margin-top: 20px;
        font-size: 15px;
        color: #777;
        font-weight: 400;

        span{
          margin-right: 5px;
        }
      }
    }
  }
</style>
