<template>
  <div class="page-header">
    <div class="inner">
      <el-row type="flex" align="middle">
        <el-col :span="12">
          <img class="logo" src="~assets/images/logo.png" alt="摩尔云">
        </el-col>
        <el-col :span="12" class="head-info">
          <span>欢迎您，<span class="stress">{{userName}}</span></span>
          <span class="logout" @click="loginOut">退出登录</span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Global from 'assets/js/global'

export default {
  props: ['name'],
  data () {
    return {
    }
  },
  computed: {
    userName () {
      return this.name
    }
  },
  methods: {
    loginOut () {
      let _vue = this
      this.$confirm('确认退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Global.removeItem('token')
        _vue.$router.push({
          path: '/login'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";

  .page-header {
    background-color: $bg-color;

    .inner {
      width: 98%;
      margin: 0 auto;
      padding: 5px 0;

      .logo {
        height: 42px;
      }
      .head-info {
        text-align: right;
        color: #666;

        span {
          display: inline-block;
        }
        .logout {
          cursor: pointer;
          margin-left: 60px;
        }
      }
    }
  }
</style>
