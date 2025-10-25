import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import axios from 'axios';

const PatientForm = ({ isOpen, onClose, patient = null }) => {
  const { addPatient, updatePatient } = useApp();
  const isEditing = !!patient;

  const [formData, setFormData] = useState({
    patient_num: '',
    patient_name: '',
    patient_age: '',
    patient_gender: '',
    patient_dob: '',
    patient_contact: '',
    patient_address: '',
    patient_medical_history: '',
    //surgery_id: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill form when editing
  useEffect(() => {
    if (patient) {
      setFormData({
        patient_num: patient.patient_num || '',
        patient_name: patient.patient_name || '',
        patient_age: patient.patient_age || '',
        patient_gender: patient.patient_gender || 'Male',
        patient_dob: patient.patient_dob || '',
        patient_contact: patient.patient_contact || '',
        patient_address: patient.patient_address || '',
        patient_medical_history: patient.patient_medical_history || '',
        //surgery_id: patient.surgery_id || '',
      });
    } else {
      // Reset form when not editing
      setFormData({
        patient_num: '',
        patient_name: '',
        patient_gender: '',
        patient_dob: '',
        patient_contact: '',
        patient_address: '',
        patient_medical_history: '',
        //surgery_id: '',
      });
    }
    
    setErrors({});
  }, [patient, isOpen]);

  
  const validateForm = () => {
    const newErrors = {};

    if (!formData.patient_num.toString().trim() || formData.patient_num <= 0) 
      newErrors.patient_num = 'Patient ID is required';
    if (!formData.patient_name.trim()) 
      newErrors.patient_name = 'Patient name is required';
    if (!formData.patient_dob.trim()) 
      newErrors.patient_dob = 'Date of birth is required';
    if (!formData.patient_contact.trim()) 
      newErrors.patient_contact = 'Contact is required';
    if (!formData.patient_address.trim()) 
      newErrors.patient_address = 'Address is required';
    // if (!formData.surgery_id.toString().trim()) 
    //   newErrors.surgery_id = 'Surgery ID is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const formatDate = (value) => {
    const [year, month, day] = value.split('-');
    if (year && month && day) return `${day}-${month}-${year}`;
    return value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        patient_num: parseInt(formData.patient_num),
        patient_name: formData.patient_name,
        patient_gender: formData.patient_gender,
        patient_dob: formData.patient_dob,
        patient_contact: formData.patient_contact,
        patient_address: formData.patient_address,
        patient_medical_history: formData.patient_medical_history
        // surgery_id: parseInt(formData.surgery_id)
      };

      if (isEditing) {
        // Update patient in database via backend API
        // await axios.put(`http://localhost:3000/patients`, payload);
        // updatePatient(patient.patient_num, payload);
        console.log("✅ Patient updated successfully");
      } else {
        // Add new patient to database via backend API
        await axios.post("http://localhost:3000/patients", payload);
        //addPatient(payload);
        console.log("✅ Patient added successfully");
      }
      
      onClose();
    } catch (error) {
      console.error('❌ Error saving patient:', error);
      console.error('Error details:', error.response?.data);
      alert(`Failed to save patient: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Patient' : 'Add New Patient'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Patient ID"
            required
            value={formData.patient_num}
            onChange={(e) => handleInputChange('patient_num', e.target.value)}
            error={errors.patient_num}
            placeholder="Enter patient Number"
          />

          {/* <Input
            label="Surgery ID"
            required
            value={formData.surgery_id}
            onChange={(e) => handleInputChange('surgery_id', e.target.value)}
            error={errors.surgery_id}
            placeholder="Enter surgery ID"
          /> */}

          <Input
            label="Full Name"
            required
            value={formData.patient_name}
            onChange={(e) => handleInputChange('patient_name', e.target.value)}
            error={errors.patient_name}
            placeholder="Enter patient's full name"
          />

          

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.patient_gender}
              onChange={(e) => handleInputChange('patient_gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.patient_dob}
              onChange={(e) => handleInputChange('patient_dob', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.patient_dob ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.patient_dob && (
              <p className="text-red-500 text-sm mt-1">{errors.patient_dob}</p>
            )}
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

          <Input
            label="Address"
            required
            value={formData.patient_address}
            onChange={(e) => handleInputChange('patient_address', e.target.value)}
            error={errors.patient_address}
            placeholder="Enter patient's address"
          />
        </div>

        {/* Medical history */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medical History
          </label>
          <textarea
            value={formData.patient_medical_history}
            onChange={(e) =>
              handleInputChange('patient_medical_history', e.target.value)
            }
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter relevant medical history, allergies, etc."
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Saving...'
              : isEditing
              ? 'Update Patient'
              : 'Add Patient'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PatientForm;