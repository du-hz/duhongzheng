<template>
  <div class="table-list-wrap">
    <div class="list-title">机构管理</div>
    <div class="list-search-wrap">
      <el-form :inline="true" class="form-inline" label-width="70px">
        <el-form-item style="margin-left: 20px;">
          <el-input v-model="searchForm.text" clearable placeholder="输入机构ID/机构名称检索" style="width: 400px;"></el-input>
        </el-form-item>
        <el-button type="primary" @click="searchNews">查询</el-button>
        <!-- <div style="margin-bottom: 20px;"> -->
          <el-button type="primary" @click="batchDel()">删除</el-button>
          <el-button type="primary" @click="addOrg">新建机构</el-button>
        <!-- </div> -->
      </el-form>
    </div>
    <el-table
      style="width: 100%"
      max-height="500"
      ref="multipleTable"
      :data="newsList"
      border
      header-row-class-name="tableheader selection"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column
        prop="id"
        label="机构ID"
        width="100px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="title"
        label="机构名称"
        width="200px"
        align="center">
      </el-table-column>
      <el-table-column
        label="机构logo"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <img :src="scope.row.logo | filterQiniuMooreImage" class="imgHeader">
        </template>
      </el-table-column>
      <el-table-column
        prop="serviceArea"
        label="服务范围"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        label="举办活动(仅作为主办方的活动)"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <span class="text-link" @click="openList(scope.row.id, scope.row.title)">{{scope.row.numOfActivity || 0}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="详情页访问人数"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.numberOfDetailPage || 0}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="举办活动报名人数"
        width="155px"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.numberOfSignUp || 0}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="tags"
        label="标签"
        width="155px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="155px"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | filterDateformat}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="modifyTime"
        label="更新时间"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.modifyTime | filterDateformat}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否显示"
        width="155px"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.isShow? '不显示' : '显示'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="creatorName"
        label="创建者"
        width="155px"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <span class="text-link" @click="editOrg(scope.row)">编辑</span>
          <span class="text-link" @click="batchDel(scope.row)">删除</span>
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
    <el-dialog
      title="举办活动列表"
      :visible.sync="dialogVisible"
      class="webDialogFlex"
      width="800px">
      <div class="webDialogFlexMain">
        <p class="title">机构名称:{{listName}}</p>
        <div class="tableParent">
          <el-table
            style="width: 100%"
            ref="multipleTable"
            :data="activityList"
            border
            header-row-class-name="tableheader selection">
            <el-table-column
              prop="id"
              label="活动ID"
              align="center">
            </el-table-column>
            <el-table-column
              prop="title"
              label="活动名称"
              align="center">
            </el-table-column>
            <el-table-column
              label="活动开始时间"
              align="center">
              <template slot-scope="scope">
                <span>{{scope.row.startTime | filterDateformatH}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="seminarStatus"
              label="状态"
              align="center">
            </el-table-column>
            <el-table-column
              label="报名人数/报名上限"
              align="center">
              <template slot-scope="scope">
                <span>{{scope.row.realSingup || 0}}/{{scope.row.maxSignup || '无上限'}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pager-wrap">
          <el-pagination
            background
            layout="total, prev, pager, next"
            :total="dialogpageToal"
            :page-size="10"
            @current-change="activityPageChange">
          </el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'underscore'
// import Global from 'assets/js/global'

export default {
  name: 'expoList',
  data () {
    return {
      newsList: [],
      searchForm: {
        startTime: '',
        endTime: '',
        text: ''
      },
      pager: {
        page: 1,
        size: 10
      },
      totalNum: 0,
      multipleSelection: [],
      dialogVisible: false,
      dialogpageNum: 1,
      dialogpageToal: 0,
      listId: 0,
      listName: '',
      activityList: []
    }
  },
  created () {
    let _vue = this
    _vue.fetchNewsList()
  },
  methods: {
    fetchNewsList () {
      // 获取新闻列表
      let _vue = this
      _vue.$http.get('/api/v1.0/expo/organization/organization_list?page=' + _vue.pager.page +
        '&per_page=' + _vue.pager.size +
        '&beginTime=' + (_vue.searchForm.startTime || '') +
        '&endTime=' + (_vue.searchForm.endTime || '') +
        '&text=' + _vue.searchForm.text).then((response) => {
        _vue.newsList = response.data.data.rows
        _vue.totalNum = response.data.data.total
      })
    },
    searchNews () {
      let _vue = this
      _vue.pager.page = 1
      _vue.fetchNewsList()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleCurrentChange (val) {
      let _vue = this
      _vue.pager.page = val
      _vue.fetchNewsList()
    },
    batchDel (row) {
      // 删除机构
      let _vue = this
      if (!row && _vue.multipleSelection.length === 0) {
        _vue.$message({
          type: 'warning',
          message: '请至少选择一条新闻',
          center: true
        })
        return
      }
      this.$confirm('删除后将无法恢复,确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row) {
          _vue.$http.post('/api/v1.0/expo/organization/delete_organization', {
            str: row.id.toString()
          }).then(() => {
            _vue.$message({
              type: 'success',
              message: '删除成功',
              center: true
            })
            _vue.pager.page = 1
            _vue.fetchNewsList()
          }).catch(() => {
            _vue.$message({
              type: 'error',
              message: '请稍后重试',
              center: true
            })
          })
        } else {
          let ids = _.pluck(_vue.multipleSelection, 'id')
          _vue.$http.post('/api/v1.0/expo/organization/delete_organization', {
            str: ids.toString()
          }).then(() => {
            _vue.$message({
              type: 'success',
              message: '删除成功',
              center: true
            })
            _vue.pager.page = 1
            _vue.fetchNewsList()
          }).catch(() => {
            _vue.$message({
              type: 'error',
              message: '请稍后重试',
              center: true
            })
          })
        }
      })
    },
    addOrg () {
      // 新增机构
      this.$router.push({
        path: '/news/expo/orgNew'
      })
    },
    editOrg (row) {
      // 编辑机构
      this.$router.push({
        path: '/news/expo/orgNew?id=' + row.id
      })
    },
    openList (id, name) {
      if (id) {
        this.listId = id
        this.listName = name
        this.dialogVisible = true
        this.dialogpageNum = 1
        this.dialogpageToal = 0
        this.getactivityList()
      }
    },
    getactivityList () {
      this.activityList = []
      this.$http.get('/api/v1.0/expo/organization/seminar_list?page=' + this.dialogpageNum +
        '&per_page=10' +
        '&organizationId=' + this.listId).then((response) => {
        this.activityList = response.data.data.rows
        this.dialogpageToal = response.data.data.total
      })
    },
    activityPageChange (val) {
      this.pager.page = val
      this.getactivityList()
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
  .imgHeader{
    max-width:90px;
    max-height:90px;
  }
</style>
<style lang="scss">
  .webDialogFlex{
    .el-dialog{
      height:70vh;
      display:flex;
      flex-direction: column;
      .el-dialog__header{
        text-align:center;
      }
      .el-dialog__body{
        flex:1;
        padding:0 10px 30px;
        position: relative;
      }
      .webDialogFlexMain{
        position: absolute;
        top:0;
        left:10px;
        bottom:30px;
        right:10px;
        box-sizing:border-box;
        overflow: hidden;
        display:flex;
        flex-direction: column;
        &>.title{
          margin-bottom:10px;
          font-size:16px;
          height:20px;
        }
        .tableParent{
          height:100%;
          overflow: auto;
          .el-table{
            margin-bottom:2px;
          }
        }
        .tableheader.selection th:first-child {
          background-color: #409eff;
        }
        .pager-wrap{
          height:32px;
        }
      }
    }
  }
</style>
