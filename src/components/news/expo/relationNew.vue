<template>
  <div>
    <div class="main-line-title">{{id === '' ? '关联新闻' : '编辑展会活动'}}</div>
    <el-form ref="form" :model="form" label-width="130px">
      <!-- 配置专题内容 START  -->
      <el-form-item label="关联新闻">
        <div class="topic-related-container table-list-wrap">
          <el-row :gutter="40">
            <el-col :span="12">
              <div class="news-list left">
                <div class="list-search-wrap">
                  <el-input v-model="guestSearchInput" clearable style="width: 300px;" placeholder="输入新闻ID/新闻标题/活动ID/活动名称/标签检索"></el-input>
                  <el-button type="primary" @click="searchGuest">搜索</el-button>
                </div>
                <el-table
                  :data="guestList"
                  height="600"
                  header-row-class-name="tableheader"
                  :row-class-name="tableRowClassName"
                  border
                  style="width: 100%;">
                  <el-table-column
                    width="50"
                    align="center">
                    <template slot-scope="scope">
                      <i class="action-icon el-icon-circle-plus-outline" @click="addGuest(scope.row)"  v-if="idList.indexOf(scope.row.id) === -1"></i>
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
                    label="内容标题"
                    width="200"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="source"
                    label="内容来源"
                    width="130"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="author"
                    label="内容作者"
                    width="120"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="createTime"
                    label="创建时间"
                    width="100"
                    align="center">
                    <template slot-scope="scope">
                      <span>{{scope.row.createTime | filterDateformatH}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="审核时间"
                    width="100"
                    align="center">
                    <template slot-scope="scope">
                      <span>{{scope.row.auditTime | filterDateformatH}}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="pager-wrap">
                  <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :total="guestTotal"
                    :page-size="10"
                    @current-change="guestListPageChange">
                  </el-pagination>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="news-list right">
                <div class="list-search-wrap">
                  <span style="color: #409eff;display: inline-block;margin-left: 20px;">当前已关联{{form.guestList.length}}条新闻</span>
                </div>
                <el-table
                  :data="form.guestList"
                  height="600"
                  row-key="id"
                  header-row-class-name="tableheader"
                  border
                  class="hot-news-table"
                  style="width: 100%;">
                  <el-table-column
                    width="50"
                    align="center">
                    <template slot-scope="scope">
                      <i class="action-icon el-icon-delete" @click="removeGuest(scope.$index)"></i>
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
                    label="内容标题"
                    width="200"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="source"
                    label="内容来源"
                    width="130"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="author"
                    label="内容作者"
                    width="120"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="createTime"
                    label="创建时间"
                    width="100"
                    align="center">
                    <template slot-scope="scope">
                      <span>{{scope.row.createTime | filterDateformatH}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="审核时间"
                    width="100"
                    align="center">
                    <template slot-scope="scope">
                      <span>{{scope.row.auditTime | filterDateformatH}}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
      <!-- 配置专题内容 END -->
      <el-form-item>
        <el-button type="primary" @click="saveOperate">保存</el-button>
        <el-button @click="cancelOperate">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import _ from 'underscore'

export default {
  data () {
    return {
      id: (this.$route.query && this.$route.query.id) || '',
      form: {
        guestList: []
      },
      guestSearchInput: '',
      guestList: [],
      guestNum: 1,
      guestTotal: 0
    }
  },
  computed: {
    idList () {
      return _.pluck(this.form.guestList, 'id') || []
    }
  },
  mounted () {
    this.getGuestList()
    if (this.id) {
      this.getDetail()
    }
  },
  created () {
  },
  methods: {
    getGuestList () {
      this.$http.get('/api/v1.0/news/content/audit_news?page=' + this.guestNum + '&per_page=10&text=' + this.guestSearchInput.trim()).then((response) => {
        this.guestList = response.data.data.rows
        this.guestTotal = response.data.data.total
      })
    },
    searchGuest () {
      this.guestNum = 1
      this.getGuestList()
    },
    guestListPageChange (value) {
      this.guestNum = value
      this.getGuestList()
    },
    addGuest (row) {
      this.form.guestList.unshift(JSON.parse(JSON.stringify(row)))
    },
    removeGuest (index) {
      this.form.guestList.splice(index, 1)
    },
    saveOperate () {
      let data = {
        guestId: this.form.guestList.map(res => {
          return {
            seminarId: this.id,
            newsId: res.id,
            relatedId: res.relatedId || ''
          }
        })
      }
      let url = '/api/v1.0/expo/expo/saveSeminarNews'
      this.$http.post(url, data.guestId.length ? data.guestId : [{seminarId: this.id, newsId: -1}]).then(() => {
        this.$message({
          type: 'success',
          message: '保存成功',
          center: true
        })
        this.$router.push({
          path: '/news/expo/list'
        })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    cancelOperate () {
      // 取消返回
      this.$router.push({
        path: '/news/expo/list'
      })
    },
    // 嘉宾table行已选样式变化
    tableRowClassName ({row, rowIndex}) {
      if (this.idList.indexOf(row.id) !== -1) {
        return 'warning-row'
      }
      return ''
    },
    getDetail () {
      this.$http.get('/api/v1.0/expo/expo/findSeminarNews?seminarId=' + this.id).then((res) => {
        console.log(res)
        if (res.data.data) {
          this.form.guestList = res.data.data.data || []
          // let data = JSON.parse(JSON.stringify(res.data.data.rows))
          // this.form = {
          //   guestList: data.guestList ? data.guestList : []
          // }
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '获取详情失败',
          center: true
        })
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
  .upload-image {
    &.cover-img {
      width: 200px;
      height: 150px;
    }
    &.share-img {
      width: 200px;
      height: 200px;
    }
  }
  .image-pick-wrap {
    margin-top: 20px;
    .radio-item {
      margin-top: 10px;
    }
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
  .topic-related-container {
    > .el-row {
      margin: 0 !important;
    }
  }
</style>
