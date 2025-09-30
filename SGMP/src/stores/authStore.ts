import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { LoginService, RegisterService, LogoutService } from '@/services/authService'
import router from '@/router'
import type { User } from '@/interfaces/User'
import { setToken as saveTokenToStorage, getToken, clearToken } from '@/utils/tokenStorage'

export const useAuthStore = defineStore('auth', () => {
  const user = ref({} as User)
  const token = ref(getToken())
  const isLoggedIn = computed(() => token.value !== '' && token.value !== undefined)

  async function login(email: string, password: string) {
    try {
      const response = await LoginService(email, password)
      if (response?.status === 200) {
        user.value = response.data.user
        console.log("datos",user.value)
        token.value = response.data.token
        saveTokenToStorage(response.data.token)
        router.push('/')
      }
      console.log('no funciono')
    } catch (error) {
      console.error('Error in login:', error)
    }
  }

  async function register(
    name: string,
    email: string,
    password: string,
  ) {
    try {
      const response = await RegisterService(
        name,
        email,
        password,
      )
      if (response?.status === 200) {
        user.value = response.data
        const login = await LoginService(email, password)
        if (login?.status === 200) {
          router.push('/')
          console.log('redireccion')
        }
      }
    } catch (error) {
      console.error('Error in register:', error)
    }
  }

  watch(token, (newValue) => {
    if (newValue === '' || newValue === undefined) {
      logout()
      router.push('/')
    }
  })

  async function logout() {
    try {
      const response = await LogoutService()
      if (response?.status === 200) {
        user.value = {} as User
        console.log(user)
        clearToken()
        router.push('/')
      }
    } catch (error) {
      console.error('Error in logout:', error)
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    login,
    register,
    logout,
  }
})