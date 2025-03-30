import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// const agent = new https.Agent({
//   rejectUnauthorized: false,
// })

axios.interceptors.request.use(
  (requestConfig) => {
    const auth = useAuthStore()

    requestConfig.withCredentials = true

    if (auth.token) {
      requestConfig.headers['Authorization'] = `Bearer ${auth.token}`
    }

    console.log(requestConfig)

    return requestConfig
  },
  (error) => {
    return Promise.reject(error)
  },
)

axios.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    if (!error.response) {
      return Promise.reject(error)
    }

    const { status } = error.response

    if ([401, 403, 429].includes(status)) {
      console.log('Logging out by API response')
      const auth = useAuthStore()

      await auth.logout()
      console.log('Logged out by API response')
    }

    return Promise.reject(error)
  },
)

export default axios
