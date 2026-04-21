<template>
  <div class="commission-management">
    <!-- 区域A：提成规则区 -->
    <div class="section rule-section">
      <div class="section-header">
        <span class="section-title">提成规则</span>
        <div class="header-actions">
          <span class="help-link">功能说明</span>
          <el-button type="primary" size="small" @click="showRuleDrawer = true">修改规则</el-button>
          <span class="history-link" @click="showHistoryDrawer = true">修改记录</span>
        </div>
      </div>
      <div class="rule-info">
        <div class="rule-item">
          <span class="rule-label">提成方式</span>
          <el-tooltip content="「提成方式」决定是按照「商品」还是「员工」来给定提成比例" placement="top" effect="light">
            <span class="help-icon">?</span>
          </el-tooltip>
          <span class="rule-value">{{ getCommissionTypeName(currentRule.commissionType) }}</span>
          <span class="status-tag" :class="currentRule.enabled ? 'active' : 'inactive'">
            {{ currentRule.enabled ? '已开启' : '未开启' }}
          </span>
        </div>
        <div class="rule-item">
          <span class="rule-label">提成基数</span>
          <el-tooltip :content="getBaseTooltip()" placement="top" effect="light">
            <span class="help-icon">?</span>
          </el-tooltip>
          <span class="rule-value">{{ currentRule.commissionBase }}</span>
        </div>
        <div class="rule-item">
          <span class="rule-label">生效日期</span>
          <el-tooltip content="生效日期 0 点后的订单，将按照以下设置的提成方案计算提成" placement="top" effect="light">
            <span class="help-icon">?</span>
          </el-tooltip>
          <span class="rule-value">{{ currentRule.effectiveDate }}</span>
        </div>
      </div>
    </div>

    <!-- 区域B：提成方案区 -->
    <div class="section plan-section">
      <div class="section-header">
        <span class="section-title">提成方案</span>
        <el-button type="primary" size="small" @click="handleAddPlan">
          <span class="btn-icon">+</span> 新增方案
        </el-button>
      </div>

      <!-- 筛选条件 -->
      <div class="filter-bar">
        <div class="filter-row">
          <template v-if="currentRule.commissionType !== 'product'">
            <div class="filter-item">
              <span class="filter-label">员工筛选</span>
              <el-select v-model="filters.employee" placeholder="全部" clearable filterable style="width: 160px">
                <el-option label="全部" value="" />
                <el-option label="张三" value="zhangsan" />
                <el-option label="李四" value="lisi" />
                <el-option label="王五" value="wangwu" />
              </el-select>
            </div>
          </template>
          <template v-else>
            <div class="filter-item">
              <span class="filter-label">平台</span>
              <el-select v-model="filters.platform" placeholder="全部" style="width: 140px">
                <el-option label="全部" value="" />
                <el-option label="TikTok" value="tiktok" />
                <el-option label="Shopee" value="shopee" />
                <el-option label="Lazada" value="lazada" />
              </el-select>
            </div>
          </template>
          <div class="filter-item">
            <span class="filter-label">方案搜索</span>
            <el-input v-model="filters.planName" placeholder="请输入方案名称" clearable style="width: 160px" />
          </div>
          <template v-if="currentRule.commissionType === 'product'">
            <div class="filter-item">
              <span class="filter-label">商品搜索</span>
              <el-input v-model="filters.productName" placeholder="商品名称/ID" clearable style="width: 160px" />
            </div>
          </template>
        </div>
        <div class="filter-actions">
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </div>
      </div>

      <!-- 未添加提示 -->
      <div v-if="uncoveredCount > 0" class="uncovered-tip">
        <span>当前有 {{ uncoveredCount }} 个{{ currentRule.commissionType === 'product' ? '商品链接' : '员工' }}未添加提成方案。</span>
        <span v-if="hasDefaultPlan">未添加的，将按照默认方案计算提成。</span>
      </div>

      <!-- 方案列表 -->
      <el-table :data="planList" style="width: 100%" v-loading="loading">
        <el-table-column prop="planName" label="方案名称" min-width="150">
          <template #default="{ row }">
            <span class="plan-name-cell">
              <span v-if="row.isDefault" class="default-tag">默认</span>
              {{ row.planName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="currentRule.commissionType === 'tiered' ? '员工提成' : '员工提成'" min-width="200">
          <template #default="{ row }">
            <div class="commission-cell">
              <template v-if="currentRule.commissionType === 'tiered'">
                <div class="tiered-content" :class="{ collapsed: row.collapsed }">
                  <span v-for="(tier, i) in row.tiers.slice(0, 2)" :key="i" class="tier-item">
                    {{ tier.label }}：{{ tier.rate }}%
                  </span>
                  <span v-if="row.tiers.length > 2 && !row.collapsed" class="tier-item">...</span>
                </div>
                <span v-if="row.tiers.length > 2" class="expand-btn" @click="row.collapsed = !row.collapsed">
                  {{ row.collapsed ? '展开' : '收起' }}
                </span>
              </template>
              <template v-else>
                {{ row.commissionRate }}
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="管理提成" min-width="150">
          <template #default="{ row }">
            <div class="commission-cell">
              <template v-if="currentRule.commissionType === 'tiered'">
                <div class="tiered-content" :class="{ collapsed: row.collapsed }">
                  <span v-for="(tier, i) in row.manageTiers.slice(0, 2)" :key="i" class="tier-item">
                    {{ tier.label }}：{{ tier.rate }}%
                  </span>
                </div>
              </template>
              <template v-else>
                {{ row.manageRate || '-' }}
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="userCount" label="适用人员数" width="120">
          <template #default="{ row }">
            <span v-if="row.isDefault" class="no-data">- -</span>
            <span v-else class="link-text">{{ row.userCount }} ></span>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建人" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="160" sortable />
        <el-table-column prop="modifier" label="修改人" width="100" />
        <el-table-column prop="modifyTime" label="修改时间" width="160" sortable />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <div class="action-cell">
              <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
              <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
              <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <div v-if="!loading && planList.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 64 64" width="64" height="64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="#d9d9d9" stroke-width="2"/>
            <path d="M32 18c-7.732 0-14 6.268-14 14s6.268 14 14 14 14-6.268 14-14-6.268-14-14-14z" fill="none" stroke="#d9d9d9" stroke-width="2"/>
            <path d="M32 24v8M32 36h8" stroke="#d9d9d9" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="empty-text">暂无提成方案，点击【+ 新增方案】开始配置</div>
        <el-button type="primary" @click="handleAddPlan">+ 新增方案</el-button>
      </div>

      <!-- 分页 -->
      <Pagination v-if="total > 0" v-model="pagination" :total="total" @change="handlePageChange" />
    </div>

    <!-- 区域C/D：新增/编辑方案抽屉 -->
    <el-drawer v-model="showPlanDrawer" :title="isEditPlan ? '编辑提成方案' : '新增提成方案'" size="500px" direction="rtl">
      <div class="drawer-form">
        <div class="form-item">
          <label class="form-label">方案名称 <span class="required">*</span></label>
          <el-input v-model="planForm.planName" placeholder="请输入方案名称" />
        </div>
        <div class="form-item">
          <label class="form-label">选择方式 <span class="required">*</span></label>
          <el-radio-group v-model="planForm.selectType">
            <el-radio value="specific">指定人员</el-radio>
            <el-radio value="all" :disabled="hasDefaultPlan && !isEditPlan">全部人员</el-radio>
          </el-radio-group>
          <div v-if="hasDefaultPlan && !isEditPlan" class="radio-tip">
            当前已存在一个默认方案，只能有一个默认方案
          </div>
        </div>
        <div class="form-item" v-if="planForm.selectType === 'specific'">
          <label class="form-label">适用人员 <span class="required">*</span></label>
          <el-select v-model="planForm.users" multiple placeholder="请选择人员" style="width: 100%">
            <el-option label="张三" value="zhangsan" />
            <el-option label="李四" value="lisi" />
            <el-option label="王五" value="wangwu" />
          </el-select>
        </div>
        <div class="form-item" v-if="currentRule.commissionType !== 'tiered'">
          <label class="form-label">员工提成比例 <span class="required">*</span></label>
          <el-input v-model="planForm.commissionRate" placeholder="如：12%">
            <template #append>%</template>
          </el-input>
        </div>
        <div class="form-item" v-if="currentRule.commissionType === 'tiered'">
          <label class="form-label">员工提成（分档） <span class="required">*</span></label>
          <div class="tier-inputs">
            <div v-for="(tier, i) in planForm.tiers" :key="i" class="tier-row">
              <el-input v-model="tier.label" placeholder="如：0-2w" style="width: 100px" />
              <span class="tier-sep">月业绩</span>
              <el-input v-model="tier.upper" placeholder="上限" style="width: 80px" />
              <span class="tier-sep">：</span>
              <el-input v-model="tier.rate" placeholder="比例" style="width: 60px" />
              <span class="tier-sep">%</span>
              <el-button v-if="i > 0" text type="danger" @click="removeTier(i)">删除</el-button>
            </div>
            <el-button text type="primary" @click="addTier">+ 添加档位</el-button>
          </div>
        </div>
        <div class="form-item">
          <label class="form-label">管理提成比例</label>
          <el-input v-model="planForm.manageRate" placeholder="选填，如：20%">
            <template #append>%</template>
          </el-input>
        </div>
      </div>
      <div class="drawer-footer">
        <el-button @click="showPlanDrawer = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmitPlan">确定</el-button>
      </div>
    </el-drawer>

    <!-- 区域D：设置提成规则抽屉 -->
    <el-drawer v-model="showRuleDrawer" title="设置提成规则" size="500px" direction="rtl">
      <div class="drawer-form">
        <div class="form-item">
          <label class="form-label">提成方式 <span class="required">*</span></label>
          <el-select v-model="ruleForm.commissionType" style="width: 100%">
            <el-option label="按员工固定提成" value="employee" />
            <el-option label="按员工月业绩分档提成" value="tiered" />
            <el-option label="按商品固定提成" value="product" />
          </el-select>
          <div class="form-tip">改变提成方式将影响方案内容，请谨慎操作</div>
        </div>
        <div class="form-item">
          <label class="form-label">提成基数 <span class="required">*</span></label>
          <el-select v-model="ruleForm.commissionBase" style="width: 100%">
            <el-option label="收货订单实付金额" value="收货订单实付金额" />
            <el-option label="收货订单去佣金额" value="收货订单去佣金额" />
            <el-option label="结算订单实付金额" value="结算订单实付金额" />
            <el-option label="结算订单去佣金额" value="结算订单去佣金额" />
            <el-option label="付款订单去退金额" value="付款订单去退金额" />
          </el-select>
        </div>
        <div class="form-item">
          <label class="form-label">生效日期 <span class="required">*</span></label>
          <el-date-picker v-model="ruleForm.effectiveDate" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width: 100%" />
        </div>
      </div>
      <div class="drawer-footer">
        <el-button @click="showRuleDrawer = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmitRule">保存</el-button>
      </div>
    </el-drawer>

    <!-- 区域E：修改记录抽屉 -->
    <el-drawer v-model="showHistoryDrawer" title="修改记录" size="600px" direction="rtl">
      <div class="history-drawer">
        <!-- 筛选条件区（吸顶）-->
        <div class="history-filters">
          <div class="filter-row">
            <div class="filter-item">
              <span class="filter-label">操作人</span>
              <el-select v-model="historyFilters.operator" placeholder="全部" clearable filterable style="width: 140px">
                <el-option label="全部" value="" />
                <el-option label="张三" value="张三" />
                <el-option label="李四" value="李四" />
                <el-option label="王五" value="王五" />
              </el-select>
            </div>
            <div class="filter-item">
              <span class="filter-label">操作类型</span>
              <el-select v-model="historyFilters.actionType" placeholder="全部" clearable style="width: 160px">
                <el-option label="全部" value="" />
                <el-option label="修改提成规则" value="rule" />
                <el-option label="新增提成方案" value="add" />
                <el-option label="删除提成方案" value="delete" />
                <el-option label="修改提成方案" value="edit" />
              </el-select>
            </div>
            <div class="filter-item">
              <span class="filter-label">方案名称</span>
              <el-input v-model="historyFilters.planName" placeholder="请输入方案名称" clearable style="width: 140px" @keyup.enter="fetchHistory" />
            </div>
          </div>
        </div>

        <!-- 修改记录列表 -->
        <div class="history-list" v-loading="historyLoading">
          <template v-if="filteredHistory.length > 0">
            <div v-for="(record, i) in paginatedHistory" :key="i" class="history-item">
              <div class="history-header">
                <span class="history-time">{{ record.time }}</span>
                <span class="history-operator">操作人：{{ record.operator }}</span>
                <span class="history-type">操作类型：{{ getActionTypeName(record.actionType) }}</span>
              </div>

              <!-- 类型一：修改提成规则 -->
              <template v-if="record.actionType === 'rule'">
                <div class="compare-table">
                  <div class="compare-row header">
                    <span class="compare-field">字段</span>
                    <span class="compare-before">修改前</span>
                    <span class="compare-after">修改后</span>
                  </div>
                  <div v-for="(change, ci) in record.changes" :key="ci" class="compare-row">
                    <span class="compare-field">{{ change.field }}</span>
                    <span class="compare-before">{{ change.before }}</span>
                    <span class="compare-after">{{ change.after }}</span>
                  </div>
                </div>
              </template>

              <!-- 类型二：新增提成方案 -->
              <template v-else-if="record.actionType === 'add'">
                <div class="action-card add">
                  <div class="card-header">
                    <span class="action-tag add">新增</span>
                    <span class="plan-name">{{ record.planName }}</span>
                    <span v-if="record.userCount" class="link-text" @click="showPlanDetail(record)">{{ record.userCount }} ></span>
                  </div>
                  <div class="card-content">
                    <div class="tiered-content" :class="{ collapsed: record.collapsed }">
                      <template v-if="record.tiers && record.tiers.length > 0">
                        <div class="tier-label">员工提成：</div>
                        <span v-for="(tier, ti) in record.tiers.slice(0, 2)" :key="ti" class="tier-item">
                          {{ tier.label }}：{{ tier.rate }}%
                        </span>
                        <span v-if="record.tiers.length > 2" class="tier-item">...</span>
                        <span v-if="record.tiers.length > 2" class="expand-btn" @click="record.collapsed = !record.collapsed">
                          {{ record.collapsed ? '展开' : '收起' }}
                        </span>
                      </template>
                    </div>
                  </div>
                </div>
              </template>

              <!-- 类型三：删除提成方案 -->
              <template v-else-if="record.actionType === 'delete'">
                <div class="action-card delete">
                  <div class="card-header">
                    <span class="action-tag delete">删除</span>
                    <span class="plan-name">{{ record.planName }}</span>
                  </div>
                  <div class="card-content">
                    <div class="info-row">
                      <span class="info-label">员工提成：</span>
                      <span class="info-value">{{ record.commissionRate }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">管理提成：</span>
                      <span class="info-value">{{ record.manageRate || '-' }}</span>
                    </div>
                  </div>
                </div>
              </template>

              <!-- 类型四：修改提成方案 -->
              <template v-else-if="record.actionType === 'edit'">
                <div class="compare-table">
                  <div class="compare-row header">
                    <span class="compare-field">字段</span>
                    <span class="compare-before">修改前</span>
                    <span class="compare-after">修改后</span>
                  </div>
                  <div v-for="(change, ci) in record.changes" :key="ci" class="compare-row">
                    <span class="compare-field">{{ change.field }}</span>
                    <span class="compare-before">
                      <template v-if="change.field === '适用人员数' && change.beforeValue">
                        <span class="link-text" @click="showPlanDetail(record)">{{ change.beforeValue }} ></span>
                      </template>
                      <template v-else>{{ change.before }}</template>
                    </span>
                    <span class="compare-after">
                      <template v-if="change.field === '适用人员数' && change.afterValue">
                        <span class="link-text" @click="showPlanDetail(record)">{{ change.afterValue }} ></span>
                      </template>
                      <template v-else>{{ change.after }}</template>
                    </span>
                  </div>
                </div>
              </template>
            </div>
          </template>

          <!-- 空状态 -->
          <div v-else class="empty-history">
            <svg viewBox="0 0 64 64" width="64" height="64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="#d9d9d9" stroke-width="2"/>
              <path d="M32 18c-7.732 0-14 6.268-14 14s6.268 14 14 14 14-6.268 14-14-6.268-14-14-14z" fill="none" stroke="#d9d9d9" stroke-width="2"/>
              <path d="M32 24v8M32 36h8" stroke="#d9d9d9" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <div class="empty-text" v-if="historyFilters.planName || historyFilters.operator || historyFilters.actionType">
              未找到匹配的修改记录，请调整筛选条件
            </div>
            <div class="empty-text" v-else>暂无修改记录</div>
          </div>
        </div>

        <!-- 分页（吸底）-->
        <div class="history-pagination">
          <Pagination v-if="historyTotal > 0" v-model="historyPagination" :total="historyTotal" @change="handleHistoryPageChange" />
        </div>
      </div>
    </el-drawer>

    <!-- 区域F：删除确认弹窗 -->
    <el-dialog v-model="showDeleteDialog" title="确认删除该提成方案吗？" width="400px">
      <div class="delete-tip">
        删除后，历史订单的提成数据不变，新订单（按下单时间）将不会按照该方案计算提成。
      </div>
      <template #footer>
        <el-button @click="showDeleteDialog = false">取消</el-button>
        <el-button type="danger" @click="confirmDelete">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import Pagination from '@/components/Pagination.vue'

// 提成规则
const currentRule = reactive({
  commissionType: 'employee',
  commissionBase: '结算订单去佣金额',
  effectiveDate: '2026-01-06',
  enabled: true
})

// 提成方式映射
const commissionTypeMap = {
  employee: '按员工固定提成',
  tiered: '按员工月业绩分档提成',
  product: '按商品固定提成'
}

const getCommissionTypeName = (type) => commissionTypeMap[type] || type

// 提成基数说明
const baseTooltipMap = {
  '收货订单实付金额': '统计所选时间付款且「已确认收货」订单的实付金额之和',
  '收货订单去佣金额': '统计所选时间付款且「已确认收货」订单的「实付金额 - 达人预估佣金 - 团长预估服务费」之和',
  '结算订单实付金额': '统计所选时间付款且「已结算」订单的实付金额之和',
  '结算订单去佣金额': '统计所选时间付款且「已结算」订单的「实付金额 - 达人结算佣金 - 团长结算服务费」之和',
  '付款订单去退金额': '统计所选时间付款的订单实付金额之和，剔除退款订单'
}

const getBaseTooltip = () => baseTooltipMap[currentRule.commissionBase] || ''

// 筛选条件
const filters = reactive({
  employee: '',
  platform: '',
  planName: '',
  productName: ''
})

// 分页
const pagination = reactive({ page: 1, pageSize: 10 })
const total = ref(0)
const loading = ref(false)

// 方案列表
const planList = ref([])

// 未覆盖数量
const uncoveredCount = computed(() => {
  return planList.value.filter(p => !p.isDefault && p.userCount === 0).length
})

// 是否有默认方案
const hasDefaultPlan = computed(() => {
  return planList.value.some(p => p.isDefault)
})

// 抽屉状态
const showPlanDrawer = ref(false)
const showRuleDrawer = ref(false)
const showHistoryDrawer = ref(false)
const showDeleteDialog = ref(false)
const isEditPlan = ref(false)
const submitting = ref(false)

// 当前操作的方案
const currentPlan = ref(null)

// 方案表单
const planForm = reactive({
  planName: '',
  selectType: 'specific',
  users: [],
  commissionRate: '',
  manageRate: '',
  tiers: [{ label: '0', upper: '2w', rate: '1' }]
})

// 规则表单
const ruleForm = reactive({
  commissionType: 'employee',
  commissionBase: '结算订单去佣金额',
  effectiveDate: ''
})

// 修改记录筛选
const historyFilters = reactive({
  operator: '',
  actionType: '',
  planName: ''
})

// 修改记录分页
const historyPagination = reactive({ page: 1, pageSize: 10 })
const historyTotal = ref(0)
const historyLoading = ref(false)

// 修改记录列表
const historyList = ref([
  {
    time: '2026-01-06 16:29:38',
    operator: '张三',
    actionType: 'rule',
    changes: [
      { field: '提成方式', before: '按员工月业绩分档提成', after: '按商品固定提成' },
      { field: '提成基数', before: '结算订单去佣金额', after: '结算订单实付金额' }
    ]
  },
  {
    time: '2026-01-05 14:20:00',
    operator: '李四',
    actionType: 'add',
    planName: '新增测试方案',
    userCount: 5,
    commissionRate: '12%',
    manageRate: '15%',
    tiers: [
      { label: '0 < 月业绩 ≤ 2w', rate: '1' },
      { label: '2w < 月业绩 ≤ 10w', rate: '3' },
      { label: '10w < 月业绩', rate: '5' }
    ],
    collapsed: true
  },
  {
    time: '2026-01-04 10:15:00',
    operator: '王五',
    actionType: 'delete',
    planName: '测试删除方案',
    commissionRate: '10%',
    manageRate: '12%'
  },
  {
    time: '2026-01-03 09:30:00',
    operator: '张三',
    actionType: 'edit',
    planName: '销售部方案',
    changes: [
      { field: '员工提成', before: '12%', after: '15%' },
      { field: '管理提成', before: '18%', after: '20%' }
    ]
  }
])

// 筛选后的记录
const filteredHistory = computed(() => {
  return historyList.value.filter(item => {
    if (historyFilters.operator && item.operator !== historyFilters.operator) return false
    if (historyFilters.actionType && item.actionType !== historyFilters.actionType) return false
    if (historyFilters.planName && !item.planName?.includes(historyFilters.planName)) return false
    return true
  })
})

// 分页后的记录
const paginatedHistory = computed(() => {
  const start = (historyPagination.page - 1) * historyPagination.pageSize
  const end = start + historyPagination.pageSize
  return filteredHistory.value.slice(start, end)
})

// 获取操作类型名称
const getActionTypeName = (type) => {
  const map = {
    rule: '修改提成规则',
    add: '新增提成方案',
    delete: '删除提成方案',
    edit: '修改提成方案'
  }
  return map[type] || type
}

// 模拟数据
const mockPlans = [
  {
    id: '1',
    planName: '默认方案',
    isDefault: true,
    commissionRate: '12%',
    manageRate: '20%',
    userCount: 0,
    creator: '张三',
    createTime: '2026-01-01 10:00:00',
    modifier: '张三',
    modifyTime: '2026-01-06 14:30:00',
    tiers: [
      { label: '0 < 月业绩 ≤ 2w', upper: '2w', rate: '1' },
      { label: '2w < 月业绩 ≤ 10w', upper: '10w', rate: '3' },
      { label: '10w < 月业绩', upper: '', rate: '5' }
    ],
    collapsed: true
  },
  {
    id: '2',
    planName: '销售部方案',
    isDefault: false,
    commissionRate: '15%',
    manageRate: '25%',
    userCount: 5,
    creator: '李四',
    createTime: '2026-01-02 11:00:00',
    modifier: '李四',
    modifyTime: '2026-01-05 16:00:00',
    tiers: [],
    collapsed: true
  },
  {
    id: '3',
    planName: '运营部方案',
    isDefault: false,
    commissionRate: '10%',
    manageRate: '18%',
    userCount: 3,
    creator: '王五',
    createTime: '2026-01-03 09:00:00',
    modifier: '王五',
    modifyTime: '2026-01-04 12:00:00',
    tiers: [],
    collapsed: true
  }
]

// 获取方案列表
const fetchPlans = () => {
  loading.value = true
  setTimeout(() => {
    planList.value = [...mockPlans]
    total.value = mockPlans.length
    loading.value = false
  }, 500)
}

// 获取修改记录
const fetchHistory = () => {
  historyLoading.value = true
  historyTotal.value = filteredHistory.value.length
  setTimeout(() => {
    historyLoading.value = false
  }, 300)
}

// 查询
const handleQuery = () => {
  pagination.page = 1
  fetchPlans()
}

// 重置
const handleReset = () => {
  filters.employee = ''
  filters.platform = ''
  filters.planName = ''
  filters.productName = ''
  handleQuery()
}

// 分页变化
const handlePageChange = ({ page, pageSize }) => {
  pagination.page = page
  pagination.pageSize = pageSize
  fetchPlans()
}

// 修改记录分页变化
const handleHistoryPageChange = ({ page, pageSize }) => {
  historyPagination.page = page
  historyPagination.pageSize = pageSize
}

// 新增方案
const handleAddPlan = () => {
  isEditPlan.value = false
  planForm.planName = ''
  planForm.selectType = 'specific'
  planForm.users = []
  planForm.commissionRate = ''
  planForm.manageRate = ''
  planForm.tiers = [{ label: '0', upper: '2w', rate: '1' }]
  showPlanDrawer.value = true
}

// 编辑方案
const handleEdit = (row) => {
  isEditPlan.value = true
  currentPlan.value = row
  planForm.planName = row.planName
  planForm.selectType = row.isDefault ? 'all' : 'specific'
  planForm.users = []
  planForm.commissionRate = row.commissionRate
  planForm.manageRate = row.manageRate
  planForm.tiers = row.tiers.length > 0 ? [...row.tiers] : [{ label: '0', upper: '2w', rate: '1' }]
  showPlanDrawer.value = true
}

// 详情
const handleDetail = (row) => {
  ElMessage.info('跳转至方案详情页面')
}

// 显示方案详情
const showPlanDetail = (record) => {
  ElMessage.info('跳转至方案详情页面')
}

// 删除
const handleDelete = (row) => {
  currentPlan.value = row
  showDeleteDialog.value = true
}

// 确认删除
const confirmDelete = () => {
  const index = planList.value.findIndex(p => p.id === currentPlan.value.id)
  if (index > -1) {
    planList.value.splice(index, 1)
    ElMessage.success('删除成功')
  }
  showDeleteDialog.value = false
}

// 提交方案
const handleSubmitPlan = () => {
  if (!planForm.planName.trim()) {
    ElMessage.warning('请输入方案名称')
    return
  }
  if (planForm.selectType === 'specific' && planForm.users.length === 0) {
    ElMessage.warning('请选择适用人员')
    return
  }
  if (currentRule.commissionType !== 'tiered' && !planForm.commissionRate) {
    ElMessage.warning('请输入员工提成比例')
    return
  }

  submitting.value = true
  setTimeout(() => {
    ElMessage.success(isEditPlan.value ? '保存成功' : '新增成功')
    submitting.value = false
    showPlanDrawer.value = false
    fetchPlans()
  }, 500)
}

// 提交规则
const handleSubmitRule = () => {
  if (!ruleForm.effectiveDate) {
    ElMessage.warning('请选择生效日期')
    return
  }

  submitting.value = true
  setTimeout(() => {
    currentRule.commissionType = ruleForm.commissionType
    currentRule.commissionBase = ruleForm.commissionBase
    currentRule.effectiveDate = ruleForm.effectiveDate
    ElMessage.success('保存成功')
    submitting.value = false
    showRuleDrawer.value = false
    historyList.value.unshift({
      time: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-'),
      operator: '当前用户',
      actionType: 'rule',
      changes: [
        { field: '提成方式', before: getCommissionTypeName(currentRule.commissionType), after: getCommissionTypeName(ruleForm.commissionType) }
      ]
    })
    fetchHistory()
  }, 500)
}

// 分档操作
const addTier = () => {
  planForm.tiers.push({ label: '', upper: '', rate: '' })
}

const removeTier = (index) => {
  planForm.tiers.splice(index, 1)
}

// 监听修改记录抽屉打开
watch(showHistoryDrawer, (val) => {
  if (val) {
    historyPagination.page = 1
    fetchHistory()
  }
})

onMounted(() => {
  fetchPlans()
})
</script>

<style lang="scss" scoped>
$primary: #0064E0;
$white: #FFFFFF;
$bg: #f5f7fa;
$divider: #e5e7eb;
$text-1: #050505;
$text-2: #65676B;
$text-3: #BCC0C4;
$primary-text: #050505;
$secondary-text: #65676B;
$border-radius-lg: 12px;
$success-green: #31A24C;
$warning-orange: #FF7A00;

.commission-management {
  padding: 16px;
  min-height: 100%;
}

// 通用区块样式
.section {
  background: $white;
  border-radius: $border-radius-lg;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid $divider;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: $primary-text;
}

// 提成规则区
.rule-section {
  .header-actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .help-link, .history-link {
    font-size: 13px;
    color: $primary;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}

.rule-info {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
}

.rule-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rule-label {
  font-size: 13px;
  color: $secondary-text;
}

.rule-value {
  font-size: 13px;
  color: $primary-text;
  font-weight: 500;
}

.help-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #e5e7eb;
  color: $text-3;
  font-size: 10px;
  cursor: help;
}

.status-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  &.active {
    background: #f6ffed;
    color: $success-green;
    border: 1px solid $success-green;
  }
  &.inactive {
    background: #f5f5f5;
    color: $text-3;
    border: 1px solid $divider;
  }
}

// 筛选栏
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  background: $bg;
  border-radius: 8px;
  margin-bottom: 16px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
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
  gap: 8px;
}

// 未覆盖提示
.uncovered-tip {
  font-size: 13px;
  color: $warning-orange;
  background: #fff7e6;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 16px;
}

// 方案列表
.plan-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.default-tag {
  padding: 2px 6px;
  background: $warning-orange;
  color: #fff;
  font-size: 10px;
  border-radius: 4px;
}

.commission-cell {
  .tiered-content {
    &.collapsed {
      max-height: 40px;
      overflow: hidden;
    }
  }
  .tier-item {
    display: block;
    font-size: 12px;
    color: $text-2;
  }
  .expand-btn {
    font-size: 12px;
    color: $primary;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}

.link-text {
  color: $primary;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}

.no-data {
  color: $text-3;
}

.action-cell {
  display: flex;
  gap: 8px;
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
  gap: 16px;
}

.empty-icon {
  margin-bottom: 8px;
}

.empty-text {
  font-size: 14px;
  color: $text-3;
}

// 抽屉表单
.drawer-form {
  padding: 0 16px;
}

.form-item {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 13px;
  color: $primary-text;
  margin-bottom: 8px;
}

.required {
  color: #ff4d4f;
}

.form-tip {
  font-size: 12px;
  color: $warning-orange;
  margin-top: 4px;
}

.radio-tip {
  font-size: 12px;
  color: $text-3;
  margin-top: 4px;
}

.tier-inputs {
  .tier-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .tier-sep {
    font-size: 12px;
    color: $secondary-text;
  }
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid $divider;
}

// 修改记录抽屉
.history-drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.history-filters {
  padding: 12px 16px;
  background: $bg;
  border-radius: 8px;
  margin: 16px;
  flex-shrink: 0;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px;
}

.history-item {
  padding: 16px 0;
  border-bottom: 1px solid $divider;
  &:last-child {
    border-bottom: none;
  }
}

.history-header {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
}

.history-time {
  font-size: 13px;
  color: $text-3;
}

.history-operator, .history-type {
  font-size: 13px;
  color: $secondary-text;
}

// 对比表格
.compare-table {
  background: $bg;
  border-radius: 8px;
  overflow: hidden;
}

.compare-row {
  display: grid;
  grid-template-columns: 100px 1fr 1fr;
  border-bottom: 1px solid $divider;
  &:last-child {
    border-bottom: none;
  }
  &.header {
    background: darken($bg, 3%);
    font-weight: 600;
    font-size: 12px;
    color: $primary-text;
  }
}

.compare-field {
  padding: 8px 12px;
  font-size: 12px;
  color: $secondary-text;
  border-right: 1px solid $divider;
}

.compare-before, .compare-after {
  padding: 8px 12px;
  font-size: 12px;
  color: $primary-text;
}

// 操作卡片
.action-card {
  background: $bg;
  border-radius: 8px;
  padding: 12px;
  &.add {
    border-left: 3px solid $success-green;
  }
  &.delete {
    border-left: 3px solid #ff4d4f;
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.action-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  &.add {
    background: #f6ffed;
    color: $success-green;
  }
  &.delete {
    background: #fff1f0;
    color: #ff4d4f;
  }
}

.plan-name {
  font-size: 13px;
  color: $primary-text;
  font-weight: 500;
}

.card-content {
  padding-left: 4px;
}

.info-row {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
  &:last-child {
    margin-bottom: 0;
  }
}

.info-label {
  font-size: 12px;
  color: $secondary-text;
}

.info-value {
  font-size: 12px;
  color: $primary-text;
}

.tier-label {
  font-size: 12px;
  color: $secondary-text;
  margin-bottom: 4px;
}

.tier-item {
  display: inline-block;
  font-size: 12px;
  color: $text-2;
  margin-right: 8px;
}

// 修改记录分页
.history-pagination {
  padding: 16px;
  border-top: 1px solid $divider;
  flex-shrink: 0;
}

// 空状态
.empty-history {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  gap: 16px;
}

// 删除提示
.delete-tip {
  font-size: 14px;
  color: $text-2;
  line-height: 1.6;
  padding: 20px 0;
}

// Tooltip 样式
:deep(.el-tooltip__popper) {
  background: #fff !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  max-width: 280px;
  padding: 0;
  .el-tooltip__content {
    padding: 10px 12px;
    color: #4e5969;
    font-family: PingFang SC;
    font-size: 12px;
    line-height: 20px;
  }
  .el-tooltip__arrow::before {
    background: #fff;
    border-color: #e5e7eb;
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
}

.btn-icon {
  margin-right: 4px;
}
</style>
