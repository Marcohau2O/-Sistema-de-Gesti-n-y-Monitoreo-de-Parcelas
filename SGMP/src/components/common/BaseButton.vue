<template>
  <button
    v-bind:class="[
      'w-full p-4 rounded-lg cursor-pointer',
      variant === 'blue'
        ? 'bg-[#2563EB] hover:bg-[#1d4ed8]'
        : variant === 'green'
          ? 'bg-[#059669] hover:bg-[#047857]'
          : variant === 'red'
            ? 'bg-[#DC2626] hover:bg-[#b91c1c]'
            : variant === 'orange'
              ? 'bg-[#F49F1C] hover:bg-[#d99937]'
              : variant === 'gray'
                ? 'bg-[#BCCCDC] hover:bg-gray-500'
                : 'bg-[#33415C] hover:bg-[#212122]',
    ]"
  >
    <h3>
      <slot />
    </h3>
  </button>
</template>

<script lang="ts" setup>
interface Props {
  variant?: 'blue' | 'green' | 'red' | 'orange' | 'gray' | 'deepblue'
  type?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'blue',
  type: 'button',
})
</script>