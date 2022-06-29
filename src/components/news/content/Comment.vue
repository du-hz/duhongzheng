<template>
  <div>
    <div class="head-wrap">
      <span class="text-link" @click="back">&lt;&lt; 返回新闻</span>
    </div>
    <div class="operate-action">
      <el-button type="primary" size="medium" @click="delComment()">删除评论</el-button>
      <el-button type="primary" size="medium" @click="addComment">新增评论</el-button>
      <el-button type="primary" size="medium">
        <a class="btn-link" :href="newsMobileUrl + '/news/' + id + '/detail'" target="_blank">移动版预览</a>
      </el-button>
    </div>
    <div class="main-line-title">新闻评论页</div>
    <div class="news-info-wrap">
      <div class="head">
        <span class="title">新闻标题：{{detail.title}}</span>
        <span class="channel">新闻频道ID：{{detail.newsTypeId}}</span>
      </div>
      <div class="info">
        <span>新闻ID：{{detail.id}}</span>
        <span>新闻来源：{{detail.source}}</span>
        <span>新闻作者：{{detail.author}}</span>
        <span>发布时间：{{detail.originReleaseTimeText}}</span>
        <span>创建时间：{{detail.createTimeText}}</span>
        <span>审核时间：{{detail.releaseTimeText}}</span>
      </div>
    </div>
    <!-- 新闻评论列表 -->
    <div class="table-list-wrap">
      <el-table
        style="width: 100%"
        ref="multipleTable"
        border
        :data="commentList"
        header-row-class-name="tableheader selection"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          align="center"
          width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          label="评论ID"
          width="100px"
          align="center">
        </el-table-column>
        <el-table-column
          label="是否机器人评论"
          width="160px"
          align="center">
          <template slot-scope="scope">
            <span v-if="(scope.row.userId + '').length < 6">是</span>
            <span v-if="(scope.row.userId + '').length >= 6">否</span>
          </template>
        </el-table-column>
        <el-table-column
          label="用户昵称"
          width="200px"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userNickname}}({{scope.row.userId}})</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="newsId"
          label="回复对象(新闻ID)"
          width="150px"
          align="center">
        </el-table-column>
        <el-table-column
          prop="replyId"
          label="回复会话ID"
          width="150px"
          align="center">
        </el-table-column>
        <el-table-column
          prop="content"
          label="评论内容"
          width="250px"
          align="center">
        </el-table-column>
        <el-table-column
          prop="source"
          label="评论渠道"
          width="120px"
          align="center">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="150px"
          align="center">
        </el-table-column>
        <el-table-column
          prop="releaseTimeText"
          label="发布时间"
          width="160px"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="150px"
          align="center">
          <template slot-scope="scope">
            <span class="text-link" @click="replyComment(scope.row)">回复</span>
            <span class="text-link" @click="delComment(scope.row)">删除</span>
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

    <!-- 新增评论弹窗 -->
    <el-dialog :title="replyFlag === 0 ? '新增评论' : '回复评论'" :visible.sync="showCommentDialog" width="40%">
      <div v-if="commentForm.replyId !== ''" style="padding-left: 75px;margin-bottom: 20px;">回复评论ID: {{commentForm.replyId}}</div>
      <el-form style="width: 80%;">
        <el-form-item label="选择评论人">
          <el-select
            style="width: 100%"
            v-model="replyUserId"
            remote
            reserve-keyword
            clearable
            filterable
            placeholder="请选择评论人"
            :remote-method="remoteFetchRobot">
            <el-option
              v-for="item in robotOpts"
              :key="item.id"
              :label="item.nickname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="输入评论内容">
          <el-input type="textarea" :rows="4" maxlength="200" placeholder="请输入评论内容" v-model="commentForm.content"></el-input>
        </el-form-item>
      </el-form>
      <div class="action-wrap">
        <el-button @click="showCommentDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitComment">确 定</el-button>
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
      id: this.$route.params.id,
      detail: {},
      totalNum: 0,
      pager: {
        page: 1,
        size: 10
      },
      commentList: [],
      multipleSelection: '',
      curNewsItem: {},
      commentForm: {
        newsId: '',
        replyId: '',
        content: ''
      },
      showCommentDialog: false,
      newsMobileUrl: Global.CONFIG.NEWS_MOBILE_URL,
      replyFlag: 0, // 0: 评论新闻  1: 回复评论
      robotOpts: [],
      replyUserId: ''
    }
  },
  created () {
    let _vue = this
    _vue.fetchNewsDetail(_vue.id)
    _vue.fetchNewsComment()
  },
  methods: {
    fetchNewsDetail (id) {
      let _vue = this
      _vue.$http.get('/api/v1.0/news/content/detail/' + id).then((response) => {
        _vue.detail = response.data.data
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    fetchNewsComment () {
      // 获取新闻评论信息
      let _vue = this
      _vue.$http.get('/api/v1.0/news/content/view_comment/' + _vue.id + '?page=' + _vue.pager.page + '&per_page=' + _vue.pager.size).then((response) => {
        _vue.commentList = response.data.data.rows
        _vue.totalNum = response.data.data.total
      })
    },
    remoteFetchRobot (query) {
      // 获取机器人信息
      let _vue = this
      _vue.$http.get('/api/v1.0/news/content/robots?page=1&per_page=20&text=' + query).then((response) => {
        _vue.robotOpts = response.data.data.rows
      })
    },
    back () {
      // 返回新闻详情
      this.$router.push({
        name: 'newsDetail',
        params: {
          id: this.id
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleCurrentChange (val) {
      this.pager.page = val
      this.fetchNewsComment()
    },
    delComment (row) {
      // 删除评论
      let _vue = this
      if (row) {
        // 单条删除
        _vue.$http.put('/api/v1.0/news/content/delete_comment', {
          str: row.id.toString()
        }).then(() => {
          _vue.$message({
            type: 'success',
            message: '删除成功',
            center: true
          })
          _vue.pager.page = 1
          _vue.fetchNewsComment()
        }).catch(() => {
          _vue.$message({
            type: 'error',
            message: '请稍后重试',
            center: true
          })
        })
      } else {
        // 批量删除
        if (_vue.multipleSelection.length === 0) {
          _vue.$message({
            type: 'warning',
            message: '请至少选择一条数据',
            center: true
          })
        } else {
          let ids = _.pluck(_vue.multipleSelection, 'id')
          _vue.$http.put('/api/v1.0/news/content/delete_comment', {
            str: ids.toString()
          }).then(() => {
            _vue.$message({
              type: 'success',
              message: '删除成功',
              center: true
            })
            _vue.pager.page = 1
            _vue.fetchNewsComment()
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
    addComment () {
      // 新增评论
      this.replyFlag = 0
      this.commentForm.newsId = this.id
      this.commentForm.replyId = ''
      this.commentForm.content = ''
      this.showCommentDialog = true
    },
    replyComment (row) {
      // 回复评论
      this.replyFlag = 1
      this.commentForm.newsId = this.id
      this.commentForm.replyId = row.id
      this.commentForm.content = ''
      this.showCommentDialog = true
    },
    submitComment () {
      // 提交评论或回复
      let _vue = this
      if (_vue.replyUserId !== '') {
        let robot = _.findWhere(_vue.robotOpts, {id: _vue.replyUserId})
        _vue.commentForm.userId = robot.id
        _vue.commentForm.userNickname = robot.nickname
        _vue.commentForm.headUrl = robot.avatar
      }
      if (!_vue.commentForm.userId) {
        _vue.$message({
          type: 'warning',
          message: '请选择评论人',
          center: true
        })
        return false
      } else if (!_vue.commentForm.content) {
        _vue.$message({
          type: 'warning',
          message: '请输入评论内容',
          center: true
        })
        return false
      } else {
        _vue.$http.post('/api/v1.0/news/content/new_comment', _vue.commentForm).then(() => {
          _vue.$message({
            type: 'success',
            message: '评论成功',
            center: true
          })
          _vue.showCommentDialog = false
          _vue.pager.page = 1
          _vue.fetchNewsComment()
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
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";

  .head-wrap {
    margin-bottom: 30px;
  }
  .list-title {
    font-size: 18px;
    margin-bottom: 20px;
  }
  .news-info-wrap {
    .head {
      .title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 15px;
        display: inline-block;
        margin-right: 30px;
      }
    }
    .info {
      margin: 20px 0;

      span {
        display: inline-block;
        margin-bottom: 10px;
        margin-right: 30px;
      }
    }
  }
  .operate-action {
    border-bottom: 1px solid #ccc;
    padding-bottom: 30px;
    margin-bottom: 20px;
  }
  .news-content-wrap {
    width: 800px;
    border-top: 1px solid #ccc;
    padding-top: 20px;

    .cnt-title {
      font-size: 20px;
      text-align: center;
      margin-bottom: 40px;
    }
  }
  .btn-link {
    color: #fff;
  }
  .news-cnt {
    width: 585px;
    margin: 0 auto;

    img {
      max-width: 100%;
      display: block;
      height: auto !important;
      margin: 0px auto;
    }
  }
</style>
