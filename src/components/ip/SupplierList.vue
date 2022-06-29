<template>
  <div class="table-list-wrap">
    <div class="list-title">供应商（{{totalNum}}）</div>
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
        min-width="300"
        align="center">
      </el-table-column>
      <el-table-column
        prop="ipCount"
        label="IP数量"
        width="140"
        align="center">
      </el-table-column>
      <el-table-column
        prop="bindAccount"
        label="账号绑定数"
        width="140"
        align="center">
      </el-table-column>
      <el-table-column
        prop="contant"
        label="联系人"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="联系方式"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        label="在线状态"
        width="100"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isOffline === 0">在线</span>
          <span v-if="scope.row.isOffline === 1">已下线</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center">
        <template slot-scope="scope">
          <span class="text-link" @click="viewDetail(scope.row)">查看</span>
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
    this.fetchList()
  },
  methods: {
    fetchList () {
      // 获取待审核IP列表
      let _vue = this
      _vue.$http.get('/api/v1.0/ip/supplier/list?page=' + _vue.pager.page + '&size=' + _vue.pager.size).then((response) => {
        _vue.tableData = response.data.data.rows
        _vue.totalNum = response.data.data.total
      })
    },
    handleCurrentChange (val) {
      // 下一页
      let _vue = this
      _vue.pager.page = val
      _vue.fetchList()
    },
    viewDetail (row) {
      // 查看详情
      this.$router.push({
        name: 'ipSupplierDetail',
        params: {
          id: row.id
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
