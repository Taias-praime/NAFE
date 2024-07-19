import { Input } from '../ui/input'
import { Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import Modal from './modal'
import { ReactNode,} from 'react'
import { useFormik } from 'formik'
import { local,} from '../../lib/utils'
import useFetch from '../../hooks/useFetch'
import { toast } from '../ui/use-toast'

const token = local("token");

interface CreateDepartmentProps {
    setOpen: (value: boolean) => void;
    open: boolean;
    label: ReactNode;
    tenantId: string;
}

const CreateDepartment = ({ open, label, setOpen, tenantId }: CreateDepartmentProps) => {

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
            onPost(obj);
        }
    })

    // add
    const { onPost, isFetching: isLoadingPost } = useFetch(
        `/tenants/sa/add`,
        (data) => {
            formik.resetForm();
            setOpen(false);
            toast({ description: data.message });
        },
        (e) => {
            const { message, ...err } = e;
            // notify
            toast({
                title: `${message} (${status})`,
                description: err.errors.error_message,
                variant: 'destructive',
            });
        },
        {},
        {
            "Authorization": `Bearer ${token}`,
        }
    );

    return (
        <Modal open={open} onOpenChange={(value) => setOpen(value)} className="flex items-center gap-3"
            label={label}
        >
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
                <Input
                    value={formik.values.tenant_name}
                    onChange={formik.handleChange}
                    name="tenant_name"
                    placeholder="Department name"
                    className=""
                    label="Name of Department"
                />
                <Input
                    value={formik.values.code}
                    onChange={formik.handleChange}
                    name="code"
                    placeholder="Abbreviation"
                    className=""
                    label="Abbreviation"
                />
                <Input
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    name="first_name"
                    placeholder="first name"
                    className=""
                    label="HOD First Name"
                />
                <Input
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    name="last_name"
                    placeholder="last name"
                    className=""
                    label="HOD Last Name"
                />

                <Input
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    name="email"
                    placeholder="email address"
                    className=""
                    label="Email"
                />
                <Input
                    value={formik.values.phone_number}
                    onChange={formik.handleChange}
                    name="phone_number"
                    placeholder="phone number"
                    className=""
                    label="Phone Number"
                />
                <Input
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    name="description"
                    placeholder="Description of the department"
                    className=""
                    label="Description of the department"
                />
                <Input
                    value={formik.values.service}
                    onChange={formik.handleChange}
                    name="service"
                    placeholder="Department Service"
                    className=""
                    label="Service of the Department"
                />

                <div className="flex items-start justify-end mt-6">
                    <Button variant="default" type='submit' className="px-10">
                        {
                            isLoadingPost ? <Loader2 className='animate-spin' /> : ('Create')
                        }
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default CreateDepartment;