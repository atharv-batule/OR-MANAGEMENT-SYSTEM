import React, { useState ,useEffect} from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import NurseForm from '../components/forms/NurseForm';
import axios from 'axios';
import{ jwtDecode }from "jwt-decode";

const token = localStorage.getItem("token");
const payload = token ? jwtDecode(token) : null;
const role = payload?.role;
// console.log(role);
// console.log(payload);
// console.log(token)

const Nurses = () => {
  const [nurses1, setNurses] = useState([]);
  const { deleteNurse } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingNurse, setEditingNurse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios
      .get("https://or-management-system.onrender.com/nurses")
      .then(res => {
        console.log("Fetched nurses:", res.data);
        setNurses(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleEdit = (nurse) => {
    const mappedNurse = {
      empid: nurse.empid || '',
      nurse_name: `${nurse.fname || ''} ${nurse.lname || ''}`.trim(),
      nurse_dob: nurse.dob || '',
      nurse_gender: nurse.gender || '',
      nurse_salary: nurse.salary || '',
      nurse_contact: nurse.phone || '',
      nurse_supervisor_id: nurse.superid || '',
      nurse_experience_years: nurse.experience || '',
      nurse_shift: nurse.nurse_shift || 'Morning'
    };
    setEditingNurse(mappedNurse);
    setShowForm(true);
  };

  const handleDelete = (nurseId) => {
    if (window.confirm('Are you sure you want to delete this nurse?')) {
      axios.delete("https://or-management-system.onrender.com/nurses", { data: { employee_id: parseInt(nurseId) } })
        .then(() => setNurses(prev => prev.filter(n => n.empid !== nurseId)))
        .catch(err => console.error(err));
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingNurse(null);
  };

  return (
    <div className="space-y-6">
      {/* Search + Add */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search nurses..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {(role=="admin"||role=="surgeon")&&<Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Nurse
        </Button>}
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Employee Id','Name','Experience','Supervisor Id','Shift','Contact','Gender','DOB','Salary',].map(col => (
                  <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col}</th>
                ))}
               {(role=="admin"||role=="surgeon")&& <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {nurses1
                .filter(nurse => {
                  if (!searchTerm) return true;
                  const fullName = `${nurse.fname} ${nurse.lname}`.toLowerCase();
                  return fullName.includes(searchTerm.toLowerCase());
                })
                .map(nurse => (
                  <tr key={nurse.empid} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{nurse.empid}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{nurse.fname} {nurse.lname}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nurse.experience || 0} years</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nurse.superid}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nurse.nurse_shift || "Morning"} Shift</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nurse.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nurse.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nurse.dob.split("T")[0]}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nurse.salary}</td>
                  {(role=="admin"||role=="surgeon")&&  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => handleEdit(nurse)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(nurse.empid)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
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

      <NurseForm isOpen={showForm} onClose={handleCloseForm} nurse={editingNurse} />
    </div>
  );
};

export default Nurses;
