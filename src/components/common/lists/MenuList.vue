<template>
  <nav :class="[styles.menuList, className]" aria-label="my page menu">
    <MenuListItem
      v-for="(item, index) in items"
      :key="item.label"
      :label="item.label"
      :disabled="item.disabled"
      :show-divider="index < items.length - 1"
      @click="item.onClick"
    />
  </nav>
</template>

<script setup lang="ts">
import MenuListItem from './MenuListItem.vue'
import styles from './Menu.module.css'

export interface MenuActionItem {
  label: string
  onClick: () => void
  disabled?: boolean
}

interface Props {
  items: MenuActionItem[]
  className?: string
}

defineProps<Props>()
</script>
