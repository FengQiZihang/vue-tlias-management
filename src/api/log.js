import request from '@/utils/request'

// 获取日志列表 /log/page?page=1&pageSize=10
export const queryPageApi = (page, pageSize) => request.get(`/log/page?page=${page}&pageSize=${pageSize}`)



