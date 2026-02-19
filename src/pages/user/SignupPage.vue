<template>
  <div :class="styles.container">
    <h1>회원가입</h1>
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
      <div :class="styles.field">
        <label for="passwordConfirm">비밀번호 확인</label>
        <input
          id="passwordConfirm"
          v-model="formData.passwordConfirm"
          type="password"
          required
          :class="styles.input"
        />
      </div>
      <button type="submit" :class="styles.button" :disabled="isLoading">
        {{ isLoading ? '가입 중...' : '회원가입' }}
      </button>
      <p v-if="errorMessage" :class="styles.error">{{ errorMessage }}</p>
    </form>
    <router-link to="/login" :class="styles.link">로그인</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signup } from '@/api/auth.api'
import styles from '@/pages/user/user.module.css'

const router = useRouter()

const formData = ref({
  userId: '',
  password: '',
  passwordConfirm: '',
})

const isLoading = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  if (isLoading.value) return

  if (formData.value.password !== formData.value.passwordConfirm) {
    errorMessage.value = '비밀번호가 일치하지 않습니다'
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''

    await signup({
      username: formData.value.userId,
      password: formData.value.password,
    })

    router.push('/login')
  } catch (error) {
    console.error(error)
    errorMessage.value = '회원가입에 실패했습니다'
  } finally {
    isLoading.value = false
  }
}
</script>
