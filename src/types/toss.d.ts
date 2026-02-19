export interface TossPaymentRequestOptions {
  amount: number
  orderId: string
  orderName: string
  successUrl: string
  failUrl: string
  customerName?: string
  windowTarget?: 'iframe' | 'self'
  card?: {
    flowMode?: 'DEFAULT' | 'DIRECT'
  }
}

export interface TossPayments {
  requestPayment(method: 'CARD' | 'VIRTUAL_ACCOUNT' | 'TRANSFER', options: TossPaymentRequestOptions): Promise<void>
}

declare global {
  interface Window {
    TossPayments?: (clientKey: string) => TossPayments
  }
}
