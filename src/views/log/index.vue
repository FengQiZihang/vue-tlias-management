<script setup>
import { ref, onMounted } from 'vue'
import { queryPageApi } from '@/api/log'

// 日志列表
const logList = ref([])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const background = ref(true)
const total = ref(0)

/* ----------------- 生命周期与业务 ----------------- */
onMounted(() => {
  search()
})

// 分页方法--->当前每页条数和页码变化就重新查询
const handleSizeChange = (val) => {
  search()
}
const handleCurrentChange = (val) => {
  search()
}

// 查询方法
const search = async () => {
  const result = await queryPageApi(currentPage.value, pageSize.value)
  if (result.code) {
    logList.value = result.data.rows
    total.value = result.data.total
  }
}
</script>

<template>
  <div class="title">日志管理</div><br>

  <!-- 表格 -->
  <el-table :data="logList" border style="width: 100%" fit size="small">
    <el-table-column prop="operateEmpName" label="操作人" width="80" align="center" />
    <el-table-column prop="operateTime" label="操作时间" width="150" align="center" />
    <el-table-column prop="className" label="类名" width="300" align="center" />
    <el-table-column prop="methodName" label="方法名" width="100" align="center" />
    <el-table-column prop="costTime" label="操作耗时(ms)" width="100" align="center" />
    <el-table-column prop="methodParams" label="请求参数" align="center" width="280px">
      <template #default="scope">
        <el-popover effect="light" trigger="hover" placement="top" width="auto" popper-style="font-size:12px">
          <template #default>
            <div>参数: {{ scope.row.methodParams }}</div>
          </template>
          <template #reference>
            <el-tag v-if="scope.row.methodParams.length <= 30">{{ scope.row.methodParams }}</el-tag>
            <el-tag v-else>{{ scope.row.methodParams.substring(0, 30) + '...' }}</el-tag>
          </template>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column prop="returnValue" label="返回值" align="center" />
  </el-table>

  <!-- 分页 -->
  <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"
    :background="background" layout="total, sizes, prev, pager, next, jumper" :total="total"
    @size-change="handleSizeChange" @current-change="handleCurrentChange" />

</template>

<style scoped>
.title {
  font-size: 20px;
  font-weight: bold;
}

</style>