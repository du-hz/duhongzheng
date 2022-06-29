<template>
  <div>
    <div class="head-wrap">
      <span class="text-link" @click="back">&lt;&lt; 返回列表</span>
    </div>
    <div class="operate-action">
      <el-button type="primary" size="medium" @click="edit">编辑</el-button>
      <el-button type="primary" size="medium" @click="viewComment">查看评论</el-button>
      <el-button type="primary" size="medium">
        <a class="btn-link" :href="newsMobileUrl + '/news/' + id + '/detail'" target="_blank">移动版预览</a>
      </el-button>
    </div>
    <div class="main-line-title">新闻详情页</div>
    <div class="news-info-wrap">
      <div class="head">
        <span class="title">新闻标题：{{detail.title}}</span>
        <span class="channel">新闻频道ID：{{detail.newsTypeId}}</span>
      </div>
      <div class="info">
        <span>新闻ID：{{detail.id}}</span>
        <span>新闻来源：{{detail.source}}</span>
        <span>新闻作者：{{detail.author}}</span>
        <span>发布时间：{{detail.originReleaseTimeText}}</span>
        <span>创建时间：{{detail.createTimeText}}</span>
        <span>审核时间：{{detail.releaseTimeText}}</span>
      </div>
    </div>
    <div class="news-content-wrap">
      <div class="cnt-title">新闻正文</div>
      <div class="news-cnt" v-html="detail.content"></div>
    </div>
  </div>
</template>

<script>
import Global from 'assets/js/global'
export default {
  data () {
    return {
      id: this.$route.params.id,
      detail: {},
      routerFrom: '',
      newsMobileUrl: Global.CONFIG.NEWS_MOBILE_URL
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
    _vue.fetchNewsDetail(_vue.id)
  },
  methods: {
    fetchNewsDetail (id) {
      let _vue = this
      _vue.$http.get('/api/v1.0/news/content/detail/' + id).then((response) => {
        _vue.detail = response.data.data
        if (_vue.detail.content) {
          _vue.detail.content = _vue.detail.content
        }
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    forwardList () {
      if (this.routerFrom !== '' && this.routerFrom.indexOf('/comment/') === -1) {
        this.$router.push({
          path: this.routerFrom
        })
      } else {
        this.$router.push({
          path: '/news/content/check'
        })
      }
    },
    back () {
      this.forwardList()
    },
    edit () {
      // 编辑新闻
      this.$router.push({
        path: '/news/content/new',
        query: {
          id: this.id
        }
      })
    },
    viewComment () {
      // 查看评论
      this.$router.push({
        name: 'newsComment',
        params: {
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

      span {
        display: inline-block;
        margin-bottom: 10px;
        margin-right: 30px;
      }
    }
  }
  .operate-action {
    border-bottom: 1px solid #ccc;
    padding-bottom: 30px;
    margin-bottom: 20px;
  }
  .news-content-wrap {
    width: 800px;
    border-top: 1px solid #ccc;
    padding-top: 20px;

    .cnt-title {
      font-size: 20px;
      text-align: center;
      margin-bottom: 40px;
    }
  }
  .btn-link {
    color: #fff;
  }
</style>
