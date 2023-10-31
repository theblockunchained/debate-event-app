function TopicSubmission({ newTopic, onTopicChange, onSubmit }) {
    return (
      <div className="mt-4">
        <input 
          className="border border-aqua rounded p-1 mr-2"
          value={newTopic}
          onChange={onTopicChange}
          placeholder="Enter a new topic"
        />
        <Button className="black rounded px-2 py-1" color="black" onClick={onSubmit}>Submit</Button>
      </div>
    );
  }
  
  function TopicList({ topics, currentEvent, onVote }) {
    return (
      <div className="mt-4">
        <h2 className="text-2xl font-bold mt-4">Topics for {currentEvent.name}</h2>
        <ul className="list-disc list-inside">
          {topics.map(topic => (
            <li key={topic.id} className="mt-2">
              {topic.topic_name} - Votes: {topic.votes}
              <Button className="purple rounded px-2 py-1 ml-2" color="aqua" text="purple" onClick={() => onVote(topic.id)}>Vote</Button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  export { TopicSubmission, TopicList };
  