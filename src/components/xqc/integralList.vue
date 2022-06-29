<template>
  <div class="table-list-wrap">
    <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
      <el-form-item label="触发条件" prop="state">
        <el-select v-model="searchForm.state" placeholder="请选择" style="width: 180px;">
          <el-option label="注册成功" value="1"></el-option>
          <el-option label="分享成功" value="2"></el-option>
          <el-option label="企业信息审核成功" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间">
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
      <el-form-item label="用户姓名" prop="name">
        <el-input v-model="searchForm.name" placeholder="请输入内容"></el-input>
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
        label="用户ID"
        align="center"
        width="100px">
      </el-table-column>
      <el-table-column
        prop="registerTime"
        label="姓名"
        align="center"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="companyShortname"
        label="所属公司"
        align="center"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="name"
        label="触发条件"
        align="center"
        min-width="150">
      </el-table-column>
      <el-table-column
        label="获取奖励时间"
        align="center"
        min-width="150">
        <template slot-scope="scope">
          {{scope.row.status | filterStatus}}
        </template>
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="获得积分"
        align="center"
        min-width="150">
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
