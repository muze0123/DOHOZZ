import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'

export const useInfluencerDatabaseStore = defineStore('influencerDatabase', () => {
  // ==================== Area A: 平台 Tab ====================
  const platformTabs = [
    { key: 'tiktok', label: 'TikTok' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'shopee', label: 'Shopee' },
    { key: 'lazada', label: 'Lazada' }
  ]
  const activePlatform = ref('tiktok')

  // ==================== Area C: Sub-Tab ====================
  const subTabs = [
    { key: 'all', label: '全部' },
    { key: 'video', label: '视频达人' },
    { key: 'live', label: '直播达人' },
    { key: 'plugin', label: '插件找达人', isNew: true }
  ]
  const activeSubTab = ref('all')

  // ==================== Area B: 搜索相关 ====================
  const searchQuery = ref('')
  const isSearching = ref(false)

  // 达人数量统计
  const totalInfluencerCount = ref(992043)

  // ==================== Area D: 筛选条件 ====================
  // 筛选区展开/收起
  const isFilterExpanded = ref(true)

  // 带货分类 - 一级分类
  const categories = [
    { id: 'flowers', name: '鲜花绿植', icon: '🌸' },
    { id: 'fashion', name: '时尚配件', icon: '👗' },
    { id: 'sports', name: '运动户外', icon: '⚽' },
    { id: 'home', name: '家纺布艺', icon: '🏠' },
    { id: 'beauty', name: '美妆护肤', icon: '💄' },
    { id: 'digital', name: '手机数码', icon: '📱' },
    { id: 'pets', name: '宠物用品', icon: '🐱' },
    { id: 'toys', name: '玩具乐器', icon: '🎮' },
    { id: 'food', name: '食品饮料', icon: '🍕' },
    { id: 'baby', name: '母婴用品', icon: '👶' },
    { id: 'health', name: '医药保健', icon: '💊' },
    { id: 'secondhand', name: '二手商品', icon: '🔄' },
    { id: 'gifts', name: '礼品文创', icon: '🎁' },
    { id: 'shoes', name: '鞋靴箱包', icon: '👟' },
    { id: 'daily', name: '居家日用', icon: '🧴' }
  ]

  // 带货分类 - 二级分类
  const subCategories = {
    'sports': [
      { id: 'sports-shoes', name: '运动鞋', parentId: 'sports' },
      { id: 'sportswear', name: '运动服饰', parentId: 'sports' },
      { id: 'equipment', name: '运动器材', parentId: 'sports' }
    ],
    'beauty': [
      { id: 'skincare', name: '护肤', parentId: 'beauty' },
      { id: 'makeup', name: '彩妆', parentId: 'beauty' },
      { id: 'fragrance', name: '香水', parentId: 'beauty' }
    ],
    'fashion': [
      { id: 'jewelry', name: '珠宝配饰', parentId: 'fashion' },
      { id: 'watches', name: '手表', parentId: 'fashion' },
      { id: 'bags', name: '箱包', parentId: 'fashion' }
    ]
  }

  // 筛选条件状态
  const filters = reactive({
    category: '',           // 带货分类
    subCategory: '',        // 二级分类
    categoryLevel: 1,       // 选中的层级深度
    salesType: '',          // 带货方式: live/video
    salesLevel: '',         // 带货水平
    engagement: '',         // 平均互动率
    brands: [],             // 带货品牌
    priceRange: '',         // 带货商品价格
    commission: '',         // 平均佣金率
    sales: '',              // 销量
    // 直播表现
    liveSales: '',          // 直播场均销售额
    liveViewers: '',       // 直播场均观众数
    // 视频表现
    videoSales: '',         // 视频场均销售额
    videoViews: '',         // 视频平均观看次数
    videoLikes: '',         // 预期视频点赞数
    videoFreq: '',          // 预计发布频率
    videoFirst: '',         // 首次发布视频时间
    // 达人画像
    gender: '',             // 性别
    age: '',                // 年龄
    language: '',           // 语言
    followerGender: '',     // 粉丝性别
    followerAge: '',        // 粉丝年龄
    followerLanguage: '',   // 粉丝语言
    followerCount: '',      // 粉丝数
    hasContact: '',         // 联系方式
    accountType: '',        // 账号类型
    notInvited: false,      // 过去90天未被邀约
    // 国家地区
    countries: []
  })

  // 当前hover的一级分类
  const hoverCategory = ref('')

  // ==================== Area E: 已选条件 & 常用条件 ====================
  // 已选筛选项列表（用于Tag展示）
  const selectedFilters = computed(() => {
    const result = []

    if (filters.category) {
      const cat = categories.find(c => c.id === filters.category)
      if (filters.subCategory) {
        const subCat = subCategories[filters.category]?.find(s => s.id === filters.subCategory)
        result.push({
          key: 'category',
          label: `带货分类：${cat?.name}/${subCat?.name}`,
          value: filters.subCategory
        })
      } else {
        result.push({
          key: 'category',
          label: `带货分类：${cat?.name}`,
          value: filters.category
        })
      }
    }

    if (filters.salesType) {
      const label = filters.salesType === 'live' ? '直播带货为主' : '视频带货为主'
      result.push({ key: 'salesType', label, value: filters.salesType })
    }

    if (filters.salesLevel) {
      result.push({ key: 'salesLevel', label: `带货水平：${filters.salesLevel}`, value: filters.salesLevel })
    }

    if (filters.engagement) {
      result.push({ key: 'engagement', label: `平均互动率：${filters.engagement}`, value: filters.engagement })
    }

    if (filters.brands.length > 0) {
      result.push({ key: 'brands', label: `带货品牌：${filters.brands.join('、')}`, value: filters.brands })
    }

    if (filters.priceRange) {
      result.push({ key: 'priceRange', label: `带货商品价格：${filters.priceRange}`, value: filters.priceRange })
    }

    if (filters.commission) {
      result.push({ key: 'commission', label: `平均佣金率：${filters.commission}`, value: filters.commission })
    }

    if (filters.sales) {
      result.push({ key: 'sales', label: `销量：${filters.sales}`, value: filters.sales })
    }

    if (filters.liveSales) {
      result.push({ key: 'liveSales', label: `直播场均销售额：${filters.liveSales}`, value: filters.liveSales })
    }

    if (filters.liveViewers) {
      result.push({ key: 'liveViewers', label: `直播场均观众数：${filters.liveViewers}`, value: filters.liveViewers })
    }

    if (filters.videoSales) {
      result.push({ key: 'videoSales', label: `视频场均销售额：${filters.videoSales}`, value: filters.videoSales })
    }

    if (filters.videoViews) {
      result.push({ key: 'videoViews', label: `视频平均观看：${filters.videoViews}`, value: filters.videoViews })
    }

    if (filters.followerCount) {
      result.push({ key: 'followerCount', label: `粉丝数：${filters.followerCount}`, value: filters.followerCount })
    }

    if (filters.gender) {
      result.push({ key: 'gender', label: `性别：${filters.gender}`, value: filters.gender })
    }

    if (filters.countries.length > 0) {
      result.push({ key: 'countries', label: `国家地区：${filters.countries.join('、')}`, value: filters.countries })
    }

    return result
  })

  // 常用条件列表
  const favoriteFilters = ref([
    { id: 1, name: '高互动美妆达人', filters: { category: 'beauty', engagement: '10%以上' } },
    { id: 2, name: '印尼头部达人', filters: { countries: ['Indonesia'], followerCount: '100万以上' } }
  ])

  // 是否显示常用条件气泡
  const showFavoritesPopover = ref(false)

  // 常用条件弹窗
  const isSaveFavoriteDialogVisible = ref(false)
  const favoriteName = ref('')

  // ==================== Area F: 达人列表 & 分页 ====================
  // Mock 达人列表数据
  const mockInfluencers = ref([
    {
      id: '1',
      name: 'Sarah Johnson',
      username: '@sarahj_official',
      avatar: 'https://i.pravatar.cc/150?img=1',
      platformId: 'tiktok',
      followers: 1250000,
      likes: 8500000,
      videos: 234,
      avgViews: 45000,
      engagement: 4.8,
      country: 'United States',
      countryFlag: '🇺🇸',
      category: 'Beauty & Skincare',
      categories: ['美妆护肤', '时尚配件'],
      salesType: 'video',
      level: 'L8',
      hasContact: true,
      gmv30d: 1560000,
      sales30d: 8920,
      liveSales30d: 320000,
      videoSales30d: 1240000,
      avgVideoViews: 45000,
      avgVideoLikes: 3200,
      potential: 90,
      aiAnalysis: '该达人专注于美妆领域，内容质量高，粉丝活跃度良好，带货转化率高于行业平均水平。',
      iceBreaker: 'Hi Sarah! 我注意到你对美妆护肤很有见解，我们品牌正在寻找优质的带货达人合作...',
      source: 'TikTok联盟中心',
      recorder: '张三',
      recordTime: '2026-03-26 09:56:48',
      followedBy: null,
      isFollowed: false
    },
    {
      id: '2',
      name: 'Michael Chen',
      username: '@mikechen_tiktok',
      avatar: 'https://i.pravatar.cc/150?img=3',
      platformId: 'tiktok',
      followers: 890000,
      likes: 5200000,
      videos: 156,
      avgViews: 32000,
      engagement: 3.9,
      country: 'Malaysia',
      countryFlag: '🇲🇾',
      category: 'Tech Reviews',
      categories: ['手机数码', '科技'],
      salesType: 'live',
      level: 'L6',
      hasContact: true,
      gmv30d: 980000,
      sales30d: 5600,
      liveSales30d: 750000,
      videoSales30d: 230000,
      avgVideoViews: 32000,
      avgVideoLikes: 2100,
      potential: 82,
      aiAnalysis: '科技类达人，擅长产品测评，观众购买意愿强。',
      iceBreaker: 'Hi Michael! 你的科技评测视频很有深度，我们有新产品想请你体验...',
      source: 'TikTok用户端',
      recorder: '李四',
      recordTime: '2026-03-25 14:30:00',
      followedBy: null,
      isFollowed: false
    },
    {
      id: '3',
      name: 'Emma Williams',
      username: '@emmawilliams_fash',
      avatar: 'https://i.pravatar.cc/150?img=5',
      platformId: 'tiktok',
      followers: 2100000,
      likes: 15000000,
      videos: 412,
      avgViews: 72000,
      engagement: 5.2,
      country: 'Indonesia',
      countryFlag: '🇮🇩',
      category: 'Fashion',
      categories: ['时尚配件', '鞋靴箱包'],
      salesType: 'video',
      level: 'L9',
      hasContact: false,
      gmv30d: 3200000,
      sales30d: 18500,
      liveSales30d: 800000,
      videoSales30d: 2400000,
      avgVideoViews: 72000,
      avgVideoLikes: 5800,
      potential: 95,
      aiAnalysis: '时尚领域头部达人，内容原创性强，粉丝画像年轻化，购买转化率高。',
      iceBreaker: 'Hi Emma! 你的时尚内容太棒了，我们品牌想和你合作推广新品...',
      source: 'TikTok联盟中心',
      recorder: '王五',
      recordTime: '2026-03-24 10:15:00',
      followedBy: '张三',
      isFollowed: true
    },
    {
      id: '4',
      name: 'David Kim',
      username: '@davidkim_gaming',
      avatar: 'https://i.pravatar.cc/150?img=8',
      platformId: 'tiktok',
      followers: 560000,
      likes: 3100000,
      videos: 89,
      avgViews: 28000,
      engagement: 4.1,
      country: 'South Korea',
      countryFlag: '🇰🇷',
      category: 'Gaming',
      categories: ['游戏', '科技'],
      salesType: 'live',
      level: 'L5',
      hasContact: true,
      gmv30d: 650000,
      sales30d: 4200,
      liveSales30d: 580000,
      videoSales30d: 70000,
      avgVideoViews: 28000,
      avgVideoLikes: 1800,
      potential: 75,
      aiAnalysis: '游戏领域达人，观众粘性高，直播打赏和带货都有潜力。',
      iceBreaker: 'Hi David! 你的游戏直播太精彩了，我们有游戏配件想请你试用...',
      source: 'TikTok用户端',
      recorder: '赵六',
      recordTime: '2026-03-23 16:45:00',
      followedBy: null,
      isFollowed: false
    },
    {
      id: '5',
      name: 'Lisa Anderson',
      username: '@lisa_lifestyle',
      avatar: 'https://i.pravatar.cc/150?img=9',
      platformId: 'tiktok',
      followers: 1800000,
      likes: 12000000,
      videos: 328,
      avgViews: 55000,
      engagement: 4.6,
      country: 'Philippines',
      countryFlag: '🇵🇭',
      category: 'Lifestyle',
      categories: ['居家日用', '母婴用品'],
      salesType: 'video',
      level: 'L8',
      hasContact: true,
      gmv30d: 2100000,
      sales30d: 12000,
      liveSales30d: 450000,
      videoSales30d: 1650000,
      avgVideoViews: 55000,
      avgVideoLikes: 4200,
      potential: 88,
      aiAnalysis: '生活类达人，内容贴近日常，带货品类广泛，粉丝信任度高。',
      iceBreaker: 'Hi Lisa! 你的生活视频很受欢迎，我们有家居好物想合作...',
      source: 'TikTok联盟中心',
      recorder: '张三',
      recordTime: '2026-03-22 11:20:00',
      followedBy: null,
      isFollowed: false
    },
    {
      id: '6',
      name: 'James Wong',
      username: '@jameswong_food',
      avatar: 'https://i.pravatar.cc/150?img=12',
      platformId: 'tiktok',
      followers: 720000,
      likes: 4800000,
      videos: 201,
      avgViews: 38000,
      engagement: 4.3,
      country: 'Singapore',
      countryFlag: '🇸🇬',
      category: 'Food & Dining',
      categories: ['食品饮料'],
      salesType: 'live',
      level: 'L6',
      hasContact: true,
      gmv30d: 890000,
      sales30d: 6800,
      liveSales30d: 720000,
      videoSales30d: 170000,
      avgVideoViews: 38000,
      avgVideoLikes: 2500,
      potential: 78,
      aiAnalysis: '美食类达人，擅长餐厅探店和食品试吃，带货食品转化效果好。',
      iceBreaker: 'Hi James! 你的美食视频太诱人了，我们有新品食品想请你品尝...',
      source: 'TikTok用户端',
      recorder: '李四',
      recordTime: '2026-03-21 15:30:00',
      followedBy: '李四',
      isFollowed: true
    },
    {
      id: '7',
      name: 'Maria Garcia',
      username: '@mariagarcia_beauty',
      avatar: 'https://i.pravatar.cc/150?img=16',
      platformId: 'tiktok',
      followers: 1500000,
      likes: 9800000,
      videos: 280,
      avgViews: 52000,
      engagement: 5.1,
      country: 'Mexico',
      countryFlag: '🇲🇽',
      category: 'Beauty',
      categories: ['美妆护肤', '个人护理'],
      salesType: 'video',
      level: 'L8',
      hasContact: true,
      gmv30d: 1800000,
      sales30d: 10500,
      liveSales30d: 420000,
      videoSales30d: 1380000,
      avgVideoViews: 52000,
      avgVideoLikes: 3800,
      potential: 89,
      aiAnalysis: '美妆领域达人，擅长产品测评和教程，粉丝互动性强。',
      iceBreaker: 'Hi Maria! 你的美妆教程太棒了，我们品牌想和你合作...',
      source: 'TikTok联盟中心',
      recorder: '王五',
      recordTime: '2026-03-20 14:20:00',
      followedBy: null,
      isFollowed: false
    },
    {
      id: '8',
      name: 'Ahmed Hassan',
      username: '@ahmedhassan_tech',
      avatar: 'https://i.pravatar.cc/150?img=17',
      platformId: 'tiktok',
      followers: 950000,
      likes: 6300000,
      videos: 180,
      avgViews: 35000,
      engagement: 4.2,
      country: 'Egypt',
      countryFlag: '🇪🇬',
      category: 'Tech',
      categories: ['手机数码', '电子产品'],
      salesType: 'live',
      level: 'L7',
      hasContact: true,
      gmv30d: 1100000,
      sales30d: 6200,
      liveSales30d: 850000,
      videoSales30d: 250000,
      avgVideoViews: 35000,
      avgVideoLikes: 2300,
      potential: 83,
      aiAnalysis: '科技类达人，专注于电子产品测评，内容专业度高。',
      iceBreaker: 'Hi Ahmed! 你的科技测评很专业，我们有新品想请你体验...',
      source: 'TikTok用户端',
      recorder: '赵六',
      recordTime: '2026-03-19 10:45:00',
      followedBy: null,
      isFollowed: false
    },
    {
      id: '9',
      name: 'Sophia Lee',
      username: '@sophialee_fashion',
      avatar: 'https://i.pravatar.cc/150?img=19',
      platformId: 'tiktok',
      followers: 2300000,
      likes: 16500000,
      videos: 450,
      avgViews: 78000,
      engagement: 5.3,
      country: 'South Korea',
      countryFlag: '🇰🇷',
      category: 'Fashion & Style',
      categories: ['时尚配件', '服装'],
      salesType: 'video',
      level: 'L9',
      hasContact: true,
      gmv30d: 3500000,
      sales30d: 20000,
      liveSales30d: 900000,
      videoSales30d: 2600000,
      avgVideoViews: 78000,
      avgVideoLikes: 6200,
      potential: 96,
      aiAnalysis: '时尚领域头部达人，风格独特，粉丝忠诚度高。',
      iceBreaker: 'Hi Sophia! 你的时尚风格很有特色，我们品牌想和你合作...',
      source: 'TikTok联盟中心',
      recorder: '张三',
      recordTime: '2026-03-18 09:30:00',
      followedBy: '张三',
      isFollowed: true
    },
    {
      id: '10',
      name: 'John Smith',
      username: '@johnsmith_fitness',
      avatar: 'https://i.pravatar.cc/150?img=21',
      platformId: 'tiktok',
      followers: 880000,
      likes: 5500000,
      videos: 165,
      avgViews: 33000,
      engagement: 4.5,
      country: 'United Kingdom',
      countryFlag: '🇬🇧',
      category: 'Fitness',
      categories: ['运动户外', '健康'],
      salesType: 'live',
      level: 'L6',
      hasContact: true,
      gmv30d: 920000,
      sales30d: 5800,
      liveSales30d: 780000,
      videoSales30d: 140000,
      avgVideoViews: 33000,
      avgVideoLikes: 2400,
      potential: 80,
      aiAnalysis: '健身领域达人，内容专业，粉丝互动性强。',
      iceBreaker: 'Hi John! 你的健身内容很专业，我们有运动产品想和你合作...',
      source: 'TikTok用户端',
      recorder: '李四',
      recordTime: '2026-03-17 16:20:00',
      followedBy: null,
      isFollowed: false
    },
    {
      id: '11',
      name: 'Aisha Patel',
      username: '@aishapatel_lifestyle',
      avatar: 'https://i.pravatar.cc/150?img=24',
      platformId: 'tiktok',
      followers: 1600000,
      likes: 10200000,
      videos: 310,
      avgViews: 58000,
      engagement: 4.7,
      country: 'India',
      countryFlag: '🇮🇳',
      category: 'Lifestyle & Home',
      categories: ['居家日用', '家居装饰'],
      salesType: 'video',
      level: 'L8',
      hasContact: true,
      gmv30d: 2200000,
      sales30d: 12500,
      liveSales30d: 500000,
      videoSales30d: 1700000,
      avgVideoViews: 58000,
      avgVideoLikes: 4500,
      potential: 90,
      aiAnalysis: '生活方式达人，内容温馨，粉丝信任度高。',
      iceBreaker: 'Hi Aisha! 你的生活内容很温馨，我们有家居产品想和你合作...',
      source: 'TikTok联盟中心',
      recorder: '王五',
      recordTime: '2026-03-16 11:15:00',
      followedBy: null,
      isFollowed: false
    },
    {
      id: '12',
      name: 'Carlos Rodriguez',
      username: '@carlosrodriguez_food',
      avatar: 'https://i.pravatar.cc/150?img=27',
      platformId: 'tiktok',
      followers: 750000,
      likes: 4900000,
      videos: 210,
      avgViews: 39000,
      engagement: 4.4,
      country: 'Spain',
      countryFlag: '🇪🇸',
      category: 'Food & Cooking',
      categories: ['食品饮料', '烹饪'],
      salesType: 'live',
      level: 'L6',
      hasContact: true,
      gmv30d: 950000,
      sales30d: 7100,
      liveSales30d: 780000,
      videoSales30d: 170000,
      avgVideoViews: 39000,
      avgVideoLikes: 2600,
      potential: 79,
      aiAnalysis: '美食类达人，擅长烹饪教程，内容实用。',
      iceBreaker: 'Hi Carlos! 你的烹饪教程很实用，我们有食材产品想和你合作...',
      source: 'TikTok用户端',
      recorder: '赵六',
      recordTime: '2026-03-15 15:40:00',
      followedBy: '赵六',
      isFollowed: true
    },
    {
      id: '13',
      name: 'Emma Davis',
      username: '@emmadavis_mom',
      avatar: 'https://i.pravatar.cc/150?img=30',
      platformId: 'tiktok',
      followers: 1300000,
      likes: 8800000,
      videos: 260,
      avgViews: 48000,
      engagement: 4.9,
      country: 'Canada',
      countryFlag: '🇨🇦',
      category: 'Parenting & Baby',
      categories: ['母婴用品', '育儿'],
      salesType: 'video',
      level: 'L7',
      hasContact: true,
      gmv30d: 1600000,
      sales30d: 9200,
      liveSales30d: 380000,
      videoSales30d: 1220000,
      avgVideoViews: 48000,
      avgVideoLikes: 3500,
      potential: 87,
      aiAnalysis: '母婴领域达人，内容亲切，粉丝粘性高。',
      iceBreaker: 'Hi Emma! 你的育儿内容很贴心，我们有母婴产品想和你合作...',
      source: 'TikTok联盟中心',
      recorder: '张三',
      recordTime: '2026-03-14 10:25:00',
      followedBy: null,
      isFollowed: false
    },
    {
      id: '14',
      name: 'Ryan Johnson',
      username: '@ryanjohnson_gaming',
      avatar: 'https://i.pravatar.cc/150?img=33',
      platformId: 'tiktok',
      followers: 620000,
      likes: 3500000,
      videos: 120,
      avgViews: 30000,
      engagement: 4.2,
      country: 'Australia',
      countryFlag: '🇦🇺',
      category: 'Gaming & Esports',
      categories: ['游戏', '电子竞技'],
      salesType: 'live',
      level: 'L5',
      hasContact: true,
      gmv30d: 700000,
      sales30d: 4500,
      liveSales30d: 620000,
      videoSales30d: 80000,
      avgVideoViews: 30000,
      avgVideoLikes: 2000,
      potential: 76,
      aiAnalysis: '游戏领域达人，擅长游戏直播，观众互动性强。',
      iceBreaker: 'Hi Ryan! 你的游戏直播很精彩，我们有游戏周边想和你合作...',
      source: 'TikTok用户端',
      recorder: '李四',
      recordTime: '2026-03-13 17:10:00',
      followedBy: null,
      isFollowed: false
    },
    {
      id: '15',
      name: 'Mia Wang',
      username: '@miawang_beauty',
      avatar: 'https://i.pravatar.cc/150?img=36',
      platformId: 'tiktok',
      followers: 1700000,
      likes: 11500000,
      videos: 330,
      avgViews: 62000,
      engagement: 5.0,
      country: 'China',
      countryFlag: '🇨🇳',
      category: 'Beauty & Makeup',
      categories: ['美妆护肤', '彩妆'],
      salesType: 'video',
      level: 'L8',
      hasContact: true,
      gmv30d: 2400000,
      sales30d: 13500,
      liveSales30d: 550000,
      videoSales30d: 1850000,
      avgVideoViews: 62000,
      avgVideoLikes: 4800,
      potential: 91,
      aiAnalysis: '美妆领域达人，内容创新，粉丝活跃度高。',
      iceBreaker: 'Hi Mia! 你的美妆内容很创新，我们品牌想和你合作...',
      source: 'TikTok联盟中心',
      recorder: '王五',
      recordTime: '2026-03-12 09:15:00',
      followedBy: '王五',
      isFollowed: true
    },
    {
      id: '16',
      name: 'Alex Thompson',
      username: '@alexthompson_tech',
      avatar: 'https://i.pravatar.cc/150?img=39',
      platformId: 'tiktok',
      followers: 850000,
      likes: 5100000,
      videos: 170,
      avgViews: 34000,
      engagement: 4.0,
      country: 'Germany',
      countryFlag: '🇩🇪',
      category: 'Tech & Gadgets',
      categories: ['手机数码', '智能设备'],
      salesType: 'live',
      level: 'L6',
      hasContact: true,
      gmv30d: 900000,
      sales30d: 5700,
      liveSales30d: 750000,
      videoSales30d: 150000,
      avgVideoViews: 34000,
      avgVideoLikes: 2200,
      potential: 81,
      aiAnalysis: '科技类达人，擅长智能设备测评，内容专业。',
      iceBreaker: 'Hi Alex! 你的科技测评很专业，我们有智能产品想和你合作...',
      source: 'TikTok用户端',
      recorder: '赵六',
      recordTime: '2026-03-11 14:50:00',
      followedBy: null,
      isFollowed: false
    },
    {
      id: '17',
      name: 'Olivia Brown',
      username: '@oliviabrown_fashion',
      avatar: 'https://i.pravatar.cc/150?img=42',
      platformId: 'tiktok',
      followers: 2000000,
      likes: 14000000,
      videos: 380,
      avgViews: 70000,
      engagement: 5.2,
      country: 'France',
      countryFlag: '🇫🇷',
      category: 'Fashion & Beauty',
      categories: ['时尚配件', '美妆护肤'],
      salesType: 'video',
      level: 'L9',
      hasContact: true,
      gmv30d: 2900000,
      sales30d: 17000,
      liveSales30d: 850000,
      videoSales30d: 2050000,
      avgVideoViews: 70000,
      avgVideoLikes: 5500,
      potential: 94,
      aiAnalysis: '时尚美妆领域达人，风格优雅，粉丝忠诚度高。',
      iceBreaker: 'Hi Olivia! 你的时尚风格很优雅，我们品牌想和你合作...',
      source: 'TikTok联盟中心',
      recorder: '张三',
      recordTime: '2026-03-10 10:30:00',
      followedBy: null,
      isFollowed: false
    },
    {
      id: '18',
      name: 'Daniel Kim',
      username: '@danielkim_fitness',
      avatar: 'https://i.pravatar.cc/150?img=45',
      platformId: 'tiktok',
      followers: 780000,
      likes: 4600000,
      videos: 150,
      avgViews: 32000,
      engagement: 4.3,
      country: 'Japan',
      countryFlag: '🇯🇵',
      category: 'Fitness & Wellness',
      categories: ['运动户外', '健康'],
      salesType: 'live',
      level: 'L6',
      hasContact: true,
      gmv30d: 850000,
      sales30d: 5400,
      liveSales30d: 720000,
      videoSales30d: 130000,
      avgVideoViews: 32000,
      avgVideoLikes: 2300,
      potential: 79,
      aiAnalysis: '健身领域达人，内容专业，粉丝互动性强。',
      iceBreaker: 'Hi Daniel! 你的健身内容很专业，我们有运动产品想和你合作...',
      source: 'TikTok用户端',
      recorder: '李四',
      recordTime: '2026-03-09 16:15:00',
      followedBy: '李四',
      isFollowed: true
    },
    {
      id: '19',
      name: 'Sofia Martinez',
      username: '@sofiamartinez_lifestyle',
      avatar: 'https://i.pravatar.cc/150?img=48',
      platformId: 'tiktok',
      followers: 1400000,
      likes: 9200000,
      videos: 270,
      avgViews: 50000,
      engagement: 4.8,
      country: 'Argentina',
      countryFlag: '🇦🇷',
      category: 'Lifestyle & Travel',
      categories: ['居家日用', '旅游'],
      salesType: 'video',
      level: 'L7',
      hasContact: true,
      gmv30d: 1700000,
      sales30d: 9800,
      liveSales30d: 420000,
      videoSales30d: 1280000,
      avgVideoViews: 50000,
      avgVideoLikes: 3700,
      potential: 88,
      aiAnalysis: '生活方式达人，内容丰富，粉丝信任度高。',
      iceBreaker: 'Hi Sofia! 你的生活内容很丰富，我们有家居产品想和你合作...',
      source: 'TikTok联盟中心',
      recorder: '王五',
      recordTime: '2026-03-08 11:20:00',
      followedBy: null,
      isFollowed: false
    },
    {
      id: '20',
      name: 'Ethan Wilson',
      username: '@ethanwilson_food',
      avatar: 'https://i.pravatar.cc/150?img=51',
      platformId: 'tiktok',
      followers: 680000,
      likes: 4200000,
      videos: 190,
      avgViews: 36000,
      engagement: 4.1,
      country: 'Brazil',
      countryFlag: '🇧🇷',
      category: 'Food & Travel',
      categories: ['食品饮料', '旅游'],
      salesType: 'live',
      level: 'L5',
      hasContact: true,
      gmv30d: 800000,
      sales30d: 5900,
      liveSales30d: 680000,
      videoSales30d: 120000,
      avgVideoViews: 36000,
      avgVideoLikes: 2100,
      potential: 77,
      aiAnalysis: '美食旅游达人，内容生动，粉丝互动性强。',
      iceBreaker: 'Hi Ethan! 你的美食旅游内容很生动，我们有食品产品想和你合作...',
      source: 'TikTok用户端',
      recorder: '赵六',
      recordTime: '2026-03-07 15:30:00',
      followedBy: null,
      isFollowed: false
    },
    {
      id: '21',
      name: 'Luna Zhang',
      username: '@lunazhang_beauty',
      avatar: 'https://i.pravatar.cc/150?img=54',
      platformId: 'tiktok',
      followers: 1800000,
      likes: 12500000,
      videos: 340,
      avgViews: 65000,
      engagement: 5.1,
      country: 'Taiwan',
      countryFlag: '🇹🇼',
      category: 'Beauty & Skincare',
      categories: ['美妆护肤', '个人护理'],
      salesType: 'video',
      level: 'L8',
      hasContact: true,
      gmv30d: 2500000,
      sales30d: 14000,
      liveSales30d: 600000,
      videoSales30d: 1900000,
      avgVideoViews: 65000,
      avgVideoLikes: 5000,
      potential: 92,
      aiAnalysis: '美妆护肤领域达人，内容专业，粉丝活跃度高。',
      iceBreaker: 'Hi Luna! 你的美妆护肤内容很专业，我们品牌想和你合作...',
      source: 'TikTok联盟中心',
      recorder: '张三',
      recordTime: '2026-03-06 10:15:00',
      followedBy: '张三',
      isFollowed: true
    },
    {
      id: '22',
      name: 'Noah Park',
      username: '@noahpark_tech',
      avatar: 'https://i.pravatar.cc/150?img=57',
      platformId: 'tiktok',
      followers: 920000,
      likes: 5800000,
      videos: 185,
      avgViews: 37000,
      engagement: 4.2,
      country: 'Vietnam',
      countryFlag: '🇻🇳',
      category: 'Tech & Reviews',
      categories: ['手机数码', '科技'],
      salesType: 'live',
      level: 'L7',
      hasContact: true,
      gmv30d: 1050000,
      sales30d: 6300,
      liveSales30d: 880000,
      videoSales30d: 170000,
      avgVideoViews: 37000,
      avgVideoLikes: 2400,
      potential: 84,
      aiAnalysis: '科技评测达人，内容详细，粉丝信任度高。',
      iceBreaker: 'Hi Noah! 你的科技评测很详细，我们有新产品想请你体验...',
      source: 'TikTok用户端',
      recorder: '李四',
      recordTime: '2026-03-05 14:45:00',
      followedBy: null,
      isFollowed: false
    }
  ])

  // 分页
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0
  })

  // 排序
  const sortField = ref('gmv30d')
  const sortOrder = ref('descending')

  // 选中状态
  const selectedIds = ref([])

  // 根据筛选条件过滤数据
  const filteredInfluencers = computed(() => {
    let result = [...mockInfluencers.value]

    // 按平台过滤
    if (activePlatform.value !== 'tiktok') {
      return []
    }

    // 按 Sub-Tab 过滤
    if (activeSubTab.value === 'video') {
      result = result.filter(i => i.salesType === 'video')
    } else if (activeSubTab.value === 'live') {
      result = result.filter(i => i.salesType === 'live')
    }

    // 按搜索关键词过滤
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(i =>
        i.name.toLowerCase().includes(query) ||
        i.username.toLowerCase().includes(query) ||
        i.id.includes(query)
      )
    }

    // 按分类筛选
    if (filters.category) {
      result = result.filter(i =>
        i.categories.some(cat => {
          const categoryData = categories.find(c => c.id === filters.category)
          return cat.includes(categoryData?.name || '')
        })
      )
    }

    // 按国家筛选
    if (filters.countries.length > 0) {
      result = result.filter(i => filters.countries.includes(i.country))
    }

    // 按粉丝数筛选
    if (filters.followerCount) {
      result = result.filter(i => {
        if (filters.followerCount === '<1万') return i.followers < 10000
        if (filters.followerCount === '1万-10万') return i.followers >= 10000 && i.followers < 100000
        if (filters.followerCount === '10万-100万') return i.followers >= 100000 && i.followers < 1000000
        if (filters.followerCount === '100万-500万') return i.followers >= 1000000 && i.followers < 5000000
        if (filters.followerCount === '500万-1000万') return i.followers >= 5000000 && i.followers < 10000000
        if (filters.followerCount === '>1000万') return i.followers >= 10000000
        return true
      })
    }

    // 排序
    result.sort((a, b) => {
      let aVal = a[sortField.value]
      let bVal = b[sortField.value]
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      if (sortOrder.value === 'ascending') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    pagination.total = result.length
    return result
  })

  // 分页后的数据
  const paginatedInfluencers = computed(() => {
    const start = (pagination.page - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    return filteredInfluencers.value.slice(start, end)
  })

  // ==================== 弹窗状态 ====================
  const isPluginDialogVisible = ref(false)
  const isAddDialogVisible = ref(false)
  const isTaskDialogVisible = ref(false)
  const isContactDialogVisible = ref(false)
  const isAssignDialogVisible = ref(false)
  const isResultDialogVisible = ref(false)
  const currentContactInfluencer = ref(null)
  const assignLoading = ref(false)

  // 分配结果
  const assignResult = reactive({
    total: 0,
    success: 0,
    failed: 0,
    failedList: []
  })

  // ==================== Actions ====================
  function setActivePlatform(platform) {
    activePlatform.value = platform
    activeSubTab.value = 'all'
    searchQuery.value = ''
    resetFilters()
  }

  function setActiveSubTab(subTab) {
    if (subTab === 'plugin') {
      isPluginDialogVisible.value = true
      return
    }
    activeSubTab.value = subTab
    pagination.page = 1
  }

  function setSearchQuery(query) {
    searchQuery.value = query
    pagination.page = 1
  }

  function setSort(field, order) {
    sortField.value = field
    sortOrder.value = order
  }

  function resetFilters() {
    Object.keys(filters).forEach(key => {
      if (typeof filters[key] === 'string') filters[key] = ''
      else if (Array.isArray(filters[key])) filters[key] = []
      else if (typeof filters[key] === 'boolean') filters[key] = false
    })
    pagination.page = 1
  }

  function removeFilter(key) {
    if (key === 'category') {
      filters.category = ''
      filters.subCategory = ''
    } else if (key === 'brands' || key === 'countries') {
      filters[key] = []
    } else {
      filters[key] = ''
    }
  }

  function clearAllFilters() {
    resetFilters()
  }

  function saveAsFavorite(name) {
    const newFavorite = {
      id: Date.now(),
      name,
      filters: { ...filters }
    }
    favoriteFilters.value.push(newFavorite)
    isSaveFavoriteDialogVisible.value = false
    favoriteName.value = ''
    ElMessage.success('保存成功')
  }

  function applyFavorite(favorite) {
    Object.keys(filters).forEach(key => {
      if (favorite.filters[key] !== undefined) {
        filters[key] = favorite.filters[key]
      }
    })
    showFavoritesPopover.value = false
  }

  function deleteFavorite(id) {
    const index = favoriteFilters.value.findIndex(f => f.id === id)
    if (index > -1) {
      favoriteFilters.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }

  function toggleSelectAll() {
    if (selectedIds.value.length === paginatedInfluencers.value.length) {
      selectedIds.value = []
    } else {
      selectedIds.value = paginatedInfluencers.value
        .filter(i => !i.isFollowed)
        .map(i => i.id)
    }
  }

  function toggleSelect(id) {
    const index = selectedIds.value.indexOf(id)
    if (index > -1) {
      selectedIds.value.splice(index, 1)
    } else {
      selectedIds.value.push(id)
    }
  }

  function handleFollow(influencer) {
    if (influencer.isFollowed) return
    influencer.isFollowed = true
    influencer.followedBy = '当前用户'
    ElMessage.success(`认领成功，可前往「我的达人」管理达人`)
  }

  function handleAssign(influencer) {
    currentContactInfluencer.value = influencer
    isAssignDialogVisible.value = true
  }

  function handleBatchAssign() {
    if (selectedIds.value.length === 0) {
      ElMessage.warning('请选择要分配的达人')
      return
    }
    isAssignDialogVisible.value = true
  }

  function handleBatchFollow() {
    if (selectedIds.value.length === 0) {
      ElMessage.warning('请选择要跟进的达人')
      return
    }
    let success = 0
    let failed = 0
    const failedList = []

    selectedIds.value.forEach(id => {
      const influencer = mockInfluencers.value.find(i => i.id === id)
      if (influencer) {
        if (influencer.isFollowed) {
          failed++
          failedList.push({ name: influencer.name, reason: '达人已被跟进' })
        } else {
          influencer.isFollowed = true
          influencer.followedBy = '当前用户'
          success++
        }
      }
    })

    selectedIds.value = []
    assignResult.total = selectedIds.value.length || success + failed
    assignResult.success = success
    assignResult.failed = failed
    assignResult.failedList = failedList

    if (failed > 0) {
      ElMessage.warning(`选择了 ${success + failed} 条数据，跟进成功 ${success} 条，${failed} 条未成功`)
    } else {
      ElMessage.success(`选择了 ${success} 条数据，跟进成功 ${success} 条`)
    }
  }

  function openContactDialog(influencer) {
    currentContactInfluencer.value = influencer
    isContactDialogVisible.value = true
  }

  function openPluginDialog() {
    isPluginDialogVisible.value = true
  }

  function closePluginDialog() {
    isPluginDialogVisible.value = false
  }

  function openAddDialog() {
    isAddDialogVisible.value = true
  }

  function closeAddDialog() {
    isAddDialogVisible.value = false
  }

  function openTaskDialog() {
    isTaskDialogVisible.value = true
  }

  function closeTaskDialog() {
    isTaskDialogVisible.value = false
  }

  return {
    // Platform tabs
    platformTabs,
    activePlatform,
    // Sub tabs
    subTabs,
    activeSubTab,
    // Search
    searchQuery,
    isSearching,
    // Stats
    totalInfluencerCount,
    // Filters - Area D
    isFilterExpanded,
    categories,
    subCategories,
    filters,
    hoverCategory,
    // Selected filters - Area E
    selectedFilters,
    favoriteFilters,
    showFavoritesPopover,
    isSaveFavoriteDialogVisible,
    favoriteName,
    // List & Pagination - Area F
    mockInfluencers,
    filteredInfluencers,
    paginatedInfluencers,
    pagination,
    sortField,
    sortOrder,
    selectedIds,
    // Dialogs
    isPluginDialogVisible,
    isAddDialogVisible,
    isTaskDialogVisible,
    isContactDialogVisible,
    isAssignDialogVisible,
    isResultDialogVisible,
    currentContactInfluencer,
    assignLoading,
    assignResult,
    // Actions
    setActivePlatform,
    setActiveSubTab,
    setSearchQuery,
    setSort,
    resetFilters,
    removeFilter,
    clearAllFilters,
    saveAsFavorite,
    applyFavorite,
    deleteFavorite,
    toggleSelectAll,
    toggleSelect,
    handleFollow,
    handleAssign,
    handleBatchAssign,
    handleBatchFollow,
    openContactDialog,
    openPluginDialog,
    closePluginDialog,
    openAddDialog,
    closeAddDialog,
    openTaskDialog,
    closeTaskDialog
  }
})
