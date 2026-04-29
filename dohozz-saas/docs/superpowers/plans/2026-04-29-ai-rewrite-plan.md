# 智能仿写页面 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建智能仿写功能页面 `/ai-rewrite`，用户输入抖音链接一键生成仿写视频文案

**Architecture:** 独立页面组件 + Pinia 状态管理（积分、历史记录）+ 三个内嵌弹窗（历史记录/仿写结果/积分充值）+ 路由挂载到 Dashboard 二级菜单

**Tech Stack:** Vue 3 (Composition API + `<script setup>`) / Element Plus / Pinia / SCSS

---

## File Structure

```
src/
  views/
    AIRewrite.vue                    # [NEW] 智能仿写主页面
    AIFilmAnalysis.vue               # [MODIFY] 添加"智能仿写"二级菜单tab
  dialogs/
    RewriteHistoryDialog.vue         # [NEW] 历史记录弹窗
    RewriteResultDialog.vue          # [NEW] 仿写结果弹窗
    RewriteRechargeDialog.vue         # [NEW] 积分充值弹窗
  stores/
    user.js                          # [MODIFY] 补充积分相关getter
    rewriteHistory.js                # [NEW] 仿写历史记录store
  router/
    index.js                         # [MODIFY] 添加 /ai-rewrite 路由
  api/
    shoppingVideo.js                 # [MODIFY] aiRewrite接收videoUrl参数
  views/
    Dashboard.vue                   # [MODIFY] 添加菜单项 + 路由渲染
```

---

### Task 1: 添加路由 `/ai-rewrite`

**Files:**
- Modify: `src/router/index.js:500-510`

- [ ] **Step 1: 添加路由配置**

在 `routes` 数组中 `AIFilmAnalysis` 路由后添加：

```javascript
{
  path: '/ai-rewrite',
  name: 'AIRewrite',
  component: () => import('@/views/AIRewrite.vue'),
  meta: {
    requiresAuth: true,
    title: '智能仿写 - DOHOZZ'
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/router/index.js
git commit -m "feat(智能仿写): 添加 /ai-rewrite 路由"
```

---

### Task 2: 创建 rewriteHistory Pinia store

**Files:**
- Create: `src/stores/rewriteHistory.js`

- [ ] **Step 1: 创建 store**

```javascript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRewriteHistoryStore = defineStore('rewriteHistory', () => {
  const historyList = ref([])

  function addRecord(record) {
    historyList.value.unshift({
      id: Date.now().toString(),
      time: new Date().toLocaleString('zh-CN'),
      videoUrl: record.videoUrl,
      rewriteContent: record.rewriteContent
    })
    // 最多保留100条
    if (historyList.value.length > 100) {
      historyList.value = historyList.value.slice(0, 100)
    }
  }

  function deleteRecord(id) {
    const idx = historyList.value.findIndex(r => r.id === id)
    if (idx > -1) historyList.value.splice(idx, 1)
  }

  function clearAll() {
    historyList.value = []
  }

  return { historyList, addRecord, deleteRecord, clearAll }
})
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/rewriteHistory.js
git commit -m "feat(智能仿写): 创建 rewriteHistory store"
```

---

### Task 3: 修改 `aiRewrite` API 支持 videoUrl

**Files:**
- Modify: `src/api/shoppingVideo.js:548-577`

- [ ] **Step 1: 更新函数签名**

现有函数签名为 `aiRewrite(originalText, options)`，需改为支持传入视频链接并返回仿写内容：

```javascript
export function aiRewrite(videoUrl, options = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { style = 'casual' } = options

      const stylePrefix = {
        formal: '【正式版】',
        casual: '【轻松版】',
        playful: '【趣味版】'
      }

      const rewrittenTexts = [
        `${stylePrefix[style]}这款产品真的非常好用，使用后效果显著，推荐指数五颗星！强烈建议大家尝试一下。`,
        `${stylePrefix[style]}朋友们！我发现了一款超棒的产品，真的是太喜欢了，必须分享给你们！效果立竿见影，谁用谁知道！`,
        `${stylePrefix[style]}咳咳，说正事！这款产品我必须好好夸一夸，真的绝绝子，用完之后直接被圈粉，爱了爱了！`
      ]

      resolve({
        code: 0,
        message: '仿写成功',
        data: {
          original: videoUrl,
          rewritten: rewrittenTexts[style === 'formal' ? 0 : style === 'playful' ? 2 : 1],
          style,
          generatedAt: new Date().toISOString()
        }
      })
    }, 2000)
  })
}
```

- [ ] **Step 2: Commit**

```bash
git add src/api/shoppingVideo.js
git commit -m "feat(智能仿写): aiRewrite 支持 videoUrl 参数"
```

---

### Task 4: 创建 RewriteHistoryDialog.vue 历史记录弹窗

**Files:**
- Create: `src/views/dialogs/RewriteHistoryDialog.vue`

- [ ] **Step 1: 编写组件**

```vue
<template>
  <el-dialog
    v-model="visible"
    title="历史记录"
    width="520px"
    :close-on-click-modal="false"
  >
    <div v-if="store.historyList.length === 0" class="empty-tip">
      暂无历史记录
    </div>
    <div v-else class="history-list">
      <div
        v-for="item in store.historyList"
        :key="item.id"
        class="history-item"
      >
        <div class="history-info">
          <div class="history-time">{{ item.time }}</div>
          <div class="history-url">{{ item.videoUrl }}</div>
        </div>
        <div class="history-actions">
          <el-button type="primary" link size="small" @click="$emit('view', item)">查看详情</el-button>
          <el-button type="danger" link size="small" @click="handleDelete(item.id)">删除</el-button>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRewriteHistoryStore } from '@/stores/rewriteHistory'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue', 'view'])

const store = useRewriteHistoryStore()
const visible = ref(false)
watch(() => props.modelValue, (val) => { visible.value = val })
watch(visible, (val) => { if (!val) emit('update:modelValue', false) })

const handleDelete = (id) => {
  store.deleteRecord(id)
  ElMessage.success('删除成功')
}
</script>

<style scoped>
.empty-tip { text-align: center; padding: 40px 0; color: #999; }
.history-list { max-height: 400px; overflow-y: auto; }
.history-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
.history-info { flex: 1; min-width: 0; }
.history-time { color: #999; font-size: 12px; margin-bottom: 4px; }
.history-url { color: #333; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.history-actions { display: flex; gap: 8px; flex-shrink: 0; margin-left: 16px; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/views/dialogs/RewriteHistoryDialog.vue
git commit -m "feat(智能仿写): 创建历史记录弹窗组件"
```

---

### Task 5: 创建 RewriteResultDialog.vue 仿写结果弹窗

**Files:**
- Create: `src/views/dialogs/RewriteResultDialog.vue`

- [ ] **Step 1: 编写组件**

```vue
<template>
  <el-dialog
    v-model="visible"
    title="仿写结果"
    width="560px"
    :close-on-click-modal="false"
  >
    <div class="result-box">
      <div class="result-label">原视频链接：</div>
      <div class="result-url">{{ result.original }}</div>
    </div>
    <div class="result-box">
      <div class="result-label">仿写内容：</div>
      <div class="result-content">{{ result.rewritten }}</div>
    </div>
    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
      <el-button @click="handleRegenerate">重新仿写</el-button>
      <el-button type="primary" @click="handleCopy">复制内容</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({ modelValue: Boolean, result: { type: Object, default: null } })
const emit = defineEmits(['update:modelValue', 'regenerate'])

const visible = ref(false)
watch(() => props.modelValue, (val) => { visible.value = val })
watch(visible, (val) => { if (!val) emit('update:modelValue', false) })

const handleCopy = () => {
  if (!props.result?.rewritten) {
    ElMessage.error('复制失败，请重试')
    return
  }
  navigator.clipboard.writeText(props.result.rewritten).then(() => {
    ElMessage.success('复制成功')
  }).catch(() => {
    ElMessage.error('复制失败，请重试')
  })
}

const handleRegenerate = () => {
  emit('regenerate')
}
</script>

<style scoped>
.result-box { margin-bottom: 16px; }
.result-label { color: #999; font-size: 14px; margin-bottom: 8px; }
.result-url { color: #666; font-size: 14px; word-break: break-all; }
.result-content { background: #fafafa; border: 1px solid #e8e8e8; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.8; color: #262626; min-height: 100px; white-space: pre-wrap; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/views/dialogs/RewriteResultDialog.vue
git commit -m "feat(智能仿写): 创建仿写结果弹窗组件"
```

---

### Task 6: 创建 RewriteRechargeDialog.vue 积分充值弹窗

**Files:**
- Create: `src/views/dialogs/RewriteRechargeDialog.vue`

- [ ] **Step 1: 编写组件**

```vue
<template>
  <el-dialog
    v-model="visible"
    title="积分充值"
    width="480px"
    :close-on-click-modal="false"
  >
    <div class="current-points">
      当前积分：<span class="points-num">{{ currentPoints.toLocaleString() }}</span>
    </div>
    <div class="recharge-title">充值套餐：</div>
    <div class="recharge-list">
      <div v-for="pkg in packages" :key="pkg.points" class="recharge-item">
        <div class="pkg-info">
          <span class="pkg-points">{{ pkg.points }}积分</span>
          <span class="pkg-price">¥{{ pkg.price }}</span>
        </div>
        <el-button type="primary" size="small" @click="handleRecharge(pkg)">充值</el-button>
      </div>
    </div>
    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({ modelValue: Boolean, currentPoints: { type: Number, default: 0 } })
const emit = defineEmits(['update:modelValue', 'recharge'])

const visible = ref(false)
watch(() => props.modelValue, (val) => { visible.value = val })
watch(visible, (val) => { if (!val) emit('update:modelValue', false) })

const packages = [
  { points: 100, price: 10 },
  { points: 500, price: 45 },
  { points: 1000, price: 80 },
  { points: 2000, price: 150 }
]

const handleRecharge = (pkg) => {
  emit('recharge', pkg)
  ElMessage.success('充值成功')
  visible.value = false
}
</script>

<style scoped>
.current-points { font-size: 14px; color: #333; margin-bottom: 20px; }
.points-num { color: #FF6600; font-weight: bold; font-size: 16px; }
.recharge-title { font-size: 14px; color: #999; margin-bottom: 12px; }
.recharge-list { display: flex; flex-direction: column; gap: 12px; }
.recharge-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #fafafa; border-radius: 8px; border: 1px solid #f0f0f0; }
.pkg-info { display: flex; gap: 16px; align-items: center; }
.pkg-points { font-size: 14px; color: #333; font-weight: 500; }
.pkg-price { font-size: 14px; color: #FF6600; font-weight: bold; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/views/dialogs/RewriteRechargeDialog.vue
git commit -m "feat(智能仿写): 创建积分充值弹窗组件"
```

---

### Task 7: 创建 AIRewrite.vue 主页面

**Files:**
- Create: `src/views/AIRewrite.vue`

- [ ] **Step 1: 编写主页面组件**

```vue
<template>
  <div class="ai-rewrite-page">
    <!-- 右上角用户资产区 -->
    <div class="top-bar">
      <div class="points-btn" @click="showRechargeDialog = true">
        <span class="points-icon">🔶</span>
        <span class="points-num" :class="{ insufficient: userPoints < 3 }">{{ userPoints.toLocaleString() }}</span>
        <span class="points-text">增购积分</span>
      </div>
      <div class="history-btn" @click="showHistoryDialog = true">
        <span class="history-icon">🕐</span>
        <span class="history-text">历史记录</span>
      </div>
    </div>

    <!-- 核心功能区域 -->
    <div class="core-area">
      <div class="guide-slogan">打品就用💥<span class="brand-word">爆款探测器</span></div>
      <div class="main-title">智能仿写 一键生成</div>

      <div class="input-wrapper">
        <input
          v-model="videoUrl"
          class="url-input"
          :class="{ error: errorMsg }"
          placeholder="请输入抖音视频链接"
          @keyup.enter="handleRewrite"
        />
        <div class="error-tip" v-if="errorMsg">{{ errorMsg }}</div>
      </div>

      <button class="rewrite-btn" @click="handleRewrite">
        <span class="btn-icon">🔶</span>
        <span class="btn-text">3</span>
        <span class="btn-label">开始仿写</span>
      </button>
    </div>

    <!-- 加载中弹窗 -->
    <el-dialog v-model="showLoading" title="仿写中..." width="360px" :close-on-click-modal="false" :show-close="false">
      <div class="loading-box">
        <i class="el-icon-loading loading-icon"></i>
        <span>AI正在仿写中，请稍候...</span>
      </div>
    </el-dialog>

    <!-- 历史记录弹窗 -->
    <RewriteHistoryDialog v-model="showHistoryDialog" @view="handleViewHistory" />

    <!-- 仿写结果弹窗 -->
    <RewriteResultDialog v-model="showResultDialog" :result="rewriteResult" @regenerate="handleRegenerate" />

    <!-- 积分充值弹窗 -->
    <RewriteRechargeDialog v-model="showRechargeDialog" :current-points="userPoints" @recharge="handleRecharge" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { aiRewrite } from '@/api/shoppingVideo'
import { useRewriteHistoryStore } from '@/stores/rewriteHistory'
import RewriteHistoryDialog from '@/views/dialogs/RewriteHistoryDialog.vue'
import RewriteResultDialog from '@/views/dialogs/RewriteResultDialog.vue'
import RewriteRechargeDialog from '@/views/dialogs/RewriteRechargeDialog.vue'

const historyStore = useRewriteHistoryStore()

const videoUrl = ref('')
const errorMsg = ref('')
const userPoints = ref(1746)
const showLoading = ref(false)
const showHistoryDialog = ref(false)
const showResultDialog = ref(false)
const showRechargeDialog = ref(false)
const rewriteResult = ref(null)

const DYY_REG = /^https?:\/\/(www\.)?(douyin\.com\/video\/|v\.douyin\.com\/)[^\s]+$/i

const validateUrl = () => {
  if (!videoUrl.value.trim()) {
    errorMsg.value = '请输入抖音视频链接'
    return false
  }
  if (!DYY_REG.test(videoUrl.value.trim())) {
    errorMsg.value = '请输入有效的抖音视频链接'
    return false
  }
  if (userPoints.value < 3) {
    errorMsg.value = '积分不足，请先充值'
    return false
  }
  errorMsg.value = ''
  return true
}

const handleRewrite = async () => {
  if (!validateUrl()) return
  userPoints.value -= 3
  showLoading.value = true
  try {
    const res = await aiRewrite(videoUrl.value.trim(), { style: 'casual' })
    rewriteResult.value = res.data
    historyStore.addRecord({ videoUrl: videoUrl.value.trim(), rewriteContent: res.data.rewritten })
    ElMessage.success('仿写成功')
    showResultDialog.value = true
  } catch (e) {
    ElMessage.error('仿写失败，请重试')
  } finally {
    showLoading.value = false
  }
}

const handleRegenerate = () => {
  showResultDialog.value = false
  handleRewrite()
}

const handleViewHistory = (item) => {
  rewriteResult.value = { original: item.videoUrl, rewritten: item.rewriteContent }
  showHistoryDialog.value = false
  showResultDialog.value = true
}

const handleRecharge = (pkg) => {
  userPoints.value += pkg.points
}
</script>

<style scoped>
.ai-rewrite-page {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.top-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
}

.points-btn, .history-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.points-btn:hover, .history-btn:hover {
  background: #eee;
}

.points-icon { font-size: 14px; }
.points-num { color: #FF6600; font-weight: bold; font-size: 14px; }
.points-num.insufficient { color: #FF4D4F; }
.points-text, .history-text { color: #333; font-size: 14px; }
.history-icon { font-size: 14px; }

.core-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  background: linear-gradient(135deg, rgba(230,240,255,0.5) 0%, rgba(255,230,245,0.3) 100%);
}

.guide-slogan {
  font-size: 14px;
  color: #999;
  margin-bottom: 16px;
}

.brand-word {
  color: #FF00FF;
  font-weight: 500;
}

.main-title {
  font-size: 28px;
  font-weight: bold;
  color: #000;
  margin-bottom: 40px;
}

.input-wrapper {
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
}

.url-input {
  width: 100%;
  padding: 14px 20px;
  border: 2px solid transparent;
  border-radius: 12px;
  font-size: 15px;
  outline: none;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(100, 150, 255, 0.15);
  transition: box-shadow 0.2s;
}

.url-input:focus {
  box-shadow: 0 0 0 3px rgba(100, 150, 255, 0.3);
}

.url-input.error {
  box-shadow: 0 0 0 3px rgba(255, 77, 79, 0.2);
}

.error-tip {
  color: #FF4D4F;
  font-size: 13px;
  margin-top: 8px;
  padding-left: 4px;
}

.rewrite-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: #f5f5f5;
  border-radius: 24px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.rewrite-btn:hover {
  background: #eee;
}

.btn-icon { font-size: 14px; }
.btn-text { color: #333; font-weight: bold; }
.btn-label { color: #333; }

.loading-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px 0;
  color: #1677ff;
}

.loading-icon { font-size: 20px; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/views/AIRewrite.vue
git commit -m "feat(智能仿写): 创建智能仿写主页面"
```

---

### Task 8: Dashboard 添加菜单项和路由渲染

**Files:**
- Modify: `src/views/Dashboard.vue:667-669`
- Modify: `src/views/Dashboard.vue:265`

- [ ] **Step 1: 在 AI创作 children 中添加智能仿写菜单**

在 `AI创作` 子菜单数组中添加 `{ name: '智能仿写' }`：

```javascript
{ name: 'AI创作', icon: icons.ai, children: [
  { name: 'AI拉片' },
  { name: '智能仿写' }
]},
```

- [ ] **Step 2: 添加路由渲染**

在 Dashboard.vue 中 AI拉片路由渲染后添加：

```javascript
<!-- AI智能仿写页面 -->
<AIRewrite v-else-if="activeSidebarMenu === '智能仿写'" />
```

- [ ] **Step 3: Commit**

```bash
git add src/views/Dashboard.vue
git commit -m "feat(智能仿写): Dashboard 添加菜单项和路由渲染"
```

---

### Task 9: 验证构建

**Files:**
- None

- [ ] **Step 1: 启动服务验证**

```bash
npm run dev
```

- [ ] **Step 2: 访问页面**

打开 http://localhost:3000/ai-rewrite 验证：
- 页面正常渲染，居中布局
- 右上角积分+历史记录按钮
- 输入框placeholder显示正确
- 点击【开始仿写】按钮触发校验提示

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "build: 验证智能仿写页面构建"
```

---

## Self-Review Checklist

1. **Spec coverage:**
   - [x] 独立页面 `/ai-rewrite` ✓
   - [x] 右上角积分+历史记录 ✓
   - [x] 居中核心区域+引导标语+主标题 ✓
   - [x] 输入框+操作按钮 ✓
   - [x] 校验逻辑（空/格式/积分不足） ✓
   - [x] 加载中弹窗 ✓
   - [x] 仿写结果弹窗 ✓
   - [x] 历史记录弹窗 ✓
   - [x] 积分充值弹窗 ✓
   - [x] Dashboard二级菜单接入 ✓

2. **Placeholder scan:** 无 TBD/TODO ✓

3. **Type consistency:** 所有函数/变量名全流程一致 ✓

---

## Plan Summary

| Task | 文件 | 描述 |
|------|------|------|
| 1 | router/index.js | 添加 /ai-rewrite 路由 |
| 2 | stores/rewriteHistory.js | 创建历史记录 Pinia store |
| 3 | api/shoppingVideo.js | aiRewrite 支持 videoUrl |
| 4 | dialogs/RewriteHistoryDialog.vue | 历史记录弹窗 |
| 5 | dialogs/RewriteResultDialog.vue | 仿写结果弹窗 |
| 6 | dialogs/RewriteRechargeDialog.vue | 积分充值弹窗 |
| 7 | views/AIRewrite.vue | 智能仿写主页面 |
| 8 | Dashboard.vue | 菜单+路由渲染 |
| 9 | 验证构建 | 服务验证 |

**Total: 9 tasks**
