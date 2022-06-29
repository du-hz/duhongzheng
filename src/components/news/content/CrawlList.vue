<template>
  <div class="table-list-wrap">
    <div class="list-title">抓取库</div>
    <div class="list-search-wrap">
      <el-form :inline="true" class="form-inline" label-width="70px">
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="searchForm.startTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="开始日期"
            type="date"
            style="width: 140px;"
            clearable>
          </el-date-picker>
        </el-form-item>
        <span style="padding-right: 10px;">至</span>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.endTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            placeholder="结束日期"
            style="width: 140px;"
            clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item style="margin-left: 20px;">
          <el-input v-model="searchForm.text" clearable placeholder="输入新闻ID/新闻标题/标签检索" style="width: 400px;"></el-input>
        </el-form-item>
        <el-button type="primary" @click="searchNews">搜索</el-button>
      </el-form>
      <div style="margin-bottom: 20px;">
        <el-button type="primary" @click="batchDel()">删除</el-button>
        <el-button type="primary" @click="batchAudit()">审核</el-button>
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
        label="新闻ID"
        width="100px"
        align="center">
      </el-table-column>
      <el-table-column
        label="新闻标题"
        width="200px"
        align="center">
        <template slot-scope="scope">
          <span class="text-link" @click="viewDetail(scope.row)">{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="source"
        label="新闻来源"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="author"
        label="新闻作者"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="autoCategory"
        label="新闻分类"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="tag"
        label="标签"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="originReleaseTime"
        label="原始发布时间"
        width="155px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="155px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="modifyTime"
        label="更新时间"
        width="155px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="150px"
        align="center">
      </el-table-column>
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
import Global from 'assets/js/global'

export default {
  data () {
    return {
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
    _vue.fetchNewsList()
  },
  methods: {
    fetchNewsList () {
      // 获取新闻列表
      let _vue = this
      _vue.$http.get('/api/v1.0/news/content/capture_news?page=' + _vue.pager.page +
        '&per_page=' + _vue.pager.size +
        '&beginTime=' + (_vue.searchForm.startTime || '') +
        '&endTime=' + (_vue.searchForm.endTime || '') +
        '&text=' + _vue.searchForm.text).then((response) => {
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
        _vue.$http.put('/api/v1.0/news/content/delete', {
          str: row.id.toString()
        }).then(() => {
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
      } else {
        if (_vue.multipleSelection.length === 0) {
          _vue.$message({
            type: 'warning',
            message: '请至少选择一条新闻',
            center: true
          })
        } else {
          let ids = _.pluck(_vue.multipleSelection, 'id')
          _vue.$http.put('/api/v1.0/news/content/delete', {
            str: ids.toString()
          }).then(() => {
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
      // 编辑新闻
      window.open(Global.CONFIG.FRONT_URL + '/#/news/content/new?id=' + row.id)
    },
    viewDetail (row) {
      window.open(Global.CONFIG.FRONT_URL + '/#/news/content/detail/' + row.id)
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
