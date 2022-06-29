<template>
  <div class="table-list-wrap">
    <div class="list-header-action-wrap">
      <el-button type="primary" size="medium" @click="addRole" v-if="actionPermission.showRoleAdd">新增角色</el-button>
    </div>
    <el-table
      :data="tableData"
      header-row-class-name="tableheader"
      border
      style="width: 100%">
      <el-table-column
        prop="name"
        label="角色名称"
        align="center"
        width="200">
      </el-table-column>
      <el-table-column
        prop="notes"
        label="注释"
        align="center"
        min-width="220">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center"
        width="220">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center">
        <template slot-scope="scope">
          <el-button
            v-if="actionPermission.showRoleUpdate"
            type="primary"
            plain
            size="small"
            @click="editInfo(scope.row)">编辑</el-button>
          <el-button
            v-if="actionPermission.showRoleDelete"
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
    <!-- 新增 & 编辑 弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="角色名称" label-width="100px" prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="注释" label-width="100px" prop="notes">
          <el-input v-model="form.notes" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="设置权限" label-width="100px" prop="permit">
          <div class="tree-wrap">
            <el-tree
              v-loading="loadingTree"
              :data="permitData"
              :default-expanded-keys="expandedKeys"
              show-checkbox
              default-expand-all
              node-key="id"
              ref="tree">
            </el-tree>
          </div>
        </el-form-item>
        <div class="dialog-btn-wrap">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureAdd">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Global from 'assets/js/global'
import _ from 'underscore'

export default {
  data () {
    let checkPermit = (rule, value, callback) => {
      let keys = this.$refs.tree.getCheckedKeys()
      if (keys.length === 0) {
        callback(new Error('请设置权限'))
      } else {
        callback()
      }
    }
    return {
      tableData: [],
      pager: {
        curPage: 1,
        size: 20
      },
      form: {
        id: '',
        name: '',
        notes: ''
      },
      dialogTitle: '标题',
      formType: '',
      dialogFormVisible: false,
      loadingTree: true,
      expandedKeys: [],
      permitData: [],
      totalNum: 0,
      rules: {
        name: [
          { required: true, message: '请填写角色名称', trigger: 'blur' }
        ],
        notes: [
          { required: true, message: '请填写角色注释', trigger: 'blur' }
        ],
        permit: [
          { validator: checkPermit }
        ]
      },
      actionPermission: {
        showRoleAdd: Global.hasActionPermission('role_add'),
        showRoleUpdate: Global.hasActionPermission('role_update'),
        showRoleDelete: Global.hasActionPermission('role_delete')
      }
    }
  },
  created () {
    this.getData()
    this.fetchPermitData()
  },
  methods: {
    getData () {
      var _vue = this
      _vue.$http.get('/api/v1.0/roles?page=' + _vue.pager.curPage + '&per_page=' + _vue.pager.size).then(function (response) {
        _vue.tableData = response.data.data.rows
        _vue.totalNum = response.data.data.total
      })
    },
    handleCurrentChange (val) {
      this.pager.curPage = val
      this.getData()
    },
    fetchPermitData () {
      // 获取当前所有权限
      var _vue = this
      _vue.$http.get('/api/v1.0/permits').then(function (response) {
        let result = response.data.data
        // 可以设置放开权限的level
        _vue.permitData = Global.formatPermitData(_.filter(result.permits, (item) => {
          return item.level <= 3
        }))
      })
    },
    addRole: function () {
      this.formType = 'add'
      this.dialogTitle = '新增角色'
      this.form.name = ''
      this.form.notes = ''
      this.dialogFormVisible = true
      this.delaySetCheckedKey([])
    },
    deleteInfo: function (data) {
      console.log(data)
      let _vue = this
      _vue.$confirm('确认删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _vue.$http.delete('/api/v1.0/role?id=' + data).then(() => {
          _vue.pager.curPage = 1
          _vue.getData()
          _vue.$message({
            type: 'success',
            message: '删除成功!',
            center: true
          })
        }).catch(() => {
          _vue.$message({
            type: 'error',
            message: '请稍后重试',
            center: true
          })
        })
      }).catch(() => {
      })
    },
    sureAdd () {
      var _vue = this
      _vue.$refs.form.validate((valid) => {
        if (valid) {
          var keys = _.uniq(_.union(_vue.$refs.tree.getHalfCheckedKeys(), _vue.$refs.tree.getCheckedKeys()))
          // 区分新增或编辑
          if (_vue.formType === 'add') {
            _vue.$http.post('/api/v1.0/role', {
              name: _vue.form.name,
              notes: _vue.form.notes,
              resourceIds: keys.toString()
            }).then(function (res) {
              _vue.dialogFormVisible = false
              _vue.$message({
                type: 'success',
                message: '新增角色成功!',
                center: true
              })
              _vue.pager.curPage = 1
              _vue.getData()
            }).catch((error) => {
              let field = Global.extractErrorField(error)
              if (field === 'admin') {
                _vue.$message({
                  type: 'error',
                  message: '邮箱或手机号已存在',
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
          } else if (_vue.formType === 'update') {
            _vue.$http.put('/api/v1.0/role', {
              id: _vue.form.id,
              name: _vue.form.name,
              notes: _vue.form.notes,
              resourceIds: keys.toString()
            }).then(function (res) {
              _vue.dialogFormVisible = false
              _vue.$message({
                type: 'success',
                message: '编辑权限成功!',
                center: true
              })
              _vue.getData()
            }).catch(() => {
              _vue.$message({
                type: 'error',
                message: '请稍后重试',
                center: true
              })
            })
          }
        }
      })
    },
    editInfo: function (data) {
      var _vue = this
      _vue.formType = 'update'
      _vue.$http.get('/api/v1.0/role?id=' + data.id).then(function (res) {
        let result = res.data.data.role
        _vue.form = {
          id: result.id,
          name: result.name,
          notes: result.notes
        }
        _vue.dialogTitle = '编辑权限'
        let checkedKeys = _.pluck(_.filter(result.permits, (item) => {
          return item.level === 2
        }), 'resourceId')
        console.log(checkedKeys)
        _vue.dialogFormVisible = true
        // TODO：设置值时，只能设置子节点，不能设置父节点，父节点一旦选中，默认会选中下面所有子节点
        _vue.delaySetCheckedKey(checkedKeys)
      })
    },
    delaySetCheckedKey (checkedKeys) {
      // 延迟设置选中tree值，tree组件需要先展示，才能设置值
      let _vue = this
      _vue.loadingTree = true
      setTimeout(() => {
        _vue.$refs.tree.setCheckedKeys(checkedKeys)
        // 手动控制折叠
        // TODO: 动态控制展开和折叠可抽出方法
        let nodes = _vue.$refs.tree.store._getAllNodes()
        _.each(nodes, (node) => {
          node.expanded = true
        })
        _vue.loadingTree = false
      }, 1000)
    }
  }
}
</script>

<style lang="scss">
  @import '~assets/css/variable';
</style>
