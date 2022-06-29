<template>
  <div class="dialog-container">
    <el-dialog
      class="el-dialog-right"
      title="留言"
      :visible.sync="show"
      width="40%">
      <div class="message-wrap">
        <div class="message-list">
          <div class="message-item" :class="{ 'admin': item.userType === 2 }" v-for="(item, index) in messageList" :key="index">
            <div class="cnt-wrap" v-if="!item.split">
              <div class="message-time">
                <div class="time">{{ item.createTime }}</div>
                <div class="name" @click="showReplyWrap(item)">{{ item.name }}({{ item.role }})</div>
              </div>
              <div class="text">{{ item.content }}</div>
            </div>
            <div class="split-line-wrap" v-if="item.split"><div class="text">一 周 前</div></div>
          </div>
        </div>
        <!-- 回复消息 -->
        <div class="reply-wrap" v-if="showReply">
          <div class="top">
            回复
            <span class="name">{{ replyName }}</span>
          </div>
          <div class="text-input-wrap">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="replyContent"></el-input>
          </div>
          <div class="action-wrap">
            <el-button class="btn" @click="handleCancel">取消</el-button>
            <el-button @click="sendMsg" class="btn" type="primary">发送</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'underscore'
import moment from 'moment'
export default {
  data () {
    return {
      show: false,
      messageList: [],
      projectUserId: '',
      replyContent: '',
      showReply: false,
      replyName: '',
      replyItem: '',
      showSplitLine: false
    }
  },
  methods: {
    fetchMessage () {
      // 获取工单留言
      this.$http.post('/api/v1.0/fa/workOrder/page', {
        pageNum: 1,
        pageSize: 9999,
        parameters: {
          projectUserId: this.projectUserId
        }
      }).then(res => {
        let result = res.data.data.data
        if (!this.showSplitLine) {
          _.each(result, (item, index) => {
            if (!this.showSplitLine) {
              let m1 = moment()
              let m2 = moment(item.createTime)
              if (item.userType === 1) {
                if (m1.diff(m2, 'days') >= 7 && index !== result.length - 1) {
                  this.showSplitLine = true
                  result.splice(index, 0, {
                    split: true
                  })
                }
              }
            }
          })
        }
        this.messageList = result
      })
    },
    showReplyWrap (item) {
      // 显示回复输入框
      if (item.userType === 1) {
        this.replyItem = item
        this.showReply = true
        this.replyName = item.name + '(' + item.role + ')'
      }
    },
    handleCancel () {
      // 取消
      this.showReply = false
      this.replyContent = ''
    },
    sendMsg () {
      // 发送回复消息
      if (this.replyContent.trim() === '') {
        this.$message({
          message: '请输入回复内容',
          center: true,
          type: 'warning'
        })
      } else {
        this.$http.post('/api/v1.0/fa/workOrder/add', {
          userId: this.replyItem.userId,
          contentId: this.replyItem.contentId,
          content: this.replyContent.trim(),
          type: this.replyItem.type,
          replyId: this.replyItem.id
        }).then(() => {
          this.$message({
            message: '发送成功',
            center: true,
            type: 'success'
          })
          this.showReply = false
          this.replyContent = ''
          this.fetchMessage()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-dialog-right.el-dialog__wrapper {
    > :first-child {
      margin: 0 auto !important;
      margin-right: 0 !important;
      height: 100%;
      width: 40%;
      overflow: auto;
      .el-form {
        width: 100%;
      }
    }
  }
  .message-wrap {
    border-top: 1px solid #909399;
    padding-top: 25px;
    position: relative;
  }
  .message-list {
    .message-item {
      .message-time {
        display: flex;
        align-items: center;
        font-size: 14px;
        .time {
          color: #909399;
          margin-right: 5px;
        }
        .name {
          color: #409eff;
          text-decoration: underline;
          cursor: pointer;
        }
      }
      .text {
        margin-top: 8px;
      }
      margin-bottom: 15px;
      &.admin {
        background-color: rgba(144, 147, 153, .2);
        padding: 15px;
        .name {
          cursor: default;
          text-decoration: none;
        }
      }
    }
  }
  .reply-wrap {
    position: fixed;
    bottom: 0;
    right: 0;
    background: rgba(255, 255, 255, .9);
    border-top: 1px solid #909399;
    width: 40%;
    padding: 20px 20px 40px 20px;
    box-sizing: border-box;
    .top {
      font-size: 15px;
      .name {
        color: #409eff;
      }
      margin-bottom: 10px;
    }
    .text-input-wrap {
    }
    .action-wrap {
      text-align: right;
      padding-top: 15px;
      .btn {}
    }
  }
  .split-line-wrap {
    position: relative;
    border-top: 1px solid #909399;
    height: 20px;
    margin: 40px 0;
    .text {
      width: 150px;
      background-color: #fff;
      height: 20px;
      position: absolute;
      top: -100%;
      left: 50%;
      text-align: center;
      transform: translateX(-50%);
      font-size: 15px;
    }
  }
</style>
