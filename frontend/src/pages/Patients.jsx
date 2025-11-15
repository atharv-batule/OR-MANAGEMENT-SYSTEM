import React, { useState,useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PatientForm from '../components/forms/PatientForm';
import axios from 'axios';


const Patients = () => {
useEffect(() => {
    axios
      .get("https://or-management-system.onrender.com/patients")
      .then(res => {
        console.log("Fetched patients:", res.data);
        setPatients(res.data);
      })
      .catch(err => console.error(err));
  }, []);



  const [patients1, setPatients] = useState([]);
  const { patients, deletePatient } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients1.filter(patient =>
    patient.patient_num?.toString().includes(searchTerm.toLowerCase()) ||
    patient.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patient_contact?.includes(searchTerm) ||
    (patient.patient_medical_history?.toLowerCase().includes(searchTerm.toLowerCase()))
    
  );

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
  

  const handleDelete = (patientId) => {
    
      
      if (window.confirm('Are you sure you want to delete this patient?')) {
      axios.delete("https://or-management-system.onrender.com/patients",{ data: { patientid: patientId } })
    }
     window.location.reload();
    
    
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPatient(null);
    window.location.reload();
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
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Patient
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Number</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surgery ID</th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medical History</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
  {patients1
    .filter(patient => {
      const s = searchTerm.toLowerCase();
      return (
        patient.patientid?.toString().includes(s) ||
        `${patient.fname} ${patient.lname}`.toLowerCase().includes(s) ||
        patient.phone?.includes(searchTerm) ||
        patient.medicalhistory?.toLowerCase().includes(s)
      );
    })
    .map(patient => (
      <tr key={patient.patientid} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {patient.patientid}
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {patient.fname + " " + patient.lname}
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