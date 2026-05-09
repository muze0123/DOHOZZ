import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'

export const useRewriteHistoryStore = defineStore('rewriteHistory', () => {
  const historyList = ref([])

  function addRecord(record) {
    if (!record || typeof record.videoUrl !== 'string' || typeof record.rewriteContent !== 'string') {
      console.warn('addRecord: invalid record, expected { videoUrl: string, rewriteContent: string }')
      return
    }
    historyList.value.unshift({
      id: crypto.randomUUID(),
      time: new Date().toLocaleString('zh-CN'),
      videoUrl: record.videoUrl.trim(),
      rewriteContent: record.rewriteContent.trim()
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

  return {
    historyList: readonly(historyList),
    addRecord,
    deleteRecord,
    clearAll
  }
})
