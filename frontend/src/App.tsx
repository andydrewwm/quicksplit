import React, { useState } from 'react';
import ReceiptUpload from './components/ReceiptUpload';
import AssignPeople from './components/AssignPeople';
import TotalOwed from './components/TotalOwed';
import { Receipt } from './api';

const App = () => {
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [assigned, setAssigned] = useState(false);

  return (
    <div className='app-container'>
      <h1>QuickSplit</h1>

      {!receipt ? (
        <ReceiptUpload onUpload={setReceipt} />
      ) : !assigned ? (
        <AssignPeople receipt={receipt} onAssigned={() => setAssigned(true)} />
      ) : (
        <TotalOwed receiptId={receipt.receiptId} />
      )}
    </div>
  );
};

export default App
