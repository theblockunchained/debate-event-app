import React, { useState, useEffect } from 'react';
import supabase from './supabaseClient';

function DebateRating({ selectedEventId, onSubmit }) {
    const [debates, setDebates] = useState([]);
    const [selectedDebate, setSelectedDebate] = useState(null);
    const [criteriaScores, setCriteriaScores] = useState({
        criterion1: 7,
        criterion2: 7,
        criterion3: 7,
        criterion4: 7
    });

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

        if (selectedEventId) {
            fetchDebates();
        } else {
            setDebates([]);
        }
    }, [selectedEventId]);

    const handleCriterionChange = (e, criterion) => {
        setCriteriaScores({
            ...criteriaScores,
            [criterion]: parseInt(e.target.value, 10)
        });
    };

    const handleSubmit = () => {
        if (selectedDebate) {
            onSubmit(selectedDebate, criteriaScores);
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
                {['criterion1', 'criterion2', 'criterion3', 'criterion4'].map(criterion => (
                    <div key={criterion}>
                        <label>{criterion}: </label>
                        <input 
                            type="number" 
                            min="7" 
                            max="10" 
                            value={criteriaScores[criterion]} 
                            onChange={e => handleCriterionChange(e, criterion)}
                        />
                    </div>
                ))}
            </div>

            <button onClick={handleSubmit}>Submit Rating</button>
        </div>
    );
}

export default DebateRating;