'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import toast from 'react-hot-toast';
import { Save, X, Plus, Trash2, Loader2 } from 'lucide-react';
import { EmergencyContact } from '@/types';

interface EmergencyContactsEditorProps {
  onClose: () => void;
}

export default function EmergencyContactsEditor({ onClose }: EmergencyContactsEditorProps) {
  const { userProfile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(
    userProfile?.emergencyContacts || []
  );

  const handleAddContact = () => {
    setEmergencyContacts([
      ...emergencyContacts,
      { name: '', phone: '', relationship: '' },
    ]);
  };

  const handleRemoveContact = (index: number) => {
    setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
  };

  const handleContactChange = (index: number, field: keyof EmergencyContact, value: string) => {
    const updated = [...emergencyContacts];
    updated[index] = { ...updated[index], [field]: value };
    setEmergencyContacts(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userProfile?.uid) {
      toast.error('User not found');
      return;
    }

    // Validate that all contacts have at least name and phone
    const validContacts = emergencyContacts.filter(c => c.name && c.phone);
    
    if (validContacts.length === 0) {
      toast.error('Please add at least one emergency contact');
      return;
    }

    setLoading(true);

    try {
      const userRef = doc(db, 'users', userProfile.uid);
      await updateDoc(userRef, {
        emergencyContacts: validContacts,
        updatedAt: new Date().toISOString(),
      });

      await refreshProfile();
      toast.success('Emergency contacts updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating emergency contacts:', error);
      toast.error('Failed to update emergency contacts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Manage Emergency Contacts</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-purple-900">
              <strong>Important:</strong> These contacts will be notified in case of emergency.
              Make sure to add people who can respond quickly and are aware they're listed as your emergency contacts.
            </p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Contacts</h3>
            <button
              type="button"
              onClick={handleAddContact}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Contact
            </button>
          </div>

          <div className="space-y-4">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Contact {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveContact(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                      placeholder="+91 1234567890"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Relationship
                    </label>
                    <input
                      type="text"
                      value={contact.relationship || ''}
                      onChange={(e) => handleContactChange(index, 'relationship', e.target.value)}
                      placeholder="Spouse, Parent, Friend"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}

            {emergencyContacts.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 mb-4">No emergency contacts added yet</p>
                <button
                  type="button"
                  onClick={handleAddContact}
                  className="btn-secondary"
                >
                  Add Your First Contact
                </button>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Contacts
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
