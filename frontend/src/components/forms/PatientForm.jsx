import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

const PatientForm = ({ isOpen, onClose, patient = null }) => {
  const { addPatient, updatePatient } = useApp();
  const isEditing = !!patient;

  const [formData, setFormData] = useState({
    patient_name: '',
    patient_age: '',
    patient_gender: 'Male',
    patient_contact: '',
    patient_medical_history: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (patient) {
      setFormData({
        patient_name: patient.patient_name,
        patient_age: patient.patient_age,
        patient_gender: patient.patient_gender,
        patient_contact: patient.patient_contact,
        patient_medical_history: patient.patient_medical_history
      });
    } else {
      setFormData({
        patient_name: '',
        patient_age: '',
        patient_gender: 'Male',
        patient_contact: '',
        patient_medical_history: ''
      });
    }
    setErrors({});
  }, [patient, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patient_name.trim()) {
      newErrors.patient_name = 'Patient name is required';
    }

    if (!formData.patient_age || formData.patient_age <= 0) {
      newErrors.patient_age = 'Valid age is required';
    }

    if (!formData.patient_contact.trim()) {
      newErrors.patient_contact = 'Contact information is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        updatePatient(patient.patient_id, formData);
      } else {
        addPatient(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving patient:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Patient' : 'Add New Patient'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            required
            value={formData.patient_name}
            onChange={(e) => handleInputChange('patient_name', e.target.value)}
            error={errors.patient_name}
            placeholder="Enter patient's full name"
          />

          <Input
            label="Age"
            type="number"
            required
            value={formData.patient_age}
            onChange={(e) => handleInputChange('patient_age', parseInt(e.target.value) || '')}
            error={errors.patient_age}
            placeholder="Enter age"
            min="0"
            max="120"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.patient_gender}
              onChange={(e) => handleInputChange('patient_gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <Input
            label="Contact Information"
            type="tel"
            required
            value={formData.patient_contact}
            onChange={(e) => handleInputChange('patient_contact', e.target.value)}
            error={errors.patient_contact}
            placeholder="Phone number or email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medical History
          </label>
          <textarea
            value={formData.patient_medical_history}
            onChange={(e) => handleInputChange('patient_medical_history', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter relevant medical history, allergies, current medications, etc."
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Patient' : 'Add Patient'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PatientForm;
