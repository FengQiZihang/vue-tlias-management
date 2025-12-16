<script setup>
import { onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { queryAllApi as queryAllEmpApi } from '@/api/emp'
import { queryPageApi, addApi, queryByIdApi, updateApi, deleteByIdApi } from '@/api/clazz'


// 员工列表
const empList = ref([])
// 学科列表
const subjectList = ref([{ name: 'Java', value: 1 }, { name: '前端', value: 2 }, { name: '大数据', value: 3 }, { name: 'Python', value: 4 }, { name: 'Go', value: 5 }, { name: '嵌入式', value: 6 }])

// 搜索表单对象
const searchClazz = ref({
  name: '',
  begin: '',
  end: '',
  date: [],
})

// 表格数据
const clazzList = ref([])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const background = ref(true)
const total = ref()

// 控制弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('')
const labelWidth = ref(80)

// 班级表单对象
const clazz = ref({
  id: '',
  name: '',
  room: '',
  masterId: '',
  beginDate: '',
  endDate: '',
  subject: '',
})

// 表单检验规则
const clazzFormRef = ref()
const rules = ref({
  name: [
    { required: true, message: '班级名称为必填项', trigger: 'blur' },
    { min: 4, max: 30, message: '用户名长度为4-30个字', trigger: 'blur' }
  ],
  room: [
    { min: 1, max: 20, message: '班级教室长度为1-20个字', trigger: 'blur' }
  ],
  beginDate: [{ required: true, message: '开课时间为必填项', trigger: 'change' }],
  endDate: [{ required: true, message: '结课时间为必填项', trigger: 'change' }],
  subject: [{ required: true, message: '学科为必填项', trigger: 'change' }]
})

/* ----------------- 生命周期与业务 ----------------- */
// 钩子函数
onMounted(() => {
  search()
  getEmpList()
})

// 获取员工列表
const getEmpList = async () => {
  const result = await queryAllEmpApi()
  if (result.code) {
    empList.value = result.data
  }
}

// 侦听searchClazz日期范围变化date
watch(
  () => searchClazz.value.date,
  (newVal) => {
    if (newVal.length > 0) {
      searchClazz.value.begin = newVal[0]
      searchClazz.value.end = newVal[1]
    } else {
      searchClazz.value.begin = ''
      searchClazz.value.end = ''
    }
  },
)

// 清空搜索表单
const clear = () => {
  searchClazz.value = {
    name: '',
    begin: '',
    end: '',
    date: [],
  }
  currentPage.value = 1
  search()
}

// 分页方法--->当前每页条数和页码变化就重新查询
const handleSizeChange = (val) => {
  search()
}
const handleCurrentChange = (val) => {
  search()
}


// 查询方法
const search = async () => {
  const result = await queryPageApi(
    searchClazz.value.name,
    searchClazz.value.begin, searchClazz.value.end,
    currentPage.value, pageSize.value,
  )
  if (result.code) {
    clazzList.value = result.data.rows
    total.value = result.data.total
  }
}

// 新增班级
const addClazz = () => {
  // 设置对话框标题
  dialogTitle.value = '新增班级'
  // 清空表单
  clazz.value = {
    name: '',
    room: '',
    masterId: '',
    beginDate: '',
    endDate: '',
    subject: '',
  }
  // 清空表单验证状态
  if (clazzFormRef.value) {
    clazzFormRef.value.resetFields()
  }
  // 打开对话框
  dialogVisible.value = true
}

// 编辑
const edit = async (id) => {
  // 设置对话框标题
  dialogTitle.value = '编辑班级'
  // 清空表单
  clazz.value = {
    name: '',
    room: '',
    masterId: '',
    beginDate: '',
    endDate: '',
    subject: '',
  }
  // 清空表单验证状态
  if (clazzFormRef.value) {
    clazzFormRef.value.resetFields()
  }
  // 查询班级
  const result = await queryByIdApi(id)
  if (result.code) {
    clazz.value = result.data
    // 打开对话框
    dialogVisible.value = true
  }
}

// 保存
const save = () => {
  // 表单验证
  if (!clazzFormRef.value) return
  clazzFormRef.value.validate(async (valid) => {
    if (valid) {
      let result;
      // 判断是否存在id
      if (clazz.value.id) {
        // 修改
        result = await updateApi(clazz.value)
      } else {
        // 新增
        result = await addApi(clazz.value)
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
      // 提示表单校验不通过
      ElMessage.error('表单校验不通过')
    }
  })
}

// 删除
const delById = async (id) => {
  // 弹出确认框
  ElMessageBox.confirm('是否删除该班级?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
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
  })
}



</script>

<template>
  <div class="title">班级管理</div><br>

  <!-- 打印 -->
  <!-- {{ searchClazz }} -->
  <!-- currentPage: {{ currentPage }} -->
  <!-- pageSize: {{ pageSize }} -->
  <!-- total: {{ total }} -->
  <!-- 搜索栏 -->
  
  <el-form :inline="true" :model="searchClazz" class="demo-form-inline">
    <el-form-item label="班级名称">
      <el-input v-model="searchClazz.name" placeholder="请输入班级名称" clearable />
    </el-form-item>

    <el-form-item label="结课时间">
      <el-date-picker v-model="searchClazz.date" type="daterange" range-separator="至" start-placeholder="开始时间"
        end-placeholder="结束时间" :size="size" value-format="YYYY-MM-DD" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
      <el-button type="info" @click="clear">清空</el-button>
    </el-form-item>
  </el-form>

  <!-- 功能按钮 -->
  <el-button type="success" @click="addClazz"> + 新增班级</el-button><br><br>


  <!-- 表格 -->
  <el-table :data="clazzList" border style="width: 100%" fit>
    <el-table-column type="index" label="序号" width="55" align="center" />
    <el-table-column prop="name" label="班级名称" width="220px" align="center" />
    <el-table-column prop="room" label="班级教室" width="100px" align="center" />
    <el-table-column prop="masterName" label="班主任" width="100" align="center" />
    <el-table-column prop="beginDate" label="开课时间" width="150" align="center" />
    <el-table-column prop="endDate" label="结课时间" width="150" align="center" />
    <el-table-column prop="status" label="状态" width="130" align="center" />
    <el-table-column prop="updateTime" label="最后修改时间" align="center" />
    <el-table-column label="操作" align="center">
      <template #default="scope">
        <el-button type="primary" size="small" @click="edit(scope.row.id)">编辑</el-button>
        <el-button type="danger" size="small" @click="delById(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table><br>


  <!-- 分页条 -->
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"
      :background="background" layout="total, sizes, prev, pager, next, jumper" :total="total"
    @size-change="handleSizeChange" @current-change="handleCurrentChange" />

  <!-- 对话框 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="35%">
    <!-- 打印 -->
    <!-- {{ clazz }} -->
    <!-- 表单 -->
    <el-form :model="clazz" class="dialog-form" :label-width="labelWidth + 'px'" :rules="rules" ref="clazzFormRef">
      <!-- 班级名称 -->
      <el-form-item label="班级名称" prop="name">
        <el-input v-model="clazz.name" placeholder="请输入班级名称" />
      </el-form-item>

      <!-- 班级教室 -->
      <el-form-item label="班级教室" prop="room">
        <el-input v-model="clazz.room" placeholder="请选择班级教室" />
      </el-form-item>

      <!-- 开课时间 -->
      <el-form-item label="开课时间" prop="beginDate">
        <el-date-picker v-model="clazz.beginDate" type="date" placeholder="请选择开课时间" 
          format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
      </el-form-item>

      <!-- 结课时间 -->
      <el-form-item label="结课时间" prop="endDate">
        <el-date-picker v-model="clazz.endDate" type="date" placeholder="请选择结课时间" 
          format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
      </el-form-item>

      <!-- 班主任 -->
      <el-form-item label="班主任" prop="masterId">
        <el-select v-model="clazz.masterId" placeholder="请选择班主任">
          <el-option v-for="emp in empList" :key="emp.id" :label="emp.name" :value="emp.id" />
        </el-select>
      </el-form-item>

      <!-- 学科 -->
      <el-form-item label="学科" prop="subject">
        <el-select v-model="clazz.subject" placeholder="请选择学科">
          <el-option v-for="subject in subjectList" :key="subject.value" :label="subject.name" :value="subject.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 底部 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">
          保存
        </el-button>
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