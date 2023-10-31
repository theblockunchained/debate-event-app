import React, { useState } from 'react';
import { Button } from '@material-tailwind/react';
import supabase from './supabaseClient';

export default function DebateCreation({ currentEvent, topics, onDebateCreation }) {
  const [affirmativeName, setAffirmativeName] = useState('');
  const [negativeName, setNegativeName] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleDebateSubmission = async () => {
    if (!currentEvent || !selectedTopic) {
      alert("Please select an event and topic first.");
      return;
    }
    const { data, error } = await supabase.from('debates').insert([
      { 
        affirmative_name: affirmativeName, 
        negative_name: negativeName, 
        topic_id: selectedTopic.id,
        event_id: currentEvent.id 
      }
    ]);

    if (error) {
      console.error("Error submitting new debate:", error);
      return;
    }
    if (data) {
      onDebateCreation(data[0]);
      setAffirmativeName('');
      setNegativeName('');
      setSelectedTopic(null);
    }
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

<select
  className="border border-aqua rounded p-1 mr-2"
  value={selectedTopic ? selectedTopic.id : ''}
  onChange={e => {
    const selectedId = e.target.value; // This will always be a string
    setSelectedTopic(topics.find(topic => topic.id.toString() === selectedId));
  }}
>
  <option value="">Select a topic</option>
  {topics.map(topic => (
    <option key={topic.id} value={topic.id}>
      {topic.topic_name}
    </option>
  ))}
</select>


      <Button className="black rounded px-2 py-1" color="black" onClick={handleDebateSubmission}>Submit Debate</Button>
    </div>
  );
}
