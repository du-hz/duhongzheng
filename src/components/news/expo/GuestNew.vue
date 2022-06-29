<template>
  <div>
    <div class="main-line-title">{{id === '' ? '新增嘉宾' : '编辑嘉宾'}}</div>
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="嘉宾名称" required>
        <el-input v-model="form.guestName" placeholder="不超过60个字符" maxlength="60"></el-input>
        <div class="time-show" v-if="form.createTime">
          <p>创建时间：{{form.createTime | filterDateformat}}</p>
        </div>
      </el-form-item>
      <el-form-item label="嘉宾Title" >
        <el-input v-model="form.guestTitle" maxlength="60" placeholder="请输入嘉宾title"></el-input>
      </el-form-item>
      <el-form-item label="封面头像" required>
        <el-row :gutter="20">
          <el-col :span="10">
            <!-- 封面图 -->
            <div class="cover-img-wrap">
              <img class="upload-image cover-img" v-if="uploadedImageUrl" :src="uploadedImageUrl | filterQiniuMooreImage" alt="">
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
                <el-button type="primary" size="small" :disabled="uploading">{{uploading ? '正在上传...' : '上传嘉宾头像'}}</el-button>
                <span class="img-tip">尺寸：400*400</span>
              </el-upload>
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="嘉宾介绍" >
        <!-- <vue-ckeditor v-model="form.content" :config="ckeditorConfig"></vue-ckeditor> -->
        <el-input v-model="form.content" placeholder="不超过60个字符" type="textarea" :rows="6"></el-input>
      </el-form-item>
      <el-form-item label="外显标签" required>
        <el-select
          style="width: 100%"
          v-model="tagArr"
          multiple
          filterable
          remote
          reserve-keyword
          allow-create
          default-first-option
          :multiple-limit="5"
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
      <el-form-item label="其余标签" required>
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
      <el-form-item label="是否显示" required>
        <el-radio-group v-model="form.display">
          <el-radio :label="1">不显示</el-radio>
          <el-radio :label="0">显示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveGuest">保存</el-button>
        <el-button @click="cancelOperate">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Global from 'assets/js/global'
import _ from 'underscore'

export default {
  name: 'guestNew',
  data () {
    return {
      id: (this.$route.query && this.$route.query.id) || '',
      tagsOpts: [],
      form: {
        guestName: '',
        guestTitle: '',
        display: 0,
        content: '',
        createTime: ''
      },
      tagArr: [],
      contentTagArr: [],
      uploading: false, // 封面图上传状态
      uploadedImageUrl: '', // 封面图地址
      uploadData: { // 封面图组件数据
        key: '',
        token: ''
      },
      ckeditorConfig: {
        toolbarGroups: [
          { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
          { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
          { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
          { name: 'forms', groups: [ 'forms' ] },
          { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
          { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
          { name: 'links', groups: [ 'links' ] },
          { name: 'insert', groups: [ 'insert' ] },
          { name: 'styles', groups: [ 'styles' ] },
          { name: 'colors', groups: [ 'colors' ] },
          { name: 'tools', groups: [ 'tools' ] }
        ],
        height: 500
      }
    }
  },
  computed: {
  },
  mounted () {
    if (this.id) {
      this.getDetail()
    }
  },
  created () {
  },
  methods: {
    remoteFetchTag (query) { // 获取标签列表
      let _vue = this
      if (!_vue.fetchTagLoading && query !== '') {
        _vue.fetchTagLoading = true
        _vue.$http.get('/api/v1.0/news/tag/options?page=1&per_page=20&text=' + query).then((response) => {
          _vue.fetchTagLoading = false
          _vue.tagsOpts = _.sortBy(response.data.data.rows, 'id')
        })
      }
    },
    // 图片开始
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
          message: '图片格式只支持jpg,jpeg,png,gif,请重新上传',
          center: true
        })
        return false
      } else {
        let arr = Global.splitFileName(file.name)
        let key = 'expo/org/' + (new Date().getTime()) + '_' + Global.base64Encode(arr[0]) + '.' + arr[1]
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
    // 图片为止
    saveGuest () {
      // 保存嘉宾
      if (!this.form.guestName) {
        this.$message.warning('嘉宾名称不得为空')
        return
      } else if (!this.uploadedImageUrl) {
        this.$message.warning('嘉宾头像不得为空')
        return
      } else if (!this.tagArr.length) {
        this.$message.warning('外显标签不得为空')
        return
      } else if (!this.contentTagArr.length) {
        this.$message.warning('其余标签不得为空')
        return
      }
      let data = {
        name: this.form.guestName,
        title: this.form.guestTitle,
        profiles: this.form.content,
        avatar: this.uploadedImageUrl,
        isShow: this.form.display,
        tags: this.tagArr.toString(),
        contentTags: this.contentTagArr.toString()
      }
      let url = '/api/v1.0/expo/guest/add_guest'
      if (this.id) {
        data.id = this.id
        url = '/api/v1.0/expo/guest/update_guest'
      }
      this.$http.post(url, data).then(() => {
        this.$message({
          type: 'success',
          message: '保存成功',
          center: true
        })
        this.$router.push({
          path: '/news/expo/guest'
        })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    cancelOperate () {
      // 取消返回
      this.$router.push({
        path: '/news/expo/guest'
      })
    },
    getDetail () {
      this.$http.post('/api/v1.0/expo/guest/guest_detail', {id: this.id}).then((res) => {
        console.log(res)
        if (res.data.data) {
          this.form.guestName = res.data.data.row.name || ''
          this.form.guestTitle = res.data.data.row.title || ''
          this.form.content = res.data.data.row.profiles || ''
          this.form.display = res.data.data.row.isShow || 0
          this.uploadedImageUrl = res.data.data.row.avatar || ''
          this.form.createTime = res.data.data.row.createTime
          this.tagArr = res.data.data.row.tags ? res.data.data.row.tags.split(',') : []
          this.contentTagArr = res.data.data.row.contentTags ? res.data.data.row.contentTags.split(',') : []
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '获取详情失败',
          center: true
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";

  .list-title {
    font-size: 18px;
    margin-bottom: 20px;
  }
  .upload-image {
    &.cover-img {
      max-width: 200px;
      max-height: 200px;
    }
    &.share-img {
      max-width: 200px;
      max-height: 200px;
    }
  }
  .image-pick-wrap {
    margin-top: 20px;
    .radio-item {
      margin-top: 10px;
    }
  }
  .news-list {
    .list-search-wrap {
      margin-bottom: 20px;
      border-bottom: none;
    }
  }
  .action-icon {
    font-size: 18px;
    cursor: pointer;
  }
  .topic-related-container {
    > .el-row {
      margin: 0 !important;
    }
  }
</style>
