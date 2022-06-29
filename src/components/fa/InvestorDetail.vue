<template>
  <div class="detail-container">
    <div class="goBack" @click='$router.go(-1)'>&lt;&lt; 返回列表</div>
    <el-row :gutter="20">
      <el-col class="left-container" :span="22">
        <!-- 基本信息&用户信息 -->
        <el-row class="top-block" :gutter="20">
          <el-col :span="16">
            <div class="wrapper company-block">
              <div class="h-title">投资人基础信息
                <i class="icon el-icon-edit" @click="editUser()"></i>
              </div>
              <div class="cnt-wrap">
                <div class="item">
                  <div class="title">头像</div>
                  <div class="cnt">
                    <img class="avatar" :src="userInfoModel.headImg | filterQiniuMooreImage" v-if="userInfoModel.headImg">
                    <span v-else>暂无logo</span>
                  </div>
                </div>
                <div class="item">
                  <div class="title">姓名</div>
                  <div class="cnt">{{userInfoModel.name || '暂无'}}</div>
                </div>
                <div class="item">
                  <div class="title">联系方式</div>
                  <div class="cnt">{{userInfoModel.mobile || '暂无'}}</div>
                </div>
                <div class="item">
                  <div class="title">邮箱</div>
                  <div class="cnt">{{userInfoModel.email || '暂无'}}</div>
                </div>
                <div class="item">
                  <div class="title">公司名称</div>
                  <div class="cnt" v-if='investorData.mechanismModel && investorData.mechanismModel.companyName'>
                    {{investorData.mechanismModel.companyName}}
                  </div>
                  <el-button v-if='!investorData.mechanismModel || !investorData.mechanismModel.companyName'
                             @click="changeCompany" type="primary" size="mini">关联投资机构
                  </el-button>
                  <el-button v-if='investorData.mechanismModel && investorData.mechanismModel.companyName'
                             @click="changeCompany" type="primary" size="mini" style="margin-left: 20px;">变更
                  </el-button>
                </div>
                <div class="item">
                  <div class="title">职务</div>
                  <div class="cnt">{{userInfoModel.job || '暂无'}}</div>
                </div>
                <div class="item">
                  <div class="title">城市</div>
                  <div class="cnt">{{userInfoModel.address || '暂无'}}</div>
                </div>
                <div class="item" v-if='investorData.userInfoModel.stage === 2 || investorData.userInfoModel.isUpdate === 2'>
                  <div class="cnt basic-confirm">
                    <div class="text disabled">信息暂未确认</div>
                    <el-button @click="sendConfirmMsg" type="danger" size="mini">发送确认提醒</el-button>
                  </div>
                </div>
                <div class="item">
                  <div class="title">关注公众号</div>
                  <div class="cnt">{{userInfoModel.isAttention === 1 ? '已关注' : '未关注'}}</div>
                  <el-button @click="sendEmailRemind" type="primary" size="mini" style="margin-left:15px"
                             v-if="userInfoModel.isAttention!==1">引导关注
                  </el-button>
                </div>
              </div>
            </div><div class="wrapper basic-block" v-if='investorData.id'>
              <div class="h-title">投资人其他信息
                <i class="icon el-icon-edit" @click="editInvestor()"></i>
              </div>
              <div class="cnt-wrap">
                <div class="item" style="text-align: left">
                  <div class="title">个人简介</div>
                  <div class="cnt" style='width:90%;' v-html='investorData.summary'></div>
                  <!-- <div class="cnt" style='width:90%;'>{{investorData.summary || '暂无'}}</div> -->
                </div>
                <div class="item">
                  <div class="title">主投阶段</div>
                  <div class="cnt">{{investorData.investorStage || '暂无'}}</div>
                </div>
                <div class="item">
                  <div class="title">行业领域</div>
                  <div class="cnt">{{investorData.investmentTerritory | industryCategoryFilter}}</div>
                </div>
                <div class="item">
                  <div class="title">资金主要来源</div>
                  <div class="cnt">{{investorData.sourceOfFunds || '暂无'}}</div>
                </div>
                <div class="item">
                  <div class="title">管理投资总量</div>
                  <div class="cnt">{{investorData.administerTotal || '暂无'}}</div>
                </div>
                <div class="item">
                  <div class="title">投资案例</div>
                  <div class="cnt" v-html='investorData.investmentCase' style='width:90%;'></div>
                </div>
                <div class="item">
                  <div class="title">其他服务</div>
                  <div class="cnt">{{investorData.otherServices || '暂无'}}</div>
                </div>
                <div class="cnt-wrap mainItem">
                  <div class="h-title">教育背景
                  </div>
                  <div class="noneTitle"
                       v-if="!investorData.educationHistoryModels || investorData.educationHistoryModels.length === 0">无
                  </div>
                  <div class="cnt-wrap mainItemContent" v-for="(item,key) in investorData.educationHistoryModels"
                       :key="key">
                    <div class="item">
                      <div class="title">学校</div>
                      <div class="cnt">{{item.schoolName || '暂无'}}</div>
                    </div>
                    <div class="item">
                      <div class="title">学历</div>
                      <div class="cnt">{{item.education | filterFaEducation}}</div>
                    </div>
                    <div class="item">
                      <div class="title">专业</div>
                      <div class="cnt">{{item.major || '暂无'}}</div>
                    </div>
                    <div class="item">
                      <div class="title">开始时间</div>
                      <div class="cnt">{{item.startTime || '暂无'}}</div>
                    </div>
                    <div class="item">
                      <div class="title">结束时间</div>
                      <div class="cnt">{{item.endTime || '暂无'}}</div>
                    </div>
                  </div>
                </div>
                <div class="cnt-wrap mainItem">
                  <div class="h-title">工作经历
                  </div>
                  <div class="noneTitle"
                       v-if="!investorData.workHistoryModels || investorData.workHistoryModels.length === 0">无
                  </div>
                  <div class="cnt-wrap mainItemContent" v-for="(item,key) in investorData.workHistoryModels" :key="key">
                    <div class="item">
                      <div class="title">公司</div>
                      <div class="cnt">{{item.companyName || '暂无'}}</div>
                    </div>
                    <div class="item">
                      <div class="title">职务</div>
                      <div class="cnt">{{item.positions || '暂无'}}</div>
                    </div>
                    <div class="item">
                      <div class="title">开始时间</div>
                      <div class="cnt">{{item.startTime || '暂无'}}</div>
                    </div>
                    <div class="item">
                      <div class="title">结束时间</div>
                      <div class="cnt">{{item.endTime || '暂无'}}</div>
                    </div>
                  </div>
                </div>
                <div class="item">
                  <div class="title">投资产业链方向</div>
                  <div class="cnt" style="width:90%">{{semiconductor || '暂无'}}</div>
                </div>
                <div class="item">
                  <div class="title">对外展示标签</div>
                  <div class="cnt" style='width:90%;'>{{ externalLabelText }}</div>
                </div>
                <div class="item">
                  <div class="title">备注</div>
                  <div class="cnt" style='width:90%;'>
                    {{investorData.remark}}
                  </div>
                </div>
                <div class="hr h-title"><span>以下为非公开信息</span></div>
                <div class="item">
                  <div class="title">对内展示标签</div>
                  <div class="cnt" style='width:90%;'>{{ innerLabelText }}</div>
                </div>
                <div class="item">
                  <div class="title">团队管理经验</div>
                  <div class="cnt" v-html='investorData.workTeamHistory' style='width:90%;'></div>
                </div>
                <div class="item">
                  <div class="title">创业经历</div>
                  <div class="cnt" v-html='investorData.entrepreneurialHistory' style='width:90%;'></div>
                </div>
              </div>
            </div>
            <div class="wrapper basic-block" v-if='!investorData.id'>
              <div class="h-title">投资人基本信息</div>
              <div @click="editInvestor" class="empty-wrap">
                <div class="add-btn-wrap">
                  <i class="icon el-icon-plus"></i>
                  <div class="text">添加投资人基本信息</div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="item" v-if='investorData.userInfoModel.stage === 2 || investorData.userInfoModel.isUpdate === 2'>
          <div class="cnt basic-confirm" style="display:flex;justyif-content:center;align-items:center">
            <div class="text disabled" style="margin-right:20px;">信息暂未确认</div>
            <el-button @click="sendConfirmMsg" type="danger" size="mini">发送确认提醒</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="dialog">
      <!-- 发送基本信息确认提醒 -->
      <el-dialog
        title="发送确认提醒"
        :visible.sync="remindDialogVisible"
        fullscreen
        width='30%'>
        <span>请确保下方信息已完善并核对准确，投资人确认信息后，如有内容修改需重新确认。</span>
        <span slot="footer" class="dialog-footer">
                <el-button @click="remindDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmRemind">发送确认提醒</el-button>
              </span>
      </el-dialog>
    </div>
    <!--  关联投资机构  -->
    <div class="dialog changeCompany_dialog">
      <el-dialog
        title="关联投资机构"
        :visible.sync="changeCompanyVisible"
        fullscreen
        width='40%'>
        <span>投资人属于全新的投资机构</span>
        <el-button type="primary" @click="openAdd">新建投资机构</el-button>
        <div class='mechanismNameSearch'>
          <!-- <el-input v-model="mechanismName" placeholder="输入投资机构名称" style="margin: 10px 0;margin-right:10px; width:220px;"></el-input> -->
              <el-autocomplete
                class="inline-input"
                v-model="mechanismName"
                :fetch-suggestions="querySearch"
                placeholder="输入投资机构名称"
                :trigger-on-focus="false"
                @select="handleSelect"
                @keyup.enter.native="searchMechanismName"
              ></el-autocomplete>
          <el-button type="primary" @click="searchMechanismName">搜索</el-button>
        </div>
        <div class="table">
          <div style="margin:10px 0;font-size:15px;">
            <span>从已有的机构列表中选择</span>
          </div>
          <el-table
            :data="mechanismDataList"
            header-row-class-name="tableheader"
            border
            tooltip-effect="dark"
            style="width: 100%;"
            highlight-current-row
            @current-change="changeMechanismValue">
            <el-table-column
              type="index"
              width="55"
              align="center">
            </el-table-column>
            <el-table-column
              label="机构名称"
              width="200"
              align="center">
              <template slot-scope="scope">{{ scope.row.faMechanism.companyName || '暂无'}}</template>
            </el-table-column>
            <el-table-column
              label="公司别称"
              width="200"
              align="center">
              <template slot-scope="scope">{{ scope.row.faMechanism.mechanismName || '暂无'}}</template>
            </el-table-column>
            <el-table-column
              label="机构类型"
              width="auto"
              align="center">
              <template slot-scope="scope">{{ scope.row.faMechanism.mechanismType === 1 ? '投资机构' : '产业及其他资本' }}
              </template>
            </el-table-column>
          </el-table>
        </div>
          <div class="pager-wrap">
            <el-pagination
              background
              layout="total, prev, pager, next"
              :total="pageTotal"
              :page-size="pageSize"
              @current-change="handleCurrentChange">
            </el-pagination>
          </div>
        <span slot="footer" class="dialog-footer">
          <span style="position: absolute;left:20px">当前关联机构：<span style="font-size: 16px; color: #ff0000c2">{{investorData.mechanismModel ? investorData.mechanismModel.companyName : '暂无'}}</span></span>
                <el-button @click="changeCompanyVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmChangeCompanyVisible">确认关联</el-button>
              </span>
      </el-dialog>
    </div>
    <!-- 编辑用户信息 -->
    <el-dialog
      title="编辑投资人基础信息"
      :visible.sync="userFormDialogVisible"
      fullscreen
      width='40%'>
      <el-form :model="editUserForm">
        <el-form-item label="头像" label-width="100px">
          <div class="cover-img-wrap">
            <img class="upload-image cover-img avatar" v-if="uploadedhHeadImgUrl"
                 :src="uploadedhHeadImgUrl | filterQiniuMooreImage" alt="">
            <el-upload
              class="upload-btn"
              :show-file-list="false"
              action="http://upload.qiniup.com/"
              :before-upload="beforeUpload"
              :on-progress="uploadProgress"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :data="uploadData"
              :multiple="false">
              <el-button size="small" type="primary">上传头像</el-button>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="*姓名" label-width="100px">
          <el-input v-model="editUserForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="*邮箱" label-width="100px">
          <el-input v-model="editUserForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="*联系方式" label-width="100px">
          <el-input v-model="editUserForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="*职务" label-width="100px">
          <el-input v-model="editUserForm.job" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="*城市" label-width="100px">
          <el-input v-model="editUserForm.address" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userFormDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUserForm()">提 交</el-button>
      </div>
    </el-dialog>
    <!-- 投资人其他信息 -->
    <el-dialog
      title="投资人其他信息"
      :visible.sync="editInvestorVisible"
      fullscreen
      width='40%'>
      <el-form class="dialog-form" :model="editInvestorForm">
          <!-- <el-form-item label='公司:' label-width="150px">
              <el-input v-model="editInvestorForm.companyName" auto-complete="off"></el-input>
          </el-form-item> -->
          <el-form-item label='个人简介' label-width="150px">
              <vue-ckeditor v-model="editInvestorForm.summary" :config="ckeditorConfig"></vue-ckeditor>
          </el-form-item>
        <el-form-item label="*主投阶段" label-width="150px">
          <el-select v-model="investorStageData" multiple>
              <el-option :label="item.label" v-for="item in INVESTORSTAGE" :key="item.value"  :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="*资金主要来源" label-width="150px">
          <el-input v-model="editInvestorForm.sourceOfFunds"></el-input>
        </el-form-item>
        <el-form-item label="*管理投资总量" label-width="150px">
          <el-input v-model="editInvestorForm.administerTotal"></el-input>
        </el-form-item>
        <el-form-item label='*投资案例' label-width="150px">
          <vue-ckeditor v-model="editInvestorForm.investmentCase" :config="ckeditorConfig"></vue-ckeditor>
        </el-form-item>
        <el-form-item label="其他服务" label-width="150px">
            <el-select v-model="otherServicesData" multiple>
                <el-option :label="item.label" v-for="item in otherServicesOptions" :key="item.value"  :value="item.value"></el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="教育背景" label-width="150px">
          <div class="add-item">
            <el-button @click="addeducationHistoryModels" size="small">新增一段</el-button>
          </div>
          <div class="workExp-list">
            <div class="workExp" v-for="(item,key) in editInvestorForm.educationHistory" :key="key">
              <el-form-item label="学校" label-width="80px">
                <el-input v-model="item.schoolName"></el-input>
              </el-form-item>
              <el-form-item label="专业" label-width="80px">
                <el-input v-model="item.major"></el-input>
              </el-form-item>
              <el-form-item label="学历" label-width="80px">
                <el-select v-model="item.education">
                  <el-option label="大专" value="1"></el-option>
                  <el-option label="本科" value="2"></el-option>
                  <el-option label="硕士" value="3"></el-option>
                  <el-option label="博士" value="4"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="开始时间" label-width="80px">
                <el-date-picker
                  v-model="item.startTime"
                  type="month"
                  format="yyyy.MM"
                  value-format="yyyy.MM"
                  placeholder="开始时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间" label-width="80px">
                <el-date-picker
                  v-model="item.endTime"
                  type="month"
                  format="yyyy.MM"
                  value-format="yyyy.MM"
                  placeholder="结束时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="" style="text-align: right">
                <el-button @click="deleteeducationHistory(key)" type="danger" size="mini">删除此段</el-button>
              </el-form-item>
            </div>
          </div>
        </el-form-item>
      <el-form-item label="工作经历" label-width="150px">
        <div class="add-item">
          <el-button @click="addworkHistoryModels" size="small">新增一段</el-button>
        </div>
        <div class="workExp-list">
          <div class="workExp" v-for="(item,key) in editInvestorForm.workHistory" :key="key">
            <el-form-item label="公司" label-width="80px">
              <el-input v-model="item.companyName"></el-input>
            </el-form-item>
            <el-form-item label="职务" label-width="80px">
              <el-input v-model="item.positions"></el-input>
            </el-form-item>
            <el-form-item label="开始时间" label-width="80px">
              <el-date-picker
                v-model="item.startTime"
                type="month"
                format="yyyy.MM"
                value-format="yyyy.MM">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" label-width="80px">
              <el-date-picker
                v-model="item.endTime"
                type="month"
                format="yyyy.MM"
                :disabled="item.soFar"
                value-format="yyyy.MM"
                style="width: 150px;">
              </el-date-picker>
              <span style="margin-left: 20px;">
                    <el-checkbox v-model="item.soFar">至今</el-checkbox>
                  </span>
            </el-form-item>
            <el-form-item label="" style="text-align: right">
              <el-button @click="deleteworkHistory(key)" type="danger" size="mini">删除此段</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form-item>
      <el-form-item label='*行业领域' label-width="150px">
          <el-select v-model="investmentTerritory" multiple>
            <el-option :label="item.label" v-for="item in INDUSTRIALCATEGORY" :key="item.value"  :value="item.value"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="*投资产业链方向" label-width="150px">
        <el-select
          style="width: 100%"
          v-model='semiconductorData'
          multiple
          filterable
          remote
          reserve-keyword
          default-first-option
          placeholder="选择投资产业链方向"
          >
          <el-option
            v-for="item in semiconductorOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="对外展示标签" label-width="150px">
        <span v-if="externalLabels">{{externalLabels}}</span>
        <el-button @click="openExternalDialog" type="plain" size="small">选择标签</el-button>
      </el-form-item>
      <el-form-item label="备注" label-width="150px">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          v-model="editInvestorForm.remark">
        </el-input>
      </el-form-item>
      <el-form-item>
        <div class="hr"><span>以下为非公开信息</span></div>
      </el-form-item>
      <el-form-item label="对内展示标签" label-width="150px">
        <span v-if="innerLabels">{{ innerLabels }}</span>
        <el-button @click="openInnerDialog" type="plain" size="small">选择标签</el-button>
      </el-form-item>
      <el-form-item label="创业经历" label-width="150px">
        <vue-ckeditor v-model="editInvestorForm.entrepreneurialHistory" :config="ckeditorConfig"></vue-ckeditor>
      </el-form-item>
      <el-form-item label='团队管理经验' label-width="150px">
        <vue-ckeditor v-model="editInvestorForm.workTeamHistory" :config="ckeditorConfig"></vue-ckeditor>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="editInvestorVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitInvestorForm('editInvestorForm')">提 交</el-button>
    </div>
  </el-dialog>
    <!-- 外显标签 -->
    <TagDialog ref="refExternalLabel" @emitGetValue="getExternalLabel"></TagDialog>
    <!-- 内显标签 -->
    <TagDialog ref="refInnerLabel" @emitGetValue="getInnerLabel"></TagDialog>
    <AddNewMechanism ref="refAddNewMechanismVisible" @openAddNewMechanism='openAddNewMechanismDialog'
                     v-if='investorFormDialogShow'></AddNewMechanism>
  </div>
</template>

<script>
import AddNewMechanism from './widgets/addNewMechanism'
import Global from 'assets/js/global'
import _ from 'underscore'
import TagDialog from '../fa/widgets/TagDialog'
import FaCommon from 'assets/js/faCommon'
export default {
  data () {
    return {
      restaurants: [],
      mechanismName: '',
      INDUSTRIALCATEGORY: [],
      pageSize: 5,
      pageNum: 1,
      pageTotal: 0,
      workHistory: [], // 工作经历
      educationHistory: [], // 工作经历
      innerLabelIdArr: [],
      externalLabelIdArr: [],
      processLabelArr: [],
      innerLabelText: '',
      externalLabelText: '',
      innerLabels: '',
      externalLabels: '',
      tagsOpts: [], // 标签
      fetchTagLoading: false, // 标签
      investmentTerritory: [],
      investorStageData: [], // 主投阶段
      otherServicesData: [], // 其他服务
      semiconductorData: [], // 投资产业链方向
      semiconductorOptions: [],
      semiconductor: '',
      otherServicesOptions: [{
        label: '政策业务',
        value: 1
      }, {
        label: '上市辅导',
        value: 2
      }, {
        label: '财务知识',
        value: 3
      }, {
        label: '法律知识',
        value: 4
      }, {
        label: '企业并购经验',
        value: 5
      }, {
        label: '基金设计设立',
        value: 6
      }],
      uploading: false,
      id: this.$route.params.id,
      remindDialogVisible: false,
      userFormDialogVisible: false,
      editUserForm: {},
      companyFormDialogVisible: false,
      companyForm: {
        userId: '',
        faCompany: {
          id: '',
          companyName: '',
          companyLogo: '',
          companyLicense: '',
          registeredFund: '',
          fundType: '',
          legalName: '',
          legalTelephone: '',
          companyBackground: '',
          marketTime: '',
          business: '',
          registrationTime: '',
          industrialCategory: '',
          companyAddress: ''
        }
      },
      userInfoModel: {},
      mechanismModel: {},
      // 上传头像
      uploadedhHeadImgUrl: '',
      uploadData: {
        key: '',
        token: ''
      },
      ckeditorConfig: {
        toolbar: [
          ['BulletedList']
        ],
        height: 100,
        width: '90%'
      },
      labelWidth: '150px',
      // 编辑投资人基本信息
      INVESTORSTAGE: Global.CONSTANT.INVESTORSTAGE, // 主投阶段
      editInvestorVisible: false,
      investorData: {
        investorStage: '',
        otherServices: '',
        sourceOfFunds: '',
        semiconductor: '',
        externalLabel: '',
        educationHistory: [],
        workHistoryModels: [],
        entrepreneurialHistory: [],
        workTeamHistory: '',
        investmentCase: [],
        userInfoModel: {},
        remark: ''
      },
      editInvestorForm: {
        id: '',
        summary: '',
        sourceOfFunds: '',
        administerTotal: '',
        investmentTerritory: '',
        semiconductor: [],
        investorStage: [],
        otherServices: [],
        educationHistory: [],
        workHistory: [],
        entrepreneurialHistory: '',
        workTeamHistory: '',
        investmentCase: '',
        externalLabel: [],
        innerLabel: []
      },
      editfaCompanyFrom: {},
      lastCheckTime: 0,
      lastEmailTime: 0,
      investorFormDialogShow: false,
      changeCompanyVisible: false,
      mechanismDataList: [],
      mechanismId: '',
      editUserRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        job: [
          { required: true, message: '请输入职务', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入城市', trigger: 'blur' }
        ]
      },
      editInvestorRules: {
        sourceOfFunds: [
          { required: true, message: '请输入资金主要来源', trigger: 'blur' }
        ],
        administerTotal: [
          { required: true, message: '请输入管理投资总量', trigger: 'blur' }
        ],
        investmentCase: [
          { required: true, message: '请输入投资案例', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getIndustrialCategory()
    this.fetchFristTag()
    this.fetchAllTag()
    this.getMechanismData()
    this.investorDetail()
    this.getRestaurants()
  },
  components: {
    AddNewMechanism,
    TagDialog
  },
  methods: {
    confirmChangeCompanyVisible () {
      let self = this
      this.$confirm('确认关联吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.confirmChangeCompany()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消关联'
        })
      })
    },
    getRestaurants () {
      this.$http.get('/api/v1.0/fa/mechanism/findLikeName', {keyWord: ''}).then((res) => {
        let result = res.data
        this.restaurants = result.data
        return result
      })
    },
    // 关联投资机构联想搜索
    querySearch (queryString, cb) {
      var restaurants = this.restaurants
      console.log('__________')
      console.log(restaurants)
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (res) {
      console.log(res)
    },
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
    fetchAllTag () {
      // 获取所有标签
      this.$http.get('/api/v1.0/fa/tag/findAllTag?parentId=0').then(res => {
        this.labelData = res.data.data[0].childTag
        this.processLabelArr = FaCommon.handleAllTag(this.labelData)
      })
    },
    fetchFristTag () {
      this.$http.get('/api/v1.0/fa/tag/findAllTag?parentId=1').then(res => {
        this.semiconductorOptions = res.data.data
      })
      return this.semiconductorOptions
    },
    openExternalDialog () {
      let semiconductorValue = this.semiconductorData.join(',')
      this.$refs.refExternalLabel.show = true
      // this.$refs.refInnerLabel.fetchAllLabel()
      this.$refs.refExternalLabel.fetchSenLabel(semiconductorValue)
      // 外显标签需要回显
      console.log('&&&&&&&&&')
      console.log(this.investorData.externalLabel)
      let externalLabel = this.investorData.externalLabel ? this.investorData.externalLabel.split(',') : []
      window.setTimeout(() => {
        this.$refs.refExternalLabel.setCheckedVal(externalLabel)
      }, 500)
    },
    openInnerDialog () {
      let semiconductorValue = this.semiconductorData.join(',')
      this.$refs.refInnerLabel.show = true
      // this.$refs.refInnerLabel.fetchAllLabel()
      this.$refs.refInnerLabel.fetchSenLabel(semiconductorValue)
      // 内显标签需要回显
      console.log('&&&&&&&&&')
      console.log(this.investorData.innerLabel)
      let innerLabel = this.investorData.innerLabel ? this.investorData.innerLabel.split(',') : []
      window.setTimeout(() => {
        this.$refs.refInnerLabel.setCheckedVal(innerLabel)
      }, 500)
    },
    getExternalLabel (val) {
      this.externalLabelIdArr = _.pluck(val, 'id')
      this.externalLabels = _.pluck(val, 'name').toString()
      this.investorData.externalLabel = this.externalLabelIdArr.join(',')
    },
    getInnerLabel (val) {
      this.innerLabelIdArr = _.pluck(val, 'id')
      this.innerLabels = _.pluck(val, 'name').toString()
      this.investorData.innerLabel = this.innerLabelIdArr.join(',')
    },
    handleCurrentChange (value) {
      this.pageNum = value
      this.getMechanismData()
    },
    changeMechanismValue (val) {
      console.log('选中的行数')
      console.log(val)
      if (!val) return
      this.mechanismId = val.faMechanism.id
    },
    // 变更公司
    changeCompany () {
      this.mechanismName = ''
      this.getMechanismData()
      this.changeCompanyVisible = true
    },
    searchMechanismName () {
      let mechanismName = this.mechanismName
      this.getMechanismData(mechanismName)
    },
    getMechanismData (str) {
      let keyWord = str
      let self = this
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        parameters: {
          keyWord: keyWord || ''
        }
      }
      this.$http.post('/api/v1.0/fa/mechanism/page', data).then((res) => {
        console.log('获取投资机构列表信息')
        console.log(res)
        self.pageTotal = res.data.data.total
        self.pageNum = res.data.data.pageNum
        self.mechanismDataList = res.data.data.data
        console.log(self.mechanismDataList)
      })
    },
    // 新增投资机构
    openAdd () {
      console.log('新增')
      // this.changeCompanyVisible = false
      this.investorFormDialogShow = true
      this.openAddNewMechanismDialog()
    },
    openAddNewMechanismDialog () {
      // 点击打开新建投资机构弹窗
      let ref = this.$refs.refAddNewMechanismVisible
      ref.investorFormDialogVisible = true
    },
    // 添加/删除 工作经验、教育背景的多段信息 start
    addworkHistoryModels () {
      this.editInvestorForm.workHistory.push({companyName: '', industry: '', positions: '', isCurrentCompany: '', startTime: '', endTime: ''})
      this.editInvestorForm = JSON.parse(JSON.stringify(this.editInvestorForm))
    },
    addeducationHistoryModels () {
      this.editInvestorForm.educationHistory.push({schoolName: '', major: '', education: '', startTime: '', endTime: ''})
      this.editInvestorForm = JSON.parse(JSON.stringify(this.editInvestorForm))
    },
    deleteeducationHistory (index) {
      this.editInvestorForm.educationHistory.splice(index, 1)
      this.editInvestorForm = JSON.parse(JSON.stringify(this.editInvestorForm))
    },
    deleteworkHistory (index) {
      this.editInvestorForm.workHistory.splice(index, 1)
      this.editInvestorForm = JSON.parse(JSON.stringify(this.editInvestorForm))
    },
    // 添加/删除 工作经验、教育背景的多段信息 end
    remoteFetchTag (query) { // 标签输入改变事件
      let _vue = this
      if (!_vue.fetchTagLoading && query !== '') {
        _vue.fetchTagLoading = true
        _vue.$http.get('/api/v1.0/fa/tag/findLikeName?name=' + query).then((response) => {
          _vue.fetchTagLoading = false
          _vue.tagsOpts = _.sortBy(response.data.data, 'id')
        })
      } else {
        _vue.tagsOpts = []
      }
    },
    investorDetail () {
      // TODO: 获取投资方详情
      let self = this
      let data = {
        params: {
          id: this.$route.params.id
        }
      }
      this.$http.get('/api/v1.0/fa/investor/details', data).then((res) => {
        console.log('获取投资方详情')
        let data = res.data.data
        console.log(data)
        self.investorStageData = self.strParseInt(data.investorStage)
        self.otherServicesData = self.strParseInt(data.otherServices)
        self.investmentTerritory = data.investmentTerritory ? data.investmentTerritory.split(',') : []
        self.investorData = JSON.parse(JSON.stringify(data))
        this.userInfoModel = JSON.parse(JSON.stringify(this.investorData.userInfoModel))
        this.mechanismModel = JSON.parse(JSON.stringify(data.mechanismModel))
        window.setTimeout(() => {
          this.innerLabelText = this.investorData.innerLabel === null ? '' : this.stringifyArr(this.investorData.innerLabel, this.processLabelArr)
          this.externalLabelText = this.investorData.externalLabel === null ? '' : this.stringifyArr(this.investorData.externalLabel, this.processLabelArr)
          self.externalLabels = this.investorData.externalLabel === null ? '' : self.stringifyArr(self.investorData.externalLabel || '', self.processLabelArr)
          self.innerLabels = this.investorData.innerLabel === null ? '' : self.stringifyArr(self.investorData.innerLabel || '', self.processLabelArr)
          self.semiconductor = data.semiconductor === null ? '' : self.stringifyArr(data.semiconductor, self.fetchFristTag())
          self.investorData.investorStage = data.investorStage === null ? '暂无' : self.stringifyArr(data.investorStage, self.INVESTORSTAGE)
          self.investorData.otherServices = data.otherServices === null ? '暂无' : self.stringifyArr(data.otherServices, self.otherServicesOptions)
        }, 500)
        console.log('self.investorData')
        console.log(self.investorData)
      })
    },
    handleLabelName (val, processLabelArr) {
      // 根据tagId显示tagName
      let str = ''
      if (val) {
        console.log(val)
        let arr = val.split(',')
        let list = _.filter(processLabelArr, item => {
          return arr.indexOf(item.id + '') !== -1
        })
        str = _.pluck(list, 'name').toString()
        console.log(str)
      }
      return str
    },
    stringifyArrE (str, options) {
      options.map((item) => {
        if (JSON.stringify(str) === JSON.stringify(item.value)) {
          str = item
          return str
        }
      })
      return str
    },
    // 字符串转换
    stringifyArr (str, options) {
      console.log(options)
      let strings = ''
      if (JSON.stringify(str).length === 1 || str.length === 1) {
        options.map((item) => {
          if (Number(str) === Number(item.value)) {
            console.log('121212')
            strings = item.label
            return strings
          } else if (Number(str) === Number(item.id)) {
            strings = item.name
            return strings
          }
        })
        return strings
      }
      let arr = str.split(',')
      options.map((item) => {
        arr.map((items, index) => {
          if (items === JSON.stringify(item.value) || items === item.value) {
            arr[index] = item.label
            return items
          } else if (items === JSON.stringify(item.id) || items === item.id) {
            arr[index] = item.name
            return items
          }
        })
      })
      arr = arr.join(',').replace(new RegExp(',', 'gm'), ' / ')
      return arr
    },
    // 字符串数字转化数组
    strParseInt (str) {
      let newArr = []
      if (str === null || str === '') {
        newArr = []
      } else {
        str.split(',').map((item) => {
          item = parseInt(item)
          newArr.push(item)
          return item
        })
      }
      return newArr
    },
    sendConfirmMsg () {
      // 发送确认消息
      this.remindDialogVisible = true
    },
    confirmChangeCompany () {
      this.$http.get('/api/v1.0/fa/investor/relationMechanism?investorId=' + this.id + '&mechanismId=' + this.mechanismId).then((res) => {
        console.log(res)
        if (res.data.status === 'success') {
          this.changeCompanyVisible = false
          this.$message.success('提交成功')
          this.investorDetail()
        } else {
          this.changeCompanyVisible = false
          this.$message.error('提交失败')
          this.$message.error(res.data.errMsg)
        }
      }).finally(() => {
        this.changeCompanyVisible = false
      })
    },
    confirmRemind () {
      // TODO：确认发送提醒
      let _vue = this
      console.log(_vue.userInfoModel.id)
      _vue.$http.get('/api/v1.0/fa/userInfo/userInfoCheck?userId=' + _vue.userInfoModel.id).then(res => {
        _vue.remindDialogVisible = false
        _vue.$message({
          message: '提醒消息已发送',
          center: true,
          type: 'success'
        })
      })
      // if (new Date().getTime() - this.lastCheckTime > 60000) {
      //   this.lastCheckTime = new Date().getTime()
      //   this.$http.get('/api/v1.0/fa/userInfo/userInfoCheck?userId=' + _vue.userInfoModel.id).then((res) => {
      //     this.$message.success('发送成功')
      //   }).catch(_ => {
      //     this.$message.error('发送失败')
      //   })
      // } else {
      //   this.$message.warning('请勿频繁发送,请稍后再试')
      // }
    },
    submitUserForm () {
      if (Global.verification('str', this.editUserForm.name) && Global.verification('str', this.editUserForm.email) && Global.verification('str', this.editUserForm.mobile) && Global.verification('str', this.editUserForm.job) && Global.verification('str', this.editUserForm.address)) {
        // TODO: 提交用户信息
        this.editUserForm.headImg = this.uploadedhHeadImgUrl
        let data = this.editUserForm
        console.log(data)
        this.$http.post('/api/v1.0/fa/userInfo/update', data).then((res) => {
          console.log(res)
          if (res.data.data.updateStatus) {
            this.userFormDialogVisible = false
            this.$message.success('提交成功')
          } else {
            this.userFormDialogVisible = false
            this.$message.error('提交失败')
          }
          this.investorDetail()
        })
      } else {
        this.$message({
          message: '请输入必填项',
          type: 'error'
        })
        return false
      }
    },
    editUser () {
      // 编辑用户信息
      this.userFormDialogVisible = true
      this.editUserForm = {
        id: this.userInfoModel.id,
        email: this.userInfoModel.email,
        openId: this.userInfoModel.openId,
        mobile: this.userInfoModel.mobile,
        name: this.userInfoModel.name,
        headImg: this.userInfoModel.headImg,
        job: this.userInfoModel.job,
        address: this.userInfoModel.address
      }
      this.uploadedhHeadImgUrl = this.userInfoModel.headImg
    },
    editInvestor () {
      // 编辑投资人基本信息
      let self = this
      this.editInvestorVisible = true
      let investorData = JSON.parse(JSON.stringify(self.investorData))
      console.log('************')
      console.log(investorData)
      investorData.educationHistoryModels.map((item) => {
        delete item.id
        delete item.createTime
        delete item.type
        delete item.parentId
        return item
      })
      investorData.workHistoryModels.map((item) => {
        delete item.id
        delete item.createTime
        delete item.type
        delete item.parentId
        return item
      })
      self.editInvestorForm = {
        id: investorData.id,
        summary: investorData.summary,
        sourceOfFunds: investorData.sourceOfFunds,
        administerTotal: investorData.administerTotal,
        investmentTerritory: investorData.investmentTerritory,
        investorStage: investorData.investorStage,
        otherServices: investorData.otherServices,
        workHistory: investorData.workHistoryModels,
        educationHistory: investorData.educationHistoryModels,
        entrepreneurialHistory: investorData.entrepreneurialHistory,
        workTeamHistory: investorData.workTeamHistory,
        investmentCase: investorData.investmentCase,
        innerLabel: [],
        externalLabel: [],
        remark: investorData.remark
      }
      let workHistory = investorData.workHistoryModels || []
      if (workHistory.length > 0) {
        this.editInvestorForm.workHistory = _.map(workHistory, item => {
          if (item.endTime === '至今') {
            item.soFar = true
          } else {
            item.soFar = false
          }
          return item
        })
      }
      let educationExp = investorData.educationHistoryModels || []
      if (educationExp.length > 0) {
        this.editInvestorForm.educationHistory = educationExp.map(item => {
          if (item.education) {
            item.education = item.education + ''
          }
          return item
        })
      }
      self.editInvestorForm.workHistory = JSON.parse(JSON.stringify(workHistory))
      self.editInvestorForm.innerLabel = investorData.innerLabel
      self.editInvestorForm.externalLabel = investorData.externalLabel
      if (investorData.semiconductor !== null && investorData.semiconductor.length > 1) {
        let semiconductor = investorData.semiconductor.split(',')
        semiconductor = semiconductor.map((item) => {
          item = JSON.parse(item)
          return item
        })
        self.semiconductorData = semiconductor
      } else {
        let sem = investorData.semiconductor ? JSON.parse(investorData.semiconductor) : ''
        self.semiconductorData = sem ? [sem] : []
      }
      this.externalLabelIdArr = self.editInvestorForm.externalLabel === null ? '' : self.editInvestorForm.externalLabel.split(',')
      this.innerLabelIdArr = self.editInvestorForm.innerLabel === null ? '' : self.editInvestorForm.innerLabel.split(',')
      console.log(self.editInvestorForm)
      console.log(this.externalLabelIdArr)
    },
    submitInvestorForm () {
      let self = this
      if (Global.verification('obj', self.investorStageData) && Global.verification('str', self.editInvestorForm.sourceOfFunds) && Global.verification('str', self.editInvestorForm.administerTotal) && Global.verification('str', self.editInvestorForm.investmentCase) && Global.verification('obj', self.investmentTerritory) && Global.verification('obj', self.semiconductorData)) {
        // TODO: 提交投资人信息
        this.updateProject()
      } else {
        this.$message({
          message: '请输入必填项',
          type: 'error'
        })
        return false
      }
    },
    updateProject () {
      console.log('this.semiconductorData')
      console.log(this.semiconductorData)
      // 更新项目信息
      let investorStageData = this.investorStageData
      let otherServicesData = this.otherServicesData
      let semiconductorData = this.semiconductorData
      this.editInvestorForm.investorStage = investorStageData ? investorStageData.join(',') : ''
      this.editInvestorForm.otherServices = otherServicesData ? otherServicesData.join(',') : ''
      this.editInvestorForm.semiconductor = semiconductorData ? semiconductorData.join(',') : ''
      this.editInvestorForm.innerLabel = this.innerLabelIdArr ? this.innerLabelIdArr.join(',') : ''
      this.editInvestorForm.externalLabel = this.externalLabelIdArr ? this.externalLabelIdArr.join(',') : ''
      this.editInvestorForm.investmentTerritory = this.investmentTerritory ? this.investmentTerritory.join(',') : ''
      // this.editInvestorForm.educationHistory = this.editInvestorForm.educationHistory.map((item) => {
      //   item.education = item.education.value
      //   return item
      // })
      let educationHistory = this.editInvestorForm.educationHistory.map(res => {
        return {
          schoolName: res.schoolName || '',
          major: res.major || '',
          education: res.education || '',
          startTime: res.startTime || '',
          endTime: res.endTime || ''
        }
      })
      this.editInvestorForm.educationHistory = JSON.parse(JSON.stringify(educationHistory))
      let workHistory = this.editInvestorForm.workHistory.map(res => {
        let endTime = ''
        if (res.soFar) {
          endTime = '至今'
        } else {
          endTime = res.endTime || ''
        }
        return {
          companyName: res.companyName || '',
          positions: res.positions || '',
          startTime: res.startTime || '',
          endTime: endTime
        }
      })
      this.editInvestorForm.workHistory = JSON.parse(JSON.stringify(workHistory))
      console.log(this.editInvestorForm)
      let data = this.editInvestorForm
      this.$http.post('/api/v1.0/fa/investor/addOrUpdate', data).then((res) => {
        console.log(res)
        if (res.data.status === 'success') {
          this.editInvestorVisible = false
          this.$message.success('提交成功')
          this.investorDetail()
        } else {
          this.editInvestorVisible = false
          this.$message.error('提交失败')
          this.$message.error(res.data.errMsg)
        }
      }).finally(() => {
        this.updataLoading = false
      })
    },
    // 删除收购案例
    deleteWorkExpItem (index) {
      this.investorForm.faAcquisitionCases.splice(index, 1)
      this.investorForm = JSON.parse(JSON.stringify(this.investorForm))
    },
    beforeUpload (file) {
      // 上传LOGO
      let _vue = this
      if (file.size / 1024 / 1024 >= 10) {
        this.$message({
          type: 'error',
          message: '图片大小需小于10M，请重新上传',
          center: true
        })
        return false
      } else if (['image/jpeg', 'image/png', 'image/gif'].indexOf(file.type) === -1) {
        this.$message({
          type: 'error',
          message: '图片格式只支持jpg,jpeg,png,gif，请重新上传',
          center: true
        })
        return false
      } else {
        let arr = Global.splitFileName(file.name)
        let key = 'fa/company/logo/' + (new Date().getTime()) + '_' + Global.base64Encode(arr[0]) + '.' + arr[1]
        return _vue.$http.post('/api/v1.0/qiniu/token/img?bucket=moore', {
          type: 1
        }).then(response => {
          _vue.uploadData.token = response.data.data.token
          _vue.uploadData.key = key
        })
      }
    },
    uploadProgress () {
      this.uploading = true
    },
    uploadSuccess (res, file) {
      this.uploading = false
      this.uploadedhHeadImgUrl = file.response.key
    },
    uploadError () {
      this.uploading = false
      this.$message({
        type: 'error',
        message: '文件上传失败，请稍后重试',
        center: true,
        showClose: true
      })
    },
    sendEmailRemind () { // 发送邮件提醒
      this.$http.get('/api/v1.0/fa/userInfo/sendOpenFollow', {params: {userId: this.userInfoModel.id}}).then((res) => {
        this.$message.success('发送成功')
      }).catch(_ => {
        this.$message.error('发送失败')
      })
      // if (new Date().getTime() - this.lastEmailTime > 60000) {
      //   this.lastEmailTime = new Date().getTime()
      //   this.$http.get('/api/v1.0/fa/userInfo/sendOpenFollow', {params: {userId: this.userInfoModel.id}}).then((res) => {
      //     this.$message.success('发送成功')
      //   }).catch(_ => {
      //     this.$message.error('发送失败')
      //   })
      // } else {
      //   this.$message.warning('请勿频繁发送,请稍后再试')
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
  .detail-container {
    .el-dialog__wrapper {
      > :first-child {
        margin-right: 0;
        margin-top: 0;
        height: 100%;
        width:40%;
        .el-form {
          width: 100%;
        }
      }
    }
    .goBack {
      color: #409eff;
      margin-bottom: 20px;
      margin-left: 10px;
      cursor: pointer;
      display: inline-block;
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
        .dialog{
          .el-dialog__wrapper {
            > :first-child {
              margin: 0 auto;
              margin-top: 15vh;
              height: 222px;
              .el-form {
                width: 100%;
              }
            }
          }
        }
        .changeCompany_dialog{
          .el-dialog__wrapper {
            > :first-child {
              margin: 0 auto;
              margin-top: 10vh;
              height: 730px;
            }
          }
          .mechanismNameSearch{
            display: flex;
            justify-content:flex-start;
            align-items: center;
            .inline-input{
              margin: 10px 0;
              margin-right:10px;
              width:220px;
            }
          }
          .table{
            width:100%;
            height:360px;
            margin-top:10px;
            border-top: 1px solid #eee;
            padding-top:10px;
            overflow: auto;
          }
        }
  }
</style>
<style lang="scss" scoped>
  .detail-container {
    .empty-wrap {
      height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      .add-btn-wrap {
        display: flex;
        align-items: center;
        .icon {
          font-size: 25px;
          margin-right: 20px;
        }
        .text {
          font-size: 18px;
        }
      }
    }
    .wrapper {
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .1);
      padding: 10px;
      margin-bottom: 20px;
      min-height: 80px;
      .h-title {
        font-weight: bold;
        font-size: 15px;
        margin-right: 10px;
        .icon {
          float: right;
          font-size: 20px;
          cursor: pointer;
        }
      }
      .cnt-wrap {
        margin-top: 15px;
        .mainItem {
          .noneTitle {
            text-align: left;
            color: #000;
            margin-top: 15px;
          }
          margin-top: 15px;
          padding: 15px 0;
          border-bottom: 1px dashed #ccc;
          &:last-child {
            border-bottom: none;
          }
          .mainItemContent {
            border-bottom: 1px dashed #ccc;
            &:last-child {
              border-bottom: none;
            }
          }
        }
        > .item {
          padding: 8px 0;
          display: flex;
          align-items: center;
          .title {
            color: #999;
            width: 100px;
          }
          .cnt {
            .alias-input-status {
              .input {
                width: 60%;
              }
              .cancel {
                cursor: pointer;
                display: inline-block;
                margin: 0 10px;
              }
              .sure {
                color: #409eff;
                cursor: pointer;
              }
            }
            .alias-text-status {
              .edit-alias-btn {
                padding: 0 5px;
                cursor: pointer;
              }
            }
            .unsign-wrap {
              display: flex;
              align-items: center;
              .text {
                color: #909399;
                margin-right: 15px;
              }
            }
            .sign-wrap {
            }
            &.basic-confirm {
              display: flex;
              align-items: center;
              .text {
                margin-right: 15px;
                &.disabled {
                  color: #909399;
                }
              }
            }
            .close-project-wrap {
              display: flex;
              align-items: center;
              .text {
                margin-right: 15px;
              }
              .close-btn {
              }
            }
          }
        }
      }
    }
    .summary-list {
      &.appointment {
        cursor: pointer;
      }
      &.vertical {
        display: flex;
        .item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          .state {
            font-size: 13px;
            color: #909399;
          }
          .count {
            font-size: 22px;
            color: #303133;
          }
        }
      }
      &.horizontal {
        display: flex;
        .item {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid #909399;
          &:last-child {
            border-right: none;
          }
          .state {
            font-size: 13px;
            color: #909399;
          }
          .count {
            font-size: 15px;
            color: #409EFF;
            text-decoration: underline;
            padding-left: 5px;
            cursor: pointer;
          }
        }
      }
    }
    .appointment-list {
      .appointment-item {
        border-bottom: 1px solid #909399;
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        &:last-child {
          border-bottom: none;
        }
        .info-wrap {
          .top {
            color: #303133;
            display: flex;
            .time {
              margin-right: 10px;
            }
          }
          .bottom {
            display: flex;
            color: #909399;
            .name {
              margin-right: 10px;
            }
          }
        }
        .action-wrap {
        }
      }
    }
    .dialog-form {
      height: 80vh;
      overflow: auto;
      .workExp {
        padding: 12px 0;
        & + button {
          margin-top: 10px;
        }
        .el-form-item + .el-form-item {
          margin-top: 10px;
        }
        .el-date-editor--daterange.el-input__inner {
          width: 100%;
        }
        .el-date-editor.el-input {
          width: 100%;
        }
      }
      .add-item {
        text-align: right;
        margin-bottom: 10px;
      }
    }
    .dialog-footer {
      text-align: center;
    }
  }
  .avatar {
    width: 100px;
  }
</style>
