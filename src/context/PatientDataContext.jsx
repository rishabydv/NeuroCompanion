import { createContext, useContext, useState, useEffect } from 'react';
import {
  familyMembers as defaultFamily,
  routines as defaultRoutines,
  memories as defaultMemories,
  medications as defaultMedications,
} from '../data/patientData';

const PatientDataContext = createContext();

const STORAGE_KEYS = {
  family: 'neurocompanion_family',
  routines: 'neurocompanion_routines',
  memories: 'neurocompanion_memories',
};

function loadFromStorage(key, defaultData) {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return [...defaultData, ...JSON.parse(stored)];
    }
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
  }
  return defaultData;
}

function saveToStorage(key, data, defaultData) {
  try {
    // Only save the items that were added by the user (not the defaults)
    const defaultIds = new Set(defaultData.map((d) => d.id));
    const userAdded = data.filter((d) => !defaultIds.has(d.id));
    localStorage.setItem(key, JSON.stringify(userAdded));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

export function PatientDataProvider({ children }) {
  const [family, setFamily] = useState(() =>
    loadFromStorage(STORAGE_KEYS.family, defaultFamily)
  );
  const [routines, setRoutines] = useState(() =>
    loadFromStorage(STORAGE_KEYS.routines, defaultRoutines)
  );
  const [memoryList, setMemoryList] = useState(() =>
    loadFromStorage(STORAGE_KEYS.memories, defaultMemories)
  );

  // Persist user-added items to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.family, family, defaultFamily);
  }, [family]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.routines, routines, defaultRoutines);
  }, [routines]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.memories, memoryList, defaultMemories);
  }, [memoryList]);

  const addFamilyMember = (member) => {
    const newMember = {
      ...member,
      id: Date.now(),
    };
    setFamily((prev) => [...prev, newMember]);
    return newMember;
  };

  const addRoutine = (routine) => {
    const newRoutine = {
      ...routine,
      id: Date.now(),
      icon: 'Clock',
    };
    setRoutines((prev) => [...prev, newRoutine]);
    return newRoutine;
  };

  const addMemory = (memory) => {
    const newMemory = {
      ...memory,
      id: Date.now(),
    };
    setMemoryList((prev) => [...prev, newMemory]);
    return newMemory;
  };

  const removeFamilyMember = (id) => {
    setFamily((prev) => prev.filter((m) => m.id !== id));
  };

  const removeRoutine = (id) => {
    setRoutines((prev) => prev.filter((r) => r.id !== id));
  };

  const removeMemory = (id) => {
    setMemoryList((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <PatientDataContext.Provider
      value={{
        family,
        routines,
        memories: memoryList,
        medications: defaultMedications,
        addFamilyMember,
        addRoutine,
        addMemory,
        removeFamilyMember,
        removeRoutine,
        removeMemory,
      }}
    >
      {children}
    </PatientDataContext.Provider>
  );
}

export function usePatientData() {
  const context = useContext(PatientDataContext);
  if (!context) {
    throw new Error('usePatientData must be used within a PatientDataProvider');
  }
  return context;
}
