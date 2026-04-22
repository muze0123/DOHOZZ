<template>
  <div class="commission-help">
    <!-- 顶部导航 -->
    <div class="help-header">
      <div class="header-left">
        <span class="back-btn" @click="handleBack">
          <span class="back-icon">←</span>
          返回
        </span>
        <span class="header-title">功能说明</span>
      </div>
    </div>

    <!-- 主内容 -->
    <div class="help-content">
      <!-- 介绍区 -->
      <div class="section intro-section">
        <h2 class="section-heading">提成管理使用指南</h2>
        <p class="intro-text">提成管理用于配置员工或商品的提成方案，支持多种提成计算方式，帮助企业高效管理销售激励。</p>
      </div>

      <!-- 步骤1：设置基础规则 -->
      <div class="section step-section">
        <div class="step-header">
          <span class="step-number">01</span>
          <span class="step-title">设置基础规则</span>
        </div>
        <div class="step-content">
          <div class="step-desc">
            <p>在提成规则区域，设置提成方式、提成基数和生效日期。</p>
            <p>提成方式决定是按照「商品」还是「员工」来给定提成比例。</p>
          </div>
          <div class="step-image">
            <div class="image-label">示意图</div>
            <div class="image-box">
              <img src="@/assets/help-step1.png" alt="设置基础规则" />
            </div>
          </div>
        </div>
      </div>

      <!-- 步骤2：配置具体提成方案 -->
      <div class="section step-section">
        <div class="step-header">
          <span class="step-number">02</span>
          <span class="step-title">配置具体提成方案</span>
        </div>
        <div class="step-content">
          <div class="step-desc">
            <p>根据不同的员工或商品，配置具体的提成方案。</p>
            <p>可以设置固定提成比例或按业绩分档的阶梯提成。</p>
          </div>
          <div class="step-image">
            <div class="image-label">示意图</div>
            <div class="image-box">
              <img src="@/assets/help-step2.png" alt="配置具体提成方案" />
            </div>
          </div>
        </div>
      </div>

      <!-- 步骤3：查看提成方案 -->
      <div class="section step-section">
        <div class="step-header">
          <span class="step-number">03</span>
          <span class="step-title">查看提成方案</span>
        </div>
        <div class="step-content">
          <div class="step-desc">
            <p>在提成方案区域，可以查看所有已配置的提成方案。</p>
            <p>支持按员工或平台筛选，支持方案名称和商品名称搜索。</p>
          </div>
          <div class="step-image">
            <div class="image-label">示意图</div>
            <div class="image-box">
              <img src="@/assets/help-step3.png" alt="查看提成方案" />
            </div>
          </div>
        </div>
      </div>

      <!-- 步骤4：查看员工提成 -->
      <div class="section step-section">
        <div class="step-header">
          <span class="step-number">04</span>
          <span class="step-title">查看员工提成</span>
        </div>
        <div class="step-content">
          <div class="step-desc">
            <p>查看每个员工的提成明细。</p>
            <p>包括预估佣金、结算状态等信息。</p>
          </div>
          <div class="step-image">
            <div class="image-label">示意图</div>
            <div class="image-box">
              <img src="@/assets/help-step4.png" alt="查看员工提成" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const setThirdLevelPage = inject('setThirdLevelPage')

const handleBack = () => {
  setThirdLevelPage('')
}
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

.commission-help {
  min-height: 100%;
  background: $bg;
}

.help-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px;
  margin-left: -16px;
  margin-right: -16px;
  background: $white;
  border-bottom: 1px solid $divider;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  color: $text-2;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.2s;

  &:hover {
    color: $primary;
  }
}

.back-icon {
  font-size: 16px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: $primary-text;
}

.help-content {
  padding: 24px;
  max-width: 1200px;
}

.section {
  background: $white;
  border-radius: $border-radius-lg;
  padding: 16px;
  margin: 0 0 16px 0;
  border: 1px solid $divider;
}

.section-heading {
  font-size: 18px;
  font-weight: 600;
  color: $primary-text;
  margin: 0 0 12px 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: $primary-text;
  margin-bottom: 16px;
}

.intro-text {
  font-size: 14px;
  color: $secondary-text;
  line-height: 1.6;
  margin: 0;
}

.step-section {
  .step-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid $divider;
  }

  .step-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: $primary;
    color: $white;
    font-size: 12px;
    font-weight: 600;
  }

  .step-title {
    font-size: 15px;
    font-weight: 600;
    color: $primary-text;
  }
}

.step-content {
  display: flex;
  gap: 24px;
}

.step-desc {
  flex: 0 0 280px;
  font-size: 14px;
  color: $secondary-text;
  line-height: 1.8;

  p {
    margin: 0 0 8px 0;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.step-image {
  flex: 1;

  .image-label {
    font-size: 12px;
    color: $text-3;
    margin-bottom: 8px;
  }
}

.image-box {
  border: 1px solid $divider;
  border-radius: 8px;
  overflow: hidden;
  background: $bg;
}

.image-box {
  border: 1px solid $divider;
  border-radius: 8px;
  overflow: hidden;
  background: $bg;

  img {
    width: 100%;
    height: auto;
    display: block;
  }
}

.image-placeholder {
  width: 100%;
  height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: $text-3;

  .placeholder-icon {
    font-size: 40px;
    margin-bottom: 12px;
  }

  .placeholder-text {
    font-size: 14px;
  }
}
</style>
