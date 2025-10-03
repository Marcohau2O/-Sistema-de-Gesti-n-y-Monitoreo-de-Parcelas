// src/stores/usersStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '@/interfaces/User';
import { getAllUsers, editUser, deleteUser } from '@/services/usersService';

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchUsers = async () => {
    isLoading.value = true;
    try {
      const data = await getAllUsers();
      users.value = data;
      error.value = null;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  const updateUser = async (id: number, payload: any) => {
    isLoading.value = true;
    try {
      await editUser(id, payload);
      error.value = null;
    } catch (err: any) {
      error.value = err.message;
    }
  };

  const removeUser = async (id: number) => {
    try {
      await deleteUser(id);
      users.value = users.value.filter(u => u.id !== id);
      error.value = null;
    } catch (err: any) {
      error.value = err.message;
    }
  };

  return { users, isLoading, error, fetchUsers, updateUser, removeUser };
});
