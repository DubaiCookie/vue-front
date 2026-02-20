<template>
  <div>
    <Modal
      :is-open="boardingModalMode !== null"
      :title="modalTitle"
      :content="modalContent"
      button-title="확인"
      @close="handleModalClose"
      @button-click="handleModalButtonClick"
    />

    <header :class="[styles.root, 'container', 'flex-row']">
      <router-link to="/attraction" :class="styles.logoLink" aria-label="WayThing 홈으로 이동">
        <img src="/logo-mark.svg" alt="" :class="styles.logoIcon" />
        <span :class="styles.logoText">WayThing</span>
      </router-link>

      <div :class="['highlight', 'flex-row']">
        <template v-if="isLoggedIn">
          <p :class="[styles.headerText, styles.userBadge, 'flex-row', 'glass']">
            <span :class="styles.userName">{{ username }}</span>
            <span>님</span>
          </p>
          <Icon icon="ion:notifications" :class="styles.icon" />
        </template>
        <template v-else>
          <router-link to="/login" :class="['flex-row', styles.headerText]">
            <p :class="styles.smallText">로그인</p>
            <Icon icon="feather:log-in" :class="styles.icon" />
          </router-link>
        </template>
      </div>
    </header>

    <button
      v-if="queueAlert"
      type="button"
      :class="styles.queueAlert"
      role="status"
      aria-live="polite"
      @click="handleQueueAlertClick"
    >
      <span :class="styles.queueAlertRideName">{{ queueAlert.rideName }}</span>
      <span :class="styles.queueAlertBody">{{ queueAlertBodyText }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useQueueStore } from '@/stores/queue'
import { boardQueue } from '@/api/queue.api'
import Modal from '@/components/common/modals/Modal.vue'
import { Icon } from '@iconify/vue'
import styles from '@/components/common/Header.module.css'

type BoardingModalMode = "confirm" | "success" | "failed" | null

const authStore = useAuthStore()
const queueStore = useQueueStore()

const username = computed(() => authStore.username)
const userId = computed(() => authStore.userId)
const queueAlert = computed(() => queueStore.queueAlert)
const isLoggedIn = computed(() => Boolean(username.value))

const boardingModalMode = ref<BoardingModalMode>(null)
const isBoardingSubmitting = ref(false)

const modalTitle = computed(() => {
  if (boardingModalMode.value === "confirm") return "탑승"
  if (boardingModalMode.value === "success") return "탑승 완료"
  return "탑승 실패"
})

const modalContent = computed(() => {
  if (boardingModalMode.value === "confirm") return "탑승하시겠습니까?"
  if (boardingModalMode.value === "success") return "탑승이 완료되었습니다."
  return "탑승 처리가 실패했습니다."
})

const queueAlertBodyText = computed(() => {
  if (!queueAlert.value) return ""
  return queueAlert.value.status === "READY"
    ? "지금 탑승구로 이동해 직원에게 메세지를 보여주세요."
    : "곧 탑승 순서입니다. 탑승 장소로 이동해주세요."
})

watch(queueAlert, (newAlert) => {
  if (!newAlert || newAlert.status === "READY") {
    return
  }

  const timeoutId = window.setTimeout(() => {
    queueStore.setQueueAlert(null)
  }, 30_000)

  return () => {
    window.clearTimeout(timeoutId)
  }
})

function handleQueueAlertClick() {
  if (!queueAlert.value) {
    return
  }

  if (queueAlert.value.status !== "READY") {
    queueStore.setQueueAlert(null)
    return
  }

  boardingModalMode.value = "confirm"
}

async function handleConfirmBoarding() {
  if (isBoardingSubmitting.value) {
    return
  }

  if (!queueAlert.value?.rideId || !userId.value) {
    boardingModalMode.value = "failed"
    return
  }

  try {
    isBoardingSubmitting.value = true
    await boardQueue({
      userId: userId.value,
      rideId: queueAlert.value.rideId,
    })
    queueStore.setQueueAlert(null)
    window.location.reload()
    return
  } catch (error) {
    console.error(error)
    boardingModalMode.value = "failed"
  } finally {
    isBoardingSubmitting.value = false
  }
}

function handleModalClose() {
  if (isBoardingSubmitting.value) {
    return
  }
  boardingModalMode.value = null
}

function handleModalButtonClick() {
  if (boardingModalMode.value === "confirm") {
    void handleConfirmBoarding()
    return
  }

  boardingModalMode.value = null
}
</script>
