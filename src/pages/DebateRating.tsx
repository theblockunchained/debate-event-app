import React, { useState, useEffect } from 'react';
import supabase from './supabaseClient';
import Toast from './Toast';

function DebateRating({ selectedEventId, user }) {
    const [debates, setDebates] = useState([]);
    const [selectedDebate, setSelectedDebate] = useState(null);
    const [criteria, setCriteria] = useState([]);
    const [criteriaScores, setCriteriaScores] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

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
            let errorFlag = false;
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
            <label>Select a debate to judge: </label>
            <select className="border rounded p-1 mr-2" 
                value={selectedDebate ? selectedDebate.id : ''} 
                onChange={e => {
                    const selectedId = e.target.value;
                    setSelectedDebate(debates.find(debate => debate.id.toString() === selectedId));
                }}
            >
                <option value="">Select a debate </option>
                {debates.map(debate => (
                    <option key={debate.id} value={debate.id}>
                        {debate.affirmative_name} vs {debate.negative_name}
                    </option>
                ))}
            </select>

            <div className='margin-bt-15'>
                <div>
                    Rate the debaters on the following criteria (7-10):
                </div>
                <div className='spacer-30'>
                    <div className='float-right'>Aff</div>
                    <div className='float-right'>Neg</div>
                </div>
                <div>
                    {criteria.map(criterion => (
                        <div key={criterion.id}>
                            <label>{criterion.name}: </label>
                            <input className="rating-input"
                                type="number" 
                                min="7" 
                                max="10" 
                                value={criteriaScores[criterion.id].affirmative} 
                                onChange={e => handleCriterionChange(e, criterion.id, 'affirmative')}
                            />
                            <input className="rating-input"
                                type="number" 
                                min="7" 
                                max="10" 
                                value={criteriaScores[criterion.id].negative} 
                                onChange={e => handleCriterionChange(e, criterion.id, 'negative')}
                            />
                        </div>
                    ))}
                </div>
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