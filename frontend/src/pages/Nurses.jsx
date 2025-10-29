import React, { useState ,useEffect} from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import NurseForm from '../components/forms/NurseForm';
import axios from 'axios';

const Nurses = () => {
  useEffect(() => {
      axios
        .get("http://localhost:3000/nurses")
        .then(res => {
          console.log("Fetched nurses:", res.data);
          setNurses(res.data);
        })
        .catch(err => console.error(err));
    }, []);
  const [nurses1, setNurses] = useState([]);
  const { nurses, deleteNurse } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingNurse, setEditingNurse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNurses = nurses1.filter(nurse =>
    nurse.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nurse.nurse_department.toLowerCase().includes(searchTerm.toLowerCase()
  )
  );

  const handleEdit = (nurse) => {
    const mappedNurse = {
      empid: nurse.empid || '',
      nurse_name: `${nurse.fname || ''} ${nurse.lname || ''}`.trim(),
      nurse_dob: nurse.dob || '',
      nurse_gender: nurse.gender || '',
      nurse_salary: nurse.salary || '',
      nurse_contact: nurse.phone || '',
      nurse_supervisor_id: nurse.superid || '',
      nurse_experience_years: nurse.nurse_experience_years || '',
      nurse_shift: nurse.nurse_shift || 'Morning'
    };
  
    setEditingNurse(mappedNurse);
    setShowForm(true);
  };

  const handleDelete = (nurseId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      axios.delete("http://localhost:3000/nurses",{ data: { empid: employee_id } })
    }
     window.location.reload();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingNurse(null);
  };

  return (
    <div className="space-y-6">
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
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Nurse
        </Button>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNurses.map((nurse) => (
          <Card key={nurse.nurse_id} hover>
            <Card.Content>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{nurse.nurse_name}</h4>
                <div className="flex space-x-1">
                  <button onClick={() => handleEdit(nurse)} className="p-1 text-gray-400 hover:text-blue-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(nurse.nurse_id)} className="p-1 text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{nurse.nurse_department}</p>
              <p className="text-sm text-gray-600 mb-1">{nurse.nurse_shift} Shift</p>
              <p className="text-sm text-gray-600">{nurse.nurse_contact}</p>
            </Card.Content>
          </Card>
        ))}
      </div> */}

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Id</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor Id</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {nurses1.map((nurse) => (
                <tr key={nurse.empid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{nurse.empid}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{nurse.fname+" "+nurse.lname}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nurse.nurse_experience_years||0} years</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nurse.superid}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nurse.nurse_shift||"morning"} Shift</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nurse.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nurse.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nurse.dob}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nurse.salary}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleEdit(nurse)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(nurse.empid)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
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

      <NurseForm isOpen={showForm} onClose={handleCloseForm} nurse={editingNurse} />
    </div>
  );
};

export default Nurses;
