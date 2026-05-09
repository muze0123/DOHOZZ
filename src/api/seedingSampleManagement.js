// src/api/seedingSampleManagement.js
import request from './request'

// 获取样品列表
export function getSeedingSampleList(params) {
  return request({
    url: '/api/seeding/sample/list',
    method: 'GET',
    params
  })
}

// 获取统计数据
export function getSeedingSampleStats(params) {
  return request({
    url: '/api/seeding/sample/stats',
    method: 'GET',
    params
  })
}

// 审批样品
export function approveSeedingSample(data) {
  return request({
    url: '/api/seeding/sample/approve',
    method: 'POST',
    data
  })
}

// 拒绝样品
export function rejectSeedingSample(data) {
  return request({
    url: '/api/seeding/sample/reject',
    method: 'POST',
    data
  })
}

// 发货
export function shipSeedingSample(data) {
  return request({
    url: '/api/seeding/sample/ship',
    method: 'POST',
    data
  })
}

// 删除样品
export function deleteSeedingSample(data) {
  return request({
    url: '/api/seeding/sample/delete',
    method: 'POST',
    data
  })
}

// 更新备注
export function updateSeedingSampleNote(data) {
  return request({
    url: '/api/seeding/sample/note',
    method: 'POST',
    data
  })
}

// 编辑样品
export function updateSeedingSample(data) {
  return request({
    url: '/api/seeding/sample/update',
    method: 'POST',
    data
  })
}