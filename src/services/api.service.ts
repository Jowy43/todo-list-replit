
import axios from 'axios';
import { API_CONFIG } from '../config/api';

const api = axios.create({
  baseURL: API_CONFIG.JSONBIN_URL,
  headers: {
    ...API_CONFIG.HEADERS,
    'Content-Type': 'application/json',
  }
});

export const ApiService = {
  async getTodos() {
    try {
      const response = await api.get(`/${API_CONFIG.JSONBIN_ID}`, {
        headers: {
          'X-Bin-Meta': false
        }
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching todos:', error);
      return [];
    }
  },

  async updateTodos(todos: any[]) {
    try {
      const response = await api.put(`/${API_CONFIG.JSONBIN_ID}`, todos);
      return response.data.record;
    } catch (error) {
      console.error('Error updating todos:', error);
      throw error;
    }
  }
};
