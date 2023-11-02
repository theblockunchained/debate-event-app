import { Auth } from '@supabase/auth-ui-react';
import { SupabaseClient } from '@supabase/supabase-js';

interface UserAuthProps {
  supabase: SupabaseClient;
}

const UserAuth: React.FC<UserAuthProps> = ({ supabase }) => {
  return <Auth supabaseClient={supabase} providers={['google', 'github']} />;
}

export default UserAuth;
