import request from '@/utils/request'

// 分页查询班级
export const queryPageApi = (name, begin, end, page, pageSize) => request.get(`/clazzs?name=${name}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`)

// 新增班级
export const addApi = (clazz) => request.post('/clazzs', clazz)

// 根据id查询班级
export const queryByIdApi = (id) => request.get(`/clazzs/${id}`)

// 修改班级
export const updateApi = (clazz) => request.put('/clazzs', clazz)

// 删除班级
export const deleteByIdApi = (id) => request.delete(`/clazzs/${id}`)

// 查询所有班级
export const queryAllApi = () => request.get('/clazzs/list')


