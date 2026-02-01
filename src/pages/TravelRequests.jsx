/**
 * Página de Gestión de Solicitudes de Viaje
 * Combina el formulario y la lista de solicitudes
 */
import { useState } from 'react';
import TravelRequestForm from '../components/TravelRequestForm';
import TravelRequestList from '../components/TravelRequestList';
import useTravelRequests from '../hooks/useTravelRequests';
import '../styles/TravelRequest.css';

const TravelRequests = () => {
  const { requests, loading, error, createRequest, updateRequest, deleteRequest } = useTravelRequests();
  const [editingRequest, setEditingRequest] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Muestra mensaje de éxito temporal
   */
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (formData) => {
    try {
      if (editingRequest) {
        await updateRequest(editingRequest.id, formData);
        showSuccess('✅ Solicitud actualizada exitosamente');
        setEditingRequest(null);
      } else {
        await createRequest(formData);
        showSuccess('✅ Solicitud registrada exitosamente');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  /**
   * Maneja la edición de una solicitud
   */
  const handleEdit = (request) => {
    setEditingRequest(request);
    // Scroll al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Maneja la eliminación de una solicitud
   */
  const handleDelete = async (id) => {
    try {
      await deleteRequest(id);
      showSuccess('✅ Solicitud eliminada exitosamente');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  /**
   * Cancela la edición
   */
  const handleCancel = () => {
    setEditingRequest(null);
  };

  return (
    <div className="travel-requests-page">
      <header className="page-header">
        <h1>🌍 Agencia de Viajes Oeste</h1>
        <p>Sistema de Gestión de Solicitudes de Viaje</p>
      </header>

      {/* Mensajes */}
      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="alert alert-error">
          ❌ {error}
        </div>
      )}

      {/* Formulario */}
      <TravelRequestForm 
        onSubmit={handleSubmit}
        editingRequest={editingRequest}
        onCancel={handleCancel}
      />

      {/* Lista de solicitudes */}
      <TravelRequestList 
        requests={requests}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
};

export default TravelRequests;
