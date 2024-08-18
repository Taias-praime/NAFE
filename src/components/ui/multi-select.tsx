import Select from 'react-select';

interface IReactSelect {
    options: any[];
    handleSelect: (value: any) => void;
    value: any;
    label: string;
    isMulti?: boolean;
    optionName: string;
    optionValue: string;
}

const ReactSelect = ({ options, handleSelect, value, label, isMulti, optionName, optionValue }: IReactSelect) => {

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
        <>
            <label className="block pb-1"> {label} </label>
            <Select isMulti={isMulti} options={options} onChange={handleSelect}
                getOptionLabel={(options) => options[optionName]}
                getOptionValue={(options) => options[optionValue]}
                value={value}
                styles={customStyles}
                placeholder='select department'
            >
            </Select>
        </>
    )
}

export default ReactSelect;