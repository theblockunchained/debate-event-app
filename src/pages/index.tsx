
import { Auth } from '@supabase/auth-ui-react';
import './index.css';
import { Button } from '@material-tailwind/react';
import { useEffect, useState, useContext } from 'react';
import supabase from './supabaseClient';
import { AuthContext } from '../contexts/auth';
import DebateRating from './DebateRating'; 
import UserAuth from './UserAuth';
import EventSelector from './EventSelector';
import EventCreation from './EventCreation';
import DebateCreation from './DebateCreation';

import { TopicSubmission, TopicList } from './Topics';


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

  const handleDebateRatingSubmission = (selectedDebate, criteriaScores) => {
    // Here, you will send the data to the database (for example, using supabase).
    // This will involve inserting the data into the Rating table.
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
        <div className="logout px-2 py-1 ml-2" color="black" onClick={signOut}>Logout</div>
          <EventSelector events={events} currentEvent={currentEvent} onEventChange={setCurrentEvent} onSignOut={signOut} />
         

          <EventCreation newEventName={newEventName} onEventNameChange={setNewEventName} onCreate={handleCreateEvent} />

          

          <div>
  {currentEvent && (
    <>
      <DebateCreation 
        currentEvent={currentEvent} 
        topics={topics} 
        onDebateCreation={newDebate => setDebates(prevDebates => [...prevDebates, newDebate])} 
      />
      <div className="mt-4">
        <input className="border border-aqua rounded p-1 mr-2" value={newTopic} onChange={e => setNewTopic(e.target.value)} placeholder="Enter a new topic" />
        <Button className="black rounded px-2 py-1" color="black" onClick={handleTopicSubmission}>Submit Topic</Button>

        <h2 className="text-2xl font-bold mt-4">Topics for {currentEvent.name}</h2>
        <ul className="list-inside">
          {topics.map(topic => (
            <li key={topic.id} className="mt-2">
               <Button className="purple rounded px-2 py-1 ml-2" color="aqua" text="purple" onClick={() => handleVote(topic.id)}>Vote</Button>
              <div className="inline-votes">{topic.topic_name} - Votes: {topic.votes}</div>
             
            </li>
          ))}
        </ul>
      </div>
    </>
  )}
</div>

        </>
      )}
      <DebateRating debates={debates} onSubmit={handleDebateRatingSubmission} />
     
    </div>
  );
}

