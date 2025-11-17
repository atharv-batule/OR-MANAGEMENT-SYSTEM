import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import axios from 'axios';
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

const HodForm = ({ isOpen, onClose, hod = null }) => {
  const { addHod, updateHod } = useApp();
  const isEditing = !!hod;

  const [formData, setFormData] = useState({
    hod_id: '',
    hod_name: '',
    hod_dnumber: '',
    hod_dname: '',
    hod_start_date: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hod1, setHod] = useState([]);
  const [emp, setEmp] = useState([]);
  
  const validateForm = () => {
    const newErrors = {};

    if (!formData.hod_id.trim())
      newErrors.hod_id = 'HOD ID is required.';

    if (!formData.hod_name.trim())
      newErrors.hod_name = 'Full name is required.';

    if (!formData.hod_dnumber.trim())
      newErrors.hod_dnumber = 'Date of Birth is required.';

    if (!formData.hod_dname.trim())
      newErrors.hod_dname = 'Please select gender.';

    if (!formData.hod_start_date.trim())
        newErrors.hod_start_date = 'Please select gender.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  useEffect(() => {
    axios
      .get("http://localhost:3000/hod")
      .then((res) => {
        console.log("Fetched HOD:", res.data);
        setHod(res.data.hodData);
        setEmp(res.data.emp)

      })
      .catch((err) => console.error(err));
  }, []);
  
  useEffect(() => {
    if (hod) {
      setFormData({
      hod_id: hod.hod_id || '',
      hod_name: hod.hod_name || '',
      hod_dnumber: hod.hod_dnumber || '',
      hod_dname: hod.hod_dname || '',
      hod_start_date: hod.hod_start_date.split("T")[0] || '',
      });
    } else {
      setFormData({
        hod_id: '',
        hod_name: '',
        hod_dnumber: '',
        hod_dname: '',
        hod_start_date: '',
      });
    }
    setErrors({});
  }, [hod, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return; // Prevent submission

    setIsSubmitting(true);
    try {
      if (isEditing) {

        console.log('🩺 Updating HOD:', payload);
        await axios.put(`http://localhost:3000/hod`, payload);
        console.log('HOD updated successfully');
      }  else {
        const payload = {
        hod_id: parseInt(formData.hod_id),
        hod_name: formData.hod_name,
        hod_dnumber: parseInt(formData.hod_dnumber),
        hod_dname: formData.hod_dname,
        hod_start_date: formData.hod_start_date,
        
      };
      console.log("📤 Sending payload:", payload);

      await axios.post("http://localhost:3000/hod", payload);
      console.log(" HOD added successfully");
      }
      onClose();
    } catch (error) {
      console.error('Error saving HOD:', error.message);
      console.log(error)
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
      title={isEditing ? 'Edit Hod' : 'Add New Hod'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Hod ID"
            required
            value={formData.hod_id}
            onChange={(e) => handleInputChange('hod_id', e.target.value)}
            error={errors.hod_id}
            placeholder="001"
          />

          <Input
            label="Full Name"
            required
            value={formData.hod_name}
            onChange={(e) => handleInputChange('hod_name', e.target.value)}
            error={errors.hod_name}
            placeholder="Dr. Jane Smith"
          />

          <Input
            label="Department number"
            type="number"
            required
            value={formData.hod_dnumber}
            onChange={(e) => handleInputChange('hod_dnumber', e.target.value)}
            error={errors.hod_dnumber}
            placeholder="001"
          />

          <Input
            label="Department name"
            required
            value={formData.hod_dname}
            onChange={(e) => handleInputChange('hod_dname', e.target.value)}
            error={errors.hod_dname}
            placeholder="Cardio"
          />
        <Input
              label="HOD Start Date"
              type="date"
              required
              value={formData.hod_start_date}
              onChange={(e) => handleInputChange('hod_start_date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
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

export default HodForm;
