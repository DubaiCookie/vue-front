<template>
  <section :class="styles.section">
    <h3 :class="['font-h3', styles.title]">종류 선택</h3>
    <div :class="styles.list">
      <TicketTypeListItem
        v-for="option in ticketTypeOptions"
        :key="option.type"
        :type="option.type"
        :title="option.title"
        :description="option.description"
        :price-label="option.priceLabel"
        :selected="selectedType === option.type"
        @select="emit('selectType', $event)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { TicketKind } from '@/types/ticket'
import TicketTypeListItem from './TicketTypeListItem.vue'
import styles from '@/components/ticket/TicketType.module.css'

interface Props {
  selectedType: TicketKind | null
}

defineProps<Props>()

const emit = defineEmits<{
  selectType: [type: TicketKind]
}>()

const ticketTypeOptions: Array<{
  type: TicketKind
  title: string
  description: string
  priceLabel: string
}> = [
  {
    type: "GENERAL",
    title: "Basic",
    description: "기본 입장권으로 대부분의 어트랙션을 이용할 수 있어요.",
    priceLabel: "₩ 45,000",
  },
  {
    type: "PREMIUM",
    title: "Premium",
    description: "우선 입장 혜택이 포함된 프리미엄 입장권이에요.",
    priceLabel: "₩ 90,000",
  },
]
</script>
