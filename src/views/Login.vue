<template>
  <div class="login-page">
    <!-- Left Side - Brand Panel -->
    <div class="brand-panel">
      <div class="brand-header">
        <img src="@/assets/images/DOHOZZ_LOOGO.png" alt="DOHOZZ" class="brand-logo" />
        <h1 class="brand-name">DOHOZZ</h1>
      </div>

      <div class="brand-content">
        <h2 class="system-name">DOHOZZ达人智能运营平台</h2>
        <p class="system-slogan">精准达人营销，智能决策驱动社媒电商增长</p>
      </div>

      <!-- Decorative Elements -->
      <div class="decorative-gradient-orb orb-2"></div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="login-panel">
      <div class="login-form-wrapper">
        <div class="login-header">
          <h2>欢迎回来</h2>
        </div>

        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          size="large"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="email">
            <el-input
              v-model="loginForm.email"
              :prefix-icon="User"
              placeholder="请输入手机号"
              clearable
              @blur="validateField('email')"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              :prefix-icon="Lock"
              type="password"
              placeholder="请输入密码"
              show-password
              @blur="validateField('password')"
            />
          </el-form-item>

          <div class="form-options">
            <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
          </div>

          <el-form-item>
            <el-button
              type="primary"
              class="login-button"
              :loading="loading"
              native-type="submit"
            >
              {{ loading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()

const loginFormRef = ref(null)
const isLoaded = ref(false)
const loginForm = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const loading = ref(false)

const validateEmail = (_rule, value, callback) => {
  if (!isLoaded.value) {
    callback()
    return
  }
  const email = value.trim()
  const phoneRegex = /^1[3-9]\d{9}$/

  if (!email) {
    callback(new Error('请输入手机号'))
    return
  }

  if (!phoneRegex.test(email)) {
    callback(new Error('请输入有效的手机号'))
    return
  }

  callback()
}

const validatePassword = (_rule, value, callback) => {
  if (!isLoaded.value) {
    callback()
    return
  }
  const password = value

  if (!password) {
    callback(new Error('请输入密码'))
    return
  }

  if (password.length < 6) {
    callback(new Error('密码长度至少为6个字符'))
    return
  }

  callback()
}

const loginRules = reactive({
  email: [{ validator: validateEmail, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }]
})

const validateField = (field) => {
  loginFormRef.value?.validateField(field)
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    const valid = await loginFormRef.value.validate()
    if (!valid) {
      ElMessage.error('请检查输入信息是否正确')
      return
    }

    loading.value = true
    await new Promise(resolve => setTimeout(resolve, 2000))

    if (loginForm.rememberMe) {
      localStorage.setItem('rememberedUser', btoa(loginForm.email))
    } else {
      localStorage.removeItem('rememberedUser')
    }

    ElMessage.success('登录成功！正在跳转...')

    // 设置认证令牌
    localStorage.setItem('auth_token', 'logged_in')

    setTimeout(() => {
      router.push('/workspace')
    }, 500)
  } catch (error) {
    ElMessage.error(error.message || '登录失败，请重试')
  } finally {
    loading.value = false
  }
}

const loadRememberedUser = async () => {
  try {
    const encryptedEmail = localStorage.getItem('rememberedUser')
    if (encryptedEmail) {
      loginForm.email = atob(encryptedEmail)
      loginForm.rememberMe = true
      await nextTick()
      isLoaded.value = true
    }
  } catch (e) {
    console.warn('无法加载记住的用户信息:', e)
  }
}

onMounted(async () => {
  await loadRememberedUser()
  isLoaded.value = true
})
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  background-image: url('@/assets/images/background.png');
  background-size: cover;
  background-position: center;
}

// Brand Panel (Left Side)
.brand-panel {
  flex: 1;
  background-image: url('@/assets/images/background.png');
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 40px;
  min-width: 400px;

  @media (max-width: 1100px) {
    min-width: 320px;
    padding: 32px;
  }

  @media (max-width: 968px) {
    display: none;
  }
}

.brand-header {
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10;
}

.brand-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.brand-name {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.05em;
  margin: 0;
}

.brand-slogan {
  display: flex;
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.6;
}

.brand-content {
  position: absolute;
  top: 50%;
  left: 20%;
  transform: translateY(-50%);
  text-align: left;
  z-index: 10;

  @media (max-width: 1100px) {
    left: 25%;
  }
}

.system-name {
  font-size: clamp(1.5rem, 2.5vw, 3rem);
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.05em;
  margin: 0 0 16px 0;
  white-space: nowrap;
}

.system-slogan {
  font-size: clamp(0.875rem, 1.2vw, 1.25rem);
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.6;
}

// Decorative Elements
.decorative-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  right: -50px;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
}

.decorative-gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
}

.orb-1 {
  width: 250px;
  height: 250px;
  background: rgba(255, 255, 255, 0.15);
  top: 20%;
  right: -80px;
}

.orb-2 {
  width: 180px;
  height: 180px;
  background: rgba(255, 255, 255, 0.1);
  bottom: 25%;
  left: -60px;
}

// Login Panel (Right Side)
.login-panel {
  width: 660px;
  min-width: 360px;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  padding: 40px 24px;
  z-index: 10;
  flex-shrink: 0;

  @media (max-width: 1550px) {
    width: 560px;
    min-width: 480px;
  }

  @media (max-width: 1200px) {
    width: 480px;
    min-width: 400px;
  }

  @media (max-width: 968px) {
    width: 100%;
    min-width: 100%;
    flex: 1;
  }

  @media (max-width: 480px) {
    padding: 32px 16px;
  }
}

.login-form-wrapper {
  width: 100%;
  max-width: 400px;
  animation: fadeIn 0.6s ease-out;

  @media (max-width: 480px) {
    max-width: 100%;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 40px;

  h2 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 8px;
  }

  p {
    font-size: 0.9375rem;
    color: #64748b;
  }
}

.login-form {
  width: 400px;
  max-width: 100%;

  :deep(.el-form-item) {
    width: 400px;
    max-width: 100%;
    margin-bottom: 24px;
  }

  :deep(.el-form-item__content) {
    flex: none;
    width: 400px;
    max-width: 400px;
  }

  :deep(.el-input) {
    position: relative;
    display: inline-block;
    width: 400px !important;
    max-width: 100%;
    height: 52px;
    font-size: 14px;
    --el-input-height: 52px;
    --el-input-border-radius: 12px;
  }

  :deep(.el-input__wrapper) {
    box-sizing: border-box;
    width: 400px;
    max-width: 100%;
    height: 52px;
    min-height: 52px;
    border-radius: 12px;
    box-shadow: 0 0 0 1px #e2e8f0;
    transition: all 0.15s ease;
    padding: 0 16px;

    .el-input__inner {
      height: 52px;
      line-height: 52px;
      font-size: 14px;
    }

    .el-input__prefix,
    .el-input__suffix {
      display: flex;
      align-items: center;
      height: 52px;
    }

    .el-input__prefix {
      padding-right: 8px;
    }

    .el-input__suffix {
      gap: 4px;
    }

    .iconfont {
      font-family: 'iconfont', sans-serif;
      font-size: 16px;
    }

    .el-input__clear {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
    }

    &:hover {
      box-shadow: 0 0 0 1px #cbd5e1;
    }

    &.is-focus {
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.login-button {
  width: 100%;
  height: 52px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
  border: none;
  box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.4);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px 0 rgba(99, 102, 241, 0.5);
  }

  &:active {
    transform: translateY(0);
  }
}

@media (max-width: 968px) {
  .login-panel {
    padding: 40px 24px;
  }
}

@media (max-width: 640px) {
  .login-header {
    margin-bottom: 28px;

    h2 {
      font-size: 1.5rem;
    }
  }

  .login-form {
    width: 100%;

    :deep(.el-form-item) {
      width: 100%;
      margin-bottom: 20px;
    }

    :deep(.el-form-item__content) {
      width: 100%;
      max-width: 100%;
    }

    :deep(.el-input) {
      max-width: 100%;
      height: 48px;
      --el-input-height: 48px;
    }

    :deep(.el-input__wrapper) {
      width: 100%;
      height: 48px;
      min-height: 48px;

      .el-input__inner,
      .el-input__prefix,
      .el-input__suffix {
        height: 48px;
        line-height: 48px;
      }
    }
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .login-button {
    height: 48px;
  }
}

@media (max-width: 480px) {
  .login-panel {
    padding: 24px 16px;
  }

  .login-header {
    margin-bottom: 24px;

    h2 {
      font-size: 1.25rem;
    }
  }

  .login-form {
    :deep(.el-form-item) {
      margin-bottom: 16px;
    }

    :deep(.el-input) {
      height: 44px;
      --el-input-height: 44px;
    }

    :deep(.el-input__wrapper) {
      height: 44px;
      min-height: 44px;

      .el-input__inner,
      .el-input__prefix,
      .el-input__suffix {
        height: 44px;
        line-height: 44px;
      }
    }
  }

  .login-button {
    height: 44px;
    font-size: 0.9375rem;
  }
}
</style>
