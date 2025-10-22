import React, { useState,useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import AnesthesiologistForm from '../components/forms/AnesthesiologistForm';
import axios from 'axios';
const Anesthesiologists = () => {
  useEffect(() => {
  axios
        .get("http://localhost:3000/anesthesiologists")
        .then(res => {
          console.log("Fetched Anesthologist:", res.data);
          setAnesthesiologists(res.data);
        })
        .catch(err => console.error(err));
    }, []);
  const [anesthesiologists1, setAnesthesiologists] = useState([]);
  const { anesthesiologists, deleteAnesthesiologist } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingAnesthesiologist, setEditingAnesthesiologist] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // const filteredAnesthesiologists = anesthesiologists1.filter(anaesth =>
  //   anaesth.anaesth_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   anaesth.anaesth_certification.toLowerCase().includes(searchTerm.toLowerCase())
  // );

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

      

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emp Id</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certification</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor Id</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {anesthesiologists1.map((anesthesiologist) => (
                <tr key={anesthesiologist.empid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{anesthesiologist.empid}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{anesthesiologist.fname+" "+anesthesiologist.lname}</td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{anesthesiologist.anaesth_certification}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{anesthesiologist.anaesth_experience_years} years</td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{anesthesiologist.superid}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{anesthesiologist.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{anesthesiologist.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{anesthesiologist.dob}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{anesthesiologist.salary}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleEdit(anesthesiologist)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(anesthesiologist.empid)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
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

      <AnesthesiologistForm isOpen={showForm} onClose={handleCloseForm} anesthesiologist={editingAnesthesiologist} />
    </div>
  );
};

export default Anesthesiologists;
