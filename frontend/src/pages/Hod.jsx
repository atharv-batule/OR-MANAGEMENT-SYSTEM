import React, { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import HodForm from "../components/forms/HodForm";

const Hod = () => {
  // Hardcoded Data
  const [hod1, setHod] = useState([
    {
      hod_id: 1,
      fname: "Meridith",
      lname: "Grey",
      dnumber: "D001",
      dname: "Neurology",
      start_date: "2023-01-15",
    },
    {
      hod_id: 2,
      fname: "Christina",
      lname: "Yang",
      dnumber: "D002",
      dname: "Cardiology",
      start_date: "2022-09-10",
    },
    {
      hod_id: 6,
      fname: "Richard",
      lname: "Weber",
      dnumber: "D003",
      dname: "Orthopedics",
      start_date: "2021-12-05",
    },
    {
      hod_id: 16,
      fname: "Lexie",
      lname: "Grey",
      dnumber: "D004",
      dname: "Dermatology",
      start_date: "2023-05-20",
    },
    {
      hod_id: 4,
      fname: "Miranda",
      lname: "Bailey",
      dnumber: "D005",
      dname: "Pediatrics",
      start_date: "2020-11-01",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingHod, setEditingHod] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleEdit = (hod) => {
    const mapped = {
      hod_id: hod.hod_id,
      hod_name: `${hod.fname} ${hod.lname}`,
      hod_dnumber: hod.dnumber,
      hod_dname: hod.dname,
      hod_start_date: hod.start_date,
    };

    setEditingHod(mapped);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this HOD?")) {
      setHod((prev) => prev.filter((item) => item.hod_id !== id));
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingHod(null);
  };

  return (
    <div className="space-y-6">
      {/* Search + Add */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search HOD..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Head of Department
        </Button>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  HOD Id
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Dept No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Start Date
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {hod1.map((hod) => (
                <tr key={hod.hod_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {hod.hod_id}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {hod.fname + " " + hod.lname}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {hod.dnumber}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {hod.dname}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {hod.start_date}
                  </td>

                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(hod)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(hod.hod_id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
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

      {/* Form Modal */}
      <HodForm isOpen={showForm} onClose={handleCloseForm} hod={editingHod} />
    </div>
  );
};

export default Hod;
