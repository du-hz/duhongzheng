<template>
  <div class="table-list-wrap">
    <div class="top-block">
      <div class="status-list">
        <div @click="filterByStatus(0)" class="status-item" :class="{ 'active': searchForm.status === 0 }">
          <div class="text">待处理({{ statusCount0 }})</div>
        </div>
        <div @click="filterByStatus(6)" class="status-item" :class="{ 'active': searchForm.status === 6 }">
          <div class="text">临时推荐({{ statusCount6 }})</div>
        </div>
        <div @click="filterByStatus(3)" class="status-item" :class="{ 'active': searchForm.status === 3 }">
          <div class="text">推荐中({{ statusCount1 }})</div>
        </div>
        <div @click="filterByStatus(4)" class="status-item" :class="{ 'active': searchForm.status === 4 }">
          <div class="text">已有投资({{ statusCount2 }})</div>
        </div>
        <div @click="filterByStatus(1)" class="status-item" :class="{ 'active': searchForm.status === 1 }">
          <div class="text">已结束({{ statusCount3 }})</div>
        </div>
        <div @click="filterByStatus(5)" class="status-item" :class="{ 'active': searchForm.status === 5 }">
          <div class="text">项目完成({{ statusCount5 }})</div>
        </div>
        <div @click="filterByStatus(2)" class="status-item" :class="{ 'active': searchForm.status === 2 }">
          <div class="text">无效({{ statusCount4 }})</div>
        </div>
      </div>
      <div class="list-search-wrap">
        <el-form :inline="true" ref="searchForm" :model="searchForm" class="form-inline" label-width="100px">
          <el-form-item v-if="searchForm.status === 0" label="">
            <el-select v-model="searchForm.stage" clearable placeholder="筛选项目信息状态">
              <el-option label="待完善" value="2"></el-option>
              <el-option label="等待确认" value="3"></el-option>
              <el-option label="已确认" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input style="width: 300px;" v-model="searchForm.keyword" placeholder="搜索公司/项目ID/项目代号/联系人姓名" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search('searchForm')">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 列表 -->
    <el-table
      :data="tableData"
      header-row-class-name="tableheader"
      @sort-change = "sortChange"
      style="width: 100%"
      border>
      <el-table-column
        label="序号"
        type="index"
        width="50"
        align="center">
      </el-table-column>
      <el-table-column
        prop='projectId'
        label="项目ID"
        width="150"
        sortable='custom'
        align="center">
        <template slot-scope="scope">
          <router-link class="link" :to="'/fa/project/' + scope.row.id">{{ scope.row.projectNumber }}</router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="alias"
        label="项目代号(简称)"
        width="150"
        align="center">
      </el-table-column>
      <el-table-column
        label="公司名"
        width="180"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userInfoModel && scope.row.userInfoModel.companyName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="联系人"
        width="150"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userInfoModel.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="联系电话"
        width="180"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userInfoModel.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="联系邮箱"
        width="180"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userInfoModel.email }}</span>
        </template>
      </el-table-column>
      <!-- 根据不同的状态，展示不同的列表内容和操作 -->
      <!-- IMPORTANT: element-ui table 如果表格的列表不同，要添加:key或者使用v-show -->
      <!-- 待处理 -->
      <template v-if="searchForm.status === 0">
        <el-table-column
          :key="Math.random()"
          prop="createTime"
          label="注册时间"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          :key="Math.random()"
          label="项目信息状态"
          width="120"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userInfoModel.stage | stageFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="isAgreement"
          :key="Math.random()"
          label="FA协议"
          width="120"
          sortable='custom'
          align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.isAgreement ? '已签署' : '未签署' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="isNda"
          :key="Math.random()"
          label="NDA"
          width="120"
          sortable='custom'
          align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.isNda ? '已签署' : '未签署' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200"
          align="center">
          <template slot-scope="scope">
            <!-- 根据当前状态区分操作 -->
            <el-button @click="viewProjectDetail(scope.row)" v-if="scope.row.userInfoModel.stage === 2" type="text">完善信息</el-button>
            <el-button @click="setTemporary(scope.row, 6)" type="text">设为临时推荐</el-button>
            <el-button @click="signInvalid(scope.row)" v-if="scope.row.userInfoModel.stage === 2" type="text">标记为无效</el-button>
            <el-button @click="viewProjectDetail(scope.row, 'noticeconfirm')" v-if="scope.row.userInfoModel.stage === 3" type="text">再次提醒信息确认</el-button>
            <el-button @click="viewProjectDetail(scope.row, 'recommendinvestor')" v-if="scope.row.userInfoModel.stage === 4 && scope.row.isNda === 1 && scope.row.isAgreement === 1" type="text">开始推荐</el-button>
            <el-button @click="viewProjectDetail(scope.row)" v-if="scope.row.userInfoModel.stage === 4 && (scope.row.isNda !== 1 || scope.row.isAgreement !== 1)" type="text">完善信息</el-button>
          </template>
        </el-table-column>
      </template>
      <!-- 临时推荐 -->
      <template v-if="searchForm.status === 6">
        <el-table-column
          :key="Math.random()"
          prop="createTime"
          label="注册时间"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          :key="Math.random()"
          label="项目信息状态"
          width="120"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userInfoModel.stage | stageFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="isAgreement"
          :key="Math.random()"
          label="FA协议"
          width="120"
          sortable='custom'
          align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.isAgreement ? '已签署' : '未签署' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="isNda"
          :key="Math.random()"
          label="NDA"
          width="120"
          sortable='custom'
          align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.isNda ? '已签署' : '未签署' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200"
          align="center">
          <template slot-scope="scope">
            <!-- 根据当前状态区分操作 -->
            <el-button @click="setTemporary(scope.row, 0)" type="text">设为待处理</el-button>
            <el-button @click="setTemporary(scope.row, 3)" type="text">设为推荐中</el-button>
           </template>
        </el-table-column>
      </template>
      <!-- 已结束 -->
      <template v-if="searchForm.status === 1">
        <el-table-column
          :key="Math.random()"
          label="项目备注"
          prop="closeReason"
          align="center">
        </el-table-column>
        <!-- <el-table-column
          :key="Math.random()"
          label="操作"
          fixed="right"
          align="center">
          <template slot-scope="scope">
            <el-button @click="resetRecmd(scope.row)" type="text">重新推荐</el-button>
          </template>
        </el-table-column> -->
      </template>
      <!-- 无效 -->
      <template v-if="searchForm.status === 2">
        <el-table-column
          :key="Math.random()"
          prop="createTime"
          label="注册时间"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          :key="Math.random()"
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button @click="signProjectStatus(scope.row, '0')" type="text">重新开始处理</el-button>
          </template>
        </el-table-column>
      </template>
      <!-- 推荐中 -->
      <template v-if="searchForm.status === 3">
        <el-table-column
          :key="Math.random()"
          label="已推荐投资人"
          width="120"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.recommendInvestorNumber > 0" @click="viewProjectDetail(scope.row, 'hasrecmdinvestor')" class="link">{{scope.row.recommendInvestorNumber }}人</span>
            <span class="link-text" v-if="scope.row.recommendInvestorNumber === 0" @click="viewProjectDetail(scope.row, 'hasrecmdinvestor')">0人</span>
            <el-button @click="viewProjectDetail(scope.row, 'recmdinvestor')" class="link" type="text" size="small">推荐</el-button>
          </template>
        </el-table-column>
        <el-table-column
          :key="Math.random()"
          label="已推荐专家"
          width="120"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.recommendSpecialistNumber > 0" @click="viewProjectDetail(scope.row, 'hasrecmdspecialist')" class="link">{{scope.row.recommendSpecialistNumber }}人</span>
            <span class="link-text" v-if="scope.row.recommendSpecialistNumber === 0">0人</span>
            <el-button @click="viewProjectDetail(scope.row, 'recmdspecialist')" class="link" type="text" size="small" v-if="scope.row.isOpen === 1">推荐</el-button>
          </template>
        </el-table-column>
        <el-table-column
          :key="Math.random()"
          label="已有预约"
          width="120"
          align="center">
          <template slot-scope="scope">
            <!-- 已有预约 -->
            <span v-if="scope.row.conferenceNumber > 0" class="link" @click="viewProjectDetail(scope.row, 'conferencereached')">{{ scope.row.conferenceNumber }}个</span>
            <span v-if="scope.row.conferenceNumber === 0">0个</span>
          </template>
        </el-table-column>
        <el-table-column
          :key="Math.random()"
          label="消息留言"
          align="center">
          <template slot-scope="scope">
            <!-- 消息留言 -->
            <span v-if="scope.row.pendingMessageNumber > 0" class="link" @click="viewProjectDetail(scope.row, 'message')">{{ scope.row.pendingMessageNumber }}条</span>
            <span v-if="scope.row.pendingMessageNumber === 0">0条</span>
          </template>
        </el-table-column>
      </template>
      <!-- 已投资 -->
      <template v-if="searchForm.status === 4 || searchForm.status === 5">
        <el-table-column
          :key="Math.random()"
          prop="createTime"
          label="注册时间"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          :key="Math.random()"
          label="当前达成阶段"
          width="150"
          align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.projectPhase | investStageFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :key="Math.random()"
          label="当前轮投资机构"
          align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.investorMechanism || '暂无' }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          :key="Math.random()"
          label="下轮推荐"
          width="150"
          fixed="right"
          align="center">
          <template slot-scope="scope">
            <el-button @click="signProjectStatus(scope.row, '0')" type="text">新一轮推荐</el-button>
          </template>
        </el-table-column> -->
      </template>
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
import FaCommon from 'assets/js/faCommon'
export default {
  data () {
    return {
      pager: {
        size: 20,
        page: 1
      },
      totalNum: 0,
      tableData: [],
      searchForm: {
        stage: '',
        keyword: '',
        status: 0
      },
      statusCount0: 0,
      statusCount1: 0,
      statusCount2: 0,
      statusCount3: 0,
      statusCount4: 0,
      statusCount5: 0,
      statusCount6: 0,
      orderMeans: 0,
      orderType: 0
    }
  },
  created () {
    let _vue = this
    if (_vue.$route.query && _vue.$route.query.status) {
      _vue.searchForm.status = parseInt(_vue.$route.query.status)
    }
    _vue.fetchData()
    _vue.fetchProjectCount()
    console.log(FaCommon)
  },
  filters: {
    stageFilter (val) {
      // 信息状态
      if (val === 0 || val === 1 || val === 2) {
        return '待完善'
      } else if (val === 3) {
        return '等待确认'
      } else if (val === 4) {
        return '已确认'
      }
    },
    projectPhaseFilter (val) {
      // 当前达成阶段
      if (val === 1) {
        return '种子'
      } else if (val === 2) {
        return '天使'
      } else if (val === 3) {
        return 'Pre-A'
      } else if (val === 4) {
        return 'A轮'
      } else if (val === 5) {
        return 'B轮'
      } else if (val === 6) {
        return 'C轮'
      } else if (val === 7) {
        return 'Pre-IPO'
      }
    }
  },
  methods: {
    sortChange (e) {
      if (e.column.label === 'FA协议') {
        this.orderType = 2
      } else if (e.column.label === 'NDA') {
        this.orderType = 3
      } else if (e.column.label === '项目ID') {
        this.orderType = 1
      }
      this.orderMeans === 0 ? this.orderMeans = 1 : this.orderMeans = 0
      this.fetchData()
    },
    fetchProjectCount () {
      this.$http.get('/api/v1.0/fa/project/findAllByStatus').then(res => {
        let result = res.data.data
        this.statusCount0 = result.pendingNumber
        this.statusCount1 = result.recommendNumber
        this.statusCount2 = result.investorNumber
        this.statusCount3 = result.endNumber
        this.statusCount4 = result.invalidNumber
        this.statusCount5 = result.investorCloseNumber
        this.statusCount6 = result.temporaryRecommendNumber
      })
    },
    handleCurrentChange (val) {
      // 分页
      let _vue = this
      _vue.pager.page = val
      _vue.fetchData()
    },
    fetchData () {
      // 查询数据
      let _vue = this
      _vue.$http.post('/api/v1.0/fa/project/page', {
        pageNum: _vue.pager.page,
        pageSize: _vue.pager.size,
        parameters: {
          status: _vue.searchForm.status,
          keyWord: _vue.searchForm.keyword.trim(),
          stage: _vue.searchForm.stage,
          orderType: _vue.orderType,
          orderMeans: _vue.orderMeans
        }
      }).then(res => {
        let result = res.data.data
        _vue.totalNum = result.total
        _vue.tableData = result.data
      })
    },
    search () {
      // 搜索按钮
      this.fetchData()
    },
    filterByStatus (status) {
      // 按状态筛选
      let _vue = this
      _vue.searchForm.status = status
      _vue.searchForm.stage = ''
      _vue.searchForm.keyword = ''
      _vue.pager = {
        size: 20,
        page: 1
      }
      _vue.tableData = []
      _vue.fetchData()
      _vue.$router.push({
        path: '/fa/project',
        query: {
          status: status
        }
      })
    },
    // 临时推荐设置
    setTemporary (row, type) {
      let _vue = this
      _vue.$http.get('/api/v1.0/fa/project/update-status?projectId=' + row.id + '&status=' + type).then(res => {
        _vue.$message({
          message: '提交成功',
          center: true,
          type: 'success'
        })
        _vue.fetchData()
        _vue.fetchProjectCount()
      })
    },
    viewProjectDetail (row, action) {
      // 跳转至项目详情
      let _vue = this
      _vue.$router.push({
        name: 'faProjectDetail',
        params: {
          id: row.id
        },
        query: {
          action: action
        }
      })
    },
    signProjectStatus (row, status) {
      // 标记项目状态
      let _vue = this
      _vue.$http.get('/api/v1.0/fa/project/addCloseReason?projectId=' + row.id + '&closeReason=&status=' + status).then(res => {
        _vue.$message({
          message: '提交成功',
          center: true,
          type: 'success'
        })
        this.fetchData()
      })
    },
    signInvalid (row) {
      // 标记无效
      let _vue = this
      _vue.$http.get('/api/v1.0/fa/project/addCloseReason?projectId=' + row.id + '&closeReason=&status=2').then(res => {
        _vue.$message({
          message: '提交成功',
          center: true,
          type: 'success'
        })
        this.fetchData()
      })
    },
    resetRecmd (row) {
      // 重新开始推荐
      let _vue = this
      _vue.$http.get('/api/v1.0/fa/project/addCloseReason?projectId=' + row.id + '&closeReason=&status=3').then(res => {
        _vue.$message({
          message: '提交成功',
          center: true,
          type: 'success'
        })
        this.fetchData()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .link {
    color: #409eff;
    text-decoration: underline;
    padding-right: 15px;
    cursor: pointer;
    &:last-child {
      padding-right: 0;
    }
  }
  .link-text {
    padding-right: 15px;
  }
  .top-block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .status-list {
      display: flex;
      justify-content: center;
      .status-item {
        padding: 0 20px;
        border-right: 1px solid #909399;
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
        &.active {
          color: #409eff;
        }
        &:last-child {
          border-right: none;
        }
        &:first-child {
          padding-left: 3px;
        }
      }
    }
    .list-search-wrap {}
  }
</style>
