<template>
  <div class="demo">
    <div v-show="result != null && result.length > 0">
      <p class="tl-name">{{name}}</p>
      <p class="tl-companyName">{{companyName}}</p>
      <p class="tl-jobTitle">{{jobTitle}}</p>
      <timeline timeline-theme="lightblue" v-for="item in result" v-bind:key="item.timeTag">
        <timeline-title>{{item.timeTag}}</timeline-title>
        <timeline-item bg-color="#9dd8e0" v-for="desc in item.descVos" v-bind:key="desc.id">
          {{desc.product}}
        </timeline-item>
      </timeline>
      <el-button type="primary" :loading="state===2" @click="next" v-if="state!==3">{{state==1?'点击加载下一页':state==2?'加载中':'加载失败，请重试'}}</el-button>
      <span v-if="state===3">加载完毕</span>
    </div>
    <div v-show="result == null || result.length == 0">
      <p class="tl-name">{{name}}</p>
      <p class="tl-companyName">{{companyName}}</p>
      <p class="tl-jobTitle">{{jobTitle}}</p>
      <p class="tl-none">暂无行为信息</p>
    </div>
  </div>
</template>

<script>
import Timeline from '@/components/common/timeline/timeline'
import TimelineItem from '@/components/common/timeline/timelineItem'
import TimelineTitle from '@/components/common/timeline/timelineTitle'

export default {
  components: {
    Timeline,
    TimelineItem,
    TimelineTitle
  },
  data () {
    return {
      result: null,
      name: '加载中。。。。。',
      companyName: '',
      jobTitle: '',
      talentPoolId: this.$route.query.talentPoolId,
      search: {
        account: this.$route.query.account,
        username: this.$route.query.username,
        companyName: this.$route.query.companyName,
        source: this.$route.query.source,
        signature: this.$route.query.signature,
        searchTalentPoolId: this.$route.query.searchTalentPoolId || ''
      },
      pageNum: 1,
      state: 1 // 1具有下一页，2加载中，3加载完毕，4失败
    }
  },
  created () {
    this.fetchDate()
  },
  methods: {
    fetchDate () {
      let _vue = this
      _vue.$http.get('/api/v1.0/crm/logs?talentPoolId=' + _vue.talentPoolId +
        '&account=' + _vue.search.account +
        '&username=' + _vue.search.username +
        '&companyName=' + _vue.search.companyName +
        '&source=' + _vue.search.source +
        '&signature=' + _vue.search.signature +
        '&searchTalentPoolId=' + _vue.search.searchTalentPoolId +
        '&pageNumber=' + _vue.pageNum
      ).then((response) => {
        let res = response.data.data.result
        _vue.name = response.data.data.name
        _vue.companyName = response.data.data.companyName
        _vue.jobTitle = response.data.data.jobTitle
        if (this.pageNum === 1 && res.data) {
          this.result = res.data
        } else if (res.data && res.data.length) {
          for (let i in res.data) {
            let time = res.data[i].timeTag
            if (this.result.find(res => res.timeTag === time)) {
              this.result.forEach((obj) => {
                if (obj.timeTag === time) {
                  obj.descVos = [...obj.descVos, ...res.data[i].descVos]
                }
              })
            } else {
              this.result.push(res.data[i])
            }
          }
        }
        if (res.pageNum === res.pages || res.pageNum > res.pages) {
          this.state = 3
        } else {
          this.state = 1
        }
      }).catch(() => {
        this.pageNum--
        this.state = 4
      })
    },
    next () {
      this.pageNum++
      this.fetchDate()
    }
  }
}
</script>
<style scoped>
  .append {
    font-size: .8em;
    margin-top: 3px;
    color: #646C7C;
  }
  a {
    color: #bf6dcf;
    font-weight: bold;
    text-decoration: none;
  }
  .icon-heart {
    width: 20px;
  }
  .demo {
    display: grid;
    grid-template-columns: repeat(2, 50%);
    grid-gap: 1rem;
  }
  .demo-theme.dark {
    background: #3a3939;
  }
  .tl-name {
    font-size: 33px;
    font-weight: bold;
    line-height: 60px;
  }
  .tl-companyName, .tl-jobTitle {
    font-size: 18px;
    line-height: 25px;
  }
  .tl-none {
    font-size: 20px;
    font-weight: lighter;
    line-height: 40px;
    color: #8c939d;
  }
</style>
