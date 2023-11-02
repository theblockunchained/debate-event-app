import React, { useState } from 'react';
import { Button } from '@material-tailwind/react';
import supabase from '../SupabaseClient';
import Toast from './Toast';

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

interface TopicCreationProps {
  currentEvent: Event | null;  
  topics: Topic[];
  onTopicCreation: (newTopic: any) => void;  // Consider specifying a type instead of any
  onVote: (topicId: number) => Promise<void>;
}

const TopicCreation: React.FC<TopicCreationProps> = ({ currentEvent, topics, onTopicCreation, onVote }) => {
  const [newTopic, setNewTopic] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleTopicSubmission = async () => {
    if (!newTopic.trim() || !currentEvent) {
      console.log("Missing required fields");
      setToastMessage('Please fill in all fields and select an event.');
      setToastType('error');
      setShowToast(true);
      return;
    }

    const { data, error } = await supabase.from('topics').insert([{ topic_name: newTopic, event_id: currentEvent.id }]);

    if (error) {
      console.log("Error submitting new topic:", error);
      setToastMessage('Error submitting new topic.');
      setToastType('error');
      setShowToast(true);
      return;
    }

    if (data) {
      console.log("Topic submitted successfully");
      onTopicCreation(data[0]);
      setToastMessage('Topic submitted successfully!');
      setToastType('success');
      setShowToast(true);
      setNewTopic('');
    }
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <div>
      <input 
        className="border border-aqua rounded p-1 mr-2" 
        value={newTopic} 
        onChange={e => setNewTopic(e.target.value)} 
        placeholder="Enter a new topic" 
      />
      <Button className="black rounded px-2 py-1" onClick={handleTopicSubmission}>Submit Topic</Button>

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

export default TopicCreation;
