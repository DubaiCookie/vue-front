<template>
  <section :class="styles.contentCard">
    <header :class="styles.header">
      <div>
        <p :class="styles.subTitle">{{ attraction.shortDescription }}</p>
        <h1 :class="styles.title">{{ attraction.name }}</h1>
      </div>
      <span
        :class="[styles.statusBadge, attraction.isActive ? styles.active : styles.inactive]"
      >
        {{ attraction.isActive ? '운영중' : '운영종료' }}
      </span>
    </header>

    <div :class="styles.metaGrid">
      <AttractionMetaItem label="운영시간" :value="attraction.operatingTime" />
      <AttractionMetaItem label="탑승시간" :value="`${ridingMinutes}분`" />
    </div>

    <section :class="styles.waitingSection">
      <h2 :class="styles.sectionTitle">현재 대기 현황</h2>
      <div :class="styles.waitingGrid">
        <AttractionWaitingCard
          type-label="Premium"
          :minutes="premiumWaitingMinutes"
          :waiting-count="premiumWaitingCount"
        />
        <AttractionWaitingCard
          type-label="Basic"
          :minutes="generalWaitingMinutes"
          :waiting-count="generalWaitingCount"
        />
      </div>
    </section>

    <section>
      <h2 :class="styles.sectionTitle">상세 안내</h2>
      <p :class="styles.longDescription">{{ attraction.longDescription }}</p>
    </section>
  </section>
</template>

<script setup lang="ts">
import type { AttractionDetail } from '@/types/attraction'
import AttractionMetaItem from './AttractionMetaItem.vue'
import AttractionWaitingCard from './AttractionWaitingCard.vue'
import styles from './AttractionContentCard.module.css'

interface Props {
  attraction: AttractionDetail
  ridingMinutes: number
  premiumWaitingMinutes: number
  premiumWaitingCount: number
  generalWaitingMinutes: number
  generalWaitingCount: number
}

defineProps<Props>()
</script>
