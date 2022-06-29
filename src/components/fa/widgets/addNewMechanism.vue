<template>
  <div>
      <!-- 投资机构信息 -->
      <el-dialog
        class="fixed_right"
        title="投资机构信息"
        :visible.sync="investorFormDialogVisible"
        fullscreen
        width="40%">
        <el-form class="dialog-form" :model="mechanismForm">
            <el-form-item label="*机构类型" label-width="150px">
              <el-select v-model='mechanismType'>
                <el-option label='投资机构' value='1'>投资机构</el-option>
                <el-option label='产业及其他资本' value='2'>产业及其他资本</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='公司别称' label-width='150px'>
              <el-input v-model='mechanismForm.faMechanism.mechanismName' placeholder="请输入公司别称，多个用逗号隔开"></el-input>
            </el-form-item>
            <el-form-item label="*公司名" label-width="150px">
              <!-- <el-input v-model="mechanismForm.faMechanism.companyName" @input="inputFName"></el-input> -->
              <el-select
                v-model="mechanismForm.faMechanism.companyName"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
                :loading="loading"
                @change ='changeOption'>
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.fullname"
                  :value="item.fullname">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="投资人" label-width="150px">
              <el-select
            style="width: 100%"
            v-model='investorIds'
            multiple
            filterable
            remote
            reserve-keyword
            default-first-option
            placeholder="请选择投资人"
            :remote-method="remoteFetchTag">
            <el-option
              v-for="item in tagsOpts"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
            </el-form-item>
            <!-- <el-form-item label="注册时间" label-width="150px">
              <el-date-picker
              v-model="mechanismForm.faMechanism.registrationTime"
              type="date"
              format="yyyy-MM-DD"
              value-format="yyyy-MM-DD"
              placeholder="注册时间">
            </el-date-picker>
            </el-form-item> -->
            <el-form-item label="*注册地" label-width="150px">
              <el-input v-model="mechanismForm.faMechanism.companyRegisterAddress"></el-input>
            </el-form-item>
            <el-form-item label="*注册资金" label-width="150px">
              <el-input style="width: 120px;" v-model="mechanismForm.faMechanism.registeredFund"></el-input>
              <!-- <el-select style="width: 120px;" v-model="mechanismForm.faMechanism.fundType" placeholder="请选择">
                <el-option label="人民币" value="1"></el-option>
                <el-option label="美元" value="2"></el-option>
                <el-option label="港币" value="3"></el-option>
                <el-option label="欧元" value="4"></el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item label="*法人名称" label-width="150px">
              <el-input v-model="mechanismForm.faMechanism.legalName"></el-input>
            </el-form-item>
            <el-form-item label="*联系方式" label-width="150px">
              <el-input v-model="mechanismForm.faMechanism.legalTelephone"></el-input>
            </el-form-item>
            <el-form-item label="*公司注册时间" label-width="150px">
              <el-date-picker
              v-model="mechanismForm.faMechanism.marketTime"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="公司注册时间">
            </el-date-picker>
            </el-form-item>
            <el-form-item label="*机构背景" label-width="150px">
                <el-input v-model="mechanismForm.faMechanism.companyBackground"></el-input>
              </el-form-item>
            <el-form-item label="主营业务以及市场" label-width="150px" v-if='!isShow'>
              <el-input v-model="mechanismForm.faMechanism.business"></el-input>
            </el-form-item>
            <el-form-item label="资金主要来源" label-width="150px">
              <el-input v-model="mechanismForm.faMechanism.capitalSource"></el-input>
            </el-form-item>
            <el-form-item label="行业领域" label-width="150px">
              <el-select v-model="investmentTerritory" multiple>
                <el-option :label="item.label" v-for="item in INDUSTRIALCATEGORY" :key="item.value"  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="机构产业类别" label-width="150px">
                <el-input v-model="mechanismForm.faMechanism.industrialCategory"></el-input>
            </el-form-item>
            <!-- <el-form-item label="半导体主投产业"  label-width="150px" v-if='isShow'>
              <el-checkbox-group v-model="semiconductor">
                <el-checkbox :label="item.value" v-for="item in INDUSTRIALCATEGORY" :key="item.value">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="目标标的"  label-width="150px" v-if='!isShow'>
              <el-checkbox-group v-model="semiconductor">
                <el-checkbox :label="item.value" v-for="item in INDUSTRIALCATEGORY" :key="item.value">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item> -->
            <el-form-item label="*主投阶段" label-width="150px" v-if='isShow'>
              <el-select v-model="investmentStage" multiple>
                  <el-option :label="item.label" v-for="item in INVESTORSTAGE" :key="item.value"  :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="*单项投资额" label-width="150px">
              <el-input v-model="mechanismForm.faMechanism.investmentAmount"></el-input>
            </el-form-item>
            <el-form-item label="*可用资金总量" label-width="150px">
              <el-input v-model="mechanismForm.faMechanism.availableCapital"></el-input>
            </el-form-item>
            <el-form-item label="*续存期" label-width="150px" v-if='isShow'>
              <el-input v-model="mechanismForm.faMechanism.duration"></el-input>
            </el-form-item>
            <el-form-item label="其他服务" label-width="150px" v-if='isShow'>
                <el-select v-model="other" multiple>
                    <el-option :label="item.label" v-for="item in otherServicesOptions" :key="item.value"  :value="item.value"></el-option>
                  </el-select>
              </el-form-item>
            <el-form-item label="特别投资需求通道" label-width="150px" v-if='isShow'>
                <el-input v-model="mechanismForm.faMechanism.investmentDemand"></el-input>
              </el-form-item>
            <el-form-item label="特别收购需求通道" label-width="150px" v-if='!isShow'>
                <el-input v-model="mechanismForm.faMechanism.purchaseDemand"></el-input>
              </el-form-item>
      <el-form-item label="*投资及收购案例"  label-width="150px" v-if='!isShow'>
          <vue-ckeditor v-model="mechanismForm.faMechanism.acquisitionCase" :config="ckeditorConfig"></vue-ckeditor>
        </el-form-item>
        <el-form-item label="*投资案例"  label-width="150px" v-if='isShow'>
            <vue-ckeditor v-model="mechanismForm.faMechanism.investmentCase" :config="ckeditorConfig"></vue-ckeditor>
          </el-form-item>
          <el-form-item label="*管理团队"  label-width="150px">
            <vue-ckeditor v-model="mechanismForm.faMechanism.management" :config="ckeditorConfig"></vue-ckeditor>
          </el-form-item>
          <el-form-item label="*投资产业链方向" label-width="150px">
            <el-select
              style="width: 100%"
              v-model='semiconductorData'
              multiple
              filterable
              remote
              reserve-keyword
              default-first-option
              placeholder="选择投资产业链方向"
              >
              <el-option
                v-for="item in semiconductorOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="对外展示标签"  label-width="150px">
              <span v-if="externalLabels">{{externalLabels}}</span>
              <el-button @click="openExternalDialog" type="plain" size="small">选择标签</el-button>
            </el-form-item>
        <el-form-item>
          <div class="split-line-wrap">
            <div class="text">下列信息不对外展示</div>
          </div>
        </el-form-item>
        <el-form-item label="对内展示标签" label-width="150px">
            <span v-if="innerLabels">{{ innerLabels }}</span>
            <el-button @click="openInnerDialog" type="plain" size="small">选择标签</el-button>
          </el-form-item>
            <el-form-item label="公司营业执照" label-width="150px">
              <div class="company-license-wrap">
                <img class="upload-image license-img" v-if="uploadedImageUrlLicense !== ''" :src="uploadedImageUrlLicense | filterQiniuMooreImage" alt="">
                <el-upload
                  class="upload-btn"
                  :show-file-list="false"
                  action="http://upload.qiniup.com/"
                  :before-upload="beforeUploadLicense"
                  :on-progress="uploadProgressLicense"
                  :on-success="uploadSuccessLicense"
                  :on-error="uploadErrorLicense"
                  :data="uploadDataLicense"
                  :multiple="false">
                  <el-button size="small" type="primary">上传公司营业执照</el-button>
                </el-upload>
              </div>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="investorFormDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addNewMechanismData">提 交</el-button>
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
import _ from 'underscore'
import TagDialog from './TagDialog'
import FaCommon from 'assets/js/faCommon'
export default {
  data () {
    return {
      id: '',
      tagsOpts: [],
      INVESTORSTAGE: Global.CONSTANT.INVESTORSTAGE, // 主投阶段
      INDUSTRIALCATEGORY: [], // 主投产业
      uploadedImageUrlLicense: '', // 营业执照
      investorFormDialogVisible: false,
      mechanismType: '',
      investorIds: [],
      getInvestorList: [],
      investorPerson: '',
      isShow: true,
      other: [],
      investmentStage: [],
      investmentTerritory: [],
      otherServicesOptions: [{
        label: '政策业务',
        value: 1
      }, {
        label: '上市辅导',
        value: 2
      }, {
        label: '财务知识',
        value: 3
      }, {
        label: '法律知识',
        value: 4
      }, {
        label: '企业并购经验',
        value: 5
      }, {
        label: '基金设计设立',
        value: 6
      }],
      uploadDataLicense: {
        key: '',
        token: ''
      },
      ckeditorConfig: {
        toolbar: [
          ['BulletedList']
        ],
        height: 100,
        width: '90%'
      },
      semiconductorData: [],
      semiconductorOptions: [],
      semiconductor: [],
      mechanismForm: {
        investorIds: [],
        faMechanism: {
          id: '',
          mechanismName: '',
          companyName: '',
          companyLicense: '',
          registeredFund: '',
          legalName: '',
          legalTelephone: '',
          companyBackground: '',
          companyRegisterAddress: '',
          business: '',
          // registrationTime: '',
          mechanismType: '',
          capitalSource: '',
          marketTime: '',
          duration: '',
          investmentTerritory: '',
          availableCapital: '',
          investmentAmount: '',
          investmentStage: '',
          investmentCase: '',
          acquisitionCase: '',
          otherService: '',
          industrialCategory: '',
          // semiconductor: '',
          investmentDemand: '',
          purchaseDemand: '',
          management: ''
        },
        tagVo: {
          innerLabel: [],
          externalLabel: []
        }},
      innerLabelIdArr: [],
      externalLabelIdArr: [],
      processLabelArr: [],
      innerLabels: '',
      externalLabels: '',
      faMechanismRules: {
        'faMechanism.companyName': [
          { required: true, message: '请填写公司名', trigger: 'blur' }
        ],
        'faMechanism.companyRegisterAddress': [
          { required: true, message: '请填写注册地', trigger: 'blur' }
        ],
        'faMechanism.registeredFund': [
          { required: true, message: '请填写注册资金', trigger: 'blur' }
        ],
        'faMechanism.legalName': [
          { required: true, message: '请填写法人名称', trigger: 'blur' }
        ],
        'faMechanism.legalTelephone': [
          { required: true, message: '请填写联系方式', trigger: 'blur' }
        ],
        'faMechanism.marketTime': [
          { required: true, message: '请填写注册时间', trigger: 'blur' }
        ],
        'faMechanism.companyBackground': [
          { required: true, message: '请填写机构背景', trigger: 'blur' }
        ],
        'faMechanism.management': [
          { required: true, message: '请填写管理团队', trigger: 'blur' }
        ],
        'faMechanism.availableCapital': [
          { required: true, message: '请填写可用资金总量', trigger: 'blur' }
        ],
        'faMechanism.investmentAmount': [
          { required: true, message: '请填写单项投资额', trigger: 'blur' }
        ],
        semiconductorData: [
          {required: true}
        ],
        investmentStage: [
          {required: true}
        ]
      },
      loading: false,
      options: []
    }
  },
  components: {
    TagDialog
  },
  created () {
    this.options = []
    this.getIndustrialCategory()
    this.getinvestorList()
    this.fetchFristTag()
  },
  watch: {
    mechanismType () {
      if (this.mechanismType === '1') {
        console.log('this.mechanismType === 1')
        console.log(this.mechanismType)
        this.isShow = true
      } else {
        console.log('this.mechanismType === 2')
        console.log(this.mechanismType)
        this.isShow = false
      }
    }
  },
  methods: {
    // 查询公司
    getCname (name) {
      let self = this
      this.$http.get('/api/v1.0/fa/investor/query-company?shortName=' + name).then((res) => {
        console.log('查询公司')
        self.options = res.data.data
        self.loading = false
        console.log(self.options)
      })
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        this.getCname(query)
      } else {
        this.options = []
      }
    },
    changeOption (val) {
      console.log(val)
      this.options.map(item => {
        if (item.fullname === val) {
          this.mechanismForm.faMechanism.companyRegisterAddress = item.address
          this.mechanismForm.faMechanism.registeredFund = item.regCapital
          this.mechanismForm.faMechanism.legalName = item.legalPerson
          this.mechanismForm.faMechanism.marketTime = item.foundingTime
        }
      })
    },
    getIndustrialCategory () {
      this.$http.get('/api/v1.0/fa/common/find', {params: {name: 'industrialCategory'}}).then((res) => {
        let result = res.data.data
        _.map(result, item => {
          this.INDUSTRIALCATEGORY.push({
            'value': item.value + '',
            'label': item.lable
          })
          return item
        })
      })
    },
    fetchFristTag () {
      this.$http.get('/api/v1.0/fa/tag/findAllTag?parentId=1').then(res => {
        this.semiconductorOptions = res.data.data
      })
    },
    remoteFetchTag (query) { // 标签输入改变事件
      let _vue = this
      if (!_vue.fetchTagLoading && query !== '') {
        _vue.fetchTagLoading = true
        _vue.$http.get('/api/v1.0/fa/userInfo/findInvestor?name=' + query).then((response) => {
          _vue.fetchTagLoading = false
          _vue.tagsOpts = _.sortBy(response.data.data, 'id')
        })
      } else {
        _vue.tagsOpts = []
      }
    },
    fetchAllTag () {
      // 获取所有标签
      this.$http.get('/api/v1.0/fa/userInfo/findAllTag').then(res => {
        this.labelData = res.data.data[0].childTag
        this.processLabelArr = FaCommon.handleAllTag(this.labelData)
      })
    },
    openExternalDialog () {
      let semiconductorValue = this.semiconductorData.join(',')
      this.$refs.refExternalLabel.show = true
      // this.$refs.refInnerLabel.fetchAllLabel()
      this.$refs.refExternalLabel.fetchSenLabel(semiconductorValue)
      // if (this.externalLabelIdArr && !this.$refs.refExternalLabel.hasChange) {
      //   // 外显标签需要回显
      console.log('&&&&&&&&&')
      console.log(this.externalLabelIdArr)
      let externalLabelIdArr = this.externalLabelIdArr ? this.externalLabelIdArr : []
      window.setTimeout(() => {
        this.$refs.refExternalLabel.setCheckedVal(externalLabelIdArr)
      }, 500)
      // }
    },
    openInnerDialog () {
      let semiconductorValue = this.semiconductorData.join(',')
      this.$refs.refInnerLabel.show = true
      // this.$refs.refInnerLabel.fetchAllLabel()
      this.$refs.refInnerLabel.fetchSenLabel(semiconductorValue)
      // if (this.innerLabelIdArr && !this.$refs.refInnerLabel.hasChange) {
      //   // 内显标签需要回显
      console.log('&&&&&&&&&')
      console.log(this.innerLabelIdArr)
      let innerLabelIdArr = this.innerLabelIdArr ? this.innerLabelIdArr : []
      window.setTimeout(() => {
        this.$refs.refInnerLabel.setCheckedVal(innerLabelIdArr)
      }, 500)
      // }
    },
    getExternalLabel (val) {
      this.externalLabelIdArr = _.pluck(val, 'id')
      this.externalLabels = _.pluck(val, 'name').toString()
    },
    getInnerLabel (val) {
      this.innerLabelIdArr = _.pluck(val, 'id')
      this.innerLabels = _.pluck(val, 'name').toString()
    },
    handleCurrentChange (value) {
      this.pageNum = value
      this.getMechanismData()
    },
    getinvestorList () {
      let self = this
      self.getInvestorList = []
      this.$http.get('/api/v1.0/fa/userInfo/findInvestor', []).then((res) => {
        console.log('投资人列表')
        console.log(res)
        res.data.data.map((item) => {
          self.getInvestorList.push({label: item.name, value: item.id})
        })
        console.log(self.investorPerson)
        let investorPerson = self.investorPerson
        self.investorPerson = self.stringifyArr(investorPerson, self.getInvestorList)
      })
    },
    stringifyArr (str, options) {
      if (JSON.stringify(str).length === 1) {
        options.map((item) => {
          if (JSON.stringify(str) === JSON.stringify(item.value)) {
            str = item.label
            return str
          }
        })
        return str
      }
      let arr = str.split(',')
      options.map((item) => {
        arr.map((items, index) => {
          if (items === JSON.stringify(item.value)) {
            arr[index] = item.label
            return items
          }
        })
      })
      arr = arr.join(',').replace(new RegExp(',', 'gm'), ' / ')
      return arr
    },
    addNewMechanismData () {
      let self = this
      console.log('semiconductorData')
      console.log(self.semiconductorData)
      console.log(this.investorIds)
      if (self.mechanismType === '1' && Global.verification('str', self.mechanismForm.faMechanism.companyName) && Global.verification('str', self.mechanismForm.faMechanism.companyRegisterAddress) && Global.verification('str', self.mechanismForm.faMechanism.registeredFund) && Global.verification('str', self.mechanismForm.faMechanism.legalName) && Global.verification('str', self.mechanismForm.faMechanism.legalTelephone) && Global.verification('str', self.mechanismForm.faMechanism.marketTime) && Global.verification('str', self.mechanismForm.faMechanism.companyBackground) && Global.verification('obj', self.investmentStage) && Global.verification('str', self.mechanismForm.faMechanism.investmentAmount) && Global.verification('str', self.mechanismForm.faMechanism.availableCapital) && Global.verification('str', self.mechanismForm.faMechanism.duration) && Global.verification('str', self.mechanismForm.faMechanism.investmentCase) && Global.verification('str', self.mechanismForm.faMechanism.management) && Global.verification('str', self.semiconductorData)) {
        console.log('this.mechanismForm.investorIds')
        console.log(this.mechanismForm.investorIds)
        console.log(this.mechanismForm.investorNames)
        this.investorIds.map((item, index) => {
          if (typeof item === 'string') {
            this.mechanismForm.investorNames.map((i, n) => {
              if (item === i) {
                this.investorIds[index] = this.mechanismForm.investorIds[n]
              }
            })
          }
          return item
        })
        this.mechanismForm.faMechanism.otherService = this.other.join(',')
        this.mechanismForm.faMechanism.investmentStage = this.investmentStage.join(',')
        this.mechanismForm.faMechanism.investmentTerritory = this.investmentTerritory.join(',')
        this.mechanismForm.faMechanism.mechanismType = this.mechanismType
        this.mechanismForm.investorIds = this.investorIds
        this.mechanismForm.faMechanism.semiconductor = this.semiconductorData ? this.semiconductorData.join(',') : ''
        this.mechanismForm.faMechanism.companyLicense = this.uploadDataLicense.key ? this.uploadDataLicense.key : this.uploadedImageUrlLicense ? this.uploadedImageUrlLicense : ''
        this.mechanismForm.tagVo.innerLabel = this.innerLabelIdArr.join(',')
        this.mechanismForm.tagVo.externalLabel = this.externalLabelIdArr.join(',')
        let data = this.mechanismForm
        console.log(data)
        this.$http.post('/api/v1.0/fa/mechanism/addOrUpdate', data).then((res) => {
          if (res.data.status === 'success') {
            this.investorFormDialogVisible = false
            this.$message.success('提交成功')
            if (this.id) {
              console.log('this.id')
              console.log(this.id)
              this.$emit('refreshDetail', this.id)
            } else {
              this.$emit('refreshDetail', true)
            }
          } else {
            this.investorFormDialogVisible = false
            this.$message.error('提交失败')
          }
        })
      } else if (self.mechanismType === '2' && Global.verification('str', self.mechanismForm.faMechanism.companyName) && Global.verification('str', self.mechanismForm.faMechanism.companyRegisterAddress) && Global.verification('str', self.mechanismForm.faMechanism.registeredFund) && Global.verification('str', self.mechanismForm.faMechanism.legalName) && Global.verification('str', self.mechanismForm.faMechanism.legalTelephone) && Global.verification('str', self.mechanismForm.faMechanism.marketTime) && Global.verification('str', self.mechanismForm.faMechanism.companyBackground) && Global.verification('str', self.mechanismForm.faMechanism.investmentAmount) && Global.verification('str', self.mechanismForm.faMechanism.availableCapital) && Global.verification('str', self.mechanismForm.faMechanism.management) && Global.verification('obj', self.semiconductorData) && Global.verification('str', self.mechanismForm.faMechanism.acquisitionCase)) {
        console.log('this.mechanismForm.investorIds')
        console.log(this.mechanismForm.investorIds)
        console.log(this.mechanismForm.investorNames)
        this.investorIds.map((item, index) => {
          if (typeof item === 'string') {
            this.mechanismForm.investorNames.map((i, n) => {
              if (item === i) {
                this.investorIds[index] = this.mechanismForm.investorIds[n]
              }
            })
          }
          return item
        })
        this.mechanismForm.faMechanism.otherService = this.other.join(',')
        this.mechanismForm.faMechanism.investmentStage = this.investmentStage.join(',')
        this.mechanismForm.faMechanism.investmentTerritory = this.investmentTerritory.join(',')
        this.mechanismForm.faMechanism.mechanismType = this.mechanismType
        this.mechanismForm.investorIds = this.investorIds
        this.mechanismForm.faMechanism.semiconductor = this.semiconductorData ? this.semiconductorData.join(',') : ''
        this.mechanismForm.faMechanism.companyLicense = this.uploadDataLicense.key ? this.uploadDataLicense.key : this.uploadedImageUrlLicense ? this.uploadedImageUrlLicense : ''
        this.mechanismForm.tagVo.innerLabel = this.innerLabelIdArr.join(',')
        this.mechanismForm.tagVo.externalLabel = this.externalLabelIdArr.join(',')
        let data = this.mechanismForm
        console.log(data)
        this.$http.post('/api/v1.0/fa/mechanism/addOrUpdate', data).then((res) => {
          if (res.data.status === 'success') {
            this.investorFormDialogVisible = false
            this.$message.success('提交成功')
            if (this.id) {
              console.log('this.id')
              console.log(this.id)
              this.$emit('refreshDetail', this.id)
            } else {
              this.$emit('refreshDetail', true)
            }
          } else {
            this.investorFormDialogVisible = false
            this.$message.error('提交失败')
          }
        })
      } else {
        console.log('______________________')
        this.$message({
          message: '请输入必填项',
          type: 'error'
        })
        return false
      }
    },
    beforeUploadLicense (file) {
      // 上传公司营业执照
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
          _vue.uploadDataLicense.token = response.data.data.token
          _vue.uploadDataLicense.key = key
          this.uploadedImageUrlLicense = key
        })
      }
    },
    uploadProgressLicense () {
      this.uploading = true
    },
    uploadSuccessLicense (res, file) {
      this.uploading = false
      this.uploadedImageUrlLicense = file.response.key
    },
    uploadErrorLicense () {
      this.uploading = false
      this.$message({
        type: 'error',
        message: '文件上传失败，请稍后重试',
        center: true,
        showClose: true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .fixed_right.el-dialog__wrapper {
    > :first-child {
      margin-right: 0;
      margin-top: 0;
      height: 100%;
      width: 40%;
      .el-form {
        width: 100%;
      }
    }
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
</style>
