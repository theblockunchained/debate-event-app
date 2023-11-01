import { Auth } from '@supabase/auth-ui-react';

function UserAuth({ supabase }) {
  return <Auth SupabaseClient={supabase} providers={['google', 'github']} />;
}

export default UserAuth;
