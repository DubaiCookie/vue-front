<template>
  <div :class="styles.container">
    <h1>마이페이지</h1>
    <div v-if="authStore.username" :class="styles.userInfo">
      <p>사용자: {{ authStore.username }}</p>
      <button type="button" :class="styles.button" @click="handleLogout">
        로그아웃
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { logout as apiLogout } from '@/api/auth.api'
import { useAuthStore } from '@/stores/auth'
import styles from '@/pages/user/user.module.css'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  try {
    await apiLogout()
    authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error(error)
  }
}
</script>
