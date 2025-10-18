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

const NurseForm = ({ isOpen, onClose, nurse = null }) => {
  const { addNurse, updateNurse } = useApp();
  const isEditing = !!nurse;

  const [formData, setFormData] = useState({
    employee_id: '',
    nurse_name: '',
    nurse_dob: '',
    nurse_gender: '',
    nurse_salary: '',
    nurse_contact: '',
    nurse_certification: '',
    nurse_supervisor_id: '',
    nurse_experience_years: '',
    nurse_shift: 'Morning'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Validation function (improved)
  const validateForm = () => {
    const newErrors = {};

    if (!formData.employee_id.trim()) newErrors.employee_id = 'Employee ID is required.';
    if (!formData.nurse_name.trim()) newErrors.nurse_name = 'Full name is required.';
    if (!formData.nurse_dob.trim()) newErrors.nurse_dob = 'Date of Birth is required.';
    if (!formData.nurse_gender.trim()) newErrors.nurse_gender = 'Please select gender.';
    if (!formData.nurse_salary || formData.nurse_salary <= 0)
      newErrors.nurse_salary = 'Enter a valid salary.';
    if (!formData.nurse_contact.trim())
      newErrors.nurse_contact = 'Contact number is required.';
    else if (formData.nurse_contact.length < 10 || formData.nurse_contact.length > 13)
      newErrors.nurse_contact = 'Contact number must be between 10–13 digits.';
    if (
      !formData.nurse_experience_years ||
      isNaN(formData.nurse_experience_years) ||
      formData.nurse_experience_years < 0
    )
      newErrors.nurse_experience_years = 'Enter valid experience in years.';
    if (!formData.nurse_supervisor_id.trim())
      newErrors.nurse_supervisor_id = 'Supervisor ID is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Reset and populate form data on open
  useEffect(() => {
    if (nurse) {
      setFormData({
        employee_id: nurse.employee_id || '',
        nurse_name: nurse.nurse_name || '',
        nurse_dob: nurse.nurse_dob || '',
        nurse_gender: nurse.nurse_gender || '',
        nurse_salary: nurse.nurse_salary || '',
        nurse_contact: nurse.nurse_contact || '',
        nurse_certification: nurse.nurse_certification || '',
        nurse_supervisor_id: nurse.nurse_supervisor_id || '',
        nurse_experience_years: nurse.nurse_experience_years || '',
        nurse_shift: nurse.nurse_shift || 'Morning'
      });
    } else {
      setFormData({
        employee_id: '',
        nurse_name: '',
        nurse_dob: '',
        nurse_gender: '',
        nurse_salary: '',
        nurse_contact: '',
        nurse_certification: '',
        nurse_supervisor_id: '',
        nurse_experience_years: '',
        nurse_shift: 'Morning'
      });
    }
    setErrors({});
  }, [nurse, isOpen]);

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateNurse(nurse.nurse_id, formData);
      } else {
        await addNurse(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving nurse:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Handles input change + clears specific field error
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
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
            value={formData.nurse_name}
            onChange={(e) => handleInputChange('nurse_name', e.target.value)}
            error={errors.nurse_name}
            placeholder="Dr. Sarah Brown"
          />

          <Input
            label="Supervisor ID"
            required
            value={formData.nurse_supervisor_id}
            onChange={(e) => handleInputChange('nurse_supervisor_id', e.target.value)}
            error={errors.nurse_supervisor_id}
            placeholder="SUP001"
          />

          <Input
            label="Date of Birth"
            type="date"
            required
            value={formData.nurse_dob ? formatDateToInput(formData.nurse_dob) : ''}
            onChange={(e) => {
              const formatted = formatDateToDisplay(e.target.value);
              handleInputChange('nurse_dob', formatted);
            }}
            error={errors.nurse_dob}
          />

          <Input
            label="Experience (Years)"
            type="number"
            required
            value={formData.nurse_experience_years}
            onChange={(e) =>
              handleInputChange('nurse_experience_years', parseInt(e.target.value) || '')
            }
            error={errors.nurse_experience_years}
            placeholder="Years of experience"
            min="0"
          />

          <Input
            label="Contact"
            required
            value={formData.nurse_contact}
            onChange={(e) => handleInputChange('nurse_contact', e.target.value)}
            error={errors.nurse_contact}
            placeholder="Phone number"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shift</label>
            <select
              value={formData.nurse_shift}
              onChange={(e) => handleInputChange('nurse_shift', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={formData.nurse_gender}
              onChange={(e) => handleInputChange('nurse_gender', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                errors.nurse_gender ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.nurse_gender && (
              <p className="text-red-500 text-sm mt-1">{errors.nurse_gender}</p>
            )}
          </div>

          <Input
            label="Salary"
            type="number"
            required
            value={formData.nurse_salary}
            onChange={(e) => handleInputChange('nurse_salary', e.target.value)}
            error={errors.nurse_salary}
            placeholder="Enter salary amount"
            min="0"
          />
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

export default NurseForm;
