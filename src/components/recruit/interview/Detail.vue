<template>
  <div>
    <div class="head-wrap">
      <a href="javascript:;" class="text-link" @click="back">&lt;&lt; 返回列表</a>
      <span class="order-no">订单号：{{entryDetail.orderNo}}</span>
    </div>
    <div class="cnt-wrap order-info-wrap">
      <div class="line-title">
        <span>订单信息</span>
        <el-button type="primary" size="small" @click="editOrderInfo" v-if="entryDetail.status !== 4 && entryDetail.status !== 6">编辑</el-button>
      </div>
      <div class="order-info-cnt">
        <el-row :gutter="30">
          <el-col :span="12">
            <span class="title">职位：</span>
            <span class="cnt">
              <a class="text-link" :href="jobLink" target="_blank">{{entryDetail.jobTitle}}</a>
            </span>
          </el-col>
          <el-col :span="12">
            <span class="title">公司：</span>
            <span class="cnt">
              <a class="text-link" :href="companyLink" target="_blank">{{entryDetail.companyShortname}}</a>
            </span>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="12">
            <span class="title">薪资：</span>
            <span class="cnt">{{entryDetail.salaryStartYear}} - {{entryDetail.salaryEndYear}} 万/年</span>
          </el-col>
          <el-col :span="12">
            <span class="title">联系人：</span>
            <span class="cnt">{{entryDetail.contactName}}</span>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="12">
            <span class="title">职级：</span>
            <span class="cnt">{{entryDetail.jobRank | filterCandidateLevel}}</span>
          </el-col>
          <el-col :span="12">
            <span class="title">联系电话：</span>
            <span class="cnt">{{entryDetail.contactMobile}}</span>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="12">
            <span class="title">工作年限：</span>
            <span class="cnt">{{entryDetail.workingYear | filterCandidateWorkingYear}}</span>
          </el-col>
          <el-col :span="12">
            <span class="title">联系邮箱：</span>
            <span class="cnt">{{entryDetail.contactEmail}}</span>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="12">
            <span class="title">工作区域：</span>
            <span class="cnt">{{entryDetail.workArea | filterWorkArea}}</span>
          </el-col>
          <el-col :span="12">
            <span class="title">招聘数量：</span>
            <span class="cnt">{{entryDetail.userCount}}</span>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="12">
            <span class="title">面试单价：</span>
            <span class="cnt">{{entryDetail.price}}</span>
          </el-col>
          <el-col :span="12">
            <span class="title">订单备注：</span>
            <span class="cnt">{{entryDetail.remark}}</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="cnt-wrap candidates-wrap">
      <div class="line-title">
        <span>候选人信息</span>
        <el-button v-if="entryDetail.status >= 3 && entryDetail.status !== 6" type="primary" size="small" @click="recommendCandidate">推荐候选人</el-button>
      </div>
      <div class="table-list-wrap">
        <!-- 搜索条件 -->
        <el-form :inline="true" ref="searchForm" :model="searchForm" class="form-inline" label-width="100px">
          <el-form-item label="候选人姓名" prop="name">
            <el-input v-model="searchForm.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="候选人状态" prop="status">
            <el-select v-model="searchForm.status" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="HR待处理" value="1"></el-option>
              <el-option label="安排面试" value="2"></el-option>
              <el-option label="已面试" value="4"></el-option>
              <el-option label="未到场" value="5"></el-option>
              <el-option label="不合适" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="search('searchForm')">搜索</el-button>
          </el-form-item>
        </el-form>
        <!-- 推荐人数汇总 -->
        <div class="data-summary candidate-summary">
          <div class="item count-info">
            <span class="title">推荐总人数：</span>
            <span class="count">{{candidateCount.total}}</span>
          </div>
          <div class="item count-info">
            <span class="title">邀请面试人数：</span>
            <span class="count">{{candidateCount.entry}}</span>
          </div>
          <div class="item count-info">
            <span class="title">已面试人数：</span>
            <span class="count">{{candidateCount.interview}}</span>
          </div>
        </div>
        <el-table
          :data="candidateData"
          header-row-class-name="tableheader"
          border
          style="width: 100%;">
          <el-table-column
            type="index"
            width="50"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="候选人"
            width="160"
            align="center">
            <!--<template slot-scope="scope">
              <span>{{scope.row.name}}<span class="right-icon" v-if="scope.row.queryCt === 0">未查看</span></span>
            </template>-->
          </el-table-column>
          <el-table-column
            label="简历"
            width="120"
            align="center">
            <template slot-scope="scope">
              <a :href="scope.row.uploadedResume" target="_blank" class="text-link">查看简历</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="手机"
            width="200"
            align="center">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            width="220"
            align="center">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="推荐时间"
            width="200"
            align="center">
          </el-table-column>
          <el-table-column
            label="候选人状态"
            width="120"
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.recommendStatus | filterCandidateStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="跟踪管理"
            min-width="200"
            align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.recommendStatus === 2" type="primary" size="small" @click="recommendAction(scope.row, 'interviewInfo')">面试信息</el-button>
              <el-button v-if="scope.row.recommendStatus === 2 && entryDetail.status !== 4 && entryDetail.status !== 6" type="primary" size="small" @click="recommendAction(scope.row)">面试状态</el-button>
              <el-button v-if="scope.row.recommendStatus === 5" type="primary" size="small" @click="recommendAction(scope.row)">面试信息</el-button>
              <el-button v-if="scope.row.recommendStatus === 4" type="primary" size="small" @click="offerAction(scope.row)">offer录入(选)</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="interviewTime"
            label="面试时间"
            width="200"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.recommendStatus === 2" class="edit-interview-time" @click="editTime(scope.row)">{{scope.row.interviewTime}}</span>
              <span v-if="scope.row.recommendStatus !== 2">{{scope.row.interviewTime}}</span>
              <span v-if="scope.row.isEditInterviewTime === 1" class="upload-tip">已修改</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="300px"
            fixed="right"
            align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="viewActionRecord(scope.row)">操作记录</el-button>
              <el-button type="primary" size="small" @click="addRecommendRemark(scope.row)">添加备注</el-button>
              <el-button type="primary" size="small" @click="viewRecommendRemark(scope.row)">查看备注</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="cnt-wrap consume-wrap">
      <div class="line-title">
        <span>消费详情</span>
      </div>
      <div class="data-summary price-summary">
        <div class="item price-info">
          <span class="title">订单总价：</span>
          <span class="price">{{priceSummary.total}}元</span>
        </div>
        <div class="item price-info">
          <span class="title">冻结金额：</span>
          <span class="price">{{priceSummary.frozen}}元</span>
        </div>
      </div>
      <el-table
        :data="priceData"
        header-row-class-name="tableheader"
        border
        style="width: 800px;">
        <el-table-column
          type="index"
          width="50"
          align="center">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="交易时间"
          width="220"
          align="center">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="交易说明"
          min-width="300"
          align="center">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="金额（元）"
          width="220"
          align="center">
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑订单信息 -->
    <el-dialog title="编辑订单" :visible.sync="editOrderInfoDialog" width="35%" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="orderInfoForm" ref="orderInfoForm">
        <el-form-item label="年薪" labelWidth="120px">
          <el-input type="text" v-model="orderInfoForm.salaryStartYear" disabled style="width: 120px;"></el-input>
          <span> - </span>
          <el-input type="text" v-model="orderInfoForm.salaryEndYear" disabled style="width: 120px;"></el-input>
          <span>万</span>
        </el-form-item>
        <el-form-item label="选择职级" labelWidth="120px">
          <el-select v-model="orderInfoForm.jobRank" disabled clearable>
            <el-option label="选择职级" value=""></el-option>
            <el-option
              v-for="item in levelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作年限" labelWidth="120px">
          <el-select v-model="orderInfoForm.workingYear" clearable disabled>
            <el-option label="选择工作年限" value=""></el-option>
            <el-option
              v-for="item in workingYearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作区域" labelWidth="120px">
          <el-select v-model="orderInfoForm.workArea" clearable disabled>
            <el-option label="选择工作区域" value=""></el-option>
            <el-option
              v-for="item in workAreaOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="面试单价(元)" labelWidth="120px">
          <el-input type="text" v-model="orderInfoForm.price" disabled></el-input>
        </el-form-item>
        <el-form-item label="计划招聘数量(人)" labelWidth="120px">
          <el-input type="text" v-model="orderInfoForm.userCount"></el-input>
        </el-form-item>
        <el-form-item label="联系人" labelWidth="120px">
          <el-input type="text" v-model="orderInfoForm.contactName"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" labelWidth="120px">
          <el-input type="text" v-model="orderInfoForm.contactMobile"></el-input>
        </el-form-item>
        <el-form-item label="联系邮箱" labelWidth="120px">
          <el-input type="text" v-model="orderInfoForm.contactEmail"></el-input>
        </el-form-item>
        <el-form-item label="订单备注" labelWidth="120px">
          <el-input type="textarea" v-model="orderInfoForm.remark" :autosize="{ minRows: 3}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer center">
        <el-button type="plan" @click="cancelEditOrderInfo">取 消</el-button>
        <el-button type="primary" @click="sureEditOrderInfo">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 推荐候选人弹窗 -->
    <el-dialog title="推荐候选人" :visible.sync="candidateInfoDialog" width="35%" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="candidateInfoForm" ref="candidateInfoForm" :rules="rules">
        <el-form-item label="附件简历：" labelWidth="100px" prop="uploadedResume">
          <el-upload
            class="file-uploader"
            :multiple="false"
            action="http://upload.qiniup.com/"
            :show-file-list="false"
            :on-success="handleFileSuccess"
            :on-error="handleFileError"
            :on-progress="handleFileProgress"
            :data="uploadData"
            :before-upload="beforeFileUpload">
            <el-button size="small" type="primary">点击上传</el-button>
            <span v-if="fileUploading">文件上传中...</span>
          </el-upload>
          <a :href="candidateInfoForm.uploadedResume" class="text-link">{{candidateInfoForm.fileName}}</a>
          <div class="upload-tip">注意：上传附件简历时，请屏蔽候选人的电话和邮箱等联系方式！</div>
        </el-form-item>
        <el-form-item label="姓名" labelWidth="100px" prop="name">
          <el-input type="text" v-model="candidateInfoForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" labelWidth="100px" prop="sex">
          <el-radio-group v-model="candidateInfoForm.sex">
            <el-radio :label="2">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" labelWidth="100px" prop="mobile">
          <el-input type="text" v-model="candidateInfoForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" labelWidth="100px" prop="email">
          <el-input type="text" v-model="candidateInfoForm.email"></el-input>
        </el-form-item>
        <el-form-item label="最高学历" labelWidth="100px" prop="education">
          <el-select v-model="candidateInfoForm.education" placeholder="请选择">
            <el-option
              v-for="item in educationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作经验" labelWidth="100px" prop="workingYear">
          <el-select v-model="candidateInfoForm.workingYear" placeholder="请选择">
            <el-option
              v-for="item in standardWyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市" labelWidth="100px" prop="zipcode">
          <el-select v-model="provinceCode" filterable clearable placeholder="省份" @change="changeProvince" v-if="false">
            <el-option
              v-for="item in provinceOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="candidateInfoForm.zipcode" filterable clearable placeholder="城市">
            <el-option
              v-for="item in cityOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="当前公司" labelWidth="100px" prop="currentCompanyName">
          <el-input type="text" v-model="candidateInfoForm.currentCompanyName"></el-input>
        </el-form-item>
        <el-form-item label="当前职位" labelWidth="100px" prop="currentJobTitle">
          <el-input type="text" v-model="candidateInfoForm.currentJobTitle"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer center">
        <el-button type="plan" @click="cancelCandidateInfo">取 消</el-button>
        <el-button type="primary" @click="sureCandidateInfo('candidateInfoForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 候选人操作记录 -->
    <el-dialog title="候选人操作记录" :visible.sync="candidateRecordDialog">
      <el-table
        :data="candidateRecordData"
        header-row-class-name="tableheader"
        border
        style="width: 100%;">
        <el-table-column
          type="index"
          width="50px"
          align="center">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="时间"
          width="220px"
          align="center">
        </el-table-column>
        <el-table-column
          label="内容"
          min-width="300px"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.recommendStatus | filterCandidateStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作人"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.adminName || 'HR'}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 设置面试状态 -->
    <el-dialog title="设置面试状态" :visible.sync="setInterviewStatusDialog" width="30%">
      <span>请选择状态：</span>
      <el-radio-group v-model="interviewStatus">
        <el-radio :label="4">已面试</el-radio>
        <el-radio :label="5">未到场</el-radio>
      </el-radio-group>
      <div slot="footer" class="dialog-footer center">
        <el-button type="primary" @click="sureSetInterviewStatus" :disabled="loading">{{loading ? '提交中...' : '确 定'}}</el-button>
      </div>
    </el-dialog>

    <!-- 面试信息 -->
    <el-dialog title="面试信息" :visible.sync="interviewInfoDialog" width="35%">
      <el-form>
        <el-form-item label="面试时间：" label-width="120px">
          <span>{{candidateDetailInfo.interviewTime}}</span>
        </el-form-item>
        <el-form-item label="面试方式：" label-width="120px">
          <span v-if="candidateDetailInfo.interviewWay === 0">现场面试</span>
          <span v-if="candidateDetailInfo.interviewWay === 1">电话面试</span>
        </el-form-item>
        <el-form-item label="面试地点：" label-width="120px" v-if="candidateDetailInfo.interviewWay === 0">
          <span>{{candidateDetailInfo.interviewPlace}}</span>
        </el-form-item>
        <el-form-item label="联系人：" label-width="120px">
          <span>{{candidateDetailInfo.interviewContactName}}</span>
        </el-form-item>
        <el-form-item label="联系电话：" label-width="120px">
          <span>{{candidateDetailInfo.interviewContactMobile}}</span>
        </el-form-item>
        <el-form-item label="补充内容：" label-width="120px">
          <span>{{candidateDetailInfo.interviewExtInfo}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer center">
        <el-button type="plan" v-if="entryDetail.status !== 4 && entryDetail.status !== 6" @click="sendInterviewInfo">{{emailSending ? '正在发送...' : '发送通知'}}</el-button>
        <el-button type="primary" @click="sureInterviewInfo">确 认</el-button>
      </div>
    </el-dialog>

    <!-- 余额不足提醒 -->
    <el-dialog title="提醒" :visible.sync="noMoneyTipDialog" width="35%">
      <div style="color: #ff4949;font-size: 16px;text-align: center">账户余额不足，请提醒公司HR及时充值</div>
      <div slot="footer" class="dialog-footer center">
        <el-button type="primary" @click="noMoneyTipDialog = false">知道了</el-button>
      </div>
    </el-dialog>

    <!-- 添加候选人备注信息 -->
    <el-dialog title="添加备注" :visible.sync="setRecommendRemarkDialog" width="30%">
      <el-input type="textarea" v-model="recommendRemark" :autosize="{ minRows: 3}"></el-input>
      <div slot="footer" class="dialog-footer center">
        <el-button type="primary" @click="sureSetRecommendRemark">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 查看候选人备注信息 -->
    <el-dialog title="查看备注" :visible.sync="viewRecommendRemarkDialog" width="30%">
      <div>{{recommendRemark || '无'}}</div>
      <div slot="footer" class="dialog-footer center">
        <el-button type="primary" @click="viewRecommendRemarkDialog = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改面试时间 -->
    <el-dialog title="修改面试时间" :visible.sync="editInterviewTimeDialog" width="30%">
      <span>请选择面试时间：</span>
      <el-date-picker
        :picker-options="pickerOptions2"
        v-model="newTime"
        type="datetime"
        placeholder="选择日期时间">
      </el-date-picker>
      <el-button @click="editInterviewTimeSure">确认修改</el-button>
    </el-dialog>

    <!--上传offer-->
    <el-dialog title="offer录入" :visible.sync="offerEnteringDialog" width="30%">
      <el-form :model="offerForm" ref="offerForm" :rules="rules">
        <el-form-item label="offer年薪" labelWidth="100px" prop="offerSalary">
          <el-input type="text" v-model="offerForm.offerSalary"></el-input>
        </el-form-item>
        <el-form-item label="附件简历：" labelWidth="100px" prop="uploadedResume">
          <el-upload
            class="file-uploader"
            :multiple="false"
            action="http://upload.qiniup.com/"
            :show-file-list="false"
            :on-success="handleFileSuccess"
            :on-error="handleFileError"
            :on-progress="handleFileProgress"
            :data="uploadData"
            :before-upload="beforeFileUploadOffer">
            <el-button size="small" type="primary">点击上传</el-button>
            <span v-if="fileUploading">文件上传中...</span>
          </el-upload>
          <a :href="offerForm.uploadedResume" class="text-link">{{offerForm.fileName}}</a>
        </el-form-item>
        <el-button type="primary" @click="offerSure('offerForm')" class="edit_offer">确 定</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Global from 'assets/js/global'
import City from 'assets/js/city'
import _ from 'underscore'

export default {
  data () {
    return {
      entryId: this.$route.params.id,
      entryDetail: {},
      searchForm: {
        name: '',
        status: ''
      },
      candidateData: [], // 候选人信息列表
      candidateCount: { // 候选人推荐数量summary
        entry: 0,
        interview: 0,
        total: 0
      },
      orderRecordData: [], // 操作订单记录
      candidateRecordData: [], // 操作候选人记录
      priceData: [], // 消费详情
      priceSummary: { // 消费summary
        frozen: 0,
        total: 0
      },
      levelOptions: Global.CONSTANT.CANDIDATE_LEVEL, // 候选人级别
      wy1Options: Global.CONSTANT.CANDIDATE_LEVEL1_WY, // 工程师 - 工作年限
      wy2Options: Global.CONSTANT.CANDIDATE_LEVEL2_WY, // 经理 - 工作年限
      workAreaOptions: Global.CONSTANT.WORK_AREA, // 工作区域
      educationOptions: Global.CONSTANT.EDUCATION, // 教育经历
      standardWyOptions: Global.CONSTANT.WORKING_YEAR, // 工作经验
      orderInfoForm: {}, // 订单信息
      interviewStatus: '', // 面试状态
      candidateInfoForm: {}, // 推荐候选人信息
      entryPriceInfo: {
        balance: 0 // 余额
      }, // 已入职状态 金额展示
      editOrderInfoDialog: false,
      candidateInfoDialog: false,
      setInterviewStatusDialog: false,
      interviewInfoDialog: false,
      candidateRecordDialog: false,
      noMoneyTipDialog: false,
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { max: 30, message: '名字长度不能超过30个字符', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur,change' }
        ],
        mobile: [
          { required: true, message: '请填写手机号', trigger: 'blur' },
          { pattern: Global.REGEX.MOBILE, message: '手机号格式不正确', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请填写邮箱地址', trigger: 'blur' },
          { pattern: Global.REGEX.EMAIL, message: '邮箱格式不正确', trigger: 'blur' }
        ],
        education: [
          { required: true, message: '请选择学历', trigger: 'change' }
        ],
        workingYear: [
          { required: true, message: '请选择工作经验', trigger: 'change' }
        ],
        zipcode: [
          { required: true, message: '请选择城市', trigger: 'blur,change' }
        ],
        currentCompanyName: [
          { required: true, message: '请输入公司', trigger: 'blur' },
          { max: 255, message: '不能超过255个字符', trigger: 'blur' }
        ],
        currentJobTitle: [
          { required: true, message: '请输入职位', trigger: 'blur' },
          { max: 255, message: '不能超过255个字符', trigger: 'blur' }
        ],
        uploadedResume: [
          { required: true, message: '请上传简历附件', trigger: 'blur, change' }
        ],
        offerSalary: [
          { required: true, message: '请输入年薪', trigger: 'blur' },
          { pattern: Global.REGEX.NUMGTZERO, message: '年薪只能输入数字', trigger: 'blur' }
        ]
      },
      uploadData: {
        token: '',
        key: ''
      },
      provinceCode: '',
      currentCandidateInfo: {}, // 正在操作的候选人
      candidateDetailInfo: {}, // 候选人详细信息
      adminInfo: {}, // 当前用户adminInfo, 判断是否是主管会用到
      fileUploading: false,
      emailSending: false,
      recommendRemark: '',
      viewRecommendRemarkDialog: false,
      setRecommendRemarkDialog: false,
      loading: false, // 正在操作标识
      editInterviewTimeDialog: false,
      newTime: '',
      editId: '',
      pickerOptions2: {
        disabledDate (time) {
          // 选择今天包含以后的时间
          let now = new Date()
          return time.getTime() < now.getTime()
        }
      },
      offerEnteringDialog: false,
      offerForm: {}
    }
  },
  computed: {
    jobLink () {
      let link = ''
      if (Global.CONFIG.SERVER_URL !== 'http://adminp.mooreelite.com') {
        link = 'http://pc.dev.moore.ren/job/detail.htm?jobId=' + this.entryDetail.jobId
      } else {
        link = 'http://www.moore.ren/job/detail.htm?jobId=' + this.entryDetail.jobId
      }
      return link
    },
    companyLink () {
      let link = ''
      if (Global.CONFIG.SERVER_URL !== 'http://adminp.mooreelite.com') {
        link = 'http://pc.dev.moore.ren/company/detail.htm?companyId=' + this.entryDetail.companyId
      } else {
        link = 'http://www.moore.ren/company/detail.htm?companyId=' + this.entryDetail.companyId
      }
      return link
    },
    workingYearOptions () {
      // 根据候选人职级，显示不同的工作年限，编辑订单信息时用
      return this.orderInfoForm.jobRank === 2 ? Global.CONSTANT.CANDIDATE_LEVEL1_WY : Global.CONSTANT.CANDIDATE_LEVEL2_WY
    },
    provinceOptions () {
      return _.where(City.data, { parentId: '0' })
    },
    cityOptions () {
      if (this.provinceCode !== '') {
        return _.filter(City.data, (item) => {
          return item.parentId === this.provinceCode
        })
      } else {
        return _.filter(City.data, (item) => {
          return item.parentId !== '0' && item.parentId !== '001'
        })
      }
    }
  },
  created () {
    this.fetchEntryDetail()
    this.fetchCandidate()
    this.fetchPriceDetail()
    this.fetchAdminInfo()
  },
  methods: {
    fetchEntryDetail () {
      let _vue = this
      _vue.$http.get('/api/v1.0/ensure/fast?id=' + _vue.entryId).then(function (response) {
        _vue.entryDetail = response.data.data.entry
      })
    },
    fetchCandidate () {
      // 查询推荐候选人
      let _vue = this
      _vue.$http.get('/api/v1.0/ensure/fast/recommends?ensure_id=' + _vue.entryId +
        '&name=' + _vue.searchForm.name +
        '&status=' + _vue.searchForm.status).then(function (response) {
        _vue.candidateData = response.data.data.recommends
        console.log(response.data.data.recommends)
        _vue.candidateCount = {
          total: response.data.data.total,
          entry: response.data.data.entry,
          interview: response.data.data.interview
        }
      })
    },
    fetchRecommendInfo (recommendId) {
      // 获取候选人推荐信息，包括面试信息
      let _vue = this
      _vue.$http.get('/api/v1.0/ensure/fast/recommend?recommend_id=' + recommendId).then((response) => {
        _vue.candidateDetailInfo = response.data.data.recommend
      })
    },
    fetchPriceTotal () {
      // 获取账户余额
      let _vue = this
      _vue.$http.get('/api/v1.0/ensure/account/balance?recommend_id=' + _vue.currentCandidateInfo.id).then((response) => {
        _vue.entryPriceInfo.balance = response.data.data.amount
      }).catch(() => {
        // 出错表示账户余额不足，给出提示：余额不足，请提醒HR及时充值
        _vue.noMoneyTipDialog = true
      })
    },
    fetchPriceDetail () {
      // 获取价格详情
      let _vue = this
      _vue.$http.get('/api/v1.0/ensure/fast/cost?ensure_id=' + _vue.entryId).then((response) => {
        _vue.priceData = response.data.data.costDetail.costs
        _vue.priceSummary = {
          frozen: response.data.data.costDetail.frozen,
          total: response.data.data.costDetail.total
        }
      })
    },
    fetchAdminInfo () {
      // 获取当前用户的adminInfo
      let _vue = this
      _vue.$http.get('/api/v1.0/ensure/manager').then((response) => {
        _vue.adminInfo = response.data.data.infoManger
      })
    },
    search () {
      this.fetchCandidate()
    },
    editOrderInfo () {
      // 编辑订单信息  信息回显
      this.orderInfoForm = {
        salaryStartYear: this.entryDetail.salaryStartYear,
        salaryEndYear: this.entryDetail.salaryEndYear,
        workingYear: this.entryDetail.workingYear,
        jobRank: this.entryDetail.jobRank,
        workArea: this.entryDetail.workArea,
        userCount: this.entryDetail.userCount,
        contactName: this.entryDetail.contactName,
        contactMobile: this.entryDetail.contactMobile,
        contactEmail: this.entryDetail.contactEmail,
        remark: this.entryDetail.remark,
        id: this.entryDetail.ensureId,
        price: this.entryDetail.price
      }
      this.editOrderInfoDialog = true
    },
    back () {
      window.history.go(-1)
    },
    recommendCandidate () {
      // 推荐候选人
      this.candidateInfoForm = {
        fileName: '',
        uploadedResume: '',
        name: '',
        sex: '',
        mobile: '',
        email: '',
        education: '',
        workingYear: '',
        currentCompanyName: '',
        currentJobTitle: '',
        zipcode: ''
      }
      this.candidateInfoDialog = true
    },
    cancelCandidateInfo () {
      this.candidateInfoDialog = false
    },
    sureCandidateInfo (formName) {
      // 提交推荐候选人信息
      let _vue = this
      let postData = _vue.candidateInfoForm
      postData.ensureId = _vue.entryId
      _vue.$refs[formName].validate((valid) => {
        if (valid) {
          _vue.$http.post('/api/v1.0/ensure/fast/recommend', postData).then(() => {
            _vue.$message({
              type: 'success',
              message: '推荐成功',
              center: true
            })
            _vue.candidateInfoDialog = false
            _vue.fetchCandidate()
          }).catch((err) => {
            if (err.error.errors) {
              if (err.error.errors[0].field === 'zipcode') {
                _vue.$message({
                  type: 'error',
                  message: '未找到对应城市zipcode, 请联系后台管理员',
                  center: true
                })
              }
            } else {
              _vue.$message({
                type: 'error',
                message: '请稍后重试',
                center: true
              })
            }
          })
        }
      })
    },
    recommendAction (row, status) {
      // 跟踪管理，根据推荐状态，显示不同操作弹窗
      console.log(row.recommendStatus + '||' + status)
      this.currentCandidateInfo = row
      if (row.recommendStatus === 2) {
        if (status === 'interviewInfo') {
          // 面试信息
          this.interviewInfoDialog = true
          // 查询候选人详细信息
          this.fetchRecommendInfo(row.id)
        } else {
          // 设置面试状态
          this.setInterviewStatusDialog = true
        }
      } else if (row.recommendStatus === 5) {
        // 面试信息
        this.currentCandidateInfo = row
        this.candidateDetailInfo = row
        this.interviewInfoDialog = true
      }
    },
    sureSetInterviewStatus () {
      // 设置面试状态
      let _vue = this
      if (_vue.loading) {
        return false
      } else {
        _vue.loading = true
        _vue.$http.post('/api/v1.0/ensure/entry/fast/recommend/interview', {
          recommendId: _vue.currentCandidateInfo.id,
          recommendStatus: _vue.interviewStatus
        }).then(() => {
          _vue.$message({
            type: 'success',
            message: '面试状态设置成功',
            center: true
          })
          _vue.setInterviewStatusDialog = false
          _vue.fetchCandidate()
          _vue.loading = false
        }).catch(() => {
          _vue.$message({
            type: 'error',
            message: '请稍后重试',
            center: true
          })
          _vue.loading = false
        })
      }
    },
    sendInterviewInfo () {
      // 发送面试通知
      let _vue = this
      if (_vue.emailSending) {
        return false
      } else {
        _vue.emailSending = true
        _vue.$http.post('/api/v1.0/ensure/entry/recommend/interview/send', {
          recommendId: _vue.currentCandidateInfo.id
        }).then(() => {
          _vue.emailSending = false
          _vue.interviewInfoDialog = false
        }).catch(() => {
          _vue.emailSending = false
          _vue.$message({
            type: 'error',
            message: '请稍后重试',
            center: true
          })
        })
      }
    },
    sureInterviewInfo () {
      // 确认面试信息
      this.interviewInfoDialog = false
    },
    cancelEditOrderInfo () {
      this.editOrderInfoDialog = false
    },
    sureEditOrderInfo () {
      // TODO: 提交编辑订单信息, 表单验证
      let _vue = this
      _vue.$http.put('/api/v1.0/ensure/fast', _vue.orderInfoForm).then(() => {
        _vue.$message({
          type: 'success',
          message: '订单信息编辑成功',
          center: true
        })
        _vue.editOrderInfoDialog = false
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    beforeFileUpload (file) {
      // 简历上传
      let _vue = this
      if (file.size / 1024 / 1024 >= 10) {
        _vue.$message({
          type: 'error',
          message: '文件大小需小于10M',
          center: true
        })
        return false
      } else if (file.type.indexOf('word') === -1 && file.type.indexOf('pdf') === -1) {
        _vue.$message({
          type: 'error',
          message: '文件格式不正确',
          center: true
        })
        return false
      } else {
        // TODO 文件名中带有空格还未处理
        let key = 'cloud/file/resume/' + (new Date().getTime()) + '_' + file.name
        return _vue.$http.get('/api/v1.0/qiniu/token/file').then(response => {
          _vue.uploadData.token = response.data.data.token
          _vue.uploadData.key = key
        })
      }
    },
    beforeFileUploadOffer (file) {
      // 简历上传
      let _vue = this
      if (file.size / 1024 / 1024 >= 10) {
        _vue.$message({
          type: 'error',
          message: '文件大小需小于10M',
          center: true
        })
        return false
      } else if (file.type.indexOf('word') === -1 && file.type.indexOf('pdf') === -1) {
        _vue.$message({
          type: 'error',
          message: '文件格式不正确',
          center: true
        })
        return false
      } else {
        // TODO 文件名中带有空格还未处理
        let key = 'cloud/file/offer/' + (new Date().getTime()) + '_' + file.name
        return _vue.$http.get('/api/v1.0/qiniu/token/file').then(response => {
          _vue.uploadData.token = response.data.data.token
          _vue.uploadData.key = key
        })
      }
    },
    handleFileError () {
      // 简历上传失败
      let _vue = this
      _vue.$message({
        type: 'error',
        message: '请稍后重试',
        center: true
      })
      this.fileUploading = false
    },
    handleFileProgress () {
      this.fileUploading = true
    },
    handleFileSuccess (res, file) {
      // 简历上传成功
      console.log('上传成功')
      console.log(file)
      console.log(res)
      this.fileUploading = false
      this.candidateInfoForm.fileName = file.name
      this.candidateInfoForm.uploadedResume = res.key
      this.offerForm.fileName = file.name
      this.offerForm.uploadedResume = res.key
    },
    changeProvince () {
      this.candidateInfoForm.zipcode = ''
    },
    viewActionRecord (row) {
      // 查看操作记录
      let _vue = this
      _vue.candidateRecordDialog = true
      _vue.$http.get('/api/v1.0/ensure/fast/recommend/opts?recommend_id=' + row.id).then((response) => {
        _vue.candidateRecordData = response.data.data.opts
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    addRecommendRemark (row) {
      // 添加备注, 回显原有备注信息
      let _vue = this
      _vue.currentCandidateInfo = row
      _vue.$http.get('/api/v1.0/ensure/entry/recommend/remark?recommend_id=' + row.id).then((response) => {
        _vue.recommendRemark = response.data.data.remark
        _vue.setRecommendRemarkDialog = true
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    viewRecommendRemark (row) {
      // 查看备注
      let _vue = this
      _vue.$http.get('/api/v1.0/ensure/entry/recommend/remark?recommend_id=' + row.id).then((response) => {
        _vue.viewRecommendRemarkDialog = true
        _vue.recommendRemark = response.data.data.remark
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    sureSetRecommendRemark () {
      // 提交备注信息
      let _vue = this
      _vue.$http.post('/api/v1.0/ensure/entry/recommend/remark', {
        recommendId: _vue.currentCandidateInfo.id,
        remark: _vue.recommendRemark
      }).then(() => {
        _vue.$message({
          type: 'success',
          message: '添加备注成功',
          center: true
        })
        _vue.setRecommendRemarkDialog = false
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    editTime (row) {
      let _vue = this
      _vue.editInterviewTimeDialog = true
      _vue.editId = row.id
    },
    editInterviewTimeSure () {
      let _vue = this
      _vue.$http.put('/api/v1.0/ensure/fast/recommend/edit_interview_time', {
        id: _vue.editId,
        time: _vue.newTime.getTime()
      }).then(() => {
        _vue.$message({
          type: 'success',
          message: '修改面试时间成功',
          center: true
        })
        _vue.newTime = ''
        _vue.editId = ''
        _vue.editInterviewTimeDialog = false
        _vue.fetchCandidate()
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
        _vue.newTime = ''
        _vue.editId = ''
      })
    },
    offerAction (row) {
      let _vue = this
      _vue.editId = row.id
      _vue.$http.get('/api/v1.0/ensure/entry/offer/info?recommendId=' + row.id)
        .then((response) => {
          _vue.offerForm.offerSalary = response.data.data.offer_salary
          if (response.data.data.offer_address != null) {
            _vue.offerForm.fileName = response.data.data.name
          }
          _vue.offerForm.uploadedResume = response.data.data.offer_address
          _vue.offerEnteringDialog = true
        })
    },
    offerSure (formName) {
      let _vue = this
      _vue.$refs[formName].validate((valid) => {
        if (valid) {
          _vue.$http.put('/api/v1.0/ensure/entry/offer/edit', {
            recommend_id: _vue.editId,
            offer_address: _vue.offerForm.uploadedResume,
            offer_salary: _vue.offerForm.offerSalary
          }).then(() => {
            _vue.$message({
              type: 'success',
              message: 'offer相关信息修改成功',
              center: true
            })
            _vue.offerForm = {}
            _vue.editId = ''
            _vue.offerEnteringDialog = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~assets/css/variable";
  .order-no {
    font-size: 16px;
    color: #333;
    font-weight: bold;
    margin-left: 50px;
  }
  .cnt-wrap {
    padding-bottom: 30px;
    border-bottom: 1px solid $border-color;

    &.consume-wrap {
      border-bottom: none;
    }
  }
  .line-title {
    border-left: 3px solid $primary-color;
    padding-left: 10px;
    margin-bottom: 30px;
    margin-top: 30px;

    span {
      font-size: 16px;
      height: 20px;
      display: inline-block;
      vertical-align: middle;
      color: $primary-color;
    }
    button {
      margin-left: 100px;
      vertical-align: middle;
    }
  }
  .order-info-cnt {
    margin-top: 40px;
    max-width: 1200px;
    padding-left: 20px;
    .el-row {
      margin-bottom: 15px;
      .el-col {
        span {
          display: inline-block;
          &.title {
            height: 20px;
            line-height: 20px;
          }
          &.cnt {
            max-width: 90%;
            vertical-align: top;
          }
        }
      }
    }
  }
  .data-summary {
    margin-bottom: 30px;
    padding-left: 16px;

    .item {
      display: inline-block;
      margin-right: 30px;

      &.count-info {
        .count {
          color: $primary-color;
        }
      }
      &.price-info {
        .price {
          color: $bright-color;
        }
      }
    }
  }
  .upload-tip {
    font-size: 13px;
    color: $bright-color;
  }
  .right-icon{
    width: 100px;
    position: absolute;
    font-size: 0.1em;
    color: $bright-color;
    top:-2px;
    right: -15px;
    font-weight:bold;
  }
  .edit-interview-time{
    color: $primary-color;
    cursor: pointer;
  }
  .edit_offer{
    margin-left: 40%;
  }
</style>
