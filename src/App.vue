<template>
  <div>
    <div v-if="isLoggedIn" style="padding: 12px 20px; border-bottom: 1px solid #eee; display:flex; gap:16px">
      <router-link to="/user">用户管理</router-link>
      <router-link to="/order">订单管理</router-link>
      <span style="margin-left:auto;font-size:13px;color:#666">
        欢迎，{{ userStore.userInfo?.username }}
      </span>
      <el-button style="margin-left:auto" size="small" @click="handleLogout">退出登录</el-button>
    </div>
    <router-view />
  </div>
</template>

<script setup>
import {computed} from 'vue'
import { useRoute,useRouter  } from 'vue-router'
import { useUserStore } from './stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isLoggedIn = computed(()=>{
  return route.path !== '/login'
})

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>