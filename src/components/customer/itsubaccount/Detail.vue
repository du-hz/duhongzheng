<template>
  <div class="detail-wrap company">
    <div class="back-action-wrap" style="margin-bottom:30px;">
      <div class="back-action" @click="pageBack">
        <i class="el-icon-arrow-left"></i>
        <span class="text">返回列表</span>
      </div>
    </div>
    <div class="cnt-block basic-info">
      <div class="sub-title">
        <span class="title">企业账号管理-IT服务</span>
        <el-button type="primary" size="small" @click="companyDetail" v-if="actionPermission.showCompanyUpdate">查看公司详情</el-button>
      </div>
      <div class="basic-info-cnt el-table-style">
        <table width='100%'>
          <tr>
            <td>
              <el-row>
                <el-col :span="4">
                  <span>企业名称</span>
                </el-col>
                <el-col :span="16" style="border-right: 0px;">
                  <span>{{customer.companyShortname}}</span>
                </el-col>
                <el-col :span="4">
                  <span><i class="el-icon-check" style="color: #8bc34a;font-size: 1.23rem;vertical-align: sub;margin-right: 5px;font-weight: 700;"></i>已关联</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <span>联系人</span>
                </el-col>
                <el-col :span="20">
                  <span>{{customer.mainSub.name}}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <span>当前职位</span>
                </el-col>
                <el-col :span="20">
                  <span>{{customer.mainSub.currentJobTitle}}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <span>联系电话</span>
                </el-col>
                <el-col :span="20">
                  <span>{{customer.mainSub.mobile}}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <span>登录邮箱</span>
                </el-col>
                <el-col :span="20">
                  <span>{{customer.mainSub.email}}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <span>技术支持(摩尔)</span>
                </el-col>
                <el-col :span="16" style="border-right: 0px;">
                  <span>{{customer.adminName}}</span>
                </el-col>
                <el-col :span="4">
                  <span class="action-link" @click="change">变更技术支持</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <span>当前业务</span>
                </el-col>
                <el-col :span="16">
                  <span>{{customer.mainProduct}}</span>
                </el-col>
                <el-col :span="4">
                  <span class="action-link" @click="edit">编辑</span>
                </el-col>
              </el-row>
            </td>
            <td style="width: 300px; border-right: 1px solid #e8e8e8; border-bottom: 1px solid #e8e8e8; font-size: 1rem;font-weight: 700;">
              <img :src="qrcode_url" alt="" style="width: 90%;display: block;margin:0px auto;">
            </td>
          </tr>
        </table>
      </div>
    </div>
    <!-- 关联账号 -->
    <div class="cnt-block subaccount-info">
      <div class="sub-title">
        <span class="title">已关联账号</span>
        <el-button type="primary" size="small" @click="addSubaccount()">新增</el-button>
      </div>
      <div class="subaccount-info-cnt">
        <table class="info-cnt-table">
          <colgroup>
            <col width="60">
            <col width="120">
            <col width="120">
            <col width="100">
            <col width="180">
            <col width="80">
            <col width="150">
            <col>
          </colgroup>
          <thead>
            <tr>
              <th>序号</th>
              <th>姓名</th>
              <th>电话</th>
              <th>邮箱</th>
              <th>当前状态</th>
              <th>身份</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody v-if="customer.subs.length > 0">
            <tr v-for="(sub, index) in customer.subs" :key="'c_' + index">
              <td>
                <span>{{index+1}}</span>
              </td>
              <td>
                <!-- <span class="action-link" @click="subDetail(sub.id)">{{sub.name}}</span> -->
                <span>{{sub.name}}</span>
              </td>
              <td>
                <span>{{sub.mobile}}</span>
              </td>
              <td>
                <span>{{sub.email}}</span>
              </td>
              <td>
                <span>{{sub.isEmailValidate | filterEmailStatus}}</span>
              </td>
              <td>
                <span v-if="sub.isMasterITService === 1">主联系人</span>
                <span v-if="sub.isMasterITService === 0">其他联系人</span>
              </td>
              <td>
                  <span class="action-link" @click="editSubAccount(sub)">编辑</span>
                  <span class="action-link" v-if="customer.subs.length > 1" @click="deleteSubAccount(sub)">删除</span>
                  <span class="action-link" @click="resetPassword(sub)">重置密码</span>
                  <span class="action-link" v-if="sub.isMasterITService === 0" @click="setMaster(sub.id)">设为主联系人</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 新增关联子账号 -->
    <el-dialog :title="title" width="40%" :visible.sync="dialogAccountVisible">
      <el-form class="form" :model="accountForm" ref="accountForm" :rules="rules">
        <el-form-item v-if="title === '新建关联账号'" prop="email" label="邮箱地址" labelWidth="100px">
          <el-input
            ref="email"
            @blur="email_lost_force"
            placeholder="邮箱地址"
            v-model="accountForm.email"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item prop="name" label="姓名" labelWidth="100px">
          <el-input
            @focus="name_get_force"
            placeholder="姓名"
            v-model="accountForm.name"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="联系电话" labelWidth="100px">
          <el-input
            placeholder="联系电话"
            @focus="tel_get_force"
            v-model="accountForm.mobile"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item prop="currentJobTitle" label="职位" labelWidth="100px">
          <el-input
            @focus="job_get_force"
            placeholder="职位"
            v-model="accountForm.currentJobTitle"
            clearable>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="action-wrap">
        <el-button @click="closeAccountForm('accountForm')">取 消</el-button>
        <el-button type="primary" @click="submitAccountForm('accountForm')" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 变更技术支持 -->
    <el-dialog title="变更技术支持" width="20%" :visible.sync="dialogSalesVisible">
      <el-select v-model="salesId" style="width: 180px;">
        <el-option value="">请选择</el-option>
        <el-option
          v-for="item in salesOptions"
          :key="item.adminId"
          :label="item.adminName"
          :value="item.adminId">
        </el-option>
      </el-select>
      <el-button type="primary" @click="updateSupport()">
        确定
      </el-button>
    </el-dialog>
    <!-- 变更当前业务 -->
    <el-dialog title="变更当前业务" width="20%" :visible.sync="dialogProduceVisible">
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="productContent">
      </el-input>
      <el-button type="primary" @click="updateProduce()">
        确定
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
import Global from 'assets/js/global'
import _ from 'underscore'

export default {
  data () {
    return {
      id: this.$route.params.id,
      title: '',
      qrcode_url: '',
      fullscreenLoading: false,
      customer: {
        industry: '',
        mainSub: {},
        subs: [],
        financial: {},
        manager: {},
        schedules: [],
        marketSwotVo: {}
      },
      accountForm: {
        id: '',
        name: '',
        mobile: '',
        email: '',
        currentJobTitle: ''
      },
      dialogAccountVisible: false,
      dialogBasicVisible: false,
      dialogSalesVisible: false,
      dialogProduceVisible: false,
      basicForm: {
        companyFullname: '',
        companyShortname: '',
        enCompanyFullname: '',
        bizType: '',
        establishedDate: '',
        website: '',
        hqAddress: '',
        branchLocation: '',
        scale: '',
        industryChainManyId: '',
        industryChainManyName: '',
        mainProduct: '',
        adminId: '',
        adminName: '',
        industry: [],
        businessLicense: '',
        socialCreditNumber: '',
        alias: ''
      },
      scaleOptions: Global.CONSTANT.SCALE,
      industryOpts: Global.CONSTANT.INDUSTRY,
      industryChainOpts: [],
      salesOptions: [],
      salesId: '',
      productContent: '',
      financeForm: {
        customerId: '',
        registerCapital: '',
        top5Shareholders: '',
        foreignProportionOfInvestment: '',
        shareHolders: [],
        revenues: [],
        bankAccount: ''
      },
      yearOpts: [],
      dialogScheduleVisible: false,
      scheduleForm: {
        schedules: []
      },
      dialogMarketVisible: false,
      marketForm: {
        strengths: '',
        opportunities: '',
        weaknesses: '',
        threats: '',
        compares: []
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { max: 50, message: '长度50个字符', trigger: 'blur' }
        ],
        currentJobTitle: [
          { required: true, message: '请输入职位', trigger: 'blur' },
          { max: 200, message: '职位长度最多200字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          {pattern: Global.REGEX.ALLPHONE, message: '请检查联系电话格式', trigger: 'blur'}
        ],
        email: [
          { required: true, message: '请输入登录邮箱', trigger: 'blur' },
          {pattern: Global.REGEX.EMAIL, message: '请检查登录邮箱格式', trigger: 'blur'}
        ]
      },
      actionPermission: {
        showCompanyAdd: Global.hasActionPermission('company_add'),
        showCompanyUpdate: Global.hasActionPermission('company_update'),
        showCompanyView: Global.hasActionPermission('company_view'),
        showCompanyDelete: Global.hasActionPermission('company_delete')
      }
    }
  },
  created () {
    this.fetchCustomerInfo()
    this.fetchSalesData()
    this.fetchChain()
    this.initYearOpts()
    this.getQrCode()
  },
  computed: {
    industryName () {
      let name = ''
      if (this.customer.industry !== '') {
        let arr = this.customer.industry.split(',')
        _.each(arr, (id) => {
          let industry = _.findWhere(Global.CONSTANT.INDUSTRY, {value: parseInt(id)})
          if (industry !== undefined) {
            let label = industry.label
            name += label + ','
          }
        })
      }
      return name.substring(0, name.length - 1)
    },
    scaleName () {
      let name = ''
      if (this.customer.scale !== '') {
        let scale = _.findWhere(Global.CONSTANT.SCALE, {value: parseInt(this.customer.scale)})
        if (scale !== undefined) {
          name = scale.label
        }
      }
      return name
    }
  },
  methods: {
    initYearOpts () {
      // 初始化年份选择区间
      let year = new Date().getFullYear()
      let minYear = year - 10
      let maxYear = year + 10
      for (let i = minYear; i <= maxYear; i++) {
        let yearItem = {
          label: i + '',
          value: i + ''
        }
        this.yearOpts.push(yearItem)
      }
    },
    pageBack () {
      this.$router.push({
        path: '/customer/itsubaccounts'
      })
    },
    companyDetail () {
      this.$router.push({
        path: '/customer/company/' + this.id
      })
    },
    fetchSalesData () {
      // 获取技术支持数据
      let _vue = this
      _vue.$http.get('/api/v1.0/admin/manager/support').then((response) => {
        _vue.salesOptions = response.data.data.supportManage
      })
    },
    fetchChain () {
      // 查询产业链
      let _vue = this
      _vue.$http.get('/api/v1.0/customer/industrychains').then((response) => {
        _vue.industryChainOpts = response.data.data.industryChains
      })
    },
    fetchCustomerInfo () {
      let _vue = this
      _vue.$http.get('/api/v1.0/customer?id=' + _vue.id + '&type=2').then((response) => {
        _vue.customer = response.data.data.customer
        _vue.getQrCode(_vue.customer.mainSub.id)
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    getQrCode (subId) {
      let _vue = this
      _vue.$http.get('/api/v1.0/qiniu/uploadQRCode?id=' + subId).then((response) => {
        console.log(response)
        _vue.qrcode_url = response.data.data.url
      })
    },
    subDetail (id) {
      this.$router.push({
        name: 'subaccountDetail',
        params: {
          id: id
        }
      })
    },
    orderList (email) {
      // 跳转到订单列表
      this.$router.push({
        path: '/order/tapeout',
        query: {
          email: email
        }
      })
    },
    editBasicInfo () {
      this.basicForm.companyFullname = this.customer.companyFullname
      this.basicForm.companyShortname = this.customer.companyShortname
      this.basicForm.enCompanyFullname = this.customer.enCompanyFullname
      this.basicForm.alias = this.customer.alias
      this.basicForm.bizType = this.customer.bizType
      this.basicForm.establishedDate = this.customer.establishedDate
      this.basicForm.website = this.customer.website
      this.basicForm.hqAddress = this.customer.hqAddress
      this.basicForm.branchLocation = this.customer.branchLocation
      this.basicForm.scale = parseInt(this.customer.scale)
      this.basicForm.industryChainManyId = parseInt(this.customer.industryChainManyId)
      this.basicForm.mainProduct = this.customer.mainProduct
      this.basicForm.adminId = parseInt(this.customer.adminId)
      this.basicForm.industry = _.map(this.customer.industry.split(','), (item) => { if (item) return parseInt(item) })
      this.basicForm.businessLicense = this.customer.businessLicense
      this.basicForm.socialCreditNumber = this.customer.socialCreditNumber
      this.dialogBasicVisible = true
    },
    addSubaccount () {
      this.title = '新建关联账号'
      this.dialogAccountVisible = true
      this.accountForm = {
        id: '',
        name: '',
        mobile: '',
        email: '',
        currentJobTitle: ''
      }
    },
    editSubAccount (sub) {
      this.title = '修改联系人'
      this.dialogAccountVisible = true
      this.accountForm = sub
    },
    closeAccountForm (formName) {
      this.$refs[formName].resetFields()
      this.dialogAccountVisible = false
    },
    submitAccountForm (formName) {
      // TODO: 表单验证 - 验证邮箱是否存在
      let _vue = this
      _vue.fullscreenLoading = true
      _vue.$refs[formName].validate((valid) => {
        if (valid) {
          if (_vue.title === '新建关联账号') {
            _vue.$http.post('/api/v1.0/customer/subIT', {
              name: _vue.accountForm.name,
              email: _vue.accountForm.email,
              mobile: _vue.accountForm.mobile,
              jobTitle: _vue.accountForm.currentJobTitle,
              isOpenItService: 1,
              isITMaster: 0,
              customerId: _vue.id
            }).then(() => {
              _vue.$message({
                type: 'success',
                message: '添加关联账号成功',
                center: true
              })
              _vue.fullscreenLoading = false
              _vue.dialogAccountVisible = false
              _vue.fetchCustomerInfo()
            }).catch((response) => {
              // TODO:邮箱验证出错
              let error = response.response.data.error.message
              _vue.fullscreenLoading = false
              _vue.$message({
                type: 'error',
                message: error,
                center: true
              })
            })
          } else {
            _vue.$http.put('/api/v1.0/customer/sub', {
              id: _vue.accountForm.id,
              name: _vue.accountForm.name,
              email: _vue.accountForm.email,
              mobile: _vue.accountForm.mobile,
              jobTitle: _vue.accountForm.currentJobTitle,
              customerId: _vue.id
            }).then(() => {
              _vue.$message({
                type: 'success',
                message: '更新关联账号成功',
                center: true
              })
              _vue.fullscreenLoading = false
            }).catch(() => {
              _vue.$message({
                type: 'error',
                message: '更新失败，请稍后再试',
                center: true
              })
              _vue.fullscreenLoading = false
            })
          }
        }
      })
    },
    // 变更技术支持
    updateSupport () {
      let _vue = this
      if (_vue.salesId === '') {
        _vue.$message({
          type: 'error',
          message: '请选择技术支持'
        })
        return
      }
      _vue.$http.put('/api/v1.0/customer/support', {
        id: _vue.id,
        adminId: _vue.salesId
      }).then(() => {
        _vue.$message({
          type: 'success',
          message: '编辑成功'
        })
        _vue.dialogSalesVisible = false
        _vue.fetchCustomerInfo()
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后再试'
        })
      })
    },
    updateProduce () {
      // 变更当前业务
      let _vue = this
      _vue.$http.put('api/v1.0/customer', {
        id: _vue.id,
        mainProduct: _vue.productContent
      }).then(() => {
        _vue.$message({
          type: 'success',
          message: '编辑成功'
        })
        _vue.dialogProduceVisible = false
        _vue.fetchCustomerInfo()
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后再试'
        })
      })
    },
    edit () {
      // 编辑当前业务
      this.dialogProduceVisible = true
    },
    setMaster (subId) {
      // 设为主联系人（IT）
      let _vue = this
      _vue.$http.post('/api/v1.0/customer/sub/itmaster', {
        cusId: _vue.id,
        subId: subId
      }).then(() => {
        _vue.$message({
          type: 'success',
          message: '主联系人设置成功',
          center: true
        })
        _vue.fetchCustomerInfo()
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    deleteSubAccount (sub) {
      // 删除关联账号
      let _vue = this
      _vue.$confirm('确认删除该账号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _vue.$http.delete('/api/v1.0/customer/subs?subId=' + sub.id).then(() => {
          _vue.fetchCustomerInfo()
          _vue.$message({
            type: 'success',
            message: '删除成功!',
            center: true
          })
        }).catch(() => {
          _vue.$message({
            type: 'error',
            message: '请稍后重试',
            center: true
          })
        })
      }).catch(() => {
      })
    },
    change () {
      this.dialogSalesVisible = true
    },
    resetPassword (sub) {
      let _vue = this
      _vue.$confirm('确认重置密码？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _vue.$http.put('/api/v1.0/customer/sub/resetpassword?subId=' + sub.id).then(() => {
          _vue.$message({
            type: 'success',
            message: '重置密码邮件已发送',
            center: true
          })
        }).catch(() => {
          _vue.$message({
            type: 'error',
            message: '重置失败，请稍后再试',
            center: true
          })
        })
      })
    },
    checkEmail () {
      // 当其余输入框获得焦点是验证email是否为空
      if (this.accountForm.email === '') {
        this.$message({
          type: 'error',
          message: '请先填写邮箱',
          center: true
        })
        this.$nextTick(function () {
          this.$refs.email.focus()
        })
      }
    },
    email_lost_force () {
      let _vue = this
      // 根据邮箱获取账号信息
      if (this.accountForm.email !== '') {
        this.$http.get('/api/v1.0/customer/subaccount?email=' + this.accountForm.email).then((response) => {
          console.log(response.data.data.email)
          if (response.data.data.email === undefined) {
            return
          }
          _vue.accountForm.name = response.data.data.name
          // _vue.addCompanySubaccountForm.id = response.data.data.id
          _vue.accountForm.mobile = response.data.data.mobile
          _vue.accountForm.email = response.data.data.email
          _vue.accountForm.currentJobTitle = response.data.data.currentJobTitle
        })
      }
    },
    name_get_force () {
      this.checkEmail()
    },
    tel_get_force () {
      this.checkEmail()
    },
    job_get_force () {
      this.checkEmail()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~assets/css/variable';
  .detail-wrap {
    .cnt-block {
      margin-bottom: 50px;

      .sub-title {
        .title {
          display: inline-block;
          font-size: 16px;
          color: $primary-color;
        }
        .el-button {
          float: right;
          margin-top: -8px;
        }
        margin-bottom: 20px;
      }
      .el-table-style {
        border-top: 1px solid $border-color;
        border-left: 1px solid $border-color;

        .el-row {
          &:nth-child(odd) {
            .el-col {
              background-color: $secondary-color;
            }
          }

          .el-col {
            border-right: 1px solid $border-color;
            border-bottom: 1px solid $border-color;
            height: 45px;
            line-height: 45px;
            padding-left: 10px;
            font-size: 14px;

            &:nth-child(odd) {
              font-weight: 600;
              color: #454545;
            }
          }
        }
      }
    }
  }
  .link {
    color: $primary-color;
    text-decoration: underline;
    white-space: normal;
    word-wrap: break-word;
    word-break: break-all;
    display: inline-block;
    width: 100%;
    line-height: 20px;
  }
  .action-link {
    color: $primary-color;
    text-decoration: underline;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: break-word;
    word-break: break-all;
    max-width: 120px;
    display: inline-block;
    vertical-align: middle;
    margin-top: -3px;
  }
  .info-cnt-table {
    width: 100%;
    border-left: 1px solid $border-color;
    font-size: 14px;

    th, td {
      border-right: 1px solid $border-color;
      border-bottom: 1px solid $border-color;
      text-align: center;
    }
    th {
      background-color: $primary-color;
      color: #fff;
      font-size: 14px;
      padding: 10px 0;
    }
    td {
      padding: 12px 0;
    }
  }
  .line-title {
    font-size: 15px;
    color: #666;
    height: 20px;
    line-height: 20px;
    border-left: 3px solid $border-color;
    padding-left: 10px;
    margin-bottom: 15px;
    margin-top: 30px;
  }
  .list-item-wrap {
    .title {
      display: inline-block;
      width: 120px;
      border-right: 1px solid $border-color;
      font-weight: 600;
    }
    .text {
      font-weight: normal;
      display: inline-block;
      padding-left: 10px;
    }
  }
  .row-table {
    text-align: center;
    .el-row {
      background-color: #fff;

      .el-col {
        font-weight: normal !important;
      }
    }
    .table-head {
      background-color: $secondary-color;

      .el-col {
        font-weight: 600 !important;
      }
    }
  }
  .form-wrap {
    max-height: 600px;
    overflow-y: auto;
  }
  .add-item-wrap {
    border-bottom: 1px dashed $secondary-color;
    position: relative;
    margin-top: 30px;

    &:first-child {
      padding-top: 0;
    }
    &:last-child {
      border-bottom: none;
    }
    .action-wrap {
      position: absolute;
      top: -30px;
      right: 0;
      cursor: pointer;

      .el-icon-delete {
        font-size: 22px;
        color: #999;

        &:hover {
          color: #666;
        }
      }
    }
  }
  .inline-form {
    width: 100%;
  }
  .compare-item .el-form-item {
    margin-bottom: 15px;
  }
</style>
