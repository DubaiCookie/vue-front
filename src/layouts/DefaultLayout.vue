<template>
  <div>
    <Header />
    <main>
      <RouterView />
    </main>
    <Navigation />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/common/Header.vue'
import Navigation from '@/components/common/Navigation.vue'
</script>
