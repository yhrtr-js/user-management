import { createRouter, createWebHistory } from 'vue-router'
import UserManagement from './views/UserManagement.vue'
import OrderManagement from './views/OrderManagement.vue'
import OrderDetail from './views/OrderDetail.vue'
import Login from './views/Login.vue'
import { useUserStore } from './stores/user.js'

const routes = [
  { path: '/', redirect: '/user' },
  { path: '/login', component: Login },
  { path: '/user',  component: UserManagement },
  { path: '/order',  component: OrderManagement },
  {path: '/order/:id',  component:OrderDetail}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from) => {
  const userStore = useUserStore()
  if (!userStore.token && to.path !== '/login') {
    return '/login'
  }
})

export default router