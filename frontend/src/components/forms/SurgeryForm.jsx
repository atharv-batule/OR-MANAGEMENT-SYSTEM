import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

const SurgeryForm = ({ isOpen, onClose, surgery = null }) => {
  const { 
    addSurgery, 
    updateSurgery, 
    patients, 
    surgeons, 
    anesthesiologists, 
    nurses, 
    operationRooms 
  } = useApp();
  
  const isEditing = !!surgery;

  const [formData, setFormData] = useState({
    surgery_date: '',
    surgery_time: '',
    surgery_type: '',
    surgery_duration: '',
    surgery_notes: '',
    patient_id: '',
    or_id: '',
    surgeon_id: '',
    anaesth_id: '',
    nurse_id: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (surgery) {
      setFormData({
        surgery_date: surgery.surgery_date,
        surgery_time: surgery.surgery_time,
        surgery_type: surgery.surgery_type,
        surgery_duration: surgery.surgery_duration,
        surgery_notes: surgery.surgery_notes,
        patient_id: surgery.patient_id,
        or_id: surgery.or_id,
        surgeon_id: surgery.surgeon_id,
        anaesth_id: surgery.anaesth_id,
        nurse_id: surgery.nurse_id
      });
    } else {
      setFormData({
        surgery_date: '',
        surgery_time: '',
        surgery_type: '',
        surgery_duration: '',
        surgery_notes: '',
        patient_id: '',
        or_id: '',
        surgeon_id: '',
        anaesth_id: '',
        nurse_id: ''
      });
    }
    setErrors({});
  }, [surgery, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.surgery_date) newErrors.surgery_date = 'Surgery date is required';
    if (!formData.surgery_time) newErrors.surgery_time = 'Surgery time is required';
    if (!formData.surgery_type.trim()) newErrors.surgery_type = 'Surgery type is required';
    if (!formData.surgery_duration || formData.surgery_duration <= 0) newErrors.surgery_duration = 'Valid surgery duration is required';
    if (!formData.patient_id) newErrors.patient_id = 'Patient selection is required';
    if (!formData.or_id) newErrors.or_id = 'Operation room selection is required';
    if (!formData.surgeon_id) newErrors.surgeon_id = 'Surgeon selection is required';
    if (!formData.anaesth_id) newErrors.anaesth_id = 'Anesthesiologist selection is required';
    if (!formData.nurse_id) newErrors.nurse_id = 'Nurse selection is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (isEditing) {
        updateSurgery(surgery.surgery_id, { ...formData, surgery_duration: formData.surgery_duration });
      } else {
        addSurgery(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving surgery:', error);
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
      title={isEditing ? 'Edit Surgery' : 'Schedule New Surgery'}
      size="large"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Surgery Date"
            type="date"
            required
            value={formData.surgery_date}
            onChange={(e) => handleInputChange('surgery_date', e.target.value)}
            error={errors.surgery_date}
            min={new Date().toISOString().split('T')[0]}
          />

          <Input
            label="Surgery Time"
            type="time"
            required
            value={formData.surgery_time}
            onChange={(e) => handleInputChange('surgery_time', e.target.value)}
            error={errors.surgery_time}
          />

          <Input
            label="Surgery Type"
            required
            value={formData.surgery_type}
            onChange={(e) => handleInputChange('surgery_type', e.target.value)}
            error={errors.surgery_type}
            placeholder="e.g., Appendectomy, Cardiac Bypass"
          />

          <Input
            label="Duration (minutes)"
            type="number"
            required
            value={formData.surgery_duration}
            onChange={(e) => handleInputChange('surgery_duration', parseInt(e.target.value) || '')}
            error={errors.surgery_duration}
            placeholder="Duration in minutes"
            min="1"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.patient_id}
              onChange={(e) => handleInputChange('patient_id', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.patient_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Patient</option>
              {patients.map(patient => (
                <option key={patient.patient_id} value={patient.patient_id}>
                  {patient.patient_name} - Age {patient.patient_age}
                </option>
              ))}
            </select>
            {errors.patient_id && <p className="mt-1 text-sm text-red-600">{errors.patient_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operation Room <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.or_id}
              onChange={(e) => handleInputChange('or_id', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.or_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Operation Room</option>
              {operationRooms.filter(room => room.availability_status === 'Available').map(room => (
                <option key={room.or_id} value={room.or_id}>
                  {room.room_number} - {room.availability_status}
                </option>
              ))}
            </select>
            {errors.or_id && <p className="mt-1 text-sm text-red-600">{errors.or_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Surgeon <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.surgeon_id}
              onChange={(e) => handleInputChange('surgeon_id', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.surgeon_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Surgeon</option>
              {surgeons.map(surgeon => (
                <option key={surgeon.surgeon_id} value={surgeon.surgeon_id}>
                  {surgeon.surgeon_name} - {surgeon.surgeon_speciality}
                </option>
              ))}
            </select>
            {errors.surgeon_id && <p className="mt-1 text-sm text-red-600">{errors.surgeon_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anesthesiologist <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.anaesth_id}
              onChange={(e) => handleInputChange('anaesth_id', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.anaesth_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Anesthesiologist</option>
              {anesthesiologists.map(anaesth => (
                <option key={anaesth.anaesth_id} value={anaesth.anaesth_id}>
                  {anaesth.anaesth_name} - {anaesth.anaesth_experience_years} years exp.
                </option>
              ))}
            </select>
            {errors.anaesth_id && <p className="mt-1 text-sm text-red-600">{errors.anaesth_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nurse <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.nurse_id}
              onChange={(e) => handleInputChange('nurse_id', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nurse_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Nurse</option>
              {nurses.map(nurse => (
                <option key={nurse.nurse_id} value={nurse.nurse_id}>
                  {nurse.nurse_name} - {nurse.nurse_shift} Shift
                </option>
              ))}
            </select>
            {errors.nurse_id && <p className="mt-1 text-sm text-red-600">{errors.nurse_id}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Surgery Notes</label>
          <textarea
            value={formData.surgery_notes}
            onChange={(e) => handleInputChange('surgery_notes', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any additional notes or instructions for the surgery..."
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Surgery' : 'Schedule Surgery'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SurgeryForm;
