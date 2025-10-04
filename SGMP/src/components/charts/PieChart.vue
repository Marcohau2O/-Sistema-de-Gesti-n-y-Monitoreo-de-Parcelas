<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  type ChartOptions
} from "chart.js";
import { Pie } from "vue-chartjs";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const props = defineProps<{
  labels: string[];
  data: number[];
}>();

const backgroundColors = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
  '#9966FF', '#FF9F40', '#7FFFD4', '#F0E68C'
];

const chartData = {
  labels: props.labels,
  datasets: [
    {
      label: "Distribución de Cultivos",
      data: props.data,
      backgroundColor: backgroundColors,
      borderWidth: 2
    }
  ]
};

const chartOptions: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
    }
  }
};
</script>

<template>
  <div class="chart-container">
    <Pie
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
