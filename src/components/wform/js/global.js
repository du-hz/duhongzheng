
// 固定功能键
function flexdBtn () {
  let arr = [{
    title: '身份',
    disabled: false,
    keyName: 'cf_identity',
    identifier: 'cf_select',
    controlType: 2
  }, {
    title: '姓名',
    disabled: false,
    keyName: 'cf_name',
    identifier: 'cf_text',
    controlType: 2
  }, {
    title: '手机',
    disabled: false,
    keyName: 'cf_mobile',
    identifier: 'cf_mobile',
    controlType: 2
  }, {
    title: '邮箱',
    disabled: false,
    keyName: 'cf_email',
    identifier: 'cf_text',
    controlType: 2
  }, {
    title: '当前公司',
    disabled: false,
    keyName: 'cf_company',
    identifier: 'cf_text',
    controlType: 2
  }, {
    title: '当前职位',
    disabled: false,
    keyName: 'cf_job',
    identifier: 'cf_text',
    controlType: 2
  }, {
    title: '学校',
    disabled: false,
    keyName: 'cf_school',
    identifier: 'cf_text',
    controlType: 2
  }, {
    title: '专业',
    disabled: false,
    keyName: 'cf_major',
    identifier: 'cf_text',
    controlType: 2
  }, {
    title: '工作年限',
    disabled: false,
    keyName: 'cf_working_year',
    identifier: 'cf_select',
    controlType: 2
  }, {
    title: '学历',
    disabled: false,
    keyName: 'cf_education',
    identifier: 'cf_select',
    controlType: 2
  }, {
    title: '毕业年份',
    disabled: false,
    keyName: 'cf_finish_school_year',
    identifier: 'cf_date',
    controlType: 2
  }, {
    title: '产业链',
    disabled: false,
    keyName: 'cf_engine_industry_chain',
    identifier: 'cf_select',
    controlType: 2
  }, {
    title: '职能（三级）',
    disabled: false,
    keyName: 'cf_engine_function',
    identifier: 'cf_select',
    controlType: 2
  }, {
    title: '职能（一级）',
    disabled: false,
    keyName: 'cf_one_engine_function',
    identifier: 'cf_select',
    controlType: 2
  }, {
    title: '职级',
    disabled: false,
    keyName: 'cf_rank',
    identifier: 'cf_select',
    controlType: 2
  }, {
    title: '简历附件',
    disabled: false,
    keyName: 'cf_upload',
    identifier: 'cf_upload',
    controlType: 2
  }]
  return arr
}
// 基础功能键
function baseBtn () {
  let arr = [{
    title: '单行文本',
    disabled: false,
    keyName: '',
    identifier: 'cf_text',
    controlType: 1
  }, {
    title: '多行文本',
    disabled: false,
    keyName: '',
    identifier: 'cf_text_multi',
    controlType: 1
  }, {
    title: '单选框组',
    disabled: false,
    keyName: '',
    identifier: 'cf_radio',
    controlType: 1
  }, {
    title: '多选框组',
    disabled: false,
    keyName: '',
    identifier: 'cf_checkbox',
    controlType: 1
  }, {
    title: '下拉框',
    disabled: false,
    keyName: '',
    identifier: 'cf_select',
    controlType: 1
  }, {
    title: '日期选择器',
    disabled: false,
    keyName: '',
    identifier: 'cf_date',
    controlType: 1
  }, {
    title: '时间选择器',
    disabled: false,
    keyName: '',
    identifier: 'cf_time',
    controlType: 1
  }, {
    title: '数字',
    disabled: false,
    keyName: '',
    identifier: 'cf_num',
    controlType: 1
  }, {
    title: '编辑器',
    disabled: false,
    keyName: '',
    identifier: 'cf_textarea',
    controlType: 1
  }, {
    title: '分页',
    disabled: false,
    keyName: '',
    identifier: 'page',
    controlType: 1
  }]
  // {
  //   name: '级联选择器',
  //   disabled: false,
  //   key: 'name'
  // }
  return arr
}
// 提交表单基本信息
function formBaseInfo () {
  let data = {
    title: '',
    bgColor: '',
    bgImage: '',
    formDescribe: '',
    coverTitle: '', // 封面标题
    coverImage: '', // 封面图片
    coverDescribe: '', // 封面简介
    tags: []
  }
  return data
}
// 提交表单信息
function formData () {
  let data = [{
    id: null,
    pageNumber: '',
    formControls: []
  }]
  return data
}
// 分页模板
function pageMould () {
  let mould = {
    id: null,
    pageNumber: '',
    formControls: []
  }
  return mould
}
// 元素模板
function formMould () {
  let mould = {
    id: null, // 控件ID
    title: '', // 控件标题
    keyName: '', // 控件keyName
    controlType: '', // 类型1:通用控件 2：基本信息控件
    identifier: '', // 控件标识符
    defaultValue: '', // 默认值
    prompting: '', // 提示语
    isMustFill: 0, // 是否必填: 默认0:非必填
    verifications: [{
      id: null, // 验证ID
      mode: 1, // 是否为必填
      value: '', // 约束值
      prompt: '', // 提示语
      isselect: false // 是否选中
    }, {
      id: null, // 验证ID
      mode: 2, // 是否为手机号
      value: '', // 约束值
      prompt: '', // 提示语
      isselect: false // 是否选中
    }, {
      id: null, // 验证ID
      mode: 3, // 是否为邮箱
      value: '', // 约束值
      prompt: '', // 提示语
      isselect: false // 是否选中
    }, {
      id: null, // 验证ID
      mode: 4, // 是否为身份证
      value: '', // 约束值
      prompt: '', // 提示语
      isselect: false // 是否选中
    }, {
      id: null, // 验证ID
      mode: 5, // 最小值
      value: '', // 约束值
      prompt: '', // 提示语
      isselect: false // 是否选中
    }, {
      id: null, // 验证ID
      mode: 6, // 最大值
      value: '', // 约束值
      prompt: '', // 提示语
      isselect: false // 是否选中
    }, {
      id: null, // 验证ID
      mode: 7, // 最少选择项数
      value: '', // 约束值
      prompt: '', // 提示语
      isselect: false // 是否选中
    }, {
      id: null, // 验证ID
      mode: 8, // 最多选择项数
      value: '', // 约束值
      prompt: '', // 提示语
      isselect: false // 是否选中
    }, {
      id: null, // 验证ID
      mode: 9, // 最大长度
      value: '', // 约束值
      prompt: '', // 提示语
      isselect: false // 是否选中
    }, {
      id: null, // 验证ID
      mode: 10, // 最小长度
      value: '', // 约束值
      prompt: '', // 提示语
      isselect: false // 是否选中
    }, {
      id: null, // 验证ID
      mode: 11, // 最小时间
      value: '', // 约束值
      prompt: '', // 提示语
      isselect: false // 是否选中
    }, {
      id: null, // 验证ID
      mode: 12, // 最大时间
      value: '', // 约束值
      prompt: '', // 提示语
      isselect: false // 是否选中
    }, {
      id: null, // 验证ID
      mode: 13, // 最大日期
      value: '', // 约束值
      prompt: '', // 提示语
      isselect: false // 是否选中
    }, {
      id: null, // 验证ID
      mode: 14, // 最小日期
      value: '', // 约束值
      prompt: '', // 提示语
      isselect: false // 是否选中
    }, {
      id: null, // 验证ID
      mode: 15, // 验证码
      value: '', // 约束值
      prompt: '', // 提示语
      isselect: false // 是否选中
    }, {
      id: null, // 验证ID
      mode: 16, // 是否允许用户操作
      value: '', // 约束值
      prompt: '', // 提示语
      isselect: false // 是否选中
    }],
    options: [{
      id: null, // 选项ID
      value: '选项1', // 选项值
      isSelection: '', // 是否默认选中
      isselect: false // 是否选中
    }, {
      id: null, // 选项ID
      value: '选项2', // 选项值
      isSelection: '', // 是否默认选中
      isselect: false // 是否选中
    }]
  }
  return mould
}
// 表单基础信息编辑校验
function baseRules () {
  let rule = {
    title: [{
      required: true,
      message: '请输入表单标题',
      trigger: 'blur'
    }],
    formDescribe: [{
      required: true,
      message: '请输入表单简介',
      trigger: 'blur'
    }, {
      max: 255,
      message: '最多900个字符',
      trigger: 'blur'
    }]
  }
  return rule
}

// 字段信息校验
function controlsRules () {
  var titleValidator = (rule, value, callback) => {
    if (value === '') {
      console.log('为空')
      callback(new Error('请输入标题'))
    } else {
      console.log('重复')
      if (value === '姓名' || value === '手机' || value === '邮箱' || value === '当前公司' || value === '当前职位' || value === '学校' || value === '专业') {
        callback(new Error('与固定功能键重复'))
      }
      callback()
    }
  }
  let rule = {
    title: [{
      validator: titleValidator,
      trigger: 'blur'
    }]
  }
  return rule
}
// 返回职能（一级）
function engineFunctionFilter (val) {
  let arr = val.map(item => {
    return {
      id: null,
      value: item.name,
      isSelection: '',
      isselect: false
    }
  })
  return arr
}

// 返回全部职级
function allEngineFilter (val) {
  let arr = val.map(item => {
    if (item.childs && item.childs.length > 0) {
      return {
        id: null,
        value: item.name,
        label: item.name,
        isSelection: '',
        isselect: false,
        children: item.childs.map(i => {
          if (i.childs && i.childs.length > 0) {
            return {
              id: null,
              value: i.name,
              label: i.name,
              isSelection: '',
              isselect: false,
              children: i.childs.map(c => {
                return {
                  id: null,
                  value: c.name,
                  label: c.name,
                  isSelection: '',
                  isselect: false
                }
              })
            }
          } else {
            return {
              id: null,
              value: i.name,
              label: i.name,
              isSelection: '',
              isselect: false
            }
          }
        })
      }
    } else {
      return {
        id: null,
        value: item.name,
        label: item.name,
        isSelection: '',
        isselect: false,
        children: item.childs
      }
    }
  })
  return arr
}
// 返回产业链
function industryChainFilter (val) {
  let arr = val.map(item => {
    return {
      id: null,
      value: item.name,
      isSelection: '',
      isselect: false
    }
  })
  return arr
}
// 返回身份选择
function identityOptions () {
  let options = [{
    id: null, // 选项ID
    value: '在职人员', // 选项值
    isSelection: '', // 是否默认选中
    isselect: false // 是否选中
  }, {
    id: null, // 选项ID
    value: '学生', // 选项值
    isSelection: '', // 是否默认选中
    isselect: false // 是否选中
  }]
  return options
}
// 返回职级
function rankOptions () {
  let options = [{
    id: null, // 选项ID
    value: '辅助性专业人员', // 选项值
    isSelection: '', // 是否默认选中
    isselect: false // 是否选中
  }, {
    id: null, // 选项ID
    value: '（资深）工程师级别', // 选项值
    isSelection: '', // 是否默认选中
    isselect: false // 是否选中
  }, {
    id: null, // 选项ID
    value: '经理级', // 选项值
    isSelection: '', // 是否默认选中
    isselect: false // 是否选中
  }, {
    id: null, // 选项ID
    value: '总监及以上级别', // 选项值
    isSelection: '', // 是否默认选中
    isselect: false // 是否选中
  }]
  return options
}
// 返回工作年限
function workingYearOptions () {
  let options = [{
    id: null, // 选项ID
    value: '应届毕业生', // 选项值
    isSelection: '', // 是否默认选中
    isselect: false // 是否选中
  }, {
    id: null, // 选项ID
    value: '一年以下', // 选项值
    isSelection: '', // 是否默认选中
    isselect: false // 是否选中
  }, {
    id: null, // 选项ID
    value: '1-3年', // 选项值
    isSelection: '', // 是否默认选中
    isselect: false // 是否选中
  }, {
    id: null, // 选项ID
    value: '3-5年', // 选项值
    isSelection: '', // 是否默认选中
    isselect: false // 是否选中
  }, {
    id: null, // 选项ID
    value: '5-10年', // 选项值
    isSelection: '', // 是否默认选中
    isselect: false // 是否选中
  }, {
    id: null, // 选项ID
    value: '10年以上', // 选项值
    isSelection: '', // 是否默认选中
    isselect: false // 是否选中
  }]
  return options
}
// 返回学历
function educationOptions () {
  let options = [{
    id: null, // 选项ID
    value: '大专', // 选项值
    isSelection: '', // 是否默认选中
    isselect: false // 是否选中
  }, {
    id: null, // 选项ID
    value: '本科', // 选项值
    isSelection: '', // 是否默认选中
    isselect: false // 是否选中
  }, {
    id: null, // 选项ID
    value: '硕士', // 选项值
    isSelection: '', // 是否默认选中
    isselect: false // 是否选中
  }, {
    id: null, // 选项ID
    value: '博士', // 选项值
    isSelection: '', // 是否默认选中
    isselect: false // 是否选中
  }, {
    id: null, // 选项ID
    value: '其他', // 选项值
    isSelection: '', // 是否默认选中
    isselect: false // 是否选中
  }]
  return options
}
// 模板
function modelList () {
  let list = [{
    id: 'alHKTBNBTV',
    title: '空白模板',
    img: 'kongbaiM.png'
  }, {
    id: 'kVCvwAzrdC',
    title: '展会模板',
    img: 'zhanhuiM.png'
  }]
  return list
}
export default {
  flexdBtn: flexdBtn,
  baseBtn: baseBtn,
  pageMould: pageMould,
  formMould: formMould,
  formData: formData,
  baseRules: baseRules,
  controlsRules: controlsRules,
  identityOptions: identityOptions,
  workingYearOptions: workingYearOptions,
  educationOptions: educationOptions,
  rankOptions: rankOptions,
  formBaseInfo: formBaseInfo,
  engineFunctionFilter: engineFunctionFilter,
  industryChainFilter: industryChainFilter,
  allEngineFilter: allEngineFilter,
  modelList: modelList
}
