<template>
  <div :class="[styles.root, 'flex-column']">
    <LoadingSpinner :is-loading="isSubmitting" />
    <form :class="styles.form" @submit.prevent="handleSubmit">
      <InputItem
        v-for="field in fields"
        :key="field.name"
        :field="field"
        v-model="values[field.name]"
        :error="errors[field.name]"
        @update:model-value="clearError(field.name)"
      />
      <Button
        type="submit"
        :disabled="isSubmitting"
        :title="isSubmitting ? '처리 중...' : submitLabel"
      />
    </form>
  </div>
</template>

<script setup lang="ts" generic="TName extends string">
import { ref, computed } from 'vue'
import type { FieldSpec } from '@/types/user'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import InputItem from './InputItem.vue'
import styles from './Input.module.css'

interface Props {
  fields: FieldSpec<TName>[]
  submitLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  submitLabel: '제출',
})

const emit = defineEmits<{
  submit: [values: Record<TName, string>]
}>()

const initialValues = computed(() => {
  return props.fields.reduce(
    (acc, field) => {
      acc[field.name] = ''
      return acc
    },
    {} as Record<TName, string>,
  )
})

const values = ref<Record<TName, string>>(initialValues.value)
const errors = ref<Partial<Record<TName, string>>>({})
const isSubmitting = ref(false)

const clearError = (fieldName: TName) => {
  errors.value[fieldName] = undefined
}

const handleSubmit = async () => {
  const nextErrors: Partial<Record<TName, string>> = {}

  for (const field of props.fields) {
    const value = values.value[field.name]
    const validationMessage = field.validate?.(value, values.value)
    if (validationMessage) {
      nextErrors[field.name] = validationMessage
    }
  }

  errors.value = nextErrors
  if (Object.keys(nextErrors).length > 0) {
    return
  }

  try {
    isSubmitting.value = true
    emit('submit', values.value)
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
