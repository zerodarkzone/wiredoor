import { useAuthStore } from '@/stores/auth'
import type { NavigationGuardNext } from 'vue-router'

export default async ({ next }: { next: NavigationGuardNext }) => {
  const authStore = useAuthStore()

  if (authStore.token) {
    return next({
      name: 'home',
    })
  }

  return next()
}
