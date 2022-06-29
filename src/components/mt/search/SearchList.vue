<template>
    <div class="table-list-wrap mt-table-list-wrap">
        <div class="list-search-wrap mt-list-search-wrap">
            <el-form :inline="true" ref="searchForm" :model="searchForm"  size="mini" label-width="100px">
                <el-row inline>
                    <el-col :span="5">
                        <el-form-item label="关键字" prop="keyword"  size="mini">
                            <el-input v-model="searchForm.keyword" clearable ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="姓名" prop="searchName" >
                            <el-input v-model="searchForm.searchName" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24"></el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="公司名称" prop="companyName">
                            <el-input v-model="searchForm.companyName" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label=" 职位关键字" prop="jobTitle">
                            <el-input v-model="searchForm.position" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="学校" prop="schoolName">
                            <el-input v-model="searchForm.schoolName" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label=" 专业" prop="jobTitle">
                            <el-input v-model="searchForm.study" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24"><div class="form-line"></div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="职级" prop="rank" >
                            <el-select v-model="searchForm.rankIds" clearable multiple min placeholder="请选择" size="mini" style="width: 100%" >
                                <el-option v-for="item in engineRanks" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="学历" prop="education" >
                            <el-select v-model="searchForm.eduIds" clearable multiple min placeholder="请选择" size="mini" style="width: 100%" >
                                <el-option v-for="item in educations" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="工作年限" prop="workingyear" >
                            <el-select v-model="searchForm.workYearIds" multiple min placeholder="请选择" size="mini" style="width: 100%" >
                                <el-option v-for="item in workingYears" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="用户库" prop="userSource" >
                            <el-select v-model="searchForm.userSources" multiple min placeholder="请选择" size="mini" style="width: 100%" >
                                <el-option v-for="item in userSources" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="产业链" prop="industryChain" >
                            <el-select v-model="searchForm.industryIds" clearable multiple min placeholder="请选择" size="mini" style="width: 100%" >
                                <el-option v-for="item in industryChainOpts" :key="item.id + ''" :label="item.name" :value="item.id + ''">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="职能" prop="functionId">
                            <ji-lain-many :paramsIds="initFunctionIds"  size="mini" :inputWidth="500" :addTitle="functionAddTitle" :treeArray="functionTreeData" :recordArray="functionRecordData" @getIds="getFunctionIds" @getNames="getFunctionNames"></ji-lain-many>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="城市" prop="city">
                            <ji-lain-many :paramsIds="initCityIds" size="mini" :addTitle="cityAddTitle" :treeArray="cityTreeData" :recordArray="cityRecordData" @getChildrenNames="getCityChildrenNames" @getIds="getCityIds" @getNames="getCityNames"></ji-lain-many>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24"><div class="form-line"></div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="最后活跃时间" prop="lastActive" >
                            <el-select v-model="searchForm.lastActiveIds[0]" clearable min placeholder="请选择" size="mini" style="width: 100%" >
                                <el-option v-for="item in lastActives" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="最后投递时间" prop="lastActive" >
                            <el-select v-model="searchForm.lastDeliverIds[0]"  clearable min placeholder="请选择" size="mini" style="width: 100%" >
                                <el-option v-for="item in lastDelivers" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item>
                            <el-checkbox v-model="searchForm.isLastOnly">只看当前工作经历</el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item >
                            <el-checkbox v-model="searchForm.explict">开启精准搜索</el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item>
                            <el-button type="primary" @click="search('searchForm')">搜索</el-button>
                            <el-button type="primary" @click="reset('searchForm')">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div style="line-height: 35px">
            共搜索候选人<span style="padding: 0 20px 0 5px; font-size: large; font-weight: bold;">{{totalNum}}</span>
            <el-button v-show="!saveOrUpdate" @click="keyDialogShow()" size="mini" type="primary">搜索并保存搜索条件</el-button>
            <el-button v-show="saveOrUpdate" @click="keyDialogShow()" size="mini" type="primary">更新搜索条件</el-button>
        </div>
        <div style="line-height: 35px">
            选中候选人数<span style="padding: 0 20px 0 5px; font-size: large; font-weight: bold;">{{multipleSelection.length}}</span>
            <el-button style="width: 100px;" v-show="allC" size="mini" type="primary" @click="allC = false; toggleSelection(tableData)">全选</el-button>
            <el-button style="width: 100px;" v-show="!allC" size="mini" @click="allC = true; toggleSelection()">取消选择</el-button>
            <el-button type="primary" size="mini" @click="setFold">收藏选中</el-button>
            <el-button v-show="hasMark" size="mini" @click="cancelFold">取消收藏</el-button>
        </div>
        <el-table :data="tableData" ref="multipleTable" size="mini" @selection-change="handleSelectionChange" header-row-class-name="tableheader" @sort-change="sortList" border style="width: 100%;" max-height="500">
            <el-table-column type="index" label="序号" width="50" fixed></el-table-column>
            <el-table-column type="selection" label="选择" width="40" fixed ></el-table-column>
            <el-table-column label="操作" width="200" align="center" fixed>
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="contactShow(scope.row)">联系方式</el-button>
                    <el-button v-show="scope.row.isMark" size="mini" @click="cancelMark(scope.row)">取消收藏</el-button>
                    <el-button type="primary" size="mini" v-show="!scope.row.isMark" @click="mark(scope.row)">收藏</el-button>
                </template>
            </el-table-column>
            <el-table-column label="中文名" width="80" prop="chinese_name" :show-overflow-tooltip="true" fixed>
                <template slot-scope="scope">
                    <a :href="scope.row.talentPoolId | filterWebResumeLink" class="text-link" target="_blank">{{scope.row.chinese_name}}</a>
                </template>
            </el-table-column>
            <el-table-column label="英文名" :show-overflow-tooltip="true" width="120" prop="english_name" fixed>
                <template slot-scope="scope">
                    <a :href="scope.row.talentPoolId | filterWebResumeLink" class="text-link" target="_blank">{{scope.row.english_name}}</a>
                </template>
            </el-table-column>
            <el-table-column label="行为展示" :show-overflow-tooltip="true" width="80" prop="english_name" fixed>
                <template slot-scope="scope">
                    <router-link tag="a" class="text-link" target="_blank" :to="{path: '/mt/timeline', query:{talentLibraryId:scope.row.id}}">点击查看</router-link>
                </template>
            </el-table-column>
            <el-table-column label="手机号" width="80" prop="mobile" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span v-for="item in scope.row.mobile" :key="item" item="item">{{item}}</span>
                </template>
            </el-table-column>
            <el-table-column label="邮箱" width="80" prop="email" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span v-for="item in scope.row.email" :key="item" item="item">{{item}}</span>
                </template>
            </el-table-column>
            <el-table-column label="城市" width="50" prop="currentCityName"></el-table-column>
            <el-table-column label="工作年限" width="100" prop="workingYear">
                <template slot-scope="scope">
                    <span>{{scope.row.workingYear | filterWorkingYear}}</span>
                </template>
            </el-table-column>
            <el-table-column label="产业链" width="200" prop="currentEngineIndustryChainName"></el-table-column>
            <el-table-column label="职能" width="200" prop="currentEngineFunctionIdMany"></el-table-column>
            <el-table-column label="职级" width="100" prop="currentEngineRank">
                <template slot-scope="scope">
                    <span>{{scope.row.currentEngineRank | filterEngineRank}}</span>
                </template>
            </el-table-column>
            <el-table-column label="当前公司" width="200" prop="currentCompanyName" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="当前职位" width="200" prop="currentJobTitle" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="学校" width="150" prop="currentSchoolName" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="专业" width="150" prop="currentFieldOfStudy" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="学历" width="100" prop="education">
                <template slot-scope="scope">
                    <span>{{scope.row.education | filterEducation}}</span>
                </template>
            </el-table-column>
            <el-table-column label="摩尔用户" width="100" prop="mooreUserId">
                <template slot-scope="scope">
                    <span>{{scope.row.mooreUserId ? '是' : '否' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="allways用户" width="100" prop="allwaysUserId">
                <template slot-scope="scope">
                    <span>{{scope.row.allwaysUserId ? '是' : '否' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="有本" width="100" prop="ybResumeId">
                <template slot-scope="scope">
                    <span>{{scope.row.ybResumeId ? '是' : '否' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="活跃度/最后交互时间" width="100" prop="lastActiveTime"></el-table-column>
            <el-table-column label="最后投递时间" width="100" prop="lastDeliverTime"></el-table-column>
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
        <el-dialog title="收藏候选人" :visible.sync="foldDialogVisible"  width="60%">
            <el-alert  title="可选择或者直接输入新分类" type="success" center :closable="false" :show-icon="false">
            </el-alert>
            <el-select v-model="fold" value-key="id"  min allow-create filterable placeholder="请选择或者输入添加新分类" size="medium" style="width: 100%" >
                <el-option v-for="item in folds" :key="item.id" :label="item.name" :value="item"></el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="foldDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="foldDialogSure">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="保存搜索条件" :visible.sync="keyDialogVisible"  width="60%">
            <span>输入条件名称</span><el-input v-model="keyName" clearable></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="keyDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="keyDialogSure">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog  :visible.sync="contactDialogVisible" style="margin-top:200px;"  width="20%">
            <div v-if="chinese != null && chinese != ''" style="padding-left: 30px;"><span style="color: #66b1ff">中文名：</span><span style="margin-left: 5px" >{{chinese}}</span></div>
            <div v-if="enfullname != null && enfullname != ''" style="padding-left: 30px;"><span style="color: #66b1ff">英文名：</span><span style="margin-left: 5px">{{enfullname}}</span></div>
            <div v-if="mobiles != null && mobiles.length>0" style="padding-left: 30px;"><span style="color: #3a8ee6">手机号：</span><span style="margin-left: 5px"  v-for="item in mobiles" v-bind:key="item">{{item}}</span></div>
            <div v-if="emails != null && emails.length>0" style="padding-left: 30px;"><span style="color: #66b1ff">邮箱：</span><span style="margin-left: 5px" v-for="item in emails" v-bind:key="item">{{item}}</span></div>
        </el-dialog>
    </div>
</template>

<script>
import engineFunctionJs from 'assets/js/engineFunction'
import JiLainMany from '@/components/common/JiLainMany'
import Global from 'assets/js/global'
import cityHotJs from 'assets/js/city_hot'
export default {
  components: {
    JiLainMany
  },
  data () {
    return {
      allC: true,
      mobiles: [
      ],
      emails: [
      ],
      chinese: null,
      enfullname: null,
      contactDialogVisible: false,
      pager: {
        size: 20,
        curPage: 1
      },
      totalNum: 3,
      tableData: [{
        fullname: '刘智',
        enfullname: 'liuzhi'
      }, {
        fullname: '吴胜',
        enfullname: 'wusheng'
      }, {
        fullname: '巫妖王',
        enfullname: 'wyw'
      }],
      searchForm: {
        searchName: '', // 名字
        industryIds: [], // 产业链
        functionIds: [], // 职能
        cityIds: [], // 城市
        rankIds: [], // 职级
        eduIds: [], // 教育经历
        workYearIds: [], // 工作经验
        lastActiveIds: [], // 最后活跃时间
        userSources: [], // 用户来源选择
        companyName: '', // 公司名称
        position: '', // 职位
        isLastOnly: false, // 是否当前工作经验
        explict: false, // 是否精准搜索
        keyword: '', // 关键词
        schoolName: '', // 学校名称,
        study: '', // 专业
        cityChildrenNames: [], // 城市的子级
        lastDeliverIds: [] // 最后投递时间
      },
      initFunctionIds: [], // 初始化 职能级联选择组件【多选】的参数
      initCityIds: [], // 初始化 城市级联选择组件【多选】的参数
      functionNames: [], // 选中的职能
      cityNames: [], // 选中的城市
      functionAddTitle: '选择新职能+',
      functionTreeData: engineFunctionJs.functions,
      functionRecordData: engineFunctionJs.functionList,
      cityAddTitle: '选择城市+',
      cityTreeData: cityHotJs.citys,
      cityRecordData: cityHotJs.cityList,
      engineRanks: Global.CONSTANT.RANK,
      educations: Global.CONSTANT.EDUCATION,
      workingYears: Global.CONSTANT.WORKING_YEAR,
      userSources: Global.CONSTANT.USER_SOURCE,
      lastActives: Global.CONSTANT.LAST_ACTIVE,
      lastDelivers: Global.CONSTANT.LAST_DELIVER,
      industryChainOpts: [],
      foldDialogVisible: false,
      keyDialogVisible: false,
      folds: [],
      fold: {
      },
      multipleSelection: [],
      markType: 1, // 1=单个收藏，2=批量收藏
      markTalentId: null,
      cancelMarkType: 1, // 1=单个取消收藏，2=取消批量收藏
      cancelMarkTalentId: null,
      saveOrUpdate: this.$route.params.saveOrUpdate, // 是否是搜索条件页面来的
      keyName: !Global.isBlankStr(this.$route.params.keyName) ? this.$route.params.keyName : '', // 搜索条件的名称
      queryId: !Global.isBlankStr(this.$route.params.queryId) ? this.$route.params.queryId : null, // 搜索条件的Id
      searchParams: !Global.isBlankStr(this.$route.params.searchParams) ? this.$route.params.searchParams : '' // 搜索条件的value
    }
  },
  computed: {
    hasMark: function () {
      let _vue = this
      let flag = false
      _vue.tableData.some(row => {
        if (row.isMark) {
          flag = true
          return true
        }
      })
      return flag
    }
  },
  created () {
    this.fetchChain()
    this.fetchFolds()
    if (!Global.isBlankStr(this.searchParams)) {
      this.searchForm = Global.recoverCandidateParams(this.searchParams)
      if (!Global.isBlankArr(this.searchForm.functionIds)) {
        this.initFunctionIds = this.searchForm.functionIds
      }
      if (!Global.isBlankArr(this.searchForm.cityIds)) {
        this.initCityIds = this.searchForm.cityIds
      }
    }
    this.fetchTableData()
  },
  filters: {
    filterWebResumeLink (value) {
      return Global.CONFIG.SERVER_URL + '/api/hunter/preview_talent_pool_resume.htm?talentPoolId=' + value
    }
  },
  methods: {
    fetchChain () {
      // 查询产业链
      let _vue = this
      _vue.$http.get('/api/v1.0/customer/industrychains').then((response) => {
        _vue.industryChainOpts = response.data.data.industryChains
      })
    },
    fetchTableData () {
      // 获取人才列表
      let _vue = this
      _vue.$http.get('/api/v1.0/candidate/search?page=' + _vue.pager.curPage + // 第几页
        '&rows=' + _vue.pager.size + // 页面尺寸
        '&keyWord=' + _vue.searchForm.keyword + // 关键词
        '&searchName=' + _vue.searchForm.searchName + // 名字
        '&industryIds=' + Global.recoverArr(_vue.searchForm.industryIds) + // 产业链
        '&functionIds=' + Global.recoverArr(_vue.searchForm.functionIds) + // 职能
        '&citys=' + Global.recoverArr(_vue.searchForm.cityChildrenNames) + // 城市
        '&rankIds=' + Global.recoverArr(_vue.searchForm.rankIds) + // 职级
        '&eduIds=' + Global.recoverArr(_vue.searchForm.eduIds) + // 教育经历
        '&workYearIds=' + Global.recoverArr(_vue.searchForm.workYearIds) + // 工作经验
        '&lastActiveIds=' + Global.recoverArr(_vue.searchForm.lastActiveIds) + // 最后活跃时间
        '&userPoolIds=' + Global.recoverArr(_vue.searchForm.userSources) + // 用户来源
        '&companyName=' + _vue.searchForm.companyName + // 公司名称
        '&position=' + _vue.searchForm.position + // 职位关键词
        '&isLastOnly=' + (_vue.searchForm.isLastOnly ? 1 : 0) + // 是否当前工作经验
        '&explict=' + (_vue.searchForm.explict ? 1 : 0) + // 是否精准搜索
        '&school=' + _vue.searchForm.schoolName + // 学校名称
        '&fieldOfStudy=' + _vue.searchForm.study + // 专业
        '&lastDeliverDateSub=' + Global.recoverArr(_vue.searchForm.lastDeliverIds) // 最后投递时间
      ).then(function (response) {
        _vue.tableData = response.data.data.rows || []
        _vue.totalNum = response.data.data.total || 0
      })
    },
    functionListShortConvert (functionIds) {
      if (functionIds != null && functionIds.length > 0) {
        let newFunctionIds = []
        functionIds.forEach((item, index) => {
          if (item < 0) {
            newFunctionIds.push(-item)
          } else {
            newFunctionIds.push(item)
          }
        })
        return newFunctionIds
      } else {
        return null
      }
    },
    timelineSearch: function (id) {
      this.$router.push({
        path: '/mt/timeline?talentLibraryId=?' + id
      })
    },
    createSearchName: function () {
      let _vue = this
      let searchStr = []
      if (!Global.isBlankStr(_vue.searchForm.keyword)) {
        searchStr.push(_vue.searchForm.keyword)
      }

      if (!Global.isBlankStr(_vue.searchForm.searchName)) {
        searchStr.push(_vue.searchForm.searchName)
      }

      let industryNames = Global.findObjArrNamesByValuesStr(_vue.industryChainOpts, 'id', 'name', _vue.searchForm.industryIds)
      if (!Global.isBlankStr(industryNames)) {
        searchStr.push(industryNames)
      }

      if (!Global.isBlankArr(_vue.functionNames)) {
        searchStr.push(_vue.functionNames.join(','))
      }

      if (!Global.isBlankArr(_vue.cityNames)) {
        searchStr.push(_vue.cityNames.join(','))
      }

      let rankNames = Global.findObjArrNamesByValuesStr(Global.CONSTANT.RANK, 'value', 'label', _vue.searchForm.rankIds)
      if (!Global.isBlankStr(rankNames)) {
        searchStr.push(rankNames)
      }

      let eduNames = Global.findObjArrNamesByValuesStr(Global.CONSTANT.EDUCATION, 'value', 'label', _vue.searchForm.eduIds)
      if (!Global.isBlankStr(eduNames)) {
        searchStr.push(eduNames)
      }

      let workyearNames = Global.findObjArrNamesByValuesStr(Global.CONSTANT.WORKING_YEAR, 'value', 'label', _vue.searchForm.workYearIds)
      if (!Global.isBlankStr(workyearNames)) {
        searchStr.push(workyearNames)
      }

      let lastActiveNames = Global.findObjArrNamesByValuesStr(Global.CONSTANT.LAST_ACTIVE, 'value', 'label', _vue.searchForm.lastActiveIds)
      if (!Global.isBlankStr(lastActiveNames)) {
        searchStr.push(lastActiveNames)
      }

      let userSourceNames = Global.findObjArrNamesByValuesStr(Global.CONSTANT.USER_SOURCE, 'value', 'label', _vue.searchForm.userSources)
      if (!Global.isBlankStr(userSourceNames)) {
        searchStr.push(userSourceNames)
      }
      if (!Global.isBlankStr(_vue.searchForm.companyName)) {
        searchStr.push(_vue.searchForm.companyName)
      }

      if (!Global.isBlankStr(_vue.searchForm.position)) {
        searchStr.push(_vue.searchForm.position)
      }

      if (_vue.searchForm.isLastOnly) {
        searchStr.push('只看当前工作经验/最近学历')
      }

      if (_vue.searchForm.explict) {
        searchStr.push('开启精准搜索')
      }

      if (!Global.isBlankStr(_vue.searchForm.schoolName)) {
        searchStr.push(_vue.searchForm.schoolName)
      }

      if (!Global.isBlankStr(_vue.searchForm.study)) {
        searchStr.push(_vue.searchForm.study)
      }

      let lastDeliverNames = Global.findObjArrNamesByValuesStr(Global.CONSTANT.LAST_DELIVER, 'value', 'label', _vue.searchForm.lastDeliverIds)
      if (!Global.isBlankStr(lastDeliverNames)) {
        searchStr.push(lastDeliverNames)
      }

      if (!Global.isBlankArr(searchStr)) {
        return searchStr.join('__')
      } else {
        return ''
      }
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleCurrentChange (val) {
      this.pager = {
        size: 20,
        curPage: val
      }
      this.fetchTableData()
    },
    getFunctionIds (val) {
      this.searchForm.functionIds = val
    },
    getFunctionNames (val) {
      this.functionNames = val
    },
    getCityIds (val) {
      this.searchForm.cityIds = val
    },
    getCityChildrenNames (val) {
      this.searchForm.cityChildrenNames = val
    },
    getCityNames (val) {
      this.cityNames = val
    },
    search () {
      this.fetchTableData()
    },
    sortList (col) {
    },
    reset () {
      this.searchForm = {
        searchName: '', // 名字
        industryIds: [], // 产业链
        functionIds: [], // 职能
        cityIds: [], // 城市
        rankIds: [], // 职级
        eduIds: [], // 教育经历
        workYearIds: [], // 工作经验
        lastActiveIds: [], // 最后活跃时间
        userSources: [], // 用户来源选择
        companyName: '', // 公司名称
        position: '', // 职位
        isLastOnly: false, // 是否当前工作经验
        explict: false, // 是否精准搜索
        keyword: '', // 关键词
        schoolName: '', // 学校名称,
        study: '', // 专业
        cityChildrenNames: [], // 城市的子级
        lastDeliverIds: []
      }
      this.initFunctionIds = [] // 初始化职能选框的组件参数
      this.initCityIds = [] // 初始化城市多选框的组件参数
      this.fetchTableData()
    },
    handleSelectionChange (val) { // 处理单个选中
      this.multipleSelection = val
    },
    keyDialogShow () {
      let _vue = this
      let searchStr = _vue.createSearchName()
      if (Global.isBlankStr(searchStr)) {
        this.$message({
          type: 'error',
          message: '未使用任何搜索条件筛选！请先筛选！'
        })
      } else {
        _vue.fetchTableData()
        if (!_vue.saveOrUpdate) {
          _vue.keyDialogVisible = true
        } else {
          _vue.$http.put('/api/v1.0/candidate/query-params', {
            id: _vue.queryId,
            name: _vue.keyName,
            query: Global.parseCandidateParams(_vue.searchForm),
            searchString: searchStr,
            ct: _vue.totalNum
          }).then((response) => {
            this.$message({
              type: 'success',
              message: '更新筛选条件成功！'
            })
          })
        }
      }
    },
    keyDialogSure () {
      let _vue = this
      let searchStr = _vue.createSearchName()
      if (Global.isBlankStr(_vue.keyName)) {
        this.$message({
          type: 'error',
          message: '请输入要保存的搜索条件名称!'
        })
      } else {
        let queryStr = Global.parseCandidateParams(_vue.searchForm)
        console.log(queryStr)
        _vue.$http.post('/api/v1.0/candidate/query-params', {
          name: _vue.keyName,
          query: queryStr,
          searchString: searchStr,
          ct: _vue.totalNum
        }).then((response) => {
          this.$message({
            type: 'success',
            message: '保存筛选条件成功！'
          })
          _vue.keyDialogVisible = false
        })
      }
    },
    foldDialogSure () {
      let _vue = this
      let foldId
      // 文件夹ID是空的，并且是属于对象类型，而且本身没有值，说明用户没有选择文件夹
      if (_vue.fold.id === undefined && typeof (_vue.fold) === 'object') {
        this.$message({
          type: 'error',
          message: '请选择或者新建文件夹在进行收藏操作!'
        })
        return
      }
      if (_vue.fold.id === undefined) {
        _vue.$http.post('/api/v1.0/candidate/floder', {
          floderName: _vue.fold
        }).then((response) => {
          let resData = response.data.data
          foldId = resData.id
          let newFold = {
            id: foldId,
            name: _vue.fold
          }
          _vue.fold = newFold
          _vue.folds.unshift(newFold)
          _vue.addPepToFold(foldId)
        })
      } else {
        foldId = _vue.fold.id
        _vue.addPepToFold(foldId)
      }
    },
    contactShow (row) {
      let _vue = this
      _vue.contactDialogVisible = true
      _vue.$http.get('/api/v1.0/candidate/contacts?id=' + row.talentPoolId).then((response) => {
        let resData = response.data.data
        _vue.mobiles = resData.mobile
        _vue.emails = resData.email
        _vue.chinese = row.chinese_name
        _vue.enfullname = row.english_name
      })
    },
    getSelectionId () {
      let _vue = this
      let pepIds = []
      if (_vue.multipleSelection && _vue.multipleSelection.length > 0) {
        _vue.multipleSelection.forEach(row => {
          pepIds.push(row.talentPoolId)
        })
        return pepIds.join(',')
      } else {
        return ''
      }
    },
    checkSelect () {
      let _vue = this
      let candidateIds = _vue.getSelectionId()
      if (candidateIds === '') {
        _vue.$message({
          type: 'error',
          message: '请至少选中一个候选人!',
          center: true
        })
        return false
      }
      return true
    },
    addPepToFold: function (foldId) {
      let _vue = this
      let candidateIds = _vue.getSelectionId()
      if (_vue.markType === 1) {
        candidateIds = _vue.markTalentId + ''
      } else if (_vue.markType === 2) {
        candidateIds = _vue.getSelectionId()
      }
      _vue.$http.post('/api/v1.0/candidate/floder/candidate', {
        candidateIds: candidateIds,
        floderId: foldId
      }).then((response) => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        _vue.foldDialogVisible = false
        // 添加收藏多个
        if (_vue.markType === 2) {
          _vue.multipleSelection.forEach(row => {
            _vue.tableData.forEach(tableRow => {
              if (tableRow.talentPoolId === row.talentPoolId) {
                row.isMark = true
              }
            })
          })
          // 添加收藏单个
        } else if (_vue.markType === 1) {
          _vue.tableData.forEach(row => {
            if (_vue.markTalentId === row.talentPoolId) {
              row.isMark = true
            }
          })
        }
      })
    },
    deletePep () {
      let _vue = this
      let candidateIds
      if (_vue.cancelMarkType === 1) {
        candidateIds = _vue.cancelMarkTalentId + ''
      } else if (_vue.cancelMarkType === 2) {
        candidateIds = _vue.getSelectionId()
      }
      _vue.$http.delete('/api/v1.0/candidate/floder/candidate?candidateIds=' + candidateIds).then((response) => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        // 取消收藏多个
        if (_vue.cancelMarkType === 2) {
          _vue.multipleSelection.forEach(row => {
            _vue.tableData.forEach(tableRow => {
              if (tableRow.talentPoolId === row.talentPoolId) {
                row.isMark = false
              }
            })
          })
          // 取消收藏单个
        } else if (_vue.cancelMarkType === 1) {
          _vue.tableData.forEach(row => {
            if (_vue.cancelMarkTalentId === row.talentPoolId) {
              row.isMark = false
            }
          })
        }
      })
    },
    fetchFolds () {
      // 查询所有收藏文件夹
      let _vue = this
      _vue.$http.get('/api/v1.0/candidate/floder?page=1&rows=9999').then((response) => {
        let rows = response.data.data.rows
        rows.forEach(row => {
          _vue.folds.push({
            id: row.id,
            name: row.flodName
          })
        })
      })
    },
    setFold () { // 收藏候选人
      let _vue = this
      if (_vue.checkSelect()) {
        _vue.markType = 2
        _vue.foldDialogVisible = true
      }
    },
    mark (val) {
      let _vue = this
      _vue.markTalentId = val.talentPoolId
      _vue.markType = 1
      _vue.foldDialogVisible = true
    },
    cancelFold () {
      let _vue = this
      if (_vue.checkSelect()) {
        _vue.cancelMarkType = 2

        _vue.cancelFoldConfirm()
      }
    },
    cancelMark (val) {
      let _vue = this
      _vue.cancelMarkTalentId = val.talentPoolId
      _vue.cancelMarkType = 1
      _vue.cancelFoldConfirm()
    },
    cancelFoldConfirm () {
      let _vue = this
      this.$confirm('确定取消收藏该候选人吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _vue.deletePep()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    @import "~assets/css/variable";

    .multi-button-wrap {
        button {
        }
    }
    .dialog-bottom-tip {
        text-align: center;
        font-size: 15px;
        color: #666;
    }
</style>
