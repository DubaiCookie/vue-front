<template>
  <div :class="styles.list">
    <WaitingListItem
      v-for="item in items"
      :key="`${item.rideId}-${item.ticketType}`"
      :item="item"
      @cancel="$emit('cancel', $event)"
      @snooze="$emit('snooze', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { QueueStatusItem } from '@/types/queue'
import WaitingListItem from './WaitingListItem.vue'
import styles from './Waiting.module.css'

interface Props {
  items: QueueStatusItem[]
}

defineProps<Props>()

defineEmits<{
  cancel: [item: QueueStatusItem]
  snooze: [item: QueueStatusItem]
}>()
</script>
