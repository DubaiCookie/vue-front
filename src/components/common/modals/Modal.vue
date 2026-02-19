<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" :class="styles.overlay" @click="handleOverlayClick">
        <div :class="styles.modal" role="dialog" aria-modal="true">
          <h2 :class="styles.title">{{ title }}</h2>
          <p :class="styles.content">{{ content }}</p>
          <div :class="styles.buttonGroup">
            <button
              type="button"
              :class="[styles.button, styles.primaryButton]"
              @click="emit('buttonClick')"
            >
              {{ buttonTitle }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import styles from '@/components/common/modals/Modal.module.css'

interface Props {
  isOpen: boolean
  title: string
  content: string
  buttonTitle: string
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  buttonClick: []
}>()

function handleOverlayClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
