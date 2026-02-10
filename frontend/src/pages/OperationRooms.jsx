import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import OperationRoomForm from '../components/forms/OperationRoomForm';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");
const payload = token ? jwtDecode(token) : null;
const role = payload?.role;

const OperationRooms = () => {
  const [operationRooms1, setOperationRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch operation rooms
  const fetchOperationRooms = async () => {
    try {
      const res = await axios.get("http://localhost:3000/operation-rooms");
      console.log("Fetched OR Details:", res.data);
      setOperationRooms(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOperationRooms();
  }, []);

  // Filtered rooms based on search
  const filteredRooms = operationRooms1.filter(room => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    const orNumberMatch = (room.orid || "").toString().toLowerCase().includes(s);
    const equipmentsMatch = (room.equipments || "").toLowerCase().includes(s);
    return orNumberMatch || equipmentsMatch;
  });

  const handleEdit = (room) => {
    const mappedRoom = {
      orid: room.orid || "",
      status: room.status || "Available",
      equipments: Array.isArray(room.equipments)
        ? room.equipments.join(", ")
        : room.equipments || ""
    };
    setEditingRoom(mappedRoom);
    setShowForm(true);
  };

  const handleDelete = async (orid) => {
    if (!window.confirm("Are you sure you want to delete this OR?")) return;
    
    try {
      await axios.delete(
        "http://localhost:3000/operation-rooms",
        { data: { orid } }
      );
      
      // Update state instead of reloading
      setOperationRooms(prev => prev.filter(r => r.orid !== orid));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete operation room");
    }
  };

  const handleCloseForm = async () => {
    setShowForm(false);
    setEditingRoom(null);
    // Refresh data instead of reloading page
    await fetchOperationRooms();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Available": return "bg-green-100 text-green-800";
      case "Occupied": return "bg-red-100 text-red-800";
      case "Maintenance": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search + Add */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by OR number or equipment..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {(role === "admin" || role === "surgeon") && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Operation Room
          </Button>
        )}
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OR Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment List</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                {(role === "admin" || role === "surgeon") && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRooms.map((room) => (
                <tr key={room.orid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {room.orid}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    <ul className="list-disc list-inside">
                      {(room.equipments || "")
                        .split(",")
                        .map((eq, index) => <li key={index}>{eq.trim()}</li>)}
                    </ul>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.status)}`}>
                      {room.status}
                    </span>
                  </td>

                  {(role === "admin" || role === "surgeon") && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(room)}
                          className="p-2 text-gray-400 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(room.orid)}
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

      {/* Form */}
      <OperationRoomForm
        isOpen={showForm}
        onClose={handleCloseForm}
        operationRoom={editingRoom}
      />
    </div>
  );
};

export default OperationRooms;