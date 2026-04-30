<template>
  <div class="influencer-public-pool">
    <!-- ==================== 平台Tab区 ==================== -->
    <div class="platform-section">
      <div class="platform-tabs">
        <div
          v-for="tab in platformTabs"
          :key="tab.key"
          class="platform-tab"
          :class="{ active: activePlatform === tab.key }"
          @click="handlePlatformChange(tab.key)"
        >
          <span>{{ tab.label }}</span>
        </div>
      </div>
      <div class="platform-actions">
        <el-button link type="primary" @click="toggleFilter" class="collapse-btn">
          {{ isFilterExpanded ? '收起筛选' : '展开筛选' }}
          <el-icon>
            <ArrowUp v-if="isFilterExpanded" />
            <ArrowDown v-else />
          </el-icon>
        </el-button>
      </div>
    </div>

    <!-- ==================== 搜索区 + 筛选区（展开时显示） ==================== -->
    <div class="filter-section" v-show="isFilterExpanded">
      <!-- 搜索行 -->
      <div class="search-row">
        <el-input
          v-model="searchInput"
          placeholder="搜索达人名称、达人ID或达人主页链接"
          class="search-input"
          clearable
          @keyup.enter="handleSearch"
          @clear="handleSearchClear"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
          <template #append>
            <el-button @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>

      <!-- 筛选条件（三行） -->
      <div class="filter-rows">
        <!-- 第一行：国家地区 -->
        <div class="filter-row">
          <span class="filter-label">国家地区</span>
          <div class="filter-tags">
            <el-tag
              v-for="tag in selectedCountryTags"
              :key="tag.value"
              closable
              @close="removeCountryTag(tag)"
              class="filter-tag"
            >
              {{ tag.label }}
            </el-tag>
            <el-dropdown @command="handleCountrySelect" trigger="click">
              <el-button size="small" class="add-filter-btn">
                + 添加
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="United States">美国</el-dropdown-item>
                  <el-dropdown-item command="Malaysia">马来西亚</el-dropdown-item>
                  <el-dropdown-item command="Indonesia">印度尼西亚</el-dropdown-item>
                  <el-dropdown-item command="Thailand">泰国</el-dropdown-item>
                  <el-dropdown-item command="Vietnam">越南</el-dropdown-item>
                  <el-dropdown-item command="United Kingdom">英国</el-dropdown-item>
                  <el-dropdown-item command="Singapore">新加坡</el-dropdown-item>
                  <el-dropdown-item command="Philippines">菲律宾</el-dropdown-item>
                  <el-dropdown-item command="South Korea">韩国</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>

        <!-- 第二行：带货分类 -->
        <div class="filter-row">
          <span class="filter-label">带货分类</span>
          <div class="filter-tags">
            <el-tag
              v-for="tag in selectedCategoryTags"
              :key="tag.value"
              closable
              @close="removeCategoryTag(tag)"
              class="filter-tag"
            >
              {{ tag.label }}
            </el-tag>
            <el-dropdown @command="handleCategorySelect" trigger="click">
              <el-button size="small" class="add-filter-btn">
                + 添加
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="beauty">美妆个护</el-dropdown-item>
                  <el-dropdown-item command="fashion">服饰鞋包</el-dropdown-item>
                  <el-dropdown-item command="food">食品饮料</el-dropdown-item>
                  <el-dropdown-item command="home">家居生活</el-dropdown-item>
                  <el-dropdown-item command="digital">数码科技</el-dropdown-item>
                  <el-dropdown-item command="beauty-supplies">鲜花绿植</el-dropdown-item>
                  <el-dropdown-item command="sports">运动户外</el-dropdown-item>
                  <el-dropdown-item command="mother">母婴用品</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>

        <!-- 第三行：带货信息 -->
        <div class="filter-row">
          <span class="filter-label">带货信息</span>
          <div class="filter-controls">
            <el-select v-model="filterLevel" placeholder="带货水平" clearable size="small" class="filter-select">
              <el-option label="初级别" value="entry" />
              <el-option label="进阶级" value="intermediate" />
              <el-option label="专业级" value="professional" />
              <el-option label="顶级" value="top" />
            </el-select>
            <el-select v-model="filterInteraction" placeholder="平均互动率" clearable size="small" class="filter-select">
              <el-option label="<1%" value="low" />
              <el-option label="1%-5%" value="medium" />
              <el-option label="5%-10%" value="high" />
              <el-option label=">10%" value="very-high" />
            </el-select>
            <el-button size="small" type="primary" @click="handleFilterApply">筛选</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== 工具栏 ==================== -->
    <div class="toolbar-section">
      <div class="toolbar-left">
        <h2 class="page-title">达人公海</h2>
        <span class="total-count">共 {{ totalCount }} 个达人</span>
      </div>
      <div class="toolbar-right">
        <el-dropdown @command="handleBatchCommand" trigger="click">
          <el-button class="batch-btn" :disabled="selectedRows.length === 0">
            批量操作
            <el-icon><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="follow">批量跟进</el-dropdown-item>
              <el-dropdown-item command="assign">批量分配</el-dropdown-item>
              <el-dropdown-item command="delete" class="delete-item">批量删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button class="config-btn">配置</el-button>
        <el-button type="primary" class="add-btn">
          <el-icon><Plus /></el-icon>
          添加达人
        </el-button>
      </div>
    </div>

    <!-- ==================== 数据表格 ==================== -->
    <div class="table-section">
      <el-table
        :data="paginatedData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :default-sort="{ prop: 'recentReleaseTime', order: 'descending' }"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column label="达人信息" min-width="220" fixed="left">
          <template #default="{ row }">
            <div class="influencer-cell">
              <el-avatar :size="46" :src="row.avatar" class="inf-avatar clickable" @click="goToDetail(row)">
                <template #default>
                  <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iI0U4QThFOiIvPjwvc3ZnPg==" />
                </template>
              </el-avatar>
              <div class="inf-info">
                <div class="inf-name">
                  <span class="username">@{{ row.username }}</span>
                  <el-icon v-if="row.verified" class="verified-icon"><CircleCheck /></el-icon>
                  <el-tag size="small" class="level-tag" :style="{ background: '#FFE6F0', color: '#FF66CC' }">
                    {{ row.level }}
                  </el-tag>
                </div>
                <div class="inf-realname">{{ row.name }}</div>
                <div class="inf-country">
                  <el-tag size="small" class="country-tag" :style="{ background: '#FFF0E6', color: '#FF6600' }">
                    {{ row.country }}
                  </el-tag>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="粉丝数" width="100" align="right" sortable>
          <template #default="{ row }">
            <div class="follower-cell">
              <span>{{ formatFollowers(row.followers) }}</span>
              <el-icon class="follower-icon"><User /></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="带货类目" width="120" align="center">
          <template #default="{ row }">
            <div class="category-tags">
              <el-tag v-for="(cat, idx) in row.categories.slice(0, 2)" :key="idx" size="small" class="category-tag">
                {{ cat }}
              </el-tag>
              <span v-if="row.categories.length > 2" class="more-cats">+{{ row.categories.length - 2 }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="近30日成交金额" width="140" align="right" sortable prop="gmv30d">
          <template #default="{ row }">
            <span class="gmv-value">￥{{ formatNumber(row.gmv30d) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="近30日销量" width="100" align="right" sortable prop="sales30d">
          <template #default="{ row }">
            <span>{{ formatSales(row.sales30d) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="场均成交金额" width="120" align="right" sortable prop="avgGmv">
          <template #default="{ row }">
            <span class="gmv-value">￥{{ formatNumber(row.avgGmv) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="跟进BD" width="100" align="center">
          <template #default="{ row }">
            <span v-if="row.bdName" class="bd-name">{{ row.bdName }}</span>
            <span v-else class="no-bd">-</span>
          </template>
        </el-table-column>
        <el-table-column label="标签" width="100" align="center">
          <template #default="{ row }">
            <div class="tags-cell">
              <el-tag
                v-for="(tag, idx) in row.tags.slice(0, 1)"
                :key="idx"
                size="small"
                class="blue-tag"
                :style="{ background: '#E6F0FF', color: '#0066FF' }"
              >
                {{ tag }}
              </el-tag>
              <span v-if="row.tags.length > 1" class="more-tags">+{{ row.tags.length - 1 }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="最近释放时间" width="180" align="center" sortable prop="recentReleaseTime">
          <template #default="{ row }">
            <span class="release-time">{{ row.recentReleaseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button type="primary" link size="small" @click="handleFollow(row)">跟进</el-button>
              <el-button type="primary" link size="small" @click="handleAssign(row)">分配</el-button>
              <el-button type="primary" link size="small" class="delete-btn" @click="handleDelete(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-area">
        <Pagination
          v-model="paginationState"
          :total="totalCount"
          :page-sizes="[10, 20, 50]"
        />
      </div>
    </div>

    <!-- ==================== 批量操作弹窗 ==================== -->
    <!-- 批量分配弹窗 -->
    <el-dialog v-model="isAssignDialogVisible" title="批量分配达人" width="480px">
      <div class="dialog-content">
        <p class="dialog-tip">已选 <span class="highlight">{{ selectedRows.length }}</span> 位达人</p>
        <el-form>
          <el-form-item label="分配BD" required>
            <el-select v-model="selectedBd" placeholder="请选择BD" filterable style="width: 100%">
              <el-option label="张三" value="zhangsan" />
              <el-option label="李四" value="lisi" />
              <el-option label="王五" value="wangwu" />
              <el-option label="赵六" value="zhaoliu" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="isAssignDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmBatchAssign">确定</el-button>
      </template>
    </el-dialog>

    <!-- 批量跟进弹窗 -->
    <el-dialog v-model="isFollowDialogVisible" title="批量跟进" width="480px">
      <div class="dialog-content">
        <p class="dialog-tip">已选 <span class="highlight">{{ selectedRows.length }}</span> 位达人</p>
        <el-form>
          <el-form-item label="跟进备注">
            <el-input
              v-model="followRemark"
              type="textarea"
              :rows="4"
              placeholder="请输入跟进备注"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="isFollowDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmBatchFollow">确定</el-button>
      </template>
    </el-dialog>

    <!-- 批量删除确认弹窗 -->
    <el-dialog v-model="isDeleteDialogVisible" title="批量删除" width="480px">
      <div class="dialog-content">
        <p class="dialog-tip warning">确定要删除选中的 <span class="highlight">{{ selectedRows.length }}</span> 位达人吗？</p>
        <p class="dialog-sub-tip">删除后达人将进入公海</p>
      </div>
      <template #footer>
        <el-button @click="isDeleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmBatchDelete">删除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Plus, ArrowUp, ArrowDown, CircleCheck, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Pagination from '@/components/Pagination.vue'

// 平台Tab
const platformTabs = [
  { key: 'tiktok', label: 'TikTok' },
  { key: 'instagram', label: 'Instagram' }
]
const activePlatform = ref('tiktok')
const isFilterExpanded = ref(true)

// 搜索
const searchInput = ref('')

// 筛选标签
const selectedCountryTags = ref([])
const selectedCategoryTags = ref([])
const filterLevel = ref('')
const filterInteraction = ref('')

// 工具栏
const totalCount = ref(156)
const selectedRows = ref([])

// 分页
const paginationState = ref({ page: 1, pageSize: 10 })

// 弹窗
const isAssignDialogVisible = ref(false)
const isFollowDialogVisible = ref(false)
const isDeleteDialogVisible = ref(false)
const selectedBd = ref('')
const followRemark = ref('')

// 模拟数据
const mockData = ref([
  {
    id: 1,
    avatar: '',
    username: 'fashionqueen_k',
    name: 'Kelly Chen',
    level: 'LV5',
    country: '美国',
    verified: true,
    followers: 102200,
    categories: ['美妆个护', '服饰鞋包'],
    gmv30d: 1000000,
    sales30d: 1234,
    avgGmv: 50000,
    bdName: '张三',
    tags: ['高转化', '优质'],
    recentReleaseTime: '2025-08-06 17:28:40'
  },
  {
    id: 2,
    avatar: '',
    username: 'techreview_mike',
    name: 'Mike Liu',
    level: 'LV4',
    country: '马来西亚',
    verified: true,
    followers: 85000,
    categories: ['数码科技'],
    gmv30d: 580000,
    sales30d: 856,
    avgGmv: 32000,
    bdName: '',
    tags: ['科技达人'],
    recentReleaseTime: '2025-08-05 14:20:10'
  },
  {
    id: 3,
    avatar: '',
    username: 'beauty_sarah',
    name: 'Sarah Wong',
    level: 'LV5',
    country: '印度尼西亚',
    verified: false,
    followers: 156000,
    categories: ['美妆个护', '母婴用品'],
    gmv30d: 1200000,
    sales30d: 2100,
    avgGmv: 65000,
    bdName: '李四',
    tags: ['顶级达人', '高客单价'],
    recentReleaseTime: '2025-08-04 09:15:30'
  },
  {
    id: 4,
    avatar: '',
    username: 'foodie_james',
    name: 'James Tan',
    level: 'LV3',
    country: '泰国',
    verified: true,
    followers: 45600,
    categories: ['食品饮料'],
    gmv30d: 320000,
    sales30d: 1580,
    avgGmv: 18000,
    bdName: '',
    tags: ['美食达人'],
    recentReleaseTime: '2025-08-03 18:45:20'
  },
  {
    id: 5,
    avatar: '',
    username: 'sports_pro',
    name: 'David Lee',
    level: 'LV4',
    country: '越南',
    verified: true,
    followers: 78000,
    categories: ['运动户外'],
    gmv30d: 680000,
    sales30d: 980,
    avgGmv: 42000,
    bdName: '王五',
    tags: ['运动达人'],
    recentReleaseTime: '2025-08-02 11:30:45'
  },
  {
    id: 6,
    avatar: '',
    username: 'home_lifestyle',
    name: 'Emma Zhang',
    level: 'LV5',
    country: '英国',
    verified: false,
    followers: 210000,
    categories: ['家居生活', '母婴用品'],
    gmv30d: 1500000,
    sales30d: 3200,
    avgGmv: 78000,
    bdName: '',
    tags: ['家居达人', '优质'],
    recentReleaseTime: '2025-08-01 16:20:00'
  },
  {
    id: 7,
    avatar: '',
    username: 'fashion_styler',
    name: 'Sophie Chen',
    level: 'LV4',
    country: '新加坡',
    verified: true,
    followers: 92000,
    categories: ['服饰鞋包'],
    gmv30d: 890000,
    sales30d: 1450,
    avgGmv: 55000,
    bdName: '张三',
    tags: ['时尚达人'],
    recentReleaseTime: '2025-07-31 20:10:15'
  },
  {
    id: 8,
    avatar: '',
    username: 'digital_guru',
    name: 'Alex Kim',
    level: 'LV3',
    country: '菲律宾',
    verified: false,
    followers: 38000,
    categories: ['数码科技'],
    gmv30d: 280000,
    sales30d: 620,
    avgGmv: 22000,
    bdName: '',
    tags: ['科技达人'],
    recentReleaseTime: '2025-07-30 08:45:30'
  },
  {
    id: 9,
    avatar: '',
    username: 'beauty_guru',
    name: 'Lisa Wang',
    level: 'LV5',
    country: '韩国',
    verified: true,
    followers: 185000,
    categories: ['美妆个护', '服饰鞋包'],
    gmv30d: 2100000,
    sales30d: 4500,
    avgGmv: 95000,
    bdName: '李四',
    tags: ['顶级达人', '高转化'],
    recentReleaseTime: '2025-07-29 14:30:20'
  },
  {
    id: 10,
    avatar: '',
    username: 'mom_baby_care',
    name: 'Amy Liu',
    level: 'LV4',
    country: '美国',
    verified: true,
    followers: 134000,
    categories: ['母婴用品', '家居生活'],
    gmv30d: 980000,
    sales30d: 2100,
    avgGmv: 48000,
    bdName: '',
    tags: ['母婴达人'],
    recentReleaseTime: '2025-07-28 10:20:40'
  },
  {
    id: 11,
    avatar: '',
    username: 'fitness_coach',
    name: 'John Smith',
    level: 'LV3',
    country: '马来西亚',
    verified: false,
    followers: 52000,
    categories: ['运动户外'],
    gmv30d: 420000,
    sales30d: 890,
    avgGmv: 35000,
    bdName: '王五',
    tags: ['运动达人'],
    recentReleaseTime: '2025-07-27 15:10:25'
  },
  {
    id: 12,
    avatar: '',
    username: 'cooking_master',
    name: 'Chef Wang',
    level: 'LV5',
    country: '印度尼西亚',
    verified: true,
    followers: 168000,
    categories: ['食品饮料'],
    gmv30d: 1350000,
    sales30d: 2800,
    avgGmv: 72000,
    bdName: '',
    tags: ['美食达人', '高转化'],
    recentReleaseTime: '2025-07-26 09:30:00'
  }
])

// 计算分页数据
const paginatedData = computed(() => {
  const start = (paginationState.value.page - 1) * paginationState.value.pageSize
  const end = start + paginationState.value.pageSize
  return mockData.value.slice(start, end)
})

// 平台切换
function handlePlatformChange(platform) {
  activePlatform.value = platform
}

// 收起/展开筛选
function toggleFilter() {
  isFilterExpanded.value = !isFilterExpanded.value
}

// 搜索
function handleSearch() {
  ElMessage.success('搜索成功')
}

function handleSearchClear() {
  searchInput.value = ''
}

// 国家地区标签
function handleCountrySelect(value) {
  const labels = {
    'United States': '美国',
    'Malaysia': '马来西亚',
    'Indonesia': '印度尼西亚',
    'Thailand': '泰国',
    'Vietnam': '越南',
    'United Kingdom': '英国',
    'Singapore': '新加坡',
    'Philippines': '菲律宾',
    'South Korea': '韩国'
  }
  if (!selectedCountryTags.value.find(t => t.value === value)) {
    selectedCountryTags.value.push({ value, label: labels[value] })
  }
}

function removeCountryTag(tag) {
  selectedCountryTags.value = selectedCountryTags.value.filter(t => t.value !== tag.value)
}

// 带货分类标签
function handleCategorySelect(value) {
  const labels = {
    'beauty': '美妆个护',
    'fashion': '服饰鞋包',
    'food': '食品饮料',
    'home': '家居生活',
    'digital': '数码科技',
    'beauty-supplies': '鲜花绿植',
    'sports': '运动户外',
    'mother': '母婴用品'
  }
  if (!selectedCategoryTags.value.find(t => t.value === value)) {
    selectedCategoryTags.value.push({ value, label: labels[value] })
  }
}

function removeCategoryTag(tag) {
  selectedCategoryTags.value = selectedCategoryTags.value.filter(t => t.value !== tag.value)
}

// 筛选应用
function handleFilterApply() {
  ElMessage.success('筛选已应用')
}

// 批量操作
function handleBatchCommand(command) {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请至少选择一位达人')
    return
  }
  switch (command) {
    case 'follow':
      isFollowDialogVisible.value = true
      break
    case 'assign':
      isAssignDialogVisible.value = true
      break
    case 'delete':
      isDeleteDialogVisible.value = true
      break
  }
}

// 表格选择变化
function handleSelectionChange(selection) {
  selectedRows.value = selection
}

// 单个操作
function handleFollow(row) {
  ElMessage.success({ message: '跟进成功', customClass: 'success-toast' })
}

function handleAssign(row) {
  isAssignDialogVisible.value = true
}

function handleDelete(row) {
  ElMessage.success({ message: '删除成功', customClass: 'success-toast' })
}

// 批量确认
function confirmBatchAssign() {
  if (!selectedBd.value) {
    ElMessage.warning({ message: '请选择分配BD', customClass: 'warning-toast' })
    return
  }
  ElMessage.success({ message: '分配成功', customClass: 'success-toast' })
  isAssignDialogVisible.value = false
  selectedBd.value = ''
}

function confirmBatchFollow() {
  ElMessage.success({ message: '跟进成功', customClass: 'success-toast' })
  isFollowDialogVisible.value = false
  followRemark.value = ''
}

function confirmBatchDelete() {
  ElMessage.success({ message: '删除成功', customClass: 'success-toast' })
  isDeleteDialogVisible.value = false
}

// 格式化粉丝数
function formatFollowers(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(2) + 'w'
  }
  return num.toLocaleString()
}

// 格式化金额
function formatNumber(num) {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// 格式化销量
function formatSales(num) {
  return num.toLocaleString()
}

function goToDetail(row) {
  window.open(`/influencer/detail/basic-analysis?id=${row.id}`, '_blank')
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_influencer-page.scss';

.influencer-public-pool {
  @extend .page-container;
  padding: 16px 0 24px;
  background: #f5f5f5;
}

// ==================== 平台Tab区 ====================
.platform-section {
  @extend .platform-section;
}

.platform-tabs {
  @extend .platform-tabs;
}

.platform-tab {
  @extend .platform-tab;
}

.platform-actions {
  display: flex;
  align-items: center;
}

.collapse-btn {
  display: flex;
  align-items: center;
  gap: 4px;
}

// ==================== 搜索区 + 筛选区 ====================
.filter-section {
  @include filter-section;
}

.search-row {
  margin-bottom: 12px;
}

.search-input {
  width: 320px;
}

.filter-rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-label {
  font-size: 14px;
  color: #666;
  min-width: 70px;
}

.filter-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tag {
  background: #f5f7fa;
  border: none;
}

.add-filter-btn {
  border-style: dashed;
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-select {
  width: 160px;
}

// ==================== 工具栏 ====================
.toolbar-section {
  @extend .toolbar-section;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title {
  @extend .page-title;
  font-size: 16px;
}

.total-count {
  font-size: 14px;
  color: #666;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.batch-btn {
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.config-btn {
  border-radius: 4px;
}

.add-btn {
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

// ==================== 数据表格 ====================
.table-section {
  @extend .table-section;
}

.influencer-cell {
  @extend .influencer-cell;
}

.inf-avatar {
  @extend .inf-avatar;
}

.inf-info {
  @extend .inf-info;
}

.inf-name {
  @extend .inf-name;

  .username {
    color: #1677ff;
  }
}

.verified-icon {
  color: #1677ff;
}

.level-tag {
  border: none;
  font-size: 10px;
}

.inf-realname {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.inf-country {
  margin-top: 4px;
}

.country-tag {
  border: none;
  font-size: 10px;
}

.follower-cell {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;

  .follower-icon {
    color: #999;
    font-size: 12px;
  }
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}

.category-tag {
  background: #f5f7fa;
  border: none;
  font-size: 12px;
}

.more-cats {
  font-size: 12px;
  color: #999;
}

.gmv-value {
  font-family: 'PingFang SC', sans-serif;
}

.bd-name {
  color: #333;
  font-size: 14px;
}

.no-bd {
  color: #ccc;
}

.tags-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}

.blue-tag {
  border: none;
  font-size: 12px;
}

.more-tags {
  font-size: 12px;
  color: #999;
}

.release-time {
  font-size: 12px;
  color: #666;
}

.action-btns {
  display: flex;
  align-items: center;
  gap: 4px;
}

.delete-btn {
  color: #ff4d4f;
}

.pagination-area {
  @extend .pagination-area;
}

// ==================== 弹窗样式 ====================
.dialog-content {
  padding: 0;
}

.dialog-tip {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;

  .highlight {
    color: #1677ff;
    font-weight: 600;
  }

  &.warning .highlight {
    color: #ff4d4f;
  }
}

.dialog-sub-tip {
  font-size: 13px;
  color: #999;
  margin-top: -8px;
}

// ==================== 表格样式覆盖 ====================
:deep(.el-table) {
  .el-table__header th {
    background: #fafafa;
    font-weight: 600;
    color: #333;
    font-size: 13px;
  }

  .el-table__row {
    border-bottom: 1px solid #f0f0f0;
  }
}

// ==================== Toast提示样式 ====================
:deep(.success-toast) {
  --el-message-bg-color: #00cc66;
}

:deep(.warning-toast) {
  --el-message-bg-color: #ff6600;
}
</style>
