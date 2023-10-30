import { useState } from 'react';

function DebateRating({ debates, onSubmit }) { // <-- updated prop name here
    const [selectedDebate, setSelectedDebate] = useState(null);
    const [criteriaScores, setCriteriaScores] = useState({
        criterion1: 7,
        criterion2: 7,
        criterion3: 7,
        criterion4: 7
    });

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
        <div>
            <label>Select Debate: </label>
            <select value={selectedDebate} onChange={e => setSelectedDebate(e.target.value)}>
                {debates.map(debate => (
                    <option key={debate.id} value={debate.id}>
                        {debate.name}
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
