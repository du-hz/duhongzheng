<template>
  <div>
    <div class="head-wrap" style="margin-bottom:20px">
      <span class="text-link" @click="back">&lt;&lt; 返回列表</span>
    </div>
    <div class="main-line-title">{{id === '' ? '新增课程' : '课程信息编辑'}}</div>
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="课程名称">
        <el-input v-model="form.title" placeholder="不超过60个字符" maxlength="60"></el-input>
        <div class="time-show" v-if="id !== ''">
          <p v-if="form.createTimeText">创建时间：{{form.createTimeText}}</p>
          <p v-if="form.modifyTimeText">编辑时间：{{form.modifyTimeText}}</p>
        </div>
      </el-form-item>
      <!-- <el-form-item label="授课人" class="row-item">
        <el-input v-model="form.title" maxlength="10" placeholder="请输入授课人名称"></el-input>
        <el-input v-model="form.title" maxlength="10" placeholder="请输入主讲人title"></el-input>
      </el-form-item> -->
      <el-form-item label="描述">
        <el-input v-model="form.description" maxlength="20" placeholder="请输入课程一句话优势"></el-input>
      </el-form-item>
      <!-- <el-form-item label="课程分类">
        <el-select v-model="form.type" placeholder="请选择课程分类">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="form.description" maxlength="20" placeholder="预计总课时"></el-input>节
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
                <el-button type="primary" size="small" :disabled="uploading">{{uploading ? '正在上传...' : '上传封面图'}}</el-button>
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
                <el-button type="primary" size="small" :disabled="uploadingShareImg">{{uploadingShareImg ? '正在上传...' : '上传分享图'}}</el-button>
                <span class="img-tip">尺寸：200*200</span>
              </el-upload>
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="课程售价">
        <el-input v-model="form.price" maxlength="10" placeholder="请输入课程售价" style="width:300px"></el-input>元
      </el-form-item>
      <!-- <el-form-item label="课程有效期">
        <el-select v-model="form.payType" placeholder="请选择">
          <el-option
            v-for="item in payTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker
          v-model="value1"
          type="date"
          placeholder="请选择限时截止日期">
        </el-date-picker>
      </el-form-item> -->
      <el-form-item label="课程标签">
        <el-select
          style="width: 100%"
          v-model="tagArr"
          multiple
          filterable
          remote
          reserve-keyword
          allow-create
          default-first-option
          placeholder="请选择标签"
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
        <el-radio-group v-model="form.display">
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

export default {
  data () {
    return {
      id: (this.$route.query && this.$route.query.id) || '',
      tagsOpts: [],
      payTypeOptions: [{
        value: 1,
        label: '长期有效'
      }, {
        value: 0,
        label: '限时'
      }],
      form: {
        title: '',
        description: '',
        price: '',
        display: ''
      },
      tagArr: [],
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
      topicRelatedList: [],
      allItemList: [],
      totalNum: 0,
      keyword: '',
      pager: {
        page: 1,
        size: 10
      }
    }
  },
  computed: {
    idList () {
      return _.pluck(this.topicRelatedList, 'id') || []
    }
  },
  mounted () {
    let _vue = this
    let hotTable = document.querySelector('.hot-news-table tbody')

    // NOTE: row-key 一定要设置
    window.Sortable.create(hotTable, {
      onEnd ({ newIndex, oldIndex }) {
        let targetRow = _vue.topicRelatedList.splice(oldIndex, 1)[0]
        _vue.topicRelatedList.splice(newIndex, 0, targetRow)
      }
    })
  },
  created () {
    let _vue = this
    _vue.fetchContentNewsType()
    if (_vue.id !== '') {
      _vue.fetchDetail()
      _vue.fetchTopicRelatedList()
    }
    _vue.fetchAllItemList()
  },
  methods: {
    back () {
      this.$router.go(-1)
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
      _vue.$http.get(`/api/v1.0/news/aggregate/${this.id}/curriculum`).then((response) => {
        let data = response.data.data.seminars
        console.log('编辑信息回显', data)
        _vue.form = data
        // 图片回显
        _vue.uploadedShareImgUrl = _vue.form.shareImg
        _vue.uploadDataShareImg.key = _vue.form.shareImg
        _vue.uploadedImageUrl = _vue.form.preImg
        _vue.uploadData.key = _vue.form.preImg
        _vue.tagArr = _vue.form.tags ? _vue.form.tags.split(',') : []
      })
    },
    fetchTopicRelatedList () {
      // 获取专题下包含内容
      let _vue = this
      _vue.$http.get('/api/v1.0/news/topic/related/list?id=' + _vue.id).then((response) => {
        _vue.topicRelatedList = response.data.data
      })
    },
    fetchAllItemList () {
      // 获取所有已审核活动和新闻 - 待加入到专题内
      let _vue = this
      _vue.$http.get('/api/v1.0/news/topic/items/list?page=' + _vue.pager.page + '&per_page=' + _vue.pager.size + '&text=' + _vue.keyword.trim()).then((response) => {
        _vue.allItemList = response.data.data.rows
        _vue.totalNum = response.data.data.total
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
        let key = 'cloud/news/share/' + (new Date().getTime()) + '_' + Global.base64Encode(arr[0]) + '.' + arr[1]
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
        let key = 'cloud/news/cover/' + (new Date().getTime()) + '_' + Global.base64Encode(arr[0]) + '.' + arr[1]
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
    handleCurrentChange (val) {
      let _vue = this
      _vue.pager.page = val
      _vue.searchTopicRelated()
    },
    removeTopicRelated (index) {
      // 移除专题新闻活动
      let _vue = this
      _vue.topicRelatedList.splice(index, 1)
    },
    searchTopicRelated () {
      // 搜索新闻和活动
      this.fetchAllItemList()
    },
    saveOperate () {
      // 保存专题
      let _vue = this
      _vue.$http.post('/api/v1.0/news/aggregate/curriculum', {
        id: _vue.id || null,
        title: _vue.form.title,
        description: _vue.form.description,
        preImg: _vue.uploadData.key,
        shareImg: _vue.uploadDataShareImg.key,
        display: _vue.form.display,
        tags: _vue.tagArr.toString(),
        price: _vue.form.price
      }).then(() => {
        _vue.$message({
          type: 'success',
          message: '保存成功',
          center: true
        })
        _vue.$router.push({
          path: '/news/course/list'
        })
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    cancelOperate () {
      // 取消返回
      this.$router.push({
        path: '/news/course/list'
      })
    },
    tableRowClassName ({row, rowIndex}) {
      if (this.idList.indexOf(row.id) !== -1) {
        return 'warning-row'
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";

  .row-item {
    .el-form-item__content {
      display: flex;
      justify-content: flex-start;
      .el-input {
        width: 200px;
      }
    }
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
