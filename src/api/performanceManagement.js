// src/api/performanceManagement.js
import request from './request'

// 获取绩效列表
export function getPerformanceList(params) {
  return request({
    url: '/api/performance/list',
    method: 'GET',
    params
  })
}

// 获取部门列表
export function getDepartmentList() {
  return request({
    url: '/api/department/list',
    method: 'GET'
  })
}

// 获取媒介列表
export function getMediumList() {
  return request({
    url: '/api/medium/list',
    method: 'GET'
  })
}

// 导出绩效数据
export function exportPerformance(data) {
  return request({
    url: '/api/performance/export',
    method: 'POST',
    data
  })
}