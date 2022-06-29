<template>
  <div>
    <div class="main-line-title">{{id === '' ? '新增专题' : '编辑专题'}}</div>
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="专题名称">
        <el-input v-model="form.title" placeholder="不超过60个字符" maxlength="60"></el-input>
        <div class="time-show" v-if="id !== ''">
          <p>创建时间：{{form.createTimeText}}</p>
          <p v-if="form.modifyTimeText">编辑时间：{{form.modifyTimeText}}</p>
        </div>
      </el-form-item>
      <el-form-item label="一句话简介">
        <el-input v-model="form.shortDescription" maxlength="10" placeholder="不超过10个字符"></el-input>
      </el-form-item>
      <el-form-item label="专题介绍">
        <el-input v-model="form.description" maxlength="20" placeholder="不超过20个字符"></el-input>
      </el-form-item>
      <el-form-item label="专题类型">
        <el-select v-model="form.topicType" placeholder="请选择">
          <el-option label="活动合集" value="0"></el-option>
          <el-option label="课程合集" value="1"></el-option>
          <el-option label="专题" value="2"></el-option>
          <el-option label="听见芯声" value="3"></el-option>
          <el-option label="专栏" value="4"></el-option>
          <el-option label="课程" value="5"></el-option>
        </el-select>
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
      <!-- 配置专题内容 START -->
      <el-form-item label="专题内容">
        <div class="topic-related-container table-list-wrap">
          <el-row :gutter="40">
            <el-col :span="12">
              <div class="news-list left">
                <div class="list-search-wrap">
                  <el-input v-model="keyword" clearable style="width: 400px;" placeholder="输入新闻ID/新闻标题/活动ID/活动名称检索"></el-input>
                  <el-button type="primary" @click="searchTopicRelated">搜索</el-button>
                </div>
                <el-table
                  :data="allItemList"
                  height="600"
                  header-row-class-name="tableheader"
                  :row-class-name="tableRowClassName"
                  border
                  style="width: 100%;">
                  <el-table-column
                    width="50"
                    align="center">
                    <template slot-scope="scope" v-if="idList.indexOf(scope.row.id) === -1">
                      <i class="action-icon el-icon-circle-plus-outline" @click="addTopicRelated(scope.row)"></i>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="id"
                    label="ID"
                    width="70"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="title"
                    label="内容标题"
                    width="200"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="source"
                    label="内容来源"
                    width="130"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="author"
                    label="内容作者"
                    width="120"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="createTimeText"
                    label="创建时间"
                    width="100"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="auditTimeText"
                    width="100"
                    label="审核时间"
                    align="center">
                  </el-table-column>
                </el-table>
                <div class="pager-wrap">
                  <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :total="totalNum"
                    :page-size="pager.size"
                    @current-change="handleCurrentChange">
                  </el-pagination>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="news-list right">
                <div class="list-search-wrap">
                  <span style="color: #409eff;display: inline-block;margin-left: 20px;">添加、删除和排序后请保存后才能同步</span>
                </div>
                <el-table
                  :data="topicRelatedList"
                  height="600"
                  row-key="id"
                  header-row-class-name="tableheader"
                  border
                  class="hot-news-table"
                  style="width: 100%;">
                  <el-table-column
                    width="50"
                    align="center">
                    <template slot-scope="scope">
                      <i class="action-icon el-icon-delete" @click="removeTopicRelated(scope.$index)"></i>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="id"
                    label="ID"
                    width="70"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="title"
                    label="内容标题"
                    width="200"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="source"
                    label="内容来源"
                    width="130"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="author"
                    label="内容作者"
                    width="120"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="createTimeText"
                    label="创建时间"
                    width="100"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="releaseTimeText"
                    width="100"
                    label="审核时间"
                    align="center">
                  </el-table-column>
                </el-table>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
      <!-- 配置专题内容 END -->
      <el-form-item label="添加H5链接">
        <el-input v-model="form.externalUrl" placeholder="若填入，则直接跳转到填入地址"></el-input>
      </el-form-item>
      <el-form-item label="标签">
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
      <el-form-item label="是否显示">
        <el-radio-group v-model="form.display">
          <el-radio :label="0">不显示</el-radio>
          <el-radio :label="1">显示</el-radio>
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
      form: {
        title: '',
        description: '',
        shortDescription: '',
        externalLink: '',
        topicType: '2',
        display: 1
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
      _vue.$http.get('/api/v1.0/news/topic/detail/' + _vue.id).then((response) => {
        _vue.form = response.data.data.detail
        _vue.form.topicType = _vue.form.topicType + ''
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
    addTopicRelated (row) {
      // 添加专题新闻活动
      this.topicRelatedList.unshift(row)
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
      let url = ''
      if (!_vue.id) {
        url = Global.CONFIG.NEWS_MOBILE_URL
      } else {
        url = _vue.form.url
      }
      _vue.$http.post('/api/v1.0/news/topic/add', {
        id: _vue.id || null,
        title: _vue.form.title,
        shortDescription: _vue.form.shortDescription,
        shareTitle: _vue.form.title,
        topicType: _vue.form.topicType,
        shareDesscription: _vue.form.shortDescription,
        url: url,
        description: _vue.form.description,
        preImg: _vue.uploadData.key,
        shareImg: _vue.uploadDataShareImg.key,
        externalUrl: _vue.form.externalUrl,
        display: _vue.form.display,
        tags: _vue.tagArr.toString(),
        voList: _vue.topicRelatedList
      }).then(() => {
        _vue.$message({
          type: 'success',
          message: '保存成功',
          center: true
        })
        _vue.$router.push({
          path: '/news/topic'
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
        path: '/news/topic'
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
