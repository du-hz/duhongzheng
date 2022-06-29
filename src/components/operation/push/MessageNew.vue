<template>
  <div>
    <div class="head-wrap">
      <span class="text-link" @click="back">&lt;&lt; 返回</span>
    </div>
    <div class="main-line-title">{{title}}</div>
    <el-form ref="form" :model="form" label-width="100px" style="width: 70%">
      <el-form-item label="消息名称">
        <el-input v-model="form.title" maxlength="60" placeholder="不超过60个字符"></el-input>
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="form.author"></el-input>
      </el-form-item>
      <el-form-item label="消息描述">
        <el-input type="textarea" :rows="5" v-model="form.content" maxlength="100" placeholder="不超过100个字符"></el-input>
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
      </el-form-item>
      <el-form-item label="链接类型">
        <el-radio-group v-model="form.msgJumpType">
          <el-radio :label="1">H5外链</el-radio>
          <el-radio :label="2">App内页</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="跳转地址">
        <el-input v-model="form.action" placeholder="请输入跳转页面活动ID/新闻ID/链接地址"></el-input>
      </el-form-item>
      <el-form-item label="跳转外部链接">
        <el-input v-model="form.h5Url" placeholder="请输入H5链接地址"></el-input>
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
          <el-radio :label="1">展示</el-radio>
          <el-radio :label="0">不展示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveOperate">提交</el-button>
        <el-button @click="cancelOperate">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Global from 'assets/js/global'
import _ from 'underscore'
export default {
  data () {
    return {
      id: (this.$route.query && this.$route.query.id) || '',
      tagsOpts: [],
      title: '',
      form: {
        msgType: '',
        title: '',
        content: '',
        author: '',
        msgJumpType: 2,
        h5Url: '',
        action: '',
        displayTags: '',
        tags: '',
        isShow: 1
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
      routerFrom: '',
      fetchTagLoading: false
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
    if (this.$route.query) {
      if (this.$route.query.msgtype === 'system') {
        if (this.$route.query.id) {
          _vue.title = '编辑系统消息'
        } else {
          _vue.title = '新建系统消息'
        }
      } else if (this.$route.query.msgtype === 'chance') {
        if (this.$route.query.id) {
          _vue.title = '编辑机会消息'
        } else {
          _vue.title = '新建机会消息'
        }
      }
    } else {
      _vue.title = ''
    }
    if (_vue.id !== '') {
      _vue.fetchDetail()
    }
  },
  methods: {
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
      _vue.$http.get('/api/v1.0/message/' + _vue.id).then((response) => {
        _vue.form = response.data.data
        if (_vue.form.tags) {
          _vue.tagArr = _vue.form.displayTags.split(',')
        }
        if (_vue.form.contentTags) {
          _vue.contentTagArr = _vue.form.tags.split(',')
        }
        _vue.form.isShow = parseInt(_vue.form.isShow || 0)
        if (_vue.form.msgType === 1) {
          _vue.title = '编辑系统消息'
        } else if (_vue.form.msgType === 2) {
          _vue.title = '编辑机会消息'
        }
        // 回显图片
        _vue.uploadData.key = _vue.form.img || ''
        _vue.uploadedImageUrl = _vue.form.img || ''
        _vue.uploadDataShareImg.key = _vue.form.shareImg || ''
        _vue.uploadedShareImgUrl = _vue.form.shareImg || ''
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
        let key = 'message/share/' + (new Date().getTime()) + '_' + Global.base64Encode(arr[0]) + '.' + arr[1]
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
        let key = 'message/cover/' + (new Date().getTime()) + '_' + Global.base64Encode(arr[0]) + '.' + arr[1]
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
      let msgType = 1
      if (_vue.$route.query && _vue.$route.query.msgtype === 'system') {
        msgType = 1
      } else if (_vue.$route.query && _vue.$route.query.msgtype === 'chance') {
        msgType = 2
      }
      if (_vue.id === '' || _vue.id === null) {
        // 新增消息
        _vue.$http.post('/api/v1.0/message', {
          msgType: msgType,
          title: _vue.form.title,
          content: _vue.form.content,
          img: _vue.uploadData.key,
          shareImg: _vue.uploadDataShareImg.key,
          author: _vue.form.author,
          displayTags: _vue.tagArr.toString(),
          tags: _vue.contentTagArr.toString(),
          msgJumpType: _vue.form.msgJumpType + '',
          h5Url: _vue.form.h5Url,
          action: _vue.form.action,
          isShow: _vue.form.isShow + ''
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
        // 编辑消息
        _vue.$http.put('/api/v1.0/message/' + _vue.id, {
          id: _vue.id,
          msgType: msgType,
          title: _vue.form.title,
          content: _vue.form.content,
          img: _vue.uploadData.key,
          shareImg: _vue.uploadDataShareImg.key,
          author: _vue.form.author,
          displayTags: _vue.tagArr.toString(),
          tags: _vue.contentTagArr.toString(),
          msgJumpType: _vue.form.msgJumpType + '',
          h5Url: _vue.form.h5Url,
          action: _vue.form.action,
          isShow: _vue.form.isShow + ''
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
      if (this.routerFrom !== '') {
        this.$router.push({
          path: this.routerFrom
        })
      } else {
        this.$router.push({
          path: '/operation/push/list'
        })
      }
    },
    back () {
      this.forwardList()
    }
  }
}
</script>

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
