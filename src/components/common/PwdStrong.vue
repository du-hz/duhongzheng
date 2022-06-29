<template>
  <div class="pwd-strong-container">
    <el-row class="pwd-strong-wrap">
      <el-col :span="8" class="item" :class="{ 'weak': num === 1, 'normal': num === 2, 'strong': num >= 3 }">弱</el-col>
      <el-col :span="8" class="item" :class="{ 'normal': num === 2, 'strong': num >= 3 }">中等</el-col>
      <el-col :span="8" class="item" :class="{ 'strong': num >= 3 }">强</el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ['level'],
  computed: {
    num: function () {
      return parseInt(this.level)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~assets/css/variable';

  .pwd-strong-container {
    width: 150px;
    display: inline-block;
  }
  .pwd-strong-wrap {

    .item {
      background-color: #C0C4CC;
      color: #f1f1f1;
      border-right: 1px solid #fff;
      height: 16px;
      line-height: 16px;
      font-size: 12px;
      text-align: center;

      &.weak {
        background-color: #F56C6C;
        color: #fff;
      }
      &.normal {
        background-color: #E6A23C;
        color: #fff;

        &:nth-child(1) {
          color: transparent;
        }
      }
      &.strong {
        background-color: #67C23A;
        color: #fff;

        &:nth-child(1),
        &:nth-child(2) {
          color: transparent;
        }
      }
    }
  }
</style>
