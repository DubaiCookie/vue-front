import { defineStore } from "pinia";
import type { QueueAlert, QueueStatusItem } from "@/types/queue";

interface QueueState {
  liveQueueItems: QueueStatusItem[];
  queueAlert: QueueAlert | null;
}

export const useQueueStore = defineStore('queue', {
  state: (): QueueState => ({
    liveQueueItems: [],
    queueAlert: null,
  }),

  actions: {
    setLiveQueueItems(items: QueueStatusItem[]) {
      this.liveQueueItems = items;
    },

    setQueueAlert(alert: QueueAlert | null) {
      this.queueAlert = alert;
    },
  },
});
