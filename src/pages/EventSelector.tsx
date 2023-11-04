import React, { useEffect } from 'react';

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
  useEffect(() => {
    console.log('Events:', events);
    console.log('Current Event:', currentEvent);
  }, [events, currentEvent]);

const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  console.log('Selected option value:', e.target.value);
  const eventId = parseInt(e.target.value, 10);
  console.log('Parsed event ID:', eventId);
  if (isNaN(eventId)) {
    console.log('Event ID is not a number, calling onEventChange with null');
    onEventChange(null);
    return;
  }
  const selectedEvent = events.find(event => event.id === eventId) ?? null;
  console.log('Selected event:', selectedEvent);
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
        <option value="">Select an option</option> 
        {events && events.map(event => (
          <option key={event.id} value={event.id}>
            {event.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default EventSelector;