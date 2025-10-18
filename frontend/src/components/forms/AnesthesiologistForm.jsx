import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

// Convert "yyyy-mm-dd" → "dd-mm-yyyy"
const formatDateToDisplay = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
};

// Convert "dd-mm-yyyy" → "yyyy-mm-dd" (for <input type="date">)
const formatDateToInput = (dateStr) => {
  if (!dateStr) return '';
  const [day, month, year] = dateStr.split('-');
  return `${year}-${month}-${day}`;
};

const AnesthesiologistForm = ({ isOpen, onClose, anesthesiologist = null }) => {
  const { addAnesthesiologist, updateAnesthesiologist } = useApp();
  const isEditing = !!anesthesiologist;

  const [formData, setFormData] = useState({
    employee_id: '',
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

    if (!formData.employee_id.trim())
      newErrors.employee_id = 'Employee ID is required.';

    if (!formData.anaesth_name.trim())
      newErrors.anaesth_name = 'Full name is required.';

    if (!formData.anaesth_dob.trim())
      newErrors.anaesth_dob = 'Date of Birth is required.';

    if (!formData.anaesth_gender.trim())
      newErrors.anaesth_gender = 'Please select gender.';

    if (!formData.anaesth_salary || formData.anaesth_salary <= 0)
      newErrors.anaesth_salary = 'Please enter a valid salary.';

    if (!formData.anaesth_contact.trim())
      newErrors.anaesth_contact = 'Contact information is required.';
    else if (formData.anaesth_contact.length < 10 || formData.anaesth_contact.length > 13)
      newErrors.anaesth_contact = 'Contact number must be between 10–13 digits.';

    if (!formData.anaesth_certification.trim())
      newErrors.anaesth_certification = 'Certification details are required.';

    if (
      !formData.anaesth_experience_years ||
      isNaN(formData.anaesth_experience_years) ||
      formData.anaesth_experience_years < 0
    )
      newErrors.anaesth_experience_years = 'Valid experience (in years) is required.';

    if (!formData.anaesth_supervisor_id.trim())
      newErrors.anaesth_supervisor_id = 'Supervisor ID is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  useEffect(() => {
    if (anesthesiologist) {
      setFormData({
        employee_id: anesthesiologist.employee_id || '',
        anaesth_name: anesthesiologist.anaesth_name || '',
        anaesth_dob: anesthesiologist.anaesth_dob || '',
        anaesth_gender: anesthesiologist.anaesth_gender || '',
        anaesth_salary: anesthesiologist.anaesth_salary || '',
        anaesth_contact: anesthesiologist.anaesth_contact || '',
        anaesth_certification: anesthesiologist.anaesth_certification || '',
        anaesth_supervisor_id: anesthesiologist.anaesth_supervisor_id || '',
        anaesth_experience_years: anesthesiologist.anaesth_experience_years || ''
      });
    } else {
      setFormData({
        employee_id: '',
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
    if (!isValid) return; // Prevent submission

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateAnesthesiologist(anesthesiologist.anaesth_id, formData);
      } else {
        await addAnesthesiologist(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving anesthesiologist:', error);
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
            required
            value={formData.employee_id}
            onChange={(e) => handleInputChange('employee_id', e.target.value)}
            error={errors.employee_id}
            placeholder="EMP001"
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
            required
            value={formData.anaesth_supervisor_id}
            onChange={(e) => handleInputChange('anaesth_supervisor_id', e.target.value)}
            error={errors.anaesth_supervisor_id}
            placeholder="SUP001"
          />

          <Input
            label="Date of Birth"
            type="date"
            required
            value={formData.anaesth_dob ? formatDateToInput(formData.anaesth_dob) : ''}
            onChange={(e) => {
              const formatted = formatDateToDisplay(e.target.value);
              handleInputChange('anaesth_dob', formatted);
            }}
            error={errors.anaesth_dob}
          />

          <Input
            label="Contact"
            required
            value={formData.anaesth_contact}
            onChange={(e) => handleInputChange('anaesth_contact', e.target.value)}
            error={errors.anaesth_contact}
            placeholder="Phone or email"
          />

          <Input
            label="Certification"
            required
            value={formData.anaesth_certification}
            onChange={(e) => handleInputChange('anaesth_certification', e.target.value)}
            error={errors.anaesth_certification}
            placeholder="Board Certified Anesthesiologist"
          />

          <Input
            label="Experience (Years)"
            type="number"
            required
            value={formData.anaesth_experience_years}
            onChange={(e) =>
              handleInputChange('anaesth_experience_years', parseInt(e.target.value) || '')
            }
            error={errors.anaesth_experience_years}
            placeholder="Years of experience"
            min="0"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
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
        </div>

        {/* Buttons */}
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
