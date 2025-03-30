import Cookies from 'js-cookie'
import config from '@/utils/config'
import axios from '@/plugins/axios'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: Cookies.get('token'),
    redirect: localStorage.getItem('redirect') || '/',
  }),
  actions: {
    async login(username: string, password: string) {
      try {
        const { data } = await axios.post(`/api/auth/login`, {
          username,
          password,
        })

        Cookies.set('token', data.token, {
          secure: config.app.env === 'production',
          sameSite: 'Strict',
          expires: data.expires_in,
        })

        this.token = data.token
      } catch (e) {
        throw e
      }
    },
    async setRedirect(to: string) {
      localStorage.setItem('redirect', to)
      this.redirect = to;
    },
    async logout() {
      this.setRedirect(window.location.pathname);
      try {
        this.token = undefined
        Cookies.remove('token')
        const router = useRouter()
        await router.push({ name: 'login' })
      } catch (e) {
        console.error(e);
        window.location.href = '/login';
      }
    },
  },
})
