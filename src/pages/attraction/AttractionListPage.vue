<template>
  <div :class="styles.container">
    <h1>어트랙션 목록</h1>
    <div v-if="isLoading">로딩 중...</div>
    <div v-else-if="error">에러가 발생했습니다</div>
    <div v-else-if="attractions" :class="styles.list">
      <div
        v-for="attraction in attractions"
        :key="attraction.attractionId"
        :class="styles.item"
        @click="goToDetail(attraction.attractionId)"
      >
        <img :src="attraction.imageUrl" :alt="attraction.name" :class="styles.image" />
        <h2 :class="styles.name">{{ attraction.name }}</h2>
        <p :class="styles.description">{{ attraction.description }}</p>
        <p :class="styles.waitTime">대기 시간: {{ attraction.generalWaitingTime }}분</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { getAttractionList } from '@/api/attraction.api'
import styles from '@/pages/attraction/Attraction.module.css'

const router = useRouter()

const { data: attractions, isLoading, error } = useQuery({
  queryKey: ['attractions'],
  queryFn: getAttractionList,
})

function goToDetail(id: number) {
  router.push(`/attraction/${id}`)
}
</script>
