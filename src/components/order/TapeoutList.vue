<template>
  <div class="table-list-wrap">
    <div class="list-search-wrap">
      <el-form :inline="true" ref="searchForm" :model="searchForm" class="form-inline" label-width="70px">
        <el-row class="form-row">
          <el-form-item label="订单编号" prop="orderNo">
            <el-input clearable v-model="searchForm.orderNo" placeholder="订单编号以O开始" style="width: 180px;"></el-input>
          </el-form-item>
          <el-form-item label="流水号" prop="contractNo">
            <el-input clearable v-model="searchForm.contractNo" placeholder="流水号以T开始" style="width: 180px;"></el-input>
          </el-form-item>
          <el-form-item label="生产形式" prop="tapeoutPlan">
            <el-select v-model="searchForm.tapeoutPlan" placeholder="请选择" style="width: 180px;">
              <el-option label="全部" value=""></el-option>
              <el-option label="MPW(摩尔班车)" value="1"></el-option>
              <el-option label="MPW" value="2"></el-option>
              <el-option label="Full Mask" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单状态" prop="status">
            <el-select v-model="searchForm.status" placeholder="请选择" style="width: 180px;">
              <el-option label="全部" value=""></el-option>
              <el-option label="待审核" value="0"></el-option>
              <el-option label="进行中" value="1"></el-option>
              <el-option label="审核不通过" value="2"></el-option>
              <el-option label="已完成" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公司名称" prop="companyName">
            <el-autocomplete
              class='inline-input'
              v-model='searchForm.companyName'
              :fetch-suggestions='queryCompany'
              placeholder='请输入公司名称'
              :trigger-on-focus="false"
              @select='handleSelectCompany'
              style="width: 180px;">
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="邮箱地址" prop="email">
            <el-input clearable v-model="searchForm.email" placeholder="邮箱地址" style="width: 180px;"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="form-row gutter">
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
          <el-form-item label="下单时间">
            <el-form-item prop="startCreateTime">
              <el-date-picker
                v-model="searchForm.startCreateTime"
                value-format="yyyy-MM-dd"
                placeholder="开始日期"
                style="width: 140px;"
                clearable>
              </el-date-picker>
            </el-form-item>
            <span style="padding-right: 10px;">至</span>
            <el-form-item prop="endCreateTime">
              <el-date-picker
                v-model="searchForm.endCreateTime"
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
      header-row-class-name="tableheader"
      border
      style="width: 100%;"
      :data="tableData">
      <el-table-column
        type="index"
        label="序号"
        width="50px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="contractNo"
        label="流水号"
        width="120px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="下单时间"
        width="160px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="联系人"
        width="120px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="120px"
        align="center">
      </el-table-column>
      <el-table-column
        label="所属公司"
        width="120px"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.companyShortname !== ''">{{scope.row.companyShortname}}</span>
          <!-- TODO：关联企业操作 -->
          <span v-if="scope.row.companyShortname === ''">未绑定</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="supplierName"
        label="代工厂"
        width="120px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="node"
        label="节点"
        width="100px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="craft"
        label="工艺"
        width="120px"
        align="center">
      </el-table-column>
      <el-table-column
        label="生产类型"
        width="140px"
        align="center">
        <template slot-scope="scope">
          {{scope.row.tapeoutPlan | filterPlanform}}
        </template>
      </el-table-column>
      <el-table-column
        label="GDS提交时间"
        width="140px"
        align="center">
        <template slot-scope="scope">
          {{scope.row.cutoffTime | filterDateformat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="salesName"
        label="销售经理"
        width="100px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="curNpwPrice"
        label="当前价格"
        width="100px"
        align="center">
      </el-table-column>
      <el-table-column
        label="订单状态"
        width="100px"
        align="center">
        <template slot-scope="scope">
          {{scope.row.status | filterOrderStatus}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        fixed="right"
        width="100px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            plain
            size="small"
            @click="showInfo(scope.row)">查看</el-button>
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
import _ from 'underscore'

export default {
  data () {
    var _vue = this
    return {
      searchForm: {
        orderNo: '',
        contractNo: '',
        tapeoutPlan: '',
        startCreateTime: '',
        endCreateTime: '',
        status: '',
        companyName: '',
        adminId: '',
        email: ''
      },
      pager: {
        curPage: 1,
        size: 20
      },
      salesOptions: [],
      allCompanys: [],
      produceId: '',
      produce: [],
      orderStatusId: '',
      orderStatus: [],
      companyNameId: '',
      companyName: [],
      saleManagerId: '',
      saleManager: [],
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
      pickerCuttofEnd: {
        disabledDate: (time) => {
          return time.getTime() < Date.now()
        }
      },
      tableData: [],
      totalNum: 0,
      newRespin: {},
      tableEdit: [{
        first: '',
        second: '',
        third: '',
        four: '',
        five: '',
        six: ''
      }],
      title: '',
      dialogEditRespin: false,
      formLabelWidth: '180px',
      factory: [],
      formula: [],
      crafts: [],
      nodes: [],
      produceType: [],
      contractNo: ''
    }
  },
  created () {
    // 如果url有查询参数, 初始化查询条件
    let queryParam = this.$route.query
    if (!_.isEmpty(queryParam)) {
      this.searchForm.orderNo = queryParam.orderNo || ''
      this.searchForm.email = queryParam.email || ''
    }
    this.getInfo()
    this.fetchSalesData()
    this.fetchAllCompany()
  },
  methods: {
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
    getInfo: function () {
      var _vue = this
      let status = _vue.searchForm.status === '' ? '4' : _vue.searchForm.status
      _vue.$http.get('/api/v1.0/order/tapeouts?tapeout_plan=' + _vue.searchForm.tapeoutPlan +
        '&company_name=' + _vue.searchForm.companyName +
        '&admin_id=' + _vue.searchForm.adminId +
        '&status=' + status +
        '&start_create_time=' + (_vue.searchForm.startCreateTime || '') +
        '&end_create_time=' + (_vue.searchForm.endCreateTime || '') +
        '&page=' + _vue.pager.curPage +
        '&per_page=' + _vue.pager.size +
        '&order_no=' + _vue.searchForm.orderNo +
        '&contract_no=' + _vue.searchForm.contractNo +
        '&email=' + _vue.searchForm.email)
        .then(function (response) {
          _vue.totalNum = response.data.data.total
          _vue.tableData = response.data.data.rows
        })
    },
    search: function () {
      this.pager.curPage = 1
      this.getInfo()
    },
    reset: function (formName) {
      this.$refs[formName].resetFields()
      this.pager.curPage = 1
      this.getInfo()
    },
    handleCurrentChange: function (val) {
      this.pager.curPage = val
      this.getInfo()
    },
    showInfo (data) {
      // 新开页面
      window.open(window.location.origin + '/#/order/tapeout/' + data.contractNo)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~assets/css/variable';
</style>
