<template>
  <div class="influencer-database">
    <!-- ==================== 区域A/B/C：平台Tab + 搜索 + Sub-Tab ==================== -->
    <div class="header-section">
      <!-- 平台Tab -->
      <div class="platform-row">
        <div class="platform-tabs">
          <div
            v-for="tab in store.platformTabs"
            :key="tab.key"
            class="platform-tab"
            :class="{ active: store.activePlatform === tab.key }"
            @click="handlePlatformChange(tab.key)"
          >
            <span>{{ tab.label }}</span>
          </div>
        </div>
        <div class="platform-actions">
          <el-button link type="primary" @click="toggleFilter" class="collapse-btn">
            {{ store.isFilterExpanded ? '收起筛选' : '展开筛选' }}
            <el-icon>
              <ArrowUp v-if="store.isFilterExpanded" />
              <ArrowDown v-else />
            </el-icon>
          </el-button>
        </div>
      </div>

      <!-- 搜索栏 + 筛选 + 收录按钮 -->
      <div class="search-row" v-show="store.activePlatform === 'tiktok' && store.isFilterExpanded">
        <!-- 左侧：搜索框 -->
        <div class="search-left">
          <div class="search-main">
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

          <!-- 筛选条件 -->
          <div class="filter-row">
            <el-select v-model="store.filters.countries" placeholder="国家/地区" multiple clearable collapse-tags size="small" class="filter-select">
              <el-option label="美国" value="United States" />
              <el-option label="马来西亚" value="Malaysia" />
              <el-option label="印度尼西亚" value="Indonesia" />
              <el-option label="泰国" value="Thailand" />
              <el-option label="越南" value="Vietnam" />
              <el-option label="英国" value="United Kingdom" />
              <el-option label="新加坡" value="Singapore" />
              <el-option label="菲律宾" value="Philippines" />
              <el-option label="韩国" value="South Korea" />
            </el-select>

            <el-select v-model="store.filters.category" placeholder="带货分类" clearable size="small" class="filter-select">
              <el-option v-for="cat in store.categories" :key="cat.id" :label="cat.name" :value="cat.id">
                <span>{{ cat.icon }} {{ cat.name }}</span>
              </el-option>
            </el-select>

            <el-select v-model="store.filters.salesType" placeholder="带货方式" clearable size="small" class="filter-select">
              <el-option label="直播带货为主" value="live" />
              <el-option label="视频带货为主" value="video" />
            </el-select>

            <el-select v-model="store.filters.followerCount" placeholder="达人信息" clearable size="small" class="filter-select">
              <el-option label="<1万" value="<1万" />
              <el-option label="1万-10万" value="1万-10万" />
              <el-option label="10万-100万" value="10万-100万" />
              <el-option label="100万-500万" value="100万-500万" />
              <el-option label="500万-1000万" value="500万-1000万" />
              <el-option label=">1000万" value=">1000万" />
            </el-select>
          </div>
        </div>

        <!-- 右侧：统计 + 收录按钮 -->
        <div class="search-actions">
          <span class="stats-text">
            累计已收录 <span class="stats-number">{{ store.totalInfluencerCount.toLocaleString() }}</span> 位达人
          </span>
          <el-button type="primary" class="add-btn" @click="store.openAddDialog">
            <el-icon><Plus /></el-icon>
            收录达人
          </el-button>
        </div>
      </div>
    </div>

    <!-- ==================== 区域D/E/F：Sub-Tab + 达人列表 ==================== -->
    <div class="main-section" v-show="store.activePlatform === 'tiktok'">
      <!-- Sub-Tab + 批量操作 -->
      <div class="sub-tabs-row">
        <div class="sub-tabs">
          <div
            v-for="tab in store.subTabs"
            :key="tab.key"
            class="sub-tab"
            :class="{ active: store.activeSubTab === tab.key }"
            @click="handleSubTabChange(tab.key)"
          >
            <span>{{ tab.label }}</span>
          </div>
        </div>
        <div class="batch-btns">
          <el-button :disabled="store.selectedIds.length === 0" @click="store.handleBatchFollow">
            批量跟进
          </el-button>
          <el-button :disabled="store.selectedIds.length === 0" @click="store.handleBatchAssign">
            批量分配
          </el-button>
        </div>
      </div>
      <!-- 已选条件 -->
      <div v-if="store.selectedFilters.length > 0" class="selected-filters">
        <div class="selected-tags">
          <el-tag
            v-for="filter in store.selectedFilters"
            :key="filter.key"
            closable
            @close="store.removeFilter(filter.key)"
          >
            {{ filter.label }}
          </el-tag>
        </div>
        <el-button link type="primary" @click="store.clearAllFilters">清空</el-button>
        <el-button type="primary" size="small" @click="store.isSaveFavoriteDialogVisible = true">
          存为常用条件
        </el-button>
      </div>



      <!-- 无已选条件也无常用条件 -->
      <!-- <div v-else class="no-filters">
        <span class="save-hint">选择筛选项后可保存为常用条件</span>
      </div> -->

      <!-- 达人数据列表 -->
      <div class="area-f">


        <!-- 达人列表 -->
        <div class="influencer-table">
          <el-table
            :data="store.paginatedInfluencers"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" :selectable="checkSelectable" />
            <el-table-column label="达人信息" min-width="220">
              <template #default="{ row }">
                <div class="influencer-cell">
                  <el-avatar :size="48" :src="row.avatar" class="inf-avatar" />
                  <div class="inf-info">
                    <div class="inf-name">
                      <span @click="goToDetail(row)" class="clickable">{{ row.name }}</span>
                      <el-tag size="small" class="level-tag">{{ row.level }}</el-tag>
                      <el-tag v-if="row.salesType === 'video'" size="small" type="info">视频</el-tag>
                      <el-tag v-else size="small" type="warning">直播</el-tag>
                    </div>
                    <div class="inf-username" @mouseenter="showCopyTooltip($event, row)" @mouseleave="hideCopyTooltip">
                      {{ row.username }}
                    </div>
                    <div class="inf-country">
                      <span>{{ row.countryFlag }}</span> {{ row.country }}
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="粉丝数" width="120" sortable>
              <template #default="{ row }">
                <span class="clickable" @mouseenter="showFollowerTooltip($event, row)" @mouseleave="hideFollowerTooltip">
                  {{ formatNumber(row.followers) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="带货类目" width="140">
              <template #default="{ row }">
                <div class="category-tags">
                  <el-tag v-for="(cat, idx) in row.categories.slice(0, 2)" :key="idx" size="small">{{ cat }}</el-tag>
                  <span v-if="row.categories.length > 2" class="more-cats">+{{ row.categories.length - 2 }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="国家地区" width="120">
              <template #default="{ row }">
                <span>{{ row.countryFlag }} {{ row.country }}</span>
              </template>
            </el-table-column>
            <el-table-column label="近30日成交金额" prop="gmv30d" width="140" sortable>
              <template #default="{ row }">
                <span>¥{{ formatNumber(row.gmv30d) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="近30日销量" prop="sales30d" width="120" sortable>
              <template #default="{ row }">
                <span>{{ formatSales(row.sales30d) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="直播成交金额" prop="liveGmv" width="140" sortable>
              <template #default="{ row }">
                <span>¥{{ formatNumber(row.liveGmv || 60) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="视频成交金额" prop="videoGmv" width="140" sortable>
              <template #default="{ row }">
                <span>¥{{ formatNumber(row.videoGmv || 66) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="平均播放量" prop="avgViews" width="120" sortable>
              <template #default="{ row }">
                <span>{{ formatNumber(row.avgViews || 10) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="平均点赞量" prop="avgLikes" width="120" sortable>
              <template #default="{ row }">
                <span>{{ formatNumber(row.avgLikes || 33) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="潜力分" prop="potential" width="100" sortable>
              <template #default="{ row }">
                <span class="potential-score">{{ row.potential || 88 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="AI分析" min-width="180">
              <template #default="{ row }">
                <el-tooltip :content="row.aiAnalysis || '给达人分析的示例'" placement="top">
                  <div class="ellipsis-2">
                    {{ row.aiAnalysis || '给达人分析的示例' }}
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="建联破冰话术" min-width="200">
              <template #default="{ row }">
                <div class="话术-container">
                  <el-tooltip :content="row.iceBreaker || '话术内容示例'" placement="top">
                    <div class="ellipsis-2">
                      {{ row.iceBreaker || '话术内容示例' }}
                    </div>
                  </el-tooltip>
                  <el-button size="small" @click="copyText(row.iceBreaker || '话术内容示例')">
                    <el-icon><CopyDocument /></el-icon>
                  </el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="达人来源" width="160">
              <template #default="{ row }">
                <span>{{ row.source || 'TikTok联盟中心' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="收录人" width="100">
              <template #default="{ row }">
                <span>{{ row.collector || '张三' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="收录时间" width="180">
              <template #default="{ row }">
                <span>{{ row.collectTime || '2026-04-23 12:44:20' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" fixed="right">
              <template #default="{ row }">
                <div class="action-btns">
                  <template v-if="row.isFollowed">
                    <el-tag type="info" size="small">已跟进 {{ row.followedBy }}</el-tag>
                  </template>
                  <template v-else>
                    <el-button type="primary" link size="small" @click="store.handleFollow(row)">跟进</el-button>
                    <el-button type="primary" link size="small" @click="store.handleAssign(row)">分配</el-button>
                  </template>
                  <el-button type="primary" link size="small" @click="store.openContactDialog(row)">
                    <el-icon><Message /></el-icon>
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 分页 -->
        <div class="pagination-area">
          <el-pagination
            v-model:current-page="store.pagination.page"
            v-model:page-size="store.pagination.pageSize"
            :page-sizes="[10, 20, 50]"
            :total="store.pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
          />
        </div>
      </div>
    </div>

      <!-- 平台未对接时的空状态 -->
      <div v-if="store.activePlatform !== 'tiktok'" class="empty-state">
        <el-empty description="数据建设中，敬请期待">
          <template #image>
            <svg viewBox="0 0 120 120" width="120" height="120">
              <circle cx="60" cy="60" r="50" fill="#f5f5f5"/>
              <text x="60" y="55" text-anchor="middle" fill="#999" font-size="14">🏗️</text>
              <text x="60" y="75" text-anchor="middle" fill="#999" font-size="12">建设中</text>
            </svg>
          </template>
        </el-empty>
    </div>

    <!-- ==================== 弹窗组件 ==================== -->
    <PluginFinderDialog
      v-model="store.isPluginDialogVisible"
      @close="store.closePluginDialog"
    />

    <AddInfluencerDialog
      v-model="store.isAddDialogVisible"
      @close="store.closeAddDialog"
      @open-task-dialog="store.openTaskDialog"
    />

    <TaskListDialog
      v-model="store.isTaskDialogVisible"
      @close="store.closeTaskDialog"
    />

    <!-- 联系方式弹窗 -->
    <el-dialog v-model="store.isContactDialogVisible" title="联系方式" width="480px">
      <div class="contact-dialog" v-if="store.currentContactInfluencer">
        <div class="contact-section">
          <h4>达人简介联系方式（系统采集）</h4>
          <div class="contact-item">
            <span>Email:</span>
            <span>{{ store.currentContactInfluencer.username }}@example.com</span>
            <el-button size="small" @click="copyText(store.currentContactInfluencer.username)">复制</el-button>
          </div>
          <div class="contact-item">
            <span>Instagram:</span>
            <span>{{ store.currentContactInfluencer.username }}</span>
            <el-button size="small" @click="copyText(store.currentContactInfluencer.username)">复制</el-button>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="store.isContactDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 分配达人弹窗 -->
    <el-dialog v-model="store.isAssignDialogVisible" title="分配达人" width="420px">
      <div class="assign-dialog">
        <p v-if="store.selectedIds.length > 0" class="assign-tip">已选择 {{ store.selectedIds.length }} 位达人</p>
        <p v-else class="assign-tip">正在分配 {{ store.currentContactInfluencer?.name }}</p>
        <el-form>
          <el-form-item label="分配BD" required>
            <el-select v-model="assignBd" placeholder="请选择BD" filterable style="width: 100%">
              <el-option label="张三" value="zhangsan" />
              <el-option label="李四" value="lisi" />
              <el-option label="王五" value="wangwu" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="store.isAssignDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="store.assignLoading" @click="confirmAssign">确定</el-button>
      </template>
    </el-dialog>

    <!-- 保存常用条件弹窗 -->
    <el-dialog v-model="store.isSaveFavoriteDialogVisible" title="存为常用条件" width="400px">
      <div class="save-favorite-dialog">
        <div class="selected-preview">
          <span class="preview-label">已选条件：</span>
          <div class="preview-tags">
            <el-tag v-for="f in store.selectedFilters" :key="f.key" size="small">{{ f.label }}</el-tag>
          </div>
        </div>
        <el-form>
          <el-form-item label="常用条件名称" required>
            <el-input v-model="store.favoriteName" placeholder="请输入名称（限15字）" maxlength="15" />
            <span class="char-count">{{ store.favoriteName.length }}/15</span>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="store.isSaveFavoriteDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveFavorite" :disabled="!store.favoriteName.trim()">确定</el-button>
      </template>
    </el-dialog>

    <!-- 复制成功提示 -->
    <div v-if="showCopyTip" class="copy-tooltip" :style="{ left: copyTipPos.x + 'px', top: copyTipPos.y + 'px' }">
      <el-button size="small" @click="doCopy">复制</el-button>
    </div>

    <!-- 粉丝画像气泡 -->
    <div v-if="showFollowerTip" class="follower-tooltip" :style="{ left: followerTipPos.x + 'px', top: followerTipPos.y + 'px' }">
      <div class="follower-info">
        <div>粉丝数量：{{ followerTipData.count }}</div>
        <div>粉丝性别：女性 51%</div>
        <div>粉丝年龄：25-34、18-24 居多</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useInfluencerDatabaseStore } from '@/stores/influencerDatabase'
import { Search, Plus, Message, ArrowUp, ArrowDown, Close, CopyDocument } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import PluginFinderDialog from './dialogs/PluginFinderDialog.vue'
import AddInfluencerDialog from './dialogs/AddInfluencerDialog.vue'
import TaskListDialog from './dialogs/TaskListDialog.vue'

const store = useInfluencerDatabaseStore()

const searchInput = ref('')
let searchDebounceTimer = null
const assignBd = ref('')

// 复制气泡
const showCopyTip = ref(false)
const copyTipPos = ref({ x: 0, y: 0 })
const copyTarget = ref('')

// 粉丝画像气泡
const showFollowerTip = ref(false)
const followerTipPos = ref({ x: 0, y: 0 })
const followerTipData = ref({ count: '' })

// 平台 Tab 切换
function handlePlatformChange(platform) {
  store.setActivePlatform(platform)
  searchInput.value = ''
}

// 收起/展开筛选
function toggleFilter() {
  store.isFilterExpanded = !store.isFilterExpanded
}

// Sub-Tab 切换
function handleSubTabChange(subTab) {
  store.setActiveSubTab(subTab)
}

// 搜索（带防抖）
function handleSearch() {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
  }
  searchDebounceTimer = setTimeout(() => {
    store.setSearchQuery(searchInput.value)
  }, 300)
}

// 搜索清空
function handleSearchClear() {
  searchInput.value = ''
  store.setSearchQuery('')
}

// 保存常用条件
function handleSaveFavorite() {
  if (!store.favoriteName.trim()) {
    ElMessage.warning('请输入常用条件名称')
    return
  }
  store.saveAsFavorite(store.favoriteName)
}

// 重命名常用条件
function handleRenameFavorite(fav) {
  const newName = prompt('请输入新名称', fav.name)
  if (newName) {
    fav.name = newName
    ElMessage.success('重命名成功')
  }
}

// 表格选择变化
function handleSelectionChange(selection) {
  store.selectedIds = selection.map(s => s.id)
}

// 检查是否可选
function checkSelectable(row) {
  return !row.isFollowed
}

// 跳转详情
function goToDetail(row) {
  // 后续实现
  console.log('go to detail:', row.id)
}

// 复制相关
function showCopyTooltip(event, row) {
  copyTarget.value = row.username
  const rect = event.target.getBoundingClientRect()
  copyTipPos.value = { x: rect.left, y: rect.bottom + 5 }
  showCopyTip.value = true
}

function hideCopyTooltip() {
  showCopyTip.value = false
}

function doCopy() {
  navigator.clipboard.writeText(copyTarget.value)
  ElMessage.success('复制成功')
  hideCopyTooltip()
}

// 粉丝画像气泡
function showFollowerTooltip(event, row) {
  followerTipData.value.count = formatNumber(row.followers)
  const rect = event.target.getBoundingClientRect()
  followerTipPos.value = { x: rect.left, y: rect.bottom + 5 }
  showFollowerTip.value = true
}

function hideFollowerTooltip() {
  showFollowerTip.value = false
}

function copyText(text) {
  navigator.clipboard.writeText(text)
  ElMessage.success('复制成功')
}

// 分配确认
function confirmAssign() {
  if (!assignBd.value) {
    ElMessage.warning('请选择分配BD')
    return
  }
  store.assignLoading = true
  setTimeout(() => {
    store.assignLoading = false
    store.isAssignDialogVisible = false
    ElMessage.success('分配成功')
    assignBd.value = ''
  }, 1000)
}

// 格式化数字
function formatNumber(num) {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(2) + '亿'
  } else if (num >= 10000) {
    return (num / 10000).toFixed(2) + 'w'
  }
  return num.toLocaleString()
}

// 格式化销量
function formatSales(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toLocaleString()
}
</script>

<style lang="scss" scoped>
.influencer-database {
  padding: 0 0 24px;
  min-height: 100vh;
  background: #f5f5f5;
}

// ==================== 头部区域：平台Tab + 搜索 + Sub-Tab ====================
.header-section {
  margin-top: 16px;
  background: #fff;
  border: none;
  border-radius: 8px;
  overflow: hidden;
}

// 平台Tab + 操作按钮行
.platform-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;
}

.platform-actions {
  display: flex;
  align-items: center;
  padding: 12px 0;
}

.platform-tabs {
  display: flex;
  gap: 24px;
}

.platform-tab {
  display: flex;
  align-items: center;
  padding: 12px 0;
  color: #666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  position: relative;
  top: 1px;
  font-size: 14px;

  &:hover {
    color: #333;
  }

  &.active {
    color: #1677ff;
    font-weight: 500;
    border-bottom-color: #1677ff;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stats-text {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
}

.stats-number {
  color: #1677ff;
  font-weight: 600;
}

.add-btn {
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.collapse-btn {
  display: flex;
  align-items: center;
  gap: 4px;
}

// 搜索栏
.search-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.search-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.search-main {
  display: flex;
  align-items: center;
}

.search-input {
  width: 500px;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  height: 32px;
}

:deep(.el-select--small .el-select__wrapper) {
  gap: 4px;
  min-height: 32px;
  padding: 2px 8px;
  font-size: 14px;
  line-height: 20px;
  color: #000;
}

:deep(.el-select__wrapper) {
  box-sizing: border-box;
  cursor: pointer;
  text-align: left;
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-fill-color-blank);
  min-height: 32px;
  transition: var(--el-transition-duration);
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  font-size: 14px;
  line-height: 24px;
  display: flex;
  position: relative;
  transform: translate(0, 0);
}

.filter-select {
  width: 200px;
  height: 32px;
}

.search-actions {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex-shrink: 0;
  padding-top: 4px;
}

.stats-text {
  font-size: 14px;
  color: #000;
  white-space: nowrap;
}

.stats-number {
  font-weight: 600;
  color: #1677ff;
  margin: 0 4px;
}

// 内容区域：Sub-Tab + 筛选
.content-section {
  // sub-tabs-row
  .sub-tabs-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    border: none;
    border-radius: 8px 8px 0 0;
    padding: 0 16px;
    margin-bottom: 0;
  }

  .sub-tabs {
    display: flex;
    gap: 4px;
    padding: 12px 0;
  }

  .batch-btns {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sub-tab {
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    color: #666;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;

    &:hover {
      background: #f0f0f0;
    }

    &.active {
      background: #e6f4ff;
      color: #1677ff;
      font-weight: 500;
    }

    .new-badge {
      font-size: 10px;
      color: #ff4d4f;
      font-weight: 600;
    }
  }

  // 筛选条件
  .filter-section {
    padding: 16px;
    border: none;
    border-top: none;
    border-radius: 0 0 8px 8px;
    background: #fff;
  }

  .filter-row {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .filter-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .filter-label {
    font-size: 14px;
    color: #666;
    white-space: nowrap;
  }

  .filter-select {
    min-width: 160px;
  }
}

// 主内容区域：Sub-Tab + 已选条件 + 达人列表
.main-section {
  margin-top: 16px;
  background: #fff;
  border: none;
  border-radius: 8px;
  overflow: hidden;

  .sub-tabs-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    border-bottom: 1px solid #f0f0f0;
  }

  .sub-tabs {
    display: flex;
    gap: 4px;
    padding: 12px 0;
  }

  .batch-btns {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sub-tab {
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    color: #666;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;

    &:hover {
      background: #f0f0f0;
    }

    &.active {
      background: #e6f4ff;
      color: #1677ff;
      font-weight: 500;
    }

    .new-badge {
      font-size: 10px;
      color: #ff4d4f;
      font-weight: 600;
    }
  }

  .area-f {
    padding: 12px 16px;
  }

  .influencer-table {
    width: 100%;
  }

  .pagination-area {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }

  // ==================== 区域E：已选条件 ====================
  .area-e {
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .selected-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    flex: 1;
  }

  .no-filters {
    font-size: 13px;
    color: #999;
  }

  // ==================== 区域F：达人列表 ====================
  .area-f {
    padding: 16px;
  }

}

.influencer-table {
  :deep(.el-table) {
    .el-table__header th {
      background: #fafafa;
      font-weight: 600;
      color: #333;
    }
  }
}

.influencer-cell {
  display: flex;
  gap: 12px;
}

.inf-avatar {
  flex-shrink: 0;
}

.inf-info {
  flex: 1;
  min-width: 0;
}

.inf-name {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #333;

  .clickable {
    cursor: pointer;
    &:hover {
      color: #1677ff;
    }
  }
}

.level-tag {
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: #fff;
  border: none;
}

.inf-username {
  font-size: 12px;
  color: #999;
  cursor: pointer;
  &:hover {
    color: #1677ff;
  }
}

.inf-country {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.more-cats {
  font-size: 12px;
  color: #999;
}

.potential-score {
  font-weight: 600;
  color: #1677ff;
}

.action-btns {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  max-height: 2.8em;
}

.话术-container {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.话术-container .ellipsis-2 {
  flex: 1;
  min-width: 0;
}

.pagination-area {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

// 弹窗样式
.contact-dialog {
  .contact-section {
    h4 {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 12px;
    }
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;

    span:first-child {
      color: #666;
      min-width: 80px;
    }
  }
}

.assign-dialog {
  .assign-tip {
    font-size: 14px;
    color: #666;
    margin-bottom: 16px;
  }
}

.save-favorite-dialog {
  .selected-preview {
    background: #fafafa;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 16px;
  }

  .preview-label {
    font-size: 13px;
    color: #666;
  }

  .preview-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
  }

  .char-count {
    font-size: 12px;
    color: #999;
    margin-left: 8px;
  }
}

// 气泡
.copy-tooltip,
.follower-tooltip {
  position: fixed;
  z-index: 9999;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 4px;
}

.follower-info {
  padding: 8px 12px;
  font-size: 13px;
  color: #333;
  line-height: 1.8;
}

// 空状态
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}
</style>
