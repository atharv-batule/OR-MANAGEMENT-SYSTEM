import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import SurgeryForm from "../components/forms/SurgeryForm";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");
const payload = token ? jwtDecode(token) : null;
const role = payload?.role;

const Surgeries = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingSurgery, setEditingSurgery] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [surgeries, setSurgeries] = useState([]);

  /* ================= FETCH SURGERIES ================= */
  useEffect(() => {
    axios
      .get("https://or-management-system.onrender.com/surgery")
      .then(res => {
        setSurgeries(res.data.result || []);
      })
      .catch(err => {
        console.error("Failed to fetch surgeries:", err);
      });
  }, []);

  /* ================= HANDLERS ================= */
  const handleEdit = (surgery) => {
    setEditingSurgery(surgery);
    setShowForm(true);
  };

  const handleDelete = async (surgeryId) => {
    if (!window.confirm("Are you sure you want to delete this surgery?")) return;

    try {
      await axios.delete("https://or-management-system.onrender.com/surgery", {
        data: { surgery_id: surgeryId }
      });

      setSurgeries(prev => prev.filter(s => s.surgery_id !== surgeryId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete surgery");
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSurgery(null);
  };

  /* ================= SEARCH ================= */
  const matchesSearch = (surgery) => {
    const term = searchTerm.toLowerCase();

    return [
      surgery.surgery_id,
      surgery.patient_id,
      surgery.or_id,
      surgery.procedure,
      surgery.attending_name,
      surgery.intern_name,
      surgery.resident_name,
      surgery.nurse_name,
      surgery.anesthesiologist_name
    ]
      .filter(Boolean)
      .some(v => v.toString().toLowerCase().includes(term));
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* Search + Add */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search surgeries..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {(role === "admin" || role === "surgeon") && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Surgery
          </Button>
        )}
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Surgery ID", "Patient ID", "OR ID", "Procedure",
                  "Date", "Start", "End", "Notes",
                  "Attending", "Intern", "Resident", "Nurse", "Anesthesiologist"
                ].map(col => (
                  <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {col}
                  </th>
                ))}
                {(role === "admin" || role === "surgeon") && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {surgeries.filter(matchesSearch).map(surgery => (
                <tr key={surgery.surgery_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{surgery.surgery_id}</td>
                  <td className="px-6 py-4">{surgery.patient_id}</td>
                  <td className="px-6 py-4">{surgery.or_id}</td>
                  <td className="px-6 py-4">{surgery.procedure}</td>
                  <td className="px-6 py-4">
                    {surgery.surgery_date
                      ? new Date(surgery.surgery_date).toISOString().split("T")[0]
                      : "-"}
                  </td>
                  <td className="px-6 py-4">{surgery.surgery_start}</td>
                  <td className="px-6 py-4">{surgery.surgery_end}</td>
                  <td className="px-6 py-4">{surgery.surgery_notes}</td>
                  <td className="px-6 py-4">{surgery.attending_name}</td>
                  <td className="px-6 py-4">{surgery.intern_name}</td>
                  <td className="px-6 py-4">{surgery.resident_name}</td>
                  <td className="px-6 py-4">{surgery.nurse_name}</td>
                  <td className="px-6 py-4">{surgery.anesthesiologist_name}</td>

                  {(role === "admin" || role === "surgeon") && (
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(surgery)}
                          className="p-2 text-gray-400 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(surgery.surgery_id)}
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

      {/* Modal */}
      <SurgeryForm
        isOpen={showForm}
        onClose={handleCloseForm}
        surgery={editingSurgery}
      />
    </div>
  );
};

export default Surgeries;
