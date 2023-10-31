import { Auth } from '@supabase/auth-ui-react';

function UserAuth({ supabase }) {
  return <Auth supabaseClient={supabase} providers={['google', 'github']} />;
}

export default UserAuth;
