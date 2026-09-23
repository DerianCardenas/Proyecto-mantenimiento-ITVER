import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const LoginView = () => import('@/views/LoginView.vue')
const RegisterView = () => import('@/views/RegisterView.vue')
const DashboardView = () => import('@/views/DashboardView.vue')
const TicketsView = () => import('@/views/TicketsView.vue')
const TicketDetailView = () => import('@/views/TicketDetailView.vue')
const TicketFormView = () => import('@/views/TicketFormView.vue')
const NotFoundView = () => import('@/views/NotFoundView.vue')

const routes = [
  { path: '/login', name: 'Login', component: LoginView, meta: { requiresAuth: false } },
  { path: '/register', name: 'Register', component: RegisterView, meta: { requiresAuth: false } },
  { path: '/', name: 'Dashboard', component: DashboardView, meta: { requiresAuth: true } },
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

router.beforeEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth
  const isAuthenticated = authStore.isAuthenticated

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } else if (to.name === 'Login' && isAuthenticated) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
