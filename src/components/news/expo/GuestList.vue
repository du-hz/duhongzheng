<template>
  <div class="table-list-wrap">
    <div class="list-title">嘉宾管理</div>
    <div class="list-search-wrap">
      <el-form :inline="true" class="form-inline" label-width="70px">
        <el-form-item label="查询时间">
          <el-date-picker
            v-model="searchForm.startTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="开始日期"
            type="date"
            style="width: 150px;"
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
            style="width: 150px;"
            clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item style="margin-left: 20px;">
          <el-input v-model="searchForm.text" clearable placeholder="输入嘉宾ID/嘉宾姓名/协办方/创建者/标签检索" style="width: 400px;"></el-input>
        </el-form-item>
        <el-button type="primary" @click="searchNews">查询</el-button>
      </el-form>
      <div style="margin-bottom: 20px;">
        <el-button type="primary" @click="batchDel()">删除</el-button>
        <el-button type="primary" @click="addGuest">新建嘉宾</el-button>
      </div>
    </div>
    <el-table
      style="width: 100%"
      max-height="500"
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
        label="嘉宾ID"
        width="100px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="嘉宾姓名"
        width="200px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="avatar"
        label="嘉宾头像"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <img :src="scope.row.avatar | filterQiniuMooreImage" class="imgHeader">
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="嘉宾Title"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="numOfRelatedExpo"
        label="关联展会数"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="tags"
        label="标签"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="155px"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | filterDateformat}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTimeText"
        label="更新时间"
        width="155px"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.modifyTime | filterDateformat}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="modifyTimeText"
        label="状态"
        width="155px"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.isShow? '不显示' : '显示'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="creatorName"
        label="创建者"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <span class="text-link" @click="editGuest(scope.row)">编辑</span>
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
// import Global from 'assets/js/global'

export default {
  name: 'expoList',
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
        size: 10
      },
      totalNum: 0,
      multipleSelection: []
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
      _vue.$http.get('/api/v1.0/expo/guest/guest_list?page=' + _vue.pager.page +
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
      // 删除嘉宾
      let _vue = this
      if (!row && _vue.multipleSelection.length === 0) {
        _vue.$message({
          type: 'warning',
          message: '请至少选择一条新闻',
          center: true
        })
        return
      }
      this.$confirm('删除后将无法恢复,确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row) {
          _vue.$http.post('/api/v1.0/expo/guest/delete_guest', {
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
          let ids = _.pluck(_vue.multipleSelection, 'id')
          _vue.$http.post('/api/v1.0/expo/guest/delete_guest', {
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
      })
    },
    addGuest () {
      // 新增嘉宾
      this.$router.push({
        path: '/news/expo/guestNew'
      })
    },
    editGuest (row) {
      // 编辑嘉宾
      this.$router.push({
        path: '/news/expo/guestNew?id=' + row.id
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
  .imgHeader{
    max-width:90px;
    max-height:90px;
  }
</style>
