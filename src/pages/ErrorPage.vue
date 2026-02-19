<template>
  <div :class="styles.container">
    <h1 :class="styles.title">404</h1>
    <p :class="styles.message">페이지를 찾을 수 없습니다</p>
    <router-link to="/attraction" :class="styles.link">
      홈으로 돌아가기
    </router-link>
  </div>
</template>

<script setup lang="ts">
import styles from '@/pages/ErrorPage.module.css'
</script>
