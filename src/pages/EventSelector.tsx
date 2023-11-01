function EventSelector({ events, currentEvent, onEventChange }) {
    const handleEventChange = (e) => {
        const eventId = parseInt(e.target.value, 10);
        const selectedEvent = events.find(event => event.id === eventId);

        // Call the callback function to notify the parent component about the change
        onEventChange(selectedEvent);
    }

    return (
        <div>
            <h3 className="mr-2 text-2xl font-bold m">Select your debate event </h3>
            <select 
              className="border border-aqua rounded p-1" 
              value={currentEvent?.id || ''} 
              onChange={handleEventChange}>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
        </div>
    );
}

export default EventSelector;

  
  