import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import axios from 'axios';
const OperationRoomForm = ({ isOpen, onClose, operationRoom = null }) => {
  const { addOperationRoom, updateOperationRoom } = useApp();
  const isEditing = !!operationRoom;

  const [formData, setFormData] = useState({
    room_number: '',
    availability_status: 'Available',
    equipment_list: ''
  });

  useEffect(() => {
    if (operationRoom) {
      setFormData({
        room_number: operationRoom.orid,
        availability_status: operationRoom.status,
        equipment_list: operationRoom.equipments.join(', ')
      });
    } else {
      setFormData({
        room_number: '',
        availability_status: 'Available',
        equipment_list: ''
      });
    }
  }, [operationRoom, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roomData = {
      ...formData,
      equipment_list: formData.equipment_list.split(',').map(item => item.trim()).filter(item => item)
    };

    try {
      const payload = {
        room_number: parseInt(formData.room_number),
        availability_status: formData.availability_status,
        equipment_list: formData.equipment_list
      };
      if (isEditing) {
        try {
          const payload = {
            room_number: parseInt(formData.room_number),
            availability_status: formData.availability_status,
            equipment_list: formData.equipment_list
          };
        
          if (isEditing) {
            await axios.put(`https://or-management-system.onrender.com/operation-rooms`, payload);
            console.log("✅ Operation room updated successfully");
          } else {
            await axios.post("https://or-management-system.onrender.com/operation-rooms", payload);
            console.log("✅ Operation room added successfully");
          }
        
          onClose();
        } catch (error) {
          console.error("❌ Error saving operation room:", error);
        }
      } else {
        //addOperationRoom(roomData);
        await axios.post("https://or-management-system.onrender.com/operation-rooms", payload);
        console.log(" OR added successfully");
      }
      onClose();
    } catch (error) {
      console.error('Error saving operation room:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Operation Room' : 'Add New Operation Room'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Room Number"
            required
            value={formData.room_number}
            onChange={(e) => handleInputChange('room_number', e.target.value)}
            placeholder="OR-101"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Availability Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.availability_status}
              onChange={(e) => handleInputChange('availability_status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Equipment List
          </label>
          <textarea
            value={formData.equipment_list}
            onChange={(e) => handleInputChange('equipment_list', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter equipment separated by commas (e.g., Anesthesia Machine, Operating Table, Surgical Lights)"
          />
          <p className="mt-1 text-sm text-gray-500">Separate equipment with commas</p>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">{isEditing ? 'Update' : 'Add'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default OperationRoomForm;
