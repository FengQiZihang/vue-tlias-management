<script setup>
import { onMounted } from 'vue'
import * as echarts from 'echarts'
import { queryEmpJobDataApi, queryEmpGenderDataApi } from '@/api/report'

/* ----------------- 生命周期与业务 ----------------- */
// 钩子函数
onMounted(() => {
  getEmpJobData()
  getEmpGenderData()
})

// 获取员工职位人数统计数据
const getEmpJobData = async () => {
  const result = await queryEmpJobDataApi()
  const jobList = result.data.jobList
  const dataList = result.data.dataList 
  initJobChart(jobList, dataList)
}

// 获取员工性别人数统计数据
const getEmpGenderData = async () => {
  const result = await queryEmpGenderDataApi()
  initGenderChart(result.data)
}

const initJobChart = (jobList, dataList) => {
  // 基于准备好的dom，初始化echarts实例
  const chart = echarts.init(document.getElementById('empJobChart'))
  // 指定图表的配置项和数据
  const option = {
    title: {
      text: '员工职位统计',
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
      data: jobList,
    },
    yAxis: {
      type: 'value',
    },
    series: [{
      name: '人数',
      type: 'bar',
      data: dataList,
      itemStyle: {
        // 设置柱状渐变色
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

// 初始化员工性别人数统计图表
const initGenderChart = (genderDataList) => {
  // 基于准备好的dom，初始化echarts实例
  const chart = echarts.init(document.getElementById('empGenderChart'))
  // 指定图表的配置项和数据
  const option = {
    title: {
      text: '员工性别统计',
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
    series: [
      {
        name: '性别',
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
        data: genderDataList
      }
    ]
  } 
  // 使用刚指定的配置项和数据显示图表
  chart.setOption(option)
}

</script>

<template>
  <div class="report_container" id="empJobChart"></div>

  <div class="report_container" id="empGenderChart"></div>
</template>

<style scoped>
.report_container {
  width: 49%;
  height: 90%;
  float: left;
  margin-left: 5px;
}

#empJobChart {
  border-right: 1px dashed #ccc;
}
</style>