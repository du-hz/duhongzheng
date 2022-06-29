<template>
  <div>
    <div class="head-wrap">
      <div class="title">新增权益赠送</div>
      <a href="javascript:;" class="text-link" @click="back">&lt;&lt; 返回列表</a><br/>
    </div>
    <el-form ref="vipForm" :model="vipForm" :rules="rules"  label-width="140px" class="vip-form">
      <el-form-item label="公司ID：" prop="companyId">
        <el-input style="width: 200px;" v-model="vipForm.companyId"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="fetchCompany"></el-button>
      </el-form-item>
      <el-form-item label="公司名称：">
        <span>{{companyName}}（根据公司ID自动匹配）</span>
      </el-form-item>
      <el-form-item label="申请人姓名：" prop="contactName">
        <el-input v-model="vipForm.contactName"></el-input>
      </el-form-item>
      <el-form-item label="申请人邮箱：" prop="contactEmail">
        <el-input v-model="vipForm.contactEmail"></el-input>
      </el-form-item>
      <el-form-item label="申请人电话：" prop="contactMobile">
        <el-input v-model="vipForm.contactMobile"></el-input>
      </el-form-item>
      <el-row>
          <el-form-item label="权益开始结束日期：" prop="vipTime" label-width="150px">
            <el-date-picker
              v-model="vipForm.vipTime"
              type="datetimerange"
              value-format='yyyy-MM-dd HH:mm:ss'
              range-separator="至"
              start-placeholder="权益开始日期"
              end-placeholder="权益结束日期">
            </el-date-picker>
          </el-form-item>
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
    </el-form>
    <div class="action-wrap">
      <el-button type="plain" @click="cancelApply">取 消</el-button>
      <el-button type="primary" @click="sureApply('vipForm')">申 请</el-button>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'

export default {
  data () {
    return {
      vipForm: {
        companyId: '',
        vipTime: [],
        contactName: '',
        contactEmail: '',
        contactMobile: '',
        vipRights: [] // vipId freeTimes
      },
      rules: {
        companyId: [
          { required: true, message: '请输入公司ID', trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '请输入申请人姓名', trigger: 'blur' }
        ],
        contactEmail: [
          { required: true, message: '请输入申请人邮箱', trigger: 'blur' }
        ],
        contactMobile: [
          { required: true, message: '请输入申请人电话', trigger: 'blur' }
        ],
        vipTime: [
          { required: true, message: '权益开始结束日期', trigger: 'change' }
        ]
      },
      companyName: '',
      initVipRights: [{
        vipId: 1,
        vipName: '人才炸弹',
        freeTimes: 0
      }, {
        vipId: 15,
        vipName: '职位发布',
        freeTimes: 0
      }, {
        vipId: 16,
        vipName: '意向沟通',
        freeTimes: 0
      }, {
        vipId: 18,
        vipName: '职位储存库',
        freeTimes: 0
      }, {
        vipId: 24,
        vipName: '深度意向沟通',
        freeTimes: 0
      }]
    }
  },
  created () {
  },
  methods: {
    back () {
      this.$router.push({
        path: '/recruit/vip/gift'
      })
    },
    newViper () {
      // 提交申请
      let _vue = this
      _vue.vipForm.vipRights = _vue.initVipRights
      let newForm = {}
      newForm.vipStartTime = _vue.vipForm.vipTime[0]
      newForm.vipEndTime = _vue.vipForm.vipTime[1]
      newForm.companyId = _vue.vipForm.companyId
      newForm.contactName = _vue.vipForm.contactName
      newForm.contactEmail = _vue.vipForm.contactEmail
      newForm.contactMobile = _vue.vipForm.contactMobile
      newForm.vipRights = _vue.vipForm.vipRights
      _vue.$http.post('/api/v1.0/vip/user/discount', newForm).then(() => {
        _vue.$message({
          type: 'success',
          message: '提交成功',
          center: true
        })
        _vue.$router.push({
          path: '/recruit/vip/gift'
        })
      }).catch((error) => {
        console.log(error)
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    cancelApply () {
      this.$router.push({
        path: '/recruit/vip/gift'
      })
    },
    sureApply (formName) {
      console.log(this.vipForm.vipTime)
      let _vue = this
      _vue.$refs[formName].validate((valid) => {
        if (valid) {
          _vue.vipRights = _.pick(_vue.initVipRights, 'vipId', 'freeTimes')
          _vue.newViper()
        } else {
          return false
        }
      })
    },
    fetchCompany () {
      // 根据Id查询公司名称
      let _vue = this
      _vue.$http.get('/api/v1.0/vip/company?companyId=' + _vue.vipForm.companyId).then((response) => {
        _vue.companyName = response.data.data.companyName
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
