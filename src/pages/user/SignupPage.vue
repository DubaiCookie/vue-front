<template>
  <div>
    <Modal
      :is-open="isDuplicateIdModalOpen"
      title="회원가입 실패"
      content="중복된 ID 입니다."
      button-title="확인"
      @close="isDuplicateIdModalOpen = false"
      @button-click="isDuplicateIdModalOpen = false"
    />
    <Modal
      :is-open="isSuccessModalOpen"
      title="회원가입 완료"
      content="회원가입이 성공적으로 완료되었습니다."
      button-title="확인"
      @close="isSuccessModalOpen = false"
      @button-click="handleSuccessModalClose"
    />
    <div :class="['container', styles.authPage]">
      <div :class="[styles.block, styles.authContent]">
        <div class="page-title">
          <div class="glass title-icon-container">
            <Icon icon="ion:person-add-outline" class="title-icon" />
          </div>
          <span :class="styles.title">Sign up</span>
        </div>
        <InputForm :fields="signupFields" submit-label="회원가입" @submit="handleSignup" />
        <router-link to="/login" :class="styles.smallText">이미 회원이신가요?</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { Icon } from '@iconify/vue'
import InputForm from '@/components/common/inputs/InputForm.vue'
import Modal from '@/components/common/modals/Modal.vue'
import { signup } from '@/api/auth.api'
import type { FieldSpec, SignupUser } from '@/types/user'
import styles from '@/pages/user/user.module.css'

const router = useRouter()

const signupFields: FieldSpec<'userId' | 'password' | 'passwordConfirm'>[] = [
  {
    name: 'userId',
    label: 'ID',
    type: 'userId',
    placeholder: 'ID를 입력하세요.',
    autoComplete: 'userId',
    required: true,
    validate: (v) => {
      if (v.length === 0) {
        return '사용자 ID를 입력해주세요.'
      }
      if (v.length < 5) {
        return '사용자 ID는 5자 이상이어야 합니다.'
      }
      if (!/^[A-Za-z0-9]+$/.test(v)) {
        return '사용자 ID는 영문과 숫자만 사용할 수 있습니다.'
      }
      return null
    },
  },
  {
    name: 'password',
    label: '비밀번호',
    type: 'password',
    placeholder: '비밀번호를 입력하세요.',
    autoComplete: 'new-password',
    required: true,
    validate: (v) => {
      if (v.length === 0) {
        return '비밀번호를 입력해주세요.'
      }
      if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(v)) {
        return '비밀번호에 한글은 사용할 수 없습니다.'
      }
      if (v.length < 8) {
        return '비밀번호는 8자 이상이어야 합니다.'
      }
      if (!/[A-Za-z]/.test(v) || !/[0-9]/.test(v)) {
        return '비밀번호는 영문과 숫자를 모두 포함해야 합니다.'
      }
      return null
    },
  },
  {
    name: 'passwordConfirm',
    label: '비밀번호 확인',
    type: 'password',
    placeholder: '비밀번호를 다시 입력하세요.',
    autoComplete: 'new-password',
    required: true,
    validate: (v, allValues) => {
      if (v.length === 0) {
        return '비밀번호 확인을 입력해주세요.'
      }
      if (v !== allValues.password) {
        return '비밀번호가 일치하지 않습니다.'
      }
      return null
    },
  },
]

const isSuccessModalOpen = ref(false)
const isDuplicateIdModalOpen = ref(false)

async function handleSignup(values: Record<'userId' | 'password' | 'passwordConfirm', string>) {
  const signupPayload = {
    username: values.userId,
    password: values.password,
  }

  try {
    await signup(signupPayload)
    isSuccessModalOpen.value = true
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      isDuplicateIdModalOpen.value = true
      return
    }
    throw error
  }
}

function handleSuccessModalClose() {
  isSuccessModalOpen.value = false
  router.push('/login')
}
</script>
