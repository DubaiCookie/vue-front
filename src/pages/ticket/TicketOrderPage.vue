<template>
  <div :class="['container', styles.pageRoot]">
    <Modal
      :is-open="Boolean(errorMessage)"
      title="결제 오류"
      :content="errorMessage ?? ''"
      button-title="확인"
      @close="errorMessage = null"
      @button-click="errorMessage = null"
    />
    <Modal
      :is-open="isQuantityLimitModalOpen"
      title="수량 안내"
      content="티켓은 인당 1일 1매만 구매 가능합니다."
      button-title="확인"
      @close="isQuantityLimitModalOpen = false"
      @button-click="isQuantityLimitModalOpen = false"
    />
    <div class="page-title">
      <div :class="['glass', 'title-icon-container']">
        <Icon icon="material-symbols:payment-outline" class="title-icon" />
      </div>
      <span>Ticket Order</span>
    </div>
    <h3 :class="['font-h3', ticketTypeStyles.title]">날짜 선택</h3>
    <Calendar
      :unavailable-dates="unavailableDates"
      @date-select="selectedDate = $event"
    />
    <TicketTypeList
      :selected-type="selectedTicketType"
      @select-type="selectedTicketType = $event"
    />
    <section :class="styles.quantitySection">
      <h3 :class="['font-h3', ticketTypeStyles.title]">수량 선택</h3>
      <div :class="styles.quantityCard">
        <button
          type="button"
          :class="styles.quantityButton"
          @click="isQuantityLimitModalOpen = true"
        >
          -
        </button>
        <span :class="styles.quantityValue">{{ ticketQuantity }}</span>
        <button
          type="button"
          :class="styles.quantityButton"
          @click="isQuantityLimitModalOpen = true"
        >
          +
        </button>
      </div>
    </section>
    <div :class="styles.bottomSpacer" />
    <div class="button-bottom">
      <Button
        :title="isSubmitting ? '결제 준비 중...' : '결제하기'"
        :className="styles.payButton"
        :disabled="!selectedDate || !selectedTicketType || isSubmitting || !authStore.userId"
        @click="handlePayClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import Calendar from '@/components/common/Calendar.vue'
import TicketTypeList from '@/components/ticket/TicketTypeList.vue'
import type { TicketKind } from '@/types/ticket'
import Button from '@/components/common/Button.vue'
import { useAuthStore } from '@/stores/auth'
import { preparePayment } from '@/api/payment.api'
import styles from '@/pages/ticket/TicketOrderPage.module.css'
import ticketTypeStyles from '@/components/ticket/TicketType.module.css'
import Modal from '@/components/common/modals/Modal.vue'
import { env } from '@/utils/env'

const authStore = useAuthStore()
const selectedDate = ref<string | null>(null)
const selectedTicketType = ref<TicketKind | null>(null)
const ticketQuantity = 1
const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)
const isQuantityLimitModalOpen = ref(false)
const unavailableDates: string[] = []

const loadTossScript = async () => {
  if (window.TossPayments) {
    return window.TossPayments
  }

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-toss-sdk="true"]')
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true })
      existingScript.addEventListener("error", () => reject(new Error("Toss SDK 로드에 실패했습니다.")), { once: true })
      return
    }

    const script = document.createElement("script")
    script.src = "https://js.tosspayments.com/v1/payment"
    script.async = true
    script.dataset.tossSdk = "true"
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Toss SDK 로드에 실패했습니다."))
    document.body.appendChild(script)
  })

  if (!window.TossPayments) {
    throw new Error("Toss SDK 초기화에 실패했습니다.")
  }

  return window.TossPayments
}

const handlePayClick = async () => {
  if (!authStore.userId || !selectedDate.value || !selectedTicketType.value) {
    return
  }

  const tossClientKey = env.TOSS_CLIENT_KEY
  if (!tossClientKey) {
    errorMessage.value = "VITE_TOSS_CLIENT_KEY 설정이 필요합니다."
    return
  }

  try {
    isSubmitting.value = true
    const prepared = await preparePayment({
      userId: authStore.userId,
      ticketType: selectedTicketType.value,
      availableDate: selectedDate.value,
      ticketQuantity,
    })

    const amount = Number(prepared.amount)
    const backendOrderId = Number(prepared.orderId)
    const orderName = String(prepared.orderName ?? "").trim()
    const tossOrderId = `ORDER-${backendOrderId}`
    const finalAmount = amount

    if (!Number.isFinite(finalAmount) || finalAmount <= 0) {
      throw new Error(`유효하지 않은 결제 금액입니다. amount=${prepared.amount}`)
    }
    if (!Number.isFinite(backendOrderId) || backendOrderId <= 0) {
      throw new Error(`유효하지 않은 주문 번호입니다. orderId=${prepared.orderId}`)
    }
    if (!orderName) {
      throw new Error("유효하지 않은 주문명입니다.")
    }
    if (!/^[A-Za-z0-9_-]{6,64}$/.test(tossOrderId)) {
      throw new Error(`토스 주문번호 형식이 올바르지 않습니다. tossOrderId=${tossOrderId}`)
    }

    const TossPayments = await loadTossScript()
    const tossPayments = TossPayments(tossClientKey)
    const baseUrl = env.APP_BASE_URL || window.location.origin
    const successUrl = `${baseUrl}/ticket/order/success?backendOrderId=${backendOrderId}`
    const failUrl = `${baseUrl}/ticket/order/fail?backendOrderId=${backendOrderId}`

    sessionStorage.setItem(
      "pending-payment",
      JSON.stringify({
        orderId: backendOrderId,
        amount: finalAmount,
        tossOrderId,
      }),
    )

    await tossPayments.requestPayment("CARD", {
      amount: finalAmount,
      orderId: tossOrderId,
      orderName,
      successUrl,
      failUrl,
      customerName: authStore.username ?? undefined,
      windowTarget: "iframe",
      card: {
        flowMode: "DEFAULT",
      },
    })
  } catch (error) {
    console.error(error)
    if (error instanceof Error && error.message) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = "결제 준비 중 오류가 발생했습니다."
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
