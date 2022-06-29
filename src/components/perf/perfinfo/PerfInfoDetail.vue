<template>
  <div class="perfinfodetail">
    <el-row :gutter="20">
      <el-col :span="16" size="medium"><h1 class="title">绩效详情：{{projectData.projectName}}</h1></el-col>
      <el-col :span="4" align="right">
        <el-select v-model="currrentMonth" placeholder="请选择" @change="goMonth()">
          <el-option
            v-for="item in months"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4" align="right"><el-button
        type="primary" plain size="large"
        v-if="frompage !== ''"
        @click="goback()">返回绩效表单列表</el-button></el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          size="middle"
          @sort-change="sortMethods"
          header-row-class-name="tableheader"
          border
          :data="tableData"
          style="width: 100%;">
          <el-table-column
            prop="id"
            align="center"
            width="65px"
            label="成员ID">
          </el-table-column>
          <el-table-column
            prop="name"
            align="center"
            width="70px"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="sex"
            align="center"
            width="50px"
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
            width="105"
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
            align="center"
            width="110"
            sortable="custom"
            label="入职时间">
          </el-table-column>
          <el-table-column label="自评分数" align="center" width="110">
            <template slot-scope="scope">
              <el-button  v-if="scope.row.selfScore !== '暂无数据'"
                size="medium"
                @click="SelfScore(scope.$index, scope.row)">{{scope.row.selfScore}}分</el-button>
                <el-button  v-if="scope.row.selfScore === '暂无数据' && scope.row.id === curId"
                  size="medium"
                  type = "danger"
                  @click="SelfScore(scope.$index, scope.row)">未提交</el-button>
              <p v-if="(scope.row.id !== curId && scope.row.selfScore === '暂无数据')">未提交</p>
            </template>
          </el-table-column>
          <el-table-column
            v-if="role == 0"
            prop="averageScore"
            align="center"
            width="170"
            label="主管、客户综合评分"
            :formatter="scoreFormat">
            <template slot-scope="scope">
              <p v-if="scope.row.leaderScore.indexOf('暂无数据') > -1">待主管负责人评价</p>
              <p v-else-if="scope.row.customerScore.indexOf('暂无数据') > -1">待客户负责人评价</p>
              <el-button v-else-if="scope.row.averageScore.indexOf('暂无数据') === -1"
                size="medium"
                type="default"
                @click="selfAverageScore(scope.$index, scope.row)">{{scope.row.averageScore}}分</el-button>
            </template>
          </el-table-column>
          <el-table-column
            v-if="role !== 0"
            prop="leaderScore"
            align="center"
            width="170"
            label="主管评分">
            <template slot-scope="scope">
              <el-button  v-if="scope.row.role !== 1 && scope.row.leaderScore.indexOf('暂无数据') === -1"
                size="medium"
                type="default"
                @click="leaderScore(scope.$index, scope.row)">{{scope.row.leaderScore}}</el-button>
              <el-button v-if="(role === 1 && scope.row.role !== 1 && scope.row.leaderScore.indexOf('暂无数据') > -1)"
                  size="medium"
                  type="danger"
                  @click="leaderScore(scope.$index, scope.row)">{{projectData.leader}}(未提交)</el-button>
              <p v-if="role != 1 && scope.row.leaderScore.indexOf('暂无数据') > -1 && scope.row.role !== 1">{{projectData.leader}}(未提交)</p>
              <p v-if="scope.row.role === 1">无</p>
            </template>
          </el-table-column>
          <el-table-column
            v-if="role != 0"
            align="center"
            width="150"
            label="客户评分">
            <template slot-scope="scope">
              <el-button  v-if="role != 0 && scope.row.customerScore !== '暂无数据' && scope.row.customerScore !== '无'"
                size="medium"
                @click="customerScore(scope.$index, scope.row)">{{projectData.cusLeaderName}}{{scope.row.customerScore}}分</el-button>
              <p v-if="role != 0 && scope.row.customerScore === '无'">客户无需评分</p>
              <p v-if="role != 0 && scope.row.customerScore === '暂无数据'">{{projectData.cusLeaderName}}(未提交)</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="personScore"
            align="center"
            width="130"
            label="个人单月绩效分"
            :formatter="scoreFormat">
          </el-table-column>
          <el-table-column
            prop="teamScore"
            align="center"
            width="130"
            label="当月团队平均分"
            :formatter="scoreFormat">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-pagination
      align="right"
      background
      layout="prev, pager, next"
      v-if ="pageinfo.totalpage > pageinfo.pagesize"
      :page-size = "pageinfo.pagesize" @current-change="handleCurrentChange"
      :current-page.sync="pageinfo.page"
      :total = "pageinfo.totalpage">
    </el-pagination>

    <Template ref='dialogVisible' v-bind:info="info" v-on:refreshbizlines="getProjectTeamList"></Template>
  </div>
</template>

<script>
import Template from '@/components/perf/template/TemplateDetail'
import Global from '@/assets/js/global'

export default{
  components: {
    Template
  },
  data () {
    return {
      pageinfo: {
        page: 1,
        totalpage: 0,
        pagesize: 10
      },
      currrentMonth: '',
      sortData: '',
      info: {},
      months: [],
      projectData: {},
      tableData: [],
      role: 0,
      curId: '',
      frompage: this.$route.query.frompage
    }
  },
  created () {
    document.title = '绩效详情'
    // 支持URL形式 perf/perfinfo/6/detail?month=2018-02
    this.currrentMonth = this.$route.query.month ? this.$route.query.month : ''
    this.getProjectTeamList()
  },
  methods: {
    getProjectTeamList () {
      let _vue = this
      _vue.$http.get('/api/v1.0/perf/evaluation/' + _vue.$route.params.id + '?' + _vue.sortData + 'page=' + _vue.pageinfo.page + '&size=' + _vue.pageinfo.pagesize + '&month=' + _vue.currrentMonth).then(response => {
        _vue.tableData = response.data.data.rows
        _vue.pageinfo.totalpage = response.data.data.total
        _vue.currrentMonth = response.data.data.month
        _vue.months = response.data.data.queryMonth
        _vue.role = response.data.data.role
        _vue.curId = response.data.data.curId
      })
      _vue.$http.get('/api/v1.0/perf/project/' + _vue.$route.params.id).then(response => {
        _vue.projectData = response.data.data
      })
    },
    UnixToTime (row, column, cellValue) {
      return Global.formatTime(cellValue, 'yyyy年MM月dd日')
    },
    workingYearFormat (row, column) {
      return row.workingYear + '年'
    },
    scoreFormat (row, column, cellValue) {
      if (cellValue !== '暂无数据') {
        return cellValue + '分'
      } else {
        return cellValue
      }
    },
    goMonth () {
      this.getProjectTeamList()
    },
    SelfScore (index, row) {
      let _vue = this
      _vue.info = {
        'type': 1,
        'auth_type': 1,
        'action': 'selfEvaluate',
        'projectData': _vue.projectData,
        'templateId': row.template,
        'user_id': row.id,
        'month': _vue.currrentMonth,
        'title': _vue.currrentMonth + ' 绩效详情自评'
      }
      _vue.$refs.dialogVisible.dialogVisible = true
    },
    selfAverageScore (index, row) {
      let _vue = this
      _vue.info = {
        'type': 1,
        'auth_type': 4,
        'action': 'averageEvaluate',
        'projectData': _vue.projectData,
        'templateId': row.template,
        'user_id': row.id,
        'month': _vue.currrentMonth,
        'title': _vue.currrentMonth + ' 绩效详情项目负责人，客户负责人评价'
      }
      _vue.$refs.dialogVisible.dialogVisible = true
    },
    leaderScore (index, row) {
      let _vue = this
      _vue.info = {
        'type': 1,
        'auth_type': 2,
        'action': 'leaderEvaluate',
        'projectData': _vue.projectData,
        'templateId': row.template,
        'user_id': row.id,
        'user_info': row,
        'month': _vue.currrentMonth,
        'title': _vue.currrentMonth + ' 绩效详情项目负责人评价'
      }
      _vue.$refs.dialogVisible.dialogVisible = true
    },
    customerScore (index, row) {
      let _vue = this
      _vue.info = {
        'type': 1,
        'auth_type': 3,
        'action': 'customerEvaluate',
        'projectData': _vue.projectData,
        'templateId': row.template,
        'user_id': row.id,
        'user_info': row,
        'month': _vue.currrentMonth,
        'title': _vue.currrentMonth + ' 绩效详情客户评价'
      }
      _vue.$refs.dialogVisible.dialogVisible = true
    },
    handleCurrentChange: function (val) {
      let _vue = this
      _vue.pageinfo.page = val
      _vue.getProjectTeamList()
    },
    sortMethods (val) {
      let _vue = this
      _vue.sortData = val.order ? val.prop + '=' + val.order + '&' : ''
      _vue.pageinfo.page = 1
      _vue.getProjectTeamList()
    },
    goback () {
      let _vue = this
      _vue.$router.push({
        name: 'perfList',
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
  .perfinfodetail {
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
