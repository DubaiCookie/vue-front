<template>
  <div :class="styles.spinner">
    <div :class="styles.dot" />
    <div :class="styles.dot" />
    <div :class="styles.dot" />
  </div>
</template>

<script setup lang="ts">
import styles from '@/components/common/LoadingSpinner.css.module.css'
</script>
