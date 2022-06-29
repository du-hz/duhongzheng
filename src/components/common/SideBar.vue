<template>
  <div class="page-side-bar">
    <!-- 一级导航 -->
    <div class="main-nav">
      <ul>
        <li v-for="(permit, index) in permissions" :key="index" :class="{ active: activeMainNavIndex === permit.resourceId }" @click="mainNavRedirect(permit)">
          <el-tooltip class="item" effect="dark" :content="permit.resourceTitle" :enterable="false" placement="right">
            <div class="img-wrap" v-if="permit.resourceId === 1">
                <img src="~assets/images/nav-1.png" :alt="permit.resourceTitle">
            </div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="permit.resourceTitle" :enterable="false" placement="right">
            <div class="img-wrap" v-if="permit.resourceId === 2">
                <img src="~assets/images/nav-2.png" :alt="permit.resourceTitle">
            </div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="permit.resourceTitle" :enterable="false" placement="right">
            <div class="img-wrap" v-if="permit.resourceId === 3">
              <img src="~assets/images/nav-3.png" :alt="permit.resourceTitle">
            </div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="permit.resourceTitle" :enterable="false" placement="right">
            <div class="img-wrap" v-if="permit.resourceId === 4">
              <img src="~assets/images/nav-4.png" :alt="permit.resourceTitle">
            </div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="permit.resourceTitle" :enterable="false" placement="right">
            <div class="img-wrap" v-if="permit.resourceId === 5">
              <img src="~assets/images/nav-5.png" :alt="permit.resourceTitle">
            </div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="permit.resourceTitle" :enterable="false" placement="right">
            <div class="img-wrap" v-if="permit.resourceId === 6">
              <img src="~assets/images/nav-6.png" :alt="permit.resourceTitle">
            </div>
          </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="permit.resourceTitle" :enterable="false" placement="right">
                <div class="img-wrap" v-if="permit.resourceId === 7">
                    <img src="~assets/images/nav-7.png" :alt="permit.resourceTitle">
                </div>
            </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="permit.resourceTitle" :enterable="false" placement="right">
                <div class="img-wrap" v-if="permit.resourceId === 8">
                    <img src="~assets/images/nav-8.png" :alt="permit.resourceTitle">
                </div>
            </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="permit.resourceTitle" :enterable="false" placement="right">
            <div class="img-wrap" v-if="permit.resourceId === 9">
              <img src="~assets/images/nav-9.png" :alt="permit.resourceTitle">
            </div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="permit.resourceTitle" :enterable="false" placement="right">
            <div class="img-wrap" v-if="permit.resourceId === 10">
              <img src="~assets/images/nav-10.png" :alt="permit.resourceTitle">
            </div>
          </el-tooltip>
        </li>
      </ul>
      <ul class="bottom-nav-ul">
        <li :class="{ active: activeMainNavIndex === 'setting' }" @click="otherNavRedirect('setting')">
          <el-tooltip class="item" effect="dark" content="系统设置" :enterable="false" placement="right">
            <div class="img-wrap">
              <img src="~assets/images/setting.png" alt="系统设置">
            </div>
          </el-tooltip>
        </li>
      </ul>
    </div>
    <!-- 非一级导航 -->
    <div class="sub-nav-wrap">
      <!-- <ul class="sub-nav-list">
        <li class="sub-nav-item" v-if="nonMainNavData.length > 0" v-for="item in nonMainNavData" :key="item.resourceId" :class="{ active: activeSubIndex === item.resourcePath }" @click="subNavRedirect(item)">{{item.resourceTitle}}</li>
      </ul> -->
      <el-menu
        v-if="nonMainNavData.length > 0"
        :default-active="activeSubIndex"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose">
        <div v-for="item in nonMainNavData" v-bind:key="item.resourceId">
          <el-submenu :index="item.resourcePath" v-if="item.children.length > 0">
            <template slot="title">
              <span>{{item.resourceTitle}}</span>
            </template>
            <el-menu-item v-for="i in item.children" v-bind:key="i.resourceId" :index="i.resourcePath" @click="subNavRedirect(i)">
              <span slot="title">{{i.resourceTitle}}</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item :index="item.resourcePath" v-else  @click="subNavRedirect(item)">
            <span slot="title">{{item.resourceTitle}}</span>
          </el-menu-item>
        </div>
      </el-menu>
    </div>
    <!--<el-menu class="el-menu-vertical" ref="subMenu">-->
      <!--<el-menu-item v-for="(item, index) in nonMainNavData" :key="item.resourceId" :index="index + 1 + ''" @click="subNavRedirect(item)">{{item.resourceTitle}}</el-menu-item>-->
      <!--<el-submenu v-for="(item, index) in nonMainNavData" :key="item.resourceId" :index="index + 1 + ''">{{item.resourceTitle}}-->
        <!--<span>{{item.resourceTitle}}</span>-->
        <!--<template slot="title">-->
          <!--<span slot="title">{{item.resourceTitle}}</span>-->
        <!--</template>-->
        <!--<el-menu-item v-if="item.children.length > 0" v-for="(value, shortIndex) in item.children" :key="value.resourceId" :index="index + 1 + '-' + shortIndex">-->
          <!--<router-link :to="'/' + item.resourcePath + '/' +value.resourcePath">-->
            <!--{{value.resourceTitle}}-->
          <!--</router-link>-->
        <!--</el-menu-item>-->
      <!--</el-submenu>-->
    <!--</el-menu>-->
  </div>
</template>

<script>
// resourceId: 123  第一位：父级导航  第二位：子级导航  第三位：具体操作权限
import _ from 'underscore'
import Global from 'assets/js/global'

export default {
  props: ['itemData'],
  data () {
    return {
      activeMainNavIndex: 1, // 默认选中第一个一级导航，系统设置
      activeSubIndex: '', // 默认触发的二级导航
      permissions: this.itemData
    }
  },
  computed: {
    openeds () {
      let arr = _.pluck(this.permissions, 'resourceId')
      arr = _.map(arr, (item) => {
        return item + ''
      })
      return _.uniq(arr)
    },
    nonMainNavData () {
      // 分离出非一级导航，组成导航结构
      let arr = []
      let _vue = this
      _.each(_vue.permissions, (item) => {
        if (_vue.activeMainNavIndex === item.resourceId) {
          if (item.children.length > 0) {
            arr = item.children
          }
        }
      })
      arr = _.sortBy(arr, 'resourceId')
      _.each(arr, (ele) => {
        if (ele.children.length > 0) {
          ele.children = _.sortBy(ele.children, 'resourceId')
        }
      })
      if (_vue.activeMainNavIndex === 'setting') {
        arr = [{
          resourcePath: 'changepwd',
          resourceTitle: '修改密码'
        }]
      }
      return arr
    },
    activeMainPath () {
      // 当前选中的一级导航
      let _vue = this
      let path = ''
      _.each(_vue.permissions, (item) => {
        if (_vue.activeMainNavIndex === item.resourceId) {
          path = item.resourcePath
        }
      })
      if (_vue.activeMainNavIndex === 'setting') {
        path = 'setting'
      }
      return path
    }
  },
  watch: {
    '$route' (to, from) {
      // 监听路由变化，触发菜单变化
      let _vue = this
      // 如果传入值 permissions 为空，自己请求获取
      if (_vue.permissions.length === 0) {
        if (Global.checkLogin()) {
          _vue.$http.get('/api/v1.0/admin/current').then((response) => {
            _vue.permissions = _.sortBy(response.data.data.adminInfo.navs, 'resourceId')
            console.log('sideBar.vue permissions http -------')
            _vue.handlePath(_vue.$route.path)
          })
        }
      } else {
        console.log('sideBar.vue permissions cache -------')
        console.log(_vue.permissions)
        _vue.handlePath(_vue.$route.path)
      }
    }
  },
  created () {
    console.log('side bar path: ' + this.$route.path + '--------------------')
    let _vue = this
    // 如果传入值 permissions 为空，自己请求获取
    if (_vue.permissions.length === 0) {
      if (Global.checkLogin()) {
        _vue.$http.get('/api/v1.0/admin/current').then((response) => {
          const navs = response.data.data.adminInfo.navs
          const obj = {
            nav: true,
            resourceId: 10,
            resourcePath: 'xqc',
            resourceTitle: '芯企查',
            rootPath: 'root',
            children: [{
              fatherPath: 'xqc',
              nav: true,
              // resourceId: 99,
              resourcePath: 'user',
              resourceTitle: '用户管理',
              rootPath: 'xqc',
              children: [{
                children: [],
                fatherPath: 'user',
                nav: true,
                // resourceId: 99,
                resourcePath: 'user/list',
                resourceTitle: '用户列表',
                rootPath: 'xqc'
              }]
            }, {
              fatherPath: 'xqc',
              nav: true,
              // resourceId: 99,
              resourcePath: 'ent',
              resourceTitle: '企业信息管理',
              rootPath: 'xqc',
              children: [{
                children: [],
                fatherPath: 'ent',
                nav: true,
                // resourceId: 99,
                resourcePath: 'ent/list',
                resourceTitle: '企业列表',
                rootPath: 'xqc'
              }, {
                children: [],
                fatherPath: 'ent',
                nav: true,
                // resourceId: 99,
                resourcePath: 'ent/examine',
                resourceTitle: '企业审核',
                rootPath: 'xqc'
              }]
            }, {
              fatherPath: 'xqc',
              nav: true,
              // resourceId: 99,
              resourcePath: 'integral',
              resourceTitle: '积分规则',
              rootPath: 'xqc',
              children: [{
                children: [],
                fatherPath: 'integral',
                nav: true,
                // resourceId: 99,
                resourcePath: 'integral/list',
                resourceTitle: '积分列表',
                rootPath: 'xqc'
              }, {
                children: [],
                fatherPath: 'integral',
                nav: true,
                // resourceId: 99,
                resourcePath: 'integral/set',
                resourceTitle: '积分设置',
                rootPath: 'xqc'
              }]
            }, {
              fatherPath: 'xqc',
              nav: true,
              // resourceId: 99,
              resourcePath: 'sys',
              resourceTitle: '系统设置',
              rootPath: 'xqc',
              children: [{
                children: [],
                fatherPath: 'sys',
                nav: true,
                // resourceId: 99,
                resourcePath: 'sys/list',
                resourceTitle: '操作日志',
                rootPath: 'xqc'
              }]
            }]
          }
          navs.push(obj)
          _vue.permissions = _.sortBy(navs, 'resourceId')
          // _vue.permissions = _.sortBy(response.data.data.adminInfo.navs, 'resourceId')
          console.log('sideBar.vue permissions http -------')
          _vue.handlePath(_vue.$route.path)
        })
      }
    } else {
      console.log('sideBar.vue permissions cache -------')
      console.log(_vue.permissions)
      _vue.handlePath(_vue.$route.path)
    }
  },
  methods: {
    mainNavRedirect (permit) {
      // 选中一级导航时，默认选中下面有权限的第一个叶子级导航
      let _vue = this
      _vue.activeMainNavIndex = permit.resourceId
      let subPath = _vue.nonMainNavData[0].resourcePath
      if (_vue.nonMainNavData[0].children.length > 0) {
        subPath = _vue.nonMainNavData[0].children[0].resourcePath
      }
      console.log(_vue.activeMainNavIndex + '||' + permit.resourcePath + '||' + subPath)
      _vue.$router.push({
        path: '/' + permit.resourcePath + '/' + subPath
      })
      _vue.handlePath(_vue.$route.path)
    },
    subNavRedirect (item) {
      let _vue = this
      _vue.$router.push({
        path: '/' + _vue.activeMainPath + '/' + item.resourcePath
      })
      _vue.handlePath(_vue.$route.path)
    },
    handlePath (path) {
      // 解析当前访问路径，映射到对应的resourceId
      let curPath = path || this.$route.path
      console.log('handlePath curPath: ' + curPath)
      let _vue = this
      _.each(_vue.permissions, (item) => {
        if (curPath.startsWith('/' + item.resourcePath)) {
          _vue.activeMainNavIndex = item.resourceId
        }
      })
      _.each(_vue.nonMainNavData, (item) => {
        if (curPath.indexOf('/' + item.resourcePath) !== -1 && item.children.length === 0) {
          _vue.activeSubIndex = item.resourcePath
        } else {
          if (item.children.length > 0) {
            _.each(item.children, (elem) => {
              if (curPath.indexOf('/' + elem.resourcePath) !== -1) {
                _vue.activeSubIndex = elem.resourcePath
              }
            })
          }
        }
      })
      // 其他非权限路径
      if (curPath.startsWith('/setting')) {
        _vue.activeMainNavIndex = 'setting'
      }
      if (curPath.indexOf('/changepwd') !== -1) {
        _vue.activeSubIndex = 'changepwd'
      }
    },
    otherNavRedirect (path) {
      if (path.indexOf('setting') !== -1) {
        this.$router.push({
          path: '/setting/changepwd'
        })
        this.handlePath(this.$route.path)
      }
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";

  .page-side-bar {
    border-right: 1px solid $border-color;
    height: 100%;
    display: flex;

    .el-submenu .el-menu-item{
      min-width: auto;
    }

    .el-menu-item-group__title{
      display: none;
    }

    .el-menu{
      border-right: 0px;
    }

    .main-nav {
      height: 100%;
      background-color: #7bbcff;
      width: 55px;
      > ul {
        > li {
          color: #fff;
          text-align: center;
          opacity: 0.69;
          cursor: pointer;
          .img-wrap {
            padding: 15px 0;
          }
          img {
            width: 24px;
          }
          &:hover,
          &.active {
            background-color: $primary-color;
            opacity: 1;
          }
        }
      }
    }
    .sub-nav-wrap {
      height: 100%;
      border-right: none;
      width: 190px;
      .sub-nav-list {
        .sub-nav-item {
          height: 56px;
          line-height: 56px;
          font-size: 14px;
          color: #303133;
          padding: 0 20px;
          &:hover {
            background-color: #ecf5ff;
            cursor: pointer;
          }
          &.active {
            color: $font-bright-color;
          }
        }
      }
    }
  }
  .bottom-nav-ul {
    position: absolute;
    bottom: 0;
    width: 55px;
  }
</style>
