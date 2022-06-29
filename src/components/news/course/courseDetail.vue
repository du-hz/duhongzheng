<template>
  <div>
    <div class="head-wrap">
      <span class="text-link" @click="back">&lt;&lt; 返回列表</span>
    </div>
    <div class="main-line-title">{{id === '' ? '新建课程' : '编辑课程'}}</div>
    <el-form ref="form" :model="form" label-width="80px" style="width: 70%">
      <el-form-item label="课程名称">
        <el-input v-model="form.title" placeholder="不超过60个字符" maxlength="60"></el-input>
        <div class="time-show" v-if="id !== ''">
          <p>创建时间：{{form.createTime}}</p>
          <p>审核时间：{{form.releaseTimeText}}</p>
        </div>
      </el-form-item>
      <!-- <el-form-item label="主讲人">
        <el-input v-model="form.lectureName"></el-input>
      </el-form-item> -->
      <el-form-item label="主讲人">
        <el-select
          style="width: 100%"
          v-model="userArr"
          filterable
          remote
          reserve-keyword
          placeholder="请输入手机号"
          :remote-method="remoteFetchuserName">
          <el-option
            v-for="item in uesrNameOpts"
            :key="item.userId"
            :label="item.userName"
            :value="item.userName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" :rows="5" v-model="form.signature" maxlength="100" placeholder="不超过100个字符"></el-input>
      </el-form-item>
      <el-form-item label="封面图">
        <el-row :gutter="20">
          <el-col :span="10">
            <!-- 封面图 -->
            <div class="cover-img-wrap">
              <img class="upload-image cover-img" v-if="uploadedImageUrl !== ''" :src="uploadedImageUrl | filterQiniuMooreImage" alt="">
              <el-upload
                class="upload-btn"
                :show-file-list="false"
                action="http://upload.qiniup.com/"
                :before-upload="beforeUpload"
                :on-progress="uploadProgress"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :data="uploadData"
                :multiple="false">
                <el-button size="small" type="primary" :disabled="uploading">{{uploading ? '正在上传...' : '上传封面图'}}</el-button>
                <span class="img-tip">尺寸：200*150</span>
              </el-upload>
            </div>
          </el-col>
          <el-col :span="10">
            <!-- 分享图 -->
            <div class="share-img-wrap">
              <img class="upload-image share-img" v-if="uploadedShareImgUrl !== ''" :src="uploadedShareImgUrl | filterQiniuMooreImage" alt="">
              <el-upload
                class="upload-btn"
                :show-file-list="false"
                action="http://upload.qiniup.com/"
                :before-upload="beforeUploadShareImg"
                :on-progress="uploadProgressShareImg"
                :on-success="uploadSuccessShareImg"
                :on-error="uploadErrorShareImg"
                :data="uploadDataShareImg"
                :multiple="false">
                <el-button size="small" type="primary" :disabled="uploadingShareImg">{{uploadingShareImg ? '正在上传...' : '上传分享图'}}</el-button>
                <span class="img-tip">尺寸：200*200</span>
              </el-upload>
            </div>
          </el-col>
        </el-row>
        <!-- <div class="image-pick-wrap">
          <el-radio-group v-model="coverImageRadio">
            <div class="radio-item">
              <el-radio :label="1">使用自定义上传封面图</el-radio>
            </div>
            <div class="radio-item">
              <el-radio :label="2">使用文章中的图片作为封面图</el-radio>
            </div>
          </el-radio-group>
        </div> -->
      </el-form-item>
      <!-- <el-form-item label="课程类型">
        <el-select placeholder="请选择类型" v-model="form.newsTypeId" style="width: 100%">
          <el-option
            v-for="(item, index) in contentNewsTypeOpts"
            :key="index"
            :value="item.id"
            :label="'频道ID ' + item.id + ' —— ' + item.pcName + '(PC)、' + item.wxName + '(移动站)、' + item.appName + '(APP)'">
            <span>频道ID {{item.id}} —— {{item.pcName}}(PC)、{{item.wxName}}(移动站)、{{item.appName}}(APP)</span>
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="课程路径">
        <el-input v-model="form.mediaPlayer"></el-input>
      </el-form-item>
      <el-form-item label="课程内容">
        <div class="ckeditor-container">
          <textarea name="content" id="editor"></textarea>
        </div>
      </el-form-item>
      <el-form-item label="外显标签">
        <el-select
          style="width: 100%"
          v-model="tagArr"
          multiple
          filterable
          remote
          reserve-keyword
          allow-create
          default-first-option
          placeholder="请选择外显标签"
          :remote-method="remoteFetchTag">
          <el-option
            v-for="item in tagsOpts"
            :key="item.id"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="其余标签">
        <el-select
          style="width: 100%"
          v-model="contentTagArr"
          multiple
          remote
          reserve-keyword
          filterable
          allow-create
          default-first-option
          placeholder="请选择其余标签"
          :remote-method="remoteFetchTag">
          <el-option
            v-for="item in tagsOpts"
            :key="item.id"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否展示">
        <el-radio-group v-model="form.isShow">
          <el-radio :label="0">不展示</el-radio>
          <el-radio :label="1">展示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveOperate">保存并发表</el-button>
        <el-button @click="cancelOperate">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Global from 'assets/js/global'
import _ from 'underscore'
import MyUploadAdapter from 'assets/js/uploadAdapter'
export default {
  data () {
    return {
      topicId: (this.$route.query && this.$route.query.topicId) || '',
      id: (this.$route.query && this.$route.query.id) || '',
      userArr: '',
      fetchUserNameLoading: false,
      uesrNameOpts: [],
      tagsOpts: [],
      form: {
        title: '',
        signature: '',
        mediaPlayer: '',
        content: '',
        source: '',
        lectureName: '',
        externalLink: '',
        isShow: 0,
        newsTypeId: [],
        contentTagIds: '',
        tagIds: ''
      },
      contentTagArr: [], // 其他标签名称
      tagArr: [], // 外显标签名称
      uploadedShareImgUrl: '',
      uploadDataShareImg: {
        key: '',
        token: ''
      },
      uploadingShareImg: false,
      uploadedImageUrl: '',
      uploadData: {
        key: '',
        token: ''
      },
      uploading: false,
      coverImageRadio: 1,
      routerFrom: '',
      contentImgArr: [],
      fetchTagLoading: false,
      editor: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.routerFrom = from.path
    })
  },
  created () {
    let _vue = this
    if (_vue.id !== '') {
      _vue.fetchDetail()
    }
  },
  mounted () {
    let _vue = this
    if (_vue.id === '') {
      // 新增新闻初始化
      window.setTimeout(() => {
        _vue.initCkeditor()
      }, 500)
    }
  },
  methods: {
    remoteFetchuserName (query) {
      let _vue = this
      if (!_vue.fetchUserNameLoading && query !== '') {
        _vue.fetchUserNameLoading = true
        _vue.$http.get('/api/v1.0/news/aggregate/authors?mobile=' + query).then((response) => {
          let data = response.data.data.authors
          _vue.fetchUserNameLoading = false
          _vue.uesrNameOpts = data
        })
      }
    },
    initCkeditor (content) {
      let _vue = this
      window.ClassicEditor
        .create(document.querySelector('#editor'), {
          removePlugins: ['MediaEmbed', 'Table']
        })
        .then(editor => {
          if (content) {
            editor.setData(content)
          }
          _vue.editor = editor
          // 上传图片
          editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            console.log('FileRepository')
            console.log(loader)
            return new MyUploadAdapter(loader)
          }
        })
        .catch(error => {
          _vue.$message({
            type: 'warn',
            message: '编辑器初始化失败，请刷新页面或联系管理员',
            center: true,
            showClose: true
          })
          console.error(error)
        })
    },
    remoteFetchTag (query) {
      let _vue = this
      if (!_vue.fetchTagLoading && query !== '') {
        _vue.fetchTagLoading = true
        _vue.$http.get('/api/v1.0/news/tag/options?page=1&per_page=20&text=' + query).then((response) => {
          _vue.fetchTagLoading = false
          _vue.tagsOpts = _.sortBy(response.data.data.rows, 'id')
        })
      }
    },
    fetchDetail () {
      // 编辑信息回显
      let _vue = this
      _vue.$http.get(`/api/v1.0/news/aggregate/${_vue.id}/expo`).then((response) => {
        _vue.form = response.data.data.seminar
        console.log('编辑信息回显', _vue.form)
        if (_vue.form.tags) {
          _vue.tagArr = _vue.form.tags.split(',')
        }
        if (_vue.form.contentTags) {
          _vue.contentTagArr = _vue.form.contentTags.split(',')
        }
        _vue.form.isShow = parseInt(_vue.form.isShow || 0)
        // 回显图片
        _vue.uploadData.key = _vue.form.preImg || ''
        _vue.uploadedImageUrl = _vue.form.preImg || ''
        _vue.uploadDataShareImg.key = _vue.form.preImgThumb || ''
        _vue.uploadedShareImgUrl = _vue.form.preImgThumb || ''
        _vue.userArr = _vue.form.lectureName
        _vue.uesrNameOpts = [{userName: _vue.form.lectureName, userId: _vue.form.lectureId}]
        // 回显富文本编辑
        _vue.$nextTick(() => {
          _vue.initCkeditor(_vue.form.briefIntroduction)
        })
      })
    },
    beforeUploadShareImg (file) {
      let _vue = this
      if (file.size / 1024 / 1024 >= 10) {
        this.$message({
          type: 'error',
          message: '图片大小需小于10M，请重新上传',
          center: true,
          showClose: true
        })
        return false
      } else if (['image/jpeg', 'image/png', 'image/gif'].indexOf(file.type) === -1) {
        this.$message({
          type: 'error',
          message: '图片格式只支持jpg,jpeg,png,gif，请重新上传',
          center: true,
          showClose: true
        })
        return false
      } else {
        let arr = Global.splitFileName(file.name)
        let key = 'news/share/' + (new Date().getTime()) + '_' + Global.base64Encode(arr[0]) + '.' + arr[1]
        return _vue.$http.post('/api/v1.0/qiniu/token/img?bucket=moore', {
          type: 1
        }).then(response => {
          _vue.uploadDataShareImg.token = response.data.data.token
          _vue.uploadDataShareImg.key = key
        })
      }
    },
    uploadProgressShareImg () {
      this.uploadingShareImg = true
    },
    uploadSuccessShareImg (res, file) {
      this.uploadingShareImg = false
      this.uploadedShareImgUrl = file.response.key
    },
    uploadErrorShareImg () {
      this.uploadingShareImg = false
      this.$message({
        type: 'error',
        message: '文件上传失败，请稍后重试',
        center: true,
        showClose: true
      })
    },
    beforeUpload (file) {
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
        let arr = Global.splitFileName(file.name)
        let key = 'news/head/' + (new Date().getTime()) + '_' + Global.base64Encode(arr[0]) + '.' + arr[1]
        return _vue.$http.post('/api/v1.0/qiniu/token/img?bucket=moore', {
          type: 1
        }).then(response => {
          _vue.uploadData.token = response.data.data.token
          _vue.uploadData.key = key
        })
      }
    },
    uploadProgress () {
      this.uploading = true
    },
    uploadSuccess (res, file) {
      this.uploading = false
      this.uploadedImageUrl = file.response.key
    },
    uploadError () {
      this.uploading = false
      this.$message({
        type: 'error',
        message: '文件上传失败，请稍后重试',
        center: true,
        showClose: true
      })
    },
    saveOperate () {
      // 保存并发表 区分新增或是编辑
      let _vue = this
      if (_vue.uploadData.key === '') {
        _vue.$message({
          type: 'warning',
          message: '请上传自定义封面图或使用文章中图片',
          center: true
        })
        return
      }
      _vue.form.lectureName = _vue.uesrNameOpts[0].userName
      _vue.form.lectureId = _vue.uesrNameOpts[0].userId
      if (_vue.id === '' || _vue.id === null) {
        // 新增新闻
        _vue.$http.put(`/api/v1.0/news/aggregate/${_vue.topicId}/expo`, {
          id: _vue.id,
          title: _vue.form.title,
          briefIntroduction: _vue.editor.getData() || '',
          signature: _vue.form.signature,
          mediaPlayer: _vue.form.mediaPlayer,
          lectureName: _vue.form.lectureName,
          lectureId: _vue.form.lectureId,
          preImg: _vue.uploadData.key,
          preImgThumb: _vue.uploadDataShareImg.key,
          tags: _vue.tagArr.toString(),
          contentTags: _vue.contentTagArr.toString(),
          isShow: _vue.form.isShow + ''
        }).then(() => {
          _vue.$message({
            type: 'success',
            message: '保存成功',
            center: true
          })
          _vue.forwardList()
        })
      } else {
        // 编辑新闻
        _vue.$http.put(`/api/v1.0/news/aggregate/${_vue.topicId}/expo`, {
          id: _vue.id,
          title: _vue.form.title,
          briefIntroduction: _vue.editor.getData() || '',
          signature: _vue.form.signature,
          preImg: _vue.uploadData.key,
          mediaPlayer: _vue.form.mediaPlayer,
          preImgThumb: _vue.uploadDataShareImg.key,
          lectureName: _vue.form.lectureName,
          lectureId: _vue.form.lectureId,
          tags: _vue.tagArr.toString(),
          contentTags: _vue.contentTagArr.toString(),
          isShow: _vue.form.isShow + ''
        }).then(() => {
          _vue.$message({
            type: 'success',
            message: '保存成功',
            center: true
          })
          _vue.forwardList()
        })
      }
    },
    cancelOperate () {
      // 根据 page from 判断返回到哪里
      this.forwardList()
    },
    forwardList () {
      this.$router.go(-1)
      // if (this.routerFrom !== '') {
      //   this.$router.push({
      //     path: this.routerFrom
      //   })
      // } else {
      //   this.$router.push({
      //     path: '/news/course/library'
      //   })
      // }
    },
    back () {
      this.$router.push({
        path: '/news/course/library?id=' + this.topicId
      })
    },
    extractImg () {
      // 提取新闻内容中的图片
      let _vue = this
      let contentDom = document.createElement('div')
      contentDom.innerHTML = _vue.editor.getData() || ''
      contentDom.setAttribute('id', 'contentContainer')
      let imgDomList = contentDom.querySelectorAll('img')
      _.each(imgDomList, (item) => {
        if (item.src !== '') {
          _vue.contentImgArr.push(item.src)
        }
      })
    }
  }
}
</script>

<!-- 样式有冲突，单独对富文本编辑器样式重置 -->
<style lang="scss">
  .ckeditor-container {
    .ck-content {
      padding: 20px;
      min-height: 300px;
    }
    h2, h3, h4 {
      display: block;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
      font-weight: bold;
    }
    h2 {
      font-size: 1.5em;
      margin-block-start: 0.83em;
      margin-block-end: 0.83em;
    }
    h3 {
      font-size: 1.17em;
      margin-block-start: 1em;
      margin-block-end: 1em;
    }
    h4 {
      margin-block-start: 1.33em;
      margin-block-end: 1.33em;
    }
    ul {
      list-style-type: disc;
      margin: 0;
    }
    ol {
      list-style-type: decimal;
      margin: 0;
    }
    * {
      line-height: 1.5em;
    }
    p {
      margin-bottom: 1.3em;
    }
    a {
      text-decoration: underline;
    }
  }
</style>
<style lang="scss" scoped>
  @import "~assets/css/variable";

  .head-wrap {
    margin-bottom: 30px;
  }
  .list-title {
    font-size: 18px;
    margin-bottom: 20px;
  }
  .upload-image {
    &.cover-img {
      width: 200px;
      height: 150px;
    }
    &.share-img {
      width: 200px;
      height: 200px;
    }
  }
  .image-pick-wrap {
    margin-top: 20px;
    .radio-item {
      margin-top: 10px;
    }
  }
</style>
