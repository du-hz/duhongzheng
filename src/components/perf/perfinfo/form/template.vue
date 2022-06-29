<template>
  <div>
    <el-dialog
      class="perftemplate"
      :title='date + "绩效详情自评"'
      :visible.sync="dialogVisible"
      center
      top = '5px'
      width="620px">
      <div class="projectname">
        项目名称：{{projectName}}
      </div>
      <el-form :inline="true" width="100%" class="demo-form-inline" label-width="150px" label-position="left">
        <div class="section" v-for="question in questions" v-bind:key="question.id">
          <div class="content">
            <h1>{{question.name}}</h1>
            <div class="" v-if="question.child_path == 3" v-for="items in question.content"  v-bind:key="items.id">
              <h2>{{items.name}}</h2>
              <div class="content" v-for="(item, index) in items.content"  v-bind:key="item.id" v-if="items.child_path == 2">
                <el-form-item :label='index + 1 + ". " + item.name' v-if="item.type == 1">
                  <el-radio-group v-model="item.value" v-if="item.choice_type == 1">
                    <el-radio :label="4">精通</el-radio>
                    <el-radio :label="3">熟练</el-radio>
                    <el-radio :label="2">一般</el-radio>
                    <el-radio :label="1">不了解</el-radio>
                    <el-radio :label="0">未知</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label='index + 1 + ". " + item.name' v-if="item.type == 2">
                  <el-input v-model="item.content" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item v-if="item.type == 2 && item.choice_type == 1 && item.content != ''">
                  <el-radio-group v-model="item.value">
                    <el-radio :label="4">精通</el-radio>
                    <el-radio :label="3">熟练</el-radio>
                    <el-radio :label="2">一般</el-radio>
                    <el-radio :label="1">不了解</el-radio>
                    <el-radio :label="0">未知</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>

              <div class="content" v-if="items.child_path == 1">
                <el-form-item v-if="items.type == 1">
                  <el-radio-group v-model="items.value" v-if="items.choice_type == 1">
                    <el-radio :label="4">精通</el-radio>
                    <el-radio :label="3">熟练</el-radio>
                    <el-radio :label="2">一般</el-radio>
                    <el-radio :label="1">不了解</el-radio>
                    <el-radio :label="0">未知</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
            <div class="" v-if="question.child_path == 2" v-for="(item, index) in question.content"  v-bind:key="item.id">
              <div class="content">
                <el-form-item :label='index + 1 + ". " + item.name' v-if="item.type == 1">
                  <el-radio-group v-model="item.value" v-if="item.choice_type == 2">
                    <el-radio :label="4">极强</el-radio>
                    <el-radio :label="3">较强</el-radio>
                    <el-radio :label="2">一般</el-radio>
                    <el-radio :label="1">弱</el-radio>
                    <el-radio :label="0">未知</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
            <el-form-item v-if="question.child_path == 1" width="100%" class="simpleColumn" style="border-top: 0px;">
              <el-radio-group v-model="question.value" v-if="question.type == 1 && question.choice_type == 1">
                <el-radio :label="4">非常满意</el-radio>
                <el-radio :label="3">比较满意</el-radio>
                <el-radio :label="2">不满意</el-radio>
                <el-radio :label="1">很不满意</el-radio>
                <el-radio :label="0">未知</el-radio>
              </el-radio-group>
              <el-radio-group v-model="question.value" v-if="question.type == 1 && question.choice_type == 2">
                <el-radio :label="4">极强</el-radio>
                <el-radio :label="3">较强</el-radio>
                <el-radio :label="2">一般</el-radio>
                <el-radio :label="1">弱</el-radio>
                <el-radio :label="0">未知</el-radio>
              </el-radio-group>
              <el-radio-group v-model="question.value" v-if="question.type == 1 && question.choice_type == 3">
                <el-radio :label="4">精通</el-radio>
                <el-radio :label="3">熟练</el-radio>
                <el-radio :label="2">一般</el-radio>
                <el-radio :label="1">不了解</el-radio>
                <el-radio :label="0">未知</el-radio>
              </el-radio-group>
              <el-input
                v-if="question.type == 2"
                type="textarea"
                :rows="3"
                placeholder="你可以说说对上个月的工作总结，或提交一些问题意见"
                width="100%"
                v-model="question.value">
              </el-input>
            </el-form-item>
          </div>
        </div>
        <el-form-item>
          <el-button type="primary" @click="save()">立即评分</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  componentName: 'Template',
  props: ['projectName'],
  data () {
    return {
      date: '2017.01',
      dialogVisible: false,
      questions: []
    }
  },
  created () {
    this.getTemplate()
  },
  methods: {
    getTemplate () {
      let _vue = this
      _vue.$http.get('/api/v1.0/perf/evaluation/template/3').then(response => {
        _vue.questions = response.data.data.questions
      })
    },
    onSubmit () {
      console.log('submit!')
    },
    close () {
      this.dialogVisible = false
    },
    save () {
      console.log('12')
    }
  }
}
</script>

<style lang='scss'>
@import '../../../../assets/css/common.scss';

.perftemplate {
  & .el-radio + .el-radio {
    width: 56px;
  }
  .projectname {
    font-size: 1rem;
    color: #555;
  }
  .el-dialog--center .el-dialog__body{
    padding-top: 10px;
  }
  .section{
    margin-bottom: 20px;
  }
  h1{
    color: #333;
    margin-top: 10px;
    font-size: 1rem;
    margin-bottom: 10px;
  }
  h2{
    color: $primary-color;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .section .el-form-item{
    border-top: 1px solid #eee;
    margin-bottom: 0px;
    width: 100%;

    &.simpleColumn{
      .el-form-item__content{
        width: 100%;
      }

      & .el-radio + .el-radio {
        width: 82px;
      }
    }
  }
  .el-row {
    margin-bottom: 0px;
  }
  .el-input.is-disabled .el-input__inner{
    color: #777;
  }
  .el-hint{
    margin-left: 5px;
  }
}
</style>
