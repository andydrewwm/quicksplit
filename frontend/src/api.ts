import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export type Item = {
    id: string;
    name: string;
    price: number;
    quantity?: number;
    assigned_to?: string;
};

export type Receipt = {
    id: string;
    merchant_name?: string;
    date?: string;
    items: Item[];
    subtotal: number;
    total: number;
};

export type Totals = {
    [key: string]: number;
};

export const uploadReceipt = async (file: File): Promise<Receipt> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/upload-receipt/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log(response.data);

    return response.data;
};

export const assignItems = async (receiptId: string, updates: Receipt): Promise<Receipt> => {
    const response = await axios.put(`${API_URL}/assign-items/${receiptId}`, updates);

    console.log(response.data);

    return response.data;
};

export const getTotals = async (receiptId: string): Promise<Totals> => {
    const response = await axios.get(`${API_URL}/total-owed/${receiptId}`);
    return response.data;
};
