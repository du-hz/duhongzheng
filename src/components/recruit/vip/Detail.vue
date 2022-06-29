<template>
  <div>
    <div class="head-wrap">
      <div class="title">企业会员详情</div>
      <a href="javascript:;" class="text-link" @click="back">&lt;&lt; 返回列表</a><br/>
    </div>
    <el-form ref="vipForm" :model="vipForm" label-width="140px" class="vip-form">
      <el-form-item label="公司ID：">
        <span>{{vipForm.companyId}}</span>
      </el-form-item>
      <el-form-item label="公司名称：">
        <span>{{companyName}}</span>
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
      <el-row>
        <el-col :span="6">
          <el-form-item label="会员等级：">
            <span>v{{vipForm.vipLevel}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="会员开始日期：">
            <span>{{vipForm.startTime}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="会员结束日期：">
            <span>{{vipForm.endTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="权益次数：">
        <div class="rights-form">
          <div class="tb-title">
            <span class="title">权益名称</span>
            <span class="old-num">免费次数</span>
            <span v-if="vipForm.rightsStatus === 0" class="new-num">修改后次数</span>
            <span v-if="vipForm.status === 1" class="used-num">已使用次数</span>
          </div>
          <div class="rights-item" v-if="rightsItem != null" v-for="(rightsItem, index) in initVipRights" :key="index">
            <span class="title">{{rightsItem.vipName}}</span>
            <span class="old-num">{{rightsItem.initTimes}}</span>
            <span v-if="vipForm.rightsStatus === 0" class="new-num">{{rightsItem.plusTimes}}</span>
            <span v-if="vipForm.status === 1" class="used-num">{{rightsItem.usedTimes}}</span>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="申请备注：">
        <span>{{vipForm.reason}}</span>
      </el-form-item>
      <el-form-item label="审批备注：">
        <el-input type="textarea" :rows="4" v-model="reason" placeholder="审批备注"></el-input>
      </el-form-item>
    </el-form>
    <div class="action-wrap">
      <el-button type="plain" @click="cancelApply">返 回</el-button>
      <el-button type="primary" v-if="(vipForm.status === 0 || vipForm.rightsStatus === 0) && adminInfo.isMaster === 1" @click="sureApply(1)">审批通过</el-button>
      <el-button type="primary" v-if="(vipForm.status === 0 || vipForm.rightsStatus === 0) && adminInfo.isMaster === 1" @click="sureApply(2)">审批不通过</el-button>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'
import Global from 'assets/js/global'

export default {
  data () {
    return {
      vipForm: {
        companyId: '',
        vipLevel: '1',
        vipStartTime: '',
        vipEndTime: '',
        reason: '',
        contactName: '',
        contactMobile: '',
        contactEmail: ''
      },
      companyName: '',
      initVipRights: [],
      vipInfoId: this.$route.query && this.$route.query.id,
      adminInfo: {},
      reason: ''
    }
  },
  created () {
    let _vue = this
    _vue.fetchVipInfo()
    _vue.fetchAdminInfo()
  },
  methods: {
    fetchVipInfo () {
      // 获取公司权益信息
      let _vue = this
      _vue.$http.get('/api/v1.0/vip/info?vipInfoId=' + _vue.vipInfoId).then((response) => {
        _vue.vipForm = response.data.data.vipInfo
        _vue.companyName = _vue.vipForm.companyName
        _vue.initVipRights = _.sortBy(_vue.vipForm.rights, 'vipId')
      })
    },
    back () {
      this.$router.push({
        path: '/recruit/vip/company'
      })
    },
    editViper (status) {
      // 提交申请
      let _vue = this
      _vue.$http.post('/api/v1.0/vip/audit', {
        vipInfoId: _vue.vipInfoId,
        auditStatus: status,
        auditRemark: _vue.reason
      }).then(() => {
        _vue.$message({
          type: 'success',
          message: '提交成功',
          center: true
        })
        _vue.$router.push({
          path: '/recruit/vip/company'
        })
      }).catch((error) => {
        let errorFiled = Global.extractErrorField(error)
        if (errorFiled === 'apply') {
          _vue.$message({
            type: 'error',
            message: '不能重复开通VIP服务',
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
    cancelApply () {
      this.$router.push({
        path: '/recruit/vip'
      })
    },
    sureApply (status) {
      let _vue = this
      _vue.editViper(status)
    },
    fetchAdminInfo () {
      // 获取当前用户的adminInfo
      let _vue = this
      _vue.$http.get('/api/v1.0/vip/manager').then((response) => {
        _vue.adminInfo = response.data.data.infoManger
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";

  .head-wrap {
    .title {
      font-size: 18px;
      margin-bottom: 20px;
    }
  }
  .vip-form {
    width: 70%;
    margin-top: 30px;
  }
  .rights-form {

    span {
      display: inline-block;
      text-align: center;

      &.title {
        width: 60%;
      }
      &.old-num, &.new-num, &.used-num {
        width: 12%;
      }
    }

    .tb-title {
      background-color: $primary-color;
      padding: 5px 0;
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
  .action-wrap {
    width: 70%;
    margin-top: 30px;
  }
</style>
