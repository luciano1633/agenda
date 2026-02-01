/**
 * Hook personalizado para gestionar solicitudes de viaje
 */
import { useState, useEffect, useCallback } from 'react';
import * as travelService from '../services/travelRequestService';

export const useTravelRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Cargar todas las solicitudes
   */
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await travelService.getAllTravelRequests();
      setRequests(response.data || []);
    } catch (err) {
      setError(err.message);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear una nueva solicitud
   */
  const createRequest = async (requestData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await travelService.createTravelRequest(requestData);
      await fetchRequests(); // Recargar lista
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar una solicitud
   */
  const updateRequest = async (id, requestData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await travelService.updateTravelRequest(id, requestData);
      await fetchRequests(); // Recargar lista
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar una solicitud
   */
  const deleteRequest = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await travelService.deleteTravelRequest(id);
      await fetchRequests(); // Recargar lista
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cargar solicitudes al montar el componente
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    loading,
    error,
    fetchRequests,
    createRequest,
    updateRequest,
    deleteRequest
  };
};

export default useTravelRequests;
