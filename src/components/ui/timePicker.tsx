
import DatePicker from 'react-datepicker';
import ErrorMessage from './error';

interface TimePickerProps {
    label: string;
    error?: string;
    classname: string;
    value: Date | null;
    onChange: (e: Date | null) => void;
}

const TimePicker = ({ label, error, classname, value, onChange }: TimePickerProps) => {

    return (
        <div className={classname}>
            <label>{label}</label>
            <DatePicker
                selected={value}
                onChange={(date) => onChange(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                dateFormat="h:mm aa"
                placeholderText="00:00"
                className="w-full block outline-none bg-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <ErrorMessage error={error} />
        </div>
    );
};

export default TimePicker;
