<template>
  <div class="table-list-wrap">
    <div class="list-search-wrap">
      <el-select v-model="selectChannel" placeholder="请选择渠道">
        <el-option label="全部渠道" value=""></el-option>
        <el-option label="PC" value="1"></el-option>
        <el-option label="APP" value="2"></el-option>
        <el-option label="移动站" value="3"></el-option>
      </el-select>
      <el-select v-model="selectPos" placeholder="请选择位置">
        <el-option label="全部位置" value=""></el-option>
      </el-select>
      <el-button type="primary">添加</el-button>
      <el-button type="primary">删除</el-button>
    </div>
    <!-- 列表 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      header-row-class-name="tableheader"
      border
      style="width: 100%;"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="广告ID"
        width="50"
        align="center">
      </el-table-column>
      <el-table-column
        label="广告名称"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        label="渠道"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        label="位置"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        label="封面图"
        width="250"
        align="center">
      </el-table-column>
      <el-table-column
        label="更新时间"
        width="250"
        align="center">
      </el-table-column>
      <el-table-column
        label="状态"
        width="250"
        align="center">
      </el-table-column>
      <el-table-column
        label="点击数"
        width="250"
        align="center">
      </el-table-column>
      <el-table-column
        label="跳转地址"
        width="250"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center">
        <template slot-scope="scope">
          <span class="text-link" @click="edit(scope.row)">编辑</span>
          <span class="text-link" @click="delete(scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pager-wrap">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="totalNum"
        :page-size="pager.size"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
const posOpts = [
  { label: '主页头部广告位', value: 1, channel: 3 },
  { label: '详情页浮层广告位', value: 2, channel: 3 },
  { label: 'App下载页广告位', value: 3, channel: 3 }
]
export default {
  data () {
    return {
      tableData: [],
      selectChannel: '',
      posOpts: [],
      selectPos: '',
      multipleSelection: [],
      pager: {
        page: 1,
        size: 10
      },
      totalNum: ''
    }
  },
  created () {
    console.log(posOpts)
  },
  methods: {
    handleSelectionChange (val) {
      // 选择checkbox
      this.multipleSelection = val
    },
    handleCurrentChange () {
      // 分页
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";
</style>
