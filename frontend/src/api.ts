import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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

export const uploadReceipt = async (file: File): Promise<Receipt> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/upload-receipt`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
};

export const assignItems = async (receiptId: string, assignments: { [key: string]: string }) => {
    await axios.post(`${API_URL}/assign-items/${receiptId}`, { assignments });
};

export const getTotals = async (receiptId: string) => {
    const response = await axios.get(`${API_URL}/total-owed/${receiptId}`);
    return response.data;
};
