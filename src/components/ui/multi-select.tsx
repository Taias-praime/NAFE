import Select  from 'react-select';

const MultiSelect = ({tenants, handleEventTypeSelect, tenantsId, isEdit}) => {

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
        }),
    };

    return (
        <>
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