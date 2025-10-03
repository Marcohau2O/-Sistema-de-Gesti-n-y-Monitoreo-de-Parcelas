<template>
  <Loanding v-if="loadingStore.isLoading" class="absolute z-10"/>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-md space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="flex justify-center mb-4">
          <div class="p-6 bg-green-100 rounded-full shadow-md">
            <img
              width="48"
              height="48"
              src="https://img.icons8.com/ios/100/leaf--v1.png"
              alt="leaf logo"
              class="text-green-400"
            />
          </div>
        </div>
        <h1 class="text-3xl font-bold text-gray-800">Sistema de Parcelas</h1>
        <p class="text-gray-500 mt-2">Gestión y monitoreo agrícola</p>
      </div>

      <!-- Card -->
      <div class="rounded-xl shadow-lg border bg-white p-6">
        <h2 class="text-xl font-semibold text-gray-800">Registro</h2>
        <p class="text-sm text-gray-500 mb-4">
          Crea tu cuenta para acceder al sistema
        </p>

        <!-- Formulario -->
        <form @submit.prevent="onSubmit" class="space-y-5">
          <div class="space-y-2">
            <label for="name" class="text-sm font-medium text-gray-700">Nombre</label>
            <input
              id="name"
              type="text"
              v-model="name"
              placeholder="Tu nombre completo"
              required
              class="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div class="space-y-2">
            <label for="email" class="text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              v-model="email"
              placeholder="usuario@ejemplo.com"
              required
              class="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div class="space-y-2">
            <label for="password" class="text-sm font-medium text-gray-700">Contraseña</label>
            <input
              id="password"
              type="password"
              v-model="password"
              placeholder="••••••••"
              required
              class="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div class="space-y-2">
            <label for="confirmPassword" class="text-sm font-medium text-gray-700">Confirmar Contraseña</label>
            <input
              id="confirmPassword"
              type="password"
              v-model="confirmPassword"
              placeholder="••••••••"
              required
              class="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <!-- Botón -->
          <button
            type="submit"
            class="w-full flex justify-center items-center px-4 py-2 rounded-md font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            {{ isLoading ? 'Registrando...' : 'Registrarse' }}
          </button>
        </form>

        <!-- Login -->
        <p class="mt-6 text-sm text-center text-gray-600">
          ¿Ya tienes cuenta?
          <router-link to="/" class="text-green-600 font-medium hover:underline">Inicia sesión</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { ref } from 'vue'
import { useLoadingStore } from '@/stores/loadingStore'
import Loanding from '@/components/common/Loanding.vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()
const authStore = useAuthStore()
const loadingStore = useLoadingStore()

const isLoading = ref(false)
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const onSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Las contraseñas no coinciden',
    })
    return
  }

  try {
    isLoading.value = true

    await authStore.register(
      name.value, email.value, password.value,
    )

    Swal.fire({
      icon: 'success',
      title: '¡Registro exitoso!',
      text: 'Tu cuenta ha sido creada correctamente',
      timer: 2000,
      showConfirmButton: false,
    })

    router.push('/')
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Ocurrió un error al registrar',
    })
  } finally {
    isLoading.value = false
  }
}
</script>
