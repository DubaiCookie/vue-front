<template>
  <Modal
    :is-open="isLoginRequiredModalOpen"
    title="로그인이 필요합니다"
    content="해당 메뉴를 이용하려면 먼저 로그인해주세요."
    button-title="로그인 하러가기"
    @close="isLoginRequiredModalOpen = false"
    @button-click="handleLoginModalConfirm"
  />
  <Teleport to="body">
    <nav :class="styles.root">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :class="styles.navItem"
        :aria-label="item.label"
        @click="handleNavClick($event, item)"
      >
        <Icon :icon="item.icon" :class="styles.navIcon" />
        <span :class="styles.navText">{{ item.text }}</span>
      </router-link>
    </nav>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import Modal from '@/components/common/modals/Modal.vue'
import { useAuthStore } from '@/stores/auth'
import styles from '@/components/common/Navigation.module.css'

interface NavItem {
  to: string
  icon: string
  label: string
  text: string
  requiresAuth?: boolean
}

const router = useRouter()
const authStore = useAuthStore()
const isLoginRequiredModalOpen = ref(false)

const navItems = computed(() => {
  return [
    {
      to: '/attraction',
      icon: 'mdi:ferris-wheel',
      label: '어트랙션 페이지로 이동',
      text: '어트랙션',
    },
    {
      to: '/ticket',
      icon: 'ion:ticket',
      label: '티켓 페이지로 이동',
      text: '티켓',
      requiresAuth: true,
    },
    {
      to: '/waiting',
      icon: 'ion:hourglass-outline',
      label: '라이드 페이지로 이동',
      text: '라이드',
      requiresAuth: true,
    },
    {
      to: '/mypage',
      icon: 'ion:person',
      label: '마이페이지로 이동',
      text: '마이페이지',
      requiresAuth: true,
    },
  ] satisfies NavItem[]
})

function handleNavClick(event: MouseEvent, item: NavItem) {
  if (!item.requiresAuth || authStore.userId !== null) {
    return
  }

  event.preventDefault()
  isLoginRequiredModalOpen.value = true
}

function handleLoginModalConfirm() {
  isLoginRequiredModalOpen.value = false
  router.push('/login')
}
</script>
