<template>
  <div>
    <div class="short-link">
      <div class="title">短链接生成</div>
      <div class="link-box">
        <p class="link-title"><span>*</span> 请贴入链接：</p>
          <el-input v-model="link" placeholder="请贴入链接" clearable></el-input><el-button type="primary" @click="createLink">生成短链接</el-button><el-button type="primary" @click="createER">生成二维码</el-button>
      </div>
      <div class="utm">
        <div class="utm-title">是否需要utm参数：
          <el-radio v-model="isUtm" label="1">需要</el-radio>
          <el-radio v-model="isUtm" label="0">不需要</el-radio>
        </div>
        <div class="utm-title" v-show="isUtm === '1'">请输入utm参数：</div>
        <div class="utm-item" v-show="isUtm === '1'">
            <p class="itemTitle">utm_source：<el-input v-model="utmSource" placeholder="请输入utm_source参数" clearable></el-input></p>
            <p class="itemTitle">utm_medium：<el-input v-model="utmMedium" placeholder="请输入utm_medium参数" clearable></el-input></p>
            <p class="itemTitle">utm_campaign：<el-input v-model="utmCampaign" placeholder="请输入utm_campaign参数" clearable></el-input></p>
            <p class="itemTitle">utm_content：<el-input v-model="utmContent" placeholder="请输入utm_content参数" clearable></el-input></p>
            <p class="itemTitle">utm_term：<el-input v-model="utmTerm" placeholder="请输入utm_term参数" clearable></el-input></p>
        </div>
      </div>
      <div class="success-show">
        <div class="s-link" v-show="useLink">
          <p>短链接：<span class="link">{{successLink}}</span></p>
        </div>
        <div class="er" v-show="useER">
          <p>二维码：</p>
          <div class="er-box">
            <img :src="successImg" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const Config = process.env.NODE_ENV === 'production' ? require('./../../../../config/prod.env') : require('./../../../../config/dev.env')
export default {
  data () {
    return {
      isUtm: -1,
      link: '',
      useLink: false,
      useER: false,
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
      utmContent: '',
      utmTerm: '',
      successLink: '',
      successImg: ''
    }
  },
  created () {
    this.link = this.$route.query.link ? this.$route.query.link : ''
  },
  methods: {
    createLink () {
      if (!this.link) {
        this.$message({
          message: '请贴入链接',
          type: 'warning'
        })
        return
      }
      let self = this
      this.useLink = true
      let link = ''
      if (self.isUtm === '1') {
        link = `${this.link}?utm_source=${this.utmSource}&utm_medium=${this.utmMedium}&utm_campaign=${this.utmCampaign}&utm_content=${this.utmContent}&utm_term=${this.utmTerm}`
      } else {
        link = this.link
      }
      console.log(link)
      this.$http.get(`/api/v1.0/common/form/other/short_connection?url=${encodeURIComponent(link)}`).then((res) => {
        console.log('生成短链接')
        console.log(res)
        let data = res.data
        if (data.code === 200) {
          self.successLink = data.data.url
        } else {
          this.$message.error('短链接生成出错，请稍后再试')
        }
      })
    },
    createER () {
      if (!this.link) {
        this.$message({
          message: '请贴入链接',
          type: 'warning'
        })
        return
      }
      let link = ''
      let self = this
      this.useER = true
      if (self.isUtm === '1') {
        link = `${this.link}?utm_source=${this.utmSource}&utm_medium=${this.utmMedium}&utm_campaign=${this.utmCampaign}&utm_content=${this.utmContent}&utm_term=${this.utmTerm}`
        this.successImg = `${Config.SERVER_URL}/api/v1.0/common/form/other/qr_code?url=${encodeURIComponent(link)}`
      } else {
        link = this.link
        this.successImg = `${Config.SERVER_URL}/api/v1.0/common/form/other/qr_code?url=${link}`
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.short-link{
  .title{
    font-size: 18px;
    font-weight: 600;
  }
  .link-box{
    margin-top: 10px;
    .link-title{
      font-size: 16px;
      color: #606266;
      line-height:40px;
      span{
        color: #f56c6c;
      }
    }
    .el-input{
      max-width: 800px;
      margin-right: 20px;
    }
  }
  .utm{
    margin-top: 10px;
    color: #606266;
    .utm-title{
      font-size: 16px;
      margin: 10px 0;
    }
    .utm-item{
      width: 500px;
      height: auto;
      p{
        margin-top: 10px;
        text-align: right;
      }
      .itemTitle{
        font-size: 14px;
        line-height:40px;
        span{
          color: #f56c6c;
        }
      }
      .el-input{
        max-width: 350px;
      }
    }
  }
  .success-show{
    .s-link, .er{
      margin-top: 20px;
      .link{
        text-indent: 1em;
        font-size: 15px;
        font-weight: 600;
        color: #606266;
      }
      .er-box{
        width: 200px;
        height: 200px;
        margin: 10px 20px;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
