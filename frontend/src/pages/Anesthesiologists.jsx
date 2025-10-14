import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import AnesthesiologistForm from '../components/forms/AnesthesiologistForm';

const Anesthesiologists = () => {
  const { anesthesiologists, deleteAnesthesiologist } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingAnesthesiologist, setEditingAnesthesiologist] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAnesthesiologists = anesthesiologists.filter(anaesth =>
    anaesth.anaesth_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    anaesth.anaesth_certification.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (anesthesiologist) => {
    setEditingAnesthesiologist(anesthesiologist);
    setShowForm(true);
  };

  const handleDelete = (anesthId) => {
    if (window.confirm('Are you sure you want to delete this anesthesiologist?')) {
      deleteAnesthesiologist(anesthId);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAnesthesiologist(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search anesthesiologists..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Anesthesiologist
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnesthesiologists.map((anesthesiologist) => (
          <Card key={anesthesiologist.anaesth_id} hover>
            <Card.Content>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{anesthesiologist.anaesth_name}</h4>
                <div className="flex space-x-1">
                  <button onClick={() => handleEdit(anesthesiologist)} className="p-1 text-gray-400 hover:text-blue-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(anesthesiologist.anaesth_id)} className="p-1 text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{anesthesiologist.anaesth_certification}</p>
              <p className="text-sm text-gray-600 mb-1">{anesthesiologist.anaesth_experience_years} years experience</p>
              <p className="text-sm text-gray-600">{anesthesiologist.anaesth_contact}</p>
            </Card.Content>
          </Card>
        ))}
      </div>

      <AnesthesiologistForm isOpen={showForm} onClose={handleCloseForm} anesthesiologist={editingAnesthesiologist} />
    </div>
  );
};

export default Anesthesiologists;
