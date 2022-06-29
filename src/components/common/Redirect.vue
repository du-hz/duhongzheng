<template>
  <div class="page">
    <common-header></common-header>
    <div class="loading-container">
    </div>
    <common-footer></common-footer>
  </div>
</template>

<script>
import CommonHeader from './CommonHeader'
import CommonFooter from './CommonFooter'
import Global from '../../assets/js/global'
import _ from 'underscore'

export default {
  components: {
    CommonHeader,
    CommonFooter
  },
  data () {
    return {
      code: ''
    }
  },
  created () {
    let _vue = this
    let code = _vue.$route.query.code || ''
    if (code === '') {
      _vue.showAlert()
    } else {
      _vue.$http.get('/api/v1.0/email/code/' + code).then((response) => {
        console.log(response.data.data)
        // 根据业务参数，跳转到不同页面
        // TODO: 自动登录时，根据业务场景有些只能当次有效，不能缓存本地
        let result = response.data.data
        if (result.redirectBiz === 'MCWBE_ValidateEmail') {
          // 注册邮箱验证
          Global.setItem('token', result.token)
          _vue.$router.push({
            path: '/validate'
          })
        } else if (result.redirectBiz === 'MCWBE_FindPwdEmail') {
          // 找回密码
          _vue.$router.push({
            path: '/resetpwd',
            query: _vue.$route.query
          })
        } else if (result.redirectBiz === 'MCABE_ContractContinue') {
          // 邀请完善订单
          Global.setItem('token', result.token)
          // tapeout complete 页面如果有ef=once属性，离开页面时会自动退出登录
          _vue.$router.push({
            name: 'tapeoutComplete',
            params: {
              id: result.contractNo
            },
            query: {
              ef: 'once'
            }
          })
        } else if (result.redirectBiz === 'MCABE_ensure_login') {
          // 轻猎头服务
          if (result.token) {
            Global.setItem('token', result.token)
          }
          _vue.$router.push({
            path: '/recruit/entry'
          })
        } else if (result.redirectBiz === 'MCABE_survey_login') {
          // 背调服务
          if (result.token) {
            Global.setItem('token', result.token)
          }
          _vue.$router.push({
            path: '/recruit/survey'
          })
        } else if (result.redirectBiz === 'MCABE_fa_conference_update') {
          // FA 会议修改需求
          if (result.token) {
            Global.setItem('token', result.token)
          }
          // 解析extra参数, 跳转到指定页面   roleType=3&roleId=14
          this.handleFaRedirect(result.extra)
        } else if (result.redirectBiz === 'MCABE_fa_new_user') {
          // FA 新用户注册
          if (result.token) {
            Global.setItem('token', result.token)
          }
          this.handleFaRedirect(result.extra)
        } else if (result.redirectBiz === 'MCABE_fa_user_info_query') {
          // FA 用户信息存在疑问
          if (result.token) {
            Global.setItem('token', result.token)
          }
          this.handleFaRedirect(result.extra)
        } else if (result.redirectBiz === 'MCABE_fa_update_user_info') {
          // FA 用户申请修改个人信息
          if (result.token) {
            Global.setItem('token', result.token)
          }
          this.handleFaRedirect(result.extra)
        } else if (result.redirectBiz === 'MCABE_fa_investor_project_interest') {
          // FA 投资人对项目是否感兴趣
          if (result.token) {
            Global.setItem('token', result.token)
          }
          this.handleFaRedirect(result.extra)
        } else if (result.redirectBiz === 'MCABE_fa_specialist_project_assess') {
          // FA 技术专家评估项目
          if (result.token) {
            Global.setItem('token', result.token)
          }
          this.handleFaRedirect(result.extra)
        } else if (result.redirectBiz === 'MCABE_fa_work_order_alert') {
          // FA 工单提醒
          if (result.token) {
            Global.setItem('token', result.token)
          }
          this.handleFaRedirect(result.extra)
        }
      }).catch((error) => {
        let field = Global.extractErrorField(error)
        if (field === 'isExpired') {
          this.showAlert('链接已过期，请重新发送邮件')
        } else if (field === 'emailCode') {
          this.showAlert()
        } else if (field === 'queryCt') {
          this.showAlert('链接已失效，请重新发送邮件')
        } else {
          this.showAlert()
        }
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$loading({
        target: '.loading-container',
        lock: true,
        fullscreen: false,
        text: 'Loading...',
        customClass: 'custom-loading-light',
        background: 'transparent'
      })
    })
  },
  methods: {
    showAlert (text) {
      this.$alert(text || '链接地址无效，请确认访问地址后重试', '提示', {
        confirmButtonText: '确定',
        callback: () => {
          this.$router.push({
            path: '/'
          })
        }
      })
    },
    showMessage (text) {
      this.$message({
        type: 'success',
        message: text || '',
        center: true,
        showClose: true
      })
    },
    handleFaRedirect (extra) {
      let result = {}
      if (extra) {
        let arr = extra.split('&')
        _.each(arr, item => {
          let tmp = item.split('=')
          if (tmp[0] === 'roleType') {
            result.roleType = tmp[1]
          }
          if (tmp[0] === 'roleId') {
            result.roleId = tmp[1]
          }
        })
      }
      if (result.roleType + '' === '1') {
        // 项目详情页
        this.$router.push({
          path: '/fa/project/' + result.roleId
        })
      }
      if (result.roleType + '' === '2') {
        // 投资人详情页
        this.$router.push({
          path: '/fa/investor/person/' + result.roleId
        })
      }
      if (result.roleType + '' === '3') {
        // 技术专家详情页
        this.$router.push({
          path: '/fa/expert/' + result.roleId
        })
      }
    }
  }
}
</script>

<style>
  .custom-loading-light {
    z-index: 1000;
  }
</style>
<style lang="scss" scoped>
  @import "~assets/css/variable";

  .loading-container {
    min-height: 550px;
  }
</style>
