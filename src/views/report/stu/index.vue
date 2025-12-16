<script setup>
import { onMounted } from 'vue'
import * as echarts from 'echarts'
import { queryStudentCountDataApi, queryStudentDegreeDataApi } from '@/api/report'

/* ----------------- 生命周期与业务 ----------------- */
// 钩子函数
onMounted(() => {
  getStudentCountData()
  getStudentDegreeData()
})

// 获取班级人数统计数据
const getStudentCountData = async () => {
  const result = await queryStudentCountDataApi()
  const clazzList = result.data.clazzList
  const dataList = result.data.dataList
  initStudentCountChart(clazzList, dataList)
}

// 获取学历统计数据
const getStudentDegreeData = async () => {
  const result = await queryStudentDegreeDataApi()
  initStudentDegreeChart(result.data)
}

const initStudentCountChart = (clazzList, dataList) => {
  // 基于准备好的dom，初始化echarts实例
  const chart = echarts.init(document.getElementById('stuCountChart'))
  // 指定图表的配置项和数据
  const option = {
    title: {
      text: '学员人数统计',
      textStyle: {
        fontSize: 20,
        color: '#333'
      },
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: clazzList,
      axisLabel: {
        interval: 0,
        rotate: 30,
        margin: 15      // 增加标签与轴线的距离
      }
    },
    yAxis: {
      type: 'value',
    },
    series: [{
      name: '人数',
      type: 'bar',
      data: dataList,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
          {
            offset: 0,
            color: '#ffbf61'
          },
          {
            offset: 1,
            color: '#dd5f85'
          }
        ])
      }
    }]
  }
  // 使用刚指定的配置项和数据显示图表
  chart.setOption(option)
}

// 初始化学历统计图表
const initStudentDegreeChart = (degreeDataList) => {
  // 基于准备好的dom，初始化echarts实例
  const chart = echarts.init(document.getElementById('stuDegreeChart'))
  // 指定图表的配置项和数据
  const option = {
    title: {
      text: '学历统计',
      textStyle: {
        fontSize: 20,
        color: '#333'
      },
      left: 'center'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '10%',
      left: 'center'
    },
    series: [{
      name: '学历',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      top: '5%',
      itemStyle: {
        borderRadius: 5,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      data: degreeDataList
    }]
  }
  // 使用刚指定的配置项和数据显示图表
  chart.setOption(option)
}

</script>

<template>
  <div class="report_container" id="stuCountChart"></div>

  <div class="report_container" id="stuDegreeChart"></div>
</template>

<style scoped>
.report_container {
  width: 49%;
  height: 90%;
  float: left;
  margin-left: 5px;
}
#stuCountChart {
  border-right: 1px dashed #ccc;
}
</style>