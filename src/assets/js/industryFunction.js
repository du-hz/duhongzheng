export default {
  levelOne: [
    {id: 1, name: '芯片设计', parentId: 0},
    {id: 250, name: '晶圆制造', parentId: 0},
    {id: 78, name: '封装测试', parentId: 0},
    {id: 19, name: '软件研发', parentId: 0},
    {id: 65, name: '硬件研发', parentId: 0},
    {id: 358, name: '电子设计自动化(EDA)', parentId: 0},
    {id: 100, name: '技术支持与应用系统开发', parentId: 0},
    {id: 122, name: '项目管理', parentId: 0},
    {id: 109, name: '市场', parentId: 0},
    {id: 328, name: '销售', parentId: 0},
    {id: 186, name: '供应链', parentId: 0},
    {id: 131, name: '通用职能', parentId: 0},
    {id: 231, name: '其他', parentId: 0}
  ],
  levelTwo: [
    {id: 2, name: '数字前端', parentId: 1},
    {id: 3, name: '数字验证', parentId: 1},
    {id: 4, name: '数字后端', parentId: 1},
    {id: 9, name: '模拟芯片设计', parentId: 1},
    {id: 10, name: '射频芯片设计', parentId: 1},
    {id: 11, name: 'MEMS/分立器件', parentId: 1},
    {id: 12, name: '模拟版图设计', parentId: 1},
    {id: 13, name: '单元库', parentId: 1},
    {id: 15, name: '产品工程&ATE', parentId: 1},
    {id: 16, name: 'CAD', parentId: 1},
    {id: 17, name: '芯片标定', parentId: 1},
    {id: 18, name: '其他', parentId: 1},
    {id: 20, name: '固件（Firmware）', parentId: 19},
    {id: 21, name: '内核（kernel）', parentId: 19},
    {id: 22, name: '驱动（Driver）', parentId: 19},
    {id: 23, name: '板级支持包(BSP)', parentId: 19},
    {id: 24, name: '硬件抽象层（HAL）', parentId: 19},
    {id: 25, name: '框架（Framework）', parentId: 19},
    {id: 26, name: '协议层（Protocal）', parentId: 19},
    {id: 27, name: '中间件（Middleware）', parentId: 19},
    {id: 28, name: '算法', parentId: 19},
    {id: 35, name: '嵌入式应用软件开发', parentId: 19},
    {id: 59, name: '工具', parentId: 19},
    {id: 63, name: '测试', parentId: 19},
    {id: 64, name: '其他', parentId: 19},
    {id: 66, name: '系统架构', parentId: 65},
    {id: 67, name: '板级电路设计', parentId: 65},
    {id: 72, name: '信号完整性', parentId: 65},
    {id: 73, name: '电磁兼容性', parentId: 65},
    {id: 74, name: '板级版图设计', parentId: 65},
    {id: 75, name: '硬件测试', parentId: 65},
    {id: 76, name: '系统性能测试', parentId: 65},
    {id: 77, name: '其他', parentId: 65},
    {id: 79, name: '封测研发', parentId: 78},
    {id: 82, name: '工艺整合', parentId: 78},
    {id: 92, name: '工厂端', parentId: 78},
    {id: 101, name: '技术支持&服务', parentId: 100},
    {id: 104, name: '应用/系统开发', parentId: 100},
    {id: 108, name: '其他', parentId: 100},
    {id: 110, name: '市场战略', parentId: 109},
    {id: 111, name: '产品定义及管理', parentId: 109},
    {id: 112, name: '市场推广/开拓', parentId: 109},
    {id: 114, name: '渠道拓展', parentId: 109},
    {id: 115, name: '价格管控', parentId: 109},
    {id: 119, name: '其他', parentId: 109},
    {id: 123, name: '硬件研发', parentId: 122},
    {id: 124, name: '软件研发', parentId: 122},
    {id: 125, name: '系统级产品研发', parentId: 122},
    {id: 126, name: '芯片设计', parentId: 122},
    {id: 127, name: '客户定制化项目', parentId: 122},
    {id: 128, name: '生产运营', parentId: 122},
    {id: 129, name: '产品工业化', parentId: 122},
    {id: 130, name: '其他', parentId: 122},
    {id: 132, name: '人力资源', parentId: 131},
    {id: 145, name: '通讯及公共关系', parentId: 131},
    {id: 152, name: '财务&会计', parentId: 131},
    {id: 167, name: '法务', parentId: 131},
    {id: 176, name: '行政', parentId: 131},
    {id: 177, name: '秘书&助理', parentId: 131},
    {id: 180, name: '职业操守', parentId: 131},
    {id: 181, name: '社会合规', parentId: 131},
    {id: 182, name: '安全', parentId: 131},
    {id: 183, name: '调查', parentId: 131},
    {id: 184, name: '设施', parentId: 131},
    {id: 185, name: 'IT管理 & CAD', parentId: 131},
    {id: 187, name: '采购', parentId: 186},
    {id: 190, name: '质量', parentId: 186},
    {id: 203, name: '运营', parentId: 186},
    {id: 220, name: '物流', parentId: 186},
    {id: 230, name: '其他', parentId: 186},
    {id: 252, name: '材料研发', parentId: 78},
    {id: 253, name: '其他', parentId: 78},
    {id: 268, name: '工艺开发（TD）', parentId: 250},
    {id: 278, name: '工厂端', parentId: 250},
    {id: 316, name: '芯片架构', parentId: 1},
    {id: 317, name: '芯片功能验证', parentId: 1},
    {id: 318, name: '工艺研发', parentId: 78},
    {id: 319, name: '其他', parentId: 250},
    {id: 327, name: '机械结构', parentId: 65},
    {id: 330, name: '大客户销售', parentId: 328},
    {id: 331, name: '渠道销售', parentId: 328},
    {id: 332, name: '区域销售', parentId: 328},
    {id: 333, name: '代工厂销售', parentId: 328},
    {id: 334, name: '客户服务', parentId: 328},
    {id: 335, name: '其他', parentId: 328},
    {id: 336, name: '高级管理', parentId: 131},
    {id: 350, name: '其他', parentId: 131},
    {id: 353, name: '产品工程', parentId: 78},
    {id: 354, name: '软件开发工具包（SDK）', parentId: 19},
    {id: 357, name: '可测试性设计（DFT）', parentId: 1},
    {id: 359, name: '软件研发（RD）', parentId: 358},
    {id: 360, name: '产品验证(PV)', parentId: 358},
    {id: 361, name: '产品(PE)', parentId: 358},
    {id: 362, name: '其他', parentId: 358},
    {id: 363, name: '基本输入输出系统（BIOS）', parentId: 19},
    {id: 364, name: 'PC应用软件开发', parentId: 19},
    {id: 365, name: '封装研发', parentId: 78}
  ],
  levelThree: [
    {id: 60, name: '编译器(Compiler)', parentId: 59},
    {id: 61, name: '调试器(Debugger)', parentId: 59},
    {id: 62, name: '其他', parentId: 59},
    {id: 80, name: '新产品导入（NPI）', parentId: 92},
    {id: 81, name: '测试程序开发', parentId: 92},
    {id: 83, name: '品质与可靠性', parentId: 92},
    {id: 89, name: '工艺工程', parentId: 92},
    {id: 93, name: '设备维护与管理', parentId: 92},
    {id: 94, name: '制造生产', parentId: 92},
    {id: 95, name: '动力&厂务', parentId: 92},
    {id: 98, name: '客户工程（CE）', parentId: 92},
    {id: 133, name: '外派员工管理', parentId: 132},
    {id: 134, name: '招聘', parentId: 132},
    {id: 135, name: '培训', parentId: 132},
    {id: 136, name: '薪酬福利', parentId: 132},
    {id: 137, name: '员工关系', parentId: 132},
    {id: 138, name: '人才与组织发展', parentId: 132},
    {id: 139, name: '业务伙伴', parentId: 132},
    {id: 140, name: '工厂人力资源', parentId: 132},
    {id: 141, name: '人力资源项目', parentId: 132},
    {id: 146, name: '广告', parentId: 145},
    {id: 147, name: '品牌', parentId: 145},
    {id: 148, name: '数字媒体及线上', parentId: 145},
    {id: 149, name: '活动', parentId: 145},
    {id: 150, name: '媒体', parentId: 145},
    {id: 151, name: '公共关系', parentId: 145},
    {id: 153, name: '审计', parentId: 152},
    {id: 154, name: '会计', parentId: 152},
    {id: 155, name: '成本', parentId: 152},
    {id: 156, name: '价格', parentId: 152},
    {id: 157, name: '财务计划和分析', parentId: 152},
    {id: 158, name: '税务', parentId: 152},
    {id: 159, name: '资金', parentId: 152},
    {id: 160, name: '信用', parentId: 152},
    {id: 161, name: '内部控制', parentId: 152},
    {id: 162, name: '工厂财务', parentId: 152},
    {id: 163, name: '业务控制', parentId: 152},
    {id: 164, name: '财务共享服务', parentId: 152},
    {id: 165, name: '投资融资', parentId: 152},
    {id: 166, name: '其他', parentId: 152},
    {id: 168, name: '公司法务', parentId: 167},
    {id: 169, name: '知识产权', parentId: 167},
    {id: 170, name: '法务商务', parentId: 167},
    {id: 171, name: '法务合规', parentId: 167},
    {id: 172, name: '首次公开募股', parentId: 167},
    {id: 173, name: '注册/法规事务', parentId: 167},
    {id: 174, name: '法律总顾问', parentId: 167},
    {id: 175, name: '用工', parentId: 167},
    {id: 188, name: '寻源', parentId: 187},
    {id: 189, name: '采购', parentId: 187},
    {id: 191, name: '进货质量', parentId: 190},
    {id: 192, name: '生产质量', parentId: 190},
    {id: 193, name: '研发质量', parentId: 190},
    {id: 194, name: '供应商质量', parentId: 190},
    {id: 199, name: '合约生产', parentId: 190},
    {id: 200, name: '其他', parentId: 190},
    {id: 201, name: '质量体系及认证', parentId: 190},
    {id: 202, name: '客户质量', parentId: 190},
    {id: 204, name: 'EHS', parentId: 203},
    {id: 205, name: '工业化', parentId: 203},
    {id: 206, name: '精益化生产及六西格玛', parentId: 203},
    {id: 209, name: '生产管理', parentId: 203},
    {id: 210, name: '生产工艺', parentId: 203},
    {id: 211, name: '设备维护/维修', parentId: 203},
    {id: 212, name: '供应链规划及管理', parentId: 203},
    {id: 218, name: '化验/检验', parentId: 203},
    {id: 219, name: '其他', parentId: 203},
    {id: 221, name: '报关及进出口', parentId: 220},
    {id: 222, name: '仓储及仓库管理', parentId: 220},
    {id: 223, name: '贸易合规', parentId: 220},
    {id: 224, name: '运输', parentId: 220},
    {id: 225, name: '调度', parentId: 220},
    {id: 226, name: '客户服务', parentId: 220},
    {id: 227, name: '配销', parentId: 220},
    {id: 228, name: '物流优化', parentId: 220},
    {id: 229, name: '其他', parentId: 220},
    {id: 262, name: '人力资源信息系统', parentId: 132},
    {id: 263, name: '雇主品牌', parentId: 132},
    {id: 264, name: '其他', parentId: 132},
    {id: 265, name: '政府关系', parentId: 145},
    {id: 266, name: '其他', parentId: 145},
    {id: 267, name: '财务合规', parentId: 152},
    {id: 292, name: '工艺集成（Process Integration）', parentId: 268},
    {id: 293, name: '器件设计&建模&仿真&标定', parentId: 268},
    {id: 297, name: '设计服务', parentId: 268},
    {id: 298, name: '技术支持', parentId: 268},
    {id: 299, name: '先进模组（Module）', parentId: 268},
    {id: 300, name: '其他', parentId: 268},
    {id: 302, name: '工艺集成', parentId: 278},
    {id: 303, name: '制程/工艺', parentId: 278},
    {id: 304, name: '良率提升', parentId: 278},
    {id: 305, name: '设备维护与管理', parentId: 278},
    {id: 306, name: '制造生产', parentId: 278},
    {id: 307, name: '动力&厂务', parentId: 278},
    {id: 308, name: '新产品导入（NPI）', parentId: 278},
    {id: 309, name: '客户工程（CE）', parentId: 278},
    {id: 310, name: '其他', parentId: 278},
    {id: 315, name: '其他', parentId: 187},
    {id: 320, name: '生产测试', parentId: 92},
    {id: 321, name: '其他', parentId: 92},
    {id: 322, name: '测试 & 品质', parentId: 278},
    {id: 323, name: '集成开发环境(IDE)', parentId: 59},
    {id: 343, name: '总裁/CEO/总经理', parentId: 336},
    {id: 344, name: '首席技术官/CTO/CIO', parentId: 336},
    {id: 345, name: '首席运营官/COO', parentId: 336},
    {id: 346, name: '首席财务官/CFO', parentId: 336},
    {id: 347, name: '副总裁VP', parentId: 336},
    {id: 348, name: '其他', parentId: 336},
    {id: 349, name: '其他', parentId: 167},
    {id: 356, name: '供应商开发', parentId: 187},
    {id: 366, name: '软件开发', parentId: 104},
    {id: 367, name: '硬件开发', parentId: 104},
    {id: 368, name: '风险控制', parentId: 152}
  ]
}