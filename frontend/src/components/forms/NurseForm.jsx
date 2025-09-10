import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

const NurseForm = ({ isOpen, onClose, nurse = null }) => {
  const { addNurse, updateNurse } = useApp();
  const isEditing = !!nurse;

  const [formData, setFormData] = useState({
    nurse_name: '',
    nurse_contact: '',
    nurse_department: '',
    nurse_shift: 'Morning'
  });

  useEffect(() => {
    if (nurse) {
      setFormData({
        nurse_name: nurse.nurse_name,
        nurse_contact: nurse.nurse_contact,
        nurse_department: nurse.nurse_department,
        nurse_shift: nurse.nurse_shift
      });
    } else {
      setFormData({
        nurse_name: '',
        nurse_contact: '',
        nurse_department: '',
        nurse_shift: 'Morning'
      });
    }
  }, [nurse, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        updateNurse(nurse.nurse_id, formData);
      } else {
        addNurse(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving nurse:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Nurse' : 'Add New Nurse'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            required
            value={formData.nurse_name}
            onChange={(e) => handleInputChange('nurse_name', e.target.value)}
          />
          <Input
            label="Contact"
            required
            value={formData.nurse_contact}
            onChange={(e) => handleInputChange('nurse_contact', e.target.value)}
          />
          <Input
            label="Department"
            required
            value={formData.nurse_department}
            onChange={(e) => handleInputChange('nurse_department', e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shift</label>
            <select
              value={formData.nurse_shift}
              onChange={(e) => handleInputChange('nurse_shift', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">{isEditing ? 'Update' : 'Add'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default NurseForm;
