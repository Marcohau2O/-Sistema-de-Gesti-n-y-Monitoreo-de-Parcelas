<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold">Datos Históricos</h1>
          <p class="text-muted-foreground">Análisis temporal de sensores con gráficas interactivas</p>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from "@/components/DashboardLayout.vue";
</script>
