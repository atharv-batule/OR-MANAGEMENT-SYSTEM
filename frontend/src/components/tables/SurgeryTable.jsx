import React from 'react';
import { Edit, Trash2, Eye, Calendar, Clock } from 'lucide-react';
import Card from '../ui/Card';
import { formatDate, formatTime } from '../../utils/helpers';

const SurgeryTable = ({ surgeries, patients, surgeons, anesthesiologists, nurses, operationRooms, onEdit, onDelete, onView }) => {
  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.patient_id === patientId);
    return patient ? patient.patient_name : 'Unknown Patient';
  };

  const getSurgeonName = (surgeonId) => {
    const surgeon = surgeons.find(s => s.surgeon_id === surgeonId);
    return surgeon ? surgeon.surgeon_name : 'Unknown Surgeon';
  };

  const getAnesthesiologistName = (anesthId) => {
    const anesthesiologist = anesthesiologists.find(a => a.anaesth_id === anesthId);
    return anesthesiologist ? anesthesiologist.anaesth_name : 'Unknown Anesthesiologist';
  };

  const getNurseName = (nurseId) => {
    const nurse = nurses.find(n => n.nurse_id === nurseId);
    return nurse ? nurse.nurse_name : 'Unknown Nurse';
  };

  const getRoomNumber = (orId) => {
    const room = operationRooms.find(or => or.or_id === orId);
    return room ? room.room_number : 'Unknown Room';
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Surgery Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medical Team
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {surgeries.map((surgery) => (
              <tr key={surgery.surgery_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{surgery.surgery_type}</div>
                  <div className="text-sm text-gray-500 flex items-center mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(surgery.surgery_date)}
                    <Clock className="w-4 h-4 ml-3 mr-1" />
                    {formatTime(surgery.surgery_time)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Duration: {surgery.surgery_duration} min
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{getPatientName(surgery.patient_id)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-gray-600 space-y-1">
                    <div><strong>Surgeon:</strong> {getSurgeonName(surgery.surgeon_id)}</div>
                    <div><strong>Anesthesiologist:</strong> {getAnesthesiologistName(surgery.anaesth_id)}</div>
                    <div><strong>Nurse:</strong> {getNurseName(surgery.nurse_id)}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{getRoomNumber(surgery.or_id)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(surgery.status)}`}>
                    {surgery.status || 'Scheduled'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onView(surgery)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(surgery)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(surgery.surgery_id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
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
      {surgeries.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No surgeries found</h3>
          <p className="text-gray-500">Get started by scheduling a new surgery.</p>
        </div>
      )}
    </Card>
  );
};

export default SurgeryTable;
