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
