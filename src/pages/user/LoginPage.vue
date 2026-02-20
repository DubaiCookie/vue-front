<template>
  <div>
    <Modal
      :is-open="isInvalidCredentialsModalOpen"
      title="로그인 실패"
      content="아이디/비밀번호를 확인해주세요."
      button-title="확인"
      @close="isInvalidCredentialsModalOpen = false"
      @button-click="isInvalidCredentialsModalOpen = false"
    />
    <Modal
      :is-open="isSuccessModalOpen"
      title="로그인 완료"
      content="로그인이 완료되었습니다."
      button-title="확인"
      @close="isSuccessModalOpen = false"
      @button-click="handleSuccessModalClose"
    />
    <div :class="['container', 'flex-column']">
      <div :class="[styles.block, 'flex-column']">
        <div :class="[styles.title, 'page-title']">Log in</div>
        <InputForm :fields="loginFields" submit-label="로그인" @submit="handleLogin" />
        <router-link to="/signup" :class="styles.smallText">회원이 아니신가요?</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import InputForm from '@/components/common/inputs/InputForm.vue'
import Modal from '@/components/common/modals/Modal.vue'
import type { FieldSpec, LoginUser } from '@/types/user'
import { login } from '@/api/auth.api'
import { getMyTicketList } from '@/api/ticket.api'
import { useAuthStore } from '@/stores/auth'
import { isSameLocalDate } from '@/utils/functions'
import styles from '@/pages/user/user.module.css'

const router = useRouter()
const authStore = useAuthStore()

const loginFields: FieldSpec<'userId' | 'password'>[] = [
  {
    name: 'userId',
    label: 'ID',
    type: 'userId',
    placeholder: 'ID를 입력하세요.',
    autoComplete: 'username',
    required: true,
    validate: (v) => (v.length > 0 ? null : '사용자 ID를 입력해주세요.'),
  },
  {
    name: 'password',
    label: '비밀번호',
    type: 'password',
    placeholder: '비밀번호',
    autoComplete: 'current-password',
    required: true,
    validate: (v) => (v.length > 0 ? null : '비밀번호를 입력해주세요.'),
  },
]

const isSuccessModalOpen = ref(false)
const isInvalidCredentialsModalOpen = ref(false)

async function handleLogin(values: Record<'userId' | 'password', string>) {
  try {
    const response = await login(values as LoginUser)
    const resolvedUsername = response.username?.trim() || values.userId
    authStore.setAuthUser({
      userId: response.userId,
      username: resolvedUsername,
    })

    try {
      const ticketList = await getMyTicketList()
      const today = new Date()
      const availableTicket = ticketList.find(
        (ticket) =>
          ticket.activeStatus === 'ACTIVE' &&
          isSameLocalDate(new Date(ticket.availableAt), today),
      )

      authStore.setTodayActiveTicket({
        hasTodayActiveTicket: Boolean(availableTicket),
        todayActiveTicketType: availableTicket?.ticketType ?? null,
      })
    } catch (ticketError) {
      console.error(ticketError)
      authStore.setTodayActiveTicket({
        hasTodayActiveTicket: false,
        todayActiveTicketType: null,
      })
    }
    isSuccessModalOpen.value = true
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      isInvalidCredentialsModalOpen.value = true
      return
    }
    throw error
  }
}

function handleSuccessModalClose() {
  isSuccessModalOpen.value = false
  router.push('/attraction')
}
</script>
