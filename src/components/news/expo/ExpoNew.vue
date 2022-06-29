<template>
  <div>
    <div class="main-line-title">{{id === '' ? '新增展会活动' : '编辑展会活动'}}</div>
    <el-form ref="form" :model="form" label-width="130px">
      <el-form-item label="展会名称" required>
        <el-input v-model="form.title" placeholder="不超过60个字符" maxlength="60"></el-input>
        <div class="time-show" v-if="form.createTime">
          <p>创建时间：{{form.createTime | filterDateformat}}</p>
        </div>
      </el-form-item>
      <el-form-item label="主办方" required>
        <el-select
          style="width: 100%"
          v-model="form.organizersId"
          multiple
          filterable
          remote
          reserve-keyword
          default-first-option
          placeholder="请输入主办方,搜索内容匹配机构id以及机构名称"
          value-key="id"
          :loading="orgTagLoading"
          @visible-change="(state) => {if(state){this.orgTagList = []}}"
          :remote-method="searchOrgTag">
          <el-option
            v-for="item in orgTagList"
            :key="item.id"
            :label="item.id + '、' + item.title"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="协办方">
        <el-select
          style="width: 100%"
          v-model="form.assistantsId"
          multiple
          filterable
          remote
          reserve-keyword
          default-first-option
          placeholder="请输入协办方,搜索内容匹配机构id以及机构名称"
          :loading="orgTagLoading"
          @visible-change="(state) => {if(state){this.orgTagList = []}}"
          :remote-method="searchOrgTag">
          <el-option
            v-for="item in orgTagList"
            :key="item.id"
            :label="item.id + '、' + item.title"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="承办方">
        <el-select
          style="width: 100%"
          v-model="form.coOrganizer"
          multiple
          filterable
          remote
          reserve-keyword
          default-first-option
          placeholder="请输入承办方,搜索内容匹配机构id以及机构名称"
          value-key="id"
          :loading="orgTagLoading"
          @visible-change="(state) => {if(state){this.orgTagList = []}}"
          :remote-method="searchOrgTag">
          <el-option
            v-for="item in orgTagList"
            :key="item.id"
            :label="item.id + '、' + item.title"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="展会时间" required>
        <!-- <el-date-picker
          v-model="form.meetingTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          align="right">
        </el-date-picker> -->
        <el-date-picker
          v-model="form.startTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="开始时间">
        </el-date-picker>
        <span>——</span>
        <el-date-picker
          v-model="form.endTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="报名时间">
        <!-- <el-date-picker
          v-model="form.signUpTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          align="right">
        </el-date-picker> -->
        <el-date-picker
          v-model="form.signupStartTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          placeholder="开始时间">
        </el-date-picker>
        <span>——</span>
        <el-date-picker
          v-model="form.signupEndTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          placeholder="结束时间">
        </el-date-picker><span>(若不设置，则默认创建后即可开始报名，展会开始时间作为截止报名时间)</span>
      </el-form-item>
      <el-form-item label="报名人数" required>
        <el-radio v-model="form.isPeopleNum" :label="0">不限</el-radio>
        <el-radio v-model="form.isPeopleNum" :label="1">限量</el-radio>
        <el-input-number v-model="form.maxSignup" :min="1"  label="描述文字" style="margin-left:20px;" @blur="()=>{if(!this.form.maxSignup){this.form.maxSignup=1}}">请输入大于0的正数名额数</el-input-number>
      </el-form-item>
      <el-form-item label="假的报名人数" required>
        <!-- <el-input v-model="form.fakeSignupNum" placeholder="请输入假的报名人数" maxlength="60"></el-input> -->
        <el-input-number v-model="form.fakeSignupNum" :min="0"  label="请输入假的报名人数" @blur="()=>{if(!this.form.fakeSignupNum){this.form.fakeSignupNum=0}}">请输入大于0的数</el-input-number>
      </el-form-item>
      <el-form-item label="展会地址" required>
        <!-- <el-cascader
          :options="optionsCity"
          v-model="form.city"
          :props="{value: 'label',label: 'label'}"
          :separator="'-'">
        </el-cascader> -->
        <el-input v-model="form.province" maxlength="100" placeholder="请输入省" style="width:150px"></el-input>
        <el-input v-model="form.city" maxlength="100" placeholder="请输入市" style="width:150px"></el-input>
        <div style="width:500px;display:inline-block;margin-left:10px;">
          <el-input v-model="form.address" maxlength="100" placeholder="请输入详细地址" width="300px"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="展会类型">
        <el-select v-model="form.expoTypeId" placeholder="请选择展会类型">
          <el-option
            v-for="item in expoTypeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="展会形式">
        <el-select
          style="width: 100%"
          v-model="form.expoFormName"
          multiple
          filterable
          remote
          default-first-option
          placeholder="请选择展会形式"
          allow-create
          reserve-keyword
          :loading="shapeTagLoading"
          @visible-change="(state) => {if(state){this.shapeTagList = []}}"
          :remote-method="searchShapeTag">
          <el-option
            v-for="item in shapeTagList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="封面图" required>
        <el-row :gutter="20">
          <el-col :span="10">
            <!-- 封面图 -->
            <div class="cover-img-wrap">
              <img class="upload-image cover-img" v-if="form.coverImg.imgUrl !== ''" :src="form.coverImg.imgUrl | filterQiniuMooreImage" alt="">
              <el-upload
                class="upload-btn"
                :show-file-list="false"
                action="http://upload.qiniup.com/"
                :before-upload="(file)=>this.beforeUpload(file,'cover')"
                :on-progress="()=>{ this.uploadProgress('cover')}"
                :on-success="(res, file)=>{ this.uploadSuccess(res, file,'cover')}"
                :on-error="()=>{ this.uploadError('cover')}"
                :data="form.coverImg.uploadData"
                :multiple="false">
                <el-button type="primary" size="small" :disabled="form.coverImg.imgLoading">{{form.coverImg.imgLoading ? '正在上传...' : '上传封面图'}}</el-button>
                <span class="img-tip">尺寸：750*422</span>
              </el-upload>
            </div>
          </el-col>
          <el-col :span="10">
            <!-- 分享图 -->
            <div class="share-img-wrap">
              <img class="upload-image share-img" v-if="form.shareImg.imgUrl !== ''" :src="form.shareImg.imgUrl | filterQiniuMooreImage" alt="">
              <el-upload
                class="upload-btn"
                :show-file-list="false"
                action="http://upload.qiniup.com/"
                :before-upload="(file)=>this.beforeUpload(file,'share')"
                :on-progress="()=>{ this.uploadProgress('share')}"
                :on-success="(res, file)=>{ this.uploadSuccess(res, file,'share')}"
                :on-error="()=>{ this.uploadError('share')}"
                :data="form.shareImg.uploadData"
                :multiple="false">
                <el-button type="primary" size="small" :disabled="form.shareImg.imgLoading">{{form.shareImg.imgLoading ? '正在上传...' : '上传分享图'}}</el-button>
                <span class="img-tip">尺寸：200*200</span>
              </el-upload>
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 配置专题内容 START -->
      <el-form-item label="活动嘉宾">
        <div class="topic-related-container table-list-wrap">
          <el-row :gutter="40">
            <el-col :span="12">
              <div class="news-list left">
                <div class="list-search-wrap">
                  <el-input v-model="guestSearchInput" clearable style="width: 300px;" placeholder="输入嘉宾ID/嘉宾姓名/标签检索"></el-input>
                  <el-button type="primary" @click="searchGuest">搜索</el-button>
                </div>
                <el-table
                  :data="guestList"
                  height="600"
                  header-row-class-name="tableheader"
                  :row-class-name="tableRowClassName"
                  border
                  style="width: 100%;">
                  <el-table-column
                    width="50"
                    align="center">
                    <template slot-scope="scope">
                      <i class="action-icon el-icon-circle-plus-outline" @click="addGuest(scope.row)"  v-if="idList.indexOf(scope.row.id) === -1"></i>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="id"
                    label="ID"
                    width="70"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="嘉宾姓名"
                    width="200"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="tags"
                    label="标签"
                    width="130"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="title"
                    label="嘉宾title"
                    width="120"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="createTime"
                    label="创建时间"
                    width="100"
                    align="center">
                    <template slot-scope="scope">
                      <span>{{scope.row.createTime | filterDateformatH}}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="pager-wrap">
                  <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :total="guestTotal"
                    :page-size="10"
                    @current-change="guestListPageChange">
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
                  :data="form.guestList"
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
                      <i class="action-icon el-icon-delete" @click="removeGuest(scope.$index)"></i>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="id"
                    label="ID"
                    width="70"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="嘉宾姓名"
                    width="200"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="tags"
                    label="标签"
                    width="130"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="title"
                    label="嘉宾title"
                    width="120"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="createTime"
                    label="创建时间"
                    width="100"
                    align="center">
                    <template slot-scope="scope">
                      <span>{{scope.row.createTime | filterDateformatH}}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
      <!-- 配置专题内容 END -->
      <el-form-item label="活动详情" required>
        <!-- <vue-ckeditor v-model="form.content" :config="ckeditorConfig"></vue-ckeditor> -->
        <div class="ckeditor-container">
          <textarea name="content" id="editor"></textarea>
        </div>
      </el-form-item>
      <el-form-item label="外显标签" required>
        <el-select
          style="width: 100%"
          v-model="form.tags"
          multiple
          filterable
          remote
          reserve-keyword
          allow-create
          default-first-option
          placeholder="请选择标签"
          :loading="labelTagLoading"
          :multiple-limit="5"
          @visible-change="(state) => {if(state){this.labelTagList = []}}"
          :remote-method="searchLabelTag">
          <el-option
            v-for="item in labelTagList"
            :key="item.id"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="其余标签" required>
        <el-select
          style="width: 100%"
          v-model="form.contentTags"
          multiple
          filterable
          remote
          reserve-keyword
          allow-create
          default-first-option
          placeholder="请选择标签"
          :loading="labelTagLoading"
          @visible-change="(state) => {if(state){this.labelTagList = []}}"
          :remote-method="searchLabelTag">
          <el-option
            v-for="item in labelTagList"
            :key="item.id"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否显示" required>
        <el-radio-group v-model="form.isShow">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="0">不显示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="报名是否需要审核">
        <el-radio-group v-model="form.isSignupNeedReview">
          <el-radio :label="1">需要</el-radio>
          <el-radio :label="0">不需要</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="收费类型" required>
        <el-radio v-model="form.payType" :label="0">免费</el-radio>
        <el-radio v-model="form.payType" :label="1">收费</el-radio>
        <el-input-number v-model="form.price" :min="0"  label="描述文字" @blur="()=>{if(!this.form.price){this.form.price=0}}">请输入价格</el-input-number>
      </el-form-item>
      <el-form-item label="报名跳转">
        <el-input v-model="form.signupAfterUrl" placeholder="请输入报名跳转地址" maxlength="60"></el-input>
      </el-form-item>
      <el-form-item label="赞助跳转">
        <!-- <el-input v-model="form.buttonName" placeholder="赞助/参展" maxlength="8" style="width:100px;"></el-input> -->
        <el-input v-model="form.sponsorUrl" placeholder="请输入赞助跳转地址" maxlength="60" style="width:500px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveOperate">保存</el-button>
        <el-button @click="cancelOperate">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Global from 'assets/js/global'
import cityHotJs from 'assets/js/city_hot'
import _ from 'underscore'
import moment from 'moment'
import MyUploadAdapter from 'assets/js/uploadAdapter'

export default {
  data () {
    return {
      id: (this.$route.query && this.$route.query.id) || '',
      optionsCity: cityHotJs.citys.splice(1),
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
      },
      form: {
        title: '',
        createTime: '',
        organizersId: [],
        assistantsId: [],
        coOrganizer: [],
        meetingTime: [],
        startTime: '',
        endTime: '',
        signUpTime: [],
        signupStartTime: '',
        signupEndTime: '',
        isPeopleNum: 0,
        maxSignup: 1,
        fakeSignupNum: 0,
        province: '',
        city: '',
        address: '',
        expoTypeId: '',
        expoFormName: [],
        coverImg: { // 封面图组件数据
          imgUrl: '',
          imgLoading: false,
          uploadData: {
            key: '',
            token: ''
          }
        },
        shareImg: { // 分享图组件数据
          imgUrl: '',
          imgLoading: false,
          uploadData: {
            key: '',
            token: ''
          }
        },
        guestList: [],
        content: '',
        tags: [],
        contentTags: [],
        isShow: 1,
        isSignupNeedReview: 0,
        payType: 0,
        price: 0,
        signupAfterUrl: '',
        buttonName: '',
        sponsorUrl: ''
      },
      orgTagList: [],
      orgTagLoading: false, // 加载机构状态
      orgTagTimer: null, // 加载机构定时器
      expoTypeOption: [
        {label: '供应商大会', value: '101'},
        {label: '半导体应用', value: '102'},
        {label: '行业展会', value: '103'},
        {label: '技术论坛', value: '104'},
        {label: '半导体校友会', value: '105'},
        {label: '园区招聘', value: '106'}
      ],
      labelTagList: [],
      labelTagLoading: false, // 加载标签状态
      labelTagTimer: null, // 加载标签定时器
      shapeTagList: [],
      shapeTagLoading: false, // 加载展会形式状态
      shapeTagTimer: null, // 加载展会形式定时器
      guestSearchInput: '',
      guestList: [],
      guestNum: 1,
      guestTotal: 0,
      editor: ''
    }
  },
  computed: {
    idList () {
      return _.pluck(this.form.guestList, 'id') || []
    }
  },
  mounted () {
    this.getGuestList()
    if (this.id) {
      this.getDetail()
    }
    if (this.id === '') {
      window.setTimeout(() => {
        this.initCkeditor()
      }, 500)
    }
  },
  created () {
  },
  methods: {
    initCkeditor (content) {
      let _vue = this
      window.ClassicEditor
        .create(document.querySelector('#editor'), {
          removePlugins: ['MediaEmbed', 'Table']
        })
        .then(editor => {
          console.log(editor)
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
    searchOrgTag (query) { // 机构选择时联合查询
      if (!query) return
      clearTimeout(this.orgTagTimer)
      this.orgTagTimer = setTimeout(() => {
        this.orgTagLoading = true
        this.$http.get('/api/v1.0/expo/organization/organization_list?page=1&per_page=20&text=' + query).then((response) => {
          this.orgTagLoading = false
          this.orgTagList = _.sortBy(response.data.data.rows, 'id')
        })
      }, 300)
    },
    searchLabelTag (query) { // 标签选择时联合查询
      if (!query) return
      clearTimeout(this.labelTagTimer)
      this.labelTagTimer = setTimeout(() => {
        this.labelTagLoading = true
        this.$http.get('/api/v1.0/news/tag/options?page=1&per_page=20&text=' + query).then((response) => {
          this.labelTagLoading = false
          this.labelTagList = _.sortBy(response.data.data.rows, 'id')
        })
      }, 300)
    },
    searchShapeTag (query) { // 展会形式选择时联合查询
      if (!query) return
      clearTimeout(this.shapeTagTimer)
      this.shapeTagTimer = setTimeout(() => {
        this.shapeTagLoading = true
        this.$http.get('/api/v1.0/expo/expo/expoType_list?page=1&per_page=20&text=' + query).then((response) => {
          this.shapeTagLoading = false
          this.shapeTagList = _.sortBy(response.data.data.rows, 'id')
        })
      }, 300)
    },
    getGuestList () {
      this.$http.get('/api/v1.0/expo/guest/guest_list?page=' + this.guestNum + '&per_page=10&text=' + this.guestSearchInput.trim()).then((response) => {
        this.guestList = response.data.data.rows
        this.guestTotal = response.data.data.total
      })
    },
    searchGuest () {
      this.guestNum = 1
      this.getGuestList()
    },
    guestListPageChange (value) {
      this.guestNum = value
      this.getGuestList()
    },
    addGuest (row) {
      this.form.guestList.unshift(JSON.parse(JSON.stringify(row)))
    },
    removeGuest (index) {
      this.form.guestList.splice(index, 1)
    },
    // 图片开始
    beforeUpload (file, type) {
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
        let key = 'expo/org/' + (new Date().getTime()) + '_' + Global.base64Encode(arr[0]) + '.' + arr[1]
        return _vue.$http.post('/api/v1.0/qiniu/token/img?bucket=moore', {
          type: 1
        }).then(response => {
          if (type === 'cover') {
            _vue.form.coverImg.uploadData.token = response.data.data.token
            _vue.form.coverImg.uploadData.key = key
          } else if (type === 'share') {
            _vue.form.shareImg.uploadData.token = response.data.data.token
            _vue.form.shareImg.uploadData.key = key
          }
        })
      }
    },
    uploadProgress (type) {
      if (type === 'cover') {
        this.form.coverImg.imgLoading = true
      } else if (type === 'share') {
        this.form.shareImg.imgLoading = true
      }
    },
    uploadSuccess (res, file, type) {
      if (type === 'cover') {
        this.form.coverImg.imgLoading = false
        this.form.coverImg.imgUrl = file.response.key
      } else if (type === 'share') {
        this.form.shareImg.imgLoading = false
        this.form.shareImg.imgUrl = file.response.key
      }
    },
    uploadError (type) {
      if (type === 'cover') {
        this.form.coverImg.imgLoading = false
      } else if (type === 'share') {
        this.form.shareImg.imgLoading = false
      }
      this.$message({
        type: 'error',
        message: '文件上传失败，请稍后重试',
        center: true,
        showClose: true
      })
    },
    // 图片为止
    saveOperate () {
      // 保存展会
      if (!this.form.title) {
        this.$message.warning('展会名称不得为空')
        return
      } else if (!this.form.organizersId.length) {
        this.$message.warning('主办方不得为空')
        return
      } else if (!this.form.startTime) {
        this.$message.warning('展会开始时间不得为空')
        return
      } else if (!this.form.endTime) {
        this.$message.warning('展会结束时间不得为空')
        return
      } else if (!this.form.city) {
        this.$message.warning('展会城市不得为空')
        return
      } else if (!this.form.address) {
        this.$message.warning('展会具体地址不得为空')
        return
      } else if (!this.form.coverImg.imgUrl) {
        this.$message.warning('封面图不得为空')
        return
      } else if (!this.form.shareImg.imgUrl) {
        this.$message.warning('分享图不得为空')
        return
      } else if (!this.editor.getData()) {
        this.$message.warning('活动详情不得为空')
        return
      } else if (!this.form.tags.length) {
        this.$message.warning('外显标签不得为空')
        return
      } else if (!this.form.contentTags.length) {
        this.$message.warning('其余标签不得为空')
        return
      }
      let data = {
        title: this.form.title,
        organizersId: this.form.organizersId.join(','),
        assistantsId: this.form.assistantsId.join(','),
        coOrganizerId: this.form.coOrganizer.join(','),
        seminarBeginTime: this.form.startTime || '',
        seminarEndTime: this.form.endTime || '',
        signupStart: this.form.signupStartTime || '',
        signupEnd: this.form.signupEndTime || '',
        maxSignup: this.form.isPeopleNum ? this.form.maxSignup ? this.form.maxSignup : 1 : '',
        fakeSignupNum: this.form.fakeSignupNum,
        province: this.form.province || '',
        city: this.form.city || '',
        address: this.form.address,
        expoTypeId: this.form.expoTypeId,
        expoFormName: this.form.expoFormName.join(','),
        preImg: this.form.coverImg.imgUrl,
        preImgThumb: this.form.shareImg.imgUrl,
        guestId: this.form.guestList.map(res => { return res.id }).join(','),
        briefIntroduction: this.editor.getData() || '',
        tags: this.form.tags.join(','),
        contentTags: this.form.contentTags.join(','),
        isShow: this.form.isShow,
        isSignupNeedReview: this.form.isSignupNeedReview,
        payType: this.form.payType,
        price: this.form.price || 0,
        signupAfterUrl: this.form.signupAfterUrl,
        sponsorUrl: this.form.sponsorUrl
      }
      let url = '/api/v1.0/expo/expo/add_expo'
      if (this.id) {
        data.id = this.id
        url = '/api/v1.0/expo/expo/update_expo'
      }
      this.$http.post(url, data).then(() => {
        this.$message({
          type: 'success',
          message: '保存成功',
          center: true
        })
        this.$router.push({
          path: '/news/expo/list'
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
        path: '/news/expo/list'
      })
    },
    // 嘉宾table行已选样式变化
    tableRowClassName ({row, rowIndex}) {
      if (this.idList.indexOf(row.id) !== -1) {
        return 'warning-row'
      }
      return ''
    },
    getDetail () {
      this.$http.get('/api/v1.0/expo/expo/expo_detail?id=' + this.id).then((res) => {
        if (res.data.data) {
          // this.form = res.data.data.rows
          let data = JSON.parse(JSON.stringify(res.data.data.rows))
          let form = {}
          let organizersId = data.organizersId ? data.organizersId.split(',') : []
          let assistantsId = data.assistantsId ? data.assistantsId.split(',') : []
          let coOrganizer = data.coOrganizerId ? data.coOrganizerId.split(',') : []
          let organizerslist = data.organizers ? data.organizers.split(',') : []
          let assistantslist = data.assistants ? data.assistants.split(',') : []
          let coOrganizerlist = data.coOrganizer ? data.coOrganizer.split(',') : []
          let list = []
          organizersId.forEach((res, index) => {
            if (!list.filter(_ => _.id + '' === res + '').length) {
              list.push({id: res + '', title: organizerslist[index]})
            }
          })
          assistantsId.forEach((res, index) => {
            if (!list.filter(_ => _.id === res + '').length) {
              list.push({id: res + '', title: assistantslist[index]})
            }
          })
          coOrganizer.forEach((res, index) => {
            if (!list.filter(_ => _.id === res + '').length) {
              list.push({id: res + '', title: coOrganizerlist[index]})
            }
          })
          this.orgTagList = list
          form.title = data.title
          form.organizersId = organizersId
          form.assistantsId = assistantsId
          form.coOrganizer = coOrganizer
          form.startTime = data.startTime ? moment(data.startTime).format('YYYY-MM-DD HH:mm:ss') : ''
          form.endTime = data.endTime ? moment(data.endTime).format('YYYY-MM-DD HH:mm:ss') : ''
          form.signupStartTime = data.signupStartTime ? moment(data.signupStartTime).format('YYYY-MM-DD HH:mm:ss') : ''
          form.signupEndTime = data.signupEndTime ? moment(data.signupEndTime).format('YYYY-MM-DD HH:mm:ss') : ''
          form.isPeopleNum = data.maxSignup ? 1 : 0
          form.maxSignup = data.maxSignup || ''
          form.fakeSignupNum = data.fakeSignupNum || 0
          form.province = data.province || ''
          form.city = data.city || ''
          form.address = data.address || ''
          form.expoTypeId = data.expoTypeId || ''
          form.expoFormName = data.expoFormName ? data.expoFormName.split(',') : []
          form.coverImg = {
            imgUrl: data.preImg || '',
            imgLoading: false,
            uploadData: {
              key: '',
              token: ''
            }
          }
          form.shareImg = {
            imgUrl: data.preImgThumb || '',
            imgLoading: false,
            uploadData: {
              key: '',
              token: ''
            }
          }
          form.guestList = data.guestList ? data.guestList : []
          form.content = data.briefIntroduction
          form.tags = data.tags ? data.tags.split(',') : []
          form.contentTags = data.contentTags ? data.contentTags.split(',') : []
          form.isShow = data.isShow || 0
          form.isSignupNeedReview = data.isSignupNeedReview || 0
          form.payType = data.payType || 0
          form.price = data.price || 0
          form.signupAfterUrl = data.signupAfterUrl || ''
          form.sponsorUrl = data.sponsorUrl || ''
          form.createTime = data.createTime
          this.form = JSON.parse(JSON.stringify(form))
          this.$nextTick(() => {
            this.initCkeditor(data.briefIntroduction)
          })
          // console.log(this.orgTagList, this.form)
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
