import Image from 'next/image'
import { supabase } from '../lib/supabase';
import { useContext } from 'react';
import { AuthContext } from '../contexts/auth';
import { UserContext, Auth } from '@supabase/ui';


export async function getServerSideProps() {
    let { data: topics, error } = await supabase.from('topics').select('*');
  
    if (error) console.error('Error fetching topics:', error);
  
    return {
      props: { topics }
    };
  }

export default function Home({ topics }) {
  const { user, signIn, signOut } = useContext(AuthContext);
  return (
	<div>
  	<h1>Welcome to the Debate Judging App!</h1>
    {!user ? (
            	<Auth supabaseClient={supabase}>
                	<Auth.LogIn />
                	<Auth.SignUp />
            	</Auth>
        	) : (
            	<>
                	<p>Hello, {user.email}</p>
                	<button onClick={signOut}>Logout</button>
            	</>
        	)}
  	<ul>
    	{topics.map(topic => (
      	<li key={topic.id}>{topic.topic_name}</li>
    	))}
  	</ul>
	</div>
  );
}

