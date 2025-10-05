<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold">Mapa Interactivo</h1>
          <p class="text-muted-foreground">Geolocalización y monitoreo de parcelas en tiempo real</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
      <!-- Panel de Estadísticas -->
      <div class="bg-white border rounded-2xl shadow-sm p-6 space-y-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">Resumen General</h2>

        <!-- Total Parcelas -->
        <div class="p-4 bg-gray-50 border rounded-xl">
          <div class="flex items-center justify-between pb-1">
            <h3 class="text-sm font-medium text-gray-600">Total Parcelas</h3>
            <Map class="h-5 w-5 text-gray-400" />
          </div>
          <div class="text-2xl font-bold text-gray-800">4</div>
          <p class="text-xs text-gray-500">de 4 registradas</p>
        </div>

        <!-- Área Total -->
        <div class="p-4 bg-gray-50 border rounded-xl">
          <div class="flex items-center justify-between pb-1">
            <h3 class="text-sm font-medium text-gray-600">Área Total</h3>
            <MapPin class="h-5 w-5 text-gray-400" />
          </div>
          <div class="text-2xl font-bold text-gray-800">11.5</div>
          <p class="text-xs text-gray-500">hectáreas</p>
        </div>

        <!-- Parcelas Activas -->
        <div class="p-4 bg-green-50 border border-green-100 rounded-xl">
          <div class="flex items-center justify-between pb-1">
            <h3 class="text-sm font-medium text-green-700">Parcelas Activas</h3>
            <Activity class="h-5 w-5 text-green-500" />
          </div>
          <div class="text-2xl font-bold text-green-700">3</div>
          <p class="text-xs text-green-600">transmitiendo datos</p>
        </div>

        <!-- En Mantenimiento -->
        <div class="p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
          <div class="flex items-center justify-between pb-1">
            <h3 class="text-sm font-medium text-yellow-700">En Mantenimiento</h3>
            <Layers class="h-5 w-5 text-yellow-500" />
          </div>
          <div class="text-2xl font-bold text-yellow-600">1</div>
          <p class="text-xs text-yellow-600">requieren atención</p>
        </div>
      </div>

      <!-- Panel de Filtros y Mapa -->
      <div class="lg:col-span-3 space-y-6">
        <!-- Filtros -->
        <div class="bg-white border rounded-2xl shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-2">
            <Filter class="h-5 w-5 text-gray-600" />
            Filtros de Visualización
          </h2>
          <p class="text-sm text-gray-500 mb-4">
            Filtra las parcelas mostradas en el mapa por estado y tipo de cultivo.
          </p>

          <div class="flex flex-col sm:flex-row gap-4">
            <!-- Filtro Estado -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Estado</label>
              <select
                class="w-44 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-200 focus:outline-none"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activas</option>
                <option value="maintenance">Mantenimiento</option>
                <option value="inactive">Inactivas</option>
              </select>
            </div>

            <!-- Filtro Cultivo -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Cultivo</label>
              <select
                class="w-44 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-200 focus:outline-none"
              >
                <option value="all">Todos los cultivos</option>
                <option value="maiz">Maíz</option>
                <option value="trigo">Trigo</option>
                <option value="soya">Soya</option>
              </select>
            </div>

            <!-- Botón -->
            <div class="flex items-end">
              <Button
                variant="outline"
                size="sm"
                class="text-sm border-gray-300 hover:bg-gray-100"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>

          <!-- Etiquetas de filtros activos -->
          <div class="flex flex-wrap items-center gap-2 mt-4">
            <span class="text-sm font-medium text-gray-600">Filtros activos:</span>
            <span class="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-700">Estado: Todos</span>
            <span class="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-700">Cultivo: Todos</span>
          </div>
        </div>

        <!-- Mapa -->
        <!-- Nuevo -->
        <div class="bg-white border rounded-2xl shadow-sm p-3">
          <h1 class="text-3xl text-black">Mapa de las parcelas</h1>
        </div>
      </div>
    </div>

  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from "@/components/DashboardLayout.vue";
</script>
