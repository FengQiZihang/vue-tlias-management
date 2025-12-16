import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router/index'

// 创建axios实例对象
const request = axios.create({
  // baseURL: 'https://m1.apifoxmock.com/m1/6345093-6040648-default',
  baseURL: '/api',
  timeout: 600000
})

// axios的请求 request 拦截器 -- 获取token，加入请求头
request.interceptors.request.use(
  (config) => { //成功回调
    const loginUser = JSON.parse(localStorage.getItem('loginUser'))
    if (loginUser && loginUser.token) {
      config.headers.token = loginUser.token // 设置请求头
      // 如果后端要求的 token 是放在 Authorization 字段中，你需要调整 headers 的格式：
      // config.headers['Authorization'] = `Bearer ${loginUser.token}`
    }
    return config
  },
  (error) => { //失败回调
    return Promise.reject(error)
  }
)

// axios的响应 response 拦截器
request.interceptors.response.use(
  (response) => { //成功回调
    return response.data
  },
  (error) => { //失败回调
    // 处理401错误
    if (error.response && error.response.status === 401) {
      ElMessage.error('登录已过期，请重新登录')
      router.push('/login')
    } else {
      ElMessage.error(error.response.data.msg || '请求失败，请稍后重试')
    }
    return Promise.reject(error)
  }
)

export default request