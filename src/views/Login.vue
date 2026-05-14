<template>
    <div>
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="120px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleLogin">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup>
import {ref,reactive} from 'vue'
import {useRouter} from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user.js'

const router = useRouter()

const loginForm = reactive({
    username: '',
    password: ''
})

const userStore = useUserStore()
const loginFormRef = ref(null)

const rules = {
    username: [
        {required: true, message:'用户名不能为空', trigger:'blur'}
    ],
    password: [
        {required: true, message:'密码不能为空', trigger:'blur'}
    ]
}

const handleLogin =async ()=>{
    const valid = await loginFormRef.value.validate().catch(()=>false)
    if(!valid)return
    if (loginForm.username === 'admin' && loginForm.password === '123456') {
        userStore.login({
            token: 'mock-token-123',
            userInfo: {
            username: loginForm.username,
            role: '管理员'
            }
        })
        ElMessage.success('登录成功')
        router.push('/user')
    } else {
        ElMessage.error('用户名或密码错误')
    }
}
</script>