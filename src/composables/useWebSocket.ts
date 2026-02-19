import { onMounted, onUnmounted } from 'vue'
import { subscribeRidesMinutes, subscribeRideInfo, subscribeUserQueueStatus } from '@/api/ws'
import type { RideInfoSocketMessage, RidesMinutesSocketMessage } from '@/types/attraction'
import type { UserQueueSocketMessage } from '@/types/queue'

export function useRidesMinutesSubscription(callback: (payload: RidesMinutesSocketMessage) => void) {
  let unsubscribe: (() => void) | null = null

  onMounted(() => {
    unsubscribe = subscribeRidesMinutes(callback)
  })

  onUnmounted(() => {
    unsubscribe?.()
  })
}

export function useRideInfoSubscription(rideId: number, callback: (payload: RideInfoSocketMessage) => void) {
  let unsubscribe: (() => void) | null = null

  onMounted(() => {
    unsubscribe = subscribeRideInfo(rideId, callback)
  })

  onUnmounted(() => {
    unsubscribe?.()
  })
}

export function useUserQueueStatusSubscription(userId: number, callback: (payload: UserQueueSocketMessage) => void) {
  let unsubscribe: (() => void) | null = null

  onMounted(() => {
    if (!userId) return
    unsubscribe = subscribeUserQueueStatus(userId, callback)
  })

  onUnmounted(() => {
    unsubscribe?.()
  })
}
