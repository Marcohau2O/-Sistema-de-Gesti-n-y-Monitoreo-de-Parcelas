import axios from 'axios';

const API_BASE_URL = 'https://sensores-async-api.onrender.com/api/sensors';

export interface SensorData {
  value: number;
  unit: string;
  timestamp: string;
  coords: {
    lat: number;
    lon: number;
  };
}

export interface SensorsResponse {
  temperatura: SensorData[];
  humedad: SensorData[];
  lluvia: SensorData[];
  radiacion_solar: SensorData[];
}

class SensorService {
  async getAllSensors(): Promise<SensorsResponse> {
    try {
      const response = await axios.get<SensorsResponse>(`${API_BASE_URL}/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      throw error;
    }
  }
}

export default new SensorService();