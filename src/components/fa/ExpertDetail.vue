<template>
  <div class="expert-wrap-detail">
    <div class="back-link" @click="goExpertList">&lt;&lt; 返回列表</div>
    <el-row :gutter="20">
      <el-col class="left-container" :span="16">
        <el-row class="top-block" :gutter="20">
          <el-col :span="24">
            <div class="wrapper basic-block">
              <div class="h-title">技术专家基础信息
                <i class="icon el-icon-edit" @click="openDetail('base')"></i>
              </div>
              <div class="cnt-wrap">
                <div class="item">
                  <div class="title">头像</div>
                  <div class="cnt">
                    <span v-if="!baseData.headImg">暂无头像</span>
                    <img class="avatar" v-if="baseData.headImg" :src="baseData.headImg | filterQiniuMooreImage" alt="">
                  </div>
                </div>
                <div class="item">
                  <div class="title">姓名</div>
                  <div class="cnt">{{baseData.name}}</div>
                </div>
                <div class="item">
                  <div class="title">城市</div>
                  <div class="cnt">{{baseData.address}}</div>
                </div>
                <div class="item">
                  <div class="title">联系电话</div>
                  <div class="cnt">{{baseData.mobile}}</div>
                </div>
                <div class="item">
                  <div class="title">邮箱</div>
                  <div class="cnt">{{baseData.email}}</div>
                </div>
                <div class="item" v-if="baseData.stage === 2 || baseData.isUpdate === 2">
                  <div class="title">信息暂未确认</div>
                  <div class="cnt">
                    <el-button @click="sendConfirmMsg" type="danger" size="mini">发送确认提醒</el-button></div>
                </div>
                <div class="item">
                  <div class="title">关注公众号</div>
                  <div class="cnt">{{(baseData.isAttention===1 || baseData.isAttention===0)?baseData.isAttention?'已关注':'未关注':''}}
                    <el-button @click="sendEmailRemind" type="primary" size="mini" style="margin-left:15px" v-if="baseData.isAttention!==1">引导关注</el-button>
                  </div>
                </div>
                <div class="item">
                  <div class="title">注册时间</div>
                  <div class="cnt">{{baseData.createTime}}</div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <div class="dialog">
      <!-- 发送基本信息确认提醒 -->
      <el-dialog
        title="发送确认提醒"
        :visible.sync="remindDialogVisible"
        fullscreen
        width='30%'>
        <span>请确保下方信息已完善并核对准确，技术专家确认信息后，如有内容修改需重新确认。</span>
        <span slot="footer" class="dialog-footer">
                <el-button @click="remindDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sendCheckRemind">发送确认提醒</el-button>
              </span>
      </el-dialog>
    </div>
    <el-row :gutter="20">
      <el-col class="right-container" :span="16">
        <div class="wrapper basic-block">
          <div class="h-title">技术专家其他信息
            <i class="icon el-icon-edit" @click="openDetail('other')"></i>
          </div>
          <div class="cnt-wrap">
            <div class="item">
              <div class="title">公司</div>
              <div class="cnt">{{otherData.companyName}}</div>
            </div>
            <div class="item">
              <div class="title">职务</div>
              <div class="cnt">{{baseData.job}}</div>
            </div>
            <div class="item">
              <div class="title">擅长产业链方向</div>
              <div class="cnt">{{semiconductorText}}</div>
            </div>
            <div class="item">
              <div class="title">对外标签</div>
              <div class="cnt">{{externalLabelText}}</div>
            </div>
          </div>
          <div class="cnt-wrap mainItem">
            <div class="h-title">工作经历
            </div>
            <div class="noneTitle" v-if="!otherData.workHistoryModels || otherData.workHistoryModels.length === 0">无</div>
            <div class="cnt-wrap mainItemContent" v-for="(item,key) in otherData.workHistoryModels" :key="key">
              <div class="item">
                <div class="title">公司</div>
                <div class="cnt">{{item.companyName}}</div>
              </div>
              <div class="item">
                <div class="title">职务</div>
                <div class="cnt">{{item.positions}}</div>
              </div>
              <div class="item">
                <div class="title">开始时间</div>
                <div class="cnt">{{item.startTime}}</div>
              </div>
              <div class="item">
                <div class="title">结束时间</div>
                <div class="cnt">{{item.endTime}}</div>
              </div>
            </div>
          </div>
          <div class="cnt-wrap mainItem">
            <div class="h-title">教育背景
            </div>
            <div class="noneTitle"  v-if="!otherData.educationHistoryModels || otherData.educationHistoryModels.length === 0">无</div>
            <div class="cnt-wrap mainItemContent" v-for="(item,key) in otherData.educationHistoryModels" :key="key">
              <div class="item">
                <div class="title">学校</div>
                <div class="cnt">{{item.schoolName}}</div>
              </div>
              <div class="item">
                <div class="title">专业</div>
                <div class="cnt">{{item.major}}</div>
              </div>
              <div class="item">
                <div class="title">学历</div>
                <div class="cnt">{{item.education | filterFaEducation}}</div>
              </div>
              <div class="item">
                <div class="title">开始时间</div>
                <div class="cnt">{{item.startTime}}</div>
              </div>
              <div class="item">
                <div class="title">结束时间</div>
                <div class="cnt">{{item.endTime}}</div>
              </div>
            </div>
          </div>
          <div class="split-line-wrap">
            <div class="text">下列信息不对外展示</div>
          </div>
          <div class="cnt-wrap">
            <div class="item">
              <div class="title">对内标签</div>
              <div class="cnt">{{innerLabelText}}</div>
            </div>
            <div class="item">
              <div class="title">行业领域</div>
              <div class="cnt">{{ otherData.professionalField | industryCategoryFilter }}</div>
            </div>
            <div class="item">
              <div class="title">团队管理经验</div>
              <div class="noneTitle"  v-if="!otherData.workTeamHistory">无</div>
              <div class="cnt" v-if="otherData.workTeamHistory" v-html="otherData.workTeamHistory"></div>
            </div>
            <div class="item">
              <div class="title">跳槽计划</div>
              <div class="noneTitle"  v-if="!otherData.empregoPlan">无</div>
              <div class="cnt" v-if="otherData.empregoPlan" v-html="otherData.empregoPlan"></div>
            </div>
            <div class="item">
              <div class="title">创业想法</div>
              <div class="noneTitle"  v-if="!otherData.entrepreneurial">无</div>
              <div class="cnt" v-if="otherData.entrepreneurial" v-html="otherData.entrepreneurial"></div>
            </div>
          </div>
        </div>
        <div class="item" v-if="baseData.stage === 2 || baseData.isUpdate === 2">
          <div  style="display:flex;justyif-content:center;align-items:center">
            <div class="title" style="margin-right:20px;">信息暂未确认</div>
            <div class="cnt">
              <el-button @click="sendConfirmMsg" type="danger" size="mini">发送确认提醒</el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 技术专家信息 -->
    <el-dialog
      title="技术专家信息"
      :visible.sync="dialogVisible"
      fullscreen
      width='50%'>
      <div>
        <el-form ref="addOrEditForm" :model="addOrEditForm" class="form-inline" label-width="120px" label-position="left">
          <!-- 基础信息编辑 -->
          <div class="base" v-if="type === 'base'">
            <el-form-item label="头像">
              <div class="cover-img-wrap">
                <img class="upload-image cover-img" v-if="addOrEditForm.uploadImg.uploadedImageUrl !== ''" :src="addOrEditForm.uploadImg.uploadedImageUrl | filterQiniuMooreImage" alt="">
                <el-upload
                  class="upload-btn"
                  :show-file-list="false"
                  action="http://upload.qiniup.com/"
                  :before-upload="(file)=>this.beforeUpload(file)"
                  :on-progress="()=>{ this.uploadProgress()}"
                  :on-success="(res, file)=>{ this.uploadSuccess(res, file)}"
                  :on-error="()=>{ this.uploadError()}"
                  :data="addOrEditForm.uploadImg.uploadData"
                  :multiple="false">
                  <el-button type="primary" size="small" :disabled="addOrEditForm.uploadImg.loading">{{addOrEditForm.uploadImg.loading ? '正在上传...' : '上传头像'}}</el-button>
                </el-upload>
              </div>
            </el-form-item>
            <el-form-item label="*姓名">
              <el-input v-model="addOrEditForm.name"></el-input>
            </el-form-item>
            <el-form-item label="*联系电话">
              <el-input v-model="addOrEditForm.mobile"></el-input>
            </el-form-item>
            <el-form-item label="*邮箱">
              <el-input v-model="addOrEditForm.email"></el-input>
            </el-form-item>
            <el-form-item label="*城市">
              <el-input v-model="addOrEditForm.city"></el-input>
            </el-form-item>
            <el-form-item label="是否关注公众号">
              <el-select v-model="addOrEditForm.isAttention">
                <el-option v-for="item in [{label:'否',id:0},{label:'是',id:1}]" :key="item.id" :label="item.label" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <!-- 其他信息编辑 -->
          <div class="other" v-if="type === 'other'">
            <el-form-item label="公司">
              <el-input v-model="addOrEditForm.companyName" placeholder="当前公司"></el-input>
            </el-form-item>
            <el-form-item label="职务">
              <el-input v-model="addOrEditForm.job" placeholder="当前职务"></el-input>
            </el-form-item>
            <el-form-item label="*擅长产业链方向">
              <el-select
                style="width: 100%"
                v-model='addOrEditForm.semiconductorArr'
                multiple
                filterable
                remote
                reserve-keyword
                default-first-option
                placeholder="选择产业链"
              >
                <el-option
                  v-for="item in semiconductorOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="*对外标签">
              <span v-if="addOrEditForm.outTagText">{{ addOrEditForm.outTagText }}</span>
              <el-button @click="openExternalDialog" type="plain" size="small">选择标签</el-button>
            </el-form-item>
            <el-form-item label="*工作经历">
              <div class="add-item">
                <el-button @click="addWorkExpItem" size="small">新增一段</el-button>
              </div>
              <div class="workExp-list">
                <div class="workExp" v-for="(item,key) in addOrEditForm.workExp" :key="key">
                  <el-form-item label="*公司" label-width="80px">
                    <el-input v-model="item.companyName"></el-input>
                  </el-form-item>
                  <el-form-item label="*职务" label-width="80px">
                    <el-input v-model="item.positions"></el-input>
                  </el-form-item>
                  <el-form-item label="*开始时间" label-width="80px">
                    <el-date-picker
                      v-model="item.startTime"
                      type="month"
                      format="yyyy.MM"
                      value-format="yyyy.MM">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="*结束时间" label-width="80px">
                    <el-date-picker
                      v-model="item.endTime"
                      type="month"
                      format="yyyy.MM"
                      value-format="yyyy.MM"
                      :disabled="item.soFar"
                      style="width: 150px;">
                    </el-date-picker>
                    <span style="margin-left: 20px;">
                      <el-checkbox v-model="item.soFar">至今</el-checkbox>
                    </span>
                  </el-form-item>
                  <el-form-item label="" style="text-align: right">
                    <el-button @click="deleteWorkExpItem(key)" type="danger" size="mini">删除此段</el-button>
                  </el-form-item>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="*教育背景">
              <div class="add-item">
                <el-button @click="addEducationExpItem" size="small">新增一段</el-button>
              </div>
              <div class="workExp-list">
                <div class="workExp" v-for="(item,key) in addOrEditForm.educationExp" :key="key">
                  <el-form-item label="*学校" label-width="80px">
                    <el-input v-model="item.schoolName"></el-input>
                  </el-form-item>
                  <el-form-item label="*专业" label-width="80px">
                    <el-input v-model="item.major"></el-input>
                  </el-form-item>
                  <el-form-item label="*学历" label-width="80px">
                    <el-select v-model="item.education">
                      <el-option label="大专" value="1"></el-option>
                      <el-option label="本科" value="2"></el-option>
                      <el-option label="硕士" value="3"></el-option>
                      <el-option label="博士" value="4"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="*开始时间" label-width="80px">
                    <el-date-picker
                      v-model="item.startTime"
                      type="month"
                      format="yyyy.MM"
                      value-format="yyyy.MM"
                      placeholder="开始时间">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="*结束时间" label-width="80px">
                    <el-date-picker
                      v-model="item.endTime"
                      type="month"
                      format="yyyy.MM"
                      value-format="yyyy.MM"
                      placeholder="结束时间">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="" style="text-align: right">
                    <el-button @click="deleteEducationExpItem(key)" type="danger" size="mini">删除此段</el-button>
                  </el-form-item>
                </div>
              </div>
            </el-form-item>
            <div class="hr"><span>以下为非公开信息</span></div>
            <el-form-item label="对内标签">
              <span v-if="addOrEditForm.inTagText">{{ addOrEditForm.inTagText }}</span>
              <el-button @click="openInnerDialog" type="plain" size="small">选择标签</el-button>
            </el-form-item>
            <el-form-item label="*行业领域">
              <el-select v-model="addOrEditForm.professionalField" multiple>
                <el-option v-for="item in industrialCategory" :key="item.value" :label="item.lable" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="团队管理经验">
              <vue-ckeditor v-model="addOrEditForm.workTeamHistory" :config="ckeditorConfig"></vue-ckeditor>
            </el-form-item>
            <el-form-item label="*跳槽计划">
              <vue-ckeditor v-model="addOrEditForm.empregoPlan" :config="ckeditorConfig"></vue-ckeditor>
            </el-form-item>
            <el-form-item label="*创业想法" >
              <vue-ckeditor v-model="addOrEditForm.entrepreneurial" :config="ckeditorConfig"></vue-ckeditor>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmUpdata" :loading="updataLoading">提交</el-button>
      </div>
    </el-dialog>

    <!-- 外显标签 -->
    <TagDialog ref="refExternalLabel" @emitGetValue="getExternalLabel"></TagDialog>

    <!-- 内显标签 -->
    <TagDialog ref="refInnerLabel" @emitGetValue="getInnerLabel"></TagDialog>
  </div>
</template>
<script>
import Global from 'assets/js/global'
import cityHotJs from 'assets/js/city_hot'
import _ from 'underscore'
import TagDialog from '../fa/widgets/TagDialog'
import FaCommon from 'assets/js/faCommon'
export default {
  components: {
    TagDialog
  },
  data () {
    return {
      remindDialogVisible: false,
      industrialCategory: [],
      addOrEditForm: {
        // 基础信息
        id: '',
        name: '',
        mobile: '',
        email: '',
        city: '',
        isAttention: 0,
        // 其他信息
        companyName: '',
        professionalField: [],
        outTagArr: [],
        inTagArr: [],
        outTagText: '',
        inTagText: '',
        workExp: [],
        educationExp: [],
        empregoPlan: '',
        entrepreneurial: '',
        workTeamHistory: '',
        // 基础信息与公司信息中用到的图片
        uploadImg: {
          loading: false,
          uploadedImageUrl: '',
          uploadData: {
            key: '',
            token: ''
          }
        },
        // 公司信息
        companyId: '',
        marketTime: '',
        registrationTime: '',
        companyAddress: '',
        registeredFund: '',
        fundType: '',
        legalName: '',
        legalTelephone: '',
        industrialCategory: [],
        semiconductorArr: [],
        companyBackground: '',
        business: '',
        uploadImgLicense: {
          loading: false,
          uploadedImageUrl: '',
          uploadData: {
            key: '',
            token: ''
          }
        }
      },
      dialogVisible: false,
      cityTreeData: cityHotJs.citys.splice(1),
      ckeditorConfig: {
        toolbar: [
          ['BulletedList']
        ],
        height: 100
      },
      data: {},
      baseData: {},
      companyData: {},
      otherData: {},
      fundType: [ // 货币单位数据字典
        {id: 1, label: '人民币'},
        {id: 2, label: '美元'},
        {id: 3, label: '港币'},
        {id: 4, label: '欧元'},
        {id: 5, label: '其它'}
      ],
      updataLoading: false,
      type: '',
      lastCheckTime: 0,
      lastEmailTime: 0,
      externalLabelText: '',
      innerLabelText: '',
      processLabelArr: [],
      semiconductorOptions: [],
      semiconductorText: ''
    }
  },
  created () {
    this.fetchAllTag()
    this.fetchFirstTag()
  },
  mounted () {
    this.getIndustrialCategory()
    this.getDetail()
  },
  methods: {
    fetchFirstTag () {
      this.$http.get('/api/v1.0/fa/tag/findAllTag?parentId=1').then(res => {
        this.semiconductorOptions = res.data.data
      })
    },
    getDetail () {
      this.$http.get('/api/v1.0/fa/specialist/details', {params: {id: this.$route.params.id}}).then((res) => {
        this.data = res.data.data
        this.companyData = res.data.data.userInfoModel.companyModel
        this.baseData = res.data.data.userInfoModel
        this.otherData = res.data.data
        this.semiconductorText = this.handleLabelName(this.data.semiconductor, this.semiconductorOptions)
        window.setTimeout(() => {
          this.innerLabelText = this.handleLabelName(this.otherData.innerLabel, this.processLabelArr)
          this.externalLabelText = this.handleLabelName(this.otherData.externalLabel, this.processLabelArr)
          this.addOrEditForm.outTagText = this.handleLabelName(this.otherData.externalLabel || '', this.processLabelArr)
          this.addOrEditForm.inTagText = this.handleLabelName(this.otherData.innerLabel || '', this.processLabelArr)
        }, 500)
      })
    },
    getIndustrialCategory () {
      this.$http.get('/api/v1.0/fa/common/find', {params: {name: 'industrialCategory'}}).then((res) => {
        let result = res.data.data
        this.industrialCategory = _.map(result, item => {
          item.value = item.value + ''
          return item
        })
      })
    },
    openDetail (type) {
      if (type === 'base') {
        this.addOrEditForm.id = this.baseData.id || ''
        this.addOrEditForm.name = this.baseData.name || ''
        this.addOrEditForm.mobile = this.baseData.mobile || ''
        this.addOrEditForm.email = this.baseData.email || ''
        this.addOrEditForm.city = this.baseData.address || ''
        this.addOrEditForm.isAttention = this.baseData.isAttention || 0
        this.addOrEditForm.uploadImg = {
          loading: false,
          uploadedImageUrl: this.baseData.headImg || '',
          uploadData: {
            key: '',
            token: ''
          }
        }
      } else if (type === 'other') {
        this.addOrEditForm.companyName = this.otherData.companyName || ''
        this.addOrEditForm.job = this.baseData.job || ''
        this.addOrEditForm.outTagArr = this.otherData.externalLabel ? this.otherData.externalLabel.split(',') : []
        this.addOrEditForm.inTagArr = this.otherData.innerLabel ? this.otherData.innerLabel.split(',') : []
        this.addOrEditForm.semiconductorArr = this.otherData.semiconductor ? _.map(this.otherData.semiconductor.split(','), item => { return item * 1 }) : []
        window.setTimeout(() => {
          this.addOrEditForm.outTagText = this.handleLabelName(this.otherData.externalLabel || '', this.processLabelArr)
          this.addOrEditForm.inTagText = this.handleLabelName(this.otherData.innerLabel || '', this.processLabelArr)
        }, 500)
        this.addOrEditForm.professionalField = this.otherData.professionalField ? this.otherData.professionalField.split(',') : []
        let workExp = this.otherData.workHistoryModels || []
        if (workExp.length > 0) {
          this.addOrEditForm.workExp = _.map(workExp, item => {
            if (item.endTime === '至今') {
              item.soFar = true
            } else {
              item.soFar = false
            }
            return item
          })
        }
        this.addOrEditForm.workExp = JSON.parse(JSON.stringify(workExp))
        let educationExp = this.otherData.educationHistoryModels || []
        if (educationExp.length > 0) {
          this.addOrEditForm.educationExp = _.map(educationExp, item => {
            if (item.education) {
              item.education = item.education + ''
            }
            return item
          })
        }
        this.addOrEditForm.empregoPlan = this.otherData.empregoPlan || ''
        this.addOrEditForm.entrepreneurial = this.otherData.entrepreneurial || ''
        this.addOrEditForm.workTeamHistory = this.otherData.workTeamHistory || ''
      }
      this.type = type
      this.dialogVisible = true
    },
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
        let key = 'fa/user/avatar/' + (new Date().getTime()) + '_' + Global.base64Encode(arr[0]) + '.' + arr[1]
        return _vue.$http.post('/api/v1.0/qiniu/token/img?bucket=moore', {
          type: 1
        }).then(response => {
          if (type) {
            _vue.addOrEditForm.uploadImgLicense.uploadData.token = response.data.data.token
            _vue.addOrEditForm.uploadImgLicense.uploadData.key = key
          } else {
            _vue.addOrEditForm.uploadImg.uploadData.token = response.data.data.token
            _vue.addOrEditForm.uploadImg.uploadData.key = key
          }
        })
      }
    },
    uploadProgress (type) {
      if (type) {
        this.addOrEditForm.uploadImgLicense.loading = true
      } else {
        this.addOrEditForm.uploadImg.loading = true
      }
    },
    uploadSuccess (res, file, type) {
      if (type) {
        this.addOrEditForm.uploadImgLicense.loading = false
        this.addOrEditForm.uploadImgLicense.uploadedImageUrl = file.response.key
      } else {
        this.addOrEditForm.uploadImg.loading = false
        this.addOrEditForm.uploadImg.uploadedImageUrl = file.response.key
      }
    },
    uploadError (type) {
      if (type) {
        this.addOrEditForm.uploadImgLicense.loading = false
      } else {
        this.addOrEditForm.uploadImg.loading = false
      }
      this.$message({
        type: 'error',
        message: '文件上传失败，请稍后重试',
        center: true,
        showClose: true
      })
    },
    addWorkExpItem () { // 工作经历
      this.addOrEditForm.workExp.push({companyName: '', positions: '', startTime: '', endTime: ''})
      this.addOrEditForm = JSON.parse(JSON.stringify(this.addOrEditForm))
    },
    deleteWorkExpItem (index) {
      this.addOrEditForm.workExp.splice(index, 1)
      this.addOrEditForm = JSON.parse(JSON.stringify(this.addOrEditForm))
    },
    addEducationExpItem () { // 教育背景
      this.addOrEditForm.educationExp.push({schoolName: '', major: '', education: '', startTime: '', endTime: ''})
      this.addOrEditForm = JSON.parse(JSON.stringify(this.addOrEditForm))
    },
    deleteEducationExpItem (index) {
      this.addOrEditForm.educationExp.splice(index, 1)
      this.addOrEditForm = JSON.parse(JSON.stringify(this.addOrEditForm))
    },
    confirmUpdata () {
      let data = {}
      let url = ''
      if (this.type === 'base') {
        data = {
          id: this.addOrEditForm.id,
          email: this.addOrEditForm.email,
          openId: this.baseData.openId,
          mobile: this.addOrEditForm.mobile,
          name: this.addOrEditForm.name,
          type: this.baseData.type,
          isAttention: this.addOrEditForm.isAttention,
          stage: this.baseData.stage,
          address: this.addOrEditForm.city,
          headImg: this.addOrEditForm.uploadImg.uploadedImageUrl,
          job: this.baseData.job
        }
        url = '/api/v1.0/fa/userInfo/update'
      } else if (this.type === 'other') {
        // 职位跟随用户基本信息也要保存
        this.addOrEditForm.id = this.baseData.id || ''
        this.addOrEditForm.name = this.baseData.name || ''
        this.addOrEditForm.mobile = this.baseData.mobile || ''
        this.addOrEditForm.email = this.baseData.email || ''
        this.addOrEditForm.city = this.baseData.address || ''
        this.addOrEditForm.isAttention = this.baseData.isAttention || 0
        this.addOrEditForm.uploadImg = {
          loading: false,
          uploadedImageUrl: this.baseData.headImg || '',
          uploadData: {
            key: '',
            token: ''
          }
        }
        let userInfoData = {
          id: this.addOrEditForm.id,
          email: this.addOrEditForm.email,
          openId: this.baseData.openId,
          mobile: this.addOrEditForm.mobile,
          name: this.addOrEditForm.name,
          type: this.baseData.type,
          isAttention: this.addOrEditForm.isAttention,
          stage: this.baseData.stage,
          address: this.addOrEditForm.city,
          headImg: this.addOrEditForm.uploadImg.uploadedImageUrl,
          job: this.addOrEditForm.job
        }
        this.$http.post('/api/v1.0/fa/userInfo/update', userInfoData)
        // --------------------------  分割线 --------------------  保存其他信息
        data = {
          userId: this.baseData.id || '',
          professionalField: this.addOrEditForm.professionalField.toString(),
          otherServices: this.otherData.otherServices || '',
          id: this.otherData.id || '',
          innerLabel: this.addOrEditForm.inTagArr.join(','),
          externalLabel: this.addOrEditForm.outTagArr.join(','),
          workHistorys: this.addOrEditForm.workExp.map(res => {
            let endTime = ''
            if (res.soFar) {
              endTime = '至今'
            } else {
              endTime = res.endTime || ''
            }
            return {
              companyName: res.companyName || '',
              positions: res.positions || '',
              startTime: res.startTime || '',
              endTime: endTime
            }
          }),
          educationHistorys: this.addOrEditForm.educationExp.map(res => {
            return {
              schoolName: res.schoolName || '',
              major: res.major || '',
              education: res.education || '',
              startTime: res.startTime || '',
              endTime: res.endTime || ''
            }
          }),
          companyName: this.addOrEditForm.companyName,
          empregoPlan: this.addOrEditForm.empregoPlan,
          entrepreneurial: this.addOrEditForm.entrepreneurial,
          workTeamHistory: this.addOrEditForm.workTeamHistory,
          semiconductor: this.addOrEditForm.semiconductorArr.toString()
        }
        url = '/api/v1.0/fa/specialist/addOrUpdate'
      }
      if (this.type === 'base') {
        console.log(this.addOrEditForm)
        if (Global.verification('str', this.addOrEditForm.name) && Global.verification('str', this.addOrEditForm.mobile) && Global.verification('str', this.addOrEditForm.email) && Global.verification('str', this.addOrEditForm.city)) {
          this.updataLoading = true
          this.$http.post(url, data).then((res) => {
            if (res.data.data.updateStatus) {
              this.dialogVisible = false
              this.$message({
                message: '提交成功',
                center: true,
                type: 'success'
              })
              this.getDetail()
            } else {
              return Promise.reject(new Error())
            }
          }).catch(() => {
            this.$message({
              message: '提交失败',
              center: true,
              type: 'error'
            })
          }).finally(() => {
            this.updataLoading = false
          })
        } else {
          this.$message({
            message: '请输入必填项',
            type: 'error'
          })
          return false
        }
      } else {
        console.log(this.addOrEditForm)
        if (Global.verification('obj', this.addOrEditForm.semiconductorArr) && Global.verification('str', this.addOrEditForm.outTagText) && Global.verification('workExp', this.addOrEditForm.workExp) && Global.verification('educationExp', this.addOrEditForm.educationExp) && Global.verification('obj', this.addOrEditForm.professionalField) && Global.verification('str', this.addOrEditForm.empregoPlan) && Global.verification('str', this.addOrEditForm.entrepreneurial)) {
          this.updataLoading = true
          this.$http.post(url, data).then((res) => {
            if (res.data.data.updateStatus) {
              this.dialogVisible = false
              this.$message({
                message: '提交成功',
                center: true,
                type: 'success'
              })
              this.getDetail()
            } else {
              return Promise.reject(new Error())
            }
          }).catch(() => {
            this.$message({
              message: '提交失败',
              center: true,
              type: 'error'
            })
          }).finally(() => {
            this.updataLoading = false
          })
        } else {
          this.$message({
            message: '请输入必填项',
            type: 'error'
          })
          return false
        }
      }
    },
    sendConfirmMsg () {
      // 发送确认消息
      this.remindDialogVisible = true
    },
    sendCheckRemind () { // 发送核对提醒
      this.lastCheckTime = new Date().getTime()
      this.$http.get('/api/v1.0/fa/userInfo/userInfoCheck', {params: {userId: this.baseData.id}}).then((res) => {
        this.$message({
          message: '提交成功',
          center: true,
          type: 'success'
        })
        this.remindDialogVisible = false
      }).catch(_ => {
        this.$message({
          message: '发送失败',
          center: true,
          type: 'error'
        })
      })
    },
    sendEmailRemind () { // 发送邮件提醒
      this.lastEmailTime = new Date().getTime()
      this.$http.get('/api/v1.0/fa/userInfo/sendOpenFollow', {params: {userId: this.baseData.id}}).then((res) => {
        this.$message.success('发送成功')
      }).catch(_ => {
        this.$message.error('发送失败')
      })
    },
    getExternalLabel (val) {
      this.addOrEditForm.outTagArr = _.pluck(val, 'id')
      this.addOrEditForm.outTagText = _.pluck(val, 'name').toString()
    },
    getInnerLabel (val) {
      this.addOrEditForm.inTagArr = _.pluck(val, 'id')
      this.addOrEditForm.inTagText = _.pluck(val, 'name').toString()
    },
    openExternalDialog () {
      this.$refs.refExternalLabel.show = true
      this.$refs.refExternalLabel.fetchSenLabel(this.addOrEditForm.semiconductorArr.toString())
      // if (this.otherData.externalLabel && !this.$refs.refExternalLabel.hasChange) {
      let externalLabel = this.otherData.externalLabel ? this.otherData.externalLabel.split(',') : []
      // 外显标签需要回显
      window.setTimeout(() => {
        this.$refs.refExternalLabel.setCheckedVal(externalLabel)
      }, 500)
      // }
    },
    openInnerDialog () {
      this.$refs.refInnerLabel.show = true
      this.$refs.refInnerLabel.fetchSenLabel(this.addOrEditForm.semiconductorArr.toString())
      // if (this.otherData.innerLabel && !this.$refs.refInnerLabel.hasChange) {
      // 外显标签需要回显
      let innerLabel = this.otherData.innerLabel ? this.otherData.innerLabel.split(',') : []
      window.setTimeout(() => {
        this.$refs.refInnerLabel.setCheckedVal(innerLabel)
      }, 500)
      // }
    },
    fetchAllTag () {
      // 获取所有标签
      this.$http.get('/api/v1.0/fa/tag/findAllTag?parentId=0').then(res => {
        let result = res.data.data[0].childTag
        this.processLabelArr = FaCommon.handleAllTag(result)
      })
    },
    handleLabelName (val, processLabelArr) {
      // 根据tagId显示tagName
      let str = ''
      if (val) {
        let arr = val.split(',')
        let list = _.filter(processLabelArr, item => {
          return arr.indexOf(item.id + '') !== -1
        })
        str = _.pluck(list, 'name').toString()
      }
      return str
    },
    /*
    getExternalLabel (val) {
      this.externalLabelIdArr = _.pluck(val, 'id')
      this.externalLabels = _.pluck(val, 'name').toString()
    },
    getInnerLabel (val) {
      this.innerLabelIdArr = _.pluck(val, 'id')
      this.innerLabels = _.pluck(val, 'name').toString()
    },
    openExternalDialog () {
      this.$refs.refExternalLabel.show = true
      if (this.project.externalLabel && !this.$refs.refExternalLabel.hasChange) {
        // 外显标签需要回显
        window.setTimeout(() => {
          this.$refs.refExternalLabel.setCheckedVal(this.project.externalLabel.split(','))
        }, 500)
      }
    },
    openInnerDialog () {
      this.$refs.refInnerLabel.show = true
      if (this.project.innerLabel && !this.$refs.refInnerLabel.hasChange) {
        // 外显标签需要回显
        window.setTimeout(() => {
          this.$refs.refInnerLabel.setCheckedVal(this.project.innerLabel.split(','))
        }, 500)
      }
    },
    */
    goExpertList () {
      // 返回列表
      this.$router.push({
        path: '/fa/expert'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "~assets/css/variable";
  .expert-wrap-detail{
      .dialog{
        .el-dialog__wrapper {
          > :first-child {
            margin: 0 auto;
            margin-top: 15vh;
            height: 222px;
            width:30%;
            .el-form {
              width: 100%;
            }
          }
        }
      }
    .el-dialog__wrapper {
      > :first-child {
        margin-right: 0;
        height: 100%;
        .el-form {
          width: 100%;
        }
      }
    }
    .wrapper {
      box-shadow: 0 2px 8px 0 rgba(0,0,0,.1);
      padding: 10px;
      margin-bottom: 20px;
      min-height: 80px;
      .h-title {
        font-weight: bold;
        font-size: 15px;
        margin-right: 10px;
        .icon {
          float: right;
          font-size: 20px;
          cursor: pointer;
        }
      }
      .cnt-wrap {
        margin-top: 15px;
        > .item {
          padding: 8px 0;
          display: flex;
          align-items: center;
          .title {
            color: #999;
            width: 120px;
            margin-right: 25px;
          }
          .cnt {
            flex: 1;
            img{
              max-width:150px;
              max-height:150px;
            }
            .alias-input-status {
              .input {
                width: 60%;
              }
              .cancel {
                color: #909399;
                cursor: pointer;
                display: inline-block;
                margin: 0 10px;
              }
              .sure {
                color: #409eff;
                cursor: pointer;
              }
            }
            .alias-text-status {
              .edit-alias-btn {
                padding: 0 5px;
                cursor: pointer;
              }
            }
            .unsign-wrap {
              display: flex;
              align-items: center;
              .text {
                color: #909399;
                margin-right: 15px;
              }
            }
            .sign-wrap {
            }
            &.basic-confirm {
              display: flex;
              align-items: center;
              .text {
                margin-right: 15px;
                &.disabled {
                  color: #909399;
                }
              }
            }
            .close-project-wrap {
              display: flex;
              align-items: center;
              .text {
                margin-right: 15px;
              }
              .close-btn {}
            }
          }
        }
      }
      .mainItem{
        .noneTitle{
          color: #999;
          margin-top:15px;
        }
        .mainItemContent+.mainItemContent{
          margin-top:15px;
          padding-top:15px;
          border-top:1px dashed #ddd;
        }
      }
    }
  }
</style>
<style lang="scss">
  .expert-wrap-detail{
    .el-dialog{
      width: 40%;
      // margin-right: 0;
      display: flex;
      flex-direction: column;
      .el-dialog__body{
        height: 100%;
        overflow: auto;
        .upload-image{
          height: 80px;
        }
        .workExp{
          &+.workExp{
            margin-top:10px;
            padding-top:12px;
            border-top: 1px dashed #ddd;
          }
          &+button{
             margin-top:10px;
          }
          .el-form-item+.el-form-item{
            margin-top:10px;
          }
          .el-date-editor--daterange.el-input__inner{width:100%;}
          .el-date-editor.el-input{
            width:100%;
          }
        }
        .hr{
          margin:40px 0;
          height:1px;
          background-color: #ddd;
          position: relative;
          span{
            position: absolute;
            width:150px;
            background-color: #fff;
            text-align: center;
            left: 50%;
            transform: translate(-50%,-50%)
          }
        }
        .register{
          .el-form-item__content>.el-input{
            width:150px;
            margin-right:10px;
          }
          .el-select{
            margin-left:8px;
            width:100px;
          }
        }
      }
    }
  }
  .back-link {
    color: #409eff;
    margin-bottom: 20px;
    margin-left: 10px;
    cursor: pointer;
    display: inline-block;
  }
  .split-line-wrap {
    border-bottom: 1px dashed #909399;
    position: relative;
    margin: 40px 0;
    .text {
      background-color: #fff;
      position: absolute;
      left: 50%;
      padding: 10px 20px;
      color: #303133;
      transform: translate3d(-50%, -50%, 0);
    }
  }
  .add-item {
    text-align: right;
    margin-bottom: 10px;
  }
  .dialog-footer {
    text-align: center;
  }
  .avatar {
    height: 80px;
  }
</style>
