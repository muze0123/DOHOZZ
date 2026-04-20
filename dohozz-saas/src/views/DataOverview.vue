<template>
  <div class="data-overview">
    <!-- 时间筛选栏 -->
    <div class="filter-bar">
      <div class="filter-left">
        <span class="filter-label">时间筛选：</span>
        <div class="date-quick-btns">
          <span
            v-for="tab in dateQuickTabs"
            :key="tab"
            class="quick-btn"
            :class="{ active: activeQuickDate === tab }"
            @click="activeQuickDate = tab"
          >{{ tab }}</span>
        </div>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          size="small"
          class="date-range-picker"
        />
      </div>
      <div class="filter-right">
        <div class="period-toggle">
          <span
            v-for="p in ['日', '周', '月']"
            :key="p"
            class="period-btn"
            :class="{ active: activePeriod === p }"
            @click="activePeriod = p"
          >{{ p }}</span>
        </div>
      </div>
    </div>

    <!-- 数据概览 KPI -->
    <div class="section-block">
      <div class="section-head">
        <span class="section-title">数据概览</span>
        <span class="section-sub">数据更新于：2025/11/26 12:00:00</span>
      </div>
      <div class="kpi-cards">
        <div v-for="(kpi, idx) in kpiList" :key="idx" class="kpi-card">
          <div class="kpi-label">
            {{ kpi.label }}
            <span class="kpi-unit" v-if="kpi.unit">({{ kpi.unit }})</span>
          </div>
          <div class="kpi-value" :class="kpi.valueClass">{{ kpi.value }}</div>
          <div class="kpi-trend">
            <span :class="kpi.trendClass">{{ kpi.trendIcon }} {{ kpi.trend }}</span>
          </div>
        </div>
      </div>

      <!-- 趋势折线图 -->
      <div class="trend-chart-area">
        <svg class="trend-chart" viewBox="0 0 900 220" preserveAspectRatio="none">
          <!-- Grid lines -->
          <line x1="50" y1="20" x2="50" y2="190" stroke="#f0f0f0" stroke-width="1"/>
          <line x1="50" y1="190" x2="870" y2="190" stroke="#e8e8e8" stroke-width="1"/>
          <line x1="50" y1="150" x2="870" y2="150" stroke="#f5f5f5" stroke-width="1" stroke-dasharray="4"/>
          <line x1="50" y1="110" x2="870" y2="110" stroke="#f5f5f5" stroke-width="1" stroke-dasharray="4"/>
          <line x1="50" y1="70" x2="870" y2="70" stroke="#f5f5f5" stroke-width="1" stroke-dasharray="4"/>
          <line x1="50" y1="30" x2="870" y2="30" stroke="#f5f5f5" stroke-width="1" stroke-dasharray="4"/>
          <!-- Y-axis labels -->
          <text x="40" y="193" text-anchor="end" fill="#999" font-size="11">0</text>
          <text x="40" y="153" text-anchor="end" fill="#999" font-size="11">10w</text>
          <text x="40" y="113" text-anchor="end" fill="#999" font-size="11">20w</text>
          <text x="40" y="73" text-anchor="end" fill="#999" font-size="11">30w</text>
          <text x="40" y="33" text-anchor="end" fill="#999" font-size="11">40w</text>
          <!-- Line 1 - 销售金额 (blue) -->
          <polyline fill="none" stroke="#1677ff" stroke-width="2"
            points="80,140 180,120 280,90 380,100 480,60 580,80 680,50 780,70 850,65"/>
          <!-- Line 2 - 达人金额 (orange) -->
          <polyline fill="none" stroke="#fa8c16" stroke-width="2" stroke-dasharray="6 3"
            points="80,160 180,150 280,130 380,140 480,110 580,125 680,100 780,115 850,108"/>
          <!-- X-axis labels -->
          <text x="80" y="208" fill="#999" font-size="11" text-anchor="middle">2024.03.27</text>
          <text x="180" y="208" fill="#999" font-size="11" text-anchor="middle">2025.06.04</text>
          <text x="280" y="208" fill="#999" font-size="11" text-anchor="middle">04.01-04.07</text>
          <text x="380" y="208" fill="#999" font-size="11" text-anchor="middle">2025.10.30</text>
          <text x="480" y="208" fill="#999" font-size="11" text-anchor="middle">2025.11.05</text>
          <text x="580" y="208" fill="#999" font-size="11" text-anchor="middle">2025.12.18</text>
          <text x="680" y="208" fill="#999" font-size="11" text-anchor="middle">2026.01.09</text>
          <text x="780" y="208" fill="#999" font-size="11" text-anchor="middle">2026.04.09</text>
          <!-- Dots -->
          <circle cx="480" cy="60" r="4" fill="#1677ff"/>
          <circle cx="680" cy="50" r="4" fill="#1677ff"/>
        </svg>
        <div class="chart-legend">
          <span class="legend-item"><span class="legend-line blue"></span>销售总金额</span>
          <span class="legend-item"><span class="legend-line orange dashed"></span>达成出单金额</span>
        </div>
      </div>
    </div>

    <!-- GMV分布 -->
    <div class="gmv-row">
      <!-- 团购GMV分布 -->
      <div class="section-block half">
        <div class="section-head">
          <span class="section-title">团购GMV分布</span>
        </div>
        <div class="gmv-chart-content">
          <div class="gmv-stats">
            <div class="gmv-total-label">合作出单金额<span class="gmv-arrow">▼</span></div>
            <div class="gmv-total-value">¥133.32w</div>
            <div class="gmv-detail">XXX品牌/产品<br>¥113,000 12.0%</div>
          </div>
          <div class="donut-chart">
            <svg viewBox="0 0 160 160" width="160" height="160">
              <circle cx="80" cy="80" r="60" fill="none" stroke="#e8e8e8" stroke-width="24"/>
              <circle cx="80" cy="80" r="60" fill="none" stroke="#1677ff" stroke-width="24"
                stroke-dasharray="188.5 188.5" stroke-dashoffset="0" transform="rotate(-90 80 80)"/>
              <circle cx="80" cy="80" r="60" fill="none" stroke="#91caff" stroke-width="24"
                stroke-dasharray="94.2 282.8" stroke-dashoffset="-188.5" transform="rotate(-90 80 80)"/>
              <circle cx="80" cy="80" r="60" fill="none" stroke="#bae0ff" stroke-width="24"
                stroke-dasharray="47.1 329.9" stroke-dashoffset="-282.7" transform="rotate(-90 80 80)"/>
            </svg>
          </div>
          <div class="gmv-legend">
            <div class="legend-row"><span class="dot" style="background:#1677ff"></span>XXX品牌/产品</div>
            <div class="legend-row"><span class="dot" style="background:#91caff"></span>XXX品牌/产品</div>
            <div class="legend-row"><span class="dot" style="background:#bae0ff"></span>XXX品牌/产品</div>
          </div>
        </div>
      </div>

      <!-- 数据GMV分布 -->
      <div class="section-block half">
        <div class="section-head">
          <span class="section-title">数据GMV分布</span>
        </div>
        <div class="gmv-chart-content">
          <div class="gmv-stats">
            <div class="stat-row"><span class="stat-label">全部</span><span class="stat-pct">25%</span></div>
            <div class="stat-row"><span class="stat-label">已出单</span><span class="stat-pct">38%</span></div>
            <div class="stat-row"><span class="stat-label">待出单</span><span class="stat-pct">12%</span></div>
            <div class="stat-row"><span class="stat-label">待发货</span><span class="stat-pct">15%</span></div>
            <div class="stat-row"><span class="stat-label">已完成</span><span class="stat-pct">10%</span></div>
          </div>
          <div class="donut-chart">
            <svg viewBox="0 0 160 160" width="160" height="160">
              <circle cx="80" cy="80" r="60" fill="none" stroke="#e8e8e8" stroke-width="24"/>
              <circle cx="80" cy="80" r="60" fill="none" stroke="#597ef7" stroke-width="24"
                stroke-dasharray="94.2 282.8" stroke-dashoffset="0" transform="rotate(-90 80 80)"/>
              <circle cx="80" cy="80" r="60" fill="none" stroke="#73d13d" stroke-width="24"
                stroke-dasharray="143.3 233.7" stroke-dashoffset="-94.2" transform="rotate(-90 80 80)"/>
              <circle cx="80" cy="80" r="60" fill="none" stroke="#ffc53d" stroke-width="24"
                stroke-dasharray="45.2 331.8" stroke-dashoffset="-237.5" transform="rotate(-90 80 80)"/>
              <circle cx="80" cy="80" r="60" fill="none" stroke="#ff7875" stroke-width="24"
                stroke-dasharray="56.5 320.5" stroke-dashoffset="-282.7" transform="rotate(-90 80 80)"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 店铺数据 -->
    <div class="section-block">
      <div class="section-head">
        <span class="section-title">店铺数据</span>
      </div>
      <div class="store-summary-cards">
        <div class="store-card highlight">
          <div class="store-card-label">达人出单人数<span class="info-icon">ⓘ</span></div>
          <div class="store-card-value">8888</div>
          <div class="store-card-bar">
            <div class="bar-fill" style="width:65%;background:linear-gradient(90deg,#1677ff,#69b1ff)"></div>
          </div>
          <div class="store-card-pct">占比 18.5%</div>
        </div>
        <div class="store-card">
          <div class="store-card-label">达人产出金额<span class="info-icon">ⓘ</span></div>
          <div class="store-card-value">8888</div>
          <div class="store-card-pct">占比 11%</div>
        </div>
      </div>

      <!-- 店铺数据表格 -->
      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>排序</th>
              <th>平台</th>
              <th>头像</th>
              <th>开发商/网店 <span class="sort-icon">↕</span></th>
              <th>下单总价</th>
              <th>退货发件</th>
              <th>完成/签发人</th>
              <th>佣金/提成/利润</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in storeTableData" :key="idx">
              <td>
                <span class="rank-num" :class="{ top: idx < 3 }">{{ idx + 1 }}</span>
              </td>
              <td>
                <div class="platform-cell">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#333">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                  <span>{{ row.platform }}</span>
                </div>
              </td>
              <td>
                <div class="avatar-group">
                  <el-avatar :size="24" v-for="n in 3" :key="n" class="mini-avatar" />
                </div>
              </td>
              <td>{{ row.store }}</td>
              <td>{{ row.totalPrice }}</td>
              <td>{{ row.returns }}</td>
              <td>{{ row.complete }}</td>
              <td>
                <span class="commission-text" :class="{ negative: row.profitNegative }">{{ row.commission }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-pagination">
        <div class="page-btn active">1</div>
        <div class="page-btn">2</div>
        <div class="page-btn">3</div>
        <div class="page-btn">4</div>
        <div class="page-btn">5</div>
        <div class="page-btn">…</div>
        <div class="page-btn">43</div>
        <span class="page-size-info">10条/页 第1/5页</span>
      </div>
    </div>

    <!-- 营销概况 -->
    <div class="section-block">
      <div class="section-head">
        <span class="section-title">营销概况</span>
      </div>
      <div class="marketing-cards">
        <div v-for="(m, idx) in marketingKpis" :key="idx" class="marketing-card">
          <div class="marketing-label">{{ m.label }}<span class="info-icon">ⓘ</span></div>
          <div class="marketing-value">{{ m.value }}</div>
          <div class="marketing-trend" v-if="m.trend">
            <span :class="m.trendClass">{{ m.trend }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 样品到期趋势 + 案例TCO分布 -->
    <div class="gmv-row">
      <div class="section-block half">
        <div class="section-head">
          <span class="section-title">样品到期趋势</span>
        </div>
        <div class="bar-chart-area">
          <svg class="bar-chart-svg" viewBox="0 0 400 200" preserveAspectRatio="none">
            <!-- Y axis labels -->
            <text x="30" y="185" fill="#999" font-size="10" text-anchor="end">0</text>
            <text x="30" y="145" fill="#999" font-size="10" text-anchor="end">50</text>
            <text x="30" y="105" fill="#999" font-size="10" text-anchor="end">100</text>
            <text x="30" y="65" fill="#999" font-size="10" text-anchor="end">150</text>
            <text x="30" y="25" fill="#999" font-size="10" text-anchor="end">200</text>
            <!-- Grid lines -->
            <line x1="35" y1="180" x2="390" y2="180" stroke="#f0f0f0" stroke-width="1"/>
            <line x1="35" y1="140" x2="390" y2="140" stroke="#f5f5f5" stroke-width="1" stroke-dasharray="3"/>
            <line x1="35" y1="100" x2="390" y2="100" stroke="#f5f5f5" stroke-width="1" stroke-dasharray="3"/>
            <line x1="35" y1="60" x2="390" y2="60" stroke="#f5f5f5" stroke-width="1" stroke-dasharray="3"/>
            <line x1="35" y1="20" x2="390" y2="20" stroke="#f5f5f5" stroke-width="1" stroke-dasharray="3"/>
            <!-- Bars -->
            <rect x="55" y="80" width="20" height="100" fill="#91caff" rx="2"/>
            <rect x="95" y="60" width="20" height="120" fill="#91caff" rx="2"/>
            <rect x="135" y="100" width="20" height="80" fill="#91caff" rx="2"/>
            <rect x="175" y="40" width="20" height="140" fill="#91caff" rx="2"/>
            <rect x="215" y="120" width="20" height="60" fill="#91caff" rx="2"/>
            <rect x="255" y="70" width="20" height="110" fill="#91caff" rx="2"/>
            <rect x="295" y="90" width="20" height="90" fill="#91caff" rx="2"/>
            <rect x="335" y="50" width="20" height="130" fill="#91caff" rx="2"/>
            <!-- X labels -->
            <text x="65" y="195" fill="#999" font-size="9" text-anchor="middle">01/15达人名</text>
            <text x="105" y="195" fill="#999" font-size="9" text-anchor="middle">02/15达人名</text>
            <text x="145" y="195" fill="#999" font-size="9" text-anchor="middle">03/15达人名</text>
            <text x="185" y="195" fill="#999" font-size="9" text-anchor="middle">04/15达人名</text>
            <text x="225" y="195" fill="#999" font-size="9" text-anchor="middle">05/15达人名</text>
            <text x="265" y="195" fill="#999" font-size="9" text-anchor="middle">06/15达人名</text>
            <text x="305" y="195" fill="#999" font-size="9" text-anchor="middle">07/15达人名</text>
            <text x="345" y="195" fill="#999" font-size="9" text-anchor="middle">08/15达人名</text>
          </svg>
          <div class="chart-legend small">
            <span class="legend-item"><span class="legend-box" style="background:#91caff"></span>到货批次</span>
            <span class="legend-item"><span class="legend-line orange dashed"></span>发件趋势 0.75%</span>
          </div>
        </div>
      </div>

      <div class="section-block half">
        <div class="section-head">
          <span class="section-title">案例TCO分布</span>
        </div>
        <div class="bar-chart-area">
          <svg class="bar-chart-svg" viewBox="0 0 400 200" preserveAspectRatio="none">
            <!-- Y axis labels -->
            <text x="30" y="185" fill="#999" font-size="10" text-anchor="end">0%</text>
            <text x="30" y="145" fill="#999" font-size="10" text-anchor="end">10%</text>
            <text x="30" y="105" fill="#999" font-size="10" text-anchor="end">20%</text>
            <text x="30" y="65" fill="#999" font-size="10" text-anchor="end">30%</text>
            <text x="30" y="25" fill="#999" font-size="10" text-anchor="end">40%</text>
            <!-- Grid lines -->
            <line x1="35" y1="180" x2="390" y2="180" stroke="#f0f0f0" stroke-width="1"/>
            <line x1="35" y1="140" x2="390" y2="140" stroke="#f5f5f5" stroke-width="1" stroke-dasharray="3"/>
            <line x1="35" y1="100" x2="390" y2="100" stroke="#f5f5f5" stroke-width="1" stroke-dasharray="3"/>
            <line x1="35" y1="60" x2="390" y2="60" stroke="#f5f5f5" stroke-width="1" stroke-dasharray="3"/>
            <line x1="35" y1="20" x2="390" y2="20" stroke="#f5f5f5" stroke-width="1" stroke-dasharray="3"/>
            <!-- Stacked Bars -->
            <rect x="60" y="60" width="30" height="60" fill="#597ef7" rx="2"/>
            <rect x="60" y="120" width="30" height="60" fill="#91caff" rx="2"/>
            <rect x="120" y="40" width="30" height="80" fill="#597ef7" rx="2"/>
            <rect x="120" y="120" width="30" height="60" fill="#91caff" rx="2"/>
            <rect x="180" y="80" width="30" height="40" fill="#597ef7" rx="2"/>
            <rect x="180" y="120" width="30" height="60" fill="#91caff" rx="2"/>
            <rect x="240" y="50" width="30" height="70" fill="#597ef7" rx="2"/>
            <rect x="240" y="120" width="30" height="60" fill="#91caff" rx="2"/>
            <rect x="300" y="70" width="30" height="50" fill="#597ef7" rx="2"/>
            <rect x="300" y="120" width="30" height="60" fill="#91caff" rx="2"/>
            <rect x="360" y="90" width="30" height="30" fill="#597ef7" rx="2"/>
            <rect x="360" y="120" width="30" height="60" fill="#91caff" rx="2"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 合作漏斗 + 营销漏斗 -->
    <div class="gmv-row">
      <div class="section-block half">
        <div class="section-head">
          <span class="section-title">合作漏斗</span>
        </div>
        <div class="funnel-chart">
          <div class="funnel-bar" v-for="(f, idx) in funnelCooperation" :key="idx">
            <span class="funnel-label">{{ f.label }}</span>
            <div class="funnel-bar-bg">
              <div class="funnel-bar-fill" :style="{ width: f.pct + '%', background: f.color }"></div>
            </div>
            <span class="funnel-value">{{ f.value }}</span>
          </div>
          <div class="funnel-footer">
            历史全部出单达人中 XXX 预达人/XX下单产品人数 <span class="link">处理</span>
          </div>
        </div>
      </div>

      <div class="section-block half">
        <div class="section-head">
          <span class="section-title">营销漏斗</span>
        </div>
        <div class="funnel-chart">
          <div class="funnel-bar" v-for="(f, idx) in funnelMarketing" :key="idx">
            <span class="funnel-label">{{ f.label }}</span>
            <div class="funnel-bar-bg">
              <div class="funnel-bar-fill" :style="{ width: f.pct + '%', background: f.color }"></div>
            </div>
            <span class="funnel-value">{{ f.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 排行榜 -->
    <div class="section-block">
      <div class="section-head">
        <span class="section-title">排行榜</span>
        <div class="rank-toggle">
          <span class="rank-btn" :class="{ active: rankType === 'amount' }" @click="rankType = 'amount'">金额</span>
          <span class="rank-btn" :class="{ active: rankType === 'count' }" @click="rankType = 'count'">人数</span>
        </div>
      </div>
      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>排行</th>
              <th>姓名</th>
              <th>时间</th>
              <th>签约金额</th>
              <th>主导人数</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, idx) in rankData" :key="idx">
              <td>
                <span class="rank-num" :class="{ top: idx < 3 }">{{ idx + 1 }}</span>
              </td>
              <td>
                <div class="bd-info-cell">
                  <el-avatar :size="24" class="mini-avatar" />
                  <span>{{ r.name }}</span>
                </div>
              </td>
              <td>{{ r.time }}</td>
              <td>{{ r.amount }}</td>
              <td>{{ r.count }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-pagination">
        <div class="page-btn active">1</div>
        <div class="page-btn">2</div>
        <div class="page-btn">3</div>
        <div class="page-btn">4</div>
        <div class="page-btn">5</div>
        <div class="page-btn">…</div>
        <div class="page-btn">43</div>
        <span class="page-size-info">1条/页 10/页 第1/3页</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElAvatar } from 'element-plus'

const dateQuickTabs = ['昨天', '近7天', '近30天', '近90天']
const activeQuickDate = ref('近7天')
const dateRange = ref(null)
const activePeriod = ref('日')
const rankType = ref('amount')

const kpiList = reactive([
  { label: '销售总金额', unit: '元', value: '¥132.32w', trend: '较上月↑16%', trendIcon: '📈', trendClass: 'trend-up', valueClass: '' },
  { label: '买入总金额', unit: '元', value: '¥52.32w', trend: '较上月↑38%', trendIcon: '', trendClass: 'trend-up', valueClass: '' },
  { label: '达人达成金额', unit: '元', value: '¥123.12w', trend: '较上月↓1.4%', trendIcon: '', trendClass: 'trend-down', valueClass: '' },
  { label: '出入产包数', unit: '个', value: '100', trend: '较上月↓30%', trendIcon: '', trendClass: 'trend-down', valueClass: '' },
  { label: '入库/出库金额', unit: '元', value: '¥52.32w', trend: '较上月↑48%', trendIcon: '', trendClass: 'trend-up', valueClass: '' },
  { label: '合作单', unit: '个', value: '69', trend: '较上月↑48%', trendIcon: '', trendClass: 'trend-up', valueClass: '' }
])

const storeTableData = reactive([
  { platform: 'TikTok', store: '大 12.5k', totalPrice: '100', returns: '80', complete: '68', commission: '0% / 66% / 2.5%', profitNegative: false },
  { platform: 'TikTok', store: '大 12.5k', totalPrice: '100', returns: '80', complete: '68', commission: '68% / 12% / 1.5%', profitNegative: false },
  { platform: 'Shopee', store: '大 12.5k', totalPrice: '100', returns: '20', complete: '68', commission: '60% / 12% / 1.7%', profitNegative: false },
  { platform: 'Lazada', store: '大 12.5k', totalPrice: '100', returns: '80', complete: '68', commission: '59% / 23% / 2.6%', profitNegative: true },
  { platform: 'Lazada', store: '大 12.5k', totalPrice: '100', returns: '80', complete: '68', commission: '98% / 2.8% / 7.4%', profitNegative: false }
])

const marketingKpis = reactive([
  { label: '待开发达人', value: '826', trend: '较上周 ↑3.4%', trendClass: 'trend-up' },
  { label: '跟进中达人', value: '125', trend: '较上周 ↑1%', trendClass: 'trend-up' },
  { label: '已推荐达人', value: '836', trend: '', trendClass: '' },
  { label: '签约达人', value: '125', trend: '较上周 ↑3.4%', trendClass: 'trend-up' },
  { label: '签约率/签约达人', value: '52%', trend: '较上周 ↑3.4%', trendClass: 'trend-up' }
])

const funnelCooperation = reactive([
  { label: '建联达人', pct: 100, color: '#1677ff', value: '3,265' },
  { label: '回复达人', pct: 72, color: '#4096ff', value: '2,351' },
  { label: '寄样达人', pct: 48, color: '#69b1ff', value: '1,568' },
  { label: '出单达人', pct: 25, color: '#91caff', value: '816' }
])

const funnelMarketing = reactive([
  { label: '浏览量', pct: 100, color: '#597ef7', value: '12,568' },
  { label: '点击量', pct: 65, color: '#85a5ff', value: '8,169' },
  { label: '加购量', pct: 35, color: '#adc6ff', value: '4,399' },
  { label: '下单量', pct: 18, color: '#d6e4ff', value: '2,262' }
])

const rankData = reactive([
  { name: '张三', time: '7.0%', amount: '¥12.03', count: '18' },
  { name: '张三', time: '7.0%', amount: '¥12.03', count: '18' },
  { name: '张三', time: '20%', amount: '¥12.03', count: '18' },
  { name: '张三', time: '30%', amount: '¥12.03', count: '18' },
  { name: '张三', time: '30%', amount: '¥12.03', count: '18' }
])
</script>

<style lang="scss" scoped>
$primary: #1677ff;
$text-primary: #1e293b;
$text-secondary: #64748b;
$text-muted: #94a3b8;
$border-color: #e8e8e8;
$bg-light: #f7f8fa;
$radius: 8px;
$transition: 150ms ease;

.data-overview {
  padding: 0;
}

// 时间筛选栏
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #fff;
  border-bottom: 1px solid $border-color;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 13px;
  color: $text-secondary;
  white-space: nowrap;
}

.date-quick-btns {
  display: flex;
  gap: 4px;
}

.quick-btn {
  padding: 4px 12px;
  font-size: 13px;
  border-radius: 4px;
  cursor: pointer;
  color: $text-secondary;
  background: $bg-light;
  border: 1px solid transparent;
  transition: all $transition;

  &:hover {
    color: $primary;
  }

  &.active {
    background: #e6f4ff;
    color: $primary;
    border-color: $primary;
  }
}

.date-range-picker {
  :deep(.el-input__wrapper) {
    height: 28px;
  }
}

.period-toggle {
  display: flex;
  border: 1px solid $border-color;
  border-radius: 4px;
  overflow: hidden;
}

.period-btn {
  padding: 4px 14px;
  font-size: 13px;
  cursor: pointer;
  color: $text-secondary;
  background: #fff;
  border-right: 1px solid $border-color;
  transition: all $transition;

  &:last-child {
    border-right: none;
  }

  &:hover {
    color: $primary;
  }

  &.active {
    background: $primary;
    color: #fff;
  }
}

// 通用 Section
.section-block {
  background: #fff;
  border-radius: $radius;
  border: 1px solid $border-color;
  margin: 16px 20px;
  padding: 20px;

  &.half {
    flex: 1;
    min-width: 0;
    margin: 0;
  }
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: $text-primary;
}

.section-sub {
  font-size: 12px;
  color: $text-muted;
}

// KPI Cards
.kpi-cards {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.kpi-card {
  padding: 16px;
  background: $bg-light;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.kpi-label {
  font-size: 12px;
  color: $text-secondary;
  margin-bottom: 8px;
}

.kpi-unit {
  color: $text-muted;
}

.kpi-value {
  font-size: 22px;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 6px;
}

.kpi-trend {
  font-size: 12px;
}

.trend-up {
  color: #f5222d;
}

.trend-down {
  color: #52c41a;
}

// Trend Chart
.trend-chart-area {
  margin-top: 8px;
}

.trend-chart {
  width: 100%;
  height: 220px;
}

.chart-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: 8px;

  &.small {
    margin-top: 4px;
    gap: 16px;
  }
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: $text-secondary;
}

.legend-line {
  display: inline-block;
  width: 20px;
  height: 2px;

  &.blue {
    background: $primary;
  }

  &.orange {
    background: #fa8c16;
  }

  &.dashed {
    border-top: 2px dashed #fa8c16;
    background: none;
    height: 0;
  }
}

.legend-box {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

// GMV Row
.gmv-row {
  display: flex;
  gap: 16px;
  padding: 0 20px;
  margin-bottom: 0;
  margin-top: 16px;
}

.gmv-chart-content {
  display: flex;
  align-items: center;
  gap: 24px;
}

.gmv-stats {
  flex: 1;
  min-width: 120px;
}

.gmv-total-label {
  font-size: 12px;
  color: $text-secondary;
}

.gmv-arrow {
  font-size: 10px;
  margin-left: 4px;
}

.gmv-total-value {
  font-size: 20px;
  font-weight: 700;
  color: $text-primary;
  margin: 4px 0 8px;
}

.gmv-detail {
  font-size: 12px;
  color: $text-muted;
  line-height: 1.6;
}

.donut-chart {
  flex-shrink: 0;
}

.gmv-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: $text-secondary;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: 13px;
}

.stat-label {
  color: $text-secondary;
}

.stat-pct {
  font-weight: 600;
  color: $text-primary;
}

// Store Data
.store-summary-cards {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.store-card {
  flex: 1;
  padding: 16px;
  background: $bg-light;
  border-radius: 8px;
  border: 1px solid #f0f0f0;

  &.highlight {
    border: 1px solid $primary;
    background: #f0f7ff;
  }
}

.store-card-label {
  font-size: 12px;
  color: $text-secondary;
  margin-bottom: 8px;
}

.info-icon {
  font-size: 11px;
  color: $text-muted;
  margin-left: 4px;
  cursor: help;
}

.store-card-value {
  font-size: 24px;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 8px;
}

.store-card-bar {
  height: 6px;
  background: #e8e8e8;
  border-radius: 3px;
  margin-bottom: 6px;
  overflow: hidden;

  .bar-fill {
    height: 100%;
    border-radius: 3px;
  }
}

.store-card-pct {
  font-size: 12px;
  color: $text-muted;
}

// Data Table
.data-table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th {
    text-align: left;
    padding: 10px 12px;
    background: $bg-light;
    color: $text-secondary;
    font-weight: 500;
    border-bottom: 1px solid $border-color;
    white-space: nowrap;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid #f5f5f5;
    color: $text-primary;
  }

  tr:hover td {
    background: #fafafa;
  }
}

.sort-icon {
  color: $text-muted;
  font-size: 11px;
}

.rank-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 12px;
  color: $text-secondary;
  background: $bg-light;

  &.top {
    background: $primary;
    color: #fff;
  }
}

.platform-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.avatar-group {
  display: flex;
  gap: -4px;

  .mini-avatar {
    border: 2px solid #fff;
    margin-left: -6px;
    background: #d9d9d9;

    &:first-child {
      margin-left: 0;
    }
  }
}

.commission-text {
  font-size: 12px;

  &.negative {
    color: #f5222d;
  }
}

.bd-info-cell {
  display: flex;
  align-items: center;
  gap: 8px;

  .mini-avatar {
    background: #d9d9d9;
  }
}

// Pagination
.table-pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 16px;
  padding: 8px 0;
}

.page-btn {
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid $border-color;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 12px;
  color: $text-secondary;
  transition: all $transition;

  &:hover {
    border-color: $primary;
    color: $primary;
  }

  &.active {
    background: $primary;
    border-color: $primary;
    color: #fff;
  }
}

.page-size-info {
  font-size: 12px;
  color: $text-muted;
  margin-left: 12px;
}

// Marketing Cards
.marketing-cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.marketing-card {
  padding: 16px;
  background: $bg-light;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.marketing-label {
  font-size: 12px;
  color: $text-secondary;
  margin-bottom: 8px;
}

.marketing-value {
  font-size: 22px;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 4px;
}

.marketing-trend {
  font-size: 12px;
}

// Bar Charts
.bar-chart-area {
  padding: 8px 0;
}

.bar-chart-svg {
  width: 100%;
  height: 200px;
}

// Funnel
.funnel-chart {
  padding: 8px 0;
}

.funnel-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.funnel-label {
  font-size: 12px;
  color: $text-secondary;
  width: 70px;
  text-align: right;
  flex-shrink: 0;
}

.funnel-bar-bg {
  flex: 1;
  height: 24px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.funnel-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}

.funnel-value {
  font-size: 13px;
  font-weight: 600;
  color: $text-primary;
  width: 60px;
  text-align: right;
  flex-shrink: 0;
}

.funnel-footer {
  font-size: 12px;
  color: $text-muted;
  margin-top: 8px;
  padding-left: 82px;

  .link {
    color: $primary;
    cursor: pointer;
  }
}

// Rank Toggle
.rank-toggle {
  display: flex;
  border: 1px solid $border-color;
  border-radius: 4px;
  overflow: hidden;
}

.rank-btn {
  padding: 3px 12px;
  font-size: 12px;
  cursor: pointer;
  color: $text-secondary;
  background: #fff;
  border-right: 1px solid $border-color;
  transition: all $transition;

  &:last-child {
    border-right: none;
  }

  &.active {
    background: $primary;
    color: #fff;
  }
}

// Responsive
@media (max-width: 1200px) {
  .kpi-cards {
    grid-template-columns: repeat(3, 1fr);
  }

  .marketing-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .gmv-row {
    flex-direction: column;
  }

  .kpi-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .marketing-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
