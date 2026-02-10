import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import axios from 'axios';

const OperationRoomForm = ({ isOpen, onClose, operationRoom }) => {
  const [formData, setFormData] = useState({
    orid: '',
    status: 'Available',
    equipments: ''
  });

  useEffect(() => {
    if (operationRoom) {
      setFormData({
        orid: operationRoom.orid || '',
        status: operationRoom.status || 'Available',
        equipments: operationRoom.equipments || ''
      });
    } else {
      setFormData({
        orid: '',
        status: 'Available',
        equipments: ''
      });
    }
  }, [operationRoom]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (operationRoom) {
        // Update existing operation room
        await axios.put("http://localhost:3000/operation-rooms", formData);
        console.log("✅ Operation room updated successfully");
      } else {
        // Create new operation room
        await axios.post("http://localhost:3000/operation-rooms", formData);
        console.log("✅ Operation room created successfully");
      }
      
      onClose(); // This will trigger fetchOperationRooms in parent
    } catch (err) {
      console.error("❌ Error saving operation room:", err);
      alert(`Failed to ${operationRoom ? 'update' : 'create'} operation room`);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={operationRoom ? "Edit Operation Room" : "Add Operation Room"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            OR Number *
          </label>
          <input
            type="text"
            name="orid"
            value={formData.orid}
            onChange={handleChange}
            disabled={operationRoom} // Disable editing OR ID
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Equipment List (comma-separated) *
          </label>
          <textarea
            name="equipments"
            value={formData.equipments}
            onChange={handleChange}
            required
            rows={4}
            placeholder="e.g., Surgical table, Anesthesia machine, Monitor"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {operationRoom ? 'Update' : 'Create'} Operation Room
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default OperationRoomForm;