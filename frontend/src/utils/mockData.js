// Mock data for the OR Management System

export const mockPatients = [
  {
    patient_id: '1',
    patient_name: 'John Doe',
    patient_age: 45,
    patient_gender: 'Male',
    patient_contact: '+1-555-0123',
    patient_medical_history: 'Hypertension, Diabetes Type 2'
  },
  {
    patient_id: '2',
    patient_name: 'Jane Smith',
    patient_age: 32,
    patient_gender: 'Female',
    patient_contact: '+1-555-0124',
    patient_medical_history: 'No significant medical history'
  },
  {
    patient_id: '3',
    patient_name: 'Robert Johnson',
    patient_age: 67,
    patient_gender: 'Male',
    patient_contact: '+1-555-0125',
    patient_medical_history: 'Heart disease, Previous cardiac surgery'
  }
];

export const mockSurgeons = [
  {
    surgeon_id: '1',
    surgeon_name: 'Dr. Sarah Wilson',
    surgeon_contact: '+1-555-1001',
    surgeon_speciality: 'Cardiothoracic Surgery',
    surgeon_experience_years: 15
  },
  {
    surgeon_id: '2',
    surgeon_name: 'Dr. Michael Brown',
    surgeon_contact: '+1-555-1002',
    surgeon_speciality: 'Orthopedic Surgery',
    surgeon_experience_years: 12
  },
  {
    surgeon_id: '3',
    surgeon_name: 'Dr. Emily Davis',
    surgeon_contact: '+1-555-1003',
    surgeon_speciality: 'General Surgery',
    surgeon_experience_years: 8
  }
];

export const mockAnesthesiologists = [
  {
    anaesth_id: '1',
    anaesth_name: 'Dr. James Miller',
    anaesth_contact: '+1-555-2001',
    anaesth_certification: 'Board Certified Anesthesiologist',
    anaesth_experience_years: 10
  },
  {
    anaesth_id: '2',
    anaesth_name: 'Dr. Lisa Garcia',
    anaesth_contact: '+1-555-2002',
    anaesth_certification: 'Fellowship in Cardiac Anesthesia',
    anaesth_experience_years: 14
  }
];

export const mockNurses = [
  {
    nurse_id: '1',
    nurse_name: 'Maria Rodriguez',
    nurse_contact: '+1-555-3001',
    nurse_department: 'Operating Room',
    nurse_shift: 'Morning'
  },
  {
    nurse_id: '2',
    nurse_name: 'Jennifer Lee',
    nurse_contact: '+1-555-3002',
    nurse_department: 'Operating Room',
    nurse_shift: 'Evening'
  },
  {
    nurse_id: '3',
    nurse_name: 'Amanda White',
    nurse_contact: '+1-555-3003',
    nurse_department: 'Operating Room',
    nurse_shift: 'Night'
  }
];

export const mockOperationRooms = [
  {
    or_id: '1',
    room_number: 'OR-101',
    availability_status: 'Available',
    equipment_list: ['Anesthesia Machine', 'Operating Table', 'Surgical Lights', 'Monitors']
  },
  {
    or_id: '2',
    room_number: 'OR-102',
    availability_status: 'Occupied',
    equipment_list: ['Anesthesia Machine', 'Operating Table', 'Surgical Lights', 'C-Arm X-ray']
  },
  {
    or_id: '3',
    room_number: 'OR-103',
    availability_status: 'Available',
    equipment_list: ['Anesthesia Machine', 'Operating Table', 'Surgical Lights', 'Laparoscopy Equipment']
  }
];

export const mockSurgeries = [
  {
    surgery_id: '1',
    surgery_date: '2024-08-28',
    surgery_time: '09:00',
    surgery_type: 'Appendectomy',
    surgery_duration: 90,
    surgery_notes: 'Laparoscopic appendectomy scheduled',
    patient_id: '2',
    or_id: '1',
    surgeon_id: '3',
    anaesth_id: '1',
    nurse_id: '1',
    status: 'Scheduled'
  },
  {
    surgery_id: '2',
    surgery_date: '2024-08-27',
    surgery_time: '14:00',
    surgery_type: 'Cardiac Bypass',
    surgery_duration: 240,
    surgery_notes: 'Triple vessel coronary artery bypass',
    patient_id: '3',
    or_id: '2',
    surgeon_id: '1',
    anaesth_id: '2',
    nurse_id: '2',
    status: 'In Progress'
  }
];