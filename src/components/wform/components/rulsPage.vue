<template>
  <div class="main">
    <div class="scroll-box">
      <div class="title">规则</div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="tabs">
          <el-tab-pane label="字段规则" name="first">
            <p>
              你可以为选择字段（单项选择、多项选择、图片单选、图片多选、评分、下拉框和多级下拉框）设定一些规则：在填写者选择某选项后，触发显示位于该字段之后的其他字段。
            </p>
            <div class="addNewRule">添加新规则</div>
          </el-tab-pane>
          <el-tab-pane label="跳转规则" name="second">
            <p>
              你可以为选择字段（单项选择、图片单选、下拉框和多级下拉框）设定一些跳转规则：当填写者选择某选项并提交后，跳转到指定网址。
            </p>
            <div class="addNewRule">添加新规则</div>
          </el-tab-pane>
        </el-tabs>
      <div class="btn">
        <el-button type="primary" @click="setRuleData">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      setData: [],
      activeName: 'first'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    setRuleData () {
      this.$emit('getRuleData', this.setData)
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
    position: relative;
    .title{
      font-size: 18px;
      font-weight: 600;
      color: #16263D;
      margin-bottom: 10px;
    }
    .btn{
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
    .tabs{
      .addNewRule{
        width: 130px;
        height: 40px;
        line-height: 40px;
        border: 1px solid #F8F8F8;
        font-size: #409eff;
      }
    }
  }
}
</style>
