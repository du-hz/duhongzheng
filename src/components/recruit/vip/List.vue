<template>
  <div class="table-list-wrap">
    <div class="list-search-wrap">
      <el-form :inline="true" ref="searchForm" :model="searchForm" class="form-inline" label-width="70px">
        <el-form-item label="公司">
          <el-input v-model="searchForm.companyName" clearable placeholder="请输入公司ID或公司简称"></el-input>
        </el-form-item>
        <el-form-item label="会员等级">
          <el-select v-model="searchForm.vipLevel" placeholder="请选择" clearable>
            <el-option label="全部" value=""></el-option>
              <el-option label="黄金版" value="2"></el-option>
              <el-option label="白金版" value="3"></el-option>
              <el-option label="钻石版" value="4"></el-option>
              <el-option label="黑金版" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="进行中" value="1"></el-option>
            <el-option label="已到期" value="2"></el-option>
            <el-option label="审批中" value="3"></el-option>
            <el-option label="不通过" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户经理" prop="adminId">
          <el-select v-model="searchForm.adminId" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in adviserOptions"
              :key="item.adminId"
              :label="item.adminName"
              :value="item.adminId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="search('searchForm')">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 会员信息列表 -->
    <div style="text-align: right;margin: 15px 0;">
      <el-button type="primary" @click="newViper">新增企业会员</el-button>
    </div>
    <el-table
      :data="tableData"
      header-row-class-name="tableheader"
      border
      style="width: 100%;">
      <el-table-column
        type="index"
        width="50"
        align="center">
      </el-table-column>
      <el-table-column
        label="公司ID"
        width="160"
        align="center">
        <template slot-scope="scope">
          <span class="text-link" @click="viewApplyInfo(scope.row)">{{scope.row.companyId}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="companyName"
        label="公司"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        label="会员等级"
        width="150"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.vipLevel | stageFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="applyTime"
        label="申请时间"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="会员开始时间"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="会员结束时间"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        label="会员状态"
        min-width="120"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1">进行中</span>
          <span v-if="scope.row.status === 3">已到期</span>
          <span v-if="scope.row.status === 0">审批中</span>
          <span v-if="scope.row.status === 2">不通过</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="managerAdminName"
        label="客户经理"
        width="150"
        align="center">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        min-width="400"
        align="center"
        class-name="multi-button-wrap">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleRecord(scope.row)">操作记录</el-button>
          <el-button type="primary" size="small" @click="showApplyInfo(scope.row)">申请信息</el-button>
          <el-button type="primary" v-if="scope.row.status === 1 && scope.row.rightsStatus !== 0" size="small" @click="updateRights(scope.row)">权益修改</el-button>
          <el-button type="primary" v-if="(scope.row.status === 0 || scope.row.rightsStatus === 0) && adminInfo.isMaster === 1" size="small" @click="viewApplyInfo(scope.row)">审批</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pager-wrap">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="totalNum"
        :page-size="pager.size"
        :current-page="pager.curPage"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>

    <!-- 修改权益 -->
    <el-dialog title="修改权益" :visible.sync="updateRightsDialog" width="45%">
      <div class="form-container">
        <el-form :model="rightsForm" ref="rightsForm" class="rights-form">
          <div class="tb-title">
            <span>权益名称</span>
            <span>次数</span>
            <span>已使用次数</span>
          </div>
          <div class="rights-item" v-for="(rightsItem, index) in rightsForm.vipRights" :key="index">
            <span class="title">{{rightsItem.vipName}}</span>
            <span class="input-wrap">
              <el-input-number class="align-center" v-model="rightsItem.initTimes" controls-position="right" :min="rightsItem.usedTimes" :max="100"></el-input-number>
            </span>
            <span>{{rightsItem.usedTimes}}</span>
          </div>
          <el-form-item>
            <el-input type="textarea" :rows="4" v-model.trim="reason" placeholder="请填写调整理由"></el-input>
          </el-form-item>
          <el-form-item>
            <span class="rights-text">HR沙龙</span>
            <span class="rights-text">聊一聊</span>
            <span class="rights-text">企业VIP标识</span>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer center">
        <el-button @click="cancelUpdateRights('rightsForm')">取 消</el-button>
        <el-button type="primary" @click="sureUpdateRights('rightsForm')">确认修改</el-button>
      </div>
    </el-dialog>

    <!-- 申请信息 -->
    <el-dialog title="申请信息" :visible.sync="applyInfoDialog" width="40%">
      <el-form ref="vipForm" :model="vipForm" label-width="140px" class="vip-form">
        <el-form-item label="公司ID：">
          <span>{{vipForm.companyId}}</span>
        </el-form-item>
        <el-form-item label="公司名称：">
          <span>{{vipForm.companyName}}</span>
        </el-form-item>
        <el-form-item label="联系手机：">
          <span>{{vipForm.contactMobile}}</span>
        </el-form-item>
        <el-form-item label="联系邮箱：">
          <span>{{vipForm.contactEmail}}</span>
        </el-form-item>
        <el-form-item label="申请人姓名：">
          <span>{{vipForm.contactName}}</span>
        </el-form-item>
        <el-form-item label="会员等级：">
          <span>{{vipForm.vipLevel | stageFilter}}</span>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="会员开始日期：">
              <span>{{vipForm.startTime}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会员结束日期：">
              <span>{{vipForm.endTime}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 操作记录 -->
    <el-dialog title="操作记录" :visible.sync="operateRecordDialog" width="40%">
      <div class="form-container">
        <el-table
          :data="recordData"
          header-row-class-name="tableheader"
          border
          style="width: 100%;">
          <el-table-column
            type="index"
            width="50"
            align="center">
          </el-table-column>
          <el-table-column
            label="时间"
            width="170"
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.updateTime | filterDateformat('YYYY-MM-DD HH:mm:ss')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="内容"
            width="170"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.updateStatus === 0">待审核</span>
              <span v-if="scope.row.updateStatus === 1">审核通过</span>
              <span v-if="scope.row.updateStatus === 2">审核不通过</span>
              <span v-if="scope.row.updateStatus === 3">权益修改待审核</span>
              <span v-if="scope.row.updateStatus === 4">权益修改审核通过</span>
              <span v-if="scope.row.updateStatus === 5">权益修改审核不通过</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="updateRemark"
            label="备注"
            width="200"
            align="center">
          </el-table-column>
          <el-table-column
            prop="adminName"
            label="操作人"
            width="130"
            align="center">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'underscore'

export default {
  data () {
    return {
      searchForm: {
        adminId: '',
        companyName: '',
        status: '',
        vipLevel: ''
      },
      totalNum: 0,
      pager: {
        size: 10,
        curPage: 1
      },
      tableData: [],
      adviserOptions: [],
      updateRightsDialog: false,
      rightsForm: {
        vipRights: [],
        remark: ''
      },
      operateRecordDialog: false,
      recordData: [],
      curVipInfo: {},
      adminInfo: {},
      applyInfoDialog: false,
      vipForm: {},
      reason: ''
    }
  },
  created () {
    this.fetchTableData()
    this.fetchAdminInfo()
    this.fetchAdviser()
  },
  filters: {
    stageFilter (val) {
      // 信息状态
      if (val === 1 || val === 2) {
        return '黄金版'
      } else if (val === 3) {
        return '白金版'
      } else if (val === 4) {
        return '钻石版'
      } else if (val === 5) {
        return '黑金版'
      }
    }
  },
  methods: {
    fetchTableData () {
      // 获取订单列表
      let _vue = this
      _vue.$http.get('/api/v1.0/vip/search?page=' + _vue.pager.curPage +
        '&per_page=' + _vue.pager.size +
        '&vipLevel=' + _vue.searchForm.vipLevel +
        '&vipStatus=' + _vue.searchForm.status +
        '&companyName=' + _vue.searchForm.companyName +
        '&managerAdminId=' + _vue.searchForm.adminId).then(function (response) {
        _vue.tableData = response.data.data.rows || []
        _vue.totalNum = response.data.data.total || 0
      })
    },
    fetchAdminInfo () {
      // 获取当前用户的adminInfo
      let _vue = this
      _vue.$http.get('/api/v1.0/vip/manager').then((response) => {
        _vue.adminInfo = response.data.data.infoManger
      })
    },
    fetchAdviser () {
      // 获取招聘顾问
      let _vue = this
      _vue.$http.get('/api/v1.0/admin/manager/vip').then(function (response) {
        _vue.adviserOptions = response.data.data.vipManage || []
      })
    },
    search () {
      this.pager.curPage = 1
      this.fetchTableData()
    },
    handleCurrentChange (val) {
      this.pager = {
        size: 10,
        curPage: val
      }
      this.fetchTableData()
    },
    fetchHistory (row) {
      // 操作记录
      let _vue = this
      _vue.$http.get('/api/v1.0/vip/history?vipInfoId=' + row.vipInfoId).then(function (response) {
        _vue.recordData = response.data.data.histories
      })
    },
    cancelUpdateRights () {
      // 取消修改
      this.updateRightsDialog = false
    },
    sureUpdateRights () {
      // 提交修改
      let _vue = this
      let updateVipRights = []
      _.each(_vue.rightsForm.vipRights, (item) => {
        let rightsItem = {}
        rightsItem.vipId = item.vipId
        rightsItem.freeTimes = item.initTimes
        updateVipRights.push(rightsItem)
      })
      _vue.$http.post('/api/v1.0/vip/edit', {
        vipInfoId: _vue.curVipInfo.vipInfoId,
        vipRights: updateVipRights,
        reason: _vue.reason,
        companyId: _vue.curVipInfo.companyId
      }).then(() => {
        _vue.$message({
          type: 'success',
          message: '保存成功',
          center: true
        })
        _vue.updateRightsDialog = false
        _vue.fetchTableData()
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    handleRecord (row) {
      // 查看操作记录
      this.fetchHistory(row)
      this.operateRecordDialog = true
    },
    viewApplyInfo (row) {
      // 查看详情
      this.$router.push({
        path: '/recruit/vip/detail',
        query: {
          id: row.vipInfoId
        }
      })
    },
    updateRights (row) {
      // 编辑权益
      let _vue = this
      _vue.fetchRightsInfo(row)
      _vue.updateRightsDialog = true
    },
    newViper () {
      // 新增企业会员
      this.$router.push({
        path: '/recruit/vip/new'
      })
    },
    fetchRightsInfo (row) {
      // 获取公司权益信息
      let _vue = this
      _vue.$http.get('/api/v1.0/vip/info?vipInfoId=' + row.vipInfoId).then((response) => {
        _vue.curVipInfo = response.data.data.vipInfo
        _vue.rightsForm.vipRights = _.sortBy(_vue.curVipInfo.rights, 'vipId')
      })
    },
    showApplyInfo (row) {
      // 显示申请信息
      let _vue = this
      _vue.$http.get('/api/v1.0/vip/info?vipInfoId=' + row.vipInfoId).then((response) => {
        _vue.vipForm = response.data.data.vipInfo
      })
      _vue.applyInfoDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";

  .form-container {
    max-height: 450px;
    overflow-y: auto;
  }
  .rights-form {

    span {
      display: inline-block;
      text-align: center;

      &:first-child {
        width: 50%;
      }
      &:nth-child(2) {
        width: 25%;
      }
      &:last-child {
        width: 20%;
      }
    }

    .tb-title {
      background-color: $primary-color;
      padding: 10px 0;
      span {
        color: #fff;
      }
    }
    .rights-item {
      padding: 5px 0;

      input {
        text-align: center;
      }
    }
  }
  .rights-text {
    display: inline-block !important;
    width: 100px !important;
  }
  .input-wrap {
    .el-input-number {
      width: 100%;
    }
  }
</style>
