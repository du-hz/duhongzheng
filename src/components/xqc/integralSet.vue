<template>
  <div class="table-list-wrap">
    <div class="list-search-wrap">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
        <el-form-item label="活动状态" prop="state">
          <el-select v-model="searchForm.state" placeholder="请选择" style="width: 180px;">
            <el-option label="生效" value="1"></el-option>
            <el-option label="已失效" value="2"></el-option>
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
        label="规则ID"
        align="center"
        width="100px">
      </el-table-column>
      <el-table-column
        prop="registerTime"
        label="规则名称"
        align="center"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="companyShortname"
        label="触发条件"
        align="center"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="name"
        label="当前状态"
        align="center"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="name"
        label="活动范围"
        align="center"
        min-width="110">
      </el-table-column>
      <el-table-column
        label="活动截止时间"
        align="center"
        min-width="110">
        <template slot-scope="scope">
          {{scope.row.status | filterStatus}}
        </template>
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="奖励积分"
        align="center"
        min-width="110">
      </el-table-column>
      <el-table-column
        prop="email"
        label="奖励频率"
        align="center"
        min-width="110">
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
            @click="edit(scope.row)">编辑</el-button>
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
    <el-dialog title="编辑" :visible.sync="dialogVisible" :before-close="handleClose" width="40%" top="50px">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
        <el-form-item label="规则名称：" prop="state">
          <span>新用户注册</span>
        </el-form-item>
        <el-form-item label="触发条件：" prop="state">
          <span>注册成功</span>
        </el-form-item>
        <el-form-item label="当前状态：" prop="state">
          <span>生效</span>
        </el-form-item>
        <el-form-item label="生效时间：">
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
        <el-form-item label="活动范围：" prop="state">
          <span>新用户</span>
        </el-form-item>
        <el-form-item label="奖励积分：" prop="state">
          <el-input v-model="searchForm.state" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="奖励频率：" prop="state">
          <el-select v-model="searchForm.state" placeholder="请选择">
            <el-option label="1次" value="1"></el-option>
            <el-option label="每次" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">提交</el-button>
      </span>
    </el-dialog>
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
      },
      dialogVisible: false
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
      this.dialogVisible = true
    },
    handleClose () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./styles/index.scss";
.el-dialog__body .el-form >.el-form-item {
  display: block;
  /deep/ .el-input--suffix .el-input__inner {
    padding-right: 15px;
  }
}
/deep/ .el-dialog__body {
  /deep/ .el-form-item {
    margin-bottom: 5px;
  }
  /deep/ .el-input__inner {
    height: 35px;
    line-height: 35px;
  }
}

</style>
