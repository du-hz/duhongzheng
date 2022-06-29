<template>
  <div class="detail-wrap company">
    <div class="main-title">{{customer.companyShortname}}</div>
    <div class="cnt-block basic-info">
      <div class="sub-title">
        <span class="title">基本信息</span>
        <el-button type="primary" size="small" @click="editBasicInfo" v-if="actionPermission.showCompanyUpdate">编辑</el-button>
      </div>
      <div class="basic-info-cnt el-table-style">
        <el-row type="flex" align="middle">
          <el-col :span="4">
            <span>企业简称</span>
          </el-col>
          <el-col :span="8">
            <span>{{customer.companyShortname}}</span>
          </el-col>
          <el-col :span="4">
            <span>企业全称</span>
          </el-col>
          <el-col :span="8">
            <span>{{customer.companyFullname}}</span>
          </el-col>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col :span="4">
            <span>英文名</span>
          </el-col>
          <el-col :span="8">
            <span>{{customer.enCompanyFullname}}</span>
          </el-col>
          <el-col :span="4">
            <span>别名</span>
          </el-col>
          <el-col :span="8">
            <span>{{customer.alias}}</span>
          </el-col>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col :span="4">
            <span>商务类型</span>
          </el-col>
          <el-col :span="8">
            <span>{{customer.bizType}}</span>
          </el-col>
          <el-col :span="4">
            <span>所在产业链</span>
          </el-col>
          <el-col :span="8">
            <span>{{customer.industryChainManyName}}</span>
          </el-col>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col :span="4">
            <span>成立日期</span>
          </el-col>
          <el-col :span="8">
            <span>{{customer.establishedDate}}</span>
          </el-col>
          <el-col :span="4">
            <span>企业官网</span>
          </el-col>
          <el-col :span="8">
            <span>
              <a class="link" :href="customer.website" target="_blank">{{customer.website}}</a>
            </span>
          </el-col>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col :span="4">
            <span>营业执照</span>
          </el-col>
          <el-col :span="8">
            <span v-if="customer.businessLicense !== ''">
              <a :href="customer.businessLicense | filterQiniuImage" class="action-link" target="_blank">点击查看</a>
            </span>
            <span v-else-if="customer.businessLicense === ''">
              <span>-</span>
            </span>
          </el-col>
          <el-col :span="4">
            <span>社会统一信用号</span>
          </el-col>
          <el-col :span="8">
            <span>{{customer.socialCreditNumber}}</span>
          </el-col>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col :span="4">
            <span>总部</span>
          </el-col>
          <el-col :span="8">
            <span>{{customer.hqAddress}}</span>
          </el-col>
          <el-col :span="4">
            <span>分公司位置</span>
          </el-col>
          <el-col :span="8">
            <span>{{customer.branchLocation}}</span>
          </el-col>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col :span="4">
            <span>企业规模</span>
          </el-col>
          <el-col :span="8">
            <span>{{scaleName}}</span>
          </el-col>
          <el-col :span="4">
            <span>主营业务/核心产品</span>
          </el-col>
          <el-col :span="8">
            <span>{{customer.mainProduct}}</span>
          </el-col>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col :span="4">
            <span>应用领域</span>
          </el-col>
          <el-col :span="8">
            <span>{{industryName}}</span>
          </el-col>
          <el-col :span="4">
            <span>销售经理</span>
          </el-col>
          <el-col :span="8">
            <span>{{customer.adminName}}</span>
          </el-col>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col :span="4">
            <span>当前总订单数</span>
          </el-col>
          <el-col :span="8">
            <span>{{customer.totalNo}}</span>
          </el-col>
          <el-col :span="4"></el-col>
          <el-col :span="8"></el-col>
        </el-row>
      </div>
    </div>
    <!-- 关联账号 -->
    <!-- 账号部分单独拿出来，不掺杂在公司信息维护中 -->
    <div class="cnt-block subaccount-info" v-if="false">
      <div class="sub-title">
        <span class="title">已关联账号</span>
        <el-button type="primary" size="small" @click="addSubaccount">新增</el-button>
      </div>
      <div class="subaccount-info-cnt">
        <table class="info-cnt-table">
          <colgroup>
            <col width="60">
            <col width="120">
            <col width="120">
            <col width="150">
            <col width="180">
            <col width="80">
            <col width="100">
            <col>
          </colgroup>
          <thead>
            <tr>
              <th>序号</th>
              <th>联系人</th>
              <th>电话</th>
              <th>邮箱</th>
              <th>注册时间</th>
              <th>下单数</th>
              <th>当前状态</th>
              <th>身份</th>
            </tr>
          </thead>
          <tbody v-if="customer.subs.length > 0">
            <tr v-for="(sub, index) in customer.subs" :key="'c_' + index">
              <td>
                <span>{{index+1}}</span>
              </td>
              <td>
                <span class="action-link" @click="subDetail(sub.id)">{{sub.name}}</span>
              </td>
              <td>
                <span>{{sub.mobile}}</span>
              </td>
              <td>
                <span>{{sub.email}}</span>
              </td>
              <td>
                <span>{{sub.registerTime}}</span>
              </td>
              <td>
                <span v-if="sub.orderCount === 0">{{sub.orderCount}}</span>
                <span v-if="sub.orderCount > 0" class="action-link" @click="orderList(sub.email)">{{sub.orderCount}}</span>
              </td>
              <td>
                <span>{{sub.isEmailValidate | filterEmailStatus}}</span>
              </td>
              <td>
                <span v-if="sub.isMaster === 1">主联系人</span>
                <span v-if="sub.isMaster === 0">普通 <span class="action-link" @click="setMaster(sub.id)">设为主联系人</span></span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 财务信息 -->
    <div class="cnt-block">
      <div class="sub-title">
        <span class="title">财务信息</span>
        <el-button type="primary" size="small" @click="editFinance" v-if="actionPermission.showCompanyUpdate">编辑</el-button>
      </div>
      <div class="finance-info-block">
        <div class="line-title">注册资本</div>
        <div class="block-item-wrap el-table-style">
          <el-row>
            <el-col :span="4">
              <span class="form-item-title">注册资本</span>
            </el-col>
            <el-col :span="20">
              <span>{{customer.financial.registerCapital}}</span>
            </el-col>
          </el-row>
        </div>
        <div class="line-title">前五股东情况</div>
        <div class="block-item-wrap el-table-style">
          <el-row>
            <el-col :span="4">
              <span class="form-item-title">前五股东情况</span>
            </el-col>
            <el-col :span="20">{{customer.financial.top5Shareholders}} || {{customer.financial.foreignProportionOfInvestment}}</el-col>
          </el-row>
          <el-row v-for="(item, index) in customer.financial.shareHolders" :key="index" type="flex" align="middle">
            <el-col :span="8">
              <div class="list-item-wrap">
                <span class="title">股东姓名</span>
                <span class="text">{{item.investorName}}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="list-item-wrap">
                <span class="title">数量</span>
                <span class="text">{{item.amount}}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="list-item-wrap">
                <span class="title">股份占比</span>
                <span class="text">{{item.proportion}}%</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="line-title">商业状况</div>
        <div class="block-item-wrap el-table-style">
          <div class="add-item" v-for="(item, index) in customer.financial.revenues" :key="index">
            <el-row>
              <el-col :span="12">
                <div class="list-item-wrap">
                  <span class="title">年份</span>
                  <span class="text">{{item.year}}</span>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="list-item-wrap">
                  <span class="title">营业收入</span>
                  <span class="text">{{item.revenue}}</span>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <div class="list-item-wrap">
                  <span class="title">利润率</span>
                  <span class="text">{{item.sgm}}</span>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="list-item-wrap">
                  <span class="title">净利润</span>
                  <span class="text">{{item.netProfot}}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="line-title">银行账户</div>
        <div class="block-item-wrap el-table-style">
          <el-row>
            <el-col :span="4">
              <span class="form-item-title">银行账户</span>
            </el-col>
            <el-col :span="20">
              <span>{{customer.financial.bankAccount}}</span>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 管理信息 -->
    <div class="cnt-block">
      <div class="sub-title">
        <span class="title">管理信息</span>
        <el-button type="primary" size="small" v-if="actionPermission.showCompanyUpdate">编辑</el-button>
      </div>
      <div class="manage-info-block">
        <div class="line-title">管理层信息</div>
        <div class="block-item-wrap el-table-style">
          <template v-for="(item, index) in customer.manager.managers" :id="index">
            <el-row :key="'1_' + index">
              <el-col :span="4">
                <span>身份</span>
              </el-col>
              <el-col :span="8">
                <span>{{item.jobTitle}}</span>
              </el-col>
              <el-col :span="4">
                <span>姓名</span>
              </el-col>
              <el-col :span="8">
                <span>{{item.name}}</span>
              </el-col>
            </el-row>
            <el-row :key="'2_' + index">
              <el-col :span="4">
                <span>背景介绍</span>
              </el-col>
              <el-col :span="20">
                <span>{{item.brief}}</span>
              </el-col>
            </el-row>
          </template>
        </div>
        <div class="line-title">研发信息</div>
        <div class="block-item-wrap el-table-style">
          <el-row>
            <el-col :span="4">
              <span>研发人员总人数</span>
            </el-col>
            <el-col :span="8">
              <span>{{customer.manager.rdNumber}}</span>
            </el-col>
            <el-col :span="4">
              <span>系统</span>
            </el-col>
            <el-col :span="8">
              <span>{{customer.manager.system}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <span>架构</span>
            </el-col>
            <el-col :span="8">
              <span>{{customer.manager.architecture}}</span>
            </el-col>
            <el-col :span="4">
              <span>BEOL</span>
            </el-col>
            <el-col :span="8">
              <span>{{customer.manager.beol}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <span>软件</span>
            </el-col>
            <el-col :span="8">
              <span>{{customer.manager.software}}</span>
            </el-col>
            <el-col :span="4"></el-col>
            <el-col :span="8"></el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 产品进度 -->
    <div class="cnt-block">
      <div class="sub-title">
        <span class="title">产品进度</span>
        <el-button type="primary" size="small" @click="editSchedule" v-if="actionPermission.showCompanyUpdate">编辑</el-button>
      </div>
      <div class="block-item-wrap el-table-style row-table">
        <el-row class="table-head">
          <el-col :span="4">产品</el-col>
          <el-col :span="4">应用</el-col>
          <el-col :span="4">状态</el-col>
          <el-col :span="4">NTO计划</el-col>
          <el-col :span="4">wafer/monter</el-col>
          <el-col :span="4">工艺需求</el-col>
        </el-row>
        <el-row v-for="(item, index) in customer.schedules" :key="index">
          <el-col :span="4">
            <span>{{item.product}}</span>
          </el-col>
          <el-col :span="4">
            <span>{{item.application}}</span>
          </el-col>
          <el-col :span="4">
            <span>{{item.status}}</span>
          </el-col>
          <el-col :span="4">
            <span>{{item.ntoSchedule}}</span>
          </el-col>
          <el-col :span="4">
            <span>{{item.monthWafer}}</span>
          </el-col>
          <el-col :span="4">
            <span>{{item.processRequirment}}</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 市场分析 -->
    <div class="cnt-block">
      <div class="sub-title">
        <span class="title">市场分析</span>
        <el-button type="primary" size="small" @click="editMarket" v-if="actionPermission.showCompanyUpdate">编辑</el-button>
      </div>
      <div class="line-title">公司SWOT分析</div>
      <div class="block-item-wrap el-table-style">
        <el-row>
          <el-col :span="3">
            <span>优势</span>
          </el-col>
          <el-col :span="21">
            <span>{{customer.marketSwotVo.strengths}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <span>机会</span>
          </el-col>
          <el-col :span="21">
            <span>{{customer.marketSwotVo.opportunities}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <span>劣势</span>
          </el-col>
          <el-col :span="21">
            <span>{{customer.marketSwotVo.weaknesses}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <span>挑战</span>
          </el-col>
          <el-col :span="21">
            <span>{{customer.marketSwotVo.threats}}</span>
          </el-col>
        </el-row>
      </div>
      <div class="line-title">竞争对手分析</div>
      <div class="block-item-wrap el-table-style row-table">
        <el-row class="table-head">
          <el-col :span="4">产品</el-col>
          <el-col :span="4">总有效市场</el-col>
          <el-col :span="4">公司</el-col>
          <el-col :span="4">市场份额</el-col>
          <el-col :span="4">优势</el-col>
          <el-col :span="4">劣势</el-col>
        </el-row>
        <el-row v-for="(item, index) in customer.marketSwotVo.compares" :key="index">
          <el-col :span="4">
            <span>{{item.product}}</span>
          </el-col>
          <el-col :span="4">
            <span>{{item.tam}}</span>
          </el-col>
          <el-col :span="4">
            <span>{{item.companyName}}</span>
          </el-col>
          <el-col :span="4">
            <span>{{item.marketShare}}</span>
          </el-col>
          <el-col :span="4">
            <span>{{item.strongPoint}}</span>
          </el-col>
          <el-col :span="4">
            <span>{{item.weakPoint}}</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 编辑公司信息 -->
    <el-dialog title="编辑基本信息" width="40%" :visible.sync="dialogBasicVisible">
      <div class="form-wrap">
        <el-form :model="basicForm" ref="basicForm" :rules="rules">
          <el-form-item label="公司简称" labelWidth="140px">
            <el-input
              placeholder="公司简称"
              v-model="basicForm.companyShortname"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="公司全称" labelWidth="140px">
            <el-input
              placeholder="公司全称"
              v-model="basicForm.companyFullname"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="公司别称" labelWidth="140px">
            <el-input
              placeholder="公司别称"
              v-model="basicForm.alias"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="英文名" labelWidth="140px">
            <el-input
              placeholder="英文名"
              v-model="basicForm.enCompanyFullname"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="公司性质" labelWidth="140px">
            <el-select v-model="basicForm.bizType" placeholder="请选择" style="width: 100%;">
              <el-option label="IDM" value="idm"></el-option>
              <el-option label="System" value="system"></el-option>
              <el-option label="Others" value="others"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="成立日期" labelWidth="140px">
            <el-date-picker
              v-model="basicForm.establishedDate"
              type="date"
              placeholder="成立日期"
              style="width: 100%;"
              clearable>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="企业官网" labelWidth="140px">
            <el-input
              placeholder="企业官网"
              v-model="basicForm.website"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="公司总部" labelWidth="140px">
            <el-input
              placeholder="公司总部"
              v-model="basicForm.hqAddress"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="分公司位置" labelWidth="140px">
            <el-input
              placeholder="分公司位置"
              v-model="basicForm.branchLocation"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="企业规模" labelWidth="140px">
            <el-select v-model="basicForm.scale" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in scaleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主营业务/核心产品" labelWidth="140px">
            <el-input
              placeholder="主营业务/核心产品"
              v-model="basicForm.mainProduct"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="所在产业链" labelWidth="140px">
            <el-select v-model="basicForm.industryChainManyId" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in industryChainOpts"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="应用领域" labelWidth="140px">
            <el-select v-model="basicForm.industry" multiple placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in industryOpts"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="营业执照" labelWidth="140px">
            <el-input
              placeholder="营业执照"
              v-model="basicForm.businessLicense"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="社会统一信用号" labelWidth="140px">
            <el-input
              placeholder="社会统一信用号"
              v-model="basicForm.socialCreditNumber"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="销售经理" labelWidth="140px">
            <el-select v-model="basicForm.adminId" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in salesOptions"
                :key="item.adminId"
                :label="item.adminName"
                :value="item.adminId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="action-wrap">
        <el-button @click="closeBasicForm('basicForm')">取消</el-button>
        <el-button type="primary" @click="submitBasicForm('basicForm')">提交</el-button>
      </div>
    </el-dialog>

    <!-- 新增关联子账号 -->
    <el-dialog title="新增关联账号" width="40%" :visible.sync="dialogAccountVisible">
      <el-form class="form" :model="accountForm" ref="accountForm" :rules="rules">
        <el-form-item prop="name" label="姓名" labelWidth="100px">
          <el-input
            placeholder="姓名"
            v-model="accountForm.name"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="联系电话" labelWidth="100px">
          <el-input
            placeholder="联系电话"
            v-model="accountForm.mobile"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱地址" labelWidth="100px">
          <el-input
            placeholder="邮箱地址"
            v-model="accountForm.email"
            clearable>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="action-wrap">
        <el-button @click="closeAccountForm('accountForm')">取 消</el-button>
        <el-button type="primary" @click="submitAccountForm('accountForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑财务信息 -->
    <el-dialog title="编辑财务信息" width="40%" :visible.sync="dialogFinanceVisible">
      <div class="form-wrap">
        <el-form :model="financeForm" ref="financeForm" :rules="rules" label-position="left">
          <div class="line-title" style="margin-top: 0;">注册资本</div>
          <el-form-item label="注册资本" labelWidth="100px">
            <el-input v-model="financeForm.registerCapital"></el-input>
          </el-form-item>
          <div class="line-title">前五股东情况</div>
          <el-form-item>
            <el-form :inline="true" class="inline-form">
              <el-form-item label="投资人情况" labelWidth="100px">
                <el-select v-model="financeForm.top5Shareholders" style="width: 180px;">
                  <el-option label="只有国内" value="1"></el-option>
                  <el-option label="有国外" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="国外投资占比(%)" labelWidth="120px" v-if="financeForm.top5Shareholders === '2'">
                <el-input v-model="financeForm.foreignProportionOfInvestment" style="width: 180px;"></el-input>
              </el-form-item>
            </el-form>
          </el-form-item>
          <div class="shareHolders item-list">
            <div class="holder-item add-item-wrap" v-for="(holder, index) in financeForm.shareHolders" :key="index">
              <div class="action-wrap" title="删除" @click="removeHolder(index)">
                <i class="el-icon-delete"></i>
              </div>
              <el-form-item label="姓名" labelWidth="100px">
                <el-input v-model="holder.investorName"></el-input>
              </el-form-item>
              <el-form-item label="持股数量" labelWidth="100px">
                <el-input v-model="holder.amount"></el-input>
              </el-form-item>
              <el-form-item label="投资占比(%)" labelWidth="100px">
                <el-input v-model="holder.proportion"></el-input>
              </el-form-item>
            </div>
            <div class="action">
              <el-button type="primary" size="small" @click="addHolder">+Add</el-button>
            </div>
          </div>
          <div class="line-title">商业状况</div>
          <div class="revenues-list item-list">
            <div class="revenue-item add-item-wrap" v-for="(revenue, index) in financeForm.revenues" :key="index">
              <div class="action-wrap" title="删除" @click="removeRevenue(index)">
                <i class="el-icon-delete"></i>
              </div>
              <el-form-item label="年份" labelWidth="110px">
                <el-select v-model="revenue.year" style="width: 100%">
                  <el-option
                    v-for="item in yearOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="营业收入(US$)" labelWidth="110px">
                <el-input v-model="revenue.revenue"></el-input>
              </el-form-item>
              <el-form-item label="利润率(%)" labelWidth="110px">
                <el-input v-model="revenue.sgm"></el-input>
              </el-form-item>
              <el-form-item label="净利润(US$)" labelWidth="110px">
                <el-input v-model="revenue.netProfot"></el-input>
              </el-form-item>
            </div>
            <div class="action">
              <el-button type="primary" size="small" @click="addRevenue">+Add</el-button>
            </div>
          </div>
          <div class="line-title">银行账户</div>
          <el-form-item label="银行账户" labelWidth="100px">
            <el-input v-model="financeForm.bankAccount"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="action-wrap">
        <el-button @click="closeFinanceForm('financeForm')">取消</el-button>
        <el-button type="primary" @click="submitFinanceForm('financeForm')">提交</el-button>
      </div>
    </el-dialog>
    <!-- 编辑管理信息 -->
    <!-- 编辑产品信息 -->
    <el-dialog title="编辑产品信息" width="40%" :visible.sync="dialogScheduleVisible">
      <div class="form-wrap">
        <el-form :model="scheduleForm" ref="scheduleForm" :rules="rules" label-position="left">
          <div class="products-list item-list">
            <div class="product-item add-item-wrap" v-for="(schedule, index) in scheduleForm.schedules" :key="index">
              <div class="action-wrap" title="删除" @click="removeSchedule(index)">
                <i class="el-icon-delete"></i>
              </div>
              <el-form-item label="产品" labelWidth="110px">
                <el-input v-model="schedule.product"></el-input>
              </el-form-item>
              <el-form-item label="应用" labelWidth="110px">
                <el-input v-model="schedule.application"></el-input>
              </el-form-item>
              <el-form-item label="状态" labelWidth="110px">
                <el-input v-model="schedule.status"></el-input>
              </el-form-item>
              <el-form-item label="NTO计划" labelWidth="110px">
                <el-input v-model="schedule.ntoSchedule"></el-input>
              </el-form-item>
              <el-form-item label="wafer/monter" labelWidth="110px">
                <el-input v-model="schedule.monthWafer"></el-input>
              </el-form-item>
              <el-form-item label="工艺需求" labelWidth="110px">
                <el-input v-model="schedule.processRequirment"></el-input>
              </el-form-item>
            </div>
            <div class="action">
              <el-button type="primary" size="small" @click="addSchedule">+Add</el-button>
            </div>
          </div>
        </el-form>
      </div>
      <div class="action-wrap">
        <el-button @click="closeScheduleForm('scheduleForm')">取消</el-button>
        <el-button type="primary" @click="submitScheduleForm('scheduleForm')">提交</el-button>
      </div>
    </el-dialog>
    <!-- 编辑市场分析信息 -->
    <el-dialog title="编辑市场分析信息" width="40%" :visible.sync="dialogMarketVisible">
      <div class="form-wrap">
        <el-form :model="marketForm" ref="marketForm" :rules="rules" label-position="left">
          <el-form-item label="优势">
            <el-input v-model="marketForm.strengths"></el-input>
          </el-form-item>
          <el-form-item label="机会">
            <el-input v-model="marketForm.opportunities"></el-input>
          </el-form-item>
          <el-form-item label="劣势">
            <el-input v-model="marketForm.weaknesses"></el-input>
          </el-form-item>
          <el-form-item label="挑战">
            <el-input v-model="marketForm.threats"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="compares-list item-list">
              <div class="compare-item add-item-wrap" v-for="(compare, index) in marketForm.compares" :key="index">
                <div class="action-wrap" title="删除" @click="removeCompare(index)">
                  <i class="el-icon-delete"></i>
                </div>
                <el-form-item label="产品" labelWidth="110px">
                  <el-input v-model="compare.product"></el-input>
                </el-form-item>
                <el-form-item label="总有效市场" labelWidth="110px">
                  <el-input v-model="compare.tam"></el-input>
                </el-form-item>
                <el-form-item label="公司" labelWidth="110px">
                  <el-input v-model="compare.companyName"></el-input>
                </el-form-item>
                <el-form-item label="市场份额" labelWidth="110px">
                  <el-input v-model="compare.marketShare"></el-input>
                </el-form-item>
                <el-form-item label="优势" labelWidth="110px">
                  <el-input v-model="compare.strongPoint"></el-input>
                </el-form-item>
                <el-form-item label="劣势" labelWidth="110px">
                  <el-input v-model="compare.weakPoint"></el-input>
                </el-form-item>
              </div>
              <div class="action">
                <el-button type="primary" size="small" @click="addCompare">+Add</el-button>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="action-wrap">
        <el-button @click="closeMarketForm('marketForm')">取消</el-button>
        <el-button type="primary" @click="submitMarketForm('marketForm')">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Global from 'assets/js/global'
import _ from 'underscore'

export default {
  data () {
    return {
      id: this.$route.params.id,
      customer: {
        industry: '',
        subs: [],
        financial: {},
        manager: {},
        schedules: [],
        marketSwotVo: {}
      },
      accountForm: {
        name: '',
        mobile: '',
        email: ''
      },
      rules: {},
      dialogAccountVisible: false,
      dialogBasicVisible: false,
      basicForm: {
        companyFullname: '',
        companyShortname: '',
        enCompanyFullname: '',
        bizType: '',
        establishedDate: '',
        website: '',
        hqAddress: '',
        branchLocation: '',
        scale: '',
        industryChainManyId: '',
        industryChainManyName: '',
        mainProduct: '',
        adminId: '',
        adminName: '',
        industry: [],
        businessLicense: '',
        socialCreditNumber: '',
        alias: ''
      },
      scaleOptions: Global.CONSTANT.SCALE,
      industryOpts: Global.CONSTANT.INDUSTRY,
      industryChainOpts: [],
      salesOptions: [],
      dialogFinanceVisible: false,
      financeForm: {
        customerId: '',
        registerCapital: '',
        top5Shareholders: '',
        foreignProportionOfInvestment: '',
        shareHolders: [],
        revenues: [],
        bankAccount: ''
      },
      yearOpts: [],
      dialogScheduleVisible: false,
      scheduleForm: {
        schedules: []
      },
      dialogMarketVisible: false,
      marketForm: {
        strengths: '',
        opportunities: '',
        weaknesses: '',
        threats: '',
        compares: []
      },
      actionPermission: {
        showCompanyAdd: Global.hasActionPermission('company_add'),
        showCompanyUpdate: Global.hasActionPermission('company_update'),
        showCompanyView: Global.hasActionPermission('company_view'),
        showCompanyDelete: Global.hasActionPermission('company_delete')
      }
    }
  },
  created () {
    this.fetchCustomerInfo()
    this.fetchSalesData()
    this.fetchChain()
    this.initYearOpts()
  },
  computed: {
    industryName () {
      let name = ''
      if (this.customer.industry !== '') {
        let arr = this.customer.industry.split(',')
        console.log(arr)
        _.each(arr, (id) => {
          let industry = _.findWhere(Global.CONSTANT.INDUSTRY, {value: parseInt(id)})
          if (industry !== undefined) {
            let label = industry.label
            name += label + ','
          }
        })
      }
      return name.substring(0, name.length - 1)
    },
    scaleName () {
      let name = ''
      if (this.customer.scale !== '') {
        let scale = _.findWhere(Global.CONSTANT.SCALE, {value: parseInt(this.customer.scale)})
        if (scale !== undefined) {
          name = scale.label
        }
      }
      return name
    }
  },
  methods: {
    initYearOpts () {
      // 初始化年份选择区间
      let year = new Date().getFullYear()
      let minYear = year - 10
      let maxYear = year + 10
      for (let i = minYear; i <= maxYear; i++) {
        let yearItem = {
          label: i + '',
          value: i + ''
        }
        this.yearOpts.push(yearItem)
      }
    },
    fetchSalesData () {
      // 获取销售数据
      let _vue = this
      _vue.$http.get('/api/v1.0/admin/manager/sale').then((response) => {
        _vue.salesOptions = response.data.data.sales
      })
    },
    fetchChain () {
      // 查询产业链
      let _vue = this
      _vue.$http.get('/api/v1.0/customer/industrychains').then((response) => {
        _vue.industryChainOpts = response.data.data.industryChains
      })
    },
    fetchCustomerInfo () {
      let _vue = this
      _vue.$http.get('/api/v1.0/customer?id=' + _vue.id).then((response) => {
        _vue.customer = response.data.data.customer
        _vue.customer.industryChainManyName = ((_.findWhere(_vue.industryChainOpts, {id: parseInt(_vue.customer.industryChainManyId)}) || {}).name) || ''
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    subDetail (id) {
      this.$router.push({
        name: 'subaccountDetail',
        params: {
          id: id
        }
      })
    },
    orderList (email) {
      // 跳转到订单列表
      this.$router.push({
        path: '/order/tapeout',
        query: {
          email: email
        }
      })
    },
    editBasicInfo () {
      this.basicForm.companyFullname = this.customer.companyFullname
      this.basicForm.companyShortname = this.customer.companyShortname
      this.basicForm.enCompanyFullname = this.customer.enCompanyFullname
      this.basicForm.alias = this.customer.alias
      this.basicForm.bizType = this.customer.bizType
      this.basicForm.establishedDate = this.customer.establishedDate
      this.basicForm.website = this.customer.website
      this.basicForm.hqAddress = this.customer.hqAddress
      this.basicForm.branchLocation = this.customer.branchLocation
      this.basicForm.scale = parseInt(this.customer.scale) || ''
      this.basicForm.industryChainManyId = parseInt(this.customer.industryChainManyId) || ''
      this.basicForm.mainProduct = this.customer.mainProduct
      this.basicForm.adminId = parseInt(this.customer.adminId) || ''
      this.basicForm.industry = _.map(this.customer.industry.split(','), (item) => { if (item) return parseInt(item) })
      this.basicForm.businessLicense = this.customer.businessLicense
      this.basicForm.socialCreditNumber = this.customer.socialCreditNumber
      this.dialogBasicVisible = true
    },
    addSubaccount () {
      this.dialogAccountVisible = true
    },
    closeAccountForm (formName) {
      this.$refs[formName].resetFields()
      this.dialogAccountVisible = false
    },
    submitAccountForm () {
      // TODO: 表单验证 - 验证邮箱是否存在
      let _vue = this
      _vue.$http.post('/api/v1.0/customer/sub', {
        name: _vue.accountForm.name,
        email: _vue.accountForm.email,
        mobile: _vue.accountForm.mobile,
        isMaster: 0,
        customerId: _vue.id
      }).then(() => {
        _vue.$message({
          type: 'success',
          message: '添加关联账号成功',
          center: true
        })
        _vue.dialogAccountVisible = false
        _vue.fetchCustomerInfo()
      }).catch(() => {
        // TODO: 邮箱验证出错
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    closeBasicForm (formName) {
      this.$refs[formName].resetFields()
      this.dialogBasicVisible = false
    },
    submitBasicForm (formName) {
      // TODO: 缺少表单验证
      let _vue = this
      _vue.basicForm.adminName = ((_.findWhere(_vue.salesOptions, {adminId: parseInt(_vue.basicForm.adminId)}) || {}).adminName) || ''
      _vue.basicForm.industryChainManyName = ((_.findWhere(_vue.industryChainOpts, {id: parseInt(_vue.basicForm.industryChainManyId)}) || {}).name) || ''
      _vue.$http.put('/api/v1.0/customer', _.extend(_vue.basicForm, {
        id: parseInt(_vue.id),
        industry: _vue.basicForm.industry.toString()
      })).then(() => {
        _vue.$message({
          type: 'success',
          message: '编辑成功',
          center: true
        })
        _vue.dialogBasicVisible = false
        _vue.fetchCustomerInfo()
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    editFinance () {
      // 信息初始化
      this.financeForm = {
        customerId: this.id,
        registerCapital: this.customer.financial.registerCapital,
        top5Shareholders: (this.customer.financial.top5Shareholders || '1') + '',
        foreignProportionOfInvestment: this.customer.financial.foreignProportionOfInvestment,
        shareHolders: this.customer.financial.shareHolders, // 最多五个
        revenues: this.customer.financial.revenues,
        bankAccount: parseInt(this.customer.financial.bankAccount || 0)
      }
      this.dialogFinanceVisible = true
    },
    removeRevenue (index) {
      this.financeForm.revenues.splice(index, 1)
    },
    addRevenue () {
      this.financeForm.revenues.push({
        year: '',
        revenue: '',
        sgm: '',
        netProfot: ''
      })
    },
    removeHolder (index) {
      this.financeForm.shareHolders.splice(index, 1)
    },
    addHolder () {
      // 添加
      if (this.financeForm.shareHolders.length < 5) {
        this.financeForm.shareHolders.push({
          investorName: '',
          amount: '',
          proportion: ''
        })
      }
    },
    closeFinanceForm (formName) {
      // 关闭财务弹窗
      this.$refs[formName].resetFields()
      this.dialogFinanceVisible = false
    },
    submitFinanceForm (formName) {
      // TODO: 表单验证
      let _vue = this
      _vue.$http.put('/api/v1.0/customer/financial', _.extend(_vue.financeForm, {
        customerId: parseInt(_vue.id)
      })).then(() => {
        _vue.$message({
          type: 'success',
          message: '编辑成功',
          center: true
        })
        _vue.dialogFinanceVisible = false
        _vue.fetchCustomerInfo()
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    setMaster (subId) {
      // 设为主联系人
      let _vue = this
      _vue.$http.post('/api/v1.0/customer/sub/master', {
        cusId: _vue.id,
        subId: subId
      }).then(() => {
        _vue.$message({
          type: 'success',
          message: '修改成功',
          center: true
        })
        _vue.fetchCustomerInfo()
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    editSchedule () {
      this.scheduleForm.schedules = this.customer.schedules
      this.dialogScheduleVisible = true
    },
    removeSchedule (index) {
      // 删除产品计划
      this.scheduleForm.schedules.splice(index, 1)
    },
    addSchedule () {
      // 添加产品计划
      this.scheduleForm.schedules.push({
        product: '',
        application: '',
        status: '',
        ntoSchedule: '',
        monthWafer: '',
        processRequirment: ''
      })
    },
    closeScheduleForm (formName) {
      // 关闭产品计划
      this.$refs[formName].resetFields()
      this.dialogScheduleVisible = false
    },
    submitScheduleForm (formName) {
      // 提交产品计划  TODO: 缺少表单验证
      let _vue = this
      _vue.$http.put('/api/v1.0/customer/schedule', {
        customerId: _vue.id,
        schedules: _vue.scheduleForm.schedules
      }).then(() => {
        _vue.$message({
          type: 'success',
          message: '修改成功',
          center: true
        })
        _vue.dialogScheduleVisible = false
        _vue.fetchCustomerInfo()
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    },
    editMarket () {
      this.marketForm = {
        strengths: this.customer.marketSwotVo.strengths,
        opportunities: this.customer.marketSwotVo.opportunities,
        weaknesses: this.customer.marketSwotVo.weaknesses,
        threats: this.customer.marketSwotVo.threats,
        compares: this.customer.marketSwotVo.compares
      }
      this.dialogMarketVisible = true
    },
    addCompare () {
      this.marketForm.compares.push({
        product: '',
        tam: '',
        companyName: '',
        marketShare: '',
        strongPoint: '',
        weakPoint: ''
      })
    },
    removeCompare (index) {
      this.marketForm.compares.splice(index, 1)
    },
    closeMarketForm (formName) {
      this.$refs[formName].resetFields()
      this.dialogMarketVisible = false
    },
    submitMarketForm (formName) {
      // TODO: 表单校验
      let _vue = this
      _vue.$http.put('/api/v1.0/customer/market', {
        customerId: _vue.id,
        strengths: _vue.marketForm.strengths,
        opportunities: _vue.marketForm.opportunities,
        weaknesses: _vue.marketForm.weaknesses,
        threats: _vue.marketForm.threats,
        compares: _vue.marketForm.compares
      }).then(() => {
        _vue.$message({
          type: 'success',
          message: '修改成功',
          center: true
        })
        this.dialogMarketVisible = false
        _vue.fetchCustomerInfo()
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '请稍后重试',
          center: true
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~assets/css/variable';
  .detail-wrap {
    .main-title {
      font-size: 22px;
      margin-bottom: 30px;
    }
    .cnt-block {
      margin-bottom: 50px;

      .sub-title {
        .title {
          display: inline-block;
          font-size: 16px;
          color: $primary-color;
        }
        .el-button {
          float: right;
          margin-top: -8px;
        }
        margin-bottom: 20px;
      }
      .el-table-style {
        border-top: 1px solid $border-color;
        border-left: 1px solid $border-color;

        .el-row {
          &:nth-child(odd) {
            .el-col {
              background-color: $secondary-color;
            }
          }

          .el-col {
            border-right: 1px solid $border-color;
            border-bottom: 1px solid $border-color;
            height: 45px;
            line-height: 45px;
            padding-left: 10px;
            font-size: 14px;

            &:nth-child(odd) {
              font-weight: 600;
              color: #454545;
            }
          }
        }
      }
    }
  }
  .link {
    color: $primary-color;
    text-decoration: underline;
    white-space: normal;
    word-wrap: break-word;
    word-break: break-all;
    display: inline-block;
    width: 100%;
    line-height: 20px;
  }
  .action-link {
    color: $primary-color;
    text-decoration: underline;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: break-word;
    word-break: break-all;
    max-width: 120px;
    display: inline-block;
    vertical-align: middle;
    margin-top: -3px;
  }
  .info-cnt-table {
    width: 100%;
    border-left: 1px solid $border-color;
    font-size: 14px;

    th, td {
      border-right: 1px solid $border-color;
      border-bottom: 1px solid $border-color;
      text-align: center;
    }
    th {
      background-color: $primary-color;
      color: #fff;
      font-size: 14px;
      padding: 10px 0;
    }
    td {
      padding: 12px 0;
    }
  }
  .line-title {
    font-size: 15px;
    color: #666;
    height: 20px;
    line-height: 20px;
    border-left: 3px solid $border-color;
    padding-left: 10px;
    margin-bottom: 15px;
    margin-top: 30px;
  }
  .list-item-wrap {
    .title {
      display: inline-block;
      width: 120px;
      border-right: 1px solid $border-color;
      font-weight: 600;
    }
    .text {
      font-weight: normal;
      display: inline-block;
      padding-left: 10px;
    }
  }
  .row-table {
    text-align: center;
    .el-row {
      background-color: #fff;

      .el-col {
        font-weight: normal !important;
      }
    }
    .table-head {
      background-color: $secondary-color;

      .el-col {
        font-weight: 600 !important;
      }
    }
  }
  .form-wrap {
    max-height: 600px;
    overflow-y: auto;
  }
  .add-item-wrap {
    border-bottom: 1px dashed $secondary-color;
    position: relative;
    margin-top: 30px;

    &:first-child {
      padding-top: 0;
    }
    &:last-child {
      border-bottom: none;
    }
    .action-wrap {
      position: absolute;
      top: -30px;
      right: 0;
      cursor: pointer;

      .el-icon-delete {
        font-size: 22px;
        color: #999;

        &:hover {
          color: #666;
        }
      }
    }
  }
  .inline-form {
    width: 100%;
  }
  .compare-item .el-form-item {
    margin-bottom: 15px;
  }
</style>
