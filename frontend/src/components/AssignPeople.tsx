import React, { useState } from 'react';
import { assignItems, Receipt } from '../api';

const AssignPeople = ({ receipt, onAssigned }: { receipt: Receipt; onAssigned: () => void }) => {
    const [people, setPeople] = useState<string[]>([]);
    const [newPerson, setNewPerson] = useState('');
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
        setItems(prev =>
            prev.map(item =>
                item.assigned_to === person
                ? { ...item, assigned_to: undefined }
                : item
            )
        );
        if (selectedPerson === person) setSelectedPerson(null);
    };

    const assignItem = (itemId: string) => {
        if (!selectedPerson) return;
        setItems(prev =>
            prev.map(item =>
                item.id === itemId 
                ? { ...item, assigned_to: selectedPerson }
                : item
            )
        );
        // console.log(receipt);
    };

    const submitAssignments = async () => {
        receipt.items = items;
        await assignItems(receipt.id, receipt);
        onAssigned();
    };

    console.log(receipt);

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
                    {people.map(person => (
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
                {items.map(item => {
                    return (
                        <li 
                            key={item.id}
                            onClick={() => assignItem(item.id)}
                            className={!item.assigned_to ? "unselected-item" : ""}
                        >
                            <span>{item.name} - ${item.price.toFixed(2)}</span>
                            <span>
                                {item.assigned_to ? `${item.assigned_to}` : '...'}
                            </span>
                        </li>
                    );
                })}
            </ul>

            <button onClick={submitAssignments}>Submit Assignments</button>
        </div>
    );
};

export default AssignPeople;
