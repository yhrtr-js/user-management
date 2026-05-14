import axios from 'axios'
import { ElMessage } from 'element-plus';

const instance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 10000,
})

instance.interceptors.request.use(
    config=>{
        const token = localStorage.getItem('token')
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error=>{
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    response =>{
        const res = response.data
        if (Array.isArray(res) || res.code === undefined) {
            return res
        }
        if(res.code !== 200){
            ElMessage.error(res.msg || '请求失败')
            return Promise.reject(res)
        }
        return res
    },
    error =>{
        if(error.response?.status === 401){
            ElMessage.error('登录已过期，请重新登陆')
            localStorage.removeItem('token')
            window.location.href='/login'
        } else {
            ElMessage.error(error.message || '网络异常')
        }
        return Promise.reject(error)
    }
)

export default instance