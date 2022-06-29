<template>
  <div>
    <div class="projectList">
      <el-row>
        <el-col :span="2" size="medium"><h1 class="title">项目库</h1></el-col>
        <el-col :span="5" align="right" style="padding-right: 10px;">
          <el-select v-model="searchArea.id" placeholder="请选择">
            <el-option
              v-for="item in chooseItem"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="11" size="medium">
          <el-form :inline="true" ref="searchArea" :model="searchArea" class="form-inline" label-width="70px">
            <el-row class="form-row">
              <el-form-item prop="searchName" v-if="searchArea.id !== 0">
                <el-input clearable v-model="searchArea.searchName" placeholder="请输入搜索关键词" style="width: 280px;"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="search()">搜索</el-button>
              </el-form-item>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="6" align="right"><el-button
          type="primary" plain size="medium"
          @click="handleAdd()">新增项目</el-button></el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <template>
            <el-table
              size="middle"
              @sort-change="sortMethods"
              header-row-class-name="tableheader"
              border
              :data="tableData">
              <el-table-column label="操作" align="center" :width="width"  fixed="right">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleDetail(scope.$index, scope.row)">详情</el-button>
                  <el-button
                    size="mini"
                    v-if="scope.row.editable === 1"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    v-if="scope.row.editable === 1"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="id"
                width="70"
                align="center"
                label="项目ID">
              </el-table-column>
              <el-table-column
                prop="city"
                align="center"
                width="200"
                label="项目城市">
              </el-table-column>
              <el-table-column
                prop="projectName"
                align="center"
                width="200"
                label="项目名称">
              </el-table-column>
              <el-table-column
                align="center"
                label="项目状态"
                :formatter='ProjectStatus'>
              </el-table-column>
              <el-table-column
                prop="customer"
                align="center"
                width="150"
                label="客户方">
              </el-table-column>
              <el-table-column
                prop="memberNames"
                align="center"
                width="230px"
                label="团队成员"
                :formatter='MemberNames'>
              </el-table-column>
              <el-table-column
                prop="leader"
                align="center"
                width="100"
                label="项目负责人">
              </el-table-column>
              <el-table-column
                prop="cusLeaderName"
                align="center"
                width="100"
                label="客户负责人">
              </el-table-column>
              <el-table-column
                prop="start"
                align="center"
                width="145"
                sortable="custom"
                label="项目开始时间"
                :formatter='UnixToTime'>
              </el-table-column>
              <el-table-column
                prop="end"
                align="center"
                width="130"
                label="项目结束时间"
                :formatter='UnixToTime'>
              </el-table-column>
              <el-table-column
                prop="modify"
                align="center"
                width="130"
                label="创建/修改时间"
                :formatter='UnixToTime'>
              </el-table-column>
              <el-table-column
                prop="supplier"
                align="center"
                label="Foundry">
              </el-table-column>
              <el-table-column
                prop="craft"
                align="center"
                width="175"
                label="工艺">
              </el-table-column>
              <el-table-column
                prop="node"
                align="center"
                label="节点">
              </el-table-column>
              <el-table-column
                prop="proDir"
                align="center"
                width="175"
                label="产品方向">
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

      <ProjectModify ref='dialogVisible'  v-on:refreshbizlines="getProjectList" v-bind:form="form" v-bind:editType="editType"></ProjectModify>
    </div>
  </div>
</template>

<script>
import ProjectModify from '@/components/perf/project/ProjectModify'
import Global from '../../../assets/js/global'

export default{
  components: {
    ProjectModify
  },
  data () {
    return {
      form: {},
      tableData: [],
      pageinfo: {
        page: this.$route.query.page ? this.$route.query.page : 1,
        totalpage: 0,
        pagesize: 10
      },
      width: 80,
      sortData: '',
      editType: '1', // 1 新增 2 修改
      formNew: {
        city: '',
        craft: '',
        create: '',
        cusLeaderEmail: '',
        cusLeaderName: '',
        cusLeaderMobile: '',
        customer: '',
        end: '',
        id: '',
        leader: '',
        leaderEmail: '',
        leaderMobile: '',
        leaderId: '',
        note: '',
        node: '',
        proDir: '',
        projectName: '',
        start: '',
        supplier: '',
        supplierId: '',
        projectTime: [],
        isCustomerNeed: false
      },
      chooseItem: [{
        name: '全部',
        value: 0
      }, {
        name: '按项目ID',
        value: 1
      }, {
        name: '按客户方',
        value: 2
      }, {
        name: '按项目名称',
        value: 3
      }, {
        name: '按项目负责人',
        value: 4
      }, {
        name: '按客户负责人',
        value: 5
      }],
      searchArea: {
        id: 0,
        searchName: ''
      }
    }
  },
  created () {
    document.title = '项目管理'
    this.getProjectList()
  },
  methods: {
    getProjectList () {
      let _vue = this
      _vue.$http.get('/api/v1.0/perf/project?' + _vue.sortData + 'page=' + _vue.pageinfo.page + '&size=' + _vue.pageinfo.pagesize + '&id=' + _vue.searchArea.id + '&searchName=' + _vue.searchArea.searchName).then(response => {
        _vue.tableData = response.data.data.rows
        _vue.pageinfo.totalpage = response.data.data.total

        _vue.tableData.forEach(elem => {
          if (elem.editable === 1) {
            _vue.width = 210
          }
        })
      })
      _vue.formNew = {
        city: '',
        craft: '',
        create: '',
        cusLeaderEmail: '',
        cusLeaderName: '',
        cusLeaderMobile: '',
        customer: '',
        end: '',
        id: '',
        leader: '',
        leaderEmail: '',
        leaderMobile: '',
        leaderId: '',
        note: '',
        node: '',
        proDir: '',
        projectName: '',
        start: '',
        supplier: '',
        supplierId: '',
        projectTime: [],
        isCustomerNeed: false
      }
    },
    UnixToTime (row, column, cellValue) {
      return Global.formatTime(cellValue, 'yyyy年MM月dd日')
    },
    search () {
      let _vue = this
      _vue.getProjectList()
    },
    ProjectStatus (row, column, cellValue) {
      let startTime = new Date(row.start)
      let endTime = new Date(row.end + 24 * 3600 * 1000)
      let now = new Date()
      if (startTime > now) {
        return '待开始'
      } else if (endTime > now) {
        return '进行中'
      } else {
        return '已结束'
      }
    },
    MemberNames (row, column, cellValue) {
      if (row.memberCt > 5) {
        return row.memberNames + row.memberCt + '人'
      } else {
        return row.memberNames
      }
    },
    handleDetail (index, row) {
      let _vue = this
      _vue.$router.push({
        name: 'projectDetail',
        params: {
          id: row.id
        },
        query: {
          frompage: _vue.pageinfo.page
        }
      })
    },
    handleEdit (index, row) {
      let _vue = this
      _vue.editType = 2
      _vue.$refs.dialogVisible.dialogVisible = true
      _vue.form = row
      _vue.$set(_vue.form, 'projectTime', [new Date(_vue.form.start), new Date(_vue.form.end)])
    },
    handleDelete (index, row) {
      let _vue = this
      _vue.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _vue.$http.put('/api/v1.0/perf/project/' + row.id, {'isDeleted': 1}).then(() => {
          _vue.getProjectList()
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
    handleAdd () {
      let _vue = this
      _vue.editType = 1
      _vue.$refs.dialogVisible.dialogVisible = true
      _vue.form = _vue.formNew
    },
    handleCurrentChange: function (val) {
      let _vue = this
      _vue.pageinfo.page = val
      _vue.getProjectList()
    },
    sortMethods (val) {
      let _vue = this
      _vue.sortData = val.order ? val.prop + '=' + val.order + '&' : ''
      _vue.pageinfo.page = 1
      _vue.getProjectList()
    }
  }
}
</script>

<style lang="scss">
  @import '../../../assets/css/variable';
  .projectList{
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

    .form-row .el-form-item{
      margin-bottom: 0px;
    }

    .el-table__fixed-body-wrapper{
      top: 0px;
    }
    table .tableheader th{
      background-color: $primary-color;
      color: #fff;
      padding: 4px 0px;
      font-size: .9rem;
    }
  }
</style>
