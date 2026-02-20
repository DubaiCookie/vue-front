<template>
  <article :class="styles.ticketFlip" @click="handleCardClick">
    <div :class="[styles.ticketInner, { [styles.flipped]: isFlipped }]">
      <!-- Front -->
      <div
        :class="[
          styles.ticket,
          styles.ticketFace,
          styles.ticketFront,
          isPremium ? styles.premium : styles.basic,
        ]"
      >
        <div :class="styles.gloss" />
        <div :class="styles.ticketReflection" />
        <div :class="styles.ticketPattern" />
        <div :class="[styles.edgeCut, styles.edgeCutLeft]" />
        <div :class="[styles.edgeCut, styles.edgeCutRight]" />
        <div :class="styles.perforation">
          <span :class="styles.perforationDot" />
          <span :class="styles.perforationDot" />
        </div>
        <div v-if="isActive" :class="styles.entryStamp">입장완료</div>

        <header :class="styles.header">
          <p :class="styles.ticketType">
            <span :class="styles.brandName">SKALAND</span>
            <span
              :class="[styles.typeName, isPremium ? styles.typePremium : styles.typeGeneral]"
            >
              {{ isPremium ? 'Premium' : 'Basic' }}
            </span>
          </p>
          <span
            v-if="headerStatusLabel"
            :class="[
              styles.statusBadge,
              isAvailableToday ? styles.statusToday : styles.statusBefore,
            ]"
          >
            {{ headerStatusLabel }}
          </span>
        </header>

        <div :class="styles.row">
          <span :class="styles.label">구매 날짜</span>
          <span :class="styles.value">{{ formatDateTime(ticket.paymentDate) }}</span>
        </div>
        <div :class="[styles.row, styles.availableRow]">
          <span :class="styles.label">사용 가능 날짜</span>
          <span :class="styles.value">{{ formatDateTime(ticket.availableAt) }}</span>
        </div>
      </div>

      <!-- Back -->
      <div
        :class="[
          styles.ticket,
          styles.ticketFace,
          styles.ticketBack,
          isPremium ? styles.premium : styles.basic,
        ]"
      >
        <template v-if="isAvailableToday">
          <p :class="styles.backTitle">입장 QR</p>
          <button
            type="button"
            :class="styles.qrButton"
            @click.stop="$emit('qr-click', ticket)"
          >
            <img src="/ticket-qr.png" alt="티켓 QR" :class="styles.qrImage" />
          </button>
        </template>
        <p v-else :class="styles.qrNotice">입장 날짜에 QR 코드가 생성됩니다.</p>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { UserTicket } from '@/types/ticket'
import { formatDateTime, isSameLocalDate } from '@/utils/functions'
import styles from './Ticket.module.css'

interface Props {
  ticket: UserTicket
}

const props = defineProps<Props>()

defineEmits<{
  'qr-click': [ticket: UserTicket]
}>()

const isFlipped = ref(false)
const today = new Date()
const isAvailableToday = computed(() =>
  isSameLocalDate(new Date(props.ticket.availableAt), today),
)
const isPremium = computed(() => props.ticket.ticketType === 'PREMIUM')
const isActive = computed(() => props.ticket.activeStatus === 'ACTIVE')

const headerStatusLabel = computed(() => {
  if (isAvailableToday.value) return 'Today'
  if (isActive.value) return null
  return '입장 전'
})

const handleCardClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (target.closest('button')) {
    return
  }
  isFlipped.value = !isFlipped.value
}
</script>
