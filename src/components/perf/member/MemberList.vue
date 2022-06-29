<template>
  <div>
    <div class="teamlist">
      <el-row class="search_form">
        <el-col :span="3" size="medium"><h1 class="title">团队成员</h1></el-col>
        <el-col :span="15" size="medium">
          <el-form :inline="true" ref="searchArea" :model="searchArea" class="form-inline" label-width="70px">
            <el-row class="form-row">
              <el-form-item prop="fullname">
                <el-input clearable v-model="searchArea.fullname" placeholder="请输入成员姓名搜索团队成员" style="width: 280px;"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="search()">搜索</el-button>
              </el-form-item>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="6" align="right"><el-button
          type="primary" plain size="medium"
          @click="syncTeam()" v-if="editable === 1">{{syncmsg}}</el-button></el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <template>
            <el-table
              size="middle"
              header-row-class-name="tableheader"
              border
              @sort-change="sortMethods"
              :data="tableData"
              style="width: 100%;">
              <el-table-column label="操作" width="80" align="center" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="id"
                width="80"
                align="center"
                label="成员ID">
              </el-table-column>
              <el-table-column
                prop="name"
                align="center"
                label="姓名">
              </el-table-column>
              <el-table-column
                prop="sex"
                align="center"
                width="60"
                label="性别">
              </el-table-column>
              <el-table-column
                prop="birth"
                align="center" width="100"
                label="出生年月">
              </el-table-column>
              <el-table-column
                prop='workingYear'
                sortable="custom"
                align="center"
                width="110"
                label="工作年限"
                :formatter="workingYearFormat">
              </el-table-column>
              <el-table-column
                prop="post"
                align="center"
                width="200"
                label="职位">
              </el-table-column>
              <el-table-column
                prop="joinTime"
                sortable="custom"
                align="center"
                width="110"
                label="入职时间">
              </el-table-column>
              <el-table-column
                prop="curProjects"
                align="center"
                width="200"
                label="目前项目"
                :formatter="curProjectsFormat">
              </el-table-column>
              <el-table-column
                prop="leader"
                align="center"
                label="主管">
              </el-table-column>
              <el-table-column
                prop="status"
                align="center"
                label="工作状态">
              </el-table-column>
              <el-table-column
                prop="mobile"
                align="center" width="120"
                label="手机号码">
              </el-table-column>
              <el-table-column
                prop="templateName"
                align="center"
                label="绩效模板">
              </el-table-column>
              <el-table-column
                prop="isInit"
                align="center"
                label="初始评价"
                :formatter="isInitFormat">
              </el-table-column>
            </el-table>
          </template>
        </el-col>
      </el-row>

      <el-pagination
        align="right"
        background
        layout="total,prev, pager, next"
        v-if ="pageinfo.totalpage > pageinfo.pagesize"
        :page-size = "pageinfo.pagesize" @current-change="handleCurrentChange"
        :current-page.sync="pageinfo.page"
        :total = "pageinfo.totalpage">
      </el-pagination>

      <MemberModify ref='dialogVisible' v-bind:form="form"></MemberModify>
    </div>
  </div>
</template>

<script>
import MemberModify from '@/components/perf/member/MemberModify'
export default{
  components: {
    MemberModify
  },
  data () {
    return {
      editable: 0,
      form: {},
      pageinfo: {
        page: 1,
        totalpage: 0,
        pagesize: 12
      },
      tableData: [],
      sortData: '',
      syncmsg: '同步成员',
      searchArea: {
        fullname: ''
      }
    }
  },
  created () {
    document.title = '团队成员'
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      let _vue = this
      _vue.$http.get('/api/v1.0/perf/engineer?' + _vue.sortData + 'page=' + _vue.pageinfo.page + '&size=' + _vue.pageinfo.pagesize + '&name=' + _vue.searchArea.fullname).then(response => {
        _vue.tableData = response.data.data.rows
        _vue.pageinfo.totalpage = response.data.data.total
        _vue.editable = response.data.data.editable
      })
    },
    search () {
      let _vue = this
      _vue.pageinfo.page = 1
      _vue.$http.get('/api/v1.0/perf/engineer?page=' + _vue.pageinfo.page + '&size=' + _vue.pageinfo.pagesize + '&name=' + _vue.searchArea.fullname).then(response => {
        _vue.tableData = response.data.data.rows
        _vue.pageinfo.totalpage = response.data.data.total
      })
    },
    workingYearFormat (row, column) {
      return row.workingYear + '年'
    },
    curProjectsFormat (row, column, index) {
      let projectName = ''
      index.forEach(elem => {
        projectName += (elem.proName + ',')
      })
      return projectName === '' ? '暂无' : projectName.substring(0, projectName.length - 1)
    },
    isInitFormat (row, column) {
      return row.isInit ? '已导入' : '未导入'
    },
    handleCurrentChange: function (val) {
      let _vue = this
      _vue.pageinfo.page = val
      _vue.getUserInfo()
    },
    handleEdit (index, row) {
      let _vue = this
      _vue.$refs.dialogVisible.dialogVisible = true
      _vue.form = row
    },
    syncTeam () {
      if (this.syncmsg !== '同步中...') {
        this.syncmsg = '同步中...'
        this.$http.get('/api/v1.0/perf/engineer/sync').then(() => {
          this.$message({
            message: '恭喜你，同步成功',
            type: 'success'
          })
          this.syncmsg = '同步成员'
          this.getUserInfo()
        }).catch(() => {
          this.$message.error('同步失败，请稍后再试！')
          this.syncmsg = '同步成员'
        })
      }
    },
    sortMethods (val) {
      let _vue = this
      _vue.sortData = val.order ? val.prop + '=' + val.order + '&' : ''
      _vue.pageinfo.page = 1
      _vue.getUserInfo()
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/css/variable';
.teamlist{
  .search_form{
    .el-form-item{
      margin-bottom: 0px;
    }
  }

  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }

    .title{
      font-size: 20px;
      line-height: 36px;
    }
  }
  table .tableheader th{
    background-color: $primary-color;
    color: #fff;
    padding: 4px 0px;
    font-size: .9rem;
  }
}
</style>
