<template>
  <div class="set-main">
    <div class="left-menu">
      <div v-for="(item, index) in menuList" :key="index" class="menu-item" :class="isSelect === index ? 'active' : ''" @click="clickItem(index)">
        <span>{{item.name}}</span>
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
    <div class="right-content">
      <div v-show="isSelect === 0" class="content-item">
        <el-form label-position="top" label-width="100px" :model="shareFormData">
          <el-form-item label="分享标题：">
              <el-input type='text' v-model="shareFormData.shareTitle" placeholder="请输入分享标题" maxlength="100" ></el-input>
          </el-form-item>
          <el-form-item label="分享描述：">
              <el-input type='text' v-model="shareFormData.shareDescribe" placeholder="请输入分享描述" maxlength="100" ></el-input>
          </el-form-item>
          <el-form-item label="分享图片：">
            <img class="upload-image cover-img avatar" v-if="shareFormData.shareImage"
                :src="shareFormData.shareImage | filterQiniuImageWform" alt="">
            <el-upload
              class="upload-btn"
              :show-file-list="false"
              action="http://upload.qiniup.com/"
              :before-upload="beforeUpload"
              :on-success="uploadSuccesShare"
              :on-error="uploadError"
              :data="uploadData"
              :multiple="false">
              <el-button size="small" type="primary">上传分享图片</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="saveData(0)" class="saveData">保存设置</el-button>
      </div>
    </div>
  </div>
</template>
<script>
const Config = process.env.NODE_ENV === 'production' ? require('./../../../config/prod.env') : require('./../../../config/dev.env')
export default {
  data () {
    return {
      uuid: '',
      menuList: [{
        id: 1,
        name: '微信分享数据'
      }],
      isSelect: 0,
      shareFormData: {
        shareTitle: '',
        shareDescribe: '',
        shareImage: ''
      },
      uploadData: {
        key: '',
        token: ''
      }
    }
  },
  created () {
    this.uuid = this.$route.query.uuid ? this.$route.query.uuid : ''
    if (this.uuid) {
      this.getShare()
    }
  },
  filters: {
    filterQiniuImageWform (val) {
      let qiniuUrl = ''
      if (val) {
        if (!val.startsWith('http')) {
          // 需要拼接七牛域名
          qiniuUrl = Config.QINIU_WFORM_IMG_URL + '/' + val + '-200'
        } else {
          qiniuUrl = val
        }
      }
      return qiniuUrl
    }
  },
  methods: {
    getShare () {
      let self = this
      this.$http.get(`/api/v1.0/common/form/${this.uuid}/share`).then((res) => {
        console.log('分享信息回显')
        console.log(res)
        let data = res.data
        if (data.code === 200) {
          self.shareFormData = data.data
        }
      })
    },
    clickItem (index) {
      this.isSelect = index
    },
    beforeUpload (file) {
      // 上传LOGO
      let _vue = this
      if (file.size / 1024 / 1024 >= 10) {
        this.$message({
          type: 'error',
          message: '图片大小需小于10M，请重新上传',
          center: true
        })
        return false
      } else if (['image/jpeg', 'image/png', 'image/gif'].indexOf(file.type) === -1) {
        this.$message({
          type: 'error',
          message: '图片格式只支持jpg,jpeg,png,gif，请重新上传',
          center: true
        })
        return false
      } else {
        let key = 'cf/form/' + (new Date().getTime()) + '_' + file.name
        return _vue.$http.get('/api/v1.0/qiniu/token/img?bucket=moore').then(response => {
          _vue.uploadData.token = response.data.data.token
          _vue.uploadData.key = key
        })
      }
    },
    uploadSuccesShare (res, file) {
      this.shareFormData.shareImage = file.response.key
    },
    uploadError () {
      this.$message({
        type: 'error',
        message: '文件上传失败，请稍后重试',
        center: true,
        showClose: true
      })
    },
    saveData () {
      this.shareFormData.shareImage = this.imgUrl(this.shareFormData.shareImage)
      let params = JSON.parse(JSON.stringify(this.shareFormData))
      this.$http.put(`/api/v1.0/common/form/${this.uuid}/share`, params).then((res) => {
        console.log('提交分享信息的编辑')
        console.log(res)
        let data = res.data
        if (data.code === 200) {
          this.$message({
            type: 'success',
            message: '信息提交成功'
          })
        } else {
          this.$message({
            type: 'error',
            message: '信息提交失败，请稍后再试'
          })
        }
      })
    },
    imgUrl (value) {
      let qiniuUrl = ''
      if (value) {
        if (!value.startsWith('http')) {
          // 需要拼接七牛域名
          qiniuUrl = Config.QINIU_WFORM_IMG_URL + '/' + value + '-200'
        } else {
          qiniuUrl = value
        }
      }
      return qiniuUrl
    }
  }
}
</script>
<style lang="scss">
@import './scss/color.scss';
@import './scss/base.scss';
.set-main{
  width: 60%;
  height: calc(100% - 20px);
  margin: 0 auto;
  padding-top: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  >div{
    border: 1px solid #E7E9EB;
    border-radius: 4px;
    background-color: #fff;
  }
  .left-menu{
    width: 25%;
    height: auto;
    .menu-item{
      width: calc(100% - 40px);
      padding: 0 20px;
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #E7E9EB;
    }
    .active{
      color: $titleColor;
    }
  }
  .right-content{
    width: calc(70% - 40px);
    height: calc(100% - 40px);
    overflow: auto;
    padding: 20px;
    margin-left: 30px;
    .content-item{
      width: 100%;
      height: auto;
      .saveData{
        margin-top: 10px;
      }
      .content{
        height: auto;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .btn{
          width: 110px;
          padding: 10px 20px;
          text-align: center;
          border: $border;
          margin-right: 20px;
          font-size: 13px;
          cursor: pointer;
          p{
            width: 100%;
          }
        }
        .btn:hover{
          border: $borderFocus;
          color: $titleColor;
        }
        .activeJump{
          border: $borderFocus;
          color: $titleColor;
        }
      }
    }
    .item1{
      .el-form{
        .el-form-item{
          border-bottom: $border;
        }
      }
    }
  }
}
</style>
