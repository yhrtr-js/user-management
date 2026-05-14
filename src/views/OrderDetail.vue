<template>
    <div style="padding: 20px;" v-if="orderDetail">
        <h2>订单详情</h2>
        <p>订单号：{{ orderDetail.id }}</p>
        <p>买家：{{ orderDetail.buyer }}</p>
        <p>商品：{{ orderDetail.product }}</p>
        <p>金额：{{ orderDetail.amount }}</p>   
        <p>下单时间：{{ orderDetail.date }}</p>
        <p>状态：{{ statusMap[orderDetail.status] }}</p>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router'
import { fetchOrderDetail } from '../mock.js'
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'    

const route = useRoute()
const orderId = computed(()=>route.params.id)
const orderDetail = ref(null)
const statusMap = {
  wait_pay: '待付款',
  wait_ship: '待发货',
  shipped: '已发货',
  done: '已完成',
  cancelled: '已取消'
}
onMounted(async ()=>{
  try {
    const res = await fetchOrderDetail(orderId.value)
    orderDetail.value = res
  } catch (error) {
    ElMessage.error('获取订单详情失败')
  }
})
</script>