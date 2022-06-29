<template>
  <div>
    <div class="perfInfolist">
      <el-row>
        <el-col :span="2" size="medium">
          <h1 class="title">绩效表单</h1>
        </el-col>
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
        <el-col :span="17" size="medium">
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
      </el-row>
      <el-row>
        <el-col :span="24">
          <template>
            <el-table
              size="middle"
              @sort-change="sortMethods"
              header-row-class-name="tableheader"
              border
              :data="tableData"
              style="width: 100%;">
              <el-table-column label="操作" width="130" align="center" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    @click="viewTeamPerf(scope.$index, scope.row)">查看团队绩效</el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="id"
                align="center"
                width="70"
                label="项目ID">
              </el-table-column>
              <el-table-column
                prop="city"
                width="200"
                align="center"
                label="项目城市">
              </el-table-column>
              <el-table-column
                prop="projectName"
                align="center"
                width="200"
                label="项目名称">
              </el-table-column>
              <el-table-column
                prop="customer"
                align="center"
                width="200"
                label="客户方">
              </el-table-column>
              <el-table-column
                prop="memberNames"
                align="center"
                width="250"
                label="团队成员"
                :formatter="MemberFormat">
              </el-table-column>
              <el-table-column
                prop="leader"
                align="center" width="110"
                label="项目负责人">
              </el-table-column>
              <el-table-column
                prop="cusLeaderName"
                align="center" width="110"
                label="客户负责人">
              </el-table-column>
              <el-table-column
                prop="start"
                align="center" width="140"
                sortable="custom"
                label="项目开始时间"
                :formatter='UnixToTime'>
              </el-table-column>
              <el-table-column
                prop="end"
                align="center" width="130"
                label="项目结束时间"
                :formatter='UnixToTime'>
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
    </div>
  </div>
</template>

<script>
import Global from '../../../assets/js/global'
export default{
  data () {
    return {
      chooseitems: 0,
      pageinfo: {
        page: this.$route.query.page ? this.$route.query.page : 1,
        totalpage: 0,
        pagesize: 10
      },
      tableData: [],
      sortData: '',
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
    document.title = '绩效表单'
    this.getProjectList()
  },
  methods: {
    getProjectList () {
      let _vue = this
      _vue.$http.get('/api/v1.0/perf/project?' + _vue.sortData + 'page=' + _vue.pageinfo.page + '&size=' + _vue.pageinfo.pagesize + '&id=' + _vue.searchArea.id + '&searchName=' + _vue.searchArea.searchName).then(response => {
        _vue.tableData = response.data.data.rows
        _vue.pageinfo.totalpage = response.data.data.total
      })
    },
    viewTeamPerf (index, row) {
      let _vue = this
      _vue.$router.push({
        name: 'perfinfoDetail',
        params: {
          id: row.id
        },
        query: {
          frompage: _vue.pageinfo.page
        }
      })
    },
    search () {
      let _vue = this
      _vue.getProjectList()
    },
    UnixToTime (row, column, cellValue) {
      return Global.formatTime(cellValue, 'yyyy年MM月dd日')
    },
    MemberFormat (row, column, cellValue) {
      if (row.memberCt > 5) {
        return cellValue + row.memberCt + '人'
      } else {
        return cellValue
      }
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
.perfInfolist{
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }

    .title{
      font-size: 20px;
      line-height: 36px;
    }

    .el-form-item{
      margin-bottom: 0px;
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
