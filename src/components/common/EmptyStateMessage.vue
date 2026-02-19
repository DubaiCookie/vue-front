<template>
  <div :class="styles.container">
    <p :class="styles.message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import styles from '@/components/common/EmptyStateMessage.module.css'

interface Props {
  message: string
}

defineProps<Props>()
</script>
