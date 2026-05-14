<template>
  <div>
    <el-form :model="searchForm" :inline="true">
      <el-form-item label="订单号或者买家">
        <el-input v-model="searchForm.keyword" placeholder="请输入订单号或者买家"></el-input>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="searchForm.status" placeholder="请选择订单状态">
          <el-option label="待付款" value="wait_pay"></el-option>
          <el-option label="待发货" value="wait_ship"></el-option>
          <el-option label="已发货" value="shipped"></el-option>
          <el-option label="已完成" value="done"></el-option>
          <el-option label="已取消" value="cancelled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleSearchReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" v-loading="loading" style="width: 100%">
      <el-table-column prop="id" label="订单号"></el-table-column>
      <el-table-column prop="buyer" label="买家"></el-table-column>
      <el-table-column prop="product" label="商品"></el-table-column>
      <el-table-column prop="amount" label="金额"></el-table-column>
      <el-table-column prop="date" label="下单时间"></el-table-column>
      <el-table-column  label="状态">
        <template #default="scope">
          <el-tag type="info" v-if="scope.row.status === 'wait_pay'">待付款</el-tag>
          <el-tag type="primary" v-else-if="scope.row.status === 'wait_ship'">待发货</el-tag>
          <el-tag type="success" v-else-if="scope.row.status === 'shipped'">已发货</el-tag>
          <el-tag type="danger" v-else-if="scope.row.status === 'done'">已完成</el-tag>
          <el-tag type="warning" v-else-if="scope.row.status === 'cancelled'">已取消</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="400">
        <template #default="scope">
          <el-button type="primary" size="mini" @click="checkDetails(scope.row)">查看详情</el-button>
          <el-button type="primary" size="mini" v-if="scope.row.status === 'wait_ship'" @click="shipConfirm(scope.row)">确认发货</el-button>
          <el-button type="primary" size="mini" v-if="scope.row.status === 'shipped'" @click="receiveConfirm(scope.row)">确认收货</el-button>
          <el-button type="primary" size="mini" v-if="scope.row.status === 'wait_pay'||scope.row.status === 'wait_ship'" @click="cancelConfirm(scope.row)">取消订单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
    
<script setup>
import {ref,reactive,onMounted} from 'vue'
import { fetchOrderList, shipOrder, receiveOrder, cancelOrder} from '../mock.js'
import {ElMessage} from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()

const searchForm=reactive({
  keyword:'',
  status:'',
})

const tableData=ref([])
const loading = ref(false)

const formDetailsShow=ref(false)
const currentDetails=ref(null)

const total=ref(0)
const currentPage=ref(1)
const pageSize=ref(10)

const getTable = async ()=>{
  loading.value = true
  try {
    const res = await fetchOrderList({
      keyword:searchForm.keyword,
      status:searchForm.status,
      page:currentPage.value,
      pageSize:pageSize.value,
    })
    tableData.value = res.data
    total.value = res.total
  } catch (error) {
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch =  ()=>{
  currentPage.value = 1
  getTable()
}
const handleSearchReset = ()=>{
  searchForm.keyword = ''
  searchForm.status = ''
  handleSearch()
}

const checkDetails = (row) => {
  /* currentDetails.value = row
  formDetailsShow.value = true */
  router.push(`/order/${row.id}`)
}

const shipConfirm = async (row) => {
  try {
    await shipOrder(row.id)
    ElMessage.success('发货成功')
    getTable()
  } catch (error) {
    ElMessage.error('发货失败')
  }
}

const receiveConfirm = async (row) => {
  try {
    await receiveOrder(row.id)
    ElMessage.success('收货成功')
    getTable()
  } catch (error) {
    ElMessage.error('收货失败')
  }
}

const cancelConfirm = async (row) => {
  try {
    await cancelOrder(row.id)
    ElMessage.success('取消成功')
    getTable()
  } catch (error) {
    ElMessage.error('取消失败')
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  getTable()
}
const handleCurrentChange = (val) => {
  currentPage.value = val
  getTable()
}

onMounted(()=>{
  getTable()
})
</script>