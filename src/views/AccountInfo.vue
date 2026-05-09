<template>
  <div class="account-info">
    <!-- 账号信息内容区 -->
    <div class="account-content">
      <!-- 成员头像 -->
      <div class="avatar-section">
        <div class="avatar-container">
          <el-avatar :size="80" :src="null">
            <el-icon><User /></el-icon>
          </el-avatar>
        </div>
      </div>

      <!-- 信息列表 -->
      <div class="info-list">
        <div class="info-item">
          <span class="info-label">成员名称</span>
          <span class="info-value">{{ accountInfo.memberName }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">成员ID</span>
          <span class="info-value">{{ accountInfo.memberId }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">企业信息</span>
          <span class="info-value">{{ accountInfo.companyInfo }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">企业ID</span>
          <span class="info-value">{{ accountInfo.companyId }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">所属角色</span>
          <span class="info-value">{{ accountInfo.roles }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">入职时间</span>
          <span class="info-value">{{ accountInfo.joinDate }} <span class="work-age">{{ accountInfo.workAge }}</span></span>
        </div>
        <div class="info-item">
          <span class="info-label">绑定手机号</span>
          <span class="info-value">{{ accountInfo.phone }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">登录密码</span>
          <span class="info-value">{{ accountInfo.password }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { User } from '@element-plus/icons-vue'

// 账号信息数据
const accountInfo = ref({
  memberName: '张三',
  memberId: '2312312',
  companyInfo: '杭州微河之众科技有限公司',
  companyId: '12312312',
  roles: '超级管理员、BD组长',
  joinDate: '2025-08-08',
  workAge: '工龄 8天',
  phone: '139****0001',
  password: '***********'
})
</script>

<style lang="scss" scoped>
.account-info {
  padding: 16px 0 24px;
  background: #f5f6f7;
  min-height: calc(100vh - 48px);
}

.account-content {
  background: #fff;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.avatar-section {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 32px;

  .avatar-container {
    display: flex;
    align-items: center;
  }
}

.info-list {
  max-width: 600px;
  margin: 0;
}

.info-item {
  display: flex;
  margin-bottom: 24px;
  align-items: center;

  .info-label {
    width: 120px;
    font-size: 14px;
    color: #666;
    flex-shrink: 0;
  }

  .info-value {
    font-size: 14px;
    color: #333;
    flex: 1;
  }

  .work-age {
    font-size: 14px;
    color: #999;
    margin-left: 16px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .account-content {
    padding: 24px;
  }

  .info-list {
    max-width: 100%;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 16px;

    .info-label {
      width: 100%;
      margin-bottom: 8px;
    }
  }
}
</style>