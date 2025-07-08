<template>
  <button :class="['p-1 rounded hover:bg-white dark:hover:bg-gray-800 focus:outline-none', customClass]" :aria-label="ariaLabel">
    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
      <path d="M4 12a8 8 0 1 1 8 8" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="12,21 10.7,18.7 13.3,18.7" fill="currentColor" transform="rotate(-20 12 20)" />
    </svg>
  </button>
</template>
<script setup lang="ts">
defineProps<{ customClass?: string, ariaLabel?: string }>()
</script>