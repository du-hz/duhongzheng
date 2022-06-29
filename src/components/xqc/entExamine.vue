<template>
  <div class="table-list-wrap">
    <div class="list-search-wrap">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
        <el-form-item label="当前状态" prop="state">
          <el-select v-model="searchForm.state" placeholder="请选择" style="width: 180px;">
            <el-option label="待审核" value="1"></el-option>
            <el-option label="用户提交重审" value="2"></el-option>
            <el-option label="审核不通过" value="3"></el-option>
            <el-option label="审核通过" value="4"></el-option>
            <el-option label="全部" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户提交类型" prop="type">
          <el-select v-model="searchForm.type" placeholder="请选择" style="width: 180px;">
            <el-option label="纠错企业信息" value="1"></el-option>
            <el-option label="新增企业信息" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="searchForm.name" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="注册日期">
          <el-form-item prop="startRegisterTime">
            <el-date-picker
              v-model="searchForm.startRegisterTime"
              value-format="yyyy-MM-dd"
              placeholder="开始日期"
              style="width: 140px;"
              clearable>
            </el-date-picker>
          </el-form-item>
          <span style="padding-right: 10px;">至</span>
          <el-form-item prop="endRegisterTime">
            <el-date-picker
              v-model="searchForm.endRegisterTime"
              value-format="yyyy-MM-dd"
              placeholder="结束日期"
              style="width: 140px;"
              clearable>
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="primary" @click="reset('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      header-row-class-name="tableheader"
      border
      style="width: 100%;">
      <el-table-column
        type="index"
        label="企业ID"
        align="center"
        width="100px">
      </el-table-column>
      <el-table-column
        prop="registerTime"
        label="企业名称（用户纠错）"
        align="center"
        min-width="165">
      </el-table-column>
      <el-table-column
        prop="companyShortname"
        label="CRM公司编号"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="name"
        label="用户"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        label="用户提交时间"
        align="center"
        min-width="120">
        <template slot-scope="scope">
          {{scope.row.status | filterStatus}}
        </template>
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="用户提交类型"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="email"
        label="审核状态"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="orderCount"
        label="审核人"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        label="审核时间"
        align="center"
        min-width="120">
        <template slot-scope="scope">
          {{scope.row.status | filterStatus}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        align="center"
        width="100px">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            plain
            @click="edit(scope.row)">审核</el-button>
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
export default {
  data () {
    return {
      searchForm: {
        state: '',
        type: '',
        name: '',
        startRegisterTime: '',
        endRegisterTime: ''
      },
      tableData: [{}],
      totalNum: 0,
      pager: {
        curPage: 1,
        size: 20
      }
    }
  },
  methods: {
    search () {
      console.log(this.searchForm)
    },
    reset (from) {
      this.$refs[from].resetFields()
      this.searchForm.select = '1'
      console.log(this.searchForm)
    },
    edit () {
      this.$router.push({
        name: 'entExamineDetail',
        params: {
          id: 1
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
