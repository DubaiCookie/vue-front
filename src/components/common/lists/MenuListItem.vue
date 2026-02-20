<template>
  <div :class="styles.menuItemWrap">
    <button
      type="button"
      :class="[styles.menuItem, { [styles.disabled]: disabled }]"
      :disabled="disabled"
      @click="$emit('click')"
    >
      {{ label }}
    </button>
    <div v-if="showDivider" :class="styles.menuDivider" />
  </div>
</template>

<script setup lang="ts">
import styles from './Menu.module.css'

interface Props {
  label: string
  disabled?: boolean
  showDivider?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  showDivider: false,
})

defineEmits<{
  click: []
}>()
</script>
