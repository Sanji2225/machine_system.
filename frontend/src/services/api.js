import axios from 'axios';
import { API_BASE_URL } from './config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  auth: { // Adicionando autenticação básica (usuário:senha) - substitua pelas credenciais corretas
    username: 'wayne', // Exemplo, idealmente viria de um login seguro
    password: '123' // Exemplo, idealmente viria de um login seguro
  }
});

// Interceptador para logar requests (opcional)
apiClient.interceptors.request.use(request => {
  console.log('Starting Request', request);
  return request;
});

// Interceptador para logar responses (opcional)
apiClient.interceptors.response.use(response => {
  console.log('Response:', response);
  return response;
}, error => {
  console.error('Response Error:', error.response || error.message);
  return Promise.reject(error);
});

// API para Lavanderias
export const getLavanderias = () => apiClient.get('/lavanderias/');
export const createLavanderia = (data) => apiClient.post('/lavanderias/', data);
export const updateLavanderia = (id, data) => apiClient.put(`/lavanderias/${id}/`, data);
export const deleteLavanderia = (id) => apiClient.delete(`/lavanderias/${id}/`);

// API para Máquinas
export const getMaquinas = (lavanderiaId) => apiClient.get(`/maquinas/${lavanderiaId ? `?lavanderia_id=${lavanderiaId}` : ''}`);
export const getMaquinaDetail = (id) => apiClient.get(`/maquinas/${id}/`);
export const createMaquina = (data) => apiClient.post('/maquinas/', data);
export const updateMaquina = (id, data) => apiClient.put(`/maquinas/${id}/`, data);
export const deleteMaquina = (id) => apiClient.delete(`/maquinas/${id}/`);

// API de Pagamento
export const registrarPagamento = (data) => apiClient.post('/pagamentos/', data);
export const getPagamentoStatus = (id) => apiClient.get(`/pagamentos/${id}/`);
export const aprovarPagamento = (id) => apiClient.patch(`/pagamentos/${id}/`, { aprovado: true });

// API para Consulta de Máquina (Status)
export const getMaquinaStatus = (id) => apiClient.get(`/consulta-maquinas/${id}/status/`);
export const getAllMaquinasStatus = () => apiClient.get('/consulta-maquinas/');

export default apiClient;

