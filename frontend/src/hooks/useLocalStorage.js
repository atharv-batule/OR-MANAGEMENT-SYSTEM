import { useState, useEffect } from 'react';

// Custom hook for managing localStorage with React state
export const useLocalStorage = (key, initialValue) => {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// Utility functions for specific data operations
export const localStorageKeys = {
  PATIENTS: 'or_management_patients',
  SURGEONS: 'or_management_surgeons',
  ANESTHESIOLOGISTS: 'or_management_anesthesiologists',
  NURSES: 'or_management_nurses',
  OPERATION_ROOMS: 'or_management_operation_rooms',
  SURGERIES: 'or_management_surgeries',
  SURGERY_STAFF: 'or_management_surgery_staff'
};

// Generic CRUD operations for localStorage
export const createRecord = (records, setRecords, newRecord) => {
  const updatedRecords = [...records, newRecord];
  setRecords(updatedRecords);
  return newRecord;
};

export const updateRecord = (records, setRecords, id, updatedRecord, idField = 'id') => {
  const updatedRecords = records.map(record => 
    record[idField] === id ? { ...record, ...updatedRecord } : record
  );
  setRecords(updatedRecords);
  return updatedRecord;
};

export const deleteRecord = (records, setRecords, id, idField = 'id') => {
  const updatedRecords = records.filter(record => record[idField] !== id);
  setRecords(updatedRecords);
  return true;
};

export const getRecord = (records, id, idField = 'id') => {
  return records.find(record => record[idField] === id);
};
