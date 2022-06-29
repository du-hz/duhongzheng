<template>
  <div class="table-list-wrap">
    <div class="list-search-wrap">
    <div class="top-block">
      <div class="back-action" @click="backPage">
        <i class="el-icon-arrow-left"></i>
        <span class="text">返回列表</span>
      </div>
    </div>
    </div>
    <el-table
      :data="tableData"
      header-row-class-name="tableheader"
      style="width: 100%"
      border>
      <el-table-column
        label="id"
        prop="id"
        width="auto"
        align="center">
      </el-table-column>
      <el-table-column
        v-for="(i, n) in details" :key="n"
        :label="details.key"
        width="auto"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.visitorId || '暂无'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop='openId'
        label="微信OpenId"
        width="auto"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.openId || '暂无'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="submitUserId"
        label="用户ID"
        width="auto"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.submitUserId || '暂无'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="访客ID"
        width="auto"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.visitorId || '暂无'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户提交内容"
        width="auto"
        align="center">
        <template slot-scope="scope">
          <p @click="showDetails(scope.row)" style="cursor: pointer;color: #409eff;">点击查看</p>
        </template>
      </el-table-column>
      <el-table-column
        label="提交时间"
        width="auto"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pager-wrap">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="totalNum"
        :page-size="pager.pageSize"
        :current-page="pager.currentPage"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-dialog title="用户提交内容" :visible.sync="dialogTableVisible">
      <el-form ref="form" :model="dialogData" label-width="100px" label-position="right">
        <el-form-item v-for="(item, index) in dialogData" :key="index" :label="item.value+':'">
          {{detailFilters(item.keyName)}}
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      id: '',
      currentPage: 1,
      pager: {
        pageSize: 10,
        currentPage: 1
      },
      totalNum: 0,
      tableData: [],
      dialogTableVisible: false,
      dialogData: [],
      detailObj: {}
    }
  },
  created () {
    this.id = this.$route.query.id ? this.$route.query.id : ''
    this.currentPage = this.$route.query.currentPage ? this.$route.query.currentPage : ''
    this.dialogTableVisible = false
    this.getFormList()
  },
  methods: {
    backPage () {
      // this.$router.go(-1)
      this.$router.push({path: '/news/cf', query: {currentPage: this.currentPage, ran: Math.floor(Math.random() * 1000000)}})
    },
    getFormList () {
      let self = this
      let params = {
        page: this.pager.currentPage,
        per_page: this.pager.pageSize
      }
      this.$http.get(`/api/v1.0/common/form/${self.id}/result`, params).then((res) => {
        let data = res.data.data
        console.log(data)
        this.totalNum = data.total
        self.tableData = data.submitLogs
        let dialogData = {}
        data.titles.details.map((i, n) => {
          dialogData[n] = i
          return i
        })
        self.dialogData = dialogData
      })
    },
    handleCurrentChange (val) {
      this.tableData = []
      this.pager.currentPage = val
      this.getFormList()
    },
    showDetails (obj) {
      console.log(obj)
    },
    detailFilters (val) {
      return this.detailObj[val]
    }
  }
}
</script>

<style lang="scss" scoped>
  .link {
    color: #409eff;
    text-decoration: underline;
    padding-right: 15px;
    cursor: pointer;
    &:last-child {
      padding-right: 0;
    }
  }
  .link-text {
    padding-right: 15px;
  }
  .top-block {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 30px;
    .back-action{
      cursor: pointer;
    }
  }
</style>
