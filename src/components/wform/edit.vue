<template>
    <div class="content">
      <div class="w-content">
        <!-- 添加表单模块 -->
        <div class="form-btn">
          <div class="title">添加表单模块</div>
          <div class="btn-view">
            <div class="content">
              <div class="second-tltle">固定功能键</div>
              <div class="flexd-btn">
                <div class="item-li" v-for="(item, index) in flexdBtn" :key="index">
                  <el-button @click="addFun(item, index)" :disabled="item.disabled">{{item.title}}</el-button>
                </div>
              </div>
              <div class="second-tltle">基础功能键</div>
              <div class="flexd-btn">
                <div class="item-li" v-for="(item, index) in baseBtn" :key="index">
                  <el-button @click="addFun(item, index)" :disabled="item.disabled">{{item.title}}</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 表单显示页 -->
        <div class="center-view">
          <div class="title">{{formBaseInfo.title || '表单页'}}</div>
          <div class="pc-box">
            <div class="pc-view">
              <div class="pages" v-for="(item, index) in formData" :key="index" :class="clickPage === index? 'pageActive' : ''" @click="selctPage(index)">
                <div class="closePage" @click.stop="closePage(index)" v-show="clickPage === index && formData.length > 1"><img src="./img/closePages.png" alt=""></div>
                <div class="page-num">第{{index + 1}}页，共{{formData.length}}页</div>
                <draggable :list="item.formControls"  @change="dragAndDrop" group="controls" class="draggable-box">
                  <div
                    class="item"
                    v-for="(li, num) in item.formControls"
                    :key="num"
                    @click="editForm(li, num, index)" :class="clickItem === num && clickPage === index ? 'active' : ''" v-show="li.keyName !== 'cf_code'"
                  >
                  <div class="fun-area" @click="closeItem(index, num, li, $event)" v-show="clickItem === num && clickPage === index && li.keyName !== 'cf_code' && li.keyName !== 'cf_name' && li.keyName !== 'cf_mobile'">
                    <img src="./img/closeItem.png" alt="">
                  </div>
                  <div class="move-area" v-show="clickItem === num && clickPage === index">
                    <i class="el-icon-rank"></i>
                  </div>
                  <div class="item-form" v-if="li.identifier === 'cf_textarea'">
                    <div v-html="li.defaultValue"></div>
                  </div>
                  <!-- 单行文本 -->
                  <div class="item-form" v-if="li.identifier === 'cf_text' && li.identifier !== 'cf_code'">
                    <div class="name" :style="li.controlType === 2 ? 'cursor: auto;' : 'cursor: pointer;'">{{li.title ? li.title : '单行文本'}}：</div>
                    <div class="input"><el-input type='text' v-model="li.defaultValue" :placeholder="li.prompting" readonly></el-input></div>
                  </div>
                  <!-- 上传功能 -->
                  <div class="item-form" v-if="li.identifier === 'cf_upload'">
                    <div class="name" :style="li.controlType === 2 ? 'cursor: auto;' : 'cursor: pointer;'">{{li.title ? li.title : '上传'}}：</div>
                    <div class="input"><el-input type='text' placeholder="点击上传" readonly></el-input></div>
                  </div>
                  <!-- 手机 -->
                  <div class="item-form" v-if="li.identifier === 'cf_mobile'">
                    <div class="name">{{li.title}} ：</div>
                    <div class="input"><el-input type='text' v-model="li.defaultValue" :placeholder="li.prompting" readonly></el-input></div>
                  </div>
                  <div v-if="li.identifier === 'cf_mobile' && li.verifications.filter(res=>res.mode === 15).length " class="code-box">
                    <div class="name">验证码：</div>
                    <div class="input"><el-input type='text' v-model="li.defaultValue" placeholder="请输入验证码" readonly></el-input></div>
                  </div>
                  <!-- 多行文本 -->
                  <div class="item-form" v-if="li.identifier === 'cf_text_multi'">
                    <div class="name">{{li.title ? li.title : '多行文本'}}：</div>
                    <div class="input"><el-input type='textarea' v-model="li.defaultValue" :placeholder="li.prompting" maxlength="30" show-word-limit readonly></el-input></div>
                  </div>
                  <!-- 单选框组 -->
                  <div class="item-form" v-if="li.identifier === 'cf_radio'">
                    <div class="name">{{li.title ? li.title : '单选框组'}}：</div>
                    <!-- 竖向排序 radioActive -->
                    <div class="check">
                      <el-radio v-for='(radio, radioIndex) in li.options' :key="radioIndex" v-model="li.defaultValue" :label="radio.value" readonly>{{radio.value}}</el-radio>
                    </div>
                    <div class="zhezhao"></div>
                  </div>
                  <!-- 多选框组 -->
                  <div class="item-form" v-if="li.identifier === 'cf_checkbox'">
                    <div class="name">{{li.title ? li.title : '多选框组'}}：</div>
                    <!-- 竖向排序 radioActive -->
                    <div class="check">
                      <el-checkbox  v-for='(radio, radioIndex) in li.options' :key="radioIndex" :label="radio" :value="radio | filterCheck(li.defaultValue)">{{radio.value}}</el-checkbox >
                    </div>
                    <div class="zhezhao"></div>
                  </div>
                  <!-- 下拉框 -->
                  <div class="item-form" v-if="li.identifier === 'cf_select' && li.controlType === 1">
                    <div class="name">下拉框：</div>
                    <!-- 是否多选 multiple -->
                      <el-select v-model="li.defaultValue" placeholder="请选择" style="width:95%" readonly>
                        <el-option
                          v-for="item in li.options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    <div class="zhezhao"></div>
                  </div>
                  <!-- 固定功能下拉框 -->
                  <div class="item-form" v-if="li.identifier === 'cf_select' && li.controlType === 2 && li.keyName !== 'cf_engine_function'">
                    <div class="name">{{li.title}}</div>
                    <!-- 是否多选 multiple -->
                      <el-select v-model="li.defaultValue" placeholder="请选择" style="width:95%" readonly>
                        <el-option
                          v-for="item in li.options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    <div class="zhezhao"></div>
                  </div>
                  <!-- 级联下拉 -->
                  <div class="item-form" v-if="li.keyName === 'cf_engine_function'">
                    <div class="name">{{li.title}}</div>
                      <el-cascader
                        v-model="engineFunctionValue"
                        :options="engineFunction">
                      </el-cascader>
                    <div class="zhezhao"></div>
                  </div>
                  <!-- 数字 -->
                  <div class="item-form" v-if="li.identifier === 'cf_num'">
                    <div class="name">{{li.title ? li.title : '数字'}}：</div>
                      <div class="input"><el-input type='text' v-model="li.defaultValue" :placeholder="li.prompting" readonly></el-input></div>
                    <div class="zhezhao"></div>
                  </div>
                  <!-- 日期选择器 -->
                  <div class="item-form" v-if="li.identifier === 'cf_date'">
                    <div class="name">{{li.title ? li.title : '日期选择器'}}：</div>
                      <!-- 选择日 -->
                      <el-date-picker
                        v-model="li.defaultValue"
                        type="date"
                        value-format="yyyy-MM-dd"
                        readonly
                        :placeholder="li.prompting">
                      </el-date-picker>
                    </div>
                  <!-- 时间选择器 -->
                  <div class="item-form" v-if="li.identifier === 'cf_time'">
                    <div class="name">{{li.title ? li.title : '时间选择器'}}：</div>
                      <el-time-select
                        v-model="li.defaultValue"
                        readonly
                        :placeholder="li.prompting">
                      </el-time-select>
                    </div>
                  </div>
                </draggable>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 表单编辑区 -->
      <div class="formBase">
        <div class="title">表单编辑模块</div>
        <div class="form-view">
          <div class="content">
            <!-- 编辑表单基本信息 -->
            <el-tabs :stretch='true' v-model="activeName" @tab-click="handleClick" class="tabs">
              <el-tab-pane label="表单基本信息编辑" name="base" class="tabs-frist">
                <el-form ref="formBase" :model="formBaseInfo" label-width="auto" :rules="baseRules">
                  <el-form-item label="表单标题：" prop='title'>
                      <el-input type='text' v-model="formBaseInfo.title" placeholder="请输入表单标题" maxlength="255"></el-input>
                  </el-form-item>
                  <div class="rulesBox">
                    <div class="rulesTitle"><span>*</span> 表单简介：</div>
                    <div class="ckeditor-container">
                      <textarea name="content" id="formDescribe"></textarea>
                    </div>
                  </div>
                  <el-form-item label="表单背景颜色：">
                    <el-color-picker v-model="formBaseInfo.bgColor" show-alpha></el-color-picker>
                  </el-form-item>
                  <el-form-item label="表单背景图片：">
                      <img class="upload-image cover-img avatar" v-if="formBaseInfo.bgImage"
                          :src="formBaseInfo.bgImage | filterQiniuImageWform" alt="">
                      <el-upload
                        class="upload-btn"
                        :show-file-list="false"
                        action="http://upload.qiniup.com/"
                        :before-upload="beforeUpload"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        :data="uploadData"
                        :multiple="false">
                        <el-button size="small" type="primary">上传背景图片</el-button>
                      </el-upload>
                  </el-form-item>
                  <el-form-item label="表单标签：">
                    <el-select
                      v-model="tagsValue"
                      multiple
                      filterable
                      remote
                      allow-create
                      reserve-keyword
                      placeholder="请输入表单标签"
                      :remote-method="remoteMethod"
                      :loading="loading">
                      <el-option
                        v-for="item in tagsOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id + '|' + item.name">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <div class="tab-btn">
                  <el-button type="primary" @click="preserveBase(1)">保存</el-button>
                </div>
              </el-tab-pane>
              <!-- 编辑表单控件信息 -->
              <el-tab-pane label="表单字段信息编辑" name="form">
                <el-form ref="formField" :model="formControls" label-width="auto" :rules="controlsRules" v-if="isShowContent">
                  <el-form-item label="标题" v-if="['cf_textarea'].indexOf(formControls.identifier) === -1">
                      <el-input type='text' v-model="formControls.title" placeholder="请输入标题" maxlength="100" :readonly='formControls.controlType === 2' ></el-input>
                  </el-form-item>
                  <el-form-item label="默认值：" v-if="['cf_text', 'cf_mobile', 'cf_text_multi'].indexOf(formControls.identifier) !== -1">
                      <el-input type='text' v-model="formControls.defaultValue" placeholder="请输入默认值" maxlength="255"></el-input>
                  </el-form-item>
                  <el-form-item label="默认提示语" v-if="['cf_text', 'cf_mobile', 'cf_text_multi', 'cf_num', 'cf_select', 'cf_time', 'cf_date'].indexOf(formControls.identifier) !== -1">
                      <el-input type='text' v-model="formControls.prompting" placeholder="请输入默认语"></el-input>
                  </el-form-item>
                  <div v-show="formControls.identifier === 'cf_textarea'" class="rulesBox">
                    <div class="rulesTitle">编辑内容：</div>
                    <div class="ckeditor-container">
                      <textarea name="content" id="editor"></textarea>
                    </div>
                  </div>
                  <div class="editSecTitle" v-if="['cf_textarea'].indexOf(formControls.identifier) === -1 && formControls.keyName !== 'cf_mobile'">校验</div>
                  <div class="check">
                    <div v-if="['cf_textarea'].indexOf(formControls.identifier) === -1 && formControls.keyName !== 'cf_mobile' && formControls.keyName !== 'cf_name'">
                      <el-checkbox v-model="formControls.isMust" @change="checkItem(formControls, 0)">是否必填
                      </el-checkbox>
                    </div>
                    <div v-if="formControls.keyName === 'cf_identity'">
                      <el-checkbox v-model="formControls.isSelect">是否允许用户选择</el-checkbox>
                    </div>
                    <div v-if="['cf_text'].indexOf(formControls.identifier) !== -1 && formControls.controlType === 1">
                      <el-checkbox v-model="formControls.isMobile" @change="checkItem(formControls, 1)">是否为手机号
                      </el-checkbox>
                    </div>
                    <!-- <div v-if="['cf_mobile'].indexOf(formControls.identifier) !== -1">
                      <el-checkbox v-model="formControls.isCode">是否需要验证码
                      </el-checkbox>
                    </div> -->
                    <div v-if="['cf_text'].indexOf(formControls.identifier) !== -1 && formControls.controlType === 1">
                      <el-checkbox v-model="formControls.isEmail" @change="checkItem(formControls, 2)">是否为邮箱
                      </el-checkbox>
                    </div>
                    <div v-if="['cf_text'].indexOf(formControls.identifier) !== -1 && formControls.controlType === 1">
                      <el-checkbox v-model="formControls.isCard" @change="checkItem(formControls, 3)">是否为身份证
                      </el-checkbox>
                    </div>
                    <div v-if="['cf_num'].indexOf(formControls.identifier) !== -1">
                      最小值： <el-input-number size="mini" v-model="formControls.minNum" :min="0"></el-input-number>
                      <!-- <el-input type='text' v-model="formControls.verifications[4].prompt" placeholder="请输入默认语" maxlength="255"></el-input> -->
                    </div>
                    <div v-if="['cf_num'].indexOf(formControls.identifier) !== -1">
                      最大值： <el-input-number size="mini" v-model="formControls.maxNum" :min="0"></el-input-number>
                      <!-- <el-input type='text' v-model="formControls.verifications[5].prompt" placeholder="请输入默认语" maxlength="255"></el-input> -->
                    </div>
                    <div v-if="['cf_checkbox'].indexOf(formControls.identifier) !== -1">
                      最少 <el-input-number size="mini" v-model="formControls.minCheck" :min="0"></el-input-number> 项
                      <!-- <el-input type='text' v-model="formControls.verifications[6].prompt" placeholder="请输入默认语" maxlength="255"></el-input> -->
                    </div>
                    <div v-if="['cf_checkbox'].indexOf(formControls.identifier) !== -1">
                      最多 <el-input-number size="mini" v-model="formControls.maxCheck" :min="0"></el-input-number> 项
                      <!-- <el-input type='text' v-model="formControls.verifications[7].prompt" placeholder="请输入默认语" maxlength="255"></el-input> -->
                    </div>
                    <div v-if="['cf_text', 'cf_text_multi'].indexOf(formControls.identifier) !== -1">
                      最小长度： <el-input-number size="mini" v-model="formControls.minStr" :min="0"></el-input-number>
                      <!-- <el-input type='text' v-model="formControls.verifications[8].prompt" placeholder="请输入默认语" maxlength="255"></el-input> -->
                    </div>
                    <div v-if="['cf_text', 'cf_text_multi'].indexOf(formControls.identifier) !== -1">
                      最大长度： <el-input-number size="mini" v-model="formControls.maxStr" :min="0"></el-input-number>
                      <!-- <el-input type='text' v-model="formControls.verifications[9].prompt" placeholder="请输入默认语" maxlength="255"></el-input> -->
                    </div>
                    <div v-if="['cf_time'].indexOf(formControls.identifier) !== -1">
                      最小时间：
                      <el-time-picker
                        v-model="formControls.minTime"
                        :picker-options="{
                          selectableRange: '00:00:00 - 23:59:59'
                        }"
                        placeholder="选择时间点">
                      </el-time-picker>
                    </div>
                    <div v-if="['cf_time'].indexOf(formControls.identifier) !== -1">
                      最大时间：
                      <el-time-picker
                        v-model="formControls.maxTime"
                        :picker-options="{
                          selectableRange: '00:00:00 - 23:59:59'
                        }"
                        placeholder="选择时间点">
                      </el-time-picker>
                    </div>
                    <div v-if="['cf_date'].indexOf(formControls.identifier) !== -1">
                      最小日期：
                      <el-date-picker
                        v-model="formControls.minDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                      </el-date-picker>
                    </div>
                    <div v-if="['cf_date'].indexOf(formControls.identifier) !== -1">
                      最大日期：
                      <el-date-picker
                        v-model="formControls.maxDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                      </el-date-picker>
                    </div>
                  </div>
                  <div class="editSecTitle" v-if="['cf_checkbox', 'cf_radio', 'cf_select'].indexOf(formControls.identifier) !== -1">
                    选项
                    <span class="add" @click="addCheckbox" v-show="formControls.controlType !== 2"> 添加选项</span>
                    <span class="add" @click="clearOption()" v-show="formControls.controlType !== 2 && formControls.identifier ==='cf_radio'"> 清空默认选项</span>
                  </div>
                  <div class="checkbox-box" v-if="['cf_checkbox'].indexOf(formControls.identifier) !== -1">
                    <div v-for="(item, index) in formControls.option" :key="index" class="checkbox-arr">
                      <div class="checkbox">
                        <el-checkbox v-model="item.isselect" @change="checkChange(index)"><el-input type='text' v-model="item.value" placeholder="请输入选项" :disabled="formControls.controlType === 2"></el-input></el-checkbox>
                      </div>
                      <div class="delete" @click="delCheckbox(index)" v-show="formControls.controlType !== 2">
                        删除
                      </div>
                    </div>
                  </div>
                  <div class="checkbox-box" v-if="['cf_radio', 'cf_select'].indexOf(formControls.identifier) !== -1 && formControls.keyName !== 'cf_engine_function'">
                      <div v-for="(item, index) in formControls.option" :key="index" class="radio-arr">
                        <div class="checkbox">
                          <el-radio :label="item.value" v-model="formControls.radioValue" @change="radioChange"><el-input type='text' v-model="item.value" placeholder="请输入选项"  :disabled="formControls.controlType === 2"></el-input></el-radio>
                        </div>
                        <div class="delete" @click="delCheckbox(item, index)" v-show="formControls.controlType !== 2">
                          <p>删除</p>
                        </div>
                      </div>
                  </div>
                  <div class="checkbox-box" v-if="formControls.keyName === 'cf_engine_function'">
                      <el-select v-model="formControlsOptions1" placeholder="一级标签" style="width:95%" @change='changeOptions1'>
                        <el-option
                          v-for="item in engineFunction"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <el-select v-model="formControlsOptions2"  placeholder="二级标签" style="width:95%" @change='changeOptions2' v-if="formControlsOptions1">
                        <el-option
                          v-for="item in controlsOptions2[0].children"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <el-select v-model="formControlsOptions3"  placeholder="三级标签"  style="width:95%" @change='changeOptions3' v-if="formControlsOptions2">
                        <el-option
                          v-for="item in controlsOptions3[0].children"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  </div>
                </el-form>
                <div class="tab-btn" v-show="isShowContent">
                  <el-button type="primary" @click="preserveItem">保存</el-button>
                  </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
      <el-dialog
        title="选择模板"
        :showClose='false'
        :visible.sync="isShowModel"
        :showCancelButton='false'
        :closeOnClickModal='false'
        width="60%">
        <el-dialog
          width="30%"
          title="填写表单名称"
          :visible.sync="editFormName"
          append-to-body>
          <el-input type='text' v-model="editFormTitle" placeholder="请输入表单标题" maxlength="100"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="getModel">确 定</el-button>
        </span>
        </el-dialog>
        <div class="model-box">
          <div class="model-item" v-for="(item, index) in modelList" :key="index" @click="changeModel(index)" :class="isSelectModel === index ? 'active' : ''">
            <p>{{item.title}}</p>
            <img src='./img/kongbaiM1.png' alt="" v-if="index === 0">
            <img src='./img/zhanhuiM.png' alt="" v-else>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="goList">返回列表</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<script>
import Global from './js/global.js'
import MyUploadAdapter from './js/MyUploadAdapter'
import store from './../../vuex/store'
import _ from 'underscore'
import draggable from 'vuedraggable'
const Config = process.env.NODE_ENV === 'production' ? require('./../../../config/prod.env') : require('./../../../config/dev.env')
export default {
  name: 'edit',
  components: {
    draggable
  },
  data () {
    return {
      uuid: '',
      isShowModel: false,
      editFormName: false,
      editFormTitle: '',
      isSelectModel: -1,
      radioIsselect: '', // 单选默认选择
      activeName: 'base', // 控制控件编辑区的tab切换
      value: [],
      isUpDataFormBase: false,
      valueData: [[new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)]],
      flexdBtn: Global.flexdBtn(),
      baseBtn: Global.baseBtn(),
      pageMould: Global.pageMould(),
      formMould: Global.formMould(),
      formData: Global.formData(),
      formBaseInfo: Global.formBaseInfo(),
      modelList: Global.modelList(),
      identityOptions: Global.identityOptions(), // 身份选择项
      workingYearOptions: Global.workingYearOptions(), // 工作年限选择项
      educationOptions: Global.educationOptions(), // 学历选择项
      rankOptions: Global.rankOptions(), // 职级选择项
      oneEngineFunction: [], // 一级职能
      engineFunction: [], // 全部职能
      engineFunctionValue: [],
      industryChain: [], // 产业链
      tagsOptions: [],
      tagsValue: [],
      clickPage: 0, // 选中的页
      clickItem: -1, // 选中的元素
      baseRules: Global.baseRules(),
      controlsRules: Global.controlsRules(),
      loading: false,
      // 上传图片
      dialogImageUrl: '',
      dialogVisible: false,
      uploadData: {
        key: '',
        token: ''
      },
      // 编辑表单字段信息
      formControls: {
        id: null, // 控件ID
        title: '', // 控件标题
        keyName: '', // 控件keyName
        controlType: '', // 类型1:通用控件 2：基本信息控件
        identifier: '', // 控件标识符
        defaultValue: '', // 默认值
        prompting: '', // 提示语
        isMustFill: 0, // 是否必填: 默认0:非必填
        verifications: [],
        options: [],
        isMust: false,
        isMobile: false,
        isSelect: false,
        isCard: false,
        isEmail: false,
        isCode: false,
        minNum: '',
        maxNum: '',
        minCheck: '',
        maxCheck: '',
        minStr: '',
        maxStr: '',
        minTime: '',
        maxTime: '',
        minDate: '',
        maxDate: '',
        radioValue: '',
        checkValue: [],
        option: []
      },
      isShowContent: false,
      formControlsOptions1: '',
      formControlsOptions2: '',
      formControlsOptions3: '',
      controlsOptions2: [],
      controlsOptions3: [],
      // 编辑器
      showTextarea: false,
      editor: '',
      formDescribe: '',
      textareaDefaultValue: '这是一段文字'
    }
  },
  filters: {
    filterCheck (item, val) {
      let list = val.split('「-|-」')
      return !!list.filter(res => res === item.value).length
    },
    filterQiniuImageWform (val) {
      let qiniuUrl = ''
      if (val) {
        if (!val.startsWith('http')) {
          // 需要拼接七牛域名
          qiniuUrl = Config.QINIU_WFORM_IMG_URL + '/' + val
        } else {
          qiniuUrl = val
        }
      }
      return qiniuUrl
    }
  },
  computed: {
    isRelease () {
      return store.state.isRelease
    }
  },
  watch: {
    isRelease (newCount, oldCount) {
      if (newCount) {
        this.release()
      }
    }
  },
  created () {
    this.uuid = this.$route.query.uuid ? this.$route.query.uuid : ''
    store.commit('setUuid', this.uuid)
    if (this.uuid) {
      this.findFormData(this.uuid)
      this.findFormBase(this.uuid)
    } else {
      window.setTimeout(() => {
        this.initBaseCkeditor()
      }, 500)
      this.isShowModel = true
    }
    this.getTags()
    this.getOneEngineFunction()
    this.getIndustryChain()
    this.getEngineFunction()
  },
  methods: {
    goList () {
      this.$router.go(-1)
    },
    // 获取模板
    getModel () {
      if (this.isSelectModel === -1) {
        this.$message({
          message: '请选择模板',
          type: 'error'
        })
        return
      }
      if (this.editFormTitle === '') {
        this.$message({
          message: '请输入表单标题',
          type: 'error'
        })
        return
      }
      let self = this
      let uuid = this.modelList[this.isSelectModel].id
      let title = this.editFormTitle
      this.$http.get(`/api/v1.0/common/form/${uuid}/model?title=${title}`).then((res) => {
        console.log('根据模板获取表单信息')
        console.log(res.data)
        let data = res.data
        if (data.code === 200) {
          self.uuid = data.data.uuid
          store.commit('setUuid', self.uuid)
          store.commit('setIsRelease', false)
          self.findFormData(self.uuid)
          self.findFormBase(self.uuid)
        }
      })
      this.isShowModel = false
      this.editFormName = false
      store.commit('setIsSaveForm', false)
    },
    changeModel (index) {
      this.isSelectModel = index
      this.editFormName = true
    },
    // 表单基本信息回显
    findFormBase (id) {
      let self = this
      this.$http.get(`/api/v1.0/common/form/${this.uuid}/info`, {uuid: id}).then((res) => {
        console.log('表单基本信息回显')
        console.log(res.data)
        let data = res.data
        if (data.code === 200) {
          self.formBaseInfo = data.data
          let t = []
          _.each(self.formBaseInfo.tags, (item) => {
            t.push(item.title)
          })
          self.tagsValue = t
          self.initBaseCkeditor(self.formBaseInfo.formDescribe)
        }
      })
    },
    // 提交表单基础信息
    preserveBase (num) {
      let self = this
      self.$refs['formBase'].validate((valid) => {
        if (valid) {
          let tags = []
          if (this.tagsValue.length > 0) {
            _.each(this.tagsValue, (value) => {
              let index = value.indexOf('|')
              if (index === -1) {
                tags.push({id: null, title: value})
              } else {
                let arr = value.split('|')
                let v = arr[1]
                tags.push({id: null, title: v})
              }
            })
            if (this.formBaseInfo.tags.length > 0) {
              _.each(tags, (item1) => {
                _.each(this.formBaseInfo.tags, (item2) => {
                  if (item1.title === item2.title) {
                    item1.id = item2.id
                  }
                  return item2
                })
                return item1
              })
            }
            // if (!formData.formDescribe) {
            //   this.$message({
            //     message: '请将表单简介填写完整',
            //     type: 'warning'
            //   })
            //   return
            // }
            this.formBaseInfo.tags = tags
          }
          this.formBaseInfo.formDescribe = this.formDescribe.getData()
          let params = JSON.parse(JSON.stringify(this.formBaseInfo))
          this.$http.put(`/api/v1.0/common/form/${this.uuid}/info`, params).then((res) => {
            console.log('提交表单的基本信息')
            console.log(res.data)
            if (num === 1) {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
            }
          })
        } else {
          this.$message({
            message: '请将必填的表单信息填写完整',
            type: 'warning'
          })
          return false
        }
      })
    },
    // 表单回显
    findFormData (id) {
      let uuid = id
      store.commit('setUuid', uuid)
      let self = this
      this.$http.get(`/api/v1.0/common/form/${uuid}/control`).then((res) => {
        console.log('查询表单回显信息')
        console.log(res.data)
        let data = res.data
        if (data.code === 200) {
          self.formData = data.data
          this.changeFixed()
        }
      })
    },
    // 提交表单
    release () {
      let formData = JSON.parse(JSON.stringify(this.formData))
      if (formData.length === 0 || (formData.length === 1 && formData[0].formControls.length === 0)) {
        this.$message({
          message: '请添加表单项',
          type: 'warning'
        })
        return
      }
      formData.map((item1, index1) => {
        item1.pageNumber = index1 + 1
        item1.formControls.map((item2, index2) => {
          if (item2.identifier !== 'cf_checkbox' && item2.identifier !== 'cf_radio' && item2.identifier !== 'cf_select') {
            item2.options = []
          }
          if (item2.keyName === 'cf_mobile') {
            if (item2.verifications.filter(res => res.mode === 15).length === 0) {
              item1.formControls.map((item2, index2) => {
                if (item2.keyName === 'cf_code') {
                  item1.formControls.splice(index2, 1)
                }
              })
            } else {
              let isCode = false
              item1.formControls.map((item2, index2) => {
                if (item2.keyName === 'cf_code') {
                  isCode = true
                }
              })
              if (!isCode) {
                let obj = {
                  id: null,
                  title: '验证码',
                  keyName: 'cf_code',
                  controlType: 2,
                  identifier: 'cf_code',
                  defaultValue: '',
                  prompting: '请输入验证码',
                  isMustFill: 0,
                  verifications: [],
                  options: []
                }
                if (item2.verifications.filter(res => res.mode === 1).length) {
                  obj.verifications.push({
                    id: '',
                    mode: 1,
                    value: ''
                  })
                }
                item1.formControls.splice(index2 + 1, 0, obj)
              }
            }
          }
        })
      })
      this.$http.put(`/api/v1.0/common/form/${this.uuid}/control`, formData).then((res) => {
        this.$alert('表单保存成功！', '保存成功', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
        store.commit('setIsSaveForm', true)
      })
    },
    // 元素拖拽
    dragAndDrop (evt) {
      let obj = evt
      this.clickItem = obj.added ? obj.added.newIndex : ''
      this.clickItem = obj.moved ? obj.moved.newIndex : ''
    },
    // 获取标签
    getTags (tag) {
      let self = this
      let text = tag || ''
      this.$http.get(`/api/v1.0/news/tag/options?page=1&per_page=20&text=${text}`).then((res) => {
        self.tagsOptions = res.data.data.rows
        return res.data.data.rows
      })
    },
    // 查询一级职级
    getOneEngineFunction () {
      let self = this
      this.$http.get('/api/v1.0/common/form/other/one_engine_function').then((res) => {
        self.oneEngineFunction = Global.engineFunctionFilter(res.data.data)
      })
    },
    // 查询全部职级
    getEngineFunction () {
      let self = this
      this.$http.get('/api/v1.0/common/form/other/engine_function').then((res) => {
        self.engineFunction = Global.allEngineFilter(res.data.data)
      })
    },
    // 查询产业链
    getIndustryChain () {
      let self = this
      this.$http.get('/api/v1.0/common/form/other/engine_industry_chain').then((res) => {
        self.industryChain = Global.industryChainFilter(res.data.data)
      })
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.getTags(query)
        }, 200)
      } else {
        this.tagsOptions = []
      }
    },
    changeOptions1 () {
      this.formControlsOptions2 = ''
      this.formControlsOptions3 = ''
      this.controlsOptions2 = this.engineFunction.filter(obj => {
        if (obj.value === this.formControlsOptions1) { return obj.children || [] }
      })
    },
    changeOptions2 () {
      this.controlsOptions3 = this.controlsOptions2[0].children.filter(obj => {
        if (obj.value === this.formControlsOptions2) { return obj.children || [] }
      })
    },
    changeOptions3 () {
    },
    handlePickerDate (e) {
      if (!e) {
        this.timeOptionRange = null
      }
    },
    containerData () {
      this.textareaDefaultValue = this.editor.getData()
    },
    // 字段富文本编辑
    initCkeditor (content) {
      let _vue = this
      if (this.editor) {
        this.editor.setData(content)
        return
      }
      window.ClassicEditor
        .create(document.querySelector('#editor'), {
          removePlugins: ['MediaEmbed', 'Table']
        })
        .then(editor => {
          if (content) {
            editor.setData(content)
          }
          _vue.editor = editor
          // 上传图片
          editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return new MyUploadAdapter(loader)
          }
        })
        .catch(error => {
          _vue.$message({
            type: 'warn',
            message: '编辑器初始化失败，请刷新页面或联系管理员',
            center: true,
            showClose: true
          })
          console.error(error)
        })
    },
    // 基本信息富文本编辑
    initBaseCkeditor (content) {
      let _vue = this
      window.ClassicEditor
        .create(document.querySelector('#formDescribe'), {
          removePlugins: ['MediaEmbed', 'Table']
        })
        .then(formDescribe => {
          if (content) {
            formDescribe.setData(content)
          }
          _vue.formDescribe = formDescribe
          // 上传图片
          formDescribe.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return new MyUploadAdapter(loader)
          }
        })
        .catch(error => {
          _vue.$message({
            type: 'warn',
            message: '编辑器初始化失败，请刷新页面或联系管理员',
            center: true,
            showClose: true
          })
          console.error(error)
        })
    },
    // 上传图片
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
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
        let key = 'cf/form/' + (new Date().getTime()) + '_' + file.name
        return _vue.$http.get('/api/v1.0/common/form/other/qiniu/token').then(response => {
          _vue.uploadData.token = response.data.data.token
          _vue.uploadData.key = key
        })
      }
    },
    uploadSuccess (res, file) {
      this.formBaseInfo.bgImage = file.response.key
    },
    uploadError () {
      this.$message({
        type: 'error',
        message: '文件上传失败，请稍后重试',
        center: true,
        showClose: true
      })
    },
    // 添加表单元素
    addFun (item, index) {
      console.log('添加的元素')
      console.log(item)
      store.commit('setIsRelease', false)
      store.commit('setIsSaveForm', false)
      if (item.identifier === 'page') {
        this.addPage()
      } else {
        let formMould = JSON.parse(JSON.stringify(this.formMould))
        let obj = {
          ...formMould,
          title: item.title,
          controlType: item.controlType,
          identifier: item.identifier,
          keyName: item.keyName,
          verifications: [],
          defaultValue: item.identifier === 'cf_textarea' ? '编辑器只做显示用，不可编辑' : ''
        }
        if (item.keyName === 'cf_mobile' || item.keyName === 'cf_email') {
          obj.verifications.push({
            id: '',
            mode: item.keyName === 'cf_mobile' ? 2 : 3,
            prompt: '',
            value: ''
          })
        }
        if (item.keyName === 'cf_identity') {
          obj.options = this.identityOptions
        }
        if (item.keyName === 'cf_working_year') {
          obj.options = this.workingYearOptions
        }
        if (item.keyName === 'cf_education') {
          obj.options = this.educationOptions
        }
        if (item.keyName === 'cf_rank') {
          obj.options = this.rankOptions
        }
        if (item.keyName === 'cf_one_engine_function') {
          obj.options = this.oneEngineFunction
        }
        if (item.keyName === 'cf_engine_industry_chain') {
          obj.options = this.industryChain
        }
        if (item.keyName === 'cf_engine_function') {
          obj.options = this.engineFunction
        }
        setTimeout(() => {
          console.log(obj.defaultValue)
        }, 2000)
        this.formData[this.clickPage].formControls.push(obj)
      }
      this.changeFixed()
    },
    // 分页
    addPage () {
      let pageMould = {
        id: null,
        pageNumber: '',
        formControls: []
      }
      this.formData.push(pageMould)
    },
    // 选择分页
    selctPage (num) {
      if (this.clickPage !== num) {
        this.clickPage = num
        this.clickItem = -1
        this.isShowContent = false
      }
    },
    // 删除分页
    closePage (index) {
      this.$confirm('此操作将永久删除该页面组件和配置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let arr = []
        if (index === 0) {
          this.formData[0].formControls.map((item, index) => {
            if (item.keyName === 'cf_name' || item.keyName === 'cf_mobile' || item.keyName === 'cf_code') {
              arr.push(item)
            }
          })
          console.log(arr)
          this.formData[0].formControls = JSON.parse(JSON.stringify(arr))
          this.clickPage = 0
        } else {
          this.formData[index].formControls.map((item, index) => {
            if (item.keyName === 'cf_name' || item.keyName === 'cf_mobile' || item.keyName === 'cf_code') {
              arr.push(item)
            }
          })
          console.log(arr)
          if (arr.length === 0) {
            this.formData.splice(index, 1)
          } else {
            this.formData[index].formControls = JSON.parse(JSON.stringify(arr))
          }
          this.clickPage = index - 1
        }
        this.isShowContent = false
        this.changeFixed()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除元素
    closeItem (index, num, item, e) {
      this.formData[index].formControls.splice(num, 1)
      this.isShowContent = false
      if (item.keyName === 'cf_mobile') {
        this.formData[index].formControls.map((i, n) => {
          if (i.keyName === 'cf_code') {
            this.formData[index].formControls.splice(n, 1)
          }
        })
      }
      this.changeFixed()
      e.stopPropagation()
    },
    handleClick (tab, event) {
      this.preserveBase()
      // if (!this.isUpDataFormBase) {
      //   this.$message({
      //     type: 'warn',
      //     message: '表单基本信息未保存'
      //   })
      // }
    },
    // 选择表单元素
    editForm (i, num, index) {
      console.log('选择表单元素', i)
      store.commit('setIsRelease', false)
      store.commit('setIsSaveForm', false)
      this.clickPage = index
      this.clickItem = num
      let item = JSON.parse(JSON.stringify(i))
      let formControls = {
        ...this.$options.data().formControls,
        id: item.id || '',
        title: item.title || '',
        prompting: item.prompting || '',
        defaultValue: item.defaultValue || '',
        keyName: item.keyName || '',
        identifier: item.identifier || '',
        controlType: item.controlType,
        verifications: item.verifications || [],
        option: item.options || []
      }
      if (item.verifications && item.verifications.length) {
        item.verifications.forEach(res => {
          switch (res.mode) {
            case 1:
              formControls.isMust = true
              break
            case 2:
              formControls.isMobile = true
              break
            case 3:
              formControls.isEmail = true
              break
            case 4:
              formControls.isCard = true
              break
            case 5:
              formControls.minNum = res.value
              break
            case 6:
              formControls.maxNum = res.value
              break
            case 7:
              formControls.minCheck = res.value
              break
            case 8:
              formControls.maxCheck = res.value
              break
            case 9:
              formControls.minStr = res.value
              break
            case 10:
              formControls.maxStr = res.value
              break
            case 11:
              formControls.minTime = res.value
              break
            case 12:
              formControls.maxTime = res.value
              break
            case 13:
              formControls.minDate = res.value
              break
            case 14:
              formControls.maxDate = res.value
              break
            case 15:
              formControls.isCode = true
              break
            case 16:
              formControls.isSelect = true
              break
            default:
              break
          }
        })
      }
      if (item.identifier === 'cf_textarea') {
        this.$nextTick(res => {
          this.initCkeditor(formControls.defaultValue)
        })
      } else {
        this.editor = null
      }
      if (formControls.keyName === 'cf_engine_function') {
        formControls.option = this.engineFunction
      }
      if (formControls.keyName === 'cf_identity') {
        formControls.isMust = true
        formControls.defaultValue = formControls.defaultValue ? formControls.defaultValue : '在职人员'
      }
      if (['cf_radio', 'cf_select'].indexOf(formControls.identifier) !== -1) {
        formControls.radioValue = formControls.defaultValue
      }
      if (['cf_checkbox'].indexOf(formControls.identifier) !== -1) {
        if (formControls.defaultValue.trim()) {
          let list = formControls.defaultValue.split('「-|-」')
          formControls.option.forEach(res => {
            if (list.filter(obj => obj === res.value).length) {
              res.isselect = true
            }
          })
        }
      }
      this.activeName = 'form'
      this.formControls = formControls
      this.isShowContent = true
    },
    // 校验点击
    checkItem (item, num) {
      let formControls = JSON.parse(JSON.stringify(this.formControls))
      if (num === 0 && !formControls.isMust) {
        formControls.isMobile = false
        formControls.isCard = false
        formControls.isEmail = false
      }
      if (num === 1 && formControls.isMobile) {
        formControls.isMust = true
        formControls.isEmail = false
        formControls.isCard = false
      }
      if (num === 2 && formControls.isEmail) {
        formControls.isMust = true
        formControls.isMobile = false
        formControls.isCard = false
      }
      if (num === 3 && formControls.isCard) {
        formControls.isMust = true
        formControls.isMobile = false
        formControls.isEmail = false
      }
      this.formControls = formControls
      console.log(this.formControls)
    },
    // 添加多选选项
    addCheckbox (obj) {
      let item = {
        id: '',
        isSelection: '',
        value: ''
      }
      this.formControls.option.push(item)
    },
    // 删除多选选项
    delCheckbox (item, num) {
      if (item.value === this.formControls.radioValue) {
        this.formControls.radioValue = ''
      }
      this.formControls.option.splice(num, 1)
    },
    // 多选框选择默认选项
    checkChange (num) {
      this.formControls.option[num].isSelection = true
    },
    // 单选按钮切换
    radioChange (val) {
    },
    clearOption () {
      this.formControls.radioValue = ''
    },
    backPage () {
      this.$router.go(-1)
    },
    // 保存单个表单元素的编辑
    preserveItem () {
      console.log('formControls', this.formControls)
      store.commit('setIsRelease', false)
      let formControls = JSON.parse(JSON.stringify(this.formControls))
      let formMain = {
        id: formControls.id || '',
        title: formControls.title || '',
        keyName: formControls.keyName || '',
        controlType: formControls.controlType || '',
        identifier: formControls.identifier || '',
        defaultValue: formControls.defaultValue || '',
        prompting: formControls.prompting || '',
        isMustFill: 0,
        verifications: [],
        options: []
      }
      // 标题非空验证
      if (formControls.identifier !== 'cf_textarea' && !formControls.title.trim()) {
        return this.$message.error('标题不得为空')
      }
      // 标题冲突验证
      if (formControls.controlType === 1 && this.flexdBtn.filter(res => res.title === formControls.title).length) {
        return this.$message.error('标题名称不得与固定功能键相同')
      }
      // 选项验证
      for (let i = 0; i < formControls.option.length; i++) {
        if (!formControls.option[i].value) { // 选项非空验证
          return this.$message.error('选项不得为空')
        }
        if (formMain.options.filter(res => res.value === formControls.option[i].value).length) { // 选项重复验证
          return this.$message.error('选项不得重复')
        } else {
          formMain.options.push({
            id: formControls.option[i].id,
            value: formControls.option[i].value,
            isSelection: 0
          })
        }
      }
      if (['cf_radio', 'cf_select'].indexOf(formControls.identifier) !== -1) {
        formMain.defaultValue = formControls.radioValue
      }
      if (['cf_textarea'].indexOf(formControls.identifier) !== -1) {
        formMain.defaultValue = this.editor.getData()
      }
      if (['cf_checkbox'].indexOf(formControls.identifier) !== -1) {
        if (formControls.option.filter(res => res.isselect).length) {
          formMain.defaultValue = formControls.option.filter(res => res.isselect).map(res => res.value).join('「-|-」')
        }
      }
      // 加入验证规则
      formMain.verifications = this.addRules(formControls)
      this.formData[this.clickPage].formControls[this.clickItem] = formMain
      this.formData = JSON.parse(JSON.stringify(this.formData))
      this.$message.success('保存成功')
      this.isShowContent = false
    },
    // 更新固定功能键是否可选
    changeFixed () {
      let fixedBtn = Global.flexdBtn()
      let list = []
      this.formData.forEach(res => {
        if (res.formControls && res.formControls.length) {
          list = list.concat(res.formControls)
        }
      })
      fixedBtn.forEach(res => {
        for (let i = 0; i < list.length; i++) {
          if (list[i].controlType === 2 && res.keyName === list[i].keyName) {
            res.disabled = true
            break
          }
        }
      })
      this.flexdBtn = fixedBtn
    },
    // 添加验证规则
    addRules (obj) {
      let list = []
      if (obj.isMust) {
        list.push({
          id: '',
          mode: 1,
          prompt: '',
          value: ''
        })
      }
      if (obj.isMobile) {
        list.push({
          id: '',
          mode: 2,
          prompt: '',
          value: ''
        })
      }
      if (obj.isEmail) {
        list.push({
          id: '',
          mode: 3,
          prompt: '',
          value: ''
        })
      }
      if (obj.isCard) {
        list.push({
          id: '',
          mode: 4,
          prompt: '',
          value: ''
        })
      }
      if (obj.minNum) {
        list.push({
          id: '',
          mode: 5,
          prompt: '',
          value: obj.minNum
        })
      }
      if (obj.maxNum) {
        list.push({
          id: '',
          mode: 6,
          prompt: '',
          value: obj.maxNum
        })
      }
      if (obj.minCheck) {
        list.push({
          id: '',
          mode: 7,
          prompt: '',
          value: obj.minCheck
        })
      }
      if (obj.maxCheck) {
        list.push({
          id: '',
          mode: 8,
          prompt: '',
          value: obj.maxCheck
        })
      }
      if (obj.minStr) {
        list.push({
          id: '',
          mode: 9,
          prompt: '',
          value: obj.minStr
        })
      }
      if (obj.maxStr) {
        list.push({
          id: '',
          mode: 10,
          prompt: '',
          value: obj.maxStr
        })
      }
      if (obj.minTime) {
        list.push({
          id: '',
          mode: 11,
          prompt: '',
          value: obj.minTime
        })
      }
      if (obj.maxTime) {
        list.push({
          id: '',
          mode: 12,
          prompt: '',
          value: obj.maxTime
        })
      }
      if (obj.minDate) {
        list.push({
          id: '',
          mode: 13,
          prompt: '',
          value: obj.minDate
        })
      }
      if (obj.maxDate) {
        list.push({
          id: '',
          mode: 14,
          prompt: '',
          value: obj.maxDate
        })
      }
      if (obj.isCode) {
        list.push({
          id: '',
          mode: 15,
          prompt: '',
          value: ''
        })
      }
      if (obj.isSelect) {
        list.push({
          id: '',
          mode: 16,
          prompt: '',
          value: ''
        })
      }
      return list
    }
  }
}
</script>
<style lang="scss">
@import './scss/edit.scss';
@import './scss/base.scss';
</style>
