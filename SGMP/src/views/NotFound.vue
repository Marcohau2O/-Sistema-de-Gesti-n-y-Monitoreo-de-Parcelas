<script setup lang="ts">
import BaseButton from '@/components/common/BaseButton.vue'
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center px-4"
  >
    <div class="max-w-md w-full text-center bg-white shadow-xl rounded-2xl p-10">
      <!-- Número grande -->
      <div class="mb-6 relative">
        <div class="text-9xl font-extrabold text-blue-600 drop-shadow-sm">404</div>
        <div
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400 opacity-80"
        >
          <!-- Ícono SVG girando -->
          <svg
            class="h-20 w-20 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 12a8 8 0 018-8v2m0 12a8 8 0 01-8-8h2m12 0a8 8 0 01-8 8v-2m0-12a8 8 0 018 8h-2"
            />
          </svg>
        </div>
      </div>

      <!-- Título -->
      <h1 class="text-3xl font-bold text-gray-800 mb-3">Oops! Página no encontrada</h1>

      <!-- Texto -->
      <p class="text-base text-gray-600 mb-8">
        Parece que te has adentrado en el desierto digital.  
        No te preocupes, incluso los mejores exploradores se pierden a veces.
      </p>

      <!-- Botón -->
      <BaseButton variant="blue" @click="$router.push('/')">
        Regresar al inicio
      </BaseButton>
    </div>
  </div>
</template>
