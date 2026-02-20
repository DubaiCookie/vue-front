<template>
  <div>
    <AttractionListItem
      v-for="attraction in attractions"
      :key="attraction.attractionId"
      :attraction="attraction"
    />
  </div>
</template>

<script setup lang="ts">
import type { AttractionSummary } from '@/types/attraction'
import AttractionListItem from './AttractionListItem.vue'

interface Props {
  attractions: AttractionSummary[]
}

defineProps<Props>()
</script>
