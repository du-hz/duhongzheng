import Vue from 'vue'
import _ from 'underscore'

// 产业类别通用过滤器  在入口文件main.js中注册全局过滤器
// 行业领域
Vue.filter('industryCategoryFilter', function (value) {
  let result = ''
  const industryCategory = [
    { label: '消费电子、家电', value: 1 },
    { label: '装备、电工电气', value: 2 },
    { label: '企业、办公', value: 3 },
    { label: '通讯、网络', value: 4 },
    { label: '医疗', value: 5 },
    { label: '汽车、运输', value: 6 },
    { label: '工业控制', value: 7 },
    { label: '能源控制', value: 8 },
    { label: '安防监控', value: 9 },
    { label: '军工、航天', value: 10 },
    { label: '电子标签', value: 11 },
    { label: '其他智能硬件', value: 12 }
  ]
  if (value) {
    _.each(value.split(','), (item) => {
      if (item) {
        let tmp = _.findWhere(industryCategory, { value: parseInt(item) })
        if (tmp) {
          result += tmp.label + ','
        }
      }
    })
    return result.substring(0, result.length - 1)
  } else {
    return ''
  }
})

function handleIndustryCategory (value) {
  let result = ''
  const industryCategory = [
    { label: '消费电子、家电', value: 1 },
    { label: '装备、电工电气', value: 2 },
    { label: '企业、办公', value: 3 },
    { label: '通讯、网络', value: 4 },
    { label: '医疗', value: 5 },
    { label: '汽车、运输', value: 6 },
    { label: '工业控制', value: 7 },
    { label: '能源控制', value: 8 },
    { label: '安防监控', value: 9 },
    { label: '军工、航天', value: 10 },
    { label: '电子标签', value: 11 },
    { label: '其他智能硬件', value: 12 }
  ]
  if (value) {
    _.each(value.split(','), (item) => {
      if (item) {
        let tmp = _.findWhere(industryCategory, { value: parseInt(item) })
        if (tmp) {
          result += tmp.label + ','
        }
      }
    })
    return result.substring(0, result.length - 1)
  } else {
    return ''
  }
}

// 主投阶段通用过滤器
Vue.filter('investStageFilter', function (value) {
  let result = ''
  const investStage = [
    { label: '种子', value: 1 },
    { label: '天使', value: 2 },
    { label: 'Pre-A', value: 3 },
    { label: 'A轮', value: 4 },
    { label: 'B轮', value: 5 },
    { label: 'C轮', value: 6 },
    { label: 'Pre-IPO', value: 7 }
  ]
  if (value) {
    value += ''
    _.each(value.split(','), (item) => {
      if (item) {
        let tmp = _.findWhere(investStage, { value: parseInt(item) })
        if (tmp) {
          result += tmp.label + ','
        }
      }
    })
    return result.substring(0, result.length - 1)
  } else {
    return ''
  }
})

function handleInvestStage (value) {
  let result = ''
  const investStage = [
    { label: '种子', value: 1 },
    { label: '天使', value: 2 },
    { label: 'Pre-A', value: 3 },
    { label: 'A轮', value: 4 },
    { label: 'B轮', value: 5 },
    { label: 'C轮', value: 6 },
    { label: 'Pre-IPO', value: 7 }
  ]
  if (value) {
    value += ''
    let tmpArr = value.split(',')
    tmpArr = _.sortBy(tmpArr, item => {
      return item * 1
    })
    _.each(tmpArr, (item) => {
      if (item) {
        let tmp = _.findWhere(investStage, { value: parseInt(item) })
        if (tmp) {
          result += tmp.label + ','
        }
      }
    })
    return result.substring(0, result.length - 1)
  } else {
    return ''
  }
}

// 合并标签 TODO: 算法待优化，用递归
function handleAllTag (arr) {
  let result = []
  _.each(arr, item => {
    let tmp = {
      id: item.id,
      name: item.name
    }
    result.push(tmp)
    if (item.childTag && item.childTag.length > 0) {
      _.each(item.childTag, item => {
        let tmp1 = {
          id: item.id,
          name: item.name
        }
        result.push(tmp1)
      })
    }
  })
  return result
}

// 消息状态码说明
// -----会议状态---------
// 101,"投资人对项目方发起会议邀请"
// 102,"项目方拒绝会议"
// 103,"项目方接受会议"
// 104,"投资人取消会议"
// 105,"项目方取消会议"
// 106,"会议正常结束"
// 107,"项目方发起会议修改"
// 108,"投资人发起会议修改"
// 109,"会议修改成功"
// 110,"技术专家接受会议"
// 111,"技术专家拒绝会议"
// 112,"项目方对技术专家发起会议邀请"
// ------项目推荐给投资人状态---
// 301,"推荐新项目"
// 302,"对项目感兴趣"
// 303,"对项目不感兴趣"
// 304,"沟通后不感兴趣"
// 305,"已沟通继续跟进"
// 306,"已沟通确认投资"
// 307,"感兴趣会议未进行"
// ------项目推荐给技术专家-------
// 401,"推荐新项目"
// 402,"评估项目"
// ------用户状态----------
// 501,"新用户注册"
// 502,"FA完善用户信息"
// 503,"信息核对确认"
// 504,"用户发起信息修改需求"
// 505,"用户对核对信息存在疑问 "
// 506,"FA修改用户手机号"
// 507,"用户验证完手机号"

// 根据消息状态码生成消息
function geneMessage (item) {
  let message = ''
  let code = item.code
  let roleName = ''
  let redirectUrl = ''
  if (item.userType === 1) {
    roleName = '项目方'
  }
  if (item.userType === 2) {
    roleName = '投资人'
  }
  if (item.userType === 3) {
    roleName = '技术专家'
  }
  // 用户状态
  if (code === 501) {
    message = '【' + roleName + ' ' + (item.name || '') + '】 注册了平台 待沟通'
    if (item.roleType === 1) {
      redirectUrl = '/fa/project/' + item.roleId
    }
    if (item.roleType === 2) {
      redirectUrl = '/fa/investor/person/' + item.roleId
    }
    if (item.roleType === 3) {
      redirectUrl = '/fa/expert/' + item.roleId
    }
  }
  if (code === 502) {
    // message = 'FA完善用户信息'
  }
  if (code === 503) {
    message = '【' + roleName + ' ' + (item.name || '') + '】 信息已核对确认'
  }
  if (code === 504) {
    message = '【' + roleName + ' ' + (item.name || '') + '】 发起信息修改需求'
    if (item.roleType === 1) {
      redirectUrl = '/fa/project/' + item.roleId
    }
    if (item.roleType === 2) {
      redirectUrl = '/fa/investor/person/' + item.roleId
    }
    if (item.roleType === 3) {
      redirectUrl = '/fa/expert/' + item.roleId
    }
  }
  if (code === 505) {
    message = '【' + roleName + ' ' + (item.name || '') + '】 对用户信息存在疑问'
    if (item.roleType === 1) {
      redirectUrl = '/fa/project/' + item.roleId
    }
    if (item.roleType === 2) {
      redirectUrl = '/fa/investor/person/' + item.roleId
    }
    if (item.roleType === 3) {
      redirectUrl = '/fa/expert/' + item.roleId
    }
  }
  if (code === 506) {
    // message = 'FA修改用户手机号'
  }
  if (code === 507) {
    message = '用户验证完手机号'
  }
  // 项目推荐给技术专家
  if (code === 401) {
    // message = '推荐新项目'
  }
  if (code === 402) {
    message = '【' + roleName + ' ' + (item.name || '') + '】 评估了项目'
  }
  // 项目推荐给投资人
  if (code === 301) {
    // message = '推荐新项目'
  }
  if (code === 302) {
    message = '【' + roleName + ' ' + (item.name || '') + '】 对项目感兴趣'
  }
  if (code === 303) {
    message = '【' + roleName + ' ' + (item.name || '') + '】 对项目不感兴趣'
  }
  if (code === 304) {
    message = '【' + roleName + ' ' + (item.name || '') + '】 沟通后不感兴趣'
  }
  if (code === 305) {
    message = '【' + roleName + ' ' + (item.name || '') + '】 已沟通继续跟进'
  }
  if (code === 306) {
    message = '【' + roleName + ' ' + (item.name || '') + '】 已沟通确认投资'
  }
  if (code === 307) {
    message = '感兴趣会议未进行'
  }
  // 会议状态
  if (code === 101) {
    message = '【' + roleName + ' ' + (item.name || '') + '】 对项目方发起会议邀请'
    redirectUrl = '/fa/project/' + item.roleId
  }
  if (code === 102) {
    message = '【' + roleName + ' ' + (item.name || '') + '】 拒绝会议'
  }
  if (code === 103) {
    message = '【' + roleName + ' ' + (item.name || '') + '】 接受会议'
  }
  if (code === 104) {
    message = '【' + roleName + ' ' + (item.name || '') + '】 取消会议'
    redirectUrl = '/fa/project/' + item.roleId
  }
  if (code === 105) {
    message = '【' + roleName + ' ' + (item.name || '') + '】 取消会议'
    redirectUrl = '/fa/project/' + item.roleId
  }
  if (code === 106) {
    message = '会议正常结束'
  }
  if (code === 107) {
    message = '【项目方 ' + (item.name || '') + '】' + '发起会议修改'
    redirectUrl = '/fa/project/' + item.roleId
  }
  if (code === 108) {
    message = '【' + roleName + ' ' + (item.name || '') + '】 发起会议修改'
    redirectUrl = '/fa/project/' + item.roleId
  }
  if (code === 109) {
    message = '会议修改成功'
  }
  if (code === 110) {
    message = '【' + roleName + ' ' + (item.name || '') + '】 接受会议'
  }
  if (code === 111) {
    message = '【' + roleName + ' ' + (item.name || '') + '】 拒绝会议'
  }
  if (code === 112) {
    message = '【' + roleName + ' ' + (item.name || '') + '】 对技术专家发起会议邀请'
  }
  return {
    message: message,
    redirectUrl: redirectUrl
  }
}

export default {
  handleAllTag: handleAllTag,
  handleInvestStage: handleInvestStage,
  handleIndustryCategory: handleIndustryCategory,
  geneMessage: geneMessage
}
