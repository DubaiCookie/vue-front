<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import clsx from 'clsx'
import styles from '@/components/common/Button.module.css'

interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'medium',
  disabled: false,
  fullWidth: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() =>
  clsx(
    styles.button,
    styles[props.variant],
    styles[props.size],
    {
      [styles.fullWidth]: props.fullWidth,
      [styles.disabled]: props.disabled,
    }
  )
)
</script>
