import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import Button from '../ui/Button';

const PatientTable = ({ patients, onEdit, onDelete, onView }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Patient ID</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Name</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Age</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Gender</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Contact</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Address</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Surgery ID</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Medical History</th>
            <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>

        <tbody>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <tr
                key={patient.patient_id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2 text-sm text-gray-800">{patient.patient_id}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{patient.patient_name}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{patient.patient_age}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{patient.patient_gender}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{patient.patient_contact}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{patient.patient_address}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{patient.surgery_id}</td>
                <td className="px-4 py-2 text-sm text-gray-800 truncate max-w-xs">
                  {patient.patient_medical_history || '—'}
                </td>
                <td className="px-4 py-2 text-center space-x-2">
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(patient)}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-green-600" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(patient.patient_id)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="9"
                className="text-center text-gray-500 py-6 text-sm"
              >
                No patients found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;
