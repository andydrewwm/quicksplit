// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export type Item = {
    name: string;
    price: number;
    assignedTo?: string;
}

export type Receipt = {
    receiptId: string;
    items: Item[];
}

export type Totals = {
    [key: string]: number;
};

let receiptData: Receipt | null = null;
let assignments: { [key: string]: string } = {};

export const uploadReceipt = async (file: File): Promise<Receipt> => {
    // const formData = new FormData();
    // formData.append("file", file);

    // const response = await axios.post(`${API_URL}/upload-receipt`, formData, {
    //     headers: { "Content-Type": "multipart/form-data" },
    // });

    // return response.data;

    console.log('Mock upload receipt:', file.name);

    receiptData = {
        receiptId: 'mock-receipt-123',
        items: [
            { name: 'Burger', price: 10.99 },
            { name: "Fries", price: 3.99 },
            { name: "Drink", price: 2.50 },
        ],
    };

    return receiptData;
};

export const assignItems = async (receiptId: string, updatedAssignments: { [key: string]: string }) => {
    // await axios.post(`${API_URL}/assign-items/${receiptId}`, { assignments });

    if (!receiptData || receiptData.receiptId !== receiptId) {
        throw new Error('Receipt not found');
    }

    assignments = updatedAssignments;
};

export const getTotals = async (receiptId: string) => {
    // const response = await axios.get(`${API_URL}/total-owed/${receiptId}`);
    // return response.data;

    if (!receiptData || receiptData.receiptId !== receiptId) {
        throw new Error('Receipt not found');
    }

    const totals: Totals = {};
    receiptData.items.forEach((item) => {
        const person = assignments[item.name];
        if (person) {
            totals[person] = (totals[person] || 0) + item.price;
        }
    });

    return totals;
};
