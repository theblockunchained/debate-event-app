import React, { ChangeEvent } from 'react';
import { Button } from '@material-tailwind/react';

interface EventCreationProps {
    newEventName: string;
    onEventNameChange: (name: string) => void;
    onCreate: () => void;
}

const EventCreation: React.FC<EventCreationProps> = ({ newEventName, onEventNameChange, onCreate }) => {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        onEventNameChange(e.target.value);
    };

    return (
      <div className="mt-4">
        <input 
          className="border border-aqua rounded p-1 mr-2"
          value={newEventName}
          onChange={handleInputChange}
          placeholder="New event name"
        />
        <Button className="black rounded px-2 py-1" color="black" onClick={onCreate}>Create Event</Button>
      </div>
    );
}

export default EventCreation;
