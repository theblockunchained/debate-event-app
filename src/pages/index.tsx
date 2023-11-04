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
import ProfileSetup from './ProfileSetup';
import TopicVoting from './TopicVoting';

interface Event {
  id: number;
  name: string;
}

interface Topic {
  id: number;
  topic_name: string;
  votes: number;
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
  const [debates, setDebates] = useState<AppDebate[]>([]);

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
      if (!currentEvent && formattedData.length > 0) {
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

  const handleVote = async (topicId: number): Promise<void> => {
  
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
    const { data: newEvent, error } = await supabase.from('events').insert([{ name: newEventName }]).single();
    if (error) {
      console.error('Error creating event:', error);
      return;
    }
    if (newEvent) {
      console.log('New event from Supabase:', newEvent);
    console.log(newEvent); 
    }
    
    if (newEvent) {
      setEvents(prevEvents => [...prevEvents, newEvent]);
      setCurrentEvent(newEvent); // Set the current event to the new event
      setNewEventName('');
    }
  };

  return (
    <div className="main-container text-aqua p-4">
      <div className='items-center flex justify-center margin-bt-30'>
        <img src="super-debate-logo.png" alt="logo" width="200px"/>
      </div>
      <h1 className="text-4xl font-bold text-center white-text">Welcome to the Super Debate App</h1>
      <div className='margin-bt-30 text-center white-text'>
        Easily utilize the Super Debate format. Create events, submit and vote on topics, create debates on topics, and have judges submit their scores.
      </div>
      {!user ? (
        <>
          <div className='text-center white-text'>Please sign in to continue.</div>
          <div className="card">
            <div className='auth-form-container'>
              <Auth supabaseClient={supabase} providers={['google']} />
            </div>
          </div>
        </>
      ) : (
        <>
          <ProfileSetup supabase={supabase} user={user} />
          <div className="card">
          <EventSelector
    key={events.length}
    events={events}
    currentEvent={currentEvent}
    onEventChange={setCurrentEvent}
/>

            <div className='solid-divide'></div>
            <div className="font-bold margin-top-10">Or create a new event</div>
            <EventCreation newEventName={newEventName} onEventNameChange={setNewEventName} onCreate={handleCreateEvent} />
          </div>
          {currentEvent && (
            <>
              <DebateCreation
                currentEvent={currentEvent}
                topics={topics}
                onDebateCreation={newDebate => setDebates(prevDebates => [...prevDebates, newDebate as AppDebate])}
              />
             <TopicVoting 
            currentEvent={currentEvent}
            topics={topics}
            onTopicCreation={newTopic => setTopics(prevTopics => [...prevTopics, newTopic])}
            onVote={handleVote}
          />
              <DebateRating selectedEventId={currentEvent?.id} user={user} />
            </>
          )}
          <div>
            <div className="logout px-2 py-1 ml-2 text-center white-text" onClick={signOut}>Logout</div>
          </div>
        </>
      )}
      <div className='text-center footer'>
        © 2023 Super Debate, Inc. • Terms of Service
      </div>
    </div>
  );
  
}
