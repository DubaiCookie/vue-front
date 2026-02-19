<template>
  <div :class="styles.container">
    <h1>대기열</h1>
    <div v-if="isLoading">로딩 중...</div>
    <div v-else-if="error">에러가 발생했습니다</div>
    <div v-else-if="queueItems && queueItems.length > 0" :class="styles.list">
      <div
        v-for="item in queueItems"
        :key="item.rideId"
        :class="styles.item"
      >
        <h2 :class="styles.rideName">{{ item.rideName }}</h2>
        <p>티켓 타입: {{ item.ticketType }}</p>
        <p>대기 순번: {{ item.position }}</p>
        <p>예상 대기 시간: {{ item.estimatedWaitMinutes }}분</p>
      </div>
    </div>
    <p v-else :class="styles.empty">대기 중인 항목이 없습니다</p>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getQueueStatus } from '@/api/queue.api'
import styles from '@/pages/WaitingListPage.module.css'

const authStore = useAuthStore()
const userId = computed(() => authStore.userId)

const { data: queueItems, isLoading, error } = useQuery({
  queryKey: ['queue', userId],
  queryFn: () => getQueueStatus(userId.value!),
  enabled: !!userId.value,
})
</script>
