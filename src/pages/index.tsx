import Image from 'next/image'
import { supabase } from '../lib/supabase';

export async function getServerSideProps() {
    let { data: topics, error } = await supabase.from('topics').select('*');
  
    if (error) console.error('Error fetching topics:', error);
  
    return {
      props: { topics }
    };
  }

export default function Home({ topics }) {
  return (
	<div>
  	<h1>Welcome to the Debate Judging App!</h1>
  	<ul>
    	{topics.map(topic => (
      	<li key={topic.id}>{topic.topic_name}</li>
    	))}
  	</ul>
	</div>
  );
}

