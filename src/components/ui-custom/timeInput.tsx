
import { ChangeEvent, useState } from 'react';
import { Input } from '../ui/input';

const TimeInput = ({ label, name, value, onChange }: {
    label: string,
    name: string,
    value?: string,
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}) => {
    const [error, setError] = useState('');

    const handleBlur = (e: any) => {
        const value = e.target.value;
        const regex = /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

        if (!regex.test(value)) {
            setError('Time must be in HH:MM:SS format');
        } else {
            setError('');
        }
    };

    return (
        <div className="time-input">
            <label className="block mb-2">{label}</label>

            <Input 
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                onBlur={handleBlur}
                className={`${error ? 'border-red-500' : ''}`}
                placeholder="HH:MM:SS"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default TimeInput;
