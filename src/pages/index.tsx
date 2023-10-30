import { useState, useEffect, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { AuthContext } from '../contexts/auth';
import TopicList from './topic_list';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function HomePage() {
  const { user, signOut } = useContext(AuthContext);
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [newEventName, setNewEventName] = useState('');

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from('events').select('*');
      if (data) {
        setEvents(data);
        setCurrentEvent(data[0]);
      }
      if (error) console.error('Error fetching events:', error);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!currentEvent) return;

      console.log('Fetching topics for event ID:', currentEvent.id);

      const { data, error } = await supabase.from('topics').select('*').filter('event_id', 'eq', currentEvent.id);
      if (data) {
        console.log('Fetched topics:', data);
        setTopics(data);
      }
      if (error) console.error('Error fetching topics:', error);
    }
    fetchData();
  }, [currentEvent]);

  const fetchEvents = async () => {
    const { data, error } = await supabase.from('events').select('*');
    if (data) setEvents(data);
    if (error) console.error('Error fetching events:', error);
  };

  const handleTopicSubmission = async () => {
    if(!currentEvent) {
        alert("Please select an event first.");
        return;
    }
    const { data, error } = await supabase.from('topics').insert([{ topic_name: newTopic, event_id: currentEvent.id }]);
      
    if (error) {
      console.error("Error submitting new topic:", error);
      return;
    }
    if (data) setTopics(prevTopics => [...prevTopics, data[0]]);
    setNewTopic('');
  };

  const handleVote = async (topicId) => {
    const topicToUpdate = topics.find(t => t.id === topicId);
    const updatedVotes = topicToUpdate.votes + 1;

    const { error } = await supabase.from('topics').update({ votes: updatedVotes }).eq('id', topicId);
    if (error) {
      console.error("Error updating vote count:", error);
      return;
    }

    const updatedTopics = topics.map(t => t.id === topicId ? { ...t, votes: updatedVotes } : t);
    setTopics(updatedTopics);
  };

  const handleCreateEvent = async () => {
    const { data, error } = await supabase.from('events').insert([{ name: newEventName }]);
    if (error) {
      console.error('Error creating event:', error);
      return;
    }
    if (data && data.length > 0) {
        setEvents(prevEvents => [...prevEvents, data[0]]);
        setNewEventName('');
    }
  };

  return (
    <div>
      <h1>Welcome to the Debate Judging App!</h1>
      {!user ? (
        <Auth supabaseClient={supabase} providers={['google', 'github']} />
      ) : (
        <>
          <div>
            <label>Select Event: </label>
            <select 
              value={currentEvent?.id || ''} 
              onChange={(e) => {
                const eventId = parseInt(e.target.value, 10);
                setCurrentEvent(events.find(event => event.id === eventId));
              }}>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
            <button onClick={signOut}>Logout</button>
          </div>

          <div>
            <input 
              value={newEventName} 
              onChange={(e) => setNewEventName(e.target.value)} 
              placeholder="New Event Name"
            />
            <button onClick={handleCreateEvent}>Create Event</button>
          </div>

          {currentEvent && (
            <div>
              <input value={newTopic} onChange={e => setNewTopic(e.target.value)} placeholder="Enter a new topic" />
              <button onClick={handleTopicSubmission}>Submit</button>

              <h2>Topics for {currentEvent.name}</h2>
              <ul>
                {topics.map(topic => (
                  <li key={topic.id}>
                    {topic.topic_name} - Votes: {topic.votes}
                    <button onClick={() => handleVote(topic.id)}>Vote</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
      <TopicList />
    </div>
  );

}



