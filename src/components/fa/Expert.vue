<template>
  <div class="expert-wrap">
    <div class="table-list-wrap">
      <div class="list-search-wrap">
        <el-form :inline="true" ref="searchForm" :model="searchForm" class="form-inline" label-width="80px">
          <el-form-item label="内容确认">
            <el-select v-model="searchForm.stage">
              <el-option label="全部" value=""></el-option>
              <el-option label="确认" value="1"></el-option>
              <el-option label="未确认" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="注册时间">
            <el-date-picker
              v-model="searchForm.startTime"
              type="date"
              value-format="yyyy-MM-dd"
              range-separator="至"
              placeholder="开始时间">
            </el-date-picker>
            <span>至</span>
            <el-date-picker
              v-model="searchForm.endTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="公司名称">
            <el-input v-model="searchForm.companyName" placeholder="公司名称"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="searchForm.name" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchEvent">搜索</el-button>
            <el-button type="primary" plain @click="clearSearch">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="tableList"
        header-row-class-name="tableheader"
        border
        style="width: 100%;">
        <el-table-column
          label="序号"
          type="index"
          width="50"
          align="center">
        </el-table-column>
        <el-table-column
          label="姓名"
          align="center">
          <template slot-scope="scope">
            <span class="link" @click="viewDetail(scope.row.id)" v-if="scope.row.userInfoModel && scope.row.userInfoModel.name">{{scope.row.userInfoModel?scope.row.userInfoModel.name:''}}</span>
            <el-button @click="viewDetail(scope.row.id)" v-if="!(scope.row.userInfoModel && scope.row.userInfoModel.name)" type="primary" size="mini">完善信息</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="公司"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.companyName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="职务"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userInfoModel?scope.row.userInfoModel.job:''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="联系电话"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userInfoModel?scope.row.userInfoModel.mobile:''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="城市"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userInfoModel?scope.row.userInfoModel.address:''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="注册时间"
          width="170"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userInfoModel?scope.row.userInfoModel.createTime:''}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="工单留言"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userInfoModel.createTime}}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          label="推荐项目"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.projectNum}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="内容确定"
          width="140"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userInfoModel?scope.row.userInfoModel.stage === 4?'确认':'未确认':''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="公众号状态"
          width="140"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userInfoModel?scope.row.userInfoModel.isAttention === 1?'已关注':'未关注':''}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pager-wrap">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="pageTotal"
          :page-size="pageSize"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchForm: {
        stage: '',
        startTime: '',
        endTime: '',
        companyName: '',
        name: ''
      },
      apiForm: {
        isAttention: -1,
        professionalField: -1,
        stage: -1,
        time: [],
        search: ''
      },
      tableList: [],
      pageSize: 20,
      pageNum: 1,
      pageTotal: 0
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    searchEvent () {
      this.pageNum = 1
      this.getList()
    },
    clearSearch () {
      this.searchForm = {
        stage: '',
        startTime: '',
        endTime: '',
        companyName: '',
        name: ''
      }
    },
    getList () {
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        parameters: {
          stage: this.searchForm.stage,
          startTime: this.searchForm.startTime ? this.searchForm.startTime + ' 00:00:00' : '',
          endTime: this.searchForm.endTime ? this.searchForm.endTime + ' 23:59:59' : '',
          companyName: this.searchForm.companyName,
          name: this.searchForm.name
        }
      }
      this.$http.post('/api/v1.0/fa/specialist/page', data).then((res) => {
        let result = res.data.data
        this.pageTotal = result.total
        this.pageNum = result.pageNum
        this.tableList = result.data
      })
    },
    handleCurrentChange (value) {
      this.pageNum = value
      this.getList()
    },
    viewDetail (id) {
      this.$router.push('/fa/expert/' + id)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";
  .link {
    color: #409eff;
    text-decoration: underline;
    cursor: pointer;
  }
</style>
