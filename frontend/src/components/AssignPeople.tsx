import React, { useState } from 'react';
import { assignItems, Receipt } from '../api';

const AssignPeople = ({ receipt, onAssigned }: { receipt: Receipt; onAssigned: () => void }) => {
    const [people, setPeople] = useState<string[]>([]);
    const [newPerson, setNewPerson] = useState('');
    const [assignments, setAssignments] = useState<{ [key: string]: string }>({});
    const [items, setItems] = useState(receipt.items);
    const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

    const addPerson = () => {
        if (newPerson.trim() && !people.includes(newPerson)) {
            setPeople([...people, newPerson.trim()]);
            setNewPerson('');
        }
    };

    const removePerson = (person: string) => {
        setPeople(people.filter(p => p !== person));
        setAssignments(prev => {
            const updated = Object.fromEntries(
                Object.entries(prev).filter(([_, assignedTo]) => assignedTo !== person)
            );
            return updated;
        });
        if (selectedPerson === person) setSelectedPerson(null);
    };

    const assignItem = (itemName: string) => {
        if (!selectedPerson) return;
        setAssignments(prev => ({ ...prev, [itemName]: selectedPerson }));
    };

    const submitAssignments = async () => {
        await assignItems(receipt.receiptId, assignments);
        onAssigned();
    };

    return (
        <div className="container">
            <h2>Assign Items</h2>

            <div>
                <h3>People</h3>
                <div>
                    <input
                        type='text'
                        placeholder='Enter name'
                        value={newPerson}
                        onChange={(e) => setNewPerson(e.target.value)}
                    />
                    <button onClick={addPerson}>Add</button>
                </div>

                <ul>
                    {people.map((person) => (
                        <li 
                            key={person} 
                            onClick={() => setSelectedPerson(person)}
                            className={selectedPerson === person ? "selected-person" : ""}
                        >
                            {person}
                            <button 
                                className="delete-btn" 
                                onClick={(e) => { e.stopPropagation(); removePerson(person); }}
                            >
                                X
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <h3>Items</h3>
            <ul>
                {items.map((item) => (
                    <li key={item.name} onClick={() => assignItem(item.name)}>
                        <span>{item.name} - ${item.price.toFixed(2)}</span>
                        <span>
                            {assignments[item.name] ? `Assigned to ${assignments[item.name]}` : 'Click to assign'}
                        </span>
                    </li>
                ))}
            </ul>

            <button onClick={submitAssignments}>Submit Assignments</button>
        </div>
    );
};

export default AssignPeople;
