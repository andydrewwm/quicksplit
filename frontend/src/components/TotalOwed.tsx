import React, { useEffect, useState } from 'react';
import { getTotals, Totals } from '../api';

const TotalOwed = ({ receiptId }: { receiptId: string }) => {
    const [totals, setTotals] = useState<Totals>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTotals = async () => {
            const data = await getTotals(receiptId);
            setTotals(data);
            setLoading(false);
        };

        fetchTotals();
    }, [receiptId]);

    return (
        <div>
            <h2>Total Owed</h2>
            {loading ? (
                <p>Calculating...</p>
            ) : (
                <ul>
                    {Object.entries(totals).map(([person, amount]) => (
                        <li key={person}>
                            {person}: ${amount.toFixed(2)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TotalOwed;
