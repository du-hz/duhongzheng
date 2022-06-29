<template>
  <div>
    <el-dialog
      class="templateDetail"
      :title = "title"
      center
      :visible.sync="dialogVisible"
      :before-close="close"
      width="700px"
      top="40px">
      <div class="projectname" v-if="info.type === 1">
        项目名称：{{info.projectData.projectName}}
      </div>
      <el-row class="userinfo" :gutter="40" v-if="info.type === 1 && info.action === 'leaderEvaluate'">
        <el-col :span="7">评价员工：{{info.user_info.name}}</el-col>
        <el-col :span="7">工作年限：{{info.user_info.workingYear}}年</el-col>
        <el-col :span="7">职位：{{info.user_info.post}}</el-col>
      </el-row>
      <el-form :disabled="disabled || (!disabled && isCompleted)" :inline="true" width="100%" class="demo-form-inline" label-width="100%" label-position="left" ref="infoForm" :model="questions" :status-icon="true" :show-message="false" v-if="info.action !== 'averageEvaluate'">
        <div class="section" v-for="(question, index3) in questions.questions" v-bind:key="question.id" v-if="showAll || (!showAll && question.isShow)">
          <div class="content">
            <h1>{{question.name}}</h1>
            <div class="" v-if="question.child_path == 3" v-for="(items, index2) in question.content"  v-bind:key="items.id">
              <h2>{{items.name}}</h2>
              <div class="content" v-for="(item, index) in items.content"  v-bind:key="item.id" v-if="items.child_path == 2">
                <el-form-item :label='index + 1 + ". " + item.name' v-if="item.type == 1" :prop="'questions.'+index3+'.content.'+index2+'.content.'+index+'.value'"
                :rules="[
                  { required: true, message: '请选择内容', trigger: 'change'}
                  ]">
                  <el-radio-group v-model="item.value" v-if="item.choice_type == 1">
                    <el-radio :label="4">精通</el-radio>
                    <el-radio :label="3">熟练</el-radio>
                    <el-radio :label="2">一般</el-radio>
                    <el-radio :label="1">不熟悉</el-radio>
                    <el-radio :label="0">未知</el-radio>
                  </el-radio-group>
                  <el-radio-group v-model="item.value" v-if="item.choice_type == 4">
                    <el-radio :label="item.choice_content.length - index - 1" v-for="(choice_content, index) in item.choice_content" v-bind:key="choice_content.key">{{choice_content}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label='index + 1 + ". " + item.name' v-if="item.type == 2" class="otherDom">
                  <el-input v-model="item.content" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item v-if="item.type == 2 && item.choice_type == 1 && item.content !== '' " class="otherDomChoice"
                :prop="'questions.'+index3+'.content.'+index2+'.content.'+index+'.value'"
                :rules="item.content == '' ? [] : [
                  { required: true, message: '请选择内容', trigger: 'change'}
                  ]">
                  <el-radio-group v-model="item.value">
                    <el-radio :label="4">精通</el-radio>
                    <el-radio :label="3">熟练</el-radio>
                    <el-radio :label="2">一般</el-radio>
                    <el-radio :label="1">不熟悉</el-radio>
                    <el-radio :label="0">未知</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>

              <div class="content nopath" v-if="items.child_path == 1">
                <el-form-item v-if="items.type == 1"
                :prop="'questions.'+index3+'.content.'+index2+'.value'"
                :rules="[
                  { required: true, message: '请选择内容', trigger: 'change'}
                  ]">
                  <el-radio-group v-model="items.value" v-if="items.choice_type == 1">
                    <el-radio :label="4">精通</el-radio>
                    <el-radio :label="3">熟练</el-radio>
                    <el-radio :label="2">一般</el-radio>
                    <el-radio :label="1">不熟悉</el-radio>
                    <el-radio :label="0">未知</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
            <div class="" v-if="question.child_path == 2" v-for="(item, index) in question.content"  v-bind:key="item.id">
              <div class="content">
                <el-form-item :label='index + 1 + ". " + item.name' v-if="item.type == 1"
                :prop="'questions.'+index3+'.content.'+index+'.value'"
                :rules="[
                  { required: true, message: '请选择内容', trigger: 'change'}
                  ]">
                  <el-radio-group v-model="item.value" v-if="item.choice_type == 2">
                    <el-radio :label="4">极强</el-radio>
                    <el-radio :label="3">较强</el-radio>
                    <el-radio :label="2">一般</el-radio>
                    <el-radio :label="1">弱</el-radio>
                    <el-radio :label="0">未知</el-radio>
                  </el-radio-group>
                  <el-radio-group v-model="item.value" v-if="item.choice_type == 1">
                    <el-radio :label="4">非常满意</el-radio>
                    <el-radio :label="3">比较满意</el-radio>
                    <el-radio :label="2">不满意</el-radio>
                    <el-radio :label="1">很不满意</el-radio>
                    <el-radio :label="0">未知</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label='index + 1 + ". " + item.name' v-if="item.type == 2"
                  :prop="'questions.'+index3+'.content.'+index+'.value'"
                  :rules="[
                    { required: true, message: '请选择内容', trigger: 'change'},
                    { max: 500, message: '最多为500个字符', trigger: 'blur' }
                    ]">
                  <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="你可以说说对上个月的工作总结，或提交一些问题意见"
                    width="100%"
                    :show-message = "true"
                    v-model="item.value">
                  </el-input>
                  <div class="errorhint" v-if="item.value.length > 500">长度不能超过500</div>
                </el-form-item>
              </div>
            </div>
            <el-form-item v-if="question.child_path == 1"
              :prop="'questions.'+index3+'.value'"
              :rules="[
                { required: true, message: '请选择内容', trigger: 'change'}
              ]"
              width="100%" class="simpleColumn" style="border-top: 0px;">
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
                <el-radio :label="1">不熟悉</el-radio>
                <el-radio :label="0">未知</el-radio>
              </el-radio-group>
              <el-input
                v-if="question.type == 2"
                type="textarea"
                :rows="3"
                placeholder="你可以说说对上个月的工作总结，或提交一些问题意见"
                width="100%"
                :show-message = "true"
                v-model="question.value">
              </el-input>
            </el-form-item>
          </div>
        </div>
        <el-form-item class="btnArea" align="center" v-if="!disabled && !isCompleted">
          <el-button type="primary" @click="submitForm('infoForm')">立即评分</el-button>
          <el-button @click="close()">取消</el-button>
        </el-form-item>
      </el-form>
      <div class="averageScore" v-if="info.action === 'averageEvaluate'">
        <p class="moduletitle">项目负责人评价</p>
        <p v-if="otherinfo.leaderComment !== ''">{{otherinfo.leaderComment}}</p>
        <p v-else>待项目负责人评价</p>
        <p class="moduletitle">客户负责人评价</p>
        <p v-if="otherinfo.cusComment !== ''">{{otherinfo.cusComment}}</p>
        <p v-else>待客户负责人评价</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  componentName: 'TemplateDetail',
  props: ['info'],
  data () {
    return {
      dialogVisible: false,
      questions: {},
      title: '',
      month: '',
      disabled: true,
      isCompleted: true,
      showAll: true,
      otherinfo: {}
    }
  },
  watch: {
    info: function (val, oldVal) {
      if (val !== oldVal) {
        this.questions = {}
        this.disabled = (val.type !== 1)
        this.title = val.title
        this.getTemplate()
      }
    }
  },
  methods: {
    getTemplate () {
      let _vue = this
      // 用户做测评
      if (_vue.info.type === 1) {
        _vue.$http.get('/api/v1.0/perf/evaluation/' + _vue.info.projectData.id + '/' + _vue.info.user_id + '/' + _vue.info.month + '?type=' + _vue.info.auth_type).then(response => {
          _vue.questions = response.data.data.content
          _vue.isCompleted = response.data.data.isCompleted
          _vue.showAll = response.data.data.showAll
          _vue.otherinfo = response.data.data
        })
      } else { // 查询模板
        _vue.$http.get('/api/v1.0/perf/template/' + _vue.info.templateId).then(response => {
          _vue.questions = response.data.data.content
        })
      }
    },
    submitForm (formName) {
      let _vue = this
      _vue.$refs[formName].validate((valid) => {
        if (valid) {
          _vue.$http.post('/api/v1.0/perf/evaluation/' + _vue.info.projectData.id + '/' + _vue.info.user_id + '/' + _vue.info.month, _vue.questions)
            .then(function () {
              _vue.$message({
                message: '恭喜您，信息提交成功',
                type: 'success'
              })
              _vue.close()
            })
            .catch(function () {
              _vue.$message({
                type: 'error',
                message: '信息提交失败，请稍后重试',
                center: true,
                showClose: true
              })
            })
        } else {
          this.$message({
            type: 'error',
            message: '请检查填写内容'
          })
        }
      })
    },
    close () {
      if (this.info.type === 1 && this.info.action !== 'averageEvaluate') {
        this.$refs['infoForm'].clearValidate()
        this.$emit('refreshbizlines')
      }
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
  @import '../../../assets/css/variable';
  .templateDetail {
    .projectname {
      font-size: 1rem;
      color: #555;
      margin-bottom: 10px;
    }

    p{
      font-size: .9rem;
      text-align: left;
      padding: 2px 15px;
      color: #777;

      &.moduletitle{
        text-align: left;
        padding-left: 15px;
        font-size: 1rem;
        color: #555;
        position: relative;
        line-height:22px;
        padding-top: 23px;
        margin-bottom: 5px;

        &:before{
          content: '';
          height:20px;
          width: 3px;
          background-color: $primary-color;
          display: block;
          position: absolute;
          left:0px;
        }
      }
    }

    .el-dialog__body{
      padding-top: 5px;
    }
    .el-dialog--center .el-dialog__body{
      padding-top: 10px;
    }
    .section{
      margin-bottom: 20px;
      .otherDomChoice{
        border-top-width: 0px;
      }
    }
    .is-error{
      .el-radio{
        color: #ff6565;
      }
    }

    .otherDom{
      .el-input{
        margin-bottom: 10px;
      }
    }

    h1{
      color: #333;
      margin-top: 10px;
      font-size: .9rem;
      margin-bottom: 10px;
    }
    h2{
      color: $primary-color;
      margin-top: 5px;
      margin-bottom: 5px;
    }

    .el-form-item__content{
      width: 100%;
      line-height: 18px;
    }

    .el-form-item{
      border-top: 1px solid #eee;
      margin-bottom: 0px;
      width: 100%;

      &.btnArea{
        border-top-width: 0px;
        margin-top: 30px;
      }
    }
    .nopath .el-form-item{
      padding-top: 5px;
    }
    .el-row {
      margin-bottom: 0px;

      &.userinfo{
        font-size: .95rem;
        color: #555;
        margin-bottom: 20px;
      }
    }
    .el-input.is-disabled .el-input__inner{
      color: #555;
    }

    .el-textarea.is-disabled .el-textarea__inner{
      color: #555;
    }

    .el-radio__input.is-disabled.is-checked .el-radio__inner{
      background-color: $primary-color;
      border-color:  $primary-color;
    }

    .el-radio__input.is-disabled + span.el-radio__label{
      color: #555;
    }
    .el-hint{
      margin-left: 5px;
    }
    .errorhint{
      color: red;
      font-size: .8rem;
      margin-top: 10px;
    }
  }
</style>
