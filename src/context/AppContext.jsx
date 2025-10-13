import React, { createContext, useContext } from 'react';
import { useLocalStorage, localStorageKeys } from '../hooks/useLocalStorage';
import {
  mockPatients,
  mockSurgeons,
  mockAnesthesiologists,
  mockNurses,
  mockOperationRooms,
  mockSurgeries
} from '../utils/mockData';

const AppContext = createContext();

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export function AppProvider({ children }) {
  const [patients, setPatients] = useLocalStorage(localStorageKeys.PATIENTS, mockPatients);
  const [surgeons, setSurgeons] = useLocalStorage(localStorageKeys.SURGEONS, mockSurgeons);
  const [anesthesiologists, setAnesthesiologists] = useLocalStorage(localStorageKeys.ANESTHESIOLOGISTS, mockAnesthesiologists);
  const [nurses, setNurses] = useLocalStorage(localStorageKeys.NURSES, mockNurses);
  const [operationRooms, setOperationRooms] = useLocalStorage(localStorageKeys.OPERATION_ROOMS, mockOperationRooms);
  const [surgeries, setSurgeries] = useLocalStorage(localStorageKeys.SURGERIES, mockSurgeries);

  // Patient operations
  const addPatient = (patientData) => {
    const newPatient = {
      ...patientData,
      patient_id: generateId(),
      patient_age: Number(patientData.patient_age),
    };
    setPatients(prev => [...prev, newPatient]);
  };

  const updatePatient = (id, patientData) => {
    setPatients(prev => prev.map(patient => 
      patient.patient_id === id 
        ? { ...patient, ...patientData, patient_age: Number(patientData.patient_age) }
        : patient
    ));
  };

  const deletePatient = (id) => {
    setPatients(prev => prev.filter(patient => patient.patient_id !== id));
    // Also remove any surgeries for this patient
    setSurgeries(prev => prev.filter(surgery => surgery.patient_id !== id));
  };

  // Surgeon operations
  const addSurgeon = (surgeonData) => {
    const newSurgeon = {
      ...surgeonData,
      surgeon_id: generateId(),
      surgeon_experience_years: Number(surgeonData.surgeon_experience_years),
    };
    setSurgeons(prev => [...prev, newSurgeon]);
  };

  const updateSurgeon = (id, surgeonData) => {
    setSurgeons(prev => prev.map(surgeon => 
      surgeon.surgeon_id === id 
        ? { ...surgeon, ...surgeonData, surgeon_experience_years: Number(surgeonData.surgeon_experience_years) }
        : surgeon
    ));
  };

  const deleteSurgeon = (id) => {
    setSurgeons(prev => prev.filter(surgeon => surgeon.surgeon_id !== id));
  };

  // Anesthesiologist operations
  const addAnesthesiologist = (anesthData) => {
    const newAnesthesiologist = {
      ...anesthData,
      anaesth_id: generateId(),
      anaesth_experience_years: Number(anesthData.anaesth_experience_years),
    };
    setAnesthesiologists(prev => [...prev, newAnesthesiologist]);
  };

  const updateAnesthesiologist = (id, anesthData) => {
    setAnesthesiologists(prev => prev.map(anaesth => 
      anaesth.anaesth_id === id 
        ? { ...anaesth, ...anesthData, anaesth_experience_years: Number(anesthData.anaesth_experience_years) }
        : anaesth
    ));
  };

  const deleteAnesthesiologist = (id) => {
    setAnesthesiologists(prev => prev.filter(anaesth => anaesth.anaesth_id !== id));
  };

  // Nurse operations
  const addNurse = (nurseData) => {
    const newNurse = {
      ...nurseData,
      nurse_id: generateId(),
    };
    setNurses(prev => [...prev, newNurse]);
  };

  const updateNurse = (id, nurseData) => {
    setNurses(prev => prev.map(nurse => 
      nurse.nurse_id === id ? { ...nurse, ...nurseData } : nurse
    ));
  };

  const deleteNurse = (id) => {
    setNurses(prev => prev.filter(nurse => nurse.nurse_id !== id));
  };

  // Operation Room operations
  const addOperationRoom = (roomData) => {
    const newRoom = {
      ...roomData,
      or_id: generateId(),
    };
    setOperationRooms(prev => [...prev, newRoom]);
  };

  const updateOperationRoom = (id, roomData) => {
    setOperationRooms(prev => prev.map(room => 
      room.or_id === id ? { ...room, ...roomData } : room
    ));
  };

  const deleteOperationRoom = (id) => {
    setOperationRooms(prev => prev.filter(room => room.or_id !== id));
  };

  // Surgery operations
  const addSurgery = (surgeryData) => {
    const newSurgery = {
      ...surgeryData,
      surgery_id: generateId(),
      surgery_duration: Number(surgeryData.surgery_duration),
      status: 'Scheduled',
    };
    setSurgeries(prev => [...prev, newSurgery]);
  };

  const updateSurgery = (id, surgeryData) => {
    setSurgeries(prev => prev.map(surgery => 
      surgery.surgery_id === id ? { ...surgery, ...surgeryData } : surgery
    ));
  };

  const deleteSurgery = (id) => {
    setSurgeries(prev => prev.filter(surgery => surgery.surgery_id !== id));
  };

  const value = {
    patients,
    surgeons,
    anesthesiologists,
    nurses,
    operationRooms,
    surgeries,
    addPatient,
    updatePatient,
    deletePatient,
    addSurgeon,
    updateSurgeon,
    deleteSurgeon,
    addAnesthesiologist,
    updateAnesthesiologist,
    deleteAnesthesiologist,
    addNurse,
    updateNurse,
    deleteNurse,
    addOperationRoom,
    updateOperationRoom,
    deleteOperationRoom,
    addSurgery,
    updateSurgery,
    deleteSurgery,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
