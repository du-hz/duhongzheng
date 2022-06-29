<template>
  <div class="table-list-wrap">
    <div class="head-wrap">
      <span class="text-link" @click="back">&lt;&lt; 返回</span>
    </div>
    <div class="list-title">专栏管理 ＞ {{title}}</div>
    <div class="list-search-wrap">
      <div style="margin-bottom: 20px;">
        <el-button type="primary" @click="batchDel()">删除</el-button>
        <el-button type="primary" @click="editNews()">新增</el-button>
      </div>
    </div>
    <el-table
      style="width: 100%"
      ref="multipleTable"
      :data="newsList"
      border
      header-row-class-name="tableheader selection"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column
        prop="id"
        label="图文ID"
        align="center">
      </el-table-column>
      <el-table-column
        prop="title"
        label="图文名称（点击查看详情）"
        align="center">
        <template slot-scope="scope">
          <span class="text-link" @click="viewDetail(scope.row)">{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="author"
        label="作者"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="source"
        label="图文类型"
        align="center">
      </el-table-column>
      <!-- <el-table-column
        prop="autoCategory"
        label="图文分类"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="tag"
        label="阅读人数"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="tag"
        label="虚拟阅读"
        width="150px"
        align="center">
      </el-table-column> -->
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center">
      </el-table-column>
      <!-- <el-table-column
        prop="modifyTime"
        label="更新时间"
        width="155px"
        align="center">
      </el-table-column> -->
      <!-- <el-table-column
        prop="status"
        label="状态"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="status"
        label="置顶"
        width="150px"
        align="center">
      </el-table-column> -->
      <el-table-column
        label="操作"
        fixed="right"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <span class="text-link" @click="editNews(scope.row)">编辑</span>
          <span class="text-link" @click="batchDel(scope.row)">删除</span>
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
import _ from 'underscore'

export default {
  data () {
    return {
      title: window.sessionStorage.getItem('news-title') ? window.sessionStorage.getItem('news-title') : '专栏名称',
      topicId: '',
      newsList: [],
      searchForm: {
        startTime: '',
        endTime: '',
        text: ''
      },
      pager: {
        page: 1,
        size: 20
      },
      totalNum: 0,
      multipleSelection: ''
    }
  },
  created () {
    let _vue = this
    this.topicId = this.$route.query.id ? this.$route.query.id : ''
    _vue.fetchNewsList()
  },
  methods: {
    back () {
      this.$router.push({
        path: '/news/zhuanlan/list'
      })
    },
    fetchNewsList () {
      // 获取新闻列表
      let _vue = this
      _vue.$http.get(`/api/v1.0/news/aggregate/special_column/list?page=${_vue.pager.page}&per_page=${_vue.pager.size}&keyword=${_vue.searchForm.text}&topicId=${this.topicId}`).then((response) => {
        _vue.newsList = response.data.data.rows
        _vue.totalNum = response.data.data.total
      })
    },
    searchNews () {
      let _vue = this
      _vue.pager.page = 1
      _vue.fetchNewsList()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleCurrentChange (val) {
      let _vue = this
      _vue.pager.page = val
      _vue.fetchNewsList()
    },
    batchDel (row) {
      // 删除新闻
      let _vue = this
      if (row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _vue.$http.delete(`/api/v1.0/news/aggregate/${this.topicId}?ids=${row.id.toString()}`).then(() => {
            _vue.$message({
              type: 'success',
              message: '删除成功',
              center: true
            })
            _vue.pager.page = 1
            _vue.fetchNewsList()
          }).catch(() => {
            _vue.$message({
              type: 'error',
              message: '请稍后重试',
              center: true
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        if (_vue.multipleSelection.length === 0) {
          _vue.$message({
            type: 'warning',
            message: '请至少选择一条新闻',
            center: true
          })
        } else {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let ids = _.pluck(_vue.multipleSelection, 'id')
            _vue.$http.delete(`/api/v1.0/news/aggregate/${this.topicId}?ids=${ids.toString()}`).then(() => {
              _vue.$message({
                type: 'success',
                message: '删除成功',
                center: true
              })
              _vue.pager.page = 1
              _vue.fetchNewsList()
            }).catch(() => {
              _vue.$message({
                type: 'error',
                message: '请稍后重试',
                center: true
              })
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      }
    },
    batchAudit () {
      // 批量审核
      let _vue = this
      if (_vue.multipleSelection.length === 0) {
        _vue.$message({
          type: 'warning',
          message: '请至少选择一条新闻',
          center: true
        })
      } else {
        let ids = _.pluck(_vue.multipleSelection, 'id')
        _vue.$http.put('/api/v1.0/news/content/audit_news', {
          str: ids.toString()
        }).then(() => {
          _vue.$message({
            type: 'success',
            message: '审核成功',
            center: true
          })
          _vue.pager.page = 1
          _vue.fetchNewsList()
        }).catch(() => {
          _vue.$message({
            type: 'error',
            message: '请稍后重试',
            center: true
          })
        })
      }
    },
    editNews (row) {
      let id = row ? row.id : ''
      this.$router.push({
        path: `/news/zhuanlan/imgText/Edit?id=${id}&topicId=${this.topicId}`
      })
      // 编辑新闻
      // window.open(Global.CONFIG.FRONT_URL + '/#/news/zhuanlan/imgText/Edit?id=' + row.id)
    },
    viewDetail (row) {
      let id = row ? row.id : ''
      this.$router.push({
        path: `/news/zhuanlan/imgText/detail?id=${id}&topicId=${this.topicId}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";

  .head-wrap {
    margin-bottom: 30px;
  }
  .list-title {
    font-size: 18px;
    margin-bottom: 20px;
  }
</style>
