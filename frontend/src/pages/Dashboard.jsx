import {React, useEffect, useState} from 'react';
import { useApp } from '../context/AppContext';
import { Users, FileText } from 'lucide-react';
import Card from '../components/ui/Card';
import axios from 'axios';

const Dashboard = () => {
  const { patients, surgeons, anesthesiologists, nurses } = useApp();
  const [selectedOR, setSelectedOR] = useState(null);
  const [operationRooms, setOperationRoom] = useState([]);
  
  useEffect(() => {
    axios
      .get("http://localhost:3000/dashboard")
      .then(res => {
        console.log("Fetched Surgery Data:", res.data);
        setOperationRoom(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  // Calculate duration in minutes from start and end times
  const calculateDuration = (startTime, endTime) => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    let duration = endMinutes - startMinutes;
    if (duration < 0) duration += 24 * 60; // Handle overnight surgeries
    
    return duration;
  };

  const newsItems = [
    "New cardiac surgery unit opening next month",
    "Hospital achieves 5-star safety rating",
    "Advanced robotic surgery equipment installed",
    "Monthly safety training scheduled for all staff"
  ];

  return (
    <div className="space-y-6">
      <header className="text-shadow-sm border-b border-gray-200 overflow-hidden bg-blue-50 p-3 rounded-2xl px-1 py-4 sm:p-3 bg-[linear-gradient(135deg,#daf0ff,#dee4fb,#daf0ff)] shadow-[0px_1rem_1.5rem_-0.9rem_#000000e1]"> 
        <marquee className="text-blue-700 font-medium text-base overflow-hidden">
          {newsItems.join(' • ')}
        </marquee>
      </header>

      {/* OR Schedule Board */}
      <Card className="overflow-hidden">
        <Card.Header>
          <Card.Title className="text-base text-center font-semibold">Operation Room Schedule</Card.Title>
        </Card.Header>
        
        {/* Desktop View - Normal Horizontal Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-md">
            <thead className="bg-gradient-to-r from-[#c7def6] to-[#bedeff] text-[#2d3a6a] uppercase">
              <tr>
                <th className="px-4 py-3 text-center font-semibold">OR</th>
                <th className="px-4 py-3 text-center font-semibold">Surgery Hours</th>
                <th className="px-4 py-3 text-center font-semibold">Patient</th>
                <th className="px-4 py-3 text-center font-semibold">Procedure</th>
                <th className="px-4 py-3 text-center font-semibold">Surgeon</th>
                <th className="px-4 py-3 text-center font-semibold">Anest.</th>
              </tr>
            </thead>
            <tbody>
              {operationRooms.map((surgery) => {
                const patient = patients.find(p => p.patient_id === surgery.patient_id);
                const surgeon = surgeons.find(s => s.surgeon_id === surgery.attending_id);
                const anesth = anesthesiologists.find(a => a.anaesth_id === surgery.anesthesiologist_id);
                const duration = calculateDuration(surgery.surgery_start, surgery.surgery_end);
                
                return (
                  <tr 
                    key={surgery.surgery_id} 
                    className="hover:bg-gradient-to-r hover:from-[#f6f8ff] hover:to-[#eaf0ff] transition-all duration-200 hover:scale-[1.01] cursor-pointer"
                    onClick={() => setSelectedOR(surgery.surgery_id)}
                  >
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">{room.or_id}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">
                      {`${surgery.surgery_start} (${duration} mins)`}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">
                      {patient?.patient_name || surgery.patient_id || "Unknown Patient"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">
                      {patient?.patient_diagonosis || "N/A"}
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

        {/* Mobile View */}
        <div className="md:hidden overflow-x-auto">
          <table className="bg-white rounded-xl overflow-hidden shadow-md">
            <tbody>
              <tr className="hover:bg-gray-50">
                <th className="px-4 py-3 text-center font-semibold sticky left-0 bg-gradient-to-bl from-[#c7def6] to-[#bedeff] text-[#2d3a6a] uppercase border-gray-300">OR</th>
                {operationRooms.map((surgery) => (
                  <td key={surgery.surgery_id} className="border border-gray-300 px-4 py-2 text-center font-base whitespace-nowrap">
                    {surgery.or_id}
                  </td>
                ))}
              </tr>
              
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 text-center font-semibold sticky left-0 bg-gradient-to-bl from-[#c7def6] to-[#bedeff] text-[#2d3a6a] uppercase border-gray-300">Surgery Hours</td>
                {operationRooms.map((surgery) => {
                  const duration = calculateDuration(surgery.surgery_start, surgery.surgery_end);
                  return (
                    <td key={surgery.surgery_id} className="border border-gray-300 px-4 py-2 text-center font-base whitespace-nowrap cursor-pointer" onClick={() => setSelectedOR(surgery.surgery_id)}>
                      {`${surgery.surgery_start} (${duration} mins)`}
                    </td>
                  );
                })}
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 text-center font-semibold sticky left-0 bg-gradient-to-bl from-[#c7def6] to-[#bedeff] text-[#2d3a6a] uppercase border-gray-300">Patient</td>
                {operationRooms.map((surgery) => {
                  const patient = patients.find(p => p.patient_id === surgery.patient_id);
                  return (
                    <td key={surgery.surgery_id} className="border border-gray-300 px-4 py-2 text-center font-base whitespace-nowrap cursor-pointer" onClick={() => setSelectedOR(surgery.surgery_id)}>
                      {patient?.patient_name || surgery.patient_id || "Unknown"}
                    </td>
                  );
                })}
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 text-center font-semibold sticky left-0 bg-gradient-to-bl from-[#c7def6] to-[#bedeff] text-[#2d3a6a] uppercase border-gray-300">Procedure</td>
                {operationRooms.map((surgery) => {
                  const patient = patients.find(p => p.patient_id === surgery.patient_id);
                  return (
                    <td key={surgery.surgery_id} className="border border-gray-300 px-4 py-2 text-center font-base whitespace-nowrap cursor-pointer" onClick={() => setSelectedOR(surgery.surgery_id)}>
                      {patient?.patient_diagonosis || "N/A"}
                    </td>
                  );
                })}
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 text-center font-semibold sticky left-0 bg-gradient-to-bl from-[#c7def6] to-[#bedeff] text-[#2d3a6a] uppercase border-gray-300">Surgeon</td>
                {operationRooms.map((surgery) => {
                  const surgeon = surgeons.find(s => s.surgeon_id === surgery.attending_id);
                  return (
                    <td key={surgery.surgery_id} className="border border-gray-300 px-4 py-2 text-center font-base whitespace-nowrap cursor-pointer" onClick={() => setSelectedOR(surgery.surgery_id)}>
                      {surgeon?.surgeon_name || "-"}
                    </td>
                  );
                })}
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 text-center font-semibold sticky left-0 bg-gradient-to-bl from-[#c7def6] to-[#bedeff] text-[#2d3a6a] uppercase border-gray-300">Anest.</td>
                {operationRooms.map((surgery) => {
                  const anesth = anesthesiologists.find(a => a.anaesth_id === surgery.anesthesiologist_id);
                  return (
                    <td key={surgery.surgery_id} className="border border-gray-300 px-4 py-2 text-center font-base whitespace-nowrap cursor-pointer" onClick={() => setSelectedOR(surgery.surgery_id)}>
                      {anesth?.anaesth_name || "-"}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
          
      {/* Detailed View Section */}
      {selectedOR && (() => {
        const surgery = operationRooms.find(s => s.surgery_id === selectedOR);
        const patient = patients.find(p => p.patient_id === surgery?.patient_id);
        const surgeon = surgeons.find(s => s.surgeon_id === surgery?.attending_id);
        const anesth = anesthesiologists.find(a => a.anaesth_id === surgery?.anesthesiologist_id);
        const assignedNurse = nurses.find(n => n.nurse_id === surgery?.nurse_id);
        const duration = surgery ? calculateDuration(surgery.surgery_start, surgery.surgery_end) : 0;

        return (
          <Card>
            <Card.Header>
              <div className="relative flex items-center justify-center">
                <Card.Title className="text-base text-center font-semibold">
                  Details
                </Card.Title>
                <button
                  onClick={() => setSelectedOR(null)}
                  className="absolute right-0 bubble-button hover:bg-blue-400 hover:text-blue-800 px-[19px] py-[4px] rounded-[6px] border-none text-white cursor-pointer bg-blue-500 transition-all duration-200 ease-linear active:scale-95 overflow-hidden"
                >
                  Close
                </button>
              </div>
            </Card.Header>

            <Card.Content>
              {surgery ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
                  {/* Patient Information */}
                  <div className="rounded-lg p-4 bg-linear-30 bg-blue-50 bg-[linear-gradient(135deg,#c7d2f6,#dee4fb,#fdfefe)] shadow-[0px_1rem_1.5rem_-0.9rem_#000000e1]">
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
                    <div className="rounded-lg p-4 bg-linear-30 bg-blue-50 bg-[linear-gradient(135deg,#c7d2f6,#dee4fb,#fdfefe)] shadow-[0px_1rem_1.5rem_-0.9rem_#000000e1]">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                        <FileText className="w-5 h-5" />
                        SURGERY DETAILS
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium text-gray-600">Date:</span>
                          <span className="ml-2 text-gray-900">
                            {new Date(surgery.surgery_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Start Time:</span>
                          <span className="ml-2 text-gray-900">{surgery.surgery_start}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">End Time:</span>
                          <span className="ml-2 text-gray-900">{surgery.surgery_end}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Duration:</span>
                          <span className="ml-2 text-gray-900">{duration} minutes</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Notes:</span>
                          <span className="ml-2 text-gray-900">{surgery.surgery_notes || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Surgical Team */}
                    <div className="rounded-lg p-4 bg-linear-30 bg-blue-50 bg-[linear-gradient(135deg,#c7d2f6,#dee4fb,#fdfefe)] shadow-[0px_1rem_1.5rem_-0.9rem_#000000e1]">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                        <Users className="w-5 h-5" />
                        SURGICAL TEAM
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium text-gray-600">Attending Surgeon:</span>
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
                        {assignedNurse && (
                          <div>
                            <span className="font-medium text-gray-600">Nurse:</span>
                            <span className="ml-2 text-gray-900">{assignedNurse.nurse_name}</span>
                          </div>
                        )}
                        {surgery.resident_id && (
                          <div>
                            <span className="font-medium text-gray-600">Resident ID:</span>
                            <span className="ml-2 text-gray-900">{surgery.resident_id}</span>
                          </div>
                        )}
                        {surgery.intern_id && (
                          <div>
                            <span className="font-medium text-gray-600">Intern ID:</span>
                            <span className="ml-2 text-gray-900">{surgery.intern_id}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Surgery details not found!</p>
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