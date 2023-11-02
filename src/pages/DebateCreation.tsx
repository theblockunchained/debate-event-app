import React, { useState } from 'react';
import { Button } from '@material-tailwind/react';
import supabase from '../SupabaseClient';
import Toast from './Toast';

interface Topic {
  id: number;
  topic_name: string;
}

interface Event {
  id: number;
  name: string;
}

interface Debate {
  id: number;
  affirmative_name: string;
  negative_name: string;
  topic_id: number;
  event_id: number;
  name: string;
  topic: string;
}

interface DebateCreationProps {
  currentEvent: Event;
  topics: Topic[];
  onDebateCreation: (debate: Debate) => void;
}

export default function DebateCreation({ currentEvent, topics, onDebateCreation }: DebateCreationProps) {
  const [affirmativeName, setAffirmativeName] = useState('');
  const [negativeName, setNegativeName] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [debates, setDebates] = useState<Debate[]>([]);

  const handleDebateSubmission = async () => {
    if (!affirmativeName || !negativeName || !selectedTopic || !currentEvent) {
      console.log("Missing required fields");
      setToastMessage('Please fill in all fields.');
      setToastType('error');
      setShowToast(true);
      return;
    }

    const { error } = await supabase.from('debates').insert([
      { 
        affirmative_name: affirmativeName, 
        negative_name: negativeName, 
        topic_id: selectedTopic.id,
        event_id: currentEvent.id 
      }
    ]);

    if (error) {
      console.log("Error submitting new debate:", error);
      setToastMessage('Error submitting new debate.');
      setToastType('error');
      setShowToast(true);
      return;
    }

    const { data: fetchedData, error: fetchError } = await supabase
      .from('debates')
      .select('*')
      .eq('affirmative_name', affirmativeName)
      .eq('negative_name', negativeName)
      .eq('topic_id', selectedTopic.id)
      .eq('event_id', currentEvent.id)
      .limit(1);

    if (fetchError || !fetchedData || fetchedData.length === 0) {
      console.log("Error fetching the recently created debate:", fetchError);
      setToastMessage('Error fetching the recently created debate.');
      setToastType('error');
      setShowToast(true);
      return;
    }

    const recentlyCreatedDebate = fetchedData[0];
    console.log("Recently created debate fetched:", recentlyCreatedDebate);

    console.log("Debate submitted successfully");
    onDebateCreation(recentlyCreatedDebate);
    setToastMessage('Debate submitted successfully!');
    setToastType('success');
    setShowToast(true);

    setTimeout(() => {
      setAffirmativeName('');
      setNegativeName('');
      setSelectedTopic(null);
      setShowToast(false);
    }, 3000);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <div className="mt-4 card">
      <h2 className="text-2xl font-bold">Create a new debate for {currentEvent?.name}</h2>

      <input
        className="border border-aqua rounded p-1 mr-2"
        value={affirmativeName}
        onChange={e => setAffirmativeName(e.target.value)}
        placeholder="Affirmative Name"
      />

      <input
        className="border border-aqua rounded p-1 mr-2"
        value={negativeName}
        onChange={e => setNegativeName(e.target.value)}
        placeholder="Negative Name"
      />
<div>
<select
  className="border border-aqua rounded p-1 mr-2"
  value={selectedTopic ? selectedTopic.id : ''}
  onChange={e => {
    const selectedId = e.target.value;
    setSelectedTopic(topics.find(topic => topic.id.toString() === selectedId) ?? null);
  }}
>
  <option value="">Select a topic</option>
  {(topics || []).map(topic => (
    <option key={topic.id} value={topic.id}>
      {topic.topic_name}
    </option>
  ))}
</select>

      <Button className="black rounded px-2 py-1" onClick={handleDebateSubmission}>Submit Debate</Button>
      </div>
      {showToast && (
        <Toast 
          message={toastMessage} 
          type={toastType} 
          onClose={handleCloseToast}
        />
      )}
    </div>
  );
}
