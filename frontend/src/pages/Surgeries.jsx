import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import SurgeryForm from '../components/forms/SurgeryForm';
import axios from 'axios';

const Surgeries = () => {
  const [surgeries1, setSurgeries] = useState([]);
  const { deleteSurgery } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingSurgery, setEditingSurgery] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch surgeries from backend
  useEffect(() => {
    axios
      .get('http://localhost:3000/surgeries')
      .then(res => setSurgeries(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleEdit = (surgery) => {
    setEditingSurgery(surgery);
    setShowForm(true);
  };

  const handleDelete = (surgeryId) => {
    if (window.confirm('Are you sure you want to delete this surgery?')) {
      deleteSurgery(surgeryId);
      setSurgeries(prev => prev.filter(s => s.surgery_id !== surgeryId));
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSurgery(null);
  };

  return (
    <div className="space-y-6">
      {/* Search + Add */}
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
          Add Surgery
        </Button>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  'Surgery ID', 'Patient ID', 'OR ID', 'Date', 'Start Time', 'End Time',
                  'Notes', 'Emp ID', 'Attending', 'Intern', 'Resident', 'Nurse', 'Anesthesiologist', 'Actions'
                ].map((col) => (
                  <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {surgeries1.map((surgery) => (
                <tr key={surgery.surgery_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{surgery.surgery_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{surgery.patient_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{surgery.or_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{surgery.surgery_date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{surgery.surgery_start}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{surgery.surgery_end}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{surgery.surgery_notes}</td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{surgery.attending}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{surgery.intern}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{surgery.resident}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{surgery.nurse}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{surgery.anesthesiologist}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleEdit(surgery)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(surgery.surgery_id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Form Modal */}
      <SurgeryForm isOpen={showForm} onClose={handleCloseForm} surgery={editingSurgery} />
    </div>
  );
};

export default Surgeries;
