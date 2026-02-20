<template>
  <div :class="styles.metaItem">
    <p :class="styles.metaLabel">{{ label }}</p>
    <p :class="styles.metaValue">{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
import styles from './AttractionMetaItem.module.css'

interface Props {
  label: string
  value: string
}

defineProps<Props>()
</script>
