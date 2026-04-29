// dohozz-saas/src/mock/productShopAnalysis.js

// 平台列表
export const platforms = ['全部', '抖音', '快手', '视频号', '小红书']

// 快捷时间选项
export const quickTimeOptions = [
  { label: '近N天', value: 'near' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
  { label: '大促', value: 'promo' },
  { label: '自定义', value: 'custom' }
]

// 归属筛选
export const attrOptions = ['全部出单达人', '团队建联达人']

// 类型筛选
export const typeOptions = ['全部', '达人', '团长']

// 店铺列表
export const shopOptions = [
  { label: '所有店铺', value: 'all' },
  { label: '示例店铺18', value: 'shop1' },
  { label: '懒猫馋馋官方旗舰店', value: 'shop2' }
]

// 核心指标数据
export const metricsData = {
  salesAmount: {
    value: 185.96,
    unit: 'w',
    orderCount: 62000,
    mom: -6.04,
    orderMom: -7.18
  },
  refundAmount: {
    value: 33.27,
    unit: 'w',
    orderCount: 9917,
    mom: -18.99,
    orderMom: -18.82
  },
  productCount: {
    value: 74,
    linkCount: 703,
    mom: -6.33,
    linkMom: 2.93
  }
}

// 商品占比TOP15
export const productShareList = [
  { id: '2909', name: '示例SPU商品2909', brand: '品牌A', salesAmount: 33000, ratio: 16.57 },
  { id: '2910', name: '幼儿园午睡趴睡枕', brand: '品牌B', salesAmount: 15600, ratio: 7.82 },
  { id: '2911', name: '轻奢挂钩粘胶强力', brand: '品牌C', salesAmount: 24200, ratio: 12.15 },
  { id: '2912', name: '防水双肩背包', brand: '品牌D', salesAmount: 12800, ratio: 6.42 },
  { id: '2913', name: '智能手环运动手表', brand: '品牌E', salesAmount: 9800, ratio: 4.91 },
  { id: '2914', name: '无线蓝牙耳机', brand: '品牌F', salesAmount: 8600, ratio: 4.31 },
  { id: '2915', name: '便携式充电宝', brand: '品牌G', salesAmount: 7200, ratio: 3.61 },
  { id: '2916', name: '迷你加湿器', brand: '品牌H', salesAmount: 6500, ratio: 3.26 },
  { id: '2917', name: '家用投影仪', brand: '品牌I', salesAmount: 5800, ratio: 2.91 },
  { id: '2918', name: '电动牙刷', brand: '品牌J', salesAmount: 5200, ratio: 2.61 },
  { id: '2919', name: '空气炸锅', brand: '品牌K', salesAmount: 4800, ratio: 2.41 },
  { id: '2920', name: '多功能料理锅', brand: '品牌L', salesAmount: 4200, ratio: 2.11 },
  { id: '2921', name: '智能音箱', brand: '品牌M', salesAmount: 3800, ratio: 1.91 },
  { id: '2922', name: '扫地机器人', brand: '品牌N', salesAmount: 3400, ratio: 1.71 },
  { id: '2923', name: '榨汁机便携式', brand: '品牌O', salesAmount: 3100, ratio: 1.56 }
]

// SPU分布热力矩阵数据
export const spuDistributionData = {
  xAxis: { name: '成交金额', min: 0, max: 33000 },
  yAxis: { name: '出单达人数', min: 0, max: 196 },
  data: [
    { x: 15000, y: 120, name: '示例SPU商品', linkCount: 5 },
    { x: 8000, y: 85, name: '幼儿园午睡趴睡枕', linkCount: 3 },
    { x: 24000, y: 196, name: '轻奢挂钩粘胶强力', linkCount: 8 },
    { x: 12000, y: 95, name: '防水双肩背包', linkCount: 4 },
    { x: 9500, y: 78, name: '智能手环运动手表', linkCount: 3 }
  ]
}

// 出单SPU表格数据
export const spuTableData = {
  list: [
    { spuId: '2909', spuName: '示例SPU商品2909', salesAmount: 33000, settlementAmount: 6071.14, refundAmount: 5282.93, creatorCount: 196 },
    { spuId: '2910', spuName: '幼儿园午睡趴睡枕', salesAmount: 15600, settlementAmount: 3491.99, refundAmount: 2444.97, creatorCount: 85 },
    { spuId: '2911', spuName: '轻奢挂钩粘胶强力', salesAmount: 24200, settlementAmount: 5420.00, refundAmount: 4100.00, creatorCount: 142 },
    { spuId: '2912', spuName: '防水双肩背包', salesAmount: 12800, settlementAmount: 2890.00, refundAmount: 2100.00, creatorCount: 92 },
    { spuId: '2913', spuName: '智能手环运动手表', salesAmount: 9800, settlementAmount: 2156.00, refundAmount: 1680.00, creatorCount: 65 },
    { spuId: '2914', spuName: '无线蓝牙耳机', salesAmount: 8600, settlementAmount: 1892.00, refundAmount: 1450.00, creatorCount: 58 },
    { spuId: '2915', spuName: '便携式充电宝', salesAmount: 7200, settlementAmount: 1584.00, refundAmount: 1200.00, creatorCount: 48 },
    { spuId: '2916', spuName: '迷你加湿器', salesAmount: 6500, settlementAmount: 1430.00, refundAmount: 1080.00, creatorCount: 42 },
    { spuId: '2917', spuName: '家用投影仪', salesAmount: 5800, settlementAmount: 1276.00, refundAmount: 960.00, creatorCount: 38 },
    { spuId: '2918', spuName: '电动牙刷', salesAmount: 5200, settlementAmount: 1144.00, refundAmount: 860.00, creatorCount: 35 },
    { spuId: '2919', spuName: '空气炸锅', salesAmount: 4800, settlementAmount: 1056.00, refundAmount: 790.00, creatorCount: 32 },
    { spuId: '2920', spuName: '多功能料理锅', salesAmount: 4200, settlementAmount: 924.00, refundAmount: 690.00, creatorCount: 28 },
    { spuId: '2921', spuName: '智能音箱', salesAmount: 3800, settlementAmount: 836.00, refundAmount: 620.00, creatorCount: 25 },
    { spuId: '2922', spuName: '扫地机器人', salesAmount: 3400, settlementAmount: 748.00, refundAmount: 550.00, creatorCount: 22 },
    { spuId: '2923', spuName: '榨汁机便携式', salesAmount: 3100, settlementAmount: 682.00, refundAmount: 500.00, creatorCount: 20 }
  ],
  total: 74,
  pageSize: 10,
  currentPage: 1
}

// 环形图数据
export const ringChartData = {
  legend: ['示例店铺18', '懒猫馋馋官方旗舰店'],
  seriesData: [
    { value: 104, name: '示例店铺18' },
    { value: 78, name: '懒猫馋馋官方旗舰店' }
  ]
}

// 折线趋势图数据
export const lineTrendData = {
  xAxis: ['04/01', '04/05', '04/10', '04/15', '04/20', '04/25', '04/29'],
  series: [
    { name: '示例店铺18', data: [120, 132, 101, 134, 90, 230, 210] },
    { name: '懒猫馋馋官方旗舰店', data: [220, 182, 191, 234, 290, 330, 310] }
  ]
}