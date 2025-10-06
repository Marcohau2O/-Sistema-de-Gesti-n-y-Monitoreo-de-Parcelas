export interface Parcela {
  id?: number;
  nombre: string;
  cultivo: string;
  responsable: string;
  latitud: number;
  longitud: number;
  estado: string;
  motivo_eliminacion?: string;
  eliminado_en?: string;
}