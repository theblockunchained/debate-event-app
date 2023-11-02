import React, { ChangeEvent, useState } from 'react';
import { Button } from '@material-tailwind/react';
import Toast from './Toast';

interface EventCreationProps {
    newEventName: string;
    onEventNameChange: (name: string) => void;
    onCreate: () => void;
}

const EventCreation: React.FC<EventCreationProps> = ({ newEventName, onEventNameChange, onCreate }) => {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        onEventNameChange(e.target.value);
    };

    const handleCreate = () => {
        if (!newEventName.trim()) {
            console.log("Event name is required");
            setToastMessage('Event name is required.');
            setToastType('error');
            setShowToast(true);
            return;
        }
        onCreate();
        setToastMessage('Event created successfully!');
        setToastType('success');
        setShowToast(true);
    };

    const handleCloseToast = () => {
        setShowToast(false);
    };

    return (
      <div className="mt-4">
        <input 
          className="border border-aqua rounded p-1 mr-2"
          value={newEventName}
          onChange={handleInputChange}
          placeholder="New event name"
        />
        <Button className="black rounded px-2 py-1" onClick={handleCreate}>Create Event</Button>

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

export default EventCreation;
