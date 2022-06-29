<template>
  <div class="tag-dialog" style="position: relative;z-index:9999999">
    <el-dialog
      title="请选择标签"
      :visible.sync="show"
      width="40%">
      <div class="tree-wrap">
        <el-tree
          :data="labelData"
          show-checkbox
          ref="tree"
          node-key="id"
          :props="defaultLabelProps">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="getCheckedVal">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      type: 0,
      labelData: [],
      defaultLabelProps: {
        children: 'childTag',
        label: 'name'
      },
      show: false,
      hasChange: false,
      max: 0
    }
  },
  methods: {
    fetchAllLabel () {
      // 获取所有标签  TODO：需要返回parentId 删除tag时需要用到
      this.$http.get('/api/v1.0/fa/tag/findAllTag?parentId=' + this.type).then(res => {
        this.labelData = res.data.data[0].childTag
      })
    },
    fetchSenLabel (str) {
      // 获取二级标签  TODO：需要返回parentId 删除tag时需要用到
      this.$http.get('/api/v1.0/fa/tag/findAllTagByParentId?parentIds=' + str).then(res => {
        this.labelData = res.data.data
      })
    },
    getCheckedVal () {
      // 获取选中的值
      let val = this.$refs.tree.getCheckedNodes()
      if (this.max > 0 && val.length > this.max) {
        this.$message({
          message: '最多选择' + this.max + '个标签',
          type: 'warning',
          center: true
        })
        return
      }
      this.$emit('emitGetValue', val)
      this.show = false
      this.hasChange = true
    },
    setCheckedVal (val) {
      console.log('val', val)
      this.$refs.tree.setCheckedKeys(val)
    },
    cancel () {
      this.show = false
      this.hasChange = false
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-wrap {
  height: 300px;
  overflow: auto;
}
.dialog-footer {
  text-align: center;
}
</style>
