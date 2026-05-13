<template>
  <div class="data-overview">
    <!-- ==================== 区域A：全局筛选工具栏 ==================== -->
    <div class="filter-area">
      <!-- 平台Tab -->
      <div class="platform-tabs-bar">
        <div class="platform-tabs">
          <div
            v-for="platform in platformTabs"
            :key="platform.id"
            class="platform-tab"
            :class="{ active: filters.platform === platform.id }"
            @click="filters.platform = platform.id"
          >
            <div class="platform-icon tiktok-icon" v-if="platform.id === 'tiktok'">
              <img src="@/assets/images/TikTok.png" alt="TikTok" />
            </div>
            <div class="platform-icon instagram-icon" v-else-if="platform.id === 'instagram'">
              <img src="@/assets/images/Instagram.png" alt="Instagram" />
            </div>
            <div class="platform-icon shopee-icon" v-else-if="platform.id === 'shopee'">
              <img src="@/assets/images/Shopee.png" alt="Shopee" />
            </div>
            <div class="platform-icon lazada-icon" v-else-if="platform.id === 'lazada'">
              <img src="@/assets/images/Lazada.png" alt="Lazada" />
            </div>
            <div class="platform-icon all-icon" v-else>
              <IconAllPlatform />
            </div>
            <span>{{ platform.name }}</span>
          </div>
        </div>
      </div>
      <!-- 筛选条件区块 -->
      <div class="filter-toolbar" ref="filterToolbarRef">
        <div class="filter-row">
          <div class="filter-item">
            <span class="filter-label">店铺筛选</span>
            <el-select v-model="filters.store" placeholder="全部店铺" filterable clearable size="small" class="filter-select">
              <el-option label="全部店铺" value="" />
              <el-option label="XXX旗舰店1" value="store1" />
              <el-option label="XXX旗舰店2" value="store2" />
              <el-option label="XXX旗舰店3" value="store3" />
            </el-select>
          </div>
          <div class="filter-item">
            <span class="filter-label">部门筛选</span>
            <el-select v-model="filters.department" placeholder="全部部门" filterable clearable size="small" class="filter-select">
              <el-option label="全部部门" value="" />
              <el-option label="销售一部" value="dept1" />
              <el-option label="销售二部" value="dept2" />
              <el-option label="运营部" value="dept3" />
            </el-select>
          </div>
          <div class="filter-item">
            <span class="filter-label">BD筛选</span>
            <el-select v-model="filters.bd" placeholder="全部BD" filterable clearable size="small" class="filter-select">
              <el-option label="全部BD" value="" />
              <el-option label="张三" value="bd1" />
              <el-option label="李四" value="bd2" />
              <el-option label="王五" value="bd3" />
            </el-select>
          </div>
          <div class="filter-item date-filter">
            <span class="filter-label">时间筛选</span>
            <TimeRangeFilter v-model="timeFilterValue" @change="handleTimeFilterChange" />
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== 区域B：数据大盘区 ==================== -->
    <div class="section-block area-b">
      <div class="section-head">
        <div class="head-left">
          <span class="section-title">数据大盘</span>
          <span class="update-time">数据更新于：2026-04-20 12:00:00</span>
          <el-tooltip content="数据每 1 小时更新一次" placement="top"><span class="help-icon">?</span></el-tooltip>
        </div>
        <el-button size="small" @click="showConfigDialog = true">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="margin-right:4px"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
          配置
        </el-button>
      </div>

      <!-- KPI 指标卡片 -->
      <div class="kpi-cards-scroll">
        <div class="kpi-cards">
          <div v-for="kpi in visibleKpis" :key="kpi.id" class="kpi-card" :class="{ selected: selectedChartKpiIds.includes(kpi.id) }" @click="toggleKpiSelect(kpi.id)">
            <div class="kpi-label">{{ kpi.label }}<el-tooltip :content="kpi.tooltip" placement="top"><span class="help-icon">?</span></el-tooltip></div>
            <div class="kpi-value">{{ kpi.value }}</div>
            <div class="kpi-trend">
              <span class="trend-label">环比</span>
              <span :class="getTrendDisplay(kpi).isUp ? 'trend-up' : 'trend-down'">{{ getTrendDisplay(kpi).arrow }} {{ getTrendDisplay(kpi).value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 折线趋势图 -->
      <div class="trend-chart-area">
        <div ref="trendChartRef" class="trend-chart-echarts"></div>
      </div>
    </div>

    <!-- ==================== 区域C+D：GMV分布 ==================== -->
    <div class="dual-section">
      <!-- 区域C：店铺GMV分布 -->
      <div class="section-block half">
        <div class="section-head"><span class="section-title">店铺 GMV 分布</span></div>
        <div class="gmv-content">
          <div class="donut-wrapper">
            <div ref="storeGmvChartRef" style="width: 180px; height: 180px;"></div>
          </div>
          <div class="gmv-legend-list">
            <div v-for="(s, i) in storeGmvData" :key="i" class="gmv-legend-item">
              <span class="dot" :style="{ background: s.color }"></span>
              <span class="legend-name">{{ s.name }}</span>
              <span class="legend-val">{{ s.amount }}</span>
              <span class="legend-pct">{{ s.pct }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 区域D：载体GMV分布 -->
      <div class="section-block half">
        <div class="section-head"><span class="section-title">载体 GMV 分布</span></div>
        <div class="gmv-content">
          <div class="donut-wrapper">
            <div ref="carrierGmvChartRef" style="width: 180px; height: 180px;"></div>
          </div>
          <div class="gmv-legend-list">
            <div v-for="(c, i) in carrierGmvData" :key="i" class="gmv-legend-item">
              <span class="dot" :style="{ background: c.color }"></span>
              <span class="legend-name">{{ c.name }}</span>
              <span class="legend-val">{{ c.amount }}</span>
              <span class="legend-pct">{{ c.pct }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== 区域E：动销数据区 ==================== -->
    <div class="section-block area-e">
      <div class="section-head">
        <div class="head-left">
          <span class="section-title">动销数据</span>
        </div>
        <el-button size="small" @click="handleExport">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="margin-right:4px"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
          导出
        </el-button>
      </div>
      <!-- 双Tab指标卡 -->
      <div class="sale-tabs">
        <div class="sale-tab-card" :class="{ active: saleTab === 'talent' }" @click="saleTab = 'talent'">
          <div class="tab-label">出单达人数<el-tooltip content="所选时间范围内有通过直播/视频/橱窗出单的达人数" placement="top"><span class="help-icon">?</span></el-tooltip></div>
          <div class="tab-value">8,888</div>
          <div class="tab-trend"><span class="trend-up">↑ 18.5%</span></div>
        </div>
        <div class="sale-tab-card" :class="{ active: saleTab === 'product' }" @click="saleTab = 'product'">
          <div class="tab-label">出单商品数<el-tooltip content="所选时间范围内有支付订单的商品数" placement="top"><span class="help-icon">?</span></el-tooltip></div>
          <div class="tab-value">8,888</div>
          <div class="tab-trend"><span class="trend-up">↑ 11%</span></div>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr v-if="saleTab === 'talent'">
              <th>排名</th><th>平台</th><th>达人</th>
              <th class="sortable" @click="toggleSort('amount')">成交金额 <span class="sort-arrows">{{ sortIcon('amount') }}</span></th>
              <th class="sortable" @click="toggleSort('sales')">销量 <span class="sort-arrows">{{ sortIcon('sales') }}</span></th>
              <th>成交商品(SKU数)</th><th>直播/视频/橱窗</th>
            </tr>
            <tr v-else>
              <th>排名</th><th>平台</th><th>商品信息</th>
              <th class="sortable" @click="toggleSort('amount')">成交金额 <span class="sort-arrows">{{ sortIcon('amount') }}</span></th>
              <th class="sortable" @click="toggleSort('sales')">销量 <span class="sort-arrows">{{ sortIcon('sales') }}</span></th>
              <th>成交达人数</th><th>直播/视频/橱窗</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in saleTablePage" :key="idx">
              <td><span class="rank-badge" :class="{ gold: idx + (salePage-1)*5 < 3 }">{{ idx + 1 + (salePage-1)*5 }}</span></td>
              <td><div class="cell-platform"><svg viewBox="0 0 24 24" width="16" height="16" fill="#333"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg><span>{{ row.platform }}</span></div></td>
              <td v-if="saleTab === 'talent'">
                <div class="cell-talent"><el-avatar :size="28" class="tiny-avatar"/><div><div class="talent-uname">{{ row.username }}</div><div class="talent-name">{{ row.name }}</div></div></div>
              </td>
              <td v-else>
                <div class="cell-product"><div class="product-img-placeholder"></div><div><div class="product-name">{{ row.productName }}</div><div class="product-id">ID：{{ row.productId }}</div></div></div>
              </td>
              <td class="amount-cell">{{ row.amount }}</td>
              <td>{{ row.sales }}</td>
              <td>{{ row.skuOrTalent }}</td>
              <td class="ratio-cell">{{ row.ratio }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination-bar">
        <SimplePagination
          v-model="salePagination"
          :total="saleTableData.length"
          @change="handleSalePageChange"
        />
      </div>
    </div>

    <!-- ==================== 区域F：寄样概况区 ==================== -->
    <div class="section-block area-f">
      <div class="section-head"><span class="section-title">寄样概况</span></div>
      <div class="sample-kpi-row">
        <div v-for="(sk, i) in sampleKpis" :key="i" class="sample-kpi-card">
          <div class="sk-label">{{ sk.label }}<el-tooltip :content="sk.tooltip" placement="top"><span class="help-icon">?</span></el-tooltip></div>
          <div class="sk-value">{{ sk.value }}</div>
          <div class="sk-trend" v-if="sk.trend"><span :class="sk.trendClass">{{ sk.trend }}</span></div>
        </div>
      </div>
      <div class="dual-section inner">
        <!-- 样品数据趋势图 -->
        <div class="chart-box">
          <div class="chart-box-title">样品数据趋势</div>
          <div ref="sampleChartRef" class="bar-line-chart"></div>
        </div>
        <!-- 寄样TOP10 -->
        <div class="chart-box">
          <div class="chart-box-title">寄样 TOP10</div>
          <div class="top10-list">
            <div v-for="(t, i) in sampleTop10" :key="i" class="top10-row">
              <span class="top10-rank" :class="{ gold: i < 3 }">{{ i + 1 }}</span>
              <span class="top10-name">{{ t.name }}</span>
              <div class="top10-bar-bg"><div class="top10-bar-fill" :style="{ width: t.pct + '%' }"></div></div>
              <span class="top10-val">{{ t.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== 区域G+H：合作漏斗 + 寄样漏斗 ==================== -->
    <div class="dual-section">
      <!-- 区域G：合作漏斗 -->
      <div class="section-block half">
        <div class="section-head"><span class="section-title">合作漏斗</span></div>
        <div class="funnel-visual">
          <div v-for="(f, i) in cooperationFunnel" :key="i" class="funnel-step">
            <el-tooltip :content="f.tooltip" placement="right">
              <div class="funnel-layer" :style="{ width: f.widthPct + '%', background: f.color }">
                <span class="funnel-layer-label">{{ f.label }}</span>
                <span class="funnel-layer-value">{{ f.value }}</span>
              </div>
            </el-tooltip>
            <div class="funnel-rate" v-if="f.rate">
              <span class="rate-line"></span>
              <span class="rate-text">{{ f.rateName }} {{ f.rate }}</span>
            </div>
          </div>
        </div>
        <div class="funnel-footer-text">
          成交金额达到 <strong>¥{{ deepCoopThreshold.toLocaleString() }}</strong> 的达人为深度合作达人
          <span class="link-text" @click="showDeepCoopDialog = true">设置</span>
        </div>
      </div>

      <!-- 区域H：寄样漏斗 -->
      <div class="section-block half">
        <div class="section-head"><span class="section-title">寄样漏斗</span></div>
        <div class="funnel-visual">
          <div v-for="(f, i) in sampleFunnel" :key="i" class="funnel-step">
            <el-tooltip :content="f.tooltip" placement="right">
              <div class="funnel-layer" :style="{ width: f.widthPct + '%', background: f.color }">
                <span class="funnel-layer-label">{{ f.label }}</span>
                <span class="funnel-layer-value">{{ f.value }}</span>
              </div>
            </el-tooltip>
            <div class="funnel-rate" v-if="f.rate">
              <span class="rate-line"></span>
              <span class="rate-text">{{ f.rateName }} {{ f.rate }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== 区域I：排行榜区 ==================== -->
    <div class="section-block area-i">
      <div class="section-head">
        <div class="head-left">
          <span class="section-title">排行榜</span>
        </div>
        <div class="tab-toggle">
          <span class="toggle-btn" :class="{ active: rankTab === 'bd' }" @click="rankTab = 'bd'; rankPage = 1">BD</span>
          <span class="toggle-btn" :class="{ active: rankTab === 'sample' }" @click="rankTab = 'sample'; rankPage = 1">样品</span>
        </div>
      </div>
      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr v-if="rankTab === 'bd'">
              <th>排名</th><th>BD</th><th>占比</th>
              <th class="sortable" @click="toggleRankSort('amount')">成交金额 <span class="sort-arrows">{{ rankSortIcon('amount') }}</span></th>
              <th>出单达人数</th>
            </tr>
            <tr v-else>
              <th>排名</th><th>平台</th><th>商品信息</th><th>占比</th>
              <th class="sortable" @click="toggleRankSort('sampleCount')">申样数 <span class="sort-arrows">{{ rankSortIcon('sampleCount') }}</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, idx) in rankTablePage" :key="idx">
              <td><span class="rank-badge" :class="{ gold: idx + (rankPage-1)*10 < 3 }">{{ idx + 1 + (rankPage-1)*10 }}</span></td>
              <template v-if="rankTab === 'bd'">
                <td><div class="cell-talent"><el-avatar :size="24" class="tiny-avatar"/><span>{{ r.name }}</span></div></td>
                <td>{{ r.pct }}</td>
                <td class="amount-cell">{{ r.amount }}</td>
                <td>{{ r.talentCount }}</td>
              </template>
              <template v-else>
                <td><div class="cell-platform"><svg viewBox="0 0 24 24" width="16" height="16" fill="#333"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg><span>{{ r.platform }}</span></div></td>
                <td><div class="cell-product"><div class="product-img-placeholder small"></div><div><div class="product-name">{{ r.productName }}</div><div class="product-id">ID：{{ r.productId }}</div></div></div></td>
                <td>{{ r.pct }}</td>
                <td>{{ r.sampleCount }}</td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination-bar">
        <SimplePagination
          v-model="rankPagination"
          :total="currentRankData.length"
          @change="handleRankPageChange"
        />
      </div>
    </div>

    <!-- ==================== 深度合作设置弹窗 ==================== -->
    <el-dialog v-model="showDeepCoopDialog" title="深度合作设置" width="420px" :close-on-click-modal="false">
      <div class="deep-coop-form">
        <span>* 顺利出单且成交金额达到</span>
        <el-input-number v-model="deepCoopInput" :min="100" :max="100000" :precision="2" :step="100" size="small" style="width:160px;margin:0 8px"/>
        <span>元</span>
      </div>
      <template #footer>
        <el-button @click="showDeepCoopDialog = false">取消</el-button>
        <el-button type="primary" @click="saveDeepCoop">确定</el-button>
      </template>
    </el-dialog>

    <!-- ==================== 导出确认弹窗 ==================== -->
    <el-dialog v-model="showExportDialog" title="导出提示" width="420px">
      <p>本次将导出所选时间范围内的所有数据，导出结果可以在「任务中心-下载任务」中查看和下载。</p>
      <template #footer>
        <el-button @click="showExportDialog = false">取消</el-button>
        <el-button type="warning" @click="confirmExport">确认导出</el-button>
      </template>
    </el-dialog>

    <!-- ==================== 自定义表格字段抽屉 ==================== -->
    <el-drawer v-model="showConfigDialog" direction="rtl" size="1200px" :close-on-click-modal="false" @open="onConfigDialogOpen">
      <template #header>
        <div class="drawer-header">
          <div class="header-title">自定义表格字段</div>
          <div class="header-tip">指标最少选择 3 个，最多选择 12 个，已选择 <span>{{ tempSelectedIds.length }}</span> 个</div>
        </div>
      </template>
      <div class="drawer-content">
        <div class="panel-left">
          <div class="config-left">
            <div v-for="group in metricGroups" :key="group.name" class="metric-group">
              <div class="metric-group-title">{{ group.name }}</div>
              <div class="metric-group-items">
                 <el-checkbox v-for="opt in group.options" :key="opt.id" :model-value="tempSelectedIds.includes(opt.id)" :disabled="isOptionDisabled(opt.id)" @change="(val) => handleCheckboxChange(val, opt)">
                   <el-tooltip :content="opt.tooltip" placement="top"><span>{{ opt.label }}</span></el-tooltip>
                 </el-checkbox>
              </div>
            </div>
          </div>
        </div>
        <div class="panel-right">
          <div class="config-right">
            <div class="right-header"><span>已选 ({{ tempSelectedIds.length }})</span><span class="header-tip-text">长按可拖动调整展示排序</span></div>
            <div class="selected-list">
              <div v-for="(item, idx) in tempSelectedItems" :key="item.id"
                   class="selected-item"
                   :class="{
                     'is-dragging': showInsertIndicator && dragOverIndex === idx && dragOverIndex !== draggedIndex,
                     'is-being-dragged': showInsertIndicator && draggedIndex === idx
                   }"
                   draggable="true"
                   @dragstart="onDragStart(idx)"
                   @dragover.prevent="onDragOver(idx)"
                   @dragleave="onDragLeave"
                   @drop="onDrop(idx)"
                   @dragend="onDragEnd(idx)">
                <div class="item-inner">
                  <svg class="drag-handle" viewBox="0 0 24 24" width="16" height="16" fill="#bfbfbf"><path d="M10 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-8 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-8 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/></svg>
                  <span>{{ item.label }}</span>
                </div>
                <span class="delete-icon" @click="removeSelected(item.id)">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="#999"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="drawer-footer">
          <el-button type="info" plain @click="confirmRestoreDefault">恢复默认</el-button>
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
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElAvatar, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'
import IconAllPlatform from '@/components/icons/IconAllPlatform.vue'
import SimplePagination from '@/components/SimplePagination.vue'
import TimeRangeFilter from '@/components/TimeRangeFilter.vue'

// ===== 区域A：筛选 =====
const filterToolbarRef = ref(null)
const filters = reactive({
  store: '', department: '', bd: '',
  platform: 'all'
})
const timeFilterValue = ref({
  quickTime: 'today',
  week: '',
  month: '',
  customStart: '',
  customEnd: ''
})
const handleTimeFilterChange = (val) => {
  console.log('时间筛选变化:', val)
}
const platformTabs = [
  { id: 'all', name: '全部' },
  { id: 'tiktok', name: 'TikTok' },
  { id: 'instagram', name: 'Instagram' },
  { id: 'shopee', name: 'Shopee' },
  { id: 'lazada', name: 'Lazada' },
]

// ===== 区域B：数据大盘 =====
const allKpiDataMap = {
  '1': { id: '1', label: '店铺总成交金额', value: '¥132.32w', trend: '16%', trendDir: 'up', tooltip: '按支付成功时间，所选周期内支付成功的买家实付金额汇总（含退款）' },
  '7': { id: '7', label: '达人成交金额', value: '¥78.12w', trend: '22%', trendDir: 'up', tooltip: '按支付成功时间，含退款金额，只含达人订单' },
  '8': { id: '8', label: '达人实际成交金额', value: '¥72.08w', trend: '18%', trendDir: 'up', tooltip: '按支付成功时间，剔除退款，不含团长订单' },
  '9': { id: '9', label: '达人合作销量', value: '880', trend: '10%', trendDir: 'up', tooltip: '按支付成功时间，含退款订单，所有支付成功的订单销量' },
  '10': { id: '10', label: '达人退款金额', value: '¥3.50w', trend: '1.5%', trendDir: 'flat', tooltip: '按支付成功时间，支付后已退款成功的金额，不含团长订单' },
  '11': { id: '11', label: '团长成交金额', value: '¥20.44w', trend: '5%', trendDir: 'up', tooltip: '按支付成功时间，含退款金额，只含团长订单' },
  '12': { id: '12', label: '团长实际成交金额', value: '¥18.27w', trend: '4%', trendDir: 'up', tooltip: '按支付成功时间，剔除退款，只含团长订单' },
  '13': { id: '13', label: '团长成交金额（未归属）', value: '¥5.00w', trend: '1%', trendDir: 'up', tooltip: '团长总成交金额，含未归属数据' },
  '14': { id: '14', label: '团长退款金额', value: '¥1.60w', trend: '-0.5%', trendDir: 'down', tooltip: '按支付成功时间，退款成功金额，需员工跟进后统计' },
  '15': { id: '15', label: '团长合作销量', value: '320', trend: '3%', trendDir: 'up', tooltip: '按支付成功时间，团长订单支付成功销量（含退款），需员工跟进后统计' },
  '16': { id: '16', label: '寄样数', value: '456', trend: '7.2%', trendDir: 'up', tooltip: '按样品发货时间，所选周期内发货成功的样品单数量' },
  '17': { id: '17', label: '跟进达人数', value: '1,280', trend: '3.1%', trendDir: 'up', tooltip: '按跟进时间，所选周期内新跟进的达人数' },
  '18': { id: '18', label: '寄样达人数', value: '198', trend: '-2.8%', trendDir: 'down', tooltip: '按发货时间，所选周期内发货成功的达人数' },
  '19': { id: '19', label: '店铺总退款金额', value: '¥8.20w', trend: '2.1%', trendDir: 'up', tooltip: '根据【支付成功时间】来判定，代表在所选周期内支付、且已退款成功的订单金额汇总。举例：某客户1月15日下单并支付成功，2月1日退款成功；那么这笔退款金额算入1月的【成交-退款金额】，不算入2月里' },
  '20': { id: '20', label: '达播实际成交金额', value: '¥95.50w', trend: '15%', trendDir: 'up', tooltip: '根据【支付成功时间】来判定，在所选周期内支付成功的买家实付金额汇总（剔除退款金额），包含达人订单和团长订单' },
  '21': { id: '21', label: '达播成交金额', value: '¥105.32w', trend: '17%', trendDir: 'up', tooltip: '根据【支付成功时间】来判定，在所选周期内支付成功的买家实付金额汇总（包含退款金额），包含达人订单和团长订单' },
  '22': { id: '22', label: '达播成交订单量', value: '12,580', trend: '8.5%', trendDir: 'up', tooltip: '根据【支付成功时间】来判定，在所选周期内支付成功的买家订单量汇总（包含退款订单），包含达人订单和团长订单' },
  '23': { id: '23', label: '达播退款金额', value: '¥6.80w', trend: '3.2%', trendDir: 'up', tooltip: '根据【支付成功时间】来判定，代表在所选周期内支付、且已退款成功的订单金额汇总，包含达人订单和团长订单。举例：某客户1月15日下单并支付成功，2月1日退款成功；那么这笔退款金额算入1月的【成交-退款金额】，不算入2月里' },
  '24': { id: '24', label: '计佣金额', value: '¥98.75w', trend: '14%', trendDir: 'up', tooltip: '根据【下单时间】来判定，买家实付金额+平台/达人补贴-运费，即在所选周期内会用于达人佣金/团长服务费计算的金额汇总（包含退款金额）；包含达人订单和团长订单' },
  '25': { id: '25', label: '计佣金额-去退', value: '¥91.20w', trend: '13%', trendDir: 'up', tooltip: '根据【下单时间】来判定，买家实付金额+平台/达人补贴-运费，即在所选周期内会用于达人佣金/团长服务费计算的金额汇总（剔除退款金额）；包含达人订单和团长订单' }
}

const metricGroups = [
  { name: '总成交数据', options: [ allKpiDataMap['1'], allKpiDataMap['19'], allKpiDataMap['20'], allKpiDataMap['21'], allKpiDataMap['22'], allKpiDataMap['23'], allKpiDataMap['24'], allKpiDataMap['25'] ] },
  { name: '达人成交数据', options: [ allKpiDataMap['7'], allKpiDataMap['8'], allKpiDataMap['9'], allKpiDataMap['10'] ] },
  { name: '团长成交数据', options: [ allKpiDataMap['11'], allKpiDataMap['12'], allKpiDataMap['13'], allKpiDataMap['14'], allKpiDataMap['15'] ] },
  { name: '达人跟进数据', options: [ allKpiDataMap['17'], allKpiDataMap['18'], allKpiDataMap['16'] ] }
]

const defaultKpiIds = ['1', '7', '8', '16']
const savedConfig = JSON.parse(localStorage.getItem('DOHOZZ_KPI_CONFIG_v1')) || []
const validConfigIds = savedConfig.filter(id => allKpiDataMap[id])
const userSavedConfigIds = ref(validConfigIds.length > 0 ? validConfigIds : [...defaultKpiIds])
const visibleKpis = computed(() => userSavedConfigIds.value.map(id => allKpiDataMap[id]))

// 默认选中 店铺总成交金额 和 达人成交金额
const selectedChartKpiIds = ref(['1', '7'])

const toggleKpiSelect = (id) => {
  const arr = selectedChartKpiIds.value
  const pos = arr.indexOf(id)
  if (pos !== -1) {
    if (arr.length <= 1) { return }
    arr.splice(pos, 1)
  } else {
    if (arr.length >= 2) {
      arr.shift()
    }
    arr.push(id)
  }
  updateTrendChart()
}

// 计算趋势显示（箭头和数值）
const getTrendDisplay = (kpi) => {
  const num = parseFloat(kpi.trend)
  if (num >= 0) {
    return { arrow: '↑', value: kpi.trend, isUp: true }
  } else {
    return { arrow: '↓', value: kpi.trend, isUp: false }
  }
}

// ===== 区域C：店铺GMV =====
const circ = 2 * Math.PI * 65
const storeGmvData = reactive([
  { name: 'XXX旗舰店1', amount: '¥66.66w', pct: '50%', color: '#1677ff', ratio: 0.5 },
  { name: 'XXX旗舰店2', amount: '¥40.00w', pct: '30%', color: '#36cfc9', ratio: 0.3 },
  { name: 'XXX旗舰店3', amount: '¥26.66w', pct: '20%', color: '#ffc53d', ratio: 0.2 }
])
const storeGmvArcs = computed(() => {
  let offset = 0
  return storeGmvData.map(s => {
    const len = circ * s.ratio
    const o = { dash: `${len} ${circ - len}`, offset: `-${offset}` }
    offset += len
    return o
  })
})

// ===== 区域D：载体GMV =====
const carrierGmvData = reactive([
  { name: '商品卡', amount: '¥66.66w', pct: '50%', color: '#597ef7' },
  { name: '视频', amount: '¥33.33w', pct: '25%', color: '#73d13d' },
  { name: '直播', amount: '¥33.33w', pct: '25%', color: '#ffc53d' }
])

// ===== ECharts 图表 =====
const storeGmvChartRef = ref(null)
const carrierGmvChartRef = ref(null)
const trendChartRef = ref(null)
const sampleChartRef = ref(null)
let storeGmvChart = null
let carrierGmvChart = null
let trendChart = null
let sampleChart = null

// 初始化店铺GMV图表
const initStoreGmvChart = () => {
  if (storeGmvChartRef.value) {
    storeGmvChart = echarts.init(storeGmvChartRef.value)
    const option = {
      series: [
        {
          type: 'pie',
          radius: ['45%', '70%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 0,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
              formatter: '{b}\n{c}'
            }
          },
          labelLine: {
            show: false
          },
          data: storeGmvData.map(item => ({
            value: parseFloat(item.amount.replace(/[^0-9.]/g, '')),
            name: item.name,
            itemStyle: {
              color: item.color
            }
          }))
        }
      ]
    }
    storeGmvChart.setOption(option)
  }
}

// 初始化载体GMV图表
const initCarrierGmvChart = () => {
  if (carrierGmvChartRef.value) {
    carrierGmvChart = echarts.init(carrierGmvChartRef.value)
    const option = {
      series: [
        {
          type: 'pie',
          radius: ['45%', '70%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 0,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
              formatter: '{b}\n{c}'
            }
          },
          labelLine: {
            show: false
          },
          data: carrierGmvData.map(item => ({
            value: parseFloat(item.amount.replace(/[^0-9.]/g, '')),
            name: item.name,
            itemStyle: {
              color: item.color
            }
          }))
        }
      ]
    }
    carrierGmvChart.setOption(option)
  }
}

// 初始化趋势图
const initTrendChart = () => {
  if (trendChartRef.value) {
    trendChart = echarts.init(trendChartRef.value)
    updateTrendChart()
  }
}

// 更新趋势图数据
const updateTrendChart = () => {
  if (!trendChart) return
  const ids = selectedChartKpiIds.value
  const xData = ['04/13', '04/14', '04/15', '04/16', '04/17', '04/18', '04/19', '04/20']

  // 根据数值生成Y轴刻度
  const generateYAxis = (data) => {
    const max = Math.max(...data.map(d => Math.abs(d)))
    const niceMax = max * 1.2
    return {
      max: niceMax,
      splitNumber: 4,
      axisLabel: { formatter: (v) => v >= 10000 ? (v / 10000).toFixed(1) + 'w' : v }
    }
  }

  const series = ids.map((id, index) => {
    const kpi = allKpiDataMap[id]
    // 根据数值范围生成模拟数据
    const baseValue = parseFloat(kpi.value.replace(/[^0-9.]/g, '')) * (kpi.value.includes('¥') ? 10000 : 1)
    const data = xData.map((_, i) => baseValue * (0.6 + Math.random() * 0.4 + (i * 0.05)))
    const yAxis = generateYAxis(data)

    return {
      name: kpi.label,
      type: 'line',
      yAxisIndex: index,
      xAxisIndex: 0,
      data,
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { width: 2, color: index === 0 ? '#1677ff' : '#36cfc9' },
      itemStyle: { color: index === 0 ? '#1677ff' : '#36cfc9' },
      emphasis: { focus: 'series' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: index === 0 ? 'rgba(22, 119, 255, 0.3)' : 'rgba(54, 207, 201, 0.3)' },
          { offset: 1, color: index === 0 ? 'rgba(22, 119, 255, 0.05)' : 'rgba(54, 207, 201, 0.05)' }
        ])
      }
    }
  })

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: 'rgba(0,0,0,0.75)',
      borderColor: 'transparent',
      textStyle: { color: '#fff', fontSize: 12 }
    },
    legend: {
      show: true,
      bottom: 0,
      icon: 'rect',
      itemWidth: 20,
      itemHeight: 2,
      textStyle: { color: '#666', fontSize: 12 }
    },
    grid: { left: '3%', right: '4%', bottom: '8%', top: '12%', containLabel: true },
    xAxis: {
      type: 'category',
      data: xData,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#e8e8e8' } },
      axisLabel: { color: '#999', fontSize: 10 },
      axisTick: { show: false }
    },
    yAxis: ids.map((id, index) => {
      const kpi = allKpiDataMap[id]
      const baseValue = parseFloat(kpi.value.replace(/[^0-9.]/g, '')) * (kpi.value.includes('¥') ? 10000 : 1)
      const data = xData.map((_, i) => baseValue * (0.6 + Math.random() * 0.4 + (i * 0.05)))
      const yAxis = generateYAxis(data)
      return {
        type: 'value',
        position: index === 0 ? 'left' : 'right',
        show: true,
        ...yAxis,
        axisLine: { show: false },
        axisLabel: { color: '#999', fontSize: 10 },
        splitLine: { lineStyle: { color: '#f5f5f5', type: 'dashed' } }
      }
    }),
    series
  }

  trendChart.setOption(option, { notMerge: true })
  requestAnimationFrame(() => {
    if (trendChartRef.value) {
      trendChart.resize({ width: trendChartRef.value.clientWidth })
    }
  })
}

// 初始化样品趋势图
const initSampleChart = () => {
  if (sampleChartRef.value) {
    sampleChart = echarts.init(sampleChartRef.value)
    const xData = ['04/13', '04/14', '04/15', '04/16', '04/17', '04/18', '04/19']
    const barData = [80, 120, 60, 140, 95, 110, 70]
    const lineData = [65, 80, 55, 95, 75, 85, 70]

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        backgroundColor: 'rgba(0,0,0,0.75)',
        borderColor: 'transparent',
        textStyle: { color: '#fff', fontSize: 12 }
      },
      legend: {
        show: true,
        bottom: 0,
        icon: 'rect',
        itemWidth: 12,
        itemHeight: 2,
        textStyle: { color: '#666', fontSize: 11 }
      },
      grid: { left: 50, right: 20, top: 10, bottom: 40, containLabel: true },
      xAxis: {
        type: 'category',
        data: xData,
        boundaryGap: true,
        axisLine: { lineStyle: { color: '#e8e8e8' } },
        axisLabel: { color: '#999', fontSize: 9 },
        axisTick: { show: false }
      },
      yAxis: [
        {
          type: 'value',
          position: 'left',
          axisLine: { show: true, lineStyle: { color: '#91caff' } },
          axisLabel: { color: '#999', fontSize: 9 },
          splitLine: { lineStyle: { color: '#f5f5f5', type: 'dashed' } }
        },
        {
          type: 'value',
          position: 'right',
          axisLine: { show: true, lineStyle: { color: '#fa8c16' } },
          axisLabel: { color: '#999', fontSize: 9 },
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: '样品单数',
          type: 'bar',
          yAxisIndex: 0,
          data: barData,
          barWidth: '35%',
          itemStyle: { color: '#91caff', borderRadius: [2, 2, 0, 0] },
          emphasis: { focus: 'series' }
        },
        {
          name: '签收出单率',
          type: 'line',
          yAxisIndex: 1,
          data: lineData,
          smooth: false,
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: { width: 1, color: '#fa8c16' },
          itemStyle: { color: '#fa8c16' },
          emphasis: { focus: 'series' }
        }
      ]
    }
    sampleChart.setOption(option)
    sampleChart.resize()
  }
}

// 响应式调整图表大小
const handleResize = () => {
  storeGmvChart?.resize()
  carrierGmvChart?.resize()
  trendChart?.resize()
  sampleChart?.resize()
}

// 生命周期钩子
onMounted(() => {
  initStoreGmvChart()
  initCarrierGmvChart()
  initTrendChart()
  initSampleChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  storeGmvChart?.dispose()
  carrierGmvChart?.dispose()
  trendChart?.dispose()
  sampleChart?.dispose()
})

// ===== 区域E：动销数据 =====
const saleTab = ref('talent')
const salePage = ref(1)
const salePagination = ref({ page: 1, pageSize: 5 })
const saleSort = reactive({ field: 'amount', dir: 'desc' })
const saleTableData = reactive([
  { platform:'TikTok', username:'talent_001', name:'达人名称A', productName:'热销商品A', productId:'71200120132', amount:'¥12,560', sales:'900', skuOrTalent:'68', ratio:'0% / 98% / 2%' },
  { platform:'TikTok', username:'talent_002', name:'达人名称B', productName:'热销商品B', productId:'71200120133', amount:'¥10,230', sales:'800', skuOrTalent:'55', ratio:'68% / 12% / 1.5%' },
  { platform:'Shopee', username:'talent_003', name:'达人名称C', productName:'热销商品C', productId:'71200120134', amount:'¥8,900', sales:'720', skuOrTalent:'42', ratio:'60% / 12% / 1.7%' },
  { platform:'Lazada', username:'talent_004', name:'达人名称D', productName:'热销商品D', productId:'71200120135', amount:'¥7,650', sales:'580', skuOrTalent:'38', ratio:'59% / 23% / 2.6%' },
  { platform:'TikTok', username:'talent_005', name:'达人名称E', productName:'热销商品E', productId:'71200120136', amount:'¥6,320', sales:'460', skuOrTalent:'30', ratio:'98% / 2.8% / 7.4%' },
  { platform:'Instagram', username:'talent_006', name:'达人名称F', productName:'热销商品F', productId:'71200120137', amount:'¥5,100', sales:'350', skuOrTalent:'25', ratio:'45% / 35% / 20%' },
  { platform:'TikTok', username:'talent_007', name:'达人名称G', productName:'热销商品G', productId:'71200120138', amount:'¥4,800', sales:'320', skuOrTalent:'22', ratio:'30% / 50% / 20%' },
  { platform:'Shopee', username:'talent_008', name:'达人名称H', productName:'热销商品H', productId:'71200120139', amount:'¥3,200', sales:'210', skuOrTalent:'15', ratio:'80% / 15% / 5%' },
  { platform:'Lazada', username:'talent_009', name:'达人名称I', productName:'热销商品I', productId:'71200120140', amount:'¥2,650', sales:'180', skuOrTalent:'12', ratio:'55% / 30% / 15%' },
  { platform:'TikTok', username:'talent_010', name:'达人名称J', productName:'热销商品J', productId:'71200120141', amount:'¥1,500', sales:'100', skuOrTalent:'8', ratio:'70% / 20% / 10%' }
])
const saleTotalPages = computed(() => Math.ceil(saleTableData.length / 5))
const saleTablePage = computed(() => saleTableData.slice((salePage.value - 1) * 5, salePage.value * 5))
const toggleSort = (field) => { saleSort.dir = saleSort.field === field && saleSort.dir === 'desc' ? 'asc' : 'desc'; saleSort.field = field }
const sortIcon = (field) => saleSort.field === field ? (saleSort.dir === 'desc' ? '↓' : '↑') : '↕'
const handleSalePageChange = (pageInfo) => {
  salePage.value = pageInfo.page
  salePagination.value = pageInfo
}

// ===== 区域F：寄样概况 =====
const sampleKpis = reactive([
  { label: '样品单数', value: '56', trend: '↑ 3.6%', trendClass: 'trend-up', tooltip: '所选时间范围内创建的样品单数量' },
  { label: '寄样商品数', value: '128', trend: '↑ 5.2%', trendClass: 'trend-up', tooltip: '所有样品单中的商品总件数' },
  { label: '寄样费用', value: '¥1.2w', trend: '↑ 8%', trendClass: 'trend-up', tooltip: '所有样品单的商品总费用' },
  { label: '签收样品数', value: '42', trend: '↓ 2.1%', trendClass: 'trend-down', tooltip: '所选时间范围内已签收的样品单数' },
  { label: '签收交付率', value: '12%', trend: '', trendClass: '', tooltip: '已签收样品中完成出单的数量÷已签收样品总数' },
  { label: '签收出单率', value: '8.5%', trend: '', trendClass: '', tooltip: '已签收样品中有同商品出单的数量÷已签收样品总数' }
])
const sampleTop10 = reactive([
  { name: '张三', value: 32, pct: 100 }, { name: '李四', value: 28, pct: 87 },
  { name: '王五', value: 24, pct: 75 }, { name: '赵六', value: 20, pct: 62 },
  { name: '陈七', value: 18, pct: 56 }, { name: '周八', value: 15, pct: 47 },
  { name: '吴九', value: 12, pct: 37 }, { name: '郑十', value: 10, pct: 31 },
  { name: '刘一', value: 8, pct: 25 }, { name: '孙二', value: 6, pct: 19 }
])

// ===== 区域G：合作漏斗 =====
const cooperationFunnel = reactive([
  { label: '建联中的达人', value: '3,265', widthPct: 100, color: '#1677ff', tooltip: '将达人添加到我的达人并开始进行第一步建联的达人总数（累计值）', rate: null, rateName: '' },
  { label: '建联成功的达人', value: '1,568', widthPct: 76, color: '#4096ff', tooltip: '通过站内信或定向邀约顺利建联上的达人', rate: '48.03%', rateName: '建联成功率' },
  { label: '合作中的达人', value: '816', widthPct: 52, color: '#69b1ff', tooltip: '创建了合作单未出单的达人', rate: '52.04%', rateName: '选品成功率' },
  { label: '出单达人', value: '356', widthPct: 34, color: '#91caff', tooltip: '顺利出单的达人（合作成功的达人）', rate: '43.63%', rateName: '带货成功率' },
  { label: '深度合作的达人', value: '128', widthPct: 20, color: '#bae0ff', tooltip: '有出单的同时，达到全公司统一设置的GMV阈值', rate: '35.96%', rateName: '深度带货率' }
])
const deepCoopThreshold = ref(10000)
const deepCoopInput = ref(10000)
const showDeepCoopDialog = ref(false)
const saveDeepCoop = () => {
  if (!deepCoopInput.value) { ElMessage.error('请输入数值'); return }
  if (deepCoopInput.value < 100 || deepCoopInput.value > 100000) { ElMessage.error('请设置金额在 100-100,000 范围内'); return }
  deepCoopThreshold.value = deepCoopInput.value
  showDeepCoopDialog.value = false
  ElMessage.success('深度合作设置已保存')
}

// ===== 区域H：寄样漏斗 =====
const sampleFunnel = reactive([
  { label: '申请寄样', value: '456', widthPct: 100, color: '#722ed1', tooltip: '所选周期内申请的样品单数量', rate: null, rateName: '' },
  { label: '寄样发货', value: '380', widthPct: 83, color: '#9254de', tooltip: '申请的样品单中发货成功的数量', rate: '83.33%', rateName: '申样成功率' },
  { label: '样品签收', value: '298', widthPct: 65, color: '#b37feb', tooltip: '申请的样品单中有成功签收的数量', rate: '78.42%', rateName: '发货签收率' },
  { label: '签收交付', value: '186', widthPct: 41, color: '#d3adf7', tooltip: '申请的样品单中有成功交付的数量', rate: '62.42%', rateName: '签收交付率' },
  { label: '交付出单', value: '92', widthPct: 20, color: '#efdbff', tooltip: '申请的样品单中有成功出单的数量', rate: '49.46%', rateName: '交付出单率' }
])

// ===== 区域I：排行榜 =====
const rankTab = ref('bd')
const rankPage = ref(1)
const rankPagination = ref({ page: 1, pageSize: 10 })
const rankSort = reactive({ field: 'amount', dir: 'desc' })
const bdRankData = reactive([
  { name:'张三', pct:'20%', amount:'¥12,230', talentCount:18 },
  { name:'李四', pct:'15%', amount:'¥9,180', talentCount:14 },
  { name:'王五', pct:'12%', amount:'¥7,350', talentCount:11 },
  { name:'赵六', pct:'10%', amount:'¥6,120', talentCount:9 },
  { name:'陈七', pct:'8%', amount:'¥4,900', talentCount:7 },
  { name:'周八', pct:'7%', amount:'¥4,280', talentCount:6 },
  { name:'吴九', pct:'6%', amount:'¥3,670', talentCount:5 },
  { name:'郑十', pct:'5%', amount:'¥3,060', talentCount:4 },
  { name:'刘一', pct:'4%', amount:'¥2,450', talentCount:3 },
  { name:'孙二', pct:'3%', amount:'¥1,840', talentCount:2 }
])
const sampleRankData = reactive([
  { platform:'TikTok', productName:'热销商品A', productId:'71200120132', pct:'18%', sampleCount:32 },
  { platform:'TikTok', productName:'热销商品B', productId:'71200120133', pct:'14%', sampleCount:25 },
  { platform:'Shopee', productName:'热销商品C', productId:'71200120134', pct:'11%', sampleCount:20 },
  { platform:'Lazada', productName:'热销商品D', productId:'71200120135', pct:'9%', sampleCount:16 },
  { platform:'TikTok', productName:'热销商品E', productId:'71200120136', pct:'8%', sampleCount:14 }
])
const currentRankData = computed(() => rankTab.value === 'bd' ? bdRankData : sampleRankData)
const rankTotalPages = computed(() => Math.max(1, Math.ceil(currentRankData.value.length / 10)))
const rankTablePage = computed(() => currentRankData.value.slice((rankPage.value - 1) * 10, rankPage.value * 10))
const toggleRankSort = (f) => { rankSort.dir = rankSort.field === f && rankSort.dir === 'desc' ? 'asc' : 'desc'; rankSort.field = f }
const rankSortIcon = (f) => rankSort.field === f ? (rankSort.dir === 'desc' ? '↓' : '↑') : '↕'
const handleRankPageChange = (pageInfo) => {
  rankPage.value = pageInfo.page
  rankPagination.value = pageInfo
}

const checkFilterToolbarSticky = () => {
  const el = filterToolbarRef.value
  if (el) {
    const rect = el.getBoundingClientRect()
    if (rect.top <= 60) {
      el.classList.add('is-stuck')
    } else {
      el.classList.remove('is-stuck')
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', checkFilterToolbarSticky)
  checkFilterToolbarSticky()
}

// ===== 弹窗 =====
const showConfigDialog = ref(false)
const showExportDialog = ref(false)
const handleExport = () => { showExportDialog.value = true }
const confirmExport = () => {
  showExportDialog.value = false
  ElMessage.success('导出任务已提交，请在「任务中心-下载任务」中查看')
}

// ===== 自定义表格字段弹窗功能 =====
const tempSelectedIds = ref([])
const tempSelectedItems = ref([])

const onConfigDialogOpen = () => {
  tempSelectedIds.value = [...userSavedConfigIds.value]
  syncTempItemsFromIds()
}

const syncTempItemsFromIds = () => {
  tempSelectedItems.value = tempSelectedIds.value.map(id => allKpiDataMap[id])
}

const isOptionDisabled = (optId) => {
  return !tempSelectedIds.value.includes(optId) && tempSelectedIds.value.length >= 12
}

const handleCheckChange = (isChecked, id, opt) => {
  if (isChecked) {
    if (tempSelectedIds.value.length > 12) {
      ElMessage.warning('最多选择 12 个指标')
      tempSelectedIds.value = tempSelectedIds.value.filter(x => x !== id)
    } else {
      tempSelectedItems.value.push(opt)
    }
  } else {
    if (tempSelectedIds.value.length < 3) {
      ElMessage.warning('最少保留 3 个指标')
      tempSelectedIds.value.push(id)
    } else {
      tempSelectedItems.value = tempSelectedItems.value.filter(x => x.id !== id)
    }
  }
}

// 处理复选框变化，同步左右面板
const handleCheckboxChange = (isChecked, opt) => {
  if (isChecked) {
    if (tempSelectedIds.value.length >= 12) {
      ElMessage.warning('最多选择 12 个指标')
      return
    }
    tempSelectedIds.value.push(opt.id)
    tempSelectedItems.value.push(opt)
  } else {
    if (tempSelectedIds.value.length <= 3) {
      ElMessage.warning('最少保留 3 个指标')
      return
    }
    tempSelectedIds.value = tempSelectedIds.value.filter(id => id !== opt.id)
    tempSelectedItems.value = tempSelectedItems.value.filter(item => item.id !== opt.id)
  }
}

const removeSelected = (id) => {
  if (tempSelectedIds.value.length <= 3) {
    ElMessage.warning('最少保留 3 个指标')
    return
  }
  tempSelectedIds.value = tempSelectedIds.value.filter(x => x !== id)
  tempSelectedItems.value = tempSelectedItems.value.filter(x => x.id !== id)
}

const showInsertIndicator = ref(false)
let draggedIndex = -1
let dragOverIndex = ref(-1)
const onDragStart = (idx) => {
  draggedIndex = idx
  showInsertIndicator.value = true
}
const onDragOver = (idx) => {
  dragOverIndex.value = idx
}
const onDragLeave = () => {
  // 不立即清除，等待 drop 或 dragend 处理
}
const onDrop = (idx) => {
  showInsertIndicator.value = false
  if (draggedIndex === -1 || draggedIndex === idx) {
    draggedIndex = -1
    dragOverIndex.value = -1
    return
  }
  const list = tempSelectedItems.value
  const item = list.splice(draggedIndex, 1)[0]
  list.splice(idx, 0, item)
  tempSelectedIds.value = list.map(x => x.id)
  draggedIndex = -1
  dragOverIndex.value = -1
}
const onDragEnd = () => {
  showInsertIndicator.value = false
  draggedIndex = -1
  dragOverIndex.value = -1
}

const confirmRestoreDefault = () => {
  ElMessageBox.confirm('确定恢复默认配置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    tempSelectedIds.value = [...defaultKpiIds]
    syncTempItemsFromIds()
  }).catch(() => {})
}

const saveConfig = () => {
  if (tempSelectedIds.value.length < 3) { ElMessage.warning('最少保留 3 个指标'); return }
  if (tempSelectedIds.value.length > 12) { ElMessage.warning('最多选择 12 个指标'); return }
  
  userSavedConfigIds.value = [...tempSelectedIds.value]
  localStorage.setItem('DOHOZZ_KPI_CONFIG_v1', JSON.stringify(userSavedConfigIds.value))
  
  // ensure selected chart KPIs are still valid
  selectedChartKpiIds.value = selectedChartKpiIds.value.filter(id => userSavedConfigIds.value.includes(id))
  if (selectedChartKpiIds.value.length === 0 && userSavedConfigIds.value.length > 0) {
    selectedChartKpiIds.value.push(userSavedConfigIds.value[0])
  }
  
  showConfigDialog.value = false
  ElMessage.success('自定义配置已保存')
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

.data-overview { background: $bg; min-height: calc(100vh - 48px); padding: 0 0 24px; }

// ===== 区域A =====
.filter-area { margin: 0; }
.platform-tabs-bar {
  background: $white;
  border: none;
  border-radius: $border-radius-lg $border-radius-lg 0 0;
  padding: 0 16px;
  margin: 0;
}
.platform-tabs { display: flex; gap: 32px; }
.platform-tab {
  display: flex; align-items: center; gap: 8px; padding: 12px 0;
  color: $secondary-text; cursor: pointer; border-bottom: 2px solid transparent;
  transition: all $fast; position: relative; top: 1px;
  &:hover { color: $primary-text; }
  &.active { color: $primary; font-weight: 500; border-bottom-color: $primary; }
  .platform-icon {
    width: 20px; height: 20px;
    &.tiktok-icon {
      width: 20px; height: 20px; border-radius: 6px; overflow: hidden;
      img { width: 100%; height: 100%; border-radius: 6px; }
    }
    &.instagram-icon {
      width: 20px; height: 20px; border-radius: 4px; overflow: hidden;
      img { width: 100%; height: 100%; border-radius: 4px; }
    }
    &.shopee-icon {
      width: 20px; height: 20px; border-radius: 4px; overflow: hidden;
      img { width: 100%; height: 100%; border-radius: 4px; }
    }
    &.lazada-icon {
      width: 20px; height: 20px; border-radius: 4px; overflow: hidden;
      img { width: 100%; height: 100%; border-radius: 4px; }
    }
    &.all-icon {
      width: 20px; height: 20px; border-radius: 4px; overflow: hidden;
      color: #1677FF;
    }
  }
}
.filter-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: $white;
  border-top: 1px solid #E8E8E8;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  position: sticky;
  top: 60px;
  z-index: 89;
  transition: box-shadow 0.3s ease;
}

.filter-toolbar.is-stuck {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.filter-row { display: flex; align-items: center; gap: 32px; flex-wrap: wrap; margin: 0; }
.filter-item { display: flex; align-items: center; flex-shrink: 0; }
.filter-label { margin-right: 10px; color: #4e5969; font-family: PingFang SC; font-size: 13px; font-style: normal; font-weight: 400; white-space: nowrap; text-align: right; }
.filter-select {
  width: 200px;
  :deep(.el-select__wrapper) {
    height: 32px !important;
  }
}
.filter-item.date-filter { display: flex; align-items: center; gap: 0; margin-left: auto; }

// ===== 通用 Section =====
.section-block { background: $white; border-radius: $border-radius-lg; padding: 16px; margin: 16px 0 0; border: none;
  &.half { flex: 1; min-width: 0; margin: 0; }
}
.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  .el-button {
    height: 32px;
    font-size: 14px;
  }
}
.head-left { display: flex; align-items: center; gap: 12px; }
.section-title { font-size: 14px; font-weight: 600; color: $primary-text; }
.update-time { font-size: 12px; color: $secondary-text; }
.help-icon { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; border-radius: 50%; background: transparent; border: 1px solid #d9d9d9; color: $text-3; font-size: 10px; cursor: help; margin-left: 4px; font-weight: 600; }

// ===== 区域B：KPI =====
.kpi-cards-scroll { margin: 0 -4px; padding-bottom: 4px; }
.kpi-cards { display: flex; gap: 12px; flex-wrap: wrap; }
.kpi-card { width: 369.156px; height: 114px; padding: 16px; background: $bg; border-radius: 8px; border: 2px solid transparent; cursor: pointer; transition: all 0.2s; flex-shrink: 0;
  &:hover { border-color: #d6e4ff; }
  &.selected { border-color: $primary; background: #f0f7ff; }
}
.kpi-label { font-size: 14px; color: #666666; margin-bottom: 6px; display: flex; align-items: center; }
.kpi-value { font-size: 22px; font-weight: 700; color: $text-1; margin-bottom: 4px; }
.kpi-trend { font-size: 12px; display: flex; align-items: center; gap: 2px; }
.trend-label { color: #999999; }
.trend-up { color: #f5222d; }
.trend-down { color: #52c41a; }

// 趋势图
.trend-chart-area { margin-top: 12px; width: 100%; overflow: hidden; }
.trend-chart-echarts { width: 100%; height: 350px; }

// ===== GMV 分布 =====
.dual-section { display: flex; gap: 16px; margin: 16px 0 0;
  &.inner { gap: 48px; margin: 12px 0 0; }
}
.gmv-content { display: flex; align-items: center; gap: 32px; }
.donut-wrapper { flex-shrink: 0; }
.donut-arc { transition: opacity 0.3s; }
.gmv-legend-list { flex: 1; display: flex; flex-direction: column; gap: 10px; }
.gmv-legend-item { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.legend-name { color: $text-1; min-width: 90px; }
.legend-val { color: $text-1; font-weight: 600; }
.legend-pct { color: $text-3; font-size: 12px; }

// ===== 区域E：动销 =====
.sale-tabs { display: flex; gap: 16px; margin-bottom: 16px; }
.sale-tab-card { flex: 1; padding: 16px; background: $bg; border-radius: 8px; border: 2px solid transparent; cursor: pointer; transition: all $fast;
  &.active { border-color: $primary; background: #f0f7ff; }
  &:hover { border-color: #d6e4ff; }
}
.tab-label { font-size: 12px; color: $text-2; margin-bottom: 4px; display: flex; align-items: center; }
.tab-value { font-size: 24px; font-weight: 700; color: $text-1; margin-bottom: 2px; }
.tab-trend { font-size: 12px; }

// ===== 表格 =====
.data-table-wrapper { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px;
  th { text-align: left; padding: 10px 12px; background: $bg; color: $text-2; font-weight: 500; border-bottom: 1px solid $border; white-space: nowrap;
    &.sortable { cursor: pointer; user-select: none; &:hover { color: $primary; } }
  }
  td { padding: 12px; border-bottom: 1px solid #f5f5f5; color: $text-1; }
  tr:hover td { background: #fafbfc; }
}
.sort-arrows { font-size: 11px; color: $text-3; margin-left: 2px; }
.rank-badge { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; font-size: 12px; font-weight: 600; color: $text-2; background: #f0f0f0;
  &.gold { background: linear-gradient(135deg, #ffd700, #ffb800); color: #fff; }
}
.amount-cell { font-weight: 600; }
.ratio-cell { font-size: 12px; color: $text-2; }
.cell-platform { display: flex; align-items: center; gap: 6px; }
.cell-talent { display: flex; align-items: center; gap: 8px; }
.tiny-avatar { background: #d9d9d9; flex-shrink: 0; }
.talent-uname { font-size: 13px; color: $text-1; }
.talent-name { font-size: 11px; color: $text-3; }
.cell-product { display: flex; align-items: center; gap: 8px; }
.product-img-placeholder { width: 40px; height: 40px; background: #f0f0f0; border-radius: 4px; flex-shrink: 0;
  &.small { width: 32px; height: 32px; }
}
.product-name { font-size: 13px; color: $text-1; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.product-id { font-size: 11px; color: $text-3; }

.pagination-bar { display: flex; align-items: center; justify-content: flex-end; gap: 8px; margin-top: 16px; }
.page-btns { display: flex; gap: 4px; }
.page-btn { min-width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border: none; border-radius: 4px; background: #fff; cursor: pointer; font-size: 12px; color: $text-2; transition: all $fast;
  &:hover { border-color: $primary; color: $primary; }
  &.active { background: $primary; border-color: $primary; color: #fff; }
}
.page-info { font-size: 12px; color: $text-3; }

// ===== 区域F：寄样概况 =====
.sample-kpi-row { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-bottom: 16px; }
.sample-kpi-card { padding: 12px 14px; background: $bg; border-radius: 8px; }
.sk-label { font-size: 12px; color: $text-2; margin-bottom: 4px; display: flex; align-items: center; }
.sk-value { font-size: 20px; font-weight: 700; color: $text-1; margin-bottom: 2px; }
.sk-trend { font-size: 12px; }
.chart-box { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.chart-box-title { font-size: 13px; font-weight: 600; color: $text-1; margin-bottom: 8px; }
.bar-line-chart { width: 100%; flex: 1; min-height: 200px; }
.top10-list { display: flex; flex-direction: column; gap: 8px; }
.top10-row { display: flex; align-items: center; gap: 8px; font-size: 12px; }
.top10-rank { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: #f0f0f0; font-size: 11px; font-weight: 600; color: $text-2; flex-shrink: 0;
  &.gold { background: linear-gradient(135deg, #ffd700, #ffb800); color: #fff; }
}
.top10-name { width: 50px; color: $text-1; flex-shrink: 0; }
.top10-bar-bg { flex: 1; height: 16px; background: #f0f0f0; border-radius: 4px; overflow: hidden; }
.top10-bar-fill { height: 100%; background: linear-gradient(90deg, #1677ff, #69b1ff); border-radius: 4px; transition: width 0.6s ease; }
.top10-val { width: 30px; text-align: right; font-weight: 600; color: $text-1; flex-shrink: 0; }

// ===== 漏斗 =====
.funnel-visual { padding: 8px 0; }
.funnel-step { margin-bottom: 6px; display: flex; align-items: center; gap: 12px; }
.funnel-layer { height: 36px; border-radius: 4px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; transition: width 0.5s ease; min-width: 120px; }
.funnel-layer-label { font-size: 12px; color: #fff; font-weight: 500; }
.funnel-layer-value { font-size: 14px; color: #fff; font-weight: 700; }
.funnel-rate { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.rate-line { width: 16px; border-top: 1px dashed $text-3; }
.rate-text { font-size: 11px; color: $text-2; white-space: nowrap; }
.funnel-footer-text { font-size: 12px; color: $text-3; margin-top: 12px; padding-left: 4px; }
.link-text { color: $primary; cursor: pointer; margin-left: 4px; &:hover { text-decoration: underline; } }

// ===== 排行榜 Tab =====
.tab-toggle { display: flex; border-radius: 4px; overflow: hidden; }
.toggle-btn { width: 62px; padding: 4px 0; font-size: 13px; cursor: pointer; color: $text-2; background: #fff; border: 1px solid $border; border-right: none; transition: all $fast; text-align: center;
  &:last-child { border-right: 1px solid $border; }
  &.active { background: $primary; color: #fff; border-color: $primary; }
}

// ===== 弹窗 =====
.deep-coop-form { display: flex; align-items: center; font-size: 14px; color: $text-1; }

.config-dialog-tip { font-size: 13px; color: $text-2; margin-bottom: 16px; padding: 10px 16px; background: #e6f4ff; border: none; border-radius: 4px;
   span { font-weight: 700; color: $primary; }
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
.config-left { flex: 1; overflow-y: auto; }
.metric-group { margin-bottom: 24px; }
.metric-group-title { font-size: 14px; font-weight: 600; color: #050505; margin-bottom: 0px; padding-bottom: 0px; border-bottom: 0px; }
.metric-group-items { display: flex; flex-wrap: wrap; gap: 12px; padding-top: 12px;
  :deep(.el-checkbox) { width: 200px; height: 20.375px; margin-right: 30px; font-weight: 500; font-size: 14px; position: relative; cursor: pointer; white-space: nowrap; user-select: none;
    .el-checkbox__inner { width: 16px; height: 16px; }
    .el-checkbox__label { font-size: 14px; color: #86909c; font-weight: 500; white-space: normal; padding-left: 8px; line-height: 16px; }
    &.is-checked .el-checkbox__label { color: #1677ff; }
  }
}
.config-right { height: 1127px; border: none; border-radius: 8px; display: flex; flex-direction: column; background: #fff; overflow: hidden; }
.right-header { padding: 16px; background: #fff; border: none; font-size: 14px; font-weight: 600; color: $text-1; flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; .header-tip-text { font-size: 12px; color: #999; font-weight: 400; } }
.selected-list { flex: 1; overflow-y: auto; padding: 12px; }
.selected-item { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: #fff; border: none; margin-bottom: 8px; border-radius: 4px; cursor: grab; font-size: 13px; color: $text-1; transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.08); .delete-icon svg { fill: #ff4d4f; } }
  &:active { cursor: grabbing; }
}
.item-inner { display: flex; align-items: center; gap: 8px; }
.drag-handle { cursor: grab; }
.delete-icon { cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 2px;
  &:hover svg { fill: #ff4d4f; }
}
.dialog-footer-between { display: flex; align-items: center; justify-content: space-between; }

// ===== 抽屉 =====
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
  .header-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
  .header-tip {
    margin-left: 20px;
    font-size: 13px;
    color: $text-2;
    span {
      font-weight: 700;
      color: $primary;
    }
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

// ===== 响应式 =====
@media (max-width: 1200px) {
  .sample-kpi-row { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 900px) {
  .dual-section { flex-direction: column; }
  .sample-kpi-row { grid-template-columns: repeat(2, 1fr); }
}
</style>
