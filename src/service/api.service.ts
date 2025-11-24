import axios from 'axios';

// Configuration de l'API - ajustez l'URL selon votre backend Django
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000, // 30 secondes pour les prédictions
});


export default api;
