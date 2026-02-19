<template>
  <div :class="styles.container">
    <h1>로그인</h1>
    <form @submit.prevent="handleSubmit">
      <div :class="styles.field">
        <label for="userId">아이디</label>
        <input
          id="userId"
          v-model="formData.userId"
          type="text"
          required
          :class="styles.input"
        />
      </div>
      <div :class="styles.field">
        <label for="password">비밀번호</label>
        <input
          id="password"
          v-model="formData.password"
          type="password"
          required
          :class="styles.input"
        />
      </div>
      <button type="submit" :class="styles.button" :disabled="isLoading">
        {{ isLoading ? '로그인 중...' : '로그인' }}
      </button>
      <p v-if="errorMessage" :class="styles.error">{{ errorMessage }}</p>
    </form>
    <router-link to="/signup" :class="styles.link">회원가입</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/auth.api'
import { useAuthStore } from '@/stores/auth'
import styles from '@/pages/user/user.module.css'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  userId: '',
  password: '',
})

const isLoading = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  if (isLoading.value) return

  try {
    isLoading.value = true
    errorMessage.value = ''

    const response = await login(formData.value)
    authStore.setAuthUser(response)
    router.push('/attraction')
  } catch (error) {
    console.error(error)
    errorMessage.value = '로그인에 실패했습니다'
  } finally {
    isLoading.value = false
  }
}
</script>
