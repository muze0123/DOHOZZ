<template>
  <div class="performance-target">
    <!-- 区块A：平台Tab + 筛选区（合并为一个区块） -->
    <div class="section filter-section">
      <!-- 平台Tab -->
      <div class="platform-tabs-bar">
        <div class="platform-tabs">
          <div
            v-for="platform in platforms"
            :key="platform.value"
            class="platform-tab"
            :class="{ active: currentPlatform === platform.value }"
            @click="handlePlatformChange(platform.value)"
          >
            <div class="platform-icon">{{ platform.icon }}</div>
            <span>{{ platform.name }}</span>
          </div>
        </div>
      </div>

      <!-- 筛选区 -->
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">目标月度</span>
          <el-date-picker
            v-model="filters.month"
            type="month"
            value-format="YYYY-MM"
            placeholder="选择月份"
            style="width: 130px"
          />
        </div>
        <div class="filter-item">
          <span class="filter-label">所属部门</span>
          <el-select v-model="filters.department" placeholder="全部部门" clearable filterable style="width: 140px">
            <el-option label="全部部门" value="" />
            <el-option label="销售一部" value="sales1" />
            <el-option label="销售二部" value="sales2" />
            <el-option label="运营部" value="ops" />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">所属BD</span>
          <el-select v-model="filters.bd" placeholder="全部BD" clearable filterable style="width: 140px">
            <el-option label="全部BD" value="" />
            <el-option label="BD-张三" value="zhangsan" />
            <el-option label="BD-李四" value="lisi" />
            <el-option label="BD-王五" value="wangwu" />
          </el-select>
        </div>
        <div class="filter-actions">
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
        <div class="toolbar-right">
          <el-button type="primary" @click="handleAdd">+ 新增业绩目标</el-button>
        </div>
      </div>
    </div>

    <!-- 月度销售战绩区块 -->
    <div class="section chart-section">
      <div class="chart-header">
        <div class="chart-title">
          <span class="title-text">{{ currentMonthText }} 月度销售战绩</span>
        </div>
        <div class="chart-header-right">
          <span class="days-left">距离月底还有 {{ daysLeft }} 天</span>
        </div>
      </div>
      <div class="chart-cards">
        <div
          v-for="card in chartCards"
          :key="card.key"
          class="chart-card"
          :class="{ selected: selectedCard === card.key }"
          @click="handleCardClick(card.key)"
        >
          <div class="card-label">{{ card.name }}</div>
          <div class="card-values">
            <span v-if="card.type === 'money'" class="card-current">￥{{ formatMoney(card.current) }}</span>
            <span v-else class="card-current">{{ card.current }}</span>
            <span class="card-separator">/</span>
            <span v-if="card.type === 'money'" class="card-target">￥{{ formatMoney(card.target) }}</span>
            <span v-else class="card-target">{{ card.target }}</span>
          </div>
          <div class="card-progress">
            <div class="progress-track">
              <div
                class="progress-fill"
                :style="{ width: Math.min(card.rate, 100) + '%' }"
                :class="{ over: card.rate > 100 }"
              ></div>
            </div>
          </div>
          <div class="card-rate" :class="{ over: card.rate > 100 }">
            <span v-if="card.target === 0">—</span>
            <span v-else>{{ card.rate.toFixed(2) }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 区块C：数据列表 -->
    <div class="section table-section">
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        @row-click="handleRowClick"
        :row-class-name="getRowClassName"
        highlight-current-row
      >
        <el-table-column prop="memberName" label="成员名称" width="180" fixed>
          <template #default="{ row }">
            <div class="member-cell">
              <el-avatar :size="32" :src="row.avatar" />
              <span class="member-name">{{ row.memberName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="所属部门" width="160">
          <template #default="{ row }">
            <span class="department-text">{{ row.department }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-for="metric in metrics"
          :key="metric.key"
          :prop="metric.key"
          :label="metric.name"
          min-width="180"
        >
          <template #default="{ row }">
            <div class="metric-cell">
              <div class="metric-value">
                <span v-if="metric.type === 'money'" class="money">￥{{ formatMoney(row[metric.key].current) }}</span>
                <span v-else class="number">{{ row[metric.key].current }}</span>
                <span class="separator">/</span>
                <span v-if="metric.type === 'money'" class="money target">￥{{ formatMoney(row[metric.key].target) }}</span>
                <span v-else class="number target">{{ row[metric.key].target }}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-track">
                  <div
                    class="progress-fill"
                    :style="{ width: Math.min(row[metric.key].rate, 100) + '%' }"
                    :class="{ over: row[metric.key].rate > 100 }"
                  ></div>
                </div>
              </div>
              <div class="rate-text" :class="{ over: row[metric.key].rate > 100 }">
                <span v-if="row[metric.key].target === 0">—</span>
                <span v-else>{{ row[metric.key].rate.toFixed(2) }}%</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <Pagination
        v-if="total > 0"
        v-model="pagination"
        :total="total"
        @change="handlePageChange"
      />
    </div>

    <!-- 区块D+E：绩效设置抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="null"
      size="90%"
      :before-close="handleDrawerClose"
      class="performance-drawer"
    >
      <template #default>
        <div class="drawer-content">
          <!-- 抽屉标题区 -->
          <div class="drawer-header">
            <div class="drawer-tabs">
              <div
                class="drawer-tab"
                :class="{ active: drawerTab === 'setting' }"
                @click="drawerTab = 'setting'"
              >
                绩效设置
              </div>
              <div
                class="drawer-tab"
                :class="{ active: drawerTab === 'detail' }"
                @click="drawerTab = 'detail'"
              >
                业绩明细
              </div>
            </div>
          </div>

          <!-- 绩效设置Tab -->
          <div v-if="drawerTab === 'setting'" class="drawer-body setting-body">
            <!-- 顶部配置项 -->
            <div class="setting-config">
              <div class="config-row">
                <div class="config-item">
                  <span class="config-label">绩效月份</span>
                  <el-date-picker
                    v-model="settingForm.month"
                    type="month"
                    value-format="YYYY-MM"
                    placeholder="选择月份"
                    style="width: 140px"
                  />
                </div>
                <div class="config-item">
                  <span class="config-label">绩效方式</span>
                  <el-radio-group v-model="settingForm.type" class="type-radio">
                    <el-radio value="department">部门业绩</el-radio>
                    <el-radio value="member">员工业绩</el-radio>
                  </el-radio-group>
                </div>
                <div class="config-item" v-if="settingForm.type === 'department'">
                  <el-checkbox v-model="settingForm.distributeEqually">
                    部门目标平均分配给成员
                  </el-checkbox>
                </div>
              </div>
              <div class="config-hint" v-if="settingForm.type === 'department' && settingForm.distributeEqually">
                将部门业绩平均分配给所属员工，一级部门会减去二级部门的绩效，再平均给所属员工。若不勾选此项，则本次目标仅对部门生效，员工绩效需单独填写。
              </div>
            </div>

            <!-- 左侧组织架构树 + 右侧目标配置 -->
            <div class="setting-main">
              <div class="org-tree-panel">
                <div class="panel-title">选择部门</div>
                <el-tree
                  :data="orgTreeData"
                  :props="{ label: 'name', children: 'children' }"
                  node-key="id"
                  :default-expand-all="false"
                  :expand-on-click-node="false"
                  @node-click="handleOrgNodeClick"
                  highlight-current
                >
                  <template #default="{ node, data }">
                    <span class="org-tree-node">
                      <span>{{ data.name }}</span>
                      <span v-if="data.memberCount" class="member-count">({{ data.memberCount }})</span>
                    </span>
                  </template>
                </el-tree>
              </div>

              <div class="target-config-panel">
                <div class="panel-title">
                  {{ settingForm.type === 'department' ? '部门业绩目标设置' : '员工业绩目标设置' }}
                  <span v-if="selectedOrgNode" class="selected-org">- {{ selectedOrgNode.name }}</span>
                </div>

                <!-- 部门业绩模式 -->
                <div v-if="settingForm.type === 'department'" class="target-table-wrapper">
                  <table class="target-table">
                    <thead>
                      <tr>
                        <th class="col-org">部门/成员</th>
                        <th>达人成交金额（元）</th>
                        <th>建联达人数</th>
                        <th>寄样达人数</th>
                        <th>出单达人数</th>
                        <th>交付视频数 <el-tooltip content="按【视频交付时间】统计所选时间内交付成功的视频数量" placement="top"><span class="hint-icon">?</span></el-tooltip></th>
                        <th>出单视频数 <el-tooltip content="按【出单时间】统计所选时间内出单的视频数量" placement="top"><span class="hint-icon">?</span></el-tooltip></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="department-total-row" v-if="selectedOrgNode">
                        <td class="col-org">{{ selectedOrgNode.name }}（部门目标）</td>
                        <td class="money-cell">
                          <el-input-number
                            v-model="targetForm.departmentTarget.dealAmount"
                            :precision="2"
                            :min="0"
                            controls-position="right"
                            placeholder="请输入"
                          />
                        </td>
                        <td>
                          <el-input-number
                            v-model="targetForm.departmentTarget.contactCount"
                            :precision="0"
                            :min="0"
                            controls-position="right"
                            placeholder="请输入"
                          />
                        </td>
                        <td>
                          <el-input-number
                            v-model="targetForm.departmentTarget.sampleCount"
                            :precision="0"
                            :min="0"
                            controls-position="right"
                            placeholder="请输入"
                          />
                        </td>
                        <td>
                          <el-input-number
                            v-model="targetForm.departmentTarget.orderCount"
                            :precision="0"
                            :min="0"
                            controls-position="right"
                            placeholder="请输入"
                          />
                        </td>
                        <td>
                          <el-input-number
                            v-model="targetForm.departmentTarget.deliveryVideoCount"
                            :precision="0"
                            :min="0"
                            controls-position="right"
                            placeholder="请输入"
                          />
                        </td>
                        <td>
                          <el-input-number
                            v-model="targetForm.departmentTarget.orderVideoCount"
                            :precision="0"
                            :min="0"
                            controls-position="right"
                            placeholder="请输入"
                          />
                        </td>
                      </tr>
                      <tr v-for="member in targetForm.members" :key="member.id">
                        <td class="col-org member-cell">
                          <el-avatar :size="24" :src="member.avatar" />
                          <span>{{ member.name }}</span>
                        </td>
                        <td class="money-cell">
                          <el-input-number
                            v-model="member.dealAmount"
                            :precision="2"
                            :min="0"
                            controls-position="right"
                            placeholder="请输入"
                          />
                        </td>
                        <td>
                          <el-input-number
                            v-model="member.contactCount"
                            :precision="0"
                            :min="0"
                            controls-position="right"
                            placeholder="请输入"
                          />
                        </td>
                        <td>
                          <el-input-number
                            v-model="member.sampleCount"
                            :precision="0"
                            :min="0"
                            controls-position="right"
                            placeholder="请输入"
                          />
                        </td>
                        <td>
                          <el-input-number
                            v-model="member.orderCount"
                            :precision="0"
                            :min="0"
                            controls-position="right"
                            placeholder="请输入"
                          />
                        </td>
                        <td>
                          <el-input-number
                            v-model="member.deliveryVideoCount"
                            :precision="0"
                            :min="0"
                            controls-position="right"
                            placeholder="请输入"
                          />
                        </td>
                        <td>
                          <el-input-number
                            v-model="member.orderVideoCount"
                            :precision="0"
                            :min="0"
                            controls-position="right"
                            placeholder="请输入"
                          />
                        </td>
                      </tr>
                      <tr class="total-row">
                        <td class="col-org">合计</td>
                        <td class="money-cell">{{ formatMoney(targetForm.total.dealAmount) }}</td>
                        <td>{{ targetForm.total.contactCount }}</td>
                        <td>{{ targetForm.total.sampleCount }}</td>
                        <td>{{ targetForm.total.orderCount }}</td>
                        <td>{{ targetForm.total.deliveryVideoCount }}</td>
                        <td>{{ targetForm.total.orderVideoCount }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 员工业绩模式 -->
                <div v-else class="target-table-wrapper">
                  <table class="target-table">
                    <thead>
                      <tr>
                        <th class="col-org">成员</th>
                        <th>达人成交金额（元）</th>
                        <th>建联达人数</th>
                        <th>寄样达人数</th>
                        <th>出单达人数</th>
                        <th>交付视频数 <el-tooltip content="按【视频交付时间】统计所选时间内交付成功的视频数量" placement="top"><span class="hint-icon">?</span></el-tooltip></th>
                        <th>出单视频数 <el-tooltip content="按【出单时间】统计所选时间内出单的视频数量" placement="top"><span class="hint-icon">?</span></el-tooltip></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="member in targetForm.members" :key="member.id">
                        <td class="col-org member-cell">
                          <el-avatar :size="24" :src="member.avatar" />
                          <span>{{ member.name }}</span>
                        </td>
                        <td class="money-cell">
                          <el-input-number
                            v-model="member.dealAmount"
                            :precision="2"
                            :min="0"
                            controls-position="right"
                            placeholder="请输入"
                          />
                        </td>
                        <td>
                          <el-input-number
                            v-model="member.contactCount"
                            :precision="0"
                            :min="0"
                            controls-position="right"
                            placeholder="请输入"
                          />
                        </td>
                        <td>
                          <el-input-number
                            v-model="member.sampleCount"
                            :precision="0"
                            :min="0"
                            controls-position="right"
                            placeholder="请输入"
                          />
                        </td>
                        <td>
                          <el-input-number
                            v-model="member.orderCount"
                            :precision="0"
                            :min="0"
                            controls-position="right"
                            placeholder="请输入"
                          />
                        </td>
                        <td>
                          <el-input-number
                            v-model="member.deliveryVideoCount"
                            :precision="0"
                            :min="0"
                            controls-position="right"
                            placeholder="请输入"
                          />
                        </td>
                        <td>
                          <el-input-number
                            v-model="member.orderVideoCount"
                            :precision="0"
                            :min="0"
                            controls-position="right"
                            placeholder="请输入"
                          />
                        </td>
                      </tr>
                      <tr class="total-row">
                        <td class="col-org">合计</td>
                        <td class="money-cell">{{ formatMoney(targetForm.total.dealAmount) }}</td>
                        <td>{{ targetForm.total.contactCount }}</td>
                        <td>{{ targetForm.total.sampleCount }}</td>
                        <td>{{ targetForm.total.orderCount }}</td>
                        <td>{{ targetForm.total.deliveryVideoCount }}</td>
                        <td>{{ targetForm.total.orderVideoCount }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- 保存按钮 -->
            <div class="setting-footer">
              <el-button @click="handleDrawerClose">取消</el-button>
              <el-button type="primary" @click="handleSaveDepartment" v-if="settingForm.type === 'department'">
                保存部门业绩目标
              </el-button>
              <el-button type="primary" @click="handleSaveMember" v-else>
                保存员工业绩目标
              </el-button>
            </div>
          </div>

          <!-- 业绩明细Tab -->
          <div v-if="drawerTab === 'detail'" class="drawer-body detail-body">
            <div class="detail-main">
              <!-- 左侧部门树 -->
              <div class="dept-tree-panel">
                <div class="panel-title">选择部门</div>
                <el-tree
                  :data="orgTreeData"
                  :props="{ label: 'name', children: 'children' }"
                  node-key="id"
                  :default-expand-all="false"
                  :expand-on-click-node="false"
                  @node-click="handleDetailOrgNodeClick"
                  highlight-current
                >
                  <template #default="{ node, data }">
                    <span class="org-tree-node">
                      <span>{{ data.name }}</span>
                      <span v-if="data.memberCount" class="member-count">({{ data.memberCount }})</span>
                    </span>
                  </template>
                </el-tree>
              </div>

              <!-- 右侧业绩报告 -->
              <div class="report-panel">
                <!-- 报告配置 -->
                <div class="report-config">
                  <div class="config-row">
                    <div class="config-item">
                      <span class="config-label">选择平台</span>
                      <el-select v-model="detailForm.platform" style="width: 120px">
                        <el-option v-for="p in platforms" :key="p.value" :label="p.name" :value="p.value" />
                      </el-select>
                    </div>
                    <div class="config-item">
                      <span class="config-label">业绩月份</span>
                      <el-date-picker
                        v-model="detailForm.month"
                        type="month"
                        value-format="YYYY-MM"
                        style="width: 140px"
                      />
                    </div>
                  </div>
                </div>

                <!-- 业绩报告图表 - 横向卡片样式 -->
                <div class="report-cards">
                  <div
                    v-for="card in detailChartCards"
                    :key="card.key"
                    class="report-card"
                  >
                    <div class="card-label">{{ card.name }}</div>
                    <div class="card-values">
                      <span v-if="card.type === 'money'" class="card-current">￥{{ formatMoney(card.current) }}</span>
                      <span v-else class="card-current">{{ card.current }}</span>
                      <span class="card-separator">/</span>
                      <span v-if="card.type === 'money'" class="card-target">￥{{ formatMoney(card.target) }}</span>
                      <span v-else class="card-target">{{ card.target }}</span>
                    </div>
                    <div class="card-progress">
                      <div class="progress-track">
                        <div
                          class="progress-fill"
                          :style="{ width: Math.min(card.rate, 100) + '%' }"
                          :class="{ over: card.rate > 100 }"
                        ></div>
                      </div>
                    </div>
                    <div class="card-rate" :class="{ over: card.rate > 100 }">
                      <span v-if="card.target === 0">—</span>
                      <span v-else>{{ card.rate.toFixed(2) }}%</span>
                    </div>
                  </div>
                </div>

                <!-- 成员明细列表 -->
                <div class="member-detail-list">
                  <div class="detail-group">
                    <div class="group-title达成">
                      <span class="dot达成"></span>
                      达成目标（{{ detailAchievedMembers.length }}人）
                    </div>
                    <el-table :data="detailAchievedMembers" size="small">
                      <el-table-column prop="memberName" label="成员" width="140">
                        <template #default="{ row }">
                          <div class="member-cell">
                            <el-avatar :size="24" :src="row.avatar" />
                            <span>{{ row.memberName }}</span>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="department" label="所属部门" width="140" />
                      <el-table-column label="成交金额" width="140">
                        <template #default="{ row }">
                          <span class="metric-value">
                            <span class="money">￥{{ formatMoney(row.dealAmount.current) }}</span>
                            <span class="separator">/</span>
                            <span class="money target">￥{{ formatMoney(row.dealAmount.target) }}</span>
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column label="建联达人" width="120">
                        <template #default="{ row }">
                          <span class="metric-value">
                            {{ row.contactCount.current }} / {{ row.contactCount.target }}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column label="寄样达人" width="120">
                        <template #default="{ row }">
                          <span class="metric-value">
                            {{ row.sampleCount.current }} / {{ row.sampleCount.target }}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column label="出单达人" width="120">
                        <template #default="{ row }">
                          <span class="metric-value">
                            {{ row.orderCount.current }} / {{ row.orderCount.target }}
                          </span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>

                  <div class="detail-group">
                    <div class="group-title未达成">
                      <span class="dot未达成"></span>
                      未达成目标（{{ detailUnachievedMembers.length }}人）
                    </div>
                    <el-table :data="detailUnachievedMembers" size="small">
                      <el-table-column prop="memberName" label="成员" width="140">
                        <template #default="{ row }">
                          <div class="member-cell">
                            <el-avatar :size="24" :src="row.avatar" />
                            <span>{{ row.memberName }}</span>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="department" label="所属部门" width="140" />
                      <el-table-column label="成交金额" width="140">
                        <template #default="{ row }">
                          <span class="metric-value">
                            <span class="money">￥{{ formatMoney(row.dealAmount.current) }}</span>
                            <span class="separator">/</span>
                            <span class="money target">￥{{ formatMoney(row.dealAmount.target) }}</span>
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column label="建联达人" width="120">
                        <template #default="{ row }">
                          <span class="metric-value">
                            {{ row.contactCount.current }} / {{ row.contactCount.target }}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column label="寄样达人" width="120">
                        <template #default="{ row }">
                          <span class="metric-value">
                            {{ row.sampleCount.current }} / {{ row.sampleCount.target }}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column label="出单达人" width="120">
                        <template #default="{ row }">
                          <span class="metric-value">
                            {{ row.orderCount.current }} / {{ row.orderCount.target }}
                          </span>
                        </template>
                      </el-table-column>
                    </el-table>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import Pagination from '@/components/Pagination.vue'

// 平台选项
const platforms = [
  { name: 'TikTok', value: 'tiktok', icon: 'TT' },
  { name: 'Instagram', value: 'instagram', icon: 'IG' },
  { name: 'Shopee', value: 'shopee', icon: 'SP' },
  { name: 'Lazada', value: 'lazada', icon: 'LZ' }
]

// 当前平台
const currentPlatform = ref('tiktok')

// 筛选条件
const filters = reactive({
  department: '',
  bd: '',
  month: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10
})
const total = ref(0)

// 加载状态
const loading = ref(false)

// 当前选中行
const currentRow = ref(null)

// 当前选中卡片
const selectedCard = ref('dealAmount')

// 指标配置
const metrics = [
  { key: 'dealAmount', name: '达人成交金额', type: 'money' },
  { key: 'contactCount', name: '建联达人数', type: 'number' },
  { key: 'sampleCount', name: '寄样达人数', type: 'number' },
  { key: 'orderCount', name: '出单达人数', type: 'number' },
  { key: 'deliveryVideoCount', name: '交付视频数', type: 'number' },
  { key: 'orderVideoCount', name: '出单视频数', type: 'number' }
]

// 表格数据
const tableData = ref([])

// 抽屉相关
const drawerVisible = ref(false)
const drawerTab = ref('setting')

// 绩效设置表单
const settingForm = reactive({
  month: '',
  type: 'department',
  distributeEqually: false
})

// 目标配置表单
const targetForm = reactive({
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

// 选中组织架构节点
const selectedOrgNode = ref(null)

// 组织架构树数据
const orgTreeData = ref([
  {
    id: 1,
    name: '销售部',
    memberCount: 12,
    children: [
      { id: 11, name: '销售一部', memberCount: 4 },
      { id: 12, name: '销售二部', memberCount: 5 },
      { id: 13, name: '销售三部', memberCount: 3 }
    ]
  },
  {
    id: 2,
    name: '运营部',
    memberCount: 8,
    children: [
      { id: 21, name: '运营一组', memberCount: 4 },
      { id: 22, name: '运营二组', memberCount: 4 }
    ]
  },
  {
    id: 3,
    name: '市场部',
    memberCount: 6,
    children: []
  }
])

// 业绩明细表单
const detailForm = reactive({
  platform: 'tiktok',
  month: ''
})

// 业绩明细成员数据
const detailMembers = ref([])

// 计算当月剩余天数
const daysLeft = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const lastDay = new Date(year, month + 1, 0).getDate()
  return lastDay - now.getDate()
})

// 当前月份文本
const currentMonthText = computed(() => {
  return filters.month || new Date().toISOString().slice(0, 7)
})

// 达成目标成员
const detailAchievedMembers = computed(() => {
  return detailMembers.value.filter(m => m.dealAmount.current >= m.dealAmount.target)
})

// 未达成目标成员
const detailUnachievedMembers = computed(() => {
  return detailMembers.value.filter(m => m.dealAmount.current < m.dealAmount.target)
})

// 月度销售战绩卡片数据
const chartCards = computed(() => {
  const baseData = {
    dealAmount: { current: 12345.67, target: 100000 },
    contactCount: { current: 35, target: 100 },
    sampleCount: { current: 28, target: 100 },
    orderCount: { current: 15, target: 100 },
    deliveryVideoCount: { current: 8, target: 100 }
  }

  return [
    { key: 'dealAmount', name: '达人成交金额', type: 'money', ...baseData.dealAmount, rate: (baseData.dealAmount.current / baseData.dealAmount.target) * 100 },
    { key: 'contactCount', name: '建联达人数', type: 'number', ...baseData.contactCount, rate: (baseData.contactCount.current / baseData.contactCount.target) * 100 },
    { key: 'sampleCount', name: '寄样达人数', type: 'number', ...baseData.sampleCount, rate: (baseData.sampleCount.current / baseData.sampleCount.target) * 100 },
    { key: 'orderCount', name: '出单达人数', type: 'number', ...baseData.orderCount, rate: (baseData.orderCount.current / baseData.orderCount.target) * 100 },
    { key: 'deliveryVideoCount', name: '交付视频数', type: 'number', ...baseData.deliveryVideoCount, rate: (baseData.deliveryVideoCount.current / baseData.deliveryVideoCount.target) * 100 }
  ]
})

// 业绩明细图表卡片
const detailChartCards = computed(() => {
  return chartCards.value
})

// 格式化金额
const formatMoney = (value) => {
  if (value === null || value === undefined) return '0.00'
  return parseFloat(value).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// 生成模拟数据
const generateMockData = () => {
  const data = []
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
  const departments = ['销售一部 / A组', '销售一部 / B组', '销售二部 / C组', '运营部 / D组']

  for (let i = 0; i < 8; i++) {
    const dealTarget = 100000
    const dealCurrent = Math.random() * 150000
    const row = {
      id: i + 1,
      memberName: names[i],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${names[i]}`,
      department: departments[i % departments.length],
      dealAmount: {
        current: dealCurrent,
        target: dealTarget,
        rate: (dealCurrent / dealTarget) * 100
      },
      contactCount: {
        current: Math.floor(Math.random() * 100),
        target: 100,
        rate: Math.random() * 150
      },
      sampleCount: {
        current: Math.floor(Math.random() * 80),
        target: 100,
        rate: Math.random() * 150
      },
      orderCount: {
        current: Math.floor(Math.random() * 60),
        target: 100,
        rate: Math.random() * 150
      },
      deliveryVideoCount: {
        current: Math.floor(Math.random() * 50),
        target: 100,
        rate: Math.random() * 150
      },
      orderVideoCount: {
        current: Math.floor(Math.random() * 40),
        target: 100,
        rate: Math.random() * 150
      }
    }
    data.push(row)
  }
  return data
}

// 生成业绩明细模拟数据
const generateDetailMembers = () => {
  const data = []
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '刘十二']
  const departments = ['销售一部', '销售二部', '运营部', '市场部']

  for (let i = 0; i < names.length; i++) {
    const dealTarget = 100000 + Math.floor(Math.random() * 50000)
    const dealCurrent = Math.random() * 150000
    const contactTarget = 100
    const contactCurrent = Math.floor(Math.random() * 120)
    const sampleTarget = 80
    const sampleCurrent = Math.floor(Math.random() * 100)
    const orderTarget = 60
    const orderCurrent = Math.floor(Math.random() * 80)

    data.push({
      id: i + 1,
      memberName: names[i],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${names[i]}`,
      department: departments[i % departments.length],
      dealAmount: {
        current: dealCurrent,
        target: dealTarget,
        rate: (dealCurrent / dealTarget) * 100
      },
      contactCount: {
        current: contactCurrent,
        target: contactTarget,
        rate: (contactCurrent / contactTarget) * 100
      },
      sampleCount: {
        current: sampleCurrent,
        target: sampleTarget,
        rate: (sampleCurrent / sampleTarget) * 100
      },
      orderCount: {
        current: orderCurrent,
        target: orderTarget,
        rate: (orderCurrent / orderTarget) * 100
      }
    })
  }
  return data
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  tableData.value = generateMockData()
  total.value = 40
  loading.value = false
}

// 平台切换
const handlePlatformChange = (platform) => {
  currentPlatform.value = platform
  handleQuery()
}

// 查询
const handleQuery = () => {
  pagination.page = 1
  fetchData()
}

// 重置
const handleReset = () => {
  filters.department = ''
  filters.bd = ''
  filters.month = ''
  pagination.page = 1
  handleQuery()
}

// 新增
const handleAdd = () => {
  drawerTab.value = 'setting'
  settingForm.month = filters.month || new Date().toISOString().slice(0, 7)
  settingForm.type = 'department'
  settingForm.distributeEqually = false
  targetForm.departmentTarget = {
    dealAmount: 0,
    contactCount: 0,
    sampleCount: 0,
    orderCount: 0,
    deliveryVideoCount: 0,
    orderVideoCount: 0
  }
  targetForm.members = []
  selectedOrgNode.value = null
  drawerVisible.value = true
}

// 行点击
const handleRowClick = (row) => {
  currentRow.value = row
}

// 卡片点击
const handleCardClick = (key) => {
  selectedCard.value = key
}

// 行样式
const getRowClassName = ({ row }) => {
  return currentRow.value && currentRow.value.id === row.id ? 'current-row' : ''
}

// 分页变化
const handlePageChange = ({ page, pageSize }) => {
  pagination.page = page
  pagination.pageSize = pageSize
  fetchData()
}

// 组织架构树节点点击
const handleOrgNodeClick = (data) => {
  selectedOrgNode.value = data
  // 生成成员模拟数据
  const memberNames = ['张三', '李四', '王五', '赵六']
  targetForm.members = memberNames.map((name, index) => ({
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

// 业绩明细组织架构树节点点击
const handleDetailOrgNodeClick = (data) => {
  detailMembers.value = generateDetailMembers()
}

// 抽屉关闭
const handleDrawerClose = () => {
  drawerVisible.value = false
}

// 保存部门业绩目标
const handleSaveDepartment = () => {
  const deptTotal = targetForm.departmentTarget.dealAmount
  const membersTotal = targetForm.members.reduce((sum, m) => sum + (m.dealAmount || 0), 0)

  if (membersTotal > deptTotal && settingForm.distributeEqually) {
    ElMessage.error('部门的绩效不能小于成员绩效累计之和')
    return
  }

  ElMessage.success('保存成功')
  drawerVisible.value = false
}

// 保存员工业绩目标
const handleSaveMember = () => {
  ElMessage.success('保存成功')
  drawerVisible.value = false
}

onMounted(() => {
  if (!filters.month) {
    filters.month = new Date().toISOString().slice(0, 7)
  }
  detailForm.month = filters.month
  fetchData()
})
</script>

<style lang="scss" scoped>
$meta-blue: #0064E0;
$white: #FFFFFF;
$bg: #f5f7fa;
$divider: #e5e7eb;
$text-1: #050505;
$text-2: #65676B;
$text-3: #BCC0C4;
$primary-text: #050505;
$secondary-text: #65676B;
$border-radius-lg: 12px;
$success: #31A24C;

$transition-fast: 150ms ease;

.performance-target {
  padding: 16px 0 24px;
  min-height: 100%;
  background: $bg;
}

// 通用区块样式
.section {
  background: $white;
  border: 1px solid $divider;
  border-radius: $border-radius-lg;
}

// 筛选区（包含平台Tab）
.filter-section {
  padding: 0 16px 16px;
  margin-top: 16px;
}

// 平台Tab
.platform-tabs-bar {
  margin: 0 -16px;
  padding: 0 16px;
  border-bottom: 1px solid $divider;
}

.platform-tabs {
  display: flex;
  gap: 24px;
}

.platform-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  color: $secondary-text;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all $transition-fast;
  position: relative;
  top: 1px;

  &:hover {
    color: $primary-text;
  }

  &.active {
    color: $meta-blue;
    font-weight: 500;
    border-bottom-color: $meta-blue;
  }

  .platform-icon {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background: $bg;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 600;
    color: $text-2;

    .active & {
      background: $meta-blue;
      color: $white;
    }
  }
}

// 月度销售战绩区块
.chart-section {
  margin-bottom: 16px;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.chart-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-text {
  font-size: 15px;
  font-weight: 600;
  color: $primary-text;
}

.chart-header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.days-left {
  font-size: 13px;
  color: $secondary-text;
}

.chart-cards {
  display: flex;
  gap: 16px;
}

.chart-card {
  flex: 1;
  background: $bg;
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: darken($bg, 2%);
  }

  &.selected {
    background: #e6f0ff;
    border: 1px solid $meta-blue;
  }
}

.card-label {
  font-size: 13px;
  color: $secondary-text;
  margin-bottom: 8px;
}

.card-values {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}

.card-current {
  font-size: 16px;
  font-weight: 600;
  color: $primary-text;
}

.card-separator {
  color: $text-3;
  margin: 0 2px;
}

.card-target {
  font-size: 13px;
  color: $text-3;
}

.card-progress {
  margin-bottom: 4px;
}

.progress-track {
  height: 6px;
  background: darken($bg, 5%);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: $meta-blue;
  border-radius: 3px;
  transition: width 0.3s ease;

  &.over {
    background: $success;
  }
}

.card-rate {
  font-size: 12px;
  color: $secondary-text;

  &.over {
    color: $success;
    font-weight: 500;
  }
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding-top: 16px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  color: $secondary-text;
  white-space: nowrap;
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-right {
  margin-left: auto;
}

// 表格区块
.table-section {
  margin-top: 16px;
  .toolbar {
    margin-bottom: 16px;
  }
}

// 成员名称
.member-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.member-name {
  font-size: 13px;
  color: $primary-text;
}

// 所属部门
.department-text {
  font-size: 12px;
  color: $secondary-text;
}

// 指标单元格
.metric-cell {
  .metric-value {
    display: flex;
    align-items: center;
    gap: 2px;
    margin-bottom: 6px;
  }

  .money {
    font-size: 13px;
    font-weight: 500;
    color: $primary-text;

    &.target {
      color: $text-3;
    }
  }

  .number {
    font-size: 13px;
    font-weight: 500;
    color: $primary-text;

    &.target {
      color: $text-3;
    }
  }

  .separator {
    color: $text-3;
    margin: 0 2px;
  }
}

// 进度条
.progress-bar {
  margin-bottom: 4px;
}

.progress-track {
  height: 6px;
  background: $bg;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: $meta-blue;
  border-radius: 3px;
  transition: width 0.3s ease;

  &.over {
    background: $success;
  }
}

.rate-text {
  font-size: 12px;
  color: $secondary-text;

  &.over {
    color: $meta-blue;
    font-weight: 500;
  }
}

// 表格样式
:deep(.el-table) {
  th.el-table__cell {
    background-color: $bg;
    color: $primary-text;
    font-weight: 600;
    font-size: 13px;
  }
  td.el-table__cell {
    font-size: 13px;
  }

  .current-row {
    background-color: #e6f0ff;
  }
}

// 抽屉样式
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
  border-bottom: 1px solid $divider;
}

.drawer-tabs {
  display: flex;
  gap: 32px;
}

.drawer-tab {
  font-size: 15px;
  color: $secondary-text;
  cursor: pointer;
  padding-bottom: 12px;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;

  &.active {
    color: $meta-blue;
    font-weight: 600;
    border-bottom-color: $meta-blue;
  }
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

// 绩效设置
.setting-body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.setting-config {
  background: $bg;
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
  color: $secondary-text;
}

.config-hint {
  margin-top: 12px;
  font-size: 12px;
  color: $secondary-text;
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
  background: $bg;
  border-radius: 8px;
  padding: 16px;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: $primary-text;
  margin-bottom: 12px;
}

.org-tree-node {
  display: flex;
  align-items: center;
  gap: 4px;

  .member-count {
    color: $secondary-text;
    font-size: 12px;
  }
}

.target-config-panel {
  flex: 1;
  background: $bg;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
}

.selected-org {
  color: $meta-blue;
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
    border-bottom: 1px solid $divider;
  }

  th {
    background: $white;
    font-weight: 600;
    color: $primary-text;
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
    background: $white;
    font-weight: 600;
  }

  .total-row {
    background: $white;
    font-weight: 600;

    td {
      border-top: 2px solid $divider;
    }
  }
}

.hint-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  background: $meta-blue;
  color: $white;
  border-radius: 50%;
  font-size: 10px;
  cursor: help;
  margin-left: 4px;
}

.setting-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid $divider;
}

// 业绩明细
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
  background: $bg;
  padding: 16px;
  border-right: 1px solid $divider;
}

.report-panel {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.report-config {
  background: $bg;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.report-cards {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.report-card {
  flex: 1;
  background: $bg;
  border-radius: 8px;
  padding: 12px 16px;
}

.report-chart-item {
  background: $bg;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;

  .chart-item-title {
    font-size: 14px;
    font-weight: 600;
    color: $primary-text;
    margin-bottom: 12px;
  }
}

.member-detail-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-group {
  .group-title {
    font-size: 14px;
    font-weight: 600;
    color: $primary-text;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .dot达成 {
    background: $success;
  }

  .dot未达成 {
    background: #FF9500;
  }

  .group-title达成 {
    color: $success;
  }

  .group-title未达成 {
    color: #FF9500;
  }
}

// 输入框样式
:deep(.el-input-number) {
  width: 120px;

  .el-input__inner {
    text-align: left;
  }
}

// 分页样式
:deep(.el-pagination) {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>
