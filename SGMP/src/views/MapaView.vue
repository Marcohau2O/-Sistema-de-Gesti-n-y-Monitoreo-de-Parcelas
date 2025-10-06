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
          <div class="text-2xl font-bold text-gray-800">{{ totalParcelas }}</div>
          <p class="text-xs text-gray-500">de {{ totalParcelas }} registradas en el sistema</p>
        </div>

        <!-- Área Total -->
        <!-- <div class="p-4 bg-gray-50 border rounded-xl">
          <div class="flex items-center justify-between pb-1">
            <h3 class="text-sm font-medium text-gray-600">Área Total</h3>
            <MapPin class="h-5 w-5 text-gray-400" />
          </div>
          <div class="text-2xl font-bold text-gray-800">11.5</div>
          <p class="text-xs text-gray-500">hectáreas</p>
        </div> -->

        <!-- Parcelas Activas -->
        <div class="p-4 bg-green-50 border border-green-100 rounded-xl">
          <div class="flex items-center justify-between pb-1">
            <h3 class="text-sm font-medium text-green-700">Parcelas Activas</h3>
            <Activity class="h-5 w-5 text-green-500" />
          </div>
          <div class="text-2xl font-bold text-green-700">{{ activas }}</div>
          <p class="text-xs text-green-600">transmitiendo datos</p>
        </div>

        <!-- En Mantenimiento -->
        <div class="p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
          <div class="flex items-center justify-between pb-1">
            <h3 class="text-sm font-medium text-yellow-700">En Mantenimiento</h3>
            <Layers class="h-5 w-5 text-yellow-500" />
          </div>
          <div class="text-2xl font-bold text-yellow-600">{{ mantenimiento }}</div>
          <p class="text-xs text-yellow-600">requieren atención</p>
        </div>
      </div>

      <!-- Panel de Filtros y Mapa -->
      <div class="lg:col-span-3 flex flex-col gap-6">
        <!-- Filtros -->
        <div class="bg-white border rounded-2xl shadow-md p-6">
          <div class="flex items-center gap-2 mb-3">
            <Filter class="h-5 w-5 text-gray-600" />
            <h2 class="text-lg font-semibold text-gray-700">Filtros de Visualización</h2>
          </div>
          <p class="text-sm text-gray-500 mb-4">Filtra las parcelas mostradas en el mapa por estado y tipo de cultivo.</p>

          <div class="flex flex-col sm:flex-row gap-4 items-end">
            <!-- Filtro Estado -->
            <div class="flex flex-col space-y-1">
              <label class="text-sm font-medium text-gray-700">Estado</label>
              <select v-model="selectedEstado"
                class="w-44 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-200 focus:outline-none hover:border-green-300 transition-colors"
              >
                <option value="all">Todos los estados</option>
                <option value="activa">Activas</option>
                <option value="maintenance">Mantenimiento</option>
                <option value="inactive">Inactivas</option>
              </select>
            </div>

            <!-- Filtro Cultivo -->
            <div class="flex flex-col space-y-1">
              <label class="text-sm font-medium text-gray-700">Cultivo</label>
              <select v-model="selectedCultivo"
                class="w-44 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-blue-300 transition-colors"
              >
                <option value="all">Todos los cultivos</option>
                <option v-for="c in [...new Set(parcelasStore.parcelas.map(p => p.cultivo))]" :key="c" :value="c">
                  {{ c }}
                </option>
              </select>
            </div>

            <!-- Estadísticas rápidas -->
            <div class="ml-auto text-sm text-gray-600">
              <strong>{{ totalFiltradas }}</strong> de <strong>{{ totalParcelas }}</strong> parcelas mostradas
            </div>

            <!-- Botón Limpiar -->
            <Button
              @click="limpiarFiltros"
              variant="outline"
              size="sm"
              class="mt-3 sm:mt-0 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-green-700 transition-all duration-200"
            >
              Limpiar Filtros
            </Button>
          </div>

          <!-- Etiquetas de filtros activos -->
          <div class="flex flex-wrap items-center gap-2 mt-4">
            <span class="text-sm font-medium text-gray-600">Filtros activos:</span>
            <span
              v-if="selectedEstado !== 'all'"
              class="text-xs bg-green-100 px-2 py-1 rounded-md text-green-700"
            >
              Estado: {{ selectedEstado }}
            </span>
            <span
              v-if="selectedCultivo !== 'all'"
              class="text-xs bg-blue-100 px-2 py-1 rounded-md text-blue-700"
            >
              Cultivo: {{ selectedCultivo }}
            </span>
            <span
              v-if="selectedEstado === 'all' && selectedCultivo === 'all'"
              class="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-700"
            >
              Sin filtros activos
            </span>
          </div>
        </div>

        <!-- Listado de Parcelas -->
        <div class="bg-white border rounded-2xl shadow-md p-6">
          <h2 class="text-lg font-semibold mb-4 text-gray-700">Parcelas Registradas</h2>
          <ul class="space-y-2 max-h-[300px] overflow-y-auto">
            <li
              v-for="parcela in filteredParcelas"
              :key="parcela.id"
              class="cursor-pointer hover:bg-green-50 p-3 rounded-lg transition flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1"
              @click="seleccionarParcela(parcela)"
            >
              <div>
                <strong class="text-gray-800">{{ parcela.nombre }}</strong>
                <div class="text-sm text-gray-500">{{ parcela.cultivo }} - {{ parcela.responsable }}</div>
              </div>
              <div class="text-sm text-gray-400">
                Lat: {{ parcela.latitud }}, Lng: {{ parcela.longitud }}
              </div>
            </li>
          </ul>
        </div>

        <!-- Mapa -->
        <div class="bg-white border rounded-2xl shadow-md p-4">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Mapa de las Parcelas</h2>
          <div id="map" class="w-full h-[500px] rounded-xl border border-gray-200 shadow-inner"></div>
        </div>
      </div>
    </div>

  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from "@/components/DashboardLayout.vue";
import { onMounted, ref, watch, computed } from "vue";
import { useParcelasStore } from "@/stores/parcelaStore";

const parcelasStore = useParcelasStore();
const map = ref<google.maps.Map | null>(null);
const markers = ref<google.maps.Marker[]>([]);
const selectedEstado = ref("all");
const selectedCultivo = ref("all");
const selectedParcela = ref(null);


const limpiarFiltros = () => {
  selectedEstado.value = "all";
  selectedCultivo.value = "all";
  renderMarkers(); // vuelve a mostrar todas las parcelas
};

const totalParcelas = computed(() => parcelasStore.parcelas.length);
const activas = computed(() => filteredParcelas.value.filter((p) => p.estado === "activa").length);
const mantenimiento = computed(() => filteredParcelas.value.filter((p) => p.estado === "mantenimiento").length);

const filteredParcelas = computed(() => {
  return parcelasStore.parcelas.filter((p) => {
    const estadoMatch = selectedEstado.value === "all" || p.estado === selectedEstado.value;
    const cultivoMatch = selectedCultivo.value === "all" || p.cultivo === selectedCultivo.value;
    return estadoMatch && cultivoMatch;
  });
});

const totalFiltradas = computed(() => filteredParcelas.value.length);

onMounted(async () => {
  await parcelasStore.fetchParcelas();

  await loadGoogleMapsScript(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

  await google.maps.importLibrary("maps");
  await google.maps.importLibrary("marker");

  const primeraParcela = parcelasStore.parcelas[0];

  map.value = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center: primeraParcela
      ? { lat: Number(primeraParcela.latitud), lng: Number(primeraParcela.longitud) }
      : { lat: 19.4326, lng: -99.1332 }, // Ciudad de México como fallback
    zoom: primeraParcela ? 12 : 6,
    mapId: "parcelas-map",
  });

  renderMarkers();
});

// Función para cargar el script de forma dinámica
function loadGoogleMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=maps,marker,places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Error al cargar Google Maps"));
    document.head.appendChild(script);
  });
}

const renderMarkers = () => {
  // Limpiar marcadores anteriores
  markers.value.forEach((m) => m.setMap(null));
  markers.value = [];

  // Usar las parcelas filtradas
  filteredParcelas.value.forEach((p) => {
    if (!p.latitud || !p.longitud) return;

    const marker = new google.maps.Marker({
      position: { lat: Number(p.latitud), lng: Number(p.longitud) },
      map: map.value!,
      title: p.nombre,
      icon:
        p.estado === "active"
          ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
          : p.estado === "maintenance"
          ? "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
          : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    });

    const info = new google.maps.InfoWindow({
      content: `
        <div style="font-family:sans-serif;font-size:13px;">
          <strong>${p.nombre}</strong><br>
          Cultivo: ${p.cultivo}<br>
          Responsable: ${p.responsable}<br>
          Estado: ${p.estado}
        </div>
      `,
    });

    marker.addListener("click", () => info.open(map.value!, marker));
    markers.value.push(marker);
  });
};

watch([selectedEstado, selectedCultivo], renderMarkers);

const seleccionarParcela = (parcela: any) => {
  selectedParcela.value = parcela;

  // Centra el mapa en la parcela
  if (map.value) {
    map.value.setCenter({
      lat: Number(parcela.latitud),
      lng: Number(parcela.longitud),
    });
    map.value.setZoom(14);
  }

  // Buscar el marcador correspondiente y abrir InfoWindow
  const marker = markers.value.find(
    (m) =>
      m.getPosition()?.lat() === Number(parcela.latitud) &&
      m.getPosition()?.lng() === Number(parcela.longitud)
  );

  if (marker) {
    new google.maps.InfoWindow({
      content: `
        <div style="font-family: sans-serif; font-size: 13px;">
          <strong>${parcela.nombre}</strong><br>
          Cultivo: ${parcela.cultivo}<br>
          Responsable: ${parcela.responsable}<br>
          Estado: ${parcela.estado}
        </div>
      `,
    }).open(map.value, marker);
  }
};
</script>
