<template>
  <article :class="styles.item">
    <header :class="styles.header">
      <div :class="styles.headerLeft">
        <span :class="styles.liveBadge">
          <span :class="styles.liveDot" />
          <span :class="styles.rideName">{{ item.rideName }}</span>
        </span>
      </div>
      <span
        :class="[
          styles.ticketTypeBadge,
          item.ticketType === 'PREMIUM' ? styles.ticketTypePremium : styles.ticketTypeBasic,
        ]"
      >
        {{ ticketTypeLabel }}
      </span>
    </header>

    <div :class="styles.summaryRow">
      <span :class="styles.summaryLabel">내 순서</span>
      <span :class="styles.summaryValue">{{ item.position }}번째</span>
      <span :class="styles.summaryDot">•</span>
      <span :class="styles.summaryLabel">예상 대기시간</span>
      <span :class="styles.summaryValue">{{ item.estimatedWaitMinutes }}분</span>
    </div>

    <div :class="styles.actionRow">
      <button type="button" :class="styles.cancelButton" @click="$emit('cancel', item)">
        취소
      </button>
      <button type="button" :class="styles.snoozeButton" @click="$emit('snooze', item)">
        미루기
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { QueueStatusItem } from '@/types/queue'
import styles from './Waiting.module.css'

interface Props {
  item: QueueStatusItem
}

const props = defineProps<Props>()

defineEmits<{
  cancel: [item: QueueStatusItem]
  snooze: [item: QueueStatusItem]
}>()

const ticketTypeLabel = computed(() => (props.item.ticketType === 'PREMIUM' ? 'Premium' : 'Basic'))
</script>
