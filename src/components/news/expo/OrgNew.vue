<template>
  <div>
    <div class="main-line-title">{{id === '' ? '新增机构' : '编辑机构'}}</div>
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="机构名称" required>
        <el-input v-model="form.title" placeholder="不超过30个字符" maxlength="30"></el-input>
        <div class="time-show" v-if="form.createTime">
          <p>创建时间：{{form.createTime | filterDateformat}}</p>
        </div>
      </el-form-item>
      <el-form-item label="一句话介绍">
        <el-input v-model="form.introduction" maxlength="30" placeholder="请输入机构一句话介绍"></el-input>
      </el-form-item>
      <el-form-item label="服务范围">
        <el-input v-model="form.serviceArea" maxlength="30" placeholder="不超过30个字符"></el-input>
      </el-form-item>
      <el-form-item label="联系电话">
        <!-- <el-input v-model="form.mobile" maxlength="30" placeholder="请输入机构联系电话,最多输入两个"></el-input> -->
        <el-select
          style="width: 100%"
          v-model="form.mobile"
          multiple
          filterable
          remote
          reserve-keyword
          allow-create
          default-first-option
          :multiple-limit="2"
          placeholder="请输入机构联系电话,最多输入两个">
          <el-option
            v-for="item in []"
            :key="item.id"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系邮箱">
        <!-- <el-input v-model="form.email" maxlength="30" placeholder="请输入机构联系邮箱,最多输入两个"></el-input> -->
        <el-select
          style="width: 100%"
          v-model="form.email"
          multiple
          filterable
          remote
          reserve-keyword
          allow-create
          default-first-option
          :multiple-limit="2"
          placeholder="请输入机构联系电话,最多输入两个">
          <el-option
            v-for="item in []"
            :key="item.id"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="封面图">
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
                <el-button type="primary" size="small" :disabled="uploading">{{uploading ? '正在上传...' : '上传机构封面'}}</el-button>
                <span class="img-tip">尺寸：400*400</span>
              </el-upload>
            </div>
          </el-col>
        </el-row>
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
          placeholder="最多输入5个"
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
          placeholder="可无限添加"
          :remote-method="remoteFetchTag">
          <el-option
            v-for="item in tagsOpts"
            :key="item.id"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="报名跳转">
        <el-input v-model="form.websiteAddress" placeholder="请输入报名跳转地址" maxlength="60"></el-input>
      </el-form-item>
      <el-form-item label="是否显示">
        <el-select v-model="form.display" placeholder="请选择">
          <el-option label="不显示" :value="1"></el-option>
          <el-option label="显示" :value="0"></el-option>
        </el-select>
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
        title: '',
        introduction: '',
        serviceArea: '',
        mobile: [],
        email: [],
        display: 0,
        createTime: '',
        websiteAddress: ''
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
      // 保存机构
      if (!this.form.title) {
        this.$message.warning('机构名称不得为空')
        return
      } else if (this.form.title.indexOf(',') !== -1) {
        this.$message.warning('机构名称不允许带有逗号')
        return
      } else if (!this.tagArr.length) {
        this.$message.warning('外显标签不得为空')
        return
      } else if (!this.contentTagArr.length) {
        this.$message.warning('其余标签不得为空')
        return
      }
      let data = {
        title: this.form.title,
        introduction: this.form.introduction,
        serviceArea: this.form.serviceArea,
        mobile: this.form.mobile.join(','),
        email: this.form.email.join(','),
        websiteAddress: this.form.websiteAddress,
        isShow: this.form.display,
        logo: this.uploadedImageUrl,
        tags: this.tagArr.toString(),
        contentTags: this.contentTagArr.toString()
      }
      let url = '/api/v1.0/expo/organization/add_organization'
      if (this.id) {
        data.id = this.id
        url = '/api/v1.0/expo/organization/update_organization'
      }
      this.$http.post(url, data).then(() => {
        this.$message({
          type: 'success',
          message: '保存成功',
          center: true
        })
        this.$router.push({
          path: '/news/expo/org'
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
        path: '/news/expo/org'
      })
    },
    getDetail () {
      this.$http.post('/api/v1.0/expo/organization/organization_detail', {id: this.id}).then((res) => {
        console.log(res)
        if (res.data.data) {
          this.form.title = res.data.data.row.title || ''
          this.form.introduction = res.data.data.row.introduction || ''
          this.form.serviceArea = res.data.data.row.serviceArea || ''
          this.form.mobile = res.data.data.row.mobile ? res.data.data.row.mobile.split(',') : []
          this.form.email = res.data.data.row.email ? res.data.data.row.email.split(',') : []
          this.form.websiteAddress = res.data.data.row.websiteAddress || ''
          this.form.display = res.data.data.row.isShow || 0
          this.uploadedImageUrl = res.data.data.row.logo || ''
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
