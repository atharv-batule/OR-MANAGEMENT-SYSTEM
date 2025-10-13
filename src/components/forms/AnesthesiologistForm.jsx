import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

const AnesthesiologistForm = ({ isOpen, onClose, anesthesiologist = null }) => {
  const { addAnesthesiologist, updateAnesthesiologist } = useApp();
  const isEditing = !!anesthesiologist;

  const [formData, setFormData] = useState({
    anaesth_name: '',
    anaesth_contact: '',
    anaesth_certification: '',
    anaesth_experience_years: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (anesthesiologist) {
      setFormData({
        anaesth_name: anesthesiologist.anaesth_name,
        anaesth_contact: anesthesiologist.anaesth_contact,
        anaesth_certification: anesthesiologist.anaesth_certification,
        anaesth_experience_years: anesthesiologist.anaesth_experience_years
      });
    } else {
      setFormData({
        anaesth_name: '',
        anaesth_contact: '',
        anaesth_certification: '',
        anaesth_experience_years: ''
      });
    }
    setErrors({});
  }, [anesthesiologist, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing) {
        updateAnesthesiologist(anesthesiologist.anaesth_id, formData);
      } else {
        addAnesthesiologist(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving anesthesiologist:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            label="Full Name"
            required
            value={formData.anaesth_name}
            onChange={(e) => handleInputChange('anaesth_name', e.target.value)}
            placeholder="Dr. Jane Smith"
          />
          <Input
            label="Contact"
            required
            value={formData.anaesth_contact}
            onChange={(e) => handleInputChange('anaesth_contact', e.target.value)}
            placeholder="Phone or email"
          />
          <Input
            label="Certification"
            required
            value={formData.anaesth_certification}
            onChange={(e) => handleInputChange('anaesth_certification', e.target.value)}
            placeholder="Board Certified Anesthesiologist"
          />
          <Input
            label="Experience (Years)"
            type="number"
            required
            value={formData.anaesth_experience_years}
            onChange={(e) => handleInputChange('anaesth_experience_years', parseInt(e.target.value) || '')}
            placeholder="Years of experience"
            min="0"
          />
        </div>
        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Add'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AnesthesiologistForm;
