<template>
  <div class="expert-wrap">
    <div class="table-list-wrap">
      <div class="list-search-wrap">
        <el-form :inline="true" ref="searchForm" :model="searchForm" class="form-inline" label-width="100px">
          <el-form-item label="公司名" label-width="100px">
            <el-input v-model="searchForm.companyName" placeholder="输入公司别称"></el-input>
          </el-form-item>
          <el-form-item label="公司别称" label-width="100px">
              <el-input v-model="searchForm.mechanismName" placeholder="输入公司别称"></el-input>
            </el-form-item>
          <el-form-item label="法人姓名" label-width="100px">
            <el-input v-model="searchForm.legalName" placeholder="输入法人姓名"></el-input>
          </el-form-item>
          <!-- <el-form-item label="注册时间">
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
          </el-form-item> -->
          <el-form-item label="机构产业类别">
            <el-input v-model="searchForm.industrialCategory" placeholder="输入机构产业类别"></el-input>
          </el-form-item>
          <el-form-item label="行业领域">
            <el-select v-model="searchForm.investmentTerritory" multiple>
              <el-option v-for="(item, index) in INDUSTRIALCATEGORY" :key="index" :label="item.lable"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchEvent">搜索</el-button>
            <el-button type="primary" plain @click="clearSearch">清空</el-button>
            <el-button type="primary" @click="openAdd">新增投资机构</el-button>
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
          label="公司名"
          width="150"
          align="center">
          <template slot-scope="scope">
            <span >{{scope.row.faMechanism.companyName}}</span>
          </template>
          <template slot-scope="scope">
            <span class="link" @click='goTheDetail(scope.row.faMechanism.id)'>{{scope.row.faMechanism.companyName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="机构类型"
          width="150"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.faMechanism.mechanismType === 1 ? '投资机构' : '产业及其他资本'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="公司别称"
          width="200"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.faMechanism.mechanismName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="法人姓名"
          width="100"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.faMechanism.legalName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="联系方式"
          width="100"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.faMechanism.legalTelephone}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="已绑定投资人"
          width="100"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.investorIds && scope.row.investorIds.length === 0">0人</span>
            <span v-if="scope.row.investorIds && scope.row.investorIds.length > 0" class="link" @click="viewInvestorList(scope.row)">{{scope.row.investorIds && scope.row.investorIds.length}}人</span>
          </template>
        </el-table-column>
        <el-table-column
          label="主投阶段"
          width="150"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.faMechanism.investmentStage}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="机构产业类别"
          width="150"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.faMechanism.industrialCategory}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="对内标签"
          width="250"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.tagVo.innerLabel}}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          label="行业领域"
          width="auto"
          align="center">
          <template slot-scope="scope">
            <span v-html='scope.row.faMechanism.investmentTerritory'></span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="主投产业"
          width="150"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.faMechanism.semiconductor | industryCategoryFilter}}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          label="注册地"
          width="100"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.faMechanism.companyRegisterAddress}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column
          label="注册时间"
          width="150"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.faMechanism.registrationTime}}</span>
          </template>
        </el-table-column>-->
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
    <AddNewMechanism ref="refAddNewMechanism" @refreshDetail='refreshGetData'></AddNewMechanism>
  </div>
</template>
<script>
import Global from 'assets/js/global'
import cityHotJs from 'assets/js/city_hot'
import AddNewMechanism from './widgets/addNewMechanism'
import FaCommon from 'assets/js/faCommon'
import _ from 'underscore'
export default {
  data () {
    return {
      INVESTORSTAGE: Global.CONSTANT.INVESTORSTAGE, // 主投阶段
      INDUSTRIALCATEGORY: [], // 行业领域
      searchForm: {
        mechanismName: '',
        companyName: '',
        legalName: '',
        investmentTerritory: [], // 行业领域
        industrialCategory: '' // 产业类别
      },
      parameters: {
        companyName: '',
        industrialCategory: '',
        investmentTerritory: '',
        legalName: '',
        startTime: '',
        endTime: ''
      },
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
          {name: 'paragraph', groups: ['list']}
        ],
        height: 200
      },
      dataList: [],
      investorFormDialogShow: false,
      processLabelArr: []
    }
  },
  components: {
    AddNewMechanism
  },
  created () {
    this.fetchAllTag()
    this.getIndustrialCategory()
  },
  mounted () {
    window.setTimeout(() => {
      this.parameters = {
        companyName: '',
        industrialCategory: '',
        investmentTerritory: '',
        legalName: '',
        startTime: '',
        endTime: ''
      }
      this.getList(this.parameters)
    }, 500)
  },
  methods: {
    getIndustrialCategory () {
      this.$http.get('/api/v1.0/fa/common/find', {params: {name: 'industrialCategory'}}).then((res) => {
        let result = res.data.data
        this.INDUSTRIALCATEGORY = _.map(result, item => {
          item.value = item.value + ''
          return item
        })
      })
    },
    refreshGetData (res) {
      console.log('res------')
      console.log(res)
      if (res) {
        console.log(res)
        let parameters = {
          companyName: '',
          industrialCategory: '',
          investmentTerritory: '',
          legalName: '',
          startTime: '',
          endTime: ''
        }
        this.getList(parameters)
        let ref = this.$refs.refAddNewMechanism
        ref.mechanismForm = {
          investorIds: [],
          faMechanism: {
            id: '',
            mechanismName: '',
            companyName: '',
            companyLicense: '',
            registeredFund: '',
            legalName: '',
            legalTelephone: '',
            companyBackground: '',
            companyRegisterAddress: '',
            business: '',
            mechanismType: '',
            capitalSource: '',
            marketTime: '',
            duration: '',
            investmentTerritory: '',
            availableCapital: '',
            investmentAmount: '',
            investmentStage: '',
            investmentCase: '',
            acquisitionCase: '',
            otherService: '',
            industrialCategory: '',
            investmentDemand: '',
            purchaseDemand: '',
            management: ''
          },
          tagVo: {
            innerLabel: [],
            externalLabel: []
          }}
        ref.semiconductorData = []
        ref.investmentStage = []
        ref.other = []
        ref.investmentStage = []
        ref.investmentTerritory = []
        ref.mechanismType = ''
        ref.externalLabels = ''
        ref.innerLabels = ''
      }
    },
    // 新增投资机构
    openAdd () {
      this.investorFormDialogShow = true
      let ref = this.$refs.refAddNewMechanism
      ref.investorFormDialogVisible = true
    },
    // 跳转到详情页
    goTheDetail (id) {
      this.$router.push({name: 'investorOrgDetail', params: {id: id}})
    },
    searchEvent () {
      this.pageNum = 1
      let investmentTerritory = ''
      investmentTerritory = this.searchForm.investmentTerritory.length > 1 ? this.searchForm.investmentTerritory.join(',') : this.searchForm.investmentTerritory[0]
      this.parameters = {
        mechanismName: this.searchForm.mechanismName,
        companyName: this.searchForm.companyName,
        industrialCategory: this.searchForm.industrialCategory,
        investmentTerritory: investmentTerritory,
        legalName: this.searchForm.legalName
        // startTime: this.searchForm.startTime ? this.searchForm.startTime + ' 00:00:01' : '',
        // endTime: this.searchForm.endTime ? this.searchForm.endTime + ' 23:59:59' : ''
      }
      this.getList(this.parameters)
    },
    clearSearch () {
      this.searchForm = {
        mechanismName: '',
        companyName: '',
        legalName: '',
        investmentTerritory: [], // 行业领域
        industrialCategory: '' // 产业类别
      }
    },
    getList (parameters) {
      let self = this
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        parameters: parameters
      }
      this.$http.post('/api/v1.0/fa/mechanism/page', data).then((res) => {
        let _data = res.data.data
        self.pageTotal = _data.total
        self.pageNum = _data.pageNum
        _data.data.map((item) => {
          item.tagVo.innerLabel = this.handleLabelName(item.tagVo.innerLabel || '', this.processLabelArr)
          item.faMechanism.investmentStage = item.faMechanism.investmentStage ? self.stringifyArr(item.faMechanism.investmentStage, self.INVESTORSTAGE, true) : '暂无'
          item.faMechanism.investmentTerritory = item.faMechanism.investmentTerritory ? self.stringifyArr(item.faMechanism.investmentTerritory || '', self.INDUSTRIALCATEGORY, false) : '暂无'
          return item
        })

        self.dataList = _data.data
        console.log('self.dataList' + '列表数据')
        console.log(self.dataList)
      })
    },
    // 字符串转换
    stringifyArr (str, options, flag) {
      let theFlag = flag
      if (theFlag) {
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
      } else {
        if (str.length === 1) {
          options.map((item) => {
            if (str === item.value) {
              str = item.lable
              return str
            }
          })
          return str
        }
        let arr = str.split(',')
        options.map((item) => {
          arr.map((items, index) => {
            if (items === item.value) {
              arr[index] = item.lable
              return items
            }
          })
        })
        arr = arr.join(',').replace(new RegExp(',', 'gm'), ' / ')
        return arr
      }
    },
    handleCurrentChange (value) {
      this.pageNum = value
      this.getList(this.parameters)
    },
    fetchAllTag () {
      // 获取所有标签
      this.$http.get('/api/v1.0/fa/tag/findAllTag?parentId=0').then(res => {
        let result = res.data.data[0].childTag
        this.processLabelArr = FaCommon.handleAllTag(result)
      })
    },
    handleLabelName (val, processLabelArr) {
      // 根据tagId显示tagName
      let str = ''
      if (val) {
        let arr = val.split(',')
        let list = _.filter(processLabelArr, item => {
          return arr.indexOf(item.id + '') !== -1
        })
        str = _.pluck(list, 'name').toString()
      }
      return str
    },
    viewInvestorList (item) {
      // 跳转到投资人列表, 带上查询条件
      this.$router.push({
        path: '/fa/investor/person',
        query: {
          company: item.faMechanism.companyName
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";
</style>
<style lang="scss">
  .expert-wrap {
    .mettingDate_box {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 9999;
      background-color: rgba(0, 0, 0, 0.678);
      .mettingTable {
        width: 50%;
        min-height: 30%;
        position: absolute;
        top: 25vh;
        right: 2vh;
        padding: 30px;
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
