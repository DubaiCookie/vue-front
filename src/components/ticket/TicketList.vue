<template>
  <div :class="styles.ticketList">
    <TicketListItem
      v-for="(ticket, index) in tickets"
      :key="
        ticket.ticketOrderId
          ? `ticket-${ticket.ticketOrderId}`
          : `ticket-fallback-${ticket.availableAt}-${index}`
      "
      :ticket="ticket"
      @qr-click="$emit('qr-click', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { UserTicket } from '@/types/ticket'
import TicketListItem from './TicketListItem.vue'
import styles from './Ticket.module.css'

interface Props {
  tickets: UserTicket[]
}

defineProps<Props>()

defineEmits<{
  'qr-click': [ticket: UserTicket]
}>()
</script>
