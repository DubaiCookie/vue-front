<template>
  <RouterLink :to="`/attraction/${attraction.attractionId}`" :class="styles.root">
    <div :class="styles.info">
      <p :class="styles.name">{{ attraction.name }}</p>
      <p :class="styles.description">{{ attraction.description }}</p>
      <p :class="[styles.mediumText, styles.operatingTime]">
        <Icon icon="mdi:clock-time-four-outline" :class="styles.timeIcon" />
        <span>{{ attraction.operatingTime }}</span>
      </p>
      <div :class="[styles.waitingTimeWrap, waitingLevelClass, styles.mediumText]">
        <span :class="styles.waitingLabel">{{ waitingLabel }}</span>
        <span :class="styles.waitingDivider">|</span>
        <span :class="styles.waitingTimeValue">{{ attraction.generalWaitingTime }}분</span>
      </div>
    </div>
    <div :class="styles.imageWrap">
      <img
        :src="attraction.imageUrl"
        :alt="attraction.name"
        :class="styles.image"
      />
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import type { AttractionSummary } from '@/types/attraction'
import styles from './AttractionListItem.module.css'

interface Props {
  attraction: AttractionSummary
}

const props = defineProps<Props>()

const waitingLevelClass = computed(() => {
  if (props.attraction.generalWaitingTime < 30) return styles.waitingLow
  if (props.attraction.generalWaitingTime < 60) return styles.waitingMid
  return styles.waitingHigh
})

const waitingLabel = computed(() => {
  if (props.attraction.generalWaitingTime < 30) return '여유'
  if (props.attraction.generalWaitingTime < 60) return '보통'
  return '혼잡'
})
</script>
