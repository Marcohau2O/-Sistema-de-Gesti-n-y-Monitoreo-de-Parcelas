<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  type ChartOptions
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

const props = defineProps<{
  labels: string[];
  data: number[];
}>();

const chartData = {
  labels: props.labels,
  datasets: [
    {
      label: "Temperatura (°C)",
      data: props.data,
      borderColor: "#FF6384",
      backgroundColor: "rgba(255, 99, 132, 0.1)",
      tension: 0.3,
      fill: true,
      pointRadius: 2,
      borderWidth: 2
    }
  ]
};

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
    }
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: 'Tiempo'
      }
    },
    y: {
      display: true,
      title: {
        display: true,
        text: 'Temperatura (°C)'
      }
    }
  }
};
</script>

<template>
  <div class="chart-container">
    <Line
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  height: 100%;
  min-height: 200px;
}
</style>
