<script setup>
import { ref, onMounted, } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { queryAllApi as queryAllClazzApi } from '@/api/clazz'
import { queryPageApi, addApi, queryByIdApi, updateApi, deleteApi, saveViolationApi } from '@/api/stu'

// 班级列表
const clazzs = ref([])
// 性别列表
const genders = ref([{ name: '男', value: 1 }, { name: '女', value: 2 }])
//学历列表数据
const degrees = ref([{ name: '初中', value: 1 }, { name: '高中', value: 2 }, { name: '大专', value: 3 }, { name: '本科', value: 4 }, { name: '硕士', value: 5 }, { name: '博士', value: 6 }])
// 是否是院校学员列表数据
const isCollege = ref([{ name: '是', value: 1 }, { name: '否', value: 0 }])

// 搜索表单对象
const searchStu = ref({
  name: '',
  degree: '',
  clazzId: '',
})

// 表格数据
const stuList = ref([])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const background = ref(true)
const total = ref(0)

// 记录勾选的学员id
const selectedIds = ref([])

// 学员对象--对话框
const stu = ref({
  id: '',
  name: '',
  no: '',
  gender: '',
  phone: '',
  idCard: '',
  isCollege: '',
  address: '',
  degree: '',
  graduationDate: '',
  clazzId: '',
})

// 学员对话框
const dialogVisible = ref(false)
const formTitle = ref('')
const labelWidth = ref(80)

// 违纪对象
const violation = ref({
  id: '',
  score: '',
})

// 违纪对话框
const violationDialogVisible = ref(false)


//表单校验规则
const stuFormRef = ref()
const rules = ref({
  name: [
    { required: true, message: '姓名为必填项', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度为2-20个字', trigger: 'blur' }
  ],
  no: [
    { required: true, message: '学号为必填项', trigger: 'blur' },
    { min: 10, max: 10, message: '学号长度为10个字', trigger: 'blur' }
  ],
  gender: [{ required: true, message: '性别为必填项', trigger: 'change' }],
  phone: [
    { required: true, message: '手机号为必填项', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/g, message: '请输入合法的手机号', trigger: 'blur' }
  ],
  idCard: [
    { required: true, message: '身份证号为必填项', trigger: 'blur' },
    { pattern: /^\d{18}$/g, message: '请输入合法的身份证号', trigger: 'blur' }
  ],
  isCollege: [
    { required: true, message: '是否院校学员为必填项', trigger: 'change' }
  ]
})

// 违纪校验规则
const violationFormRef = ref()
const violationRules = ref({
  score: [
    { required: true, message: '违纪分数为必填项', trigger: 'blur' },
    { pattern: /^\d{1,3}$/g, message: '违纪分数为1-3位整数', trigger: 'blur' }
  ]
})

/* ----------------- 生命周期与业务 ----------------- */
// 钩子函数
onMounted(() => {
  search()
  queryClazzs()
})

// 加载班级列表
const queryClazzs = async () => {
  const result = await queryAllClazzApi()
  if (result.code) {
    clazzs.value = result.data
  }
}

// 复选框勾选发生变化时触发 selection:当前选中的记录(数组)
const handleSelectionChange = (selection) => {
  // 获取勾选的学员id
  selectedIds.value = selection.map(item => item.id)
}

// 分页方法--->当前每页条数和页码变化就重新查询
const handleSizeChange = (val) => {
  search()
}
const handleCurrentChange = (val) => {
  search()
}

// 查询学员列表
const search = async () => {
  const result = await queryPageApi(
    searchStu.value.name,
    searchStu.value.degree,
    searchStu.value.clazzId,
    currentPage.value,
    pageSize.value,
  )
  if (result.code) {
    stuList.value = result.data.rows
    total.value = result.data.total
  }
}

// 清空
const clear = () => {
  searchStu.value = {
    name: '',
    degree: '',
    clazzId: '',
  }
  currentPage.value = 1
  search()
}

// 新增学员
const addStu = () => {
  // 设置对话框标题
  formTitle.value = '新增学员'
  // 清空表单数据
  stu.value = {
    name: '',
    no: '',
    gender: '',
    phone: '',
    idCard: '',
    isCollege: '',
    address: '',
    degree: '',
    graduationDate: '',
    clazzId: '',
  }
  // 清空表单验证状态
  if (stuFormRef.value) {
    stuFormRef.value.resetFields()
  }
  // 弹出对话框
  dialogVisible.value = true
}

// 编辑学员
const editStu = async (id) => {
  // 设置对话框标题
  formTitle.value = '编辑学员'
  // 清空表单数据
  stu.value = {
    id: '',
    name: '',
    no: '',
    gender: '',
    phone: '',
    idCard: '',
    isCollege: '',
    address: '',
    degree: '',
    graduationDate: '',
    clazzId: '',
  }
  // 查询学员信息
  const result = await queryByIdApi(id)
  if (result.code) {
    stu.value = result.data
  }
  // 弹出对话框
  dialogVisible.value = true
}


// 保存学员
const save = async () => {
  // 表单验证
  if (!stuFormRef.value) return
  stuFormRef.value.validate(async (valid) => {
    if (valid) {
      let result;
      // 判断是新增还是编辑
      if (stu.value.id) {
        // 编辑
        result = await updateApi(stu.value)
      } else {
        // 新增
        result = await addApi(stu.value)
      }

      if (result.code) {
        // 提示成功
        ElMessage.success('操作成功')
        // 关闭对话框
        dialogVisible.value = false
        // 重新查询数据
        search()
      } else {
        // 提示失败
        ElMessage.error(result.msg)
      }
    } else {
      ElMessage.error('表单校验不通过')
    }
  })
}

// 根据id删除学员
const delById = async (id) => {
  ElMessageBox.confirm('确定要删除该学员吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    const result = await deleteApi(id)
    if (result.code) {
      ElMessage.success('删除成功')
      search()
    } else {
      ElMessage.error(result.msg)
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 批量删除学员
const delByIds = async () => {
  ElMessageBox.confirm('确定要删除这些学员吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    const result = await deleteApi(selectedIds.value)
    if (result.code) {
      ElMessage.success('删除成功')
      search()
    } else {
      ElMessage.error(result.msg)
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 打开违纪对话框
const openViolation = (id) => {
  // 清空表单数据
  violation.value = {
    id: '',
    score: '',
  }
  // 设置违纪对象id
  violation.value.id = id
  // 清空表单验证状态
  if (violationFormRef.value) {
    violationFormRef.value.resetFields()
  }
  // 弹出违纪对话框
  violationDialogVisible.value = true
}

// 提交违纪
const saveViolation = async () => {
  if (!violationFormRef.value) return
  violationFormRef.value.validate(async (valid) => {
    if (valid) {
      console.log('提交违纪', violation.value.id, violation.value.score);
      const result = await saveViolationApi(violation.value.id, violation.value.score)
      if (result.code) {
        ElMessage.success('提交成功')
        violationDialogVisible.value = false
        search()
      } else {
        ElMessage.error(result.msg)
      }
    } else {
      ElMessage.error('表单校验不通过')
    }
  })
}
</script>

<template>
  <div class="title">学员管理</div><br>

  <!-- 打印 -->
  <!-- {{ searchStu }} -->
  <!-- currentPage:{{ currentPage }} -->
  <!-- pageSize:{{ pageSize }} -->
  <!-- total:{{ total }} -->
  <!-- 搜索栏 -->
  <el-form :inline="true" :model="searchStu">
    <el-form-item label="姓名">
      <el-input v-model="searchStu.name" placeholder="请输入学员姓名" />
    </el-form-item>
    <el-form-item label="最高学历">
      <el-select v-model="searchStu.degree" placeholder="请选择" style="width: 150px">
        <el-option v-for="item in degrees" :key="item.value" :label="item.name" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="班级">
      <el-select v-model="searchStu.clazzId" placeholder="请选择" style="width: 150px">
        <el-option v-for="item in clazzs" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
      <el-button type="info" @click="clear">清空</el-button>
    </el-form-item>
  </el-form>

  <!-- 功能按钮 -->
  <el-button type="success" @click="addStu"> + 新增学员</el-button>
  <el-button type="danger" @click="delByIds"> - 批量删除</el-button>
  <!-- 打印 -->
  <!-- {{ selectedIds }} -->
  <br><br>

  <!-- 表格 -->
  <el-table :data="stuList" border style="width: 100%" fit @selection-change="handleSelectionChange">
    <!-- 勾选框 -->
    <el-table-column type="selection" width="35" align="center" />
    <!-- 姓名 -->
    <el-table-column prop="name" label="姓名" width="100px" align="center" />
    <!-- 学号 -->
    <el-table-column prop="no" label="学号" width="130px" align="center" />
    <!-- 班级 -->
    <el-table-column prop="clazzName" label="班级" width="160px" align="center" />
    <!-- 性别 -->
    <el-table-column prop="gender" label="性别" width="70px" align="center">
      <template #default="scope">
        {{ scope.row.gender === 1 ? '男' : '女' }}
      </template>
    </el-table-column>
    <!-- 手机号 -->
    <el-table-column prop="phone" label="手机号" width="130px" align="center" />
    <!-- 最高学历 -->
    <el-table-column prop="degree" label="最高学历" width="90px" align="center">
      <template #default="scope">
        <span v-if="scope.row.degree === 1">初中</span>
        <span v-else-if="scope.row.degree === 2">高中</span>
        <span v-else-if="scope.row.degree === 3">大专</span>
        <span v-else-if="scope.row.degree === 4">本科</span>
        <span v-else-if="scope.row.degree === 5">硕士</span>
        <span v-else-if="scope.row.degree === 6">博士</span>
        <span v-else>其他</span>
      </template>
    </el-table-column>
    <!-- 违纪次数 -->
    <el-table-column prop="violationCount" label="违纪次数" width="85px" align="center" />
    <!-- 违纪分数 -->
    <el-table-column prop="violationScore" label="违纪分数" width="85px" align="center" />
    <!-- 最后修改时间 -->
    <el-table-column prop="updateTime" label="最后修改时间" width="170px" align="center" />
    <!-- 操作：编辑、违纪、删除 -->
    <el-table-column label="操作" align="center">
      <template #default="scope">
        <el-button type="primary" size="small" @click="editStu(scope.row.id)">编辑</el-button>
        <el-button type="warning" size="small" @click="openViolation(scope.row.id)">违纪</el-button>
        <el-button type="danger" size="small" @click="delById(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table><br>

  <!-- 分页条 -->
  <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"
    :background="background" layout="total, sizes, prev, pager, next, jumper" :total="total"
    @size-change="handleSizeChange" @current-change="handleCurrentChange" />

  <!-- 学员对话框 -->
  <el-dialog v-model="dialogVisible" :title="formTitle" width="50%">
    <el-form :model="stu" class="dialog-form" ref="stuFormRef" :rules="rules" :label-width="labelWidth + 'px'">
      <!-- 第一行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="stu.name" placeholder="请输入学员姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学号" prop="no">
            <el-input v-model="stu.no" placeholder="请输入学员学号" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 第二行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="stu.gender" placeholder="请选择">
              <el-option v-for="item in genders" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="stu.phone" placeholder="请输入学员手机号" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 第三行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="stu.idCard" placeholder="请输入身份证号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否院校" prop="isCollege">
            <el-select v-model="stu.isCollege" placeholder="请选择">
              <el-option v-for="is in isCollege" :key="is.value" :label="is.name" :value="is.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 第四行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="联系地址" prop="address">
            <el-input v-model="stu.address" placeholder="请输入联系地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最高学历" prop="degree">
            <el-select v-model="stu.degree" placeholder="请选择">
              <el-option v-for="item in degrees" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 第五行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="毕业时间" prop="graduationDate">
            <el-date-picker v-model="stu.graduationDate" type="date" placeholder="请选择毕业时间" value-format="YYYY-MM-DD" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属班级" prop="clazzId">
            <el-select v-model="stu.clazzId" placeholder="请选择">
              <el-option v-for="item in clazzs" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 底部 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">提交</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 违纪对话框 -->
  <el-dialog v-model="violationDialogVisible" title="违 纪" width="30%">
    <el-form :model="violation" class="dialog-form" ref="violationFormRef" :rules="violationRules"
      :label-width="labelWidth + 'px'">
      <el-form-item label="违纪分数" prop="score">
        <el-input v-model="violation.score" placeholder="请输入违纪分数" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="violationDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveViolation">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.title {
  font-size: 20px;
  font-weight: bold;
}

.dialog-form :deep(.el-select),
.dialog-form :deep(.el-date-editor) {
  width: 100%;
}
</style>