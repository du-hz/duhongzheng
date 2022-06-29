<template>
  <div class="table-list-wrap">
    <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
      <el-form-item label="OA账号" prop="name">
        <el-input v-model="searchForm.name" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="运营姓名" prop="name">
        <el-input v-model="searchForm.name" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="选择模块" prop="state">
        <el-select v-model="searchForm.state" placeholder="请选择" style="width: 180px;">
          <el-option label="用户模块" value="1"></el-option>
          <el-option label="企业模块" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作时间">
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
    <el-table
      :data="tableData"
      header-row-class-name="tableheader"
      border
      style="width: 100%;">
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="100px">
      </el-table-column>
      <el-table-column
        prop="registerTime"
        label="运营姓名"
        align="center"
        min-width="140">
      </el-table-column>
      <el-table-column
        prop="companyShortname"
        label="账号"
        align="center"
        min-width="140">
      </el-table-column>
      <el-table-column
        prop="name"
        label="模块"
        align="center"
        min-width="140">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="行为"
        align="center"
        min-width="140">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="描述"
        align="center"
        min-width="140">
      </el-table-column>
      <el-table-column
        label="操作时间"
        align="center"
        min-width="140">
        <template slot-scope="scope">
          {{scope.row.status | filterStatus}}
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
  }
}
</script>

<style lang="scss" scoped>

</style>
