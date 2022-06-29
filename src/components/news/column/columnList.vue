<template>
  <div class="table-list-wrap">
    <div class="list-title">专栏管理</div>
    <div class="list-search-wrap">
      <el-form :inline="true" class="form-inline" label-width="70px">
        <el-button type="primary" @click="batchDel()">删除</el-button>
        <el-button type="primary" @click="addTopic">新增</el-button>
        <el-form-item style="margin-left: 20px;">
          <el-input v-model="searchForm.text" clearable placeholder="输入专栏ID/专栏标题/作者检索" style="width: 400px;"></el-input>
        </el-form-item>
        <el-button type="primary" @click="searchNews">查询</el-button>
      </el-form>
    </div>
    <el-table
      style="width: 100%"
      ref="multipleTable"
      :data="topicList"
      border
      header-row-class-name="tableheader selection"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column
        prop="id"
        label="专栏ID"
        width="100px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="title"
        label="专栏名称"
        width="200px"
        align="center">
        <template slot-scope="scope">
          <p @click="goDetail(scope.row)" class="canClick">{{scope.row.title}}</p>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="typeName"
        label="专栏分类"
        width="150px"
        align="center">
      </el-table-column> -->
      <el-table-column
        label="专栏封面"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <img :src="scope.row.preImg | filterQiniuMooreImage" alt="" style="width:80px;height:80px">
        </template>
      </el-table-column>
      <el-table-column
        prop="createName"
        label="作者"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="tags"
        label="标签"
        width="150px"
        align="center">
      </el-table-column>
      <!-- <el-table-column
        prop="url"
        label="链接"
        width="200px"
        align="center">
      </el-table-column> -->
      <!-- <el-table-column
        prop="externalUrl"
        label="专栏动态"
        width="200px"
        align="center">
      </el-table-column> -->
      <el-table-column
        prop="clickNumber"
        label="点击人数"
        width="200px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="subscribeNumber"
        label="订阅人数"
        width="200px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="专栏创建时间"
        width="160px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="modifyTime"
        label="专栏内容更新时间"
        width="160px"
        align="center">
      </el-table-column>
      <el-table-column
        label="状态"
        width="140px"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.display === 1">显示</span>
          <span v-if="scope.row.display !== 1">不显示</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <span class="text-link" @click="edit(scope.row)">编辑</span>
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
  </div>
</template>

<script>
import _ from 'underscore'

export default {
  data () {
    return {
      topicList: [],
      searchForm: {
        text: ''
      },
      pager: {
        page: 1,
        size: 20
      },
      totalNum: 0,
      multipleSelection: ''
    }
  },
  created () {
    let _vue = this
    _vue.fetchTopicList()
  },
  methods: {
    goDetail (row) {
      this.$router.push({
        path: '/news/zhuanlan/imgText?id=' + row.id
      })
      window.sessionStorage.setItem('news-title', row.title)
    },
    fetchTopicList () {
      // 获取专栏列表
      let _vue = this
      _vue.$http.get(`/api/v1.0/news/aggregate/collection_list?page=${_vue.pager.page}&per_page=${_vue.pager.size}&keyword=${_vue.searchForm.text}&type=4`).then((response) => {
        console.log('获取的专栏列表', response.data.data)
        _vue.topicList = response.data.data.rows
        _vue.totalNum = response.data.data.total
      })
    },
    searchNews () {
      let _vue = this
      _vue.pager.page = 1
      _vue.fetchTopicList()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleCurrentChange (val) {
      let _vue = this
      _vue.pager.page = val
      _vue.fetchTopicList()
    },
    batchDel (row) {
      // 删除专题
      let _vue = this
      if (row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _vue.$http.put('/api/v1.0/news/topic/delete', {
            str: row.id.toString()
          }).then(() => {
            _vue.$message({
              type: 'success',
              message: '删除成功',
              center: true
            })
            _vue.pager.page = 1
            _vue.fetchTopicList()
          }).catch(() => {
            _vue.$message({
              type: 'error',
              message: '请稍后重试',
              center: true
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
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
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let ids = _.pluck(_vue.multipleSelection, 'id')
            _vue.$http.put('/api/v1.0/news/topic/delete', {
              str: ids.toString()
            }).then(() => {
              _vue.$message({
                type: 'success',
                message: '删除成功',
                center: true
              })
              _vue.pager.page = 1
              _vue.fetchTopicList()
            }).catch(() => {
              _vue.$message({
                type: 'error',
                message: '请稍后重试',
                center: true
              })
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      }
    },
    edit (row) {
      // 编辑专题
      this.$router.push({
        path: '/news/zhuanlan/edit',
        query: {
          id: row.id
        }
      })
    },
    addTopic () {
      // 新增专题
      this.$router.push({
        path: '/news/zhuanlan/edit'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";

  .list-title {
    font-size: 18px;
    margin-bottom: 20px;
  }
  .canClick {
    color: #409eff;
    cursor: pointer;
    text-decoration: underline;
  }
</style>
