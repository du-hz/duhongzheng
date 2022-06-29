<template>
  <div class="page-footer">
    <div class="inner">Copyright©2020 摩尔精英网络科技南京有限公司</div>
  </div>
</template>

<script>
export default {
  componentName: 'CommonFooter'
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";

  .page-footer {
    background-color: $bg-color;
    height: 50px;
    line-height: 50px;

    .inner {
      width: 98%;
      text-align: center;
      margin: 0 auto;
    }
  }
</style>
