<template>
  <!-- tag方式的数据 -->
  <div class="input-tag-wrap">
    <div class="placeholder" v-if="tagList.length === 0">{{ placeholderText }}</div>
    <div class="tag-list-wrap" v-if="tagList.length > 0">
      <div class="list">
        <div class="item">
          <el-tag
            v-for="(item, index) in tagList"
            :key="index"
            closable
            type="info"
            size="small"
            :disable-transitions="true"
            @close="remove(index)">
            {{item}}
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['placeholder'],
  data () {
    return {
      placeholderText: this.placeholder,
      tagList: [],
      tagIdList: []
    }
  },
  methods: {
    remove (index) {
      // 关闭标签  TODO: 等待parentId参数，处理删除子节点时同时删除父节点
      this.tagList.splice(index, 1)
      this.tagIdList.splice(index, 1)
      this.getTagList()
      this.getTagIdList()
    },
    getTagList () {
      // 获取标签列表
      this.$emit('emitGetTagList', this.tagList)
    },
    getTagIdList () {
      // 获取标签Id列表
      this.$emit('emitGetTagIdList', this.tagIdList)
    }
  }
}
</script>

<style lang="scss" scoped>
.input-tag-wrap {
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  min-height: 38px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 2px 0;
  &:focus {
    border-color: #409eff;
    outline: none;
  }
  .placeholder {
    color: #C0C4CC;
    padding: 4px 10px;
  }
  .el-tag {
    margin: 3px 0 3px 6px;
  }
}
</style>
