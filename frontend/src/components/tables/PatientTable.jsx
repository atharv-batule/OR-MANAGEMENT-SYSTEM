import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import Button from '../ui/Button';


const PatientTable = ({ patients, onEdit, onDelete, onView }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Number</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surgery ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medical History</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {patients.length > 0 ? (
            patients.map((patient) => (
              <tr
                key={patient.patient_id}
                className="bg-white divide-y divide-gray-200"
              >
                <td className="px-4 py-2 text-sm text-gray-800">{patient.patient_num}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{patient.patient_name}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{patient.patient_dob}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{patient.patient_gender}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{patient.patient_contact}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{patient.patient_address}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{patient.surgery_id}</td>
                <td className="px-4 py-2 text-sm text-gray-800 truncate max-w-xs">
                  {patient.patient_medical_history || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(patient)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(patient.patient_id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    </div>
                  </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="9"
                className="text-center text-gray-500 py-6 text-sm "
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
