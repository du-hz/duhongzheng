<template>
  <div class="table-list-wrap signUpCheck">
    <div class="list-title">报名审核</div>
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
          <el-input v-model="searchForm.text" clearable placeholder="输入展会ID/展会标题/主办方/协办方/标签检索" style="width: 400px;"></el-input>
        </el-form-item>
        <el-button type="primary" @click="searchNews">查询</el-button>
      </el-form>
    </div>
    <el-table
      style="width: 100%"
      max-height="500"
      ref="multipleTable"
      :data="newsList"
      border
      header-row-class-name="tableheader selection">
      <!-- <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column> -->
      <el-table-column
        prop="id"
        label="展会ID"
        width="100px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="title"
        label="展会标题"
        width="200px"
        align="center">
      </el-table-column>
      <el-table-column
        label="主办方"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.organizers}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="协办方"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.assistants}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="展会时间"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.startTime | filterDateformatH}} 至 {{scope.row.endTime | filterDateformatH}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="numberOfDetailPage"
        label="点击人数"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="realSingup"
        label="报名人数"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="agreedNum"
        label="通过人数"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="waitingNum"
        label="待审核人数"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="rejectedNum"
        label="未通过人数"
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
          <span>{{scope.row.createTime | filterDateformatH}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTimeText"
        label="更新时间"
        width="155px"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.modifyTime | filterDateformatH}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="modifyTimeText"
        label="状态"
        width="155px"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.isShow? '显示' : '不显示'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <span class="text-link" @click="editGuest(scope.row)">查看报名名单</span>
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
// import _ from 'underscore'
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
      // 获取展会列表
      let _vue = this
      _vue.$http.get('/api/v1.0/expo/expo/expo_list?page=' + _vue.pager.page +
        '&per_page=' + _vue.pager.size +
        '&beginTime=' + (_vue.searchForm.startTime || '') +
        '&endTime=' + (_vue.searchForm.endTime || '') +
        '&text=' + _vue.searchForm.text + '&isSignupNeedReview=1').then((response) => {
        _vue.newsList = response.data.data.rows
        _vue.totalNum = response.data.data.total
      })
    },
    searchNews () {
      let _vue = this
      _vue.pager.page = 1
      _vue.fetchNewsList()
    },
    handleCurrentChange (val) {
      let _vue = this
      _vue.pager.page = val
      _vue.fetchNewsList()
    },
    editGuest (row) {
      // 编辑嘉宾
      this.$router.push({
        path: '/news/expo/checkNew?id=' + row.id
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
<style lang="scss">
  .signUpCheck{
    table .tableheader.selection th:first-child{
      background-color: #409eff;
    }
  }
</style>
