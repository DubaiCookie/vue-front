<template>
  <div :class="styles.root">
    <p :class="styles.message">{{ target }} 없습니다.</p>
  </div>
</template>

<script setup lang="ts">
import styles from '@/components/common/EmptyStateMessage.module.css'

interface Props {
  target: string
}

defineProps<Props>()
</script>
