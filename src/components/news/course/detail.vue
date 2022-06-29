<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px" style="width: 70%">
      <div class="list-title">{{title}} ＞ 课程详情</div>
      <div class="time-show">
        <p>创建时间：{{form.createTime}}</p>
      </div>
      <div class="clickBack">
        <div @click="back">
          返回
        </div>
        <div @click="goEdit">
          编辑
        </div>
      </div>
      <div class="time-show">
        <p>课程名称：{{form.title}}</p>
      </div>
      <div class="time-show">
        <p>主讲人：{{form.lectureName}}</p>
      </div>
      <div class="time-show">
        <p>描述：{{form.signature}}</p>
      </div>
      <div class="time-show">
        <p>封面图：</p><img class="upload-image cover-img" v-if="uploadedImageUrl !== ''" :src="uploadedImageUrl | filterQiniuMooreImage" alt="">
        <p>分享图：</p><img class="upload-image share-img" v-if="uploadedShareImgUrl !== ''" :src="uploadedShareImgUrl | filterQiniuMooreImage" alt="">
      </div>
      <div class="time-show">
        <p>课程路径：<a :href="form.mediaPlayer" target='_blank'>{{form.mediaPlayer}}</a></p>
      </div>
      <div class="time-show">
        <p>课程内容：</p>
        <div class="content">
          <div v-html="form.briefIntroduction"></div>
        </div>
      </div>
      <div class="time-show">
        <p>外显标签：</p>
        <span v-for="(item, index) in tagArr" :key="index">{{item}}</span>
      </div>
      <div class="time-show">
        <p>其余标签：</p>
        <span v-for="(item, index) in contentTagArr" :key="index">{{item}}</span>
      </div>
      <div class="time-show">
        <p>展示状态：</p>
        <span>{{form.isShow === 1 ? '展示' : '不展示'}}</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import Global from 'assets/js/global'
import _ from 'underscore'
export default {
  data () {
    return {
      title: (this.$route.query && this.$route.query.title) || '课程库',
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
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    goEdit () {
      this.$router.push({
        path: `/news/course/detail?id=${this.id}&topicId=${this.topicId}`
      })
    },
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

  .clickBack{
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #c9cbd1;
    display: flex;
    justify-content: flex-start;
    margin: 20px 0;
    >div {
      width: 100px;
      height: 30px;
      font-size: 14px;
      text-align: center;
      line-height: 30px;
      margin-right: 20px;
      border: 1px solid #c9cbd1;
      cursor: pointer;
    }
    >div:hover {
      color: #409EFF;
      border-color: #409EFF;
    }
  }
  .time-show {
    margin: 10px 0;
    display: flex;
    justify-content: flex-start;
    img{
      margin-right: 50px;
    }
  }
  .head-wrap {
    margin-bottom: 30px;
  }
  .list-title {
    font-size: 16px;
    margin-bottom: 20px;
    height: 30px;
    line-height: 30px;
    font-weight: 600;
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
