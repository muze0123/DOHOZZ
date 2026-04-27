<template>
  <div class="message-settings-page">
    <h2 class="page-title">消息设置</h2>

    <!-- 区域一：提示横幅 -->
    <div class="info-banner">
      <div class="info-left">
        <div class="info-title">
          <svg class="warning-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <span>提示</span>
        </div>
        <div class="info-desc">
          <p>1、设置启用时，会受到系统的弹窗提醒或消息中心提醒。</p>
          <p>2、开启气泡提醒时默认开启消息中心提醒，关闭消息中心提醒默认关闭气泡提醒。</p>
        </div>
      </div>
      <div class="info-right">
        <button class="btn-text-link" @click="showWechatModal = true">
          <svg class="btn-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M8 10a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4zm-4 12c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          </svg>
          绑定公众号
        </button>
        <button class="btn-text-link" @click="handleGoToMessageCenter">
          <svg class="btn-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
          </svg>
          消息中心
        </button>
      </div>
    </div>

    <!-- 区域二：消息配置表格 -->
    <div class="table-container">
      <table class="settings-table">
        <thead>
          <tr>
            <th style="width: 120px">消息标题</th>
            <th style="flex: 2">消息说明</th>
            <th style="width: 140px">
              <div class="th-content">
                气泡提醒
                <el-tooltip content="在电脑端界面右上角，会以气泡弹窗样式弹出消息通知，气泡会在5秒后自动消失" placement="top">
                  <span class="info-tooltip-icon">?</span>
                </el-tooltip>
              </div>
            </th>
            <th style="width: 140px">消息中心提醒</th>
            <th style="width: 180px">通知方式</th>
            <th style="width: 180px">通知对象</th>
            <th style="width: 80px; text-align: right;">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in messageConfigs" :key="item.id">
            <td>{{ item.title }}</td>
            <td class="td-desc">{{ item.description }}</td>
            <td>
              <div class="toggle-switch" :class="{ active: item.bubbleEnabled }" @click="handleBubbleToggle(item)">
                <div class="toggle-slider"></div>
              </div>
            </td>
            <td>
              <div class="toggle-switch" :class="{ active: item.messageCenterEnabled }" @click="handleMessageCenterToggle(item)">
                <div class="toggle-slider"></div>
              </div>
            </td>
            <td>{{ item.methods.join('，') }}</td>
            <td>{{ item.roles.join('，') }}</td>
            <td style="text-align: right;">
              <span class="action-edit" @click="handleEdit(item)">编辑</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 编辑消息配置弹窗 -->
    <el-dialog
      v-model="showEditModal"
      :title="`编辑 - ${editingItem?.title}`"
      width="440px"
      :close-on-click-modal="false"
      class="edit-dialog"
    >
      <div class="edit-form" v-if="editingItem">
        <div class="form-group">
          <div class="form-label">推送角色</div>
          <el-checkbox-group v-model="editForm.roles">
            <el-checkbox label="所属BD">所属BD</el-checkbox>
            <el-checkbox label="BD主管">BD主管</el-checkbox>
            <el-checkbox label="系统管理员">系统管理员</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="form-group">
          <div class="form-label">推送方式</div>
          <el-checkbox-group v-model="editForm.methods">
            <el-checkbox label="系统消息" disabled>系统消息</el-checkbox>
            <el-checkbox label="公众号推送" @change="handleWechatCheckboxChange">公众号推送</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showEditModal = false">取消</el-button>
          <el-button type="primary" @click="saveEdit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 微信提醒设置弹窗 -->
    <el-dialog
      v-model="showWechatModal"
      title="微信提醒设置"
      width="340px"
      class="wechat-dialog"
    >
      <div class="wechat-modal-content">
        <div class="qrcode-wrapper">
          <div class="qrcode-placeholder">
            <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='%23f5f5f5'/><text x='60' y='65' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%23999'>DOHOZZ</text></svg>" alt="Wechat QR Code" />
          </div>
        </div>
        <div class="scan-guide">
          <p class="main-guide">请用微信"扫一扫"</p>
          <p class="sub-guide">微信扫码关注"DOHOZZ"微信公众号</p>
        </div>
        <div class="benefits-section">
          <p class="benefits-title">绑定微信公众号，您将获得以下功能：</p>
          <div class="benefit-item">
            <svg class="check-icon" viewBox="0 0 24 24" width="14" height="14" fill="#52c41a">
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
            </svg>
            达人释放、达人交付等消息通知
          </div>
          <div class="benefit-item">
            <svg class="check-icon" viewBox="0 0 24 24" width="14" height="14" fill="#52c41a">
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
            </svg>
            达人爆单、跟进异常等消息通知
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { ElMessage } from 'element-plus'

// 注入的导航方法（由 Dashboard 提供），用于跳转到消息中心
const navigateToMenu = inject('navigateToMenu', null)
const toggleMessageCenter = inject('toggleMessageCenter', null)

const handleGoToMessageCenter = () => {
  if (toggleMessageCenter) {
    toggleMessageCenter()
  } else {
    ElMessage.info('消息中心跳转功能不可用')
  }
}

const showWechatModal = ref(false)
const showEditModal = ref(false)
const editingItem = ref(null)
const isWechatBound = ref(false) // Mock status for wechat binding

const editForm = reactive({
  roles: [],
  methods: []
})

const messageConfigs = ref([
  { id: 1, title: '达人分配', description: '达人分配给商务BD后，推送提醒', bubbleEnabled: true, messageCenterEnabled: true, methods: ['系统消息'], roles: ['所属BD'] },
  { id: 2, title: '达人转移', description: '达人转移给其他商务BD后，推送提醒', bubbleEnabled: true, messageCenterEnabled: true, methods: ['系统消息'], roles: ['所属BD'] },
  { id: 3, title: '达人释放公海', description: '达人释放回公海后，推送提醒', bubbleEnabled: true, messageCenterEnabled: true, methods: ['系统消息', '公众号推送'], roles: ['所属BD'] },
  { id: 4, title: '达人即将释放公海', description: '达人剩余3天即将被释放回公海，推送提醒', bubbleEnabled: true, messageCenterEnabled: true, methods: ['系统消息'], roles: ['所属BD'] },
  { id: 5, title: '样品待审批', description: '申请寄样提交后，若需审批，推送提醒', bubbleEnabled: true, messageCenterEnabled: true, methods: ['系统消息'], roles: ['BD主管'] },
  { id: 6, title: '样品审批通过', description: '样品单审批通过，推送提醒', bubbleEnabled: true, messageCenterEnabled: true, methods: ['系统消息'], roles: ['所属BD'] },
  { id: 7, title: '样品审批拒绝', description: '样品单审批拒绝，推送提醒', bubbleEnabled: true, messageCenterEnabled: true, methods: ['系统消息'], roles: ['所属BD'] },
  { id: 8, title: '样品发货', description: '样品单发货完成后，推送提醒', bubbleEnabled: true, messageCenterEnabled: true, methods: ['系统消息'], roles: ['所属BD'] },
  { id: 9, title: '寄样物流异常', description: '样品发货7天后还未签收，推送提醒', bubbleEnabled: true, messageCenterEnabled: true, methods: ['系统消息'], roles: ['所属BD'] },
  { id: 10, title: '样品签收', description: '达人签收样品后，推送提醒', bubbleEnabled: true, messageCenterEnabled: true, methods: ['系统消息'], roles: ['所属BD'] },
  { id: 11, title: '签收超时未交付', description: '样品签收14天后，达人还未开播/发视频，推送提醒', bubbleEnabled: true, messageCenterEnabled: true, methods: ['系统消息'], roles: ['所属BD'] },
  { id: 12, title: '合作单超时未交付', description: '合作单创建14天后，达人还未出单/开播/发视频，推送提醒', bubbleEnabled: true, messageCenterEnabled: true, methods: ['系统消息'], roles: ['所属BD'] },
  { id: 13, title: '店铺即将失效', description: '店铺授权剩余3天即将失效，推送提醒', bubbleEnabled: true, messageCenterEnabled: true, methods: ['系统消息'], roles: ['系统管理员'] },
  { id: 14, title: '店铺授权失效', description: '店铺授权已失效，推送提醒', bubbleEnabled: true, messageCenterEnabled: true, methods: ['系统消息'], roles: ['系统管理员'] }
])

const handleBubbleToggle = (item) => {
  item.bubbleEnabled = !item.bubbleEnabled
  if (item.bubbleEnabled) {
    item.messageCenterEnabled = true // 开启气泡提醒时默认开启消息中心提醒
  }
  ElMessage.success('操作成功')
}

const handleMessageCenterToggle = (item) => {
  item.messageCenterEnabled = !item.messageCenterEnabled
  if (!item.messageCenterEnabled) {
    item.bubbleEnabled = false // 关闭消息中心提醒默认关闭气泡提醒
  }
  ElMessage.success('操作成功')
}

const handleEdit = (item) => {
  editingItem.value = item
  editForm.roles = [...item.roles]
  editForm.methods = [...item.methods]
  
  // 确保系统消息始终被选中
  if (!editForm.methods.includes('系统消息')) {
    editForm.methods.push('系统消息')
  }
  
  showEditModal.value = true
}

const handleWechatCheckboxChange = (val) => {
  if (val && !isWechatBound.value) {
    ElMessage.warning('请先绑定公众号')
    showWechatModal.value = true
    // 暂时取消勾选，等绑定成功后再勾选，这里简化处理直接取消
    const index = editForm.methods.indexOf('公众号推送')
    if (index > -1) {
      editForm.methods.splice(index, 1)
    }
  }
}

const saveEdit = () => {
  if (editForm.roles.length === 0) {
    ElMessage.error('配置角色不能为空')
    return
  }

  // 保存到原始数据
  if (editingItem.value) {
    editingItem.value.roles = [...editForm.roles]
    editingItem.value.methods = [...editForm.methods]
  }

  showEditModal.value = false
  ElMessage.success('保存成功')
}

</script>

<style lang="scss" scoped>
.message-settings-page {
  padding: 24px;
  background: #F5F6F7;
  min-height: calc(100vh - 48px);
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 24px;
}

/* 区域一：提示横幅 */
.info-banner {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #FFFBF0;
  border-left: 4px solid #FA8C16;
  border-top: 1px solid #FFE58F;
  border-right: 1px solid #FFE58F;
  border-bottom: 1px solid #FFE58F;
  border-radius: 6px;
  padding: 16px 20px;
  margin-bottom: 16px;
}

.info-left {
  display: flex;
  flex-direction: column;
}

.info-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #FA8C16;
  margin-bottom: 8px;
  
  .warning-icon {
    color: #FA8C16;
  }
}

.info-desc {
  padding-left: 22px; /* indent to align with text */
  p {
    font-size: 13px;
    color: #595959;
    line-height: 1.8;
    margin: 0;
  }
}

.info-right {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-top: 2px;
}

.btn-text-link {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  font-size: 13px;
  color: #595959;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;

  &:hover {
    color: #1677FF;
  }
}

/* 区域二：消息配置表格 */
.table-container {
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  padding: 0 24px;
}

.settings-table {
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    text-align: left;
    padding: 0 12px;
    
    &:first-child {
      padding-left: 0;
    }
    &:last-child {
      padding-right: 0;
    }
  }

  th {
    height: 48px;
    font-size: 13px;
    color: #8C8C8C;
    font-weight: 500;
    border-bottom: 1px solid #F0F0F0;
  }

  td {
    height: 56px;
    font-size: 14px;
    color: #262626;
    border-bottom: 1px solid #F5F5F5;
  }

  tr:hover td {
    background-color: #FAFAFA;
  }

  tr:last-child td {
    border-bottom: none;
  }
}

.td-desc {
  color: #595959;
}

.th-content {
  display: flex;
  align-items: center;
  gap: 4px;
}

.info-tooltip-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #BFBFBF;
  color: #fff;
  font-size: 10px;
  cursor: help;
  font-family: monospace;
}

/* Toggle 开关 */
.toggle-switch {
  width: 40px;
  height: 22px;
  background: #D9D9D9;
  border-radius: 11px;
  position: relative;
  cursor: pointer;
  transition: background 0.25s;

  &.active {
    background: #1677FF;
    
    .toggle-slider {
      left: 19px;
    }
  }
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  transition: left 0.25s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.action-edit {
  font-size: 13px;
  color: #1677FF;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #4096FF;
    text-decoration: underline;
  }
}

/* 编辑弹窗样式 */
.edit-form {
  padding: 10px 0;
}

.form-group {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  font-size: 14px;
  color: #262626;
  font-weight: 500;
  margin-bottom: 12px;
}

:deep(.el-checkbox) {
  margin-right: 24px;
  color: #595959;
}

/* 微信绑定弹窗 */
.wechat-modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0 20px;
}

.qrcode-wrapper {
  margin-bottom: 16px;
}

.qrcode-placeholder {
  width: 120px;
  height: 120px;
  border: 1px solid #E8E8E8;
  border-radius: 4px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.scan-guide {
  text-align: center;
  margin-bottom: 24px;
  
  .main-guide {
    font-size: 15px;
    color: #262626;
    font-weight: 500;
    margin: 0 0 4px;
  }
  
  .sub-guide {
    font-size: 13px;
    color: #8C8C8C;
    margin: 0;
  }
}

.benefits-section {
  width: 100%;
  background: #FAFAFA;
  padding: 12px 16px;
  border-radius: 6px;
  
  .benefits-title {
    font-size: 13px;
    color: #595959;
    margin: 0 0 8px;
    font-weight: 500;
  }
  
  .benefit-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #595959;
    margin-bottom: 6px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
