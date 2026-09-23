<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from './BaseButton.vue'

const props = defineProps<{
  title?: string
  icon?: string
}>()

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>

<template>
  <div class="base-layout">
    <header class="layout-header">
      <div class="flex-between" style="padding: 0 24px; height: 64px; background: var(--primary); color: white;">
        <div class="flex-center gap-md">
          <span class="material-symbols-rounded" style="font-size: 28px;">building</span>
          <span class="text-xl" style="font-weight: 700;">{{ title || 'SGM-ITVER' }}</span>
        </div>
        <div class="flex-center gap-md">
          <span class="text-small">{{ authStore.user?.fullName }}</span>
          <span class="badge badge-info">{{ authStore.userRole }}</span>
          <BaseButton label="Cerrar sesión" icon="mdi-logout" severity="secondary" @click="handleLogout" />
        </div>
      </div>
    </header>

    <div class="layout-body">
      <aside class="layout-sidebar">
        <nav class="p-md">
          <div class="flex flex-column gap-sm">
            <RouterLink to="/" class="nav-item">
              <span class="material-symbols-rounded">dashboard</span>
              <span>Dashboard</span>
            </RouterLink>
            <RouterLink to="/tickets" class="nav-item">
              <span class="material-symbols-rounded">ticket</span>
              <span>Tickets</span>
            </RouterLink>
          </div>
        </nav>
      </aside>

      <main class="layout-main">
        <slot />
      </main>
    </div>

    <footer class="layout-footer">
      <div class="text-center text-small text-muted p-md">
        SGM-ITVER &copy; {{ new Date().getFullYear() }} - Sistema de Gestión de Mantenimiento ITVER
      </div>
    </footer>
  </div>
</template>

<style scoped>
.base-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.layout-header {
  background: var(--primary);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
}
.layout-body {
  display: flex;
  flex: 1;
}
.layout-sidebar {
  width: 240px;
  background: var(--white);
  border-right: 1px solid var(--gray-300);
  min-height: calc(100vh - 64px - 56px);
  position: sticky;
  top: 64px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--border-radius-sm);
  color: var(--gray-700);
  text-decoration: none;
  transition: all var(--transition-fast);
}
.nav-item:hover {
  background: var(--gray-100);
  text-decoration: none;
  color: var(--primary);
}
.nav-item.router-link-active {
  background: #e3f2fd;
  color: var(--primary);
  font-weight: 600;
}
.layout-main {
  flex: 1;
  padding: var(--spacing-lg);
  background: var(--light);
}
.layout-footer {
  border-top: 1px solid var(--gray-300);
  background: var(--white);
}
</style>
