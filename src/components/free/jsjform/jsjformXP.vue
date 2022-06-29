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
      if (val === 'applicationType') {
        return '应用领域'
      }
      if (val === 'cityCode') {
        return '城市编号'
      }
      if (val === 'cityName') {
        return '城市'
      }
      if (val === 'companyName') {
        return '公司名称'
      }
      if (val === 'describe') {
        return '芯片设计需求描述'
      }
      if (val === 'designType') {
        return '芯片设计服务形式'
      }
      if (val === 'humanType') {
        return '人力外包芯片设计服务类型'
      }
      if (val === 'name') {
        return '名称'
      }
      if (val === 'needTime') {
        return '项目预计持续周期'
      }
      if (val === 'packageType') {
        return '项目整包芯片设计服务类型'
      }
      if (val === 'phone') {
        return '电话'
      }
      if (val === 'position') {
        return '职位'
      }
      if (val === 'productType') {
        return '产品类型'
      }
      if (val === 'startTime') {
        return '开始时间'
      }
      if (val === 'tapeOutWafer') {
        return '晶圆厂'
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
        nameKey.map((item) => {
          if (typeof data[item] === 'object') {
            console.log(item)
            console.log(data[item])
            let objKey = Object.keys(data[item])
            console.log('objKey------------')
            console.log(objKey)
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
