<template>
  <div class="table-list-wrap">
    <div class="list-search-wrap">
      <el-form :inline="true" class="form-inline" label-width="70px">
        <el-form-item style="margin-left: 20px;">
          <el-input v-model="title" clearable placeholder="输入表单标题" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 20px;">
              <el-date-picker
                v-model="datetime"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
        </el-form-item>
        <el-button type="primary" @click="searchData">搜索</el-button>
        <el-button type="primary" @click="addForm">新建表单</el-button>
      </el-form>
    </div>
    <!-- <div class="top-block">
      <el-button type="primary" @click="addForm">新建表单</el-button>
    </div> -->
    <!-- 列表 -->
    <el-table
      :data="tableData"
      header-row-class-name="tableheader"
      style="width: 100%"
      border>
      <el-table-column
        label="id"
        prop="id"
        width="100"
        align="center">
      </el-table-column>
      <el-table-column
        prop='title'
        label="表单标题"
        width="auto"
        align="center">
        <template slot-scope="scope">
          <router-link class="link" :to="`/news/cf/form?uuid=${scope.row.uuid}&currentPage=${pager.currentPage}`">{{ scope.row.title }}</router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="shareUrl"
        label="表单链接"
        width="auto"
        align="center">
        <template slot-scope="scope">
          <span v-html="scope.row.shareUrl"></span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="表单到期时间"
        width="auto"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.expirationTime || '暂无'}}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="表单标签"
        width="auto"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tags | tagsFilters}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="版本号"
        width="auto"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.versionNumber }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        label="是否允许表单多次提交"
        width="auto"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.isRepeatSubmit | isRepeatFilters}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否允许更新用户信息"
        width="auto"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.isUpdateUserInfo | isUpdateFilters}}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="用户提交数量"
        width="150"
        align="center">
        <template slot-scope="scope">
          <router-link class="link" :to="`/news/cf/form/${scope.row.uuid}/entries?uuid=${scope.row.uuid}&currentPage=${pager.currentPage}`">{{ scope.row.userSubmitNumber }}</router-link>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="auto"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="auto"
          align="center">
          <template slot-scope="scope">
            <!-- 根据当前状态区分操作 -->
            <el-button @click="createLink(scope.row)" type="text">生成短链接/二维码</el-button>
            <!-- <el-button @click="editForm(scope.row)" type="text">编辑</el-button> -->
            <el-button @click="delForm(scope.row, scope.$index)" type="text">删除</el-button>
            <el-button @click="exportForm(scope.row)" type="text">导出</el-button>
          </template>
        </el-table-column>
    </el-table>
    <div class="pager-wrap" v-if="showPagination">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="totalNum"
        :page-size="pager.pageSize"
        :current-page.sync="pager.currentPage"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
const Config = process.env.NODE_ENV === 'production' ? require('./../../../config/prod.env') : require('./../../../config/dev.env')
export default {
  data () {
    return {
      title: '',
      datetime: [],
      searchTitle: '',
      pager: {
        pageSize: 10,
        currentPage: 1
      },
      totalNum: 0,
      tableData: [],
      showPagination: false
    }
  },
  created () {
    if (this.$route.query.currentPage) {
      this.pager.currentPage = Number(this.$route.query.currentPage)
      this.title = window.sessionStorage.getItem('title') || ''
      this.datetime = JSON.parse(window.sessionStorage.getItem('datetime')) || ''
    }
    this.getFormList()
  },
  filters: {
    isRepeatFilters (val) {
      if (val === 0) {
        return '不可以'
      }
      if (val === 1) {
        return '可以'
      }
    },
    isUpdateFilters (val) {
      if (val === 1) {
        return '允许'
      }
      if (val === 0) {
        return '不允许'
      }
    },
    tagsFilters (val) {
      let arr = []
      val.map(item => {
        arr.push(item.title)
        return item
      })
      return arr.join(',') || '暂无'
    }
  },
  methods: {
    createLink (item) {
      this.$router.push({path: '/news/tools', query: {link: item.shareUrl, ran: Math.floor(Math.random() * 1000000)}})
    },
    searchData () {
      this.searchTitle = this.title
      this.pager.currentPage = 1
      if (!this.datetime) {
        this.datetime = []
      }
      window.sessionStorage.setItem('title', this.title)
      window.sessionStorage.setItem('datetime', JSON.stringify(this.datetime))
      this.getFormList()
    },
    getFormList () {
      let self = this
      this.$http.get('/api/v1.0/common/form', {
        params: {
          page: this.pager.currentPage,
          per_page: this.pager.pageSize,
          title: this.title,
          start_time: this.datetime[0],
          end_time: this.datetime[1]
        }
      }).then((res) => {
        let data = res.data.data
        self.totalNum = data.total
        self.tableData = data.data
        self.pager.currentPage = data.pageNum
        this.showPagination = true
        // if (!this.tableData.length && (this.pager.currentPage > data.pageNum) && (this.pager.currentPage > 1)) {
        //   this.pager.currentPage--
        //   this.getFormList()
        // }
      })
    },
    exportForm (item) {
      let fakeid = window.sessionStorage.getItem('login_fakeid')
      console.log(fakeid)
      window.location.href = `${Config.SERVER_URL}/api/v1.0/common/form/${item.id}/export?fakeid=${fakeid}`
    },
    addForm () {
      this.$router.push({path: '/news/cf/form/edit', query: {ran: Math.floor(Math.random() * 1000000)}})
    },
    editForm (item) {
      this.$router.push({path: '/news/cf/form/edit', query: {uuid: item.uuid, ran: Math.floor(Math.random() * 1000000)}})
    },
    delForm (item, index) {
      let self = this
      this.$confirm('确认删除该表单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$http.delete(`/api/v1.0/common/form/${item.id}`).then((res) => {
          self.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getFormList()
        }).catch(() => {
          self.$message({
            type: 'error',
            message: '请稍后重试'
          })
        })
      }).catch(() => {
        self.$message({
          message: '取消删除'
        })
      })
    },
    handleCurrentChange (val) {
      this.tableData = []
      this.pager.currentPage = val
      this.getFormList()
    }
  }
}
</script>

<style lang="scss" scoped>
@import './scss/color.scss';
  .link {
    color: $titleColor;
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
  }
</style>
