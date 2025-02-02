import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadReceipt, Receipt } from '../api';

const ReceiptUpload = ({ onUpload }: { onUpload: (receipt: Receipt) => void }) => {
    const [loading, setLoading] = useState(false);

    const onDrop = async (files: File[]) => {
        setLoading(true);
        const receipt = await uploadReceipt(files[0]);
        setLoading(false);
        onUpload(receipt);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div className='dropzone'>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>{loading ? 'Processing...' : 'Drop a receipt or click to upload'}</p>
            </div>
        </div>
    );
};

export default ReceiptUpload;
