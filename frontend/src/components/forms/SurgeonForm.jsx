import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

const SurgeonForm = ({ isOpen, onClose, surgeon = null }) => {
  const { addSurgeon, updateSurgeon } = useApp();
  const isEditing = !!surgeon;

  const [formData, setFormData] = useState({
    surgeon_name: '',
    surgeon_contact: '',
    surgeon_speciality: '',
    surgeon_experience_years: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (surgeon) {
      setFormData({
        surgeon_name: surgeon.surgeon_name,
        surgeon_contact: surgeon.surgeon_contact,
        surgeon_speciality: surgeon.surgeon_speciality,
        surgeon_experience_years: surgeon.surgeon_experience_years
      });
    } else {
      setFormData({
        surgeon_name: '',
        surgeon_contact: '',
        surgeon_speciality: '',
        surgeon_experience_years: ''
      });
    }
    setErrors({});
  }, [surgeon, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.surgeon_name.trim()) {
      newErrors.surgeon_name = 'Surgeon name is required';
    }

    if (!formData.surgeon_contact.trim()) {
      newErrors.surgeon_contact = 'Contact information is required';
    }

    if (!formData.surgeon_speciality.trim()) {
      newErrors.surgeon_speciality = 'Speciality is required';
    }

    if (!formData.surgeon_experience_years || formData.surgeon_experience_years < 0) {
      newErrors.surgeon_experience_years = 'Valid experience years is required';
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
        updateSurgeon(surgeon.surgeon_id, formData);
      } else {
        addSurgeon(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving surgeon:', error);
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
      title={isEditing ? 'Edit Surgeon' : 'Add New Surgeon'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            required
            value={formData.surgeon_name}
            onChange={(e) => handleInputChange('surgeon_name', e.target.value)}
            error={errors.surgeon_name}
            placeholder="Dr. John Smith"
          />

          <Input
            label="Contact Information"
            type="tel"
            required
            value={formData.surgeon_contact}
            onChange={(e) => handleInputChange('surgeon_contact', e.target.value)}
            error={errors.surgeon_contact}
            placeholder="Phone number or email"
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
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Surgeon' : 'Add Surgeon'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SurgeonForm;
