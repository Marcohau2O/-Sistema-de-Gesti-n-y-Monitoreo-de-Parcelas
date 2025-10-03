// src/services/usersService.ts
import { genericRequest, genericRequestAuth } from '@/utils/genericRequest';

const endpoints = import.meta.env.VITE_ENDPOINT_API.split(',');
const baseURL = endpoints[0];

export const getAllUsers = async (): Promise<any> => {
  try {
    const response = await genericRequestAuth(`${baseURL}/api/users`, 'GET');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const editUser = async (id: number, payload: any): Promise<any> => {
  try {
    const response = await genericRequestAuth(`${baseURL}/api/usersEdit/${id}`, 'PATCH', payload);
    return response.data;
  } catch (error: any) {
    console.error('Error editing user:', error);
    throw error;
  }
};

export const deleteUser = async (id: number): Promise<any> => {
  try {
    const response = await genericRequestAuth(`${baseURL}/api/userDelete/${id}`, 'DELETE');
    return response.data;
  } catch (error: any) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
