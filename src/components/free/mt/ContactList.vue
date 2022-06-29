<template>
  <div class="table-list-wrap">
    <!-- 列表 -->
    <el-table
      :data="tableData"
      header-row-class-name="tableheader"
      border
      style="width: 100%;">
      <el-table-column
        type="index"
        width="50"
        align="center">
      </el-table-column>
      <el-table-column
        label="姓名"
        width="120"
        align="center">
        <template slot-scope="scope">
          <span class="text-link" @click="viewDetail(scope.row)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="currentEngineFunctionIdMany"
        label="职能"
        min-width="160"
        align="center">
      </el-table-column>
      <el-table-column
        label="职级"
        min-width="120"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.rank | rankFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="currentJobTitle"
        label="当前职位"
        min-width="140"
        align="center">
      </el-table-column>
      <el-table-column
        prop="mobilePhone"
        label="电话"
        min-width="120"
        align="center">
      </el-table-column>
      <el-table-column
        prop="contactEmail"
        label="邮箱"
        min-width="120"
        align="center">
      </el-table-column>
      <el-table-column
        prop="lastActiveTime"
        label="最后活跃时间"
        min-width="160"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="160"
        fixed="right"
        align="center">
        <template slot-scope="scope">
          <!--<el-button type="primary" size="small" @click="viewMobile(scope.row)">查看联系方式</el-button>-->
          <el-button type="primary" size="small" @click="viewAction(scope.row)">查看行为数据</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 联系方式 -->
    <el-dialog
      title="联系方式"
      :visible.sync="dialogVisible"
      width="30%"
      center>
      <div class="content">
        <div class="name">姓名：{{contact.name}}</div>
        <div class="mobile">联系电话：{{contact.mobile[0]}}</div>
        <div class="email">联系邮箱：{{contact.email[0]}}</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      totalNum: 0,
      pager: {
        size: 10,
        curPage: 1
      },
      search: {
        account: this.$route.query.loginid,
        username: this.$route.query.name,
        companyName: this.$route.query.company,
        source: 'oa',
        signature: this.$route.query.signature,
        searchTalentPoolId: this.$route.query.searchTalentPoolId || ''
      },
      tableData: [],
      dialogVisible: false,
      contact: {
        name: '',
        mobile: [],
        email: []
      }
    }
  },
  created () {
    this.fetchData()
  },
  filters: {
    rankFilter (rank) {
      rank = JSON.parse(rank)
      if (rank && rank.length > 0) {
        let max = rank[0]
        for (let i = 1; i < rank.length; i++) {
          if (rank[i] > max) {
            max = rank[i]
          }
        }
        console.log(max)
        let rankId = parseInt(max)
        if (rankId === 1) {
          return '辅助性专业人员'
        } else if (rankId === 2) {
          return '（资深）工程师级别'
        } else if (rankId === 3) {
          return '经理级'
        } else if (rankId === 4) {
          return '总监及以上级别'
        }
      }
      return ''
    }
  },
  methods: {
    fetchData () {
      let _vue = this
      _vue.$http.get('/api/v1.0/crm/talent?account=' + _vue.search.account +
        '&username=' + _vue.search.username +
        '&companyName=' + _vue.search.companyName +
        '&source=' + _vue.search.source +
        '&signature=' + _vue.search.signature).then(function (response) {
        _vue.tableData = response.data
      })
    },
    viewDetail (row) {
      // 查看详情
      let _vue = this
      let url = 'http://adminp.mooreelite.com/api/hunter/talent_resume.htm?talentPoolId=' + row.talentPoolId +
        '&account=' + _vue.search.account +
        '&username=' + _vue.search.username +
        '&companyName=' + _vue.search.companyName +
        '&source=' + _vue.search.source +
        '&signature=' + _vue.search.signature +
        '&searchTalentPoolId=' + _vue.search.searchTalentPoolId
      window.open(url)
    },
    viewMobile (row) {
      // 查看联系方式
      let _vue = this
      _vue.$http.get('/api/v1.0/crm/contacts?talentPoolId=' + row.talentPoolId).then(function (response) {
        _vue.dialogVisible = true
        _vue.contact = response.data.data
        _vue.contact.name = row.name
      })
    },
    viewAction (row) {
      // 查看行为数据
      let _vue = this
      this.$router.push({
        path: '/free/mt/contact/log',
        query: {
          talentPoolId: row.talentPoolId,
          account: _vue.search.account,
          username: _vue.search.username,
          companyName: _vue.search.companyName,
          source: _vue.search.source,
          signature: _vue.search.signature,
          searchTalentPoolId: _vue.search.searchTalentPoolId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";
</style>
