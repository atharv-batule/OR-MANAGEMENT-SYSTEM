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
    anesthesiologist: '',
    procedure: ''
  });

  const { admin } = useApp();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attending1, setAttending] = useState([]);
  const [resident, setResident] = useState([]);
  const [intern, setIntern] = useState([]);
  const [nurse, setNurse] = useState([]);
  const [anesthesiologist, setAnesthesiologist] = useState([]);
  const [patient, setPatient] = useState([]);
  const [or, setOr] = useState([]);
  const [procedure, setProcedure] = useState([]);
  useEffect(() => {
        axios
          .get("https://or-management-system.onrender.com/surgery")
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
      setFormData({
        surgery_id: surgery.surgery_id || '',
        patient_id: surgery.patient_id || '',
        or_id: surgery.or_id || '',
        surgery_date: surgery.surgery_date?.split('T')[0] || '',
        surgery_start: surgery.surgery_start || '',
        surgery_end: surgery.surgery_end || '',
        surgery_notes: surgery.surgery_notes || '',
        attending: surgery.attending_id || '',
        resident: surgery.resident_id || '',
        intern: surgery.intern_id || '',
        nurse: surgery.nurse_id || '',
        anesthesiologist: surgery.anesthesiologist_id || '',
        procedure: surgery.procedure || ''
      });
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
        anesthesiologist: '',
        procedure: ''
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
        anesthesiologist_id: parseInt(formData.anesthesiologist),
        procedure: formData.procedure
        };
      if (isEditing) {
        await axios.put(`https://or-management-system.onrender.com/surgery`, payload);
      } else {
        
        await axios.post("https://or-management-system.onrender.com/surgery", payload);
        //await axios.post("https://or-management-system.onrender.com/surgery", payload);
        console.log("✅ Surgeon added successfully");
    
      }

      console.log("🔹 Calling onClose() from SurgeryForm");
      onClose();
    } catch (err) {
      console.error('Error saving surgery:', err);
    } finally {
      onClose();
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
     {/* --- Patient & Procedure Section --- */}
     <section className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Patient Information</h3>
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
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.patient_id ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'
                }`}
              >
                <option value="">Select Patient</option>
                {patient.map(p => (
                  <option key={p.patientid} value={p.patientid}>{p.fname} {p.lname}</option>
                ))}
              </select>
              {errors.patient_id && <p className="mt-1 text-sm text-red-600">{errors.patient_id}</p>}
            </div>

            <Input
              label="Procedure"
              value={formData.procedure}
              onChange={(e) => handleInputChange('procedure', e.target.value)}
              placeholder="Procedure Name"
            />
          </div>
        </section>

        {/* --- Surgery Details Section --- */}
        <section className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Surgery Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operation Room <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.or_id}
                onChange={(e) => handleInputChange('or_id', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.or_id ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'
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
          </div>
        </section>

        {/* --- Surgical Team Section --- */}
        <section className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Surgical Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Attending Surgeon', field: 'attending', data: attending1 },
              { label: 'Resident Surgeon', field: 'resident', data: resident },
              { label: 'Intern Surgeon', field: 'intern', data: intern },
              { label: 'Surgical Nurse', field: 'nurse', data: nurse },
              { label: 'Anesthesiologist', field: 'anesthesiologist', data: anesthesiologist }
            ].map(({ label, field, data }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                <select
                  value={formData[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select {label}</option>
                  {data.map(emp => (
                    <option key={emp.empid} value={emp.empid}>
                      {emp.empid} - Dr. {emp.fname} {emp.lname}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </section>

        {/* --- Notes Section --- */}
        <section className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Additional Notes</h3>
          <textarea
            value={formData.surgery_notes}
            onChange={(e) => handleInputChange('surgery_notes', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Additional notes..."
          />
        </section>

        {/* --- Actions --- */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Surgeon' : 'Add Surgeon'}
          </Button>

          {/* {admin && (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Surgery' : 'Schedule Surgery'}
            </Button>
          )} */}

          
          
        </div>
      </form>
    </Modal>
  );
};

export default SurgeryForm;