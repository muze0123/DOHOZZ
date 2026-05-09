<template>
  <div class="command-center-page">
    <!-- 顶部导航与筛选区 -->
    <div class="top-filter-section">
      <div class="top-right-actions">
        <el-button type="warning" size="small" @click="handleTutorial">
          一分钟看懂指挥中台
        </el-button>
        <el-button size="small" @click="handleExportImage">
          导出页面为图片
        </el-button>
      </div>

      <div class="platform-tabs-bar">
        <div class="platform-tabs">
          <div
            v-for="platform in platforms"
            :key="platform.id"
            class="platform-tab"
            :class="{ active: activePlatform === platform.id }"
            @click="handlePlatformChange(platform.id)"
          >
            <div class="platform-icon" :class="platform.id + '-icon'">
              <img :src="platform.icon" :alt="platform.name" />
            </div>
            <span>{{ platform.name }}</span>
          </div>
        </div>
      </div>

      <!-- 时间筛选 -->
        <div class="time-filter">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            size="small"
            style="width: 240px;"
          />
          <div class="quick-time-btns">
            <span
              v-for="opt in quickTimeOptions"
              :key="opt.value"
              class="quick-btn"
              :class="{ active: activeQuickTime === opt.value }"
              @click="handleQuickTimeChange(opt.value)"
            >
              {{ opt.label }}
            </span>
          </div>
          <el-button size="small" @click="handleTutorial">教程</el-button>
        </div>

      <div class="filter-row-sub">
        <div class="attr-filter">
          <span class="filter-label">归属:</span>
          <div class="attr-tabs">
            <span
              v-for="a in attrOptions"
              :key="a"
              class="attr-tab"
              :class="{ active: activeAttr === a }"
              @click="activeAttr = a"
            >
              {{ a }}
            </span>
          </div>
          <el-tooltip content="归属筛选说明" placement="top">
            <span class="help-icon">?</span>
          </el-tooltip>
        </div>
        <div class="shop-filter">
          <span class="filter-label">店铺:</span>
          <el-select v-model="activeShop" size="small" style="width: 140px;">
            <el-option label="所有店铺" value="所有店铺" />
            <el-option label="DOHOZZ旗舰店" value="DOHOZZ旗舰店" />
            <el-option label="DOHOZZ官方店" value="DOHOZZ官方店" />
          </el-select>
        </div>
      </div>
    </div>

    <!-- 核心数据概览区 -->
    <div class="overview-section">
      <!-- 卡片区域 -->
      <div class="overview-cards">
        <!-- 店铺总成交金额 -->
        <div class="overview-card">
          <div class="card-header">
            <span class="card-title">店铺总成交金额</span>
            <el-tooltip content="店铺总成交金额说明" placement="top">
              <span class="help-icon">?</span>
            </el-tooltip>
          </div>
          <div class="card-value primary">¥1,858,969.31</div>
          <div class="card-trend down">
            <span class="trend-arrow">↓</span>
            环比 -6.07%
          </div>
          <div class="card-sub">
            <span>退款金额 ¥332,669.72</span>
            <span class="trend-text down">↓ -19.01%</span>
          </div>
          <div class="ring-chart">
            <div class="ring-chart-inner">
              <div class="ring-segment blue" style="--pct: 39.35%"></div>
              <div class="ring-segment green" style="--pct: 1.99%"></div>
              <div class="ring-segment gray" style="--pct: 58.66%"></div>
            </div>
            <div class="ring-legend">
              <div class="legend-item"><span class="dot blue"></span>达人 39.35%</div>
              <div class="legend-item"><span class="dot green"></span>团长 1.99%</div>
              <div class="legend-item"><span class="dot gray"></span>其它 58.66%</div>
            </div>
          </div>
        </div>

        <!-- 达播成交金额 -->
        <div class="overview-card">
          <div class="card-header">
            <span class="card-title">达播成交金额(团长+达人)</span>
            <el-tooltip content="达播成交金额说明" placement="top">
              <span class="help-icon">?</span>
            </el-tooltip>
          </div>
          <div class="card-value">¥76.86w</div>
          <div class="card-trend up">
            <span class="trend-arrow">↑</span>
            环比 +3.52%
          </div>
        </div>

        <!-- 达人成交金额 -->
        <div class="overview-card">
          <div class="card-header">
            <span class="card-title">达人成交金额</span>
            <el-tooltip content="达人成交金额说明" placement="top">
              <span class="help-icon">?</span>
            </el-tooltip>
          </div>
          <div class="card-value">¥73.15w</div>
          <div class="card-trend up">
            <span class="trend-arrow">↑</span>
            环比 +5.64%
          </div>
        </div>

        <!-- 团长成交金额 -->
        <div class="overview-card">
          <div class="card-header">
            <span class="card-title">团长成交金额</span>
            <el-tooltip content="团长成交金额说明" placement="top">
              <span class="help-icon">?</span>
            </el-tooltip>
          </div>
          <div class="card-value">¥3.71w</div>
          <div class="card-trend down">
            <span class="trend-arrow">↓</span>
            环比 -25.92%
          </div>
        </div>

        <!-- 业绩目标 -->
        <div class="overview-card target-card">
          <div class="card-header">
            <span class="card-title">业绩目标</span>
            <div class="card-header-actions">
              <el-date-picker
                v-model="targetDateRange"
                type="daterange"
                range-separator="-"
                start-placeholder="开始"
                end-placeholder="结束"
                value-format="YYYY-MM-DD"
                size="small"
                style="width: 200px;"
              />
              <el-button size="small" circle @click="handlePerformanceSetting" title="绩效设置">
                <el-icon><Setting /></el-icon>
              </el-button>
            </div>
          </div>
          <div class="target-table">
            <div class="target-row">
              <span class="target-label">达播</span>
              <span class="target-value">0</span>
              <div class="target-bar"><div class="target-progress" style="width: 0%"></div></div>
              <span class="target-pct">0%</span>
            </div>
            <div class="target-row">
              <span class="target-label">建联</span>
              <span class="target-value">46</span>
              <div class="target-bar"><div class="target-progress" style="width: 4.6%"></div></div>
              <span class="target-pct">4.6%</span>
            </div>
            <div class="target-row">
              <span class="target-label">寄样</span>
              <span class="target-value">1</span>
              <div class="target-bar"><div class="target-progress" style="width: 0.1%"></div></div>
              <span class="target-pct">0.1%</span>
            </div>
            <div class="target-row">
              <span class="target-label">出单</span>
              <span class="target-value">0</span>
              <div class="target-bar"><div class="target-progress" style="width: 0%"></div></div>
              <span class="target-pct">0%</span>
            </div>
          </div>
          <div class="target-footer">
            <el-select v-model="targetMonth" size="small" style="width: 100px;">
              <el-option label="2026年04月" value="2026-04" />
              <el-option label="2026年03月" value="2026-03" />
            </el-select>
            <span class="target-badge">97%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据趋势区 -->
    <div class="trend-section">
      <div class="section-header">
        <div class="section-title">
          <span>数据趋势</span>
          <span class="section-sub">2026/04/01-2026/04/29</span>
          <span class="section-sub">更新时间: 2026-04-27 13:00</span>
        </div>
        <div class="section-actions">
          <el-button size="small" @click="handleConfig">配置</el-button>
          <el-button size="small" @click="handleExportTrend">导出</el-button>
          <el-button size="small" @click="handleSwitchView">切换列表</el-button>
        </div>
      </div>

      <!-- 指标快捷卡片 -->
      <div class="metric-cards">
        <div
          v-for="metric in metrics"
          :key="metric.key"
          class="metric-card"
          :class="{ selected: selectedMetrics.includes(metric.key) }"
          @click="handleMetricToggle(metric.key)"
        >
          <span class="metric-label">{{ metric.label }}</span>
          <span class="metric-value">{{ metric.value }}</span>
          <span class="metric-trend" :class="metric.trend > 0 ? 'up' : 'down'">
            {{ metric.trend > 0 ? '↑' : '↓' }} {{ Math.abs(metric.trend) }}%
          </span>
          <span v-if="selectedMetrics.includes(metric.key)" class="metric-check">✓</span>
        </div>
      </div>

      <!-- 趋势折线图 -->
      <div class="trend-chart">
        <div class="chart-legend">
          <div class="legend-item red"><span class="line-dot red"></span>达人成交金额</div>
          <div class="legend-item green"><span class="line-dot green"></span>达人退款金额</div>
        </div>
        <div class="chart-area">
          <div class="chart-y-axis">
            <span>4w</span>
            <span>3w</span>
            <span>2w</span>
          </div>
          <div class="chart-canvas">
            <svg class="trend-svg" viewBox="0 0 600 200" preserveAspectRatio="none">
              <!-- 达人成交金额线 (红色) -->
              <polyline
                fill="none"
                stroke="#ff4d4f"
                stroke-width="2"
                points="20,100 50,95 80,90 110,85 140,80 170,75 200,70 230,72 260,68 290,72 320,65 350,60 380,58 410,62 440,55 470,50 500,52 530,48 560,45"
              />
              <!-- 达人退款金额线 (绿色) -->
              <polyline
                fill="none"
                stroke="#52c41a"
                stroke-width="2"
                points="20,160 50,158 80,155 110,150 140,155 170,150 200,148 230,152 260,150 290,148 320,145 350,150 380,148 410,145 440,150 470,148 500,145 530,148 560,150"
              />
            </svg>
            <div class="chart-x-axis">
              <span>4月1日</span>
              <span>4月8日</span>
              <span>4月15日</span>
              <span>4月22日</span>
              <span>4月29日</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 下方筛选栏 -->
      <div class="trend-filter-bar">
        <div class="attr-filter">
          <span class="filter-label">归属:</span>
          <div class="attr-tabs">
            <span
              v-for="a in attrOptions"
              :key="a"
              class="attr-tab"
              :class="{ active: activeAttr === a }"
              @click="activeAttr = a"
            >
              {{ a }}
            </span>
          </div>
        </div>
        <div class="shop-filter">
          <span class="filter-label">店铺:</span>
          <el-select v-model="activeShop" size="small" style="width: 140px;">
            <el-option label="所有店铺" value="所有店铺" />
            <el-option label="DOHOZZ旗舰店" value="DOHOZZ旗舰店" />
          </el-select>
        </div>
      </div>

      <!-- 平台成交分布 -->
      <div class="platform-distribution">
        <div class="dist-row">
          <div class="dist-platform active">
            <span class="dist-name">抖音</span>
            <span class="dist-pct">100.00%</span>
            <span class="dist-amount">¥185.9w</span>
          </div>
          <div class="dist-ring">
            <div class="dist-ring-chart">
              <div class="ring-segment full" style="--pct: 100%"></div>
            </div>
          </div>
        </div>
        <div class="dist-row">
          <div class="dist-platform">
            <span class="dist-name">快手</span>
            <span class="dist-pct">0.00%</span>
            <span class="dist-amount">¥0</span>
          </div>
        </div>
        <div class="dist-row">
          <div class="dist-platform">
            <span class="dist-name">小红书</span>
            <span class="dist-pct">0.00%</span>
            <span class="dist-amount">¥0</span>
          </div>
        </div>
        <div class="dist-row">
          <div class="dist-platform">
            <span class="dist-name">视频号</span>
            <span class="dist-pct">0.00%</span>
            <span class="dist-amount">¥0</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 达人榜单区 -->
    <div class="rank-section">
      <div class="rank-tabs">
        <span
          v-for="tab in rankTabs"
          :key="tab"
          class="rank-tab"
          :class="{ active: activeRankTab === tab }"
          @click="activeRankTab = tab"
        >
          {{ tab }}
        </span>
      </div>
      <div class="rank-time-btns">
        <span
          v-for="opt in rankTimeOptions"
          :key="opt"
          class="rank-time-btn"
          :class="{ active: activeRankTime === opt }"
          @click="activeRankTime = opt"
        >
          {{ opt }}
        </span>
        <el-select v-model="rankMonth" size="small" style="width: 100px; margin-left: 8px;">
          <el-option label="2026-04" value="2026-04" />
          <el-option label="2026-03" value="2026-03" />
        </el-select>
      </div>

      <!-- 达人成交金额TOP榜 -->
      <div class="rank-table-section">
        <div class="table-header">
          <span class="table-title">达人成交金额TOP榜</span>
          <el-tooltip content="达人成交金额TOP榜说明" placement="top">
            <span class="help-icon">?</span>
          </el-tooltip>
          <span class="view-more" @click="handleViewMore('sales')">查看更多 ></span>
        </div>
        <table class="rank-table">
          <thead>
            <tr>
              <th style="width: 60px">排名</th>
              <th>达人信息</th>
              <th style="width: 120px">成交金额</th>
              <th style="width: 120px">成交金额环比</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in rankSalesList" :key="item.rank">
              <td>
                <span class="rank-badge" :class="{ top3: item.rank <= 3 }">{{ item.rank }}</span>
              </td>
              <td>
                <div class="influencer-info">
                  <div class="influencer-avatar">{{ item.name.charAt(0) }}</div>
                  <div class="influencer-detail">
                    <span class="influencer-name">{{ item.name }}</span>
                    <span class="influencer-fans">粉丝 {{ item.fans }}</span>
                  </div>
                </div>
              </td>
              <td>¥{{ item.sales }}</td>
              <td>
                <span class="trend-text" :class="item.salesTrend > 0 ? 'up' : 'down'">
                  {{ item.salesTrend > 0 ? '↑' : '↓' }} {{ Math.abs(item.salesTrend) }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 达人销量TOP榜 -->
      <div class="rank-table-section">
        <div class="table-header">
          <span class="table-title">达人销量TOP榜</span>
          <el-tooltip content="达人销量TOP榜说明" placement="top">
            <span class="help-icon">?</span>
          </el-tooltip>
          <span class="view-more" @click="handleViewMore('volume')">查看更多 ></span>
        </div>
        <table class="rank-table">
          <thead>
            <tr>
              <th style="width: 60px">排名</th>
              <th>达人信息</th>
              <th style="width: 100px">销量</th>
              <th style="width: 120px">销量环比</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in rankVolumeList" :key="item.rank">
              <td>
                <span class="rank-badge" :class="{ top3: item.rank <= 3 }">{{ item.rank }}</span>
              </td>
              <td>
                <div class="influencer-info">
                  <div class="influencer-avatar">{{ item.name.charAt(0) }}</div>
                  <div class="influencer-detail">
                    <span class="influencer-name">{{ item.name }}</span>
                    <span class="influencer-fans">粉丝 {{ item.fans }}</span>
                  </div>
                </div>
              </td>
              <td>{{ item.volume }}</td>
              <td>
                <span class="trend-text" :class="item.volumeTrend > 0 ? 'up' : 'down'">
                  {{ item.volumeTrend > 0 ? '↑' : '↓' }} {{ Math.abs(item.volumeTrend) }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 绩效设置抽屉 -->
    <el-drawer
      v-model="performanceDrawerVisible"
      :title="null"
      size="90%"
      :before-close="handlePerformanceDrawerClose"
      class="performance-drawer"
    >
      <template #default>
        <div class="drawer-content">
          <div class="drawer-header">
            <div class="drawer-tabs">
              <div
                class="drawer-tab"
                :class="{ active: performanceDrawerTab === 'setting' }"
                @click="performanceDrawerTab = 'setting'"
              >
                绩效设置
              </div>
              <div
                class="drawer-tab"
                :class="{ active: performanceDrawerTab === 'detail' }"
                @click="performanceDrawerTab = 'detail'"
              >
                业绩明细
              </div>
            </div>
          </div>

          <div v-if="performanceDrawerTab === 'setting'" class="drawer-body setting-body">
            <div class="setting-config">
              <div class="config-row">
                <div class="config-item">
                  <span class="config-label">绩效月份</span>
                  <el-date-picker
                    v-model="performanceSettingForm.month"
                    type="month"
                    value-format="YYYY-MM"
                    placeholder="选择月份"
                    style="width: 140px"
                  />
                </div>
                <div class="config-item">
                  <span class="config-label">绩效方式</span>
                  <el-radio-group v-model="performanceSettingForm.type" class="type-radio">
                    <el-radio value="department">部门业绩</el-radio>
                    <el-radio value="member">员工业绩</el-radio>
                  </el-radio-group>
                </div>
                <div class="config-item" v-if="performanceSettingForm.type === 'department'">
                  <el-checkbox v-model="performanceSettingForm.distributeEqually">
                    部门目标平均分配给成员
                  </el-checkbox>
                </div>
              </div>
              <div class="config-hint" v-if="performanceSettingForm.type === 'department' && performanceSettingForm.distributeEqually">
                将部门业绩平均分配给所属员工，一级部门会减去二级部门的绩效，再平均给所属员工。若不勾选此项，则本次目标仅对部门生效，员工绩效需单独填写。
              </div>
            </div>

            <div class="setting-main">
              <div class="org-tree-panel">
                <div class="panel-title">选择部门</div>
                <el-tree
                  :data="performanceOrgTreeData"
                  :props="{ label: 'name', children: 'children' }"
                  node-key="id"
                  :default-expand-all="false"
                  :expand-on-click-node="false"
                  @node-click="handlePerformanceOrgNodeClick"
                  highlight-current
                >
                  <template #default="{ data }">
                    <span class="org-tree-node">
                      <span>{{ data.name }}</span>
                      <span v-if="data.memberCount" class="member-count">({{ data.memberCount }})</span>
                    </span>
                  </template>
                </el-tree>
              </div>

              <div class="target-config-panel">
                <div class="panel-title">
                  {{ performanceSettingForm.type === 'department' ? '部门业绩目标设置' : '员工业绩目标设置' }}
                  <span v-if="selectedOrgNode" class="selected-org">- {{ selectedOrgNode.name }}</span>
                </div>

                <div class="target-table-wrapper">
                  <table class="target-table">
                    <thead>
                      <tr>
                        <th class="col-org">部门/成员</th>
                        <th>达人成交金额（元）</th>
                        <th>建联达人数</th>
                        <th>寄样达人数</th>
                        <th>出单达人数</th>
                        <th>交付视频数</th>
                        <th>出单视频数</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="department-total-row" v-if="selectedOrgNode">
                        <td class="col-org">{{ selectedOrgNode.name }}（部门目标）</td>
                        <td class="money-cell">
                          <el-input-number v-model="performanceTargetForm.departmentTarget.dealAmount" :precision="2" :min="0" controls-position="right" placeholder="请输入" />
                        </td>
                        <td><el-input-number v-model="performanceTargetForm.departmentTarget.contactCount" :precision="0" :min="0" controls-position="right" placeholder="请输入" /></td>
                        <td><el-input-number v-model="performanceTargetForm.departmentTarget.sampleCount" :precision="0" :min="0" controls-position="right" placeholder="请输入" /></td>
                        <td><el-input-number v-model="performanceTargetForm.departmentTarget.orderCount" :precision="0" :min="0" controls-position="right" placeholder="请输入" /></td>
                        <td><el-input-number v-model="performanceTargetForm.departmentTarget.deliveryVideoCount" :precision="0" :min="0" controls-position="right" placeholder="请输入" /></td>
                        <td><el-input-number v-model="performanceTargetForm.departmentTarget.orderVideoCount" :precision="0" :min="0" controls-position="right" placeholder="请输入" /></td>
                      </tr>
                      <tr v-for="member in performanceTargetForm.members" :key="member.id">
                        <td class="col-org member-cell">
                          <el-avatar :size="24" :src="member.avatar" />
                          <span>{{ member.name }}</span>
                        </td>
                        <td class="money-cell"><el-input-number v-model="member.dealAmount" :precision="2" :min="0" controls-position="right" placeholder="请输入" /></td>
                        <td><el-input-number v-model="member.contactCount" :precision="0" :min="0" controls-position="right" placeholder="请输入" /></td>
                        <td><el-input-number v-model="member.sampleCount" :precision="0" :min="0" controls-position="right" placeholder="请输入" /></td>
                        <td><el-input-number v-model="member.orderCount" :precision="0" :min="0" controls-position="right" placeholder="请输入" /></td>
                        <td><el-input-number v-model="member.deliveryVideoCount" :precision="0" :min="0" controls-position="right" placeholder="请输入" /></td>
                        <td><el-input-number v-model="member.orderVideoCount" :precision="0" :min="0" controls-position="right" placeholder="请输入" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="setting-footer">
              <el-button @click="handlePerformanceDrawerClose">取消</el-button>
              <el-button type="primary" @click="handleSavePerformance">保存</el-button>
            </div>
          </div>

          <div v-if="performanceDrawerTab === 'detail'" class="drawer-body detail-body">
            <div class="detail-main">
              <div class="dept-tree-panel">
                <div class="panel-title">选择部门</div>
                <el-tree
                  :data="performanceOrgTreeData"
                  :props="{ label: 'name', children: 'children' }"
                  node-key="id"
                  :default-expand-all="false"
                  :expand-on-click-node="false"
                  highlight-current
                >
                  <template #default="{ data }">
                    <span class="org-tree-node">
                      <span>{{ data.name }}</span>
                      <span v-if="data.memberCount" class="member-count">({{ data.memberCount }})</span>
                    </span>
                  </template>
                </el-tree>
              </div>
              <div class="report-panel">
                <div class="report-config">
                  <div class="config-row">
                    <div class="config-item">
                      <span class="config-label">选择平台</span>
                      <el-select v-model="activePlatform" style="width: 120px">
                        <el-option v-for="p in platforms" :key="p.id" :label="p.name" :value="p.id" />
                      </el-select>
                    </div>
                    <div class="config-item">
                      <span class="config-label">业绩月份</span>
                      <el-date-picker v-model="performanceSettingForm.month" type="month" value-format="YYYY-MM" style="width: 140px" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Setting } from '@element-plus/icons-vue'
import TikTokIcon from '@/assets/images/TikTok.png'
import InstagramIcon from '@/assets/images/Instagram.png'
import ShopeeIcon from '@/assets/images/Shopee.png'
import LazadaIcon from '@/assets/images/Lazada.png'

const platforms = [
  { id: 'tiktok', name: 'TikTok', icon: TikTokIcon },
  { id: 'instagram', name: 'Instagram', icon: InstagramIcon },
  { id: 'shopee', name: 'Shopee', icon: ShopeeIcon },
  { id: 'lazada', name: 'Lazada', icon: LazadaIcon },
]
const activePlatform = ref('tiktok')
const attrOptions = ['全部出单达人', '团队建联达人']
const activeAttr = ref('全部出单达人')
const activeShop = ref('所有店铺')
const dateRange = ref(['2026-04-01', '2026-04-29'])
const quickTimeOptions = [
  { label: '近N天', value: 'nday' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
  { label: '大促', value: 'promo' },
  { label: '自定义', value: 'custom' },
]
const activeQuickTime = ref('month')
const targetMonth = ref('2026-04')
const targetDateRange = ref(['2026-04-01', '2026-04-29'])

// 绩效设置抽屉相关
const performanceDrawerVisible = ref(false)
const performanceDrawerTab = ref('setting')
const performanceSettingForm = reactive({
  month: '',
  type: 'department',
  distributeEqually: false
})
const performanceTargetForm = reactive({
  departmentTarget: {
    dealAmount: 0,
    contactCount: 0,
    sampleCount: 0,
    orderCount: 0,
    deliveryVideoCount: 0,
    orderVideoCount: 0
  },
  members: [],
  get total() {
    let dealAmount = 0
    let contactCount = 0
    let sampleCount = 0
    let orderCount = 0
    let deliveryVideoCount = 0
    let orderVideoCount = 0
    this.members.forEach(m => {
      dealAmount += m.dealAmount || 0
      contactCount += m.contactCount || 0
      sampleCount += m.sampleCount || 0
      orderCount += m.orderCount || 0
      deliveryVideoCount += m.deliveryVideoCount || 0
      orderVideoCount += m.orderVideoCount || 0
    })
    return { dealAmount, contactCount, sampleCount, orderCount, deliveryVideoCount, orderVideoCount }
  }
})
const selectedOrgNode = ref(null)
const performanceOrgTreeData = ref([
  { id: 1, name: '销售部', memberCount: 12, children: [
    { id: 11, name: '销售一部', memberCount: 4 },
    { id: 12, name: '销售二部', memberCount: 5 },
    { id: 13, name: '销售三部', memberCount: 3 }
  ]},
  { id: 2, name: '运营部', memberCount: 8, children: [
    { id: 21, name: '运营一组', memberCount: 4 },
    { id: 22, name: '运营二组', memberCount: 4 }
  ]},
  { id: 3, name: '市场部', memberCount: 6, children: [] }
])

const handlePerformanceSetting = () => {
  performanceDrawerTab.value = 'setting'
  performanceSettingForm.month = targetMonth.value || new Date().toISOString().slice(0, 7)
  performanceSettingForm.type = 'department'
  performanceSettingForm.distributeEqually = false
  performanceTargetForm.departmentTarget = {
    dealAmount: 0,
    contactCount: 0,
    sampleCount: 0,
    orderCount: 0,
    deliveryVideoCount: 0,
    orderVideoCount: 0
  }
  performanceTargetForm.members = []
  selectedOrgNode.value = null
  performanceDrawerVisible.value = true
}

const handlePerformanceDrawerClose = () => {
  performanceDrawerVisible.value = false
}

const handlePerformanceOrgNodeClick = (data) => {
  selectedOrgNode.value = data
  const memberNames = ['张三', '李四', '王五', '赵六']
  performanceTargetForm.members = memberNames.map((name, index) => ({
    id: data.id * 100 + index,
    name,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    dealAmount: 0,
    contactCount: 0,
    sampleCount: 0,
    orderCount: 0,
    deliveryVideoCount: 0,
    orderVideoCount: 0
  }))
}

const handleSavePerformance = () => {
  ElMessage.success('保存成功')
  performanceDrawerVisible.value = false
}

const metrics = ref([
  { key: 'creator_sales', label: '达人成交金额', value: '¥73.15w', trend: 5.64 },
  { key: 'creator_refund', label: '达人退款金额', value: '¥12.78w', trend: -7.71 },
  { key: 'sample_count', label: '寄样达人数', value: '1', trend: -85.71 },
  { key: 'order_count', label: '出单达人数', value: '1,921', trend: 0.73 },
  { key: 'connect_count', label: '建联达人数', value: '46', trend: -13.21 },
  { key: 'shop_sales', label: '店铺成交金额', value: '¥185.9w', trend: -6.07 },
])
const selectedMetrics = ref(['creator_sales', 'creator_refund'])

const rankTabs = ['店铺榜', '商品榜', '达人榜', '团长榜', '部门榜', '媒介榜', '内容榜']
const activeRankTab = ref('达人榜')
const rankTimeOptions = ['日榜', '周榜', '月榜']
const activeRankTime = ref('月榜')
const rankMonth = ref('2026-04')

const rankSalesList = ref([
  { rank: 1, name: '半岛良品官方旗舰店', fans: '128.8w', sales: '54.02w', salesTrend: -26.85 },
  { rank: 2, name: '大威家', fans: '89.2w', sales: '7.85w', salesTrend: 43.65 },
  { rank: 3, name: '小熊美妆', fans: '56.3w', sales: '5.21w', salesTrend: 12.33 },
  { rank: 4, name: '时尚前线', fans: '45.6w', sales: '3.42w', salesTrend: -5.67 },
  { rank: 5, name: '品质生活馆', fans: '38.9w', sales: '2.18w', salesTrend: 8.92 },
])

const rankVolumeList = ref([
  { rank: 1, name: '半岛良品官方旗舰店', fans: '128.8w', volume: '1.78w', volumeTrend: -13.59 },
  { rank: 2, name: '大威家', fans: '89.2w', volume: '2,579', volumeTrend: 8.82 },
  { rank: 3, name: '小熊美妆', fans: '56.3w', volume: '1,856', volumeTrend: 5.21 },
  { rank: 4, name: '时尚前线', fans: '45.6w', volume: '1,234', volumeTrend: -3.45 },
  { rank: 5, name: '品质生活馆', fans: '38.9w', volume: '986', volumeTrend: 2.18 },
])

const handlePlatformChange = (platform) => {
  activePlatform.value = platform
}

const handleQuickTimeChange = (opt) => {
  activeQuickTime.value = opt
}

const handleMetricToggle = (key) => {
  const idx = selectedMetrics.value.indexOf(key)
  if (idx > -1) {
    selectedMetrics.value.splice(idx, 1)
  } else {
    if (selectedMetrics.value.length >= 2) {
      ElMessage.warning('最多可同时选中2个指标')
      return
    }
    selectedMetrics.value.push(key)
  }
}

const handleTutorial = () => {
  ElMessage.info('教程功能开发中')
}

const handleExportImage = () => {
  ElMessage.success('导出成功')
}

const handleConfig = () => {
  ElMessage.info('配置功能开发中')
}

const handleExportTrend = () => {
  ElMessage.success('导出成功')
}

const handleSwitchView = () => {
  ElMessage.info('切换列表视图')
}

const handleViewMore = (type) => {
  ElMessage.info(`查看${type === 'sales' ? '达人成交金额TOP榜' : '达人销量TOP榜'}详情`)
}
</script>

<style lang="scss" scoped>
.command-center-page {
  background: #F5F6F7;
  min-height: calc(100vh - 48px);
  padding-bottom: 16px;
}

/* 顶部导航与筛选区 */
.top-filter-section {
  background: #FFFFFF;
  padding: 16px 24px;
  margin-bottom: 16px;
}

.top-right-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 16px;

  .el-button {
    border-radius: 4px;
  }
}

.filter-row-main {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 12px;
}

.platform-tabs-bar {
  background: #fff;
  border: none;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  padding: 0 16px;
  margin: 0;
}

.platform-tabs {
  display: flex;
  gap: 32px;
}

.platform-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  color: #666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.15s ease;
  position: relative;
  top: 1px;

  &:hover {
    color: #333;
  }

  &.active {
    color: #1677FF;
    font-weight: 500;
    border-bottom-color: #1677FF;
  }

  .platform-icon {
    width: 20px;
    height: 20px;

    &.tiktok-icon {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        border-radius: 6px;
      }
    }

    &.instagram-icon {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }

    &.shopee-icon {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }

    &.lazada-icon {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }
  }
}

.time-filter {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quick-time-btns {
  display: flex;
  gap: 4px;
}

.quick-btn {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #595959;
  transition: all 0.2s;

  &:hover {
    color: #262626;
  }

  &.active {
    background: #FF6B00;
    color: #FFFFFF;
  }
}

.filter-row-sub {
  display: flex;
  align-items: center;
  gap: 24px;
}

.attr-filter, .shop-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  color: #595959;
}

.attr-tabs {
  display: flex;
  gap: 4px;
}

.attr-tab {
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #595959;
  transition: all 0.2s;

  &:hover {
    color: #262626;
  }

  &.active {
    background: #E6F4FF;
    color: #1677FF;
  }
}

.help-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #E8E8E8;
  color: #8C8C8C;
  font-size: 11px;
  cursor: pointer;

  &:hover {
    background: #D9D9D9;
  }
}

/* 核心数据概览区 */
.overview-section {
  padding: 0 24px;
  margin-bottom: 16px;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.overview-card {
  background: #FFFFFF;
  border-radius: 8px;
  padding: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-title {
  font-size: 13px;
  color: #595959;
}

.card-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.setting-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  color: #8C8C8C;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #1677FF;
    background: #E6F4FF;
  }
}

.card-value {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 4px;

  &.primary {
    color: #FF6B00;
  }
}

.card-trend {
  font-size: 13px;
  margin-bottom: 8px;

  &.up {
    color: #FF4D4F;
  }
  &.down {
    color: #52C41A;
  }
}

.trend-arrow {
  margin-right: 2px;
}

.card-sub {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #8C8C8C;
  padding-top: 8px;
  border-top: 1px solid #F0F0F0;
  margin-top: 8px;
}

.trend-text {
  &.up { color: #FF4D4F; }
  &.down { color: #52C41A; }
}

/* 环形图 */
.ring-chart {
  margin-top: 12px;
}

.ring-chart-inner {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: conic-gradient(
    #1677FF var(--pct),
    #52C41A var(--pct),
    #D9D9D9 var(--pct)
  );
  margin: 0 auto 12px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #FFFFFF;
  }
}

.ring-legend {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #8C8C8C;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &.blue { background: #1677FF; }
    &.green { background: #52C41A; }
    &.gray { background: #D9D9D9; }
  }
}

/* 业绩目标卡片 */
.target-card {
  .target-table {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
  }

  .target-row {
    display: grid;
    grid-template-columns: 40px 50px 1fr 50px;
    align-items: center;
    gap: 8px;
  }

  .target-label {
    font-size: 12px;
    color: #595959;
  }

  .target-value {
    font-size: 12px;
    color: #262626;
    text-align: right;
  }

  .target-bar {
    height: 6px;
    background: #E8E8E8;
    border-radius: 3px;
    overflow: hidden;
  }

  .target-progress {
    height: 100%;
    background: #FF4D4F;
    border-radius: 3px;
    width: 0%;
  }

  .target-pct {
    font-size: 11px;
    color: #8C8C8C;
    text-align: right;
  }

  .target-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
    border-top: 1px solid #F0F0F0;
  }

  .target-badge {
    background: #FFF7E6;
    color: #FA8C16;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 12px;
  }
}

/* 数据趋势区 */
.trend-section {
  background: #FFFFFF;
  margin: 0 24px 16px;
  padding: 16px;
  border-radius: 8px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 16px;

  span:first-child {
    font-size: 15px;
    font-weight: 600;
    color: #262626;
  }

  .section-sub {
    font-size: 13px;
    color: #8C8C8C;
  }
}

.section-actions {
  display: flex;
  gap: 8px;
}

/* 指标快捷卡片 */
.metric-cards {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.metric-card {
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    border-color: #1677FF;
  }

  &.selected {
    border-color: #FF4D4F;
    background: #FFF2F0;
  }

  .metric-check {
    position: absolute;
    top: 8px;
    right: 8px;
    color: #FF4D4F;
    font-weight: bold;
  }
}

.metric-label {
  display: block;
  font-size: 12px;
  color: #8C8C8C;
  margin-bottom: 4px;
}

.metric-value {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 4px;
}

.metric-trend {
  font-size: 12px;

  &.up { color: #FF4D4F; }
  &.down { color: #52C41A; }
}

/* 趋势折线图 */
.trend-chart {
  margin-bottom: 16px;
}

.chart-legend {
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #595959;

  .line-dot {
    width: 12px;
    height: 3px;
    border-radius: 2px;

    &.red { background: #FF4D4F; }
    &.green { background: #52C41A; }
  }
}

.chart-area {
  display: flex;
  gap: 8px;
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 0;
  font-size: 11px;
  color: #8C8C8C;
  width: 30px;
  text-align: right;
}

.chart-canvas {
  flex: 1;
  position: relative;
}

.trend-svg {
  width: 100%;
  height: 200px;
}

.chart-x-axis {
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  font-size: 11px;
  color: #8C8C8C;
}

/* 平台成交分布 */
.platform-distribution {
  border-top: 1px solid #F0F0F0;
  padding-top: 16px;
}

.dist-row {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #F5F5F5;

  &:last-child {
    border-bottom: none;
  }
}

.dist-platform {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;

  &.active {
    .dist-name { color: #1677FF; font-weight: 500; }
  }
}

.dist-name {
  width: 60px;
  font-size: 13px;
  color: #595959;
}

.dist-pct {
  width: 80px;
  font-size: 13px;
  color: #262626;
}

.dist-amount {
  font-size: 13px;
  color: #8C8C8C;
}

.dist-ring {
  width: 60px;
  height: 60px;
}

.dist-ring-chart {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(#1677FF 100%, #E8E8E8 0);
}

/* 达人榜单区 */
.rank-section {
  background: #FFFFFF;
  margin: 0 24px;
  padding: 16px;
  border-radius: 8px;
}

.rank-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  border-bottom: 1px solid #F0F0F0;
  padding-bottom: 12px;
}

.rank-tab {
  padding: 6px 16px;
  cursor: pointer;
  font-size: 13px;
  color: #595959;
  transition: all 0.2s;

  &:hover {
    color: #262626;
  }

  &.active {
    color: #262626;
    font-weight: 600;
    border-bottom: 2px solid #262626;
  }
}

.rank-time-btns {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.rank-time-btn {
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #595959;
  transition: all 0.2s;

  &:hover {
    color: #262626;
  }

  &.active {
    background: #FF6B00;
    color: #FFFFFF;
  }
}

/* 榜单表格 */
.rank-table-section {
  margin-bottom: 24px;
}

.table-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.table-title {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.view-more {
  margin-left: auto;
  color: #1677FF;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.rank-table {
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 10px 12px;
    font-size: 13px;
    color: #8C8C8C;
    font-weight: 400;
    border-bottom: 1px solid #F0F0F0;
  }

  td {
    padding: 12px;
    font-size: 13px;
    color: #262626;
    border-bottom: 1px solid #F5F5F5;
  }

  tr:hover td {
    background: #FAFAFA;
  }
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: #E8E8E8;
  font-size: 12px;
  color: #595959;

  &.top3 {
    background: #FFF2F0;
    color: #FF4D4F;
  }
}

.influencer-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.influencer-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #1677FF;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.influencer-detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.influencer-name {
  font-size: 13px;
  color: #262626;
}

.influencer-fans {
  font-size: 11px;
  color: #8C8C8C;
}

/* 绩效设置抽屉 */
.performance-drawer {
  :deep(.el-drawer__body) {
    padding: 0;
  }
}

.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  padding: 16px 24px;
  border-bottom: 1px solid #E8E8E8;
}

.drawer-tabs {
  display: flex;
  gap: 32px;
}

.drawer-tab {
  font-size: 15px;
  color: #65676B;
  cursor: pointer;
  padding-bottom: 12px;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;

  &.active {
    color: #1677FF;
    font-weight: 600;
    border-bottom-color: #1677FF;
  }
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.setting-body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.setting-config {
  background: #F5F6F7;
  border-radius: 8px;
  padding: 16px;
}

.config-row {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.config-label {
  font-size: 13px;
  color: #65676B;
}

.config-hint {
  margin-top: 12px;
  font-size: 12px;
  color: #8C8C8C;
  line-height: 1.5;
}

.type-radio {
  :deep(.el-radio) {
    margin-right: 16px;
  }
}

.setting-main {
  display: flex;
  gap: 24px;
  flex: 1;
  min-height: 400px;
}

.org-tree-panel {
  width: 240px;
  flex-shrink: 0;
  background: #F5F6F7;
  border-radius: 8px;
  padding: 16px;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 12px;
}

.org-tree-node {
  display: flex;
  align-items: center;
  gap: 4px;

  .member-count {
    color: #8C8C8C;
    font-size: 12px;
  }
}

.target-config-panel {
  flex: 1;
  background: #F5F6F7;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
}

.selected-org {
  color: #1677FF;
  font-weight: normal;
}

.target-table-wrapper {
  overflow-x: auto;
}

.target-table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
  font-size: 13px;

  th, td {
    padding: 12px 8px;
    text-align: left;
    border-bottom: 1px solid #E8E8E8;
  }

  th {
    background: #FFFFFF;
    font-weight: 600;
    color: #262626;
    white-space: nowrap;
  }

  .col-org {
    width: 180px;
  }

  .money-cell {
    width: 140px;
  }

  .member-cell {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .department-total-row {
    background: #FFFFFF;
    font-weight: 600;
  }
}

.setting-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #E8E8E8;
}

.detail-body {
  padding: 0;
}

.detail-main {
  display: flex;
  height: 100%;
}

.dept-tree-panel {
  width: 240px;
  flex-shrink: 0;
  background: #F5F6F7;
  padding: 16px;
  border-right: 1px solid #E8E8E8;
}

.report-panel {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.report-config {
  background: #F5F6F7;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}
</style>
