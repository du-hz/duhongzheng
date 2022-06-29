<template>
  <div class="recommend-wrap">
   <el-dialog
      class="el-dialog-right"
      title="已推荐投资人"
      :visible.sync="show"
      width="40%">
     <!-- Tab切换 -->
     <div class="top-wrap">
       <div class="tab-list">
         <div @click="changeTab(0)" class="tab-item" :class="{ active: isInterest === 0 }">待查看({{ recmdInvestorSummary.unLookNumber }})</div>
         <div @click="changeTab(1)" class="tab-item" :class="{ active: isInterest === 1 }">感兴趣({{ recmdInvestorSummary.interestNumber }})</div>
         <div @click="changeTab(10)" class="tab-item" :class="{ active: isInterest === 10 }">不感兴趣({{ recmdInvestorSummary.unInterestNumber }})</div>
       </div>
       <el-button v-if="canRecommend" @click="goRecommend" class="recommend-btn" type="primary" size="small">继续推荐</el-button>
     </div>
     <!-- 列表展示 -->
     <div class="investor-list-wrap">
       <div v-if="investorList.length > 0" class="list-head">
         <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
         <el-button v-if="isInterest === 0 && investorIds.length > 0" @click="noticeAll" type="primary" size="mini">批量提醒</el-button>
       </div>
       <div class="investor-list">
         <div v-for="(item, index) in investorList" :key="index" class="investor-item">
           <el-checkbox @change="handleChecked" v-model="item.checked"></el-checkbox>
           <div class="basic-wrap">
             <div class="name-item">
               <div class="text">{{ item.investorName }}</div>
             </div>
             <div class="company-item">{{ item.companyName }}</div>
             <div class="mobile">{{ item.mobile }}</div>
             <div class="message weak">共有{{ item.workNumber || 0 }}条留言</div>
           </div>
           <!-- 待确认 -->
           <div class="attr-wrap" v-if="isInterest === 0">
             <div class="time">推荐时间：{{ item.recommendTime }}</div>
             <el-button @click="notice(item)" type="primary" size="mini">提醒查看</el-button>
           </div>
           <!-- TODO: 感兴趣 -->
           <div class="attr-wrap" v-if="isInterest !== 0 && isInterest !== 10">
             <template v-if="item.conferenceIsUpdate !== 1">
               <!-- 等待安排会议 -->
               <!-- 会议待确认 -->
               <div v-if="item.isInterest === 1">
                 <template v-if="item.conferenceStatus === 0">
                   <div class="time">会议时间：{{ item.conferenceStartTime }}</div>
                   <div class="shape">
                     <span>{{ item.conferenceShape }}</span>
                     <span class="address" v-if="item.conferenceAddress"> | {{ item.conferenceAddress }}</span>
                   </div>
                   <div class="warn-tip">会议等待接受</div>
                   <el-button @click="noticeConference(item)" size="mini">再次发送会议提醒</el-button>
                 </template>
                 <template v-if="item.conferenceStatus === 1">
                   <div class="time">会议时间：{{ item.conferenceStartTime }}</div>
                   <div class="shape">
                     <span>{{ item.conferenceShape }}</span>
                     <span class="address" v-if="item.conferenceAddress"> | {{ item.conferenceAddress }}</span>
                   </div>
                   <div>会议已被接受</div>
                 </template>
               </div>
               <!-- 会议已确认 -->
               <!-- 已沟通 继续跟进 -->
               <div v-if="item.isInterest === 4">
                 <div><el-tag type="warning" size="small">已沟通 继续跟进</el-tag></div>
                 <div class="time">会议时间：{{ item.conferenceStartTime }}</div>
                 <div class="shape">
                   <span>{{ item.conferenceShape }}</span>
                   <span class="address" v-if="item.conferenceAddress"> | {{ item.conferenceAddress }}</span>
                 </div>
                 <el-button @click="confirmInvest(item)" type="danger" size="mini">确定投资</el-button>
               </div>
               <!-- 已沟通 确认投资 -->
               <div v-if="item.isInterest === 5">
                 <div><el-tag type="warning" size="small">已沟通 确定投资</el-tag></div>
                 <div class="time">会议时间：{{ item.conferenceStartTime }}</div>
                 <div class="shape">
                   <span>{{ item.conferenceShape }}</span>
                   <span class="address" v-if="item.conferenceAddress"> | {{ item.conferenceAddress }}</span>
                 </div>
               </div>
               <!-- 感兴趣，未参与会议 -->
               <div v-if="item.isInterest === 6">
                 <div><el-tag type="warning" size="small">会议已过期，未沟通</el-tag></div>
                 <div class="time">会议时间：{{ item.conferenceStartTime }}</div>
                 <div class="shape">
                   <span>{{ item.conferenceShape }}</span>
                   <span class="address" v-if="item.conferenceAddress"> | {{ item.conferenceAddress }}</span>
                 </div>
               </div>
             </template>
             <!-- 需要修改会议时间 -->
             <div v-if="item.conferenceIsUpdate === 1">
               <div class="time">会议时间：{{ item.conferenceStartTime }}</div>
               <div class="shape">
                 <span>{{ item.conferenceShape }}</span>
                 <span class="address" v-if="item.conferenceAddress"> | {{ item.conferenceAddress }}</span>
               </div>
               <div class="stress-tip">会议时间需修改</div>
               <el-button @click="rearrange(item)" type="primary" size="mini">重新安排会议</el-button>
             </div>
           </div>
           <!-- 不感兴趣 -->
           <div class="attr-wrap" v-if="isInterest === 10">
             <div class="interest-status">
               <el-tag type="warning" v-if="item.isInterest === 2" size="small">不感兴趣</el-tag>
               <el-tag type="warning" v-if="item.isInterest === 3" size="small">沟通后不感兴趣</el-tag>
             </div>
             <div class="time" v-if="item.conferenceStartTime">会议时间：{{ item.conferenceStartTime }}</div>
             <div class="shape">
               <span>{{ item.conferenceShape }}</span>
               <span class="address" v-if="item.conferenceAddress"> | {{ item.conferenceAddress }}</span>
             </div>
             <div class="conference-stage">{{ item.conferenceStatus | conferenceStatusFilter }}</div>
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
   </el-dialog>

   <!-- 重新安排会议 -->
   <el-dialog
     title="重新安排会议时间"
     :visible.sync="rearrangeDialogVisible"
     width="30%">
     <div class="dialog-tip stress-tip">重新安排会议之前，请先线下与双方确认合适的时间</div>
     <div class="rearrange-wrap form-wrap">
       <div class="form-item">
         <el-date-picker
           v-model="formStartingTime"
           value-format="yyyy-MM-dd HH:mm:ss"
           type="datetime"
           placeholder="选择会议开始时间">
         </el-date-picker>
       </div>
       <div class="form-item">
         <el-date-picker
           v-model="formEndTime"
           value-format="yyyy-MM-dd HH:mm:ss"
           type="datetime"
           placeholder="选择会议结束时间">
         </el-date-picker>
       </div>
       <div class="form-item">
         <el-select v-model="formShape" placeholder="请选择会议方式">
           <el-option label="当面沟通" value="1"></el-option>
           <el-option label="电话/微信会议" value="2"></el-option>
         </el-select>
       </div>
       <div class="form-item">
         <el-input v-if="formShape === '1'" v-model="formAddress" placeholder="地址"></el-input>
       </div>
     </div>
     <div class="action-wrap">
       <el-button @click="rearrangeDialogVisible = false">取消</el-button>
       <el-button @click="submitRearrange" type="primary">提交</el-button>
     </div>
   </el-dialog>

    <!-- 确定投资 -->
    <el-dialog
      title="确定投资"
      :visible.sync="investDialogVisible"
      width="30%">
      <div class="desc">
        <p>恭喜你！又撮合了一笔投资。</p>
        <p>确定投资后项目状态将变更，后续如需重新开启项目请联系产品经理。</p>
      </div>
      <div class="action-wrap">
        <el-button @click="investDialogVisible = false">取消</el-button>
        <el-button @click="submitInvest" type="danger">确定投资</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'underscore'
export default {
  data () {
    return {
      isIndeterminate: false,
      checkAll: false,
      investorList: [],
      total: 0,
      pager: {
        page: 1,
        size: 10
      },
      investorIds: [],
      projectId: '',
      show: false,
      isInterest: 0,
      recmdInvestorSummary: {},
      allIds: [],
      rearrangeDialogVisible: false,
      currentConference: {},
      formShape: '',
      formAddress: '',
      formStartingTime: '',
      formEndTime: '',
      investDialogVisible: false,
      canRecommend: false,
      projectUserId: '',
      currentProjectInvestor: {}
    }
  },
  filters: {
    conferenceStatusFilter (val) {
      let str = ''
      if (val === 0) {
        str = '会议待确认'
      } else if (val === 1) {
        str = '会议已确认'
      } else if (val === 2) {
        str = '会议已取消'
      } else if (val === 3) {
        str = '会议已结束'
      } else if (val === 4) {
        str = '会议已失效'
      }
      return str
    }
  },
  methods: {
    handleCurrentChange (value) {
      this.pager.page = value
      this.fetchInvestorList()
    },
    fetchNum () {
      // 获取数量
      this.$http.get('/api/v1.0/fa/projectInvestor/interest?projectId=' + this.projectId).then(res => {
        this.recmdInvestorSummary = res.data.data
      })
    },
    fetchInvestorList () {
      // 获取投资人列表
      let _vue = this
      _vue.investorList = []
      _vue.$http.post('/api/v1.0/fa/projectInvestor/page', {
        'pageNum': _vue.pager.page,
        'pageSize': _vue.pager.size,
        'parameters': {
          'isInterest': _vue.isInterest,
          'projectId': _vue.projectId
        }
      }).then(res => {
        let result = res.data.data
        _vue.total = result.total
        _vue.investorList = result.data
        _vue.allIds = _.pluck(_vue.investorList, 'id')
      })
    },
    handleCheckAllChange (val) {
      // 全选
      this.investorIds = val ? this.allIds : []
      _.map(this.investorList, item => {
        if (this.investorIds.indexOf(item.id) !== -1) {
          item.checked = true
        } else {
          item.checked = false
        }
      })
      this.isIndeterminate = false
    },
    handleChecked (val) {
      // 单项选择
      let _vue = this
      _vue.investorIds = _.pluck(_.where(_vue.investorList, { checked: true }), 'id')
      // 显示全选按钮
      this.checkAll = _vue.investorIds.length === _vue.allIds.length
      this.isIndeterminate = _vue.investorIds.length > 0 && _vue.investorIds.length < _vue.allIds.length
      _vue.investorList = JSON.parse(JSON.stringify(_vue.investorList))
    },
    notice (item) {
      // 发送消息提醒 - 项目评估
      let _vue = this
      _vue.$http.get('/api/v1.0/fa/projectInvestor/seeAlert?ids=' + item.id).then(res => {
        _vue.$message({
          message: '已发送提醒消息',
          center: true,
          type: 'success'
        })
      })
    },
    noticeAll () {
      // 批量发送提醒
      let _vue = this
      let ids = _.pluck(_.where(_vue.investorList, { checked: true }), 'id').toString()
      _vue.$http.get('/api/v1.0/fa/projectInvestor/seeAlert?ids=' + ids).then(res => {
        _vue.$message({
          message: '已发送提醒消息',
          center: true,
          type: 'success'
        })
      })
    },
    changeTab (type) {
      // 切换Tab
      this.pager.page = 1
      this.isInterest = type
      this.fetchInvestorList()
      this.checkAll = false
    },
    goRecommend () {
      // 继续推荐
      this.show = false
      setTimeout(() => {
        this.$emit('emitContinueRecmdInvestor')
      }, 500)
    },
    rearrange (item) {
      // 重新安排会议
      this.currentConference = item
      this.rearrangeDialogVisible = true
    },
    submitRearrange () {
      // 提交会议
      this.$http.post('/api/v1.0/fa/conference/update', {
        id: this.currentConference.conferenceId,
        address: this.formAddress.trim(),
        startingTime: this.formStartingTime,
        endTime: this.formEndTime,
        conferenceShape: this.formShape,
        isUpdate: 0
      }).then(res => {
        this.$message({
          message: '提交成功',
          center: true,
          type: 'success'
        })
        this.rearrangeDialogVisible = false
        this.fetchInvestorList()
      })
    },
    confirmInvest (item) {
      this.investDialogVisible = true
      this.currentProjectInvestor = item
    },
    submitInvest () {
      // 确定投资
      let _vue = this
      _vue.$http.get('/api/v1.0/fa/project/addCloseReason?projectId=' + _vue.projectId + '&closeReason=&status=4').then(res => {
        this.$message({
          message: '提交成功',
          center: true,
          type: 'success'
        })
        _vue.$http.post('/api/v1.0/fa/projectInvestor/update', {
          id: _vue.currentProjectInvestor.id,
          isInterest: 5
        }).then(res => {
          console.log('提交成功')
          this.fetchInvestorList()
        })
        this.investDialogVisible = false
      })
    },
    noticeConference (item) {
      // 发送会议提醒
      this.$http.get('/api/v1.0/fa/conference/sendConferenceAlert?projectUserId=' + this.projectUserId + '&conferenceId=' + item.conferenceId).then(res => {
        this.$message({
          message: '已发送会议提醒',
          type: 'success',
          center: true
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .recommend-wrap {
    .top-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0 15px 0;
      .tab-list {
        display: flex;
        .tab-item {
          padding: 0 20px;
          font-size: 15px;
          border-right: 1px solid #909399;
          &:first-child {
            padding-left: 0;
          }
          &:last-child {
            border-right: none;
          }
        }
        .tab-item.active,
        .tab-item:hover {
          cursor: pointer;
          color: #409eff;
        }
      }
      .recommend-btn {}
    }
    .search-wrap {
      .filter-wrap {
        display: flex;
        align-items: center;
        .el-select {
          margin-right: 10px;
          margin-bottom: 10px;
          flex: 1;
        }
        margin-bottom: 10px;
      }
      .keyword-wrap {
        display: flex;
        align-items: center;
        .el-input {
          flex: 1;
          margin: 0 10px;
        }
        .el-button {
          float: right;
        }
      }
      margin-bottom: 20px;
    }
    .investor-list-wrap {
      border-top: 1px solid #909399;
      padding-top: 20px;
      .list-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .investor-list {
        .investor-item {
          border-bottom: 1px dashed #909399;
          display: flex;
          align-items: start;
          padding: 10px 0;
          &:last-child {
            border-bottom: none;
          }
          .el-checkbox {
            width: 30px;
          }
          .basic-wrap {
            flex: 1;
            .weak {
              color: #909399;
            }
          }
          .attr-wrap {
            flex: 1;
            text-align: right;
            align-items: center;
            .attr-item {
              display: flex;
              .title {
                color: #909399;
                width: 70px;
              }
            }
          }
        }
      }
    }
    .el-dialog-right.el-dialog__wrapper {
      > :first-child {
        margin: 0 auto !important;
        margin-right: 0 !important;
        overflow: auto;
        height: 100%;
        .el-form {
          width: 100%;
        }
      }
    }
  }
  .stress-tip {
    color: #ff0000;
  }
  .warn-tip {
    color: #e6a23c;
  }
  .rearrange-wrap {
    margin-top: 15px;
    .form-item {
      margin-bottom: 10px;
      width: 100%;
      .el-select,
      .el-input {
        width: 100%;
      }
    }
  }
  .action-wrap {
    margin-top: 20px;
  }
</style>
