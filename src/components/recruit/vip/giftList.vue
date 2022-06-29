<template>
  <div class="table-list-wrap">
    <!-- 会员信息列表 -->
    <div style="text-align: left;margin: 15px 0;">
      <el-button type="primary" @click="newJob">新增赠送职位</el-button>
      <el-button type="primary" @click="newViper">新增赠送权益</el-button>
    </div>
    <el-table
      :data="tableData"
      header-row-class-name="tableheader"
      border
      style="width: 100%;">
      <el-table-column
        type="index"
        width="50"
        fixed="left"
        align="center">
      </el-table-column>
      <el-table-column
        label="公司ID"
        width="160"
        fixed="left"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.companyId}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="companyName"
        label="公司"
        fixed="left"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        prop="jobNumber"
        label="职位数量"
        width="150"
        align="center">
      </el-table-column>
      <el-table-column
        prop="intentionNumber"
        label="意向沟通数量"
        width="150"
        align="center">
      </el-table-column>
      <el-table-column
        prop="intentionDepthNumber"
        label="深度意向沟通数量"
        width="150"
        align="center">
      </el-table-column>
      <el-table-column
        prop="boomNumber"
        label="人才炸弹数量"
        width="150"
        align="center">
      </el-table-column>
      <el-table-column
        prop="jobStoreNumber"
        label="职位存储库数量"
        width="150"
        align="center">
      </el-table-column>
      <el-table-column
        prop="applyName"
        label="申请人姓名"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        prop="applyEmail"
        label="申请人邮箱"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        prop="applyMobile"
        label="申请人手机号"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        prop="applyTime"
        label="申请时间"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        min-width="300"
        align="center"
        class-name="multi-button-wrap">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleRecord(scope.row)">操作记录</el-button>
          <el-button type="primary" size="small" @click="applyInfoFun(scope.row)">申请信息</el-button>
          <el-button type="primary" :disabled ="scope.row.status !== 0" size="small" @click="showApplyInfo(scope.row)">审批</el-button>
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

    <!-- 添加职位权益 -->
    <el-dialog
      title="赠送职位"
      :visible.sync="dialogVisible"
      width="60%">
    <el-form ref="vipForm" :model="vipForm" label-width="140px" class="vip-form">
      <el-form-item label="公司ID：">
        <el-input style="width: 200px;" v-model="vipForm.companyId"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="fetchCompany"></el-button>
      </el-form-item>
      <el-form-item label="公司名称：">
        <span>{{companyName}}（根据公司ID自动匹配）</span>
      </el-form-item>
      <el-form-item label="职位：">
          <el-radio-group v-model="vipForm.type" @change="changeType">
            <el-radio :label="1">普通职位30天</el-radio>
            <el-radio :label="2">人才无忧职位90天</el-radio>
            <el-radio :label="3">职位包</el-radio>
          </el-radio-group>
      </el-form-item>
      <el-form-item label="数量：">
          <el-input-number v-model="vipForm.num" :min="1" :disabled="isdisabled"></el-input-number>
      </el-form-item>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureJob">确 定</el-button>
      </span>
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
              <span>{{scope.row.auditTime}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="内容"
            width="170"
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.statusText}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="auditRemark"
            label="备注"
            width="200"
            align="center">
          </el-table-column>
          <el-table-column
            prop="auditAdminName"
            label="操作人"
            width="130"
            align="center">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 审批详情 -->
    <el-dialog title="审批详情" :visible.sync="applyInfoDialog" width="40%">
      <el-form ref="applyInfo" :model="applyInfo" label-width="170px" class="applyInfo">
        <el-form-item label="公司ID：">
          <span>{{applyInfo.companyId}}</span>
        </el-form-item>
        <el-form-item label="公司名称：">
          <span>{{applyInfo.companyName}}</span>
        </el-form-item>
        <el-form-item label="联系手机：">
          <span>{{applyInfo.applyMobile}}</span>
        </el-form-item>
        <el-form-item label="联系邮箱：">
          <span>{{applyInfo.applyEmail}}</span>
        </el-form-item>
        <el-form-item label="申请人姓名：">
          <span>{{applyInfo.applyName}}</span>
        </el-form-item>
        <el-form-item label="申请职位数量：">
          <span>{{applyInfo.jobNumber}}</span>
        </el-form-item>
        <el-form-item label="申请意向沟通数量：">
          <span>{{applyInfo.intentionNumber}}</span>
        </el-form-item>
        <el-form-item label="申请深度意向沟通数量：">
          <span>{{applyInfo.intentionDepthNumber}}</span>
        </el-form-item>
        <el-form-item label="申请人才炸弹数量：">
          <span>{{applyInfo.boomNumber}}</span>
        </el-form-item>
        <el-form-item label="申请职位存储库数量：">
          <span>{{applyInfo.jobStoreNumber}}</span>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="权益开始日期：">
              <span>{{applyInfo.startTime}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权益结束日期：">
              <span>{{applyInfo.endTime}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="审批备注：" label-width="120px" style="margin-top:20px">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入审批备注"
            v-model="auditRemark">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button  @click="viewApplyInfo(2)">审批不通过</el-button>
        <el-button type="primary" @click="viewApplyInfo(1)">审批通过</el-button>
      </span>
    </el-dialog>
    <!-- 申请信息 -->
    <el-dialog title="申请信息" :visible.sync="applyInfoStatus" width="40%">
      <el-form ref="applyInfoDataForm" :model="applyInfoData" label-width="170px" class="applyInfo">
        <el-form-item label="公司ID：">
          <span>{{applyInfoData.companyId}}</span>
        </el-form-item>
        <el-form-item label="公司名称：">
          <span>{{applyInfoData.companyName}}</span>
        </el-form-item>
        <el-form-item label="联系手机：">
          <span>{{applyInfoData.applyMobile}}</span>
        </el-form-item>
        <el-form-item label="联系邮箱：">
          <span>{{applyInfoData.applyEmail}}</span>
        </el-form-item>
        <el-form-item label="申请人姓名：">
          <span>{{applyInfoData.applyName}}</span>
        </el-form-item>
        <el-form-item label="申请职位数量：">
          <span>{{applyInfoData.jobNumber}}</span>
        </el-form-item>
        <el-form-item label="申请意向沟通数量：">
          <span>{{applyInfoData.intentionNumber}}</span>
        </el-form-item>
        <el-form-item label="申请深度意向沟通数量：">
          <span>{{applyInfoData.intentionDepthNumber}}</span>
        </el-form-item>
        <el-form-item label="申请人才炸弹数量：">
          <span>{{applyInfoData.boomNumber}}</span>
        </el-form-item>
        <el-form-item label="申请职位存储库数量：">
          <span>{{applyInfoData.jobStoreNumber}}</span>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="权益开始日期：">
              <span>{{applyInfoData.startTime}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权益结束日期：">
              <span>{{applyInfoData.endTime}}</span>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </el-dialog>
  </div>

</template>

<script>

export default {
  data () {
    return {
      totalNum: 0,
      pager: {
        size: 10,
        curPage: 1
      },
      operateRecordDialog: false,
      applyInfoDialog: false,
      applyInfoStatus: false,
      tableData: [],
      dialogVisible: false,
      companyName: '',
      isdisabled: false,
      applyInfo: {},
      vipForm: {
        companyId: '',
        type: 1,
        num: 1
      },
      applyInfoData: {},
      recordData: [],
      auditRemark: ''
    }
  },
  created () {
    this.fetchTableData()
  },
  methods: {
    handleRecord (row) {
      this.operateRecordDialog = true
      console.log('row', row)
      let _vue = this
      _vue.$http.get('/api/v1.0/vip/user/operation/record?discountId=' + row.id).then(function (response) {
        console.log('response', response)
        _vue.recordData = response.data.data
      })
    },
    applyInfoFun (row) {
      this.applyInfoData = row
      this.applyInfoStatus = true
    },
    showApplyInfo (row) {
      this.applyInfo = row
      this.applyInfoDialog = true
    },
    viewApplyInfo (type) {
      this.$confirm('此操作仅能执行一次，不可修改审批状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          status: type,
          auditRemark: this.auditRemark,
          auditAdminId: Number(window.sessionStorage.getItem('login_fakeid')),
          discountId: this.applyInfo.id
        }
        this.$http.post('/api/v1.0/vip/user/discount/audit', data).then((res) => {
          console.log('审批结果', res)
          this.applyInfoDialog = false
          this.$message({
            type: 'success',
            message: '审批成功'
          })
          window.location.reload()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    changeType (val) {
      if (val === 3) {
        this.isdisabled = true
        this.vipForm.num = 1
      } else {
        this.isdisabled = false
      }
    },
    fetchTableData () {
      // 获取订单列表
      let _vue = this
      _vue.$http.get('/api/v1.0/vip/user/discount/record?page=' + _vue.pager.curPage +
        '&per_page=' + _vue.pager.size).then(function (response) {
        console.log('response', response)
        _vue.tableData = response.data.data.rows
        _vue.totalNum = response.data.data.total
      })
    },
    fetchCompany () {
      // 根据Id查询公司名称
      let _vue = this
      _vue.$http.get('/api/v1.0/vip/company?companyId=' + _vue.vipForm.companyId).then((response) => {
        _vue.companyName = response.data.data.companyName
      })
    },
    handleCurrentChange (val) {
      this.pager = {
        size: 10,
        curPage: val
      }
      this.fetchTableData()
    },
    newJob () {
      this.dialogVisible = true
    },
    sureJob () {
      let _vue = this
      _vue.$http.get('/api/v1.0/vip/single/job?companyId=' + _vue.vipForm.companyId + '&type=' + _vue.vipForm.type + '&num=' + _vue.vipForm.num + '&adminId=' + Number(window.sessionStorage.getItem('login_fakeid'))).then((response) => {
        console.log('response', response)
        if (response.data.code === 200) {
          _vue.$message({
            type: 'success',
            message: '提交成功',
            center: true
          })
          _vue.vipForm.companyId = ''
          _vue.vipForm.type = 0
        } else {
          _vue.$message({
            type: 'error',
            message: '请稍后重试',
            center: true
          })
        }
        _vue.dialogVisible = false
      })
    },
    newViper () {
      // 新增企业会员
      this.$router.push({
        path: '/recruit/vip/newGift'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";
  .applyInfo {
    .el-form-item {
      margin-bottom: 5px!important;
    }
  }
  .el-form-item {
    margin-bottom: 5px!important;
  }
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
