/**
 * Controlador de Solicitudes de Viaje
 * Maneja las operaciones CRUD para las solicitudes
 */
const TravelRequest = require('../models/travelRequest.model');

/**
 * Obtener todas las solicitudes de viaje (con filtro opcional por estado)
 * GET /api/travel-requests?status=pendiente
 */
const getAllRequests = (req, res) => {
  try {
    const { status } = req.query;
    const requests = status 
      ? TravelRequest.getRequestsByStatus(status)
      : TravelRequest.getAllRequests();
    
    res.json({
      success: true,
      message: 'Solicitudes obtenidas correctamente',
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las solicitudes',
      error: error.message
    });
  }
};

/**
 * Obtener una solicitud por ID
 * GET /api/travel-requests/:id
 */
const getRequestById = (req, res) => {
  try {
    const { id } = req.params;
    const request = TravelRequest.getRequestById(id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: `Solicitud con ID ${id} no encontrada`
      });
    }
    
    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la solicitud',
      error: error.message
    });
  }
};

/**
 * Crear una nueva solicitud de viaje
 * POST /api/travel-requests
 */
const createRequest = (req, res) => {
  try {
    const newRequest = TravelRequest.createRequest(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Solicitud de viaje creada exitosamente',
      data: newRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear la solicitud',
      error: error.message
    });
  }
};

/**
 * Actualizar una solicitud existente
 * PUT /api/travel-requests/:id
 */
const updateRequest = (req, res) => {
  try {
    const { id } = req.params;
    const updatedRequest = TravelRequest.updateRequest(id, req.body);
    
    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: `Solicitud con ID ${id} no encontrada`
      });
    }
    
    res.json({
      success: true,
      message: 'Solicitud actualizada exitosamente',
      data: updatedRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la solicitud',
      error: error.message
    });
  }
};

/**
 * Eliminar una solicitud
 * DELETE /api/travel-requests/:id
 */
const deleteRequest = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = TravelRequest.deleteRequest(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Solicitud con ID ${id} no encontrada`
      });
    }
    
    res.json({
      success: true,
      message: 'Solicitud eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la solicitud',
      error: error.message
    });
  }
};

/**
 * Buscar clientes
 * GET /api/travel-requests/clients/search
 */
const searchClients = (req, res) => {
  try {
    const { q } = req.query;
    const clients = TravelRequest.searchClients(q);
    
    res.json({
      success: true,
      data: clients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al buscar clientes',
      error: error.message
    });
  }
};

/**
 * Obtener el siguiente ID disponible
 * GET /api/travel-requests/next-id
 */
const getNextId = (req, res) => {
  try {
    const nextId = TravelRequest.getNextId();
    res.json({
      success: true,
      data: { nextId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el siguiente ID',
      error: error.message
    });
  }
};

module.exports = {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
  searchClients,
  getNextId
};
