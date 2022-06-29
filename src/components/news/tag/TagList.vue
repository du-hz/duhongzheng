<template>
  <div class="table-list-wrap">
    <div class="list-title">标签库</div>
    <div class="list-search-wrap">
      <el-form :inline="true" class="form-inline" label-width="70px">
        <el-form-item>
          <el-select v-model="searchForm.classId">
            <el-option label="全部标签分类" value=""></el-option>
            <el-option v-for="classItem in classOpts" :key="classItem.id" :label="classItem.name" :value="classItem.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="searchForm.text" placeholder="输入标签ID/标签名称进行搜索" style="width: 300px"></el-input>
        </el-form-item>
        <el-button type="primary" @click="searchData">搜索</el-button>
      </el-form>
      <div style="margin-bottom: 20px;">
        <el-button type="primary" @click="batchDel()">删除</el-button>
        <el-button type="primary" @click="showAddTagDialog">新增标签</el-button>
      </div>
    </div>
    <el-table
      style="width: 100%"
      ref="multipleTable"
      border
      max-height="500"
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
        label="标签ID"
        width="80px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="标签名称"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        label="所属分类"
        width="120px"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.tagCategory">{{scope.row.tagCategory}}</span>
          <span v-if="!scope.row.tagCategory">暂无</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="viewNumber"
        label="浏览量"
        width="120px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="contentNumber"
        label="涵盖内容数"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        label="标签说明"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.description">{{scope.row.description}}</span>
          <span v-if="!scope.row.description">暂无说明</span>
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
        prop="createAdminName"
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
        <el-form-item label="标签名称">
          <el-input v-model="tagForm.name" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="所属分类">
          <el-select v-model="tagForm.classId">
            <el-option v-for="classItem in classOpts" :key="classItem.id" :label="classItem.name" :value="classItem.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签说明">
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
        size: 10,
        page: 1
      },
      searchForm: {
        text: '',
        classId: ''
      },
      totalNum: 0,
      tableData: [],
      multipleSelection: '',
      classOpts: [],
      dialogTitle: '新增标签',
      tagForm: {
        name: '',
        classId: '',
        description: ''
      },
      dialogVisible: false
    }
  },
  created () {
    let _vue = this
    _vue.getData()
    _vue.fetchTagClass()
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
      _vue.$http.get('/api/v1.0/news/tag/lists?' +
        'page=' + _vue.pager.page +
        '&per_page=' + _vue.pager.size +
        '&text=' + _vue.searchForm.text +
        '&classId=' + _vue.searchForm.classId).then((response) => {
        _vue.tableData = response.data.data.rows
        _vue.totalNum = response.data.data.total
      })
    },
    fetchTagClass () {
      // 获取标签分类
      let _vue = this
      _vue.$http.get('/api/v1.0/news/tag/all_groups').then((response) => {
        _vue.classOpts = response.data.data.data
      })
    },
    showAddTagDialog () {
      // 添加标签弹窗
      let _vue = this
      _vue.dialogVisible = true
      _vue.tagForm = {
        name: '',
        classId: '',
        description: ''
      }
    },
    batchDel (row) {
      // 删除标签
      let _vue = this
      if (row) {
        _vue.$http.put('/api/v1.0/news/tag/delete_tag', {
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
          _vue.$http.put('/api/v1.0/news/tag/delete_tag', {
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
      _vue.dialogTitle = '编辑标签'
      _vue.tagForm = {
        name: row.name,
        classId: row.classId,
        description: row.description
      }
      _vue.tagForm.id = row.id
      _vue.dialogVisible = true
    },
    submitTag () {
      // 提交
      let _vue = this
      _vue.$http.post('/api/v1.0/news/tag/add_tag', _vue.tagForm).then(() => {
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
    }
  }
}
</script>
<style>
  .list-title {
    font-size: 18px;
    margin-bottom: 20px;
  }
</style>
