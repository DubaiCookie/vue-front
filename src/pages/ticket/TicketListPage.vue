<template>
  <div :class="styles.container">
    <h1>내 티켓</h1>
    <div v-if="isLoading">로딩 중...</div>
    <div v-else-if="error">에러가 발생했습니다</div>
    <div v-else-if="tickets && tickets.length > 0" :class="styles.list">
      <div
        v-for="ticket in tickets"
        :key="ticket.ticketOrderId"
        :class="styles.item"
      >
        <p>티켓 타입: {{ ticket.ticketType }}</p>
        <p>사용 가능 날짜: {{ ticket.availableAt }}</p>
        <p>상태: {{ ticket.activeStatus }}</p>
        <p>결제일: {{ ticket.paymentDate }}</p>
      </div>
    </div>
    <p v-else :class="styles.empty">티켓이 없습니다</p>
    <router-link to="/ticket/order" :class="styles.button">
      티켓 구매하기
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { getMyTicketList } from '@/api/ticket.api'
import styles from '@/pages/ticket/TicketListPage.module.css'

const { data: tickets, isLoading, error } = useQuery({
  queryKey: ['tickets'],
  queryFn: getMyTicketList,
})
</script>
