<template>
  <div :class="[styles.waitingCard, variantClass]">
    <p :class="styles.waitingType">{{ typeLabel }}</p>
    <p :class="styles.waitingTime">{{ minutes }} 분</p>
    <p :class="styles.waitingCount">대기 {{ waitingCount }} 명</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import styles from './AttractionWaitingCard.module.css'

interface Props {
  typeLabel: 'Premium' | 'Basic'
  minutes: number
  waitingCount: number
}

const props = defineProps<Props>()

const variantClass = computed(() =>
  props.typeLabel === 'Premium' ? styles.premiumCard : styles.generalCard,
)
</script>
