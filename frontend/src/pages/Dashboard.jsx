import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  FileText,
} from 'lucide-react';
import Card from '../components/ui/Card';

const Dashboard = () => {
  const { patients, surgeons, anesthesiologists, nurses, operationRooms, surgeries } = useApp();
  const [selectedOR, setSelectedOR] = React.useState(null);

  const newsItems = [
    "New cardiac surgery unit opening next month",
    "Hospital achieves 5-star safety rating",
    "Advanced robotic surgery equipment installed",
    "Monthly safety training scheduled for all staff",
  ];

  // Helper: Get related surgery + staff for a room
  const getRoomDetails = (room) => {
    const surgery = surgeries.find(s => s.or_id === room.or_id);
    return {
      surgery,
      patient: patients.find(p => p.patient_id === surgery?.patient_id),
      surgeon: surgeons.find(s => s.surgeon_id === surgery?.surgeon_id),
      anesth: anesthesiologists.find(a => a.anaesth_id === surgery?.anaesth_id),
    };
  };

  return (
    <div className="space-y-6">
      {/* News Header */}
      <header className="text-shadow-sm border-b border-gray-200 overflow-hidden bg-blue-50 rounded-2xl p-3 shadow-[0px_1rem_1.5rem_-0.9rem_#000000e1] bg-[linear-gradient(135deg,#daf0ff,#dee4fb,#daf0ff)]">
        <marquee className="text-blue-700 font-medium text-base">
          {newsItems.join(' • ')}
        </marquee>
      </header>

      {/* === Operation Room Schedule === */}
      <Card className="overflow-hidden">
        <Card.Header>
          <Card.Title className="text-base text-center font-semibold">
            Operation Room Schedule
          </Card.Title>
        </Card.Header>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-md">
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
            <tbody className="bg-white divide-y divide-gray-200">
              {operationRooms.map((room) => {
                const { surgery, patient, surgeon, anesth } = getRoomDetails(room);
                return (
                  <tr
                    key={room.or_id}
                    onClick={() => setSelectedOR(room.or_id)}
                    className="hover:bg-gradient-to-r hover:from-[#f6f8ff] hover:to-[#eaf0ff] transition-all duration-200 hover:scale-[1.01]"
                  >
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">{room.room_number}</td>
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

        {/* Mobile View */}
        <div className="md:hidden overflow-x-auto relative">
          <table className="min-w-max bg-white rounded-xl shadow-md">
            <tbody>
              {["OR", "Surgery Hours", "Patient", "Procedure", "Surgeon", "Anest."].map((label) => (
                <tr key={label} className="hover:bg-gray-50">
                  <th className="px-2 py-3 text-center font-semibold sticky left-0 bg-gradient-to-bl from-[#c7def6] to-[#bedeff] text-[#2d3a6a] uppercase border-gray-300 z-20">
                    {label}
                  </th>
                  {operationRooms.map((room) => {
                    const { surgery, patient, surgeon, anesth } = getRoomDetails(room);
                    let value = "-";
                    switch (label) {
                      case "OR":
                        value = room.room_number;
                        break;
                      case "Surgery Hours":
                        value = surgery ? `${surgery.surgery_time} (${surgery.surgery_duration} mins)` : "CLOSED";
                        break;
                      case "Patient":
                        value = patient?.patient_name || (surgery ? "Unknown Patient" : "-");
                        break;
                      case "Procedure":
                        value = surgery?.surgery_type || "-";
                        break;
                      case "Surgeon":
                        value = surgeon?.surgeon_name || "-";
                        break;
                      case "Anest.":
                        value = anesth?.anaesth_name || "-";
                        break;
                    }
                    return (
                      <td
                        key={`${room.or_id}-${label}`}
                        className="border border-gray-300 px-4 py-2 text-center font-base whitespace-nowrap"
                        onClick={() => setSelectedOR(room.or_id)}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* === Detailed OR View === */}
      {selectedOR && (() => {
        const room = operationRooms.find(r => r.or_id === selectedOR);
        const { surgery, patient, surgeon, anesth } = getRoomDetails(room);
        const assignedNurses = nurses.filter(n => surgery?.nurse_ids?.includes(n.nurse_id));

        return (
          <Card>
            <Card.Header>
              <div className="relative flex items-center justify-center">
                <Card.Title className="text-base text-center font-semibold">
                  Details
                </Card.Title>
                <button
                  onClick={() => setSelectedOR(null)}
                  className="absolute right-0 bubble-button bg-blue-500 hover:bg-blue-400 text-white px-[19px] py-[4px] rounded-[6px] border-none cursor-pointer transition-all duration-200 ease-linear active:scale-95"
                >
                  Close
                </button>
              </div>
            </Card.Header>

            <Card.Content>
              {surgery ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Patient Info */}
                  <div className="rounded-lg p-4 bg-[linear-gradient(135deg,#c7d2f6,#dee4fb,#fdfefe)] shadow-[0px_1rem_1.5rem_-0.9rem_#000000e1]">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5" /> PATIENT'S DETAILS
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {patient?.patient_name || 'Unknown'}</p>
                      <p><strong>Bed Number:</strong> {patient?.patient_number || 'N/A'}</p>
                      <p><strong>Age:</strong> {patient?.patient_age || 'N/A'}</p>
                      <p><strong>Gender:</strong> {patient?.patient_gender || 'N/A'}</p>
                      <p><strong>Diagnosis:</strong> {patient?.patient_diagonosis || 'N/A'}</p>
                      <p><strong>Contact:</strong> {patient?.patient_contact || 'N/A'}</p>
                      <p><strong>Emergency Contact:</strong> {patient?.patient_emergency_contact || 'N/A'}</p>
                      {patient?.patient_medical_history && (
                        <p><strong>Medical History:</strong> {patient.patient_medical_history}</p>
                      )}
                    </div>
                  </div>

                  {/* Surgery + Team */}
                  <div className="space-y-4">
                    <div className="rounded-lg p-4 bg-[linear-gradient(135deg,#c7d2f6,#dee4fb,#fdfefe)] shadow-[0px_1rem_1.5rem_-0.9rem_#000000e1]">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                        <FileText className="w-5 h-5" /> SURGERY DETAILS
                      </h3>
                      <p><strong>Procedure:</strong> {surgery.surgery_type}</p>
                      <p><strong>Time:</strong> {surgery.surgery_time}</p>
                      <p><strong>Duration:</strong> {surgery.surgery_duration} mins</p>
                      <p><strong>Status:</strong> {surgery.status}</p>
                    </div>

                    <div className="rounded-lg p-4 bg-[linear-gradient(135deg,#c7d2f6,#dee4fb,#fdfefe)] shadow-[0px_1rem_1.5rem_-0.9rem_#000000e1]">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                        <Users className="w-5 h-5" /> SURGICAL TEAM
                      </h3>
                      <p><strong>Surgeon:</strong> {surgeon?.surgeon_name || 'Not assigned'} {surgeon?.surgeon_speciality && `(${surgeon.surgeon_speciality})`}</p>
                      <p><strong>Anesthesiologist:</strong> {anesth?.anaesth_name || 'Not assigned'}</p>
                      {nurses.length > 0 && (
                        <div>
                          <p><strong>Nurses:</strong></p>
                          <ul className="ml-4 list-disc">
                            {nurses.map((n, i) => (
                              <li key={n.nurse_id}>{i + 1}. {n.nurse_name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>This operation room is currently closed!!</p>
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
