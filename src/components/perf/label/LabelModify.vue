<template>
  <div>
    <el-dialog
      title="星级/标签修改"
      :visible.sync="dialogVisible"
      class="labelModify"
      width="500px">
      <el-form class="form" ref="infoForm" label-width="70px" label-position="left">
        <el-row class="personinfo">
          <el-col>
            <span style="font-size: 1.1rem;">{{form.staffname}}</span><span style="margin-left: 10px;">{{form.sexText}}</span>
          </el-col>
          <el-col class="relativeinfo">
            <span>{{form.birthdateText}}</span> <span>|</span> <span>{{form.workingYear}}年</span> <span>|</span> <span>{{form.postname}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="员工星级:" label-width="75px">
            <el-rate v-model="info.star" :allow-half="true" :disabled="isEdit"></el-rate>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="员工标签:" label-width="75px">
            <el-tag
              :key="tag"
              v-for="tag in info.tags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm">
            </el-input>
            <el-button v-else-if="info.tags.length < 10" class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>
          </el-form-item>
          <el-form-item align="right" style="margin-top: 20px;">
            <el-button type="primary" @click="onSubmit('infoForm')">立即修改</el-button>
            <el-button @click="close">取消</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  componentName: 'LabelModify',
  props: ['form', 'info', 'isEdit'],
  data () {
    return {
      dialogVisible: false,
      star: 0,
      dynamicTags: [],
      inputVisible: false,
      inputValue: ''
    }
  },
  methods: {
    onSubmit (formName) {
      var _vue = this
      _vue.$http.put('/api/v1.0/perf/engineer/edit_relation_info/' + _vue.form.adminUserId, {
        type: 1,
        star: _vue.info.star,
        tags: _vue.info.tags.join(',')
      })
        .then(function () {
          _vue.dialogVisible = false
          _vue.form.star = _vue.info.star
          _vue.form.tags = _vue.info.tags.join(',')
          _vue.$message({
            message: '恭喜您，信息提交成功',
            type: 'success'
          })
        })
        .catch(function () {
          _vue.$message({
            type: 'error',
            message: '信息提交失败，请稍后重试',
            center: true,
            showClose: true
          })
        })
    },
    close () {
      this.dialogVisible = false
    },
    handleClose (tag) {
      this.info.tags.splice(this.info.tags.indexOf(tag), 1)
    },

    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.info.tags.push(inputValue)
      }
      this.info.tags = Array.from(new Set(this.info.tags))
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style lang="scss">
  .labelModify{
    .el-dialog__body{
      padding: 20px 20px;
    }

    .el-row{
      margin-bottom: 5px;

      .el-form-item{
        margin-bottom: 0px;
      }

      .el-rate{
        line-height: 50px;
      }

      .el-tag {
        margin-right: 5px;
      }
      .button-new-tag {
        margin-right: 5px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
      }
      .el-tag + button{
        margin-right: 0px;
      }
      .input-new-tag {
        width: 90px;
        margin-right: 5px;
        vertical-align: bottom;
      }
    }

    .personinfo{
      font-size: 1rem;
      line-height: 1.1rem;
      margin-bottom: 15px;

      .relativeinfo{
        margin-top: 20px;
        font-size: 15px;
        color: #777;

        span{
          margin-right: 5px;
        }
      }
    }
  }
</style>
