<template>
    <div class="detail-container">
      <div class="goBack" @click='$router.go(-1)'>&lt;&lt; 返回列表</div>
      <el-row :gutter="20">
        <el-col class="left-container" :span="22">
          <el-row class="top-block" :gutter="20">
            <el-col :span="16">
            <!-- 投资机构信息 -->
            <div class="wrapper project-block" v-if="investorData.faMechanism.id">
              <div class="h-title">投资机构信息<i @click="editOrg" class="icon el-icon-edit"></i></div>
              <div class="cnt-wrap">
                <div class="item">
                    <div class="title">产业及资本</div>
                    <div class="cnt">{{investorData.faMechanism.mechanismType === 1 ? '投资机构' : '产业及其他资本' }}</div>
                  </div>
                  <div class="item">
                      <div class="title">公司别称</div>
                      <div class="cnt">{{investorData.faMechanism.mechanismName}}</div>
                    </div>
                  <div class="item">
                    <div class="title">公司名</div>
                    <div class="cnt">{{investorData.faMechanism.companyName}}</div>
                  </div>
                <div class="item">
                  <!-- TODO：投资人需要修改 -->
                  <div class="title">投资人</div>
                  <div class="cnt">{{investorPerson || '暂无'}}</div>
                </div>
                <!-- <div class="item">
                  <div class="title">注册时间</div>
                  <div class="cnt">{{investorData.faMechanism.registrationTime}}</div>
                </div> -->
                <div class="item">
                  <div class="title">注册地</div>
                  <div class="cnt">{{investorData.faMechanism.companyRegisterAddress}}</div>
                </div>
                <div class="item">
                  <div class="title">注册资金</div>
                  <div class="cnt">{{investorData.faMechanism.registeredFund}}</div>
                </div>
                <div class="item">
                  <div class="title">法人名称</div>
                  <div class="cnt">{{investorData.faMechanism.legalName}}</div>
                </div>
                <div class="item">
                  <div class="title">联系方式</div>
                  <div class="cnt">{{investorData.faMechanism.legalTelephone}}</div>
                </div>
                <div class="item">
                  <div class="title">公司注册时间</div>
                  <div class="cnt">{{investorData.faMechanism.marketTime}}</div>
                </div>
                <div class="item">
                  <div class="title">机构背景</div>
                  <div class="cnt">{{investorData.faMechanism.companyBackground}}</div>
                </div>
                <div class="item">
                  <div class="title">机构产业类别</div>
                  <div class="cnt">{{investorData.faMechanism.industrialCategory}}</div>
                </div>
                <div class="item">
                  <div class="title">管理团队</div>
                  <div class="cnt" v-html="investorData.faMechanism.management"></div>
                </div>
                <div class="item">
                  <div class="title">可投资金总量</div>
                  <div class="cnt">{{investorData.faMechanism.availableCapital}}</div>
                </div>
                <div class="item">
                  <div class="title">资金主要来源</div>
                  <div class="cnt">{{investorData.faMechanism.capitalSource}}</div>
                </div>
                <div class="item">
                  <div class="title">行业领域</div>
                  <div class="cnt">{{investorData.faMechanism.investmentTerritory | industryCategoryFilter}}</div>
                </div>
                <div class="item">
                  <div class="title">单项投资额</div>
                  <div class="cnt">{{investorData.faMechanism.investmentAmount}}</div>
                </div>
                <!-- 投资机构 -->
                <template v-if="investorData.faMechanism.mechanismType === 1">
                  <div class="item">
                    <div class="title">存续期</div>
                    <div class="cnt">{{investorData.faMechanism.duration}}</div>
                  </div>
                  <div class="item">
                    <div class="title">投资案例</div>
                    <div class="cnt" v-html="investorData.faMechanism.investmentCase"></div>
                  </div>
                  <div class="item">
                    <div class="title">主投阶段</div>
                    <div class="cnt">{{investorData.faMechanism.investmentStage | investStageFilter}}</div>
                  </div>
                  <!-- <div class="item">
                    <div class="title">主投产业</div>
                    <div class="cnt">{{investorData.faMechanism.semiconductor}}</div>
                  </div> -->
                  <div class="item">
                    <div class="title">特别投资需求通道</div>
                    <div class="cnt">{{investorData.faMechanism.investmentDemand}}</div>
                  </div>
                  <div class="item">
                    <div class="title">其他服务</div>
                    <div class="cnt">{{otherService}}</div>
                  </div>
                </template>
                <!-- 产业及其他资本 -->
                <template v-if="investorData.faMechanism.mechanismType === 2">
                  <div class="item">
                    <div class="title">主营业务及市场</div>
                    <div class="cnt">{{investorData.faMechanism.business}}</div>
                  </div>
                  <div class="item">
                    <div class="title">投资及收购案例</div>
                    <div class="cnt" style="width:90%">
                      <div v-html="investorData.faMechanism.acquisitionCase"></div>
                    </div>
                  </div>
                  <div class="item">
                    <div class="title">特别收购需求通道</div>
                    <div class="cnt">{{investorData.faMechanism.purchaseDemand}}</div>
                  </div>
                  <!-- <div class="item">
                    <div class="title">目标标的</div>
                    <div class="cnt">{{investorData.faMechanism.semiconductor}}</div>
                  </div> -->
                </template>
                <div class="item">
                  <div class="title">投资产业链方向</div>
                  <div class="cnt" style="width:90%">{{semiconductor || '暂无'}}</div>
                </div>
                <div class="item">
                  <div class="title">对外标签</div>
                  <div class="cnt" style='width:90%;'>{{externalLabelText}}</div>
                </div>
                <div class="split-line-wrap">
                  <div class="text">下列信息不对外展示</div>
                </div>
                <div class="item">
                  <div class="title">对内标签</div>
                  <div class="cnt" style='width:90%;'>{{innerLabelText}}</div>
                </div>
                <div class="item">
                  <div class="title">公司营业执照</div>
                  <div class="cnt">
                    <img class="upload-image license-img" :src="investorData.faMechanism.companyLicense | filterQiniuMooreImage" alt="">
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!investorData.faMechanism.id" class="wrapper project-block">
                <div class="h-title">投资机构信息</div>
                <div @click="editOrg" class="empty-wrap">
                  <div class="add-btn-wrap">
                    <i class="icon el-icon-plus"></i>
                    <div class="text">添加投资机构信息</div>
                  </div>
                </div>
            </div>
            </el-col>
        </el-row>
      </el-col>
    </el-row>
      <!-- 投资机构信息 -->
      <AddNewMechanism ref="refAddNewOrgMechanism" @refreshDetail='refreshGetData'></AddNewMechanism>
    </div>
  </template>

<script>
import Global from 'assets/js/global'
import AddNewMechanism from './widgets/addNewMechanism'
import FaCommon from 'assets/js/faCommon'
import _ from 'underscore'
// import _ from 'underscore'
export default {
  components: {
    AddNewMechanism
  },
  data () {
    return {
      INDUSTRIALCATEGORY: [],
      semiconductorOptions: [],
      innerLabelText: '',
      externalLabelText: '',
      innerLabels: '',
      externalLabels: '',
      isShow: true,
      mechanismType: sessionStorage.getItem('mechanismType'),
      investorPIds: [],
      investorPerson: '',
      otherService: '',
      semiconductor: '',
      tagsOpts: [], // 标签
      fetchTagLoading: false, // 标签
      investorStageData: [],
      otherServicesData: [],
      emiconductorData: [],
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
      uploading: false,
      id: this.$route.params.id,
      remindDialogVisible: false,
      userFormDialogVisible: false,
      editUserForm: {},
      companyFormDialogVisible: false,
      investorFormDialogVisible: false,
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
          marketTime: '',
          business: '',
          // registrationTime: '',
          companyRegisterAddress: '',
          mechanismType: '',
          capitalSource: '',
          duration: '',
          investmentTerritory: '',
          availableCapital: '',
          investmentAmount: '',
          investmentStage: '',
          investmentCase: '',
          acquisitionCase: '',
          otherService: '',
          semiconductor: '',
          investmentDemand: '',
          purchaseDemand: '',
          management: ''
        },
        tagVo: {
          innerLabel: [],
          externalLabel: []
        }
      },
      mechanismModel: {},
      userInfoModel: {},
      faMechanism: {},
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
      labelWidth: '150px',
      // 编辑投资人基本信息
      INVESTORSTAGE: Global.CONSTANT.INVESTORSTAGE, // 主投阶段
      investorData: {},
      mechanismData: {}
    }
  },
  created () {
    console.log('this.$route.params.id:' + this.$route.params.id)
    this.fetchAllTag()
    this.fetchFristTag()
    this.mechanismDetail()
    this.getIndustrialCategory()
  },
  methods: {
    getIndustrialCategory () {
      this.$http.get('/api/v1.0/fa/common/find', {params: {name: 'industrialCategory'}}).then((res) => {
        let result = res.data.data
        this.INDUSTRIALCATEGORY = _.map(result, item => {
          item.value = item.value + ''
          return item
        })
      })
    },
    refreshGetData (res) {
      console.log('重新请求' + res)
      if (res) {
        console.log('重新请求')
        this.mechanismDetail()
      }
    },
    fetchAllTag () {
      // 获取所有标签
      this.$http.get('/api/v1.0/fa/tag/findAllTag?parentId=0').then(res => {
        this.labelData = res.data.data[0].childTag
        this.processLabelArr = FaCommon.handleAllTag(this.labelData)
      })
    },
    fetchFristTag () {
      this.$http.get('/api/v1.0/fa/tag/findAllTag?parentId=1').then(res => {
        this.semiconductorOptions = res.data.data
      })
      return this.semiconductorOptions
    },
    fundTypeFilter (val) {
      // 货币类型
      val = parseInt(val)
      if (val === 1) {
        return '人民币'
      } else if (val === 2) {
        return '美元'
      } else if (val === 3) {
        return '港币'
      } else if (val === 4) {
        return '欧元'
      } else if (val === 5) {
        return '其他'
      }
    },
    mechanismDetail () {
      // TODO: 获取投资机构详情
      let self = this
      let data = {
        params: {
          id: this.id
        }
      }
      this.$http.get('/api/v1.0/fa/mechanism/details', data).then((res) => {
        console.log('获取投资机构详情')
        console.log(res.data.data)
        console.log('___________')
        let data = res.data.data
        this.mechanismData = data
        self.investorPerson = data.investorNames.join('/')
        self.mechanismType = JSON.stringify(data.faMechanism.mechanismType)
        self.otherService = JSON.parse(JSON.stringify(data.faMechanism.otherService))
        // TODO: 标签待处理
        window.setTimeout(() => {
          self.otherService = self.otherService === null ? '' : self.stringifyArr(self.otherService, self.otherServicesOptions)
          self.semiconductor = data.faMechanism.semiconductor === null ? '' : self.stringifyArr(data.faMechanism.semiconductor, self.fetchFristTag())
          self.innerLabelText = data.tagVo.innerLabel ? self.stringifyArr(data.tagVo.innerLabel, self.processLabelArr) : ''
          self.externalLabelText = data.tagVo.externalLabel ? self.stringifyArr(data.tagVo.externalLabel, self.processLabelArr) : ''
          self.externalLabels = data.tagVo.externalLabel ? self.stringifyArr(data.tagVo.externalLabel, self.processLabelArr) : ''
          self.innerLabels = data.tagVo.innerLabel ? self.stringifyArr(data.tagVo.innerLabel, self.processLabelArr) : ''
        }, 500)
        self.investorData = data
      })
    },
    handleLabelName (val, processLabelArr) {
      // 根据tagId显示tagName
      console.log('handleLabelName根据tagId显示tagName===============')
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
    // 字符串转换
    stringifyArr (str, options) {
      // console.log('*******************')
      // console.log(str)
      // console.log(options)
      if (JSON.stringify(str).length === 1 || str.length === 1) {
        options.map((item) => {
          // console.log(item)
          // console.log(item.id)
          if (JSON.stringify(str) === JSON.stringify(item.value) || str === JSON.stringify(item.value)) {
            str = item.label
            return str
          } else if (str === JSON.stringify(item.id)) {
            str = item.name
            return str
          }
        })
        return str
      }
      let arr = str.split(',')
      options.map((item) => {
        // console.log(item.id)
        arr.map((items, index) => {
          if (items === JSON.stringify(item.value)) {
            arr[index] = item.label
            return items
          } else if (items === JSON.stringify(item.id)) {
            arr[index] = item.name
            return items
          }
        })
      })
      arr = arr.join(',').replace(new RegExp(',', 'gm'), ' / ')
      return arr
    },
    // 字符串数字转化数组
    strParseInt (str) {
      let newArr = []
      if (str === null || str === '') {
        newArr = []
      } else {
        str.split(',').map((item) => {
          item = parseInt(item)
          newArr.push(item)
          return item
        })
      }
      return newArr
    },
    editOrg () {
      // 编辑机构信息-新
      console.log('this.investorData')
      console.log(this.investorData)
      console.log('this.investorData.tagVo.externalLabel')
      console.log(this.investorData.tagVo.externalLabel)
      console.log(this.investorData.tagVo.innerLabel)
      this.$refs.refAddNewOrgMechanism.investorFormDialogVisible = true
      this.$refs.refAddNewOrgMechanism.mechanismForm = JSON.parse(JSON.stringify(this.investorData))
      this.$refs.refAddNewOrgMechanism.id = this.id
      this.$refs.refAddNewOrgMechanism.mechanismType = JSON.stringify(this.investorData.faMechanism.mechanismType)
      this.$refs.refAddNewOrgMechanism.innerLabels = this.innerLabels
      this.$refs.refAddNewOrgMechanism.externalLabels = this.externalLabels
      this.$refs.refAddNewOrgMechanism.investorIds = this.investorData.investorNames
      // this.$refs.refAddNewOrgMechanism.externalLabelIdArr = this.investorData.tagVo.externalLabel === null ? '' : this.investorData.tagVo.externalLabel.split(',')
      // this.$refs.refAddNewOrgMechanism.innerLabelIdArr = this.investorData.tagVo.innerLabel === null ? '' : this.investorData.tagVo.innerLabel.split(',')
      let otherService = this.investorData.faMechanism.otherService ? this.investorData.faMechanism.otherService.split(',') : []
      this.$refs.refAddNewOrgMechanism.uploadedImageUrlLicense = this.investorData.faMechanism.companyLicense || ''
      if (otherService.length > 1) {
        this.$refs.refAddNewOrgMechanism.other = otherService.map(item => {
          item = Number(item)
          return item
        })
      }
      let investmentStage = this.investorData.faMechanism.investmentStage ? this.investorData.faMechanism.investmentStage.split(',') : []
      if (investmentStage.length > 1) {
        this.$refs.refAddNewOrgMechanism.investmentStage = investmentStage.map(item => {
          item = Number(item)
          return item
        })
      }
      this.$refs.refAddNewOrgMechanism.investmentTerritory = this.investorData.faMechanism.investmentTerritory ? this.investorData.faMechanism.investmentTerritory.split(',') : []
      console.log('--investmentTerritory--')
      console.log(this.$refs.refAddNewOrgMechanism.investmentTerritory)
      let externalLabel = this.investorData.tagVo.externalLabel ? this.investorData.tagVo.externalLabel.split(',') : ''
      if (externalLabel.length > 1) {
        this.$refs.refAddNewOrgMechanism.externalLabelIdArr = externalLabel.map(item => {
          item = JSON.parse(item)
          return item
        })
        console.log('this.$refs.refAddNewOrgMechanism.externalLabelIdArr')
        console.log(this.$refs.refAddNewOrgMechanism.externalLabelIdArr)
      }
      let innerLabel = this.investorData.tagVo.innerLabel ? this.investorData.tagVo.innerLabel.split(',') : ''
      if (innerLabel.length > 1) {
        this.$refs.refAddNewOrgMechanism.innerLabelIdArr = innerLabel.map(item => {
          item = JSON.parse(item)
          return item
        })
      }
      if (this.investorData.faMechanism.mechanismType === 1) {
        this.$refs.refAddNewOrgMechanism.isShow = true
      } else {
        this.$refs.refAddNewOrgMechanism.isShow = false
      }
      if (this.investorData.faMechanism.semiconductor !== null && this.investorData.faMechanism.semiconductor.length > 1) {
        let semiconductor = this.investorData.faMechanism.semiconductor.split(',')
        semiconductor = semiconductor.map((item) => {
          item = JSON.parse(item)
          return item
        })
        this.$refs.refAddNewOrgMechanism.semiconductorData = semiconductor
      } else {
        let sem = this.investorData.faMechanism.semiconductor ? JSON.parse(this.investorData.faMechanism.semiconductor) : ''
        this.$refs.refAddNewOrgMechanism.semiconductorData = sem ? [sem] : []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .detail-container {
    .el-dialog__wrapper {
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
    .goBack {
      color: #409eff;
      cursor: pointer;
      margin-bottom: 20px;
      margin-left: 10px;
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
  .empty-wrap {
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    .add-btn-wrap {
      display: flex;
      align-items: center;
      .icon {
        font-size: 25px;
        margin-right: 20px;
      }
      .text {
        font-size: 18px;
      }
    }
  }
  }
</style>
<style lang="scss" scoped>
  .detail-container {
    .el-dialog__wrapper {
      > :first-child {
        margin-right: 0;
        height: 100%;
        width: 40%;
        .el-form {
          width: 100%;
        }
      }
    }
    .wrapper {
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .1);
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
      .mainItem{
        .noneTitle{
          text-align:center;
          color: #999;
          margin-top:15px;
        }
          margin-top:15px;
          padding:15px 0;
          border-bottom:1px dashed #ddd;
      }
        > .item {
          padding: 8px 0;
          display: flex;
          align-items: center;
          .title {
            color: #999;
            width: 130px;
          }
          .cnt {
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
              .close-btn {
              }
            }
          }
        }
      }
    }
    .summary-list {
      &.appointment {
        cursor: pointer;
      }
      &.vertical {
        display: flex;
        .item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          .state {
            font-size: 13px;
            color: #909399;
          }
          .count {
            font-size: 22px;
            color: #303133;
          }
        }
      }
      &.horizontal {
        display: flex;
        .item {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid #909399;
          &:last-child {
            border-right: none;
          }
          .state {
            font-size: 13px;
            color: #909399;
          }
          .count {
            font-size: 15px;
            color: #409EFF;
            text-decoration: underline;
            padding-left: 5px;
            cursor: pointer;
          }
        }
      }
    }
    .appointment-list {
      .appointment-item {
        border-bottom: 1px solid #909399;
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        &:last-child {
          border-bottom: none;
        }
        .info-wrap {
          .top {
            color: #303133;
            display: flex;
            .time {
              margin-right: 10px;
            }
          }
          .bottom {
            display: flex;
            color: #909399;
            .name {
              margin-right: 10px;
            }
          }
        }
        .action-wrap {
        }
      }
    }
    .dialog-form {
      height: 80vh;
      overflow: auto;
      .workExp{
            padding:12px 0;
            border-top: 1px dashed #ddd;
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
    }
    .dialog-footer {
      text-align: center;
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
