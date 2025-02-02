import React, { useState } from 'react';
import { assignItems, Receipt } from '../api';

const AssignPeople = ({ receipt, onAssigned }: { receipt: Receipt; onAssigned: () => void}) => {
    const [assignments, setAssignments] = useState<{ [key: string]: string }>({});

    const handleAssign = (itemName: string, person: string) => {
        setAssignments({ ...assignments, [itemName]: person });
    };

    const submitAssignments = async () => {
        await assignItems(receipt.receiptId, assignments);
        onAssigned();
    };

    return (
        <div>
            <h2>Assign Items</h2>
            {receipt.items.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <span>{item.name} - ${item.price.toFixed(2)}</span>
                    <input
                        type='text'
                        placeholder="Person's name"
                        value={assignments[item.name] || ''}
                        onChange={(e) => handleAssign(item.name, e.target.value)}
                    />
                </div>
            ))}
            <button onClick={submitAssignments}>Submit Assignments</button>
        </div>
    );
};

export default AssignPeople;
