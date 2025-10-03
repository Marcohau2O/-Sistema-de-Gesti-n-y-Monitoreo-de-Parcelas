<template>
  <div class="bg-white rounded-lg shadow-md p-6 border-l-4" :class="borderColor">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-700">{{ title }}</h3>
        <p class="text-2xl font-bold mt-2" :class="valueColor">
          {{ formattedValue }} <span class="text-sm font-normal">{{ unit }}</span>
        </p>
        <p class="text-sm text-gray-500 mt-1">{{ location }}</p>
      </div>
      <div class="text-3xl" :class="iconColor">
        <i :class="icon"></i>
      </div>
    </div>
    <div class="mt-4 text-xs text-gray-400">
      Actualizado: {{ formattedTime }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  title: string;
  value: number;
  unit: string;
  location: string;
  timestamp: string;
  type: 'temperature' | 'humidity' | 'rain' | 'radiation';
}

const props = defineProps<Props>();

const formattedValue = computed(() => {
  return props.value.toFixed(2);
});

const formattedTime = computed(() => {
  return new Date(props.timestamp).toLocaleTimeString();
});

const { borderColor, valueColor, iconColor, icon } = computed(() => {
  switch (props.type) {
    case 'temperature':
      return {
        borderColor: 'border-red-400',
        valueColor: props.value > 30 ? 'text-red-600' : 'text-blue-600',
        iconColor: props.value > 30 ? 'text-red-500' : 'text-blue-500',
        icon: 'fas fa-thermometer-half'
      };
    case 'humidity':
      return {
        borderColor: 'border-blue-400',
        valueColor: 'text-blue-600',
        iconColor: 'text-blue-500',
        icon: 'fas fa-tint'
      };
    case 'rain':
      return {
        borderColor: 'border-green-400',
        valueColor: props.value > 0 ? 'text-green-600' : 'text-gray-600',
        iconColor: props.value > 0 ? 'text-green-500' : 'text-gray-500',
        icon: props.value > 0 ? 'fas fa-cloud-rain' : 'fas fa-cloud'
      };
    case 'radiation':
      return {
        borderColor: 'border-yellow-400',
        valueColor: 'text-yellow-600',
        iconColor: 'text-yellow-500',
        icon: 'fas fa-sun'
      };
    default:
      return {
        borderColor: 'border-gray-400',
        valueColor: 'text-gray-600',
        iconColor: 'text-gray-500',
        icon: 'fas fa-chart-line'
      };
  }
}).value;
</script>