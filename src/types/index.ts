// User model matching Flutter app structure
export interface EmergencyContact {
  name: string;
  phone: string;
  relationship?: string;
}

export interface MedicalDocument {
  id: string;
  name: string;
  type: 'Prescription' | 'Medical Report' | 'Insurance Card' | 'Vaccine Record' | 'Other';
  url: string;
  thumbnailUrl?: string;
  fileSizeBytes: number;
  uploadedAt: Date;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone: string;
  bloodGroup?: string;
  age?: string;
  address?: string;
  medicalConditions?: string;
  allergies?: string;
  medications?: string;
  emergencyContacts: EmergencyContact[];
  medicalDocuments?: MedicalDocument[];
  createdAt: Date;
  updatedAt: Date;
  nfcTagId?: string;
}

// NFC Data model
export interface NFCData {
  userId: string;
  userName: string;
  userPhone: string;
  bloodGroup?: string;
  medicalConditions?: string;
  allergies?: string;
  emergencyContacts: EmergencyContact[];
  createdAt: Date;
}

// Auth context types
export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}
