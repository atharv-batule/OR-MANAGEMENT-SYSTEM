import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Search, Edit, Trash2, Calendar } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import SurgeryForm from '../components/forms/SurgeryForm';

const Surgeries = () => {
  const { surgeries, deleteSurgery, patients, surgeons, operationRooms } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingSurgery, setEditingSurgery] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSurgeries = surgeries.filter(surgery => {
    const patient = patients.find(p => p.patient_id === surgery.patient_id);
    const surgeon = surgeons.find(s => s.surgeon_id === surgery.surgeon_id);
    return (
      surgery.surgery_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surgeon?.surgeon_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleEdit = (surgery) => {
    setEditingSurgery(surgery);
    setShowForm(true);
  };

  const handleDelete = (surgeryId) => {
    if (window.confirm('Are you sure you want to delete this surgery?')) {
      deleteSurgery(surgeryId);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSurgery(null);
  };

  const getPatientName = (patientId) => {
    return patients.find(p => p.patient_id === patientId)?.patient_name || 'Unknown Patient';
  };

  const getSurgeonName = (surgeonId) => {
    return surgeons.find(s => s.surgeon_id === surgeonId)?.surgeon_name || 'Unknown Surgeon';
  };

  const getOperationRoom = (orId) => {
    return operationRooms.find(or => or.or_id === orId)?.room_number || 'Unknown OR';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search surgeries..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Schedule Surgery
        </Button>
      </div>

      {/* Surgery Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSurgeries.map((surgery) => (
          <Card key={surgery.surgery_id} hover>
            <Card.Content>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{surgery.surgery_type}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  surgery.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                  surgery.status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                  surgery.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {surgery.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Patient:</span>
                  <span className="font-medium text-gray-900">{getPatientName(surgery.patient_id)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Surgeon:</span>
                  <span className="font-medium text-gray-900">{getSurgeonName(surgery.surgeon_id)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Operation Room:</span>
                  <span className="font-medium text-gray-900">{getOperationRoom(surgery.or_id)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date & Time:</span>
                  <span className="font-medium text-gray-900">{surgery.surgery_date} at {surgery.surgery_time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium text-gray-900">{surgery.surgery_duration} minutes</span>
                </div>
              </div>

              {surgery.surgery_notes && (
                <div className="mb-4">
                  <span className="text-sm text-gray-500">Notes:</span>
                  <p className="text-sm text-gray-900 mt-1 line-clamp-2">{surgery.surgery_notes}</p>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button
                  onClick={() => handleEdit(surgery)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(surgery.surgery_id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      {filteredSurgeries.length === 0 && (
        <Card>
          <Card.Content>
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No surgeries found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by scheduling a new surgery.'}
              </p>
            </div>
          </Card.Content>
        </Card>
      )}

      <SurgeryForm isOpen={showForm} onClose={handleCloseForm} surgery={editingSurgery} />
    </div>
  );
};

export default Surgeries;
