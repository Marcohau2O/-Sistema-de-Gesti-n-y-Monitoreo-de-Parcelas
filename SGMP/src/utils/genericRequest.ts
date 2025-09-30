import axios from 'axios'
import { getToken } from './tokenStorage'

export const genericRequest = async (url: string, method: string, body?: any) => {
  try {
    const response = await axios({
      url: url,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
    })
    return response
  } catch (error) {
    console.error('Error in genericRequest:', error)
    throw error
  }
}

export const genericRequestAuth = async (url: string, method: string, body?: string) => {
  const token = getToken()

  if (!token) {
    throw new Error('No token found')
  }

  try {
    const response = await axios({
      url: url,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // ← correcto
      },
      data: body,
    })
    return response
  } catch (error) {
    console.error('Error in genericRequestAuth:', error)
    throw error
  }
}