<template>
  <button :class="['p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none', customClass]" :aria-label="ariaLabel">
    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
      <polyline points="6 14 12 8 18 14" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>
  </button>
</template>
<script setup lang="ts">
defineProps<{ customClass?: string, ariaLabel?: string }>()
</script> 