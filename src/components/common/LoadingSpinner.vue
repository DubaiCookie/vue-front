<template>
  <div v-if="isLoading" :class="styles.overlay">
    <div :class="styles.content">
      <div :class="styles.spinner" />
      <p v-if="message" :class="styles.message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import styles from '@/components/common/LoadingSpinner.css.module.css'

interface Props {
  isLoading: boolean
  message?: string
}

defineProps<Props>()
</script>
