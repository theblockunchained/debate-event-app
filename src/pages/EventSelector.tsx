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
    if (isNaN(eventId)) {
      onEventChange(null);
      return;
    }
    const selectedEvent = events.find(event => event.id === eventId) ?? null;
    onEventChange(selectedEvent);
  }

  return (
    <div>
      <h3 className="mr-2 text-2xl font-bold m">Select your debate event </h3>
      <select 
        className="border border-aqua rounded p-1" 
        value={currentEvent?.id || ''}  // Should fall back to '' if currentEvent is null or undefined
        onChange={handleEventChange}
      >
        <option value="">Select an option</option>  // Default option
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
