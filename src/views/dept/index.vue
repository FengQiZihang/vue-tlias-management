<script setup>
import { ref, onMounted } from 'vue'
import { queryAllApi, addApi, queryByIdApi, updateApi, deleteByIdApi } from '@/api/dept'
import { ElMessage, ElMessageBox } from 'element-plus'


// 列表数据
const deptList = ref([])

// Dialog对话框
const dialogFormVisible = ref(false)
const formTitle = ref('')
const dept = ref({ name: '', })

// 表单验证规则
const rules = ref ({
  name: [
    { required: true, message: '部门名称是必填项', trigger: 'blur' },
    { min: 2, max: 10, message: '部门名称的长度应该在2-10位', trigger: 'blur' },
  ],
})

// 表单引用
const deptFormRef = ref(null);


/* ----------------- 生命周期与业务 ----------------- */
// 钩子函数
onMounted(() => {
  search()
})

// 查询全部部门
const search = async () => {
  const result = await queryAllApi()
  if (result.code) {
    deptList.value = result.data
  }
}

// 新增
const addDept = () => {
  // 设置对话框标题
  formTitle.value = '新增部门'
  // 清空表单数据
  dept.value = { name: '', }
  // 清空表单验证状态
  if (deptFormRef.value) {
    deptFormRef.value.resetFields()
  }
  // 打开对话框
  dialogFormVisible.value = true
}

// 保存
const save = async () => {
  // 表单验证
  if (!deptFormRef.value) return
  deptFormRef.value.validate(async (valid) => {
    if (valid) { 
      let result;
      // 判断是新增还是编辑
      if (dept.value.id) {
        // 编辑
        result = await updateApi(dept.value)
      } else {
        // 新增
        result = await addApi(dept.value)
      }

      if (result.code) {
        // 提示成功
        ElMessage.success('操作成功')
        // 关闭对话框
        dialogFormVisible.value = false
        // 重新查询数据
        search()
      } else {
        // 提示失败
        ElMessage.error(result.msg)
      }
    } else { 
      // 提示表单校验不通过
      ElMessage.error('表单校验不通过')
    }
  })
}

// 编辑
const edit = async (id) => {
  // 设置对话框标题
  formTitle.value = '编辑部门'
  // 清空表单验证状态
  if (deptFormRef.value) {
    deptFormRef.value.resetFields()
  }
  // 查询部门信息
  const result = await queryByIdApi(id)
  if (result.code) {
    dept.value = result.data
    // 打开对话框
    dialogFormVisible.value = true
  }
}

// 删除
const delById = async (id) => {
  // 弹出确认框
  ElMessageBox.confirm('您确认删除该部门吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      // 调用删除接口
      const result = await deleteByIdApi(id)
      if (result.code) {
        // 提示成功
        ElMessage.success('删除成功')
        // 重新查询数据
        search()
      } else {
        // 提示失败
        ElMessage.error(result.msg)
      }
    }).catch(() => {
      ElMessage.info('您已取消删除')
    })
}

</script>

<template>
  <div class="title">部门管理</div><br>

  
  <el-button type="success" @click="addDept"> + 新增部门</el-button><br><br>

  <!-- 表格 -->
  <el-table :data="deptList" border style="width: 100%">
    <el-table-column type="index" label="序号" width="100" align="center" />
    <el-table-column prop="name" label="部门名称" width="300" align="center" />
    <el-table-column prop="updateTime" label="最后修改时间" width="350" align="center" />
    <el-table-column label="操作" align="center">
      <template #default="scope">
        <el-button type="primary" size="small" @click="edit(scope.row.id)"><el-icon>
            <EditPen />
          </el-icon>编辑</el-button>
        <el-button type="danger" size="small" @click="delById(scope.row.id)"><el-icon>
            <Delete />
          </el-icon>删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- Dialog对话框 -->
  <el-dialog v-model="dialogFormVisible" :title="formTitle" width="500">
    <!-- 打印 -->
    <!-- {{ dept }} -->
    <el-form :model="dept" :rules="rules" ref="deptFormRef">
      <el-form-item label="部门名称" label-width="80px" prop="name">
        <el-input v-model="dept.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确认</el-button>
      </div>
    </template>
  </el-dialog>

</template>

<style scoped>

.title {
  font-size: 20px;
  font-weight: bold;
}
</style>