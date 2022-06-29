<template>
  <div class="main">
    <div class="scroll-box">
      <div class="title">设置</div>
      <el-form ref="form" :model="setData" label-width="auto">
        <el-form-item label="表单到期时间">
          <el-date-picker
            v-model="setData.expirationTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="版本号">
          <el-input v-model="setData.versionNumber"></el-input>
        </el-form-item>
        <el-form-item label="发送邮箱，最多5个，多个逗号分割">
          <el-input v-model="setData.toEmails"></el-input>
        </el-form-item>
        <el-form-item label="抄送邮箱，最多5个，多个逗号分割">
          <el-input v-model="setData.ccEmails"></el-input>
        </el-form-item>
        <el-form-item label="邮箱触发时间，多个逗号分割">
          <el-select v-model="setData.emailTrigger" multiple placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否允许表单多次提交">
            <el-radio v-model="setData.isRepeatSubmit" label="0">不可多次提交</el-radio>
            <el-radio v-model="setData.isRepeatSubmit" label="1">可多次提交</el-radio>
        </el-form-item>
        <el-form-item label="是否允许更新用户信息">
            <el-radio v-model="setData.isUpdateUserInfo" label="1">允许</el-radio>
            <el-radio v-model="setData.isUpdateUserInfo" label="0">不允许</el-radio>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="setUpData">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      setData: {
        expirationTime: '',
        toEmails: '',
        emailTrigger: '',
        isRepeatSubmit: '0',
        isUpdateUserInfo: '1',
        versionNumber: ''
      },
      options: [{
        value: '1',
        label: '用户每次提交发送'
      }, {
        value: '2',
        label: '有效期内每天发送一次'
      }, {
        value: '3',
        label: '有效期结束发送'
      }]
    }
  },
  methods: {
    setUpData () {
      console.log('this.setData')
      console.log(this.setData)
      this.$emit('getSetData', this.setData)
    }
  }
}
</script>
<style lang="scss" scoped>
.main{
  width: calc(70% - 60px);
  height: calc(90% - 60px);
  background-color: #fff;
  margin-left: 15%;
  margin-top: 30px;
  padding: 30px;
  overflow: hidden;
  .scroll-box{
    width: 100%;
    height: 100%;
    overflow: auto;
    .title{
      font-size: 18px;
      font-weight: 600;
      color: #16263D;
      margin-bottom: 10px;
    }
  }
}
</style>
