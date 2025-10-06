<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Mobile sidebar backdrop -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform transition-transform duration-200 ease-in-out lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Logo / título -->
      <div class="flex h-16 items-center px-6">
        <div class="flex items-center gap-2">
          <div class="p-2 bg-green-100 rounded-lg">
            <!-- Icono -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-semibold text-gray-800">Parcelas</h1>
            <p class="text-xs text-gray-500">Sistema Agrícola</p>
          </div>
        </div>
      </div>

      <!-- Navegación -->
      <nav class="flex-1 px-4 py-6 space-y-1">
        <a
          href="/dashboard"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-100 hover:text-green-700"
        >
          📊 Dashboard
        </a>
        <a
          href="/historicos"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-100 hover:text-green-700"
        >
          📜 Histórico
        </a>
        <a
          href="mapaParcelas"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-100 hover:text-green-700"
        >
          🗺️ Mapa de parcelas
        </a>
        <a
          href="/parcelaEliminadas"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-100 hover:text-green-700"
        >
          🗑️ Parcelas eliminadas
        </a>

        <template v-if="userData?.role === 'admin'">
        <a
          href="/crudParcelas"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-100 hover:text-green-700"
        >
          🛠️ CRUD Parcelas
        </a>
        <a
          href="/usersCrud"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-100 hover:text-green-700"
        >
          👤 Usuarios
        </a>
      </template>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col lg:pl-64">
      <!-- Top bar -->
      <header
        class="sticky top-0 z-30 bg-white shadow-sm px-6 h-16 flex items-center justify-between"
      >
        <!-- Mobile menu button -->
        <button
          class="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          @click="sidebarOpen = true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <!-- User dropdown -->
        <div class="relative" id="user-dropdown">
          <button
            class="h-13 w-13 rounded-full flex items-center justify-center hover:bg-gray-200"
            @click="toggleUserMenu"
          >
            <span
              class="h-10 w-10 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-semibold"
            >
              {{ userInitial }}
            </span>
          </button>

          <!-- Dropdown -->
          <div
            v-if="userMenuOpen"
            class="absolute left-0 mt-2 w-56 rounded-lg border bg-white shadow-lg z-50"
          >
            <!-- Header usuario -->
            <div class="px-4 py-3 bg-gradient-to-r from-blue-50 to-green-50 border-b">
              <p class="text-sm font-semibold text-gray-800">{{ userData?.name }}</p>
              <p class="text-xs text-gray-500">{{ userData?.email }}</p>
              <p class="text-xs text-gray-500 capitalize">Rol: {{ userData?.role }}</p>
            </div>

            <!-- Opciones -->
            <ul class="py-1">
              <li>
                <button
                  @click="logout"
                  class="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 11-4 0v-1m0-10V5a2 2 0 114 0v1"
                    />
                  </svg>
                  <span class="font-medium">Cerrar Sesión</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { getUserFromToken } from "@/utils/userToken";

const sidebarOpen = ref(false);
const userMenuOpen = ref(false);

const authStore = useAuthStore()

const userData = getUserFromToken();
// console.log("datos usuarios", userData)

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
};

// Usuario de prueba
// const user = ref({
//   name: "Marco",
//   email: "marco@parcelas.com",
//   role: "admin",
// });

// Inicial del usuario
const userInitial = computed(() =>
  userData?.name ? userData.name.charAt(0).toUpperCase() : "U"
  // user.value.name ? user.value.name.charAt(0).toUpperCase() : "U"
);

const logout = async () => {
  try {
    await authStore.logout()
  } catch (error) {
    console.error('Error during logout:', error)
  }
};

const handleClickOutside = (event: MouseEvent) => {
  const dropdown = document.getElementById("user-dropdown");
  if (dropdown && !dropdown.contains(event.target as Node)) {
    userMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
