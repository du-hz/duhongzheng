<template>
  <div>
    <div class="head-wrap">
      <div class="title">新增企业会员</div>
      <a href="javascript:;" class="text-link" @click="back">&lt;&lt; 返回列表</a><br/>
    </div>
    <el-form ref="vipForm" :model="vipForm" label-width="140px" class="vip-form">
      <el-form-item label="公司ID：">
        <el-input style="width: 200px;" v-model="vipForm.companyId"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="fetchCompany"></el-button>
      </el-form-item>
      <el-form-item label="公司名称：">
        <span>{{companyName}}（根据公司ID自动匹配）</span>
      </el-form-item>
      <el-form-item label="联系手机：">
        <el-input v-model="vipForm.contactMobile"></el-input>
      </el-form-item>
      <el-form-item label="联系邮箱：">
        <el-input v-model="vipForm.contactEmail"></el-input>
      </el-form-item>
      <el-form-item label="申请人姓名：">
        <el-input v-model="vipForm.contactName"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="6">
          <el-form-item label="会员等级：">
            <el-select v-model="vipForm.vipLevel" @change="changeVipLevel">
              <el-option label="黄金版" value="2"></el-option>
              <el-option label="白金版" value="3"></el-option>
              <el-option label="钻石版" value="4"></el-option>
              <el-option label="黑金版" value="5"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="会员开始日期：">
            <el-date-picker
              v-model="vipForm.vipStartTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="date"
              placeholder="选择日期"
              @change="pickVipStartTime"
              clearable>
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="会员结束日期：">
            <el-date-picker
              v-model="vipForm.vipEndTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="date"
              placeholder="选择日期"
              clearable>
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="权益次数：">
        <div class="rights-form">
          <div class="tb-title">
            <span>权益名称</span>
            <span>免费次数</span>
          </div>
          <div class="rights-item" v-for="(rightsItem, index) in initVipRights" :key="index">
            <span class="title">{{rightsItem.vipName}}</span>
            <span class="input-wrap">
              <el-input-number v-model="rightsItem.freeTimes" controls-position="right" :min="0" :max="100"></el-input-number>
            </span>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="备注说明：">
        <el-input type="textarea" :rows="4" v-model="vipForm.reason" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <div class="action-wrap">
      <el-button type="plain" @click="cancelApply">取 消</el-button>
      <el-button type="primary" @click="sureApply">申 请</el-button>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'
import moment from 'moment'

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
        contactEmail: '',
        vipRights: [] // vipId freeTimes
      },
      companyName: '',
      initVipRights: []
    }
  },
  created () {
    let _vue = this
    _vue.fetchRightsConfig()
  },
  methods: {
    back () {
      this.$router.push({
        path: '/recruit/vip'
      })
    },
    newViper () {
      // 提交申请
      let _vue = this
      _vue.vipForm.vipRights = _vue.initVipRights
      _vue.$http.put('/api/v1.0/vip/apply', _vue.vipForm).then(() => {
        _vue.$message({
          type: 'success',
          message: '提交成功',
          center: true
        })
        _vue.$router.push({
          path: '/recruit/vip'
        })
      }).catch((error) => {
        console.log(error)
        var errData = error.response.data.error
        if (errData) {
          var errObj = errData.errors && errData.errors[0]
          if (errObj) {
            console.log(errObj.message)
            _vue.$message({
              type: 'error',
              message: errObj.message,
              center: true
            })
          }
        } else {
          _vue.$message({
            type: 'error',
            message: '请稍后重试',
            center: true
          })
        }
      })
    },
    fetchRightsConfig () {
      let _vue = this
      _vue.$http.get('/api/v1.0/vip/config?vipLevel=' + _vue.vipForm.vipLevel).then((response) => {
        _vue.initVipRights = _.sortBy(response.data.data.rights, 'vipId')
      })
    },
    cancelApply () {
      this.$router.push({
        path: '/recruit/vip'
      })
    },
    sureApply () {
      let _vue = this
      _vue.vipRights = _.pick(_vue.initVipRights, 'vipId', 'freeTimes')
      _vue.newViper()
    },
    changeVipLevel () {
      // 切换vip等级
      this.fetchRightsConfig()
    },
    fetchCompany () {
      // 根据Id查询公司名称
      let _vue = this
      _vue.$http.get('/api/v1.0/vip/company?companyId=' + _vue.vipForm.companyId).then((response) => {
        _vue.companyName = response.data.data.companyName
      })
    },
    pickVipStartTime (val) {
      var d = new Date(moment(val, 'YYYY-MM-DD HH:mm:ss'))
      d.setFullYear(d.getFullYear() + 1)
      this.vipForm.vipEndTime = moment(d).format('YYYY-MM-DD HH:mm:ss')
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

      &:first-child {
        width: 70%;
      }
      &:last-child {
        width: 28%;
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
