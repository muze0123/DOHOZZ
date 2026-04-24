<template>
  <div class="business-config">
    <!-- 页面标题区 -->
    <div class="page-header">
      <h2 class="page-title">业务配置</h2>
    </div>

    <!-- Tab区 -->
    <div class="config-tabs">
      <div
        class="tab-item"
        :class="{ active: activeTab === 'talent' }"
        @click="handleTabChange('talent')"
      >达人规则</div>
      <div
        class="tab-item"
        :class="{ active: activeTab === 'sample' }"
        @click="handleTabChange('sample')"
      >样品规则</div>
    </div>

    <!-- 达人规则内容 -->
    <div v-if="activeTab === 'talent'" class="config-content">
      <div class="config-grid">
        <!-- 达人跟进规则 -->
        <div class="config-section">
          <div class="section-title">达人跟进规则</div>
          <div class="section-content">
            <!-- BD可合作达人数量 -->
            <div class="config-item">
              <div class="item-label">BD可合作达人数量</div>
              <div class="item-control">
                <div class="radio-group">
                  <el-radio v-model="talentConfig.bdLimitType" value="unlimited">不限制</el-radio>
                  <el-radio v-model="talentConfig.bdLimitType" value="limited">限制</el-radio>
                </div>
                <div v-if="talentConfig.bdLimitType === 'limited'" class="limit-inputs">
                  <div class="input-row">
                    <span class="input-label">每个BD每日可跟进达人数：</span>
                    <el-input
                      v-model="talentConfig.bdDailyLimit"
                      type="number"
                      placeholder="不限制"
                      :min="0"
                      :max="99999"
                      class="number-input"
                      @input="handleBdDailyLimitInput"
                    />
                    <span class="input-tip">选填，不填则不限制</span>
                  </div>
                  <div class="input-row">
                    <span class="input-label">每个BD总共可跟进达人数：</span>
                    <el-input
                      v-model="talentConfig.bdTotalLimit"
                      type="number"
                      placeholder="不限制"
                      :min="0"
                      :max="99999"
                      class="number-input"
                      @input="handleBdTotalLimitInput"
                    />
                    <span class="input-tip">选填，不填则不限制</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 触达环节是否可跳过 -->
            <div class="config-item">
              <div class="item-label">触达环节是否可跳过</div>
              <div class="item-control">
                <div class="radio-group">
                  <el-radio v-model="talentConfig.contactSkip" :value="true">可跳过</el-radio>
                  <el-radio v-model="talentConfig.contactSkip" :value="false">不可跳过</el-radio>
                </div>
                <div class="item-hint">（跟进达人后即可邀约）</div>
              </div>
            </div>

            <!-- 邀约环节是否可跳过 -->
            <div class="config-item">
              <div class="item-label">邀约环节是否可跳过</div>
              <div class="item-control">
                <div class="radio-group">
                  <el-radio v-model="talentConfig.inviteSkip" :value="true">可跳过</el-radio>
                  <el-radio v-model="talentConfig.inviteSkip" :value="false">不可跳过</el-radio>
                </div>
                <div class="item-hint">（触达达人后即可寄样）</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 达人公海规则 -->
        <div class="config-section">
          <div class="section-title">达人公海规则</div>
          <div class="section-content">
            <!-- 达人公海分配规则 -->
            <div class="config-item">
              <div class="item-label">达人公海分配规则</div>
              <div class="item-control">
                <div class="radio-group">
                  <el-radio v-model="talentConfig.poolAssignType" value="both">BD跟进或主管分配</el-radio>
                  <el-radio v-model="talentConfig.poolAssignType" value="manager">仅主管分配</el-radio>
                </div>
                <div class="item-hint">有部门主管分配或BD自主选择达人进行跟进</div>
              </div>
            </div>

            <!-- 释放回公海 -->
            <div class="config-item">
              <div class="item-label">释放回公海</div>
              <div class="item-control">
                <el-switch v-model="talentConfig.poolReleaseEnabled" />
                <div class="item-hint">开启后，可设置具体的释放回公海规则</div>
                <div v-if="talentConfig.poolReleaseEnabled" class="release-rules">
                  <div class="release-rules-title">释放规则</div>
                  <div class="release-rules-list">
                    <div v-for="(rule, index) in talentConfig.releaseRules" :key="index" class="release-rule-item">
                      <div class="rule-header">
                        <el-switch v-model="rule.enabled" />
                        <span class="rule-name">规则{{ index + 1 }}</span>
                      </div>
                      <div v-if="rule.enabled" class="rule-body">
                        <div class="rule-row">
                          <span class="rule-label">场景</span>
                          <el-select v-model="rule.scene" placeholder="请选择场景" style="width: 160px">
                            <el-option value="follow" label="达人跟进后" />
                            <el-option value="contact" label="达人触达后" />
                            <el-option value="invite" label="达人邀约后" />
                            <el-option value="send" label="达人寄样后" />
                            <el-option value="fulfill" label="达人履约后" />
                            <el-option value="cooperate" label="达人合作后" />
                            <el-option value="order" label="达人出单后" />
                          </el-select>
                        </div>
                        <div class="rule-row">
                          <span class="rule-label">天数</span>
                          <el-input
                            v-model="rule.days"
                            type="number"
                            placeholder="请输入天数"
                            :min="1"
                            :max="999"
                            class="rule-input"
                          />
                          <span class="rule-unit">天</span>
                          <span v-if="rule.enabled && !rule.days" class="error-text">请输入天数</span>
                        </div>
                        <div class="rule-row">
                          <span class="rule-label">判断标准</span>
                          <el-select v-model="rule.criteria" placeholder="请选择判断标准" style="width: 200px">
                            <el-option value="no_contact" label="未触达" />
                            <el-option value="no_invite" label="未邀约" />
                            <el-option value="no_send" label="未寄样" />
                            <el-option value="no_fulfill" label="未履约" />
                            <el-option value="no_cooperate" label="未合作" />
                            <el-option value="no_order" label="未出单" />
                            <el-option value="no_contact_invite" label="未触达/未邀约" />
                            <el-option value="no_invite_send" label="未邀约/未寄样" />
                            <el-option value="no_send_fulfill" label="未寄样/未履约" />
                            <el-option value="no_fulfill_cooperate" label="未履约/未合作" />
                            <el-option value="no_cooperate_order" label="未合作/未出单" />
                            <el-option value="no_order_only" label="未出单" />
                          </el-select>
                        </div>
                        <div class="rule-row">
                          <span class="rule-label">累计金额</span>
                          <el-input
                            v-model="rule.amount"
                            type="number"
                            placeholder="请输入金额"
                            :min="0.01"
                            :precision="2"
                            class="rule-input"
                          />
                          <span class="rule-unit">元</span>
                          <span class="rule-criteria-text">天内，累计支付金额小于</span>
                          <span v-if="rule.enabled && !rule.amount" class="error-text">请输入累计支付金额</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 重新跟进释放的达人 -->
            <div class="config-item">
              <div class="item-label">重新跟进释放的达人</div>
              <div class="item-control">
                <div class="radio-group">
                  <el-radio v-model="talentConfig.reassignType" value="unlimited">不限制</el-radio>
                  <el-radio v-model="talentConfig.reassignType" value="limited">限制</el-radio>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 样品规则内容 -->
    <div v-if="activeTab === 'sample'" class="config-content">
      <div class="config-section single">
        <div class="section-content">
          <!-- 样品审批 -->
          <div class="config-item">
            <div class="item-label">样品审批</div>
            <div class="item-control">
              <el-switch v-model="sampleConfig.approvalEnabled" />
              <div class="item-hint">开启后样品必须由部门主管或管理员审批通过才可以发货</div>
            </div>
          </div>

          <!-- 样品交付方式 -->
          <div class="config-item">
            <div class="item-label">样品交付方式</div>
            <div class="item-control">
              <div class="radio-group vertical">
                <el-radio v-model="sampleConfig.deliveryType" value="same_spu">
                  达人出单商品链接和样品一致才算交付
                </el-radio>
                <div class="delivery-hint">
                  举例：给达人寄商品链接a，则达人需要出单商品链接a的商品，或者达人出的商品链接b和商品链接a同一个spu
                </div>
                <el-radio v-model="sampleConfig.deliveryType" value="any_product">
                  达人出单企业下任意商品即算交付
                </el-radio>
                <div class="delivery-hint">
                  举例：给达人寄商品链接a，则达人只要出了企业内任意商品的订单即算交付；如果开启了店铺分组，则员工跟达人合作，达人只有出了员工所负责的商品才算交付
                </div>
              </div>
            </div>
          </div>

          <!-- 支持手动交付 -->
          <div class="config-item">
            <div class="item-label">支持手动交付</div>
            <div class="item-control">
              <el-switch v-model="sampleConfig.manualDeliveryEnabled" />
              <div class="item-hint">
                不支持手动交付：达人发布视频或直播后，监控中的达人，抖音平台支持自动识别交付（其他平台不支持自动交付），并且不支持手动对样品单进行交付<br/>
                支持手动交付：达人发布视频或直播后，监控中的达人，抖音平台支持自动识别交付（其他平台不支持自动交付），还允许BD手动复制视频链接或直播截图进行样品交付，历史样品单也可以支持手动交付
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作区 -->
    <div class="config-actions">
      <el-button @click="handleRestore">恢复</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>

    <!-- 恢复确认弹窗 -->
    <el-dialog v-model="restoreDialogVisible" title="确认恢复" width="440px">
      <div class="restore-tip">
        <p>确定要恢复到最后保存的状态吗？</p>
        <p>当前未保存的配置将被丢弃。</p>
      </div>
      <template #footer>
        <el-button @click="restoreDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmRestore">确定</el-button>
      </template>
    </el-dialog>

    <!-- 切换Tab确认弹窗 -->
    <el-dialog v-model="tabSwitchDialogVisible" title="提示" width="440px">
      <div class="switch-tip">
        <p>当前配置未保存，是否保存当前配置？</p>
      </div>
      <template #footer>
        <el-button @click="handleDiscardAndSwitch">不保存</el-button>
        <el-button @click="handleSaveAndSwitch">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'

// Tab状态
const activeTab = ref('talent')

// 达人规则配置
const defaultTalentConfig = {
  bdLimitType: 'unlimited',
  bdDailyLimit: '',
  bdTotalLimit: '',
  contactSkip: true,
  inviteSkip: true,
  poolAssignType: 'both',
  poolReleaseEnabled: false,
  releaseRules: [],
  reassignType: 'unlimited'
}

const talentConfig = reactive(JSON.parse(JSON.stringify(defaultTalentConfig)))

// 样品规则配置
const defaultSampleConfig = {
  approvalEnabled: false,
  deliveryType: 'same_spu',
  manualDeliveryEnabled: false
}

const sampleConfig = reactive(JSON.parse(JSON.stringify(defaultSampleConfig)))

// 临时保存的配置（用于恢复）
let savedTalentConfig = JSON.parse(JSON.stringify(defaultTalentConfig))
let savedSampleConfig = JSON.parse(JSON.stringify(defaultSampleConfig))

// 是否有过未保存的修改
const hasUnsavedChanges = ref(false)

watch([talentConfig, sampleConfig], () => {
  hasUnsavedChanges.value = true
}, { deep: true })

// 恢复确认弹窗
const restoreDialogVisible = ref(false)

// 切换Tab确认弹窗
const tabSwitchDialogVisible = ref(false)
let pendingTabSwitch = ref(null)

// BD每日跟进限制输入处理
function handleBdDailyLimitInput(value) {
  if (value === '') {
    talentConfig.bdDailyLimit = ''
  }
}

// BD总共跟进限制输入处理
function handleBdTotalLimitInput(value) {
  if (value === '') {
    talentConfig.bdTotalLimit = ''
  }
}

// Tab切换
function handleTabChange(tab) {
  if (tab === activeTab.value) return

  if (hasUnsavedChanges.value) {
    pendingTabSwitch.value = tab
    tabSwitchDialogVisible.value = true
  } else {
    activeTab.value = tab
  }
}

// 切换Tab - 保存并切换
async function handleSaveAndSwitch() {
  await handleSave()
  activeTab.value = pendingTabSwitch.value
  tabSwitchDialogVisible.value = false
}

// 切换Tab - 不保存并切换
function handleDiscardAndSwitch() {
  hasUnsavedChanges.value = false
  activeTab.value = pendingTabSwitch.value
  tabSwitchDialogVisible.value = false
}

// 保存配置
async function handleSave() {
  // 深拷贝当前配置作为已保存状态
  savedTalentConfig = JSON.parse(JSON.stringify(talentConfig))
  savedSampleConfig = JSON.parse(JSON.stringify(sampleConfig))
  hasUnsavedChanges.value = false

  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 500))

  ElMessage.success('保存成功')
}

// 恢复配置
function handleRestore() {
  restoreDialogVisible.value = true
}

// 确认恢复
function handleConfirmRestore() {
  // 恢复到上次保存的状态
  Object.assign(talentConfig, JSON.parse(JSON.stringify(savedTalentConfig)))
  Object.assign(sampleConfig, JSON.parse(JSON.stringify(savedSampleConfig)))
  hasUnsavedChanges.value = false

  restoreDialogVisible.value = false
  ElMessage.success('恢复成功')
}
</script>

<style lang="scss" scoped>
.business-config {
  padding: 16px 0 24px;
  background: #f5f6f7;
  min-height: calc(100vh - 48px);
}

.page-header {
  background: #fff;
  padding: 16px 24px;
  border-radius: 8px 8px 0 0;

  .page-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
}

.config-tabs {
  display: flex;
  background: #fff;
  padding: 0 24px;
  border-bottom: 1px solid #e8e8e8;

  .tab-item {
    padding: 12px 24px;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;

    &.active {
      color: #0064E0;
      font-weight: 600;
      border-bottom-color: #0064E0;
    }

    &:hover:not(.active) {
      color: #333;
    }
  }
}

.config-content {
  background: #fff;
  padding: 24px;
  border-radius: 0 0 8px 8px;
  min-height: calc(100vh - 200px);
}

.config-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.config-section {
  &.single {
    max-width: 600px;
  }

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e8e8e8;
  }

  .section-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
}

.config-item {
  .item-label {
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;
  }

  .item-control {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .item-hint {
    font-size: 12px;
    color: #999;
    line-height: 1.5;
  }

  .radio-group {
    display: flex;
    gap: 24px;

    &.vertical {
      flex-direction: column;
      gap: 12px;
    }
  }

  .limit-inputs {
    margin-top: 12px;
    padding: 16px;
    background: #f5f6f7;
    border-radius: 4px;

    .input-row {
      display: flex;
      align-items: center;
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .input-label {
      font-size: 13px;
      color: #666;
      width: 180px;
      flex-shrink: 0;
    }

    .number-input {
      width: 120px;
      margin-right: 8px;
    }

    .input-tip {
      font-size: 12px;
      color: #999;
    }
  }
}

.release-rules {
  margin-top: 16px;
  padding: 16px;
  background: #f5f6f7;
  border-radius: 4px;

  .release-rules-title {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin-bottom: 12px;
  }

  .release-rules-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .release-rule-item {
    background: #fff;
    border-radius: 4px;
    padding: 12px;

    .rule-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;

      .rule-name {
        font-size: 13px;
        color: #666;
      }
    }

    .rule-body {
      padding-left: 32px;
    }

    .rule-row {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      flex-wrap: wrap;
      gap: 8px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .rule-label {
      font-size: 13px;
      color: #666;
      width: 56px;
      flex-shrink: 0;
    }

    .rule-input {
      width: 100px;
    }

    .rule-unit {
      font-size: 13px;
      color: #666;
    }

    .rule-criteria-text {
      font-size: 12px;
      color: #999;
    }

    .error-text {
      font-size: 12px;
      color: #ff4d4f;
      width: 100%;
    }
  }
}

.delivery-hint {
  font-size: 12px;
  color: #999;
  line-height: 1.6;
  margin: 4px 0 8px 24px;
}

.config-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  background: #fff;
  border-top: 1px solid #e8e8e8;
  margin-top: 16px;
  border-radius: 0 0 8px 8px;
}

.restore-tip,
.switch-tip {
  font-size: 14px;
  color: #666;
  line-height: 1.8;

  p {
    margin: 0;
  }
}
</style>