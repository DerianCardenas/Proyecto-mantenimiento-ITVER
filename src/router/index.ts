import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const LoginView = () => import('@/views/LoginView.vue')
const DashboardView = () => import('@/views/DashboardView.vue')
const TicketsView = () => import('@/views/TicketsView.vue')
const TicketDetailView = () => import('@/views/TicketDetailView.vue')
const TicketFormView = () => import('@/views/TicketFormView.vue')
const TechniciansView = () => import('@/views/TechniciansView.vue')
const ChangePasswordView = () => import('@/views/ChangePasswordView.vue')
const NotFoundView = () => import('@/views/NotFoundView.vue')

const routes = [
  { path: '/login', name: 'Login', component: LoginView, meta: { requiresAuth: false } },
  { path: '/register', redirect: { name: 'Login' } },
  { path: '/change-password', name: 'ChangePassword', component: ChangePasswordView, meta: { requiresAuth: true } },
  { path: '/', name: 'Dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/technicians', name: 'Technicians', component: TechniciansView, meta: { requiresAuth: true, adminOnly: true } },
  { path: '/tickets', name: 'Tickets', component: TicketsView, meta: { requiresAuth: true } },
  { path: '/tickets/:id', name: 'TicketDetail', component: TicketDetailView, meta: { requiresAuth: true } },
  { path: '/tickets/new', name: 'TicketNew', component: TicketFormView, meta: { requiresAuth: true } },
  { path: '/tickets/:id/edit', name: 'TicketEdit', component: TicketFormView, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  await authStore.loadUser()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) return { name: 'Login', query: { redirect: to.fullPath } }
  if (authStore.isAuthenticated && authStore.user?.mustChangePassword && to.name !== 'ChangePassword') return { name: 'ChangePassword' }
  if (to.name === 'ChangePassword' && !authStore.user?.mustChangePassword) return { name: 'Dashboard' }
  if (to.meta.adminOnly && !authStore.isAdmin) return { name: 'Dashboard' }
  if (to.name === 'Login' && authStore.isAuthenticated) return { name: authStore.user?.mustChangePassword ? 'ChangePassword' : 'Dashboard' }
  return true
})

export default router
