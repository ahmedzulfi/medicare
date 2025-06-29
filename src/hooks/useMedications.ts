import { useState, useEffect } from 'react';
import { Medication, MedicationDose, Profile, AppSettings, Analytics, SearchFilters } from '../types/medication';

// Comprehensive example profiles with rich data
const exampleProfiles: Profile[] = [
  { 
    id: '1', 
    name: 'John Doe', 
    relationship: 'Self',
    dateOfBirth: '1985-06-15',
    emergencyContact: '+1-555-0123',
    allergies: ['Penicillin', 'Shellfish', 'Latex'],
    medicalConditions: ['Hypertension', 'Type 2 Diabetes', 'High Cholesterol'],
    preferredPharmacy: 'CVS Pharmacy',
    doctorName: 'Dr. Sarah Smith',
    createdAt: '2024-01-01T00:00:00Z'
  },
  { 
    id: '2', 
    name: 'Sarah Doe', 
    relationship: 'Spouse',
    dateOfBirth: '1987-03-22',
    emergencyContact: '+1-555-0124',
    allergies: ['Latex', 'Aspirin'],
    medicalConditions: ['Asthma', 'Seasonal Allergies'],
    preferredPharmacy: 'Walgreens',
    doctorName: 'Dr. Michael Johnson',
    createdAt: '2024-01-01T00:00:00Z'
  },
  { 
    id: '3', 
    name: 'Mary Johnson', 
    relationship: 'Mother',
    dateOfBirth: '1955-11-08',
    emergencyContact: '+1-555-0125',
    allergies: ['Aspirin', 'Codeine'],
    medicalConditions: ['Arthritis', 'High Cholesterol', 'Osteoporosis'],
    preferredPharmacy: 'CVS Pharmacy',
    doctorName: 'Dr. Robert Wilson',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'David Johnson',
    relationship: 'Father',
    dateOfBirth: '1952-08-14',
    emergencyContact: '+1-555-0126',
    allergies: ['Sulfa drugs'],
    medicalConditions: ['Heart Disease', 'Diabetes', 'High Blood Pressure'],
    preferredPharmacy: 'Rite Aid',
    doctorName: 'Dr. Jennifer Davis',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'Emma Doe',
    relationship: 'Daughter',
    dateOfBirth: '2010-12-03',
    emergencyContact: '+1-555-0127',
    allergies: ['Peanuts', 'Tree nuts'],
    medicalConditions: ['ADHD', 'Food Allergies'],
    preferredPharmacy: 'Target Pharmacy',
    doctorName: 'Dr. Lisa Martinez',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Comprehensive medication database with realistic examples
const exampleMedications: Medication[] = [
  // John's medications (Profile 1)
  {
    id: '1',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'daily',
    times: ['08:00', '20:00'],
    startDate: '2024-01-01',
    refillDate: '2024-02-15',
    doctorName: 'Dr. Sarah Smith',
    quantity: 60,
    prescriptionNumber: 'RX123456',
    pharmacy: 'CVS Pharmacy',
    medicationType: 'pill',
    color: '#3B82F6',
    profileId: '1',
    notes: 'Take with food to reduce stomach upset. Monitor blood pressure weekly.',
    sideEffects: ['Dizziness', 'Dry cough', 'Fatigue'],
    effectiveness: 4,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'daily',
    times: ['07:30', '19:30'],
    startDate: '2024-01-01',
    refillDate: '2024-02-20',
    doctorName: 'Dr. Sarah Smith',
    quantity: 90,
    prescriptionNumber: 'RX789012',
    pharmacy: 'CVS Pharmacy',
    medicationType: 'pill',
    color: '#10B981',
    profileId: '1',
    notes: 'Monitor blood sugar levels regularly. Take with meals to reduce GI upset.',
    sideEffects: ['Nausea', 'Stomach upset', 'Metallic taste'],
    effectiveness: 5,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '3',
    name: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'daily',
    times: ['21:00'],
    startDate: '2024-01-01',
    refillDate: '2024-02-25',
    doctorName: 'Dr. Sarah Smith',
    quantity: 30,
    prescriptionNumber: 'RX345678',
    pharmacy: 'CVS Pharmacy',
    medicationType: 'pill',
    color: '#F59E0B',
    profileId: '1',
    notes: 'Take in the evening. Monitor liver function tests quarterly.',
    sideEffects: ['Muscle aches', 'Headache'],
    effectiveness: 4,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z'
  },
  {
    id: '4',
    name: 'Vitamin D3',
    dosage: '2000 IU',
    frequency: 'daily',
    times: ['09:00'],
    startDate: '2024-01-01',
    refillDate: '2024-03-01',
    doctorName: 'Dr. Sarah Smith',
    quantity: 120,
    prescriptionNumber: 'RX901234',
    pharmacy: 'CVS Pharmacy',
    medicationType: 'pill',
    color: '#F97316',
    profileId: '1',
    notes: 'Take with calcium for better absorption. Check vitamin D levels annually.',
    sideEffects: [],
    effectiveness: 4,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z'
  },
  {
    id: '5',
    name: 'Aspirin',
    dosage: '81mg',
    frequency: 'daily',
    times: ['08:30'],
    startDate: '2024-01-01',
    refillDate: '2024-03-15',
    doctorName: 'Dr. Sarah Smith',
    quantity: 100,
    prescriptionNumber: 'RX567890',
    pharmacy: 'CVS Pharmacy',
    medicationType: 'pill',
    color: '#EF4444',
    profileId: '1',
    notes: 'Low-dose for cardiovascular protection. Take with food.',
    sideEffects: ['Stomach irritation'],
    effectiveness: 4,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },

  // Sarah's medications (Profile 2)
  {
    id: '6',
    name: 'Albuterol Inhaler',
    dosage: '90mcg',
    frequency: 'as-needed',
    times: ['12:00'],
    startDate: '2024-01-01',
    refillDate: '2024-02-10',
    doctorName: 'Dr. Michael Johnson',
    quantity: 1,
    prescriptionNumber: 'RX234567',
    pharmacy: 'Walgreens',
    medicationType: 'injection',
    color: '#06B6D4',
    profileId: '2',
    notes: 'Use during asthma attacks or before exercise. Rinse mouth after use.',
    sideEffects: ['Tremors', 'Rapid heartbeat', 'Nervousness'],
    effectiveness: 5,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z'
  },
  {
    id: '7',
    name: 'Fluticasone Nasal Spray',
    dosage: '50mcg',
    frequency: 'daily',
    times: ['07:00', '19:00'],
    startDate: '2024-01-01',
    refillDate: '2024-02-28',
    doctorName: 'Dr. Michael Johnson',
    quantity: 1,
    prescriptionNumber: 'RX678901',
    pharmacy: 'Walgreens',
    medicationType: 'liquid',
    color: '#84CC16',
    profileId: '2',
    notes: 'For seasonal allergies. Prime before first use.',
    sideEffects: ['Nosebleeds', 'Nasal irritation'],
    effectiveness: 4,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z'
  },
  {
    id: '8',
    name: 'Cetirizine',
    dosage: '10mg',
    frequency: 'daily',
    times: ['20:00'],
    startDate: '2024-01-01',
    refillDate: '2024-03-10',
    doctorName: 'Dr. Michael Johnson',
    quantity: 90,
    prescriptionNumber: 'RX345789',
    pharmacy: 'Walgreens',
    medicationType: 'pill',
    color: '#A855F7',
    profileId: '2',
    notes: 'For allergy symptoms. May cause drowsiness.',
    sideEffects: ['Drowsiness', 'Dry mouth'],
    effectiveness: 4,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-11T00:00:00Z'
  },
  {
    id: '9',
    name: 'Prenatal Vitamins',
    dosage: '1 tablet',
    frequency: 'daily',
    times: ['08:00'],
    startDate: '2024-01-01',
    refillDate: '2024-02-15',
    doctorName: 'Dr. Michael Johnson',
    quantity: 30,
    prescriptionNumber: 'RX456789',
    pharmacy: 'Walgreens',
    medicationType: 'pill',
    color: '#EC4899',
    profileId: '2',
    notes: 'Take with food to reduce nausea. Contains folic acid.',
    sideEffects: ['Nausea', 'Constipation'],
    effectiveness: 5,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-09T00:00:00Z'
  },

  // Mary's medications (Profile 3)
  {
    id: '10',
    name: 'Amlodipine',
    dosage: '5mg',
    frequency: 'daily',
    times: ['21:00'],
    startDate: '2024-01-01',
    refillDate: '2024-02-12',
    doctorName: 'Dr. Robert Wilson',
    quantity: 30,
    prescriptionNumber: 'RX567123',
    pharmacy: 'CVS Pharmacy',
    medicationType: 'pill',
    color: '#14B8A6',
    profileId: '3',
    notes: 'Monitor blood pressure regularly. May cause ankle swelling.',
    sideEffects: ['Swelling in ankles', 'Dizziness', 'Flushing'],
    effectiveness: 4,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z'
  },
  {
    id: '11',
    name: 'Ibuprofen',
    dosage: '400mg',
    frequency: 'as-needed',
    times: ['12:00', '18:00'],
    startDate: '2024-01-01',
    refillDate: '2024-03-05',
    doctorName: 'Dr. Robert Wilson',
    quantity: 60,
    prescriptionNumber: 'RX789456',
    pharmacy: 'CVS Pharmacy',
    medicationType: 'pill',
    color: '#F97316',
    profileId: '3',
    notes: 'For arthritis pain. Take with food to prevent stomach upset.',
    sideEffects: ['Stomach upset', 'Heartburn'],
    effectiveness: 4,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-13T00:00:00Z'
  },
  {
    id: '12',
    name: 'Calcium Carbonate',
    dosage: '500mg',
    frequency: 'daily',
    times: ['10:00', '22:00'],
    startDate: '2024-01-01',
    refillDate: '2024-02-28',
    doctorName: 'Dr. Robert Wilson',
    quantity: 100,
    prescriptionNumber: 'RX890123',
    pharmacy: 'CVS Pharmacy',
    medicationType: 'pill',
    color: '#84CC16',
    profileId: '3',
    notes: 'For bone health. Take with meals for better absorption.',
    sideEffects: ['Constipation', 'Gas'],
    effectiveness: 3,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-07T00:00:00Z'
  },
  {
    id: '13',
    name: 'Alendronate',
    dosage: '70mg',
    frequency: 'weekly',
    times: ['07:00'],
    startDate: '2024-01-01',
    refillDate: '2024-03-20',
    doctorName: 'Dr. Robert Wilson',
    quantity: 4,
    prescriptionNumber: 'RX901456',
    pharmacy: 'CVS Pharmacy',
    medicationType: 'pill',
    color: '#8B5CF6',
    profileId: '3',
    notes: 'Take on empty stomach with full glass of water. Stay upright for 30 minutes.',
    sideEffects: ['Heartburn', 'Stomach pain'],
    effectiveness: 4,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-21T00:00:00Z'
  },

  // David's medications (Profile 4)
  {
    id: '14',
    name: 'Carvedilol',
    dosage: '25mg',
    frequency: 'daily',
    times: ['08:00', '20:00'],
    startDate: '2024-01-01',
    refillDate: '2024-02-18',
    doctorName: 'Dr. Jennifer Davis',
    quantity: 60,
    prescriptionNumber: 'RX012345',
    pharmacy: 'Rite Aid',
    medicationType: 'pill',
    color: '#DC2626',
    profileId: '4',
    notes: 'For heart failure and blood pressure. Take with food.',
    sideEffects: ['Dizziness', 'Fatigue', 'Low blood pressure'],
    effectiveness: 5,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-19T00:00:00Z'
  },
  {
    id: '15',
    name: 'Insulin Glargine',
    dosage: '20 units',
    frequency: 'daily',
    times: ['22:00'],
    startDate: '2024-01-01',
    refillDate: '2024-02-08',
    doctorName: 'Dr. Jennifer Davis',
    quantity: 1,
    prescriptionNumber: 'RX123789',
    pharmacy: 'Rite Aid',
    medicationType: 'injection',
    color: '#059669',
    profileId: '4',
    notes: 'Long-acting insulin. Rotate injection sites. Store in refrigerator.',
    sideEffects: ['Injection site reactions', 'Low blood sugar'],
    effectiveness: 5,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-17T00:00:00Z'
  },
  {
    id: '16',
    name: 'Clopidogrel',
    dosage: '75mg',
    frequency: 'daily',
    times: ['09:00'],
    startDate: '2024-01-01',
    refillDate: '2024-02-22',
    doctorName: 'Dr. Jennifer Davis',
    quantity: 30,
    prescriptionNumber: 'RX234890',
    pharmacy: 'Rite Aid',
    medicationType: 'pill',
    color: '#7C3AED',
    profileId: '4',
    notes: 'Blood thinner for heart protection. Watch for unusual bleeding.',
    sideEffects: ['Easy bruising', 'Bleeding'],
    effectiveness: 4,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },

  // Emma's medications (Profile 5)
  {
    id: '17',
    name: 'Methylphenidate',
    dosage: '10mg',
    frequency: 'daily',
    times: ['07:30', '12:30'],
    startDate: '2024-01-01',
    refillDate: '2024-02-05',
    doctorName: 'Dr. Lisa Martinez',
    quantity: 60,
    prescriptionNumber: 'RX345901',
    pharmacy: 'Target Pharmacy',
    medicationType: 'pill',
    color: '#F59E0B',
    profileId: '5',
    notes: 'For ADHD. Monitor appetite and sleep. Take with or after meals.',
    sideEffects: ['Decreased appetite', 'Sleep problems', 'Mood changes'],
    effectiveness: 4,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z'
  },
  {
    id: '18',
    name: 'EpiPen',
    dosage: '0.3mg',
    frequency: 'as-needed',
    times: ['12:00'],
    startDate: '2024-01-01',
    refillDate: '2024-12-01',
    doctorName: 'Dr. Lisa Martinez',
    quantity: 2,
    prescriptionNumber: 'RX456012',
    pharmacy: 'Target Pharmacy',
    medicationType: 'injection',
    color: '#EF4444',
    profileId: '5',
    notes: 'Emergency use only for severe allergic reactions. Always carry two.',
    sideEffects: ['Rapid heartbeat', 'Anxiety', 'Tremors'],
    effectiveness: 5,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-06T00:00:00Z'
  },
  {
    id: '19',
    name: 'Children\'s Multivitamin',
    dosage: '1 gummy',
    frequency: 'daily',
    times: ['08:00'],
    startDate: '2024-01-01',
    refillDate: '2024-03-15',
    doctorName: 'Dr. Lisa Martinez',
    quantity: 90,
    prescriptionNumber: 'RX567123',
    pharmacy: 'Target Pharmacy',
    medicationType: 'pill',
    color: '#10B981',
    profileId: '5',
    notes: 'Chewable gummy vitamin. Take with breakfast.',
    sideEffects: [],
    effectiveness: 4,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z'
  },

  // Additional medications for comprehensive data
  {
    id: '20',
    name: 'Omeprazole',
    dosage: '20mg',
    frequency: 'daily',
    times: ['07:00'],
    startDate: '2024-01-01',
    refillDate: '2024-02-14',
    doctorName: 'Dr. Sarah Smith',
    quantity: 30,
    prescriptionNumber: 'RX678234',
    pharmacy: 'CVS Pharmacy',
    medicationType: 'pill',
    color: '#8B5CF6',
    profileId: '1',
    notes: 'For acid reflux. Take before breakfast on empty stomach.',
    sideEffects: ['Headache', 'Nausea'],
    effectiveness: 4,
    isActive: false, // Inactive medication for testing
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z'
  }
];

const defaultSettings: AppSettings = {
  darkMode: false,
  highContrast: false,
  fontSize: 'medium',
  language: 'en',
  timezone: 'America/New_York',
  notifications: {
    browserNotifications: true,
    soundAlerts: true,
    emailReminders: false,
    smsReminders: false,
    reminderMinutes: [5, 15, 30, 60]
  },
  autoBackup: true,
  dataRetentionDays: 365
};

// Generate comprehensive dose history
const generateExampleDoses = (medications: Medication[]): MedicationDose[] => {
  const doses: MedicationDose[] = [];
  const today = new Date();
  
  // Generate doses for the past 60 days including today for comprehensive analytics
  for (let i = 0; i < 60; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    medications.forEach(medication => {
      if (!medication.isActive) return;
      
      medication.times.forEach(time => {
        const doseId = `${medication.id}-${time}-${dateStr}`;
        
        // Simulate realistic medication taking patterns with variations by profile
        let taken = false;
        let takenTime: string | undefined;
        let effectiveness: number | undefined;
        let sideEffects: string[] = [];
        let notes: string | undefined;
        
        // Different compliance rates by profile to make data more realistic
        let complianceRate = 0.85; // Default 85%
        if (medication.profileId === '1') complianceRate = 0.92; // John - very compliant
        if (medication.profileId === '2') complianceRate = 0.88; // Sarah - good compliance
        if (medication.profileId === '3') complianceRate = 0.78; // Mary - moderate compliance
        if (medication.profileId === '4') complianceRate = 0.95; // David - excellent (heart condition)
        if (medication.profileId === '5') complianceRate = 0.82; // Emma - child, variable
        
        if (i > 0) { // Past days
          taken = Math.random() < complianceRate;
          if (taken) {
            // Add realistic variance to taken time
            const [hours, minutes] = time.split(':').map(Number);
            const variance = Math.floor(Math.random() * 40) - 20; // ±20 minutes
            const takenMinutes = minutes + variance;
            const adjustedHours = hours + Math.floor(takenMinutes / 60);
            const finalMinutes = ((takenMinutes % 60) + 60) % 60;
            takenTime = `${String(Math.max(0, Math.min(23, adjustedHours))).padStart(2, '0')}:${String(finalMinutes).padStart(2, '0')}`;
            
            // Effectiveness rating based on medication type and individual response
            if (medication.effectiveness) {
              const baseEffectiveness = medication.effectiveness;
              const variance = Math.floor(Math.random() * 3) - 1; // ±1 point variance
              effectiveness = Math.max(1, Math.min(5, baseEffectiveness + variance));
            }
            
            // Side effects occurrence (20% chance if medication has known side effects)
            if (medication.sideEffects && medication.sideEffects.length > 0 && Math.random() < 0.2) {
              const numSideEffects = Math.floor(Math.random() * 2) + 1; // 1-2 side effects
              sideEffects = medication.sideEffects
                .sort(() => 0.5 - Math.random())
                .slice(0, numSideEffects);
            }
            
            // Occasional notes (15% chance)
            if (Math.random() < 0.15) {
              const possibleNotes = [
                'Felt good after taking',
                'Took with food',
                'Slight delay due to schedule',
                'No issues today',
                'Feeling better',
                'Took as prescribed',
                'Good response',
                'No side effects noted'
              ];
              notes = possibleNotes[Math.floor(Math.random() * possibleNotes.length)];
            }
          }
        } else { // Today
          const currentHour = today.getHours();
          const currentMinute = today.getMinutes();
          const [scheduleHour, scheduleMinute] = time.split(':').map(Number);
          const currentTotalMinutes = currentHour * 60 + currentMinute;
          const scheduleTotalMinutes = scheduleHour * 60 + scheduleMinute;
          
          if (scheduleTotalMinutes < currentTotalMinutes - 30) {
            // More than 30 minutes past scheduled time
            taken = Math.random() < (complianceRate * 0.95); // Slightly higher for recent doses
            if (taken) {
              const variance = Math.floor(Math.random() * 30) - 15; // ±15 minutes
              const takenMinutes = scheduleMinute + variance;
              const adjustedHours = scheduleHour + Math.floor(takenMinutes / 60);
              const finalMinutes = ((takenMinutes % 60) + 60) % 60;
              takenTime = `${String(Math.max(0, Math.min(23, adjustedHours))).padStart(2, '0')}:${String(finalMinutes).padStart(2, '0')}`;
              
              if (medication.effectiveness) {
                effectiveness = Math.max(1, Math.min(5, medication.effectiveness + (Math.floor(Math.random() * 3) - 1)));
              }
              
              if (Math.random() < 0.1) {
                notes = 'Taken today as scheduled';
              }
            }
          } else if (scheduleTotalMinutes <= currentTotalMinutes + 30) {
            // Within 30 minutes of scheduled time
            taken = Math.random() < 0.6; // 60% chance if it's around the time
            if (taken) {
              takenTime = time;
              if (medication.effectiveness) {
                effectiveness = medication.effectiveness;
              }
            }
          }
          // Future times remain untaken
        }
        
        doses.push({
          id: doseId,
          medicationId: medication.id,
          scheduledTime: time,
          taken,
          takenTime,
          date: dateStr,
          effectiveness,
          sideEffects,
          notes
        });
      });
    });
  }
  
  return doses;
};

export function useMedications() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [doses, setDoses] = useState<MedicationDose[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>(exampleProfiles);
  const [currentProfile, setCurrentProfile] = useState<Profile>(exampleProfiles[0]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    medicationType: [],
    frequency: [],
    doctor: [],
    pharmacy: [],
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [dataLoaded, setDataLoaded] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // Initialize with comprehensive example data on first load
  useEffect(() => {
    const savedMedications = localStorage.getItem('medications');
    const savedDoses = localStorage.getItem('doses');
    const savedProfiles = localStorage.getItem('profiles');
    const savedCurrentProfile = localStorage.getItem('currentProfile');
    const savedSettings = localStorage.getItem('appSettings');

    if (savedMedications && savedDoses && savedProfiles) {
      // Load existing data
      setMedications(JSON.parse(savedMedications));
      setDoses(JSON.parse(savedDoses));
      setProfiles(JSON.parse(savedProfiles));
      
      if (savedCurrentProfile) {
        const parsedCurrentProfile = JSON.parse(savedCurrentProfile);
        const foundProfile = JSON.parse(savedProfiles).find((p: Profile) => p.id === parsedCurrentProfile.id);
        if (foundProfile) {
          setCurrentProfile(foundProfile);
        }
      }
      
      if (savedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      }
    } else {
      // Set comprehensive example data for first time users
      setMedications(exampleMedications);
      const generatedDoses = generateExampleDoses(exampleMedications);
      setDoses(generatedDoses);
      setProfiles(exampleProfiles);
      setCurrentProfile(exampleProfiles[0]);
      setSettings(defaultSettings);
    }
    
    setDataLoaded(true);
  }, []);

  // Request notification permission and set up push notifications
  useEffect(() => {
    if (!dataLoaded) return;

    const setupNotifications = async () => {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        
        if (permission === 'granted' && settings.notifications.browserNotifications) {
          // Show welcome notification
          new Notification('MedTracker Notifications Enabled', {
            body: 'You will now receive medication reminders',
            icon: '/favicon.ico',
            tag: 'welcome'
          });
        }
      }

      // Register service worker for push notifications if available
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered:', registration);
        } catch (error) {
          console.log('Service Worker registration failed:', error);
        }
      }
    };

    if (settings.notifications.browserNotifications) {
      setupNotifications();
    }
  }, [dataLoaded, settings.notifications.browserNotifications]);

  // Enhanced notification system with comprehensive scheduling
  useEffect(() => {
    if (!dataLoaded || !settings.notifications.browserNotifications || notificationPermission !== 'granted') return;

    const checkNotifications = () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentProfile = profiles.find(p => p.id === currentProfile?.id);
      
      if (!currentProfile) return;

      const todaysDoses = doses.filter(dose => {
        const medication = medications.find(med => med.id === dose.medicationId);
        return dose.date === today && 
               !dose.taken && 
               medication?.profileId === currentProfile.id &&
               medication?.isActive;
      });

      todaysDoses.forEach(dose => {
        const medication = medications.find(med => med.id === dose.medicationId);
        if (!medication) return;

        const [hours, minutes] = dose.scheduledTime.split(':').map(Number);
        const scheduledTime = new Date();
        scheduledTime.setHours(hours, minutes, 0, 0);

        // Check if dose is snoozed
        if (dose.snoozedUntil && new Date(dose.snoozedUntil) > now) {
          return;
        }

        // Send reminder notifications
        settings.notifications.reminderMinutes.forEach(reminderMinutes => {
          const reminderTime = new Date(scheduledTime.getTime() - reminderMinutes * 60000);
          
          if (Math.abs(now.getTime() - reminderTime.getTime()) < 30000) { // Within 30 seconds
            const notificationTitle = reminderMinutes === 0 
              ? 'Time to Take Your Medication!' 
              : `Medication Reminder - ${reminderMinutes} minutes`;
            
            const notificationBody = reminderMinutes === 0
              ? `Take ${medication.name} (${medication.dosage}) now`
              : `${medication.name} (${medication.dosage}) due in ${reminderMinutes} minutes`;

            const notification = new Notification(notificationTitle, {
              body: notificationBody,
              icon: '/favicon.ico',
              tag: `reminder-${dose.id}-${reminderMinutes}`,
              badge: '/favicon.ico',
              requireInteraction: reminderMinutes === 0, // Require interaction for immediate reminders
              actions: reminderMinutes === 0 ? [
                { action: 'taken', title: 'Mark as Taken' },
                { action: 'snooze', title: 'Snooze 15min' }
              ] : []
            });

            // Play sound if enabled
            if (settings.notifications.soundAlerts) {
              // Create audio context for notification sound
              const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
              const oscillator = audioContext.createOscillator();
              const gainNode = audioContext.createGain();
              
              oscillator.connect(gainNode);
              gainNode.connect(audioContext.destination);
              
              oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
              oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
              gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
              gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
              
              oscillator.start(audioContext.currentTime);
              oscillator.stop(audioContext.currentTime + 0.5);
            }

            // Handle notification clicks
            notification.onclick = () => {
              window.focus();
              notification.close();
            };
          }
        });

        // Overdue notification (every 30 minutes after scheduled time)
        if (now > scheduledTime) {
          const minutesOverdue = Math.floor((now.getTime() - scheduledTime.getTime()) / 60000);
          
          if (minutesOverdue > 0 && minutesOverdue % 30 === 0 && minutesOverdue <= 180) { // Up to 3 hours
            new Notification('Medication Overdue', {
              body: `${medication.name} (${medication.dosage}) was due ${minutesOverdue} minutes ago`,
              icon: '/favicon.ico',
              tag: `overdue-${dose.id}`,
              badge: '/favicon.ico',
              requireInteraction: true,
              actions: [
                { action: 'taken', title: 'Mark as Taken' },
                { action: 'skip', title: 'Skip This Dose' }
              ]
            });
          }
        }
      });
    };

    // Check notifications every 30 seconds for precise timing
    const interval = setInterval(checkNotifications, 30000);
    
    // Also check immediately
    checkNotifications();
    
    return () => clearInterval(interval);
  }, [doses, medications, settings.notifications, notificationPermission, dataLoaded, currentProfile]);

  // Save data to localStorage whenever state changes (after initial load)
  useEffect(() => {
    if (dataLoaded) {
      localStorage.setItem('medications', JSON.stringify(medications));
    }
  }, [medications, dataLoaded]);

  useEffect(() => {
    if (dataLoaded) {
      localStorage.setItem('doses', JSON.stringify(doses));
    }
  }, [doses, dataLoaded]);

  useEffect(() => {
    if (dataLoaded) {
      localStorage.setItem('profiles', JSON.stringify(profiles));
    }
  }, [profiles, dataLoaded]);

  useEffect(() => {
    if (dataLoaded) {
      localStorage.setItem('currentProfile', JSON.stringify(currentProfile));
    }
  }, [currentProfile, dataLoaded]);

  useEffect(() => {
    if (dataLoaded) {
      localStorage.setItem('appSettings', JSON.stringify(settings));
    }
  }, [settings, dataLoaded]);

  // Generate doses for new medications
  useEffect(() => {
    if (!dataLoaded) return;
    
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    
    medications.forEach(medication => {
      if (medication.profileId !== currentProfile.id || !medication.isActive) return;
      
      medication.times.forEach(time => {
        const existingDose = doses.find(
          dose => 
            dose.medicationId === medication.id &&
            dose.scheduledTime === time &&
            dose.date === dateStr
        );

        if (!existingDose) {
          const newDose: MedicationDose = {
            id: `${medication.id}-${time}-${dateStr}`,
            medicationId: medication.id,
            scheduledTime: time,
            taken: false,
            date: dateStr
          };
          
          setDoses(prev => [...prev, newDose]);
        }
      });
    });
  }, [medications, currentProfile.id, dataLoaded]);

  const addMedication = (medicationData: Omit<Medication, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => {
    const now = new Date().toISOString();
    const newMedication: Medication = {
      ...medicationData,
      id: Date.now().toString(),
      isActive: true,
      createdAt: now,
      updatedAt: now
    };
    setMedications(prev => [...prev, newMedication]);
  };

  const updateMedication = (id: string, updates: Partial<Medication>) => {
    setMedications(prev => prev.map(med => 
      med.id === id 
        ? { ...med, ...updates, updatedAt: new Date().toISOString() }
        : med
    ));
  };

  const deleteMedication = (id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id));
    setDoses(prev => prev.filter(dose => dose.medicationId !== id));
  };

  const markDoseTaken = (doseId: string, effectiveness?: number, sideEffects?: string[], notes?: string) => {
    setDoses(prev => prev.map(dose => 
      dose.id === doseId 
        ? { 
            ...dose, 
            taken: true, 
            takenTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            effectiveness,
            sideEffects: sideEffects || [],
            notes
          }
        : dose
    ));

    // Show confirmation notification
    if (notificationPermission === 'granted') {
      const dose = doses.find(d => d.id === doseId);
      const medication = medications.find(m => m.id === dose?.medicationId);
      
      if (dose && medication) {
        new Notification('Medication Recorded', {
          body: `${medication.name} marked as taken`,
          icon: '/favicon.ico',
          tag: `taken-${doseId}`
        });
      }
    }
  };

  const snoozeDose = (doseId: string, minutes: number) => {
    const snoozeUntil = new Date();
    snoozeUntil.setMinutes(snoozeUntil.getMinutes() + minutes);
    
    setDoses(prev => prev.map(dose => 
      dose.id === doseId 
        ? { ...dose, snoozedUntil: snoozeUntil.toISOString() }
        : dose
    ));

    // Show snooze confirmation notification
    if (notificationPermission === 'granted') {
      const dose = doses.find(d => d.id === doseId);
      const medication = medications.find(m => m.id === dose?.medicationId);
      
      if (dose && medication) {
        new Notification('Medication Snoozed', {
          body: `${medication.name} reminder snoozed for ${minutes} minutes`,
          icon: '/favicon.ico',
          tag: `snoozed-${doseId}`
        });
      }
    }
  };

  const addProfile = (profileData: Omit<Profile, 'id' | 'createdAt'>) => {
    const newProfile: Profile = {
      ...profileData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setProfiles(prev => [...prev, newProfile]);
  };

  const updateProfile = (id: string, updates: Partial<Profile>) => {
    setProfiles(prev => prev.map(profile => 
      profile.id === id ? { ...profile, ...updates } : profile
    ));
    
    if (id === currentProfile.id) {
      setCurrentProfile(prev => ({ ...prev, ...updates }));
    }
  };

  const deleteProfile = (id: string) => {
    if (profiles.length <= 1) return; // Don't delete the last profile
    
    setProfiles(prev => prev.filter(profile => profile.id !== id));
    setMedications(prev => prev.filter(med => med.profileId !== id));
    setDoses(prev => prev.filter(dose => {
      const medication = medications.find(med => med.id === dose.medicationId);
      return medication?.profileId !== id;
    }));
    
    if (id === currentProfile.id) {
      setCurrentProfile(profiles.find(p => p.id !== id) || profiles[0]);
    }
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    
    // Handle notification permission changes
    if (newSettings.notifications?.browserNotifications && notificationPermission !== 'granted') {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
      });
    }
  };

  const exportData = () => {
    const data = {
      medications,
      doses,
      profiles,
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medtracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          
          if (data.medications && data.doses && data.profiles) {
            setMedications(data.medications);
            setDoses(data.doses);
            setProfiles(data.profiles);
            if (data.settings) {
              setSettings({ ...defaultSettings, ...data.settings });
            }
            resolve(true);
          } else {
            reject(new Error('Invalid backup file format'));
          }
        } catch (error) {
          reject(new Error('Failed to parse backup file'));
        }
      };
      reader.readAsText(file);
    });
  };

  const getAnalytics = (): Analytics => {
    const profileDoses = doses.filter(dose => {
      const medication = medications.find(med => med.id === dose.medicationId);
      return medication?.profileId === currentProfile.id;
    });

    const totalDoses = profileDoses.length;
    const takenDoses = profileDoses.filter(dose => dose.taken);
    const complianceRate = totalDoses > 0 ? Math.round((takenDoses.length / totalDoses) * 100) : 0;

    // Calculate streak (consecutive days with 100% compliance)
    let streakDays = 0;
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayDoses = profileDoses.filter(dose => dose.date === dateStr);
      const dayTaken = dayDoses.filter(dose => dose.taken);
      
      if (dayDoses.length === 0) {
        continue; // Skip days with no medications
      } else if (dayTaken.length === dayDoses.length) {
        streakDays++;
      } else {
        break;
      }
    }

    // Calculate average effectiveness
    const effectivenessDoses = takenDoses.filter(dose => dose.effectiveness);
    const averageEffectiveness = effectivenessDoses.length > 0 
      ? effectivenessDoses.reduce((sum, dose) => sum + (dose.effectiveness || 0), 0) / effectivenessDoses.length
      : 0;

    // Common side effects analysis
    const allSideEffects = takenDoses.flatMap(dose => dose.sideEffects || []);
    const sideEffectCounts = allSideEffects.reduce((acc, effect) => {
      acc[effect] = (acc[effect] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const commonSideEffects = Object.entries(sideEffectCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([effect]) => effect);

    // Medication trends (last 30 days)
    const medicationTrends = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayDoses = profileDoses.filter(dose => dose.date === dateStr);
      const taken = dayDoses.filter(dose => dose.taken).length;
      const missed = dayDoses.length - taken;
      
      medicationTrends.push({
        date: dateStr,
        taken,
        missed,
        total: dayDoses.length
      });
    }

    return {
      complianceRate,
      streakDays,
      totalDosesTaken: takenDoses.length,
      totalDosesMissed: totalDoses - takenDoses.length,
      averageEffectiveness: Math.round(averageEffectiveness * 10) / 10,
      commonSideEffects,
      medicationTrends
    };
  };

  const getFilteredMedications = () => {
    let filtered = medications.filter(med => med.profileId === currentProfile.id);

    // Apply filters
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase();
      filtered = filtered.filter(med => 
        med.name.toLowerCase().includes(query) ||
        med.dosage.toLowerCase().includes(query) ||
        med.doctorName.toLowerCase().includes(query) ||
        med.pharmacy.toLowerCase().includes(query) ||
        (med.notes && med.notes.toLowerCase().includes(query)) ||
        (med.prescriptionNumber && med.prescriptionNumber.toLowerCase().includes(query))
      );
    }

    if (searchFilters.medicationType.length > 0) {
      filtered = filtered.filter(med => searchFilters.medicationType.includes(med.medicationType));
    }

    if (searchFilters.frequency.length > 0) {
      filtered = filtered.filter(med => searchFilters.frequency.includes(med.frequency));
    }

    if (searchFilters.doctor.length > 0) {
      filtered = filtered.filter(med => searchFilters.doctor.includes(med.doctorName));
    }

    if (searchFilters.pharmacy.length > 0) {
      filtered = filtered.filter(med => searchFilters.pharmacy.includes(med.pharmacy));
    }

    if (searchFilters.status !== 'all') {
      filtered = filtered.filter(med => 
        searchFilters.status === 'active' ? med.isActive : !med.isActive
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (searchFilters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'time':
          aValue = a.times[0];
          bValue = b.times[0];
          break;
        case 'doctor':
          aValue = a.doctorName.toLowerCase();
          bValue = b.doctorName.toLowerCase();
          break;
        case 'pharmacy':
          aValue = a.pharmacy.toLowerCase();
          bValue = b.pharmacy.toLowerCase();
          break;
        case 'effectiveness':
          aValue = a.effectiveness || 0;
          bValue = b.effectiveness || 0;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (searchFilters.sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
    });

    return filtered;
  };

  return {
    medications: getFilteredMedications(),
    allMedications: medications,
    doses: doses.filter(dose => {
      const medication = medications.find(med => med.id === dose.medicationId);
      return medication?.profileId === currentProfile.id;
    }),
    profiles,
    currentProfile,
    settings,
    searchFilters,
    analytics: getAnalytics(),
    notificationPermission,
    addMedication,
    updateMedication,
    deleteMedication,
    markDoseTaken,
    snoozeDose,
    addProfile,
    updateProfile,
    deleteProfile,
    setCurrentProfile,
    updateSettings,
    setSearchFilters,
    exportData,
    importData
  };
}