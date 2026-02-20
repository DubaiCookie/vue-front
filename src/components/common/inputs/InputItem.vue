<template>
  <label :class="styles.field">
    <span :class="styles.label">{{ field.label }}</span>
    <input
      :type="inputType"
      :value="modelValue"
      :placeholder="field.placeholder"
      :autocomplete="field.autoComplete"
      :required="field.required"
      :class="styles.input"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <small v-if="error" :class="styles.error">{{ error }}</small>
  </label>
</template>

<script setup lang="ts" generic="TName extends string">
import { computed } from 'vue'
import type { FieldSpec } from '@/types/user'
import styles from './Input.module.css'

interface Props {
  field: FieldSpec<TName>
  modelValue: string
  error?: string
}

const props = defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputType = computed(() => {
  if (props.field.type === 'password') {
    return 'password'
  }
  return 'text'
})
</script>
