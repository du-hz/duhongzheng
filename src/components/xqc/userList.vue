<template>
  <div class="table-list-wrap">
    <div class="list-search-wrap">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
        <el-form-item label="账号状态" prop="state">
          <el-input v-model="searchForm.state" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item prop="value">
          <el-input placeholder="请输入内容" v-model="searchForm.value" class="input-with-select">
            <el-select v-model="searchForm.select" slot="prepend" placeholder="请选择">
              <el-option label="姓名" value="1"></el-option>
              <el-option label="公司" value="2"></el-option>
              <el-option label="手机号" value="3"></el-option>
              <el-option label="用户id" value="4"></el-option>
            </el-select>
          </el-input>
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
        label="用户ID"
        align="center"
        width="100px">
      </el-table-column>
      <el-table-column
        prop="registerTime"
        label="姓名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="companyShortname"
        label="公司"
        align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="用户等级"
        align="center">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="用户类别"
        align="center">
      </el-table-column>
      <el-table-column
        prop="email"
        label="手机号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="orderCount"
        label="职位"
        align="center">
      </el-table-column>
      <el-table-column
        label="注册时间"
        align="center">
        <template slot-scope="scope">
          {{scope.row.status | filterStatus}}
        </template>
      </el-table-column>
      <el-table-column
        prop="isEmailValidate"
        label="账号状态"
        align="center">
        <template slot-scope="scope">
          {{scope.row.isEmailValidate | filterEmailStatus}}
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
      <div class="el-descriptions">
        <div class="el-descriptions__header">系统信息</div>
        <ul class="el-descriptions__body">
          <li>
            <span>注册时间</span>
            <span>2022/02.20</span>
          </li>
          <li>
            <span>会员等级</span>
            <span>普通</span>
          </li>
          <li>
            <span>会员类别</span>
            <span>普通</span>
          </li>
        </ul>
      </div>
      <div class="el-descriptions">
        <div class="el-descriptions__header">用户信息</div>
        <ul class="el-descriptions__body">
          <li>
            <span>姓名</span>
            <span>杜宏征</span>
          </li>
          <li>
            <span>手机号</span>
            <span>18810537889</span>
          </li>
          <li>
            <span>企业名称</span>
            <span>xxx有限公司</span>
          </li>
          <li>
            <span>职位</span>
            <span>开发</span>
          </li>
          <li>
            <span>邮箱</span>
            <span>18810537889@163.com</span>
          </li>
        </ul>
      </div>
      <div class="el-descriptions">
        <div class="el-descriptions__header">功能操作</div>
        <ul class="el-descriptions__body">
          <li>
            <span class="vertical-middle">账号状态</span>
            <span>
              <el-select v-model="userState" placeholder="请选择" style="width: 180px;">
                <el-option label="正常" value="0"></el-option>
                <el-option label="禁止登录" value="1"></el-option>
              </el-select>
            </span>
          </li>
        </ul>
      </div>
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
        endRegisterTime: '',
        value: '',
        select: '1'
      },
      tableData: [],
      totalNum: 99,
      pager: {
        curPage: 1,
        size: 20
      },
      dialogVisible: false,
      userState: ''
    }
  },
  methods: {
    search () {
      this.tableData.push({})
      // this.$http.get('/api/v1.0/customer/subs?company_name=' + this.searchForm.companyName +
      //   '&admin_id=' + this.searchForm.adminId +
      //   '&start_register_time=' + this.searchForm.startRegisterTime +
      //   '&end_register_time=' + this.searchForm.endRegisterTime +
      //   '&status=' + this.searchForm.status +
      //   '&email_status=' + this.searchForm.emailStatus +
      //   '&page=' + this.pager.curPage +
      //   '&per_page=' + this.pager.size
      // ).then((response) => {
      //   let result = response.data.data
      //   this.tableData = result.rows
      //   this.totalNum = result.total
      // }).catch(() => {
      //   this.$message({
      //     type: 'error',
      //     message: '请稍后重试',
      //     center: true
      //   })
      // })
      console.log(this.searchForm)
    },
    reset (from) {
      this.$refs[from].resetFields()
      this.searchForm.select = '1'
      console.log(this.searchForm)
    },
    handleCurrentChange () {

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
.list-search-wrap {
  /deep/ .el-input-group__prepend {
    width: 50px;
  }
  /deep/ .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>
