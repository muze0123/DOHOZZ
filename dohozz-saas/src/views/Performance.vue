<template>
  <div class="performance-page">
    <!-- ==================== 区域A：全局筛选工具栏 ==================== -->
    <div class="filter-area">
      <!-- 平台Tab -->
      <div class="platform-tabs-bar">
        <div class="platform-tabs">
          <div
            v-for="p in platformTabs"
            :key="p.id"
            class="platform-tab"
            :class="{ active: filters.platform === p.id }"
            @click="filters.platform = p.id"
          >
            <div class="platform-icon" v-html="p.icon"></div>
            <span>{{ p.name }}</span>
          </div>
        </div>
      </div>

      <!-- 筛选条件区块 -->
      <div class="filter-toolbar sticky-filter-bar">
        <div class="filter-row">
          <div class="filter-item">
            <span class="filter-label">店铺筛选</span>
            <el-select
              v-model="filters.store"
              placeholder="全部店铺"
              filterable
              clearable
              size="small"
              class="filter-select"
            >
              <el-option label="全部店铺" value="" />
              <el-option label="XXX旗舰店1" value="store1" />
              <el-option label="XXX旗舰店2" value="store2" />
              <el-option label="XXX旗舰店3" value="store3" />
            </el-select>
          </div>

          <div class="filter-item">
            <span class="filter-label">部门筛选</span>
            <el-select
              v-model="filters.department"
              placeholder="全部部门"
              filterable
              clearable
              size="small"
              class="filter-select"
            >
              <el-option label="全部部门" value="" />
              <el-option label="销售一部" value="dept1" />
              <el-option label="销售二部" value="dept2" />
              <el-option label="运营部" value="dept3" />
            </el-select>
          </div>

          <div class="filter-item">
            <span class="filter-label">BD筛选</span>
            <el-select
              v-model="filters.bd"
              placeholder="全部BD"
              filterable
              clearable
              size="small"
              class="filter-select"
            >
              <el-option label="全部BD" value="" />
              <el-option label="张三" value="bd1" />
              <el-option label="李四" value="bd2" />
              <el-option label="王五" value="bd3" />
            </el-select>
          </div>

          <div class="filter-item date-filter">
            <span class="filter-label">时间筛选</span>
            <div class="date-quick-btns">
              <span
                v-for="t in dateQuickTabs"
                :key="t.key"
                class="quick-btn"
                :class="{ active: filters.dateType === t.key }"
                @click="filters.dateType = t.key"
              >{{ t.label }}</span>
            </div>
            <el-date-picker
              v-model="filters.dateRange"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              size="small"
              class="date-range-picker"
              :clearable="false"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== 区域B：数据概览区 ==================== -->
    <div class="section-block area-b">
      <div class="section-head">
        <div class="head-left">
          <span class="section-title">数据概览</span>
          <el-tooltip content="统计已跟进达人 & 有合作单归属关系的「商家链接」订单 + 有团长/活动归属关系的「团长链接」订单" placement="top">
            <span class="help-icon">?</span>
          </el-tooltip>
          <span class="update-time">数据更新于：{{ updateTime }}</span>
          <el-tooltip content="数据每 1 小时更新一次" placement="top">
            <span class="help-icon">?</span>
          </el-tooltip>
        </div>
        <el-button size="small" @click="showOverviewConfig = true">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="margin-right: 4px">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
          </svg>
          配置
        </el-button>
      </div>

      <!-- KPI 指标卡片 -->
      <div class="kpi-cards-scroll">
        <div class="kpi-cards">
          <div
            v-for="kpi in visibleOverviewKpis"
            :key="kpi.id"
            class="kpi-card"
            :class="{ selected: selectedOverviewKpiIds.includes(kpi.id) }"
            @click="toggleOverviewKpiSelect(kpi.id)"
          >
            <div class="kpi-label">
              {{ kpi.label }}
              <el-tooltip :content="kpi.tooltip" placement="top">
                <span class="help-icon">?</span>
              </el-tooltip>
            </div>
            <div class="kpi-value">{{ kpi.value }}</div>
            <div class="kpi-trend">
              <span v-if="kpi.trendDir === 'up'" class="trend-up">↑ {{ kpi.trend }}</span>
              <span v-else-if="kpi.trendDir === 'down'" class="trend-down">↓ {{ kpi.trend }}</span>
              <span v-else class="trend-flat">— {{ kpi.trend }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== 区域C：绩效分析区 ==================== -->
    <div class="section-block area-c">
      <div class="section-head">
        <span class="section-title">绩效分析</span>
        <span class="date-range-text">{{ dateRangeText }}</span>
      </div>

      <div class="performance-analysis-content">
        <!-- 左侧：气泡视图 -->
        <div class="bubble-chart-section">
          <div class="bubble-toolbar">
            <div class="indicator-selector">
              <span class="selector-label">指标选择：</span>
              <el-select v-model="bubbleIndicator" size="small" class="indicator-select">
                <el-option label="GMV" value="gmv" />
                <el-option label="首次出单达人成交金额" value="first_order" />
                <el-option label="结算金额" value="settle" />
                <el-option label="退款金额" value="refund" />
                <el-option label="建联达人数" value="contact" />
                <el-option label="寄样达人数" value="sample" />
              </el-select>
            </div>
            <div class="bubble-tools">
              <el-button size="small" @click="handleZoomSelect">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="margin-right: 4px">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z"/>
                </svg>
                圈选放大
              </el-button>
              <el-button v-if="isZoomed" size="small" @click="handleZoomBack">
                点击返回
              </el-button>
            </div>
          </div>

          <!-- 气泡图表 -->
          <div class="bubble-chart-container" ref="bubbleChartRef">
            <div class="bubble-chart">
              <!-- Y轴 -->
              <div class="bubble-y-axis">
                <span class="axis-label">{{ getBubbleYLabel() }}</span>
              </div>
              <!-- X轴 -->
              <div class="bubble-x-axis">
                <span class="axis-label">{{ getBubbleXLabel() }}</span>
              </div>
              <!-- 气泡 -->
              <div
                v-for="(bubble, index) in bubbleData"
                :key="index"
                class="bubble"
                :style="getBubbleStyle(bubble)"
                @mouseenter="showBubbleTooltip(bubble, $event)"
                @mouseleave="hideBubbleTooltip(bubble)"
              >
                <div class="bubble-inner"></div>
                <el-tooltip placement="top" :visible="bubble.tooltipVisible">
                  <template #content>
                    <div class="bubble-tooltip">
                      <div class="tooltip-name">{{ bubble.name }}</div>
                      <div class="tooltip-dept">{{ bubble.dept }}</div>
                      <div class="tooltip-value">{{ bubble.metricValue }}</div>
                      <div class="tooltip-trend" :class="bubble.trendClass">
                        环比：{{ bubble.trend }}
                      </div>
                    </div>
                  </template>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：BD成交金额TOP10 -->
        <div class="top10-section">
          <div class="top10-title">BD 成交金额 TOP10</div>
          <div class="top10-list">
            <div
              v-for="(item, index) in top10BdData"
              :key="index"
              class="top10-item"
            >
              <span class="top10-rank" :class="{ gold: index < 3 }">{{ index + 1 }}</span>
              <el-avatar :size="24" class="top10-avatar">{{ item.name.charAt(0) }}</el-avatar>
              <span class="top10-name">{{ item.name }}</span>
              <span class="top10-value">{{ item.amount }}</span>
              <span class="top10-trend" :class="item.trendClass">{{ item.trend }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== 区域D：绩效统计区 ==================== -->
    <div class="section-block area-d">
      <div class="section-head">
        <div class="head-left">
          <span class="section-title">绩效统计</span>
          <span class="date-range-text">{{ dateRangeText }}</span>
        </div>
        <div class="toolbar-actions">
          <div class="tab-toggle">
            <span
              v-for="tab in statTabs"
              :key="tab.key"
              class="toggle-btn"
              :class="{ active: currentStatTab === tab.key }"
              @click="currentStatTab = tab.key"
            >
              {{ tab.label }}
            </span>
          </div>
          <el-checkbox v-model="showPreciseValue" label="显示精确数值" size="small" />
          <el-button size="small" @click="handleExport">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="margin-right: 4px">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            导出
          </el-button>
          <el-button
            size="small"
            :disabled="currentStatTab !== 'custom'"
            @click="handleStatConfig"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="margin-right: 4px">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
            配置
          </el-button>
        </div>
      </div>

      <!-- 统计表格 -->
      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th
                v-for="col in visibleStatColumns"
                :key="col.key"
                :class="{ sortable: col.sortable, fixed: col.fixed }"
                @click="col.sortable && handleSort(col.key)"
              >
                {{ col.label }}
                <span v-if="col.sortable" class="sort-arrows">{{ getSortIcon(col.key) }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in statTableData"
              :key="index"
              @click="handleBdClick(row)"
            >
              <td>{{ index + 1 }}</td>
              <td class="bd-cell">
                <el-avatar :size="24" class="bd-avatar">{{ row.name.charAt(0) }}</el-avatar>
                <span class="bd-name">{{ row.name }}</span>
              </td>
              <td class="amount-cell" :class="{ fixed: true }">{{ row.amount }}</td>
              <td :class="getTrendClass(row.amountTrend)">{{ row.amountTrend }}</td>
              <td>{{ row.orderCount }}</td>
              <td>{{ row.estimatedCommission }}</td>
              <td>{{ row.settleAmount }}</td>
              <td>{{ row.settleCount }}</td>
              <td>{{ row.refundAmount }}</td>
              <td>{{ row.refundCount }}</td>
              <td>{{ row.orderTalentCount }}</td>
              <td
                v-for="col in getDynamicColumns()"
                :key="col.key"
              >
                {{ row[col.key] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="pagination-bar">
        <Pagination
          v-model="pagination"
          :total="totalRecords"
          :page-sizes="[10, 20, 50]"
          @change="handlePageChange"
        />
      </div>
    </div>

    <!-- ==================== 区域E：自定义表格字段弹窗 ==================== -->
    <el-dialog
      v-model="showOverviewConfig"
      title="自定义表格字段"
      width="680px"
      :close-on-click-modal="false"
    >
      <div class="config-tip">
        指标最少选择 3 个，最多选择 15 个，已选择 <span>{{ tempOverviewSelectedIds.length }}</span> 个
      </div>
      <div class="config-cols">
        <div class="config-left">
          <div v-for="group in overviewMetricGroups" :key="group.name" class="metric-group">
            <div class="metric-group-title">{{ group.name }}</div>
            <div class="metric-group-opts">
              <el-checkbox-group v-model="tempOverviewSelectedIds">
                <el-checkbox
                  v-for="opt in group.options"
                  :key="opt.id"
                  :label="opt.id"
                  @change="(val) => handleOverviewCheckChange(val, opt)"
                >
                  <el-tooltip :content="opt.tooltip" placement="right">
                    <span>{{ opt.label }}</span>
                  </el-tooltip>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div class="config-right">
          <div class="right-header">已选 ({{ tempOverviewSelectedIds.length }})</div>
          <div class="selected-list">
            <div
              v-for="(item, idx) in tempOverviewSelectedItems"
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
              <span class="delete-icon" @click="removeOverviewSelected(item.id)">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="#999">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="confirmOverviewRestore">恢复默认</el-button>
        <el-button @click="showOverviewConfig = false">取消</el-button>
        <el-button type="primary" @click="saveOverviewConfig">确定</el-button>
      </template>
    </el-dialog>

    <!-- 绩效统计区配置弹窗 -->
    <el-dialog
      v-model="showStatConfig"
      title="自定义表格字段"
      width="680px"
      :close-on-click-modal="false"
      @open="onStatConfigOpen"
    >
      <div class="config-tip">
        指标最少选择 3 个，最多选择 15 个，已选择 <span>{{ tempStatSelectedIds.length }}</span> 个
      </div>
      <div class="config-cols">
        <div class="config-left">
          <div v-for="group in statMetricGroups" :key="group.name" class="metric-group">
            <div class="metric-group-title">{{ group.name }}</div>
            <div class="metric-group-opts">
              <el-checkbox-group v-model="tempStatSelectedIds">
                <el-checkbox
                  v-for="opt in group.options"
                  :key="opt.id"
                  :label="opt.id"
                  @change="(val) => handleStatCheckChange(val, opt)"
                >
                  <el-tooltip :content="opt.tooltip" placement="right">
                    <span>{{ opt.label }}</span>
                  </el-tooltip>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div class="config-right">
          <div class="right-header">已选 ({{ tempStatSelectedIds.length }})</div>
          <div class="selected-list">
            <div
              v-for="(item, idx) in tempStatSelectedItems"
              :key="item.id"
              class="selected-item"
              draggable="true"
              @dragstart="onStatDragStart(idx)"
              @dragover.prevent
              @drop="onStatDrop(idx)"
            >
              <div class="item-inner">
                <svg class="drag-handle" viewBox="0 0 24 24" width="16" height="16" fill="#bfbfbf">
                  <path d="M10 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-8 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-8 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                </svg>
                <span>{{ item.label }}</span>
              </div>
              <span class="delete-icon" @click="removeStatSelected(item.id)">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="#999">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="confirmStatRestore">恢复默认</el-button>
        <el-button @click="showStatConfig = false">取消</el-button>
        <el-button type="primary" @click="saveStatConfig">确定</el-button>
      </template>
    </el-dialog>

    <!-- ==================== 区域F：导出绩效数据弹窗 ==================== -->
    <el-dialog
      v-model="showExportDialog"
      title="导出绩效数据"
      width="500px"
    >
      <div class="export-content">
        <div class="export-time">
          <span class="export-label">展示时间：</span>
          <span class="export-value">{{ dateRangeText }}</span>
        </div>
        <div class="export-fields">
          <div class="export-fields-title">自定义导出字段（默认勾选当前配置字段）</div>
          <el-checkbox-group v-model="exportFields">
            <el-checkbox
              v-for="field in exportFieldOptions"
              :key="field.key"
              :label="field.key"
            >
              {{ field.label }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <template #footer>
        <el-button @click="showExportDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmExport">确定</el-button>
      </template>
    </el-dialog>

    <!-- BD详情页提示弹窗 -->
    <el-dialog
      v-model="showBdDetailTip"
      title="提示"
      width="400px"
    >
      <div class="bd-detail-tip">
        <p>BD 数据页面即将上线，敬请期待</p>
      </div>
      <template #footer>
        <el-button type="primary" @click="showBdDetailTip = false">我知道了</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Pagination from '@/components/Pagination.vue'

// 当前时间
const now = new Date()
const updateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

// ==================== 区域A：筛选 ====================
const filters = reactive({
  store: '',
  department: '',
  bd: '',
  dateType: '30d',
  dateRange: [],
  platform: 'all'
})

const dateQuickTabs = [
  { key: 'yesterday', label: '昨天' },
  { key: '7d', label: '近7天' },
  { key: '30d', label: '近30天' },
  { key: '90d', label: '近90天' },
  { key: 'custom', label: '自定义' }
]

const platformTabs = [
  {
    id: 'all',
    name: '全部',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/></svg>'
  },
  {
    id: 'shopee',
    name: 'Shopee',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><circle cx="12" cy="12" r="10"/></svg>'
  },
  {
    id: 'lazada',
    name: 'Lazada',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><rect x="4" y="4" width="16" height="16" rx="3"/></svg>'
  }
]

// 计算日期范围文本
const dateRangeText = computed(() => {
  if (filters.dateRange && filters.dateRange.length === 2) {
    return `${filters.dateRange[0].replace(/-/g, '.')} - ${filters.dateRange[1].replace(/-/g, '.')}`
  }
  return ''
})

// 初始化日期范围
onMounted(() => {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  filters.dateRange = [
    `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`,
    `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`
  ]
})

// ==================== 区域B：数据概览 ====================
const showOverviewConfig = ref(false)

// KPI指标定义 - 默认显示8个
const allOverviewKpiDataMap = {
  '1': { id: '1', label: '成交金额', value: '¥132.32w', trend: '16%', trendDir: 'up', tooltip: '按支付成功时间，所选周期内支付成功的买家实付金额汇总（含退款）' },
  '2': { id: '2', label: '成交订单数', value: '1,200', trend: '5%', trendDir: 'up', tooltip: '按支付成功时间，所选周期内支付成功的订单数（含退款订单）' },
  '3': { id: '3', label: '首次出单达人成交金额', value: '¥78.12w', trend: '22%', trendDir: 'up', tooltip: '按支付成功时间，首次出单时间在所选周期内的达人成交金额（含退款）' },
  '4': { id: '4', label: '实际成交金额', value: '¥120.35w', trend: '12%', trendDir: 'up', tooltip: '按支付成功时间，所选周期内支付成功的买家实付金额汇总（剔除退款金额）' },
  '5': { id: '5', label: '结算金额', value: '¥98.56w', trend: '8.5%', trendDir: 'up', tooltip: '按结算成功时间，TikTok精选联盟规则：确认收货后15天完成结算', platform: 'tiktok' },
  '6': { id: '6', label: '计佣金额', value: '¥85.20w', trend: '10%', trendDir: 'up', tooltip: '按支付成功时间，买家实付金额+平台/达人补贴-运费，用于达人佣金/团长服务费计算的金额汇总（含退款）', platform: 'tiktok' },
  '7': { id: '7', label: '预估达人佣金', value: '¥12.50w', trend: '15%', trendDir: 'up', tooltip: '按支付成功时间，所选周期内支付成功订单产生的达人佣金汇总（含退款订单）' },
  '8': { id: '8', label: '退款金额', value: '¥8.21w', trend: '3.2%', trendDir: 'down', tooltip: '按退款成功时间，退款按退款发生时间归计（非支付时间）', platform: 'tiktok' },
  // 以下为可配置的额外指标
  '35': { id: '35', label: '跟进达人数', value: '1,280', trend: '3.1%', trendDir: 'up', tooltip: '按跟进时间，所选周期内新跟进的达人数' },
  '43': { id: '43', label: '出单达人数', value: '356', trend: '5.4%', trendDir: 'up', tooltip: '按支付成功时间，所选周期内有出单的达人数' },
  '47': { id: '47', label: '寄样申请数', value: '456', trend: '7.2%', trendDir: 'up', tooltip: '按样品申请时间，所选周期内提交样品审核的样品单数量' }
}

const overviewMetricGroups = [
  { name: '交易指标', options: [
    { id: '1', label: '成交金额', tooltip: '按支付成功时间，所选周期内支付成功的买家实付金额汇总（含退款）' },
    { id: '2', label: '成交订单数', tooltip: '按支付成功时间，所选周期内支付成功的订单数（含退款订单）' },
    { id: '3', label: '首次出单达人成交金额', tooltip: '按支付成功时间，首次出单时间在所选周期内的达人成交金额（含退款）' },
    { id: '4', label: '首次出单达人成交金额占比', tooltip: '首次出单达人成交金额/成交金额' },
    { id: '5', label: '实际成交金额', tooltip: '按支付成功时间，所选周期内支付成功的买家实付金额汇总（剔除退款金额）' },
    { id: '6', label: '实际成交订单数', tooltip: '按支付成功时间，所选周期内支付成功的订单数（剔除退款订单）' },
    { id: '7', label: '结算金额', tooltip: '按结算成功时间，TikTok精选联盟规则：确认收货后15天完成结算', platform: 'tiktok' },
    { id: '8', label: '结算订单数', tooltip: '按结算成功时间，偏财务视角', platform: 'tiktok' },
    { id: '9', label: '成交-结算金额', tooltip: '按支付成功时间，所选周期内支付且已结算完成的金额汇总', platform: 'tiktok' },
    { id: '10', label: '成交-结算订单数', tooltip: '按支付成功时间，所选周期内支付且已结算完成的订单数', platform: 'tiktok' },
    { id: '11', label: '计佣金额', tooltip: '按支付成功时间，买家实付金额+平台/达人补贴-运费', platform: 'tiktok' },
    { id: '12', label: '结算计佣金额', tooltip: '按结算成功时间，已确认收货结算完成的计佣金额汇总', platform: 'tiktok' },
    { id: '13', label: '预估达人佣金', tooltip: '按支付成功时间，所选周期内支付成功订单产生的达人佣金汇总（含退款订单）' },
    { id: '14', label: '结算达人佣金', tooltip: '按结算成功时间，已结算完成订单产生的达人佣金汇总', platform: 'tiktok' },
    { id: '15', label: '预估团长服务费', tooltip: '按支付成功时间，归属该员工的团长支付订单产生的团长服务费汇总' },
    { id: '16', label: '结算团长服务费', tooltip: '按结算成功时间，已结算团长订单产生的团长服务费汇总', platform: 'tiktok' },
    { id: '17', label: '退款金额', tooltip: '按退款成功时间，退款按退款发生时间归计', platform: 'tiktok' },
    { id: '18', label: '退款订单数', tooltip: '按退款成功时间，偏财务视角', platform: 'tiktok' },
    { id: '19', label: '成交-退款金额', tooltip: '按支付成功时间，所选周期内支付且已退款成功的金额汇总' },
    { id: '20', label: '成交-退款订单数', tooltip: '按支付成功时间，所选周期内支付且已退款成功的订单数' },
    { id: '21', label: '成交退款率', tooltip: '成交退款订单数/成交订单数' },
    { id: '22', label: '发货前退款率', tooltip: '发货前退款成功的订单占比', platform: 'tiktok' },
    { id: '23', label: '发货后退款率', tooltip: '发货后退款成功的订单占比', platform: 'tiktok' },
    { id: '24', label: '团长出单达人数', tooltip: '按支付成功时间，通过团长链接出单的达人数' },
    { id: '25', label: '成交金额环比', tooltip: '当前周期成交金额/上一周期成交金额-1×100%' }
  ]},
  { name: '内容指标', options: [
    { id: '26', label: '合作直播数', tooltip: '按直播开播时间，所选周期内开播的合作直播间数量', platform: 'tiktok' },
    { id: '27', label: '出单直播数', tooltip: '按支付成功时间，所选周期内有出单的合作直播间数量', platform: 'tiktok' },
    { id: '28', label: '合作视频数', tooltip: '按视频发布时间，所选周期内发布的合作带货视频数量', platform: 'tiktok' },
    { id: '29', label: '出单视频数', tooltip: '按支付成功时间，所选周期内有出单的合作带货视频数量', platform: 'tiktok' },
    { id: '30', label: '视频播放量', tooltip: '所选时间内合作达人累计视频播放量', platform: 'tiktok' },
    { id: '31', label: '视频点赞量', tooltip: '所选时间内合作达人累计视频点赞量', platform: 'tiktok' },
    { id: '32', label: '视频评论数', tooltip: '所选时间内合作达人累计视频评论数', platform: 'tiktok' },
    { id: '33', label: '视频转发数', tooltip: '所选时间内合作达人累计视频转发数', platform: 'tiktok' },
    { id: '34', label: '视频收藏数', tooltip: '所选时间内合作达人累计视频收藏数', platform: 'tiktok' }
  ]},
  { name: '达人指标', options: [
    { id: '35', label: '跟进达人数', tooltip: '按跟进时间，所选周期内新跟进的达人数' },
    { id: '36', label: '建联达人数', tooltip: '按确认建联时间，所选周期内建联成功的达人数' },
    { id: '37', label: '寄样达人数', tooltip: '按发货时间，所选周期内发货成功的达人数' },
    { id: '38', label: '首次寄样达人数', tooltip: '首次给达人发货时间在所选周期内且发货成功的达人数' },
    { id: '39', label: '签收达人数', tooltip: '按样品签收时间，所选周期内已签收样品的达人数' },
    { id: '40', label: '交付达人数', tooltip: '按达人交付时间，有完成带货合作交付的达人数', platform: 'tiktok' },
    { id: '41', label: '直播达人数', tooltip: '按达人开播时间，所选周期内有开播的达人数', platform: 'tiktok' },
    { id: '42', label: '视频达人数', tooltip: '按视频发布时间，所选周期内有发布带货视频的达人数', platform: 'tiktok' },
    { id: '43', label: '出单达人数', tooltip: '按支付成功时间，所选周期内有出单的达人数' },
    { id: '44', label: '首次出单达人数', tooltip: '按支付成功时间，所选周期内首次出单的达人数（T+1更新）' },
    { id: '45', label: '深度合作达人数', tooltip: '按支付成功时间，成交金额达到指定阈值的达人数' },
    { id: '46', label: '建联-寄样成功率', tooltip: '按确认建联时间，建联成功的达人中寄样成功的达人占比' }
  ]},
  { name: '寄样指标', options: [
    { id: '47', label: '寄样申请数', tooltip: '按样品申请时间，所选周期内提交样品审核的样品单数量' },
    { id: '48', label: '寄样发货次数', tooltip: '按样品发货时间，所选周期内发货成功的样品单数量' },
    { id: '49', label: '发货样品件数', tooltip: '按样品发货时间，发货成功的样品件数' },
    { id: '50', label: '签收样品数', tooltip: '按样品签收时间，所选周期内签收成功的样品单数量' },
    { id: '51', label: '签收出单率', tooltip: '有出单的样品数/签收样品数' },
    { id: '52', label: '签收交付率', tooltip: '完成合作交付的样品数/签收样品数' },
    { id: '53', label: '寄样成本', tooltip: '按样品发货时间，发货成功的样品总金额' }
  ]},
  { name: '提成指标', options: [
    { id: '54', label: '提成基数', tooltip: '所选时间内付款的收货订单去佣金额之和（次日更新）' },
    { id: '55', label: '员工提成', tooltip: '提成基数×员工提成比例（次日更新）' },
    { id: '56', label: '管理提成', tooltip: '部门提成基数×管理提成比例（次日更新）' }
  ]}
]

const defaultOverviewKpiIds = ['1', '2', '3', '4', '5', '6', '7', '8', '35', '43', '47']
const userSavedOverviewConfigIds = ref(JSON.parse(localStorage.getItem('DOHOZZ_OVERVIEW_KPI_CONFIG')) || [...defaultOverviewKpiIds])
const visibleOverviewKpis = computed(() => userSavedOverviewConfigIds.value.map(id => allOverviewKpiDataMap[id]))
const selectedOverviewKpiIds = ref(['1', '2'])

const tempOverviewSelectedIds = ref([])
const tempOverviewSelectedItems = ref([])

const toggleOverviewKpiSelect = (id) => {
  const arr = selectedOverviewKpiIds.value
  const pos = arr.indexOf(id)
  if (pos !== -1) {
    if (arr.length <= 1) { ElMessage.warning('至少保留 1 个数据指标'); return }
    arr.splice(pos, 1)
  } else {
    if (arr.length >= 2) { ElMessage.warning('最多选择 2 个数据指标'); return }
    arr.push(id)
  }
}

const handleOverviewCheckChange = (isChecked, opt) => {
  if (isChecked) {
    if (tempOverviewSelectedIds.value.length >= 15) {
      ElMessage.warning('最多选择 15 个指标')
      tempOverviewSelectedIds.value = tempOverviewSelectedIds.value.filter(x => x !== opt.id)
      return
    }
    tempOverviewSelectedItems.value.push(opt)
  } else {
    if (tempOverviewSelectedIds.value.length <= 3) {
      ElMessage.warning('最少选择 3 个指标')
      tempOverviewSelectedIds.value.push(opt.id)
      return
    }
    tempOverviewSelectedItems.value = tempOverviewSelectedItems.value.filter(x => x.id !== opt.id)
  }
}

const removeOverviewSelected = (id) => {
  if (tempOverviewSelectedIds.value.length <= 3) {
    ElMessage.warning('最少选择 3 个指标')
    return
  }
  tempOverviewSelectedIds.value = tempOverviewSelectedIds.value.filter(x => x !== id)
  tempOverviewSelectedItems.value = tempOverviewSelectedItems.value.filter(x => x.id !== id)
}

const onDragStart = (idx) => { draggedIndex.value = idx }
const onDrop = (idx) => {
  if (draggedIndex.value === -1 || draggedIndex.value === idx) return
  const list = tempOverviewSelectedItems.value
  const item = list.splice(draggedIndex.value, 1)[0]
  list.splice(idx, 0, item)
  tempOverviewSelectedIds.value = list.map(x => x.id)
  draggedIndex.value = -1
}

let draggedIndex = ref(-1)

const confirmOverviewRestore = () => {
  ElMessageBox.confirm('确定恢复默认配置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    tempOverviewSelectedIds.value = [...defaultOverviewKpiIds]
    syncTempOverviewItemsFromIds()
  }).catch(() => {})
}

const syncTempOverviewItemsFromIds = () => {
  tempOverviewSelectedItems.value = tempOverviewSelectedIds.value.map(id => allOverviewKpiDataMap[id])
}

const saveOverviewConfig = () => {
  if (tempOverviewSelectedIds.value.length < 3) { ElMessage.warning('最少选择 3 个指标'); return }
  if (tempOverviewSelectedIds.value.length > 15) { ElMessage.warning('最多选择 15 个指标'); return }

  userSavedOverviewConfigIds.value = [...tempOverviewSelectedIds.value]
  localStorage.setItem('DOHOZZ_OVERVIEW_KPI_CONFIG', JSON.stringify(userSavedOverviewConfigIds.value))

  selectedOverviewKpiIds.value = selectedOverviewKpiIds.value.filter(id => userSavedOverviewConfigIds.value.includes(id))
  if (selectedOverviewKpiIds.value.length === 0 && userSavedOverviewConfigIds.value.length > 0) {
    selectedOverviewKpiIds.value.push(userSavedOverviewConfigIds.value[0])
  }

  showOverviewConfig.value = false
  ElMessage.success('保存成功')
}

// ==================== 区域C：绩效分析 ====================
const bubbleIndicator = ref('gmv')
const isZoomed = ref(false)
const bubbleChartRef = ref(null)

const bubbleData = reactive([
  { name: '张三', dept: '销售一部', value: 66.66, growth: 25, trend: '+25%', trendClass: 'trend-up', tooltipVisible: false },
  { name: '李四', dept: '销售一部', value: 56.66, growth: 18, trend: '+18%', trendClass: 'trend-up', tooltipVisible: false },
  { name: '王五', dept: '销售二部', value: 46.66, growth: -5, trend: '-5%', trendClass: 'trend-down', tooltipVisible: false },
  { name: '赵六', dept: '销售二部', value: 40.20, growth: 12, trend: '+12%', trendClass: 'trend-up', tooltipVisible: false },
  { name: '陈七', dept: '运营部', value: 35.80, growth: 8, trend: '+8%', trendClass: 'trend-up', tooltipVisible: false },
  { name: '周八', dept: '运营部', value: 30.50, growth: -3, trend: '-3%', trendClass: 'trend-down', tooltipVisible: false },
  { name: '吴九', dept: '销售三部', value: 28.30, growth: 15, trend: '+15%', trendClass: 'trend-up', tooltipVisible: false },
  { name: '郑十', dept: '销售三部', value: 25.00, growth: 6, trend: '+6%', trendClass: 'trend-up', tooltipVisible: false },
  { name: '刘一', dept: '销售四部', value: 22.80, growth: -8, trend: '-8%', trendClass: 'trend-down', tooltipVisible: false },
  { name: '孙二', dept: '销售四部', value: 20.00, growth: 3, trend: '+3%', trendClass: 'trend-up', tooltipVisible: false },
])

const top10BdData = reactive([
  { name: '张三', amount: '¥66.66w', trend: '+25%', trendClass: 'trend-up' },
  { name: '李四', amount: '¥56.66w', trend: '+18%', trendClass: 'trend-up' },
  { name: '王五', amount: '¥46.66w', trend: '-5%', trendClass: 'trend-down' },
  { name: '赵六', amount: '¥40.20w', trend: '+12%', trendClass: 'trend-up' },
  { name: '陈七', amount: '¥35.80w', trend: '+8%', trendClass: 'trend-up' },
  { name: '周八', amount: '¥30.50w', trend: '-3%', trendClass: 'trend-down' },
  { name: '吴九', amount: '¥28.30w', trend: '+15%', trendClass: 'trend-up' },
  { name: '郑十', amount: '¥25.00w', trend: '+6%', trendClass: 'trend-up' },
  { name: '刘一', amount: '¥22.80w', trend: '-8%', trendClass: 'trend-down' },
  { name: '孙二', amount: '¥20.00w', trend: '+3%', trendClass: 'trend-up' },
])

const getBubbleYLabel = () => {
  const labels = {
    gmv: '成交金额（w）',
    first_order: '首次出单达人成交金额（w）',
    settle: '结算金额（w）',
    refund: '退款金额（w）',
    contact: '建联达人数',
    sample: '寄样达人数'
  }
  return labels[bubbleIndicator.value] || '成交金额（w）'
}

const getBubbleXLabel = () => {
  return '增长率（%）'
}

const getBubbleStyle = (bubble) => {
  const maxValue = Math.max(...bubbleData.map(b => b.value))
  const maxGrowth = Math.max(...bubbleData.map(b => Math.abs(b.growth)))

  const x = 50 + (bubble.growth / maxGrowth) * 40
  const y = 80 - (bubble.value / maxValue) * 60
  const size = 40

  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`
  }
}

const showBubbleTooltip = (bubble, event) => {
  bubble.tooltipVisible = true
}

const hideBubbleTooltip = (bubble) => {
  bubble.tooltipVisible = false
}

const handleZoomSelect = () => {
  ElMessage.info('请点击并拖拽框选区域进行放大')
}

const handleZoomBack = () => {
  isZoomed.value = false
  ElMessage.info('已返回全量视图')
}

// ==================== 区域D：绩效统计 ====================
const currentStatTab = ref('custom')
const showPreciseValue = ref(false)
const showStatConfig = ref(false)
const showExportDialog = ref(false)
const showBdDetailTip = ref(false)

const statTabs = [
  { key: 'custom', label: '自定义指标' },
  { key: 'trade', label: '交易指标' },
  { key: 'content', label: '内容指标' },
  { key: 'talent', label: '达人指标' },
  { key: 'sample', label: '寄样指标' }
]

const statColumns = [
  { key: 'rank', label: '排名', sortable: false, fixed: true },
  { key: 'bd', label: 'BD', sortable: false, fixed: true },
  { key: 'amount', label: '成交金额', sortable: true, fixed: true },
  { key: 'amountTrend', label: '成交金额环比', sortable: true, fixed: false },
  { key: 'orderCount', label: '成交订单数', sortable: true, fixed: false },
  { key: 'estimatedCommission', label: '预估达人佣金', sortable: true, fixed: false },
  { key: 'settleAmount', label: '结算金额', sortable: true, fixed: false },
  { key: 'settleCount', label: '结算订单数', sortable: true, fixed: false },
  { key: 'refundAmount', label: '退款金额', sortable: true, fixed: false },
  { key: 'refundCount', label: '退款订单数', sortable: true, fixed: false },
  { key: 'orderTalentCount', label: '出单达人数', sortable: true, fixed: false }
]

const visibleStatColumns = computed(() => {
  if (currentStatTab.value !== 'custom') {
    return statColumns.filter(col => col.key !== 'amountTrend')
  }
  return statColumns
})

const statTableData = reactive([
  { name: '张三', amount: '¥132.32w', amountTrend: '+16%', orderCount: '1,200', estimatedCommission: '¥12.50w', settleAmount: '¥98.56w', settleCount: '890', refundAmount: '¥8.21w', refundCount: '45', orderTalentCount: '356' },
  { name: '李四', amount: '¥98.50w', amountTrend: '+12%', orderCount: '980', estimatedCommission: '¥9.80w', settleAmount: '¥75.20w', settleCount: '720', refundAmount: '¥5.60w', refundCount: '32', orderTalentCount: '280' },
  { name: '王五', amount: '¥86.30w', amountTrend: '-3%', orderCount: '860', estimatedCommission: '¥8.60w', settleAmount: '¥65.80w', settleCount: '630', refundAmount: '¥4.80w', refundCount: '28', orderTalentCount: '245' },
  { name: '赵六', amount: '¥75.80w', amountTrend: '+8%', orderCount: '750', estimatedCommission: '¥7.50w', settleAmount: '¥58.20w', settleCount: '550', refundAmount: '¥4.20w', refundCount: '24', orderTalentCount: '215' },
  { name: '陈七', amount: '¥68.20w', amountTrend: '+5%', orderCount: '680', estimatedCommission: '¥6.80w', settleAmount: '¥52.40w', settleCount: '500', refundAmount: '¥3.80w', refundCount: '22', orderTalentCount: '195' },
  { name: '周八', amount: '¥62.50w', amountTrend: '-2%', orderCount: '620', estimatedCommission: '¥6.20w', settleAmount: '¥48.00w', settleCount: '460', refundAmount: '¥3.50w', refundCount: '20', orderTalentCount: '178' },
  { name: '吴九', amount: '¥55.80w', amountTrend: '+10%', orderCount: '560', estimatedCommission: '¥5.50w', settleAmount: '¥42.80w', settleCount: '410', refundAmount: '¥3.10w', refundCount: '18', orderTalentCount: '160' },
  { name: '郑十', amount: '¥48.60w', amountTrend: '+6%', orderCount: '480', estimatedCommission: '¥4.80w', settleAmount: '¥37.20w', settleCount: '350', refundAmount: '¥2.70w', refundCount: '15', orderTalentCount: '140' },
  { name: '刘一', amount: '¥42.30w', amountTrend: '-5%', orderCount: '420', estimatedCommission: '¥4.20w', settleAmount: '¥32.40w', settleCount: '310', refundAmount: '¥2.30w', refundCount: '13', orderTalentCount: '120' },
  { name: '孙二', amount: '¥38.90w', amountTrend: '+3%', orderCount: '390', estimatedCommission: '¥3.80w', settleAmount: '¥29.80w', settleCount: '280', refundAmount: '¥2.10w', refundCount: '12', orderTalentCount: '110' },
])

const totalRecords = ref(10)
const currentPage = ref(1)
const pageSize = ref(10)
const pagination = ref({ page: 1, pageSize: 10 })
const totalPages = computed(() => Math.ceil(totalRecords.value / pageSize.value))
const jumpPage = ref(1)
const sortField = ref('amount')
const sortDir = ref('desc')

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const getDynamicColumns = () => {
  return []
}

const getSortIcon = (field) => {
  if (sortField.value !== field) return '↕'
  return sortDir.value === 'desc' ? '↓' : '↑'
}

const handleSort = (field) => {
  if (sortField.value === field) {
    sortDir.value = sortDir.value === 'desc' ? 'asc' : 'desc'
  } else {
    sortField.value = field
    sortDir.value = 'desc'
  }
}

const getTrendClass = (trend) => {
  if (trend.startsWith('+')) return 'trend-up'
  if (trend.startsWith('-')) return 'trend-down'
  return ''
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const goToPage = (page) => {
  currentPage.value = page
}

const handlePageChange = (pageInfo) => {
  currentPage.value = pageInfo.page
  pageSize.value = pageInfo.pageSize
  pagination.value = pageInfo
}

const handlePageJump = () => {
  const page = parseInt(jumpPage.value)
  if (page < 1 || page > totalPages.value) {
    ElMessage.warning('请输入有效页码')
    return
  }
  currentPage.value = page
}

const handleBdClick = (row) => {
  showBdDetailTip.value = true
}

// 绩效统计区配置相关
const statMetricGroups = [
  { name: '交易指标', options: [
    { id: 'amount', label: '成交金额', tooltip: '按支付成功时间，所选周期内支付成功的买家实付金额汇总（含退款）', fixed: true },
    { id: 'orderCount', label: '成交订单数', tooltip: '按支付成功时间，所选周期内支付成功的订单数（含退款订单）' },
    { id: 'firstOrderAmount', label: '首次出单达人成交金额', tooltip: '按支付成功时间，首次出单时间在所选周期内的达人成交金额' },
    { id: 'firstOrderPercent', label: '首次出单达人成交金额占比', tooltip: '首次出单达人成交金额/成交金额' },
    { id: 'actualAmount', label: '实际成交金额', tooltip: '按支付成功时间，剔除退款金额' },
    { id: 'actualOrderCount', label: '实际成交订单数', tooltip: '按支付成功时间，剔除退款订单' },
    { id: 'settleAmount', label: '结算金额', tooltip: '按结算成功时间', platform: 'tiktok' },
    { id: 'settleOrderCount', label: '结算订单数', tooltip: '按结算成功时间', platform: 'tiktok' },
    { id: 'paidSettleAmount', label: '成交-结算金额', tooltip: '按支付成功时间，所选周期内支付且已结算完成的金额', platform: 'tiktok' },
    { id: 'paidSettleOrderCount', label: '成交-结算订单数', tooltip: '按支付成功时间，所选周期内支付且已结算完成的订单数', platform: 'tiktok' },
    { id: 'commissionAmount', label: '计佣金额', tooltip: '按支付成功时间，买家实付金额+平台/达人补贴-运费', platform: 'tiktok' },
    { id: 'settleCommissionAmount', label: '结算计佣金额', tooltip: '按结算成功时间，已确认收货结算完成的计佣金额', platform: 'tiktok' },
    { id: 'estimatedCommission', label: '预估达人佣金', tooltip: '按支付成功时间，所选周期内支付成功订单产生的达人佣金' },
    { id: 'settleCommission', label: '结算达人佣金', tooltip: '按结算成功时间，已结算完成订单产生的达人佣金', platform: 'tiktok' },
    { id: 'estimatedServiceFee', label: '预估团长服务费', tooltip: '按支付成功时间，归属该员工的团长支付订单产生的团长服务费' },
    { id: 'settleServiceFee', label: '结算团长服务费', tooltip: '按结算成功时间，已结算团长订单产生的团长服务费', platform: 'tiktok' },
    { id: 'refundAmount', label: '退款金额', tooltip: '按退款成功时间', platform: 'tiktok' },
    { id: 'refundOrderCount', label: '退款订单数', tooltip: '按退款成功时间', platform: 'tiktok' },
    { id: 'paidRefundAmount', label: '成交-退款金额', tooltip: '按支付成功时间，所选周期内支付且已退款成功的金额' },
    { id: 'paidRefundOrderCount', label: '成交-退款订单数', tooltip: '按支付成功时间，所选周期内支付且已退款成功的订单数' },
    { id: 'refundRate', label: '成交退款率', tooltip: '成交退款订单数/成交订单数' },
    { id: 'preDeliveryRefundRate', label: '发货前退款率', tooltip: '发货前退款成功的订单占比', platform: 'tiktok' },
    { id: 'postDeliveryRefundRate', label: '发货后退款率', tooltip: '发货后退款成功的订单占比', platform: 'tiktok' },
    { id: 'leaderOrderTalentCount', label: '团长出单达人数', tooltip: '按支付成功时间，通过团长链接出单的达人数' },
    { id: 'amountChain', label: '成交金额环比', tooltip: '当前周期成交金额/上一周期成交金额-1×100%' }
  ]},
  { name: '内容指标', options: [
    { id: 'cooperLiveCount', label: '合作直播数', tooltip: '按直播开播时间，所选周期内开播的合作直播间数量', platform: 'tiktok' },
    { id: 'orderLiveCount', label: '出单直播数', tooltip: '按支付成功时间，所选周期内有出单的合作直播间数量', platform: 'tiktok' },
    { id: 'cooperVideoCount', label: '合作视频数', tooltip: '按视频发布时间，所选周期内发布的合作带货视频数量', platform: 'tiktok' },
    { id: 'orderVideoCount', label: '出单视频数', tooltip: '按支付成功时间，所选周期内有出单的合作带货视频数量', platform: 'tiktok' },
    { id: 'videoPlayCount', label: '视频播放量', tooltip: '所选时间内合作达人累计视频播放量', platform: 'tiktok' },
    { id: 'videoLikeCount', label: '视频点赞量', tooltip: '所选时间内合作达人累计视频点赞量', platform: 'tiktok' },
    { id: 'videoCommentCount', label: '视频评论数', tooltip: '所选时间内合作达人累计视频评论数', platform: 'tiktok' },
    { id: 'videoShareCount', label: '视频转发数', tooltip: '所选时间内合作达人累计视频转发数', platform: 'tiktok' },
    { id: 'videoCollectCount', label: '视频收藏数', tooltip: '所选时间内合作达人累计视频收藏数', platform: 'tiktok' }
  ]},
  { name: '达人指标', options: [
    { id: 'followTalentCount', label: '跟进达人数', tooltip: '按跟进时间，所选周期内新跟进的达人数' },
    { id: 'contactTalentCount', label: '建联达人数', tooltip: '按确认建联时间，所选周期内建联成功的达人数' },
    { id: 'sampleTalentCount', label: '寄样达人数', tooltip: '按发货时间，所选周期内发货成功的达人数' },
    { id: 'firstSampleTalentCount', label: '首次寄样达人数', tooltip: '首次给达人发货时间在所选周期内且发货成功的达人数' },
    { id: 'signTalentCount', label: '签收达人数', tooltip: '按样品签收时间，所选周期内已签收样品的达人数' },
    { id: 'deliverTalentCount', label: '交付达人数', tooltip: '按达人交付时间，有完成带货合作交付的达人数', platform: 'tiktok' },
    { id: 'liveTalentCount', label: '直播达人数', tooltip: '按达人开播时间，所选周期内有开播的达人数', platform: 'tiktok' },
    { id: 'videoTalentCount', label: '视频达人数', tooltip: '按视频发布时间，所选周期内有发布带货视频的达人数', platform: 'tiktok' },
    { id: 'orderTalentCount', label: '出单达人数', tooltip: '按支付成功时间，所选周期内有出单的达人数' },
    { id: 'firstOrderTalentCount', label: '首次出单达人数', tooltip: '按支付成功时间，所选周期内首次出单的达人数' },
    { id: 'deepCooperTalentCount', label: '深度合作达人数', tooltip: '按支付成功时间，成交金额达到指定阈值的达人数' },
    { id: 'contactSampleRate', label: '建联-寄样成功率', tooltip: '按确认建联时间，建联成功的达人中寄样成功的达人占比' }
  ]},
  { name: '寄样指标', options: [
    { id: 'sampleApplyCount', label: '寄样申请数', tooltip: '按样品申请时间，所选周期内提交样品审核的样品单数量' },
    { id: 'sampleDeliverCount', label: '寄样发货次数', tooltip: '按样品发货时间，所选周期内发货成功的样品单数量' },
    { id: 'deliverSampleCount', label: '发货样品件数', tooltip: '按样品发货时间，发货成功的样品件数' },
    { id: 'signSampleCount', label: '签收样品数', tooltip: '按样品签收时间，所选周期内签收成功的样品单数量' },
    { id: 'signOrderRate', label: '签收出单率', tooltip: '有出单的样品数/签收样品数' },
    { id: 'signDeliverRate', label: '签收交付率', tooltip: '完成合作交付的样品数/签收样品数' },
    { id: 'sampleCost', label: '寄样成本', tooltip: '按样品发货时间，发货成功的样品总金额' }
  ]},
  { name: '提成指标', options: [
    { id: 'commissionBase', label: '提成基数', tooltip: '所选时间内付款的收货订单去佣金额之和（次日更新）' },
    { id: 'employeeCommission', label: '员工提成', tooltip: '提成基数×员工提成比例（次日更新）' },
    { id: 'manageCommission', label: '管理提成', tooltip: '部门提成基数×管理提成比例（次日更新）' }
  ]}
]

const defaultStatKpiIds = ['amount', 'orderCount', 'settleAmount', 'estimatedCommission', 'refundAmount', 'orderTalentCount', 'contactTalentCount', 'sampleTalentCount', 'sampleApplyCount', 'sampleCost', 'commissionBase']
const userSavedStatConfigIds = ref(JSON.parse(localStorage.getItem('DOHOZZ_STAT_KPI_CONFIG')) || [...defaultStatKpiIds])
const tempStatSelectedIds = ref([])
const tempStatSelectedItems = ref([])

const onStatConfigOpen = () => {
  tempStatSelectedIds.value = [...userSavedStatConfigIds.value]
  syncTempStatItemsFromIds()
}

const syncTempStatItemsFromIds = () => {
  const allItems = statMetricGroups.flatMap(g => g.options)
  tempStatSelectedItems.value = tempStatSelectedIds.value.map(id => allItems.find(item => item.id === id)).filter(Boolean)
}

const handleStatCheckChange = (isChecked, opt) => {
  if (isChecked) {
    if (tempStatSelectedIds.value.length >= 15) {
      ElMessage.warning('最多选择 15 个指标')
      tempStatSelectedIds.value = tempStatSelectedIds.value.filter(x => x !== opt.id)
      return
    }
    tempStatSelectedItems.value.push(opt)
  } else {
    if (tempStatSelectedIds.value.length <= 3) {
      ElMessage.warning('最少选择 3 个指标')
      tempStatSelectedIds.value.push(opt.id)
      return
    }
    tempStatSelectedItems.value = tempStatSelectedItems.value.filter(x => x.id !== opt.id)
  }
}

const removeStatSelected = (id) => {
  if (tempStatSelectedIds.value.length <= 3) {
    ElMessage.warning('最少选择 3 个指标')
    return
  }
  tempStatSelectedIds.value = tempStatSelectedIds.value.filter(x => x !== id)
  tempStatSelectedItems.value = tempStatSelectedItems.value.filter(x => x.id !== id)
}

let statDraggedIndex = ref(-1)

const onStatDragStart = (idx) => { statDraggedIndex.value = idx }
const onStatDrop = (idx) => {
  if (statDraggedIndex.value === -1 || statDraggedIndex.value === idx) return
  const list = tempStatSelectedItems.value
  const item = list.splice(statDraggedIndex.value, 1)[0]
  list.splice(idx, 0, item)
  tempStatSelectedIds.value = list.map(x => x.id)
  statDraggedIndex.value = -1
}

const confirmStatRestore = () => {
  ElMessageBox.confirm('确定恢复默认配置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    tempStatSelectedIds.value = [...defaultStatKpiIds]
    syncTempStatItemsFromIds()
  }).catch(() => {})
}

const saveStatConfig = () => {
  if (tempStatSelectedIds.value.length < 3) { ElMessage.warning('最少选择 3 个指标'); return }
  if (tempStatSelectedIds.value.length > 15) { ElMessage.warning('最多选择 15 个指标'); return }

  userSavedStatConfigIds.value = [...tempStatSelectedIds.value]
  localStorage.setItem('DOHOZZ_STAT_KPI_CONFIG', JSON.stringify(userSavedStatConfigIds.value))

  showStatConfig.value = false
  ElMessage.success('保存成功')
}

const handleStatConfig = () => {
  if (currentStatTab.value !== 'custom') {
    ElMessage.info('非自定义指标不支持配置')
    return
  }
  showStatConfig.value = true
}

// ==================== 区域F：导出 ====================
const exportFields = ref([])
const exportFieldOptions = [
  { key: 'name', label: 'BD名称' },
  { key: 'dept', label: '所属部门' },
  { key: 'tenure', label: '工龄（天）' },
  { key: 'amount', label: '成交金额' },
  { key: 'orderCount', label: '成交订单数' },
  { key: 'settleAmount', label: '结算金额' },
  { key: 'commission', label: '预估达人佣金' }
]

const handleExport = () => {
  // 默认勾选当前配置字段
  exportFields.value = userSavedStatConfigIds.value.slice(0, 5)
  showExportDialog.value = true
}

const confirmExport = () => {
  if (exportFields.value.length === 0) {
    ElMessage.warning('请勾选导出的字段')
    return
  }
  ElMessage.success('导出任务已提交，请在「任务中心-下载任务」中查看')
  showExportDialog.value = false
}
</script>

<style lang="scss" scoped>
$primary: #1677ff;
$primary-text: #050505;
$secondary-text: #65676B;
$text-1: #050505;
$text-2: #65676B;
$text-3: #94a3b8;
$border: #e8e8e8;
$bg: #f7f8fa;
$white: #ffffff;
$border-radius-sm: 4px;
$border-radius-md: 8px;
$border-radius-lg: 12px;
$radius: 8px;
$fast: 150ms ease;
$meta-blue: #0064E0;
$success-green: #31A24C;
$error-red: #E41E3F;
$warning-amber: #F7B928;

.performance-page { background: $bg; min-height: calc(100vh - 48px); padding: 16px 0 24px; }

// ===== 区域A =====
.filter-area { margin: 0; }
.platform-tabs-bar {
  background: $white;
  border: none;
  border-bottom: none;
  border-radius: $radius $radius 0 0;
  padding: 0 16px;
}
.platform-tabs { display: flex; gap: 24px; }
.platform-tab {
  display: flex; align-items: center; gap: 8px; padding: 12px 0;
  color: $secondary-text; cursor: pointer; border-bottom: 2px solid transparent;
  transition: all $fast; position: relative; top: 1px;
  .platform-icon { display: flex; align-items: center; }
  &:hover { color: $primary-text; }
  &.active { color: $primary; font-weight: 500; border-bottom-color: $primary; }
}
.filter-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border: none;
  border-top: none;
  border-radius: 0 0 $radius $radius;
  background: $white;
  transition: box-shadow 0.3s ease, border-radius 0.3s ease;
}
.sticky-filter-bar {
  position: sticky;
  top: 48px;
  z-index: 90;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.filter-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.filter-item { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.filter-label { font-size: 13px; color: $text-1; font-weight: 500; white-space: nowrap; }
.filter-select { width: 200px; }
.filter-item.date-filter { display: flex; align-items: center; gap: 8px; margin-left: auto; }
.date-quick-btns { display: flex; gap: 4px; }
.quick-btn {
  padding: 4px 12px; font-size: 13px; border-radius: 4px; cursor: pointer; color: $text-2; background: $bg; border: 1px solid transparent; transition: all $fast;
  &:hover { color: $primary; }
  &.active { background: #e6f4ff; color: $primary; border-color: #91caff; }
}
.date-range-picker { :deep(.el-input__wrapper) { height: 28px; } }

// ===== 通用 Section =====
.section-block { background: $white; border-radius: $border-radius-lg; padding: 16px; margin: 16px 0 0; border: none; }
.section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.head-left { display: flex; align-items: center; gap: 12px; }
.section-title { font-size: 14px; font-weight: 600; color: $primary-text; }
.date-range-text { font-size: 12px; color: $secondary-text; }
.update-time { font-size: 12px; color: $secondary-text; }
.help-icon {
  display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px;
  border-radius: 50%; background: #f0f0f0; color: $text-3; font-size: 10px; cursor: help; margin-left: 4px; font-weight: 600;
}

// ===== 区域B：KPI =====
.kpi-cards-scroll { overflow-x: auto; margin: 0 -4px; padding-bottom: 4px; }
.kpi-cards { display: flex; gap: 12px; min-width: max-content; }
.kpi-card {
  min-width: 155px; padding: 14px 16px; background: $bg; border-radius: 8px;
  border: 2px solid transparent; cursor: pointer; transition: all 0.2s;
  &:hover { border-color: #d6e4ff; }
  &.selected { border-color: $primary; background: #f0f7ff; }
}
.kpi-label { font-size: 12px; color: $text-2; margin-bottom: 6px; display: flex; align-items: center; }
.kpi-value { font-size: 22px; font-weight: 700; color: $text-1; margin-bottom: 4px; }
.kpi-trend { font-size: 12px; }
.trend-up { color: $success-green; }
.trend-down { color: $error-red; }
.trend-flat { color: $text-3; }

// ===== 区域C：绩效分析 =====
.performance-analysis-content { display: flex; gap: 16px; }
.bubble-chart-section { flex: 1; min-width: 0; }
.bubble-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.indicator-selector { display: flex; align-items: center; gap: 8px; }
.selector-label { font-size: 13px; color: $text-2; }
.indicator-select { width: 180px; }
.bubble-tools { display: flex; gap: 8px; }

.bubble-chart-container {
  height: 320px; background: $bg; border-radius: 8px; position: relative; overflow: hidden;
}
.bubble-chart { position: relative; width: 100%; height: 100%; }
.bubble-y-axis {
  position: absolute; left: 50px; top: 0; bottom: 30px; width: 1px;
  background: linear-gradient(to top, transparent, $border);
  &::before { content: ''; position: absolute; left: -4px; top: 0; width: 8px; height: 8px; border-left: 1px solid $text-3; border-top: 1px solid $text-3; }
}
.bubble-y-axis .axis-label, .bubble-x-axis .axis-label {
  position: absolute; font-size: 11px; color: $text-3;
}
.bubble-y-axis .axis-label { top: 50%; left: -30px; transform: rotate(-90deg) translateX(-50%); transform-origin: left center; }
.bubble-x-axis {
  position: absolute; left: 50px; right: 10px; bottom: 30px; height: 1px;
  background: linear-gradient(to right, $border, transparent);
  .axis-label { position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); }
}

.bubble {
  position: absolute; border-radius: 50%; background: rgba($primary, 0.6);
  transform: translate(-50%, -50%); cursor: pointer; transition: all 0.3s;
  &:hover { background: rgba($primary, 0.8); transform: translate(-50%, -50%) scale(1.1); }
  .bubble-inner { width: 100%; height: 100%; border-radius: 50%; }
}

.bubble-tooltip { padding: 8px; }
.tooltip-name { font-weight: 600; color: $text-1; margin-bottom: 4px; }
.tooltip-dept { font-size: 12px; color: $text-3; margin-bottom: 8px; }
.tooltip-value { font-size: 16px; font-weight: 700; color: $primary; margin-bottom: 4px; }
.tooltip-trend { font-size: 12px; &.trend-up { color: $success-green; } &.trend-down { color: $error-red; } }

.top10-section { width: 280px; flex-shrink: 0; }
.top10-title { font-size: 13px; font-weight: 600; color: $text-1; margin-bottom: 12px; }
.top10-list { display: flex; flex-direction: column; gap: 8px; }
.top10-item { display: flex; align-items: center; gap: 8px; padding: 8px; background: $bg; border-radius: 6px; }
.top10-rank {
  width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;
  border-radius: 50%; font-size: 11px; font-weight: 600; color: $text-2; background: #e8e8e8;
  &.gold { background: linear-gradient(135deg, #ffd700, #ffb800); color: #fff; }
}
.top10-avatar { background: $primary; color: #fff; font-size: 10px; }
.top10-name { flex: 1; font-size: 13px; color: $text-1; }
.top10-value { font-size: 13px; font-weight: 600; color: $text-1; }
.top10-trend { font-size: 12px; &.trend-up { color: $success-green; } &.trend-down { color: $error-red; } }

// ===== 区域D：绩效统计 =====
.toolbar-actions { display: flex; align-items: center; gap: 12px; }
.tab-toggle { display: flex; border: none; border-radius: 4px; overflow: hidden; }
.toggle-btn {
  padding: 4px 14px; font-size: 13px; cursor: pointer; color: $text-2; background: #fff;
  border-right: 1px solid $border; transition: all $fast;
  &:last-child { border-right: none; }
  &.active { background: $primary; color: #fff; }
}

.data-table-wrapper { overflow-x: auto; }
.data-table {
  width: 100%; border-collapse: collapse; font-size: 13px;
  th {
    text-align: left; padding: 10px 12px; background: $bg; color: $text-2; font-weight: 500;
    border-bottom: 1px solid $border; white-space: nowrap;
    &.sortable { cursor: pointer; user-select: none; &:hover { color: $primary; } }
    &.fixed { position: sticky; left: 0; background: $bg; z-index: 1; }
  }
  td {
    padding: 12px; border-bottom: 1px solid #f5f5f5; color: $text-1;
    &.fixed { position: sticky; left: 0; background: #fff; z-index: 1; }
  }
  tr:hover td { background: #fafbfc; }
  tr:hover td.fixed { background: #fafbfc; }
}
.bd-cell { display: flex; align-items: center; gap: 8px; cursor: pointer; &:hover .bd-name { color: $primary; } }
.bd-avatar { background: $primary; color: #fff; font-size: 10px; }
.bd-name { font-size: 13px; color: $text-1; transition: color $fast; }
.amount-cell { font-weight: 600; }
.sort-arrows { font-size: 11px; color: $text-3; margin-left: 2px; }

.pagination-bar { display: flex; align-items: center; justify-content: flex-end; margin-top: 16px; flex-wrap: wrap; gap: 12px; }
.page-info { font-size: 12px; color: $text-3; }
.page-controls { display: flex; align-items: center; gap: 12px; }
.page-size-select { width: 100px; }
.page-btns { display: flex; gap: 4px; }
.page-btn {
  min-width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
  border: none; border-radius: 4px; background: #fff; cursor: pointer; font-size: 12px; color: $text-2; transition: all $fast;
  &:hover { border-color: $primary; color: $primary; }
  &.active { background: $primary; border-color: $primary; color: #fff; }
}
.page-jump { display: flex; align-items: center; gap: 8px; font-size: 12px; color: $text-2; }
.page-input {
  width: 48px; height: 28px; border: none; border-radius: 4px; text-align: center; outline: none;
  &:focus { border-color: $primary; }
}

// ===== 弹窗样式 =====
.config-tip {
  font-size: 13px; color: $text-2; margin-bottom: 16px; padding: 10px 16px;
  background: #e6f4ff; border: none; border-radius: 4px;
  span { font-weight: 700; color: $primary; }
}
.config-cols { display: flex; gap: 20px; align-items: flex-start; }
.config-left { flex: 1; min-width: 0; max-height: 480px; overflow-y: auto; padding-right: 12px; }
.metric-group { margin-bottom: 20px; }
.metric-group-title { font-size: 13px; font-weight: 600; color: $text-1; margin-bottom: 10px; }
.metric-group-opts { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;
  :deep(.el-checkbox) { margin-right: 0; height: auto; display: flex; align-items: flex-start;
    .el-checkbox__label { font-size: 13px; color: $text-1; white-space: normal; padding-left: 6px; }
  }
}
.config-right { width: 240px; border: none; border-radius: 4px; display: flex; flex-direction: column; max-height: 480px; }
.right-header { padding: 12px; background: #fafafa; border-bottom: 1px solid $border; font-size: 13px; font-weight: 600; color: $text-1; }
.selected-list { flex: 1; overflow-y: auto; padding: 8px; }
.selected-item {
  display: flex; align-items: center; justify-content: space-between; padding: 8px 12px;
  background: #fff; border: none; margin-bottom: 8px; border-radius: 4px;
  cursor: grab; font-size: 13px; color: $text-1; transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.08); .delete-icon svg { fill: $error-red; } }
  &:active { cursor: grabbing; }
}
.item-inner { display: flex; align-items: center; gap: 8px; }
.drag-handle { cursor: grab; }
.delete-icon { cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 2px; }

// 导出弹窗
.export-content { padding: 16px 0; }
.export-time { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
.export-label { font-size: 13px; color: $text-2; }
.export-value { font-size: 13px; color: $text-1; font-weight: 500; }
.export-fields { }
.export-fields-title { font-size: 13px; color: $text-2; margin-bottom: 12px; }
:deep(.el-checkbox-group) { display: flex; flex-wrap: wrap; gap: 12px; }
:deep(.el-checkbox) { margin-right: 0; }

// BD详情提示
.bd-detail-tip { text-align: center; padding: 24px 0; p { font-size: 14px; color: $text-2; } }

// 响应式
@media (max-width: 1200px) {
  .performance-analysis-content { flex-direction: column; }
  .top10-section { width: 100%; }
}
</style>
