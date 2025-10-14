import React from 'react';
import { useApp } from '../context/AppContext';
import { Users, UserPlus, Stethoscope, Shield, Building, Calendar, Activity, Clock } from 'lucide-react';
import Card from '../components/ui/Card';

const Dashboard = () => {
  const { patients, surgeons, anesthesiologists, nurses, operationRooms, surgeries } = useApp();

  const stats = [
    {
      title: 'Total Patients',
      value: patients.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Surgeons',
      value: surgeons.length,
      icon: UserPlus,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Anesthesiologists',
      value: anesthesiologists.length,
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Nurses',
      value: nurses.length,
      icon: Stethoscope,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      title: 'Operation Rooms',
      value: operationRooms.length,
      icon: Building,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Total Surgeries',
      value: surgeries.length,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const availableRooms = operationRooms.filter(room => room.availability_status === 'Available');
  const occupiedRooms = operationRooms.filter(room => room.availability_status === 'Occupied');
  const scheduledSurgeries = surgeries.filter(surgery => surgery.status === 'Scheduled');
  const inProgressSurgeries = surgeries.filter(surgery => surgery.status === 'In Progress');

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <Card.Content>
                <div className="flex items-center">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </Card.Content>
            </Card>
          );
        })}
      </div>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operation Room Status */}
        <Card>
          <Card.Content>
            <div className="flex items-center mb-4">
              <Activity className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Operation Room Status</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Available Rooms</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="font-medium text-gray-900">{availableRooms.length}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Occupied Rooms</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  <span className="font-medium text-gray-900">{occupiedRooms.length}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Maintenance</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="font-medium text-gray-900">
                    {operationRooms.filter(room => room.availability_status === 'Maintenance').length}
                  </span>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Surgery Status */}
        <Card>
          <Card.Content>
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Surgery Status</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Scheduled</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span className="font-medium text-gray-900">{scheduledSurgeries.length}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">In Progress</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  <span className="font-medium text-gray-900">{inProgressSurgeries.length}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="font-medium text-gray-900">
                    {surgeries.filter(surgery => surgery.status === 'Completed').length}
                  </span>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
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
                  <tr key={room.or_id} className="hover:bg-gray-50">
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


      {/* Recent Surgeries */}
      <Card>
        <Card.Header>
          <Card.Title>Recent Surgeries</Card.Title>
        </Card.Header>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Surgery Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Surgeon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {surgeries.slice(0, 5).map((surgery) => {
                const patient = patients.find(p => p.patient_id === surgery.patient_id);
                const surgeon = surgeons.find(s => s.surgeon_id === surgery.surgeon_id);
                
                return (
                  <tr key={surgery.surgery_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {patient?.patient_name || 'Unknown Patient'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {surgery.surgery_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {surgery.surgery_date} at {surgery.surgery_time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {surgeon?.surgeon_name || 'Unknown Surgeon'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        surgery.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                        surgery.status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                        surgery.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {surgery.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
