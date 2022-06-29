<template>
  <div class="table-list-wrap">
    <div class="list-title">分类库</div>
    <div class="list-search-wrap">
      <el-form :inline="true" class="form-inline" label-width="70px">
        <el-form-item>
          <el-input clearable v-model="searchForm.text" placeholder="输入分类ID/分类名称进行搜索" style="width: 300px"></el-input>
        </el-form-item>
        <el-button type="primary" @click="searchData">搜索</el-button>
      </el-form>
      <div style="margin-bottom: 20px;">
        <el-button type="primary" @click="batchDel()">删除</el-button>
        <el-button type="primary" @click="showAddTagDialog">新增分类</el-button>
      </div>
    </div>
    <el-table
      style="width: 100%"
      ref="multipleTable"
      border
      header-row-class-name="tableheader selection"
      :data="tableData"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column
        prop="id"
        label="分类ID"
        width="80px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="分类名称"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="branchTagNumber"
        label="下属标签数"
        width="120px"
        align="center">
      </el-table-column>
      <el-table-column
        label="浏览量"
        width="120px"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.viewNumber || scope.row.viewNumber === 0 ? scope.row.viewNumber : '-'}}</span>
          <span class="btn-color" @click="getViewNumber(scope.row.id)">刷新</span>
        </template>
      </el-table-column>
      <el-table-column
        label="涵盖内容数"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.contentNumber || scope.row.contentNumber === 0 ? scope.row.contentNumber : '-'}}</span>
          <span class="btn-color" @click="getContentNumber(scope.row.id)">刷新</span>
        </template>
      </el-table-column>
      <el-table-column
        label="分类说明"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.description || '暂无说明'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="160px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="modifyTime"
        label="更新时间"
        width="160px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="cloudAdminUserName"
        label="创建者"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <span class="text-link" @click="editTag(scope.row)">编辑</span>
          <span class="text-link" @click="batchDel(scope.row)">删除</span>
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
    <!-- 新增/编辑 标签弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form :model="tagForm" label-width="100px">
        <el-form-item label="分类名称">
          <el-input v-model="tagForm.name"></el-input>
        </el-form-item>
        <el-form-item label="分类说明">
          <el-input type="textarea" :rows="4" v-model="tagForm.description"></el-input>
        </el-form-item>
        <div class="action-wrap">
          <el-button type="primary" @click="submitTag">保存</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import _ from 'underscore'
export default {
  data () {
    return {
      pager: {
        size: 20,
        page: 1
      },
      searchForm: {
        text: ''
      },
      totalNum: 0,
      tableData: [],
      multipleSelection: '',
      dialogTitle: '新增分类',
      tagForm: {
        name: '',
        description: ''
      },
      dialogVisible: false
    }
  },
  created () {
    let _vue = this
    _vue.getData()
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleCurrentChange (val) {
      // 下一页
      this.pager.page = val
      this.getData()
    },
    getData () {
      let _vue = this
      _vue.$http.get('/api/v1.0/news/tag/tag_group/lists?' +
        'page=' + _vue.pager.page +
        '&per_page=' + _vue.pager.size +
        '&text=' + _vue.searchForm.text).then((response) => {
        _vue.tableData = response.data.data.rows
        _vue.totalNum = response.data.data.total
      })
    },
    showAddTagDialog () {
      // 添加标签弹窗
      let _vue = this
      _vue.dialogVisible = true
      _vue.tagForm = {
        name: '',
        description: ''
      }
    },
    batchDel (row) {
      // 删除标签
      let _vue = this
      if (row) {
        _vue.$http.put('/api/v1.0/news/tag/delete_group', {
          str: row.id.toString()
        }).then(() => {
          _vue.$message({
            type: 'success',
            message: '删除成功',
            center: true
          })
          _vue.pager.page = 1
          _vue.getData()
        }).catch(() => {
          _vue.$message({
            type: 'error',
            message: '请稍后重试',
            center: true
          })
        })
      } else {
        if (_vue.multipleSelection.length === 0) {
          _vue.$message({
            type: 'warning',
            message: '请至少选择一条数据',
            center: true
          })
        } else {
          let ids = _.pluck(_vue.multipleSelection, 'id')
          _vue.$http.put('/api/v1.0/news/tag/delete_group', {
            str: ids.toString()
          }).then(() => {
            _vue.$message({
              type: 'success',
              message: '删除成功',
              center: true
            })
            _vue.pager.page = 1
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
    },
    searchData () {
      this.pager.page = 1
      this.getData()
    },
    editTag (row) {
      // 编辑标签
      let _vue = this
      _vue.dialogTitle = '编辑分类'
      _vue.tagForm = {
        name: row.name,
        description: row.description
      }
      _vue.tagForm.id = row.id
      _vue.dialogVisible = true
    },
    submitTag () {
      // 提交
      let _vue = this
      _vue.$http.post('/api/v1.0/news/tag/add_group', _vue.tagForm).then(() => {
        _vue.$message({
          type: 'success',
          message: '保存成功',
          center: true
        })
        _vue.dialogVisible = false
        _vue.pager.page = 1
        _vue.getData()
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    getViewNumber (id) {
      this.$http.post('/api/v1.0/news/tag/tag_group/view_number', {
        tags: [id]
      }).then(res => {
        let data = res.data.data.rows
        if (data.length) {
          data.forEach(obj => {
            let view = this.tableData.find(_ => {
              return _.id === obj.id
            })
            if (view) {
              view.viewNumber = obj.number
            }
          })
        } else {
          let view = this.tableData.find(_ => {
            return _.id === id
          })
          if (view) {
            view.viewNumber = 0
          }
        }
        this.$nextTick(() => {
          this.tableData = JSON.parse(JSON.stringify(this.tableData))
        })
      })
    },
    getContentNumber (id) {
      this.$http.post('/api/v1.0/news/tag/tag_group/content_number', {
        tags: [id]
      }).then(res => {
        let data = res.data.data.rows
        if (data.length) {
          data.forEach(obj => {
            let view = this.tableData.find(_ => {
              return _.id === obj.id
            })
            if (view) {
              view.contentNumber = obj.number
            }
          })
        } else {
          let view = this.tableData.find(_ => {
            return _.id === id
          })
          if (view) {
            view.contentNumber = 0
          }
        }
        this.$nextTick(() => {
          this.tableData = JSON.parse(JSON.stringify(this.tableData))
        })
      })
    }
  }
}
</script>
<style>
  .list-title {
    font-size: 18px;
    margin-bottom: 20px;
  }
  .btn-color {
    color: #409eff;
    cursor: pointer;
  }
  .btn-color:hover {
    text-decoration: underline;
  }
</style>
