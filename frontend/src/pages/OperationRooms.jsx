import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import OperationRoomForm from '../components/forms/OperationRoomForm';

const OperationRooms = () => {
  const { operationRooms, deleteOperationRoom } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRooms = operationRooms.filter(room =>
    room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.availability_status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (room) => {
    setEditingRoom(room);
    setShowForm(true);
  };

  const handleDelete = (roomId) => {
    if (window.confirm('Are you sure you want to delete this operation room?')) {
      deleteOperationRoom(roomId);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRoom(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Occupied':
        return 'bg-red-100 text-red-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search operation rooms..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Operation Room
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <Card key={room.or_id} hover>
            <Card.Content>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{room.room_number}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.availability_status)}`}>
                    {room.availability_status}
                  </span>
                  <div className="flex space-x-1">
                    <button onClick={() => handleEdit(room)} className="p-1 text-gray-400 hover:text-blue-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(room.or_id)} className="p-1 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Equipment:</p>
                <ul className="text-sm text-gray-600 list-disc list-inside">
                  {room.equipment_list.map((equipment, index) => (
                    <li key={index}>{equipment}</li>
                  ))}
                </ul>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      <OperationRoomForm isOpen={showForm} onClose={handleCloseForm} operationRoom={editingRoom} />
    </div>
  );
};

export default OperationRooms;
