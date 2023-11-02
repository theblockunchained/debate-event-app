import React from 'react';

interface Event {
  id: number;
  name: string;
}

interface EventSelectorProps {
  events: Event[];
  currentEvent: Event | null;
  onEventChange: (event: Event | null) => void;
}

function EventSelector({ events, currentEvent, onEventChange }: EventSelectorProps) {
  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const eventId = parseInt(e.target.value, 10);
    const selectedEvent = events.find(event => event.id === eventId) ?? null;

    // Call the callback function to notify the parent component about the change
    onEventChange(selectedEvent);
  }

  return (
    <div>
      <h3 className="mr-2 text-2xl font-bold m">Select your debate event </h3>
      <select 
        className="border border-aqua rounded p-1" 
        value={currentEvent?.id || ''} 
        onChange={handleEventChange}
      >
        {events && events.map(event => (  // Check for events before mapping
          <option key={event.id} value={event.id}>
            {event.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default EventSelector;
