<template>
  <div class="table-list-wrap">
    <div class="list-search-wrap">
      <el-form :inline="true" ref="searchForm" :model="searchForm" class="form-inline">
        <el-row class="form-row">
          <el-form-item label="公司名称" prop="companyName">
            <el-autocomplete
              class='inline-input'
              v-model='searchForm.companyName'
              :fetch-suggestions='queryCompany'
              placeholder='请输入公司名称'
              :trigger-on-focus="false"
              @select='handleSelectCompany'
              style="width: 180px;"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="技术支持" prop="salesId">
            <el-select v-model="searchForm.salesId" placeholder="请选择" style="width: 180px;">
              <el-option
                v-for="item in salesOptions"
                :key="item.adminId"
                :label="item.adminName"
                :value="item.adminId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开通时间">
            <el-form-item prop="startRegisterTime">
              <el-date-picker
                v-model="searchForm.startRegisterTime"
                value-format="yyyy-MM-dd"
                placeholder="开始日期"
                style="width: 140px;"
                clearable>
              </el-date-picker>
            </el-form-item>
            <span style="padding-right: 10px;">至</span>
            <el-form-item prop="endRegisterTime">
              <el-date-picker
                v-model="searchForm.endRegisterTime"
                value-format="yyyy-MM-dd"
                placeholder="结束日期"
                style="width: 140px;"
                clearable>
              </el-date-picker>
            </el-form-item>
          </el-form-item>
          <el-form-item label="最后登录时间">
            <el-form-item prop="startLoginTime">
              <el-date-picker
                v-model="searchForm.startLoginTime"
                value-format="yyyy-MM-dd"
                placeholder="开始日期"
                style="width: 140px;"
                clearable>
              </el-date-picker>
            </el-form-item>
            <span style="padding-right: 10px;">至</span>
            <el-form-item prop="endLoginTime">
              <el-date-picker
                v-model="searchForm.endLoginTime"
                value-format="yyyy-MM-dd"
                placeholder="结束日期"
                style="width: 140px;"
                clearable>
              </el-date-picker>
            </el-form-item>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search('searchForm')">搜索</el-button>
            <el-button type="primary" @click="reset('searchForm')">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="list-header-action-wrap">
      <el-button type="primary" size="medium" @click="addCompanyAccount" v-if="actionPermission.showItSubaccountAdd">新增企业账号</el-button>
      <el-button type="primary" size="medium" @click="openSyncDialog">同步逸创云账号</el-button>
    </div>

    <el-table
      :data="tableData"
      header-row-class-name="tableheader"
      border
      style="width: 100%;">
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="50px">
      </el-table-column>
      <el-table-column
        prop="registerTime"
        label="注册时间"
        align="center"
        width="160px">
      </el-table-column>
      <el-table-column
        prop="companyFullname"
        label="公司全称"
        align="center"
        width="150px">
      </el-table-column>
      <el-table-column
        prop="companyShortname"
        label="公司简称"
        align="center"
        width="150px">
      </el-table-column>
      <el-table-column
        prop="masterName"
        label="联系人"
        align="center"
        width="120px">
      </el-table-column>
      <el-table-column
        prop="masterMobile"
        label="联系电话"
        align="center"
        min-width="120px">
      </el-table-column>
      <el-table-column
        prop="masterEmail"
        label="邮箱"
        align="center"
        min-width="120px">
      </el-table-column>
      <el-table-column
        label="小程序码"
        align="center"
        min-width="60px">
        <template slot-scope="scope">
          <el-popover
            ref="popover"
            placement="bottom"
            title="小程序码"
            width="200"
            trigger="hover"
            @show="loadQrcode(scope.row)">
            <img :src="qrcodeImageUrl" class="qrcode-img" alt="">
          </el-popover>
          <el-button type="text" size="small" v-popover:popover>预览</el-button>
        </template>
      </el-table-column>
      <el-table-column
        v-if="actionPermission.showItSubaccountAdd || actionPermission.showItSubaccountUpdate || actionPermission.showItSubaccountView || actionPermission.showItSubaccountDelete"
        label="操作"
        align="center"
        min-width="100px"
        fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="actionPermission.showItSubaccountView"
            size="small"
            type="primary"
            plain
            @click="showInfo(scope.row.id)">查看</el-button>
        </template>
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

    <!-- 选择企业 -->
    <el-dialog title="选择企业" :visible.sync="showAddDialog" width="650px">
      <el-form label-width="120px" :rules="rules" v-model="addCompanyForm">
        <el-form-item label="企业名称">
          <el-input
            v-model="addCompanyForm.companyFullname"
            placeholder="请企业名称"
            style="width: 280px;"
          ></el-input>
          <el-button type="primary" size="medium" @click="queryAddCompany(addCompanyForm.companyFullname)" v-if="actionPermission.showItSubaccountAdd" style="margin-left: 10px;">搜索企业</el-button>
        </el-form-item>
        <el-form-item label="推荐关联企业" v-if="addCompanySearch.length > 0" style="margin-bottom: 0px;">
          <div class="recommend-company-list">
            <div class="recommend-company-item" v-for="item in addCompanySearch" v-bind:key="item.id">
              <el-radio v-model="addCompanyId" :label="item.id">{{item.companyFullname}}</el-radio>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="" v-if="addCompanySearch.length > 0" style="margin-bottom: 30px;">
          <a style="color: red; text-decoration: underline; cursor: pointer" @click="addNewCompany">以上都不是，新增企业</a>
        </el-form-item>
        <el-form-item label="" v-if="addCompanySearch.length === 0 && hassearch" style="margin-bottom: 30px;">
          <a style="color: red; text-decoration: underline; cursor: pointer" @click="addNewCompany">没有找到推荐企业，新增企业</a>
        </el-form-item>
      </el-form>
      <div class="action-wrap" v-if="addCompanyId !== ''">
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button type="primary" @click="nextStep()">下一步</el-button>
      </div>
    </el-dialog>

    <!-- 新增企业 -->
    <el-dialog title="新增企业" :visible.sync="showAddCompanyDialog">
      <el-form :model="addCompanyForm" ref="addCompanyForm" label-width="100px" style="width: 80%;">
        <el-form-item label="企业简称">
          <el-input v-model="addCompanyForm.companyShortname" placeholder="企业简称" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="企业全称">
          <el-input v-model="addCompanyForm.companyFullname" placeholder="企业全称" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="所在产业链">
          <el-select v-model="addCompanyForm.industryChainManyId" placeholder="请选择" style="width: 80%;">
            <el-option
              v-for="item in industryChainOpts"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业别称">
          <el-input v-model="addCompanyForm.alias" placeholder="企业别称" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="应用领域">
          <el-select v-model="addCompanyForm.industry" multiple :multiple-limit="3" placeholder="请选择" style="width: 80%;">
            <el-option
              v-for="item in industryOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业规模">
          <el-select v-model="addCompanyForm.scale" placeholder="企业规模" style="width: 80%;">
            <el-option
              v-for="item in scaleOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业官网">
          <el-input v-model="addCompanyForm.website" placeholder="企业官网" style="width: 80%;"></el-input>
        </el-form-item>
      </el-form>
      <div class="action-wrap" style="margin-top: 30px;">
        <el-button @click="closeCompanyForm('addCompanyForm')">取 消</el-button>
        <el-button type="primary" @click="submitCompanyForm('addCompanyForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增联系人 -->
    <el-dialog :title= 'addCompanyShortName + "新建联系人"' :visible.sync="showAddSubaccountDialog" width="650px">
      <el-form :model="addCompanySubaccountForm" :rules="rules"  ref="addCompanySubaccountForm" label-width="100px" style="width: 80%;">
        <el-form-item label="登录邮件" prop="email">
          <el-input ref="email" @blur="email_lost_force" v-model="addCompanySubaccountForm.email" placeholder="登录邮箱" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input @focus="name_get_force" v-model="addCompanySubaccountForm.name" placeholder="姓名" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="jobTitle">
          <el-input @focus="job_get_force" v-model="addCompanySubaccountForm.jobTitle" placeholder="职位" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input @focus="tel_get_force" v-model="addCompanySubaccountForm.mobile" placeholder="联系电话" style="width: 80%;"></el-input>
        </el-form-item>
      </el-form>
      <div class="action-wrap" style="margin-top: 30px;">
        <el-button @click="closeSubaccountForm('addCompanySubaccountForm')">取 消</el-button>
        <el-button type="primary" v-loading.fullscreen.lock="fullscreenLoading" @click="submitSubaccountForm('addCompanySubaccountForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 同步列表 -->
    <el-dialog title="逸创云企业列表" :visible.sync="syncDialog" width="650px">
      <el-button style="margin-bottom:10px;" type="primary" size="medium" @click="startSync" :disabled="syncSelectList.length == 0 || syncLoading"  :loading="syncLoading">同步</el-button>
      <el-table
        v-loading="syncDialogLoading"
        @selection-change="syncSelectionChange"
        ref="multipleTable"
        :data="syncList"
        border
        height="500"
        style="width: 100%;">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="50px">
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="注册时间"
          align="center"
          width="160px">
        </el-table-column>
        <el-table-column
          prop="name"
          label="公司名称"
          align="center">
        </el-table-column>
      </el-table>
      <div class="pager-wrap">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="syncPage.total"
          :page-size="syncPage.number"
          @current-change="syncPageChange">
        </el-pagination>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import Global from 'assets/js/global'
import _ from 'underscore'

// TODO: 时间区间校验
// TODO: reset form需要抽离出方法
export default {
  data () {
    var _vue = this
    return {
      searchForm: {
        companyName: '',
        startRegisterTime: '',
        endRegisterTime: '',
        startLoginTime: '',
        endLoginTime: '',
        salesId: ''
      },
      pager: {
        curPage: 1,
        size: 10
      },
      fullscreenLoading: false,
      salesOptions: [],
      tableData: [],
      totalNum: 0,
      allCompanys: [],
      pickerOptionsStart: {
        disabledDate: (time) => {
          if (_vue.endTime !== '' && _vue.endTime !== null) {
            return time.getTime() > Date.now() || time.getTime() > new Date(_vue.endTime.replace(/-/g, '/'))
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          if (_vue.startTime !== '' && _vue.startTime !== null) {
            return time.getTime() < new Date(_vue.startTime.replace(/-/g, '/')) || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      loginStartTime: '',
      loginEndTime: '',
      pickerOptionsLoginStart: {
        disabledDate: (time) => {
          if (_vue.loginEndTime !== '' && _vue.loginEndTime !== null) {
            return time.getTime() > Date.now() || time.getTime() > new Date(_vue.loginEndTime.replace(/-/g, '/'))
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptionsLoginEnd: {
        disabledDate: (time) => {
          if (_vue.loginStartTime !== '' && _vue.loginStartTime !== null) {
            return time.getTime() < new Date(_vue.loginStartTime.replace(/-/g, '/')) || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      dialogShowTable: false,
      showAddDialog: false,
      showAddCompanyDialog: false,
      showAddSubaccountDialog: false,
      addCompanyForm: {
        companyFullname: '',
        companyShortname: '',
        industryChainManyId: '',
        alias: '',
        industry: [],
        scale: '',
        website: '',
        adminId: ''
      },
      hassearch: false,
      addCompanySearch: [],
      addCompanyId: '',
      addCompanyShortName: '',
      industryOpts: Global.CONSTANT.INDUSTRY,
      scaleOpts: Global.CONSTANT.SCALE,
      industryChainOpts: [],
      addCompanySubaccountForm: {
        name: '',
        jobTitle: '',
        email: '',
        mobile: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { max: 50, message: '长度50个字符', trigger: 'blur' }
        ],
        jobtitle: [
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
      formLabelWidth: '150px',
      qrcodeImageUrl: '',
      actionPermission: {
        showItSubaccountAdd: Global.hasActionPermission('itsubaccount_add'),
        showItSubaccountUpdate: Global.hasActionPermission('itsubaccount_update'),
        showItSubaccountView: Global.hasActionPermission('itsubaccount_view'),
        showItSubaccountDelete: Global.hasActionPermission('itsubaccount_delete')
      },
      syncDialog: false,
      syncDialogLoading: false,
      syncLoading: false,
      syncList: [],
      syncSelectList: [],
      syncPage: {
        total: 0,
        number: 20,
        index: 2
      },
      syncState: false
    }
  },
  computed: {
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
    }
  },
  created () {
    this.fetchTableData()
    this.fetchSalesData()
    // this.fetchAllCompany()
    this.fetchChain()
  },
  methods: {
    fetchTableData () {
      // 获取客户数据
      let _vue = this
      _vue.$http.get('/api/v1.0/customer/it?company_name=' + _vue.searchForm.companyName +
        '&admin_id=' + _vue.searchForm.salesId +
        '&start_register_time=' + (_vue.searchForm.startRegisterTime || '') +
        '&end_register_time=' + (_vue.searchForm.endRegisterTime || '') +
        '&start_login_time=' + (_vue.searchForm.startLoginTime || '') +
        '&end_login_time=' + (_vue.searchForm.endLoginTime || '') +
        '&page=' + _vue.pager.curPage +
        '&per_page=' + _vue.pager.size
      ).then((response) => {
        let result = response.data.data
        _vue.tableData = result.rows
        _vue.totalNum = result.total
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    fetchSalesData () {
      // 获取技术支持数据
      let _vue = this
      _vue.$http.get('/api/v1.0/admin/manager/support').then((response) => {
        _vue.salesOptions = response.data.data.supportManage
      })
    },
    fetchAllCompany () {
      // 公司自动补全
      let _vue = this
      _vue.$http.get('/api/v1.0/customers?page=1&per_page=99999').then((response) => {
        let rows = response.data.data.rows
        _.each(rows, (company) => {
          let newItem = {}
          newItem.value = company.companyShortname
          newItem.label = company.companyShortname
          _vue.allCompanys.push(newItem)
        })
      })
    },
    fetchChain () {
      // 查询产业链
      let _vue = this
      _vue.$http.get('/api/v1.0/customer/industrychains').then((response) => {
        _vue.industryChainOpts = response.data.data.industryChains
      })
    },
    loadQrcode (row) {
      // 加载小程序码
      console.log(row)
      let _vue = this
      _vue.$http.get('/api/v1.0/qiniu/uploadQRCode?id=' + row.masterId).then((response) => {
        _vue.qrcodeImageUrl = response.data.data.url
      })
    },
    queryCompany (queryString, cb) {
      let _vue = this
      let allCompanys = _vue.allCompanys
      let results = queryString ? _.filter(allCompanys, (item) => {
        return item.label && item.label.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
      }) : allCompanys
      cb(results)
    },
    queryAddCompany (value) {
      // 搜索企业
      if (value !== '') {
        let _vue = this
        _vue.$http.get('/api/v1.0/customer/company/list?company_name=' + value + '&page=1&size=30').then((response) => {
          _vue.addCompanySearch = response.data.data.rows
          _vue.hassearch = true
        })
      }
    },
    handleSelectCompany (item) {
      this.searchForm.companyName = item.value
    },
    handleCurrentChange: function (val) {
      this.pager.curPage = val
      this.fetchTableData()
    },
    search: function () {
      this.pager.curPage = 1
      this.fetchTableData()
    },
    reset: function (formName) {
      this.$refs[formName].resetFields()
      this.pager.curPage = 1
      this.fetchTableData()
    },
    showInfo: function (id) {
      this.$router.push({
        name: 'itsubaccountDetail',
        params: {
          id: id
        }
      })
    },
    addCompanyAccount () {
      // 新增企业账号
      this.clearSerachData()
      this.showAddDialog = true
    },
    clearSerachData () {
      // 清除企业搜索数据
      this.addCompanyForm.companyFullname = ''
      this.addCompanySearch = []
      this.addCompanyId = ''
    },
    clearAddCompanyData () {
      // 清除之前添加企业时的数据
      this.addCompanyForm = {
        companyFullname: '',
        companyShortname: '',
        industryChainManyId: '',
        alias: '',
        industry: [],
        scale: '',
        website: '',
        adminId: ''
      }
    },
    clearSubAccountData () {
      this.addCompanySubaccountForm = {
        name: '',
        jobTitle: '',
        email: '',
        mobile: ''
      }
    },
    addNewCompany () {
      this.clearAddCompanyData()
      this.showAddCompanyDialog = true
      this.showAddDialog = false
    },
    getCurrentRow (value) {
      console.log(value)
    },
    nextStep () {
      this.clearSubAccountData()
      this.showAddDialog = false
      this.showAddSubaccountDialog = true
    },
    closeDialog () {
      this.clearSerachData()
      this.showAddDialog = false
    },
    closeCompanyForm (formName) {
      // TODO: resetFields 有bug, 不会自动清除表单值，需要手动实现
      this.$refs[formName].resetFields()
      this.showAddCompanyDialog = false
    },
    closeSubaccountForm (formName) {
      // TODO: resetFields 有bug, 不会自动清除表单值，需要手动实现
      this.$refs[formName].resetFields()
      this.showAddSubaccountDialog = false
    },
    submitCompanyForm (formName) {
      // TODO: 验证-提交表单
      let _vue = this
      _vue.$refs[formName].validate((valid) => {
        if (valid) {
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
          }).then((res) => {
            _vue.showAddCompanyDialog = false
            // TODO：提交成功，表单重置
            _vue.$message({
              type: 'success',
              message: '新增企业成功',
              center: true
            })
            _vue.clearSubAccountData()
            _vue.addCompanyId = res.data.data.customerId
            _vue.showAddSubaccountDialog = true
          }).catch(() => {
            _vue.$message({
              type: 'error',
              message: '请稍后重试',
              center: true
            })
          })
        }
      })
    },
    submitSubaccountForm (formName) {
      // TODO: 验证-提交表单
      let _vue = this
      _vue.$refs[formName].validate((valid) => {
        if (valid) {
          _vue.fullscreenLoading = true
          _vue.$http.post('/api/v1.0/customer/subIT', {
            customerId: _vue.addCompanyId,
            name: _vue.addCompanySubaccountForm.name,
            email: _vue.addCompanySubaccountForm.email,
            mobile: _vue.addCompanySubaccountForm.mobile,
            jobTitle: _vue.addCompanySubaccountForm.jobTitle,
            isOpenItService: 1
          }).then(() => {
            _vue.$message({
              type: 'success',
              message: '新增成功'
            })
            _vue.fullscreenLoading = false
            _vue.showAddSubaccountDialog = false
            _vue.fetchTableData()
          }).catch((response) => {
            let error = response.response.data.error.message
            _vue.fullscreenLoading = false
            _vue.$message({
              type: 'error',
              message: error
            })
          })
        }
      })
    },
    checkEmail () {
      // 当其余输入框获得焦点是验证email是否为空
      if (this.addCompanySubaccountForm.email === '') {
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
      if (this.addCompanySubaccountForm.email !== '') {
        this.$http.get('/api/v1.0/customer/subaccount?email=' + this.addCompanySubaccountForm.email).then((response) => {
          console.log(response.data.data.email)
          if (response.data.data.email === undefined) {
            return
          }
          _vue.addCompanySubaccountForm.name = response.data.data.name
          // _vue.addCompanySubaccountForm.id = response.data.data.id
          _vue.addCompanySubaccountForm.mobile = response.data.data.mobile
          _vue.addCompanySubaccountForm.email = response.data.data.email
          _vue.addCompanySubaccountForm.jobTitle = response.data.data.currentJobTitle
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
    },
    openSyncDialog () {
      this.syncDialog = true
      this.syncPage.index = 1
      this.syncPage.total = 0
      this.syncList = []
      this.syncSelectList = []
      this.getSyncList()
    },
    getSyncList () {
      this.syncDialogLoading = true
      this.$http.get('/api/v1.0/customer/company/info', { params: {
        page: this.syncPage.index
      }}).then(res => {
        let data = res.data.data.data
        this.syncPage.total = data.count
        this.syncList = data.organizations
      }).finally(() => {
        this.syncDialogLoading = false
      })
    },
    syncPageChange (val) {
      this.syncPage.index = val
      this.getSyncList()
    },
    syncSelectionChange (val) {
      this.syncSelectList = val
    },
    startSync () {
      this.syncLoading = true
      this.$http.post('/api/v1.0/sync/company', this.syncSelectList).then(res => {
        this.fetchTableData()
        this.$message.success('同步成功')
        this.syncDialog = false
      }).catch(() => {
        this.$message.error('同步失败')
      }).finally(() => {
        this.syncLoading = false
      })
    }
  }
}
</script>

<style lang="scss">
  @import '~assets/css/variable';
  .recommend-company-list {
    max-height: 300px;
    overflow-y: auto;
  }
  .qrcode-img {
    width: 200px;
    height: 200px;
  }
</style>
