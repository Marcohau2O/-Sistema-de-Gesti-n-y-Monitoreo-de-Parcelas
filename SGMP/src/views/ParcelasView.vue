<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold">Parcelas Eliminadas</h1>
          <p class="text-muted-foreground">Se mostrarán datos recientes que fueron eliminadas</p>
        </div>
      </div>

      <!-- Loader -->
      <Loanding v-if="loadingStore.isLoading" class="absolute z-10" />

      <!-- Tabla de parcelas -->
      <div v-else class="bg-white rounded-2xl shadow-md p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Listado de Parcelas Eliminadas</h2>

        <div v-if="parcelaStore.parcelas.length === 0" class="text-center py-10 text-gray-500">
          No hay parcelas eliminadas para mostrar.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-800">Nombre</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-800">Cultivo</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-800">Responsable</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-800">Latitud</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-800">Longitud</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-800">Motivo</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-800">Eliminado En</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="parcela in parcelaStore.parcelas" :key="parcela.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-2 text-sm text-gray-700">{{ parcela.nombre }}</td>
                <td class="px-4 py-2 text-sm text-gray-700">{{ parcela.cultivo }}</td>
                <td class="px-4 py-2 text-sm text-gray-700">{{ parcela.responsable }}</td>
                <td class="px-4 py-2 text-sm text-gray-500">{{ parcela.latitud }}</td>
                <td class="px-4 py-2 text-sm text-gray-500">{{ parcela.longitud }}</td>
                <td class="px-4 py-2 text-sm text-red-600">{{ parcela.motivo_eliminacion }}</td>
                <td class="px-4 py-2 text-sm text-gray-500">{{ formatDate(parcela.eliminado_en) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import DashboardLayout from "@/components/DashboardLayout.vue";
import Loanding from "@/components/common/Loanding.vue";
import { useLoadingStore } from "@/stores/loadingStore";
import { useParcelasStore } from "@/stores/parcelaStore";

const parcelaStore = useParcelasStore();
const loadingStore = useLoadingStore();

const parcelas = ref<any[]>([]);

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

onMounted(async () => {
  await parcelaStore.fetchParcelasEliminadas();
  parcelas.value = parcelaStore.parcelas;
});
</script>
