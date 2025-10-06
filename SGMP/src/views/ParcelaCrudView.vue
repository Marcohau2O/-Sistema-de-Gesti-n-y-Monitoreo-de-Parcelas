<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col gap-6">
        <!-- Encabezado principal -->
        <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Administrador de Parcelas</h1>
            <p class="text-gray-500 text-sm sm:text-base">
              Gestión y control de las parcelas registradas
            </p>
          </div>

          <button 
            @click="openCreateModal"
            class="mt-3 sm:mt-0 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-green-700 transition-all duration-200"
          >
            <i class="fa-solid fa-plus"></i>
            Crear Parcela
          </button>
        </header>

        <!-- Subencabezado -->
        <div class="flex items-center justify-between border-b pb-2">
          <h2 class="text-2xl font-semibold text-gray-800">Parcelas Registradas</h2>
          <span class="text-gray-500 text-sm">Actualizado recientemente</span>
        </div>
      </div>

      <!-- Card principal -->
      <div class="bg-white rounded-2xl shadow-md p-6 w-full">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h3 class="text-2xl font-semibold text-gray-700">Parcelas Registrados</h3>
        </div>

        <!-- Filtros -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <input 
            v-model="search" 
            type="text" 
            placeholder="Buscar por nombre o email"
            class="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />

          <!-- <select 
            v-model="filterStatus"
            class="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="">Todos los Estados</option>
            <option value="activa">Activa</option>
            <option value="mantenimiento">Mantenimiento</option>
          </select> -->
        </div>

        <!-- Tabla de usuarios -->
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm text-gray-700 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr class="bg-gray-100 text-left text-gray-600">
                <th class="px-4 py-3 border-b">Nombre</th>
                <th class="px-4 py-3 border-b">Cultivo</th>
                <th class="px-4 py-3 border-b">Responsable</th>
                <!-- <th class="px-4 py-3 border-b">Latitud</th>
                <th class="px-4 py-3 border-b">Longitud</th> -->
                <th class="px-4 py-3 border-b">Estado</th>
                <th class="px-4 py-3 border-b text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="parcelas in filteredParcelas" 
                :key="parcelas.id" 
                class="border-b hover:bg-gray-50 transition"
              >
                <td class="px-4 py-3 font-medium">{{ parcelas.nombre }}</td>
                <td class="px-4 py-3">{{ parcelas.cultivo }}</td>
                <td class="px-4 py-3 capitalize">{{ parcelas.responsable }}</td>
                <td class="px-4 py-3 capitalize">{{ parcelas.estado }}</td>
                <td class="px-4 py-3 space-x-2 flex justify-center">
                  <button 
                    @click="openViewModal(parcelas)"
                    class="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition text-sm"
                  >
                    Ver
                  </button>
                  <button 
                    @click="openEditModal(parcelas)"
                    class="bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-500 transition text-sm"
                  >
                    Editar
                  </button>
                  <button
                    v-if="parcelas.id" 
                    @click="deleteUser(parcelas.id)"
                    class="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>

              <tr v-if="parcelas.length === 0">
                <td colspan="4" class="text-center p-6 text-gray-500">No se encontraron Parcelas.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Overlay gris transparente -->
      <div v-if="showViewModal" class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        <!-- Contenido del modal -->
        <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Detalles del Usuario</h2>
          <div class="space-y-2 text-gray-700">
            <p><strong>Nombre:</strong> {{ selectedParcela.nombre }}</p>
            <p><strong>Cultivo:</strong> {{ selectedParcela.cultivo }}</p>
            <p><strong>Responsable:</strong> {{ selectedParcela.responsable }}</p>
            <p><strong>Longitud:</strong> {{ selectedParcela.longitud }}</p>
            <p><strong>Latitud:</strong> {{ selectedParcela.latitud }}</p>
            <p><strong>Estado:</strong> {{ selectedParcela.estado }}</p>
          </div>

          <!-- Botón de cerrar -->
          <div class="mt-6 flex justify-end">
            <button 
              @click="showViewModal = false" 
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Editar -->
      <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        <Loanding v-if="loadingStore.isLoading" class="absolute z-10"/>
        <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative z-20">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Editar Parcelas</h2>

          <form @submit.prevent="saveUser" class="space-y-4">
            <div>
              <label class="block font-medium text-gray-700 mb-1">Nombre Parcelas</label>
              <input 
                v-model="selectedParcela.nombre" 
                type="text" 
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label class="block font-medium text-gray-700 mb-1">Cultivo</label>
              <input 
                v-model="selectedParcela.cultivo" 
                type="text" 
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label class="block font-medium text-gray-700 mb-1">Responsable</label>
              <input 
                v-model="selectedParcela.responsable" 
                type="text" 
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label class="block font-medium text-gray-700 mb-1">Longitud</label>
              <p class="font-medium text-gray-400 mb-1 text-sm">Utilizar Numeros para Ubicarlo</p>
              <input 
                v-model="selectedParcela.longitud" 
                type="text" 
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label class="block font-medium text-gray-700 mb-1 text-sm">Longitud</label>
              <p class="font-medium text-gray-400 mb-1">Utilizar Numeros para Ubicarlo</p>
              <input 
                v-model="selectedParcela.latitud" 
                type="text" 
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label class="block font-medium text-gray-700 mb-1">Estado</label>
              <select 
                v-model="selectedParcela.estado" 
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="activa">activa</option>
                <!-- <option value="user">Usuario</option> -->
              </select>
            </div>

            <!-- Botones -->
            <div class="flex justify-end gap-3 pt-4">
              <button 
                type="button" 
                @click="showEditModal = false"
                class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 bg-[#004B93] text-white rounded-lg hover:bg-[#063B6D] transition"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Crear Parcela -->
      <div v-if="showCreateModal" class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        <Loanding v-if="loadingStore.isLoading" class="absolute z-10"/>
        <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative z-20">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Crear Parcela</h2>

          <form @submit.prevent="createParcela" class="space-y-4">
            <div>
              <label class="block font-medium text-gray-700 mb-1">Nombre Parcela</label>
              <input v-model="newParcela.nombre" type="text" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            </div>
            <div>
              <label class="block font-medium text-gray-700 mb-1">Cultivo</label>
              <input v-model="newParcela.cultivo" type="text" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            </div>
            <div>
              <label class="block font-medium text-gray-700 mb-1">Responsable</label>
              <input v-model="newParcela.responsable" type="text" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            </div>
            <div>
              <label class="block font-medium text-gray-700 mb-1">Latitud</label>
              <p class="font-medium text-gray-400 mb-1 text-sm">Utilizar Numeros para Ubicarlo</p>
              <input v-model="newParcela.latitud" type="text" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            </div>
            <div>
              <label class="block font-medium text-gray-700 mb-1">Longitud</label>
              <p class="font-medium text-gray-400 mb-1 text-sm">Utilizar Numeros para Ubicarlo</p>
              <input v-model="newParcela.longitud" type="text" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            </div>
            <div>
              <label class="block font-medium text-gray-700 mb-1">Estado</label>
              <select v-model="newParcela.estado" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="activa">Activa</option>
                <option value="mantenimiento">Mantenimiento</option>
              </select>
            </div>

            <!-- Botones -->
            <div class="flex justify-end gap-3 pt-4">
              <button type="button" @click="showCreateModal = false" class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">Cancelar</button>
              <button type="submit" class="px-4 py-2 bg-[#004B93] text-white rounded-lg hover:bg-[#063B6D] transition">Crear</button>
            </div>
          </form>
        </div>
      </div>

    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from "@/components/DashboardLayout.vue";
import Swal from "sweetalert2";
import Loanding from "@/components/common/Loanding.vue";
import { useLoadingStore } from '@/stores/loadingStore'
import { useParcelasStore } from "@/stores/parcelaStore";
import { onMounted, ref, computed} from "vue";
// import { getUserFromToken } from "@/utils/userToken";

const parcelaStore = useParcelasStore()
const loadingStore = useLoadingStore()

const search = ref('')
const parcelas = ref([])

const selectedParcela = ref<any>({})
const showViewModal = ref(false)
const showEditModal = ref(false)
const isLoading = ref(false)

const openViewModal = (user: any) => {
  selectedParcela.value = { ...user }
  showViewModal.value = true
}

const openEditModal = (user: any) => {
  selectedParcela.value = { ...user }
  showEditModal.value = true
}

const showCreateModal = ref(false);
const newParcela = ref({
  nombre: '',
  cultivo: '',
  responsable: '',
  latitud: '',
  longitud: '',
  estado: 'activa'
});

// const currentUser = getUserFromToken();

const openCreateModal = () => {
  newParcela.value = {
    nombre: '',
    cultivo: '',
    responsable: '',
    latitud: '',
    longitud: '',
    estado: 'activa'
  };
  showCreateModal.value = true;
};

const saveUser = async () => {
  if (!selectedParcela.value || !selectedParcela.value.id) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No hay parcela seleccionado para editar",
      confirmButtonColor: "#004B93"
    });
    return;
  }

  try {
    isLoading.value = true
    loadingStore.startLoading()

    await parcelaStore.updateParcela(selectedParcela.value.id!, {
      id: selectedParcela.value.id!,
      nombre: selectedParcela.value.nombre,
      cultivo: selectedParcela.value.cultivo,
      responsable: selectedParcela.value.responsable,
      latitud: selectedParcela.value.latitud,
      longitud: selectedParcela.value.longitud,
      estado: selectedParcela.value.estado,
    });

    await parcelaStore.fetchParcelas()
    showViewModal.value = false;

    Swal.fire({
      icon: "success",
      title: "!Parcela actualizadd",
      text: "Los cambios se guardaron correctamente",
      confirmButtonColor: "#004B93"
    })
  } catch (error: any) {
    Swal.fire({
      icon: "error",
      title: "Error al actualizar",
      text: "Credenciales incorrectas o error de servidor",
      confirmButtonColor: "#004B93"
    });
  } finally {
    isLoading.value = false
    loadingStore.stopLoading()
  }
}

const filteredParcelas = computed(() => {
  return parcelaStore.parcelas.filter(u =>
    (u.nombre.toLowerCase().includes(search.value.toLowerCase()) ||
     u.cultivo.toLowerCase().includes(search.value.toLowerCase()) ||
     u.responsable.toLowerCase().includes(search.value.toLowerCase())
    )
  )
})

const deleteUser = async (id: number) => {
  Swal.fire({
    title: "¿Esta seguro?",
    text: "No podrás revertir esta acción.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then(async (result) => {
    if (result.isConfirmed) {
      isLoading.value = true;
      try {
        await parcelaStore.removeParcela(id);
        await parcelaStore.fetchParcelasEliminadas();
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "La Parcela ha sido elimminado correctamente",
          confirmButtonColor: "#004B93"
        });
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "No se pudo eliminar al parcela",
          confirmButtonColor: "#004B93"
        });
      } finally {
        isLoading.value = false;
      }
    }
  })
}

const createParcela = async () => {
  try {
    isLoading.value = true;
    loadingStore.startLoading();

    await parcelaStore.createNewParcela({
      ...newParcela.value,
      latitud: Number(newParcela.value.latitud),
      longitud: Number(newParcela.value.longitud),
    });

    await parcelaStore.fetchParcelas();
    showCreateModal.value = false;

    Swal.fire({
      icon: 'success',
      title: '¡Parcela creada!',
      text: 'La nueva parcela se guardó correctamente',
      confirmButtonColor: '#004B93'
    });
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error al crear',
      text: error.message || 'Ocurrió un error al crear la parcela',
      confirmButtonColor: '#004B93'
    });
  } finally {
    isLoading.value = false;
    loadingStore.stopLoading();
  }
};

onMounted(() => {
  parcelaStore.fetchParcelas()
})
</script>
