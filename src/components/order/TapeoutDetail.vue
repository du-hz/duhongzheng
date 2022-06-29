<template>
  <div class="page-main-container order-detail">
    <div class="head">
      <span class="main-title">订单流水：{{contractNo}}</span>
      <span class="action-link" v-if="false">订单记录</span>
      <el-button v-if="order.status !== 3" class="right-btn" type="primary" size="small" @click="editInfo">编辑基本信息</el-button>
    </div>
    <div class="cnt-block-wrap">
      <div class="cnt-block">
        <table class="cnt-table order-info tr-bg">
          <tbody>
          <tr>
            <td class="title">订单状态</td>
            <td>{{order.status | filterOrderStatus}}</td>
            <td class="title">负责人</td>
            <td>{{order.adminName}}</td>
          </tr>
          <tr>
            <td class="title">联系人</td>
            <td>{{order.name}}</td>
            <td class="title">联系电话</td>
            <td>{{order.mobile}}</td>
          </tr>
          <tr>
            <td class="title">企业</td>
            <td>{{order.companyShortname}}</td>
            <td class="title">职位</td>
            <td>{{order.currentJobTitle}}</td>
          </tr>
          <tr>
            <td class="title">下单时间</td>
            <td>{{order.createTime}}</td>
            <td></td>
            <td></td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="cnt-block">
        <h3 class="table-title">基本信息
      </h3>
        <table class="cnt-table basic-info tr-bg">
          <colgroup>
            <col width="16%">
            <col width="40%">
            <col width="20%">
            <col width="24%">
          </colgroup>
          <tbody>
          <tr>
            <td class="title">
              <p class="zh">代工厂</p>
              <p class="en">Foundry</p>
            </td>
            <td>{{order.supplierName}}</td>
            <td class="title">
              <p class="zh">节点 & 工艺</p>
              <p class="en">Technology Node & Type</p>
            </td>
            <td>{{order.node}} ; {{order.craft}}</td>
          </tr>
          <tr>
            <td class="title">
              <p class="zh">生产类型</p>
              <p class="en">Tape out plan</p>
            </td>
            <td>{{order.tapeoutPlan | filterPlanform}}</td>
            <td class="title">
              <p class="zh">工程批Wafer张数</p>
              <p class="en"></p>
            </td>
            <td>{{order.tapeoutCount}}</td>
          </tr>
          <tr>
            <td class="title">
              <p class="zh">量产备注</p>
              <p class="en"></p>
            </td>
            <td colspan="3">{{order.batchProdRemark}}</td>
          </tr>
          <tr>
            <td class="title">
              <p class="zh">GDS提交时间</p>
              <p class="en">GDS in</p>
            </td>
            <td>{{order.cutoffTime | filterDateformat}}</td>
            <td class="title">
              <p class="zh">同类订单数(已确认)</p>
              <p class="en"></p>
            </td>
            <td>{{order.orderCount}}
            <span v-if="order.orderCount > 0" class="action-link" @click="viewOrder" style="float: right;">查看</span>
            </td>
          </tr>
          <tr>
            <td class="title">
              <p class="zh">价格</p>
              <p class="en"></p>
            </td>
            <td colspan="3">
              <!-- TODO: 价格回显改动 -->
              <span v-if="order.tapeoutPlan === 1">{{order.totalPrice || '-'}}</span>
              <span v-if="order.tapeoutPlan === 2">{{order.curContractPrice || '-'}}</span>
              <span v-if="order.tapeoutPlan === 3">{{order.totalPrice || '-'}}</span>
            </td>
          </tr>
          <tr>
            <td class="title">
              <p class="zh">合同</p>
              <p class="en"></p>
            </td>
            <td>{{order.isSignContract === 0 ? '未签署' : '已签署'}}
            <span v-if="order.status !== 3" class="action-link" @click="signContract">状态变更</span>
              <span class="action-link" style="float: right;">下载合同范本</span>
            </td>
            <td class="title">
              <p class="zh">定金</p>
              <p class="en"></p>
            </td>
            <td>{{order.deposit}}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="cnt-block">
        <h3 class="table-title">更多信息
        <el-button v-if="order.status !== 3" class="right-btn" type="primary" size="small" @click="editMoreInfo">编辑更多信息</el-button>
          <el-button v-if="order.status !== 3" type="primary" class="right-btn" size="small" @click="inviteComplete">邀请完善信息</el-button>
        </h3>
        <table class="cnt-table more-info">
          <tbody>
          <tr>
            <td colspan="4" class="main-title">
              <p class="zh">工艺信息</p>
              <p class="en">Technology Information</p>
            </td>
          </tr>
          <tr>
            <td class="title">
              <p class="zh">Poly/Metal</p>
            </td>
            <td>{{order.poly}} P {{order.metal}} M</td>
            <td class="title">
              <p class="zh">Mask layer</p>
            </td>
            <td>{{order.maskLayer}} layers</td>
          </tr>
          <tr>
            <td class="title">
              <p class="zh">区域面积</p>
              <p class="en">Area Size</p>
            </td>
            <td>{{order.areaSizeWith}} x {{order.areaSizeLength}} mm</td>
            <td class="title">
              <p class="zh">芯片尺寸</p>
              <p class="en">Die Size</p>
            </td>
            <td>{{order.dieSize}}</td>
          </tr>
          <tr>
            <td class="title">
              <p class="zh">芯片尺寸</p>
              <p class="en">Die Size</p>
            </td>
            <td>{{order.dieSize}}</td>
            <td class="title">
              <p class="zh">可选层</p>
              <p class="en">Optional layer</p>
            </td>
            <td>{{order.optionalLayer}} layers</td>
          </tr>
          <tr>
            <td class="title">
              <p class="zh">温度范围</p>
              <p class="en">Temperature Range</p>
            </td>
            <td>{{order.temperatureRange}}</td>
            <td class="title">
              <p class="zh">封装</p>
              <p class="en">Package</p>
            </td>
            <td>{{order.pack}}</td>
          </tr>
          <tr>
            <td colspan="4" class="main-title">
              <p class="zh">IP 信息</p>
              <p class="en">IP Information</p>
            </td>
          </tr>
          <template v-for="(ipItem, index) in order.ips" :id="index">
            <tr class="bg" :key="'1_' + index">
              <td class="title">
                <p class="zh">IP 供应商</p>
                <p class="en">IP Vendor</p>
              </td>
              <td>{{ipItem.ipOwnership}}</td>
              <td class="title">
                <p class="zh">IP 名称</p>
                <p class="en">IP Code</p>
              </td>
              <td>{{ipItem.ipName}}</td>
            </tr>
            <tr :key="'2_' + index">
              <td class="title">
                <p class="zh">主要用途</p>
                <p class="en">Usage</p>
              </td>
              <td>{{ipItem.usage}}</td>
              <td class="title">
                <p class="zh">主要参数</p>
                <p class="en">Main parameters</p>
              </td>
              <td>{{ipItem.mainParameters}}</td>
            </tr>
          </template>
          <tr>
            <td colspan="4" class="main-title">
              <p class="zh">计划</p>
              <p class="en">Schedule</p>
            </td>
          </tr>
          <tr>
            <td class="title">
              <p class="zh">MPW班车日期</p>
              <p class="en">MPW shuttles</p>
            </td>
            <td>{{order.npwShuttles}}</td>
            <td class="title">
              <p class="zh">工程批日期</p>
              <p class="en">Pilot Run Tapeout date</p>
            </td>
            <td>{{order.pilotRunTapeoutDate}}</td>
          </tr>
          <tr>
            <td class="title">
              <p class="zh">量产日期</p>
              <p class="en">Production target</p>
            </td>
            <td>{{order.productionTarget}}</td>
            <td class="title">
            </td>
            <td></td>
          </tr>
          <tr>
            <td colspan="4" class="main-title">
              <p class="zh">产品信息</p>
              <p class="en">Product Information</p>
            </td>
          </tr>
          <tr>
            <td class="title">
              <p class="zh">产品应用</p>
              <p class="en">Application of Product</p>
            </td>
            <td>{{order.applicationOfProduct}}</td>
            <td class="title">
              <p class="zh">功能描述</p>
              <p class="en">Feature Descriptions</p>
            </td>
            <td>{{order.featureDescriptions}}</td>
          </tr>
          <tr>
            <td class="title">
              <p class="zh">目标市场</p>
              <p class="en">Target Market</p>
            </td>
            <td>{{order.targetMarket}}</td>
            <td class="title">
            </td>
            <td></td>
          </tr>
          <tr>
            <td colspan="4" class="special-td">
              <div class="div-td title">
                <p class="zh">晶圆投产量（第1年）</p>
                <p class="en">Wafer Volume (1st year production)</p>
              </div>
              <div class="div-td">{{order.waferVolumeFirst}}</div>
            </td>
          </tr>
          <tr>
            <td colspan="4" class="special-td">
              <div class="div-td title">
                <p class="zh">晶圆投产量（第2年）</p>
                <p class="en">Wafer Volume (2nd year production)</p>
              </div>
              <div class="div-td">{{order.waferVolumeSecond}}</div>
            </td>
          </tr>
          <tr>
            <td colspan="4" class="special-td">
              <div class="div-td title">
                <p class="zh">晶圆投产量（第3年）</p>
                <p class="en">Wafer Volume (3rd year production)</p>
              </div>
              <div class="div-td">{{order.waferVolumeThird}}</div>
            </td>
          </tr>
          <tr>
            <td colspan="4" class="special-td">
              <div class="div-td title">
                <p class="zh">晶圆投产量（第4年）</p>
                <p class="en">Wafer Volume (4th year production)</p>
              </div>
              <div class="div-td">{{order.waferVolumeForth}}</div>
            </td>
          </tr>
          <tr>
            <td colspan="4" class="special-td">
              <div class="div-td title">
                <p class="zh">晶圆投产量（第5年）</p>
                <p class="en">Wafer Volume (5th year production)</p>
              </div>
              <div class="div-td">{{order.waferVolumeFifth}}</div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="action-wrap fixed-bottom">
      <el-button @click="checkOrder(2)">审核不通过</el-button>
      <el-button type="primary" @click="checkOrder(1)">确认当前订单</el-button>
      <el-button v-if="orderStatus === 1" type="primary" @click="checkOrder(3)">订单完成</el-button>
    </div>
    <!--编辑基本信息-->
    <el-dialog title="编辑基本信息" :visible.sync="showInfoDialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="infoForm" ref="infoForm" :inline="true">
        <el-form-item label="联系人:" :label-width="formLabelWidth">
          <el-input v-model="infoForm.name"></el-input>
        </el-form-item>
        <el-form-item label="企业:" :label-width="formLabelWidth">
          {{infoForm.companyShortname}}
        </el-form-item>
        <el-form-item label="联系电话:" :label-width="formLabelWidth">
          <el-input v-model="infoForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="职位:" :label-width="formLabelWidth">
          <el-input v-model="infoForm.curJobTitle"></el-input>
        </el-form-item>
        <el-form-item label="下单时间:" :label-width="formLabelWidth">
          <span>{{infoForm.createTime}}</span>
        </el-form-item>
        <div class="border"></div>
        <el-form-item label="生产类型:" :label-width="formLabelWidth">
          <!-- 当前生产类型，修改生产类型 -->
          <el-select v-model="infoForm.tapeoutPlan" style="width: 200px;" @change="changePlan">
            <el-option label="MPW(摩尔班车)" value="1"></el-option>
            <el-option label="MPW" value="2"></el-option>
            <el-option label="Full Mask" value="3"></el-option>
          </el-select>
          <span></span>
        </el-form-item>
        <!-- 筛选条件的形式不同, 不同的数据形式 -->
        <template v-if="infoForm.tapeoutPlan === '3'">
          <el-form-item label="代工厂:" :label-width="formLabelWidth">
            <el-select v-model="infoForm.supplier" filterable clearable @change="fetchFilterData" style="width: 200px;">
              <el-option
                v-for="item in supplierOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="节点 & 工艺:" :label-width="formLabelWidth">
            <el-select v-model="infoForm.node" filterable clearable @change="fetchFilterData" style="width: 160px;">
              <el-option
                v-for="item in nodeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="infoForm.craft" filterable clearable @change="fetchFilterData" style="width: 160px;">
              <el-option
                v-for="item in craftOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="GDS提交时间:" :label-width="formLabelWidth">
            <el-date-picker
              style="width: 200px;"
              v-model="infoForm.cutOffTime"
              type="date"
              :picker-options="pickerCuttofEnd"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </template>
        <template v-if="infoForm.tapeoutPlan === '2'">
          <el-form-item label="代工厂:" :label-width="formLabelWidth">
            <el-select v-model="infoForm.supplier" filterable clearable @change="fetchFilterData" style="width: 200px;">
              <el-option
                v-for="item in supplierOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="节点 & 工艺:" :label-width="formLabelWidth">
            <el-select v-model="infoForm.node" filterable clearable @change="fetchFilterData" style="width: 160px;">
              <el-option
                v-for="item in nodeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="infoForm.craft" filterable clearable @change="fetchFilterData" style="width: 160px;">
              <el-option
                v-for="item in craftOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <div>
            <el-form-item label="可选MPW:" :label-width="formLabelWidth">
              <el-select v-model="mpwId" placeholder="请选择MPW" style="width: 350px;">
                <el-option
                  v-for="item in mpwOptions"
                  :key="item.orderNo"
                  :label="item.cutoffTime | filterDateformat"
                  :value="item.orderNo">
                  <span style="float: left">{{ item.cutoffTime | filterDateformat }}</span>
                  <span style="float: right;">编号：{{ item.orderNo }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </template>
        <template v-if="infoForm.tapeoutPlan === '1'">
          <el-form-item label="代工厂:" :label-width="formLabelWidth">
            <el-select v-model="infoForm.supplier" filterable clearable @change="fetchFilterData" style="width: 200px;">
              <el-option
                v-for="item in supplierOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="节点 & 工艺:" :label-width="formLabelWidth">
            <el-select v-model="infoForm.node" filterable clearable @change="fetchFilterData" style="width: 160px;">
              <el-option
                v-for="item in nodeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="infoForm.craft" filterable clearable @change="fetchFilterData" style="width: 160px;">
              <el-option
                v-for="item in craftOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="可选摩尔班车:" :label-width="formLabelWidth">
            <el-select v-model="mooreMpwId" placeholder="请选择摩尔班车" style="width: 350px;">
              <el-option
                v-for="item in mooreMpwOptions"
                :key="item.orderNo"
                :label="item.cutoffTime | filterDateformat"
                :value="item.orderNo">
                <span style="float: left">{{ item.cutoffTime | filterDateformat }}</span>
                <span style="float: right;">编号：{{ item.orderNo }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="工程批Wafer张数:" :label-width="formLabelWidth">
          <el-input v-model="infoForm.tapeoutCt"></el-input>
        </el-form-item>
        <div>
          <el-form-item label="量产备注:" :label-width="formLabelWidth">
            <el-input v-model="infoForm.batchProdRemark" type="textarea" style="width: 400px;"></el-input>
          </el-form-item>
        </div>
        <div class="border"></div>
        <!-- 不同的生产类型显示不同的定价方式，fullmask转摩尔班车时出现rider价格系数 -->
        <template v-if="infoForm.tapeoutPlan === '3' && originPlan === '3'">
          <el-form-item label="价格:" :label-width="formLabelWidth">
            <el-input v-model="infoForm.totalPrice" style="width: 200px;"></el-input> 美元
          </el-form-item>
          <el-form-item label="指定定金:" :label-width="formLabelWidth">
            <el-input v-model="infoForm.deposit" style="width: 200px;"></el-input> 美元
          </el-form-item>
        </template>
        <template v-if="infoForm.tapeoutPlan === '2'">
          <el-form-item label="价格:" :label-width="formLabelWidth">
            <el-input v-model="infoForm.totalPrice" style="width: 200px;"></el-input> 美元
          </el-form-item>
          <el-form-item label="指定定金:" :label-width="formLabelWidth">
            <el-input v-model="infoForm.deposit" style="width: 200px;"></el-input> 美元
          </el-form-item>
        </template>
        <!-- 摩尔班车类型的如果未做转化，价格不能修改 -->
        <template v-if="infoForm.tapeoutPlan === '1' && originPlan === '1'">
          <div>
            <el-form-item label="价格区间：" :label-width="formLabelWidth" v-if="infoForm.tapeoutPlan === '1'">
            </el-form-item>
          </div>
          <el-form :inline="true" class="interval-form">
            <el-row v-for="(interval, index) in infoForm.priceInterval" :key="index">
              <el-col :span="12">
                <el-form-item label="" prop="minCt">
                  <el-input v-model="interval.minCt" class="interval-input count" :disabled="true"></el-input>
                </el-form-item>
                <span class="split"> - </span>
                <el-form-item label="" prop="maxCt">
                  <el-input v-model="interval.maxCt" class="interval-input count" :disabled="true"></el-input>
                </el-form-item>
                <span>人拼团</span>
              </el-col>
              <el-col :span="10">
                <el-form-item label="价格" prop="price">
                  <el-input v-model="interval.price" class="interval-input price" :disabled="true"></el-input>
                  <span>美元</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
        <template v-if="infoForm.tapeoutPlan === '1' && originPlan === '3'">
          <el-form-item label="总价格:" :label-width="formLabelWidth">
            <el-input v-model="infoForm.totalPrice" style="width: 200px;"></el-input> 美元
          </el-form-item>
          <el-form-item label="指定定金:" :label-width="formLabelWidth">
            <el-input v-model="infoForm.deposit" style="width: 200px;"></el-input> 美元
          </el-form-item>
          <el-form-item label="自定义系数:" :label-width="formLabelWidth">
            <el-input v-model="infoForm.riderCoeff" placeholder="0-1之间,最多两位小数" style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="主rider价格:" :label-width="formLabelWidth" v-if="false">
            <div style="width: 200px;">{{curPrice}} 美元</div>
          </el-form-item>
          <el-form-item label="价格公式:" :label-width="formLabelWidth">
            <span>主rider价格=总价-当前参与人数总价*自定义系数</span>
          </el-form-item>
          <div>
            <el-form-item label="价格区间：" :label-width="formLabelWidth" v-if="infoForm.tapeoutPlan === '1'">
            </el-form-item>
          </div>
          <el-form-item>
            <el-form :inline="true" class="interval-form">
              <el-button class="add-btn" type="primary" size="small" @click="addInterval">+Add</el-button>
              <el-row v-for="(interval, index) in infoForm.priceInterval" :key="index">
                <el-col :span="12">
                  <el-form-item label="" prop="minCt">
                    <el-input v-model="interval.minCt" class="interval-input count"></el-input>
                  </el-form-item>
                  <span class="split"> - </span>
                  <el-form-item label="" prop="maxCt">
                    <el-input v-model="interval.maxCt" class="interval-input count"></el-input>
                  </el-form-item>
                  <span>人拼团</span>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="价格" prop="price">
                    <el-input v-model="interval.price" class="interval-input price"></el-input>
                    <span>美元</span>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <div class="action-wrap delete-interval" title="删除" @click="removeInterval(index)" v-if="infoForm.priceInterval.length > 1">
                    <i class="el-icon-delete"></i>
                  </div>
                </el-col>
              </el-row>
              <div class="price-tip">价格区间说明：<br/>1. 请确保价格区间拼团人数的连续性，如：1-5人，6-8人，等<br/>
                2. 最后一个价格区间的最大人数不需要填写，提交时会自动忽略，表示大于等于最少人数的价格区间；如：最后一个价格区间填写最少人数16，表示16人及以上的价格<br/>
                3. 如果价格待定，则价格不需填写
              </div>
            </el-form>
          </el-form-item>
        </template>
        <div class="action-wrap">
          <el-button @click="closeInfo('infoForm')">取消</el-button>
          <el-button type="primary" @click="submitInfo('infoForm')">提交</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!-- 编辑更多信息 -->
    <el-dialog title="编辑更多信息" :visible.sync="showMoreInfoDialog" :fullscreen="true">
      <div class="more-info-dialog-wrap">
        <div class="cnt-item-block">
          <div class="sub-title">
            <p class="zh">工艺信息</p>
            <p class="en">Technology Information</p>
          </div>
          <div class="cnt-wrap">
            <el-row type="flex" align="middle" :gutter="20" class="form-item">
              <el-col :span="12">
                <el-row>
                  <el-col :span="6">
                    <div class="item-title">
                      <p class="zh">*Poly/Metal</p>
                      <p class="en">Poly/Metal</p>
                    </div>
                  </el-col>
                  <el-col :span="16">
                    <el-input v-model="moreInfoForm.poly" placeholder="" style="width: 70px;"></el-input>
                    <span>P</span>
                    <el-input v-model="moreInfoForm.metal" placeholder="" style="width: 70px;"></el-input>
                    <span>M</span>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-row>
                  <el-col :span="6">
                    <div class="item-title">
                      <p class="zh">*Mask layer</p>
                      <p class="en">Mask layer</p>
                    </div>
                  </el-col>
                  <el-col :span="16">
                    <el-input v-model="moreInfoForm.maskLayer" placeholder="" style="width: 120px;"></el-input>
                    <span>layers</span>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row type="flex" align="middle" :gutter="20" class="form-item">
              <el-col :span="12">
                <el-row>
                  <el-col :span="6">
                    <div class="item-title">
                      <p class="zh">*芯片尺寸</p>
                      <p class="en">Die Size</p>
                    </div>
                  </el-col>
                  <el-col :span="16">
                    <el-input v-model="moreInfoForm.dieSize" placeholder="" style="width: 120px;"></el-input>
                    <span>mm²</span>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-row>
                  <el-col :span="6">
                    <div class="item-title">
                      <p class="zh">*可选层</p>
                      <p class="en">Optional layer</p>
                    </div>
                  </el-col>
                  <el-col :span="16">
                    <el-input v-model="moreInfoForm.optionalLayer" placeholder="" style="width: 120px;"></el-input>
                    <span>layers</span>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row type="flex" align="middle" :gutter="20" class="form-item">
              <el-col :span="12">
                <el-row>
                  <el-col :span="6">
                    <div class="item-title">
                      <p class="zh">温度范围</p>
                      <p class="en">Temperature Range</p>
                    </div>
                  </el-col>
                  <el-col :span="16">
                    <el-input v-model="moreInfoForm.temperatureRange" placeholder="" style="width: 120px;"></el-input>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-row>
                  <el-col :span="6">
                    <div class="item-title">
                      <p class="zh">封装</p>
                      <p class="en">Package</p>
                    </div>
                  </el-col>
                  <el-col :span="16">
                    <el-input v-model="moreInfoForm.pack" placeholder="" style="width: 120px;"></el-input>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="cnt-item-block">
          <div class="sub-title">
            <p class="zh">IP 信息</p>
            <p class="en">IP Information</p>
          </div>
          <div class="cnt-wrap">
            <div class="ip-wrap-item" v-for="(ipItem, index) in moreInfoForm.ips" :key="index">
              <div class="action-wrap" title="删除IP" @click="removeIP(index)" v-if="moreInfoForm.ips.length > 1">
                <i class="el-icon-delete"></i>
              </div>
              <el-row type="flex" align="middle" :gutter="20" class="form-item">
                <el-col :span="4" class="item-title">
                  <p class="zh">IP 供应商</p>
                  <p class="en">IP Vendor</p>
                </el-col>
                <el-col :span="18" class="item-cnt">
                  <el-select v-model="ipItem.ipOwnership" placeholder="请选择">
                    <el-option
                      v-for="item in ipOwnerOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row type="flex" align="middle" :gutter="20" class="form-item">
                <el-col :span="4" class="item-title">
                  <p class="zh">IP 名称</p>
                  <p class="en">IP Code</p>
                </el-col>
                <el-col :span="18" class="item-cnt">
                  <el-input v-model="ipItem.ipName" placeholder=""></el-input>
                </el-col>
              </el-row>
              <el-row type="flex" align="middle" :gutter="20" class="form-item">
                <el-col :span="4" class="item-title">
                  <p class="zh">主要用途</p>
                  <p class="en">Usage</p>
                </el-col>
                <el-col :span="18" class="item-cnt">
                  <el-input v-model="ipItem.usage" placeholder=""></el-input>
                </el-col>
              </el-row>
              <el-row type="flex" align="middle" :gutter="20" class="form-item">
                <el-col :span="4" class="item-title">
                  <p class="zh">主要参数</p>
                  <p class="en">Main parameters</p>
                </el-col>
                <el-col :span="18" class="item-cnt">
                  <el-input v-model="ipItem.mainParameters" placeholder=""></el-input>
                </el-col>
              </el-row>
            </div>
            <div class="action">
              <el-button type="primary" size="small" @click="addIp">+Add</el-button>
            </div>
          </div>
        </div>
        <div class="cnt-item-block">
          <div class="sub-title">
            <p class="zh">计划</p>
            <p class="en">Schedule</p>
          </div>
          <div class="cnt-wrap">
            <el-row type="flex" align="middle" :gutter="20" class="form-item">
              <el-col :span="4" class="item-title">
                <p class="zh">*MPW班车日期</p>
                <p class="en">MPW shuttles</p>
              </el-col>
              <el-col :span="18" class="item-cnt">
                <el-date-picker
                  v-model="moreInfoForm.npwShuttles"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-col>
            </el-row>
            <el-row type="flex" align="middle" :gutter="20" class="form-item">
              <el-col :span="4" class="item-title">
                <p class="zh">*工程批日期</p>
                <p class="en">Pilot Run Tapeout date</p>
              </el-col>
              <el-col :span="18" class="item-cnt">
                <el-date-picker
                  v-model="moreInfoForm.pilotRunTapeoutDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-col>
            </el-row>
            <el-row type="flex" align="middle" :gutter="20" class="form-item">
              <el-col :span="4" class="item-title">
                <p class="zh">*量产日期</p>
                <p class="en">Production target</p>
              </el-col>
              <el-col :span="18" class="item-cnt">
                <el-date-picker
                  v-model="moreInfoForm.productionTarget"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="cnt-item-block no-border">
          <div class="sub-title">
            <p class="zh">产品信息</p>
            <p class="en">Product Information</p>
          </div>
          <div class="cnt-wrap">
            <el-row type="flex" align="middle" :gutter="20" class="form-item">
              <el-col :span="6" class="item-title">
                <p class="zh">*产品应用</p>
                <p class="en">Application of Product</p>
              </el-col>
              <el-col :span="16" class="item-cnt">
                <el-input v-model="moreInfoForm.applicationOfProduct" placeholder=""></el-input>
              </el-col>
            </el-row>
            <el-row type="flex" align="middle" :gutter="20" class="form-item">
              <el-col :span="6" class="item-title">
                <p class="zh">*功能描述</p>
                <p class="en">Feature Descriptions</p>
              </el-col>
              <el-col :span="16" class="item-cnt">
                <el-input v-model="moreInfoForm.featureDescriptions" placeholder=""></el-input>
              </el-col>
            </el-row>
            <el-row type="flex" align="middle" :gutter="20" class="form-item">
              <el-col :span="6" class="item-title">
                <p class="zh">*目标市场</p>
                <p class="en">Target Market</p>
              </el-col>
              <el-col :span="16" class="item-cnt">
                <el-input v-model="moreInfoForm.targetMarket" placeholder=""></el-input>
              </el-col>
            </el-row>
            <el-row type="flex" align="middle" :gutter="20" class="form-item">
              <el-col :span="6" class="item-title">
                <p class="zh">*晶圆投产量（第1年）</p>
                <p class="en">Wafer Volume (1st year production)</p>
              </el-col>
              <el-col :span="16" class="item-cnt">
                <el-input v-model="moreInfoForm.waferVolumeFirst" placeholder="eg: 500 wafers/year"></el-input>
              </el-col>
            </el-row>
            <el-row type="flex" align="middle" :gutter="20" class="form-item">
              <el-col :span="6" class="item-title">
                <p class="zh">*晶圆投产量（第2年）</p>
                <p class="en">Wafer Volume (2nd year production)</p>
              </el-col>
              <el-col :span="16" class="item-cnt">
                <el-input v-model="moreInfoForm.waferVolumeSecond" placeholder=""></el-input>
              </el-col>
            </el-row>
            <el-row type="flex" align="middle" :gutter="20" class="form-item">
              <el-col :span="6" class="item-title">
                <p class="zh">*晶圆投产量（第3年）</p>
                <p class="en">Wafer Volume (3rd year production)</p>
              </el-col>
              <el-col :span="16" class="item-cnt">
                <el-input v-model="moreInfoForm.waferVolumeThird" placeholder=""></el-input>
              </el-col>
            </el-row>
            <el-row type="flex" align="middle" :gutter="20" class="form-item">
              <el-col :span="6" class="item-title">
                <p class="zh">*晶圆投产量（第4年）</p>
                <p class="en">Wafer Volume (4th year production)</p>
              </el-col>
              <el-col :span="16" class="item-cnt">
                <el-input v-model="moreInfoForm.waferVolumeForth" placeholder=""></el-input>
              </el-col>
            </el-row>
            <el-row type="flex" align="middle" :gutter="20" class="form-item">
              <el-col :span="6" class="item-title">
                <p class="zh">*晶圆投产量（第5年）</p>
                <p class="en">Wafer Volume (5th year production)</p>
              </el-col>
              <el-col :span="16" class="item-cnt">
                <el-input v-model="moreInfoForm.waferVolumeFifth" placeholder=""></el-input>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="action-wrap">
          <el-button @click="closeMoreInfo">取消</el-button>
          <el-button type="primary" @click="submitMoreInfo">提交</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 异常提示 -->
    <el-dialog
      title="提示"
      :visible.sync="helpDialogVisible"
      width="30%">
      <div class="dialog-share-cnt">如遇数据信息异常或有其他需求，请联系摩尔云后台管理员 sandyzhang@moore.ren </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="helpDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Global from 'assets/js/global'
import moment from 'moment'
import _ from 'underscore'

export default {
  data () {
    return {
      order: {},
      contractNo: this.$route.params.id,
      infoForm: {
        orderNo: '',
        contractNo: this.$route.params.id,
        mobile: '',
        name: '',
        companyShortname: '',
        curJobTitle: '',
        cutOffTime: '',
        supplier: '',
        node: '',
        craft: '',
        deposit: '',
        totalPrice: '',
        tapeoutPlan: '',
        priceScheme: '',
        tapeoutCt: '',
        priceInterval: [],
        riderCoeff: '',
        batchProdRemark: ''
      },
      showInfoDialog: false,
      supplierOptions: [],
      nodeOptions: [],
      craftOptions: [],
      formLabelWidth: '130px',
      pickerCuttofEnd: {
        disabledDate: (time) => {
          return time.getTime() < Date.now()
        }
      },
      showEmailDialog: false,
      emailForm: {
        email: ''
      },
      showMoreInfoDialog: false,
      ipOwnerOptions: [{
        label: 'Foundry IP',
        value: 'Foundry IP'
      }, {
        label: 'Self-development IP',
        value: 'Self-development IP'
      }, {
        label: '3rd parties IP',
        value: '3rd parties IP'
      }],
      moreInfoForm: {
        contractNo: this.$route.params.id,
        poly: '',
        metal: '',
        maskLayer: '',
        dieSize: '',
        optionalLayer: '',
        pack: '',
        temperatureRange: '',
        areaSizeLength: '',
        areaSizeWith: '',
        npwShuttles: '',
        pilotRunTapeoutDate: '',
        productionTarget: '',
        applicationOfProduct: '',
        featureDescriptions: '',
        targetMarket: '',
        waferVolumeFirst: '',
        waferVolumeSecond: '',
        waferVolumeThird: '',
        waferVolumeForth: '',
        waferVolumeFifth: '',
        ips: [{
          ipOwnership: '',
          ipName: '',
          usage: '',
          mainParameters: ''
        }]
      },
      rules: {},
      transferPlan: '3',
      originPlan: '',
      mooreMpwOptions: [],
      mpwOptions: [],
      mooreMpwId: '', // 选择摩尔班车的orderNo
      mpwId: '', // 选择MPW的orderNo
      helpDialogVisible: false
    }
  },
  computed: {
    orderStatus () {
      return this.order.status || 0
    },
    curPrice () {
      // 前端计算出当前价格，只做显示，不提交给后台  TODO
      return ''
    }
  },
  created () {
    this.fetchContractInfo()
  },
  methods: {
    addIp () {
      this.moreInfoForm.ips.push({
        ipOwnership: '',
        ipName: '',
        usage: '',
        mainParameters: ''
      })
    },
    removeIP (index) {
      this.moreInfoForm.ips.splice(index, 1)
    },
    fetchContractInfo () {
      let _vue = this
      _vue.$http.get('/api/v1.0/order/tapeout?contract_no=' + _vue.contractNo).then((response) => {
        _vue.order = response.data.data.contract
        if (_vue.order.tapeoutPlan === 2) {
          _vue.mpwId = _vue.order.orderNo
        } else if (_vue.order.tapeoutPlan === 1) {
          _vue.mooreMpwId = _vue.order.orderNo
        }
        if (!_vue.order.totalPrice && !_vue.order.riderPrice && !_vue.order.curContractPrice && !_vue.order.curNpwPrice) {
          _vue.helpDialogVisible = true
        }
      })
    },
    fetchFilterData () {
      let _vue = this
      let reqUrl = Global.CONFIG.WEB_SERVER_URL + '/api/v1/supplier/crafts?type=1'
      reqUrl += '&supplier=' + _vue.infoForm.supplier
      reqUrl += '&node=' + _vue.infoForm.node
      reqUrl += '&craft=' + _vue.infoForm.craft
      _vue.$http.get(reqUrl).then(response => {
        if (_vue.infoForm.supplier === '') _vue.supplierOptions = response.data.data.supplier
        if (_vue.infoForm.node === '') _vue.nodeOptions = response.data.data.node
        if (_vue.infoForm.craft === '') _vue.craftOptions = response.data.data.craft
        if (_vue.infoForm.supplier !== '' &&
          _vue.infoForm.node !== '' &&
          _vue.infoForm.craft !== '') {
          _vue.supplierOptions = response.data.data.supplier
          _vue.nodeOptions = response.data.data.node
          _vue.craftOptions = response.data.data.craft
        }
      })
      // 可能同时筛选摩尔班车或者是MPW
      if (_vue.infoForm.tapeoutPlan === '1') {
        _vue.fetchMooreMpw()
      } else if (_vue.infoForm.tapeoutPlan === '2') {
        _vue.fetchMpw()
      }
    },
    checkOrder (status) {
      let _vue = this
      if (status === 1) {
        // 审核通过
        _vue.$http.put('/api/v1.0/order/tapeout/audit', {
          contractNo: _vue.contractNo,
          status: 1
        }).then(() => {
          _vue.$message({
            type: 'success',
            message: '订单审核通过',
            center: true
          })
          _vue.fetchContractInfo()
        }).catch(() => {
          _vue.$message({
            type: 'error',
            message: '联系管理员 sandyzhang@moore.ren',
            center: true
          })
        })
      } else if (status === 2) {
        // 审核不通过  TODO：审核不通过时候需要发送通知邮件
        _vue.$http.put('/api/v1.0/order/tapeout/audit', {
          contractNo: _vue.contractNo,
          status: 2
        }).then(() => {
          _vue.$message({
            type: 'success',
            message: '订单审核不通过',
            center: true
          })
          _vue.fetchContractInfo()
        }).catch(() => {
          _vue.$message({
            type: 'error',
            message: '联系管理员 sandyzhang@moore.ren',
            center: true
          })
        })
      } else if (status === 3) {
        // 订单完成
        _vue.$http.put('/api/v1.0/order/tapeout/end', {
          contractNo: _vue.contractNo
        }).then(() => {
          _vue.$message({
            type: 'success',
            message: '订单已完成',
            center: true
          })
          _vue.fetchContractInfo()
        }).catch(() => {
          _vue.$message({
            type: 'error',
            message: '联系管理员 sandyzhang@moore.ren',
            center: true
          })
        })
      }
    },
    editInfo () {
      // 内容初始化
      this.infoForm = {
        orderNo: '',
        contractNo: this.order.contractNo,
        mobile: this.order.mobile,
        name: this.order.name,
        companyShortname: this.order.companyShortname,
        curJobTitle: this.order.currentJobTitle,
        createTime: this.order.createTime,
        cutOffTime: this.order.cutoffTime,
        deposit: this.order.deposit,
        totalPrice: this.order.totalPrice,
        tapeoutPlan: this.order.tapeoutPlan + '',
        priceInterval: this.order.priceInterval,
        supplier: parseInt(this.order.supplierId),
        node: this.order.node,
        craft: this.order.craft,
        tapeoutCt: this.order.tapeoutCount,
        batchProdRemark: this.order.batchProdRemark
      }
      this.originPlan = this.order.tapeoutPlan + ''
      if (this.infoForm.priceInterval.length === 0) {
        this.infoForm.priceInterval.push({
          minCt: 1,
          maxCt: '',
          price: ''
        })
      }
      this.fetchFilterData()
      this.showInfoDialog = true
    },
    closeInfo () {
      this.showInfoDialog = false
    },
    submitInfo () {
      let _vue = this
      // TODO: 表单验证
      let data = {
        orderNo: _vue.infoForm.orderNo,
        contractNo: _vue.infoForm.contractNo,
        mobile: _vue.infoForm.mobile,
        name: _vue.infoForm.name,
        curJobTitle: _vue.infoForm.curJobTitle,
        cutOffTime: _vue.infoForm.cutOffTime,
        supplier: _vue.infoForm.supplier,
        node: _vue.infoForm.node,
        craft: _vue.infoForm.craft,
        deposit: _vue.infoForm.deposit,
        tapeoutPlan: _vue.infoForm.tapeoutPlan,
        tapeoutCt: parseInt(_vue.infoForm.tapeoutCt),
        totalPrice: _vue.infoForm.totalPrice,
        batchProdRemark: _vue.infoForm.batchProdRemark
      }
      if (_vue.infoForm.tapeoutPlan === '1') {
        data.riderCoeff = _vue.infoForm.riderCoeff || ''
        data.priceInterval = _vue.infoForm.priceInterval
      }
      // 原始类型是 3, 当前类型是 1 时, 才需要验证系数
      if (_vue.infoForm.tapeoutPlan === '1' && _vue.originPlan === '3') {
        if (data.riderCoeff === '' || !Global.REGEX.COEFFICIENT.test(data.riderCoeff * 1)) {
          _vue.$message({
            type: 'error',
            message: '系数0-1之间,最多两位小数',
            center: true
          })
          return false
        }
      }
      if (_vue.infoForm.tapeoutPlan === '2' && _vue.mpwId === '') {
        _vue.$message({
          type: 'error',
          message: '请选择已有MPW',
          center: true
        })
        return false
      }
      if (_vue.mooreMpwId !== '') {
        data.orderNo = _vue.mooreMpwId
      }
      if (_vue.mpwId !== '') {
        data.orderNo = _vue.mpwId
      }
      if (_vue.validatePriceInterval()) {
        _vue.$http.put('/api/v1.0/order/tapeout', data).then(() => {
          _vue.$message({
            type: 'success',
            message: '信息编辑成功',
            center: true
          })
          _vue.showInfoDialog = false
          _vue.fetchContractInfo()
        }).catch(() => {
          _vue.$message({
            type: 'error',
            message: '联系管理员 sandyzhang@moore.ren',
            center: true
          })
        })
      }
    },
    inviteComplete () {
      let _vue = this
      _vue.$http.put('/api/v1.0/order/tapeout/invite', {
        contractNo: _vue.contractNo
      }).then(() => {
        _vue.$message({
          type: 'success',
          message: '邮件发送成功',
          center: true
        })
        _vue.showEmailDialog = false
      }).catch((error) => {
        let field = Global.extractErrorField(error)
        if (field === 'contract') {
          _vue.$message({
            type: 'error',
            message: '请先审核通过，再发送邀请',
            center: true
          })
        } else {
          _vue.$message({
            type: 'error',
            message: '联系管理员 sandyzhang@moore.ren',
            center: true
          })
        }
      })
    },
    editMoreInfo () {
      this.moreInfoForm = {
        contractNo: this.$route.params.id,
        poly: this.order.poly,
        metal: this.order.metal,
        maskLayer: this.order.maskLayer,
        dieSize: this.order.dieSize,
        optionalLayer: this.order.optionalLayer,
        pack: this.order.pack,
        temperatureRange: this.order.temperatureRange,
        npwShuttles: this.order.npwShuttles,
        pilotRunTapeoutDate: this.order.pilotRunTapeoutDate,
        productionTarget: this.order.productionTarget,
        applicationOfProduct: this.order.applicationOfProduct,
        featureDescriptions: this.order.featureDescriptions,
        targetMarket: this.order.targetMarket,
        waferVolumeFirst: this.order.waferVolumeFirst,
        waferVolumeSecond: this.order.waferVolumeSecond,
        waferVolumeThird: this.order.waferVolumeThird,
        waferVolumeForth: this.order.waferVolumeForth,
        waferVolumeFifth: this.order.waferVolumeFifth,
        ips: this.order.ips,
        areaSizeWith: this.order.areaSizeWith,
        areaSizeLength: this.order.areaSizeLength
      }
      this.showMoreInfoDialog = true
    },
    submitMoreInfo () {
      // TODO: 表单验证
      let _vue = this
      _vue.$http.put('/api/v1.0/order/tapeout/ext', _vue.moreInfoForm).then(() => {
        _vue.$message({
          type: 'success',
          message: '编辑信息成功',
          center: true
        })
        _vue.showMoreInfoDialog = false
        _vue.fetchContractInfo()
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '联系管理员 sandyzhang@moore.ren',
          center: true
        })
      })
    },
    closeMoreInfo () {
      this.showMoreInfoDialog = false
    },
    viewOrder () {
      // 查看同类订单
      window.open(window.location.origin + '/#/order/tapeout?orderNo=' + this.order.orderNo)
    },
    signContract () {
      // 合同状态变更
      let _vue = this
      _vue.$http.put('/api/v1.0/order/tapeout/sign', {
        contractNo: _vue.contractNo
      }).then(() => {
        _vue.$message({
          type: 'success',
          message: '修改成功',
          center: true
        })
        _vue.fetchContractInfo()
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '联系管理员 sandyzhang@moore.ren',
          center: true
        })
      })
    },
    changePlan (val) {
      // 修改生产类型
      let _vue = this
      if (val === '1') {
        // 查询可选摩尔班车
        _vue.infoForm.supplier = ''
        _vue.infoForm.node = ''
        _vue.infoForm.craft = ''
        _vue.fetchFilterData()
        _vue.fetchMooreMpw()
      } else if (val === '2') {
        // 查询可选MPW
        _vue.infoForm.supplier = ''
        _vue.infoForm.node = ''
        _vue.infoForm.craft = ''
        _vue.fetchFilterData()
        _vue.fetchMpw()
      }
    },
    fetchMpw () {
      // 获取有效的MPW信息
      let _vue = this
      let reqUrl = '/api/v1.0/order/tapeout/online/list?tapeout_plan=2&page=1&per_page=99999'
      reqUrl += '&supplier=' + _vue.infoForm.supplier
      reqUrl += '&node=' + _vue.infoForm.node
      reqUrl += '&craft=' + _vue.infoForm.craft
      reqUrl += '&start=' + moment().format('YYYY-MM-DD')
      reqUrl += '&end='
      _vue.$http.get(reqUrl).then(response => {
        // 筛选指定plan
        _vue.mpwOptions = response.data.data.rows
        if (_vue.mpwOptions.length === 0) {
          _vue.mpwId = ''
        }
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '未加载到数据，请联系管理员 sandyzhang@moore.ren',
          center: true
        })
      })
    },
    fetchMooreMpw () {
      // 获取有效的摩尔班车信息
      let _vue = this
      let reqUrl = '/api/v1.0/order/tapeout/online/list?tapeout_plan=1&page=1&per_page=99999'
      reqUrl += '&supplier_id=' + _vue.infoForm.supplier
      reqUrl += '&node=' + _vue.infoForm.node
      reqUrl += '&craft=' + _vue.infoForm.craft
      reqUrl += '&start_create_time=' + moment().format('YYYY-MM-DD')
      reqUrl += '&end_create_time='
      _vue.$http.get(reqUrl).then(response => {
        // 筛选指定plan
        // 只能选择非Fullmask转换的摩尔班车
        _vue.mooreMpwOptions = _.filter(response.data.data.rows, (item) => {
          return item.isTransferRider === 0
        })
        if (_vue.mooreMpwOptions.length === 0) {
          _vue.mooreMpwId = ''
        }
      }).catch(() => {
        _vue.$message({
          type: 'error',
          message: '未加载到数据，请联系管理员 sandyzhang@moore.ren',
          center: true
        })
      })
    },
    addInterval () {
      // 添加价格区间
      if (this.infoForm.priceInterval.length <= 9) {
        this.infoForm.priceInterval.push({
          minCt: '',
          maxCt: '',
          price: ''
        })
        this.infoForm.priceInterval = _.sortBy(this.infoForm.priceInterval, (item) => { return parseInt(item.minCt) })
      } else {
        this.$message({
          type: 'error',
          message: '至多10个价格区间',
          center: true
        })
      }
    },
    removeInterval (index) {
      // 删除价格区间
      this.infoForm.priceInterval.splice(index, 1)
      this.infoForm.priceInterval = _.sortBy(this.infoForm.priceInterval, (item) => { return parseInt(item.minCt) })
    },
    cvrtIntervalCount (priceInterval) {
      // priceInterval 中数据区间部分转换成数字
      let arr = []
      _.each(priceInterval, (interval) => {
        let item = {
          minCt: parseInt(interval.minCt),
          maxCt: parseInt(interval.maxCt),
          price: parseInt(interval.price)
        }
        arr.push(item)
      })
      return arr
    },
    validatePriceInterval () {
      // 摩尔班车价格区间拼团人数的验证
      let _vue = this
      let flag = true
      _vue.infoForm.priceInterval = _.sortBy(_vue.infoForm.priceInterval, (item) => { return parseInt(item.minCt) })
      if (_vue.infoForm.tapeoutPlan + '' === '1' && _vue.infoForm.priceInterval.length < 2) {
        flag = false
        _vue.$message({
          type: 'error',
          message: '至少需要2个价格区间',
          center: true
        })
      } else {
        if (_vue.infoForm.tapeoutPlan + '' === '1') {
          for (let i = 0; i < _vue.infoForm.priceInterval.length; i++) {
            let item = _vue.infoForm.priceInterval[i]
            if (item.minCt === '' || parseInt(item.minCt) <= 0 || !Global.REGEX.INTEGER.test(parseInt(item.minCt))) {
              flag = false
              _vue.$message({
                type: 'error',
                message: '请填写最小拼团人数',
                center: true
              })
              return false
            }
            if (i === 0) {
              if (parseInt(item.minCt) !== 1) {
                flag = false
                _vue.$message({
                  type: 'error',
                  message: '第一价格区间拼团人数需要从1开始',
                  center: true
                })
                return false
              }
            } else {
              if (parseInt(item.minCt) !== parseInt(_vue.infoForm.priceInterval[i - 1].maxCt) + 1) {
                flag = false
                _vue.$message({
                  type: 'error',
                  message: '请保持拼团人数的连续性',
                  center: true
                })
                return false
              }
            }
          }
        }
      }
      return flag
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~assets/css/variable';
  .order-detail {
    width: 1080px;
    margin: 30px auto 0;
    padding-bottom: 30px;

    .head {
      padding: 30px 0;

      .main-title {
        color: $primary-color;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .complete-link {
        float: right;
        margin-top: -20px;
        font-size: 16px;

        a {
          color: $primary-color;
          text-decoration: underline;
        }
      }
    }
    .cnt-block {

      .table-title {
        color: $primary-color;
        font-size: 18px;
        margin: 30px 0 20px;
        padding-left: 10px;
      }
      .cnt-table {
        width: 100%;
        border: 1px solid #ccc;
        font-size: 14px;
        color: #666;

        tr {
          td {
            padding: 14px 20px;
            border-right: 1px solid #ccc;
            border-bottom: 1px solid #ccc;

            &.title {
              width: 130px;
              color: #666;
              font-weight: 600;

              &.long {
                width: 220px;
              }
            }
            &.main-title {
              color: #333;
              font-weight: 600;
              background-color: $secondary-color;
            }
            &.special-td {
              padding: 0 20px;

              .div-td {
                display: inline-block;
                padding-left: 15px;
                vertical-align: middle;

                &.title {
                  border-right: 1px solid #ccc;
                  width: 260px;
                  padding: 14px 0;
                  font-weight: 600;
                }
              }
            }
          }
          &.bg {
            background-color: $secondary-color;
          }
        }
        &.order-info {
        }
        &.tr-bg {
          tr:nth-child(odd) {
            background-color: $secondary-color;
          }
        }
      }
    }
    .action-block {
      padding-top: 30px;
      text-align: center;

      button {
        width: 120px;
      }
    }
  }
  .action-link {
    display: inline-block;
    margin: 0 20px;
    // color: $bright-color;
    color: $primary-color;
    text-decoration: underline;
    font-size: 15px;
    cursor: pointer;
  }
  .action-wrap {
    margin-top: 30px;
  }
  .border {
    border-top: 1px solid $border-color;
    margin-bottom: 20px;
  }
  .table-style {
    margin-bottom: 0;
    border-top: 1px solid $border-color;
    border-left: 1px solid $border-color;

    .el-col {
      text-align: center;
      border-right: 1px solid $border-color;
      border-bottom: 1px solid $border-color;
    }
  }
  .right-btn {
    float: right;
    margin-left: 20px;
  }
  .more-info-dialog-wrap {
    width: 1200px;
    margin: 0 auto;

    .cnt-item-block {
      border-bottom: 1px solid $border-color;
      padding: 20px 30px;

      &.no-border {
        border-bottom: none;
      }
      .sub-title {
        color: $primary-color;
        margin-bottom: 15px;

        .zh {
          font-size: 17px;
          font-weight: bold;
        }
        .en {
          font-weight: normal;
          font-size: 16px;
          margin-top: 5px;
        }
      }
      .cnt-wrap {

        .form-item {
          margin-bottom: 15px;

          &:last-child {
            margin-bottom: 0;
          }
          .item-title {
            .zh {
            }
            .en {
              font-size: 13px;
              color: #666;
            }
          }
          input {
            height: 35px;
          }
          .el-input {
            .el-input__icon {
              line-height: 35px;
            }
          }
          .el-date-editor.el-input {
            width: 100%;
          }
        }
        .action {
          width: 90%;
          text-align: right;
          padding-top: 15px;
        }
      }
    }
    .ip-wrap-item {
      border-bottom: 1px dashed $secondary-color;
      padding: 35px 0 20px;
      position: relative;

      &:first-child {
        padding-top: 0;
      }
      &:last-child {
        border-bottom: none;
      }
      .action-wrap {
        position: absolute;
        top: 10px;
        right: 70px;
        cursor: pointer;
        z-index: 2;

        .el-icon-delete {
          font-size: 22px;
          color: #999;

          &:hover {
            color: #666;
          }
        }
      }
    }
  }
  .cnt-block-wrap {
    margin-bottom: 50px;
  }
  .action-wrap.fixed-bottom {
    position: fixed;
    padding: 10px 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #e5f4ff;
  }
  .interval-form {
    text-align: center;
    position: relative;

    .el-col {
      margin-top: 10px;
    }
    .interval-input {
      &.count {
        width: 70px;
      }
      &.price {
        width: 120px;
      }
    }
    .split {
      display: inline-block;
      margin-right: 10px;
    }
    .add-btn {
      position: absolute;
      right: 0;
      top: -60px;
    }
    .action-wrap {
      cursor: pointer;
      .el-icon-delete {
        font-size: 16px;
      }
      &.delete-interval {
        margin-top: 0;
      }
    }
    .price-tip {
      line-height: 20px;
      color: #999;
      text-align: left;
      margin-top: 30px;
    }
  }
</style>
