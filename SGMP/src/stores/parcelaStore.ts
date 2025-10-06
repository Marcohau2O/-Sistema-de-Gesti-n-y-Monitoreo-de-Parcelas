import { defineStore } from "pinia";
import { ref } from "vue";
import type { Parcela } from "@/interfaces/Parcela";
import {
  getAllParcelas,
  getParcelasById,
  createParcela,
  updatedParcela,
  deleteParcela as deleteParcelaService,
  getParcelaEliminada
} from "@/services/parcelaService";

export const useParcelasStore = defineStore("parcelas", () => {
  const parcelas = ref<Parcela[]>([]);
  const error = ref<string | null>(null);
  const isLoading = ref(false);

  const fetchParcelas = async () => {
    isLoading.value = true;
    try {
      const data = await getAllParcelas();
      parcelas.value = data;
      error.value = null;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchParcelaById = async (id: number) => {
    isLoading.value = true;
    try {
      const data = await getParcelasById(id);
      parcelas.value = [data];
      error.value = null;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  const createNewParcela = async (parcela: Parcela) => {
    isLoading.value = true;
    try {
      const data = await createParcela(parcela);
      parcelas.value.push(data);
      error.value = null;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  const updateParcela = async (id: number, parcela: Parcela) => {
    isLoading.value = true;
    try {
      const data = await updatedParcela(id, parcela);
      const index = parcelas.value.findIndex((p) => p.id === id);
      if (index !== -1) parcelas.value[index] = data;
      error.value = null;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  const removeParcela = async (id: number) => {
    isLoading.value = true;
    try {
      await deleteParcelaService(id);
      parcelas.value = parcelas.value.filter((p) => p.id !== id);
      error.value = null;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };
  
  const fetchParcelasEliminadas = async () => {
    isLoading.value = true;
    try {
      const data = await getParcelaEliminada();
      parcelas.value = data;
      error.value = null;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    parcelas,
    error,
    isLoading,
    fetchParcelas,
    fetchParcelaById,
    createNewParcela,
    updateParcela,
    removeParcela,
    fetchParcelasEliminadas
  };
});
