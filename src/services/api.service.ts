
import axios from 'axios';
import { API_CONFIG } from '../config/api';

const api = axios.create({
  baseURL: API_CONFIG.JSONBIN_URL,
});

export const ApiService = {
  async getTodos() {
    try {
      const response = await api.get(`/${API_CONFIG.JSONBIN_ID}`, {
        headers: {
          'X-Master-Key': API_CONFIG.JSONBIN_KEY,
          'X-Bin-Meta': 'false'
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
      const response = await api.put(`/${API_CONFIG.JSONBIN_ID}`, todos, {
        headers: {
          'X-Master-Key': API_CONFIG.JSONBIN_KEY,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating todos:', error);
      throw error;
    }
  }
};
