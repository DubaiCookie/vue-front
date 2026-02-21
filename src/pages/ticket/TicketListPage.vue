<template>
  <div :class="clsx('container', styles.pageRoot)">
    <LoadingSpinner :is-loading="isLoading || isActivating" />
    <Modal
      :is-open="modalMode !== null"
      :title="modalTitle"
      :content="modalContent"
      button-title="확인"
      @close="handleModalClose"
      @button-click="handleModalButtonClick"
    />
    <div :class="clsx('page-title')">
      <div :class="clsx('glass', 'title-icon-container')">
        <Icon icon="ion:ticket" :class="clsx('title-icon')" />
      </div>
      <span>My Ticket</span>
    </div>
    <template v-if="tickets.length > 0">
      <TicketList :tickets="tickets" @qr-click="handleQrClick" />
      <div :class="styles.bottomSpacer" />
    </template>
    <EmptyStateMessage v-else target="구매한 티켓이" />
    <router-link to="/ticket/order" :class="clsx('button-bottom')">
      <Button title="티켓 구매하기" />
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import clsx from 'clsx'
import { Icon } from '@iconify/vue'
import type { UserTicket } from '@/types/ticket'
import TicketList from '@/components/ticket/TicketList.vue'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyStateMessage from '@/components/common/EmptyStateMessage.vue'
import Modal from '@/components/common/modals/Modal.vue'
import { activateTicket, getMyTicketList } from '@/api/ticket.api'
import { isSameLocalDate } from '@/utils/functions'
import { useAuthStore } from '@/stores/auth'
import styles from './TicketListPage.module.css'

type TicketModalMode = 'alreadyActive' | 'invalidDate' | 'confirmEntry' | 'entryDone' | null

const authStore = useAuthStore()

const tickets = ref<UserTicket[]>([])
const isLoading = ref(false)
const isActivating = ref(false)
const modalMode = ref<TicketModalMode>(null)
const selectedTicket = ref<UserTicket | null>(null)

const syncTodayActiveTicketState = (nextTickets: UserTicket[]) => {
  const today = new Date()
  const availableTodayTicket = nextTickets.find(
    (ticket) =>
      isSameLocalDate(new Date(ticket.availableAt), today) &&
      ticket.activeStatus === 'ACTIVE'
  )

  authStore.setTodayActiveTicket({
    hasTodayActiveTicket: Boolean(availableTodayTicket),
    todayActiveTicketType: availableTodayTicket?.ticketType ?? null,
  })
}

const fetchMyTickets = async () => {
  try {
    isLoading.value = true
    const data = await getMyTicketList()
    tickets.value = data
    syncTodayActiveTicketState(data)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchMyTickets()
})

const handleQrClick = (ticket: UserTicket) => {
  selectedTicket.value = ticket

  if (ticket.activeStatus === 'ACTIVE') {
    modalMode.value = 'alreadyActive'
    return
  }

  const isAvailableToday = isSameLocalDate(new Date(ticket.availableAt), new Date())
  if (!isAvailableToday) {
    modalMode.value = 'invalidDate'
    return
  }

  modalMode.value = 'confirmEntry'
}

const handleModalButtonClick = async () => {
  if (modalMode.value !== 'confirmEntry' || !selectedTicket.value?.ticketOrderId) {
    modalMode.value = null
    return
  }

  try {
    isActivating.value = true
    await activateTicket(selectedTicket.value.ticketOrderId)
    const refreshedTickets = await getMyTicketList()
    tickets.value = refreshedTickets
    syncTodayActiveTicketState(refreshedTickets)

    modalMode.value = 'entryDone'
  } catch (error) {
    console.error(error)
    modalMode.value = null
  } finally {
    isActivating.value = false
  }
}

const handleModalClose = () => {
  modalMode.value = null
  selectedTicket.value = null
}

const modalTitle = computed(() => {
  if (modalMode.value === 'alreadyActive') return '입장 완료'
  if (modalMode.value === 'invalidDate') return '입장 불가'
  if (modalMode.value === 'confirmEntry') return '입장 확인'
  return '입장 완료'
})

const modalContent = computed(() => {
  if (modalMode.value === 'alreadyActive') return '이미 입장 완료된 티켓입니다.'
  if (modalMode.value === 'invalidDate') return '사용 가능 날짜가 아닙니다.'
  if (modalMode.value === 'confirmEntry') return '입장 하시겠습니까?'
  return '입장되었습니다.'
})
</script>
