import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 当前登录的用户信息
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo')||'null'))
  // 令牌
  const token = ref(localStorage.getItem('token') || '')

  const permissions = computed(()=>{
    if(userInfo.value?.role === '管理员'){
      return ['user:add', 'user:edit', 'user:delete', 'user:view']
    }
    return ['user:view']
  })

  const hasPermission = (permission) => {
    return permissions.value.includes(permission)
  }

  // 登录
  const login = (data) => {
    token.value = data.token
    userInfo.value = data.userInfo
    localStorage.setItem('token', data.token)
    localStorage.setItem('userInfo', JSON.stringify(data.userInfo))
  }

  // 退出
  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  return { userInfo, token, login, logout,hasPermission }
})