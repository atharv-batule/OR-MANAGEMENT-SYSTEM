import React, { useState,useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import SurgeonForm from '../components/forms/SurgeonForm';
import axios from 'axios';
const Surgeons = () => {
  useEffect(() => {
    axios
      .get("http://localhost:3000/surgeons")
      .then(res => {
        console.log("Fetched surgeons:", res.data);
        setSurgeons(res.data);
      })
      .catch(err => console.error(err));
  }, []);
  const [surgeons1, setSurgeons] = useState([]);
  const { surgeons, deleteSurgeon } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingSurgeon, setEditingSurgeon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSurgeons = surgeons1.filter(surgeon =>
  surgeon.empid.toString().includes(searchTerm.toLowerCase()) ||
  (surgeon.surgeon_speciality?.toLowerCase().includes(searchTerm.toLowerCase()))
);

const handleEdit = (surgeon) => {
  const mappedSurgeon = {
    employee_id: surgeon.empid || '',
    surgeon_name: `${surgeon.fname || ''} ${surgeon.lname || ''}`.trim(),
    surgeon_dob: surgeon.dob || '',
    surgeon_gender: surgeon.gender || '',
    surgeon_salary: surgeon.salary || '',
    surgeon_speciality: surgeon.surgeon_speciality || '',
    surgeon_contact: surgeon.phone || '',
    surgeon_experience_years: surgeon.surgeon_experience_years || '',
    supervisor_id: surgeon.superid || '',
    surgeon_designation: surgeon.designation || '',
  };
  setEditingSurgeon(mappedSurgeon);
  setShowForm(true);
};

  const handleDelete = (surgeonId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      axios.delete("http://localhost:3000/surgeons",{ data: { employee_id: employee_id } })
    }
     window.location.reload();
    
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSurgeon(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search surgeons..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Surgeon
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emp Id</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speciality</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor Id</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {surgeons1.map((surgeon) => (
                 
                <tr key={surgeon.empid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{surgeon.empid}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{surgeon.fname+" "+surgeon.lname}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{surgeon.surgeon_speciality||"Cardio"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{surgeon.surgeon_experience_years||0} years</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{surgeon.designation}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{surgeon.superid}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{surgeon.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{surgeon.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{surgeon.dob}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{surgeon.salary}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleEdit(surgeon)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(surgeon.empid)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
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

      <SurgeonForm isOpen={showForm} onClose={handleCloseForm} surgeon={editingSurgeon} />
    </div>
  );
};

export default Surgeons;
