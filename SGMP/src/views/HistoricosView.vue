<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold">Datos Históricos</h1>
          <p class="text-muted-foreground">Análisis temporal de sensores con gráficas interactivas</p>
          <div class="flex gap-4 mt-2 text-sm">
            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              🌡️ Temperatura: {{ summary.avg_temperature ? summary.avg_temperature.toFixed(1) + '°C' : 'Cargando...' }}
            </span>
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded">
              💧 Humedad: {{ summary.avg_humidity ? summary.avg_humidity.toFixed(1) + '%' : 'Cargando...' }}
            </span>
            <span class="bg-purple-100 text-purple-800 px-2 py-1 rounded">
              🌱 Cultivos: {{ summary.unique_crops || '0' }}
            </span>
          </div>
        </div>

        <!-- Controles -->
        <div class="flex items-center gap-4" v-if="!loading">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">Límite:</label>
            <select
              v-model="limit"
              @change="fetchAllData"
              class="border rounded px-2 py-1 text-sm"
              :disabled="loading"
            >
              <option value="50">50 registros</option>
              <option value="100">100 registros</option>
              <option value="200">200 registros</option>
              <option value="500">500 registros</option>
              <option value="1000">1000 registros</option>
            </select>
          </div>
          <button
            @click="fetchAllData"
            :disabled="loading"
            class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50"
          >
            🔄 Actualizar
          </button>
        </div>
      </div>

      <!-- Estados de carga -->
      <div v-if="loading" class="text-center py-10">
        <div class="inline-flex flex-col items-center gap-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div class="text-sm text-gray-600">
            Cargando datos históricos...
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-red-500 text-center py-10">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
          <p class="font-semibold">Error al cargar los datos</p>
          <p class="text-sm mt-1">{{ error }}</p>
          <button
            @click="fetchAllData"
            class="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Reintentar
          </button>
        </div>
      </div>

      <!-- Gráficas -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Gráfica de Línea - Temperatura -->
        <div class="bg-white shadow-lg rounded-xl p-4 h-80">
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-lg font-bold">Histórico de Temperatura</h2>
            <span class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
              {{ temperatureData.length }} puntos
            </span>
          </div>
          <div class="h-64">
            <LineChart
              :labels="temperatureLabels"
              :data="temperatureData"
            />
          </div>
          <div class="text-xs text-gray-500 mt-2 flex justify-between">
            <span>Mín: {{ temperatureStats.min }}°C</span>
            <span>Prom: {{ temperatureStats.avg }}°C</span>
            <span>Máx: {{ temperatureStats.max }}°C</span>
          </div>
        </div>

        <!-- Gráfica de Barras - Humedad -->
        <div class="bg-white shadow-lg rounded-xl p-4 h-80">
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-lg font-bold">Histórico de Humedad</h2>
            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {{ humidityData.length }} puntos
            </span>
          </div>
          <div class="h-64">
            <BarChart
              :labels="humidityLabels"
              :data="humidityData"
            />
          </div>
          <div class="text-xs text-gray-500 mt-2 flex justify-between">
            <span>Mín: {{ humidityStats.min }}%</span>
            <span>Prom: {{ humidityStats.avg }}%</span>
            <span>Máx: {{ humidityStats.max }}%</span>
          </div>
        </div>

        <!-- Gráfica de Pastel - Cultivos -->
        <div class="bg-white shadow-lg rounded-xl p-4 h-80 lg:col-span-2">
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-lg font-bold">Distribución de Cultivos</h2>
            <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              {{ cropsData.labels.length }} cultivos
            </span>
          </div>
          <div class="h-64">
            <PieChart
              :labels="cropsData.labels"
              :data="cropsData.counts"
            />
          </div>
          <div class="text-xs text-gray-500 mt-2 text-center">
            Total de registros: {{ cropsData.total }}
          </div>
        </div>
      </div>

      <!-- Información de resumen -->
      <div v-if="!loading && !error" class="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 class="font-semibold text-blue-800 mb-2">Resumen General</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ summary.total_records }}</div>
            <div class="text-blue-800">Total Registros</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ summary.unique_crops }}</div>
            <div class="text-green-800">Cultivos Únicos</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">{{ summary.avg_temperature.toFixed(1) }}°C</div>
            <div class="text-red-800">Temp Promedio</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">{{ summary.avg_humidity.toFixed(1) }}%</div>
            <div class="text-purple-800">Hum Promedio</div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

import DashboardLayout from "@/components/DashboardLayout.vue";
import LineChart from "@/components/charts/LineChart.vue";
import BarChart from "@/components/charts/BarChart.vue";
import PieChart from "@/components/charts/PieChart.vue";

const loading = ref(true);
const error = ref<string | null>(null);
const limit = ref<number>(50);

const temperatureData = ref<number[]>([]);
const temperatureLabels = ref<string[]>([]);
const humidityData = ref<number[]>([]);
const humidityLabels = ref<string[]>([]);
const cropsData = ref<{ labels: string[]; counts: number[]; total: number }>({
  labels: [],
  counts: [],
  total: 0
});

const summary = ref({
  total_records: 0,
  unique_crops: 0,
  avg_temperature: 0,
  avg_humidity: 0,
  min_temperature: 0,
  max_temperature: 0,
  min_humidity: 0,
  max_humidity: 0
});

const temperatureStats = computed(() => {
  if (temperatureData.value.length === 0) return { min: 0, max: 0, avg: 0 };
  const min = Math.min(...temperatureData.value);
  const max = Math.max(...temperatureData.value);
  const avg = temperatureData.value.reduce((a, b) => a + b, 0) / temperatureData.value.length;
  return { min: min.toFixed(1), max: max.toFixed(1), avg: avg.toFixed(1) };
});

const humidityStats = computed(() => {
  if (humidityData.value.length === 0) return { min: 0, max: 0, avg: 0 };
  const min = Math.min(...humidityData.value);
  const max = Math.max(...humidityData.value);
  const avg = humidityData.value.reduce((a, b) => a + b, 0) / humidityData.value.length;
  return { min: min.toFixed(1), max: max.toFixed(1), avg: avg.toFixed(1) };
});

function formatDateLabel(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString("es-MX", {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return timestamp;
  }
}

async function fetchAllData() {
  loading.value = true;
  error.value = null;

  try {
    // Generar datos de ejemplo directamente
    const dataCount = limit.value;

    // Generar datos de temperatura (entre 15°C y 35°C)
    const tempData = Array.from({ length: dataCount }, (_, i) => {
      const baseTemp = 20 + Math.sin(i * 0.1) * 8 + Math.random() * 5;
      return Number(baseTemp.toFixed(1));
    });

    // Generar datos de humedad (entre 40% y 80%)
    const humData = Array.from({ length: dataCount }, (_, i) => {
      const baseHum = 60 + Math.cos(i * 0.05) * 15 + Math.random() * 10;
      return Number(Math.max(40, Math.min(80, baseHum)).toFixed(1));
    });

    // Generar timestamps
    const now = new Date();
    const timestamps = Array.from({ length: dataCount }, (_, i) => {
      const date = new Date(now.getTime() - (dataCount - i - 1) * 60000);
      return date.toISOString();
    });

    // Asignar datos
    temperatureData.value = tempData;
    temperatureLabels.value = timestamps.map(ts => formatDateLabel(ts));
    humidityData.value = humData;
    humidityLabels.value = timestamps.map(ts => formatDateLabel(ts));

    // Datos de cultivos
    const exampleCrops = ['Maíz', 'Trigo', 'Soja', 'Arroz', 'Café'];
    const cropCounts = exampleCrops.map(() => Math.floor(Math.random() * 30) + 10);
    cropsData.value = {
      labels: exampleCrops,
      counts: cropCounts,
      total: cropCounts.reduce((sum, count) => sum + count, 0)
    };

    // Calcular resumen
    const tempValues = temperatureData.value;
    const humValues = humidityData.value;

    summary.value = {
      total_records: dataCount,
      unique_crops: exampleCrops.length,
      avg_temperature: tempValues.reduce((a, b) => a + b, 0) / tempValues.length,
      avg_humidity: humValues.reduce((a, b) => a + b, 0) / humValues.length,
      min_temperature: Math.min(...tempValues),
      max_temperature: Math.max(...tempValues),
      min_humidity: Math.min(...humValues),
      max_humidity: Math.max(...humValues)
    };

    console.log('✅ Datos de ejemplo generados correctamente');

  } catch (err: any) {
    console.error('❌ Error:', err);
    error.value = 'Error al cargar los datos: ' + err.message;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchAllData();
});
</script>
