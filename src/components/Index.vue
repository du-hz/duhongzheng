<template>
  <div>
    <template v-if="!freeStyle">
      <common-header :name="name"></common-header>
      <div class="page-main-container">
        <div class="section-wrap">
          <div class="aside-wrap">
            <side-bar :itemData="dataInfo" :curPath="curPath"></side-bar>
          </div>
          <!-- 右侧主体内容 -->
          <div class="main-section-wrap" :style="{ height: bodyHeight + 'px' }">
            <router-view></router-view>
          </div>
        </div>
      </div>
      <common-footer></common-footer>
    </template>
    <template v-if="freeStyle">
      <div class="page-main-container">
        <router-view></router-view>
      </div>
    </template>
  </div>
</template>

<script>
import SideBar from '@/components/common/SideBar'
import CommonHeader from '@/components/common/CommonHeader'
import CommonFooter from '@/components/common/CommonFooter'
import Global from 'assets/js/global'
import _ from 'underscore'
import ErrorTip from '@/components/common/ErrorTip'

export default {
  components: {
    CommonHeader,
    CommonFooter,
    SideBar,
    ErrorTip
  },
  data () {
    return {
      dataInfo: [],
      name: '',
      bodyHeight: '', // 页面高度动态计算
      curPath: '',
      freeStyle: this.$route.path.startsWith('/free')
    }
  },
  beforeRouteEnter (to, from, next) {
    console.log('beforeRouteEnter')
    console.log(to)
    console.log(from)
    next(vm => {
      /*
      let path = to.path
      if (!Global.hasPathPermission(path)) {
        vm.$message({
          type: 'error',
          message: '当前账号没有权限',
          center: true
        })
        vm.$router.push({
          path: '/'
        })
      } else {
        next()
      }
      */
      next()
    })
  },
  beforeRouteUpdate (to, from, next) {
    console.log('beforeRouteUpdate')
    console.log(to)
    // to.path
    let path = to.path
    console.log('update path:' + path)
    /*
    if (!Global.hasPathPermission(path)) {
      this.$message({
        type: 'error',
        message: '当前账号没有权限',
        center: true
      })
      this.$router.push({
        path: '/'
      })
    } else {
      next()
    }
    */
    next()
  },
  created () {
    let _vue = this
    _vue.$nextTick(() => {
      _vue.bodyHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 105
      window.onresize = () => {
        _vue.bodyHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 105
      }
    })
    if (!Global.checkLogin() && !_vue.$route.path.startsWith('/free')) {
      _vue.$router.push({
        path: '/login'
      })
    } else {
      if (Global.checkLogin()) {
        _vue.$http.get('/api/v1.0/admin/current')
          .then(function (response) {
            window.sessionStorage.setItem('login_fakeid', response.data.data.adminInfo.id)
            _vue.dataInfo = _.sortBy(response.data.data.adminInfo.navs, 'resourceId')
            console.log('index.vue dataInfo ------')
            console.log(_vue.dataInfo)
            // 如果navs为空，从permits中分离出路径 TODO
            _vue.name = response.data.data.adminInfo.name
            let resourcePathArr = _.uniq(_.pluck(_.filter(response.data.data.adminInfo.permits, (item) => {
              return item.level === 3
            }), 'resourcePath'))
            // 资源操作
            window.sessionStorage.setItem('resource_path', JSON.stringify(resourcePathArr))
            let navPathArr = []
            _.each(response.data.data.adminInfo.permits, (item) => {
              if (item.level === 2) {
                navPathArr.push('/' + item.fatherPath + '/' + item.resourcePath)
              }
            })
            navPathArr = _.uniq(navPathArr)
            // 路径访问
            window.sessionStorage.setItem('nav_path', JSON.stringify(navPathArr))
          })
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";

  .page-main-container {
    .section-wrap {
      display: flex;
      position: relative;
      .aside {
        width: 240px;
        margin-right: 20px;
        background-color: $primary-color;
        flex-shrink: 0;
      }
      .main-section-wrap {
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 20px;
        box-sizing: border-box;
      }
    }
  }
  .view-wrap {
    padding: 25px 20px;
    border: 1px solid $border-color;
  }
</style>
