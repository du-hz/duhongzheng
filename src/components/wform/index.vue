<template>
  <div class="w-main">
    <!-- 头部菜单栏 -->
    <div class="head-box">
      <div class="left-top-btn">
        <div class="tag-btn" @click="backPage"><img  class="img" src="./img/back.png" alt=""> 返回列表</div>
      </div>
      <div class="left-down-btn">
        <div class="tag-btn" @click="jumpPage('rules')" :class="activeItem === 'rules' ? 'active' : 'font'"><i class="el-icon-document"></i> 规则</div>
        <div class="tag-btn" @click="jumpPage('entries')" :class="activeItem === 'entries' ? 'active' : 'font'"><i class="el-icon-tickets"></i>数据</div>
        <div class="tag-btn" @click="jumpPage('set')" :class="activeItem === 'set' ? 'active' : 'font'"><i class="el-icon-setting"></i>设置</div>
        <div class="tag-btn" @click="jumpPage('edit')" :class="activeItem === 'edit' ? 'active' : 'font'"><i class="el-icon-edit-outline"></i>编辑</div>
        <div class="tag-btn" @click="jumpPage('publish')" :class="activeItem === 'publish' ? 'active' : 'font'"><i class="el-icon-check"></i> 发布</div>
        <div class="right-btn">
          <div class="tag-btn" @click="release"><img src="./img/release.png" alt="">保存表单</div>
        </div>
      </div>
    </div>
    <!-- 编辑区 -->
    <v-content>
      <router-view></router-view>
    </v-content>
  </div>
</template>

<script>
import content from './components/content'
import store from './../../vuex/store'
export default {
  name: 'form',
  components: {
    'v-content': content
  },
  data () {
    return {
      currentPage: '',
      activeItem: 'edit',
      uuid: ''
    }
  },
  computed: {
    isSaveForm () {
      return store.state.isSaveForm
    }
  },
  beforeRouteEnter (to, from, next) {
    store.commit('setIsRouter', to.name)
    next(vm => {
      next()
    })
  },
  created () {
    this.activeItem = store.state.isRouter
    this.currentPage = this.$route.query.currentPage ? this.$route.query.currentPage : ''
    this.uuid = this.$route.query.uuid ? this.$route.query.uuid : store.state.uuid
  },
  methods: {
    backPage () {
      if (this.currentPage) {
        this.$router.push({path: '/news/cf', query: {currentPage: this.currentPage, ran: Math.floor(Math.random() * 1000000)}})
      } else {
        this.$router.push({path: '/news/cf', query: {ran: Math.floor(Math.random() * 1000000)}})
      }
    },
    jumpPage (str) {
      this.uuid = this.$route.query.uuid ? this.$route.query.uuid : store.state.uuid
      let uuid = this.uuid
      if (!this.isSaveForm && this.activeItem === 'edit') {
        this.$confirm('你的表单有些修改尚未保存，请点击右上角按钮保存表单，是否确定要离开？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.commit('setIsSaveForm', true)
          if (str === 'rules') {
            this.activeItem = 'rules'
            this.$router.push({path: `/news/cf/form/${uuid}/rules`, query: {uuid: uuid, ran: Math.floor(Math.random() * 1000000)}})
          } else if (str === 'set') {
            this.activeItem = 'set'
            this.$router.push({path: `/news/cf/form/${uuid}/set`, query: {uuid: uuid, ran: Math.floor(Math.random() * 1000000)}})
          } else if (str === 'edit') {
            this.activeItem = 'edit'
            this.$router.push({path: `/news/cf/form/edit`, query: {uuid: uuid, ran: Math.floor(Math.random() * 1000000)}})
          } else if (str === 'entries') {
            this.activeItem = 'entries'
            this.$router.push({path: `/news/cf/form/${uuid}/entries`, query: {uuid: uuid, ran: Math.floor(Math.random() * 1000000)}})
          } else if (str === 'publish') {
            this.activeItem = 'publish'
            this.$router.push({path: `/news/cf/form/${uuid}/publish`, query: {uuid: uuid, ran: Math.floor(Math.random() * 1000000)}})
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消跳转'
          })
        })
        return
      }
      if (str === 'rules') {
        this.activeItem = 'rules'
        this.$router.push({path: `/news/cf/form/${uuid}/rules`, query: {uuid: uuid, ran: Math.floor(Math.random() * 1000000)}})
      } else if (str === 'set') {
        this.activeItem = 'set'
        this.$router.push({path: `/news/cf/form/${uuid}/set`, query: {uuid: uuid, ran: Math.floor(Math.random() * 1000000)}})
      } else if (str === 'edit') {
        this.activeItem = 'edit'
        this.$router.push({path: `/news/cf/form/edit`, query: {uuid: uuid, ran: Math.floor(Math.random() * 1000000)}})
      } else if (str === 'entries') {
        this.activeItem = 'entries'
        this.$router.push({path: `/news/cf/form/${uuid}/entries`, query: {uuid: uuid, ran: Math.floor(Math.random() * 1000000)}})
      } else if (str === 'publish') {
        this.activeItem = 'publish'
        this.$router.push({path: `/news/cf/form/${uuid}/publish`, query: {uuid: uuid, ran: Math.floor(Math.random() * 1000000)}})
      }
    },
    release () {
      store.commit('setIsRelease', true)
      // if (store.state.isRelease) {
      //   this.$message({
      //     message: '请添加表单项',
      //     type: 'warning'
      //   })
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './scss/index.scss';
@import './scss/base.scss';
@import './scss/color.scss';
.active{
  background-color: #fff;
  color: $titleColor;
}
.font{
  color: #fff;
}
</style>
