<template>
  <div class="table-list-wrap">
    <div class="list-search-wrap" style="display: none;">
      <el-form :inline="true" ref="searchForm" :model="searchForm" class="form-inline" label-width="70px">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="searchForm.email" placeholder="邮箱" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search('searchForm')">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="list-header-action-wrap">
      <el-button type="primary" size="medium" @click="addAdviser" v-if="actionPermission.showAdviserAdd">新增招聘顾问</el-button>
    </div>
    <!-- 列表 -->
    <el-table
      :data="tableData"
      header-row-class-name="tableheader"
      border
      style="width: 100%;">
      <el-table-column
        type="index"
        width="50"
        align="center">
      </el-table-column>
      <el-table-column
        prop="adminName"
        label="姓名"
        width="160"
        align="center">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        min-width="160"
        align="center">
      </el-table-column>
      <el-table-column
        label="身份"
        width="120"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isMaster === 1">主管</span>
          <span v-if="scope.row.isMaster !== 1">顾问</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="fastOrderCount"
        label="面试快订单量"
        width="120"
        align="center">
      </el-table-column>
      <el-table-column
        prop="fastRecommendCount"
        label="面试快推荐候选人"
        width="140"
        align="center">
      </el-table-column>
      <el-table-column
        prop="fastCount"
        label="已面试数量"
        width="120"
        align="center">
      </el-table-column>
      <el-table-column
        prop="fastProfit"
        label="面试快收益(元)"
        width="120"
        align="center">
      </el-table-column>
      <el-table-column
        prop="entryOrderCount"
        label="保入职订单量"
        width="120"
        align="center">
      </el-table-column>
      <el-table-column
        prop="entryRecommendCount"
        label="保入职推荐候选人"
        width="140"
        align="center">
      </el-table-column>
      <el-table-column
        prop="entryCount"
        label="已入职数量"
        width="120"
        align="center">
      </el-table-column>
      <el-table-column
        prop="entryProfit"
        label="保入职收益(元)"
        width="120"
        align="center">
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

    <!-- 新增招聘顾问 -->
    <el-dialog title="新增招聘顾问" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="adviserForm" ref="adviserForm" :rules="rules">
        <el-form-item label="身份：" label-width="140px">
          <el-radio-group v-model="adviserForm.level">
            <el-radio :label="1">主管</el-radio>
            <el-radio :label="0">顾问</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择人员：" label-width="140px">
          <el-select v-model="adviserForm.adminId" filterable clearable placeholder="请选择" @change="selectAdviser">
            <el-option
              v-for="item in adviserOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话：" label-width="140px">
          <el-input v-model.trim="adviserForm.phone" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" label-width="140px">
          <el-input v-model.trim="adviserForm.email" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码：" label-width="140px" style="display: none;">
          <span>新用户初始登录密码为 Moore.135</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer center">
        <el-button @click="closeDialog('form')">取 消</el-button>
        <el-button type="primary" @click="submit('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'underscore'
import Global from 'assets/js/global'

export default {
  data () {
    return {
      searchForm: {
        name: '',
        email: ''
      },
      pager: {
        size: 10,
        curPage: 1
      },
      totalNum: 1,
      tableData: [],
      actionPermission: {
        showAdviserAdd: true
      },
      dialogFormVisible: false,
      adviserForm: {
        level: 0,
        adminId: '',
        phone: '',
        email: ''
      },
      rules: {},
      adviserOptions: []
    }
  },
  created () {
    this.fetchAllAdmin()
    this.fetchAdviserList()
  },
  methods: {
    search (formName) {
      // TODO: 查询
    },
    fetchAdviserList () {
      let _vue = this
      _vue.$http.get('/api/v1.0/ensure/managers?page=' + _vue.pager.curPage + '&per_page=' + _vue.pager.size).then(function (response) {
        _vue.tableData = response.data.data.list
        _vue.totalNum = response.data.data.total
      })
    },
    fetchAllAdmin () {
      // 获取所有后台用户，可选择为顾问
      let _vue = this
      _vue.$http.get('/api/v1.0/admins?page=1&per_page=9999').then(function (response) {
        _vue.adviserOptions = response.data.data.rows
      })
    },
    handleCurrentChange (val) {
      this.pager.curPage = val
      this.fetchAdviserList()
    },
    addAdviser () {
      this.dialogFormVisible = true
    },
    closeDialog () {
      this.dialogFormVisible = false
    },
    selectAdviser () {
      let _vue = this
      let adviser = _.findWhere(_vue.adviserOptions, { id: parseInt(_vue.adviserForm.adminId) })
      if (adviser) {
        _vue.adviserForm.phone = adviser.phone
        _vue.adviserForm.email = adviser.email
      }
    },
    submit () {
      let _vue = this
      _vue.$http.post('/api/v1.0/ensure/manager', {
        adminId: _vue.adviserForm.adminId,
        isMaster: _vue.adviserForm.level
      }).then(function (response) {
        _vue.$message({
          type: 'success',
          message: '添加成功',
          center: true
        })
        _vue.dialogFormVisible = false
        _vue.fetchAdviserList()
      }).catch((err) => {
        let field = Global.extractErrorField(err)
        if (field === 'adminUser') {
          _vue.$message({
            type: 'error',
            message: '顾问已存在，不能重复添加',
            center: true
          })
        } else {
          _vue.$message({
            type: 'error',
            message: '请稍后重试',
            center: true
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";
</style>
