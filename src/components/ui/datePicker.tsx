
import DatePicker from 'react-datepicker';
import ErrorMessage from './error';

interface TimePickerProps {
    label: string;
    error?: string;
    classname: string;
    disabled?: boolean;
    value: Date | null | undefined;
    onChange: (e: Date | null) => void;
}

const CustomDatePicker = ({ label, error, classname, disabled, value, onChange }: TimePickerProps) => {

    return (
        <div className={classname}>
            <label>{label}</label>
            <DatePicker
                minDate={new Date()}
                selected={value}
                onChange={onChange}
                placeholderText="09/04/2024"
                disabled={disabled}
                className="w-full block outline-none bg-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <ErrorMessage error={error} />
        </div>
    );
};

export default CustomDatePicker;
