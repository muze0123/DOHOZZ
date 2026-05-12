<template>
  <div class="my-influencer">
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
        <el-select v-model="filterDepartment" placeholder="全部部门" clearable class="filter-select">
          <el-option label="全部部门" value="" />
          <el-option label="销售部" value="sales" />
          <el-option label="市场部" value="marketing" />
          <el-option label="运营部" value="operation" />
        </el-select>
        <el-select v-model="filterBD" placeholder="全部BD" clearable class="filter-select">
          <el-option label="全部BD" value="" />
          <el-option label="张三" value="zhangsan" />
          <el-option label="李四" value="lisi" />
          <el-option label="王五" value="wangwu" />
        </el-select>
        <div class="date-range">
          <span class="date-label">跟进时间:</span>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="date-picker"
          />
        </div>
        <div class="deal-range">
          <span class="date-label">成交数据:</span>
          <el-date-picker
            v-model="dealRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="date-picker"
          />
        </div>
        <el-checkbox v-model="onlyMyInfluencer" class="only-my-checkbox">只看我的达人</el-checkbox>
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
        <h2 class="page-title">我的达人</h2>
      </div>
      <div class="toolbar-right">
        <el-dropdown @command="handleBatchCommand" trigger="click">
          <el-button class="batch-btn" :disabled="selectedRows.length === 0">
            批量操作
            <el-icon><ArrowDown /></el-icon>
          </el-button>
        </el-dropdown>
        <el-button class="config-btn" @click="showConfigDialog = true">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="margin-right: 4px">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
          </svg>
          配置
        </el-button>
        <el-button type="primary" class="add-btn">
          <el-icon><Plus /></el-icon>
          添加达人
        </el-button>
      </div>
    </div>

    <!-- ==================== 状态标签 ==================== -->
    <div class="status-tabs">
      <div
        v-for="tab in statusTabs"
        :key="tab.key"
        class="status-tab"
        :class="{ active: activeStatus === tab.key }"
        @click="handleStatusChange(tab.key)"
      >
        <span class="status-text">{{ tab.label }}</span>
        <span class="status-count">({{ tab.count }})</span>
      </div>
    </div>

    <!-- ==================== 数据表格 ==================== -->
    <div class="table-section">
      <el-table
        :data="paginatedData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :default-sort="{ prop: 'followTime', order: 'descending' }"
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
        <el-table-column label="成交金额" width="100" align="right" sortable prop="totalGmv">
          <template #default="{ row }">
            <span class="gmv-value">￥{{ formatNumber(row.totalGmv) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成交单数" width="100" align="right" sortable prop="orderCount">
          <template #default="{ row }">
            <span>{{ row.orderCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="销量" width="80" align="right" sortable prop="sales">
          <template #default="{ row }">
            <span>{{ row.sales }}</span>
          </template>
        </el-table-column>
        <el-table-column label="跟进时间" width="180" align="center" sortable prop="followTime">
          <template #default="{ row }">
            <span class="follow-time">{{ row.followTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button type="primary" link size="small" @click="handleContact(row)">触达达人</el-button>
              <el-dropdown trigger="click">
                <el-button type="primary" link size="small">
                  <el-icon><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleViewDetails(row)">查看详情</el-dropdown-item>
                    <el-dropdown-item @click="handleEdit(row)">编辑</el-dropdown-item>
                    <el-dropdown-item @click="handleDelete(row)">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
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

    <!-- ==================== 自定义表格字段抽屉 ==================== -->
    <el-drawer
      v-model="showConfigDialog"
      direction="rtl"
      size="1200px"
    >
      <template #header>
        <div class="drawer-header">
          <span class="header-title">自定义表格字段</span>
          <div class="header-tip">指标最少选择 3 个，最多选择 15 个，已选择 <span>{{ tempSelectedIds.length }}</span> 个</div>
        </div>
      </template>
      <div class="drawer-content">
        <div class="panel-left">
          <div class="config-left">
            <div v-for="group in metricGroups" :key="group.name" class="metric-group">
              <div class="metric-group-title">{{ group.name }}</div>
              <div class="metric-group-items">
                <el-checkbox
                  v-for="opt in group.options"
                  :key="opt.id"
                  :model-value="tempSelectedIds.includes(opt.id)"
                  :disabled="isOptionDisabled(opt.id)"
                  @change="(val) => handleCheckChange(val, opt)"
                >
                  <el-tooltip :content="opt.tooltip" placement="top">
                    <span>{{ opt.label }}</span>
                  </el-tooltip>
                </el-checkbox>
              </div>
            </div>
          </div>
        </div>
        <div class="panel-right">
          <div class="config-right">
            <div class="config-right-header">
              <span>已选 ({{ tempSelectedIds.length }})</span>
              <span class="header-tip-text">长按可拖动调整展示排序</span>
            </div>
            <div class="selected-list">
              <div
                v-for="(item, idx) in tempSelectedItems"
                :key="item.id"
                class="selected-item"
                draggable="true"
                @dragstart="onDragStart(idx)"
                @dragover.prevent
                @drop="onDrop(idx)"
              >
                <div class="item-inner">
                  <svg class="drag-handle" viewBox="0 0 24 24" width="16" height="16" fill="#bfbfbf">
                    <path d="M10 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-8 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-8 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                  </svg>
                  <span>{{ item.label }}</span>
                </div>
                <span class="delete-icon" @click="removeSelected(item.id)">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="#999">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="drawer-footer">
          <el-button @click="confirmRestore">恢复默认</el-button>
          <div class="footer-actions">
            <el-button @click="showConfigDialog = false">取消</el-button>
            <el-button type="primary" @click="saveConfig">确定</el-button>
          </div>
        </div>
      </template>
    </el-drawer>
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

// 筛选
const filterDepartment = ref('')
const filterBD = ref('')
const dateRange = ref([])
const dealRange = ref([])
const onlyMyInfluencer = ref(false)

// 筛选标签
const selectedCountryTags = ref([])
const selectedCategoryTags = ref([])
const filterLevel = ref('')
const filterInteraction = ref('')

// 状态标签
const statusTabs = [
  { key: 'all', label: '全部达人', count: 888 },
  { key: 'toContact', label: '待触达', count: 66 },
  { key: 'toInvite', label: '待邀约', count: 66 },
  { key: 'toApprove', label: '待审单', count: 66 },
  { key: 'toFulfill', label: '待履约', count: 66 },
  { key: 'cooperating', label: '合作中', count: 66 },
  { key: 'completed', label: '合作完成', count: 66 }
]
const activeStatus = ref('all')

// 工具栏
const totalCount = ref(888)
const selectedRows = ref([])

// 分页
const paginationState = ref({ page: 1, pageSize: 10 })

// 弹窗
const isAssignDialogVisible = ref(false)
const isFollowDialogVisible = ref(false)
const isDeleteDialogVisible = ref(false)
const selectedBd = ref('')
const followRemark = ref('')

// 自定义表格字段抽屉
const showConfigDialog = ref(false)
const tempSelectedIds = ref([])
const tempSelectedItems = ref([])
let draggedIndex = ref(-1)

// 指标配置
const allKpiDataMap = {
  '1': { id: '1', label: '达人名称', tooltip: '达人账号名称' },
  '2': { id: '2', label: '达人ID', tooltip: '达人唯一标识' },
  '3': { id: '3', label: '头像', tooltip: '达人头像图片' },
  '4': { id: '4', label: '真实姓名', tooltip: '达人真实姓名' },
  '5': { id: '5', label: '等级', tooltip: '达人等级LV1-LV5' },
  '6': { id: '6', label: '国家地区', tooltip: '达人所在国家/地区' },
  '7': { id: '7', label: '粉丝数', tooltip: '达人粉丝数量' },
  '8': { id: '8', label: '带货类目', tooltip: '达人主要带货品类' },
  '9': { id: '9', label: '近30日成交金额', tooltip: '近30天内成交金额' },
  '10': { id: '10', label: '成交金额', tooltip: '累计成交金额' },
  '11': { id: '11', label: '成交单数', tooltip: '累计成交订单数' },
  '12': { id: '12', label: '销量', tooltip: '累计销售数量' },
  '13': { id: '13', label: '跟进BD', tooltip: '负责跟进该达人的BD' },
  '14': { id: '14', label: '标签', tooltip: '达人的标签属性' },
  '15': { id: '15', label: '跟进时间', tooltip: '最后跟进时间' },
  '16': { id: '16', label: '认证状态', tooltip: '是否已认证' },
  '17': { id: '17', label: '合作状态', tooltip: '当前合作阶段' },
  '18': { id: '18', label: '最近合作时间', tooltip: '最近一次合作时间' }
}

const metricGroups = [
  { name: '基本信息', options: [ allKpiDataMap['1'], allKpiDataMap['2'], allKpiDataMap['3'], allKpiDataMap['4'], allKpiDataMap['5'], allKpiDataMap['6'] ] },
  { name: '数据指标', options: [ allKpiDataMap['7'], allKpiDataMap['8'], allKpiDataMap['9'], allKpiDataMap['10'], allKpiDataMap['11'], allKpiDataMap['12'] ] },
  { name: '跟进信息', options: [ allKpiDataMap['13'], allKpiDataMap['14'], allKpiDataMap['15'], allKpiDataMap['16'], allKpiDataMap['17'], allKpiDataMap['18'] ] }
]

const isOptionDisabled = (optId) => {
  return !tempSelectedIds.value.includes(optId) && tempSelectedIds.value.length >= 15
}

const defaultKpiIds = ['1', '3', '7', '9', '10', '13', '15']

const handleCheckChange = (isChecked, opt) => {
  if (isChecked) {
    if (tempSelectedIds.value.length >= 15) {
      ElMessage.warning('最多选择 15 个指标')
      return
    }
    if (!tempSelectedIds.value.includes(opt.id)) {
      tempSelectedIds.value.push(opt.id)
    }
    if (!tempSelectedItems.value.find(x => x.id === opt.id)) {
      tempSelectedItems.value.push(opt)
    }
  } else {
    if (tempSelectedIds.value.length <= 3) {
      ElMessage.warning('最少选择 3 个指标')
      return
    }
    tempSelectedIds.value = tempSelectedIds.value.filter(x => x !== opt.id)
    tempSelectedItems.value = tempSelectedItems.value.filter(x => x.id !== opt.id)
  }
}

const removeSelected = (id) => {
  if (tempSelectedIds.value.length <= 3) {
    ElMessage.warning('最少选择 3 个指标')
    return
  }
  tempSelectedIds.value = tempSelectedIds.value.filter(x => x !== id)
  tempSelectedItems.value = tempSelectedItems.value.filter(x => x.id !== id)
}

const onDragStart = (idx) => { draggedIndex.value = idx }
const onDrop = (idx) => {
  if (draggedIndex.value === -1 || draggedIndex.value === idx) return
  const list = tempSelectedItems.value
  const item = list.splice(draggedIndex.value, 1)[0]
  list.splice(idx, 0, item)
  tempSelectedIds.value = list.map(x => x.id)
  draggedIndex.value = -1
}

const confirmRestore = () => {
  tempSelectedIds.value = [...defaultKpiIds]
  syncTempItemsFromIds()
}

const syncTempItemsFromIds = () => {
  tempSelectedItems.value = tempSelectedIds.value.map(id => allKpiDataMap[id])
}

const saveConfig = () => {
  if (tempSelectedIds.value.length < 3) { ElMessage.warning('最少选择 3 个指标'); return }
  if (tempSelectedIds.value.length > 15) { ElMessage.warning('最多选择 15 个指标'); return }
  showConfigDialog.value = false
  ElMessage.success('保存成功')
}

// 初始化
tempSelectedIds.value = [...defaultKpiIds]
syncTempItemsFromIds()

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
    totalGmv: 1000000,
    orderCount: 1234,
    sales: 1234,
    bdName: '张三',
    tags: ['高转化', '优质'],
    followTime: '2025-08-06 17:28:40'
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
    totalGmv: 580000,
    orderCount: 856,
    sales: 856,
    bdName: '',
    tags: ['科技达人'],
    followTime: '2025-08-05 14:20:10'
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
    totalGmv: 1200000,
    orderCount: 2100,
    sales: 2100,
    bdName: '李四',
    tags: ['顶级达人', '高客单价'],
    followTime: '2025-08-04 09:15:30'
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
    totalGmv: 320000,
    orderCount: 1580,
    sales: 1580,
    bdName: '',
    tags: ['美食达人'],
    followTime: '2025-08-03 18:45:20'
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
    totalGmv: 680000,
    orderCount: 980,
    sales: 980,
    bdName: '王五',
    tags: ['运动达人'],
    followTime: '2025-08-02 11:30:45'
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
    totalGmv: 1500000,
    orderCount: 3200,
    sales: 3200,
    bdName: '',
    tags: ['家居达人', '优质'],
    followTime: '2025-08-01 16:20:00'
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
    totalGmv: 890000,
    orderCount: 1450,
    sales: 1450,
    bdName: '张三',
    tags: ['时尚达人'],
    followTime: '2025-07-31 20:10:15'
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
    totalGmv: 280000,
    orderCount: 620,
    sales: 620,
    bdName: '',
    tags: ['科技达人'],
    followTime: '2025-07-30 08:45:30'
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
    totalGmv: 2100000,
    orderCount: 4500,
    sales: 4500,
    bdName: '李四',
    tags: ['顶级达人', '高转化'],
    followTime: '2025-07-29 14:30:20'
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
    totalGmv: 980000,
    orderCount: 2100,
    sales: 2100,
    bdName: '',
    tags: ['母婴达人'],
    followTime: '2025-07-28 10:20:40'
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

// 状态切换
function handleStatusChange(status) {
  activeStatus.value = status
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
function handleContact(row) {
  ElMessage.success({ message: '触达成功', customClass: 'success-toast' })
}

function handleViewDetails(row) {
  ElMessage.info('查看详情')
}

function handleEdit(row) {
  ElMessage.info('编辑')
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
@import '@/styles/_influencer-page.scss';

.my-influencer {
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
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input {
  width: 320px;
}

.filter-select {
  width: 120px;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.deal-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-label {
  font-size: 14px;
  color: #666;
}

.date-picker {
  width: 200px;
}

.only-my-checkbox {
  margin-left: 12px;
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

// ==================== 状态标签 ====================
.status-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
}

.status-tab {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border-radius: 16px;
  background: #f5f7fa;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;

  &:hover {
    background: #e6f0ff;
    color: #1677ff;
  }

  &.active {
    background: #1677ff;
    color: #fff;
    font-weight: 500;
  }

  .status-count {
    font-size: 12px;
  }
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

.follow-time {
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

// ==================== 抽屉样式 ====================
:deep(.el-drawer) {
  background: #f5f6f7;
  .el-drawer__header {
    padding: 0;
    margin: 0;
    background: #fff;
    border-bottom: 0px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-drawer__close-btn {
      position: absolute;
      right: 24px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4e5969;
      .el-icon {
        font-size: 24px;
        color: #4e5969;
      }
    }
  }
  .el-drawer__body {
    padding: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .el-drawer__footer {
    padding: 0;
    text-align: right;
    overflow: hidden;
  }
}

.drawer-header {
  display: flex;
  align-items: center;
  padding: 0 20px;
  flex: 1;
  width: 100%;
  box-sizing: border-box;
  .header-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
  .header-tip {
    margin-left: 20px;
    font-size: 13px;
    color: #65676B;
    span {
      font-weight: 700;
      color: #0064E0;
    }
  }
}

.drawer-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f5f6f7;
}

.panel-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  padding: 16px 24px;
  overflow-y: auto;
}

.panel-right {
  width: 320px;
  flex-shrink: 0;
}

.config-left {
  flex: 1;
  overflow-y: auto;
}

.config-right {
  height: 100%;
  border: none;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
}

.metric-group {
  margin-bottom: 24px;
}

.metric-group-title {
  font-size: 14px;
  font-weight: 600;
  color: #050505;
  margin-bottom: 0px;
  padding-bottom: 0px;
  border-bottom: 0px;
}

.metric-group-items {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 12px;
  :deep(.el-checkbox) {
    width: 200px;
    height: 20.375px;
    margin-right: 30px;
    font-weight: 500;
    font-size: 14px;
    position: relative;
    cursor: pointer;
    white-space: nowrap;
    user-select: none;
    .el-checkbox__inner {
      width: 16px;
      height: 16px;
    }
    .el-checkbox__label {
      font-size: 14px;
      color: #86909c;
      font-weight: 500;
      white-space: normal;
      padding-left: 8px;
      line-height: 16px;
    }
    &.is-checked .el-checkbox__label {
      color: #1677ff;
    }
  }
}

.config-right-header {
  padding: 16px;
  background: #fff;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: #050505;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .header-tip-text {
    font-size: 12px;
    color: #999;
    font-weight: 400;
  }
}

.selected-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.selected-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #fff;
  border: none;
  margin-bottom: 8px;
  border-radius: 4px;
  cursor: grab;
  font-size: 13px;
  color: #050505;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    .delete-icon svg {
      fill: #ff4d4f;
    }
  }
  &:active {
    cursor: grabbing;
  }
}

.item-inner {
  display: flex;
  align-items: center;
  gap: 8px;
}

.drag-handle {
  cursor: grab;
}

.delete-icon {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  &:hover svg {
    fill: #ff4d4f;
  }
}

.drawer-footer {
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 24px;
  background: #fff;
  border-top: 0px;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

// 配置按钮样式
.config-btn {
  border-radius: 4px;
  height: 32px;
  font-size: 14px;
}
</style>