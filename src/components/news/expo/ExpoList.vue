<template>
  <div class="table-list-wrap">
    <div class="list-title">展会管理</div>
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
          <el-input v-model="searchForm.text" clearable placeholder="输入展会ID/展会标题/主办方/协办方/创建者/标签检索" style="width: 400px;"></el-input>
        </el-form-item>
        <el-button type="primary" @click="searchNews">查询</el-button>
      </el-form>
      <div style="margin-bottom: 20px;">
        <el-button type="primary" @click="batchDel()">删除</el-button>
        <el-button type="primary" @click="addExpo">新建展会活动</el-button>
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
        label="展会ID"
        width="100px"
        align="center">
      </el-table-column>
      <el-table-column
        label="会议活动标题"
        width="200px"
        align="center">
        <template slot-scope="scope">
          <span class="text-link" @click="editExpo(scope.row)">{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="seminarStatus"
        label="活动状态"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        label="类型"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <span>{{expoTypeOption.filter(res=>res.value == scope.row.expoTypeId).length?expoTypeOption.filter(res=>res.value == scope.row.expoTypeId)[0].label:''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="organizers"
        label="主办方"
        width="150px"
        align="center">
      </el-table-column>
      <!-- <el-table-column
        prop="organizers"
        label="协办方"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="organizers"
        label="承办方"
        width="150px"
        align="center">
      </el-table-column> -->
      <el-table-column
        prop="guestName"
        label="参会嘉宾"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        label="关联新闻数"
        width="200px"
        align="center">
        <template slot-scope="scope">
          <span class="text-link" @click="goRelationNew(scope.row)">{{scope.row.newsNum}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="展会时间"
        width="155px"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.startTime | filterDateformatH}} 至 {{scope.row.endTime | filterDateformatH}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="numberOfDetailPage"
        label="点击人数"
        width="155px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="realSingup"
        label="报名人数"
        width="155px"
        align="center">
      </el-table-column>
      <!-- <el-table-column
        prop="modifyTimeText"
        label="展会类型"
        width="155px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="modifyTimeText"
        label="展会形式"
        width="155px"
        align="center">
      </el-table-column> -->
      <el-table-column
        prop="tags"
        label="标签"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | filterDateformatH}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.modifyTime | filterDateformatH}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否显示"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.isShow? '显示' : '不显示'}}</span>
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
          <span class="text-link" @click="editExpo(scope.row)">编辑</span>
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
      multipleSelection: [],
      expoTypeOption: [
        {label: '供应商大会', value: '101'},
        {label: '半导体应用', value: '102'},
        {label: '行业展会', value: '103'},
        {label: '技术论坛', value: '104'},
        {label: '半导体校友会', value: '105'},
        {label: '园区招聘', value: '106'}
      ]
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
      _vue.$http.get('/api/v1.0/expo/expo/expo_list?page=' + _vue.pager.page +
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
          _vue.$http.post('/api/v1.0/expo/expo/delete_expo', {
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
          _vue.$http.post('/api/v1.0/expo/expo/delete_expo', {
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
    addExpo () {
      // 新增会议
      this.$router.push({
        path: '/news/expo/new'
      })
    },
    editExpo (row) {
      // 编辑会议
      this.$router.push({
        path: '/news/expo/new?id=' + row.id
      })
    },
    goRelationNew (row) {
      // 关联新闻
      console.log(111)
      this.$router.push({
        path: '/news/expo/RelationNew?id=' + row.id
      })
    },
    viewDetail (row) {
      // window.open(Global.CONFIG.FRONT_URL + '/#/news/content/detail/' + row.id)
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
