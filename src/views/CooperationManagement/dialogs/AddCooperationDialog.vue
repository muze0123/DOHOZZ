<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增合作单"
    width="560px"
    @close="handleClose"
  >
    <div class="form">
      <div class="form-row">
        <div class="form-item">
          <div class="form-label"><span class="required">*</span>达人</div>
          <el-select v-model="influencerId" placeholder="请选择达人" filterable style="width: 100%">
            <el-option v-for="inf in influencerOptions" :key="inf.id" :label="inf.name" :value="inf.id" />
          </el-select>
        </div>
        <div class="form-item">
          <div class="form-label"><span class="required">*</span>合作模式</div>
          <el-select v-model="mode" placeholder="请选择模式" style="width: 100%">
            <el-option v-for="opt in modeOptions.filter(o => o.value)" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-item">
          <div class="form-label"><span class="required">*</span>交付开始时间</div>
          <el-date-picker v-model="deliveryStartTime" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width: 100%" />
        </div>
        <div class="form-item">
          <div class="form-label">交付结束时间</div>
          <el-date-picker v-model="deliveryEndTime" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width: 100%" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-item">
          <div class="form-label"><span class="required">*</span>所属BD</div>
          <el-select v-model="bdId" placeholder="请选择BD" filterable style="width: 100%">
            <el-option v-for="bd in bdOptions" :key="bd.id" :label="bd.name" :value="bd.id" />
          </el-select>
        </div>
        <div class="form-item">
          <div class="form-label"><span class="required">*</span>所属店铺</div>
          <el-select v-model="shopId" placeholder="请选择店铺" filterable style="width: 100%">
            <el-option v-for="shop in shopOptions" :key="shop.id" :label="shop.name" :value="shop.id" />
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <div class="form-label"><span class="required">*</span>合作商品</div>
        <el-select v-model="productIds" multiple placeholder="请选择商品" filterable style="width: 100%">
          <el-option v-for="p in productOptions" :key="p.id" :label="p.name" :value="p.id" />
        </el-select>
      </div>
      <div class="form-item">
        <div class="form-label">坑位费</div>
        <el-input v-model="slotFee" placeholder="请输入坑位费" type="number"><template #append>元</template></el-input>
      </div>
      <div class="form-item">
        <div class="form-label">备注</div>
        <el-input v-model="note" type="textarea" :rows="3" placeholder="请输入备注" maxlength="200" show-word-limit />
      </div>
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: Boolean,
  influencerOptions: { type: Array, default: () => [] },
  bdOptions: { type: Array, default: () => [] },
  shopOptions: { type: Array, default: () => [] },
  productOptions: { type: Array, default: () => [] },
  modeOptions: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue', 'success'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const influencerId = ref('')
const mode = ref('')
const deliveryStartTime = ref('')
const deliveryEndTime = ref('')
const bdId = ref('')
const shopId = ref('')
const productIds = ref([])
const slotFee = ref('')
const note = ref('')

function handleClose() {
  dialogVisible.value = false
  resetForm()
}

function resetForm() {
  influencerId.value = ''
  mode.value = ''
  deliveryStartTime.value = ''
  deliveryEndTime.value = ''
  bdId.value = ''
  shopId.value = ''
  productIds.value = []
  slotFee.value = ''
  note.value = ''
}

function handleConfirm() {
  if (!influencerId.value) { ElMessage.warning('请选择达人'); return }
  if (!mode.value) { ElMessage.warning('请选择合作模式'); return }
  if (!deliveryStartTime.value) { ElMessage.warning('请选择交付时间'); return }
  if (!bdId.value) { ElMessage.warning('请选择所属BD'); return }
  if (!shopId.value) { ElMessage.warning('请选择所属店铺'); return }
  if (productIds.value.length === 0) { ElMessage.warning('请选择合作商品'); return }
  emit('success')
}
</script>

<style scoped>
.form { padding: 8px 0; }
.form-item { margin-bottom: 16px; }
.form-row { display: flex; gap: 16px; .form-item { flex: 1; } }
.form-label { font-size: 14px; color: #333; margin-bottom: 8px; .required { color: #ff4d4f; margin-right: 4px; } }
</style>
