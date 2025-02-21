
import axios from 'axios';
import { API_CONFIG } from '../config/api';

const api = axios.create({
  baseURL: API_CONFIG.JSONBIN_URL,
  headers: {
    'X-Master-Key': API_CONFIG.JSONBIN_KEY,
    'Content-Type': 'application/json',
  }
});

export const ApiService = {
  async getTodos() {
    const response = await api.get(`/${API_CONFIG.JSONBIN_ID}/latest`);
    return response.data.record;
  },

  async updateTodos(todos: any[]) {
    await api.put(`/${API_CONFIG.JSONBIN_ID}`, todos);
  }
};
