
import CryptoJS from 'crypto-js'

const secretKey = import.meta.env.VITE_TOKEN_ENCRYPT_SIGNATURE

export function setToken(token: string) {
  const encrypted = CryptoJS.AES.encrypt(token, secretKey).toString()
  sessionStorage.setItem('token', encrypted)
}

export function getToken(): string {
  const encrypted = sessionStorage.getItem('token')
  if (!encrypted) return ''
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, secretKey)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch {
    return ''
  }
}

export function clearToken() {
  sessionStorage.removeItem('token')
}
