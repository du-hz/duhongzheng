<template>
  <div class="table-list-wrap">
    <div class="list-search-wrap">
      <el-form :inline="true" ref="searchForm" :model="searchForm" class="form-inline" label-width="90px">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderNo" clearable></el-input>
        </el-form-item>
        <el-form-item label="候选人姓名">
          <el-input v-model="searchForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="订单方案">
          <el-select v-model="searchForm.type" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="工程师" value="2"></el-option>
            <el-option label="经理级" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="searchForm.status" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="待分配" value="1"></el-option>
            <el-option label="背调中" value="2"></el-option>
            <el-option label="调查完成" value="3"></el-option>
            <el-option label="订单关闭" value="4"></el-option>
            <el-option label="订单待支付" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" v-if="adminInfo.isMaster === 1">
          <el-select v-model="searchForm.adminId" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in adviserOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="search('searchForm')">搜索</el-button>
          <el-button type="primary" size="medium" @click="reset('searchForm')" v-if="false">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 背调订单列表 -->
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
          <router-link class="text-link" :to="{ name: 'surveyDetail', params: { id: scope.row.id }}">{{scope.row.orderNo}}</router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="候选人"
        width="160"
        align="center">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号"
        width="160"
        align="center">
      </el-table-column>
      <el-table-column
        label="订单方案"
        width="160"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.jobRank | filterJobRank}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTimeText"
        label="创建时间"
        sortable="custom"
        width="220"
        align="center">
      </el-table-column>
      <el-table-column
        prop="expireTimeText"
        label="服务到期剩余"
        width="160"
        align="center">
      </el-table-column>
      <el-table-column
        prop="price"
        label="订单金额"
        min-width="120"
        align="center">
      </el-table-column>
      <el-table-column
        label="背调状态"
        width="200"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.status | filterSurveyStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="modifyTimeText"
        label="状态更新时间"
        sortable="custom"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        prop="adminName"
        label="负责人"
        width="120"
        align="center">
      </el-table-column>
      <el-table-column
        label="授权证明"
        width="120"
        align="center">
        <template slot-scope="scope">
          <a :href="scope.row.authorizationAddress | filterFileAddress" v-if="scope.row.authorizationAddress" class="text-link" target="_blank">查看</a>
        </template>
      </el-table-column>
      <el-table-column
        label="报告"
        width="120"
        align="center">
        <template slot-scope="scope">
          <a :href="scope.row.reportAddress | filterFileAddress" v-if="scope.row.reportAddress" class="text-link" target="_blank">查看</a>
        </template>
      </el-table-column>
      <el-table-column
        label="合同"
        width="120"
        align="center">
        <template slot-scope="scope">
          <a :href="scope.row.contractAddress | filterFileAddress" v-if="scope.row.contractAddress" class="text-link" target="_blank">查看</a>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        min-width="400"
        align="center"
        class-name="multi-button-wrap">
        <template slot-scope="scope">
          <el-button type="primary" size="small" v-if="adminInfo.isMaster === 1 && scope.row.status !== 3 && scope.row.status !== 4" @click="handleAssignAdviser(scope.row)">选择负责人</el-button>
          <el-button type="primary" v-if="scope.row.status > 1 && scope.row.status !== 4 && scope.row.status !== 5" size="small" @click="handleUploadReport(scope.row)">上传报告</el-button>
          <el-button type="primary" v-if="scope.row.status > 1 && scope.row.status !== 5" size="small" @click="handleUploadContract(scope.row)">上传合同</el-button>
          <el-button v-if="scope.row.status !== 4 && scope.row.status > 1 && scope.row.status !== 5" type="primary" size="small" @click="handleCloseOrder(scope.row)">关闭订单</el-button>
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
    <el-dialog title="选择负责人" :visible.sync="assignAdviserDialog" width="35%">
      <el-form :model="assignAdviserForm" ref="assignAdviserForm">
        <el-form-item label="选择负责人" label-width="140px">
          <el-select v-model="assignAdviserForm.adminId" placeholder="请选择" @change="selectAdviser">
            <el-option
              v-for="item in adviserOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
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
        <div class="dialog-bottom-tip">是否确认关闭订单？</div>
      </el-form>
      <div slot="footer" class="dialog-footer center">
        <el-button @click="cancelCloseOrder">取 消</el-button>
        <el-button type="primary" @click="sureCloseOrder" :disabled="loading">{{loading ? '提交中...' : '确 定'}}</el-button>
      </div>
    </el-dialog>
    <!-- 上传报告，订单完成 弹窗 -->
    <el-dialog title="上传报告" :visible.sync="finishOrderDialog" width="35%">
      <el-form>
        <el-form-item label="背调报告：" labelWidth="100px" prop="uploadedResume">
          <el-upload
            class="file-uploader"
            :multiple="false"
            action="http://upload.qiniup.com/"
            :show-file-list="false"
            :on-success="handleFileSuccess"
            :on-error="handleFileError"
            :on-progress="handleFileProgress"
            :data="uploadData"
            :before-upload="beforeFileUpload">
            <el-button size="small" type="primary">点击上传</el-button>
            <span v-if="fileUploading">文件上传中...</span>
          </el-upload>
          <a :href="surveyInfoForm.reportAddress | filterFileAddress" class="text-link" target="_blank">{{surveyInfoForm.reportName}}</a>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer center">
        <el-button @click="cancelFinishOrder">取 消</el-button>
        <el-button type="primary" @click="sureFinishOrder">确认完成订单</el-button>
      </div>
    </el-dialog>
    <!-- 上传合同 -->
    <el-dialog title="上传合同" :visible.sync="uploadContractDialog" width="35%">
      <el-form>
        <el-form-item label="上传合同：" labelWidth="100px" prop="uploadedResume">
          <el-upload
            class="file-uploader"
            :multiple="false"
            action="http://upload.qiniup.com/"
            :show-file-list="false"
            :on-success="handleContractSuccess"
            :on-error="handleContractError"
            :on-progress="handleContractProgress"
            :data="uploadData"
            :before-upload="beforeContractUpload">
            <el-button size="small" type="primary">点击上传</el-button>
            <span v-if="fileUploading">文件上传中...</span>
          </el-upload>
          <a :href="surveyInfoForm.contractAddress | filterFileAddress" class="text-link" target="_blank">{{surveyInfoForm.contractName}}</a>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer center">
        <el-button @click="cancelUploadContract">取 消</el-button>
        <el-button type="primary" @click="sureUploadContract">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'underscore'
import Global from 'assets/js/global'

export default {
  data () {
    return {
      searchForm: {
        orderNo: '',
        adminId: '',
        name: '',
        status: '',
        type: '',
        sort: '',
        direction: ''
      },
      totalNum: 1,
      pager: {
        size: 10,
        curPage: 1
      },
      tableData: [],
      surveyInfoForm: {
        id: '',
        contractAddress: '',
        contractName: '',
        reportAddress: '',
        reportName: ''
      },
      assignAdviserForm: {
        adminId: '',
        mobile: '',
        email: ''
      },
      uploadData: {
        token: '',
        key: ''
      },
      fileUploading: false,
      adviserOptions: [], // 招聘顾问list
      assignAdviserDialog: false,
      closeOrderDialog: false,
      finishOrderDialog: false,
      uploadContractDialog: false,
      currentOrder: {}, // 当前操作的订单，接口调用使用
      hasRefund: true, // 关闭订单，是否有退款
      orderRecordData: [], // 订单操作记录
      adminInfo: {}, // 当前用户adminInfo, 判断是否是主管会用到
      loading: false // 正在操作标识
    }
  },
  filters: {
    filterJobRank (val) {
      if (val === 2) return '工程师'
      if (val === 3) return '经理级'
    },
    filterFileAddress (val) {
      // 七牛文件路径
      let qiniuUrl = ''
      if (val) {
        if (val.startsWith('cloud/')) {
          // 需要拼接七牛域名
          qiniuUrl = Global.CONFIG.QINIU_BUCKET_MOORE_FILE_URL + '/' + val
        } else {
          qiniuUrl = val
        }
      }
      return qiniuUrl
    }
  },
  created () {
    this.fetchTableData()
    this.fetchAdviser()
    this.fetchAdminInfo()
  },
  methods: {
    fetchTableData () {
      // 获取订单列表
      let _vue = this
      _vue.$http.get('/api/v1.0/survey/lists?page=' + _vue.pager.curPage +
        '&per_page=' + _vue.pager.size +
        '&orderNo=' + _vue.searchForm.orderNo +
        '&status=' + _vue.searchForm.status +
        '&adminId=' + _vue.searchForm.adminId +
        '&name=' + _vue.searchForm.name +
        '&orderType=' + _vue.searchForm.type +
        '&sort=' + _vue.searchForm.sort +
        '&direction=' + _vue.searchForm.direction).then(function (response) {
        _vue.tableData = response.data.data.rows || []
        _vue.totalNum = response.data.data.total || 1
      })
    },
    fetchAdminInfo () {
      // 获取当前用户的adminInfo
      let _vue = this
      _vue.$http.get('/api/v1.0/survey/manager').then((response) => {
        _vue.adminInfo = response.data.data.infoManger || {}
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
      console.log(col)
      this.searchForm.sort = 'createTime'
      // TODO: 排序字段
      this.searchForm.direction = (col.order === 'descending' ? 'desc' : 'asc')
      this.fetchTableData()
    },
    handleAssignAdviser (row) {
      // 点击分配顾问
      this.assignAdviserDialog = true
      this.assignAdviserForm.adminId = ''
      this.assignAdviserForm.mobile = ''
      this.assignAdviserForm.email = ''
      this.currentOrder = row
    },
    handleCloseOrder (row) {
      // 点击关闭订单
      this.closeOrderDialog = true
      this.currentOrder = row
      this.loading = false
    },
    handleFinishOrder (row) {
      // 点击完成订单
      this.finishOrderDialog = true
      this.currentOrder = row
    },
    fetchAdviser () {
      // 获取招聘顾问
      let _vue = this
      _vue.$http.get('/api/v1.0/survey/bg-admin-lists?page=1&per_page=99').then(function (response) {
        _vue.adviserOptions = response.data.data.rows || []
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
          message: '请选择负责人',
          center: true
        })
      } else {
        _vue.$http.get('/api/v1.0/survey/select-admin?id=' + _vue.currentOrder.id + '&adminId=' + _vue.assignAdviserForm.adminId).then(function (response) {
          _vue.$message({
            type: 'success',
            message: '分配负责人成功',
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
        _vue.$http.get('/api/v1.0/survey/close-order?id=' + _vue.currentOrder.id).then(() => {
          _vue.$message({
            type: 'success',
            message: '关闭订单成功',
            center: true
          })
          _vue.closeOrderDialog = false
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
    handleUploadReport (row) {
      // 上传报告 & 完成订单 弹窗
      this.currentOrder = row
      this.surveyInfoForm.reportAddress = this.currentOrder.reportAddress || ''
      if (this.surveyInfoForm.reportAddress !== '') {
        this.surveyInfoForm.reportName = this.surveyInfoForm.reportAddress.substring(this.surveyInfoForm.reportAddress.lastIndexOf('/') + 1, this.surveyInfoForm.reportAddress.length)
      } else {
        this.surveyInfoForm.reportName = ''
      }
      this.finishOrderDialog = true
    },
    cancelFinishOrder () {
      // 取消完成订单
      this.finishOrderDialog = false
    },
    sureFinishOrder () {
      // 上传报告 & 确认完成订单
      let _vue = this
      if (_vue.surveyInfoForm.reportAddress === '') {
        _vue.$message({
          type: 'warning',
          message: '请上传背调报告',
          center: true
        })
      } else {
        _vue.$http.post('/api/v1.0/survey/order/upload', {
          id: _vue.currentOrder.id,
          reportAddress: _vue.surveyInfoForm.reportAddress
        }).then(() => {
          _vue.$message({
            type: 'success',
            message: '完成订单成功',
            center: true
          })
          _vue.finishOrderDialog = false
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
    handleCurrentChange (val) {
      this.pager = {
        size: 10,
        curPage: val
      }
      this.fetchTableData()
    },
    selectAdviser () {
      let _vue = this
      let adviser = _.findWhere(_vue.adviserOptions, {id: parseInt(_vue.assignAdviserForm.adminId)})
      if (adviser !== undefined) {
        _vue.assignAdviserForm.mobile = adviser.phone
        _vue.assignAdviserForm.email = adviser.email
      }
    },
    beforeFileUpload (file) {
      // 报告上传
      let _vue = this
      if (file.size / 1024 / 1024 >= 10) {
        _vue.$message({
          type: 'error',
          message: '文件大小需小于10M',
          center: true
        })
        return false
      } else if (file.type.indexOf('word') === -1 && file.type.indexOf('pdf') === -1) {
        _vue.$message({
          type: 'error',
          message: '文件格式不正确, 请上传word或pdf格式文件',
          center: true
        })
        return false
      } else {
        let key = 'cloud/file/report/' + (new Date().getTime()) + '_' + file.name
        return _vue.$http.get('/api/v1.0/qiniu/token/file?bucket=moore').then(response => {
          _vue.uploadData.token = response.data.data.token
          _vue.uploadData.key = key
        })
      }
    },
    handleFileError () {
      // 简历上传失败
      let _vue = this
      _vue.$message({
        type: 'error',
        message: '请稍后重试',
        center: true
      })
      this.fileUploading = false
    },
    handleFileSuccess (res, file) {
      // 简历上传成功
      console.log('上传成功')
      console.log(file)
      console.log(res)
      this.surveyInfoForm.reportName = file.name
      this.surveyInfoForm.reportAddress = res.key
      this.fileUploading = false
    },
    handleFileProgress () {
      // 文件上传中
      this.fileUploading = true
    },
    beforeContractUpload (file) {
      let _vue = this
      if (file.size / 1024 / 1024 >= 10) {
        _vue.$message({
          type: 'error',
          message: '文件大小需小于10M',
          center: true
        })
        return false
      } else {
        let key = 'cloud/file/contract/' + (new Date().getTime()) + '_' + file.name
        return _vue.$http.get('/api/v1.0/qiniu/token/file?bucket=moore').then(response => {
          _vue.uploadData.token = response.data.data.token
          _vue.uploadData.key = key
        })
      }
    },
    handleContractSuccess (res, file) {
      this.surveyInfoForm.contractName = file.name
      this.surveyInfoForm.contractAddress = res.key
      this.fileUploading = false
    },
    handleContractError () {
      let _vue = this
      _vue.$message({
        type: 'error',
        message: '请稍后重试',
        center: true
      })
      this.fileUploading = false
    },
    handleContractProgress () {
      this.fileUploading = true
    },
    handleUploadContract (row) {
      // 上传合同弹窗
      this.currentOrder = row
      this.surveyInfoForm.contractAddress = this.currentOrder.contractAddress || ''
      if (this.surveyInfoForm.contractAddress !== '') {
        this.surveyInfoForm.contractName = this.surveyInfoForm.contractAddress.substring(this.surveyInfoForm.contractAddress.lastIndexOf('/') + 1, this.surveyInfoForm.contractAddress.length)
      } else {
        this.surveyInfoForm.contractName = ''
      }
      this.uploadContractDialog = true
    },
    cancelUploadContract () {
      this.uploadContractDialog = false
    },
    sureUploadContract () {
      // 上传合同信息
      let _vue = this
      if (_vue.surveyInfoForm.contractAddress === '') {
        _vue.$message({
          type: 'warning',
          message: '请上传合同',
          center: true
        })
      } else {
        // 提交上传信息
        _vue.$http.post('/api/v1.0/survey/order/upload', {
          id: _vue.currentOrder.id,
          contractAddress: _vue.surveyInfoForm.contractAddress
        }).then(() => {
          _vue.$message({
            type: 'success',
            message: '上传成功',
            center: true
          })
          _vue.uploadContractDialog = false
          _vue.fetchTableData()
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
