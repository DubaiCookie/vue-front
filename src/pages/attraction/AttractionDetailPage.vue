<template>
  <div :class="styles.container">
    <div v-if="isLoading">로딩 중...</div>
    <div v-else-if="error">에러가 발생했습니다</div>
    <div v-else-if="attraction">
      <img :src="attraction.imageUrl" :alt="attraction.name" :class="styles.image" />
      <h1 :class="styles.name">{{ attraction.name }}</h1>
      <p :class="styles.description">{{ attraction.shortDescription }}</p>
      <p :class="styles.longDescription">{{ attraction.longDescription }}</p>
      <div :class="styles.info">
        <p>운영 시간: {{ attraction.operatingTime }}</p>
        <p>탑승 시간: {{ attraction.ridingTime }}분</p>
        <p>총 정원: {{ attraction.capacityTotal }}명</p>
      </div>
      <div :class="styles.waitTimes">
        <h2>대기 시간</h2>
        <div
          v-for="wait in attraction.waitTimes"
          :key="wait.ticketType"
          :class="styles.waitItem"
        >
          <p>{{ wait.ticketType }}: {{ wait.estimatedWaitMinutes }}분</p>
          <p>대기 인원: {{ wait.waitingCount }}명</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import { getAttractionDetail } from '@/api/attraction.api'
import styles from '@/pages/attraction/Attraction.module.css'

const route = useRoute()
const attractionId = route.params.attractionId as string

const { data: attraction, isLoading, error } = useQuery({
  queryKey: ['attraction', attractionId],
  queryFn: () => getAttractionDetail(attractionId),
})
</script>
