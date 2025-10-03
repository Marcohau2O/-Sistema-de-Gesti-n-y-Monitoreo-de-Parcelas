<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold">Dashboard en Vivo</h1>
          <p class="text-muted-foreground">Monitoreo en tiempo real de sensores IoT</p>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <span class="text-sm text-gray-600">Conectado</span>
          </div>
          <button 
            @click="toggleAutoRefresh" 
            class="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {{ autoRefresh ? 'Pausar' : 'Reanudar' }} Actualización
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center">
          <div class="text-red-500 mr-3">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div>
            <h3 class="text-red-800 font-medium">Error al cargar datos</h3>
            <p class="text-red-600 text-sm">{{ error }}</p>
          </div>
          <button 
            @click="fetchSensorData" 
            class="ml-auto px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Reintentar
          </button>
        </div>
      </div>

      <!-- Sensor Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Temperatura -->
        <SensorCard
          v-if="latestData.temperatura"
          title="Temperatura"
          :value="latestData.temperatura.value"
          :unit="latestData.temperatura.unit"
          :location="getLocationName(latestData.temperatura.coords)"
          :timestamp="latestData.temperatura.timestamp"
          type="temperature"
        />

        <!-- Humedad -->
        <SensorCard
          v-if="latestData.humedad"
          title="Humedad"
          :value="latestData.humedad.value"
          :unit="latestData.humedad.unit"
          :location="getLocationName(latestData.humedad.coords)"
          :timestamp="latestData.humedad.timestamp"
          type="humidity"
        />

        <!-- Lluvia -->
        <SensorCard
          v-if="latestData.lluvia"
          title="Lluvia"
          :value="latestData.lluvia.value"
          :unit="latestData.lluvia.unit"
          :location="getLocationName(latestData.lluvia.coords)"
          :timestamp="latestData.lluvia.timestamp"
          type="rain"
        />

        <!-- Radiación Solar -->
        <SensorCard
          v-if="latestData.radiacion_solar"
          title="Radiación Solar"
          :value="latestData.radiacion_solar.value"
          :unit="latestData.radiacion_solar.unit"
          :location="getLocationName(latestData.radiacion_solar.coords)"
          :timestamp="latestData.radiacion_solar.timestamp"
          type="radiation"
        />
      </div>

      <!-- Statistics Section -->
      <div v-if="!loading && !error" class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold mb-4">Estadísticas de Sensores</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <p class="text-2xl font-bold text-blue-600">{{ statistics.totalSensors }}</p>
            <p class="text-sm text-gray-500">Sensores Totales</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-green-600">{{ statistics.activeSensors }}</p>
            <p class="text-sm text-gray-500">Sensores Activos</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-purple-600">{{ statistics.locations }}</p>
            <p class="text-sm text-gray-500">Ubicaciones</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-orange-600">{{ statistics.updateFrequency }}s</p>
            <p class="text-sm text-gray-500">Frecuencia</p>
          </div>
        </div>
      </div>

      <!-- Last Update -->
      <div v-if="!loading && !error" class="text-center">
        <p class="text-sm text-gray-500">
          Última actualización: {{ lastUpdateTime }}
        </p>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import DashboardLayout from "@/components/DashboardLayout.vue";
import SensorCard from "@/components/SensorCard.vue";
import sensorService, { type SensorData } from "@/services/sensorService";

interface LatestData {
  temperatura?: SensorData;
  humedad?: SensorData;
  lluvia?: SensorData;
  radiacion_solar?: SensorData;
}

const loading = ref(true);
const error = ref<string | null>(null);
const sensorData = ref<any>(null);
const autoRefresh = ref(true);
const refreshInterval = ref<ReturnType<typeof setInterval> | null>(null);

const latestData = computed<LatestData>(() => {
  if (!sensorData.value) return {};

  return {
    temperatura: sensorData.value.temperatura?.[0],
    humedad: sensorData.value.humedad?.[0],
    lluvia: sensorData.value.lluvia?.[0],
    radiacion_solar: sensorData.value.radiacion_solar?.[0],
  };
});

const lastUpdateTime = computed(() => {
  return new Date().toLocaleTimeString();
});

const statistics = computed(() => {
  if (!sensorData.value) {
    return {
      totalSensors: 0,
      activeSensors: 0,
      locations: 0,
      updateFrequency: 5
    };
  }

  const totalSensors = 
    (sensorData.value.temperatura?.length || 0) +
    (sensorData.value.humedad?.length || 0) +
    (sensorData.value.lluvia?.length || 0) +
    (sensorData.value.radiacion_solar?.length || 0);

  const locations = new Set();
  Object.values(sensorData.value).forEach((sensorArray: any) => {
    sensorArray?.forEach((sensor: SensorData) => {
      locations.add(`${sensor.coords.lat},${sensor.coords.lon}`);
    });
  });

  return {
    totalSensors,
    activeSensors: totalSensors, // Asumiendo que todos están activos
    locations: locations.size,
    updateFrequency: 5
  };
});

const getLocationName = (coords: { lat: number; lon: number }) => {
  // Simulación de nombres de ubicación basados en coordenadas
  if (coords.lat > 18.0) return 'Zona Norte';
  if (coords.lat < 17.95) return 'Zona Sur';
  return 'Zona Central';
};

const fetchSensorData = async () => {
  try {
    loading.value = true;
    error.value = null;
    sensorData.value = await sensorService.getAllSensors();
  } catch (err) {
    error.value = 'No se pudieron cargar los datos de los sensores';
    console.error('Error fetching sensor data:', err);
  } finally {
    loading.value = false;
  }
};

const toggleAutoRefresh = () => {
  autoRefresh.value = !autoRefresh.value;
  
  if (autoRefresh.value) {
    startAutoRefresh();
  } else {
    stopAutoRefresh();
  }
};

const startAutoRefresh = () => {
  refreshInterval.value = setInterval(fetchSensorData, 5000); // Actualizar cada 5 segundos
};

const stopAutoRefresh = () => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
    refreshInterval.value = null;
  }
};

onMounted(() => {
  fetchSensorData();
  startAutoRefresh();
});

onUnmounted(() => {
  stopAutoRefresh();
});
</script>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
</style>