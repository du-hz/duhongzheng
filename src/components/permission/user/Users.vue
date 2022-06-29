<template>
  <div class="table-list-wrap">
    <div class="list-search-wrap">
      <el-form :inline="true" ref="searchForm" :model="searchForm" class="form-inline" label-width="70px">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="searchForm.phone" placeholder="请输入联系电话" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="searchForm.email" placeholder="请输入邮箱" clearable></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-form-item prop="startCreateTime">
            <el-date-picker
              v-model="searchForm.startCreateTime"
              id="startCreateTime"
              value-format="yyyy-MM-dd"
              placeholder="开始日期"
              style="width: 140px;"
              clearable>
            </el-date-picker>
          </el-form-item>
          <span style="padding-right: 10px;">至</span>
          <el-form-item prop="endCreateTime">
            <el-date-picker
              id="endCreateTime"
              v-model="searchForm.endCreateTime"
              value-format="yyyy-MM-dd"
              placeholder="结束日期"
              style="width: 140px;"
              clearable>
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search('searchForm')">搜索</el-button>
          <el-button type="primary" @click="reset('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="list-header-action-wrap">
      <el-button type="primary" size="medium" @click="addNewUser" v-if="actionPermission.showUserAdd">新增用户</el-button>
    </div>
    <el-table
      :data="tableData"
      header-row-class-name="tableheader"
      border
      style="width: 100%;">
      <el-table-column
        prop="name"
        label="姓名"
        width="160"
        align="center">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="联系电话"
        min-width="160"
        align="center">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        min-width="240"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="220"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="240"
        align="center"
        v-if="actionPermission.showUserView || actionPermission.showUserUpdate || actionPermission.showUserDelete">
        <template slot-scope="scope">
          <el-button
            v-if="actionPermission.showUserView"
            size="small"
            type="primary"
            plain
            @click="showInfo(scope.row.id)">查看</el-button>
          <el-button
            v-if="actionPermission.showUserUpdate"
            size="small"
            type="primary"
            plain
            @click="editInfo(scope.row.id)">编辑</el-button>
          <el-button
            v-if="actionPermission.showUserDelete"
            size="small"
            type="danger"
            @click="deleteInfo(scope.row.id)">删除</el-button>
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

    <!-- 用户信息弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="姓名：" :label-width="formLabelWidth" :prop="dialogFormFlag !== 1 ? 'name' : ''">
          <el-input v-if="dialogFormFlag !== 1" v-model.trim="form.name" auto-complete="off" :maxlength=30></el-input>
          <span v-if="dialogFormFlag === 1">{{form.name}}</span>
        </el-form-item>
        <el-form-item label="联系电话：" :label-width="formLabelWidth" :prop="dialogFormFlag !== 1 ? 'phone' : ''">
          <el-input v-if="dialogFormFlag !== 1" v-model.trim="form.phone" auto-complete="off" :maxlength=20></el-input>
          <span v-if="dialogFormFlag === 1">{{form.phone}}</span>
        </el-form-item>
        <el-form-item label="邮箱：" :label-width="formLabelWidth" :prop="dialogFormFlag === 0 ? 'email' : ''">
          <el-input v-if="dialogFormFlag === 0" v-model.trim="form.email" auto-complete="off"></el-input>
          <span v-if="dialogFormFlag === 1 || dialogFormFlag === 2">{{form.email}}</span>
        </el-form-item>
        <el-form-item v-if="dialogFormFlag !== 1" label="密码：" :label-width="formLabelWidth" :prop="dialogFormFlag === 0 ? 'password' : ''">
          <el-input v-if="dialogFormFlag === 0" v-model.trim="form.password" type="password" auto-complete="off" placeholder="6-16位密码"></el-input>
          <el-input v-if="dialogFormFlag === 2" v-model.trim="form.password" type="password" auto-complete="off" placeholder="不修改密码时无需输入"></el-input>
        </el-form-item>
        <el-form-item label="创建时间：" v-if="dialogFormFlag !== 0" :label-width="formLabelWidth">
          <span>{{form.createTime}}</span>
        </el-form-item>
        <el-form-item label="角色权限：" :label-width="formLabelWidth" :prop="dialogFormFlag !== 1 ? 'roleIds' : ''">
          <el-select v-if="dialogFormFlag !== 1" v-model="form.roleIds" multiple placeholder="请选择,可多选" style="width: 100%;">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <span v-if="dialogFormFlag === 1">{{form.roleNames.toString()}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="closeDialog('form')">取 消</el-button>
        <el-button type="primary" @click="submit('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Global from 'assets/js/global'
import _ from 'underscore'

export default {
  data () {
    return {
      searchForm: {
        name: '',
        phone: '',
        email: '',
        startCreateTime: '',
        endCreateTime: ''
      },
      tableData: [{
        name: '',
        phone: '',
        email: '',
        createTime: ''
      }],
      pager: {
        curPage: 1,
        size: 20
      },
      dialogFormVisible: false,
      dialogFormFlag: 0, // 状态区分当前弹窗表单  0：新增 1：查看 2：编辑
      form: {
        id: '',
        name: '',
        phone: '',
        email: '',
        password: '',
        roleIds: [],
        roleNames: [],
        createTime: ''
      },
      formLabelWidth: '120px',
      roleOptions: [],
      totalNum: 0,
      rules: {
        name: [
          { required: true, message: '请输入名字', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: Global.REGEX.ALLPHONE, message: '手机格式不正确', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { pattern: Global.REGEX.EMAIL, message: '邮箱格式不正确', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur, change' }
        ],
        roleIds: [
          { required: true, message: '请选择角色权限', trigger: 'change' }
        ]
      },
      actionPermission: {
        showUserAdd: Global.hasActionPermission('user_add'),
        showUserUpdate: Global.hasActionPermission('user_update'),
        showUserView: Global.hasActionPermission('user_view'),
        showUserDelete: Global.hasActionPermission('user_delete')
      }
    }
  },
  computed: {
    dialogTitle () {
      if (this.dialogFormFlag === 0) return '新增用户'
      if (this.dialogFormFlag === 1) return '查看详情'
      if (this.dialogFormFlag === 2) return '编辑用户'
    }
  },
  created () {
    this.pager.curPage = 1
    this.getTableData()
    this.fetchRoleData()
  },
  methods: {
    getTableData: function () {
      var _vue = this
      _vue.$http.get('/api/v1.0/admins?name=' + _vue.searchForm.name +
        '&phone=' + _vue.searchForm.phone +
        '&email=' + _vue.searchForm.email.toLowerCase() +
        '&start_create_time=' + _vue.searchForm.startCreateTime +
        '&end_create_time=' + _vue.searchForm.endCreateTime +
        '&page=' + _vue.pager.curPage +
        '&per_page=' + _vue.pager.size).then(function (response) {
        _vue.tableData = response.data.data.rows
        _vue.totalNum = response.data.data.total
      })
    },
    // 获取所有角色
    fetchRoleData () {
      let _vue = this
      _vue.$http.get('/api/v1.0/roles?page=1&per_page=10000').then(function (response) {
        _vue.roleOptions = response.data.data.rows
      })
    },
    // 显示个人用户信息
    showInfo (data) {
      var _vue = this
      _vue.dialogFormFlag = 1
      _vue.$http.get('/api/v1.0/admin?id=' + data).then(function (response) {
        _vue.dialogFormVisible = true
        let result = response.data.data
        _vue.form.id = result.adminUser.id
        _vue.form.name = result.adminUser.name
        _vue.form.phone = result.adminUser.phone
        _vue.form.email = result.adminUser.email
        _vue.form.createTime = result.adminUser.createTime
        _vue.form.roleNames = _.pluck(result.adminUser.roles, 'roleName')
      })
    },
    // 删除个人用户信息
    deleteInfo (id) {
      var _vue = this
      _vue.$confirm('确定删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _vue.$http.put('/api/v1.0/admin/delete', {
          id: id
        }).then(function () {
          _vue.$message({
            type: 'success',
            message: '删除成功!',
            center: true
          })
          _vue.pager.curPage = 1
          _vue.getTableData()
        }).catch(() => {
          _vue.$message({
            type: 'error',
            message: '请稍后重试',
            center: true
          })
        })
      })
    },
    // 修改个人用户信息页面
    editInfo (id) {
      var _vue = this
      _vue.dialogFormFlag = 2
      _vue.$http.get('/api/v1.0/admin?id=' + id).then(function (response) {
        let result = response.data.data
        _vue.form.id = result.adminUser.id
        _vue.form.name = result.adminUser.name
        _vue.form.phone = result.adminUser.phone
        _vue.form.email = result.adminUser.email.toLowerCase()
        _vue.form.createTime = result.adminUser.createTime
        _vue.form.roleIds = _.pluck(response.data.data.adminUser.roles, 'roleId')
        _vue.dialogFormVisible = true
      })
    },
    // 新增用户
    addNewUser () {
      this.form.id = ''
      this.form.name = ''
      this.form.phone = ''
      this.form.email = ''
      this.form.password = ''
      this.form.roleIds = []
      this.dialogFormFlag = 0
      this.dialogFormVisible = true
    },
    handleCurrentChange: function (val) {
      var _vue = this
      _vue.pager.curPage = val
      _vue.getTableData()
    },
    closeDialog (formName) {
      this.dialogFormVisible = false
      if (this.dialogFormFlag === 0 || this.dialogFormFlag === 2) {
        this.$refs[formName].clearValidate()
      }
    },
    search () {
      this.pager.curPage = 1
      this.getTableData()
    },
    reset (formName) {
      this.$refs[formName].resetFields()
      this.pager.curPage = 1
      this.getTableData()
    },
    submit (formName) {
      let _vue = this
      if (_vue.dialogFormFlag === 0) {
        // 新增用户
        _vue.$refs[formName].validate((valid) => {
          if (valid) {
            _vue.$http.post('/api/v1.0/admin', {
              name: _vue.form.name,
              password: _vue.form.password,
              email: _vue.form.email.toLowerCase(),
              phone: _vue.form.phone,
              roleIds: _vue.form.roleIds.toString()
            }).then(function () {
              _vue.$message({
                type: 'success',
                message: '新增用户成功',
                center: true
              })
              _vue.dialogFormVisible = false
              _vue.pager.curPage = 1
              _vue.getTableData()
            }).catch(function (error) {
              let field = Global.extractErrorField(error)
              let code = Global.extractErrorCode(error)
              if (field === 'admin') {
                if (code === 'admin.phone.isExist') {
                  _vue.$message({
                    type: 'error',
                    message: '手机号已存在',
                    center: true
                  })
                } else if (code === 'admin.email.isExist') {
                  _vue.$message({
                    type: 'error',
                    message: '邮箱已存在',
                    center: true
                  })
                }
              } else {
                _vue.$message({
                  type: 'error',
                  message: '信息提交失败，请稍后重试',
                  center: true
                })
              }
            })
          }
        })
      } else if (_vue.dialogFormFlag === 2) {
        // 编辑用户
        // TODO: 验证用户唯一性，邮箱不能重复，邮箱是否可以修改
        _vue.$refs[formName].validate((valid) => {
          if (valid) {
            _vue.$http.put('/api/v1.0/admin', {
              id: _vue.form.id,
              name: _vue.form.name,
              password: _vue.form.password,
              email: _vue.form.email.toLowerCase(),
              phone: _vue.form.phone,
              roleIds: _vue.form.roleIds.toString()
            }).then(function () {
              _vue.$message({
                type: 'success',
                message: '编辑信息成功',
                center: true
              })
              _vue.dialogFormVisible = false
              _vue.getTableData()
            }).catch(function () {
              _vue.$message({
                type: 'error',
                message: '信息提交失败，请稍后重试',
                center: true,
                showClose: true
              })
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
  @import '~assets/css/variable';
</style>
