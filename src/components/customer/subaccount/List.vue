<template>
  <div class="table-list-wrap">
    <div class="list-search-wrap">
      <el-form :inline="true" ref="searchForm" :model="searchForm" class="form-inline">
        <el-row class="form-row">
          <el-form-item label="审核状态" prop="status">
            <el-select v-model="searchForm.status" placeholder="请选择" style="width: 180px;">
              <el-option label="全部" value=""></el-option>
              <el-option label="待审核" value="0"></el-option>
              <el-option label="审核通过" value="1"></el-option>
              <el-option label="审核不通过" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱状态" prop="emailStatus">
            <el-select v-model="searchForm.emailStatus" placeholder="请选择" style="width: 180px;">
              <el-option label="全部" value=""></el-option>
              <el-option label="已验证" value="1"></el-option>
              <el-option label="未验证" value="0"></el-option>
              <el-option label="邮件发送失败" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="销售经理" prop="adminId">
            <el-select v-model="searchForm.adminId" placeholder="请选择" style="width: 180px;">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="item in salesOptions"
                :key="item.adminId"
                :label="item.adminName"
                :value="item.adminId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公司名称" prop="companyName">
            <el-input class="inline-input" v-model='searchForm.companyName' placeholder='请输入公司名称' style="width: 180px;"></el-input>
            <!--<el-autocomplete-->
              <!--class='inline-input'-->
              <!--v-model='searchForm.companyName'-->
              <!--:fetch-suggestions='queryCompany'-->
              <!--placeholder='请输入公司名称'-->
              <!--:trigger-on-focus="false"-->
              <!--@change='handleSelectCompany'-->
            <!--&gt;</el-autocomplete>-->
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
          <el-form-item>
            <el-button type="primary" @click="search('searchForm')">搜索</el-button>
            <el-button type="primary" @click="reset('searchForm')">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
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
        prop="companyShortname"
        label="公司简称"
        align="center"
        min-width="150px">
      </el-table-column>
      <el-table-column
        prop="name"
        label="联系人"
        align="center"
        min-width="120px">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        align="center"
        min-width="120px">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        align="center"
        min-width="160px">
      </el-table-column>
      <el-table-column
        prop="orderCount"
        label="订单数"
        align="center"
        width="100px">
      </el-table-column>
      <el-table-column
        label="审核状态"
        align="center"
        width="100px">
        <template slot-scope="scope">
          {{scope.row.status | filterStatus}}
        </template>
      </el-table-column>
      <el-table-column
        prop="isEmailValidate"
        label="邮箱状态"
        align="center"
        width="120px">
        <template slot-scope="scope">
          {{scope.row.isEmailValidate | filterEmailStatus}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        align="center"
        v-if="actionPermission.showSubaccountUpdate || actionPermission.showSubaccountDelete || actionPermission.showSubaccountAdd || actionPermission.showSubaccountView"
        min-width="160px">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            plain
            v-if="actionPermission.showSubaccountUpdate && scope.row.status !== 1"
            @click="checkAccount(scope.row)">审核</el-button>
          <el-button
            v-if="actionPermission.showSubaccountUpdate"
            size="small"
            type="primary"
            plain
            @click="showInfo(scope.row)">管理</el-button>
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
  </div>
</template>

<script>
import Global from 'assets/js/global'
import _ from 'underscore'

export default {
  data () {
    var _vue = this
    return {
      searchForm: {
        companyName: '',
        startRegisterTime: '',
        endRegisterTime: '',
        status: '',
        emailStatus: '',
        adminId: ''
      },
      pager: {
        curPage: 1,
        size: 20
      },
      salesOptions: [],
      tableData: [],
      totalNum: 0,
      allCompanys: [],
      auditStatus: '',
      saleManager: '',
      manager: [{
        adminId: 0,
        adminName: '1'
      }],
      companyName: '',
      startTime: '',
      endTime: '',
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
      actionPermission: {
        showSubaccountAdd: Global.hasActionPermission('subaccount_add'),
        showSubaccountUpdate: Global.hasActionPermission('subaccount_update'),
        showSubaccountView: Global.hasActionPermission('subaccount_view'),
        showSubaccountDelete: Global.hasActionPermission('subaccount_delete')
      }
    }
  },
  created () {
    this.fetchTableData()
    this.fetchSalesData()
    this.fetchAllCompany()
  },
  methods: {
    fetchTableData () {
      // 获取客户数据
      let _vue = this
      _vue.$http.get('/api/v1.0/customer/subs?company_name=' + _vue.searchForm.companyName +
        '&admin_id=' + _vue.searchForm.adminId +
        '&start_register_time=' + _vue.searchForm.startRegisterTime +
        '&end_register_time=' + _vue.searchForm.endRegisterTime +
        '&status=' + _vue.searchForm.status +
        '&email_status=' + _vue.searchForm.emailStatus +
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
    queryCompany (queryString, cb) {
      let _vue = this
      let allCompanys = _vue.allCompanys
      let results = queryString ? _.filter(allCompanys, (item) => {
        return item.label && item.label.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
      }) : allCompanys
      cb(results)
    },
    handleSelectCompany (item) {
      this.searchForm.companyName = item
    },
    handleCurrentChange: function (val) {
      this.pager.curPage = val
      this.fetchTableData()
    },
    search: function () {
      this.fetchTableData()
    },
    reset: function (formName) {
      this.$refs[formName].resetFields()
      this.pager.curPage = 1
      this.fetchTableData()
    },
    checkAccount (data) {
      // 审核用户
      this.$router.push({
        name: 'subaccountDetail',
        params: {
          id: data.id
        }
      })
    },
    showInfo: function (data) {
      this.$router.push({
        name: 'subaccountDetail',
        params: {
          id: data.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
