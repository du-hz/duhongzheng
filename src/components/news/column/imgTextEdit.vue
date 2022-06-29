<template>
  <div>
    <div class="head-wrap">
      <span class="text-link" @click="back">&lt;&lt; 返回列表</span>
    </div>
    <div class="main-line-title">{{id === '' ? '图文新增' : '图文编辑'}}</div>
    <el-form ref="form" :model="form" label-width="80px" style="width: 70%">
      <el-form-item label="图文名称">
        <el-input v-model="form.title" placeholder="不超过60个字符" maxlength="60"></el-input>
        <div class="time-show" v-if="id !== ''">
          <p>创建时间：{{form.createTimeText}}</p>
          <p>审核时间：{{form.releaseTimeText}}</p>
        </div>
      </el-form-item>
      <el-form-item label="作者">
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
      <el-form-item label="来源">
        <el-input v-model="form.source"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" :rows="5" v-model="form.description" maxlength="100" placeholder="不超过100个字符"></el-input>
      </el-form-item>
      <!-- <el-form-item label="图文类型">
        <el-select placeholder="请选择类型" v-model="form.newsTypeId" style="width: 100%">
          <el-option
            v-for="(item, index) in contentNewsTypeOpts"
            :key="index"
            :value="item.id"
            :label="'频道ID ' + item.id + ' —— ' + item.pcName + '(PC)、' + item.wxName + '(移动站)、' + item.appName + '(APP)'">
            <span>频道ID {{item.id}} —— {{item.pcName}}(PC)、{{item.wxName}}(移动站)、{{item.appName}}(APP)</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图文分类">
        <el-select placeholder="请选择分类" v-model="form.newsTypeId" style="width: 100%">
          <el-option
            v-for="(item, index) in contentNewsTypeOpts"
            :key="index"
            :value="item.id"
            :label="'频道ID ' + item.id + ' —— ' + item.pcName + '(PC)、' + item.wxName + '(移动站)、' + item.appName + '(APP)'">
            <span>频道ID {{item.id}} —— {{item.pcName}}(PC)、{{item.wxName}}(移动站)、{{item.appName}}(APP)</span>
          </el-option>
        </el-select>
      </el-form-item> -->
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
      <el-form-item label="内容">
        <!--<vue-ckeditor v-model="form.content" :config="ckeditorConfig"></vue-ckeditor>-->
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
        <el-radio-group v-model="form.recommendStatus">
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
        description: '',
        content: '',
        source: '',
        author: '',
        externalLink: '',
        recommendStatus: 0,
        newsTypeId: [],
        contentTagIds: '',
        tagIds: ''
      },
      contentTagArr: [], // 其他标签名称
      tagArr: [], // 外显标签名称
      contentNewsTypeOpts: [],
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
    _vue.fetchContentNewsType()
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
    fetchContentNewsType () {
      // 获取新闻频道
      let _vue = this
      _vue.$http.get('/api/v1.0/news/channel/list').then((response) => {
        _vue.contentNewsTypeOpts = response.data.data.pc
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
      _vue.$http.get('/api/v1.0/news/content/detail/' + _vue.id).then((response) => {
        _vue.form = response.data.data
        if (_vue.form.tags) {
          _vue.tagArr = _vue.form.tags.split(',')
        }
        if (_vue.form.contentTags) {
          _vue.contentTagArr = _vue.form.contentTags.split(',')
        }
        _vue.form.recommendStatus = parseInt(_vue.form.recommendStatus || 0)
        // 回显图片
        _vue.uploadData.key = _vue.form.headImg || ''
        _vue.uploadedImageUrl = _vue.form.headImg || ''
        _vue.uploadDataShareImg.key = _vue.form.shareImg || ''
        _vue.uploadedShareImgUrl = _vue.form.shareImg || ''
        _vue.coverImageRadio = _vue.form.headImgType || 1
        _vue.userArr = _vue.form.author
        _vue.uesrNameOpts = [{userName: _vue.form.author, userId: _vue.form.relatedUserId}]
        // 回显富文本编辑
        _vue.$nextTick(() => {
          _vue.initCkeditor(_vue.form.content)
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
      // 如果选择的频道ID是1，即 今天热点 频道，默认选中推荐
      if (_vue.form.newsTypeId === 1) {
        _vue.form.recommendStatus = 1
      }
      let appHeadImg = ''
      let headImg = ''
      if (_vue.coverImageRadio === 2) {
        // 提取内容中的图片, 如果 head_img 有值，则 app_head_img 也保存一个值
        // 如果app_head_img有值，head_img使用第一张图入库
        _vue.extractImg()
        if (_vue.contentImgArr.length === 0) {
          _vue.$message({
            type: 'warning',
            message: '文章中没有图片，请选择并上传自定义封面图',
            center: true
          })
          return
        } else {
          appHeadImg = _vue.contentImgArr.toString()
          headImg = _vue.uploadData.key
        }
      } else {
        if (_vue.uploadData.key === '') {
          _vue.$message({
            type: 'warning',
            message: '请上传自定义封面图或使用文章中图片',
            center: true
          })
          return
        } else {
          _vue.extractImg()
          appHeadImg = _vue.contentImgArr.toString()
          headImg = _vue.uploadData.key
        }
      }
      _vue.form.author = _vue.uesrNameOpts[0].userName
      if (_vue.id === '' || _vue.id === null) {
        // 新增新闻
        _vue.$http.put(`/api/v1.0/news/aggregate/${this.topicId}/edit_news`, {
          id: _vue.id,
          title: _vue.form.title,
          content: _vue.editor.getData() || '',
          description: _vue.form.description,
          appHeadImg: appHeadImg,
          headImg: headImg,
          shareImg: _vue.uploadDataShareImg.key,
          author: _vue.form.author,
          source: _vue.form.source,
          tags: _vue.tagArr.toString(),
          contentTags: _vue.contentTagArr.toString(),
          recommendStatus: _vue.form.recommendStatus + ''
        }).then(() => {
          _vue.$message({
            type: 'success',
            message: '保存成功',
            center: true
          })
          _vue.forwardList()
        }).catch(() => {
          _vue.$message({
            type: 'error',
            message: '保存失败',
            center: true
          })
        })
      } else {
        // 编辑新闻
        _vue.$http.put(`/api/v1.0/news/aggregate/${this.topicId}/edit_news`, {
          id: _vue.id,
          title: _vue.form.title,
          content: _vue.editor.getData() || '',
          description: _vue.form.description,
          headImg: headImg,
          shareImg: _vue.uploadDataShareImg.key,
          author: _vue.form.author,
          source: _vue.form.source,
          tags: _vue.tagArr.toString(),
          contentTags: _vue.contentTagArr.toString(),
          recommendStatus: _vue.form.recommendStatus + ''
        }).then(() => {
          _vue.$message({
            type: 'success',
            message: '保存成功',
            center: true
          })
          _vue.forwardList()
        }).catch(() => {
          _vue.$message({
            type: 'error',
            message: '保存失败',
            center: true
          })
        })
      }
    },
    cancelOperate () {
      // 根据 page from 判断返回到哪里
      this.forwardList()
    },
    forwardList () {
      this.$router.push({
        path: '/news/zhuanlan/imgText?id=' + this.topicId
      })
    },
    back () {
      this.forwardList()
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
