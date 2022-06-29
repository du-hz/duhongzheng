<template>
  <div>
    <div class="projectteamslist">
      <el-row class="projectDetail">
        <el-col :span="20" size="medium">
          <el-row>
            <el-col :span="8" size="medium">
              <p class="title">{{ projectData.projectName }}</p>
            </el-col>
            <el-col :span="8" size="medium">
              <p><i>城市：</i>{{ projectData.city }}</p>
            </el-col>
            <el-col :span="8" size="medium">
              <p><i>客户方：</i>{{ projectData.customer }}</p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" size="medium">
              <p><i>项目负责人：</i>{{ projectData.leader }}</p>
            </el-col>
            <el-col :span="8" size="medium">
              <p><i>项目负责人电话：</i>{{ projectData.leaderMobile }}</p>
            </el-col>
            <el-col :span="8" size="medium">
              <p><i>项目负责人邮箱：</i>{{ projectData.leaderEmail }}</p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" size="medium">
              <p><i>客户负责人：</i>{{ projectData.cusLeaderName }}</p>
            </el-col>
            <el-col :span="8" size="medium">
              <p><i>客户负责人电话：</i>{{ projectData.cusLeaderMobile }}</p>
            </el-col>
            <el-col :span="8" size="medium">
              <p><i>客户负责人邮箱：</i>{{ projectData.cusLeaderEmail }}</p>
            </el-col>
          </el-row>
          <el-row v-if="projectData.role !== 0">
            <el-col :span="6" size="medium">
              <p><i>Foundry：</i>{{ projectData.supplier }}</p>
            </el-col>
            <el-col :span="6" size="medium">
              <p><i>工艺：</i>{{ projectData.craft }}</p>
            </el-col>
            <el-col :span="6" size="medium">
              <p><i>节点：</i>{{ projectData.node }}</p>
            </el-col>
            <el-col :span="6" size="medium">
              <p><i>产品方向：</i>{{ projectData.proDir }}</p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" size="medium">
              <p><i>项目团队成员：</i>{{ tableData.length }}人</p>
            </el-col>
            <el-col :span="8" size="medium">
              <p><i>项目开始时间：</i>{{ projectData.start | formatTime('yyyy-MM-dd') }}</p>
            </el-col>
            <el-col :span="8" size="medium">
              <p><i>项目结束时间：</i>{{ projectData.end | formatTime('yyyy-MM-dd') }}</p>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="4" align="right"><el-button
          type="primary" plain size="medium"
           v-if="projectData.editable == 1" style="margin-bottom: 20px;"
          @click="handleAdd()">添加项目成员</el-button></el-col>
        <el-col :span="4" align="right"><el-button
          type="primary" plain size="medium"
          v-if="frompage !== ''"
          @click="goback()">返回项目列表</el-button></el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <template>
            <el-table
              size="middle"
              header-row-class-name="tableheader"
              @sort-change="sortMethods"
              border
              :data="tableData">
              <el-table-column
                prop="id"
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
                label="性别">
              </el-table-column>
              <el-table-column
                prop="birth"
                align="center"
                width="100px"
                label="出生年月">
              </el-table-column>
              <el-table-column
                prop="workingYear"
                align="center"
                sortable="custom"
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
                prop="joinProjectTime"
                sortable="custom"
                align="center"
                width="150"
                label="加入项目时间"
                :formatter="UnixToTime">
              </el-table-column>
              <el-table-column
                prop="leaveProjectTime"
                align="center"
                width="130"
                label="结束项目时间"
                :formatter="UnixToTime">
              </el-table-column>
              <el-table-column
                prop="status"
                align="center"
                label="工作状态">
              </el-table-column>
              <el-table-column
                prop="leave"
                align="center"
                label="项目状态"
                :formatter="projectStatusFormat">
              </el-table-column>
              <el-table-column
                prop="templateName"
                align="center"
                label="绩效模板">
              </el-table-column>
              <el-table-column
                prop="modifyTime"
                align="center"
                width="130"
                label="创建/修改时间"
                :formatter="UnixToTime">
              </el-table-column>
              <el-table-column label="操作" width="150" align="center" fixed="right"  v-if="projectData.editable == 1">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-col>
      </el-row>

      <el-pagination
        align="right"
        background
        layout="total, prev, pager, next"
        v-if ="pageinfo.totalpage > pageinfo.pagesize"
        :page-size = "pageinfo.pagesize" @current-change="handleCurrentChange"
        :current-page.sync="pageinfo.page"
        :total = "pageinfo.totalpage">
      </el-pagination>

      <ProjectTeamModify ref='dialogVisible' v-on:refreshbizlines="getTeamList" v-bind:form="form" v-bind:projectData="projectData" v-bind:editType="editType"></ProjectTeamModify>
    </div>
  </div>
</template>

<script>
import ProjectTeamModify from '@/components/perf/project/ProjectTeamModify'
import Global from '../../../assets/js/global'

export default{
  components: {
    ProjectTeamModify
  },
  data () {
    return {
      form: [],
      formNew: [{
        'name': '',
        'sex': '',
        'post': '',
        'workingYear': '',
        'projectTime': [],
        'stat': ''
      }],
      pageinfo: {
        page: 1,
        totalpage: 0,
        pagesize: 10
      },
      editType: '1', // 1 新增 2 修改
      tableData: [],
      projectData: {
        editable: 1
      },
      sortData: '',
      frompage: this.$route.query.frompage ? this.$route.query.frompage : ''
    }
  },
  created () {
    document.title = '项目详情'
    // 看一下是不是来自项目列表的
    this.getTeamList()
  },
  methods: {
    getTeamList () {
      let _vue = this
      _vue.$http.get('/api/v1.0/perf/project/' + _vue.$route.params.id + '/engineer?' + _vue.sortData + 'page=' + _vue.pageinfo.page + '&size=' + _vue.pageinfo.pagesize).then(response => {
        _vue.tableData = response.data.data.rows
        _vue.pageinfo.totalpage = response.data.data.total
      })
      _vue.$http.get('/api/v1.0/perf/project/' + _vue.$route.params.id).then(response => {
        _vue.projectData = response.data.data
      })
      _vue.formNew = [{
        'name': '',
        'sex': '',
        'post': '',
        'workingYear': '',
        'projectTime': [],
        'stat': ''
      }]
    },
    projectStatusFormat () {
      let _vue = this
      let startTime = new Date(_vue.projectData.start)
      let endTime = new Date(_vue.projectData.end + 24 * 3600 * 1000)
      let now = new Date()
      if (startTime > now) {
        return '待开始'
      } else if (endTime > now) {
        return '进行中'
      } else {
        return '已结束'
      }
    },
    workingYearFormat (row, column) {
      return row.workingYear + '年'
    },
    UnixToTime (row, column, cellValue) {
      return Global.formatTime(cellValue, 'yyyy年MM月dd日')
    },
    handleEdit (index, row) {
      let _vue = this
      _vue.editType = 2
      _vue.$refs.dialogVisible.dialogVisible = true
      _vue.form = []
      _vue.form[0] = row
      _vue.$set(_vue.form[0], 'projectTime', [new Date(_vue.form[0].joinProjectTime), new Date(_vue.form[0].leaveProjectTime)])
      _vue.$set(_vue.form[0], 'stat', '')
    },
    handleAdd () {
      let _vue = this
      _vue.editType = 1
      _vue.$refs.dialogVisible.dialogVisible = true
      _vue.form = _vue.formNew
    },
    handleDelete (index, row) {
      let _vue = this
      _vue.$confirm('此操作将从该项目中删除该成员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _vue.$http.put('/api/v1.0/perf/project/' + _vue.$route.params.id + '/engineer', {'members': [{'isDeleted': 1, 'engineerId': row.id}]}).then(() => {
          _vue.getTeamList()
          _vue.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          _vue.$message({
            type: 'info',
            message: '删除失败，请稍后再试！'
          })
        })
      }).catch(() => {
        _vue.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleCurrentChange: function (val) {
      let _vue = this
      _vue.pageinfo.page = val
      _vue.getTeamList()
    },
    sortMethods (val) {
      let _vue = this
      _vue.sortData = val.order ? val.prop + '=' + val.order + '&' : ''
      _vue.pageinfo.page = 1
      _vue.getTeamList()
    },
    goback () {
      let _vue = this
      _vue.$router.push({
        name: 'projectList',
        query: {
          page: _vue.frompage
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import '../../../assets/css/variable';

  .projectteamslist{
    .projectDetail{
      margin-bottom: 0px;

      p{
        color: #555;
        line-height: 40px;
        font-size: .92rem;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;

        i{
          color: #333;
          font-weight: 500;
          font-style: normal;
        }
      }

      .el-row {
        margin-bottom: 5px;
        border-bottom: 1px solid #eee;
        &:last-child {
          border-bottom: 0px;
        }
        .title{
          font-size: 1.2rem;
          line-height: 36px;
          color: #333;
        }
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

      .el-button + .el-button{
        margin-left: 5px;
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
