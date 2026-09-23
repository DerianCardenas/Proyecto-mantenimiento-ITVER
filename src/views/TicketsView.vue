<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTicketsStore } from '@/stores/tickets'
import BaseLayout from '@/components/common/BaseLayout.vue'
import TicketList from '@/components/Tickets/TicketList.vue'
import { useTicketService } from '@/services/ticket.service'

const ticketsStore = useTicketsStore()
const { getBuildings } = useTicketService()

const buildings = ref<any[]>([])

onMounted(async () => {
  await ticketsStore.loadTickets()
  buildings.value = await getBuildings()
})
</script>

<template>
  <BaseLayout>
    <TicketList />
  </BaseLayout>
</template>
