import Cookies from 'js-cookie'
import Vue from 'vue'
import _ from 'underscore'
import moment from 'moment'
import { Base64 } from 'js-base64'

const Config = process.env.NODE_ENV === 'production' ? require('../../../config/prod.env') : require('../../../config/dev.env')
// 自定义本地缓存方法
function setItem (key, value) {
  // 设置缓存内容，为保证高可用性，webStorage cookie 全局变量都缓存一份
  try {
    window.localStorage.setItem('testKey', 'testValue')
    window.localStorage.removeItem('testKey')
    window.localStorage.setItem(key, value)
  } catch (e) {
    console.log(e)
  }
  try {
    Cookies.set(key, value, { expires: 365 * 5 })
  } catch (e) {
    console.log(e)
  }
}

function getItem (key) {
  // 读取缓存内容，读取策略： webStorage --> cookie --> 全局变量
  var value = null
  try {
    window.localStorage.setItem('testKey', 'testValue')
    window.localStorage.removeItem('testKey')
    value = window.localStorage.getItem(key) || null
  } catch (e) {
    console.log(e)
  }
  if (value === null) {
    value = Cookies.get(key) || null
  }
  return value
}

function removeItem (key) {
  // 移除缓存信息，移除所有信息
  try {
    window.localStorage.setItem('testKey', 'testValue')
    window.localStorage.removeItem('testKey')
    window.localStorage.removeItem(key)
  } catch (e) {
    console.log(e)
  }
  Cookies.remove(key)
}

// 密码强度检测, 只检查复杂度，不检查长度
function checkPwdStrong (pwd) {
  // level: 1,弱  2,中等  >=3,强
  var level = 0
  if (/\d/.test(pwd)) level++ // 数字
  if (/[a-z]/.test(pwd) || /[A-Z]/.test(pwd)) level++ // 小写 或 大写
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) level++ // 同时包含大小写字母
  if (/\W/.test(pwd)) level++ // 特殊字符
  return level
}

// 检查用户是否已登录
function checkLogin () {
  return getItem('token') !== null && getItem('token') !== '' && getItem('token') !== 'undefined'
}

// 提取axios error信息
function extractErrorField (error) {
  var field = ''
  var errData = error.response.data.error
  if (errData) {
    var errObj = errData.errors && errData.errors[0]
    if (errObj) {
      field = errObj.field || ''
    }
  }
  return field
}

// 表单验证
function verification (type, str) {
  if (type === 'obj') {
    if (str.length > 0) {
      return true
    } else {
      return false
    }
  } else if (type === 'str') {
    if (str) {
      return true
    } else {
      return false
    }
  } else if (type === 'financialForecasts') {
    let status = false
    str.map(item => {
      if (item.financialForecasts && item.years) {
        status = true
      } else {
        status = false
      }
    })
    return status
  } else if (type === 'coreTeam') {
    let status = false
    str.map(item => {
      if (item.name && item.shareHolding) {
        status = true
      } else {
        status = false
      }
    })
    return status
  } else if (type === 'workExp') {
    console.log('workExp.length')
    console.log(str.length)
    console.log(str)
    let status = false
    if (str.length > 0) {
      str.map(i => {
        if (i.companyName && i.positions && i.startTime && (i.endTime || i.soFar)) {
          status = true
        } else {
          status = false
        }
      })
    } else {
      status = false
    }
    return status
  } else if (type === 'educationExp') {
    let status = false
    if (str.length > 0) {
      str.map(i => {
        if (i.schoolName && i.major && i.education && i.startTime && i.endTime) {
          status = true
        } else {
          status = false
        }
      })
    } else {
      status = false
    }
    return status
  }
}
// 提取axios error信息
function extractErrorCode (error) {
  var field = ''
  var errData = error.response.data.error
  if (errData) {
    var errObj = errData.errors && errData.errors[0]
    if (errObj) {
      field = errObj.code || ''
    }
  }
  return field
}

// 企业规模
function companySizeField (value) {
  let result = ''
  if (value === 1) result = '0-50人'
  else if (value === 2) result = '50-100人'
  else if (value === 3) result = '100-200人'
  else if (value === 4) result = '200-500人'
  else if (value === 5) result = '500-1000人'
  else if (value === 6) result = '1000人以上'
  else result = ''
  return result
}

// 产业链应用领域
function industryField (value) {
  let result = ''
  if (value === 1) result = '移动手持'
  else if (value === 2) result = '消费电子'
  else if (value === 3) result = '职能硬件'
  else if (value === 4) result = '通信网络'
  else if (value === 5) result = '医疗电子'
  else if (value === 6) result = '汽车电子'
  else if (value === 7) result = '工业控制'
  else if (value === 8) result = '能源控制'
  else if (value === 9) result = '安防监控'
  else if (value === 10) result = '军工航天'
  else if (value === 11) result = '安全标签'
  else result = ''
  return result
}

// 生产类型
function tapeoutPlanField (value) {
  let result = ''
  if (value === 1) result = '摩尔班车MPW'
  else if (value === 2) result = 'MPW'
  else if (value === 3) result = 'Full Mask'
  else result = ''
  return result
}

// 应用领域
Vue.filter('filterIndustry', function (value) {
  let result = ''
  const industry = [
    { label: '移动手持', value: 1 },
    { label: '消费电子', value: 2 },
    { label: '工业控制', value: 3 },
    { label: '智能硬件', value: 4 },
    { label: '通信网络', value: 5 },
    { label: '医疗电子', value: 6 },
    { label: '汽车电子', value: 7 },
    { label: '能源控制', value: 8 },
    { label: '安防监控', value: 9 },
    { label: '军工航天', value: 10 },
    { label: '安全标签', value: 11 }
  ]
  if (value) {
    _.each(value.split(','), (item) => {
      if (item) {
        let tmp = _.findWhere(industry, { value: parseInt(item) })
        if (tmp) {
          result += tmp.label + ','
        }
      }
    })
  }
  return result.substring(0, result.length - 1)
})
// 企业规模
Vue.filter('filterScale', function (value) {
  let result = ''
  const scale = [
    { label: '0-50人', value: 1 },
    { label: '50-100人', value: 2 },
    { label: '100-200人', value: 3 },
    { label: '200-500人', value: 4 },
    { label: '500-1000人', value: 5 },
    { label: '1000以上', value: 6 }
  ]
  if (value) {
    result = _.findWhere(scale, { value: parseInt(value) }).label
  }
  return result
})

// 摩尔班车
Vue.filter('filterPlanform', function (value) {
  let result = ''
  if (value === 1) result = 'MPW(摩尔班车)'
  else if (value === 2) result = 'MPW'
  else if (value === 3) result = 'Full Mask'
  else result = ''
  return result
})

// 订单状态
function orderStatusField (value) {
  let result = ''
  if (value === 0) result = '待审核'
  else if (value === 1) result = '已审核'
  else if (value === 2) result = '审核不通过'
  else if (value === 3) result = '订单完成'
  else result = ''
  return result
}

// 价格公式
function priceFormulaField (value) {
  let result = ''
  if (value === 0) result = '流片MPW方案一(预设)'
  else if (value === 1) result = '流片MPW方案二(含主rider)'
  else result = ''
  return result
}

// 订单状态
Vue.filter('filterOrderStatus', function (value) {
  let result = ''
  if (value === 0) result = '待审核'
  else if (value === 2) result = '审核不通过'
  else if (value === 1) result = '进行中'
  else if (value === 3) result = '已完成'
  else result = ''
  return result
})

// 用户审核状态
Vue.filter('filterStatus', function (value) {
  let result = ''
  if (value === 0) result = '待审核'
  else if (value === 1) result = '审核通过'
  else if (value === 2) result = '审核不通过'
  else result = ''
  return result
})

// 邮箱验证状态
Vue.filter('filterEmailStatus', function (value) {
  let result = ''
  if (value === 0) result = '未验证'
  else if (value === 1) result = '已验证'
  else if (value === 2) result = '邮件发送失败'
  else result = ''
  return result
})

// 轻猎头订单状态
Vue.filter('filterRecruitOrderStatus', function (value) {
  let result = ''
  if (value === 1) result = '待分配'
  else if (value === 2) result = '订单待确认'
  else if (value === 3) result = '候选人推荐中'
  else if (value === 4) result = '订单已完成'
  else if (value === 5) result = '订单待支付'
  else if (value === 6) result = '订单已关闭'
  else result = ''
  return result
})

// 轻猎头候选人状态
Vue.filter('filterCandidateStatus', function (value) {
  let result = ''
  if (value === 1) result = 'HR待处理'
  else if (value === 2) result = '安排面试'
  else if (value === 4) result = '已面试'
  else if (value === 5) result = '未到场'
  else if (value === 3) result = '不合适'
  else if (value === 6) result = '已入职'
  else if (value === 7) result = 'offer未接受'
  else if (value === 8) result = '发送面试通知'
  else result = ''
  return result
})

// 轻猎头候选人level
Vue.filter('filterCandidateLevel', function (value) {
  let result = ''
  if (value === 2) result = '工程师'
  else if (value === 3) result = '经理'
  else result = ''
  return result
})

// 轻猎头候选人workingYear
Vue.filter('filterCandidateWorkingYear', function (value) {
  let result = ''
  if (value === 1) result = '0-3年'
  else if (value === 2) result = '3-5年'
  else if (value === 3) result = '5-8年'
  else if (value === 4) result = '8-10年'
  else if (value === 5) result = '10年以上'
  else if (value === 6) result = '10-12年'
  else if (value === 7) result = '12-15年'
  else if (value === 8) result = '15年以上'
  else result = ''
  return result
})

// 工作经验
Vue.filter('filterWorkingYear', function (value) {
  let result = ''
  if (value === 1) result = '应届毕业生'
  else if (value === 2) result = '1年以下'
  else if (value === 3) result = '1-3年'
  else if (value === 4) result = '3-5年'
  else if (value === 5) result = '5-10年'
  else if (value === 6) result = '10年以上'
  else result = ''
  return result
})

// 学历
Vue.filter('filterEducation', function (value) {
  let result = ''
  if (value === 1) result = '大专'
  else if (value === 2) result = '本科'
  else if (value === 3) result = '硕士'
  else if (value === 4) result = '博士及以上'
  else result = ''
  return result
})

// FA学历
Vue.filter('filterFaEducation', function (value) {
  let result = ''
  value = parseInt(value)
  if (value === 1) result = '大专'
  else if (value === 2) result = '本科'
  else if (value === 3) result = '硕士'
  else if (value === 4) result = '博士'
  else result = ''
  return result
})

// 职级
Vue.filter('filterEngineRank', function (value) {
  let result = ''
  if (value === 1) result = '辅助性专业人员'
  else if (value === 2) result = '工程师'
  else if (value === 3) result = '经理'
  else if (value === 4) result = '总监及以上'
  else result = ''
  return result
})

// 轻猎头工作区域
Vue.filter('filterWorkArea', function (value) {
  let result = ''
  if (value === 1) result = '中国大陆地区'
  else if (value === 2) result = '港澳台地区'
  else if (value === 3) result = '亚洲其他区域'
  else if (value === 4) result = '欧美'
  else result = ''
  return result
})

// 背调订单状态
Vue.filter('filterSurveyStatus', function (value) {
  let result = ''
  if (value === 1) result = '待分配'
  else if (value === 2) result = '背调中'
  else if (value === 3) result = '调查完成'
  else if (value === 4) result = '订单关闭'
  else if (value === 5) result = '订单待支付'
  else result = ''
  return result
})

// 把数据库的操作权限信息 映射为 前端的操作(链接和路由跳转也是一种操作)
// 前端处理范围在操作或链接是否显示，请求的合法性由后端验证
// 检查是否有某一权限
function hasActionPermission (action) {
  let resourcePath = window.sessionStorage.getItem('resource_path')
  let resourceArr = resourcePath === null ? [] : JSON.parse(resourcePath)
  return resourceArr.indexOf(action) !== -1
}

function hasPathPermission (path) {
  if (path === '/' || path === '/login') {
    return true
  } else {
    let resourcePath = window.sessionStorage.getItem('nav_path')
    let resourceArr = resourcePath === null ? [] : JSON.parse(resourcePath)
    return resourceArr.indexOf(path) !== -1
  }
}

// unix时间格式化
function formatTime (value, type) {
  let date = new Date(value)
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  if (/(y+)/.test(type)) {
    type = type.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(type)) {
      type = type.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return type
}

function isBlankStr (val) {
  if (val === undefined || val === null || val === '') {
    return true
  } else {
    return false
  }
}

function isBlankArr (val) {
  if (val === undefined || val === null || val.length === 0) {
    return true
  } else {
    return false
  }
}

function findObjArrNamesByValuesStr (arr, keyName, valueName, valueIds) {
  let result = findObjArrNamesByValues(arr, keyName, valueName, valueIds)
  if (isBlankArr(result)) {
    return ''
  } else {
    return result.join(',')
  }
}

function findObjArrNamesByValues (arr, keyName, valueName, valueIds) {
  if (isBlankArr(valueIds)) {
    return []
  }
  let names = []
  valueIds.forEach(function (v) {
    let nameStr = findObjArrNamesByValue(arr, keyName, valueName, v)
    if (!isBlankStr(nameStr)) {
      names.push(nameStr)
    }
  })
  return names
}

function findObjArrNamesByValue (arr, keyName, valueName, value) {
  let nameStr = ''
  arr.some(function (v) {
    if (v[keyName] === value) {
      nameStr = v[valueName]
      return true
    }
  })
  return nameStr
}

function parseCandidateParams (searchForm) {
  let str = formatStrAndUnderline(searchForm.keyword) + // 名字
    '&&' + formatStrAndUnderline(searchForm.searchName) + // 关键词
    '&&' + recoverArrAndUnderline(searchForm.industryIds) + // 产业链
    '&&' + recoverArrAndUnderline(searchForm.functionIds) + // 职能
    '&&' + recoverArrAndUnderline(searchForm.cityIds) + // 城市
    '&&' + recoverArrAndUnderline(searchForm.rankIds) + // 职级
    '&&' + recoverArrAndUnderline(searchForm.eduIds) + // 教育经历
    '&&' + recoverArrAndUnderline(searchForm.workYearIds) + // 工作经验
    '&&' + recoverArrAndUnderline(searchForm.lastActiveIds) + // 最后活跃时间
    '&&' + recoverArrAndUnderline(searchForm.userSources) + // 用户来源
    '&&' + formatStrAndUnderline(searchForm.companyName) + // 公司名称
    '&&' + formatStrAndUnderline(searchForm.position) + // 职位关键词
    '&&' + (searchForm.isLastOnly ? 1 : 0) + // 是否当前工作经验
    '&&' + (searchForm.explict ? 1 : 0) + // 是否精准搜索
    '&&' + formatStrAndUnderline(searchForm.schoolName) + // 学校名称
    '&&' + formatStrAndUnderline(searchForm.study) + // 专业
    '&&' + recoverArrAndUnderline(searchForm.cityChildrenNames) + // 城市子专业
    '&&' + recoverArrAndUnderline(searchForm.lastDeliverIds) // 最后投递时间
  return str
}

function splitStr (val) {
  if (val === undefined || val === null || val === '') {
    return []
  }
  let strArr = val.split(',')
  let arr = []
  try {
    strArr.forEach(function (v) {
      if (typeof (v) === 'string' && v.startsWith('00') > -1) {
        arr.push(v)
      } else {
        arr.push(parseInt(v))
      }
    })
    return arr
  } catch (e) {
    return strArr
  }
}

function recoverArr (arr) {
  if (arr === undefined || arr === null || arr.length === 0) {
    return ''
  }
  return arr.join(',')
}

function recoverArrAndUnderline (arr) {
  if (arr === undefined || arr === null || arr.length === 0) {
    return '-'
  }
  return arr.join(',')
}

function formatStrAndUnderline (str) {
  if (str === undefined || str === null || str === '') {
    return '-'
  }
  return str
}

function recoverCandidateParams (str) {
  let searchForm = {
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
    cityChildrenNames: [],
    lastDeliverIds: []
  }
  if (str === undefined || str === null || str === '') {
    return searchForm
  }
  let arr = str.split('&&')
  if (arr[0] !== undefined && arr[0] !== '-') { searchForm.keyword = arr[0] }
  if (arr[1] !== undefined && arr[1] !== '-') { searchForm.searchName = arr[1] }
  if (arr[2] !== undefined && arr[2] !== '-') { searchForm.industryIds = splitStr(arr[2]) }
  if (arr[3] !== undefined && arr[3] !== '-') { searchForm.functionIds = splitStr(arr[3]) }
  if (arr[4] !== undefined && arr[4] !== '-') { searchForm.cityIds = splitStr(arr[4]) }
  if (arr[5] !== undefined && arr[5] !== '-') { searchForm.rankIds = splitStr(arr[5]) }
  if (arr[6] !== undefined && arr[6] !== '-') { searchForm.eduIds = splitStr(arr[6]) }
  if (arr[7] !== undefined && arr[7] !== '-') { searchForm.workYearIds = splitStr(arr[7]) }
  if (arr[8] !== undefined && arr[8] !== '-') { searchForm.lastActiveIds = splitStr(arr[8]) }
  if (arr[9] !== undefined && arr[9] !== '-') { searchForm.userSources = splitStr(arr[9]) }
  if (arr[10] !== undefined && arr[10] !== '-') { searchForm.companyName = arr[10] }
  if (arr[11] !== undefined && arr[11] !== '-') { searchForm.position = arr[11] }
  if (arr[12] !== undefined && arr[12] !== '-') { searchForm.isLastOnly = parseInt(arr[12]) }
  if (arr[13] !== undefined && arr[13] !== '-') { searchForm.explict = parseInt(arr[13]) }
  if (arr[14] !== undefined && arr[14] !== '-') { searchForm.schoolName = arr[14] }
  if (arr[15] !== undefined && arr[15] !== '-') { searchForm.study = arr[15] }
  if (arr[16] !== undefined && arr[16] !== '-') { searchForm.cityChildrenNames = splitStr(arr[16]) }
  if (arr[17] !== undefined && arr[17] !== '-') { searchForm.lastDeliverIds = splitStr(arr[17]) }
  return searchForm
}
// 根据拼团人数返回价格
function getPriceByCount (count) {
  let result = 0
  if (count >= 1 && count <= 5) {
    result = 0
  } else if (count >= 6 && count <= 10) {
    result = 1
  } else if (count >= 11 && count <= 15) {
    result = 2
  } else if (count >= 16 && count <= 20) {
    result = 3
  } else if (count >= 20 && count <= 25) {
    result = 4
  } else if (count >= 25) {
    result = 5
  }
  return result
}

// 格式化时间 - 全局过滤器
Vue.filter('filterDateformat', function (value, formatStr) {
  if (value === '') {
    return ''
  } else {
    return moment(value).format(formatStr || 'YYYY-MM-DD')
  }
})

// 格式化时间 - 全局过滤器
Vue.filter('filterDateformatH', function (value, formatStr) {
  if (value === '') {
    return ''
  } else {
    return moment(value).format(formatStr || 'YYYY-MM-DD HH:mm:ss')
  }
})

Vue.filter('formatTime', function (value, type) {
  let date = new Date(value)
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  if (/(y+)/.test(type)) {
    type = type.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(type)) {
      type = type.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return type
})

function base64Encode (str) {
  return Base64.encode(str || '').replace('/', '_').replace('+', '_')
}
// 拆分文件后缀和文件名
function splitFileName (filename) {
  let result = []
  if (filename && filename.indexOf('.') !== -1) {
    let index = filename.lastIndexOf('.')
    result[0] = filename.substring(0, index)
    result[1] = filename.substring(index + 1)
  }
  return result
}

// 图片添加七牛前缀
Vue.filter('filterQiniuImage', function (value) {
  let qiniuUrl = ''
  if (value) {
    if (value.startsWith('cloud/')) {
      // 需要拼接七牛域名
      qiniuUrl = Config.QINIU_BUCKET_URL + '/' + value + '-200'
    } else {
      qiniuUrl = value
    }
  }
  return qiniuUrl
})
// 图片添加七牛前缀
Vue.filter('filterQiniuImageMF', function (value) {
  let qiniuUrl = ''
  if (value) {
    if (!value.startsWith('http')) {
      // 需要拼接七牛域名
      qiniuUrl = Config.QINIU_BUCKET_URL + '/' + value
    } else {
      qiniuUrl = value
    }
  }
  return qiniuUrl
})
// 图片添加七牛前缀
Vue.filter('filterQiniuImageMFShare', function (value) {
  let qiniuUrl = ''
  if (value) {
    if (!value.startsWith('http')) {
      // 需要拼接七牛域名
      qiniuUrl = Config.QINIU_BUCKET_URL + '/' + value + '-200'
    } else {
      qiniuUrl = value
    }
  }
  return qiniuUrl
})

Vue.filter('filterQiniuMooreImage', function (value) {
  let qiniuUrl = ''
  if (value) {
    if (!value.startsWith('http')) {
      // 需要拼接七牛域名
      qiniuUrl = Config.QINIU_BUCKET_MOORE_IMAGE_URL + '/' + value + '-200'
    } else {
      qiniuUrl = value
    }
  }
  return qiniuUrl
})

// 文件添加七牛前缀
Vue.filter('filterQiniuFile', function (value, type) {
  let qiniuUrl = ''
  if (value) {
    if (value.startsWith('cloud/')) {
      // 需要拼接七牛域名
      qiniuUrl = Config.QINIU_BUCKET_FILE_URL + '/' + value
    } else {
      qiniuUrl = value
    }
  }
  return qiniuUrl
})
Vue.filter('filterQiniuMooreFile', function (value, type) {
  let qiniuUrl = ''
  if (value) {
    if (!value.startsWith('http')) {
      // 需要拼接七牛域名
      qiniuUrl = Config.QINIU_BUCKET_MOORE_FILE_URL + '/' + value
    } else {
      qiniuUrl = value
    }
  }
  return qiniuUrl
})

// 产品方向
function proDir () {
  let arr = [
    {
      'label': '应用处理器',
      'value': 1
    }, {
      'label': '网络处理器',
      'value': 2
    }, {
      'label': '数字信号处理器（DSP）',
      'value': 3
    }, {
      'label': '通信基带芯片',
      'value': 4
    }, {
      'label': 'IoT SoC',
      'value': 5
    }, {
      'label': '存储器',
      'value': 6
    }, {
      'label': '微控制器（MCU）',
      'value': 7
    }, {
      'label': '模拟驱动芯片',
      'value': 8
    }, {
      'label': '电源芯片',
      'value': 9
    }, {
      'label': '传感器',
      'value': 10
    }, {
      'label': '模拟信号链',
      'value': 11
    }, {
      'label': 'RF',
      'value': 12
    }, {
      'label': '其他',
      'value': 13
    }
  ]
  return arr
}
// 格式化为tree组件可识别的属性 id(number), label(string), children(arr: id, label)
function formatPermitData (permits) {
  let result = []
  if (permits !== undefined && permits.length !== 0) {
    let firPermits = _.filter(permits, (permit) => {
      return permit.level === 1
    })
    let secPermits = _.filter(permits, (permit) => {
      return permit.level === 2
    })
    let thirdPermits = _.filter(permits, (permit) => {
      return permit.level === 3
    })

    let secNodes = []
    _.each(secPermits, (permit) => {
      let node = {}
      node.id = permit.resourceId
      node.label = permit.resourceTitle
      node.children = []
      secNodes.push(node)
    })
    secNodes = _.sortBy(secNodes, 'id')

    let firNodes = []
    _.each(firPermits, (permit) => {
      let node = {}
      node.id = permit.resourceId
      node.label = permit.resourceTitle
      node.children = []
      firNodes.push(node)
    })
    firNodes = _.sortBy(firNodes, 'id')

    _.each(secNodes, (node) => {
      let nodeId = node.id + ''

      _.each(thirdPermits, (permit) => {
        let resourceId = permit.resourceId + ''
        if (resourceId.startsWith(nodeId)) {
          let childNode = {}
          childNode.id = permit.resourceId
          childNode.label = permit.resourceTitle
          node.children.push(childNode)
        }
      })
      node.children = _.sortBy(node.children, 'id')
    })

    _.each(firNodes, (node) => {
      let nodeId = node.id + ''

      _.each(secNodes, (childNode) => {
        let resourceId = childNode.id + ''
        if (resourceId.startsWith(nodeId)) {
          node.children.push(childNode)
        }
      })
      result.push(node)
    })
  }
  return result
}

// IP type 把 Others 分类放在最后一个
function resetOthersType (arr) {
  let index = -1
  let otherType = _.findWhere(arr, { typeName: 'Others' })
  _.each(arr, (item, i) => {
    if (item.typeName === 'Others') {
      index = i
      return false
    }
  })
  if (index !== -1 && otherType !== undefined) {
    arr.splice(index, 1)
    arr.push(otherType)
  }
  return arr
}

export default {
  verification: verification,
  setItem: setItem,
  getItem: getItem,
  removeItem: removeItem,
  splitStr: splitStr,
  recoverArr: recoverArr,
  parseCandidateParams: parseCandidateParams,
  recoverCandidateParams: recoverCandidateParams,
  checkPwdStrong: checkPwdStrong,
  extractErrorField: extractErrorField,
  extractErrorCode: extractErrorCode,
  companySizeField: companySizeField,
  industryField: industryField,
  tapeoutPlanField: tapeoutPlanField,
  orderStatusField: orderStatusField,
  priceFormulaField: priceFormulaField,
  checkLogin: checkLogin,
  hasActionPermission: hasActionPermission,
  hasPathPermission: hasPathPermission,
  formatTime: formatTime,
  proDir: proDir,
  formatPermitData: formatPermitData,
  getPriceByCount: getPriceByCount,
  base64Encode: base64Encode,
  splitFileName: splitFileName,
  isBlankStr: isBlankStr,
  isBlankArr: isBlankArr,
  findObjArrNamesByValues: findObjArrNamesByValues,
  findObjArrNamesByValuesStr: findObjArrNamesByValuesStr,
  resetOthersType: resetOthersType,
  CONFIG: process.env.NODE_ENV === 'production' ? require('../../../config/prod.env') : require('../../../config/dev.env'),
  REGEX: {
    'EMAIL': /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, // 邮箱地址
    'MOBILE': /^1[3|4|5|6|7|8|9][0-9]{9}$/, // 手机号码
    'FIXEDPHONE': /^(\d{2,4}-?)?\d{7,8}(-\d{1,4})?$/, // 固话
    'TELEPHONE': /(^1[3|4|5|6|7|8|9][0-9]{9}$)|(^(\d{2,4}-?)?\d{7,8}(-\d{1,4})?$)/, // 手机或固话
    'ALLPHONE': /^(([0-9+\-;])+)$/, // 数字 - + ;  验证所有联系方式-固话手机国外电话等
    'WEBSITE': /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/, // 网址
    'CREDIT': /^(\d|[A-Z]){18}$/, // 18位数字和大写字母
    'INTEGER': /^(\d+)$/, // 整数
    'ALPHANUMERIC': /^([^\u4e00-\u9fa5]+)$/, // 非中文字符
    'COEFFICIENT': /^0(\.\d{1,2})+$/, // 大于0 小于1 最多两位小数
    'NUMGTZERO': /([1-9]\d*(\.\d*[1-9])?)/ // 大于0的数字
  },
  CONSTANT: {
    INDUSTRY: [
      { label: '移动手持', value: 1 },
      { label: '消费电子', value: 2 },
      { label: '工业控制', value: 3 },
      { label: '智能硬件', value: 4 },
      { label: '通信网络', value: 5 },
      { label: '医疗电子', value: 6 },
      { label: '汽车电子', value: 7 },
      { label: '能源控制', value: 8 },
      { label: '安防监控', value: 9 },
      { label: '军工航天', value: 10 },
      { label: '安全标签', value: 11 },
      { label: 'IP/EDA厂商', value: 12 }
    ],
    SCALE: [
      { label: '0-50人', value: 1 },
      { label: '50-100人', value: 2 },
      { label: '100-200人', value: 3 },
      { label: '200-500人', value: 4 },
      { label: '500-1000人', value: 5 },
      { label: '1000以上', value: 6 }
    ],
    RANK: [
      { label: '辅助性专业人员', value: 1 },
      { label: '工程师', value: 2 },
      { label: '经理', value: 3 },
      { label: '总监及以上', value: 4 }
    ],
    CANDIDATE_LEVEL: [
      { label: '工程师', value: 2 },
      { label: '经理', value: 3 }
    ],
    CANDIDATE_LEVEL1_WY: [
      { label: '0-3年', value: 1 },
      { label: '3-5年', value: 2 },
      { label: '5-8年', value: 3 },
      { label: '8-10年', value: 4 },
      { label: '10年及以上', value: 5 }
    ],
    CANDIDATE_LEVEL2_WY: [
      { label: '5-8年', value: 3 },
      { label: '8-10年', value: 4 },
      { label: '10-12年', value: 6 },
      { label: '12-15年', value: 7 },
      { label: '15年及以上', value: 8 }
    ],
    WORK_AREA: [
      { label: '中国大陆地区', value: 1 },
      { label: '港澳台地区', value: 2 },
      { label: '亚洲其他区域', value: 3 },
      { label: '欧美', value: 4 }
    ],
    EDUCATION: [
      { label: '大专', value: 1 },
      { label: '本科', value: 2 },
      { label: '硕士', value: 3 },
      { label: '博士及以上', value: 4 }
    ],
    WORKING_YEAR: [
      { label: '应届毕业生', value: 1 },
      { label: '1年以下', value: 2 },
      { label: '1-3年', value: 3 },
      { label: '3-5年', value: 4 },
      { label: '5-10年', value: 5 },
      { label: '10年以上', value: 6 }
    ],
    USER_SOURCE: [
      { label: '摩尔用户', value: 1 },
      { label: '有本用户', value: 2 },
      { label: 'allways用户', value: 3 }
    ],
    LAST_ACTIVE: [
      { label: '3天内活跃', value: 3 },
      { label: '7天内活跃', value: 7 },
      { label: '14天内活跃', value: 14 },
      { label: '30天内活跃', value: 30 },
      { label: '90天内活跃', value: 90 }
    ],
    LAST_DELIVER: [
      { label: '3天内投递', value: 3 },
      { label: '7天内投递', value: 7 },
      { label: '14天内投递', value: 14 },
      { label: '30天内投递', value: 30 },
      { label: '90天内投递', value: 90 }
    ],
    INVESTORSTAGE: [
      { label: '种子', value: 1 },
      { label: '天使', value: 2 },
      { label: 'Pre-A', value: 3 },
      { label: 'A', value: 4 },
      { label: 'B', value: 5 },
      { label: 'C', value: 6 },
      { label: 'Pre-IPO', value: 7 }
    ]
  }
}
