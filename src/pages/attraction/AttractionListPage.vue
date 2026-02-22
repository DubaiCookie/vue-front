<template>
  <div :class="['container', styles.listPage]">
    <LoadingSpinner v-if="isLoading" />
    <div class="page-title">
      <div class="glass title-icon-container">
        <Icon icon="mdi:ferris-wheel" class="title-icon" />
      </div>
      <span>Attractions</span>
    </div>
    <AttractionList v-if="attractions" :attractions="attractions" />
    <div :class="styles.listBottomSpacer" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import AttractionList from '@/components/attraction/AttractionList.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { getAttractionList } from '@/api/attraction.api'
import { subscribeRidesMinutes } from '@/api/ws'
import type { AttractionSummary } from '@/types/attraction'
import styles from './Attraction.module.css'

const attractions = ref<AttractionSummary[]>([])
const isLoading = ref(false)

// TODO: error handling 필요
onMounted(async () => {
  try {
    isLoading.value = true
    const data = await getAttractionList()
    attractions.value = data
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})

// WebSocket 구독으로 실시간 대기시간 업데이트
let unsubscribe: (() => void) | null = null

onMounted(() => {
  unsubscribe = subscribeRidesMinutes((payload) => {
    if (attractions.value.length === 0) {
      return
    }

    const waitingByRideId = new Map(
      payload.rides.map((ride) => [ride.rideId, ride.estimatedWaitMinutes]),
    )
    let hasChanged = false
    const next = attractions.value.map((attraction) => {
      const nextWaitingMinutes = waitingByRideId.get(attraction.attractionId)
      if (
        nextWaitingMinutes === undefined ||
        nextWaitingMinutes === attraction.generalWaitingTime
      ) {
        return attraction
      }
      hasChanged = true
      return {
        ...attraction,
        generalWaitingTime: nextWaitingMinutes,
      }
    })

    if (hasChanged) {
      attractions.value = next
    }
  })
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})
</script>
