<template>
  <div class="table-list-wrap">
    <div class="list-title">专题管理</div>
    <div class="list-search-wrap">
      <el-form :inline="true" class="form-inline" label-width="70px">
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="searchForm.startTime"
            value-format="yyyy-MM-dd"
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
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="结束日期"
            style="width: 140px;"
            clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.topicType">
            <el-option label="全部" value=""></el-option>
            <el-option label="活动合集" value="0"></el-option>
            <el-option label="课程合集" value="1"></el-option>
            <el-option label="专题" value="2"></el-option>
            <el-option label="听见芯声" value="3"></el-option>
            <el-option label="专栏" value="4"></el-option>
            <el-option label="课程" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 20px;">
          <el-input v-model="searchForm.text" clearable placeholder="输入专题ID/专题标题/标签检索" style="width: 400px;"></el-input>
        </el-form-item>
        <el-button type="primary" @click="searchNews">搜索</el-button>
      </el-form>
      <div style="margin-bottom: 20px;">
        <el-button type="primary" @click="batchDel()">删除</el-button>
        <el-button type="primary" @click="addTopic">新增专题</el-button>
      </div>
    </div>
    <el-table
      style="width: 100%"
      ref="multipleTable"
      :data="topicList"
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
        label="专题ID"
        width="100px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="title"
        label="专题名称"
        width="200px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="num"
        label="内含条数"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="realHits"
        label="专题点击数"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="pv"
        label="子内容阅读数"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="tags"
        label="标签"
        width="200px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="url"
        label="专题链接"
        width="200px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="externalUrl"
        label="内置H5链接"
        width="200px"
        align="center">
      </el-table-column>
      <el-table-column
        label="显示状态"
        width="140px"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.display === 1">显示</span>
          <span v-if="scope.row.display !== 1">不显示</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTimeText"
        label="创建时间"
        width="160px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="modifyTimeText"
        label="更新时间"
        width="160px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createrName"
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
          <span class="text-link" @click="edit(scope.row)">编辑</span>
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
      topicList: [],
      searchForm: {
        startTime: '',
        endTime: '',
        text: '',
        topicType: ''
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
    _vue.fetchTopicList()
  },
  methods: {
    fetchTopicList () {
      // 获取专题列表
      let _vue = this
      _vue.$http.get('/api/v1.0/news/topic/lists?page=' + _vue.pager.page +
        '&per_page=' + _vue.pager.size +
        '&start_time=' + _vue.searchForm.startTime +
        '&end_time=' + _vue.searchForm.endTime +
        '&topic_type=' + _vue.searchForm.topicType +
        '&text=' + _vue.searchForm.text).then((response) => {
        _vue.topicList = response.data.data.rows
        _vue.totalNum = response.data.data.total
      })
    },
    searchNews () {
      let _vue = this
      _vue.pager.page = 1
      _vue.fetchTopicList()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleCurrentChange (val) {
      let _vue = this
      _vue.pager.page = val
      _vue.fetchTopicList()
    },
    batchDel (row) {
      // 删除专题
      let _vue = this
      if (row) {
        _vue.$http.put('/api/v1.0/news/topic/delete', {
          str: row.id.toString()
        }).then(() => {
          _vue.$message({
            type: 'success',
            message: '删除成功',
            center: true
          })
          _vue.pager.page = 1
          _vue.fetchTopicList()
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
            message: '请至少选择一条数据',
            center: true
          })
        } else {
          let ids = _.pluck(_vue.multipleSelection, 'id')
          _vue.$http.put('/api/v1.0/news/topic/delete', {
            str: ids.toString()
          }).then(() => {
            _vue.$message({
              type: 'success',
              message: '删除成功',
              center: true
            })
            _vue.pager.page = 1
            _vue.fetchTopicList()
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
    edit (row) {
      // 编辑专题
      this.$router.push({
        path: '/news/topic/new',
        query: {
          id: row.id
        }
      })
    },
    addTopic () {
      // 新增专题
      this.$router.push({
        path: '/news/topic/new'
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
