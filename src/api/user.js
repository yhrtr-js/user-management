import request from '../request.js'

// 获取用户列表
export const getUserList = (params) => {
  return request.get('/users', { params })
}

// 新增用户
export const addUser = (data) => {
  return request.post('/users', data)
}

// 编辑用户
export const updateUser = (data) => {
  return request.put(`/users/${data.id}`, data)
}

// 删除用户
export const deleteUser = (id) => {
  return request.delete(`/users/${id}`)
}

// 切换状态
export const toggleUserStatus = (id, status) => {
  return request.patch(`/users/${id}`, { status })
}