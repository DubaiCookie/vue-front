<template>
  <nav :class="[styles.root, 'container']">
    <router-link
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      :class="styles.navItem"
      :aria-label="item.label"
    >
      <component :is="item.icon" :class="styles.navIcon" />
      <span :class="styles.navText">{{ item.text }}</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { IoTicket, IoList, IoPerson } from 'react-icons/io5'
import { GiRollerCoaster } from 'react-icons/gi'
import styles from '@/components/common/Navigation.module.css'

const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.userId !== null)

const navItems = computed(() => {
  const items = [
    {
      to: '/attraction',
      icon: GiRollerCoaster,
      label: '어트랙션 페이지로 이동',
      text: '어트랙션',
    },
  ]

  if (isLoggedIn.value) {
    items.push(
      {
        to: '/ticket',
        icon: IoTicket,
        label: '티켓 페이지로 이동',
        text: '티켓',
      },
      {
        to: '/waiting',
        icon: IoList,
        label: '대기열 페이지로 이동',
        text: '대기열',
      },
      {
        to: '/mypage',
        icon: IoPerson,
        label: '마이페이지로 이동',
        text: '마이페이지',
      }
    )
  }

  return items
})
</script>
