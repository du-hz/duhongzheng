<template>
  <div class="table-list-wrap">
    <div class="list-title">待审核IP（{{totalNum}}）</div>
    <!-- 列表 -->
    <el-table
      :data="tableData"
      header-row-class-name="tableheader"
      border
      style="width: 100%;">
      <el-table-column
        type="index"
        width="50"
        align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="供应商"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        prop="levelOneType"
        width="300"
        label="一级分类"
        align="center">
      </el-table-column>
      <el-table-column
        prop="levelTwoType"
        label="二级分类"
        width="300"
        align="center">
      </el-table-column>
      <el-table-column
        prop="model"
        label="型号"
        width="300"
        align="center">
      </el-table-column>
      <el-table-column
        prop="shortDesc"
        label="描述"
        width="300"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="120"
        align="center">
        <template slot-scope="scope">
          <span class="text-link" @click="checkIp(scope)">审核</span>
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
export default {
  data () {
    return {
      pager: {
        size: 10,
        page: 1
      },
      totalNum: 1,
      tableData: []
    }
  },
  created () {
    this.fetchAuditIp()
  },
  methods: {
    fetchAuditIp () {
      // 获取待审核IP列表
      let _vue = this
      _vue.$http.get('/api/v1.0/ip/uncheck?page=' + _vue.pager.page + '&size=' + _vue.pager.size).then((response) => {
        _vue.tableData = response.data.data.rows
        _vue.totalNum = response.data.data.total
      })
    },
    handleCurrentChange (val) {
      // 下一页
      let _vue = this
      _vue.pager.page = val
      _vue.fetchAuditIp()
    },
    checkIp (scope) {
      // 审核IP
      this.$router.push({
        name: 'ipAuditDetail',
        params: {
          id: scope.row.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";

  .list-title {
    font-size: 18px;
    margin-bottom: 20px;
  }
</style>
