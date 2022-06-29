<template>
  <div>
    <div class="head-wrap">
    </div>
    <el-form ref="form" :model="form" label-width="80px" style="width: 70%">
    <div class="list-title">{{form.title}}</div>
      <div class="time-show">
        <p>图文作者: {{userArr}}</p>
      </div>
      <div class="time-show">
        <p>图文发布时间: {{form.createTimeText}}</p>
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
        <p>来源: {{form.source}}</p>
      </div>
      <div class="time-show">
        <p>图文描述: {{form.description}}</p>
      </div>
      <div class="time-show">
        <p>封面图：</p><img class="upload-image cover-img" v-if="form.headImg !== ''" :src="form.headImg | filterQiniuMooreImage" alt="">
        <p>分享图：</p><img class="upload-image share-img" v-if="form.shareImg !== ''" :src="form.shareImg | filterQiniuMooreImage" alt="">
      </div>
      <div class="time-show">
        <p>外显标签：{{form.tags}}</p>
      </div>
      <div class="time-show">
        <p>其余标签：{{form.contentTags}}</p>
      </div>
      <div class="time-show">
        <p>展示状态：</p>
        <span>{{form.recommendStatus === 1 ? '展示' : '不展示'}}</span>
      </div>
      <div class="time-show">
        <p>内容：</p>
        <div class="content">
          <div v-html="form.content"></div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import _ from 'underscore'
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
      })
    },
    back () {
      this.$router.go(-1)
    },
    goEdit () {
      this.$router.push({
        path: `/news/zhuanlan/imgText/Edit?id=${this.id}&topicId=${this.topicId}`
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
    font-size: 16px;
    margin-bottom: 20px;
    font-weight: 600
  }
  .time-show {
    margin: 15px 0;
    display: flex;
    justify-content: flex-start;
    img{
      margin-right: 50px;
    }
    .content{
      width: 80%;
      min-height: 200px;
    }
  }
  .clickBack{
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #c9cbd1;
    display: flex;
    justify-content: flex-start;
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
