
import { ChangeEvent } from 'react';
import { Input } from '../ui/input';

const TimeInput = ({ label, name, value, onChange }: {
    label: string,
    name: string,
    value?: string,
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}) => {

    return (
        <div className="time-input">
            <label className="block mb-2">{label}</label>

            <Input
                type="time"
                name={name}
                value={value}
                onChange={onChange}
                placeholder="HH:MM:SS"
            />
        </div>
    );
};

export default TimeInput;
