<template>
  <div class="conference-wrap">
    <div class="conference-list">
      <div class="conference-item" v-for="(item, index) in conferenceList" :key="index">
        <div class="left">
          <div class="time-wrap">
            <div class="time">{{ item.conferenceStartTime | dateFilter }}</div>
            <div class="type">{{ item.conferenceShape | shapeFilter }}</div>
            <template v-if="item.conferenceStatus === 0">
              <el-tag v-if="item.noticeStatus === 1" type="danger">明天到期</el-tag>
              <el-tag v-if="item.noticeStatus === 2" type="warning">后天到期</el-tag>
            </template>
          </div>
          <div class="info-wrap">
            <div class="name">{{ item.investorName }}</div>
            <div class="company">{{ item.investorCompanyName }}</div>
          </div>
        </div>
        <div class="right">
          <div v-if="item.conferenceStatus === 0">
            <div v-if="item.noticeStatus === 1" class="stress-tip">建议电话直接通知</div>
            <el-button @click="notice(item)" type="primary" size="small">再次通知提醒</el-button>
          </div>
          <div v-if="item.conferenceStatus === 1">
            <div v-if="item.noticeStatus === 3" class="stress-tip">已到期，需回访</div>
          </div>
          <!-- 已结束，会议取消 -->
          <div class="finish-status" v-if="item.conferenceStatus === 2">
            <div class="top">会议取消</div>
            <div class="bottom">
              <div v-if="item.isInterest === 1">感兴趣</div>
              <div v-if="item.isInterest === 2">不感兴趣</div>
              <div v-if="item.isInterest === 3">投资人不跟进了</div>
              <div v-if="item.isInterest === 4">投资人继续跟进</div>
              <div v-if="item.isInterest === 5">投资人确认投资意向</div>
              <div v-if="item.isInterest === 6">会议已过期，未沟通</div>
            </div>
          </div>
          <!-- 已结束，正常结束 -->
          <div class="finish-status" v-if="item.conferenceStatus === 3">
            <div class="top">会议完成</div>
            <div class="bottom">
              <div v-if="item.isInterest === 1">感兴趣</div>
              <div v-if="item.isInterest === 2">不感兴趣</div>
              <div v-if="item.isInterest === 3">投资人不跟进了</div>
              <div v-if="item.isInterest === 4">投资人继续跟进</div>
              <div v-if="item.isInterest === 5">投资人确认投资意向</div>
              <div v-if="item.isInterest === 6">会议已过期，未沟通</div>
            </div>
          </div>
          <!-- 会议失效 -->
          <div class="finish-status" v-if="item.conferenceStatus === 4">
            <div class="top">会议取消</div>
            <div class="bottom">
              <!--<div v-if="item.isInterest === 1">感兴趣</div>-->
              <div v-if="item.isInterest === 2">投资人不跟进了</div>
              <div v-if="item.isInterest === 3">投资人不跟进了</div>
              <div v-if="item.isInterest === 4">投资人继续跟进</div>
              <!--<div v-if="item.isInterest === 5">投资人确认投资意向</div>-->
              <!--<div v-if="item.isInterest === 6">会议已过期，未沟通</div>-->
            </div>
          </div>
        </div>
      </div>
          <div class="pager-wrap">
            <el-pagination
              background
              layout="total, prev, pager, next"
              :total="total"
              :page-size="pager.size"
              @current-change="handleCurrentChange">
            </el-pagination>
          </div>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'
export default {
  props: ['userId', 'status', 'data'],
  data () {
    return {
      total: 0,
      pager: {
        page: 1,
        size: 10
      },
      dataList: [[], 0]
    }
  },
  created () {
  },
  computed: {
    conferenceList () {
      let _vue = this
      let result = []
      console.log('_vue.data[2]')
      console.log(_vue.data[2])
      if (_vue.data[2]) {
        _vue.pager.page = 1
      }
      if (_vue.pager.page > 1) {
        result = _vue.dataList[0]
        _vue.total = _vue.data[1]
        if (result.length > 0) {
          _.map(result, (item) => {
            let startTime = item.conferenceStartTime
            item.noticeStatus = _vue.compareTime(startTime)
          })
        }
      } else {
        result = _vue.data[0]
        _vue.total = _vue.data[1]
        if (result.length > 0) {
          _.map(result, (item) => {
            let startTime = item.conferenceStartTime
            item.noticeStatus = _vue.compareTime(startTime)
          })
        }
      }
      return result
    }
  },
  filters: {
    dateFilter (time) {
      // 过滤日期
      let t = new Date(time)
      let day = t.getDay()
      let dayStr = ''
      if (day === 1) {
        dayStr = '周一'
      } else if (day === 2) {
        dayStr = '周二'
      } else if (day === 3) {
        dayStr = '周三'
      } else if (day === 4) {
        dayStr = '周四'
      } else if (day === 5) {
        dayStr = '周五'
      } else if (day === 6) {
        dayStr = '周六'
      } else if (day === 0) {
        dayStr = '周日'
      }
      return time.substring(0, 10) + ' ' + dayStr + ' ' + time.substring(11, 16)
    },
    shapeFilter (shape) {
      let str = ''
      if (shape === 0) {
        str = ''
      } else if (shape === 1) {
        str = '当面沟通'
      } else if (shape === 2) {
        str = '电话/微信会议'
      }
      return str
    }
  },
  methods: {
    handleCurrentChange (value) {
      this.pager.page = value
      this.data[2] = false
      this.fetchConferenceList()
    },
    fetchConferenceList () {
      console.log('加载数据')
      // 获取会议列表
      let _vue = this
      _vue.$http.post('/api/v1.0/fa/projectInvestor/findPageConference', {
        'pageNum': _vue.pager.page,
        'pageSize': _vue.pager.size,
        parameters: {
          projectUserId: _vue.userId,
          status: _vue.status
        }
      }).then(res => {
        _vue.dataList = [res.data.data.data, res.data.data.total]
      })
    },
    notice (item) {
      // 发送消息提醒
      console.log('_________')
      console.log(this.userId)
      console.log(item.conferenceId)
      this.$http.get('/api/v1.0/fa/conference/sendConferenceAlert?projectUserId=' + this.userId + '&conferenceId=' + item.conferenceId).then(res => {
        this.$message({
          message: '已发送会议提醒',
          type: 'success',
          center: true
        })
      })
    },
    compareTime (time) {
      // 对比会议开始时间，返回不同状态
      let t1 = new Date(time)
      let t2 = new Date()
      if (t1.getMonth() === t2.getMonth()) {
        if (t1.getDate() - t2.getDate() === 1) {
          // 明天到期
          return 1
        }
        if (t1.getDate() - t2.getDate() === 2) {
          // 后天到期
          return 2
        }
        if (t2.getDate() - t1.getDate() === 1) {
          // 已确认 昨天会议 需回访
          return 3
        }
      }
      return 0
    }
  }
}
</script>

<style lang="scss" scoped>
  .conference-wrap {
    .conference-list {
      border-top: 1px solid #303133;
      .conference-item {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px dashed #909399;
        align-items: center;
        padding: 15px 10px;
        font-size: 15px;
        .left {
          .time-wrap {
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            .time {
              margin-right: 10px;
            }
            .type {
              margin-right: 10px;
            }
            .state {}
          }
          .info-wrap {
            color: #909399;
            display: flex;
            align-items: center;
            line-height: 1;
            .name {
              padding-right: 10px;
              border-right: 1px solid #909399;
            }
            .company {
              padding-left: 10px;
            }
          }
        }
        &:last-child {
          border-bottom: none;
        }
        .right {
          .finish-status {
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            flex-direction: column;
            .top {
              color: #909399;
            }
            .bottom {
              color: #303133;
            }
          }
        }
      }
    }
  }
  .stress-tip {
    color: #ff0000;
  }
</style>
