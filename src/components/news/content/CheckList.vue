<template>
  <div class="table-list-wrap">
    <div class="list-title">审核库</div>
    <div class="list-search-wrap">
      <el-form :inline="true" class="form-inline" label-width="70px">
        <el-form-item label="创建日期">
          <el-date-picker
            placeholder="开始日期"
            style="width: 140px;"
            v-model="searchForm.startTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            clearable>
          </el-date-picker>
        </el-form-item>
        <span style="padding-right: 10px;">至</span>
        <el-form-item>
          <el-date-picker
            placeholder="结束日期"
            style="width: 140px;"
            v-model="searchForm.endTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item style="margin-left: 20px;">
          <el-input v-model="searchForm.text" clearable placeholder="输入新闻ID/新闻标题/标签检索" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.source" placeholder="请选择渠道" style="width: 180px;" @change="changeChannelSource">
            <el-option label="全部渠道" value=""></el-option>
            <el-option label="PC" value="pc"></el-option>
            <el-option label="APP" value="app"></el-option>
            <el-option label="移动站" value="wx"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.channel" placeholder="请选择频道" style="width: 300px;">
            <el-option label="全部频道" value=""></el-option>
            <el-option
              v-for="(item, index) in contentNewsTypeOpts"
              :key="index"
              :value="item.id"
              :label="'频道ID ' + item.id + ' —— ' + item.pcName + '(PC)、' + item.wxName + '(移动站)、' + item.appName + '(APP)'">
              <span>频道ID {{item.id}} —— {{item.pcName}}(PC)、{{item.wxName}}(移动站)、{{item.appName}}(APP)</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="searchData">搜索</el-button>
      </el-form>
      <div style="margin-bottom: 20px;">
        <el-button type="primary" @click="batchDel()">删除</el-button>
        <el-button type="primary" @click="createNews">新增新闻</el-button>
      </div>
    </div>
    <el-table
      style="width: 100%"
      ref="multipleTable"
      border
      :data="newsList"
      header-row-class-name="tableheader selection"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column
        prop="id"
        label="新闻ID"
        width="100px"
        align="center">
      </el-table-column>
      <el-table-column
        label="新闻标题"
        width="200px"
        align="center">
        <template slot-scope="scope">
          <span class="text-link" @click="viewDetail(scope.row)">{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="source"
        label="新闻来源"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="author"
        label="新闻作者"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="autoCategory"
        label="新闻分类"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="realReadNumber"
        label="真实阅读"
        width="120px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="fictitiousReadNumber"
        label="虚拟阅读"
        width="120px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="commentNumber"
        label="评论数"
        width="120px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="collectionNumber"
        label="收藏数"
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
        prop="modifyTime"
        label="更新时间"
        width="160px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="tags"
        label="标签"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="recommendStatus"
        label="是否推荐"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="150px"
        align="center">
        <!-- <template slot-scope="scope">
          <span v-if="scope.row.release === 1">已审核</span>
          <span v-if="scope.row.release !== 1">未审核</span>
        </template> -->
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
import Global from 'assets/js/global'
import _ from 'underscore'

export default {
  data () {
    return {
      newsList: [],
      searchForm: {
        startTime: '',
        endTime: '',
        text: '',
        channel: (this.$route.query && this.$route.query.channelId) || '', // 频道
        source: '' // 渠道
      },
      pager: {
        page: 1,
        size: 20
      },
      totalNum: 0,
      multipleSelection: '',
      contentNewsTypeOpts: []
    }
  },
  created () {
    let _vue = this
    _vue.fetchNewsList()
    _vue.fetchContentNewsType()
  },
  methods: {
    fetchContentNewsType () {
      // 获取新闻频道
      let _vue = this
      _vue.$http.get('/api/v1.0/news/channel/list?source=' + _vue.searchForm.source).then((response) => {
        _vue.contentNewsTypeOpts = response.data.data.pc
      })
    },
    fetchNewsList () {
      // 获取新闻列表
      let _vue = this
      _vue.$http.get('/api/v1.0/news/content/audit_news?page=' + _vue.pager.page +
        '&per_page=' + _vue.pager.size +
        '&beginTime=' + _vue.searchForm.startTime +
        '&endTime=' + _vue.searchForm.endTime +
        '&text=' + _vue.searchForm.text +
        '&source=' + _vue.searchForm.source +
        '&channelId=' + _vue.searchForm.channel).then((response) => {
        _vue.newsList = response.data.data.rows
        _vue.totalNum = response.data.data.total
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleCurrentChange (val) {
      let _vue = this
      _vue.pager.page = val
      _vue.fetchNewsList()
    },
    changeChannelSource () {
      // 切换渠道
      this.fetchContentNewsType()
      this.searchForm.channel = ''
    },
    batchDel (row) {
      // 删除新闻
      let _vue = this
      if (row) {
        _vue.$http.put('/api/v1.0/news/content/delete', {
          str: row.id.toString()
        }).then(() => {
          _vue.$message({
            type: 'success',
            message: '删除成功',
            center: true
          })
          _vue.pager.page = 1
          _vue.fetchNewsList()
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
            message: '请至少选择一条新闻',
            center: true
          })
        } else {
          let ids = _.pluck(_vue.multipleSelection, 'id')
          _vue.$http.put('/api/v1.0/news/content/delete', {
            str: ids.toString()
          }).then(() => {
            _vue.$message({
              type: 'success',
              message: '删除成功',
              center: true
            })
            _vue.pager.page = 1
            _vue.fetchNewsList()
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
      let _vue = this
      _vue.pager.page = 1
      _vue.fetchNewsList()
    },
    edit (row) {
      window.open(Global.CONFIG.FRONT_URL + '/#/news/content/new?id=' + row.id)
    },
    viewDetail (row) {
      window.open(Global.CONFIG.FRONT_URL + '/#/news/content/detail/' + row.id)
    },
    createNews () {
      window.open(Global.CONFIG.FRONT_URL + '/#/news/content/new')
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
</style>
