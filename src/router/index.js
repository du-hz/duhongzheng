import Vue from 'vue'
import Router from 'vue-router'

import PerfIndex from '@/components/perf/index'
import MemberList from '@/components/perf/member/MemberList'
import LabelList from '@/components/perf/label/LabelList'
import ResumeList from '@/components/perf/resume/ResumeList'
import ProjectList from '@/components/perf/project/ProjectList'
import ProjectDetail from '@/components/perf/project/ProjectDetail'
import PerfInfoList from '@/components/perf/perfinfo/PerfInfoList'
import PerfInfoDetail from '@/components/perf/perfinfo/PerfInfoDetail'
import TemplateList from '@/components/perf/template/TemplateList'

import Index from '@/components/Index'
import Login from '@/components/Login'
import PermissionRoles from '@/components/permission/role/Roles'
import PermissionUsers from '@/components/permission/user/Users'

import SubaccountList from '@/components/customer/subaccount/List'
import SubaccountDetail from '@/components/customer/subaccount/Detail'
import CustomerList from '@/components/customer/company/List'
import CustomerDetail from '@/components/customer/company/Detail'
import ItSubaccountList from '@/components/customer/itsubaccount/List'
import ItSubaccountDetail from '@/components/customer/itsubaccount/Detail'

import OnlineTapeout from '@/components/online/Tapeout'
import TapeoutList from '@/components/order/TapeoutList'
import TapeoutDetail from '@/components/order/TapeoutDetail'

import ChangePwd from '@/components/setting/ChangePwd'

import RecruitIndex from '@/components/recruit/Index'
import AdviserList from '@/components/recruit/adviser/List'
import EntryList from '@/components/recruit/entry/List'
import EntryDetail from '@/components/recruit/entry/Detail'
import InterviewList from '@/components/recruit/interview/List'
import InterviewDetail from '@/components/recruit/interview/Detail'
import SurveyDetail from '@/components/recruit/survey/Detail'
import SurveyList from '@/components/recruit/survey/List'
import SurveyAdviserList from '@/components/recruit/adviser/Survey'

import IpIndex from '@/components/ip/Index'
import IpList from '@/components/ip/List'
import IpDetail from '@/components/ip/Detail'
import IpSupplierList from '@/components/ip/SupplierList'
import IpSupplierDetail from '@/components/ip/SupplierDetail'
import IpAuditList from '@/components/ip/AuditList'
import IpAuditDetail from '@/components/ip/AuditDetail'

import Redirect from '@/components/common/Redirect'
import MtSearchList from '@/components/mt/search/SearchList'
import MtMarkFold from '@/components/mt/MarkFold'
import MtSearchParams from '@/components/mt/SearchParams'
import MtTimeLine from '@/components/mt/MtTimeLine'

import NewsIndex from '@/components/news/Index'
import HotManage from '@/components/news/operate/HotManage'
import CrawlList from '@/components/news/content/CrawlList'
import CheckList from '@/components/news/content/CheckList'
import NewsDetail from '@/components/news/content/Detail'
import NewsCreate from '@/components/news/content/New'
import TagList from '@/components/news/tag/TagList'
import TypeList from '@/components/news/tag/TypeList'
import ChannelManage from '@/components/news/channel/ChannelManage'
import ChannelDetail from '@/components/news/channel/ChannelDetail'
import TopicList from '@/components/news/topic/List'
import TopicNew from '@/components/news/topic/New'
import NewsComment from '@/components/news/content/Comment'
import ExpoList from '@/components/news/expo/ExpoList'
import ExpoNew from '@/components/news/expo/ExpoNew'
import GuestList from '@/components/news/expo/GuestList'
import GuestNew from '@/components/news/expo/GuestNew'
import OrgList from '@/components/news/expo/OrgList'
import OrgNew from '@/components/news/expo/OrgNew'
import CheckLists from '@/components/news/expo/CheckList'
import CheckNew from '@/components/news/expo/CheckNew'
import RelationNew from '@/components/news/expo/relationNew'
import CalendarManagement from '@/components/news/expo/calendar'
import CalendarNew from '@/components/news/expo/CalendarNew'
import toolsList from '@/components/news/tools/ToolsList'
import columnindex from '@/components/news/column/columnindex'
import columnList from '@/components/news/column/columnList'
import columnEdit from '@/components/news/column/columnEdit'
import imgText from '@/components/news/column/imageText'
import imgTextEdit from '@/components/news/column/imgTextEdit'
import imgTextDetail from '@/components/news/column/detail'
import courseindex from '@/components/news/course/courseindex'
import courseList from '@/components/news/course/courseList'
import courseEdit from '@/components/news/course/courseEdit'
import courseLibrary from '@/components/news/course/courseLibrary'
import courseDetail from '@/components/news/course/courseDetail'
import libraryDetail from '@/components/news/course/detail'

import VipList from '@/components/recruit/vip/List'
import VipDetail from '@/components/recruit/vip/Detail'
import VipNew from '@/components/recruit/vip/New'
import vipGift from '@/components/recruit/vip/giftList'
import newGift from '@/components/recruit/vip/newGift'
import HistoryList from '@/components/recruit/vip/HistoryList'

import OperationIndex from '@/components/operation/Index'
import PushList from '@/components/operation/push/List'
import SystemList from '@/components/operation/push/SystemList'
import ChanceList from '@/components/operation/push/ChanceList'
import MessageNew from '@/components/operation/push/MessageNew'
import MessageDetail from '@/components/operation/push/MessageDetail'

import MtIndex from '@/components/free/mt/Index'
import ContactList from '@/components/free/mt/ContactList'
import ContactSearchList from '@/components/free/mt/ContactSearchList'
import ContactLog from '@/components/free/mt/ContactLog'

import jsjformIndex from '@/components/free/jsjform/Index'
import jsjformXP from '@/components/free/jsjform/jsjformXP'
import jsjformGYL from '@/components/free/jsjform/jsjformGYL'
import jsjformRC from '@/components/free/jsjform/jsjformRC'
import jsjformQYFW from '@/components/free/jsjform/jsjformQYFW'

import FaIndex from '@/components/fa/Index'
import FaProject from '@/components/fa/Project'
import FaProjectDetail from '@/components/fa/ProjectDetail'
import FaInvestor from '@/components/fa/Investor'
import FaInvestorDetail from '@/components/fa/InvestorDetail'
import FaInvestorOrg from '@/components/fa/InvestorOrg'
import FaInvestorOrgDetail from '@/components/fa/InvestorOrgDetail'
import FaExpert from '@/components/fa/Expert'
import FaExpertDetail from '@/components/fa/ExpertDetail'

// 微服务表单
import wformIndex from '@/components/wform/index'
import wformList from '@/components/wform/list'
import wformEdit from '@/components/wform/edit'
import wformSubmit from '@/components/wform/userSubmit'
import wformRules from '@/components/wform/rules'
import wformSet from '@/components/wform/set'
import wformEntries from '@/components/wform/entries'
import wformPublish from '@/components/wform/publish'

// 芯企查
import XqcIndex from '@/components/xqc/index'
import UserList from '@/components/xqc/userList'
import EntList from '@/components/xqc/entList'
import EntExamine from '@/components/xqc/entExamine'
import entExamineDetail from '@/components/xqc/entExamineDetail'
import IntegralList from '@/components/xqc/integralList'
import IntegralSet from '@/components/xqc/integralSet'
import SysList from '@/components/xqc/sysList'

Vue.use(Router)

Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.dataset.title
    document.getElementById('title').innerText = document.title
  }
})

/**
 /permission 权限管理，包括：用户管理，角色权限管理
 /customer 客户管理，包括：企业用户管理，企业管理
 /order 订单管理，包括：列表展示管理，流片订单管理，封装订单管理
 /perf  绩效管理，包括：成员管理，设计服务项目管理，员工绩效管理，绩效模板管理
 */
export default new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Index,
      children: [
        {
          path: '/xqc',
          component: XqcIndex,
          children: [
            {
              path: 'user/list',
              component: UserList
            }, {
              path: 'ent/list',
              component: EntList
            }, {
              path: 'ent/examine',
              component: EntExamine
            }, {
              path: 'ent/examine/detail/:id',
              name: 'entExamineDetail',
              component: entExamineDetail
            }, {
              path: 'integral/list',
              component: IntegralList
            }, {
              path: 'integral/set',
              component: IntegralSet
            }, {
              path: 'sys/list',
              component: SysList
            }
          ]
        },
        {
          path: 'permission/roles',
          component: PermissionRoles
        }, {
          path: 'permission/users',
          component: PermissionUsers
        }, {
          path: 'customer/subaccounts',
          component: SubaccountList
        }, {
          path: 'customer/subaccount/:id',
          name: 'subaccountDetail',
          component: SubaccountDetail
        }, {
          path: 'customer/companys',
          component: CustomerList
        }, {
          path: 'customer/company/:id',
          name: 'companyDetail',
          component: CustomerDetail
        }, {
          path: 'customer/itsubaccounts',
          component: ItSubaccountList
        }, {
          path: 'customer/itsubaccount/:id',
          name: 'itsubaccountDetail',
          component: ItSubaccountDetail
        }, {
          path: 'order/online/tapeout',
          component: OnlineTapeout
        }, {
          path: 'order/tapeout',
          component: TapeoutList
        }, {
          path: 'setting/changepwd',
          component: ChangePwd
        }, {
          path: 'mt/search',
          name: 'mtSearch',
          component: MtSearchList
        }, {
          path: 'mt/fold',
          component: MtMarkFold
        },
        {
          path: 'mt/timeline',
          component: MtTimeLine
        },
        {
          path: 'mt/searchParams',
          component: MtSearchParams
        },
        {
          path: '/recruit',
          component: RecruitIndex,
          children: [
            {
              path: 'adviser',
              component: AdviserList
            },
            {
              path: 'entry',
              component: EntryList
            },
            {
              path: 'entry/:id',
              name: 'entryDetail',
              component: EntryDetail
            },
            {
              path: 'interview',
              component: InterviewList
            },
            {
              path: 'interview/:id',
              name: 'interviewDetail',
              component: InterviewDetail
            },
            {
              path: 'survey',
              component: SurveyList
            },
            {
              path: 'survey/:id',
              name: 'surveyDetail',
              component: SurveyDetail
            },
            {
              path: 'adviser/survey',
              component: SurveyAdviserList
            },
            {
              path: 'vip',
              component: VipList
            },
            {
              path: 'vip/company',
              component: VipList
            },
            {
              path: 'vip/detail',
              component: VipDetail
            },
            {
              path: 'vip/new',
              component: VipNew
            },
            {
              path: 'vip/history',
              component: HistoryList
            },
            {
              path: 'vip/gift',
              component: vipGift
            },
            {
              path: 'vip/newGift',
              component: newGift
            }
          ]
        },
        {
          path: 'fa/index',
          component: FaIndex
        },
        {
          path: 'fa/project',
          component: FaProject
        },
        {
          path: 'fa/project/:id',
          name: 'faProjectDetail',
          component: FaProjectDetail
        },
        {
          path: 'fa/investor/person',
          component: FaInvestor
        },
        {
          path: 'fa/investor/person/:id',
          name: 'investorDetail',
          component: FaInvestorDetail
        },
        {
          path: 'fa/investor/org',
          name: 'investorOrg',
          component: FaInvestorOrg
        },
        {
          path: 'fa/investor/org/:id',
          name: 'investorOrgDetail',
          component: FaInvestorOrgDetail
        },
        {
          path: 'fa/expert',
          component: FaExpert
        },
        {
          path: 'fa/expert/:id',
          name: 'expertDetail',
          component: FaExpertDetail
        },
        {
          path: '/ip',
          component: IpIndex,
          children: [
            {
              path: 'manage',
              component: IpList
            },
            {
              path: 'detail/:id',
              name: 'ipDetail',
              component: IpDetail
            },
            {
              path: 'audit/list',
              component: IpAuditList
            },
            {
              path: 'audit/detail/:id',
              name: 'ipAuditDetail',
              component: IpAuditDetail
            },
            {
              path: 'supplier/list',
              component: IpSupplierList
            },
            {
              path: 'supplier/detail/:id',
              name: 'ipSupplierDetail',
              component: IpSupplierDetail
            }
          ]
        },
        {
          path: '/news',
          component: NewsIndex,
          children: [
            {
              path: 'operate/hot',
              component: HotManage
            },
            {
              path: 'content/crawl',
              component: CrawlList
            },
            {
              path: 'content/check',
              component: CheckList
            },
            {
              path: 'content/detail/:id',
              name: 'newsDetail',
              component: NewsDetail
            },
            {
              path: 'content/comment/:id',
              name: 'newsComment',
              component: NewsComment
            },
            {
              path: 'content/new',
              component: NewsCreate
            },
            {
              path: 'content/edit',
              component: NewsCreate
            },
            {
              path: 'tag/list',
              component: TagList
            },
            {
              path: 'tag/type',
              component: TypeList
            },
            {
              path: 'tag/type',
              component: TypeList
            },
            {
              path: 'channel',
              component: ChannelManage
            },
            {
              path: 'channel/detail/:id',
              name: 'channelDetail',
              component: ChannelDetail
            },
            {
              path: 'topic',
              component: TopicList
            },
            {
              path: 'topic/new',
              component: TopicNew
            },
            {
              path: 'expo/list',
              component: ExpoList
            },
            {
              path: 'expo/new',
              component: ExpoNew
            },
            {
              path: 'expo/guest',
              component: GuestList
            },
            {
              path: 'expo/guestNew',
              component: GuestNew
            },
            {
              path: 'expo/org',
              component: OrgList
            },
            {
              path: 'expo/orgNew',
              component: OrgNew
            },
            {
              path: 'expo/check',
              component: CheckLists
            },
            {
              path: 'expo/checkNew',
              component: CheckNew
            },
            {
              path: 'expo/RelationNew',
              component: RelationNew
            },
            {
              path: 'expo/calendar',
              component: CalendarManagement
            },
            {
              path: 'expo/calendarNew',
              component: CalendarNew
            }, {
              path: '/news/cf',
              component: wformList
            },
            {
              path: '/news/cf/userSubmit',
              component: wformSubmit
            },
            {
              path: '/news/cf/form',
              name: 'form',
              component: wformIndex,
              children: [{
                path: '/news/cf/form/:formId/rules',
                name: 'rules',
                component: wformRules
              }, {
                path: '/news/cf/form/edit',
                name: 'edit',
                component: wformEdit
              }, {
                path: '/news/cf/form/:formId/set',
                name: 'set',
                component: wformSet
              }, {
                path: '/news/cf/form/:formId/entries',
                name: 'entries',
                component: wformEntries
              }, {
                path: '/news/cf/form/:formId/publish',
                name: 'publish',
                component: wformPublish
              }, {
                path: '/news/cf/form',
                redirect: '/news/cf/form/edit'
              }]
            },
            {
              path: 'tools',
              component: toolsList
            },
            {
              path: 'zhuanlan',
              component: columnindex,
              children: [
                {
                  path: 'list',
                  component: columnList
                },
                {
                  path: 'edit',
                  component: columnEdit
                },
                {
                  path: 'imgText',
                  component: imgText
                },
                {
                  path: 'imgText/Edit',
                  component: imgTextEdit
                },
                {
                  path: 'imgText/detail',
                  component: imgTextDetail
                }
              ]
            },
            {
              path: 'course',
              component: courseindex,
              children: [
                {
                  path: 'list',
                  component: courseList
                },
                {
                  path: 'edit',
                  component: courseEdit
                },
                {
                  path: 'library',
                  component: courseLibrary
                },
                {
                  path: 'detail',
                  component: courseDetail
                },
                {
                  path: 'library/detail',
                  component: libraryDetail
                }
              ]
            }
          ]
        },
        {
          path: '/operation',
          component: OperationIndex,
          children: [
            {
              path: 'push/list',
              component: PushList
            },
            {
              path: 'push/system/list',
              component: SystemList
            },
            {
              path: 'push/chance/list',
              component: ChanceList
            },
            {
              path: 'push/message/new',
              component: MessageNew
            },
            {
              path: 'push/message/:id',
              name: 'messageDetail',
              component: MessageDetail
            }
          ]
        }
      ]
    },
    {
      path: '/order/tapeout/:id',
      name: 'tapeoutDetail',
      component: TapeoutDetail
    },
    {
      path: '/perf',
      component: Index,
      children: [
        {
          path: 'member',
          component: PerfIndex,
          children: [
            {
              path: 'list',
              component: MemberList
            }
          ]
        },
        {
          path: 'label',
          component: PerfIndex,
          children: [
            {
              path: 'list',
              component: LabelList
            }
          ]
        },
        {
          path: 'resume',
          component: PerfIndex,
          children: [
            {
              path: 'list',
              component: ResumeList
            }
          ]
        },
        {
          path: 'project',
          component: PerfIndex,
          children: [
            {
              path: 'list',
              component: ProjectList,
              name: 'projectList'
            },
            {
              path: ':id/detail',
              component: ProjectDetail,
              name: 'projectDetail'
            }
          ]
        },
        {
          path: 'perfinfo',
          component: PerfIndex,
          children: [
            {
              path: 'list',
              component: PerfInfoList,
              name: 'perfList'
            },
            {
              path: ':id/detail',
              component: PerfInfoDetail,
              name: 'perfinfoDetail'
            }
          ]
        },
        {
          path: 'template',
          component: PerfIndex,
          children: [
            {
              path: 'list',
              component: TemplateList
            }
          ]
        }
      ]
    },
    {
      path: '/redirect',
      component: Redirect
    },
    {
      path: '/free',
      component: Index,
      children: [
        {
          path: 'mt',
          component: MtIndex,
          children: [
            {
              path: 'contacts',
              component: ContactList
            },
            {
              path: 'searchcontacts',
              component: ContactSearchList
            },
            {
              path: 'contact/log',
              component: ContactLog
            }
          ]
        }, {
          path: 'jsjform',
          component: jsjformIndex,
          children: [
            {
              path: 'xpform',
              component: jsjformXP
            }, {
              path: 'gylform',
              component: jsjformGYL
            }, {
              path: 'rcform',
              component: jsjformRC
            }, {
              path: 'qyfwform',
              component: jsjformQYFW
            }
          ]
        }
      ]
    }
  ]
})
