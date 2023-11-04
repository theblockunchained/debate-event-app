import { Button } from '@material-tailwind/react';
import TopicCreation from './TopicCreation';
import React from 'react';

interface TopicVotingProps {
  currentEvent: any;
  topics: any[];
  onTopicCreation: (newTopic: any) => void;
  onVote: (topicId: number) => Promise<void>;
}

const TopicVoting: React.FC<TopicVotingProps> = ({ currentEvent, topics, onTopicCreation, onVote }) => {
  return (
    <div className="mt-4 card">
      {!currentEvent ? (
        <h3 className='mr-2 text-2xl font-bold'>Select or create an event to submit topics</h3>
      ) : (
        <span>
          <h3 className='mr-2 text-2xl font-bold'>Submit a topic for {currentEvent?.name}</h3>
          <TopicCreation
            currentEvent={currentEvent}
            topics={topics}
            onTopicCreation={onTopicCreation}
            onVote={onVote}
          />
          <div className='solid-divide'></div>
          <h3 className="text-l font-bold mt-4">
  Vote for the topics you want debated
</h3>
<table className="table-auto w-full mt-4">
  <thead>
    <tr>
    </tr>
  </thead>
  <tbody>
    <tr className='text-center font-bold'>
    <td></td>
    <td>Votes</td>
    <td>Topics</td>

    </tr>
    {topics.map(topic => (
      <tr key={topic.id}>
        <td className="border px-4 py-2">
          <Button className="purple rounded px-2 py-1 ml-2" onClick={() => onVote(topic.id)}>Vote</Button>
        </td>
        <td className="border px-4 py-2">
         {topic.votes} 
        </td>
        <td className="border px-4 py-2">
          {topic.topic_name}
        </td>
      </tr>
    ))}
  </tbody>
</table>

        </span>
      )}
    </div>
  );
};

export default TopicVoting;
