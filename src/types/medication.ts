export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: 'daily' | 'weekly' | 'as-needed';
  times: string[];
  startDate: string;
  refillDate: string;
  doctorName: string;
  photo?: string;
  quantity: number;
  prescriptionNumber: string;
  pharmacy: string;
  medicationType: 'pill' | 'liquid' | 'injection' | 'topical';
  color: string;
  profileId: string;
  notes?: string;
  sideEffects?: string[];
  effectiveness?: number; // 1-5 rating
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationDose {
  id: string;
  medicationId: string;
  scheduledTime: string;
  takenTime?: string;
  taken: boolean;
  date: string;
  snoozedUntil?: string;
  notes?: string;
  sideEffects?: string[];
  effectiveness?: number;
}

export interface Profile {
  id: string;
  name: string;
  relationship: string;
  avatar?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
  allergies?: string[];
  medicalConditions?: string[];
  preferredPharmacy?: string;
  doctorName?: string;
  createdAt: string;
}

export interface PharmacyInfo {
  name: string;
  phone: string;
  address: string;
}

export interface NotificationSettings {
  browserNotifications: boolean;
  soundAlerts: boolean;
  emailReminders: boolean;
  smsReminders: boolean;
  reminderMinutes: number[];
}

export interface AppSettings {
  darkMode: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  autoBackup: boolean;
  dataRetentionDays: number;
}

export interface Analytics {
  complianceRate: number;
  streakDays: number;
  totalDosesTaken: number;
  totalDosesMissed: number;
  averageEffectiveness: number;
  commonSideEffects: string[];
  medicationTrends: {
    date: string;
    taken: number;
    missed: number;
    total: number;
  }[];
}

export interface SearchFilters {
  query: string;
  medicationType: string[];
  frequency: string[];
  doctor: string[];
  pharmacy: string[];
  status: 'all' | 'active' | 'inactive';
  sortBy: 'name' | 'time' | 'doctor' | 'pharmacy' | 'effectiveness';
  sortOrder: 'asc' | 'desc';
}