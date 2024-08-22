import { Input } from '../ui/input'
import { Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import Modal from './modal'
import { ReactNode, useEffect, useState, } from 'react'
import { useFormik } from 'formik'
import { local, } from '../../lib/utils'
import useFetch from '../../hooks/useFetch'
import { toast } from '../ui/use-toast'

const token = local("token");

interface CreateDepartmentProps {
    label: ReactNode;
    tenantId: string;
}

const CreateDepartment = ({ label, tenantId }: CreateDepartmentProps) => {

    const [open, setOpen] = useState(false);
    const [disableEdit, setDisableEdit] = useState(true);
    const [id, setId] = useState('');

    const formik = useFormik({
        initialValues: {
            code: '',
            tenant_id: tenantId,
            first_name: '',
            last_name: '',
            email: '',
            phone_number: '',
            description: '',
            service: '',
            tenant_name: '',
            tenant_type: "dept_admin"
        },
        onSubmit: (obj) => {
            if (id) {
                onPut(obj)
            } else {
                onPost(obj);
            }

        }
    })

    // add
    const { onPost, isFetching: isLoadingPost } = useFetch(
        `/tenants/sa/add`,
        (data) => {
            formik.resetForm();
            setOpen(false);
            setId('');
            setDisableEdit(true);
            toast({ description: data.message });
        },
        (e) => {
            const { message } = e;
            // notify
            toast({
                title: `${message} (${status})`,
                variant: 'destructive',
            });
        },
        {},
        {
            "Authorization": `Bearer ${token}`,
        }
    );

    // edit
    const { onPut, isFetching: isLoadingPut } = useFetch(
        `/tenants/sa/${id}/edit`,
        (data) => {
            formik.resetForm();
            setOpen(false);
            toast({ description: data.message });
        },
        (e) => {
            const { message } = e;
            // notify
            toast({
                title: `${message} (${status})`,
                variant: 'destructive',
            });
        },
        {},
        {
            "Authorization": `Bearer ${token}`,
        }
    );

    // fetch department details

    const { onFetch, isFetching } = useFetch(
        `/tenants/sa/${id}/details`,
        (data) => {
            const _data = data.data
            const hod = _data.hod_details
            formik.setValues({
                code: _data.code,
                tenant_id: tenantId,
                first_name: hod.first_name,
                last_name: hod.last_name,
                email: hod.email,
                phone_number: hod.email,
                description: _data.description,
                service: _data.service ?? '',
                tenant_name: _data.name,
                tenant_type: "dept_admin"
            })
            toast({ description: data.message });
        },
        (e) => {
            const { message } = e;
            // notify
            toast({
                title: `${message} (${status})`,
                variant: 'destructive',
            });
        },
        {},
        {
            "Authorization": `Bearer ${token}`,
        }
    );

    useEffect(() => {
        if (open && tenantId) {
            setId(tenantId)
        } else if (!tenantId) {
            setDisableEdit(false);
        }
    }, [open])

    useEffect(() => {
        if (id) {
            onFetch()
        }
    }, [id])

    const enableEdit = () => {
        setDisableEdit(false);
    }

    const toggleOpen = (value: boolean) => {
        if (value) {
            setId('');
            setDisableEdit(true);
        }
        setOpen(value);
    }

    return (
        <Modal open={open} onOpenChange={toggleOpen} className="flex items-center gap-3" label={label}>
            {
                isFetching ? (
                    <Loader2 className='animate-spin m-auto' />
                ) : (
                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
                        <Input
                            value={formik.values.tenant_name}
                            onChange={formik.handleChange}
                            name="tenant_name"
                            placeholder="Department name"
                            className=""
                            label="Name of Department"
                            disabled={disableEdit}
                        />
                        <Input
                            value={formik.values.code}
                            onChange={formik.handleChange}
                            name="code"
                            placeholder="Abbreviation"
                            className=""
                            label="Abbreviation"
                            disabled={disableEdit}
                        />
                        <Input
                            value={formik.values.first_name}
                            onChange={formik.handleChange}
                            name="first_name"
                            placeholder="first name"
                            className=""
                            label="HOD First Name"
                            disabled={disableEdit}
                        />
                        <Input
                            value={formik.values.last_name}
                            onChange={formik.handleChange}
                            name="last_name"
                            placeholder="last name"
                            className=""
                            label="HOD Last Name"
                            disabled={disableEdit}
                        />

                        <Input
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            name="email"
                            placeholder="email address"
                            className=""
                            label="Email"
                            disabled={disableEdit}
                        />
                        <Input
                            value={formik.values.phone_number}
                            onChange={formik.handleChange}
                            name="phone_number"
                            placeholder="phone number"
                            className=""
                            label="Phone Number"
                            disabled={disableEdit}
                        />
                        <Input
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            name="description"
                            placeholder="Description of the department"
                            className=""
                            label="Description of the department"
                            disabled={disableEdit}
                        />
                        <Input
                            value={formik.values.service}
                            onChange={formik.handleChange}
                            name="service"
                            placeholder="Department Service"
                            className=""
                            label="Service of the Department"
                            disabled={disableEdit}
                        />

                        <div className="flex items-start gap-3 justify-end mt-6">
                        <Button variant="outline" onClick={() => toggleOpen(false)} type='button' className="px-10">Cancel </Button>

                            {
                                id && disableEdit && <Button onClick={enableEdit} type='button' className="px-10">Edit Department </Button>
                            }
                            {
                                id && !disableEdit && <Button variant="default" type='submit' className="px-10">
                                    {isLoadingPut ? <Loader2 className='animate-spin' /> : 'Update Department'}
                                </Button>
                            }
                            {
                                !id && (
                                    <Button variant="default" type='submit' className="px-10">
                                        {isLoadingPost ? <Loader2 className='animate-spin' /> : 'Add Department'}
                                    </Button>
                                )
                            }
                        </div>
                    </form>
                )
            }

        </Modal>
    )
}

export default CreateDepartment;