<template>
    <div class="card flex flex-col justify-center items-center w-full h-full">
    <div
      class="bg-[#F2F5FA] p-13 flex flex-col justify-center items-center rounded-lg animate-pulse">
      <div class="double-spinner"></div>
      <h2 class="text-[#BCCCDC] pt-4">Cargando...</h2>
    </div>
  </div>
</template>
<script setup lang="ts">

</script>

<style>
.double-spinner{
    width: 25px;
    aspect-ratio: 1/1;
    border: 5px solid transparent;
    border-radius: 50%;
    border-color: rgb(0, 119, 225) transparent rgb(0, 119, 225)
                 transparent;
    animation: spin .7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}


</style>