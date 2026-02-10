import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PatientForm from '../components/forms/PatientForm';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");
const payload = token ? jwtDecode(token) : null;
const role = payload?.role;

const Patients = () => {
  const [patients1, setPatients] = useState([]);
  const { patients, deletePatient } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const res = await axios.get("https://or-management-system.onrender.com/patients");
      console.log("Fetched patients:", res.data);
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Filter patients
  const filteredPatients = patients1.filter(patient => {
    const s = searchTerm.toLowerCase();
    return (
      patient.patientid?.toString().includes(s) ||
      `${patient.fname} ${patient.lname}`.toLowerCase().includes(s) ||
      patient.phone?.includes(searchTerm) ||
      patient.medicalhistory?.toLowerCase().includes(s)
    );
  });

  const handleEdit = (patient) => {
    const mappedPatient = {
      patient_num: patient.patientid,
      patient_name: `${patient.fname || ''} ${patient.lname || ''}`.trim(),
      patient_gender: patient.gender,
      patient_dob: patient.dob.split("T")[0],
      patient_contact: patient.phone,
      patient_address: patient.address,
      patient_medical_history: patient.medicalhistory
    };
    setEditingPatient(mappedPatient);
    setShowForm(true);
  };

  const handleDelete = async (patientId) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    
    try {
      await axios.delete("https://or-management-system.onrender.com/patients", { 
        data: { patientid: patientId } 
      });
      
      // Update state instead of reloading
      setPatients(prev => prev.filter(p => p.patientid !== patientId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete patient");
    }
  };

  const handleCloseForm = async () => {
    setShowForm(false);
    setEditingPatient(null);
    // Refresh data instead of reloading page
    await fetchPatients();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search patients..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {(role === "admin" || role === "surgeon") && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Patient
          </Button>
        )}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medical History</th>
                {(role === "admin" || role === "surgeon") && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map(patient => (
                <tr key={patient.patientid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {patient.patientid}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.fname} {patient.lname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.dob.split("T")[0]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.medicalhistory || "-"}
                  </td>
                  {(role === "admin" || role === "surgeon") && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(patient)}
                          className="p-2 text-gray-400 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(patient.patientid)}
                          className="p-2 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <PatientForm isOpen={showForm} onClose={handleCloseForm} patient={editingPatient} />
    </div>
  );
};

export default Patients;