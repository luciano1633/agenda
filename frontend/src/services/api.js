/**
 * Configuración de la API del backend
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Obtiene todas las solicitudes de viaje, con filtro opcional por estado
 */
export const getAllRequests = async (status = '') => {
  const url = status && status !== 'todas'
    ? `${API_BASE_URL}/travel-requests?status=${status}`
    : `${API_BASE_URL}/travel-requests`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.success) throw new Error(data.message);
  return data.data;
};

/**
 * Obtiene el siguiente ID correlativo disponible
 */
export const getNextId = async () => {
  const res = await fetch(`${API_BASE_URL}/travel-requests/next-id`);
  const data = await res.json();

  if (!data.success) throw new Error(data.message);
  return data.data.nextId;
};

/**
 * Crea una nueva solicitud de viaje
 */
export const createRequest = async (requestData) => {
  const res = await fetch(`${API_BASE_URL}/travel-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData),
  });

  const data = await res.json();

  if (!data.success) {
    const errorMsg = data.errors ? data.errors.join(', ') : data.message;
    throw new Error(errorMsg);
  }
  return data.data;
};

/**
 * Busca clientes por nombre o DNI
 */
export const searchClients = async (query) => {
  const res = await fetch(`${API_BASE_URL}/travel-requests/clients/search?q=${encodeURIComponent(query)}`);
  const data = await res.json();

  if (!data.success) throw new Error(data.message);
  return data.data;
};

/**
 * Actualiza una solicitud existente (parcial o total)
 */
export const updateRequest = async (id, updateData) => {
  const res = await fetch(`${API_BASE_URL}/travel-requests/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });

  const data = await res.json();

  if (!data.success) {
    const errorMsg = data.errors ? data.errors.join(', ') : data.message;
    throw new Error(errorMsg);
  }
  return data.data;
};

/**
 * Elimina una solicitud por ID
 */
export const deleteRequest = async (id) => {
  const res = await fetch(`${API_BASE_URL}/travel-requests/${id}`, {
    method: 'DELETE',
  });

  const data = await res.json();

  if (!data.success) throw new Error(data.message);
  return true;
};
