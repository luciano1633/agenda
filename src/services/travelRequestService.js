/**
 * Servicio API para Solicitudes de Viaje
 * Maneja las peticiones HTTP al backend
 */
import { API_BASE_URL, getDefaultHeaders } from '../config/api.config';

const TRAVEL_API_URL = `${API_BASE_URL}/travel-requests`;

/**
 * Obtener todas las solicitudes de viaje
 */
export const getAllTravelRequests = async () => {
  try {
    const response = await fetch(TRAVEL_API_URL, {
      method: 'GET',
      headers: getDefaultHeaders()
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener las solicitudes');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching travel requests:', error);
    throw error;
  }
};

/**
 * Obtener una solicitud por ID
 */
export const getTravelRequestById = async (id) => {
  try {
    const response = await fetch(`${TRAVEL_API_URL}/${id}`, {
      method: 'GET',
      headers: getDefaultHeaders()
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener la solicitud');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching travel request:', error);
    throw error;
  }
};

/**
 * Crear una nueva solicitud de viaje
 */
export const createTravelRequest = async (requestData) => {
  try {
    const response = await fetch(TRAVEL_API_URL, {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify(requestData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.errors ? data.errors.join(', ') : data.message || 'Error al crear la solicitud');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating travel request:', error);
    throw error;
  }
};

/**
 * Actualizar una solicitud existente
 */
export const updateTravelRequest = async (id, requestData) => {
  try {
    const response = await fetch(`${TRAVEL_API_URL}/${id}`, {
      method: 'PUT',
      headers: getDefaultHeaders(),
      body: JSON.stringify(requestData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.errors ? data.errors.join(', ') : data.message || 'Error al actualizar la solicitud');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating travel request:', error);
    throw error;
  }
};

/**
 * Eliminar una solicitud
 */
export const deleteTravelRequest = async (id) => {
  try {
    const response = await fetch(`${TRAVEL_API_URL}/${id}`, {
      method: 'DELETE',
      headers: getDefaultHeaders()
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al eliminar la solicitud');
    }
    
    return data;
  } catch (error) {
    console.error('Error deleting travel request:', error);
    throw error;
  }
};

/**
 * Buscar clientes por nombre o DNI
 */
export const searchClients = async (query = '') => {
  try {
    const response = await fetch(`${TRAVEL_API_URL}/clients/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: getDefaultHeaders()
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al buscar clientes');
    }
    
    return data;
  } catch (error) {
    console.error('Error searching clients:', error);
    throw error;
  }
};
