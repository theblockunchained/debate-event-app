import React, { useState, useEffect } from 'react';
import supabase from '../SupabaseClient';
import Toast from './Toast';

interface Debate {
  id: number;
  affirmative_name: string;
  negative_name: string;
  topic_id: number;
  event_id: number;
}

interface Criterion {
  id: number;
  name: string;
}

interface DebateRatingProps {
  selectedEventId: string | number;
  user: any;  // Consider replacing any with a defined user interface
}

interface CriteriaScores {
  [key: number]: {
    affirmative: number;
    negative: number;
  };
}

function DebateRating({ selectedEventId, user }: DebateRatingProps) {
  const [debates, setDebates] = useState<Debate[]>([]);
  const [selectedDebate, setSelectedDebate] = useState<Debate | null>(null);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [criteriaScores, setCriteriaScores] = useState<CriteriaScores>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');  // Updated line

  const closeToast = () => setShowToast(false);

  useEffect(() => {
    const fetchDebates = async () => {
      const { data, error } = await supabase.from('debates').select('*').eq('event_id', selectedEventId);
      if (data) {
        setDebates(data);
      }
      if (error) {
        console.error('Error fetching debates:', error);
      }
    };

    const fetchCriteria = async () => {
      const { data, error } = await supabase.from('criteria').select('*');
      if (data) {
        setCriteria(data);
        const initialScores = data.reduce((scores, criterion) => {
          scores[criterion.id] = { affirmative: 7, negative: 7 };
          return scores;
        }, {});
        setCriteriaScores(initialScores);
      }
      if (error) {
        console.error('Error fetching criteria:', error);
      }
    };

    if (selectedEventId) {
      fetchDebates();
      fetchCriteria();
    } else {
      setDebates([]);
      setCriteria([]);
    }
  }, [selectedEventId]);

  const handleCriterionChange = (e: React.ChangeEvent<HTMLInputElement>, criterionId: number, debater: string) => {
    setCriteriaScores({
      ...criteriaScores,
      [criterionId]: {
        ...criteriaScores[criterionId],
        [debater]: parseInt(e.target.value, 10)
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedDebate) {
      let errorFlag = false;
      for (const [criterionId, scores] of Object.entries(criteriaScores)) {
        for (const [debater, score] of Object.entries(scores)) {
          const { error } = await supabase
            .from('ratings')
            .insert([
              {
                debate_id: selectedDebate.id,
                user_id: user.id,
                criterion_id: parseInt(criterionId, 10),
                score: score,
                debater: debater
              },
            ]);
          if (error) {
            console.error('Error submitting rating:', error);
            errorFlag = true;
          }
        }
      }
      if (errorFlag) {
        setToastMessage('There was an error submitting your rating. Please try again.');
        setToastType('error');
        setShowToast(true);
      } else {
        setToastMessage('Rating submitted successfully!');
        setToastType('success');
        setShowToast(true);
      }
    } else {
      setToastMessage('Please select a debate first.');
      setToastType('error');
      setShowToast(true);
    }
  };

  return (
<div className="card">
    <h3 className='text-2xl font-bold'>Judge the debate round</h3>
    <select className="border rounded p-1 mr-2 mb-4 md:w-auto"
        value={selectedDebate ? selectedDebate.id : ''} 
        onChange={e => {
            const selectedId = e.target.value;
            setSelectedDebate(debates.find(debate => debate.id.toString() === selectedId) ?? null);
        }}
    >
        <option value="">Select debate</option>
        {debates.map(debate => (
            <option key={debate.id} value={debate.id}>
                {debate.affirmative_name} vs {debate.negative_name}
            </option>
        ))}
    </select>

    <div className='mb-4'>
    <table className="table-auto w-full mt-4">
        <thead>
            <tr>
                <th className="border px-4 py-2">Rate debaters on the following criteria (7-10):</th>
                <th className="border px-4 py-2 text-right font-bold">Aff</th>
                <th className="border px-4 py-2 text-right font-bold">Neg</th>
            </tr>
        </thead>
        <tbody>
            {criteria.map(criterion => (
                <tr key={criterion.id}>
                    <td className="border px-4 py-2">
                        <label>{criterion.name}:</label>
                    </td>
                    <td className="border px-4 py-2">
                        <input
                            className="rating-input w-full py-1 px-2 border rounded-md"
                            type="number"
                            min="7"
                            max="10"
                            value={criteriaScores[criterion.id].affirmative}
                            onChange={e => handleCriterionChange(e, criterion.id, 'affirmative')}
                        />
                    </td>
                    <td className="border px-4 py-2">
                        <input
                            className="rating-input w-full py-1 px-2 border rounded-md"
                            type="number"
                            min="7"
                            max="10"
                            value={criteriaScores[criterion.id].negative}
                            onChange={e => handleCriterionChange(e, criterion.id, 'negative')}
                        />
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>


    <button className='black rounded px-2 py-1 ml-2' onClick={handleSubmit}>Submit Rating</button>

    {showToast && (
        <Toast 
            message={toastMessage} 
            type={toastType} 
            onClose={closeToast}
        />
    )}
</div>




  );
}

export default DebateRating;
