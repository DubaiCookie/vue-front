<template>
  <section :class="[styles.calendar, className]">
    <div :class="styles.monthHeader">
      <button
        type="button"
        :class="styles.monthButton"
        :disabled="monthIndex === 0"
        @click="monthIndex = Math.max(monthIndex - 1, 0)"
      >
        이전
      </button>
      <p :class="styles.monthLabel">{{ monthLabel }}</p>
      <button
        type="button"
        :class="styles.monthButton"
        :disabled="monthIndex === monthPages.length - 1"
        @click="monthIndex = Math.min(monthIndex + 1, monthPages.length - 1)"
      >
        다음
      </button>
    </div>
    <div :class="styles.weekdayRow">
      <span
        v-for="label in WEEKDAY_LABELS"
        :key="label"
        :class="styles.weekdayLabel"
      >
        {{ label }}
      </span>
    </div>
    <div :class="styles.grid">
      <template v-for="(cell, index) in cells" :key="cell.type === 'empty' ? `empty-${index}` : cell.key">
        <div v-if="cell.type === 'empty'" :class="styles.emptyCell" />
        <button
          v-else
          type="button"
          :disabled="cell.disabled"
          :class="[
            styles.dateButton,
            selectedDateKey === cell.key && styles.selected,
            cell.disabled && styles.unavailable,
          ]"
          @click="handleDateClick(cell)"
        >
          <span :class="styles.day">{{ cell.labelDay }}</span>
        </button>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, useMemo } from 'vue'
import styles from '@/components/common/Calendar.module.css'

type CalendarDateInput = string | Date

interface Props {
  unavailableDates?: CalendarDateInput[]
  className?: string
  initialSelectedDate?: CalendarDateInput
}

const props = withDefaults(defineProps<Props>(), {
  unavailableDates: () => [],
})

const emit = defineEmits<{
  dateSelect: [date: string]
}>()

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"]

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function normalizeToDateKey(input: CalendarDateInput) {
  if (input instanceof Date) {
    return toDateKey(input)
  }
  return input.slice(0, 10)
}

function normalizeStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function normalizeStartOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

function addMonths(base: Date, months: number) {
  return new Date(base.getFullYear(), base.getMonth() + months, 1)
}

const today = useMemo(() => normalizeStartOfDay(new Date()))
const maxDate = useMemo(() => {
  const date = new Date(today)
  date.setDate(today.getDate() + 30)
  return date
})

const unavailableDateSet = computed(() => {
  return new Set(props.unavailableDates.map((item) => normalizeToDateKey(item)))
})

const selectedDateKey = ref<string | null>(
  props.initialSelectedDate ? normalizeToDateKey(props.initialSelectedDate) : null
)

const monthPages = useMemo(() => {
  const startMonth = normalizeStartOfMonth(today)
  const endMonth = normalizeStartOfMonth(maxDate)

  const pages: Date[] = [startMonth]
  let cursor = startMonth
  while (!isSameMonth(cursor, endMonth)) {
    cursor = addMonths(cursor, 1)
    pages.push(cursor)
  }
  return pages
})

const monthIndex = ref(0)
const currentMonth = computed(() => monthPages[monthIndex.value] ?? monthPages[0])

const monthLabel = computed(() => {
  if (!currentMonth.value) {
    return ""
  }
  return `${currentMonth.value.getFullYear()}년 ${String(currentMonth.value.getMonth() + 1).padStart(2, "0")}월`
})

const cells = computed(() => {
  if (!currentMonth.value) {
    return []
  }

  const firstDay = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), 1)
  const lastDay = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 0)
  const leadingEmptyCount = firstDay.getDay()
  const trailingEmptyCount = 6 - lastDay.getDay()

  const nextCells: Array<{ type: "empty" } | { type: "date"; key: string; labelDay: string; disabled: boolean }> = []

  for (let i = 0; i < leadingEmptyCount; i += 1) {
    nextCells.push({ type: "empty" })
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const date = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), day)
    const key = toDateKey(date)
    const outOfRange = date < today || date > maxDate
    const disabled = outOfRange || unavailableDateSet.value.has(key)

    nextCells.push({
      type: "date",
      key,
      labelDay: String(day),
      disabled,
    })
  }

  for (let i = 0; i < trailingEmptyCount; i += 1) {
    nextCells.push({ type: "empty" })
  }

  return nextCells
})

function handleDateClick(cell: { type: "date"; key: string; labelDay: string; disabled: boolean }) {
  if (cell.disabled) {
    return
  }
  selectedDateKey.value = cell.key
  emit('dateSelect', cell.key)
}
</script>
