<template>
  <div class="table-list-wrap">
    <div class="list-search-wrap">
      <el-form :inline="true" ref="searchForm" :model="searchForm" class="form-inline">
        <el-row class="form-row">
          <el-form-item label="公司名称" prop="companyName">
            <el-input class="inline-input" v-model='searchForm.companyName' placeholder='请输入公司名称' style="width: 180px;"></el-input>
            <!--<el-autocomplete-->
              <!--class='inline-input'-->
              <!--v-model='searchForm.companyName'-->
              <!--:fetch-suggestions='queryCompany'-->
              <!--placeholder='请输入公司名称'-->
              <!--:trigger-on-focus="false"-->
              <!--@select='handleSelectCompany'-->
              <!--style="width: 180px;"-->
            <!--&gt;</el-autocomplete>-->
          </el-form-item>
          <el-form-item label="销售经理" prop="salesId">
            <el-select v-model="searchForm.salesId" placeholder="请选择" style="width: 180px;">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="item in salesOptions"
                :key="item.adminId"
                :label="item.adminName"
                :value="item.adminId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="注册时间">
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
      <el-button type="primary" size="medium" @click="addCompany" v-if="actionPermission.showCompanyAdd">新增企业</el-button>
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
        prop="companyShortname"
        label="公司简称"
        align="center"
        width="150px">
      </el-table-column>
      <el-table-column
        prop="lastLoginTime"
        label="最后登录时间"
        align="center"
        width="160px">
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
        min-width="150px">
      </el-table-column>
      <el-table-column
        prop="id"
        label="公司ID"
        align="center"
        width="70px">
      </el-table-column>
      <el-table-column
        prop="masterName"
        label="主要联系人"
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
        prop="orderCount"
        label="总计订单数"
        align="center"
        width="100px">
      </el-table-column>
      <el-table-column
        prop="adminName"
        label="销售经理"
        align="center"
        width="120px">
      </el-table-column>
      <el-table-column
        v-if="actionPermission.showCompanyAdd || actionPermission.showCompanyUpdate || actionPermission.showCompanyView || actionPermission.showCompanyDelete"
        label="操作"
        align="center"
        min-width="100px"
        fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="actionPermission.showCompanyView"
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

    <!-- 新增企业 -->
    <el-dialog title="新增企业" :visible.sync="showAddDialog">
      <el-form :model="addCompanyForm" :rules="rules" ref="addCompanyForm" label-width="100px" style="width: 80%;">
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
        <el-button @click="closeCompanyForm('addCompanyForm')">取 消</el-button>
        <el-button type="primary" @click="submitCompanyForm('addCompanyForm')">确 定</el-button>
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
        size: 20
      },
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
      industryOpts: Global.CONSTANT.INDUSTRY,
      scaleOpts: Global.CONSTANT.SCALE,
      industryChainOpts: [],
      rules: {},
      formLabelWidth: '150px',
      actionPermission: {
        showCompanyAdd: Global.hasActionPermission('company_add'),
        showCompanyUpdate: Global.hasActionPermission('company_update'),
        showCompanyView: Global.hasActionPermission('company_view'),
        showCompanyDelete: Global.hasActionPermission('company_delete')
      }
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
    this.fetchAllCompany()
    this.fetchChain()
  },
  methods: {
    fetchTableData () {
      // 获取客户数据
      let _vue = this
      _vue.$http.get('/api/v1.0/customers?company_name=' + _vue.searchForm.companyName +
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
    queryCompany (queryString, cb) {
      let _vue = this
      let allCompanys = _vue.allCompanys
      let results = queryString ? _.filter(allCompanys, (item) => {
        return item.label && item.label.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
      }) : allCompanys
      cb(results)
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
        name: 'companyDetail',
        params: {
          id: id
        }
      })
    },
    addCompany () {
      this.showAddDialog = true
    },
    closeCompanyForm (formName) {
      // TODO: resetFields 有bug, 不会自动清除表单值，需要手动实现
      this.$refs[formName].resetFields()
      this.showAddDialog = false
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
          }).then(() => {
            _vue.showAddDialog = false
            // TODO：提交成功，表单重置
            _vue.$message({
              type: 'success',
              message: '新增企业成功',
              center: true
            })
            _vue.pager.curPage = 1
            _vue.fetchTableData()
          }).catch(() => {
            _vue.$message({
              type: 'error',
              message: '请稍后重试',
              center: true
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import '~assets/css/variable';
</style>
