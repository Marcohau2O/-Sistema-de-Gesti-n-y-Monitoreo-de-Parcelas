<template>
  <DashboardLayout>
    <div class="space-y-8">

      <!-- Encabezado -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Administrador de Usuarios</h1>
          <p class="text-gray-500">Gestión y control de usuarios registrados</p>
        </div>
      </div>

      <!-- Card principal -->
      <div class="bg-white rounded-2xl shadow-md p-6 w-full">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h3 class="text-2xl font-semibold text-gray-700">Usuarios Registrados</h3>
        </div>

        <!-- Filtros -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <input 
            v-model="search" 
            type="text" 
            placeholder="Buscar por nombre o email"
            class="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />

          <select 
            v-model="filterRole"
            class="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="">Todos los roles</option>
            <option value="admin">Administrador</option>
            <option value="user">Usuario</option>
          </select>
        </div>

        <!-- Tabla de usuarios -->
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm text-gray-700 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr class="bg-gray-100 text-left text-gray-600">
                <th class="px-4 py-3 border-b">Nombre</th>
                <th class="px-4 py-3 border-b">Email</th>
                <th class="px-4 py-3 border-b">Rol</th>
                <th class="px-4 py-3 border-b text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="user in filteredUsers" 
                :key="user.id" 
                class="border-b hover:bg-gray-50 transition"
              >
                <td class="px-4 py-3 font-medium">{{ user.name }}</td>
                <td class="px-4 py-3">{{ user.email }}</td>
                <td class="px-4 py-3 capitalize">{{ user.role }}</td>
                <td class="px-4 py-3 space-x-2 flex justify-center">
                  <button 
                    @click="openViewModal(user)"
                    class="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition text-sm"
                  >
                    Ver
                  </button>
                  <button 
                    @click="openEditModal(user)"
                    class="bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-500 transition text-sm"
                  >
                    Editar
                  </button>
                  <button 
                    @click="deleteUser(user.id)"
                    class="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>

              <tr v-if="users.length === 0">
                <td colspan="4" class="text-center p-6 text-gray-500">No se encontraron usuarios.</td>
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
            <p><strong>Nombre:</strong> {{ selectedUser.name }}</p>
            <p><strong>Email:</strong> {{ selectedUser.email }}</p>
            <p><strong>Rol:</strong> {{ selectedUser.role }}</p>
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
          <h2 class="text-xl font-bold text-gray-800 mb-4">Editar Usuario</h2>

          <form @submit.prevent="saveUser" class="space-y-4">
            <div>
              <label class="block font-medium text-gray-700 mb-1">Nombre</label>
              <input 
                v-model="selectedUser.name" 
                type="text" 
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label class="block font-medium text-gray-700 mb-1">Email</label>
              <input 
                v-model="selectedUser.email" 
                type="email" 
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label class="block font-medium text-gray-700 mb-1">Rol</label>
              <select 
                v-model="selectedUser.role" 
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="admin">Administrador</option>
                <option value="user">Usuario</option>
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
    </div>
  </DashboardLayout>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from "@/components/DashboardLayout.vue";
import { useUsersStore } from '@/stores/usersStore';
import { useLoadingStore } from '@/stores/loadingStore'
import Loanding from '@/components/common/Loanding.vue';
import Swal from 'sweetalert2';

const usersStore = useUsersStore()
const loadingStore = useLoadingStore()


const search = ref('')
const filterRole = ref('')
const users = ref([])

const selectedUser = ref<any>({})
const showViewModal = ref(false)
const showEditModal = ref(false)
const isLoading = ref(false)

const openViewModal = (user: any) => {
  selectedUser.value = { ...user }
  showViewModal.value = true
}

const openEditModal = (user: any) => {
  selectedUser.value = { ...user }
  showEditModal.value = true
}

const saveUser = async () => {
  if (!selectedUser.value || !selectedUser.value.id) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No hay usuarios seleccionado para editar",
      confirmButtonColor: "#004B93"
    });
    return;
  }

  try {
    isLoading.value = true
    loadingStore.startLoading()

    await usersStore.updateUser(selectedUser.value.id, {
      name: selectedUser.value.name,
      email: selectedUser.value.email,
      role: selectedUser.value.role
    });

    await usersStore.fetchUsers()
    showViewModal.value = false;

    Swal.fire({
      icon: "success",
      title: "!Usuario actualizadd",
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
        await usersStore.removeUser(id);
        await usersStore.fetchUsers();
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "El usuario ha sido elimminado correctamente",
          confirmButtonColor: "#004B93"
        });
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "No se pudo eliminar al usuario",
          confirmButtonColor: "#004B93"
        });
      } finally {
        isLoading.value = false;
      }
    }
  })
}

const filteredUsers = computed(() => {
  return usersStore.users.filter(u =>
    (u.name.toLowerCase().includes(search.value.toLowerCase()) ||
     u.email.toLowerCase().includes(search.value.toLowerCase())) &&
    (filterRole.value ? u.role === filterRole.value : true)
  )
})


onMounted(() => {
  usersStore.fetchUsers()
})
</script>
