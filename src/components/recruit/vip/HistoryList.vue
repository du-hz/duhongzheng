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
            <el-option label="vip 1" value="1"></el-option>
            <el-option label="vip 2" value="2"></el-option>
            <el-option label="vip 3" value="3"></el-option>
            <el-option label="vip 4" value="4"></el-option>
            <el-option label="vip 5" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="未审批" value="1"></el-option>
            <el-option label="审批通过" value="2"></el-option>
            <el-option label="审批不通过" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="search('searchForm')">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 线下权益申请列表 -->
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
        prop="companyId"
        label="公司ID"
        width="160"
        align="center">
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
          <span>v{{scope.row.vipLevel}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="rightsName"
        label="申请使用权益"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="提交时间"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        label="审批状态"
        min-width="120"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1">待审批</span>
          <span v-if="scope.row.status === 2">审批通过</span>
          <span v-if="scope.row.status === 3">审批不通过</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        min-width="400"
        align="center"
        class-name="multi-button-wrap">
        <template slot-scope="scope">
          <div v-if="!scope.row.action && scope.row.status === 1 && adminInfo.isMaster === 1">
            <el-button type="primary" size="small" @click="audit(scope.row, 2)">审核通过</el-button>
            <el-button type="primary" size="small" @click="audit(scope.row, 3)">审核不通过</el-button>
          </div>
          <div v-if="scope.row.action">
            <span class="history-action" v-if="scope.row.action === 2">已审核，审核通过</span>
            <span class="history-action" v-if="scope.row.action === 3">已审核，审核不通过</span>
          </div>
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
  </div>
</template>

<script>
import Global from 'assets/js/global'

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
  methods: {
    fetchTableData () {
      // 获取订单列表
      let _vue = this
      _vue.$http.get('/api/v1.0/vip/used/history?page=' + _vue.pager.curPage +
        '&per_page=' + _vue.pager.size +
        '&vipLevel=' + _vue.searchForm.vipLevel +
        '&status=' + _vue.searchForm.status +
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
    audit (row, status) {
      // 审核
      let _vue = this
      _vue.$http.post('/api/v1.0/vip/rights/audit', {
        historyId: row.id,
        auditStatus: status
      }).then(() => {
        _vue.$message({
          type: 'success',
          message: '审核成功',
          center: true
        })
        _vue.pager.curPage = 1
        _vue.fetchTableData()
      }).catch((err) => {
        let code = Global.extractErrorCode(err)
        if (code === 'vipRights.isUsedOut') {
          _vue.$message({
            type: 'error',
            message: '权益次数不足，不能审核',
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
        width: 70%;
      }
      &:last-child {
        width: 28%;
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
  .history-action {
    color: #999;
  }
</style>
