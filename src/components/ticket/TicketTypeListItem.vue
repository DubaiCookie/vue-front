<template>
  <button
    type="button"
    :class="[styles.typeItem, selected && styles.selected]"
    :aria-pressed="selected"
    @click="emit('select', type)"
  >
    <div :class="styles.topRow">
      <span :class="[styles.badge, type === 'PREMIUM' ? styles.premium : styles.general]">
        {{ title }}
      </span>
      <span :class="styles.price">{{ priceLabel }}</span>
    </div>
    <p :class="styles.description">{{ description }}</p>
  </button>
</template>

<script setup lang="ts">
import type { TicketKind } from '@/types/ticket'
import styles from '@/components/ticket/TicketType.module.css'

interface Props {
  type: TicketKind
  title: string
  description: string
  priceLabel: string
  selected: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  select: [type: TicketKind]
}>()
</script>
