<template>
  <div class="table-list-wrap signUpCheck">
    <div class="list-title">日历管理</div>
    <div class="list-search-wrap">
      <el-form :inline="true" class="form-inline" label-width="70px">
        <el-form-item label="查询时间">
          <el-date-picker
            v-model="searchForm.startTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="活动开始时间"
            type="date"
            style="width: 150px;"
            :picker-options="pickerOptions"
            clearable>
          </el-date-picker>
        </el-form-item>
        <span style="padding-right: 10px;">至</span>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.endTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="date"
            placeholder="活动结束时间"
            style="width: 150px;"
            :picker-options="pickerOptions"
            clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item style="margin-left: 20px;">
          <el-input v-model="searchForm.text" clearable placeholder="输入活动名称进行检索" style="width: 400px;"></el-input>
        </el-form-item>
        <el-button type="primary" @click="searchNews">查询</el-button>
        <el-button type="primary" @click="batchDel()">删除</el-button>
        <el-button type="primary" @click="calendarOrg">新建日历</el-button>
      </el-form>
    </div>
    <el-table
      style="width: 100%"
      max-height="500"
      ref="multipleTable"
      :data="newsList"
      border
      header-row-class-name="tableheader selection"
      @sort-change = "sortChange"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column
        prop="id"
        label="日历ID"
        width="100px"
        align="center">
      </el-table-column>
      <el-table-column
        label="活动名称"
        width="auto"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.title || '暂无'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="开始时间"
        width="auto"
        sortable='custom'
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.startTime | filterDateformatH}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="关联活动ID"
        width="auto"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.seminarId===0? '' : scope.row.seminarId}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTimeText"
        label="日历创建时间"
        width="auto"
        sortable='custom'
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | filterDateformatH}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTimeText"
        label="日历更新时间"
        width="auto"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.modifyTime | filterDateformatH}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="auto"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.isShow | isShowFilters}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建者"
        width="auto"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.creatorName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <span class="text-link" @click="editOrg(scope.row)">编辑</span>
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
    let myDate = new Date()
    return {
      pickerOptions: {
        disabledDate (time) {
          let startyear = myDate.getFullYear() - 1
          let endyear = myDate.getFullYear() + 1
          let enddate = endyear + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate()
          let startdate = startyear + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate()
          let endDate = new Date(enddate)
          let startDate = new Date(startdate)
          return time.getTime() > endDate || time.getTime() < startDate
        },
        onPick ({minDate, maxDate}) {
          myDate = minDate
        }
      },
      newsList: [],
      searchForm: {
        startTime: '',
        endTime: '',
        text: '',
        sortCreateTime: '',
        sortStartTime: ''
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
  filters: {
    isShowFilters (val) {
      if (val === 0) {
        return '不显示'
      }
      if (val === 1) {
        return '显示'
      }
    },
    creatorFilters (val) {
      if (val === 0) {
        return '自动同步'
      } else {
        return val
      }
    }
  },
  methods: {
    sortChange (e) {
      console.log(e)
      let label = e.column.label ? e.column.label : ''
      if (label === '开始时间') {
        if (this.searchForm.sortStartTime === 1) {
          this.searchForm.sortStartTime = 2
        } else if (this.searchForm.sortStartTime === 2) {
          this.searchForm.sortStartTime = 1
        } else {
          this.searchForm.sortStartTime = 2
        }
        this.searchForm.sortCreateTime = ''
      } else if (label === '日历创建时间') {
        if (this.searchForm.sortCreateTime === 1) {
          this.searchForm.sortCreateTime = 2
        } else if (this.searchForm.sortCreateTime === 2) {
          this.searchForm.sortCreateTime = 1
        } else {
          this.searchForm.sortCreateTime = 2
        }
        this.searchForm.sortStartTime = ''
      } else {
        this.searchForm.sortStartTime = ''
        this.searchForm.sortCreateTime = ''
      }
      this.fetchNewsList()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    fetchNewsList () {
      // 获取日历列表
      let _vue = this
      _vue.$http.get('/api/v1.0/expo/calendar/calendars/filter?pageIndex=' + _vue.pager.page + '&pageCount=' + _vue.pager.size + '&calendarStartTime=' + _vue.searchForm.startTime + '&calendarEndTime=' + _vue.searchForm.endTime + '&calendarTitle=' + _vue.searchForm.text + '&sortCreateTime=' + _vue.searchForm.sortCreateTime + '&sortStartTime=' + _vue.searchForm.sortStartTime).then((response) => {
        console.log('获取日历列表-------------')
        console.log(response.data.data.rows)
        _vue.newsList = response.data.data.rows
        _vue.totalNum = response.data.data.total
      })
    },
    searchNews () {
      let _vue = this
      _vue.pager.page = 1
      _vue.searchForm.startTime ? _vue.searchForm.startTime = _vue.searchForm.startTime : _vue.searchForm.startTime = ''
      _vue.searchForm.endTime ? _vue.searchForm.endTime = _vue.searchForm.endTime : _vue.searchForm.endTime = ''
      _vue.fetchNewsList()
    },
    handleCurrentChange (val) {
      let _vue = this
      _vue.pager.page = val
      _vue.fetchNewsList()
    },
    editOrg (row) {
      // 编辑日历
      this.$router.push({
        path: '/news/expo/calendarNew?id=' + row.id
      })
      window.localStorage.setItem('detail', JSON.stringify(row))
    },
    batchDel (row) {
      // 删除日历
      let _vue = this
      if (!row && _vue.multipleSelection.length === 0) {
        _vue.$message({
          type: 'warning',
          message: '请至少选择一条日历',
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
          let params = {
            calendarId: row.id.toString()
          }
          console.log(params)
          _vue.$http.put('/api/v1.0/expo/calendar/calendars/record', params).then(() => {
            _vue.$message({
              type: 'success',
              message: '删除成功',
              center: true
            })
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
          let params = {
            calendarId: ids.toString()
          }
          _vue.$http.put('/api/v1.0/expo/calendar/calendars/record', params).then(() => {
            _vue.$message({
              type: 'success',
              message: '删除成功',
              center: true
            })
            _vue.fetchNewsList()
          }).catch(() => {
            _vue.$message({
              type: 'error',
              message: '请稍后重试',
              center: true
            })
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    calendarOrg () {
      // 新增机构
      this.$router.push({
        path: '/news/expo/calendarNew'
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
