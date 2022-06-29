<template>
  <div>
    <div class="templateList">
      <el-row>
        <el-col :span="18" size="medium"><h1 class="title">绩效模板</h1></el-col>
      </el-row>
      <el-row>
        <el-col :span="6" size="medium" v-for="template in templateList" v-bind:key="template.id">
          <div class="templateName" @click="view(template)">{{template.name}}</div>
        </el-col>
      </el-row>
      <TemplateDetail ref="dialogVisible" v-bind:info="info"></TemplateDetail>
    </div>
  </div>
</template>

<script>
import TemplateDetail from '@/components/perf/template/TemplateDetail'
export default{
  components: {
    TemplateDetail
  },
  data () {
    return {
      templateList: [],
      info: {}
    }
  },
  created () {
    document.title = '绩效模板'
    this.getTemplateList()
  },
  methods: {
    getTemplateList () {
      let _vue = this
      _vue.$http.get('/api/v1.0/perf/evaluation/template').then(response => {
        _vue.templateList = response.data.data.templates
      })
    },
    view (item) {
      let _vue = this
      _vue.info = {
        'type': 2,
        'templateId': item.templateId,
        'title': item.name + '绩效模板'
      }
      _vue.$refs.dialogVisible.dialogVisible = true
    }
  }
}
</script>
<style lang="scss">
  @import '../../../assets/css/variable';
  .templateList{
    .el-row {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }

      .title{
        font-size: 20px;
        line-height: 36px;
      }

      .templateName{
        width: 220px;
        height: 220px;
        border: 1px solid #ccc;
        background-color: #f2f2f2;
        font-size: 1.3rem;
        text-align: center;
        line-height: 220px;
        margin: 0px auto;
        cursor: pointer;
        margin-bottom: 20px;
      }
    }
    table .tableheader th{
      background-color: $primary-color;
      color: #fff;
      padding: 4px 0px;
      font-size: .9rem;
    }
  }
</style>
