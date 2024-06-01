import Select from 'react-select';
import { ITenants } from '../../models/interfaces';

interface IMultiSelect {
    tenants: ITenants[];
    handleEventTypeSelect: (tenant_ids: ITenants[]) => void;
    tenantsId: ITenants[];
    isEdit: boolean;
    label: string;
}

const MultiSelect = ({ tenants, handleEventTypeSelect, tenantsId, isEdit, label }: IMultiSelect) => {

    const customStyles = {
        control: (baseStyles) => ({
            ...baseStyles,
            border: 'none',
            borderBottom: '1px solid',
            boxShadow: 'none',
            borderRadius: 'none',
            padding: '5px 0 !important',
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
    };

    return (
        <>
            <label className="block pb-3"> {label} </label>
            <Select isMulti options={tenants} onChange={handleEventTypeSelect}
                getOptionLabel={(tenants) => tenants.name}
                getOptionValue={(tenants) => tenants.tenant_id}
                value={isEdit ? tenantsId : undefined}
                styles={customStyles}
                placeholder='select department'
            >
            </Select>
        </>
    )
}

export default MultiSelect;