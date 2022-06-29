<template>
  <div>
    <div class="labellist">
      <el-row class="search_form">
        <el-col :span="3" size="medium"><h1 class="title">星级/标签</h1></el-col>
        <el-col :span="4" size="medium" align="right" style="padding-right: 10px;">
          <el-select v-model="industry" placeholder="请选择" @change="changeIndustry()">
            <el-option
              v-for="item in templateList"
              :key="item.templateId"
              :label="item.name"
              :value="item.templateId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="9" size="medium">
          <el-form :inline="true" ref="searchArea" :model="searchArea" class="form-inline" label-width="70px">
            <el-row class="form-row">
              <el-form-item prop="searchName">
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
                prop="adminUserId"
                width="80"
                align="center"
                label="成员ID">
              </el-table-column>
              <el-table-column
                prop="staffname"
                align="center"
                width="80"
                label="姓名">
              </el-table-column>
              <el-table-column
                prop="sexText"
                align="center"
                width="60"
                label="性别">
              </el-table-column>
              <el-table-column
                prop="birthdateText"
                align="center" width="100"
                label="出生年月">
              </el-table-column>
              <el-table-column
                prop="workingYear"
                align="center"
                width="120"
                sortable="custom"
                label="工作年限"
                :formatter="workingYearFormat">
              </el-table-column>
              <el-table-column
                prop="postname"
                align="center"
                width="200"
                label="职位">
              </el-table-column>
              <el-table-column
                prop="jobwork"
                align="center"
                width="120"
                sortable="custom"
                label="入职时间">
              </el-table-column>
              <el-table-column
                prop="locname"
                align="center"
                 width="130"
                label="常驻办公城市">
              </el-table-column>
              <el-table-column
                prop="star"
                align="center" width="120"
                label="星级">
              </el-table-column>
              <el-table-column
                prop="tags"
                align="center"
                label="标签">
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

      <LabelModify ref='dialogVisible' v-bind:form="form" v-bind:isEdit="isEdit" v-bind:info="info"></LabelModify>
    </div>
  </div>
</template>

<script>
import LabelModify from '@/components/perf/label/LabelModify'

export default{
  components: {
    LabelModify
  },
  data () {
    return {
      pageinfo: {
        page: 1,
        totalpage: 0,
        pagesize: 10
      },
      industry: 0,
      sortData: '',
      searchArea: {
        searchName: ''
      },
      templateList: [{
        name: '全部',
        templateId: 0
      }],
      tableData: [],
      isEdit: true,
      form: {},
      info: {
        star: 0,
        tags: []
      }
    }
  },
  created () {
    document.title = '星级/标签'
    this.getTemplateList()
    this.getUserInfo()
  },
  methods: {
    getTemplateList () {
      let _vue = this
      _vue.$http.get('/api/v1.0/perf/evaluation/template').then(response => {
        response.data.data.templates.forEach(elem => {
          _vue.templateList.push(elem)
        })
      })
    },
    workingYearFormat (row, column) {
      return row.workingYear + '年'
    },
    getUserInfo () {
      let _vue = this
      _vue.$http.get('/api/v1.0/perf/engineer/relation_lists/' + _vue.industry + '?' + _vue.sortData + 'page=' + _vue.pageinfo.page + '&size=' + _vue.pageinfo.pagesize + '&searchName=' + _vue.searchArea.searchName).then(response => {
        _vue.tableData = response.data.data.rows
        _vue.pageinfo.totalpage = response.data.data.total
        _vue.editable = response.data.data.editable
        _vue.isEdit = response.data.data.isEdit === 0
      })
    },
    handleCurrentChange: function (val) {
      let _vue = this
      _vue.pageinfo.page = val
      _vue.getUserInfo()
    },
    changeIndustry: function () {
      let _vue = this
      _vue.pageinfo.page = 1
      _vue.getUserInfo()
    },
    search () {
      let _vue = this
      _vue.pageinfo.page = 1
      _vue.getUserInfo()
    },
    handleEdit (index, row) {
      let _vue = this
      _vue.$refs.dialogVisible.dialogVisible = true
      _vue.form = row
      _vue.info = {
        'star': row.star ? row.star : 0,
        'tags': row.tags ? row.tags.split(',') : []
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
.labellist{
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
