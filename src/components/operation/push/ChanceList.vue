<template>
  <div class="table-list-wrap">
    <div class="list-title">机会消息</div>
    <div class="list-search-wrap">
      <el-form :inline="true" class="form-inline" label-width="70px">
        <el-form-item label="创建日期">
          <el-date-picker
            placeholder="开始日期"
            style="width: 140px;"
            v-model="createTimeS"
            value-format="yyyy-MM-dd HH:mm:ss"
            clearable>
          </el-date-picker>
        </el-form-item>
        <span style="padding-right: 10px;">至</span>
        <el-form-item>
          <el-date-picker
            placeholder="结束日期"
            style="width: 140px;"
            v-model="createTimeE"
            value-format="yyyy-MM-dd HH:mm:ss"
            clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item style="margin-left: 20px;">
          <el-input v-model="text" clearable placeholder="输入推送ID/消息名称/创建者/标签检索" style="width: 300px;"></el-input>
        </el-form-item>
        <el-button type="primary" @click="searchData">搜索</el-button>
      </el-form>
      <div style="margin-bottom: 20px;">
        <el-button type="primary" @click="batchDel()">删除</el-button>
        <el-button type="primary" @click="createChanceMessage">新增机会消息</el-button>
      </div>
    </div>
    <el-table
      style="width: 100%"
      max-height="600"
      border
      :data="messageList"
      ref="multipleTable"
      header-row-class-name="tableheader selection"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column
        prop="id"
        label="推送ID"
        width="100px"
        align="center">
      </el-table-column>
      <el-table-column
        label="机会名称"
        width="200px"
        align="center">
        <template slot-scope="scope">
          <span class="text-link" @click="viewDetail(scope.row)">{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="机会头像"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <img class="cover-img" :src="scope.row.authorAvatar | filterQiniuMooreImage" alt="">
        </template>
      </el-table-column>
      <el-table-column
        label="机会封面"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <img class="cover-img" :src="scope.row.img | filterQiniuMooreImage" alt="">
        </template>
      </el-table-column>
      <el-table-column
        prop="author"
        label="作者"
        width="120px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="content"
        label="机会描述"
        width="200px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="action"
        label="对应页面"
        width="200px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="numOfRecipients"
        label="发送人数"
        width="120px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="numOfClick"
        label="点击人数"
        width="120px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="displayTags"
        label="标签"
        width="120px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="160px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="sendTime"
        label="发送时间"
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
        label="显示状态"
        width="120px"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isShow === 1">显示</span>
          <span v-if="scope.row.isShow !== 1">不显示</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="creater"
        label="创建者"
        width="160px"
        align="center">
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
        :page-size="per_page"
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
      msgType: 0,
      text: '',
      createTimeS: '',
      createTimeE: '',
      page: 1,
      per_page: 10,
      messageList: [],
      multipleSelection: '',
      totalNum: 0
    }
  },
  created () {
    let _vue = this
    _vue.fetchTableData()
  },
  methods: {
    fetchTableData () {
      let _vue = this
      _vue.$http.get('/api/v1.0/messages?msgType=' + _vue.msgType + '&text=' + _vue.text +
        '&createTimeS=' + _vue.createTimeS + '&createTimeE=' + _vue.createTimeE +
        '&page=' + _vue.page + '&per_page=' + _vue.per_page).then((response) => {
        _vue.messageList = response.data.data.rows
        _vue.totalNum = response.data.data.total
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    searchData () {
      // 搜索
      let _vue = this
      _vue.page = 1
      _vue.fetchTableData()
    },
    edit (row) {
      // 编辑详情
      this.$router.push({
        path: '/operation/push/message/new',
        query: {
          id: row.id
        }
      })
    },
    batchDel (row) {
      // 删除推送
      let _vue = this
      if (row) {
        _vue.$http.put('/api/v1.0/message/delete', {
          str: row.id.toString()
        }).then(() => {
          _vue.$message({
            type: 'success',
            message: '删除成功',
            center: true
          })
          _vue.page = 1
          _vue.fetchTableData()
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
            message: '请至少选择一条消息',
            center: true
          })
        } else {
          let ids = _.pluck(_vue.multipleSelection, 'id')
          console.log(ids)
          // TODO: 需要支持批量删除
          /*
          _vue.$http.put('/api/v1.0/message/delete', {
            str: ids.toString()
          }).then(() => {
            _vue.$message({
              type: 'success',
              message: '删除成功',
              center: true
            })
            _vue.page = 1
            _vue.fetchTableData()
          }).catch(() => {
            _vue.$message({
              type: 'error',
              message: '请稍后重试',
              center: true
            })
          })
          */
        }
      }
    },
    viewDetail (row) {
      // 查看详情
      this.$router.push({
        name: 'messageDetail',
        params: {
          id: row.id
        }
      })
    },
    handleCurrentChange (val) {
      // 分页
      let _vue = this
      _vue.page = val
      _vue.fetchTableData()
    },
    createChanceMessage () {
      // 创建机会消息
      this.$router.push({
        path: '/operation/push/message/new',
        query: {
          msgtype: 'chance'
        }
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
  .cover-img {
    width: 80px;
  }
</style>
