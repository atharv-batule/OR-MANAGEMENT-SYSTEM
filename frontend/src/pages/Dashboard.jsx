import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, FileText } from 'lucide-react';
import Card from '../components/ui/Card';
import axios from 'axios';

const Dashboard = () => {
  const { patients, surgeons, anesthesiologists, nurses } = useApp();
  const [selectedOR, setSelectedOR] = useState(null);
  const [operationRooms, setOperationRoom] = useState([]);
  const [surgeries, setSurgeries] = useState([]);

  // Fetch operation rooms and surgeries
  useEffect(() => {
    axios
      .get("http://localhost:3000/dashboard")
      .then(res => {
        setSurgeries(res.data);
        // Extract unique ORs
        const rooms = Array.from(new Set(res.data.map(s => s.or_id))).map(or_id => ({ or_id }));
        setOperationRoom(rooms);
      })
      .catch(err => console.error(err));
  }, []);

  const newsItems = [
    "New cardiac surgery unit opening next month",
    "Hospital achieves 5-star safety rating",
    "Advanced robotic surgery equipment installed",
    "Monthly safety training scheduled for all staff",
  ];

  // Get the **latest surgery** for a given OR
  const getRoomDetails = (room) => {
    const surgery = surgeries
      .filter(s => s.or_id === room.or_id)
      .sort((a, b) => new Date(b.surgery_date) - new Date(a.surgery_date))[0]; // latest
    return {
      surgery,
      patient: patients.find(p => p.patient_id === surgery?.patient_id),
      surgeon: surgeons.find(s => s.surgeon_id === surgery?.attending_id),
      anesth: anesthesiologists.find(a => a.anaesth_id === surgery?.anesthesiologist_id),
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
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">{room.or_id}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">
                      {surgery ? `${surgery.surgery_start} - ${surgery.surgery_end}` : "CLOSED"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">
                      {patient?.patient_name || (surgery ? "Unknown Patient" : "-")}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">
                      {surgery?.surgery_notes || "-"}
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
                        value = room.or_id;
                        break;
                      case "Surgery Hours":
                        value = surgery ? `${surgery.surgery_start} - ${surgery.surgery_end}` : "CLOSED";
                        break;
                      case "Patient":
                        value = patient?.patient_name || (surgery ? "Unknown Patient" : "-");
                        break;
                      case "Procedure":
                        value = surgery?.surgery_notes || "-";
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
    </div>
  );
};

export default Dashboard;
