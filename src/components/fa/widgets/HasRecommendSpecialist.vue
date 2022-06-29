<template>
  <div class="recommend-wrap">
    <el-dialog
      class="el-dialog-right"
      title="已推荐技术专家"
      :visible.sync="show"
      width="40%">
      <!-- Tab切换 -->
      <div class="top-wrap">
        <div class="tab-list">
          <div @click="changeTab(0)" class="tab-item" :class="{ active: isAssess === 0 }">待评估({{ recmdSpecSummary.unLookNumber }})</div>
          <div @click="changeTab(1)" class="tab-item" :class="{ active: isAssess === 1 }">已评估({{ recmdSpecSummary.assessNumber }})</div>
        </div>
        <el-button v-if="canRecommend" @click="goRecommend" class="recommend-btn" type="primary" size="small">继续推荐</el-button>
      </div>
      <!-- 列表展示 -->
      <div class="investor-list-wrap">
        <div class="list-head" v-if="specialList.length > 0">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-button v-if="isAssess === 0 && specialIds.length > 0" @click="noticeAll" type="primary" size="mini">批量提醒</el-button>
        </div>
        <div class="investor-list">
          <div v-for="(item, index) in specialList" :key="index" class="investor-item">
            <div class="investor-item-inner">
              <el-checkbox @change="handleChecked(item)" v-model="item.checked"></el-checkbox>
              <div class="basic-wrap">
                <div class="name-item">
                  <div class="text">{{ item.specialistName }}</div>
                </div>
                <div class="company-item">{{ item.companyName }}  {{ item.job }}</div>
                <div class="school-item">{{ item.schoolName }} · {{ item.education | filterFaEducation }} · {{ item.major }}</div>
                <div class="mobile">{{ item.mobile }}</div>
                <div class="message" :class="{ 'weak': item.workNumber === 0 }">共有{{ item.workNumber }}条留言</div>
              </div>
              <div class="attr-wrap">
                <div class="time">推荐时间：{{ item.recommendTime }}</div>
                <el-button v-if="!item.isAssess" @click="notice(item)" type="primary" size="mini">提醒查看</el-button>
              </div>
            </div>
            <div class="content" v-if="item.isAssess">
              <div class="title">
                <div class="text">评估内容：</div>
                <el-button v-if="!item.isRevoke" class="right" @click="revoke(item)" type="text">撤回评论</el-button>
                <div class="right text" v-if="item.isRevoke">评论已被撤回</div>
              </div>
              <div class="cnt">{{ item.assess }}</div>
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
  </div>
</template>

<script>
import _ from 'underscore'
export default {
  data () {
    return {
      isIndeterminate: false,
      checkAll: false,
      specialList: [],
      total: 0,
      pager: {
        page: 1,
        size: 10
      },
      show: false,
      projectId: '',
      isAssess: 0,
      recmdSpecSummary: {},
      specialIds: [],
      allIds: [],
      canRecommend: false
    }
  },
  methods: {
    handleCurrentChange (value) {
      this.pager.page = value
      this.fetchSpecialList()
    },
    fetchNum () {
      // 获取数量
      this.$http.get('/api/v1.0/fa/projectSpecialist/assess?projectId=' + this.projectId).then(res => {
        this.recmdSpecSummary = res.data.data
      })
    },
    fetchSpecialList () {
      // 获取投资人列表
      let _vue = this
      _vue.$http.post('/api/v1.0/fa/projectSpecialist/page', {
        'pageNum': _vue.pager.page,
        'pageSize': _vue.pager.size,
        'parameters': {
          'projectId': _vue.projectId,
          'isAssess': _vue.isAssess
        }
      }).then(res => {
        let result = res.data.data
        _vue.total = result.total
        _vue.specialList = result.data
        _vue.allIds = _.pluck(_vue.specialList, 'id')
      })
    },
    handleCheckAllChange (val) {
      // 全选
      this.specialIds = val ? this.allIds : []
      _.map(this.specialList, item => {
        if (this.specialIds.indexOf(item.id) !== -1) {
          item.checked = true
        } else {
          item.checked = false
        }
      })
      this.isIndeterminate = false
    },
    handleChecked () {
      // 单项选择
      let _vue = this
      _vue.specialIds = _.pluck(_.where(_vue.specialList, { checked: true }), 'id')
      // 显示全选按钮
      this.checkAll = _vue.specialIds.length === _vue.allIds.length
      this.isIndeterminate = _vue.specialIds.length > 0 && _vue.specialIds.length < _vue.allIds.length
      // NOTICE: 数组内对象属相作为v-model时  数据双向绑定会有问题，重新更新list就可以了
      _vue.specialList = JSON.parse(JSON.stringify(_vue.specialList))
    },
    notice (item) {
      // 发送消息提醒 - 项目评估
      let _vue = this
      _vue.$http.get('/api/v1.0/fa/projectSpecialist/seeAlert?specialistUserIds=' + item.userId).then(res => {
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
      let ids = _.pluck(_.where(_vue.speciaList, { checked: true }), 'userId').toString()
      _vue.$http.get('/api/v1.0/fa/projectSpecialist/seeAlert?specialistUserIds=' + ids).then(res => {
        _vue.$message({
          message: '已发送提醒消息',
          center: true,
          type: 'success'
        })
      })
    },
    changeTab (type) {
      // 切换tab
      this.pager.page = 1
      this.isAssess = type
      this.fetchSpecialList()
    },
    goRecommend () {
      // 继续推荐
      this.show = false
      window.setTimeout(() => {
        this.$emit('emitContinueRecmdSpecial')
      }, 500)
    },
    revoke (item) {
      // 撤回评论
      this.$http.get('/api/v1.0/fa/projectSpecialist/assessRevoke?id=' + item.id).then(res => {
        this.$message({
          message: '评论已撤回',
          center: true,
          type: 'success'
        })
        this.fetchSpecialList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-dialog-right.el-dialog__wrapper {
    > :first-child {
      margin: 0 auto !important;
      margin-right: 0 !important;
      overflow: auto;
      height: 100%;
      width: 40%;
      .el-form {
        width: 100%;
      }
    }
  }
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
          padding: 10px 0;
          &:last-child {
            border-bottom: none;
          }
          .el-checkbox {
            width: 30px;
          }
          .investor-item-inner {
            display: flex;
            align-items: start;
            .basic-wrap {
              flex: 1;
              .message {
                color: #909399;
              }
            }
            .attr-wrap {
              flex: 1;
              text-align: right;
              .attr-item {
                display: flex;
                .title {
                  color: #909399;
                  width: 70px;
                }
              }
            }
          }
          .content {
            padding-left: 30px;
            .title {
              color: #909399;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .text {
                flex: 1;
              }
              .right {
                text-decoration: underline;
                text-align: right;
                &.text {
                  text-decoration: none;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
