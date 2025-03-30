import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/plugins/axios'

export interface ServerConfig {
  VPN_HOST: string
  TCP_SERVICES_PORT_RANGE: string
}

export const useConfigStore = defineStore('config', () => {
  const config = ref<ServerConfig>()
  const lastFetched = ref(0)
  const expirationTime = 3600000

  const isExpired = () => {
    const currentTime = new Date().getTime()
    return currentTime - lastFetched.value > expirationTime
  }

  const loadConfig = async () => {
    const cache = localStorage.getItem('config')

    if (cache && !isExpired()) {
      const cachedConfig = JSON.parse(cache)
      config.value = cachedConfig.config
      lastFetched.value = cachedConfig.lastFetched
      return
    }

    try {
      const response = await axios.get('/api/config')
      config.value = response.data

      lastFetched.value = new Date().getTime()

      localStorage.setItem(
        'config',
        JSON.stringify({
          config: config.value,
          lastFetched: lastFetched.value,
        }),
      )
    } catch (error) {
      console.error(error)
    }
  }

  return { config, loadConfig }
})
