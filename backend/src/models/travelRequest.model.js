/**
 * Modelo de Solicitud de Viaje
 * Gestiona las operaciones CRUD para las solicitudes de viaje
 */
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/travelRequests.json');

/**
 * Lee los datos del archivo JSON
 */
const readData = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Si el archivo no existe, crear estructura inicial
    const initialData = { requests: [], nextId: 1001 };
    fs.writeFileSync(dataFilePath, JSON.stringify(initialData, null, 2));
    return initialData;
  }
};

/**
 * Escribe los datos al archivo JSON
 */
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

/**
 * Obtiene todas las solicitudes de viaje
 */
const getAllRequests = () => {
  const data = readData();
  return data.requests;
};

/**
 * Obtiene una solicitud por ID
 */
const getRequestById = (id) => {
  const data = readData();
  return data.requests.find(req => req.id === parseInt(id));
};

/**
 * Crea una nueva solicitud de viaje
 */
const createRequest = (requestData) => {
  const data = readData();
  
  const newRequest = {
    id: data.nextId,
    clientDni: requestData.clientDni,
    clientName: requestData.clientName,
    origin: requestData.origin,
    destination: requestData.destination,
    tripType: requestData.tripType,
    departureDateTime: requestData.departureDateTime,
    returnDateTime: requestData.returnDateTime,
    registrationDateTime: new Date().toISOString(),
    status: requestData.status || 'pendiente',
    email: requestData.email
  };
  
  data.requests.push(newRequest);
  data.nextId++;
  
  writeData(data);
  
  return newRequest;
};

/**
 * Actualiza una solicitud existente
 */
const updateRequest = (id, updateData) => {
  const data = readData();
  const index = data.requests.findIndex(req => req.id === parseInt(id));
  
  if (index === -1) {
    return null;
  }
  
  data.requests[index] = {
    ...data.requests[index],
    ...updateData,
    id: data.requests[index].id, // Mantener el ID original
    registrationDateTime: data.requests[index].registrationDateTime // Mantener fecha original
  };
  
  writeData(data);
  
  return data.requests[index];
};

/**
 * Elimina una solicitud
 */
const deleteRequest = (id) => {
  const data = readData();
  const index = data.requests.findIndex(req => req.id === parseInt(id));
  
  if (index === -1) {
    return false;
  }
  
  data.requests.splice(index, 1);
  writeData(data);
  
  return true;
};

/**
 * Busca clientes por nombre (para el campo de búsqueda)
 */
const searchClients = (query) => {
  const data = readData();
  const uniqueClients = [...new Map(
    data.requests.map(req => [req.clientDni, { dni: req.clientDni, name: req.clientName }])
  ).values()];
  
  if (!query) return uniqueClients;
  
  return uniqueClients.filter(client => 
    client.name.toLowerCase().includes(query.toLowerCase()) ||
    client.dni.includes(query)
  );
};

module.exports = {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
  searchClients
};
