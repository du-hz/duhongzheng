<template>
  <div class="dashboard-wrap">
    <el-row :gutter="20">
      <el-col class="left-container" :span="16">
        <!-- 今日事件 & 待处理任务 -->
        <div class="top-block">
          <div class="wrapper today-wrap">
            <div class="h-title"><el-badge :is-dot="badgeForTodayEvents">今日事件</el-badge> （{{ todayEvents.length }}）</div>
            <div class="empty-wrap" v-if="todayEvents.length === 0">
              <img src="~assets/images/event.png">
              <p class="text">看来您已完成今天的工作了</p>
            </div>
            <div class="data-list" v-if="todayEvents.length > 0" style="height:50vh;overflow-y:scroll">
              <div class="data-item event-item" v-for="(item, index) in todayEvents" :key="index" @click="handleEventItem(item)">
                <div class="time-cnt">{{ item.startingTime | filterDateformat('HH:mm') }}</div>
                <div class="text">【{{ item.projectNumber }}项目】{{ item.conferenceShape }}  {{ item.address ?  '|' + item.address : ''}}</div>
              </div>
            </div>
          </div>
          <div class="wrapper todo-wrap">
            <div class="h-title"><el-badge :is-dot="badgeForTodoList">待处理任务</el-badge>（{{ todoList.length }}）</div>
            <div class="empty-wrap" v-if="todoList.length === 0">
              <img src="~assets/images/today.png">
              <p class="text">今天没有到期任务，作为一名老手，请稍后查看。</p>
            </div>
            <div class="data-list" v-if="todoList.length > 0" style="height:50vh;overflow-y:scroll">
              <div class="data-item todo-item" v-for="(item, index) in todoList" :key="index">
                <div @click="handleTodoItem(item)" class="text" :style="item.isCheck === 1 ? 'color:#909399' : ''">{{ item.message }}</div>
                <span class="del-btn" @click="clearTodo(item)">删除</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 项目总览 -->
        <div class="wrapper bottom-block">
          <div class="project-summary">
            <div class="h-title">项目总览</div>
            <div class="cnt-wrap">
              <div class="left">
                <div class="title">所有项目</div>
                <div class="count">{{ total }}</div>
                <el-button type="primary" size="small" @click="viewProjectList">查看项目</el-button>
              </div>
              <div class="chart" id="summaryChart" style="width: 100%;height: 300px;"></div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col class="right-container" :span="8">
        <div class="wrapper notice-block">
          <div class="h-title"><el-badge :is-dot="badgeForNoticeList">通知</el-badge></div>
          <div class="empty-wrap" v-if="noticeList.length === 0">
            <div class="text">暂无新通知</div>
          </div>
          <div class="data-list" v-if="noticeList.length > 0">
            <div class="data-item" v-for="(item, index) in noticeList" :key="index" v-if='item && item.message'>
              <div class="text">{{ item.message }}</div>
              <div class="time">{{ item.createTime }}</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from 'underscore'
import FaCommon from 'assets/js/faCommon'
export default {
  data () {
    return {
      myChart: '',
      maxValue: 0,
      seriesData: [],
      total: 0,
      todayEvents: [],
      todoList: [],
      noticeList: [],
      badgeForTodayEvents: false,
      badgeForTodoList: false,
      badgeForNoticeList: false
    }
  },
  created () {
    let _vue = this
    _vue.fetchSummary()
    _vue.fetchTodayEvents()
    _vue.fetchTodoList()
    _vue.fetchNotice()
  },
  mounted () {
    let _vue = this
    _vue.$nextTick(() => {
      window.setTimeout(() => {
        window.onresize = () => {
          _vue.myChart.resize()
        }
      }, 1000)
      // 轮询查询消息
      // window.setInterval(() => {
      //   _vue.fetchTodayEvents()
      //   _vue.fetchTodoList()
      //   _vue.fetchNotice()
      // }, 1000 * 15)
    })
  },
  methods: {
    fetchSummary () {
      // 项目总览
      let _vue = this
      _vue.$http.get('/api/v1.0/fa/project/findAllByStatus').then(res => {
        let result = res.data.data
        _vue.seriesData = []
        _vue.seriesData.push(result.pendingNumber)
        _vue.seriesData.push(result.recommendNumber)
        _vue.seriesData.push(result.investorNumber)
        _vue.seriesData.push(result.endNumber)
        _vue.seriesData.push(result.invalidNumber)
        _vue.maxValue = _.max(_vue.seriesData, (item) => {
          return item
        }) * 1.2
        _vue.total = result.pendingNumber + result.recommendNumber + result.investorNumber + result.endNumber + result.invalidNumber
        _vue.$nextTick(() => {
          _vue.myChart = window.echarts.init(document.getElementById('summaryChart'))
          var option = {
            tooltip: {
              show: false
            },
            xAxis: {
              data: ['待处理', '推荐中', '已投资', '已结束', '无效'],
              axisTick: {
                show: false
              },
              splitLine: {
                show: false
              },
              axisLabel: {
                fontSize: 14
              }
            },
            yAxis: {
              max: _vue.maxValue,
              show: false
            },
            series: [{
              name: '数量',
              type: 'bar',
              data: _vue.seriesData
            }],
            barWidth: 14,
            itemStyle: {
              color: '#409eff'
            },
            label: {
              show: true,
              position: 'top',
              fontSize: 24,
              color: '#333',
              fontWeight: 'bold',
              fontFamily: 'arial'
            }
          }
          _vue.myChart.setOption(option)
          _vue.myChart.on('click', 'series', param => {
            let index = param.dataIndex
            if (index === 0) {
              // 待处理
              this.$router.push({
                path: '/fa/project',
                query: {
                  status: 0
                }
              })
            } else if (index === 1) {
              // 推荐中
              this.$router.push({
                path: '/fa/project',
                query: {
                  status: 3
                }
              })
            } else if (index === 2) {
              // 已投资
              this.$router.push({
                path: '/fa/project',
                query: {
                  status: 4
                }
              })
            } else if (index === 3) {
              // 已结束
              this.$router.push({
                path: '/fa/project',
                query: {
                  status: 1
                }
              })
            } else if (index === 4) {
              // 无效
              this.$router.push({
                path: '/fa/project',
                query: {
                  status: 2
                }
              })
            }
          })
        })
      })
    },
    viewProjectList () {
      this.$router.push({
        path: '/fa/project'
      })
    },
    fetchTodayEvents () {
      // 获取今日事件
      this.$http.get('/api/v1.0/fa/conference/findAllByDate').then(res => {
        let result = res.data.data
        if (result.length > this.todayEvents.length && this.todayEvents.length > 0) {
          this.badgeForTodayEvents = true
        }
        this.todayEvents = result
      })
    },
    fetchTodoList () {
      // 获取待处理列表
      let _vue = this
      _vue.$http.get('/api/v1.0/fa/alert/findAllPending').then(res => {
        let result = res.data.data
        result = _.map(result, item => {
          let tmp = FaCommon.geneMessage(item)
          item.message = tmp.message
          item.redirectUrl = tmp.redirectUrl || ''
          return item
        })
        result = _.filter(result, item => {
          return item.roleId !== 0
        })
        if (result.length > this.todoList.length && this.todoList.length > 0) {
          this.badgeForTodoList = true
        }
        this.todoList = result
      })
    },
    handleEventItem (item) {
      // 待处理任务点击
      let _vue = this
      _vue.$router.push({
        name: 'faProjectDetail',
        params: {
          id: item.projectId
        },
        query: {
          action: 'conferencereached'
        }
      })
    },
    handleTodoItem (item) {
      // 待处理任务点击
      let _vue = this
      // 消除当前消息
      _vue.$http.get('/api/v1.0/fa/alert/removeRedDot?redIds=' + item.redDotId).then(res => {
        console.log('消除红点')
      })
      _vue.$router.push({
        path: item.redirectUrl
      })
    },
    clearTodo (item) {
      // 删除提醒消息
      let _vue = this
      // 消除当前消息
      _vue.$http.get('/api/v1.0/fa/alert/closePending?redIds=' + item.redDotId).then(res => {
        console.log('删除提醒消息')
        _vue.fetchTodoList()
      })
    },
    fetchNotice () {
      // 获取通知
      this.$http.get('/api/v1.0/fa/alert/findAllRedDot').then(res => {
        // let result = res.data.data.slice(0, 200)
        let resultNew = []
        _.map(res.data.data.slice(0, 200), (item, index) => {
          if (item.userType !== 4) {
            let tmp = FaCommon.geneMessage(item)
            if (tmp.message.indexOf('【') < 0 && tmp.message !== '') {
              tmp.message = '\xa0\xa0\xa0' + tmp.message
            }
            item.message = tmp.message
            item.redirectUrl = tmp.redirectUrl || ''
            resultNew.push(item)
            return item
          }
        })
        if (resultNew.length > this.noticeList.length && this.noticeList.length > 0) {
          this.badgeForNoticeList = true
        }
        this.noticeList = resultNew.slice(0, 20)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .wrapper {
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .1);
    padding: 10px;
    margin-bottom: 20px;
    min-height: 80px;
    .h-title {
      font-weight: bold;
      font-size: 15px;
      margin-right: 10px;
    }
  }
  .left-container {
    .top-block {
      display: flex;
      .today-wrap {
        flex: 1;
        margin-right: 20px;
      }
      .todo-wrap {
        flex: 1;
      }
    }
  }
  .data-list {
    margin-top: 10px;
    padding: 0 10px;
    .data-item {
      padding: 10px 0;
      display: flex;
      align-items: center;
      .index {
        width: 20px;
      }
      .text {
        flex: 1;
        margin-right: 15px;
      }
      .del-btn {
        font-size: 13px;
        display: none;
      }
      .time {
        color: #909399;
        font-size: 13px;
      }
      &:hover {
        color: #409eff;
        cursor: pointer;

        .del-btn {
          display: inline-block;
        }
      }
    }
  }
  .project-summary {
    .cnt-wrap {
      display: flex;
      align-items: center;
      margin-top: 20px;
      .left {
        padding: 0 20px;
        text-align: center;
        margin-left: 30px;
        .title {}
        .count {
          font-size: 32px;
          padding: 10px 0;
        }
      }
      .chart{}
    }
  }
  .empty-wrap {
    text-align: center;
    margin: 75px 0 50px;
    img {
      width: 150px;
    }
    .text {
      margin-top: 20px;
      color: #606266;
      font-size: 14px;
    }
  }
  .event-item {
    align-items: flex-start !important;
    .time-cnt {
      font-size: 15px;
      margin-right: 10px;
    }
    .text {}
  }
  .notice-block {
    .data-item {
      &:hover {
        cursor: text;
        color: #303133;
      }
    }
  }
</style>
