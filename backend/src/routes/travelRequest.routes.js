/**
 * Rutas de Solicitudes de Viaje
 * API REST para gestionar solicitudes de viaje
 */
const express = require('express');
const router = express.Router();
const travelRequestController = require('../controllers/travelRequest.controller');
const { validateTravelRequest, validatePartialUpdate } = require('../middleware/travelValidation');

/**
 * @route   GET /api/travel-requests
 * @desc    Obtener todas las solicitudes de viaje
 * @access  Public (o protegido según configuración)
 */
router.get('/', travelRequestController.getAllRequests);

/**
 * @route   GET /api/travel-requests/clients/search
 * @desc    Buscar clientes por nombre o DNI
 * @access  Public
 */
router.get('/clients/search', travelRequestController.searchClients);

/**
 * @route   GET /api/travel-requests/:id
 * @desc    Obtener una solicitud por ID
 * @access  Public
 */
router.get('/:id', travelRequestController.getRequestById);

/**
 * @route   POST /api/travel-requests
 * @desc    Crear una nueva solicitud de viaje
 * @access  Public
 */
router.post('/', validateTravelRequest, travelRequestController.createRequest);

/**
 * @route   PUT /api/travel-requests/:id
 * @desc    Actualizar una solicitud existente
 * @access  Public
 */
router.put('/:id', validatePartialUpdate, travelRequestController.updateRequest);

/**
 * @route   DELETE /api/travel-requests/:id
 * @desc    Eliminar una solicitud
 * @access  Public
 */
router.delete('/:id', travelRequestController.deleteRequest);

module.exports = router;
