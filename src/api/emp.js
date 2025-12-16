import request from '@/utils/request'

// 获取员工列表
export const queryPageApi = (name, gender, begin, end, page, pageSize) =>
  request.get(`/emps?name=${name}&gender=${gender}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`)

// 新增员工
export const addApi = (emp) => request.post('/emps', emp)

// 根据id查询员工
export const queryByIdApi = (id) => request.get(`/emps/${id}`)

// 修改员工
export const updateApi = (emp) => request.put('/emps', emp)

// 删除员工
export const deleteApi = (ids) => request.delete(`/emps?ids=${ids}`)

// 查询所有员工
export const queryAllApi = () => request.get('/emps/list')