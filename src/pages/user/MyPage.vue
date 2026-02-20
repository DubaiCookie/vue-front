<template>
  <div class="container">
    <Modal
      :is-open="isPreparingModalOpen"
      title="준비중"
      :content="`${selectedMenuLabel} 기능은 준비중입니다.`"
      button-title="확인"
      @close="closePreparingModal"
      @button-click="closePreparingModal"
    />
    <div class="page-title">
      <div class="glass title-icon-container">
        <Icon icon="ion:person-circle" class="title-icon" />
      </div>
      <span>My Page</span>
    </div>
    <MenuList :items="menuItems" />
    <LoadingSpinner :is-loading="isSubmitting" message="로그아웃 처리 중입니다..." />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { logout as logoutApi } from '@/api/auth.api'
import { useAuthStore } from '@/stores/auth'
import MenuList from '@/components/common/lists/MenuList.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Modal from '@/components/common/modals/Modal.vue'

const router = useRouter()
const authStore = useAuthStore()

const isSubmitting = ref(false)
const isPreparingModalOpen = ref(false)
const selectedMenuLabel = ref('')

async function handleLogout() {
  try {
    isSubmitting.value = true
    await logoutApi()
  } catch (error) {
    console.error(error)
  } finally {
    authStore.logout()
    isSubmitting.value = false
    router.replace('/attraction')
  }
}

function openPreparingModal(label: string) {
  selectedMenuLabel.value = label
  isPreparingModalOpen.value = true
}

function closePreparingModal() {
  isPreparingModalOpen.value = false
  selectedMenuLabel.value = ''
}

const menuItems = [
  {
    label: '결제 내역',
    onClick: () => openPreparingModal('결제 내역'),
    disabled: isSubmitting.value,
  },
  {
    label: '티켓 사용 내역',
    onClick: () => openPreparingModal('티켓 사용 내역'),
    disabled: isSubmitting.value,
  },
  {
    label: '결제 수단 관리',
    onClick: () => openPreparingModal('결제 수단 관리'),
    disabled: isSubmitting.value,
  },
  {
    label: '알림 설정',
    onClick: () => openPreparingModal('알림 설정'),
    disabled: isSubmitting.value,
  },
  {
    label: '공지사항',
    onClick: () => openPreparingModal('공지사항'),
    disabled: isSubmitting.value,
  },
  {
    label: '자주 묻는 질문',
    onClick: () => openPreparingModal('자주 묻는 질문'),
    disabled: isSubmitting.value,
  },
  {
    label: '로그아웃',
    onClick: handleLogout,
    disabled: isSubmitting.value,
  },
  {
    label: '회원 탈퇴',
    onClick: () => openPreparingModal('회원 탈퇴'),
    disabled: isSubmitting.value,
  },
]
</script>
