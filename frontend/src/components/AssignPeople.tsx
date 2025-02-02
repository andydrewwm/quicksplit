import React, { useState } from 'react';
import { assignItems, Receipt } from '../api';

const AssignPeople = ({ receipt, onAssigned }: { receipt: Receipt; onAssigned: () => void }) => {
    const [people, setPeople] = useState<string[]>([]);
    const [newPerson, setNewPerson] = useState('');
    const [assignments, setAssignments] = useState<{ [key: string]: string }>({});
    const [items, setItems] = useState(receipt.items);

    // Add a new person
    const addPerson = () => {
        if (newPerson.trim() && !people.includes(newPerson)) {
            setPeople([...people, newPerson.trim()]);
            setNewPerson('');
        }
    };

    // Remove a person and unassign their items
    const removePerson = (person: string) => {
        setPeople(people.filter(p => p !== person));
        setAssignments(prev => {
            const updated = Object.fromEntries(
                Object.entries(prev).filter(([_, assignedTo]) => assignedTo !== person)
            );
            return updated;
        });
    };

    // Assign an item to a person
    const assignItem = (itemName: string, person: string) => {
        setAssignments(prev => ({ ...prev, [itemName]: person }));
    };

    // Remove an item and its assignment
    const removeItem = (itemName: string) => {
        setItems(items.filter(item => item.name !== itemName));
        setAssignments(prev => {
            const updated = { ...prev };
            delete updated[itemName];
            return updated;
        });
    };

    // Submit assignments
    const submitAssignments = async () => {
        await assignItems(receipt.receiptId, assignments);
        onAssigned();
    };

    return (
        <div className='assign-container'>
            <h2>Assign Items</h2>

            <div className='assign-grid'>
                {/* People List */}
                <div className='people-section'>
                    <h3>People</h3>
                    <div className='add-person'>
                        <input
                            type='text'
                            placeholder='Enter name'
                            value={newPerson}
                            onChange={(e) => setNewPerson(e.target.value)}
                        />
                        <button onClick={addPerson}>Add</button>
                    </div>

                    <ul className='people-list'>
                        {people.map((person) => (
                            <li key={person} className='person-entry'>
                                {person}
                                <button className='remove-btn' onClick={() => removePerson(person)}>X</button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Items List */}
                <div className='items-section'>
                    <h3>Items</h3>
                    <ul className='items-list'>
                        {items.map((item) => (
                            <li key={item.name} className='item-entry'>
                                <span>{item.name} - ${item.price.toFixed(2)}</span>
                                <select
                                    value={assignments[item.name] || ''}
                                    onChange={(e) => assignItem(item.name, e.target.value)}
                                >
                                    <option value=''>Unassigned</option>
                                    {people.map(person => (
                                        <option key={person} value={person}>{person}</option>
                                    ))}
                                </select>
                                <button className='remove-btn' onClick={() => removeItem(item.name)}>X</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <button onClick={submitAssignments} className='submit-btn'>Submit Assignments</button>
        </div>
    );
};

export default AssignPeople;
