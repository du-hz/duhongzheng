<template>
  <div class="detail-container">
    <div class="breadcrumb-wrap">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/fa/project' }">项目管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/fa/project?status=0'}" v-if="project.status === 0">{{ project.status | projectStatusFilter }}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/fa/project?status=3'}" v-if="project.status === 3">{{ project.status | projectStatusFilter }}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/fa/project?status=4'}" v-if="project.status === 4">{{ project.status | projectStatusFilter }}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/fa/project?status=1'}" v-if="project.status === 1">{{ project.status | projectStatusFilter }}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/fa/project?status=2'}" v-if="project.status === 2">{{ project.status | projectStatusFilter }}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/fa/project?status=5'}" v-if="project.status === 5">{{ project.status | projectStatusFilter }}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/fa/project?status=6'}" v-if="project.status === 6">{{ project.status | projectStatusFilter }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ project.alias || project.projectNumber }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row :gutter="20">
      <el-col class="left-container" :span="12" >
        <!-- 基本信息&用户信息 -->
        <el-row class="top-block" :gutter="20" type="flex">
          <el-col :span="12">
            <div class="wrapper basic-block"  style="height:calc(100% - 60px)">
              <div class="h-title">基本信息</div>
              <div class="cnt-wrap">
                <div class="item">
                  <div class="title">项目ID</div>
                  <div class="cnt">{{ project.projectNumber }}</div>
                </div>
                <div class="item">
                  <div class="title">项目代号</div>
                  <div class="cnt">
                    <!-- <div class="alias-input-status" v-if="editAlias">
                      <el-input
                        v-if="editAlias"
                        class="input"
                        placeholder="请输入"
                        v-model="projectForm.project.alias"
                        clearable>
                      </el-input>
                      <span @click="cancelEditAlias" class="cancel">取消</span>
                      <span @click="sureEditAlias" class="sure">确定</span>
                    </div> -->
                    <div class="alias-text-status" v-if="!editAlias">
                      <span class="text">{{project.alias || '待完善'}}</span>
                      <!-- <i @click="clickEditAliasBtn" class="edit-alias-btn el-icon-edit"></i> -->
                    </div>
                  </div>
                </div>
                <div class="item">
                  <div class="title">FA协议</div>
                  <div class="cnt">
                    <div v-if="project.isAgreement === 0" class="unsign-wrap">
                      <div class="text">未签</div>
                      <el-button @click="signAgreement" type="primary" size="mini">已签</el-button>
                    </div>
                    <div v-if="project.isAgreement !== 0" class="sign-wrap">
                      <div class="text">已签</div>
                    </div>
                  </div>
                </div>
                <div class="item">
                  <div class="title">NDA</div>
                  <div class="cnt">
                    <div v-if="project.isNda === 0" class="unsign-wrap">
                      <div class="text">未签</div>
                      <el-button @click="signNda" type="primary" size="mini">已签</el-button>
                    </div>
                    <div v-if="project.isNda !== 0" class="sign-wrap">
                      <div class="text">已签</div>
                    </div>
                  </div>
                </div>
                <div class="item" v-if="project.userInfoModel && (project.userInfoModel.stage === 2 || project.userInfoModel.isUpdate === 2)">
                  <div class="cnt basic-confirm">
                    <div class="text disabled">信息暂未确认</div>
                    <el-button @click="sendConfirmMsg" type="danger" size="mini">发送确认提醒</el-button>
                  </div>
                </div>
                <div class="item">
                  <div class="title">当前状态</div>
                  <div class="cnt">
                    <div class="close-project-wrap">
                      <div class="text">{{ project.status | projectStatusFilter }}</div>
                      <el-button v-if="project.status !== 1" @click="closeProject" class="close-btn" size="mini">关闭项目</el-button>
                      <el-button v-if="project.status == 1" @click="copyProject" class="close-btn" size="small" type='primary'>复制项目</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="wrapper user-block" style="height:calc(100% - 60px)">
              <div class="h-title">注册用户信息
                <i @click="editUser" class="icon el-icon-edit"></i>
              </div>
              <div class="cnt-wrap">
                <div class="item">
                  <div class="title">姓名</div>
                  <div class="cnt">{{ project.userInfoModel.name }}</div>
                </div>
                <div class="item">
                  <div class="title">手机号</div>
                  <div class="cnt">{{ project.userInfoModel.mobile }}
                    <el-tag type="danger" v-if="project.userInfoModel.isMobileValidate === 1" size="small" style="margin-left: 10px;">手机号待验证</el-tag>
                  </div>
                </div>
                <div class="item">
                  <div class="title">邮箱</div>
                  <div class="cnt">{{ project.userInfoModel.email }}</div>
                </div>
                <div class="item">
                  <div class="title">注册时间</div>
                  <div class="cnt">{{ project.createTime }}</div>
                </div>
                <div class="item">
                  <div class="title">关注公众号</div>
                  <div class="cnt">
                    <span>{{ project.userInfoModel.isAttention === 1 ? '已关注' : '未关注' }}</span>
                    <el-button v-if="project.userInfoModel.isAttention !== 1" @click="sendFocusEmail" type="primary" size="mini">引导关注</el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <!-- 编辑公司信息 -->
        <div v-if="company.id" class="wrapper company-block">
          <div class="h-title">公司信息
            <span>
              <span v-if="isTianyancha" style="color:#999;font-size:13px;margin-left:10px;">已同步天眼查</span>
              <span v-if="!isTianyancha" style="color:#e6a23c;font-size:13px;margin-left:10px;">未同步天眼查</span>
            </span>
            <i @click="editCompany" class="icon el-icon-edit"></i>
          </div>
          <div class="cnt-wrap">
            <div class="item">
              <div class="title">公司名称</div>
              <div class="cnt">{{ company.companyName }}</div>
            </div>
            <div class="item">
              <div class="title">注册时间</div>
              <div class="cnt">{{ company.registrationTime }}</div>
            </div>
            <div class="item">
              <div class="title">注册地</div>
              <div class="cnt">{{ company.companyAddress }}</div>
            </div>
            <div class="item">
              <div class="title">注册资金</div>
              <div class="cnt">{{ company.registeredFund }}</div>
            </div>
            <div class="item">
              <div class="title">法人姓名</div>
              <div class="cnt">{{ company.legalName }}</div>
            </div>
            <div class="item">
              <div class="title">法人联系方式</div>
              <div class="cnt">{{ company.legalTelephone }}</div>
            </div>
            <div class="item">
              <div class="title">产业链</div>
              <div class="cnt">{{ semiconductorText }}</div>
            </div>
            <!-- <div class="item">
              <div class="title">产业类别</div>
              <div class="cnt">{{ company.industrialCategory | industrialCategoryFilter }}</div>
            </div> -->
            <div class="item">
              <div class="title">公司Logo</div>
              <div class="cnt">
                <img class="upload-image" :src="company.companyLogo | filterQiniuMooreImage" :alt="company.companyName" v-if='company.companyLogo'>
              </div>
            </div>
            <div class="split-line-wrap">
              <div class="text">下列信息不对外展示</div>
            </div>
            <div class="item">
              <div class="title">公司营业执照</div>
              <div class="cnt">
                <img class="upload-image license-img" :src="company.companyLicense | filterQiniuMooreImage" alt="">
              </div>
            </div>
          </div>
        </div>
        <!-- 新增公司信息 -->
        <div v-if="!company.id" class="wrapper company-block">
          <div class="h-title">公司信息</div>
          <div @click="companyFormDialogVisible = true" class="empty-wrap">
            <div class="add-btn-wrap">
              <i class="icon el-icon-plus"></i>
              <div class="text">添加公司信息</div>
            </div>
          </div>
        </div>
        <!-- 项目信息 -->
        <div class="wrapper project-block">
          <div class="h-title">项目信息<i @click="editProject" class="icon el-icon-edit"></i></div>
          <div class="cnt-wrap">
            <div class="item">
              <div class="title">一句话介绍</div>
              <div class="cnt" v-html="project.title"></div>
            </div>
            <div class="item">
              <div class="title">项目简介</div>
              <div class="cnt" v-html="project.projectBrief"></div>
            </div>
            <div class="item">
              <div class="title">投资亮点</div>
              <div class="cnt" v-html="project.investmentHighlights"></div>
            </div>
            <div class="item">
              <div class="title">商业模式</div>
              <div class="cnt" v-html="project.businessModel"></div>
            </div>
            <div class="item">
              <div class="title">商务成果</div>
              <div class="cnt" v-html="project.businessResults"></div>
            </div>
            <div class="item">
              <div class="title">核心竞争力</div>
              <div class="cnt" v-html="project.competitive"></div>
            </div>
            <div class="item">
              <div class="title">财务预期</div>
              <div class="cnt">
                <div class="sales-list" v-if="project.projectFinancialForecastsModels && project.projectFinancialForecastsModels.length > 0">
                  <div v-for="(item, index) in project.projectFinancialForecastsModels" :key="index" class="sales-item" v-if='item.financialForecasts && item.years'>
                    {{ item.financialForecasts }}@{{ item.years }}年
                  </div>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="title">项目阶段</div>
              <div class="cnt">{{ project.projectPhase | projectPhaseFilter }}</div>
            </div>
            <div class="item">
              <div class="title">年销售额</div>
              <div class="cnt">
                <div class="sales-list" v-if="project.projectSalesQuotaModels && project.projectSalesQuotaModels.length > 0">
                  <div v-for="(item, index) in project.projectSalesQuotaModels" :key="index" class="sales-item" v-if='item.salesQuota && item.years'>
                    {{ item.salesQuota }}@{{ item.years }}年
                  </div>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="title">行业领域</div>
              <div class="cnt">{{project.territory | industryCategoryFilter}}</div>
            </div>
            <div class="item">
              <div class="title">对外标签</div>
              <div class="cnt">{{ externalLabelText }}</div>
            </div>
            <div class="item">
              <div class="title">路演视频</div>
              <div class="cnt video">
                <a :href='project.roadShowUrl | filterFileAddress' target="_blank">{{project.roadShowUrl | filterFileAddress}}</a>
              </div>
            </div>
            <div class="split-line-wrap">
              <div class="text">下列信息不对外展示</div>
            </div>
            <div class="item">
              <div class="title">对内标签</div>
              <div class="cnt">{{ innerLabelText }}</div>
            </div>
            <div class="item">
              <div class="title">核心团队及股权状态</div>
              <div class="cnt">
                <div class="coreteam-list" v-if="project.coreTeamModels && project.coreTeamModels.length > 0">
                  <div v-for="(item, index) in project.coreTeamModels" :key="index" v-if="item.name !== ''" class="coreteam-item">
                    {{ item.name }} 持股比例 {{ item.shareHolding }}%
                  </div>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="title">融资额度及出让比例</div>
              <div class="cnt" v-if="project.financingAmount">
                <div class="text">{{ project.financingAmount }}占比{{ project.assignmentProportion }}%</div>
              </div>
            </div>
            <div class="item">
              <div class="title">是否接受转让、并购、整合</div>
              <div class="cnt">{{ project.makeOver | makeOverFilter }}</div>
            </div>
            <div class="item">
              <div class="title">紧急联系方式</div>
              <div class="cnt">{{ project.emergencyContact }}</div>
            </div>
            <div class="item">
              <div class="title">BP</div>
              <div class="cnt">
                <a :href="project.bp | filterQiniuMooreFile" v-if="project.bp" class="link" target="_blank">BP文件</a>
              </div>
            </div>
          </div>
        </div>
        <div class="item" v-if="project.userInfoModel && (project.userInfoModel.stage === 2 || project.userInfoModel.isUpdate === 2)">
          <div class="cnt basic-confirm" style="display:flex;justyif-content:center;align-items:center">
            <div class="text disabled" style="margin-right:20px;">信息暂未确认</div>
            <el-button @click="sendConfirmMsg" type="danger" size="mini">发送确认提醒</el-button>
          </div>
        </div>
      </el-col>
      <!-- 右侧信息展示 -->
      <el-col class="right-container" :span="12">
        <!-- 约会 -->
        <div class="wrapper appointment-block">
          <div class="h-title">预约</div>
          <div class="cnt-wrap">
            <div class="summary-list vertical appointment">
              <div class="item" @click="viewAppointment(0)">
                <div class="count">{{ conferenceSummary.unConfirmNumber }}</div>
                <div class="state">待确认</div>
              </div>
              <div class="item" @click="viewAppointment(1)">
                <div class="count">{{ conferenceSummary.confirmNumber }}</div>
                <div class="state">已确认</div>
              </div>
              <div class="item" @click="viewAppointment(2)">
                <div class="count">{{ conferenceSummary.finishNumber }}</div>
                <div class="state">已完成</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 推荐投资人 -->
        <div class="wrapper investor-block">
          <div class="h-title">推荐投资人
            <el-button @click="openRecmdInvestorDialog" type="primary" size="mini">推荐</el-button>
            <!-- <el-button @click="openRecmdInvestorDialog" type="primary" size="mini">推荐</el-button> -->
          </div>
          <div class="cnt-wrap">
            <div class="summary-list horizontal">
              <div class="item" @click="openHasRecmdInvestorDialog(0)">
                <div class="state">待确认</div>
                <div class="count">{{ recmdInvestorSummary.unLookNumber }}人</div>
              </div>
              <div class="item" @click="openHasRecmdInvestorDialog(1)">
                <div class="state">感兴趣</div>
                <div class="count">{{ recmdInvestorSummary.interestNumber }}人</div>
              </div>
              <div class="item" @click="openHasRecmdInvestorDialog(10)">
                <div class="state">不感兴趣</div>
                <div class="count">{{ recmdInvestorSummary.unInterestNumber }}人</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 推荐专家顾问 -->
        <div class="wrapper specialist-block">
          <div class="h-title">推荐技术专家
            <el-button @click="openRecmdSpecialistDialog" type="primary" size="mini">推荐</el-button>
            <!-- <el-button @click="openRecmdSpecialistDialog" type="primary" size="mini">推荐</el-button> -->
          </div>
          <div class="cnt-wrap">
            <div class="summary-list horizontal">
              <div class="item" @click="openHasRecmdSpecialDialog(0)">
                <div class="state">待评估</div>
                <div class="count">{{ recmdSpecSummary.unLookNumber }}人</div>
              </div>
              <div class="item" @click="openHasRecmdSpecialDialog(1)">
                <div class="state">已评估</div>
                <div class="count">{{ recmdSpecSummary.assessNumber }}人</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 项目留言 -->
        <div class="wrapper message-block">
          <div class="h-title">项目留言
            <span class="message" v-if="unReplyMessageList.length > 0">({{unReplyMessageList.length}}条新消息)</span>
            <div class="view-more" @click="openMessageListDialog">查看更多 &gt;</div>
          </div>
          <div class="cnt-wrap">
            <div class="empty-wrap" v-if="unReplyMessageList.length === 0">暂无新留言</div>
            <div class="message-list" v-if="unReplyMessageList.length > 0">
              <div class="message-item" v-for="(item, index) in unReplyMessageList" :key="index">
                <div class="message-time">
                  <div class="time">{{ item.createTime }}</div>
                  <div @click="handleSendMsg(item)" class="name">{{ item.name }}({{ item.role }})</div>
                </div>
                <div class="text">{{ item.content }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 感兴趣信息 -->
        <div class="wrapper message-block">
          <div class="h-title">感兴趣信息</div>
          <div class="cnt-wrap">
            <div class="message-list">
            <table id="oTable" bordercolor="#ebebeb" border="1" width="100%">
              <thead>
                <tr class='title'>
                  <th>投资机构</th>
                  <th>投资人</th>
                  <th>BP发送</th>
                  <th>微信建群</th>
                  <th>电话会议</th>
                  <th>线下交流</th>
                  <th>沟通反馈</th>
                </tr>
              </thead>
              <tbody>
                <tr class="tableTR" v-for="(item, index) in interestedData" :key="index">
                  <td >{{item.companyName}}</td>
                  <td>{{item.investorName}}</td>
                  <td><input type="text" v-model="item.bpSend"></td>
                  <td><input type="text" v-model="item.weixinGroup"></td>
                  <td><input type="text" v-model="item.phoneMeeting"></td>
                  <td><input type="text" v-model="item.offlineMeeting"></td>
                  <td><textarea type="text" v-model="item.communicationFeedback"></textarea></td>
                </tr>
                <tr class="tableTR" v-if='interestedData.length == 0' >
                  <td colspan="7" style='height:40px'>暂无数据</td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
          <div class="pager-wrap" style="margin-top:10px">
            <el-button @click="saveInterestedData" type="primary" size="small">保存</el-button>
            <el-pagination
              background
              layout="total, prev, pager, next"
              :total="totalNum"
              :page-size="pager.size"
              @current-change="handleCurrentChange"
              style="margin-top:10px">
            </el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- FA协议签署确认 -->
    <el-dialog
      title="FA协议签署确认"
      :visible.sync="agreementDialogVisible"
      width="30%">
        <span>确认已签署FA协议，确认后状态将不能变更</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="agreementDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureSignAgreement">确认已签署</el-button>
        </span>
    </el-dialog>
    <!-- NDA协议签署确认 -->
    <el-dialog
      title="NDA签署确认"
      :visible.sync="ndaDialogVisible"
      width="30%">
      <span>确认已签署NDA，确认后状态将不能变更</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="ndaDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureSignNda">确认已签署</el-button>
        </span>
    </el-dialog>
    <!-- 发送基本信息确认提醒 -->
    <el-dialog
      title="发送确认提醒"
      :visible.sync="remindDialogVisible"
      width="30%">
      <span>请确保下方信息已完善并核对准确，项目方确认信息后，如有内容修改需重新确认。</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="remindDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmRemind">发送确认提醒</el-button>
        </span>
    </el-dialog>
    <!-- 关闭项目弹窗 -->
    <el-dialog
      title="关闭项目"
      :visible.sync="closeDialogVisible"
      width="30%">
      <el-form>
        <el-form-item label="项目关闭原因" label-width="100">
          <el-select v-model="closeReason" placeholder="请选择关闭原因" v-if="project.status != 4">
            <el-option label="已在平台外找到投资" value="已在平台外找到投资"></el-option>
            <el-option label="项目已关闭" value="项目已关闭"></el-option>
            <el-option label="终止合作" value="终止合作"></el-option>
          </el-select>
          <span v-if="project.status === 4">已完成投资，项目关闭</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureCloseProject">提交并关闭</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户信息 -->
    <el-dialog
      title="修改注册用户信息"
      :visible.sync="userFormDialogVisible"
      width="40%">
      <el-form :inline="true" :model="editUserForm">
        <el-form-item label="*联系人" label-width="100px">
          <el-input style="width: 250px;" v-model="editUserForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" label-width="100px">
          <el-input style="width: 250px;" v-model="editUserForm.mobile" auto-complete="off"></el-input>
          <div class="userinfo-tip">* 手机号变更后，原先的手机号将不能登录，请确保手机号真实有效</div>
        </el-form-item>
        <el-form-item label="*邮箱" label-width="100px">
          <el-input style="width: 250px;" v-model="editUserForm.email" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userFormDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUserForm()">提 交</el-button>
      </div>
    </el-dialog>
    <!-- 公司信息 -->
    <el-dialog
      fullscreen
      title="公司信息"
      :visible.sync="companyFormDialogVisible"
      class="el-dialog-right"
      width="40%">
      <el-form class="dialog-form" :model="companyForm">
        <el-form-item label="公司logo" label-width="100px">
          <div class="company-logo-wrap">
            <img class="upload-image" v-if="uploadedImageUrl" :src="uploadedImageUrl | filterQiniuMooreImage" alt="">
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
              <el-button size="small" type="primary">上传logo</el-button>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="*公司名称" label-width="100px">
          <!-- <el-input v-model="companyForm.companyName"></el-input> -->
            <el-select
              v-model="companyForm.companyName"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              @change ='changeOption'>
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.fullname"
                :value="item.fullname">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="*注册时间" label-width="100px">
          <el-date-picker
            v-model="companyForm.registrationTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="注册时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="*注册地" label-width="100px">
          <el-input v-model="companyForm.companyAddress"></el-input>
        </el-form-item>
        <el-form-item label="*注册资金" label-width="100px">
          <el-input style="width: 120px;" v-model="companyForm.registeredFund"></el-input>
        </el-form-item>
        <el-form-item label="*法人姓名" label-width="100px">
          <el-input v-model="companyForm.legalName"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" label-width="100px">
          <el-input v-model="companyForm.legalTelephone"></el-input>
        </el-form-item>
        <el-form-item label="*产业链" label-width="100px">
          <el-select
            style="width: 100%;"
            v-model='industrialCategoryArr'
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
        </el-form-item>
        <el-form-item>
          <div class="split-line-wrap">
            <div class="text">以下为非公开信息</div>
          </div>
        </el-form-item>
        <el-form-item label="公司营业执照" label-width="160px">
          <div class="company-license-wrap">
            <img class="upload-image license-img" v-if="uploadedImageUrlLicense" :src="uploadedImageUrlLicense | filterQiniuMooreImage" alt="">
            <el-upload
              class="upload-btn"
              :show-file-list="false"
              action="http://upload.qiniup.com/"
              :before-upload="beforeUploadLicense"
              :on-progress="uploadProgressLicense"
              :on-success="uploadSuccessLicense"
              :on-error="uploadErrorLicense"
              :data="uploadDataLicense"
              :multiple="false">
              <el-button size="small" type="primary">上传公司营业执照</el-button>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="companyFormDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCompanyForm()">提 交</el-button>
      </div>
    </el-dialog>

    <!-- 项目信息 -->
    <el-dialog
      fullscreen
      title="项目信息"
      :visible.sync="projectFormDialogVisible"
      class="el-dialog-right"
      width="40%">
      <el-form class="dialog-form" :model="projectForm">
        <el-form-item label="项目一句话介绍" :label-width="labelWidth">
          <el-input v-model="projectForm.project.title" placeholder="项目一句话介绍"></el-input>
        </el-form-item>
        <el-form-item label="*项目简介" :label-width="labelWidth">
          <vue-ckeditor v-model="projectForm.project.projectBrief" :config="ckeditorConfig"></vue-ckeditor>
        </el-form-item>
        <el-form-item label="投资亮点" :label-width="labelWidth">
          <vue-ckeditor v-model="projectForm.project.investmentHighlights" :config="ckeditorConfig"></vue-ckeditor>
        </el-form-item>
        <el-form-item label="商业模式" :label-width="labelWidth">
          <vue-ckeditor v-model="projectForm.project.businessModel" :config="ckeditorConfig"></vue-ckeditor>
        </el-form-item>
        <el-form-item label="商务成果" :label-width="labelWidth">
          <vue-ckeditor v-model="projectForm.project.businessResults" :config="ckeditorConfig"></vue-ckeditor>
        </el-form-item>
        <el-form-item label="核心竞争力" :label-width="labelWidth">
          <vue-ckeditor v-model="projectForm.project.competitive" :config="ckeditorConfig"></vue-ckeditor>
        </el-form-item>
        <el-form-item label="财务预期" :label-width="labelWidth">
          <!-- 添加财务预期 -->
          <div class="sales-quota-list">
            <div v-for="(item, index) in financialForecasts" :key="index" class="sales-quota-item">
              <div class="sales-quota">
                <el-input v-model="item.financialForecasts" style="width: 130px;"></el-input>
              </div>
              <el-select class="years" v-model="item.years" placeholder="年份">
                <el-option label="2019年" value="2019"></el-option>
                <el-option label="2020年" value="2020"></el-option>
                <el-option label="2021年" value="2021"></el-option>
                <el-option label="2022年" value="2022"></el-option>
              </el-select>
              <i @click="addFinancialForecastsItem" v-if="index === financialForecasts.length - 1" class="icon el-icon-circle-plus-outline"></i>
              <i @click="removeFinancialForecastsItem(index)" v-if="index < financialForecasts.length - 1" class="icon el-icon-close"></i>
            </div>
          </div>
        </el-form-item>
        <!-- <el-form-item label="财务预期" :label-width="labelWidth">
          <el-input style="width: 180px;" v-model="projectForm.project.financialForecasts"></el-input>
        </el-form-item> -->
        <el-form-item label="*项目阶段" :label-width="labelWidth">
          <el-select style="width: 120px;" v-model="projectForm.project.projectPhase" placeholder="请选择">
            <el-option label="种子" value="1"></el-option>
            <el-option label="天使" value="2"></el-option>
            <el-option label="Pre-A" value="3"></el-option>
            <el-option label="A" value="4"></el-option>
            <el-option label="B" value="5"></el-option>
            <el-option label="C" value="6"></el-option>
            <el-option label="Pre-IPO" value="7"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年销售额" :label-width="labelWidth">
          <!-- 添加销售额信息 -->
          <div class="sales-quota-list">
            <div v-for="(item, index) in projectSalesQuota" :key="index" class="sales-quota-item">
              <div class="sales-quota">
                <el-input v-model="item.salesQuota" style="width: 130px;"></el-input>
              </div>
              <el-select class="years" v-model="item.years" placeholder="年份">
                <el-option label="2019年" value="2019"></el-option>
                <el-option label="2018年" value="2018"></el-option>
                <el-option label="2017年" value="2017"></el-option>
                <el-option label="2016年" value="2016"></el-option>
                <el-option label="2015年" value="2015"></el-option>
                <el-option label="2014年" value="2014"></el-option>
                <el-option label="2013年" value="2013"></el-option>
                <el-option label="2012年" value="2012"></el-option>
              </el-select>
              <i @click="addSalesQuotaItem" v-if="index === projectSalesQuota.length - 1" class="icon el-icon-circle-plus-outline"></i>
              <i @click="removeSalesQuotaItem(index)" v-if="index < projectSalesQuota.length - 1" class="icon el-icon-close"></i>
            </div>
          </div>
        </el-form-item>
          <el-form-item label='行业领域' label-width="150px">
              <el-select v-model="projectTerritoryValue" multiple>
                <el-option :label="item.label" v-for="item in INDUSTRIALCATEGORY" :key="item.value"  :value="item.value" ></el-option>
              </el-select>
          </el-form-item>
        <el-form-item label="对外展示标签" :label-width="labelWidth">
          <span v-if="externalLabels">{{ externalLabels }}</span>
          <el-button @click="openExternalDialog" type="plain" size="small">选择标签</el-button>
        </el-form-item>
        <el-form-item label="路演视频" :label-width="labelWidth">
          <a v-if="videoName || roadShowUrl" :href="roadShowUrl | filterFileAddress" target="_blank">{{ videoName || roadShowUrl }}</a>
            <i class="el-icon-close" v-if="videoName || roadShowUrl" style='margin-left:10px;font-size:18px;font-weight:600;cursor:pointer' @click='delUrl'></i>
          <el-upload
            class="file-uploader"
            :multiple="false"
            action="http://upload.qiniup.com/"
            :show-file-list="false"
            :on-success="handleFileSuccess"
            :on-error="handleFileError"
            :on-progress="handleFileProgress"
            :data="uploadDataVideo"
            :before-upload="beforeFileUpload">
            <el-button size="small" type="primary">点击上传</el-button>
            <span v-if="fileUploading">文件上传中...</span>
            <p>注：视频需小于2G，格式为MP4</p>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <div class="split-line-wrap">
            <div class="text">以下为非公开信息</div>
          </div>
        </el-form-item>
        <el-form-item label="对内展示标签" :label-width="labelWidth" >
          <span v-if="innerLabels">{{ innerLabels }}</span>
          <el-button @click="openInnerDialog" type="plain" size="small">选择标签</el-button>
        </el-form-item>
        <el-form-item label="核心团队及股权情况" :label-width="labelWidth">
          <!-- 添加核心团队 -->
          <div class="core-team-list">
            <div v-for="(item, index) in coreTeam" :key="index" class="core-team-item">
              <el-input class="name" v-model="item.name" placeholder="姓名" style="width: 120px;" ></el-input>
              <el-input class="share-holding" v-model="item.shareHolding" placeholder="持股比例" style="width: 90px;" @blur='coreTeamBlur(index)' prop="shareHolding"></el-input> %
              <i @click="addCoreTeamItem" v-if="index === coreTeam.length - 1" class="icon el-icon-circle-plus-outline"></i>
              <i @click="removeCoreTeamItem(index)" v-if="index < coreTeam.length - 1" class="icon el-icon-close"></i>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="*融资额度及出让比例" :label-width="labelWidth">
          <el-input style="width: 120px;" v-model="projectForm.project.financingAmount" placeholder="融资额度"  prop="financingAmount"></el-input>
          <el-input style="width: 90px;" v-model="projectForm.project.assignmentProportion" placeholder="出让比例"  prop="assignmentProportion"></el-input> %
        </el-form-item>
        <el-form-item label="是否接受转让,并购,整合" label-width="170px">
          <el-checkbox-group v-model="makeOverArr" @change="changeMakeOver" >
            <el-checkbox :disabled="notMakeOver !== '' && !notMakeOver" label="1">不接受</el-checkbox><br/>
            <el-checkbox :disabled="notMakeOver !== '' && notMakeOver" label="2">接受转让</el-checkbox>
            <el-checkbox :disabled="notMakeOver !== '' && notMakeOver" label="3">接受并购</el-checkbox>
            <el-checkbox :disabled="notMakeOver !== '' && notMakeOver" label="4">接受整合</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="紧急联系方式" :label-width="labelWidth">
          <el-input v-model="projectForm.project.emergencyContact  "></el-input>
        </el-form-item>
        <el-form-item label="BP" label-width="160px">
          <div class="company-license-wrap">
            <a class="link" v-if="uploadedBpUrl" :href="uploadedBpUrl | filterQiniuMooreFile" target="_blank">BP文件</a>
            <el-upload
              class="upload-btn"
              :show-file-list="false"
              action="http://upload.qiniup.com/"
              :before-upload="beforeUploadBp"
              :on-progress="uploadProgressBp"
              :on-success="uploadSuccessBp"
              :on-error="uploadErrorBp"
              :data="uploadDataBp"
              :multiple="false">
              <el-button size="small" type="primary">{{ uploadingBp ? '正在上传...' : '上传BP' }}</el-button>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="projectFormDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitProjectForm()">提 交</el-button>
      </div>
    </el-dialog>

    <!-- 推荐投资人 -->
    <RecommendInvestor ref="refRecommendInvestor" @emitGetValue="getRecommendInvestor"></RecommendInvestor>

    <!-- 已推荐投资人 -->
    <HasRecommendInvestor ref="refHasRecommendInvestor" @emitContinueRecmdInvestor="openRecmdInvestorDialog"></HasRecommendInvestor>

    <!-- 推荐技术专家 -->
    <RecommendSpecialist ref="refRecommendSpecialist" @emitGetValue="getRecommendSpecialist"></RecommendSpecialist>

    <!-- 已推荐技术专家 -->
    <HasRecommendSpecialist ref="refHasRecommendSpecialist" @emitContinueRecmdSpecial="openRecmdSpecialistDialog"></HasRecommendSpecialist>

    <!-- 留言列表 -->
    <MessageList ref="refMessageList"></MessageList>

    <!-- 外显标签 -->
    <TagDialog ref="refExternalLabel" @emitGetValue="getExternalLabel"></TagDialog>

    <!-- 内显标签 -->
    <TagDialog ref="refInnerLabel" @emitGetValue="getInnerLabel"></TagDialog>

    <!-- 会议列表弹窗 -->
    <el-dialog
      class="el-dialog-right"
      :title="conferenceTitle"
      :visible.sync="conferenceDialogVisible"
      width="40%">
      <ConferenceList @closeDialog="closeWidgets('conferenceDialogVisible')" :user-id="project.userInfoModel.id" :status="conferenceStatus" :data="conferenceData"></ConferenceList>
    </el-dialog>

    <!-- 回复留言弹窗 -->
    <el-dialog
      class="reply-dialog"
      title="回复留言"
      :visible.sync="replyMessageDialogVisible"
      width="30%">
      <div class="reply-wrap">
        <div class="top">
          回复
          <span class="name">{{ replyItem.name }}</span>
        </div>
        <div class="text-input-wrap">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="replyContent"></el-input>
        </div>
        <div class="action-wrap">
          <el-button class="btn" @click="handleCancel">取消</el-button>
          <el-button @click="sendMsg" class="btn" type="primary">发送</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Global from 'assets/js/global'
import RecommendInvestor from '../fa/widgets/RecommendInvestor'
import HasRecommendInvestor from '../fa/widgets/HasRecommendInvestor'
import RecommendSpecialist from '../fa/widgets/RecommendSpecialist'
import HasRecommendSpecialist from '../fa/widgets/HasRecommendSpecialist'
import ConferenceList from '../fa/widgets/ConferenceList'
import MessageList from '../fa/widgets/MessageList'
import TagDialog from '../fa/widgets/TagDialog'
import FaCommon from 'assets/js/faCommon'
import _ from 'underscore'
export default {
  components: {
    RecommendInvestor,
    HasRecommendInvestor,
    RecommendSpecialist,
    HasRecommendSpecialist,
    ConferenceList,
    MessageList,
    TagDialog
  },
  // 刷新当前页面
  inject: ['reload'],
  data () {
    return {
      INDUSTRIALCATEGORY: [], // 行业领域
      project: {
        alias: '',
        isAgreement: false,
        isNda: false,
        userInfoModel: {},
        coreTeamModels: [],
        projectSalesQuotaModels: [],
        projectFinancialForecastsModels: []
      },
      company: {},
      conferenceSummary: {},
      recmdInvestorSummary: {},
      recmdSpecSummary: {},
      editAlias: false,
      alias: '',
      id: this.$route.params.id,
      agreementDialogVisible: false,
      ndaDialogVisible: false,
      remindDialogVisible: false,
      closeDialogVisible: false,
      closeReason: '',
      userFormDialogVisible: false,
      editUserForm: {},
      companyFormDialogVisible: false,
      projectFormDialogVisible: false,
      companyForm: {
        type: [],
        capitalUnit: ''
      },
      projectForm: {
        project: {
          projectBrief: '',
          businessResults: '',
          competitive: '',
          investmentHighlights: '',
          businessModel: '',
          innerLabel: '',
          externalLabel: '',
          innerLabelArr: [],
          externalLabelArr: [],
          territory: ''
        }
      },
      uploadedImageUrl: '',
      uploadData: {
        key: '',
        token: ''
      },
      uploadDataVideo: {
        key: '',
        token: ''
      },
      fileUploading: false,
      videoName: '',
      roadShowUrl: '',
      uploadedImageUrlLicense: '',
      uploadDataLicense: {
        key: '',
        token: ''
      },
      uploadedBpUrl: '',
      uploadDataBp: {
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
      tagsOpts: [{
        id: '',
        name: ''
      }],
      labelWidth: '150px',
      recommendInvestorDialogVisible: false,
      recommendSpecialistDialogVisible: false,
      hasRecommendedInvestorDialogVisible: false,
      hasRecommendedSpecialistDialogVisible: false,
      fetchTagLoading: false,
      industrialCategoryArr: [],
      makeOverArr: [],
      notMakeOver: '',
      projectSalesQuota: [],
      financialForecasts: [],
      coreTeam: [],
      conferenceTitle: '待确认会议',
      conferenceDialogVisible: false,
      conferenceStatus: '0',
      conferenceData: [[], 0, false],
      pageC: false,
      defaultLabelProps: {
        children: 'childTag',
        label: 'name'
      },
      labelData: [],
      processLabelArr: [],
      innerLabelIdArr: [],
      externalLabelIdArr: [],
      innerLabels: '',
      externalLabels: '',
      projectTerritory: '',
      projectTerritoryValue: [],
      externalLabelText: '',
      innerLabelText: '',
      unReplyMessageList: [],
      replyMessageDialogVisible: false,
      replyItem: {},
      replyContent: '',
      uploadingBp: false,
      canRecommend: false,
      canRecommendSpecialist: false,
      semiconductorOptions: [],
      semiconductorText: '',
      interestedData: [],
      totalNum: 0,
      pager: {
        size: 20,
        page: 1
      },
      isTianyancha: 0, // 公司信息是否对接天眼查
      options: []
    }
  },
  watch: {
    companyForm () {
      // TODO: 未修改直接变动了
      console.log('companyForm 内容变动')
    },
    conferenceDialogVisible () {
      console.log('弹窗关闭')
      console.log(this.conferenceDialogVisible)
      if (!this.conferenceDialogVisible) {
        this.pageC = true
      }
    }
  },
  created () {
    let _vue = this
    _vue.getIndustrialCategory()
    _vue.fetchFirstTag()
    _vue.fetchAllTag()
    _vue.fetchProjectDetail()
    _vue.fetchRecmdInvestorNum()
    _vue.fetchRecmdSpecNum()
    // 获取详情后才能拿到一些参数
    window.setTimeout(() => {
      if (this.$route.query && this.$route.query.action) {
        if (this.$route.query.action === 'recommendinvestor') {
          // 开始推荐投资人
          _vue.openRecmdInvestorDialog()
        } else if (this.$route.query.action === 'noticeconfirm') {
          // 发送提醒
          _vue.remindDialogVisible = true
        } else if (this.$route.query.action === 'conference') {
          // 展示会议
          _vue.viewAppointment(0)
        } else if (this.$route.query.action === 'message') {
          // 展示消息
          _vue.openMessageListDialog()
        } else if (this.$route.query.action === 'recmdinvestor') {
          // 展示推荐投资人
          _vue.openRecmdInvestorDialog()
        } else if (this.$route.query.action === 'hasrecmdinvestor') {
          // 展示已推荐投资人
          _vue.openHasRecmdInvestorDialog(0)
        } else if (this.$route.query.action === 'recmdspecialist') {
          // 展示推荐技术专家
          _vue.openRecmdSpecialistDialog()
        } else if (this.$route.query.action === 'hasrecmdspecialist') {
          // 展示已推荐技术专家
          _vue.openHasRecmdSpecialDialog(0)
        } else if (this.$route.query.action === 'conferencereached') {
          // 已确认会议
          _vue.viewAppointment(1)
        }
        _vue.$router.push({
          path: '/fa/project/' + this.$route.params.id
        })
      }
    }, 1000)
    // 消息提醒数据轮询
    window.setInterval(() => {
      // _vue.fetchRecmdInvestorNum()
      // _vue.fetchRecmdSpecNum()
      _vue.fetchUnReplyMessage()
    }, 1000 * 15)
    this.fetchInvestorData()
  },
  filters: {
    stageFilter (val) {
      // 信息状态
      if (val === 0 || val === 1 || val === 2) {
        return '待完善'
      } else if (val === 3) {
        return '等待确认'
      } else if (val === 4) {
        return '已确认'
      }
    },
    projectPhaseFilter (val) {
      // 当前达成阶段
      if (val === 1) {
        return '种子'
      } else if (val === 2) {
        return '天使'
      } else if (val === 3) {
        return 'Pre-A'
      } else if (val === 4) {
        return 'A轮'
      } else if (val === 5) {
        return 'B轮'
      } else if (val === 6) {
        return 'C轮'
      } else if (val === 7) {
        return 'Pre-IPO'
      }
    },
    projectStatusFilter (val) {
      // 当前项目状态
      if (val === 0) {
        return '待处理'
      } else if (val === 1) {
        return '已结束'
      } else if (val === 2) {
        return '无效'
      } else if (val === 3) {
        return '推荐中'
      } else if (val === 4) {
        return '已投资'
      } else if (val === 5) {
        return '项目完成'
      } else if (val === 6) {
        return '临时推荐'
      }
    },
    fundTypeFilter (val) {
      // 货币类型
      val = parseInt(val)
      if (val === 1) {
        return '人民币'
      } else if (val === 2) {
        return '美元'
      } else if (val === 3) {
        return '港币'
      } else if (val === 4) {
        return '欧元'
      } else if (val === 5) {
        return '其他'
      }
    },
    industrialCategoryFilter (val) {
      // 产业类型
      let result = ''
      console.log('----972-----')
      console.log(val)
      let arr = val.split(',')
      if (arr.indexOf('1') !== -1) {
        result += '材料,'
      }
      if (arr.indexOf('2') !== -1) {
        result += '设备,'
      }
      if (arr.indexOf('3') !== -1) {
        result += '工具,'
      }
      if (arr.indexOf('4') !== -1) {
        result += '算法,'
      }
      if (arr.indexOf('5') !== -1) {
        result += 'IP,'
      }
      if (arr.indexOf('6') !== -1) {
        result += '芯片研发,'
      }
      if (arr.indexOf('7') !== -1) {
        result += '流片,'
      }
      if (arr.indexOf('8') !== -1) {
        result += '封装测试,'
      }
      if (arr.indexOf('9') !== -1) {
        result += '产品及方案,'
      }
      if (arr.indexOf('10') !== -1) {
        result += '渠道及贸易,'
      }
      if (arr.indexOf('11') !== -1) {
        result += '其他,'
      }
      return result.substring(0, result.length - 1)
    },
    makeOverFilter (val) {
      let result = ''
      val = val || ''
      if (val.indexOf('1') !== -1) {
        result = '不接受,'
      }
      if (val.indexOf('2') !== -1) {
        result += '接受转让,'
      }
      if (val.indexOf('3') !== -1) {
        result += '接受并购,'
      }
      if (val.indexOf('4') !== -1) {
        result += '接受整合,'
      }
      return result.substring(0, result.length - 1)
    },
    filterFileAddress (val) {
      // 七牛文件路径
      let qiniuUrl = ''
      if (val) {
        if (val.startsWith('cloud/')) {
          // 需要拼接七牛域名
          qiniuUrl = Global.CONFIG.QINIU_BUCKET_MOORE_FILE_URL + '/' + val
        } else {
          qiniuUrl = val
        }
      }
      return qiniuUrl
    }
  },
  methods: {
    // 查询公司
    getCname (name) {
      let self = this
      this.$http.get('/api/v1.0/fa/investor/query-company?shortName=' + name).then((res) => {
        console.log('查询公司')
        self.options = res.data.data
        console.log(self.options)
      })
    },
    remoteMethod (query) {
      console.log('query', query)
      if (query !== '') {
        this.getCname(query)
      } else {
        this.options = []
      }
    },
    changeOption (val) {
      console.log(val)
      this.options.map(item => {
        if (item.fullname === val) {
          this.companyForm.companyAddress = item.address
          this.companyForm.registeredFund = item.regCapital
          this.companyForm.legalName = item.legalPerson
          this.companyForm.registrationTime = item.foundingTime
          this.companyForm.isTianyancha = 1
        }
      })
    },
    // 复制项目
    copyProject () {
      let _vue = this
      _vue.$http.get('/api/v1.0/fa/project/copy?id=' + _vue.id).then(res => {
        console.log('复制项目', res)
        this.$message({
          type: 'success',
          message: '项目复制成功',
          center: true
        })
      })
    },
    // 获取感兴趣投资人信息
    fetchInvestorData () {
      // 获取投资人列表
      let _vue = this
      _vue.interestedData = []
      _vue.$http.post('/api/v1.0/fa/projectInvestor/page', {
        'pageNum': _vue.pager.page,
        'pageSize': _vue.pager.size,
        'parameters': { 'isInterest': 1, 'projectId': _vue.id }
      }).then(res => {
        let result = res.data.data
        _vue.interestedData = result.data
        _vue.totalNum = result.total
        console.log('interestedData', _vue.interestedData)
      })
    },
    saveInterestedData () {
      console.log('this.interestedData', this.interestedData)
      let params = []
      this.interestedData.map(item => {
        let obj = {}
        obj.projectId = this.id
        obj.investorId = item.investorId
        obj.remark = item.remark
        obj.isInterest = item.isInterest
        obj.weixinGroup = item.weixinGroup
        obj.bpSend = item.bpSend
        obj.phoneMeeting = item.phoneMeeting
        obj.offlineMeeting = item.offlineMeeting
        obj.communicationFeedback = item.communicationFeedback
        obj.id = item.id
        params.push(obj)
        return item
      })
      console.log(params)
      this.$http.post('/api/v1.0/fa/projectInvestor/update-list', params).then(res => {
        console.log('保存感兴趣信息', res)
        this.$message({
          type: 'success',
          message: '保存成功',
          center: true
        })
      })
    },
    handleCurrentChange (value) {
      this.pager.page = value
      this.saveInterestedData()
      this.fetchInvestorData()
    },
    // 删除视频
    delUrl () {
      this.videoName = ''
      this.roadShowUrl = ''
    },
    // 上传路演视频
    handleFileSuccess (res, file) {
      // 简历上传成功
      console.log('上传成功')
      console.log(file)
      console.log(res)
      let _vue = this
      _vue.fileUploading = false
      _vue.videoName = file.name
      _vue.roadShowUrl = res.key
      // 提交上传授权文件
      // _vue.$http.post('/api/v1.0/survey/order/upload', {
      //   id: _vue.surveyId,
      //   authorizationAddress: _vue.authorizationAddress
      // }).then(() => {
      //   _vue.$message({
      //     type: 'success',
      //     message: '上传成功',
      //     center: true
      //   })
      // }).catch(() => {
      //   _vue.$message({
      //     type: 'error',
      //     message: '请稍后重试',
      //     center: true
      //   })
      // })
    },
    handleFileProgress () {
      this.fileUploading = true
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
    beforeFileUpload (file) {
      console.log('file', file)
      // 简历上传
      let _vue = this
      if (file.size / 1024 / 1024 / 1024 >= 2) {
        _vue.$message({
          type: 'error',
          message: '文件大小需小于2G',
          center: true
        })
        return false
      } else if (file.type !== 'video/mp4') {
        _vue.$message({
          type: 'error',
          message: '只允许上传mp4文件格式',
          center: true
        })
        return false
      } else {
        let key = 'cloud/file/FA/roadshowVideo/' + (new Date().getTime()) + '_' + file.name
        return _vue.$http.get('/api/v1.0/qiniu/token/file?bucket=moore').then(response => {
          _vue.uploadDataVideo.token = response.data.data.token
          _vue.uploadDataVideo.key = key
        })
      }
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
    coreTeamBlur (index) {
      let shareHoldingItem = []
      let shareHoldingSUM = 0
      this.coreTeam.map(item => {
        shareHoldingItem.push(item.shareHolding)
      })
      shareHoldingItem.map(item => {
        console.log(parseInt(item))
        shareHoldingSUM += parseInt(item)
      })
      console.log('求和')
      console.log(shareHoldingItem)
      console.log(shareHoldingSUM)
      if (shareHoldingSUM > 100) {
        this.$message({
          message: '持股比例总和应在100%之内',
          center: true,
          type: 'warning'
        })
        // this.coreTeam[index].shareHolding = ''
      }
    },
    fetchFirstTag () {
      this.$http.get('/api/v1.0/fa/tag/findAllTag?parentId=1').then(res => {
        this.semiconductorOptions = res.data.data
      })
    },
    handleLabelName (val, processLabelArr) {
      // 根据tagId显示tagName
      let str = ''
      if (val) {
        console.log('----1032-----')
        let arr = val.split(',')
        let list = _.filter(processLabelArr, item => {
          return arr.indexOf(item.id + '') !== -1
        })
        str = _.pluck(list, 'name').toString()
      }
      return str
    },
    fetchProjectDetail () {
      // 获取项目详情
      let _vue = this
      _vue.$http.get('/api/v1.0/fa/project/details?id=' + _vue.id).then(res => {
        _vue.project = res.data.data
        _vue.company = _vue.project.companyModel || {}
        _vue.isTianyancha = _vue.company.isTianyancha
        _vue.canRecommend = _vue.project.isAgreement === 1 && _vue.project.isNda === 1 && (_vue.project.status === 0 || _vue.project.status === 3 || _vue.project.status === 4)
        _vue.canRecommendSpecialist = _vue.project.isAgreement === 1 && _vue.project.isNda === 1 &&
          _vue.project.isOpen === 1 && (_vue.project.status === 0 || _vue.project.status === 3 || _vue.project.status === 4)
        _vue.setValForProjectForm()
        _vue.fetchUnReplyMessage()
        _vue.fetchConferenceNum()
        window.setTimeout(() => {
          this.semiconductorText = this.handleLabelName(_vue.company.industrialCategory, this.semiconductorOptions)
          _vue.externalLabelText = _vue.handleLabelName(_vue.project.externalLabel, _vue.processLabelArr)
          _vue.projectTerritoryValue = _vue.project.territory ? _vue.project.territory.split(',') : []
          _vue.innerLabelText = _vue.handleLabelName(_vue.project.innerLabel, _vue.processLabelArr)
          _vue.externalLabels = _vue.handleLabelName(_vue.project.externalLabel, _vue.processLabelArr)
          _vue.innerLabels = _vue.handleLabelName(_vue.project.innerLabel, _vue.processLabelArr)
        }, 800)
        _vue.roadShowUrl = _vue.project.roadShowUrl
      })
    },
    fetchConferenceNum () {
      // 获取约会数量
      this.$http.get('/api/v1.0/fa/conference/conferenceNumber?projectUserId=' + this.project.userInfoModel.id).then(res => {
        this.conferenceSummary = res.data.data
      })
    },
    fetchRecmdInvestorNum () {
      // 获取推荐投资人数据
      let _vue = this
      _vue.$http.get('/api/v1.0/fa/projectInvestor/interest?projectId=' + _vue.id).then(res => {
        _vue.recmdInvestorSummary = res.data.data
      })
    },
    fetchRecmdSpecNum () {
      // 获取推荐技术专家数据
      let _vue = this
      _vue.$http.get('/api/v1.0/fa/projectSpecialist/assess?projectId=' + _vue.id).then(res => {
        _vue.recmdSpecSummary = res.data.data
      })
    },
    setValForProjectForm () {
      let _vue = this
      console.log('----1083-----')
      _vue.projectForm = {
        project: {
          id: _vue.project.id,
          alias: _vue.project.alias,
          title: _vue.project.title,
          investmentHighlights: _vue.project.investmentHighlights,
          projectBrief: _vue.project.projectBrief,
          businessResults: _vue.project.businessResults,
          competitive: _vue.project.competitive,
          projectPhase: (_vue.project.projectPhase || '') + '',
          ownershipSituation: _vue.project.ownershipSituation,
          financingAmount: _vue.project.financingAmount,
          fundType: (_vue.project.fundType || '') + '',
          assignmentProportion: _vue.project.assignmentProportion,
          businessModel: _vue.project.businessModel,
          makeOver: _vue.project.makeOver,
          emergencyContact: _vue.project.emergencyContact,
          innerLabel: _vue.project.innerLabel,
          externalLabel: _vue.project.externalLabel,
          innerLabelArr: _vue.project.innerLabel ? (_vue.project.innerLabel || '').split(',') : [],
          externalLabelArr: _vue.project.externalLabel ? (_vue.project.externalLabel || '').split(',') : [],
          roadShowUrl: _vue.roadShowUrl
        }
      }
      _vue.innerLabelIdArr = _vue.project.innerLabel ? (_vue.project.innerLabel || '').split(',') : []
      _vue.externalLabelIdArr = _vue.project.externalLabel ? (_vue.project.externalLabel || '').split(',') : []
      console.log('----1107-----')
      console.log(_vue.project.bp)
      console.log(_vue.uploadDataBp.key)
      _vue.uploadedBpUrl = _vue.project.bp || ''
      _vue.uploadDataBp.key = _vue.project.bp || ''
      _vue.makeOverArr = _vue.projectForm.project.makeOver ? _vue.projectForm.project.makeOver.split(',') : []
      _vue.changeMakeOver()
      _vue.coreTeam = []
      _vue.projectSalesQuota = []
      _vue.financialForecasts = []
      if (_vue.project.coreTeamModels.length > 0) {
        _.each(_vue.project.coreTeamModels, (item) => {
          _vue.coreTeam.push(_.pick(item, 'name', 'shareHolding'))
        })
      } else {
        _vue.coreTeam = [{
          name: '',
          shareHolding: ''
        }]
      }
      if (_vue.project.projectFinancialForecastsModels.length > 1) {
        _.each(_vue.project.projectFinancialForecastsModels, (item) => {
          _vue.financialForecasts.push(_.pick(item, 'years', 'financialForecasts', 'fundType'))
          _.map(_vue.financialForecasts, item => {
            item.fundType += ''
          })
        })
      } else if (_vue.project.projectFinancialForecastsModels.length === 1) {
        _vue.financialForecasts.push(_.pick(_vue.project.projectFinancialForecastsModels[0], 'years', 'financialForecasts', 'fundType'))
      } else {
        _vue.financialForecasts = [{
          years: '',
          financialForecasts: '',
          fundType: ''
        }]
      }
      if (_vue.project.projectSalesQuotaModels.length > 0) {
        _.each(_vue.project.projectSalesQuotaModels, (item) => {
          _vue.projectSalesQuota.push(_.pick(item, 'years', 'salesQuota', 'fundType'))
          _.map(_vue.projectSalesQuota, item => {
            item.fundType += ''
          })
        })
      } else {
        _vue.projectSalesQuota = [{
          years: '',
          salesQuota: '',
          fundType: ''
        }]
      }
      _vue.projectForm.coreTeam = _vue.coreTeam
      _vue.projectForm.projectSalesQuota = _vue.projectSalesQuota
      _vue.projectForm.financialForecasts = _vue.financialForecasts
      console.log('this.projectForm------------------------------')
      console.log(this.projectForm)
    },
    clickEditAliasBtn () {
      // 编辑代号
      this.editAlias = true
    },
    cancelEditAlias () {
      // 取消编辑代号
      this.editAlias = false
    },
    sureEditAlias () {
      // 确定编辑代号
      let _vue = this
      _vue.$http.post('/api/v1.0/fa/project/addOrUpdate', _vue.projectForm).then(res => {
        _vue.$message({
          message: '提交成功',
          center: true,
          type: 'success'
        })
        _vue.editAlias = false
        _vue.fetchProjectDetail()
      })
    },
    signAgreement () {
      // 签署FA协议
      this.agreementDialogVisible = true
    },
    signNda () {
      // 签署NDA协议
      this.ndaDialogVisible = true
    },
    sureSignAgreement () {
      // 确认签署FA协议
      let _vue = this
      _vue.$http.get('/api/v1.0/fa/project/signAgreement?projectId=' + _vue.id).then(() => {
        _vue.$message({
          message: '提交成功',
          center: true,
          type: 'success'
        })
        _vue.agreementDialogVisible = false
        _vue.fetchProjectDetail()
      })
    },
    sureSignNda () {
      // 确认签署NDA
      let _vue = this
      _vue.$http.get('/api/v1.0/fa/project/signNda?projectId=' + _vue.id).then(() => {
        _vue.$message({
          message: '提交成功',
          center: true,
          type: 'success'
        })
        _vue.ndaDialogVisible = false
        _vue.fetchProjectDetail()
      })
    },
    sendConfirmMsg () {
      // 发送确认消息
      this.remindDialogVisible = true
    },
    confirmRemind () {
      // 确认发送提醒
      let _vue = this
      _vue.$http.get('/api/v1.0/fa/userInfo/userInfoCheck?userId=' + _vue.project.userInfoModel.id).then(res => {
        _vue.remindDialogVisible = false
        _vue.$message({
          message: '提醒消息已发送',
          center: true,
          type: 'success'
        })
      })
    },
    closeProject () {
      this.closeDialogVisible = true
    },
    sureCloseProject () {
      // 确认关闭项目
      let _vue = this
      let status = 1
      if (_vue.project.status === 4) {
        _vue.closeReason = '已完成投资，项目关闭'
        status = 5
      }
      _vue.$http.get('/api/v1.0/fa/project/addCloseReason?projectId=' + _vue.id + '&closeReason=' + _vue.closeReason + '&status=' + status).then(res => {
        _vue.closeDialogVisible = false
        _vue.reload()
        _vue.fetchProjectDetail()
      })
    },
    sendFocusEmail () {
      // 发送关注邮件
      let _vue = this
      _vue.$http.get('/api/v1.0/fa/userInfo/sendOpenFollow?userId=' + _vue.project.userInfoModel.id).then(res => {
        _vue.$message({
          message: '已向用户发送引导关注邮件',
          center: true,
          type: 'success'
        })
      })
    },
    submitUserForm () {
      // 提交用户信息
      let _vue = this
      if (Global.verification('str', _vue.editUserForm.name) && Global.verification('str', _vue.editUserForm.email)) {
        _vue.$http.post('/api/v1.0/fa/userInfo/update', {
          id: _vue.project.userInfoModel.id,
          name: _vue.editUserForm.name,
          email: _vue.editUserForm.email,
          mobile: _vue.editUserForm.mobile
        }).then(res => {
          if (res.data.data.errCode === 20009) {
            _vue.$message({
              message: '手机号重复, 请更换手机号',
              center: true,
              type: 'error'
            })
          } else {
            _vue.$message({
              message: '提交成功',
              center: true,
              type: 'success'
            })
            _vue.userFormDialogVisible = false
            _vue.fetchProjectDetail()
          }
        })
      } else {
        _vue.$message({
          message: '请输入必填项',
          type: 'error'
        })
        return false
      }
    },
    editUser () {
      // 编辑用户信息
      this.userFormDialogVisible = true
      this.editUserForm.name = this.project.userInfoModel.name
      this.editUserForm.email = this.project.userInfoModel.email
      this.editUserForm.mobile = this.project.userInfoModel.mobile
    },
    viewAppointment (type) {
      // 查看约会信息列表
      let _vue = this
      if (type === 0) {
        _vue.conferenceTitle = '待确认预约'
        _vue.conferenceStatus = '0'
      } else if (type === 1) {
        _vue.conferenceTitle = '已确认'
        _vue.conferenceStatus = '1'
      } else if (type === 2) {
        _vue.conferenceTitle = '已完成'
        _vue.conferenceStatus = '10'
      }
      _vue.fetchConferenceList(_vue.conferenceStatus)
    },
    editCompany () {
      // 编辑公司信息
      let _vue = this
      _vue.companyFormDialogVisible = true
      _vue.companyForm = JSON.parse(JSON.stringify(_vue.company))
      console.log('----1304-----')
      _vue.industrialCategoryArr = _vue.company.industrialCategory ? _.map(_vue.company.industrialCategory.split(','), item => { return item * 1 }) : []
      _vue.companyForm.fundType = _vue.company.fundType + ''
      _vue.uploadedImageUrl = _vue.company.companyLogo
      _vue.uploadedImageUrlLicense = _vue.company.companyLicense
    },
    submitCompanyForm () {
      let _vue = this
      if (Global.verification('str', _vue.companyForm.companyName) && Global.verification('str', _vue.companyForm.registrationTime) && Global.verification('str', _vue.companyForm.companyAddress) && Global.verification('str', _vue.companyForm.registeredFund) && Global.verification('str', _vue.companyForm.legalName) && Global.verification('obj', _vue.industrialCategoryArr)) {
        // 提交公司信息
        let _vue = this
        _vue.companyForm.industrialCategory = _vue.industrialCategoryArr.toString()
        _vue.companyForm.companyLogo = _vue.uploadData.key || _vue.company.companyLogo
        _vue.companyForm.companyLicense = _vue.uploadDataLicense.key || _vue.company.companyLicense
        _vue.companyForm.bp = _vue.uploadDataBp.key || _vue.company.bp
        console.log('before submit company form')
        _vue.companyForm = _.omit(_vue.companyForm, 'createTime')
        console.log(_vue.companyForm)
        _vue.$http.post('/api/v1.0/fa/company/addProjectCompany', {
          projectId: _vue.project.id,
          faCompany: _vue.companyForm
        }).then(res => {
          _vue.companyFormDialogVisible = false
          _vue.$message({
            message: '提交成功',
            center: true,
            type: 'success'
          })
          _vue.fetchProjectDetail()
        })
      } else {
        _vue.$message({
          message: '请输入必填项',
          type: 'error'
        })
        return false
      }
    },
    editProject () {
      // 编辑项目信息
      let _vue = this
      _vue.setValForProjectForm()
      _vue.projectFormDialogVisible = true
    },
    submitProjectForm (projectForm) {
      let _vue = this
      console.log(Global.verification('financialForecasts', _vue.financialForecasts))
      if (Global.verification('str', _vue.projectForm.project.projectBrief) && Global.verification('obj', _vue.projectForm.project.projectPhase) && Global.verification('str', _vue.projectForm.project.financingAmount) && Global.verification('str', _vue.projectForm.project.assignmentProportion)) {
        // 提交项目信息
        this.updateProject()
      } else {
        let _vue = this
        _vue.$message({
          message: '请输入必填项',
          type: 'error'
        })
        return false
      }
    },
    updateProject () {
      // 更新项目信息
      let _vue = this
      console.log('_vue.projectForm%%%%%%%%%%%%%%%%%%%%%%%%%')
      console.log(_vue.projectForm)
      let projectTerritoryValue = this.projectTerritoryValue ? this.projectTerritoryValue.join(',') : ''
      _vue.projectForm.project.innerLabel = _vue.innerLabelIdArr.toString()
      _vue.projectForm.project.externalLabel = _vue.externalLabelIdArr.toString()
      _vue.projectForm.project.innerLabelArr = _vue.innerLabelIdArr ? _vue.innerLabelIdArr : []
      _vue.projectForm.project.externalLabelArr = _vue.externalLabelIdArr ? _vue.externalLabelIdArr : []
      _vue.projectForm.project.makeOver = _vue.makeOverArr.toString()
      _vue.projectForm.project.bp = _vue.uploadDataBp.key
      _vue.projectForm.project.territory = projectTerritoryValue
      _vue.projectForm.project.roadShowUrl = _vue.roadShowUrl
      _vue.$http.post('/api/v1.0/fa/project/addOrUpdate', _vue.projectForm).then(res => {
        _vue.$message({
          message: '提交成功',
          center: true,
          type: 'success'
        })
        _vue.projectFormDialogVisible = false
        _vue.fetchProjectDetail()
      })
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
      this.uploadedImageUrl = file.response.key
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
    beforeUploadLicense (file) {
      // 上传公司营业执照
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
        let key = 'fa/company/license/' + (new Date().getTime()) + '_' + Global.base64Encode(arr[0]) + '.' + arr[1]
        return _vue.$http.post('/api/v1.0/qiniu/token/img?bucket=moore', {
          type: 1
        }).then(response => {
          _vue.uploadDataLicense.token = response.data.data.token
          _vue.uploadDataLicense.key = key
        })
      }
    },
    uploadProgressLicense () {
      this.uploading = true
    },
    uploadSuccessLicense (res, file) {
      this.uploading = false
      this.uploadedImageUrlLicense = file.response.key
    },
    uploadErrorLicense () {
      this.uploading = false
      this.$message({
        type: 'error',
        message: '文件上传失败，请稍后重试',
        center: true,
        showClose: true
      })
    },
    beforeUploadBp (file) {
      // 上传BP
      let _vue = this
      let arr = Global.splitFileName(file.name)
      let key = 'fa/project/bp/' + (new Date().getTime()) + '_' + Global.base64Encode(arr[0]) + '.' + arr[1]
      return _vue.$http.post('/api/v1.0/qiniu/token/file?bucket=moore', {
        type: 1
      }).then(response => {
        _vue.uploadDataBp.token = response.data.data.token
        _vue.uploadDataBp.key = key
      })
    },
    uploadProgressBp () {
      this.uploadingBp = true
    },
    uploadSuccessBp (res, file) {
      // 上传BP成功
      this.uploadingBp = false
      this.uploadedBpUrl = file.response.key
      this.$message({
        type: 'success',
        message: '上传成功',
        center: true
      })
    },
    uploadErrorBp () {
      // 上传BP失败
      this.uploadingBp = false
      this.$message({
        type: 'error',
        message: '文件上传失败，请稍后重试',
        center: true,
        showClose: true
      })
    },
    closeWidgets (widgets) {
      // 组件弹窗关闭
      if (widgets === 'recommendInvestorDialogVisible') {
        this.recommendInvestorDialogVisible = false
      }
      if (widgets === 'hasRecommendInvestorDialogVisible') {
        this.hasRecommendInvestorDialogVisible = false
      }
      if (widgets === 'recommendSpecialistDialogVisible') {
        this.recommendSpecialistDialogVisible = false
      }
      if (widgets === 'hasRecommendSpecialistDialogVisible') {
        this.hasRecommendSpecialistDialogVisible = false
      }
      if (widgets === 'conferenceDialogVisible') {
        this.conferenceDialogVisible = false
      }
    },
    changeMakeOver () {
      // 修改是否转让
      let _vue = this
      if (_vue.makeOverArr.length === 0) {
        _vue.notMakeOver = ''
      } else {
        if (_vue.makeOverArr.indexOf('1') !== -1) {
          _vue.notMakeOver = true
        } else {
          _vue.notMakeOver = false
        }
      }
    },
    addFinancialForecastsItem () {
      // 添加财务预期
      let _vue = this
      _vue.financialForecasts.push({
        years: '',
        financialForecasts: '',
        fundType: ''
      })
    },
    removeFinancialForecastsItem (index) {
      // 删除财务预期
      let _vue = this
      _vue.financialForecasts.splice(index, 1)
    },
    addSalesQuotaItem () {
      // 添加年销售额
      let _vue = this
      _vue.projectSalesQuota.push({
        years: '',
        salesQuota: '',
        fundType: ''
      })
    },
    removeSalesQuotaItem (index) {
      // 删除年销售额
      let _vue = this
      _vue.projectSalesQuota.splice(index, 1)
    },
    addCoreTeamItem () {
      // 添加核心团队
      let _vue = this
      _vue.coreTeam.push({
        name: '',
        shareHolding: ''
      })
    },
    removeCoreTeamItem (index) {
      // 删除核心团队
      let _vue = this
      _vue.coreTeam.splice(index, 1)
    },
    fetchConferenceList (status) {
      // 获取会议列表
      let _vue = this
      _vue.$http.post('/api/v1.0/fa/projectInvestor/findPageConference', {
        pageNum: 1,
        pageSize: 10,
        parameters: {
          projectUserId: _vue.project.userInfoModel.id,
          status: status
        }
      }).then(res => {
        _vue.conferenceData = [res.data.data.data, res.data.data.total, _vue.pageC]
        _vue.conferenceTitle = _vue.conferenceTitle + ' (' + res.data.data.total + ')'
        _vue.conferenceDialogVisible = true
      })
    },
    openHasRecmdInvestorDialog (type) {
      // 点击打开已推荐弹窗
      let ref = this.$refs.refHasRecommendInvestor
      ref.projectId = this.id
      ref.projectUserId = this.project.userInfoModel.id
      ref.isInterest = type
      ref.canRecommend = this.canRecommend
      ref.fetchNum()
      ref.fetchInvestorList()
      ref.show = true
    },
    openHasRecmdSpecialDialog (type) {
      // 点击打开已推荐弹窗
      let ref = this.$refs.refHasRecommendSpecialist
      ref.projectId = this.id
      ref.isAssess = type
      ref.canRecommend = this.canRecommendSpecialist
      ref.fetchNum()
      ref.fetchSpecialList()
      ref.show = true
    },
    openRecmdSpecialistDialog () {
      // 点击打开推荐技术专家弹窗
      let ref = this.$refs.refRecommendSpecialist
      ref.show = true
      ref.projectId = this.id
      ref.projectTag = this.externalLabels
      ref.initSearchCondition()
      ref.autoRecommend()
      ref.a = false
      ref.pager1 = {
        page: 1,
        size: 10
      }
    },
    openRecmdInvestorDialog () {
      // 点击打开推荐投资人弹窗
      let ref = this.$refs.refRecommendInvestor
      ref.show = true
      ref.projectId = this.id
      ref.project = this.project
      ref.projectTag = this.externalLabels
      ref.initSearchCondition()
      ref.autoRecommend()
      ref.a = false
      ref.pager1 = {
        page: 1,
        size: 10
      }
    },
    // 关闭投资人弹窗
    getRecommendInvestor () {
      this.fetchRecmdInvestorNum()
    },
    // 关闭技术专家弹窗
    getRecommendSpecialist () {
      this.fetchRecmdSpecNum()
    },
    fetchUnReplyMessage () {
      // 获取FA未回复的工单留言
      this.$http.get('/api/v1.0/fa/workOrder/findNotReply?projectUserId=' + this.project.userInfoModel.id).then(res => {
        let result = res.data.data || []
        if (result.length > 0) {
          result = _.sortBy(result, item => {
            return new Date(item.createTime).getTime() * -1
          })
          this.unReplyMessageList = result.splice(0, 3)
        } else {
          this.unReplyMessageList = []
        }
      })
    },
    openMessageListDialog () {
      // 点击打开留言列表
      let ref = this.$refs.refMessageList
      ref.show = true
      ref.projectUserId = this.project.userInfoModel.id
      ref.fetchMessage()
    },
    fetchAllTag () {
      // 获取所有标签
      this.$http.get('/api/v1.0/fa/tag/findAllTag?parentId=0').then(res => {
        this.labelData = res.data.data[0].childTag
        this.processLabelArr = FaCommon.handleAllTag(this.labelData)
      })
    },
    getExternalLabel (val) {
      this.externalLabelIdArr = _.pluck(val, 'id')
      this.externalLabels = _.pluck(val, 'name').toString()
    },
    getInnerLabel (val) {
      this.innerLabelIdArr = _.pluck(val, 'id')
      this.innerLabels = _.pluck(val, 'name').toString()
    },
    openExternalDialog () {
      this.$refs.refExternalLabel.show = true
      this.$refs.refExternalLabel.fetchSenLabel(this.company.industrialCategory)
      // if (this.project.externalLabel && !this.$refs.refExternalLabel.hasChange) {
      // 外显标签需要回显
      let externalLabel = this.project.externalLabel ? this.project.externalLabel.split(',') : []
      window.setTimeout(() => {
        this.$refs.refExternalLabel.setCheckedVal(this.cvrtStrArrToNumArr(externalLabel))
      }, 500)
      // }
    },
    openInnerDialog () {
      this.$refs.refInnerLabel.show = true
      this.$refs.refInnerLabel.fetchSenLabel(this.company.industrialCategory)
      // if (this.project.innerLabel && !this.$refs.refInnerLabel.hasChange) {
      // 内显标签需要回显
      let innerLabel = this.project.innerLabel ? this.project.innerLabel.split(',') : []
      window.setTimeout(() => {
        this.$refs.refInnerLabel.setCheckedVal(this.cvrtStrArrToNumArr(innerLabel))
      }, 500)
      // }
    },
    cvrtStrArrToNumArr (arr) {
      return _.map(arr, item => { return item * 1 })
    },
    handleSendMsg (item) {
      console.log(item)
      this.replyItem = item
      this.replyMessageDialogVisible = true
    },
    handleCancel () {
      // 取消回复留言
      this.replyMessageDialogVisible = false
      this.replyContent = ''
    },
    sendMsg () {
      // 发送消息
      if (this.replyContent.trim() === '') {
        this.$message({
          message: '请输入回复内容',
          center: true,
          type: 'warning'
        })
      } else {
        this.$http.post('/api/v1.0/fa/workOrder/add', {
          userId: this.replyItem.userId,
          contentId: this.replyItem.contentId,
          content: this.replyContent.trim(),
          type: this.replyItem.type,
          replyId: this.replyItem.id
        }).then(() => {
          this.replyMessageDialogVisible = false
          this.$message({
            message: '发送成功',
            center: true,
            type: 'success'
          })
          this.showReply = false
          this.replyContent = ''
          this.fetchUnReplyMessage()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .wrapper {
    box-shadow: 0 2px 8px 0 rgba(0,0,0,.1);
    padding: 20px;
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
      .el-button {
        float: right;
      }
    }
    .cnt-wrap {
      margin-top: 15px;
      > .item {
        padding: 8px 0;
        display: flex;
        align-items: center;
        .title {
          color: #999;
          width: 100px;
          margin-right: 25px;
        }
        .video {
          width: calc(100% - 150px);
          a {
            width: 100%;
            display:block;
            word-break: break-all;
            word-wrap: break-word;
          }
        }
        .cnt {
          flex: 1;
          .alias-input-status {
            .input {
              width: 60%;
            }
            .cancel {
              color: #909399;
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
            .close-btn {}
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
          font-size: 14px;
          color: #909399;
        }
        .count {
          font-size: 22px;
          color: #409eff;
          text-decoration: underline;
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
      .action-wrap {}
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
  .split-line-wrap {
    border-bottom: 1px dashed #909399;
    position: relative;
    margin: 40px 0;
    .text {
      background-color: #fff;
      position: absolute;
      left: 50%;
      padding: 10px 20px;
      color: #303133;
      transform: translate3d(-50%, -50%, 0);
    }
  }
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
  .el-dialog-right.el-dialog__wrapper {
    > :first-child {
      margin: 0 auto !important;
      margin-right: 0 !important;
      height: 100% !important;
      width: 40%;
      > :last-child {
        background-color: #fff;
      }
    }
    .dialog-form{
      overflow: auto;
    }
  }
  .reply-dialog {
    .reply-wrap {
      .top {
        margin-bottom: 10px;
        .name {
          color: #409eff;
        }
      }
      .action-wrap {
        margin-top: 20px;
      }
    }
  }
  .upload-image {
    width: 100px;
  }
  .license-img {
    width: 160px;
  }
  .sales-quota-list {
    .sales-quota-item {
      display: flex;
      margin-bottom: 10px;
      align-items: center;
      .sales-quota {
        width: 150px;
        margin-right: 10px;
      }
      .fund-type {
        width: 100px;
        margin-right: 10px;
      }
      .years {
        width: 100px;
        margin-right: 20px;
      }
      .icon {
        font-size: 22px;
        cursor: pointer;
      }
    }
  }
  .core-team-list {
    .core-team-item {
      display: flex;
      margin-bottom: 10px;
      align-items: center;
      .name {
        margin-right: 4px;
      }
      .icon {
        margin-left: 20px;
        font-size: 22px;
        cursor: pointer;
      }
    }
  }
  .message-block {
    .view-more {
      float: right;
      font-weight: normal;
      &:hover {
        color: #409eff;
        text-decoration: underline;
        cursor: pointer;
      }
    }
    .message-list {
      .message-item {
        .message-time {
          display: flex;
          align-items: center;
          font-size: 14px;
          .time {
            color: #909399;
            margin-right: 5px;
          }
          .name {
            color: #409eff;
            cursor: pointer;
            text-decoration: underline;
          }
        }
        .text {
          margin-top: 10px;
        }
        margin-bottom: 10px;
      }
    }
  }
  .userinfo-tip {
    font-size: 13px;
    line-height: 1;
    margin-top: 10px;
  }
  .link {
    color: #409eff;
    text-decoration: underline;
    cursor: pointer;
  }
  .back-link {
    color: #409eff;
    cursor: pointer;
    margin-bottom: 20px;
    margin-left: 10px;
    display: inline-block;
  }
  .breadcrumb-wrap {
    margin: 10px 0 25px 5px;
    .el-breadcrumb__item {
      font-size: 15px;
    }
  }
  #oTable {
    box-shadow:0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
    .title {
      background-color:#409eff;
      color:#fff;
      font-size:13px;
      height:50px;
      th {
        padding: 12px 0;
        min-width: 60px;
        text-align:center;
      }
    }
    td {
      padding: 12px 0;
      min-width: 60px;
      text-align:center;
    }
    .tableTR {
      font-size:12px;
      td {
        padding:0;
        font-size: 13px;
        text-align:center;
        min-height: 40px;
        input, textarea {
          border:none;//去除边框
          border-radius:0;
          box-shadow: 0px 0px 0px 0px;//去除阴影
          background-color:transparent;
          width: 100%;
          min-height: 40px;
          padding: 0;
          margin: 0;
          border:0;outline:0;
        }
        textarea {

        }
      }
    }
  }
</style>
