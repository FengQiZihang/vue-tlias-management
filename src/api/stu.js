import request from '@/utils/request'

// 分页查询学员列表
export const queryPageApi = (name, degree, clazzId, page, pageSize) => request.get(`/students?name=${name}&degree=${degree}&clazzId=${clazzId}&page=${page}&pageSize=${pageSize}`)

// 根据id查询学员
export const queryByIdApi = (id) => request.get(`/students/${id}`)

// 新增学员
export const addApi = (data) => request.post('/students', data)

// 修改学员
export const updateApi = (data) => request.put('/students', data)

// 删除学员
export const deleteApi = (id) => request.delete(`/students/${id}`)

// 提交违纪
export const saveViolationApi = (id, score) => request.put(`/students/violation/${id}/${score}`)

