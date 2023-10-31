import React, { useState, useEffect } from 'react';
import supabase from './supabaseClient';

function DebateRating({ selectedEventId, user }) {
    const [debates, setDebates] = useState([]);
    const [selectedDebate, setSelectedDebate] = useState(null);
    const [criteria, setCriteria] = useState([]);
    const [criteriaScores, setCriteriaScores] = useState({});

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
                // Initialize criteriaScores with each criterion set to 7 for both debaters
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

    const handleCriterionChange = (e, criterionId, debater) => {
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
            for (const [criterionId, scores] of Object.entries(criteriaScores)) {
                for (const [debater, score] of Object.entries(scores)) {
                    const { error } = await supabase
                        .from('ratings')
                        .insert([
                            { 
                                debate_id: selectedDebate.id, 
                                user_id: user.id, 
                                criterion_id: criterionId, 
                                score: score,
                                debater: debater
                            },
                        ]);
                    if (error) {
                        console.error('Error submitting rating:', error);
                    }
                }
            }
            console.log('Rating submitted successfully');
        } else {
            alert("Please select a debate first.");
        }
    };

    return (
        <div className="card">
            <label>Select Debate: </label>
            <select className="border rounded p-1 mr-2" 
                value={selectedDebate ? selectedDebate.id : ''} 
                onChange={e => {
                    const selectedId = e.target.value;
                    setSelectedDebate(debates.find(debate => debate.id.toString() === selectedId));
                }}
            >
                <option value="">Select a debate</option>
                {debates.map(debate => (
                    <option key={debate.id} value={debate.id}>
                        {debate.affirmative_name} vs {debate.negative_name}
                    </option>
                ))}
            </select>

            <div>
                Rate the debate on the following criteria (7-10):
                {criteria.map(criterion => (
                    <div key={criterion.id}>
                        <label>{criterion.name}: </label>
                        <input 
                            type="number" 
                            min="7" 
                            max="10" 
                            value={criteriaScores[criterion.id].affirmative} 
                            onChange={e => handleCriterionChange(e, criterion.id, 'affirmative')}
                        />
                        <input 
                            type="number" 
                            min="7" 
                            max="10" 
                            value={criteriaScores[criterion.id].negative} 
                            onChange={e => handleCriterionChange(e, criterion.id, 'negative')}
                        />
                    </div>
                ))}
            </div>

            <button className='black rounded px-2 py-1 ml-2' onClick={handleSubmit}>Submit Rating</button>
        </div>
    );
}

export default DebateRating;