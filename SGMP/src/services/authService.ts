import { genericRequest, genericRequestAuth } from '@/utils/genericRequest'

const endpoints = import.meta.env.VITE_ENDPOINT_API.split(',')
const base_url = endpoints[0]


const handleError = async (error: any, context: string) => {
  const errorMessage = `Error during ${context}: ${error.message}`
  console.error(errorMessage)

  const errorDetails = {
    response: error.response
      ? {
          data: error.response.data,
          status: error.response.status,
          headers: error.response.headers,
        }
      : null,
    request: error.request || null,
    message: error.message,
  }

  await console.error('error', errorMessage, errorDetails)
  throw error
}

export const LoginService = async (email: string, password: string) => {
  try {
    const result = await genericRequest(`${base_url}/api/login`, 'POST',  {email, password})
    console.log("🔑 Enviando credenciales:", { email, password })
    return result
  } catch (error) {
    await handleError(error, 'LoginService')
  }
}

export const RegisterService = async (
  name: string,
  email: string,
  password: string,
) => {
  try {
    const result = await genericRequest(`${base_url}/api/register`, 'POST', {
      name,
      email,
      password,
    })
    return result
  } catch (error) {
    await handleError(error, 'RegisterService')
  }
}

export const LogoutService = async () => {
  try {
    const result = await genericRequestAuth(`${base_url}/api/logout`, 'POST')
    return result ?? []
  } catch (error) {
    await handleError(error, 'LogoutService')
  }
}