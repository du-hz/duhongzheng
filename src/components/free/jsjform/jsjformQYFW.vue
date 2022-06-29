<template>
  <div class="table-list-wrap">
    <p>{{newsList.formType | formTypeFilter}}</p>
    <div class="content-box" v-for="(item, index) in dataList" :key="index" v-show="item !== 'formType'">
      <div class="title">{{item | nameKeyFilter}}</div>
      <div class="content" v-if="typeof newsList[item] === 'object'">
        <div v-for="(i, index) in Object.keys(newsList[item])" :key="index">
          <!-- <div class="">{{newsList[item][i] | nameKeyFilter}}</div> -->
          <div class="" v-if="item === 'investInfo'">{{i | nameKeyFilter}} : {{newsList[item][i] || '无'}}</div>
          <div class="" v-if="item === 'financeInfo'">{{i | financeInfo}} : {{newsList[item][i] || '无'}}</div>
        </div>
      </div>
      <div class="content" v-else>{{newsList[item] || '无'}}</div>
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
    financeInfo (val) {
      if (val === 'phase') {
        return '项目阶段'
      }
      if (val === 'mainIndustry') {
        return '产业类型'
      }
      if (val === 'otherMainIndustry') {
        return '其他'
      }
      if (val === 'amount') {
        return '注册资金'
      }
      if (val === 'registerDate') {
        return '注册时间'
      }
      if (val === 'ratio') {
        return '融资额度及出让比例'
      }
      if (val === 'contact') {
        return '紧急联系方式'
      }
    },
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
      // 企业服务
      if (val === 'incubationType') {
        return '所需服务'
      }
      if (val === 'itType') {
        return 'IT服务'
      }
      if (val === 'cloudType') {
        return 'IT服务类型/架构类型'
      }
      if (val === 'intellectualType') {
        return '知识产权业务服务类型'
      }
      if (val === 'intellectualType1Value') {
        return '国内外专利服务类型'
      }
      if (val === 'intellectualType2Value') {
        return '商标业务服务类型'
      }
      if (val === 'intellectualType3Value') {
        return '专利运营服务类型'
      }
      if (val === 'intellectualType4Value') {
        return '知识产权项目服务类型'
      }
      if (val === 'investType') {
        return '投融资服务类型'
      }
      if (val === 'investInfo') {
        return '投资表单'
      }
      if (val === 'financeInfo') {
        return '融资表单'
      }
      if (val === 'mainIndustry') {
        return '半导体主投产业'
      }
      if (val === 'otherMainIndustry') {
        return '其他'
      }
      if (val === 'phase') {
        return '主投阶段'
      }
      if (val === 'otherService') {
        return '其他服务'
      }
      if (val === 'amount') {
        return '单项投资额'
      }
      if (val === 'application') {
        return '主投应用领域'
      }
      if (val === 'registerPlace') {
        return '注册地'
      }
      if (val === 'source') {
        return '资金主要来源'
      }
      if (val === 'special') {
        return '特别投资需求通道'
      }
      if (val === 'total') {
        return '可投资金总量'
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
            console.log(item)
            console.log(data[item])
            let objKey = Object.keys(data[item])
            console.log('objKey------------')
            console.log(objKey)
            objKey.map(items => {
              if (typeof data[item][items] === 'object') {
                self.newsList[item][items] = data[item][items].join(',')
              }
            })
            // self.newsList[item] = data[item].join(',')
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
