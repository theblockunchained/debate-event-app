import React, { useState, useEffect } from 'react';
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

interface Profile {
  id: string;
  name: string;
}

interface DebateCreationProps {
  currentEvent: Event;
  topics: Topic[];
  onDebateCreation: (debate: Debate) => void;
}

export default function DebateCreation({ currentEvent, topics, onDebateCreation }: DebateCreationProps) {
  const [selectedAffirmative, setSelectedAffirmative] = useState<string>('');
  const [selectedNegative, setSelectedNegative] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) {
        console.error('Error fetching profiles:', error);
        return;
      }
      console.log("Fetched profiles:", data);
      setProfiles(data || []);
    };

    fetchProfiles();
  }, []);

  const handleDebateSubmission = async () => {
    if (!selectedAffirmative || !selectedNegative || !selectedTopic || !currentEvent) {
      console.log("Missing required fields");
      setToastMessage('Please fill in all fields.');
      setToastType('error');
      setShowToast(true);
      return;
    }

    const { error } = await supabase.from('debates').insert([
      { 
        affirmative_name: selectedAffirmative, 
        negative_name: selectedNegative, 
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
      .eq('affirmative_name', selectedAffirmative)
      .eq('negative_name', selectedNegative)
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
      setSelectedAffirmative('');
      setSelectedNegative('');
      setSelectedTopic(null);
      setShowToast(false);
    }, 3000);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <div className="mt-4 card">
      <h3 className="text-2xl font-bold">Create a new debate for {currentEvent?.name}</h3>
<div>
      <select
        className="border border-aqua rounded p-1 mr-2"
        value={selectedAffirmative || ''}
        onChange={e => setSelectedAffirmative(e.target.value)}
      >
        <option value="">Select Affirmative</option>
        {profiles.map(profile => (
          <option key={profile.id} value={profile.name}>
            {profile.name}
          </option>
        ))}
      </select>

      <select
        className="border border-aqua rounded p-1 mr-2"
        value={selectedNegative || ''}
        onChange={e => setSelectedNegative(e.target.value)}
      >
        <option value="">Select Negative</option>
        {profiles.map(profile => (
          <option key={profile.id} value={profile.name}>
            {profile.name}
          </option>
        ))}
      </select>
      </div>
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
