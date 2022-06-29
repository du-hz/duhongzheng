<template>
  <div class="table-list-wrap">
    <p>{{newsList.formType | formTypeFilter}}</p>
    <div class="content-box" v-for="(item, index) in dataList" :key="index" v-show="item !== 'formType'">
      <div class="title">{{item | nameKeyFilter}}</div>
      <div class="content">{{newsList[item] || '无'}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      id: '',
      dataList: [],
      newsList: {}
    }
  },
  created () {
    this.id = this.$route.query.id
    this.getData()
  },
  filters: {
    formTypeFilter (val) {
      if (val === 1) {
        return '芯片设计服务'
      }
      if (val === 2) {
        return '供应链运营服务'
      }
      if (val === 3) {
        return '人才服务'
      }
      if (val === 4) {
        return '企业服务'
      }
    },
    nameKeyFilter (val) {
      // 公共
      if (val === 'cityCode') {
        return '城市编号'
      }
      if (val === 'cityName') {
        return '城市'
      }
      if (val === 'companyName') {
        return '公司名称'
      }
      if (val === 'name') {
        return '名称'
      }
      if (val === 'phone') {
        return '电话'
      }
      if (val === 'position') {
        return '职位'
      }
      if (val === 'tapeOutWafer') {
        return '晶圆厂'
      }
      // 人才
      if (val === 'talentType') {
        return '所需服务'
      }
      if (val === 'recruitType') {
        return '招聘服务类型'
      }
      if (val === 'trainType') {
        return '半导体培训服务类型'
      }
      if (val === 'trainType1Value') {
        return '高校合作服务'
      }
      if (val === 'trainType2Value') {
        return '企业合作服务'
      }
      if (val === 'trainType3Value') {
        return '个人培训服务'
      }
      if (val === 'mediaType') {
        return '媒体服务类型'
      }
    }
  },
  methods: {
    getData () {
      let self = this
      this.$http.get('/api/v1.0/extra/sfa/businessform?id=' + self.id).then((res) => {
        console.log('返回的数据')
        console.log(res.data)
        let data = res.data.data.form
        self.newsList = data
        console.log(data)
        let nameKey = Object.keys(data)
        console.log(nameKey)
        nameKey.map((item) => {
          if (typeof data[item] === 'object') {
            console.log(data[item])
            self.newsList[item] = data[item].join(',')
          }
          return item
        })
        self.dataList = nameKey
        console.log(self.newsList)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "~assets/css/variable";
  .table-list-wrap{
    padding: 20px 0;
    p{
      font-size: 20px;
      line-height: 50px;
      font-weight: 600;
    }
    .content-box{
      padding: 10px 0;
      text-indent: 0.5em;
      .title{
        font-size: 16px;
        line-height: 40px;
        font-weight: 600;
      }
      .content{
        font-size: 14px;
        line-height: 30px;
        color: #666;
        border-bottom: 1px solid #eee;
      }
    }
  }
</style>
