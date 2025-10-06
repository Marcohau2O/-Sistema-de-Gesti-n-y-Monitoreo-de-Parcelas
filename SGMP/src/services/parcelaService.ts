import { genericRequestAuth } from "@/utils/genericRequest";

const endpoints = import.meta.env.VITE_ENDPOINT_API.split(',');
const baseURL = endpoints[0];


export const getAllParcelas = async ():  Promise<any> => {
    try {
        const response = await genericRequestAuth(`${baseURL}/api/parcelas`, 'GET');
        return response.data
    } catch (error: any) {
        console.error('Error fetching parcelas:', error)
        throw error
    }
}

export const getParcelasById = async (id: number): Promise<any> => {
    try {
        const response = await genericRequestAuth(`${baseURL}/api/parcelasById/${id}`, 'GET');
        return response.data
    } catch (error: any) {
        console.error('Error fetching parcelas in id:', error)
        throw error
    }
}

export const createParcela = async (parcela: any): Promise<any> => {
    try {
        const response = await genericRequestAuth(`${baseURL}/api/createParcelas`, 'POST', parcela);
        return response.data
    } catch (error: any) {
        console.error('Error create parcela:', error)
        throw error
    }
}

export const updatedParcela = async (id: number, parcela: any): Promise<any> => {
    try {
        const response = await genericRequestAuth(`${baseURL}/api/parcUpdate/${id}`, 'PUT', parcela);
        return response.data
    } catch (error: any) {
        console.error('Error update in parcela:', error)
        throw error
    }
}

export const deleteParcela = async (id: number): Promise<any> => {
    try {
        const response = await genericRequestAuth(`${baseURL}/api/parcDelete/${id}`, 'DELETE');
        return response.data
    } catch (error: any) {
        console.error('Error delete in parcela:', error)
        throw error
    }
}

export const getParcelaEliminada = async (): Promise<any> => {
    try {
        const response = await genericRequestAuth(`${baseURL}/api/parcelas/eliminadas`, 'GET');
        return response.data
    } catch (error: any) {
        console.error('Error fetching parcela eliminadas:', error)
        throw error
    }
}