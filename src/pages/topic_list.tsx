import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function TopicList() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const { data, error } = await supabase.from('topics').select('topic_name');
      if (data) {
        setTopics(data);
      }
      if (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchTopics();
  }, []);

  return (
    <div>
      <h1>All Topics</h1>
      <ul>
        {topics.map((topic, index) => (
          <li key={index}>{topic.topic_name}</li>
        ))}
      </ul>
    </div>
  );
}
