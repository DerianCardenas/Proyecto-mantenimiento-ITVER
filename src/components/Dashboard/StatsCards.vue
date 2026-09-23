<script setup lang="ts">
import { computed } from 'vue'
import { useTicketsStore } from '@/stores/tickets'

const ticketsStore = useTicketsStore()

const stats = computed(() => ({
  total: ticketsStore.tickets.length,
  pending: ticketsStore.tickets.filter(t => t.status === 'open').length,
  resolved: ticketsStore.tickets.filter(t => t.status === 'resolved').length,
  thisMonth: ticketsStore.tickets.filter(t => {
    const d = new Date(ticket.createdAt)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
}))
</script>

<template>
  <div class="stats-cards">
    <div class="stat-card">
      <div class="stat-icon" style="background: #e3f2fd; color: var(--primary);">
        <span class="material-symbols-rounded">ticket</span>
      </div>
      <div class="stat-info">
        <span class="stat-value">{{ stats.total }}</span>
        <span class="stat-label">Total Tickets</span>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon" style="background: #fff3e0; color: var(--warning);">
        <span class="material-symbols-rounded">schedule</span>
      </div>
      <div class="stat-info">
        <span class="stat-value">{{ stats.pending }}</span>
        <span class="stat-label">Pendientes</span>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon" style="background: #e8f5e9; color: var(--success);">
        <span class="material-symbols-rounded">check_circle</span>
      </div>
      <div class="stat-info">
        <span class="stat-value">{{ stats.resolved }}</span>
        <span class="stat-label">Resueltos</span>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon" style="background: #e1f5fe; color: var(--info);">
        <span class="material-symbols-rounded">calendar_month</span>
      </div>
      <div class="stat-info">
        <span class="stat-value">{{ stats.thisMonth }}</span>
        <span class="stat-label">Este mes</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--spacing-md); }
.stat-card { background: var(--white); border-radius: var(--border-radius-md); padding: var(--spacing-lg); display: flex; align-items: center; gap: var(--spacing-md); box-shadow: var(--shadow-sm); }
.stat-icon { width: 56px; height: 56px; border-radius: var(--border-radius-md); display: flex; align-items: center; justify-content: center; }
.stat-icon .material-symbols-rounded { font-size: 28px; }
.stat-value { font-size: var(--font-size-2xl); font-weight: 700; display: block; }
.stat-label { font-size: var(--font-size-sm); color: var(--gray-600); }
</style>
