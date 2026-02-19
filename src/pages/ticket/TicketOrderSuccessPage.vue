<template>
  <div :class="styles.container">
    <h1>결제 성공</h1>
    <p>티켓 구매가 완료되었습니다</p>
    <router-link to="/ticket" :class="styles.button">
      내 티켓 보기
    </router-link>
  </div>
</template>

<script setup lang="ts">
import styles from '@/pages/ticket/TicketOrderResultPage.module.css'
</script>
