<template>
  <div class="table-list-wrap">
    <div class="list-search-wrap">
      <el-form :inline="true" ref="searchForm" :model="searchForm" class="form-inline" label-width="70px">
        <el-form-item label="订单号" prop="orderNo">
          <el-input v-model="searchForm.orderNo" clearable></el-input>
        </el-form-item>
        <el-form-item label="服务状态" prop="status">
          <el-select v-model="searchForm.status" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="待分配顾问" value="1"></el-option>
            <el-option label="订单待确认" value="2"></el-option>
            <el-option label="候选人推荐中" value="3"></el-option>
            <el-option label="订单已完成" value="4"></el-option>
            <el-option label="订单待支付" value="5"></el-option>
            <el-option label="订单已关闭" value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司" prop="companyName">
          <el-input v-model="searchForm.companyName" clearable></el-input>
        </el-form-item>
        <el-form-item label="职能" prop="functionId">
          <industry-function :functionId="searchForm.functionId" @selectFunction="selectFunction"></industry-function>
        </el-form-item>
        <el-form-item label="招聘顾问" prop="adminId">
          <el-select v-model="searchForm.adminId" clearable @change="changeAdminId">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in adviserOptions"
              :key="item.adminId"
              :label="item.adminName"
              :value="item.adminId">
            </el-option>
            <el-option label="已变更顾问" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="我的订单" prop="adminId">
          <el-select v-model="searchForm.orderStatus" clearable :disabled="showOrderStatusDialog">
            <el-option label="全部" value=""></el-option>
            <el-option label="我的名下订单" value="1"></el-option>
            <el-option label="顾问已变更订单" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="search('searchForm')">搜索</el-button>
          <el-button type="primary" size="medium" @click="reset('searchForm')" v-if="false">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 面试快订单列表 -->
    <el-table
      :data="tableData"
      header-row-class-name="tableheader"
      @sort-change="sortList"
      border
      style="width: 100%;">
      <el-table-column
        type="index"
        width="50"
        align="center">
      </el-table-column>
      <el-table-column
        label="订单号"
        width="160"
        align="center">
        <template slot-scope="scope">
          <router-link class="text-link" :to="{ name: 'interviewDetail', params: { id: scope.row.ensureId }}">{{scope.row.orderNo}}</router-link>
        </template>
      </el-table-column>
      <el-table-column
        label="订单状态"
        min-width="120"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.status | filterRecruitOrderStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="订单发起时间"
        sortable="custom"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        label="顾问"
        width="120"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.adminName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="职位"
        min-width="240"
        align="center">
        <template slot-scope="scope">
          <a :href="scope.row.jobId | filterJobLink" class="text-link" target="_blank">{{scope.row.jobTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column
        label="公司"
        width="220"
        align="center">
        <template slot-scope="scope">
          <a :href="scope.row.companyId | filterCompanyLink" class="text-link" target="_blank">{{scope.row.companyShortName}}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="fullPath"
        label="职能"
        width="220"
        align="center">
      </el-table-column>
      <el-table-column
        prop="recommendCount"
        label="推荐候选人数"
        width="110"
        align="center">
      </el-table-column>
      <el-table-column
        prop="interviewCount"
        label="已面试人数"
        width="100"
        align="center">
      </el-table-column>
      <el-table-column
        prop="price"
        label="订单总价"
        width="160"
        align="center">
      </el-table-column>
      <el-table-column
        prop="leftTime"
        label="服务到期剩余"
        width="160"
        align="center">
      </el-table-column>
      <el-table-column
        prop="hrFullname"
        label="HR"
        width="160"
        align="center">
      </el-table-column>
      <el-table-column
        prop="contactMobile"
        label="电话"
        width="160"
        align="center">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        min-width="400"
        align="center"
        class-name="multi-button-wrap">
        <template slot-scope="scope">
          <el-button v-if="adminInfo.isMaster === 1 && scope.row.status !== 4 && scope.row.status !== 6" type="primary" size="small" @click="handleAssignAdviser(scope.row)">分配顾问</el-button>
          <el-button v-if="adminInfo.adminId === scope.row.adminId && scope.row.status !== 3 && scope.row.status !== 4 && scope.row.status !== 6" type="primary" size="small" @click="handleReceiptOrder(scope.row)">确认接单</el-button>
          <el-button v-if="scope.row.adminId !== null && scope.row.interviewCount === 0 && scope.row.status !== 6" type="primary" size="small" @click="handleCloseOrder(scope.row)">关闭订单</el-button>
          <el-button v-if="scope.row.adminId !== null && scope.row.interviewCount >= 1 && scope.row.status !== 4" type="primary" size="small" @click="handleFinishOrder(scope.row)">完成订单</el-button>
          <el-button type="primary" size="small" @click="handleOrderRecord(scope.row)">操作记录</el-button>
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

    <!-- 分配顾问弹窗 -->
    <el-dialog title="分配顾问" :visible.sync="assignAdviserDialog" width="35%">
      <el-form :model="assignAdviserForm" ref="assignAdviserForm">
        <el-form-item label="选择顾问" label-width="140px">
          <el-select v-model="assignAdviserForm.adminId" placeholder="请选择" @change="selectAdviser">
            <el-option
              v-for="item in adviserOptions"
              :key="item.adminId"
              :label="item.adminName"
              :value="item.adminId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" label-width="140px">
          <el-input v-model.trim="assignAdviserForm.mobile" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="140px">
          <el-input v-model.trim="assignAdviserForm.email" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer center">
        <el-button @click="cancelAssignAdviser('assignAdviserForm')">取 消</el-button>
        <el-button type="primary" @click="sureAssignAdviser('assignAdviserForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 关闭订单弹窗 -->
    <el-dialog title="关闭订单" :visible.sync="closeOrderDialog" width="35%">
      <el-form>
        <el-form-item label="订单号：" label-width="140px">
          <span>{{currentOrder.orderNo}}</span>
        </el-form-item>
        <el-form-item label="职位：" label-width="140px">
          <span>{{currentOrder.jobTitle}}</span>
        </el-form-item>
        <el-form-item label="公司：" label-width="140px">
          <span>{{currentOrder.companyShortName}}</span>
        </el-form-item>
        <el-form-item label="推荐人数：" label-width="140px">
          <span>{{currentOrder.recommendCount}}</span>
        </el-form-item>
        <el-form-item label="是否退还冻结金额：" label-width="140px">
          <el-radio-group v-model="hasRefund">
            <el-radio :label="false">不退还</el-radio>
            <el-radio :label="true">退还</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer center">
        <el-button @click="cancelCloseOrder">取 消</el-button>
        <el-button type="primary" @click="sureCloseOrder" :disabled="loading">{{loading ? '提交中...' : '确 定'}}</el-button>
      </div>
    </el-dialog>
    <!-- 订单完成弹窗 -->
    <el-dialog title="完成订单" :visible.sync="finishOrderDialog" width="35%">
      <el-form>
        <el-form-item label="订单号：" label-width="140px">
          <span>{{currentOrder.orderNo}}</span>
        </el-form-item>
        <el-form-item label="职位：" label-width="140px">
          <span>{{currentOrder.jobTitle}}</span>
        </el-form-item>
        <el-form-item label="公司：" label-width="140px">
          <span>{{currentOrder.companyShortName}}</span>
        </el-form-item>
        <el-form-item label="面试人数：" label-width="140px">
          <span>{{currentOrder.interviewCount}}</span>
        </el-form-item>
        <div class="dialog-bottom-tip">是否确认订单完成？</div>
      </el-form>
      <div slot="footer" class="dialog-footer center">
        <el-button @click="cancelFinishOrder">取 消</el-button>
        <el-button type="primary" @click="sureFinishOrder" :disabled="loading">{{loading ? '提交中...' : '确 定'}}</el-button>
      </div>
    </el-dialog>
    <!-- 订单操作记录弹窗 -->
    <el-dialog title="订单操作记录" :visible.sync="orderRecordDialog">
      <el-table
        :data="orderRecordData"
        header-row-class-name="tableheader"
        border
        style="width: 100%;">
        <el-table-column
          type="index"
          width="50"
          align="center">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="时间"
          width="220"
          align="center">
        </el-table-column>
        <el-table-column
          prop="content"
          label="内容"
          min-width="300"
          align="center">
        </el-table-column>
        <el-table-column
          prop="adminName"
          label="操作人"
          align="center">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import IndustryFunction from '@/components/common/IndustryFunction'
import _ from 'underscore'
import Global from 'assets/js/global'

export default {
  components: {
    IndustryFunction
  },
  data () {
    return {
      searchForm: {
        orderNo: '',
        adminId: '',
        companyName: '',
        status: '',
        functionId: '',
        sort: '', // 排序字段
        direction: '', // 排序顺序
        orderStatus: ''
      },
      totalNum: 1,
      pager: {
        size: 10,
        curPage: 1
      },
      tableData: [],
      assignAdviserForm: {
        adminId: '',
        mobile: '',
        email: ''
      },
      adviserOptions: [], // 招聘顾问list
      assignAdviserDialog: false,
      closeOrderDialog: false,
      finishOrderDialog: false,
      orderRecordDialog: false,
      currentOrder: {}, // 当前操作的订单，接口调用使用
      hasRefund: true, // 关闭订单，是否有退款
      orderRecordData: [], // 订单操作记录
      adminInfo: {}, // 当前用户adminInfo, 判断是否是主管会用到
      loading: false, // 正在操作标识
      showOrderStatusDialog: true
    }
  },
  created () {
    this.fetchTableData()
    this.fetchAdviser()
    this.fetchAdminInfo()
  },
  filters: {
    filterJobLink (value) {
      let link = ''
      if (Global.CONFIG.SERVER_URL !== 'http://adminp.mooreelite.com') {
        link = 'http://pc.dev.moore.ren/job/detail.htm?jobId=' + value
      } else {
        link = 'http://www.moore.ren/job/detail.htm?jobId=' + value
      }
      return link
    },
    filterCompanyLink (value) {
      let link = ''
      if (Global.CONFIG.SERVER_URL !== 'http://adminp.mooreelite.com') {
        link = 'http://pc.dev.moore.ren/company/detail.htm?companyId=' + value
      } else {
        link = 'http://www.moore.ren/company/detail.htm?companyId=' + value
      }
      return link
    }
  },
  methods: {
    fetchTableData () {
      // 获取订单列表
      let _vue = this
      _vue.$http.get('/api/v1.0/ensure/fasts?page=' + _vue.pager.curPage +
        '&per_page=' + _vue.pager.size +
        '&function_id=' + _vue.searchForm.functionId +
        '&order_no=' + _vue.searchForm.orderNo +
        '&status=' + _vue.searchForm.status +
        '&company_name=' + _vue.searchForm.companyName +
        '&admin_id=' + _vue.searchForm.adminId +
        '&sort=' + _vue.searchForm.sort +
        '&direction=' + _vue.searchForm.direction +
        '&order_status=' + _vue.searchForm.orderStatus).then(function (response) {
        _vue.tableData = response.data.data.rows || []
        _vue.totalNum = response.data.data.total || 1
      })
    },
    fetchAdminInfo () {
      // 获取当前用户的adminInfo
      let _vue = this
      _vue.$http.get('/api/v1.0/ensure/manager').then((response) => {
        _vue.adminInfo = response.data.data.infoManger
      })
    },
    search () {
      this.fetchTableData()
    },
    reset (formName) {
      this.$refs[formName].resetFields()
    },
    sortList (col) {
      // prop: 排序字段, order: 排序顺序 ascending 正序 descending 倒序
      this.searchForm.sort = 'create_time'
      this.searchForm.direction = (col.order === 'descending' ? 'desc' : 'asc')
      this.fetchTableData()
    },
    handleAssignAdviser (row) {
      // 点击分配顾问
      this.assignAdviserDialog = true
      this.currentOrder = row
    },
    handleReceiptOrder (row) {
      // 顾问接单
      let _vue = this
      _vue.$http.post('/api/v1.0/ensure/entry/accept', {
        ensureId: row.ensureId
      }).then(() => {
        _vue.$message({
          type: 'success',
          message: '接单成功',
          center: true
        })
        this.fetchTableData()
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    handleCloseOrder (row) {
      // 点击关闭订单
      this.closeOrderDialog = true
      this.currentOrder = row
    },
    handleFinishOrder (row) {
      // 点击完成订单
      this.finishOrderDialog = true
      this.currentOrder = row
    },
    handleOrderRecord (row) {
      // 查看操作记录
      let _vue = this
      _vue.orderRecordDialog = true
      _vue.$http.get('/api/v1.0/ensure/fast/opts?ensure_id=' + row.ensureId).then((response) => {
        _vue.orderRecordData = response.data.data.opts
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    fetchAdviser () {
      // 获取招聘顾问
      let _vue = this
      _vue.$http.get('/api/v1.0/admin/manager/ensure').then(function (response) {
        _vue.adviserOptions = response.data.data.ensures || []
      })
    },
    cancelAssignAdviser () {
      this.assignAdviserDialog = false
    },
    sureAssignAdviser () {
      // 分配顾问
      let _vue = this
      if (_vue.assignAdviserForm.adminId === '') {
        _vue.$message({
          type: 'error',
          message: '请选择顾问',
          center: true
        })
      } else {
        _vue.$http.post('/api/v1.0/ensure/fast/manager', {
          adminId: _vue.assignAdviserForm.adminId,
          ensureId: _vue.currentOrder.ensureId
        }).then(function (response) {
          _vue.$message({
            type: 'success',
            message: '分配顾问成功',
            center: true
          })
          _vue.assignAdviserDialog = false
          _vue.pager = {
            size: 10,
            curPage: 1
          }
          _vue.fetchTableData()
        }).catch(() => {
          _vue.$message({
            type: 'error',
            message: '请稍后重试',
            center: true
          })
        })
      }
    },
    cancelCloseOrder () {
      this.closeOrderDialog = false
    },
    sureCloseOrder () {
      // 确认关闭订单
      let _vue = this
      if (_vue.loading) {
        return false
      } else {
        _vue.loading = true
        _vue.$http.post('/api/v1.0/ensure/fast/close', {
          isRefund: _vue.hasRefund,
          ensureId: _vue.currentOrder.ensureId
        }).then(() => {
          _vue.$message({
            type: 'success',
            message: '关闭订单成功',
            center: true
          })
          _vue.closeOrderDialog = false
          _vue.fetchTableData()
          _vue.loading = false
        }).catch((err) => {
          let errorField = Global.extractErrorField(err)
          if (errorField === 'record') {
            _vue.$message({
              type: 'error',
              message: '订单已关闭，不能重复关闭',
              center: true
            })
          } else {
            _vue.$message({
              type: 'error',
              message: '请稍后重试',
              center: true
            })
          }
          _vue.loading = false
        })
      }
    },
    cancelFinishOrder () {
      // 取消完成订单
      this.finishOrderDialog = false
    },
    sureFinishOrder () {
      // 确认完成订单
      let _vue = this
      if (_vue.loading) {
        return false
      } else {
        _vue.loading = true
        _vue.$http.post('/api/v1.0/ensure/fast/complete', {
          ensureId: _vue.currentOrder.ensureId
        }).then(() => {
          _vue.$message({
            type: 'success',
            message: '完成订单成功',
            center: true
          })
          _vue.finishOrderDialog = false
          _vue.fetchTableData()
          _vue.loading = false
        }).catch(() => {
          _vue.$message({
            type: 'error',
            message: '请稍后重试',
            center: true
          })
          _vue.loading = false
        })
      }
    },
    handleCurrentChange (val) {
      this.pager = {
        size: 10,
        curPage: val
      }
      this.fetchTableData()
    },
    selectFunction (val) {
      // 选中的职能ID
      this.searchForm.functionId = val
    },
    selectAdviser () {
      let _vue = this
      let adviser = _.findWhere(_vue.adviserOptions, {adminId: parseInt(_vue.assignAdviserForm.adminId)})
      if (adviser !== undefined) {
        _vue.assignAdviserForm.mobile = adviser.mobile
        _vue.assignAdviserForm.email = adviser.email
      }
    },
    changeAdminId () {
      let _vue = this
      if (_vue.searchForm.adminId === '0') {
        _vue.showOrderStatusDialog = false
      } else {
        _vue.showOrderStatusDialog = true
        _vue.searchForm.orderStatus = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";
  .multi-button-wrap {
    button {
    }
  }
  .dialog-bottom-tip {
    text-align: center;
    font-size: 15px;
    color: #666;
  }
</style>
