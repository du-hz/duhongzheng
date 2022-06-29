<template>
  <div class="recommend-wrap">
    <el-dialog
      class="el-dialog-right"
      title="推荐技术专家"
      :visible.sync="show"
      width="40%">
      <!-- 搜索 -->
      <div class="search-wrap">
        <div class="filter-wrap">
          <span class="title" style="width:80px">擅长产业链方向</span>
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
                placeholder="选择擅长产业链方向"
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
          <span class="title">筛选技术专家</span>
          <div class="filter-item">
            <div @click="openTagDialog">
              <InputElTag ref="refSpecialTag" placeholder="选择技术专家标签" @emitGetTagIdList='emitGetTagIdList'></InputElTag>
            </div>
          </div>
          <!-- 行业领域 -->
          <div class="filter-item">
            <el-select v-model="professionalField" multiple placeholder="行业领域">
              <el-option v-for="(item, index) in INDUSTRIALCATEGORY" :key="index" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
            <!-- <el-select v-model="professionalField" multiple placeholder="行业领域">
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
        </div>
        <div class="keyword-wrap">
          <span>关键词搜索</span>
          <el-input v-model="keyword" placeholder="姓名/公司/关键词" @keyup.enter.native="searchSpecialist"></el-input>
          <el-button @click="searchSpecialist" type="primary">提交</el-button>
        </div>
      </div>
      <!-- 列表展示 -->
      <div class="investor-list-wrap" v-if="speciaList.length > 0">
        <div class="list-head">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-button @click="recommend" type="primary">推荐</el-button>
        </div>
        <div class="investor-list">
          <div v-for="(item, index) in speciaList" :key="index" class="investor-item">
            <el-checkbox @change="handleChecked" :disabled="item.isRecommend === 1" v-model="item.checked"></el-checkbox>
            <div class="basic-wrap">
              <div class="name-wrap">
                <div class="name" v-html="item.name"></div>
                <el-tag type="warning" size="mini" v-if="item.isRecommend === 1">已推荐</el-tag>
              </div>
              <div class="company-name" v-html="item.companyName"> · <span v-html="item.job"></span></div>
              <div class="mobile" v-html="item.mobile"></div>
            </div>
            <div class="attr-wrap">
              <div class="attr-item tag-attr">
                <div class="title">标签</div>
                <div class="cnt" v-html="item.tags"></div>
              </div>
              <div class="attr-item industry-attr">
                <div class="title">行业领域</div>
                <div class="cnt" v-html="item.professionalField"></div>
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
      <div class="empty-wrap" v-if="speciaList.length < 1">
        <div class="text">暂无匹配结果，请重新搜索</div>
      </div>
    </el-dialog>
    <!-- 标签选择 -->
    <TagDialog ref="refTag" @emitGetValue="getTag" ></TagDialog>
  </div>
</template>

<script>
import _ from 'underscore'
import TagDialog from './TagDialog'
import InputElTag from './InputElTag'
import FaCommon from 'assets/js/faCommon'
export default {
  components: {
    TagDialog,
    InputElTag
  },
  data () {
    return {
      INDUSTRIALCATEGORY: [],
      a: false,
      semiconductorValue: '',
      keyword: '',
      professionalField: [],
      isIndeterminate: false,
      checkAll: false,
      speciaList: [],
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
      specialIds: [],
      projectId: '',
      show: false,
      allIds: [],
      pickedTags: '',
      pickedTagIds: [],
      searchCondition: [],
      projectTag: '',
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
    emitGetTagIdList (val) {
      console.log('标签id列表')
      console.log(val)
      this.pickedTagIds = val
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
      _vue.$http.get('/api/v1.0/fa/specialist/proReInvestor?projectId=' + _vue.projectId + '&pageSize=' + _vue.pager1.size + '&currentPage=' + _vue.pager1.page).then(res => {
        let result = res.data.data
        _vue.total1 = result.total
        _vue.speciaList = result.data
        console.log('_vue.speciaList')
        console.log(res)
        _vue.allIds = _.pluck(_.where(_vue.speciaList, {isRecommend: 0}), 'specialistId')
        // 处理高亮展示
        _.map(_vue.speciaList, item => {
          item.name = this.handleHighLightWord(item.name)
          item.mobile = this.handleHighLightWord(item.mobile)
          item.job = this.handleHighLightWord(item.job)
          item.companyName = this.handleHighLightWord(item.companyName)
          item.tags = this.handleHighLightWord(item.tags)
          item.professionalField = FaCommon.handleIndustryCategory(item.professionalField)
          item.professionalField = this.handleHighLightWord(item.professionalField)
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
      this.fetchSpeciaList()
    },
    fetchSpeciaList () {
      // 获取技术专家列表
      let _vue = this
      _vue.$http.post('/api/v1.0/fa/specialist/proReInvestorByPage', {
        'pageNum': _vue.pager.page,
        'pageSize': _vue.pager.size,
        'parameters': {
          'keyWord': _vue.keyword.trim(),
          'professionalField': _vue.professionalField.toString(),
          'projectId': _vue.projectId,
          'semiconductor': this.semiconductorValue.join(','),
          'lable': this.pickedTagIds || []
        }
      }).then(res => {
        let result = res.data.data
        _vue.total = result.total
        _vue.speciaList = result.data
        _vue.allIds = _.pluck(_.where(_vue.speciaList, {isRecommend: 0}), 'specialistId')
        // 处理高亮展示
        _.map(_vue.speciaList, item => {
          item.name = this.handleHighLightWord(item.name)
          item.mobile = this.handleHighLightWord(item.mobile)
          item.job = this.handleHighLightWord(item.job)
          item.companyName = this.handleHighLightWord(item.companyName)
          item.tags = this.handleHighLightWord(item.tags)
          item.professionalField = FaCommon.handleIndustryCategory(item.professionalField)
          item.professionalField = this.handleHighLightWord(item.professionalField)
          return item
        })
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
    handleCheckAllChange (val) {
      // 全选
      this.specialIds = val ? this.allIds : []
      _.map(this.speciaList, item => {
        if (this.specialIds.indexOf(item.specialistId) !== -1) {
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
      _vue.specialIds = _.pluck(_.where(_vue.speciaList, { checked: true }), 'specialistId')
      // 显示全选按钮
      this.checkAll = _vue.specialIds.length === _vue.allIds.length
      this.isIndeterminate = _vue.specialIds.length > 0 && _vue.specialIds.length < _vue.allIds.length
      // NOTICE: 数组内对象属相作为v-model时  数据双向绑定会有问题，重新更新list就可以了
      _vue.speciaList = JSON.parse(JSON.stringify(_vue.speciaList))
    },
    initSearchCondition () {
      // 初始化查询条件
      let _vue = this
      _vue.searchCondition = []
      let tagArr = _vue.projectTag.split(',')
      _vue.searchCondition = tagArr
      _vue.searchCondition = _.filter(_.uniq(_vue.searchCondition), item => { return item !== '' })
    },
    searchSpecialist () {
      // 搜索投资人
      let _vue = this
      _vue.a = true
      // 生成 searchCondition 用户搜索词高亮展示
      _vue.searchCondition = []
      let industryArr = FaCommon.handleIndustryCategory(_vue.professionalField.toString()).split(',')
      let tagArr = _vue.pickedTags.split(',')
      _vue.searchCondition = _.union(industryArr, tagArr)
      if (_vue.keyword.trim()) {
        _vue.searchCondition.push(_vue.keyword.trim())
      }
      _vue.searchCondition = _.filter(_.uniq(_vue.searchCondition), item => { return item !== '' })
      _vue.fetchSpeciaList()
    },
    recommend () {
      // 推荐技术专家
      let _vue = this
      console.log('_vue.specialIds.length257')
      console.log(_vue.specialIds.length)
      if (_vue.specialIds.length === 0) {
        this.$message({
          message: '请选择技术专家',
          center: true,
          type: 'warning'
        })
      } else {
        _vue.$http.get('/api/v1.0/fa/projectSpecialist/recommends?specialistIds=' + _vue.specialIds.join(',') + '&projectIds=' + _vue.projectId).then(res => {
          this.show = false
          this.$message({
            message: '推荐成功',
            center: true,
            type: 'success'
          })
          this.$emit('emitGetValue', true)
          _vue.fetchSpeciaList()
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
        this.$refs.refTag.setCheckedVal(this.$refs.refSpecialTag.tagIdList)
      }, 100)
    },
    getTag (val) {
      // 确定tag选择
      this.pickedTags = _.pluck(val, 'name').toString()
      this.pickedTagIds = _.pluck(val, 'id')
      this.$refs.refSpecialTag.tagList = _.pluck(val, 'name') || []
      this.$refs.refSpecialTag.tagIdList = _.pluck(val, 'id') || []
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
          .el-select {
            width: 100%;
          }
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
          .icon {
            margin-right: 10px;
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
