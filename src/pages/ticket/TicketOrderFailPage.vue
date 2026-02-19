<template>
  <div :class="styles.container">
    <h1>결제 실패</h1>
    <p>티켓 구매에 실패했습니다</p>
    <router-link to="/ticket/order" :class="styles.button">
      다시 시도
    </router-link>
  </div>
</template>

<script setup lang="ts">
import styles from '@/pages/ticket/TicketOrderResultPage.module.css'
</script>
