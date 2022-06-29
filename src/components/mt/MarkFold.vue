<template>
    <div class="table-list-wrap">
        <el-carousel ref="carousel" :autoplay="false" indicator-position="outside" :height="'800px'">
            <el-carousel-item>
                <div class="list-search-wrap">
                    <el-form :inline="true" ref="searchForm" :model="searchForm" class="form-inline" label-width="120px">
                        <el-form-item>
                            <el-select v-model="searchForm.folderName" filterable  clearable min placeholder="请选择或输入搜索" size="medium" style="width: 100%;" >
                                <el-option
                                    v-for="item in foldNames"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="修改时间">
                            <el-form-item prop="startTime">
                                <el-date-picker
                                    v-model="searchForm.startTime"
                                    type="datetime"
                                    id="startTime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="开始日期"
                                    style="width: 200px;"
                                    default-time="00:00:00"
                                    clearable>
                                </el-date-picker>
                            </el-form-item>
                            <span style="padding-right: 10px;">至</span>
                            <el-form-item prop="endTime">
                                <el-date-picker
                                    id="endTime"
                                    type="datetime"
                                    v-model="searchForm.endTime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="结束日期"
                                    style="width: 200px;"
                                    default-time="23:59:59"
                                    clearable>
                                </el-date-picker>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search('searchForm')">搜索</el-button>
                            <el-button type="primary" @click="reset('searchForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <el-table :data="tableData" header-row-class-name="tableheader"  border style="width: 100%; min-height: 800px;">
                    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                    <el-table-column label="分类名称" width="200"  prop="flodName" align="center">
                    </el-table-column>
                    <el-table-column label="最后修改时间" width="200" prop="modifyTime" align="center">
                    </el-table-column>
                    <el-table-column label="收藏人数" width="200" prop="ct" align="center">
                    </el-table-column>
                    <el-table-column label="操作" width="200" align="center">
                        <template slot-scope="scope">
                        <el-button
                            size="small"
                            type="primary"
                            plain
                            @click="editFold(scope.row.id)">查看编辑</el-button>
                        <el-button
                            size="small"
                            type="primary"
                            plain
                            @click="deleteFold(scope.row.id)">删除</el-button>
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
            </el-carousel-item>
            <el-carousel-item style="overflow: scroll;">
                <el-button @click="$refs.carousel.setActiveItem(0)">&lt;&lt;&nbsp;&nbsp;返回收藏列表</el-button>
                <el-row><el-col :span="24"></el-col></el-row>
                <el-table :data="tableTalentData"  header-row-class-name="tableheader"   border style="width: 100%;" size="mini" max-height="800">
                    <el-table-column type="index" label="序号" width="50" fixed></el-table-column>
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
                    <el-table-column label="职能" width="200" prop="currentEngineFunctionIdMany" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="职级" width="100" prop="currentEngineRank">
                        <template slot-scope="scope">
                            <span>{{scope.row.currentEngineRank | filterEngineRank}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="当前公司" width="200" prop="currentCompanyName" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="当前职位" width="200" prop="currentJobTitle" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="学校" width="100" prop="currentSchoolName" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="专业" width="100" prop="currentFieldOfStudy" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="学历" width="100" prop="education" :show-overflow-tooltip="true">
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
                </el-table>
                <div class="pager-wrap">
                    <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :total="totalTalentNum"
                        :page-size="talentPager.size"
                        @current-change="handleTalentCurrentChange">
                    </el-pagination>
                </div>
            </el-carousel-item>
        </el-carousel>
        <el-dialog  :visible.sync="contactDialogVisible" style="margin-top:200px;"  width="20%">
            <div v-if="chinese != null && chinese != ''" style="padding-left: 30px;"><span style="color: #66b1ff">中文名：</span><span style="margin-left: 5px" >{{chinese}}</span></div>
            <div v-if="enfullname != null && enfullname != ''" style="padding-left: 30px;"><span style="color: #66b1ff">英文名：</span><span style="margin-left: 5px">{{enfullname}}</span></div>
            <div v-if="mobiles != null && mobiles.length>0" style="padding-left: 30px;"><span style="color: #3a8ee6">手机号：</span><span style="margin-left: 5px"  v-for="item in mobiles" v-bind:key="item">{{item}}</span></div>
            <div v-if="emails != null && emails.length>0" style="padding-left: 30px;"><span style="color: #66b1ff">邮箱：</span><span style="margin-left: 5px" v-for="item in emails" v-bind:key="item">{{item}}</span></div>
        </el-dialog>
    </div>
</template>

<script>
import Global from 'assets/js/global'
export default {
  data () {
    return {
      mobiles: [
      ],
      emails: [
      ],
      chinese: null,
      enfullname: null,
      contactDialogVisible: false,
      pager: {
        size: 10,
        curPage: 1
      },
      totalNum: 0,
      tableData: [],
      searchForm: {
        startTime: '',
        endTime: ''
      },
      talentPager: {
        size: 20,
        curPage: 1
      },
      totalTalentNum: 0,
      tableTalentData: [],
      curFoldId: null,
      cancelMarkTalentId: null,
      foldNames: [],
      folderName: ''
    }
  },
  created () {
    this.fetchFoldNames()
    this.fetchFoldTable()
  },
  filters: {
    filterWebResumeLink (value) {
      return Global.CONFIG.SERVER_URL + '/api/hunter/preview_talent_pool_resume.htm?talentPoolId=' + value
    }
  },
  methods: {
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
    fetchFoldNames () {
      // 查询所有收藏夹名称
      let _vue = this
      _vue.$http.get('/api/v1.0/candidate/floder-name').then((response) => {
        _vue.foldNames = response.data.data.list
      })
    },
    fetchFoldTable () {
      // 获取收藏列表
      let _vue = this
      _vue.$http.get('/api/v1.0/candidate/floder?page=' + _vue.pager.curPage + // 第几页
        '&rows=' + _vue.pager.size + // 页面尺寸
        '&startTime=' + (_vue.searchForm.startTime || '') +
        '&endTime=' + (_vue.searchForm.endTime || '') +
        '&key=' + (_vue.searchForm.folderName || '')
      ).then(function (response) {
        _vue.tableData = response.data.data.rows || []
        _vue.totalNum = response.data.data.total || 1
      })
    },
    search () {
      this.fetchFoldTable()
    },
    reset () {
      this.searchForm = {
        keyword: '',
        startTime: '',
        endTime: ''
      }
      this.fetchFoldTable()
    },
    fetchTalentTable () {
      // 获取人才列表
      let _vue = this
      _vue.$http.get('/api/v1.0/candidate/search?page=' + _vue.talentPager.curPage + // 第几页
        '&rows=' + _vue.talentPager.size + // 页面尺寸
        '&flodId=' + _vue.curFoldId
      ).then(function (response) {
        _vue.tableTalentData = response.data.data.rows || []
        _vue.totalTalentNum = response.data.data.total || 0
      })
    },
    editFold (foldId) {
      let _vue = this
      _vue.curFoldId = foldId
      _vue.$refs.carousel.setActiveItem(1)
      _vue.fetchTalentTable()
    },
    deleteFold (foldId) {
      let _vue = this
      _vue.$http.delete('/api/v1.0/candidate/floder?id=' + foldId).then((response) => {
        _vue.$message({
          type: 'success',
          message: '删除成功!',
          center: true
        })
        _vue.fetchFoldTable()
      })
    },
    handleCurrentChange (val) {
      this.pager = {
        size: 10,
        curPage: val
      }
      this.fetchFoldTable()
    },
    handleTalentCurrentChange (val) {
      this.talentPager = {
        size: 20,
        curPage: val
      }
      this.fetchTalentTable()
    },
    mark (val) {
      let _vue = this
      _vue.$http.post('/api/v1.0/candidate/floder/candidate', {
        candidateIds: val.talentPoolId + '',
        floderId: _vue.curFoldId
      }).then((response) => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        _vue.tableTalentData.forEach(row => {
          if (val.talentPoolId === row.talentPoolId) {
            row.isMark = true
          }
        })
      })
    },
    cancelMark (val) {
      let _vue = this
      _vue.cancelMarkTalentId = val.talentPoolId
      this.$confirm('确定取消收藏该候选人吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _vue.deletePep()
      })
    },
    deletePep () {
      let _vue = this
      _vue.$http.delete('/api/v1.0/candidate/floder/candidate?candidateIds=' + _vue.cancelMarkTalentId +
      '&floderId=' + _vue.curFoldId
      ).then((response) => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        _vue.tableTalentData.forEach(row => {
          if (_vue.cancelMarkTalentId === row.talentPoolId) {
            row.isMark = false
          }
        })
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
    .form-line {
        height: 1px;
        background: #99a9bf;
    }
</style>
