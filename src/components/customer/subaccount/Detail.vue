<template>
  <div>
    <div class="back-action-wrap">
      <div class="back-action" @click="pageBack">
        <i class="el-icon-arrow-left"></i>
        <span class="text">返回列表</span>
      </div>
    </div>
    <div class="table-title">企业用户管理
      <div class="ip-operate-wrap">
        <el-tag type="info" v-if="accountInfo.ipSupplier">当前企业为IP供应商</el-tag>
        <el-button type="primary" v-if="!accountInfo.ipSupplier" @click="setIpSupplier">设置当前企业为IP供应商</el-button>
      </div>
    </div>
    <table class="cnt-table tr-bg">
      <tbody>
      <tr>
        <td class="title">姓名</td>
        <td>{{accountInfo.name}}</td>
      </tr>
      <tr>
        <td class="title">电话</td>
        <td>{{accountInfo.mobile}}</td>
      </tr>
      <tr>
        <td class="title">注册邮箱</td>
        <td>
          <el-row type="flex">
            <el-col :span="18">{{accountInfo.email}}
              <span class="account-status" v-if="accountInfo.status === 0">（待审核）</span>
              <span class="account-status" v-if="accountInfo.status === 1">（已审核）</span>
              <span class="account-status" v-if="accountInfo.status === 2">（审核不通过）</span>
            </el-col>
            <el-col :span="6">
              <span class="action-link" @click="editEmail">更改邮箱</span>
              <span v-if="emailStatus === 0" class="action-link" @click="emailValidate">帮他验证</span>
            </el-col>
          </el-row>
        </td>
      </tr>
      <tr>
        <td class="title">当前职位</td>
        <td>{{accountInfo.currentJobTitle}}</td>
      </tr>
      <tr>
        <td class="title">企业名称</td>
        <td>
          <el-row type="flex">
            <el-col :span="18">{{accountInfo.customerName || '-'}}</el-col>
            <el-col :span="6">
              <span class="action-link" @click="linkCompany">关联现有企业</span>
              <span class="action-link" @click="addCompany">新建企业</span>
            </el-col>
          </el-row>
        </td>
      </tr>
      <tr>
        <td class="title">企业官网</td>
        <td>
          <a class="action-link" :href="accountInfo.website" target="_blank">{{accountInfo.website}}</a>
        </td>
      </tr>
      <tr>
        <td class="title">应用领域</td>
        <td>{{accountInfo.industry | filterIndustry}}</td>
      </tr>
      <tr>
        <td class="title">企业规模</td>
        <td>{{accountInfo.scale | filterScale}}</td>
      </tr>
      <tr>
        <td class="title">营业执照</td>
        <td>
          <span v-if="accountInfo.businessLicense === ''">-</span>
          <span v-if="accountInfo.businessLicense !== ''" class="action-link" @click="viewImage(accountInfo.businessLicense)">点击查看</span>
        </td>
      </tr>
      <tr>
        <td class="title">社会统一信用号</td>
        <td>{{accountInfo.socialCreditNumber}}</td>
      </tr>
      <tr>
        <td class="title">销售经理</td>
        <td>
          <el-row type="flex">
            <el-col :span="18">{{accountInfo.adminName || '-'}}</el-col>
            <el-col :span="6">
              <span class="action-link" @click="editCompanySales">更改销售经理</span>
            </el-col>
          </el-row>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="action-wrap" style="margin-top: 30px;">
      <el-button @click="checkAccount(2)" v-if="accountStatus === 0 || accountStatus === 1">审核不通过</el-button>
      <el-button type="primary" @click="checkAccount(1)" v-if="accountStatus === 0">审核通过</el-button>
      <el-button type="primary" @click="checkAccount(1)" v-if="accountStatus === 2">再次审核</el-button>
    </div>

    <!--关联企业-->
    <el-dialog title="关联企业" :visible.sync="dialogLinkCompanyVisible" width="35%">
      <el-form :model="linkCompanyForm" ref="linkCompanyForm" class="link-company-wrap">
        <div class="cnt-item">企业名称：<span class="text">{{accountInfo.customerName}}</span></div>
        <div class="cnt-item">当前关联企业：<span class="text">{{accountInfo.customerName}}</span></div>
        <div class="company-select">
          <!--<div class="select-item">
            <el-radio v-model="linkType" label="1">推荐关联企业 - <span class="text">{{recLinkCompany}}</span></el-radio>
          </div>-->
          <div class="select-item">
            <el-radio v-model="linkType" label="2">关联已有企业
            <span v-if="linkType === '2'" style="margin-left: 10px">
              <el-select
                v-model="linkCompanyForm.customerId"
                filterable
                remote
                popper-class="modal-select"
                placeholder="请输入公司名称"
                :remote-method="remoteMethod"
                @focus="remoteMethod"
                :loading="remoteLoading">
                <el-option
                  v-for="item in customerOpts"
                  :key="item.id"
                  :label="item.companyFullname"
                  :value="parseInt(item.id)">
                </el-option>
              </el-select>
            </span>
            </el-radio>
          </div>
        </div>
      </el-form>
      <div class="action-wrap">
        <el-button @click="dialogLinkCompanyVisible = false">取消</el-button>
        <el-button @click="sureLinkCompany" type="primary">确定关联</el-button>
      </div>
    </el-dialog>

    <!--新建企业-->
    <el-dialog title="新建企业" :visible.sync="dialogAddCompanyVisible">
      <el-form :model="addCompanyForm" :rules="rules" ref="addCompanyForm" label-width="100px" style="width: 80%;">
        <el-form-item label="企业简称" prop="companyShortname">
          <el-input v-model="addCompanyForm.companyShortname" placeholder="企业简称" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="企业全称" prop="companyFullname">
          <el-input v-model="addCompanyForm.companyFullname" placeholder="企业全称" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="所在产业链" prop="industryChain">
          <el-select v-model="addCompanyForm.industryChainManyId" placeholder="请选择" style="width: 80%;">
            <el-option
              v-for="item in industryChainOpts"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业别称" prop="companyAliasname">
          <el-input v-model="addCompanyForm.alias" placeholder="企业别称" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="应用领域" prop="industry">
          <el-select v-model="addCompanyForm.industry" multiple :multiple-limit="3" placeholder="请选择" style="width: 80%;">
            <el-option
              v-for="item in industryOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业规模" prop="scale">
          <el-select v-model="addCompanyForm.scale" placeholder="企业规模" style="width: 80%;">
            <el-option
              v-for="item in scaleOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业官网" prop="website">
          <el-input v-model="addCompanyForm.website" placeholder="企业官网" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="销售经理">
          <el-select v-model="addCompanyForm.adminId" placeholder="请选择" style="width: 80%;">
            <el-option
              v-for="item in salesOptions"
              :key="item.adminId"
              :label="item.adminName"
              :value="item.adminId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="action-wrap">
        <el-button @click="closeAddCompany('addCompanyForm')">取 消</el-button>
        <el-button type="primary" @click="sureAddCompany('addCompanyForm')">新建并绑定</el-button>
      </div>
    </el-dialog>

    <!-- 更改销售经理 -->
    <el-dialog title="更改销售经理" :visible.sync="dialogManageVisible" width="30%">
      <el-form>
        <el-form-item label="请选择销售经理" :label-width="formLabelWidth">
          <el-select v-model="editSaleManagerId" filterable placeholder="请选择">
            <el-option
              v-for="item in salesOptions"
              :key="item.adminId"
              :label="item.adminName"
              :value="item.adminId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="action-wrap">
        <el-button type="primary" class="center" @click="sureEditManager">确认修改</el-button>
      </div>
    </el-dialog>

    <!--更改邮箱-->
    <el-dialog title="更改邮箱" :visible.sync="dialogEditEmailVisible" width="30%">
      <el-form :model="editEmailForm" ref="editEmailForm">
        <el-form-item label="请输入更换的邮箱" label-width="130px">
          <el-input v-model="editEmailForm.email"></el-input>
        </el-form-item>
        <div class="action-wrap">
          <el-button @click="dialogEditEmailVisible = false">取消</el-button>
          <el-button type="primary" @click="sureEditEmail">确认更改</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'underscore'
import Global from 'assets/js/global'

export default {
  data () {
    return {
      restaurants: [],
      accountId: this.$route.params.id,
      accountInfo: {
        status: 0
      },
      pager: {
        curPage: 1,
        size: 10
      },
      salesOptions: [],
      allCompanys: [],
      tableData: {},
      dialogFormVisible: false,
      radio: '1',
      form: {
        companyName: ''
      },
      formLabelWidth: '180px',
      companyName: '',
      checkStatus: 0,
      subId: '',
      selectCompanyId: 1,
      dialogFormAddVisible: false,
      newForm: {
        companyShortName: '',
        companyFullName: '',
        industryId: '',
        companyAnoterName: '',
        saleManagerId: ''
      },
      saleManager: [],
      industry: [],
      companySizeId: '',
      editSaleManagerId: '',
      dialogManageVisible: false,
      saleManagerId: '',
      dialogEditEmailVisible: false,
      editEmailForm: {
        email: ''
      },
      linkCompanyForm: {
        customerId: '',
        customerName: ''
      },
      dialogLinkCompanyVisible: false,
      dialogAddCompanyVisible: false,
      linkType: this.recLinkCompany !== '' ? '1' : '2',
      addCompanyForm: {
        companyFullname: '',
        companyShortname: '',
        industryChainManyId: '', // 产业链ID
        alias: '',
        industry: [], // 应用领域
        scale: '',
        website: '',
        adminId: '' // 销售经理
      },
      rules: {
        companyShortname: [
          { required: true, message: '请填写公司简称', trigger: 'blur' },
          { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
        ],
        companyFullname: [
          { required: true, message: '请填写公司全称', trigger: 'blur' },
          { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
        ],
        industryChain: [
          { required: true, message: '请选择产业链', trigger: 'change' }
        ],
        companyAliasname: [
          { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
        ],
        industry: [
          { type: 'array', required: true, message: '请选择应用领域', trigger: 'change' },
          { type: 'array', max: 3, message: '最多选择三个', trigger: 'change' }
        ],
        scale: [
          { required: true, message: '请选择企业规模', trigger: 'change' }
        ],
        website: [
          { pattern: Global.REGEX.WEBSITE, message: '网站格式不正确', trigger: 'blur' }
        ]
      },
      industryOpts: Global.CONSTANT.INDUSTRY,
      scaleOpts: Global.CONSTANT.SCALE,
      industryChainOpts: [],
      actionPermission: {
        showSubaccountAdd: Global.hasActionPermission('subaccount_add'),
        showSubaccountUpdate: Global.hasActionPermission('subaccount_update'),
        showSubaccountView: Global.hasActionPermission('subaccount_view'),
        showSubaccountDelete: Global.hasActionPermission('subaccount_delete')
      },
      allCompanyNames: [], // 所有公司名称
      inputLinkCompany: '', // 查询要关联的企业，输入的公司名
      searchCompanyList: [], // 查询公司结果
      linkCompanyId: '', // 最后关联的公司Id
      remoteLoading: false,
      customerOpts: []
    }
  },
  computed: {
    accountStatus () {
      return this.accountInfo.status || 0
    },
    emailStatus () {
      return this.accountInfo.emailStatus || 0
    },
    recLinkCompany () {
      // 推荐关联公司
      let company = _.findWhere(this.allCompanys, {
        value: this.accountInfo.customerName
      })
      return company !== undefined ? company.value : ''
    },
    adminName () {
      let _vue = this
      let sales = _.findWhere(_vue.salesOptions, {
        adminId: _vue.addCompanyForm.adminId
      })
      return sales === undefined ? '' : sales.adminName
    },
    industryChainManyName () {
      let _vue = this
      let chain = _.findWhere(Global.CONSTANT.INDUSTRY_CHAIN, {
        value: _vue.addCompanyForm.industryChainManyId
      })
      return chain === undefined ? '' : chain.label
    },
    editSaleManagerName () {
      // 根据 editSaleManagerId 查出adminName，参数需要
      let _vue = this
      let admin = _.findWhere(_vue.salesOptions, {adminId: _vue.editSaleManagerId})
      let result = ''
      if (admin) {
        result = admin.adminName
      }
      return result
    }
  },
  created () {
    this.getUserInfo()
    this.fetchSalesData()
    this.fetchAllCompany()
    this.fetchAllCompanyNames()
    this.fetchChain()
  },
  methods: {
    getUserInfo: function () {
      let _vue = this
      _vue.$http.get('/api/v1.0/customer/sub?subId=' + _vue.accountId).then(function (response) {
        _vue.accountInfo = response.data.data.subaccount
        // TODO: 根据返回的 customerId 是否为空表示是否已绑定公司
      })
      // TODO: 产业链动态获取
      _vue.$http.get('/api/v1.0/customer/industrychains').then(function (response) {
        _vue.industry = response.data.data.industryChains
      })
    },
    fetchSalesData () {
      // 获取销售数据
      let _vue = this
      _vue.$http.get('/api/v1.0/admin/manager/sale').then((response) => {
        _vue.salesOptions = response.data.data.sales
      })
    },
    fetchAllCompany () {
      // 公司自动补全
      let _vue = this
      _vue.$http.get('/api/v1.0/customers?page=1&per_page=99999').then((response) => {
        let rows = response.data.data.rows
        _.each(rows, (company) => {
          let newItem = {}
          newItem.id = company.id
          newItem.value = company.companyShortname
          _vue.allCompanys.push(newItem)
        })
      })
    },
    fetchAllCompanyNames () {
      // 获取所有公司名字，可以替换 customers 接口，不需要全部字段  TODO: 待启用
      let _vue = this
      _vue.$http.get('/api/v1.0/customer/nametips?page=1&per_page=99999').then((response) => {
        _vue.allCompanyNames = response.data.data.customerTips
      })
    },
    fetchChain () {
      // 查询产业链
      let _vue = this
      _vue.$http.get('/api/v1.0/customer/industrychains').then((response) => {
        _vue.industryChainOpts = response.data.data.industryChains
      })
    },
    sureEditManager () {
      // 确认更改销售
      var _vue = this
      _vue.$http.put('/api/v1.0/customer/sub/sale', {
        subId: _vue.accountInfo.id,
        adminId: _vue.editSaleManagerId
      }).then(() => {
        _vue.$message({
          type: 'success',
          message: '更改销售成功',
          center: true
        })
        _vue.getUserInfo()
        _vue.dialogManageVisible = false
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    editEmail: function () {
      this.dialogEditEmailVisible = true
    },
    emailValidate: function () {
      var _vue = this
      _vue.$http.post('/api/v1.0/customer/sub/valid', {
        subId: _vue.accountId
      }).then(function () {
        _vue.$message({
          type: 'success',
          message: '邮箱已验证',
          center: true
        })
        _vue.getUserInfo()
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    sureEditEmail: function () {
      var _vue = this
      // TODO: 表单验证
      _vue.$http.put('/api/v1.0/customer/sub/email', {
        subId: _vue.accountId,
        email: _vue.editEmailForm.email
      }).then(function () {
        _vue.$message({
          type: 'success',
          message: '邮箱修改成功',
          center: true
        })
        _vue.dialogEditEmailVisible = false
        _vue.getUserInfo()
      }).catch((error) => {
        let field = Global.extractErrorField(error)
        if (field === 'subaccount') {
          _vue.$message({
            type: 'error',
            message: '邮箱地址已存在，请更换邮箱',
            center: true
          })
        } else {
          _vue.$message({
            type: 'error',
            message: '请稍后重试',
            center: true
          })
        }
      })
    },
    viewImage (url) {
      // 查看营业执照图片
      if (url.startsWith('cloud/')) {
        url = Global.CONFIG.QINIU_BUCKET_URL + '/' + url
      }
      window.open(url)
    },
    pageBack () {
      this.$router.push({
        path: '/customer/subaccounts'
      })
    },
    checkAccount (status) {
      // 账号审核
      let _vue = this
      if (status === 1) {
        if (!_vue.accountInfo.customerId || _vue.accountInfo.customerId === 0) {
          _vue.$message({
            type: 'warning',
            message: '请先关联企业',
            center: true
          })
        } else {
          _vue.$http.post('/api/v1.0/customer/sub/audit', {
            subId: _vue.accountId,
            status: status
          }).then(() => {
            _vue.$message({
              type: 'success',
              message: '邮箱' + (status === 1 ? '审核通过' : '审核不通过'),
              center: true
            })
            _vue.getUserInfo()
          }).catch(() => {
            _vue.$message({
              type: 'error',
              message: '请稍后重试',
              center: true
            })
          })
        }
      } else {
        _vue.$http.post('/api/v1.0/customer/sub/audit', {
          subId: _vue.accountId,
          status: status
        }).then(() => {
          _vue.$message({
            type: 'success',
            message: '邮箱' + (status === 1 ? '审核通过' : '审核不通过'),
            center: true
          })
          _vue.getUserInfo()
        }).catch(() => {
          _vue.$message({
            type: 'error',
            message: '请稍后重试',
            center: true
          })
        })
      }
    },
    queryCompany (queryString, cb) {
      let _vue = this
      let allCompanys = _vue.allCompanys
      let results = queryString ? _.filter(allCompanys, (item) => {
        return item.value && item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
      }) : allCompanys
      cb(results)
    },
    handleSelectCompany (item) {
      this.linkCompanyForm.customerId = item.id
    },
    linkCompany () {
      this.dialogLinkCompanyVisible = true
    },
    sureLinkCompany () {
      let _vue = this
      // TODO: 公司验证
      let company = {}
      if (_vue.linkType === '1') {
        company = _.findWhere(_vue.allCompanys, {
          value: _vue.recLinkCompany
        })
        _vue.linkCompanyForm.customerId = company !== undefined ? company.id : ''
      }
      console.log(_vue.linkCompanyForm.customerId)
      if (!_vue.linkCompanyForm.customerId) {
        _vue.$message({
          type: 'error',
          message: '请选择企业',
          center: true
        })
      } else {
        _vue.$http.post('/api/v1.0/customer/sub/link', {
          customerId: _vue.linkCompanyForm.customerId,
          subId: _vue.accountId
        }).then(() => {
          _vue.$message({
            type: 'success',
            message: '关联企业成功',
            center: true
          })
          _vue.dialogLinkCompanyVisible = false
          _vue.getUserInfo()
        }).catch(() => {
          _vue.$message({
            type: 'error',
            message: '请稍后重试',
            center: true
          })
        })
      }
    },
    addCompany () {
      this.dialogAddCompanyVisible = true
    },
    sureAddCompany () {
      // 新建并关联
      // TODO: 表单验证
      let _vue = this
      _vue.$http.post('/api/v1.0/customer', {
        companyFullname: _vue.addCompanyForm.companyFullname,
        companyShortname: _vue.addCompanyForm.companyShortname,
        industryChainManyId: _vue.addCompanyForm.industryChainManyId,
        industryChainManyName: _vue.industryChainManyName,
        alias: _vue.addCompanyForm.alias,
        industry: _vue.addCompanyForm.industry.toString(),
        scale: _vue.addCompanyForm.scale,
        website: _vue.addCompanyForm.website,
        adminId: _vue.addCompanyForm.adminId,
        adminName: _vue.adminName
      }).then((response) => {
        // 新建企业成功后，添加关联
        let customerId = response.data.data.customerId
        _vue.$http.post('/api/v1.0/customer/sub/link', {
          customerId: customerId,
          subId: _vue.accountId
        }).then(() => {
          _vue.$message({
            type: 'success',
            message: '新建企业并关联成功',
            center: true
          })
          _vue.dialogAddCompanyVisible = false
          _vue.getUserInfo()
        }).catch(() => {
          _vue.$message({
            type: 'error',
            message: '请稍后重试',
            center: true
          })
        })
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    closeAddCompany () {
      this.dialogAddCompanyVisible = false
    },
    editCompanySales () {
      // 修改销售经理
      let _vue = this
      _vue.dialogManageVisible = true
      _vue.editSaleManagerId = _vue.accountInfo.adminId
    },
    remoteMethod (val) {
      // 模糊查询公司
      let _vue = this
      let companyName = ''
      if (typeof (val) === 'string') {
        companyName = val
      }
      _vue.remoteLoading = true
      _vue.$http.get('/api/v1.0/customer/company/list?company_name=' + companyName + '&page=1&size=30').then((response) => {
        _vue.remoteLoading = false
        _vue.customerOpts = response.data.data.rows
      })
    },
    setIpSupplier () {
      // 设置当前企业为IP供应商
      let _vue = this
      if (_vue.accountInfo.customerId === 0 || _vue.accountInfo.customerId === null) {
        _vue.$message({
          type: 'warning',
          message: '请先关联企业',
          center: true
        })
      } else {
        _vue.$http.put('/api/v1.0/customer/setipsupplier', {
          customerId: _vue.accountInfo.customerId
        }).then(() => {
          _vue.$message({
            type: 'success',
            message: '添加IP供应商成功',
            center: true
          })
          _vue.getUserInfo()
        }).catch(() => {
          _vue.$message({
            type: 'error',
            message: '请稍后重试',
            center: true
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~assets/css/variable';

  .action-link {
    color: $primary-color;
    text-decoration: underline;
    margin-right: 25px;
    cursor: pointer;
  }
  .table-title {
    margin: 20px 0;
    font-size: 16px;
  }
  .link-company-wrap {
    margin-bottom: 30px;

    .text {
      color: $primary-color;
      font-size: 15px;
    }
    .cnt-item {
      margin-bottom: 15px;
    }
    .company-select {
      padding-top: 20px;
      border-top: 1px solid $border-color;

      .select-item {
        margin-bottom: 15px;
      }
    }
  }
  .account-status {
    color: #999;
    margin-left: 10px;
  }
  .ip-operate-wrap {
    display: inline-block;
    float: right;
    margin-bottom: 20px;
  }
</style>
