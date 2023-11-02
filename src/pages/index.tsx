import { Auth } from '@supabase/auth-ui-react';
import { Button } from '@material-tailwind/react';
import './index.css';
import { useEffect, useState, useContext, useCallback } from 'react';
import supabase from '../SupabaseClient';
import { AuthContext } from '../contexts/auth';
import DebateRating from './DebateRating'; 
import EventSelector from './EventSelector';
import EventCreation from './EventCreation';
import DebateCreation from './DebateCreation';
import TopicCreation from './TopicCreation';  
import React from 'react';

interface Event {
  id: number;
  name: string;
  // ... other properties
}

interface Topic {
  id: number;
  topic_name: string;
  votes: number;
  // ...other properties of a Topic
}

interface AppDebate {
  id: number;
  affirmative_name: string;
  negative_name: string;
  topic_id: number;
  event_id: number;
  name: string;
  topic: string;
}

interface EventSelectorProps {
  events: Event[];
  currentEvent: Event | null;
  onEventChange: (event: Event | null) => void;
}

export default function HomePage() {
  const { user, signOut } = useContext(AuthContext);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [newEventName, setNewEventName] = useState('');
  const [debates, setDebates] = useState<AppDebate[]>([]);  // Updated to AppDebate[]

  useEffect(() => {
    fetchEvents();
    fetchDebates();
  }, []);

  useEffect(() => {
    fetchTopicsForCurrentEvent();
  }, [currentEvent]);

  const fetchEvents = async () => {
    const { data, error } = await supabase.from('events').select('*');
    if (data) {
      const formattedData: Event[] = data.map(item => ({
        id: item.id,
        name: item.name,
      }));
      setEvents(formattedData);
      if (!currentEvent) {
        setCurrentEvent(formattedData[0]);
      }
    }
    if (error) console.error('Error fetching events:', error);
  };

  const fetchDebates = async () => {
    const { data, error } = await supabase.from('debates').select('*');
    if (data) {
      setDebates(data as AppDebate[]);
    }
    if (error) console.error('Error fetching debates:', error);
  };

  const fetchTopicsForCurrentEvent = useCallback(async () => {
    if (!currentEvent) return;
    console.log('Fetching topics for event ID:', currentEvent.id);
    const { data, error } = await supabase.from('topics').select('*').filter('event_id', 'eq', currentEvent.id);
    if (data) {
      console.log('Fetched topics:', data);
      setTopics(data as Topic[]);
    }
    if (error) console.error('Error fetching topics:', error);
  }, [currentEvent, setTopics]); 

  const handleVote = async (topicId: number) => {
    const topicToUpdate = topics.find(t => t.id === topicId);
    if (!topicToUpdate) {
      console.error("No topic found with id:", topicId);
      return;
    }
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
    if (data && (data as Array<any>).length > 0) {
      setEvents(prevEvents => [...prevEvents, data[0]]);
      setNewEventName('');
    }
  };  

  return (
    <div className="main-container text-aqua p-4">
      <h1 className="text-4xl font-bold text-center">Welcome to the Super Debate App!</h1>
      <div className='margin-bt-30 text-center'>Create events, submit and vote on topics, create debates on topics, and have judges submit their scores.</div>
      {!user ? (
        <div className="card">
          <Auth supabaseClient={supabase} providers={['google', 'github']} />
        </div>
      ) : (
        <>
          <div className="card">
            <EventSelector events={events} currentEvent={currentEvent} onEventChange={setCurrentEvent} />
            <EventCreation newEventName={newEventName} onEventNameChange={setNewEventName} onCreate={handleCreateEvent} />
          </div>
          {currentEvent && (
            <>
              <DebateCreation 
                currentEvent={currentEvent} 
                topics={topics || []}  // Ensure topics is always an array
                onDebateCreation={newDebate => setDebates(prevDebates => [...prevDebates, newDebate as AppDebate])}
              />
              <div className="mt-4 card">
                <h3 className='mr-2 text-2xl font-bold m'>Submit a topic or vote for one</h3>
                <TopicCreation 
                  currentEvent={currentEvent}
                  topics={topics}
                  onTopicCreation={newTopic => setTopics(prevTopics => [...prevTopics, newTopic])}
                  onVote={handleVote}
                />
                <h3 className="text-l font-bold mt-4">Vote on submitted debate topics for {currentEvent.name}</h3>
                <ul className="list-inside">
                  {topics.map(topic => (
                    <li key={topic.id} className="mt-2">
                      <Button className="purple rounded px-2 py-1 ml-2" onClick={() => handleVote(topic.id)}>Vote</Button>
                      <div className="inline-votes">{topic.topic_name} - Votes: {topic.votes}</div>
                    </li>
                  ))}
                </ul>
              </div>
              <DebateRating selectedEventId={currentEvent?.id} user={user} />
            </>
          )}
        </>
      )}
      <div>
        <div className="logout px-2 py-1 ml-2 text-center" onClick={signOut}>Logout</div>
      </div>
    </div>
  );
}
