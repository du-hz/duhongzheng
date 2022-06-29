<template>
  <div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <div class="dialog-cnt">
        <span>{{tipCnt}}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 后台统一的出错提示，抽出组件
export default {
  props: ['showDialog', 'text'],
  computed: {
    tipCnt () {
      // 可传入显示文本
      return this.text || '请联系后台管理员：sandyzhang@moore.ren'
    },
    dialogVisible () {
      return this.showDialog || true
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";
</style>
