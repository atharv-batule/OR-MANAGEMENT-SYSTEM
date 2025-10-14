import React from 'react';
import { useApp } from '../context/AppContext';
import { Users, UserPlus, Stethoscope, Shield, Building, FileText, Calendar, Activity, Clock } from 'lucide-react';
import Card from '../components/ui/Card';

const Dashboard = () => {
  const { patients, surgeons, anesthesiologists, nurses, operationRooms, surgeries } = useApp();
  const [selectedOR, setSelectedOR] = React.useState(null);


  const availableRooms = operationRooms.filter(room => room.availability_status === 'Available');
  const occupiedRooms = operationRooms.filter(room => room.availability_status === 'Occupied');
  const scheduledSurgeries = surgeries.filter(surgery => surgery.status === 'Scheduled');
  const inProgressSurgeries = surgeries.filter(surgery => surgery.status === 'In Progress');

  const newsItems = [
    "New cardiac surgery unit opening next month",
    "Hospital achieves 5-star safety rating",
    "Advanced robotic surgery equipment installed",
    "Monthly safety training scheduled for all staff"
  ];

  return (
    <div className="space-y-6">

    <div className="flex-1 mx-8 ">
          <div className="bg-blue-50 p-3 rounded-2xl">
            <marquee className="text-blue-700 font-medium">
              {newsItems.join(' • ')}
            </marquee>
          </div>
        </div>
      
      

        {/* OR Schedule Board */}
      <Card>
        <Card.Header>
          <Card.Title>Operation Room Schedule</Card.Title>
        </Card.Header>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700">OR</th>
                <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700">Surgery Hours</th>
                <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700">Patient</th>
                <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700">Procedure</th>
                <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700">Surgeon</th>
                <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700">Anest.</th>
              </tr>
            </thead>
            <tbody>
              {operationRooms.map((room) => {
                const surgery = surgeries.find(s => s.or_id === room.or_id);
                const patient = patients.find(p => p.patient_id === surgery?.patient_id);
                const surgeon = surgeons.find(s => s.surgeon_id === surgery?.surgeon_id);
                const anesth = anesthesiologists.find(a => a.anaesth_id === surgery?.anaesth_id);

                return (
                  <tr 
                    key={room.or_id} 
                    className="hover:bg-blue-50 cursor-pointer"
                    onClick={() => setSelectedOR(room.or_id)}
                  >
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">{room.or_name}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">
                      {surgery ? `${surgery.surgery_time} (${surgery.surgery_duration} mins)` : "CLOSED"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">
                      {patient?.patient_name || (surgery ? "Unknown Patient" : "-")}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">
                      {surgery?.surgery_type || "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">
                      {surgeon?.surgeon_name || "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">
                      {anesth?.anaesth_name || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
          
      {/* Detailed View Section */}
      {selectedOR && (() => {
        const room = operationRooms.find(r => r.or_id === selectedOR);
        const surgery = surgeries.find(s => s.or_id === selectedOR);
        const patient = patients.find(p => p.patient_id === surgery?.patient_id);
        const surgeon = surgeons.find(s => s.surgeon_id === surgery?.surgeon_id);
        const anesth = anesthesiologists.find(a => a.anaesth_id === surgery?.anaesth_id);
        const nursesList = nurses.filter(n => surgery?.nurse_ids?.includes(n.nurse_id));

        return (
          <Card>
            <Card.Header>
              <div className="flex justify-between items-center">
                <Card.Title>Details: {room?.or_name}</Card.Title>
                <button
                  onClick={() => setSelectedOR(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </Card.Header>
            <Card.Content>
              {surgery ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Patient Information */}
                  <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5" />
                  PATIENT'S DETAILS
                </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-gray-600">Name:</span>
                        <span className="ml-2 text-gray-900">{patient?.patient_name || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Bed Number:</span>
                        <span className="ml-2 text-gray-900">{patient?.patient_number || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Age:</span>
                        <span className="ml-2 text-gray-900">{patient?.patient_age || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Gender:</span>
                        <span className="ml-2 text-gray-900">{patient?.patient_gender || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Diagnosis:</span>
                        <span className="ml-2 text-gray-900">{patient?.patient_diagonosis || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Contact:</span>
                        <span className="ml-2 text-gray-900">{patient?.patient_contact || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Emergency Contact:</span>
                        <span className="ml-2 text-gray-900">{patient?.patient_emergency_contact || 'N/A'}</span>
                      </div>
                      {patient?.patient_medical_history && (
                        <div>
                          <span className="font-medium text-gray-600">Medical History:</span>
                          <p className="ml-2 text-gray-900 mt-1">{patient.patient_medical_history}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Surgery & Team Information */}
                  <div className="space-y-4">
                    {/* Surgery Details */}
                    <div className="border rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5" />
                  SURGERY DETAILS
                </h3>
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium text-gray-600">Procedure:</span>
                          <span className="ml-2 text-gray-900">{surgery.surgery_type}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Time:</span>
                          <span className="ml-2 text-gray-900">{surgery.surgery_time}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Duration:</span>
                          <span className="ml-2 text-gray-900">{surgery.surgery_duration} minutes</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Status:</span>
                          <span className="ml-2 text-gray-900">{surgery.status}</span>
                        </div>
                      </div>
                    </div>

                    {/* Surgical Team */}
                    <div className="border rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5" />
                  SURGICAL TEAM
                </h3>
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium text-gray-600">Surgeon:</span>
                          <span className="ml-2 text-gray-900">
                            {surgeon?.surgeon_name || 'Not assigned'}
                          </span>
                          {surgeon?.surgeon_speciality && (
                            <span className="ml-1 text-sm text-gray-500">
                              ({surgeon.surgeon_speciality})
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Anesthesiologist:</span>
                          <span className="ml-2 text-gray-900">
                            {anesth?.anaesth_name || 'Not assigned'}
                          </span>
                        </div>
                        {nurses.length > 0 && (
                          <div>
                            <span className="font-medium text-gray-600">Nurses:</span>
                            <div className="ml-2 mt-1">
                              {nurses.map((nurse, idx) => (
                                <div key={nurse.nurse_id} className="text-gray-900">
                                  {idx + 1}. {nurse.nurse_name}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>This operation room is currently closed.</p>
                  <p className="text-sm mt-2">No surgery scheduled.</p>
                </div>
              )}
            </Card.Content>
          </Card>
        );
      })()}

    
      
    </div>
  );
};

export default Dashboard;