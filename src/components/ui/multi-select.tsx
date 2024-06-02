import Select from 'react-select';
import { ITenants } from '../../models/interfaces';

interface IMultiSelect {
    options: ITenants[];
    handleSelect: (tenant_ids: ITenants[]) => void;
    value: ITenants[];
    label: string;
}

const MultiSelect = ({ options, handleSelect, value, label }: IMultiSelect) => {

    const customStyles = {
        control: (baseStyles) => ({
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
        placeholder: (styles) => ({
            ...styles,
            color: '#CECECE',
            fontSize: '14px',
        }),
        indicatorSeparator: (styles) => ({
            ...styles,
            display: 'none'
        }),
        ValueContainer2: (styles) => ({
            ...styles,
            padding: 'none'
        }),
    };

    return (
        <>
            <label className="block pb-1"> {label} </label>
            <Select isMulti options={options} onChange={handleSelect}
                getOptionLabel={(options) => options.name}
                getOptionValue={(options) => options.tenant_id}
                value={value}
                styles={customStyles}
                placeholder='select department'
            >
            </Select>
        </>
    )
}

export default MultiSelect;