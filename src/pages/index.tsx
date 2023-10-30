import { useState, useEffect, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { AuthContext } from '../contexts/auth';
import TopicList from './topic_list';
import DebateRating from './DebateRating'; 
import './index.css';
import { Button } from '@material-tailwind/react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function HomePage() {
  const { user, signOut } = useContext(AuthContext);
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [newEventName, setNewEventName] = useState('');
  const [debates, setDebates] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchTopicsForCurrentEvent();
  }, [currentEvent]);

  const handleDebateRatingSubmission = (selectedDebate, criteriaScores) => {
    // Here, you will send the data to the database (for example, using supabase).
    // This will involve inserting the data into the Rating table.
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase.from('events').select('*');
    if (data) {
      setEvents(data);
      if (!currentEvent) {
        setCurrentEvent(data[0]);
      }
    }
    if (error) console.error('Error fetching events:', error);
  };

  const fetchTopicsForCurrentEvent = async () => {
    if (!currentEvent) return;

    console.log('Fetching topics for event ID:', currentEvent.id);

    const { data, error } = await supabase.from('topics').select('*').filter('event_id', 'eq', currentEvent.id);
    if (data) {
      console.log('Fetched topics:', data);
      setTopics(data);
    }
    if (error) console.error('Error fetching topics:', error);
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
    <div className="bg-purple text-aqua p-4">
      <h1 className="text-4xl font-bold">Welcome to the Debate Judging App!</h1>
      {!user ? (
        <Auth supabaseClient={supabase} providers={['google', 'github']} />
      ) : (
        <>
          <div>
            <label className="mr-2">Select Event: </label>
            <select 
              className="border border-aqua rounded p-1" 
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
            <Button className="black rounded px-2 py-1 ml-2" color="black" onClick={signOut}>Logout</Button>
          </div>

          <div className="mt-4">
            <input 
              className="border border-aqua rounded p-1 mr-2" 
              value={newEventName} 
              onChange={(e) => setNewEventName(e.target.value)} 
              placeholder="New Event Name"
            />
            <Button className="black rounded px-2 py-1" color="black" onClick={handleCreateEvent}>Create Event</Button>
          </div>

          {currentEvent && (
            <div className="mt-4">
              <input className="border border-aqua rounded p-1 mr-2" value={newTopic} onChange={e => setNewTopic(e.target.value)} placeholder="Enter a new topic" />
              <Button className="black rounded px-2 py-1" color="black" onClick={handleTopicSubmission}>Submit</Button>

              <h2 className="text-2xl font-bold mt-4">Topics for {currentEvent.name}</h2>
              <ul className="list-disc list-inside">
                {topics.map(topic => (
                  <li key={topic.id} className="mt-2">
                    {topic.topic_name} - Votes: {topic.votes}
                    <Button className="purple rounded px-2 py-1 ml-2" color="aqua" text="purple" onClick={() => handleVote(topic.id)}>Vote</Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
      <DebateRating debates={debates} onSubmit={handleDebateRatingSubmission} />
     
    </div>
  );
}

