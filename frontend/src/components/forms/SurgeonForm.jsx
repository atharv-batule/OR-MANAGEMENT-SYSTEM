import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import axios from 'axios';
// // Convert "yyyy-mm-dd" → "dd-mm-yyyy"
// const formatDateToDisplay = (dateStr) => {
//   if (!dateStr) return '';
//   const [year, month, day] = dateStr.split('-');
//   return `${day}-${month}-${year}`;
// };

// // Convert "dd-mm-yyyy" → "yyyy-mm-dd" (for saving)
// const formatDateToInput = (dateStr) => {
//   if (!dateStr) return '';
//   const [day, month, year] = dateStr.split('-');
//   return `${year}-${month}-${day}`;
// };


const SurgeonForm = ({ isOpen, onClose, surgeon = null }) => {
  const { addSurgeon, updateSurgeon } = useApp();
  const isEditing = !!surgeon;

  const [formData, setFormData] = useState({
    employee_id: '',
    surgeon_name: '',
    surgeon_dob: '',
    surgeon_gender: '',
    surgeon_salary: '',
    surgeon_speciality: '',
    surgeon_contact: '',
    surgeon_experience_years: '',
    supervisor_id: '',
    surgeon_designation: '', 
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (surgeon) {
      setFormData({
        employee_id: surgeon.employee_id || '',
        surgeon_name: surgeon.surgeon_name || '',
        surgeon_dob: surgeon.surgeon_dob || '',
        surgeon_gender: surgeon.surgeon_gender || '',
        surgeon_salary: surgeon.surgeon_salary || '',
        surgeon_speciality: surgeon.surgeon_speciality || '',
        surgeon_contact: surgeon.surgeon_contact || '',
        surgeon_experience_years: surgeon.surgeon_experience_years || '',
        supervisor_id: surgeon.supervisor_id || '',
        surgeon_designation: surgeon.surgeon_designation || '', 
      });
    } else {
      setFormData({
        employee_id: '',
        surgeon_name: '',
        surgeon_dob: '',
        surgeon_gender: '',
        surgeon_salary: '',
        surgeon_speciality: '',
        surgeon_contact: '',
        surgeon_experience_years: '',
        supervisor_id: '',
        surgeon_designation: '',
      });
    }
    setErrors({});
  }, [surgeon, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employee_id.trim()) newErrors.employee_id = 'Employee ID is required';
    if (!formData.surgeon_name.trim()) newErrors.surgeon_name = 'Name is required';
    if (!formData.surgeon_dob.trim()) newErrors.surgeon_dob = 'Date of Birth is required';
    if (!formData.surgeon_gender.trim()) newErrors.surgeon_gender = 'Gender is required';
    if (!formData.surgeon_salary || formData.surgeon_salary <= 0) newErrors.surgeon_salary = 'Valid salary is required';
    if (!formData.surgeon_speciality.trim()) newErrors.surgeon_speciality = 'Speciality is required';
    if (!formData.surgeon_contact.trim() || formData.surgeon_contact.length < 10 || formData.surgeon_contact.length > 13)
      newErrors.surgeon_contact = 'Valid contact number required';    
    if (!formData.surgeon_experience_years || formData.surgeon_experience_years < 0)
      newErrors.surgeon_experience_years = 'Valid experience years required';
    if (!formData.supervisor_id.trim()) newErrors.supervisor_id = 'Supervisor ID is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;

  //   setIsSubmitting(true);
  //   try {
  //     if (isEditing) {
  //       updateSurgeon(surgeon.surgeon_id, formData);
  //     } else {
  //       addSurgeon(formData);
  //     }
  //     onClose();
  //   } catch (error) {
  //     console.error('Error saving surgeon:', error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsSubmitting(true);

  try {
    if (isEditing) {
      await axios.put(`http://localhost:3000/patients`, payload);
      // Update not yet implemented on backend
      console.log("Update logic pending");
    } else {
       const payload = {
  employee_id: parseInt(formData.employee_id),
  surgeon_salary: parseInt(formData.surgeon_salary),
  supervisor_id: parseInt(formData.supervisor_id),
  surgeon_name: formData.surgeon_name,
  surgeon_dob: formData.surgeon_dob,
  surgeon_gender: formData.surgeon_gender,
  surgeon_designation: formData.surgeon_designation,
  surgeon_contact:formData.surgeon_contact
};
await axios.post("http://localhost:3000/surgeons", payload);
      console.log("✅ Surgeon added successfully");
    }

    onClose();
  } catch (err) {
    console.error("❌ Error saving surgeon:", err);
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
      title={isEditing ? 'Edit Surgeon' : 'Add New Surgeon'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Employee ID"
            required
            value={formData.employee_id}
            onChange={(e) => handleInputChange('employee_id', e.target.value)}
            error={errors.employee_id}
            placeholder="EMP001"
          />

          <Input
            label="Full Name"
            required
            value={formData.surgeon_name}
            onChange={(e) => handleInputChange('surgeon_name', e.target.value)}
            error={errors.surgeon_name}
            placeholder="Dr. John Smith"
          />

          <Input
            label="Date of Birth"
            type="date"
            required
            value={formData.surgeon_dob || ''}
            onChange={(e) => {
            const dateValue = e.target.value;
           // const formatted = formatDateToDisplay(dateValue);
            handleInputChange('surgeon_dob', dateValue);
            }}
            error={errors.surgeon_dob}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={formData.surgeon_gender}
              onChange={(e) => handleInputChange('surgeon_gender', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.surgeon_gender && (
              <p className="text-red-500 text-sm mt-1">{errors.surgeon_gender}</p>
            )}
          </div>

          <Input
            label="Salary"
            type="number"
            required
            value={formData.surgeon_salary}
            onChange={(e) => handleInputChange('surgeon_salary', e.target.value)}
            error={errors.surgeon_salary}
            placeholder="Enter salary amount"
            min="0"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
            <select
              value={formData.surgeon_designation}
              onChange={(e) => handleInputChange('surgeon_designation', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select designation</option>
              <option value="Intern">Intern</option>
              <option value="Resident">Resident</option>
              <option value="Attending">Attending</option>
            </select>
            {errors.surgeon_designation && (
              <p className="text-red-500 text-sm mt-1">{errors.surgeon_designation}</p>
            )}
          </div>

          <Input
            label="Experience (Years)"
            type="number"
            required
            value={formData.surgeon_experience_years}
            onChange={(e) => handleInputChange('surgeon_experience_years', parseInt(e.target.value) || '')}
            error={errors.surgeon_experience_years}
            placeholder="Years of experience"
            min="0"
            max="50"
          />

          <Input
            label="Speciality"
            required
            value={formData.surgeon_speciality}
            onChange={(e) => handleInputChange('surgeon_speciality', e.target.value)}
            error={errors.surgeon_speciality}
            placeholder="e.g., Cardiothoracic Surgery"
          />

          <Input
            label="Contact No."
            type="tel"
            required
            value={formData.surgeon_contact}
            onChange={(e) => handleInputChange('surgeon_contact', e.target.value)}
            error={errors.surgeon_contact}
            placeholder="e.g., +91 1234567890"
          />

          <Input
            label="Supervisor ID"
            required
            value={formData.supervisor_id}
            onChange={(e) => handleInputChange('supervisor_id', e.target.value)}
            error={errors.supervisor_id}
            placeholder="SUP001"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Surgeon' : 'Add Surgeon'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SurgeonForm;
