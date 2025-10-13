import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import NurseForm from '../components/forms/NurseForm';

const Nurses = () => {
  const { nurses, deleteNurse } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingNurse, setEditingNurse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNurses = nurses.filter(nurse =>
    nurse.nurse_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nurse.nurse_department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (nurse) => {
    setEditingNurse(nurse);
    setShowForm(true);
  };

  const handleDelete = (nurseId) => {
    if (window.confirm('Are you sure you want to delete this nurse?')) {
      deleteNurse(nurseId);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingNurse(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search nurses..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Nurse
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNurses.map((nurse) => (
          <Card key={nurse.nurse_id} hover>
            <Card.Content>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{nurse.nurse_name}</h4>
                <div className="flex space-x-1">
                  <button onClick={() => handleEdit(nurse)} className="p-1 text-gray-400 hover:text-blue-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(nurse.nurse_id)} className="p-1 text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{nurse.nurse_department}</p>
              <p className="text-sm text-gray-600 mb-1">{nurse.nurse_shift} Shift</p>
              <p className="text-sm text-gray-600">{nurse.nurse_contact}</p>
            </Card.Content>
          </Card>
        ))}
      </div>

      <NurseForm isOpen={showForm} onClose={handleCloseForm} nurse={editingNurse} />
    </div>
  );
};

export default Nurses;
