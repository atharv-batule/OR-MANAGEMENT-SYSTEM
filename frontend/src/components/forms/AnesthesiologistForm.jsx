import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import axios from 'axios';

const AnesthesiologistForm = ({ isOpen, onClose, anesthesiologist = null }) => {
  const { addAnesthesiologist, updateAnesthesiologist } = useApp();
  const isEditing = !!anesthesiologist;

  const [formData, setFormData] = useState({
    empid: '',
    anaesth_name: '',
    anaesth_dob: '',
    anaesth_gender: '',
    anaesth_salary: '',
    anaesth_contact: '',
    anaesth_certification: '',
    anaesth_supervisor_id: '',
    anaesth_experience_years: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Convert to string before validation
    if (!String(formData.empid).trim())
      newErrors.empid = 'Employee ID is required.';

    if (!formData.anaesth_name.trim())
      newErrors.anaesth_name = 'Full name is required.';

    if (!formData.anaesth_dob.trim())
      newErrors.anaesth_dob = 'Date of Birth is required.';

    if (!formData.anaesth_gender.trim())
      newErrors.anaesth_gender = 'Please select gender.';

    if (!formData.anaesth_salary || formData.anaesth_salary <= 0)
      newErrors.anaesth_salary = 'Please enter a valid salary.';

    if (!String(formData.anaesth_contact).trim())
      newErrors.anaesth_contact = 'Contact information is required.';
    else if (String(formData.anaesth_contact).length < 10 || String(formData.anaesth_contact).length > 13)
      newErrors.anaesth_contact = 'Contact number must be between 10–13 digits.';

    if (!formData.anaesth_certification?.trim() && !isEditing)
      newErrors.anaesth_certification = 'Certification details are required.';

    if (
      !formData.anaesth_experience_years ||
      isNaN(formData.anaesth_experience_years) ||
      formData.anaesth_experience_years < 0
    )
      newErrors.anaesth_experience_years = 'Valid experience (in years) is required.';

    if (!String(formData.anaesth_supervisor_id).trim())
      newErrors.anaesth_supervisor_id = 'Supervisor ID is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (anesthesiologist) {
      setFormData({
        empid: anesthesiologist.empid || '',
        anaesth_name: anesthesiologist.anaesth_name || '',
        anaesth_dob: anesthesiologist.anaesth_dob ? anesthesiologist.anaesth_dob.split("T")[0] : "",
        anaesth_gender: anesthesiologist.anaesth_gender || '',
        anaesth_salary: anesthesiologist.anaesth_salary || '',
        anaesth_contact: anesthesiologist.anaesth_contact || '',
        anaesth_certification: anesthesiologist.anaesth_certification || '',
        anaesth_supervisor_id: anesthesiologist.anaesth_supervisor_id || '',
        anaesth_experience_years: anesthesiologist.anaesth_experience_years || ''
      });
    } else {
      setFormData({
        empid: '',
        anaesth_name: '',
        anaesth_dob: '',
        anaesth_gender: '',
        anaesth_salary: '',
        anaesth_contact: '',
        anaesth_certification: '',
        anaesth_supervisor_id: '',
        anaesth_experience_years: ''
      });
    }
    setErrors({});
  }, [anesthesiologist, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const payload = {
        employee_id: parseInt(formData.empid),
        anaesth_name: formData.anaesth_name,
        anaesth_dob: formData.anaesth_dob,
        anaesth_gender: formData.anaesth_gender,
        anaesth_designation: "Anesthesiologist",
        anaesth_salary: parseInt(formData.anaesth_salary),
        anaesth_contact: parseInt(formData.anaesth_contact),
        supervisor_id: parseInt(formData.anaesth_supervisor_id),
        anaesth_experience_years: parseInt(formData.anaesth_experience_years)
      };

      if (isEditing) {
        console.log('🩺 Updating anesthesiologist:', payload);
        await axios.put('https://or-management-system.onrender.com/anesthesiologists', payload);
        console.log('✅ Anesthesiologist updated successfully');
      } else {
        console.log('📤 Sending payload:', payload);
        await axios.post('https://or-management-system.onrender.com/anesthesiologists', payload);
        console.log('✅ Anesthesiologist added successfully');
      }
      
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
      alert(`Failed to ${isEditing ? 'update' : 'add'} anesthesiologist. Please check the console for details.`);
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
      title={isEditing ? 'Edit Anesthesiologist' : 'Add New Anesthesiologist'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Employee ID"
            type="number"
            required
            value={formData.empid}
            onChange={(e) => handleInputChange('empid', e.target.value)}
            error={errors.empid}
            placeholder="001"
          />

          <Input
            label="Full Name"
            required
            value={formData.anaesth_name}
            onChange={(e) => handleInputChange('anaesth_name', e.target.value)}
            error={errors.anaesth_name}
            placeholder="Dr. Jane Smith"
          />

          <Input
            label="Supervisor ID"
            type="number"
            required
            value={formData.anaesth_supervisor_id}
            onChange={(e) => handleInputChange('anaesth_supervisor_id', e.target.value)}
            error={errors.anaesth_supervisor_id}
            placeholder="001"
          />

          <Input
            label="Date of Birth"
            type="date"
            required
            value={formData.anaesth_dob}
            onChange={(e) => handleInputChange('anaesth_dob', e.target.value)}
            error={errors.anaesth_dob}
          />

          <Input
            label="Contact"
            type="tel"
            required
            value={formData.anaesth_contact}
            onChange={(e) => handleInputChange('anaesth_contact', e.target.value)}
            error={errors.anaesth_contact}
            placeholder="Phone number"
          />

          <Input
            label="Experience (Years)"
            type="number"
            required
            value={formData.anaesth_experience_years}
            onChange={(e) => handleInputChange('anaesth_experience_years', e.target.value)}
            error={errors.anaesth_experience_years}
            placeholder="Years of experience"
            min="0"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.anaesth_gender}
              onChange={(e) => handleInputChange('anaesth_gender', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                errors.anaesth_gender ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.anaesth_gender && (
              <p className="text-red-500 text-sm mt-1">{errors.anaesth_gender}</p>
            )}
          </div>

          <Input
            label="Salary"
            type="number"
            required
            value={formData.anaesth_salary}
            onChange={(e) => handleInputChange('anaesth_salary', e.target.value)}
            error={errors.anaesth_salary}
            placeholder="Enter salary amount"
            min="0"
          />

          {!isEditing && (
            <Input
              label="Certification"
              required
              value={formData.anaesth_certification}
              onChange={(e) => handleInputChange('anaesth_certification', e.target.value)}
              error={errors.anaesth_certification}
              placeholder="Certification details"
            />
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Add'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AnesthesiologistForm;