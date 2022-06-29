<template>
  <div>
    <div class="head-wrap">
      <span class="text-link" @click="back">&lt;&lt; 返回</span>
    </div>
    <div class="operate-action">
      <el-button type="primary" size="medium" @click="edit">编辑</el-button>
    </div>
    <div class="main-line-title">{{title || '消息详情'}}</div>
    <div class="news-info-wrap">
      <div class="head">
        <span class="title">消息ID：{{detail.id}}</span>
        <span class="title">消息名称：{{detail.title}}</span>
      </div>
      <div class="info">
        <div class="item">创建人：{{detail.creater}}</div>
        <div class="item">创建时间：{{detail.createTime}}</div>
        <div class="item">作者：{{detail.author}}</div>
        <div class="item">消息描述：{{detail.content}}</div>
        <div class="item-wrap">
          <div class="img-wrap">
            <span>封面图：</span>
            <img :src="detail.img | filterQiniuMooreImage" alt="">
          </div>
          <div class="img-wrap">
            <span>分享图：</span>
            <img :src="detail.shareImg | filterQiniuMooreImage" alt="">
          </div>
        </div>
        <div class="item">链接类型：
          <span v-if="detail.msgJumpType === 1">H5网页</span>
          <span v-if="detail.msgJumpType === 2">App内页</span>
        </div>
        <div class="item">跳转地址：{{detail.action}}</div>
        <div class="item">H5链接地址：
          <a class="text-link" :href="detail.h5Url" target="_blank">{{detail.h5Url}}</a>
        </div>
        <div class="item">外显标签：{{detail.displayTags}}</div>
        <div class="item">其余标签：{{detail.tags}}</div>
        <div class="item">是否展示：
          <span v-if="detail.isShow === 0">不展示</span>
          <span v-if="detail.isShow === 1">展示</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      id: this.$route.params.id,
      detail: {},
      routerFrom: '',
      title: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.routerFrom = from.path
    })
  },
  created () {
    let _vue = this
    _vue.fetchDetail()
  },
  methods: {
    fetchDetail () {
      // 详情展示
      let _vue = this
      _vue.$http.get('/api/v1.0/message/' + _vue.id).then((response) => {
        _vue.detail = response.data.data
        if (_vue.detail.msgType && _vue.detail.msgType === 1) {
          _vue.title = '系统消息详情'
        } else if (_vue.detail.msgType && _vue.form.msgType === 2) {
          _vue.title = '机会消息详情'
        }
      })
    },
    forwardList () {
      if (this.routerFrom !== '') {
        this.$router.push({
          path: this.routerFrom
        })
      } else {
        this.$router.push({
          path: '/operation/push/list'
        })
      }
    },
    back () {
      this.forwardList()
    },
    edit () {
      // 编辑新闻
      this.$router.push({
        path: '/operation/push/message/new',
        query: {
          id: this.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";

  .head-wrap {
    margin-bottom: 30px;
  }
  .list-title {
    font-size: 18px;
    margin-bottom: 20px;
  }
  .news-info-wrap {
    .head {
      .title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 15px;
        display: inline-block;
        margin-right: 30px;
      }
    }
    .info {
      margin: 20px 0;

      div.item {
        margin-bottom: 20px;
      }
      img {
        height: 160px;
        min-height: 160px;
        vertical-align: middle;
        margin-left: 20px;
      }
    }
  }
  .operate-action {
    border-bottom: 1px solid #ccc;
    padding-bottom: 30px;
    margin-bottom: 20px;
  }
  .btn-link {
    color: #fff;
  }
  .item-wrap {
    display: flex;
    margin-bottom: 20px;

    .img-wrap {
      margin-right: 100px;
    }
  }
</style>
