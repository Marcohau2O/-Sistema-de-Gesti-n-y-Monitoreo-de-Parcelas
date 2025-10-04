<template>
  <div class="chart-skeleton">
    <div class="skeleton-header"></div>
    <div class="skeleton-chart">
      <div class="skeleton-legend" v-if="showLegend"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  showLegend?: boolean;
}>();
</script>

<style scoped>
.chart-skeleton {
  height: 100%;
  padding: 1rem;
  min-height: 200px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.skeleton-header {
  height: 20px;
  width: 60%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 1rem;
  margin-left: auto;
  margin-right: auto;
}

.skeleton-chart {
  height: calc(100% - 40px);
  background: linear-gradient(90deg, #f8f9fa 25%, #e9ecef 50%, #f8f9fa 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
  position: relative;
}

.skeleton-legend {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 100px;
  height: 120px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 6px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
