<template>
  <div>
    <div style="display: flex; justify-content: space-between;">
      <el-form :model="searchForm" :inline="true">
        <el-form-item prop="name">
          <el-input v-model="searchForm.name" placeholder="搜索用户名"></el-input>
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="searchForm.status" placeholder="全部状态">
            <el-option label="全部" value="" />
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSearchReset">重置</el-button>
          <el-button @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" v-if="userStore.hasPermission('user:add')" 
      @click="handleAdd">+ 新增用户</el-button>
    </div>
    <BaseTable 
      :tableData = 'tableData'
      :columns = "columns"
      :total = 'total'
      :loading = 'loading'
      @page-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
      <template #status="{row}">
        <el-tag v-if="row.status === 1" type="success">启用</el-tag>
        <el-tag v-if="row.status === 0" type="danger">禁用</el-tag>
      </template>
      <template #action="{row}">
        <el-button 
          v-if="userStore.hasPermission('user:edit')"
          @click="handleEdit(row)">编辑</el-button>
        <el-button 
          v-if="userStore.hasPermission('user:delete')"
          @click="handleDelete(row)">删除</el-button>
        <el-button 
          v-if="userStore.hasPermission('user:edit')"
          @click="statusChange(row)">
          {{ row.status === 1 ? '禁用' : '启用' }}
        </el-button>
      </template>
    </BaseTable>
    <!-- <el-dialog
      v-model="dialogShow"
      :title="dialogTitle"
      width="500"
    >
      <el-form :model="formData" :rules="rules" ref="formRef">
        <el-form-item prop="name" label="用户名"><el-input v-model="formData.name" /></el-form-item>
        <el-form-item prop="email" label="邮箱"><el-input v-model="formData.email" /></el-form-item>
        <el-form-item prop="role" label="角色">
          <el-select v-model="formData.role">
            <el-option value="管理员" label="管理员" />
            <el-option value="编辑" label="编辑" />
            <el-option value="访客" label="访客" />
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" active-text="启用" inactive-text="禁用"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button v-if="dialogTitle==='新增用户'" type="primary" @click="handleAddConfirm">确定</el-button>
          <el-button v-if="dialogTitle==='编辑用户'" type="primary" @click="handleEditConfirm">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog> -->
    <BaseDialog
      :visible="dialogShow"
      :title="dialogTitle"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
        <el-form :model="formData" :rules="rules" ref="formRef">
        <el-form-item prop="name" label="用户名"><el-input v-model="formData.name" /></el-form-item>
        <el-form-item prop="email" label="邮箱"><el-input v-model="formData.email" /></el-form-item>
        <el-form-item prop="role" label="角色">
          <el-select v-model="formData.role">
            <el-option value="管理员" label="管理员" />
            <el-option value="编辑" label="编辑" />
            <el-option value="访客" label="访客" />
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" active-text="启用" inactive-text="禁用"></el-switch>
        </el-form-item>
      </el-form>
    </BaseDialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
/* import { getUserList, addUser, updateUser, deleteUser, toggleUserStatus } from '../api/user.js' */
import { fetchUserList, addUser, updateUser, deleteUser, toggleStatus } from '../mock.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '../stores/user.js'
import BaseTable from '../components/BaseTable.vue'
import BaseDialog from '../components/BaseDialog.vue'

const searchForm = reactive({
  name: '',
  status: ''
})

const loading = ref(false)
const tableData = ref([])

const columns = [
  { prop: 'name', label: '姓名' },
  { prop: 'email', label: '邮箱' },
  { prop: 'role', label: '角色' },
  {prop:'status', label:'状态', slot:true},
  { prop: 'created', label: '创建时间' },
]

const dialogShow = ref(false)
const dialogTitle = ref('')
const formData = reactive({
  name: '',
  email: '',
  role: '访客',
  status: 0,
  id: null,
})
const formRef = ref(null)
const rules = {
  name:[
    {required: true, message:'用户名不能为空', trigger:'blur'}
  ],
  email:[
    {required: true, message:'邮箱不能为空', trigger:'blur'},
    { type: 'email', message: '不符合email格式', trigger: 'blur' }
  ],
  role: [
    {required: true, message:'角色名不能为空', trigger:'change'}
  ]
}

const total = ref(1)
const currentPage = ref(1)
const pageSize = ref(10)

const userStore = useUserStore()

/* const getTable = async ()=>{
  loading.value = true
  try {
    const res = await getUserList({
      
      status: searchForm.status === '' ? undefined : searchForm.status,
      _page: currentPage.value,
      _per_page: pageSize.value,
    })
    let data = res.data
    if (searchForm.name) {
      data = data.filter(u => u.name.includes(searchForm.name))
      console.log('过滤后:', data)
    }
    total.value = res.items
    tableData.value = [...data]
  } catch (error) {
    ElMessage.error('获取列表失败')
  }finally{loading.value = false}
} */
const getTable = async () => {
  loading.value = true
  try {
    const res = await fetchUserList({
      name: searchForm.name,
      status: searchForm.status,
      page: currentPage.value,
      pageSize: pageSize.value
    })
    tableData.value = res.data
    total.value = res.total
  } catch (error) {
    ElMessage.error('获取列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = ()=>{
  currentPage.value =1 
  getTable()
}

const handleSearchReset = ()=>{
  searchForm.name = ''
  searchForm.status = ''
  handleSearch()
}

const handleAdd = ()=>{
  formData.name = ""
  formData.email = ""
  formData.role = "访客"
  formData.status = 0
  formData.id = null
  dialogTitle.value = '新增用户'
  dialogShow.value = true
}

const handleAddConfirm = async ()=>{
  const valid = await formRef.value.validate().catch(()=>false)
  if(!valid)return
  try {
    const today = new Date().toISOString().slice(0, 10)
    await addUser({ ...formData, created: today })
    dialogShow.value = false
    ElMessage.success('新增用户成功')
    getTable()
  } catch (error) {
    ElMessage.error('新增用户失败')
  }
}

const handleEdit = (row)=>{
  dialogShow.value = true
  dialogTitle.value = '编辑用户'
  formData.name = row.name
  formData.email = row.email
  formData.role = row.role
  formData.status = row.status
  formData.id = row.id
}

const handleEditConfirm = async ()=>{
  const valid = await formRef.value.validate().catch(()=>false)
  if(!valid)return
  try {
    await updateUser(formData)
    dialogShow.value = false
    ElMessage.success('编辑用户成功')
    getTable()
  } catch (error) {
    ElMessage.error('编辑用户失败')
  }
}

const handleDelete =  (row) => {
  ElMessageBox.confirm(`确定要删除用户「${row.name}」吗？`, '提示', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteUser(row.id)
      ElMessage.success('删除成功')
      getTable()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

const handleConfirm =()=>{
  if(dialogTitle.value === '新增用户'){
    handleAddConfirm()
  }else {
    handleEditConfirm()
  }
}

const handleCancel = () => {
  dialogShow.value = false
}

const statusChange = async (row)=>{
  console.log('statusChange 被调用了', row) 
  const newStatus = row.status === 1 ? 0 : 1
  try {
    /* await toggleUserStatus(row.id,newStatus) */
    await toggleStatus(row.id, newStatus)
    ElMessage.success('切换状态成功')
    getTable()
  } catch (error) {
    ElMessage.error('切换状态失败')
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
