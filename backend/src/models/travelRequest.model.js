/**
 * Modelo de Solicitud de Viaje
 * Gestiona las operaciones CRUD para las solicitudes de viaje
 * Persistencia simulada mediante archivo JSON (mock)
 */
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/travelRequests.json');

/**
 * Datos mock de clientes pre-cargados para búsqueda
 */
const mockClients = [
  { dni: '16414595-0', name: 'Esteban Castro Paredes', email: 'ecastro@mail.com' },
  { dni: '19544786-1', name: 'Fabián Gamboa Martínez', email: 'fgamboa@mail.com' },
  { dni: '18223344-5', name: 'Yasna Plaza Morales', email: 'yplaza@mail.com' },
  { dni: '17889922-3', name: 'Fernanda Quintana Rivera', email: 'fquintana@mail.com' },
  { dni: '20112233-K', name: 'Carlos Mendoza López', email: 'cmendoza@mail.com' },
  { dni: '15667788-2', name: 'María José Soto Díaz', email: 'mjsoto@mail.com' },
  { dni: '21334455-7', name: 'Andrés Vargas Fuentes', email: 'avargas@mail.com' },
  { dni: '14998877-6', name: 'Catalina Rojas Muñoz', email: 'crojas@mail.com' },
];

/**
 * Lee los datos del archivo JSON
 */
const readData = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
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
    passengerName: requestData.passengerName,
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
 * Busca clientes mock por nombre o DNI (para el campo de búsqueda)
 */
const searchClients = (query) => {
  if (!query) return mockClients;
  
  return mockClients.filter(client => 
    client.name.toLowerCase().includes(query.toLowerCase()) ||
    client.dni.includes(query)
  );
};

/**
 * Obtiene el siguiente ID disponible
 */
const getNextId = () => {
  const data = readData();
  return data.nextId;
};

/**
 * Filtra solicitudes por estado
 */
const getRequestsByStatus = (status) => {
  const data = readData();
  if (!status || status === 'todas') return data.requests;
  return data.requests.filter(req => req.status === status);
};

module.exports = {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
  searchClients,
  getNextId,
  getRequestsByStatus
};
