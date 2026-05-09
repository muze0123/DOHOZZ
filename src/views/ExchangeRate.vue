<template>
  <div class="exchange-rate">
    <!-- 页面标题区 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">汇率列表</h2>
        <span class="update-time">
          数据更新时间：{{ lastUpdateTime }}
          <el-tooltip content="每天0:00更新汇率" placement="top">
            <el-icon class="help-icon"><QuestionFilled /></el-icon>
          </el-tooltip>
        </span>
      </div>
      <div class="header-right">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索货币符号/货币名称"
          clearable
          @clear="handleSearchClear"
          @keyup.enter="handleSearch"
          class="search-input"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>

    <!-- 提示语区 -->
    <div class="warning-banner">
      <el-icon class="warning-icon"><WarningFilled /></el-icon>
      <span class="warning-text">
        当前页面提供了"历史汇率"修改功能，历史汇率修改将会影响到修改日期内所有"未回款"订单，并对财务报表和利润计算产生影响。如您需要修改"已回款"订单的汇率，请前往
        <router-link to="/order-management" target="_blank" class="link">订单管理</router-link>
        页面进行修改。
      </span>
    </div>

    <!-- 汇率列表 -->
    <div class="rate-list">
      <el-table :data="filteredRateList" style="width: 100%">
        <el-table-column prop="symbol" label="货币符号" min-width="100" />
        <el-table-column prop="name" label="货币名称" min-width="120" />
        <el-table-column label="官方汇率" min-width="180">
          <template #default="{ row }">
            <span class="rate-text">
              1 {{ row.symbol }} = {{ row.officialRate }} CNY
            </span>
            <el-tooltip content="汇率取自官方汇率，每天0:00更新汇率" placement="top">
              <el-icon class="help-icon"><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="执行汇率类型" min-width="160">
          <template #default="{ row }">
            <span v-if="row.exchangeType === 'fixed'" class="type-text">
              固定汇率：{{ row.fixedRate }} CNY
            </span>
            <span v-else class="type-text">
              汇率折扣比例：{{ row.discountRate }}%
            </span>
            <el-tooltip :content="row.exchangeType === 'fixed' ? '固定汇率：用户自定义的固定汇率' : '汇率折扣：当天官方汇率乘以折扣比例计算的汇率'" placement="top">
              <el-icon class="help-icon"><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="执行汇率" min-width="180">
          <template #default="{ row }">
            <span class="rate-text">
              1 {{ row.symbol }} = {{ row.executionRate }} CNY
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
              <el-button type="primary" link @click="handleHistory(row)">历史汇率</el-button>
              <el-button type="primary" link @click="handleLog(row)">日志</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="filteredRateList.length === 0" class="empty-state">
        <el-empty :description="searchKeyword ? '暂无搜索结果' : '暂无汇率数据'" />
      </div>
    </div>

    <!-- 编辑汇率弹窗 -->
    <el-dialog v-model="editDialogVisible" title="编辑汇率" width="500px" @close="handleEditDialogClose">
      <div class="edit-form" v-if="currentCurrency">
        <div class="form-row">
          <span class="label">货币符号：</span>
          <span class="value">{{ currentCurrency.symbol }}</span>
        </div>
        <div class="form-row">
          <span class="label">货币名称：</span>
          <span class="value">{{ currentCurrency.name }}</span>
        </div>
        <div class="form-row">
          <span class="label">官方汇率：</span>
          <span class="value">1 {{ currentCurrency.symbol }} = {{ currentCurrency.officialRate }} CNY</span>
        </div>

        <div class="form-divider"></div>

        <div class="form-row">
          <span class="label">执行汇率类型：</span>
        </div>
        <div class="form-row radio-group">
          <el-radio v-model="editForm.exchangeType" value="fixed">固定汇率</el-radio>
          <el-radio v-model="editForm.exchangeType" value="discount">汇率折扣</el-radio>
        </div>

        <div class="form-row" v-if="editForm.exchangeType === 'fixed'">
          <span class="label">固定汇率值：</span>
          <el-input
            v-model="editForm.fixedRate"
            placeholder="请输入固定汇率值"
            class="rate-input"
          />
          <span class="unit">CNY</span>
        </div>
        <div class="form-row" v-if="editForm.exchangeType === 'fixed'">
          <span v-if="editFormErrors.fixedRate" class="error-text">{{ editFormErrors.fixedRate }}</span>
        </div>

        <div class="form-row" v-if="editForm.exchangeType === 'discount'">
          <span class="label">汇率折扣比例：</span>
          <el-input
            v-model="editForm.discountRate"
            placeholder="请输入汇率折扣比例"
            class="rate-input"
          />
          <span class="unit">%</span>
        </div>
        <div class="form-row" v-if="editForm.exchangeType === 'discount'">
          <span v-if="editFormErrors.discountRate" class="error-text">{{ editFormErrors.discountRate }}</span>
        </div>

        <div class="form-divider"></div>

        <div class="form-row result-row">
          <span class="label">执行汇率：</span>
          <span class="value execution-rate">
            1 {{ currentCurrency.symbol }} = {{ calculatedExecutionRate }} CNY
          </span>
        </div>
      </div>
      <template #footer>
        <el-button @click="handleEditDialogClose">取消</el-button>
        <el-button type="primary" @click="handleSaveEdit">保存</el-button>
      </template>
    </el-dialog>

    <!-- 历史汇率弹窗 -->
    <el-dialog v-model="historyDialogVisible" title="历史汇率" width="600px" @close="historyDialogVisible = false">
      <div class="history-form" v-if="currentCurrency">
        <div class="form-row">
          <span class="label">货币符号：</span>
          <span class="value">{{ currentCurrency.symbol }}</span>
        </div>
        <div class="form-row">
          <span class="label">货币名称：</span>
          <span class="value">{{ currentCurrency.name }}</span>
        </div>

        <div class="history-list">
          <el-table :data="historyList" style="width: 100%">
            <el-table-column prop="date" label="日期" min-width="120" />
            <el-table-column prop="officialRate" label="官方汇率" min-width="120">
              <template #default="{ row }">
                {{ row.officialRate }}
              </template>
            </el-table-column>
            <el-table-column prop="executionRate" label="执行汇率" min-width="120">
              <template #default="{ row }">
                {{ row.executionRate }}
              </template>
            </el-table-column>
          </el-table>

          <div v-if="historyList.length === 0" class="empty-state">
            <el-empty description="暂无历史汇率" />
          </div>
        </div>

        <div class="pagination-wrapper">
          <Pagination
            v-model="historyPagination"
            :total="historyTotal"
            :page-sizes="[10, 20, 50]"
          />
        </div>
      </div>
      <template #footer>
        <el-button @click="historyDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 日志弹窗 -->
    <el-dialog v-model="logDialogVisible" title="日志" width="700px" @close="logDialogVisible = false">
      <div class="log-list">
        <el-table :data="logList" style="width: 100%">
          <el-table-column prop="operateTime" label="操作时间" min-width="160" />
          <el-table-column prop="operator" label="操作人" min-width="100" />
          <el-table-column prop="operateType" label="操作类型" min-width="100" />
          <el-table-column prop="operateContent" label="操作内容" min-width="300" />
        </el-table>

        <div v-if="logList.length === 0" class="empty-state">
          <el-empty description="暂无操作日志" />
        </div>
      </div>

      <div class="pagination-wrapper">
        <Pagination
          v-model="logPagination"
          :total="logTotal"
          :page-sizes="[10, 20, 50]"
        />
      </div>
      <template #footer>
        <el-button @click="logDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, QuestionFilled, WarningFilled } from '@element-plus/icons-vue'
import router from '@/router'
import Pagination from '@/components/Pagination.vue'

// Mock货币数据
const mockCurrencyList = [
  { id: 'c1', symbol: 'PHP', name: '菲律宾比索', officialRate: 0.11438, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 },
  { id: 'c2', symbol: 'VND', name: '越南盾', officialRate: 0.0002595, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 },
  { id: 'c3', symbol: 'USD', name: '美元', officialRate: 7.1564, exchangeType: 'discount', fixedRate: '', discountRate: 98.00 },
  { id: 'c4', symbol: 'EUR', name: '欧元', officialRate: 7.8234, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 },
  { id: 'c5', symbol: 'GBP', name: '英镑', officialRate: 9.1546, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 },
  { id: 'c6', symbol: 'JPY', name: '日元', officialRate: 0.04785, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 },
  { id: 'c7', symbol: 'KRW', name: '韩元', officialRate: 0.005382, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 },
  { id: 'c8', symbol: 'THB', name: '泰铢', officialRate: 0.2125, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 },
  { id: 'c9', symbol: 'MYR', name: '马来西亚林吉特', officialRate: 1.6562, exchangeType: 'fixed', fixedRate: 1.65, discountRate: 100.00 },
  { id: 'c10', symbol: 'SGD', name: '新加坡元', officialRate: 5.3841, exchangeType: 'discount', fixedRate: '', discountRate: 99.50 },
  { id: 'c11', symbol: 'IDR', name: '印度尼西亚盾', officialRate: 0.0004502, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 },
  { id: 'c12', symbol: 'INR', name: '印度卢比', officialRate: 0.08562, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 },
  { id: 'c13', symbol: 'AUD', name: '澳大利亚元', officialRate: 4.7523, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 },
  { id: 'c14', symbol: 'NZD', name: '新西兰元', officialRate: 4.3589, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 },
  { id: 'c15', symbol: 'CAD', name: '加拿大元', officialRate: 5.2845, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 },
  { id: 'c16', symbol: 'CHF', name: '瑞士法郎', officialRate: 8.1256, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 },
  { id: 'c17', symbol: 'HKD', name: '港元', officialRate: 0.9178, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 },
  { id: 'c18', symbol: 'TWD', name: '新台币', officialRate: 0.2289, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 },
  { id: 'c19', symbol: 'CNY', name: '人民币', officialRate: 1.0000, exchangeType: 'fixed', fixedRate: 1.0000, discountRate: 100.00 },
  { id: 'c20', symbol: 'AED', name: '阿联酋迪拉姆', officialRate: 1.9488, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 },
  { id: 'c21', symbol: 'SAR', name: '沙特里亚尔', officialRate: 1.9091, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 },
  { id: 'c22', symbol: 'BRL', name: '巴西雷亚尔', officialRate: 1.2534, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 },
  { id: 'c23', symbol: 'MXN', name: '墨西哥比索', officialRate: 0.3928, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 },
  { id: 'c24', symbol: 'ZAR', name: '南非兰特', officialRate: 0.4256, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 },
  { id: 'c25', symbol: 'RUB', name: '俄罗斯卢布', officialRate: 0.0785, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 },
  { id: 'c26', symbol: 'TRY', name: '土耳其里拉', officialRate: 0.2198, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 },
  { id: 'c27', symbol: 'PLN', name: '波兰兹罗提', officialRate: 1.8234, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 },
  { id: 'c28', symbol: 'SEK', name: '瑞典克朗', officialRate: 0.6892, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 },
  { id: 'c29', symbol: 'NOK', name: '挪威克朗', officialRate: 0.6854, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 },
  { id: 'c30', symbol: 'DKK', name: '丹麦克朗', officialRate: 1.0502, exchangeType: 'discount', fixedRate: '', discountRate: 100.00 }
]

// 计算执行汇率
function calculateExecutionRate(currency) {
  if (currency.exchangeType === 'fixed') {
    return parseFloat(currency.fixedRate) || 0
  }
  return currency.officialRate * (currency.discountRate / 100)
}

const currencyList = ref(mockCurrencyList.map(c => ({
  ...c,
  executionRate: calculateExecutionRate(c).toFixed(6)
})))

// 搜索
const searchKeyword = ref('')
const lastUpdateTime = '2025-09-02 15:11:16'

// 过滤后的汇率列表
const filteredRateList = computed(() => {
  if (!searchKeyword.value) {
    return currencyList.value
  }
  const kw = searchKeyword.value.toLowerCase()
  return currencyList.value.filter(c =>
    c.symbol.toLowerCase().includes(kw) ||
    c.name.toLowerCase().includes(kw)
  )
})

// 搜索处理
function handleSearch() {
  // 由 computed 属性自动处理
}

function handleSearchClear() {
  searchKeyword.value = ''
}

// 编辑汇率弹窗
const editDialogVisible = ref(false)
const currentCurrency = ref(null)
const editForm = reactive({
  exchangeType: 'discount',
  fixedRate: '',
  discountRate: ''
})
const editFormErrors = reactive({
  fixedRate: '',
  discountRate: ''
})

function handleEdit(currency) {
  currentCurrency.value = currency
  editForm.exchangeType = currency.exchangeType
  editForm.fixedRate = currency.fixedRate || ''
  editForm.discountRate = currency.discountRate || ''
  editFormErrors.fixedRate = ''
  editFormErrors.discountRate = ''
  editDialogVisible.value = true
}

function handleEditDialogClose() {
  editDialogVisible.value = false
}

function handleSaveEdit() {
  // 校验
  if (editForm.exchangeType === 'fixed') {
    if (!editForm.fixedRate) {
      editFormErrors.fixedRate = '请输入固定汇率值'
      return
    }
    if (parseFloat(editForm.fixedRate) <= 0) {
      editFormErrors.fixedRate = '固定汇率值必须大于0'
      return
    }
  } else {
    if (!editForm.discountRate) {
      editFormErrors.discountRate = '请输入汇率折扣比例'
      return
    }
    const rate = parseFloat(editForm.discountRate)
    if (rate < 0 || rate > 100) {
      editFormErrors.discountRate = '汇率折扣比例必须在0-100之间'
      return
    }
  }

  // 更新数据
  const idx = currencyList.value.findIndex(c => c.id === currentCurrency.value.id)
  if (idx !== -1) {
    currencyList.value[idx].exchangeType = editForm.exchangeType
    currencyList.value[idx].fixedRate = editForm.fixedRate
    currencyList.value[idx].discountRate = editForm.discountRate
    currencyList.value[idx].executionRate = calculatedExecutionRate.value
  }

  ElMessage.success('保存成功')
  editDialogVisible.value = false
}

// 计算执行汇率
const calculatedExecutionRate = computed(() => {
  if (!currentCurrency.value) return ''
  if (editForm.exchangeType === 'fixed') {
    return parseFloat(editForm.fixedRate || 0).toFixed(6)
  }
  return (currentCurrency.value.officialRate * (parseFloat(editForm.discountRate || 100) / 100)).toFixed(6)
})

// 历史汇率弹窗
const historyDialogVisible = ref(false)
const historyPagination = reactive({
  page: 1,
  pageSize: 10
})
const historyTotal = ref(0)

// 生成最近一个月的历史数据
function generateHistoryList(currencySymbol, page, pageSize) {
  const today = new Date()
  const data = []
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    // 模拟官方汇率有小幅波动
    const baseRate = currencySymbol === 'PHP' ? 0.11438 :
                     currencySymbol === 'VND' ? 0.0002595 :
                     currencySymbol === 'USD' ? 7.1564 :
                     1.0000
    const波动 = (Math.random() - 0.5) * 0.001
    const officialRate = (baseRate + 波动).toFixed(6)
    data.push({
      date: dateStr,
      officialRate: parseFloat(officialRate),
      executionRate: (parseFloat(officialRate) * 0.98).toFixed(6)
    })
  }
  return data.slice((page - 1) * pageSize, page * pageSize)
}

const historyList = ref([])

function handleHistory(currency) {
  currentCurrency.value = currency
  historyPagination.page = 1
  historyTotal.value = 30
  historyList.value = generateHistoryList(currency.symbol, 1, 10)
  historyDialogVisible.value = true
}

function handleHistoryPageSizeChange() {
  historyList.value = generateHistoryList(currentCurrency.value.symbol, historyPagination.page, historyPagination.pageSize)
}

function handleHistoryPageChange() {
  historyList.value = generateHistoryList(currentCurrency.value.symbol, historyPagination.page, historyPagination.pageSize)
}

// 日志弹窗
const logDialogVisible = ref(false)
const logPagination = reactive({
  page: 1,
  pageSize: 10
})
const logTotal = ref(0)

// 生成最近一个月的日志数据
function generateLogList(currencySymbol, page, pageSize) {
  const today = new Date()
  const data = []
  const operators = ['张三', '李四', '王五', '赵六', '钱七']
  const types = ['编辑汇率', '修改执行汇率', '查看历史']

  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    date.setHours(Math.floor(Math.random() * 24))
    date.setMinutes(Math.floor(Math.random() * 60))

    data.push({
      operateTime: date.toLocaleString('zh-CN'),
      operator: operators[Math.floor(Math.random() * operators.length)],
      operateType: types[Math.floor(Math.random() * types.length)],
      operateContent: `${currencySymbol}执行汇率修改为${(Math.random() * 10).toFixed(4)}`
    })
  }
  return data.slice((page - 1) * pageSize, page * pageSize)
}

const logList = ref([])

function handleLog(currency) {
  currentCurrency.value = currency
  logPagination.page = 1
  logTotal.value = 30
  logList.value = generateLogList(currency.symbol, 1, 10)
  logDialogVisible.value = true
}

function handleLogPageSizeChange() {
  logList.value = generateLogList(currentCurrency.value.symbol, logPagination.page, logPagination.pageSize)
}

function handleLogPageChange() {
  logList.value = generateLogList(currentCurrency.value.symbol, logPagination.page, logPagination.pageSize)
}
</script>

<style lang="scss" scoped>
.exchange-rate {
  padding: 16px 0 24px;
  background: #f5f6f7;
  min-height: calc(100vh - 48px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 16px 24px;
  border-radius: 8px 8px 0 0;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .page-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .update-time {
      font-size: 13px;
      color: #999;
      display: flex;
      align-items: center;
      gap: 4px;

      .help-icon {
        cursor: pointer;
        color: #999;

        &:hover {
          color: #0064E0;
        }
      }
    }
  }

  .header-right {
    display: flex;
    gap: 12px;

    .search-input {
      width: 260px;
    }
  }
}

.warning-banner {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 16px;
  background: #fff7e6;
  border: none;
  border-top: none;
  font-size: 13px;
  color: #666;
  line-height: 1.6;

  .warning-icon {
    color: #fa8c16;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .warning-text {
    flex: 1;
  }

  .link {
    color: #0064E0;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.rate-list {
  background: #fff;
  padding: 0 24px 24px;
  border-radius: 0 0 8px 8px;

  .help-icon {
    cursor: pointer;
    color: #999;
    margin-left: 4px;
    vertical-align: middle;

    &:hover {
      color: #0064E0;
    }
  }

  .rate-text,
  .type-text {
    font-size: 14px;
    color: #333;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
  }

  .empty-state {
    padding: 40px 0;
  }
}

.edit-form {
  .form-row {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    flex-wrap: wrap;

    .label {
      font-size: 14px;
      color: #666;
      width: 100px;
      flex-shrink: 0;
    }

    .value {
      font-size: 14px;
      color: #333;
    }

    &.radio-group {
      padding-left: 100px;
    }
  }

  .form-divider {
    height: 1px;
    background: #e8e8e8;
    margin: 16px 0;
  }

  .rate-input {
    width: 160px;
    margin-right: 8px;
  }

  .unit {
    font-size: 14px;
    color: #666;
  }

  .error-text {
    display: block;
    color: #ff4d4f;
    font-size: 12px;
    margin-top: -12px;
    margin-left: 100px;
    margin-bottom: 12px;
  }

  .result-row {
    .execution-rate {
      color: #0064E0;
      font-weight: 500;
    }
  }
}

.history-form {
  .form-row {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    .label {
      font-size: 14px;
      color: #666;
      width: 80px;
    }

    .value {
      font-size: 14px;
      color: #333;
    }
  }

  .history-list {
    margin-top: 16px;
    min-height: 200px;
  }

  .empty-state {
    padding: 40px 0;
  }

  .pagination-wrapper {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}

.log-list {
  min-height: 200px;

  .empty-state {
    padding: 40px 0;
  }

  .pagination-wrapper {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}

.pagination-wrapper {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>