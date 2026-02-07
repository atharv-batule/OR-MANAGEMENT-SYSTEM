import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import HodForm from "../components/forms/HodForm";
import axios from "axios";
import{ jwtDecode }from "jwt-decode";

const token = localStorage.getItem("token");
const payload = token ? jwtDecode(token) : null;
const role = payload?.role;
console.log(role);
console.log(payload);
console.log(token)

const Hod = () => {
  const [hod1, setHod] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHod, setEditingHod] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch HODs from backend
  useEffect(() => {
    axios
      .get("https://or-management-system.onrender.com/hod")
      .then((res) => {
        console.log("Fetched HOD:", res.data);
        setHod(res.data.hodData);
      })
      .catch((err) => console.error(err));
  }, []);

  // Edit handler
  const handleEdit = (hod) => {
    const mapped = {
      hod_id: hod.hod_id,
      hod_dnumber: hod.dnumber,
      hod_dname: hod.dname,
      hod_start_date: hod.start_date,
    };

    setEditingHod(mapped);
    setShowForm(true);
  };

  // Delete handler
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this HOD?")) {
      axios
        .delete("https://or-management-system.onrender.com/hod", {
          data: { hod_id: parseInt(id) },
        })
        .then(() => {
          setHod((prev) => prev.filter((item) => item.hod_id !== id));
        })
        .catch((err) => console.error(err));
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

        {(role=="admin"||role=="surgeon")&&<Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Head of Department
        </Button>}
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "HOD Id",
                  "Name",
                  "Dept No.",
                  "Department",
                  "Start Date",
                
                ].map((col) => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {col}
                  </th>
                ))}
                {(role=="admin"||role=="surgeon")&&<th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    ACTIONS
                  </th>}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {hod1
                .filter((hod) => {
                  if (!searchTerm) return true;
                  const s = searchTerm.toLowerCase();

                  return (
                    hod.hod_id.toString().includes(s) ||
                    hod.dname.toLowerCase().includes(s) ||
                    hod.dnumber.toString().includes(s)
                  );
                })
                .map((hod) => (
                  <tr key={hod.hod_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {hod.hod_id}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {hod.fname} {hod.lname}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {hod.dnumber}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {hod.dname}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {hod.start_date.split("T")[0]}
                    </td>

                   {(role=="admin"||role=="surgeon")&& <td className="px-6 py-4 text-right text-sm font-medium">
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
                    }
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
