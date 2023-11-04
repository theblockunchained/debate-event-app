import React, { useEffect, useState } from 'react';
import { SupabaseClient, User } from '@supabase/supabase-js';
import Toast from './Toast';

interface ProfileSetupProps {
  supabase: SupabaseClient;
  user: User | null;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ supabase, user }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [contactPermission, setContactPermission] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const closeToast = () => setShowToast(false);

  useEffect(() => {
    checkProfile();
  }, []);

  const upsertProfile = async () => {
    if (!user) {
      setToastMessage("User not found.");
      setToastType('error');
      setShowToast(true);
      return;
    }
  
    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select()
        .eq('auth_profile_id', user.id);
  
      if (fetchError) {
        throw fetchError;
      }
  
      const updates = {
        auth_profile_id: user.id,
        name: name,
        contact_permission: contactPermission
      };
  
      let error;
  
      if (existingProfile && existingProfile.length > 0) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('auth_profile_id', user.id);
  
        error = updateError;
      } else {
        // Insert new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(updates);
  
        error = insertError;
      }
  
      if (error) {
        throw error;
      }
  
      setToastMessage("Profile updated successfully!");
      setToastType('success');
      setShowToast(true);
      setEditing(false);
    } catch (error: any) {
      setToastMessage(error.message);
      setToastType('error');
      setShowToast(true);
    }
  };
  

  const checkProfile = async () => {
    if (!user) {
      setToastMessage("User not found.");
      setToastType('error');
      setShowToast(true);
      return;
    }

    try {
      const { data, error } = await supabase.from('profiles').select().eq('auth_profile_id', user.id);

      if (error) {
        throw error;
      }

      if (data && data.length === 1) {
        const profile = data[0];
        setName(profile.name || "");
        setContactPermission(profile.contact_permission || false);
        if (profile.name) {
          setEditing(false); // set to false if name exists
        }
      } else if (data && data.length > 1) {
        throw new Error("Multiple profiles found for user.");
      }

    } catch (error: any) {
      setToastMessage(error.message);
      setToastType('error');
      setShowToast(true);
    }
  };

  return (
    <div className="card">
      
      {editing ? (
        <div className='margin-bt-15'>
            <h2 className='mr-2 text-2xl font-bold'>Profile Setup</h2>
          <input className="border rounded p-1 mr-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <div>
          <label>
           
            <input type="checkbox" checked={contactPermission} onChange={(e) => setContactPermission(e.target.checked)} />
            Contact Permission
          </label>
          </div>
          <div>
          <button className='black rounded px-2 py-1 ml-2' onClick={upsertProfile}>
            {name ? 'Update Profile' : 'Submit Profile'}
          </button>
          </div>
        </div>
      ) : (
        <div className='margin-bt-15 text-center'>
            <h2 className='mr-2 text-2xl font-bold'>Howdy, {name}. <br></br>Let&apos;s start a debate!</h2>
          <a className='edit-profile rounded px-2 py-1 ml-2' onClick={() => setEditing(true)}>Edit Profile</a>
        </div>
      )}

      {showToast && (
        <Toast 
          message={toastMessage} 
          type={toastType} 
          onClose={closeToast}
        />
      )}
    </div>
  );
};

export default ProfileSetup;
