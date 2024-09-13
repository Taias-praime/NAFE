import Select from 'react-select';
import ErrorMessage from './error';

interface IReactSelect {
    options: any[];
    handleSelect: (value: any) => void;
    value: any;
    label: string;
    isMulti?: boolean;
    optionName: string;
    optionValue: string;
    error?: string | string[];
    divClass?: string;
    disabled?: boolean;
}

const ReactSelect = ({ options, handleSelect, value, label, isMulti, optionName, error, divClass, optionValue, disabled }: IReactSelect) => {

    const customStyles = {
        control: (baseStyles: any) => ({
            ...baseStyles,
            border: 'none',
            borderBottom: '1px solid',
            boxShadow: 'none',
            borderRadius: 'none',
            padding: '3px 0 !important',
            '&:hover': {
                borderBottom: '1px solid',
                outline: 'none',
            },
        }),
        placeholder: (styles: any) => ({
            ...styles,
            color: '#CECECE',
            fontSize: '14px',
        }),
        indicatorSeparator: (styles: any) => ({
            ...styles,
            display: 'none'
        }),
        ValueContainer2: (styles: any) => ({
            ...styles,
            padding: 'none'
        }),
    };

    return (
        <div className={divClass} >
            <label className="block pb-1"> {label} </label>
            <Select isMulti={isMulti} options={options} onChange={handleSelect}
                getOptionLabel={(options) => options[optionName]}
                getOptionValue={(options) => options[optionValue]}
                value={value}
                styles={customStyles}
                placeholder='select department'
                isDisabled={disabled}
                className="text-sm"
            >
            </Select>
            <ErrorMessage error={error} />
        </div>
    )
}

export default ReactSelect;