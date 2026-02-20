<template>
  <div :class="['container', styles.pageRoot]">
    <LoadingSpinner :is-loading="isLoading" />
    <Modal
      :is-open="Boolean(selectedCancelItem)"
      title="줄서기 취소"
      :content="`${selectedCancelItem?.rideName ?? ''} 줄서기를 취소하시겠습니까?`"
      button-title="확인"
      @close="selectedCancelItem = null"
      @button-click="handleConfirmCancel"
    />
    <Modal
      :is-open="Boolean(selectedSnoozeItem)"
      title="준비중"
      content="미루기 기능은 준비중입니다."
      button-title="확인"
      @close="selectedSnoozeItem = null"
      @button-click="selectedSnoozeItem = null"
    />
    <div class="page-title">
      <div class="glass title-icon-container">
        <Icon icon="ion:hourglass" class="title-icon" />
      </div>
      <span>Waiting Status</span>
    </div>
    <WaitingList
      v-if="items.length > 0"
      :items="items"
      @cancel="handleCancel"
      @snooze="handleSnooze"
    />
    <EmptyStateMessage v-else target="이용 대기중인 어트랙션이" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import WaitingList from '@/components/waiting/WaitingList.vue'
import EmptyStateMessage from '@/components/common/EmptyStateMessage.vue'
import Modal from '@/components/common/modals/Modal.vue'
import { useAuthStore } from '@/stores/auth'
import { useQueueStore } from '@/stores/queue'
import { cancelQueue, getQueueStatus } from '@/api/queue.api'
import type { QueueStatusItem } from '@/types/queue'
import styles from '@/pages/WaitingListPage.module.css'

const authStore = useAuthStore()
const queueStore = useQueueStore()

const userId = computed(() => authStore.userId)
const liveQueueItems = computed(() => queueStore.liveQueueItems)

const items = ref<QueueStatusItem[]>([])
const isLoading = ref(false)
const selectedCancelItem = ref<QueueStatusItem | null>(null)
const selectedSnoozeItem = ref<QueueStatusItem | null>(null)

async function fetchQueueStatus() {
  if (!userId.value) {
    items.value = []
    return
  }

  try {
    isLoading.value = true
    const data = await getQueueStatus(userId.value)
    items.value = data
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  void fetchQueueStatus()
})

watch(liveQueueItems, (newItems) => {
  if (!userId.value) {
    return
  }
  items.value = newItems
})

function handleCancel(item: QueueStatusItem) {
  selectedCancelItem.value = item
}

function handleSnooze(item: QueueStatusItem) {
  selectedSnoozeItem.value = item
}

async function handleConfirmCancel() {
  if (!userId.value) {
    selectedCancelItem.value = null
    return
  }

  if (!selectedCancelItem.value) {
    return
  }

  try {
    isLoading.value = true
    await cancelQueue({
      userId: userId.value,
      rideId: selectedCancelItem.value.rideId,
    })
    await fetchQueueStatus()
  } catch (error) {
    console.error(error)
    isLoading.value = false
  } finally {
    selectedCancelItem.value = null
  }
}
</script>
