<template>
  <div class="expert-wrap">
    <div class="table-list-wrap">
      <div class="list-search-wrap">
        <el-form :inline="true" ref="searchForm" :model="searchForm" class="form-inline" label-width="100px">
          <el-form-item label="内容确认">
            <el-select v-model="searchForm.stage">
              <el-option v-for="(item, index) in stage" :key="index" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主投阶段">
            <el-select v-model="searchForm.investorStage">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item, index) in INVESTORSTAGE" :key="index" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="注册时间">
            <el-date-picker
              v-model="searchForm.startTime"
              type="date"
              value-format="yyyy-MM-dd"
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
          <br/>
          <el-form-item label="姓名" label-width="100px">
            <el-input v-model="searchForm.name" placeholder="输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="公司别称" label-width="100px">
            <el-input v-model="searchForm.mechanismName" placeholder="输入机构名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchEvent">搜索</el-button>
            <el-button type="primary" plain @click="clearSearch">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="dataList"
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
          width="150"
          align="center">
          <template slot-scope="scope">
            <span class="link" size="small" @click='goTheDetail(scope.row.id)'>{{scope.row.userInfoModel === null ? '暂无' : scope.row.userInfoModel.name}}</span>
            <el-button @click="goTheDetail(scope.row.id)"
                       v-if="!(scope.row.userInfoModel && scope.row.userInfoModel.name)" type="primary" size="mini">完善信息
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="公司别称"
          width="200"
          align="center">
          <template slot-scope="scope">
            <span class="link" size="small" @click='goTheOrg(scope.row)'>{{scope.row.mechanismModel === null ? '暂无' : scope.row.mechanismModel.mechanismName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="职务"
          width="150"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userInfoModel === null ? '暂无' : scope.row.userInfoModel.job}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="联系方式"
          width="150"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userInfoModel === null ? '暂无' : scope.row.userInfoModel.mobile}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="城市"
          width="150"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userInfoModel === null ? '暂无' : scope.row.userInfoModel.address}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="主投阶段"
          width="auto"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.investorStage}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="主投产业"
          width="160"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.semiconductor}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="对内标签"
          width="160"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.innerLabel}}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          label="注册时间"
          width="160"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userInfoModel === null ? '暂无' : scope.row.userInfoModel.createTime}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="工单留言"
          width="100"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.msg.totalmsg}}</span>|
            <span style="color:Red">{{scope.row.msg.msg}}条未读</span>
          </template>
        </el-table-column> -->
        <el-table-column
          label="推荐项目"
          width="100"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.projectNumber === null ? '暂无' : scope.row.projectNumber}}个</span>
          </template>
        </el-table-column>
        <el-table-column
          label="内容确认"
          width="100"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userInfoModel === null ? '暂无' : scope.row.userInfoModel.stage === 4?'确认':'未确认'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="公众号状态"
          width="100"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userInfoModel === null ? '暂无' : scope.row.userInfoModel.isAttention === 1?'已关注':'未关注'}}</span>
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
import Global from 'assets/js/global'
import cityHotJs from 'assets/js/city_hot'
export default {
  data () {
    return {
      INVESTORSTAGE: Global.CONSTANT.INVESTORSTAGE, // 主投阶段
      INDUSTRIALCATEGORY: [], // 主投产业
      stage: [
        {label: '全部', value: ''},
        {label: '确认', value: 4},
        {label: '未确认', value: 5}
      ],
      searchForm: {
        stage: '',
        investorStage: '',
        name: '',
        mechanismName: '',
        semiconductor: '',
        startTime: '',
        endTime: ''
      },
      apiForm: {
        stage: '',
        investorStage: '',
        name: '',
        mechanismName: '',
        semiconductor: '',
        startTime: '',
        endTime: ''
      },
      parameters: {
        type: '2',
        keyWord: '',
        investorStage: '',
        stage: '',
        semiconductor: '',
        startTime: '',
        endTime: ''
      },
      industrialCategory: [],
      projectPhase: [
        {label: '用户微信授权', id: 0},
        {label: '已提交手机号，邮箱', id: 1},
        {label: '已选择了用户类型', id: 2},
        {label: '后台已填写用户信息', id: 3},
        {label: '已用户核对信息', id: 4}
      ],
      tableList: [],
      pageSize: 20,
      pageNum: 1,
      pageTotal: 0,
      addOrEditForm: {
        name: '',
        phone: '',
        email: '',
        city: [],
        workExp: [],
        educationExp: [],
        isAttention: 0,
        outTagArr: [],
        inTagArr: [],
        teamExp: [],
        jobHopping: {
          current_company: '',
          plan_company: '',
          plan_time: '',
          reason: ''
        },
        entrepreneurialHistory: []
      },
      dialogVisible: false,
      uploadImg: {
        loading: false,
        uploadedImageUrl: ''
      },
      uploadData: {
        key: '',
        token: ''
      },
      cityTreeData: cityHotJs.citys,
      tagsOpts: [], // 标签
      fetchTagLoading: false, // 标签
      ckeditorConfig: {
        toolbarGroups: [
          { name: 'paragraph', groups: ['list'] }
        ],
        height: 200
      },
      dataList: []
    }
  },
  created () {
    // TODO: 添加搜索词查询
    console.log(this.$route.query.company)
    this.parameters = {
      type: '2',
      keyWord: '',
      investorStage: '',
      stage: '',
      semiconductor: '',
      startTime: '',
      endTime: ''
    }
    if (this.$route.query.company) {
      this.parameters.keyWord = this.$route.query.company
    }
    console.log('this.parameters--------')
    console.log(this.parameters)
    this.getList(this.parameters)
    this.getIndustrialCategory()
  },
  methods: {
    getIndustrialCategory () {
      this.$http.get('/api/v1.0/fa/common/find', {params: {name: 'industrialCategory'}}).then((res) => {
        let result = res.data.data
        this.INDUSTRIALCATEGORY = result
      })
    },
    // 跳转到详情页
    goTheDetail (id) {
      console.log('跳转到详情页ID|' + id)
      this.$router.push({name: 'investorDetail', params: {id: id}})
    },
    // 公司点击跳转到投资机构列表
    goTheOrg (row) {
      this.$router.push({
        name: 'investorOrgDetail',
        params: {
          id: row.mechanismModel.id
        }
      })
    },
    searchEvent () {
      this.apiForm = JSON.parse(JSON.stringify(this.searchForm))
      this.pageNum = 1
      this.parameters = {
        type: '2',
        name: this.apiForm.name,
        mechanismName: this.apiForm.mechanismName,
        investorStage: this.apiForm.investorStage === 0 ? '' : this.apiForm.investorStage,
        stage: this.apiForm.stage === -1 ? '' : this.apiForm.stage,
        semiconductor: this.apiForm.semiconductor === 0 ? '' : this.apiForm.semiconductor,
        startTime: this.apiForm.startTime ? this.apiForm.startTime + ' 00:00:01' : '',
        endTime: this.apiForm.endTime ? this.apiForm.endTime + ' 23:59:59' : ''
      }
      this.getList(this.parameters)
    },
    clearSearch () {
      this.searchForm = {
        stage: '',
        investorStage: '',
        startTime: '',
        endTime: '',
        name: '',
        mechanismName: '',
        semiconductor: ''
      }
    },
    getList (parameters) {
      // this.pageTotal = 0
      let self = this
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        parameters: parameters
      }
      this.$http.post('/api/v1.0/fa/investor/page', data).then((res) => {
        let _data = res.data.data
        self.pageTotal = _data.total
        self.pageNum = _data.pageNum
        _data.data.map((item) => {
          item.externalLabel = item.externalLabel === null ? '暂无' : item.externalLabel.replace(new RegExp(',', 'gm'), ' / ')
          item.innerLabel = item.innerLabel === null ? '暂无' : item.innerLabel.replace(new RegExp(',', 'gm'), ' / ')
          item.investorStage = item.investorStage === null ? '暂无' : self.stringifyArr(item.investorStage, self.INVESTORSTAGE)
          item.semiconductor = item.semiconductor === null ? '暂无' : self.stringifyArr(item.semiconductor, self.INDUSTRIALCATEGORY)
          return item
        })
        self.dataList = _data.data
        console.log('投资人列表')
        console.log(self.dataList)
      })
    },
    // 字符串转换
    stringifyArr (str, options) {
      if (str.length === 1) {
        options.map((item) => {
          if (str === JSON.stringify(item.value)) {
            str = item.label
            return str
          }
        })
        return str
      }
      let arr = str.split(',')
      options.map((item) => {
        arr.map((items, index) => {
          if (items === JSON.stringify(item.value)) {
            arr[index] = item.label
            return items
          }
        })
      })
      arr = arr.join(',').replace(new RegExp(',', 'gm'), ' / ')
      return arr
    },
    handleCurrentChange (value) {
      this.pageNum = value
      // let parameters = {
      //   type: '2',
      //   keyWord: '',
      //   investorStage: '',
      //   stage: '',
      //   semiconductor: '',
      //   startTime: '',
      //   endTime: ''
      // }
      this.getList(this.parameters)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";
</style>
<style lang="scss">
  .expert-wrap{
    .el-dialog{
      // margin-right: 0;
      display: flex;
      flex-direction: column;
      .el-dialog__body{
        height: 100%;
        overflow: auto;
        .upload-image{
          max-height:200px;
          max-width:200px;
        }
        .workExp{
          &+.workExp{
            margin-top:10px;
            padding-top:12px;
            border-top: 1px dashed #ddd;
          }
          &+button{
             margin-top:10px;
          }
          .el-form-item+.el-form-item{
            margin-top:10px;
          }
          .el-date-editor--daterange.el-input__inner{width:100%;}
          .el-date-editor.el-input{
            width:100%;
          }
        }
        .hr{
          margin:40px 0;
          height:1px;
          background-color: #ddd;
          position: relative;
          span{
            position: absolute;
            width:150px;
            background-color: #fff;
            text-align: center;
            left: 50%;
            transform: translate(-50%,-50%)
          }
        }
      }
    }
    .mettingDate_box {
      width: 100%;
      height: 100%;
      position:fixed;
      top: 0;
      left:0;
      bottom:0;
      right:0;
      z-index:9999;
      background-color: rgba(0, 0, 0, 0.678);
      .mettingTable{
        width: 50%;
        min-height: 30%;
        position: absolute;
        top: 25vh;
        right:2vh;
        padding:30px;
        background-color: #fff;
      }
    }
  }
  .link {
    color: #409eff;
    text-decoration: underline;
    cursor: pointer;
  }
</style>
