import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import axios from 'axios';

const surgery = () => {
 
};







const SurgeryForm = ({ isOpen, onClose, surgery = null
   }) => {
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
    surgery_id: '',
    patient_id: '',
    or_id: '',
    surgery_date: '',
    surgery_start: '',
    surgery_end: '',
    surgery_notes: '',
    attending: '',
    resident: '',
    intern: '',
    nurse: '',
    anesthesiologist: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
    const [attending1, setAttending] = useState([]);
  const [resident, setResident] = useState([]);
  const [intern, setIntern] = useState([]);
  const [nurse, setNurse] = useState([]);
  const [anesthesiologist, setAnesthesiologist] = useState([]);
  const [patient, setPatient] = useState([]);
  const [or, setOr] = useState([]);
  useEffect(() => {
        axios
          .get("http://localhost:3000/surgery")
          .then(res => {
            console.log("Fetched surgereis:", res.data);
            setAttending(res.data.attending);
            setAnesthesiologist(res.data.anesthesiologist);
            setIntern(res.data.intern);
            setNurse(res.data.nurse)
            setResident(res.data.resident)
            setOr(res.data.or)
            setPatient(res.data.patient)
            // console.log(empName(1))
          })
          .catch(err => console.error(err));
      }, []);


  useEffect(() => {
    if (surgery) {
      setFormData({ ...surgery });
    } else {
      setFormData({
        surgery_id: '',
        patient_id: '',
        or_id: '',
        surgery_date: '',
        surgery_start: '',
        surgery_end: '',
        surgery_notes: '',
        attending: '',
        resident: '',
        intern: '',
        nurse: '',
        anesthesiologist: ''
      });
    }
    setErrors({});
  }, [surgery, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.patient_id) newErrors.patient_id = 'Patient is required';
    if (!formData.or_id) newErrors.or_id = 'Operation room is required';
    if (!formData.surgery_date) newErrors.surgery_date = 'Surgery date is required';
    if (!formData.surgery_start) newErrors.surgery_start = 'Start time is required';
    if (!formData.surgery_end) newErrors.surgery_end = 'End time is required';
   
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      if (isEditing) {
        //updateSurgery(formData.surgery_id, formData);
      } else {
        const payload={
        surgery_id: parseInt(formData.surgery_id),
        patient_id: parseInt(formData.patient_id),
        or_id: parseInt(formData.or_id),
        surgery_date: formData.surgery_date,
        surgery_start:formData.surgery_start ,
        surgery_end: formData.surgery_end,
        surgery_notes: formData.surgery_notes,
        attending_id:parseInt( formData.attending),
        resident_id: parseInt(formData.resident ),
        intern_id: parseInt(formData.intern),
        nurse_id: parseInt(formData.nurse),
        anesthesiologist_id: parseInt(formData.anesthesiologist)
        };
        await axios.post("http://localhost:3000/surgery", payload);
        console.log("✅ Surgeon added successfully");
    
      }
      onClose();
    } catch (err) {
      console.error('Error saving surgery:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
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
            label="Surgery ID"
            type="text"
            value={formData.surgery_id}
            onChange={(e) => handleInputChange('surgery_id', e.target.value)}
            placeholder="Enter Surgery ID"
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
              {patient.map(p => (
                <option key={p.patientid} value={p.patientid}>{p.fname+" "+p.lname}</option>
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
              <option value="">Select OR</option>
              {or.filter(r => r.status === 'Available').map(r => (
                <option key={r.orid} value={r.orid}>{r.orid}</option>
              ))}
            </select>
            {errors.or_id && <p className="mt-1 text-sm text-red-600">{errors.or_id}</p>}
          </div>

          <Input
            label="Surgery Date"
            type="date"
            required
            value={formData.surgery_date}
            onChange={(e) => handleInputChange('surgery_date', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />

          <Input
            label="Start Time"
            type="time"
            required
            value={formData.surgery_start}
            onChange={(e) => handleInputChange('surgery_start', e.target.value)}
          />

          <Input
            label="End Time"
            type="time"
            required
            value={formData.surgery_end}
            onChange={(e) => handleInputChange('surgery_end', e.target.value)}
          />

          

          

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attending</label>
            <select
              value={formData.attending}
              onChange={(e) => handleInputChange('attending', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Attending Surgeon</option>
              {attending1.map((emp) => (
                <option key={emp.empid} value={emp.empid}>{emp.empid}-{"Dr. "+emp.fname +" "+emp.lname}</option>
              ))}
            </select>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-2">Resident</label>
            <select
              value={formData.resident}
              onChange={(e) => handleInputChange('resident', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Resident Surgeon</option>
              {resident.map((emp) => (
                <option key={emp.empid} value={emp.empid}>{emp.empid}-{"Dr. "+emp.fname +" "+emp.lname}</option>
              ))}
            </select>

          <label className="block text-sm font-medium text-gray-700 mb-2">Intern</label>
            <select
              value={formData.intern}
              onChange={(e) => handleInputChange('intern', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Intern Surgeon</option>
              {intern.map((emp) => (
                <option key={emp.empid} value={emp.empid}>{emp.empid}-{"Dr. "+emp.fname +" "+emp.lname}</option>
              ))}
            </select>

          <label className="block text-sm font-medium text-gray-700 mb-2">Nurse</label>
            <select
              value={formData.nurse}
              onChange={(e) => handleInputChange('nurse', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select surgical Nurse</option>
              {nurse.map((emp) => (
                <option key={emp.empid} value={emp.empid}>{emp.empid}-{emp.fname +" "+emp.lname}</option>
              ))}
            </select>

          <label className="block text-sm font-medium text-gray-700 mb-2">Anesthologist</label>
            <select
              value={formData.anesthesiologist}
              onChange={(e) => handleInputChange('anesthesiologist', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selectanesthesiologist</option>
              {anesthesiologist.map((emp) => (
                <option key={emp.empid} value={emp.empid}>{emp.empid}-{"Dr. "+emp.fname +" "+emp.lname}</option>
              ))}
            </select>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Surgery Notes</label>
            <textarea
              value={formData.surgery_notes}
              onChange={(e) => handleInputChange('surgery_notes', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes..."
            />
          </div>
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
