<template>
  <div class="table-list-wrap">
    <div class="list-title">人员审核<el-button type="primary" size="mini" @click="$router.back(-1)" style="margin-left:10px;">返回上页</el-button></div>
    <div class="checkStates" style="width:600px;">
      <div :class="realSearchForm.approvalStatus===1?'active':''" @click="checkStatesChange(1)">报名通过</div>
      <div :class="realSearchForm.approvalStatus===0?'active':''" @click="checkStatesChange(0)">报名待审核</div>
      <div :class="realSearchForm.approvalStatus===2?'active':''" @click="checkStatesChange(2)">审核未通过</div>
    </div>
    <div class="list-search-wrap">
      <el-form :inline="true" class="form-inline" label-width="70px">
        <el-form-item label="查询时间">
          <el-date-picker
            v-model="searchForm.startTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="开始日期"
            type="date"
            style="width: 150px;"
            clearable>
          </el-date-picker>
        </el-form-item>
        <span style="padding-right: 10px;">至</span>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.endTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            placeholder="结束日期"
            style="width: 150px;"
            clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item style="margin-left: 20px;">
          <el-input v-model="searchForm.text" clearable placeholder="输入报名ID/姓名/工作年限检索" style="width: 250px;"></el-input>
        </el-form-item>
        <!-- <el-form-item style="margin-left: 20px;">
          <el-select v-model="searchForm.approvalStatus" placeholder="请选择">
            <el-option
              v-for="item in [{label:'报名通过',id:1},{label:'报名待审核',id:0},{label:'审核未通过',id:2}]"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-button type="primary" @click="searchNews">查询</el-button>
        <el-button type="primary" @click="agreeCheck(true)" v-if="realSearchForm.approvalStatus === 0 || realSearchForm.approvalStatus === 2">批量通过</el-button>
        <el-button type="primary" @click="refuseCheck(true)" v-if="realSearchForm.approvalStatus === 0 || realSearchForm.approvalStatus === 1">批量拒绝</el-button>
        <el-button type="primary" @click="exportExcel(true)" :loading="exportLoading">批量导出</el-button>
        <el-button type="primary" @click="exportExcel(false)" :loading="manyExportLoading">全部导出</el-button>
      </el-form>
      <!-- <div style="margin-bottom: 20px;">
        <el-button type="primary" @click="batchDel()">删除</el-button>
        <el-button type="primary" @click="addGuest">新建嘉宾</el-button>
      </div> -->
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
        label="报名ID"
        width="100px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="fullname"
        label="姓名"
        width="200px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="workingYear"
        label="工作年限"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        label="公司/学校"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.currentCompanyName}}/{{scope.row.schoolName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="major"
        label="职位/专业"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.currentJobTitle}}/{{scope.row.fieldOfStudy}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="mobilePhone"
        label="联系手机"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="contactEmail"
        label="联系邮箱"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        label="报名时间"
        width="155px"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | filterDateformatH}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        width="155px"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.modifyTime | filterDateformatH}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="审核时间"
        width="155px"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.modifyTime | filterDateformatH}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="checkerName"
        label="操作人"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="150px"
        align="center">
        <template slot-scope="scope">
          <el-button type="mini" @click="agreeCheck(false, scope.row)" v-if="scope.row.approvalStatus === 0 || scope.row.approvalStatus === '0' || scope.row.approvalStatus == '2'">通过</el-button>
          <el-button type="mini" @click="refuseCheck(false, scope.row)" v-if="scope.row.approvalStatus === 0 || scope.row.approvalStatus === '0' || scope.row.approvalStatus == '1'">拒绝</el-button>
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
      title="审核拒绝"
      :visible.sync="dialogVisible"
      class="webDialogFlex"
      width="800px">
      <div class="webDialogFlexMain">
        <div class="tableParent">
          <h3 style="font-size:16px;line-height:35px;">你将拒绝审核通过以下人员报名展会:</h3>
          <el-table
            style="width: 100%"
            ref="multipleTable"
            :data="nameList"
            border
            header-row-class-name="tableheader selection">
            <el-table-column
              prop="name"
              label="用户姓名"
              align="center">
            </el-table-column>
            <el-table-column
              prop="workingYear"
              label="工作年限"
              align="center">
            </el-table-column>
            <el-table-column
              label="公司/学校"
              align="center">
              <template slot-scope="scope">
                <span>{{scope.row.currentCompanyName}}/{{scope.row.schoolName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="职位/专业"
              align="center">
              <template slot-scope="scope">
                <span>{{scope.row.currentJobTitle}}/{{scope.row.fieldOfStudy}}</span>
              </template>
            </el-table-column>
          </el-table>
          <p>合计：{{nameList.length}}人</p>
          <el-form ref="form" :model="form" style="width:100%">
            <el-form-item label="请输入拒绝理由" required>
              <el-input v-model="form.input" placeholder="请输入拒绝理由" type="textarea" :rows="5"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="pager-wrap">
          <el-button :loading="confirmLoading" @click="confirmRefuse">确认</el-button>
          <el-button @click="dialogVisible=false">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import _ from 'underscore'
// import Global from 'assets/js/global'

export default {
  name: 'expoList',
  data () {
    return {
      id: (this.$route.query && this.$route.query.id) || '',
      newsList: [],
      searchForm: {
        startTime: '',
        endTime: '',
        text: ''
      },
      realSearchForm: {
        startTime: '',
        endTime: '',
        text: '',
        approvalStatus: 0
      },
      pager: {
        page: 1,
        size: 10
      },
      totalNum: 0,
      multipleSelection: [],
      nameList: [],
      form: {
        input: ''
      },
      dialogVisible: false,
      confirmLoading: false,
      exportLoading: false,
      manyExportLoading: false
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
      _vue.$http.get('/api/v1.0/expo/signup/signup_list?page=' + _vue.pager.page +
        '&per_page=' + _vue.pager.size +
        '&beginTime=' + (_vue.realSearchForm.startTime || '') +
        '&endTime=' + (_vue.realSearchForm.endTime || '') +
        '&approvalStatus=' + _vue.realSearchForm.approvalStatus +
        '&seminarId=' + _vue.id +
        '&text=' + _vue.realSearchForm.text).then((response) => {
        _vue.newsList = response.data.data.rows
        _vue.totalNum = response.data.data.total
      })
    },
    searchNews () {
      let _vue = this
      this.realSearchForm = {
        ...this.realSearchForm,
        ...JSON.parse(JSON.stringify(this.searchForm))
      }
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
    checkChange (id, type, input = '') {
      this.$http.post('/api/v1.0/expo/signup/update_approvalStatus', {id: id, approvalStatus: type, rejectReason: input}).then((response) => {
        this.fetchNewsList()
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.confirmLoading = false
      }).catch(() => {
        this.$message.error('请求出错')
        this.confirmLoading = false
      })
    },
    agreeCheck (isMany, content) {
      this.nameList = []
      if (isMany) {
        if (!this.multipleSelection.length) {
          this.$message.warning('请选择人员')
        } else {
          this.checkChange(this.multipleSelection.map(res => { return res.id }).join(','), 1)
        }
      } else {
        this.checkChange(content.id, 1)
      }
    },
    refuseCheck (isMany, content) {
      this.nameList = []
      if (isMany) {
        if (!this.multipleSelection.length) {
          this.$message.warning('请选择人员')
        } else {
          this.nameList = JSON.parse(JSON.stringify(this.multipleSelection))
          this.dialogVisible = true
        }
      } else {
        this.nameList = [JSON.parse(JSON.stringify(content))]
        this.dialogVisible = true
      }
    },
    exportExcel (type) {
      if (type && !this.multipleSelection.length) {
        this.$message.warning('请选择人员')
        return
      }
      if (type) {
        this.exportLoading = true
      } else {
        this.manyExportLoading = true
      }
      let data = {
        seminarId: this.id,
        text: '',
        selectType: type ? 1 : 0,
        ids: type ? this.multipleSelection.map(res => { return res.id }).join(',') : '',
        approvalStatus: this.realSearchForm.approvalStatus
      }
      this.$http.get('/api/v1.0/expo/signup/exportExcel', {params: data, responseType: 'arraybuffer'}).then(res => {
        var blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'})
        var downloadElement = document.createElement('a')
        var href = window.URL.createObjectURL(blob)
        downloadElement.href = href
        downloadElement.download = '人员审核名单.xlsx'
        document.body.appendChild(downloadElement)
        downloadElement.click()
        document.body.removeChild(downloadElement)
        window.URL.revokeObjectURL(href)
      }).catch(_ => {
        this.$message.error('导出失败')
      }).finally(() => {
        if (type) {
          this.exportLoading = false
        } else {
          this.manyExportLoading = false
        }
      })
    },
    confirmRefuse () {
      if (!this.form.input) {
        this.$message.warning('请输入拒绝理由')
        return
      }
      this.confirmLoading = true
      this.checkChange(this.nameList.map(res => { return res.id }).join(','), 2, this.form.input)
    },
    checkStatesChange (state) {
      this.pager.page = 1
      this.realSearchForm.approvalStatus = state
      this.fetchNewsList()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";

  .list-title {
    font-size: 18px;
    margin-bottom: 10px;
  }
  .imgHeader{
    max-width:90px;
    max-height:90px;
  }
  .checkStates{
    display: flex;
    justify-content:space-between;
    margin-bottom: 10px;
    >div{
      padding:15px 50px;
      border:1px solid #ddd;
      cursor: pointer;
    }
    .active{
      color:#fff;
      background-color:#409eff;
    }
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
        padding:0 20px 30px;
        position: relative;
      }
      .webDialogFlexMain{
        position: absolute;
        top:0;
        left:20px;
        bottom:30px;
        right:20px;
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
          height:40px;
        }
      }
    }
  }
</style>
