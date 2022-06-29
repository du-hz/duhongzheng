<template>
  <div class="table-list-wrap">
    <div class="list-title">今日热点频道管理</div>
    <el-row :gutter="40">
      <el-col :span="12">
        <div class="news-list left">
          <div class="list-search-wrap">
            <el-input v-model="keyword" clearable style="width: 400px;" placeholder="输入新闻ID/新闻标题/标签检索"></el-input>
            <el-button type="primary" @click="searchNews">搜索</el-button>
          </div>
          <el-table
            :data="newsList"
            height="700"
            header-row-class-name="tableheader"
            :row-class-name="tableRowClassName"
            border
            style="width: 100%;">
            <el-table-column
              width="50"
              align="center">
              <template slot-scope="scope" v-if="scope.row.isHotspot">
                <i class="action-icon el-icon-circle-plus-outline" @click="addHot(scope.row.id)"></i>
              </template>
            </el-table-column>
            <el-table-column
              prop="id"
              label="ID"
              width="70"
              align="center">
            </el-table-column>
            <el-table-column
              prop="title"
              label="新闻标题"
              width="200"
              align="center">
            </el-table-column>
            <el-table-column
              prop="source"
              label="新闻来源"
              width="130"
              align="center">
            </el-table-column>
            <el-table-column
              prop="author"
              label="新闻作者"
              width="120"
              align="center">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              width="100"
              align="center">
            </el-table-column>
            <el-table-column
              prop="offlineTime"
              label="审核时间"
              align="center">
            </el-table-column>
          </el-table>
          <div class="pager-wrap">
            <el-pagination
              background
              layout="total, prev, pager, next"
              :total="totalNum"
              :page-size="pager.size"
              :current-page.sync="pager.page"
              @current-change="handleCurrentChange">
            </el-pagination>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="news-list right">
          <div class="list-search-wrap" style="margin-bottom: 60px;">
            <!-- <el-button @click="saveHotNews" type="primary">保存</el-button>
            <span style="color: #666;display: inline-block;margin-left: 20px;">添加、删除和排序后请保存后才能同步</span> -->
          </div>
          <el-table
            :data="hotNewsList"
            height="700"
            row-key="bussinessId"
            header-row-class-name="tableheader"
            border
            class="hot-news-table"
            style="width: 100%;">
            <el-table-column
              width="50"
              align="center">
              <template slot-scope="scope">
                <i class="action-icon el-icon-delete" @click="deleteHot(scope.row.id, scope.row.type)"></i>
              </template>
            </el-table-column>
            <el-table-column
              prop="id"
              label="ID"
              width="70"
              align="center">
            </el-table-column>
            <el-table-column
              prop="title"
              label="新闻标题"
              width="200"
              align="center">
            </el-table-column>
            <el-table-column
              prop="source"
              label="新闻来源"
              width="130"
              align="center">
            </el-table-column>
            <el-table-column
              prop="author"
              label="新闻作者"
              width="120"
              align="center">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              width="100"
              align="center">
            </el-table-column>
            <el-table-column
              prop="offlineTime"
              label="审核时间"
              align="center">
            </el-table-column>
            <el-table-column
              width="50"
              label="操作"
              align="center">
              <template slot-scope="scope">
                <span v-if="!(scope.$index== 0 && hotObj.page==1)" class="setTop" @click="setTop(scope.row.id, scope.row.type)">置顶</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="pager-wrap">
            <el-pagination
              background
              layout="total, prev, pager, next"
              :total="hotObj.num"
              :page-size="hotObj.size"
              :current-page.sync="hotObj.page"
              @current-change="hotObjChange">
            </el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from 'underscore'

export default {
  data () {
    return {
      newsList: [],
      hotNewsList: [],
      keyword: '',
      pager: {
        page: 1,
        size: 20
      },
      totalNum: 0,
      hotObj: {
        num: 0,
        page: 1,
        size: 20
      }
    }
  },
  computed: {
    idList () {
      return _.pluck(this.hotNewsList, 'bussinessId') || []
    }
  },
  created () {
    let _vue = this
    _vue.fetchNewsList()
    _vue.fetchHotNewsList()
  },
  mounted () {
    let _vue = this
    let table = document.querySelector('.hot-news-table tbody')
    window.Sortable.create(table, {
      onEnd ({ newIndex, oldIndex }) {
        let list = JSON.parse(JSON.stringify(_vue.hotNewsList))
        if (_vue.hotObj.page === 1) {
          let targetRow = list.splice(oldIndex, 1)[0]
          list.splice(newIndex, 0, targetRow)
        } else {
          _vue.$message.warning('非首页不允许拖动位置')
        }
        _vue.hotNewsList = []
        _vue.$nextTick(() => {
          _vue.hotNewsList = list
          if (_vue.hotObj.page === 1) {
            _vue.sortChange()
          }
        })
      }
    })
  },
  methods: {
    fetchNewsList () {
      // 获取所有新闻
      let _vue = this
      _vue.$http.get('/api/v1.0/news/operate/news_lists?text=' + _vue.keyword +
        '&page=' + _vue.pager.page +
        '&per_page=' + _vue.pager.size).then((response) => {
        _vue.newsList = response.data.data.rows
        _vue.totalNum = response.data.data.total
      })
    },
    fetchHotNewsList () {
      this.$http.get('/api/v1.0/news/operate/lists?pageNum=' + this.hotObj.page +
        '&pageSize=' + this.hotObj.size).then((response) => {
        this.hotObj.num = response.data.data.total
        this.hotNewsList = []
        this.$nextTick(() => {
          this.hotNewsList = response.data.data.rows
        })
      })
    },
    searchNews () {
      // 搜索新闻
      this.pager.page = 1
      this.fetchNewsList()
    },
    handleCurrentChange (val) {
      // 分页
      let _vue = this
      _vue.pager.page = val
      _vue.fetchNewsList()
    },
    hotObjChange (val) {
      this.hotObj.page = val
      this.fetchHotNewsList()
    },
    addHotNews (row) {
      // 添加热点新闻
      let _vue = this
      let newsItem = {
        bussinessId: row.id,
        title: row.title,
        author: row.author,
        source: row.source,
        createTimeText: row.createTimeText,
        releaseTimeText: row.releaseTimeText
      }
      _vue.hotNewsList.unshift(newsItem)
    },
    removeHotNews (index, row) {
      // 删除热点新闻
      let _vue = this
      _vue.hotNewsList.splice(index, 1)
    },
    saveHotNews () {
      // 保存热点新闻
      let _vue = this
      console.log(_vue.idList)
      _vue.$http.put('/api/v1.0/news/operate/update', {
        str: _vue.idList.toString()
      }).then(() => {
        _vue.$message({
          type: 'success',
          message: '保存成功',
          center: true
        })
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    tableRowClassName ({row, rowIndex}) {
      if (this.idList.indexOf(row.id) !== -1) {
        return 'warning-row'
      }
      return ''
    },
    // 添加热点
    addHot (id) {
      this.$http.get('/api/v1.0/news/operate/addHots?newId=' + id).then((response) => {
        this.$message.success('添加成功')
        this.fetchNewsList()
        this.fetchHotNewsList()
      })
    },
    // 删除热点
    deleteHot (id, type) {
      this.$http.get('/api/v1.0/news/operate/deleteHots?newId=' + id).then((response) => {
        this.$message.success('删除成功')
        this.fetchNewsList()
        this.fetchHotNewsList()
      })
    },
    // 修改顺序
    sortChange () {
      this.$http.post('/api/v1.0/news/operate/updateSort', {
        news: this.hotNewsList.map(res => {
          return res.id
        })
      }).then((response) => {
        this.fetchHotNewsList()
      })
    },
    // 置顶
    setTop (id, type) {
      this.$http.get('/api/v1.0/news/operate/top?newId=' + id).then((response) => {
        this.$message.success('置顶成功')
        this.fetchHotNewsList()
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
  .news-list {
    .list-search-wrap {
      margin-bottom: 20px;
      border-bottom: none;
    }
  }
  .action-icon {
    font-size: 18px;
    cursor: pointer;
  }
  .setTop {
    color:#409eff;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
</style>
