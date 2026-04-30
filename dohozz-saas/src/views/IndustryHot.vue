<template>
  <div class="industry-hot-page">
    <!-- ===== Hot Topics List View ===== -->
    <div v-if="!wizardVisible" class="hot-list-view">
      <!-- Page Title -->
      <div class="page-header">
        <span class="page-title">行业热点</span>
      </div>

      <!-- Industry Filter Tabs -->
      <div class="industry-tabs">
        <div
          v-for="ind in industryList"
          :key="ind"
          class="tab-item"
          :class="{ active: activeIndustry === ind }"
          @click="handleIndustryChange(ind)"
        >
          {{ ind }}
        </div>
      </div>

      <!-- Hot Cards Grid -->
      <div class="hot-grid">
        <div v-for="hot in filteredHots" :key="hot.id" class="hot-card">
          <div class="hot-cover">
            <img v-if="hot.cover" :src="hot.cover" />
            <div v-else class="cover-placeholder"><el-icon><TrendCharts /></el-icon></div>
            <div class="heat-badge">
              <el-icon><Top /></el-icon> {{ hot.heatValue }}
            </div>
          </div>
          <div class="hot-content">
            <div class="hot-title">{{ hot.title }}</div>
            <div class="hot-summary">{{ hot.summary }}</div>
            <div class="hot-meta">
              <el-tag size="small" type="warning">{{ hot.source }}</el-tag>
              <span class="hot-time">{{ hot.updateTime }}</span>
            </div>
            <div class="hot-actions">
              <el-button type="primary" class="btn-trend" @click="openWizard(hot)">蹭上热点</el-button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="filteredHots.length === 0" class="empty-state">
        <el-empty description="暂无相关热点内容，请切换行业类目后重试" />
      </div>

      <!-- Pagination -->
      <div class="pagination-bar">
        <Pagination
          v-model="pagination"
          :total="pagination.total"
        />
      </div>
    </div>

    <!-- ===== 蹭上热点 Wizard Overlay ===== -->
    <div v-else class="wizard-overlay">
      <!-- Step Indicator -->
      <div class="wizard-header">
        <div class="wizard-steps">
          <div
            v-for="(step, idx) in wizardSteps"
            :key="idx"
            class="step-item"
            :class="{
              active: wizardStep === idx + 1,
              completed: wizardStep > idx + 1
            }"
          >
            <div class="step-num">
              <el-icon v-if="wizardStep > idx + 1"><Check /></el-icon>
              <span v-else>{{ idx + 1 }}</span>
            </div>
            <span class="step-label">{{ step }}</span>
          </div>
        </div>
        <el-button link class="close-btn" @click="closeWizard"><el-icon><Close /></el-icon></el-button>
      </div>

      <!-- Wizard Content -->
      <div class="wizard-body">
        <!-- Step 1: Select Product & AI Directions -->
        <div v-if="wizardStep === 1" class="step-content step-product">
          <div class="hot-info-bar">
            <el-tag type="danger" effect="plain" class="hot-tag">热点</el-tag>
            <span class="hot-title-text">{{ currentHot?.title }}</span>
          </div>
          <div class="product-section">
            <div class="section-label"><span class="required-star">*</span>选择推广商品</div>
            <el-select
              v-model="selectedProduct"
              filterable
              placeholder="搜索商品名称或ID"
              style="width: 400px"
              :loading="productLoading"
              @focus="loadProducts"
            >
              <el-option
                v-for="p in productList"
                :key="p.id"
                :label="p.name"
                :value="p.id"
              >
                <div class="product-option">
                  <img v-if="p.image" :src="p.image" class="product-thumb" />
                  <span>{{ p.name }}</span>
                  <span class="product-price">￥{{ p.price }}</span>
                </div>
              </el-option>
            </el-select>
            <div v-if="productError" class="field-error">请选择推广商品</div>
          </div>

          <div class="directions-section">
            <div class="section-label">AI 创作方向</div>
            <div v-if="!selectedProduct" class="directions-placeholder">
              请先选择推广商品，AI 将为您生成创作方向
            </div>
            <div v-else-if="directionsLoading" class="directions-loading">
              <el-icon class="is-loading"><Loading /></el-icon>
              AI 正在为您生成创作方向……
            </div>
            <div v-else class="directions-grid">
              <div
                v-for="(dir, idx) in directions"
                :key="idx"
                class="direction-card"
                :class="{ selected: selectedDirection === idx, editing: editingDirection === idx }"
                @click="selectDirection(idx)"
              >
                <div class="dir-header">
                  <span class="dir-title">{{ dir.title }}</span>
                  <el-button link type="primary" @click.stop="startEditDirection(idx)">编辑</el-button>
                </div>
                <div v-if="editingDirection === idx" class="dir-edit-form">
                  <el-input v-model="editForm.title" placeholder="创作方向标题" />
                  <el-input v-model="editForm.desc" type="textarea" :rows="2" placeholder="创作方向说明" />
                  <div class="edit-actions">
                    <el-button size="small" @click="cancelEditDirection">取消</el-button>
                    <el-button size="small" type="primary" @click="saveEditDirection(idx)">确定</el-button>
                  </div>
                </div>
                <div v-else>
                  <div class="dir-desc">{{ dir.desc }}</div>
                  <div class="dir-tags">
                    <el-tag v-for="tag in dir.tags" :key="tag" size="small" type="info">{{ tag }}</el-tag>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="selectedProduct && directions.length > 0" class="directions-actions">
              <el-button link type="primary" @click="regenerateDirections">重新生成</el-button>
            </div>
            <div v-if="directionError" class="field-error">请选择一个创作方向</div>
          </div>
        </div>

        <!-- Step 2: Script Generation -->
        <div v-if="wizardStep === 2" class="step-content step-script">
          <div class="hot-info-bar">
            <el-tag type="danger" effect="plain">热点</el-tag>
            <span class="hot-title-text">{{ currentHot?.title }}</span>
            <el-divider direction="vertical" />
            <img v-if="selectedProductData?.image" :src="selectedProductData.image" class="product-mini-thumb" />
            <span>{{ selectedProductData?.name }}</span>
          </div>
          <div class="script-section">
            <div class="section-label">视频脚本</div>
            <div v-if="scriptLoading" class="script-loading">
              <el-icon class="is-loading"><Loading /></el-icon>
              AI 正在努力生成脚本中……
            </div>
            <div v-else class="script-content">
              <div v-if="!isScriptEditing" class="script-text">
                <div v-for="(scene, idx) in scriptData" :key="idx" class="scene-item">
                  <div class="scene-header">场景{{ scene.index }}：{{ scene.title }}</div>
                  <div class="scene-desc">{{ scene.desc }}</div>
                  <div class="scene-script">台词：{{ scene.script }}</div>
                </div>
              </div>
              <el-input
                v-else
                v-model="scriptEditText"
                type="textarea"
                :rows="12"
                placeholder="编辑脚本内容"
              />
            </div>
            <div class="script-actions">
              <el-button @click="copyScript">复制</el-button>
              <el-button @click="toggleScriptEdit">
                {{ isScriptEditing ? '取消编辑' : '编辑' }}
              </el-button>
              <el-button v-if="isScriptEditing" type="primary" @click="saveScriptEdit">保存</el-button>
              <el-button link type="primary" @click="regenerateScript">重新生成脚本</el-button>
            </div>
          </div>
        </div>

        <!-- Step 3: Influencer Recommendation -->
        <div v-if="wizardStep === 3" class="step-content step-influencer">
          <div class="influencer-section">
            <div class="section-label">推荐合作达人</div>
            <div class="influencer-grid">
              <div v-for="inf in influencerList" :key="inf.id" class="influencer-card">
                <img v-if="inf.avatar" :src="inf.avatar" class="inf-avatar" />
                <div v-else class="inf-avatar-placeholder" />
                <div class="inf-name">{{ inf.name }}</div>
                <div class="inf-handle">@{{ inf.handle }}</div>
                <div class="inf-followers">{{ formatFollowers(inf.followers) }}粉丝</div>
                <div class="inf-tags">
                  <el-tag v-for="tag in inf.matchTags" :key="tag" size="small" type="success">{{ tag }}</el-tag>
                </div>
                <el-button type="primary" link @click="goToInfluencer(inf)">查看详情</el-button>
              </div>
            </div>
            <div v-if="influencerList.length === 0" class="empty-state">
              <el-empty description="暂无匹配的已合作达人" />
              <el-button type="primary" @click="goToInfluencerLibrary">前往达人库</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Wizard Footer -->
      <div class="wizard-footer">
        <el-button v-if="wizardStep > 1" @click="prevStep">上一步</el-button>
        <el-button v-if="wizardStep < 3" type="primary" @click="nextStep">下一步</el-button>
        <el-button v-if="wizardStep === 3" type="primary" @click="finishWizard">完成</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Close, Check, Top, TrendCharts, Loading } from '@element-plus/icons-vue'
import Pagination from '@/components/Pagination.vue'

const industryList = ['全部', '美妆', '服饰', '食品', '数码', '家电', '家居', '母婴']
const activeIndustry = ref('全部')
const wizardVisible = ref(false)
const wizardStep = ref(1)
const wizardSteps = ['选商品', '创作方向', '生成脚本', '达人推荐']

// Mock data
const mockHots = [
  { id: 'H001', title: '夏季防晒大作战！2026最新防晒霜测评', summary: '随着气温升高，防晒需求激增，本热点聚焦防晒产品使用场景和效果对比', cover: '', heatValue: 98.5, source: '抖音热榜', updateTime: '2026-04-20' },
  { id: 'H002', title: '618预热开启，美妆品牌提前锁定爆款', summary: '电商大促前夕，美妆品类营销策略解读', cover: '', heatValue: 95.2, source: '微博热搜', updateTime: '2026-04-19' },
  { id: 'H003', title: '成分党崛起：烟酰胺、玻尿酸成为护肤新宠', summary: '功效护肤成分科普内容爆发，成分党用户规模扩大', cover: '', heatValue: 88.7, source: '小红书热榜', updateTime: '2026-04-18' },
  { id: 'H004', title: '国潮联名风靡，年轻人消费新风向', summary: '国货品牌联名款热销，年轻消费者偏好分析', cover: '', heatValue: 85.1, source: '抖音热榜', updateTime: '2026-04-17' },
  { id: 'H005', title: '素颜霜 vs 气垫：底妆选择困难症解析', summary: '底妆产品对比测评内容持续高热', cover: '', heatValue: 82.3, source: '微博热搜', updateTime: '2026-04-16' },
  { id: 'H006', title: '春季换季护肤指南：敏感肌护理全攻略', summary: '换季护肤需求爆发，敏感肌护理内容走热', cover: '', heatValue: 79.8, source: '小红书热榜', updateTime: '2026-04-15' }
]

const pagination = reactive({ page: 1, pageSize: 9, total: 6 })
const filteredHots = computed(() => mockHots)

const currentHot = ref(null)
const selectedProduct = ref('')
const selectedProductData = ref(null)
const productLoading = ref(false)
const productError = ref(false)
const productList = ref([
  { id: 'P001', name: '水感防晒霜SPF50+', price: 129, image: '' },
  { id: 'P002', name: '烟酰胺亮肤精华液', price: 199, image: '' },
  { id: 'P003', name: '玻尿酸保湿面膜10片装', price: 89, image: '' }
])

const directions = ref([])
const directionsLoading = ref(false)
const selectedDirection = ref(-1)
const editingDirection = ref(-1)
const editForm = reactive({ title: '', desc: '' })
const directionError = ref(false)

const scriptLoading = ref(false)
const scriptData = ref([])
const isScriptEditing = ref(false)
const scriptEditText = ref('')

const influencerList = ref([
  { id: 'I001', name: '美妆达人小王', handle: 'meizhuang_xiaowang', avatar: '', followers: 1250000, matchTags: ['同品类带货经验', '内容风格契合'] },
  { id: 'I002', name: '护肤博士', handle: 'hufuboshi', avatar: '', followers: 890000, matchTags: ['高互动粉丝', '成分党受众'] },
  { id: 'I003', name: '彩妆达人Amy', handle: 'caizhuang_damy', avatar: '', followers: 678000, matchTags: ['品牌调性匹配', '年轻女性用户'] },
  { id: 'I004', name: '成分党凯西', handle: 'chengfen_kate', avatar: '', followers: 456000, matchTags: ['专业测评风格', '粉丝粘性高'] }
])

const loadProducts = () => {
  productLoading.value = true
  setTimeout(() => { productLoading.value = false }, 500)
}

const handleIndustryChange = (ind) => {
  activeIndustry.value = ind
  pagination.page = 1
}

const openWizard = (hot) => {
  currentHot.value = hot
  wizardVisible.value = true
  wizardStep.value = 1
  resetWizardState()
}

const resetWizardState = () => {
  selectedProduct.value = ''
  selectedProductData.value = null
  directions.value = []
  selectedDirection.value = -1
  editingDirection.value = -1
  scriptData.value = []
  productError.value = false
  directionError.value = false
}

const closeWizard = () => {
  ElMessageBox.confirm('确定离开？当前创作内容将不会保存。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    wizardVisible.value = false
    wizardStep.value = 1
  }).catch(() => {})
}

const selectDirection = (idx) => {
  selectedDirection.value = idx
}

const startEditDirection = (idx) => {
  editingDirection.value = idx
  editForm.title = directions.value[idx].title
  editForm.desc = directions.value[idx].desc
}

const cancelEditDirection = () => {
  editingDirection.value = -1
}

const saveEditDirection = (idx) => {
  directions.value[idx] = { ...directions.value[idx], ...editForm }
  editingDirection.value = -1
}

const regenerateDirections = () => {
  directionsLoading.value = true
  setTimeout(() => {
    directions.value = [
      { title: '场景化种草路线', desc: '以夏日户外场景切入，展示防晒霜的防水防汗效果', tags: ['场景营销', '产品卖点', 'UGC风格'] },
      { title: '成分科普路线', desc: '从成分角度解读产品优势，建立专业信任感', tags: ['成分党', '专业测评', '信任背书'] },
      { title: '优惠促销路线', desc: '结合618大促节点，突出价格优势和限时福利', tags: ['促销活动', '价格敏感', '促销信息'] }
    ]
    directionsLoading.value = false
    selectedDirection.value = -1
  }, 1500)
}

// Watch selectedProduct to auto-trigger AI
watch(selectedProduct, (val) => {
  if (val) {
    selectedProductData.value = productList.value.find(p => p.id === val)
    directionsLoading.value = true
    setTimeout(() => {
      directions.value = [
        { title: '场景化种草路线', desc: '以夏日户外场景切入，展示防晒霜的防水防汗效果', tags: ['场景营销', '产品卖点', 'UGC风格'] },
        { title: '成分科普路线', desc: '从成分角度解读产品优势，建立专业信任感', tags: ['成分党', '专业测评', '信任背书'] },
        { title: '优惠促销路线', desc: '结合618大促节点，突出价格优势和限时福利', tags: ['促销活动', '价格敏感', '促销信息'] }
      ]
      directionsLoading.value = false
    }, 1500)
  }
})

const prevStep = () => {
  if (wizardStep.value > 1) wizardStep.value--
}

const nextStep = () => {
  if (wizardStep.value === 1) {
    if (!selectedProduct.value) { productError.value = true; return }
    if (selectedDirection.value < 0) { directionError.value = true; return }
  }
  if (wizardStep.value < 3) wizardStep.value++
  else finishWizard()
}

const toggleScriptEdit = () => {
  if (isScriptEditing.value) {
    isScriptEditing.value = false
  } else {
    scriptEditText.value = scriptData.value.map(s => `【场景${s.index}】${s.title}\n${s.desc}\n台词：${s.script}`).join('\n\n')
    isScriptEditing.value = true
  }
}

const copyScript = () => {
  const text = scriptData.value.map(s => `【场景${s.index}】${s.title}\n${s.desc}\n台词：${s.script}`).join('\n\n')
  navigator.clipboard.writeText(text)
  ElMessage.success('复制成功')
}

const saveScriptEdit = () => {
  isScriptEditing.value = false
  ElMessage.success('保存成功')
}

const regenerateScript = () => {
  scriptLoading.value = true
  setTimeout(() => {
    scriptData.value = [
      { index: 1, title: '开场吸引', desc: '画面切入户外场景，博主提出防晒痛点', script: 'Hey大家好，夏天来了，你们的防晒准备好了吗？今天我要给你们安利一款我最近超爱用的防晒霜！' },
      { index: 2, title: '产品展示', desc: '展示防晒霜外观和质地', script: '看，这就是我说的宝藏防晒，质地超级轻薄，一抹就化水，完全不粘腻！' },
      { index: 3, title: '效果演示', desc: '户外实测，展示防水防汗效果', script: '我们来做个测试，直接往手上喷水，你们看，水直接滑落，完全不脱妆！防水防汗效果绝了！' },
      { index: 4, title: '优惠引导', desc: '引导购买，限时优惠信息', script: '而且现在618预热价，比平时便宜了30多块，还送小样套装！心动不如行动，赶紧下单吧！' }
    ]
    scriptLoading.value = false
  }, 1500)
}

// Auto-generate script when entering step 2
watch(wizardStep, (step) => {
  if (step === 2 && scriptData.value.length === 0) {
    scriptLoading.value = true
    setTimeout(() => {
      scriptData.value = [
        { index: 1, title: '开场吸引', desc: '画面切入户外场景，博主提出防晒痛点', script: 'Hey大家好，夏天来了，你们的防晒准备好了吗？今天我要给你们安利一款我最近超爱用的防晒霜！' },
        { index: 2, title: '产品展示', desc: '展示防晒霜外观和质地', script: '看，这就是我说的宝藏防晒，质地超级轻薄，一抹就化水，完全不粘腻！' },
        { index: 3, title: '效果演示', desc: '户外实测，展示防水防汗效果', script: '我们来做个测试，直接往手上喷水，你们看，水直接滑落，完全不脱妆！防水防汗效果绝了！' },
        { index: 4, title: '优惠引导', desc: '引导购买，限时优惠信息', script: '而且现在618预热价，比平时便宜了30多块，还送小样套装！心动不如行动，赶紧下单吧！' }
      ]
      scriptLoading.value = false
    }, 1500)
  }
})

const goToInfluencer = (inf) => {
  ElMessage.success(`跳转到达人 ${inf.name} 详情页`)
}

const goToInfluencerLibrary = () => {
  ElMessage.success('跳转到达人库')
}

const finishWizard = () => {
  ElMessage.success('创作流程完成')
  wizardVisible.value = false
  wizardStep.value = 1
}

const formatFollowers = (n) => {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
  return n.toString()
}
</script>

<style lang="scss" scoped>
.industry-hot-page {
  background: #F5F6F7;
  min-height: calc(100vh - 48px);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  background: #fff;
  padding: 16px 24px;
  border-radius: 4px;
  .page-title { font-size: 18px; font-weight: 600; color: #262626; }
}

.industry-tabs {
  background: #fff;
  padding: 12px 24px;
  border-radius: 4px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  .tab-item {
    padding: 6px 16px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    color: #595959;
    background: #F5F5F5;
    transition: all 0.2s;
    &:hover { background: #E8E8E8; }
    &.active { background: #E6F4FF; color: #1677FF; font-weight: 500; }
  }
}

.hot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.hot-card {
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  border: none;
  transition: all 0.2s;
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
}

.hot-cover {
  position: relative;
  height: 160px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  img { width: 100%; height: 100%; object-fit: cover; }
  .cover-placeholder { color: rgba(255,255,255,0.7); .el-icon { font-size: 40px; } }
  .heat-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(255,59,48,0.9);
    color: #fff;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.hot-content { padding: 16px; }
.hot-title { font-size: 15px; font-weight: 600; color: #262626; margin-bottom: 8px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.hot-summary { font-size: 13px; color: #595959; line-height: 1.6; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.hot-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; .hot-time { font-size: 12px; color: #8C8C8C; } }
.hot-actions { display: flex; justify-content: flex-end; .btn-trend { background: #1677FF; border-color: #1677FF; } }

.empty-state { background: #fff; border-radius: 4px; padding: 60px; text-align: center; }
.pagination-bar { background: #fff; border-radius: 4px; padding: 12px 16px; display: flex; justify-content: flex-end; }

/* ===== Wizard Overlay ===== */
.wizard-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: #F5F6F7;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.wizard-header {
  background: #fff;
  padding: 16px 24px;
  border-bottom: 1px solid #F0F0F0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wizard-steps {
  display: flex;
  gap: 40px;
  .step-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #D9D9D9;
    &.active { color: #1677FF; .step-num { background: #1677FF; color: #fff; border-color: #1677FF; } }
    &.completed { color: #52C41A; .step-num { background: #52C41A; color: #fff; border-color: #52C41A; } }
    .step-num {
      width: 24px; height: 24px;
      border-radius: 50%;
      border: none;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 600;
    }
    .step-label { font-size: 14px; font-weight: 500; }
  }
}

.close-btn { font-size: 20px; color: #8C8C8C; }

.wizard-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.wizard-footer {
  background: #fff;
  padding: 16px 24px;
  border-top: 1px solid #F0F0F0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.step-content {
  background: #fff;
  border-radius: 4px;
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
}

.hot-info-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 20px;
  border-bottom: 1px solid #F0F0F0;
  margin-bottom: 24px;
  .hot-tag { background: #FFF2E8; color: #FF4D4F; border-color: #FFBBCC; }
  .hot-title-text { font-size: 15px; font-weight: 600; color: #262626; }
  .product-mini-thumb { width: 24px; height: 24px; border-radius: 4px; object-fit: cover; }
}

.section-label {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 16px;
  .required-star { color: #FF4D4F; margin-right: 4px; }
}

.product-section { margin-bottom: 32px; }
.field-error { color: #FF4D4F; font-size: 13px; margin-top: 8px; }
.product-option { display: flex; align-items: center; gap: 8px; .product-thumb { width: 32px; height: 32px; border-radius: 4px; object-fit: cover; } .product-price { color: #8C8C8C; font-size: 12px; margin-left: auto; } }

.directions-placeholder {
  padding: 40px;
  text-align: center;
  color: #8C8C8C;
  font-size: 14px;
  background: #FAFAFA;
  border-radius: 4px;
  border: 1px dashed #E8E8E8;
}

.directions-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  color: #1677FF;
  font-size: 14px;
}

.directions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 12px;
}

.direction-card {
  border: none;
  border-radius: 4px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: #1677FF; }
  &.selected { border-color: #1677FF; background: #F0F5FF; }
  .dir-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; .dir-title { font-size: 14px; font-weight: 600; color: #262626; } }
  .dir-desc { font-size: 13px; color: #595959; margin-bottom: 8px; line-height: 1.6; }
  .dir-tags { display: flex; flex-wrap: wrap; gap: 4px; }
  .dir-edit-form { display: flex; flex-direction: column; gap: 8px; .edit-actions { display: flex; gap: 8px; justify-content: flex-end; } }
}

.directions-actions { display: flex; justify-content: flex-end; }

.script-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px;
  color: #1677FF;
  font-size: 14px;
}

.script-content {
  border: none;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 16px;
  background: #FAFAFA;
  max-height: 400px;
  overflow-y: auto;
}

.script-text { font-size: 14px; color: #262626; }
.scene-item {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px dashed #E8E8E8;
  &:last-child { border-bottom: none; margin-bottom: 0; }
  .scene-header { font-weight: 600; color: #1677FF; margin-bottom: 8px; }
  .scene-desc { color: #595959; margin-bottom: 6px; line-height: 1.6; }
  .scene-script { color: #262626; background: #E6F4FF; padding: 8px 12px; border-radius: 4px; }
}

.script-actions { display: flex; gap: 12px; }

.influencer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.influencer-card {
  border: none;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  transition: all 0.2s;
  &:hover { border-color: #1677FF; box-shadow: 0 2px 8px rgba(22,119,255,0.1); }
  .inf-avatar, .inf-avatar-placeholder { width: 64px; height: 64px; border-radius: 50%; background: #F5F5F5; margin: 0 auto 12px; object-fit: cover; }
  .inf-name { font-size: 15px; font-weight: 600; color: #262626; }
  .inf-handle { font-size: 13px; color: #8C8C8C; margin-bottom: 4px; }
  .inf-followers { font-size: 13px; color: #595959; margin-bottom: 8px; }
  .inf-tags { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; margin-bottom: 12px; }
}
</style>
