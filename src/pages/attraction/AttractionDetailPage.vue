<template>
  <div :class="clsx('container', styles.detailPage)">
    <LoadingSpinner :is-loading="isLoading || isEnqueueLoading" />
    <Modal
      :is-open="isModalOpen"
      :title="modalTitle"
      :content="modalContent"
      button-title="확인"
      @close="handleModalClose"
      @button-click="handleModalButtonClick"
    />

    <template v-if="attraction">
      <section :class="styles.hero">
        <img :src="attraction.imageUrl" :alt="attraction.name" :class="styles.heroImage" />
        <div :class="styles.heroGradient" />
      </section>

      <AttractionContentCard
        :attraction="attraction"
        :riding-minutes="ridingMinutes"
        :premium-waiting-minutes="premiumWaitingMinutes"
        :premium-waiting-count="premiumWaitingCount"
        :general-waiting-minutes="generalWaitingMinutes"
        :general-waiting-count="generalWaitingCount"
      />
      <div :class="styles.bottomSpacer" />

      <div class="button-bottom">
        <Button title="줄서기" :class="styles.queueButton" @click="handleQueueButtonClick" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import clsx from 'clsx'
import { getAttractionDetail } from '@/api/attraction.api'
import { subscribeRideInfo } from '@/api/ws'
import { enqueue } from '@/api/queue.api'
import type { AttractionDetail } from '@/types/attraction'
import type { EnqueueResponse } from '@/types/queue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import AttractionContentCard from '@/components/attraction/AttractionContentCard.vue'
import Modal from '@/components/common/modals/Modal.vue'
import { useAuthStore } from '@/stores/auth'
import styles from './Attraction.module.css'

type QueueModalMode = 'loginRequired' | 'ticketUnavailable' | 'queueConfirm' | 'queueCompleted' | 'queueDenied' | null

const route = useRoute()
const authStore = useAuthStore()

const attractionId = computed(() => route.params.attractionId as string)
const attraction = ref<AttractionDetail | null>(null)
const isLoading = ref(false)
const isEnqueueLoading = ref(false)
const detailRefreshKey = ref(0)
const modalMode = ref<QueueModalMode>(null)
const enqueueResult = ref<EnqueueResponse | null>(null)
let wsUnsubscribe: (() => void) | null = null

const premiumWaiting = computed(() =>
  attraction.value?.waitTimes.find((wait) => wait.ticketType === 'PREMIUM')
)
const generalWaiting = computed(() =>
  attraction.value?.waitTimes.find((wait) => wait.ticketType === 'GENERAL')
)
const selectedTypeWaiting = computed(() =>
  authStore.todayActiveTicketType
    ? attraction.value?.waitTimes.find((wait) => wait.ticketType === authStore.todayActiveTicketType)
    : null
)

const ridingMinutes = computed(() =>
  attraction.value ? Math.round(attraction.value.ridingTime / 60) : 0
)
const premiumWaitingMinutes = computed(() => premiumWaiting.value?.estimatedWaitMinutes ?? 0)
const premiumWaitingCount = computed(() => premiumWaiting.value?.waitingCount ?? 0)
const generalWaitingMinutes = computed(() => generalWaiting.value?.estimatedWaitMinutes ?? 0)
const generalWaitingCount = computed(() => generalWaiting.value?.waitingCount ?? 0)
const ticketTypeLabel = computed(() =>
  authStore.todayActiveTicketType === 'PREMIUM' ? 'Premium' : 'Basic'
)

const fetchAttractionDetail = async () => {
  if (!attractionId.value) return

  try {
    isLoading.value = true
    const data = await getAttractionDetail(attractionId.value)
    attraction.value = data
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const setupWebSocketSubscription = () => {
  if (!attractionId.value) return

  const parsedRideId = Number(attractionId.value)
  if (Number.isNaN(parsedRideId)) return

  // Unsubscribe from previous subscription if exists
  if (wsUnsubscribe) {
    wsUnsubscribe()
  }

  wsUnsubscribe = subscribeRideInfo(parsedRideId, (payload) => {
    if (payload.rideId !== parsedRideId) return

    if (attraction.value && attraction.value.attractionId === parsedRideId) {
      attraction.value = {
        ...attraction.value,
        waitTimes: payload.waitTimes,
      }
    }
  })
}

const handleQueueButtonClick = () => {
  if (!authStore.userId) {
    modalMode.value = 'loginRequired'
    return
  }

  if (!authStore.hasTodayActiveTicket || !authStore.todayActiveTicketType) {
    modalMode.value = 'ticketUnavailable'
    return
  }

  modalMode.value = 'queueConfirm'
}

const handleModalButtonClick = async () => {
  if (
    modalMode.value !== 'queueConfirm' ||
    !attraction.value ||
    !authStore.userId ||
    !authStore.todayActiveTicketType
  ) {
    modalMode.value = null
    return
  }

  try {
    isEnqueueLoading.value = true
    const data = await enqueue({
      userId: authStore.userId,
      rideId: attraction.value.attractionId,
      ticketType: authStore.todayActiveTicketType,
    })
    enqueueResult.value = data
    detailRefreshKey.value += 1
    modalMode.value = 'queueCompleted'
  } catch (error) {
    console.error(error)
    modalMode.value = 'queueDenied'
  } finally {
    isEnqueueLoading.value = false
  }
}

const handleModalClose = () => {
  modalMode.value = null
}

const isModalOpen = computed(() => modalMode.value !== null)

const modalTitle = computed(() => {
  if (modalMode.value === 'loginRequired') return '로그인이 필요합니다'
  if (modalMode.value === 'ticketUnavailable') return '줄서기 불가'
  if (modalMode.value === 'queueConfirm') return '줄서기'
  if (modalMode.value === 'queueDenied') return '줄서기 불가'
  return '줄서기 등록 완료'
})

const modalContent = computed(() => {
  if (modalMode.value === 'loginRequired') {
    return '로그인 후 줄서기를 이용할 수 있습니다.'
  }

  if (modalMode.value === 'ticketUnavailable') {
    return '줄서기는 입장 후 가능합니다.'
  }

  if (modalMode.value === 'queueConfirm') {
    return `
      <div class="${styles.queueModalContent}">
        <p>
          <span class="${styles.emphasisPrimary}">${attraction.value?.name}</span>에 줄서기를 등록하시겠습니까?
        </p>
        <p class="${clsx(
          styles.ticketTypeBadge,
          authStore.todayActiveTicketType === 'PREMIUM' ? styles.ticketTypePremium : styles.ticketTypeBasic
        )}">
          ${ticketTypeLabel.value}
        </p>
        <p>
          예상 대기시간: <span class="${styles.emphasisPrimary}">${selectedTypeWaiting.value?.estimatedWaitMinutes ?? 0}</span> 분
        </p>
      </div>
    `
  }

  if (modalMode.value === 'queueDenied') {
    return `${attraction.value?.name ?? '해당 어트랙션'} 탑승 횟수를 초과했습니다.`
  }

  return `
    <div class="${styles.queueModalContent}">
      <p>
        <span class="${styles.emphasisPrimary}">${attraction.value?.name}</span>에 대기가 등록되었습니다.
      </p>
      <p>내 순서: <span class="${styles.emphasisPrimary}">${enqueueResult.value?.position ?? 0}</span>번째</p>
      <p>예상 대기시간: <span class="${styles.emphasisPrimary}">${enqueueResult.value?.estimatedWaitMinutes ?? 0}</span> 분</p>
    </div>
  `
})

// Watch for attractionId and detailRefreshKey changes
watch([attractionId, detailRefreshKey], () => {
  fetchAttractionDetail()
}, { immediate: true })

// Watch for attractionId changes to setup WebSocket
watch(attractionId, () => {
  setupWebSocketSubscription()
}, { immediate: true })

onMounted(() => {
  fetchAttractionDetail()
  setupWebSocketSubscription()
})

onUnmounted(() => {
  if (wsUnsubscribe) {
    wsUnsubscribe()
  }
})
</script>
