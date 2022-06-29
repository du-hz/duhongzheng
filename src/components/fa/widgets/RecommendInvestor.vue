<template>
  <div class="recommend-wrap">
    <el-dialog
      class="el-dialog-right"
      title="推荐投资人"
      :visible.sync="show"
      width="40%">
      <!-- 搜索 -->
      <div class="search-wrap">
        <div class="filter-wrap">
          <span class="title" style="width:80px">产业链</span>
          <!-- 产业链 -->
          <div class="filter-item">
            <div>
              <el-select
                style="width: 100%"
                v-model='semiconductorValue'
                multiple
                filterable
                remote
                reserve-keyword
                default-first-option
                placeholder="选择产业链"
                >
                <el-option
                  v-for="item in semiconductorOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="filter-wrap">
          <span class="title" style="width:80px">筛选投资人</span>
          <!-- 标签 -->
          <div class="filter-item">
            <div @click="openTagDialog">
              <InputElTag ref="refInvestorTag" @emitGetTagList="getTagList" @emitGetTagIdList="getTagIdList" placeholder="选择投资人标签"></InputElTag>
            </div>
          </div>
        </div>
        <div class="filter-wrap">
          <span class="title" style="width:80px">主投阶段</span>
          <div class="filter-item">
            <el-select v-model="stage" multiple :multiple-limit="3" placeholder="主投阶段">
              <el-option label="种子" value="1"></el-option>
              <el-option label="天使" value="2"></el-option>
              <el-option label="Pre-A" value="3"></el-option>
              <el-option label="A轮" value="4"></el-option>
              <el-option label="B轮" value="5"></el-option>
              <el-option label="C轮" value="6"></el-option>
              <el-option label="Pre-IPO" value="7"></el-option>
            </el-select>
          </div>
        </div>
        <div class="filter-wrap">
          <span class="title" style="width:80px">行业领域</span>
          <div class="filter-item">
            <el-select v-model="industry" multiple placeholder="行业领域">
              <el-option v-for="(item, index) in INDUSTRIALCATEGORY" :key="index" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
            <!-- <el-select v-model="industry" multiple placeholder="行业领域">
              <el-option label="材料" value="1"></el-option>
              <el-option label="设备" value="2"></el-option>
              <el-option label="工具" value="3"></el-option>
              <el-option label="算法" value="4"></el-option>
              <el-option label="IP" value="5"></el-option>
              <el-option label="芯片研发" value="6"></el-option>
              <el-option label="流片" value="7"></el-option>
              <el-option label="封装测试" value="8"></el-option>
              <el-option label="产品及方案" value="9"></el-option>
              <el-option label="渠道及贸易" value="10"></el-option>
              <el-option label="其他" value="11"></el-option>
            </el-select> -->
          </div>
        </div>
        <div class="project-wrap">
          <span class="title">当前项目</span>
          <div class="filter-item">{{ projectTag }}</div>
          <div class="filter-item">{{ project.projectPhase | investStageFilter }}</div>
        </div>
        <div class="keyword-wrap">
          <span style="width:80px">关键词搜索</span>
          <el-input v-model="keyword" placeholder="姓名/公司/关键词" @keyup.enter.native="searchInvestor"></el-input>
          <el-button @click="searchInvestor" type="primary">提交</el-button>
        </div>
      </div>
      <!-- 列表展示 -->
      <div class="investor-list-wrap" v-if="investorList.length > 0">
        <div class="list-head">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-button @click="recommend" type="primary">推荐</el-button>
        </div>
        <div class="investor-list">
          <div v-for="(investor, index) in investorList" :key="index" class="investor-item">
            <el-checkbox @change="handleChecked" :disabled="investor.isRecommend === 1" v-model="investor.checked"></el-checkbox>
            <div class="basic-wrap">
              <div class="name-wrap">
                <div class="name" v-html="investor.name"></div>
                <el-tag type="warning" size="mini" v-if="investor.isRecommend === 1">已推荐</el-tag>
              </div>
              <div class="company-name" v-html="investor.companyName"></div>
              <div class="mobile" v-html="investor.mobile"></div>
            </div>
            <div class="attr-wrap">
              <div class="attr-item tag-attr">
                <div class="title">标签</div>
                <div class="cnt" v-html="investor.tags"></div>
              </div>
              <div class="attr-item industry-attr">
                <div class="title">行业领域</div>
                <div class="cnt" v-html="investor.investmentTerritory"></div>
              </div>
              <div class="attr-item stage-attr">
                <div class="title">主投阶段</div>
                <div class="cnt" v-html="investor.investorStage"></div>
              </div>
            </div>
          </div>
            <div class="pager-wrap" v-if="!a">
              <el-pagination
                background
                layout="total, prev, pager, next"
                :total="total1"
                :page-size="pager1.size"
                @current-change="handleCurrentChange1">
              </el-pagination>
            </div>
            <div class="pager-wrap" v-if="a">
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
      <!-- 无结果占位 -->
      <div class="empty-wrap" v-if="investorList.length === 0">
        <div class="text">暂无匹配结果，请重新搜索</div>
      </div>
    </el-dialog>
    <!-- 标签选择 -->
    <TagDialog ref="refTag" @emitGetValue="getTag"></TagDialog>
  </div>
</template>

<script>
// import Global from 'assets/js/global'
import _ from 'underscore'
import FaCommon from 'assets/js/faCommon'
import TagDialog from './TagDialog'
import InputElTag from './InputElTag'
export default {
  components: {
    TagDialog,
    InputElTag
  },
  data () {
    return {
      a: false,
      INDUSTRIALCATEGORY: [], // 行业领域
      semiconductorValue: '',
      keyword: '',
      pickedTags: '',
      pickedTagIds: [],
      pickedSemiconductor: '',
      pickedSemiconductorIds: '',
      stage: [],
      industry: [],
      isIndeterminate: false,
      checkAll: false,
      investorList: [],
      total1: 0,
      pager1: {
        page: 1,
        size: 10
      },
      total: 0,
      pager: {
        page: 1,
        size: 10
      },
      investorIds: [],
      allIds: [],
      show: false,
      projectId: '',
      searchCondition: [],
      projectTag: '',
      project: {},
      semiconductorOptions: [] // 产业链LIST
    }
  },
  created () {
    this.getIndustrialCategory()
    this.fetchAllLabel()
    this.a = false
  },
  methods: {
    getIndustrialCategory () {
      this.$http.get('/api/v1.0/fa/common/find', {params: {name: 'industrialCategory'}}).then((res) => {
        let result = res.data.data
        _.map(result, item => {
          this.INDUSTRIALCATEGORY.push({
            'value': item.value + '',
            'label': item.lable
          })
          return item
        })
      })
    },
    fetchAllLabel () {
      let self = this
      // 获取产业链标签
      this.$http.get('/api/v1.0/fa/tag/findAllTag?parentId=1').then(res => {
        self.semiconductorOptions = res.data.data
      })
    },
    autoRecommend () {
      // 默认匹配
      let _vue = this
      _vue.$http.get('/api/v1.0/fa/investor/proReInvestor?projectId=' + _vue.projectId + '&pageSize=' + _vue.pager1.size + '&currentPage=' + _vue.pager1.page).then(res => {
        let result = res.data.data
        _vue.total1 = result.total
        _vue.investorList = result.data
        console.log('-------------------')
        console.log(result)
        _vue.allIds = _.pluck(_.where(_vue.investorList, {isRecommend: 0}), 'investorId')
        // 处理高亮展示
        _.map(_vue.investorList, item => {
          item.name = this.handleHighLightWord(item.name)
          item.mobile = this.handleHighLightWord(item.mobile)
          item.job = this.handleHighLightWord(item.job)
          if (item.companyName) {
            item.companyName = this.handleHighLightWord(item.companyName)
          }
          item.tags = this.handleHighLightWord(item.tags)
          item.semiconductor = FaCommon.handleIndustryCategory(item.semiconductor)
          item.semiconductor = this.handleHighLightWord(item.semiconductor)
          item.investmentTerritory = FaCommon.handleIndustryCategory(item.investmentTerritory)
          item.investmentTerritory = this.handleHighLightWord(item.investmentTerritory)
          item.investorStage = FaCommon.handleInvestStage(item.investorStage)
          item.investorStage = this.handleHighLightWord(item.investorStage)
          return item
        })
      })
    },
    handleCurrentChange1 (value) {
      this.pager1.page = value
      this.autoRecommend()
    },
    handleCurrentChange (value) {
      this.pager.page = value
      this.fetchInvestorList()
    },
    fetchInvestorList () {
      // 获取投资人列表
      let _vue = this
      _vue.$http.post('/api/v1.0/fa/investor/proReInvestorByPage', {
        'pageNum': _vue.pager.page,
        'pageSize': _vue.pager.size,
        'parameters': {
          'keyWord': _vue.keyword,
          'investorStage': _vue.stage.toString(),
          'semiconductor': _vue.semiconductorValue.join(','),
          'investmentTerritory': _vue.industry.toString(), // 行业领域
          'lable': _vue.pickedTagIds,
          'projectId': _vue.projectId
        }
      }).then(res => {
        let result = res.data.data
        console.log('result------------')
        console.log(result)
        _vue.total = result.total
        _vue.investorList = result.data
        _vue.allIds = _.pluck(_.where(_vue.investorList, {isRecommend: 0}), 'investorId')
        // 处理高亮展示
        _.map(_vue.investorList, item => {
          item.name = this.handleHighLightWord(item.name)
          item.mobile = this.handleHighLightWord(item.mobile)
          if (item.companyName) {
            item.companyName = this.handleHighLightWord(item.companyName)
          }
          item.tags = this.handleHighLightWord(item.tags)
          item.semiconductor = item.semiconductor ? this.stringifyArr(item.semiconductor, this.semiconductorOptions) : ''
          item.semiconductor = item.semiconductor ? this.handleHighLightWord(item.semiconductor) : ''
          item.investmentTerritory = item.investmentTerritory ? this.stringifyArr(item.investmentTerritory, this.INDUSTRIALCATEGORY) : ''
          item.investmentTerritory = item.investmentTerritory ? this.handleHighLightWord(item.investmentTerritory) : ''
          item.investorStage = FaCommon.handleInvestStage(item.investorStage)
          item.investorStage = this.handleHighLightWord(item.investorStage)
          return item
        })
        _vue.investorList = _vue.investorList || []
      })
    },
    handleHighLightWord (val) {
      // 处理高亮展示
      let _vue = this
      if (val) {
        let arr = val.split(',')
        let result = []
        _.each(arr, item => {
          if (_vue.searchCondition.indexOf(item + '') !== -1) {
            result.push('<em class="highlight">' + item + '</em>')
          } else {
            result.push(item)
          }
        })
        return result.toString()
      } else {
        return val
      }
    },
    // 字符串转换
    stringifyArr (str, options) {
      console.log(str)
      console.log(options)
      if (JSON.stringify(str).length === 1 || str.length === 1) {
        options.map((item) => {
          if (JSON.stringify(str) === JSON.stringify(item.value) || str === item.value) {
            str = item.label
            return str
          } else if (str === JSON.stringify(item.id) || str === item.id) {
            str = item.name
            return str
          }
        })
        return str
      }
      let arr = str.split(',')
      options.map((item) => {
        arr.map((items, index) => {
          if (items === JSON.stringify(item.value) || items === item.value) {
            arr[index] = item.label
            return items
          } else if (items === JSON.stringify(item.id) || str === item.id) {
            arr[index] = item.name
            return items
          }
        })
      })
      arr = arr.join(',').replace(new RegExp(',', 'gm'), ',')
      return arr
    },
    handleCheckAllChange (val) {
      // 全选
      this.investorIds = val ? this.allIds : []
      _.map(this.investorList, item => {
        if (this.investorIds.indexOf(item.investorId) !== -1) {
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
      _vue.investorIds = _.pluck(_.where(_vue.investorList, { checked: true }), 'investorId')
      // 显示全选按钮
      this.checkAll = _vue.investorIds.length === _vue.allIds.length
      this.isIndeterminate = _vue.investorIds.length > 0 && _vue.investorIds.length < _vue.allIds.length
      _vue.investorList = JSON.parse(JSON.stringify(_vue.investorList))
    },
    initSearchCondition () {
      // 初始化查询条件
      let _vue = this
      _vue.searchCondition = []
      let stageArr = FaCommon.handleInvestStage(_vue.project.projectPhase.toString()).split(',')
      let industryArr = FaCommon.handleIndustryCategory(_vue.industry.toString()).split(',')
      console.log('--------')
      console.log(_vue.projectTag)
      let tagArr = _vue.projectTag.split(',')
      _vue.searchCondition = _.union(stageArr, tagArr, industryArr)
      _vue.searchCondition = _.filter(_.uniq(_vue.searchCondition), item => { return item !== '' })
    },
    searchInvestor () {
      // 搜索投资人
      let _vue = this
      _vue.a = true
      // 生成 searchCondition 用户搜索词高亮展示
      _vue.searchCondition = []
      let stageArr = FaCommon.handleInvestStage(_vue.stage.toString()).split(',')
      let industryArr = FaCommon.handleIndustryCategory(_vue.industry.toString()).split(',')
      let tagArr = _vue.pickedTags.split(',')
      _vue.searchCondition = _.union(stageArr, industryArr, tagArr)
      if (_vue.keyword.trim()) {
        _vue.searchCondition.push(_vue.keyword.trim())
      }
      _vue.searchCondition = _.filter(_.uniq(_vue.searchCondition), item => { return item !== '' })
      _vue.fetchInvestorList()
    },
    recommend () {
      // 推荐候选人
      let _vue = this
      if (_vue.investorIds.length === 0) {
        this.$message({
          message: '请选择投资人',
          center: true,
          type: 'warning'
        })
      } else {
        _vue.$http.get('/api/v1.0/fa/projectInvestor/recommends?projectIds=' + _vue.projectId + '&investorIds=' + _vue.investorIds).then(res => {
          this.show = false
          console.log(res)
          if (res.data.status === 'success') {
            this.$message({
              message: '推荐成功',
              center: true,
              type: 'success'
            })
            this.$emit('emitGetValue', true)
          }
          if (res.data.status === 'fail') {
            this.$message({
              message: res.data.data.errMsg,
              center: true,
              type: 'error'
            })
          }
          _vue.fetchInvestorList()
        })
      }
    },
    openTagDialog () {
      let semiconductorValue = this.semiconductorValue.join(',')
      // 打开标签选择
      this.$refs.refTag.show = true
      this.$refs.refTag.max = 9
      this.$refs.refTag.fetchSenLabel(semiconductorValue)
      window.setTimeout(() => {
        this.$refs.refTag.setCheckedVal(this.$refs.refInvestorTag.tagIdList)
      }, 100)
    },
    getTag (val) {
      // 确定tag选择
      this.pickedTags = _.pluck(val, 'name').toString()
      this.pickedTagIds = _.pluck(val, 'id')
      this.$refs.refInvestorTag.tagList = _.pluck(val, 'name') || []
      this.$refs.refInvestorTag.tagIdList = _.pluck(val, 'id') || []
    },
    getTagList (val) {
      this.pickedTags = val.toString()
    },
    getTagIdList (val) {
      this.pickedTagIds = val
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
    .search-wrap {
      .filter-wrap {
        display: flex;
        align-items: center;
        .title {
          display: inline-block;
          margin-right: 10px;
        }
        .filter-item {
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
            .name-wrap {
              display: flex;
              .name {
                margin-right: 10px;
              }
            }
          }
          .attr-wrap {
            flex: 1;
            .attr-item {
              display: flex;
              .title {
                color: #909399;
                width: 70px;
              }
              .cnt {
                flex: 1;
              }
            }
          }
        }
      }
    }
  }
  .project-wrap {
    color: #909399;
    display: flex;
    margin-bottom: 20px;
    .title {
      width: 70px;
      margin-right: 10px;
    }
    .filter-item {
      flex: 1;
      margin-right: 10px;
    }
  }
  .empty-wrap {
    padding-top: 50px;
    .text {
      text-align: center;
      color: #909399;
    }
  }
</style>
<style lang="scss">
  .highlight {
    background-color: #ffff00;
    padding: 2px;
  }
</style>
