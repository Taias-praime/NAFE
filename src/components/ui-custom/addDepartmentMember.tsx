import { Input } from '../ui/input'
import { Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import Modal from './modal'
import { ReactNode, useState } from 'react'
import { useFormik } from 'formik'
import { local } from '../../lib/utils'
import useFetch from '../../hooks/useFetch'
import { toast } from '../ui/use-toast'
import ProfileImage from './ProfileImage'

const token = local("token");

interface AddDepartmentMemberProps {
    openModal: () => void;
    setOpen: (value: boolean) => void;
    open: boolean;
    label: ReactNode;
    tenantId: string;
}

const AddDepartmentMember = ({ open, openModal, label, setOpen, tenantId }: AddDepartmentMemberProps) => {
    const [featuredImg, setFeaturedImg] = useState('');

    const formik = useFormik({
        initialValues: {
            rank: '',
            tenant_id: tenantId,
            first_name: '',
            last_name: '',
            email: '',
            phone_number: '',
        },
        onSubmit: (obj) => {
            onPost(obj);

        }
    })

    // add
    const { onPost, isFetching: isLoadingPost } = useFetch(
        `/users/sa/add-to-tenant`,
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


    const deleteImage = () => {
        setFeaturedImg('')
    }

    return (
        <Modal open={open} openModal={openModal} onOpenChange={(value) => setOpen(value)} className="flex items-center gap-3"
            label={label}
        >
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
                <ProfileImage deleteImage={deleteImage} setFeaturedImg={setFeaturedImg} featuredImg={featuredImg} />
                <Input
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    name="first_name"
                    placeholder="first name"
                    className=""
                    label="First Name"
                />
                <Input
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    name="last_name"
                    placeholder="last name"
                    className=""
                    label="Last Name"
                />
                <Input
                    value={formik.values.rank}
                    onChange={formik.handleChange}
                    name="rank"
                    placeholder="rank"
                    className=""
                    label="Rank"
                />
                {/* <Input
                    value={''}
                    name="title"
                    placeholder="title here"
                    className=""
                    label="Press Realease Title"
                /> */}
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

                <div className="flex items-start justify-end mt-6">
                    <Button variant="default" type='submit' className="px-10">
                        {
                            isLoadingPost ? <Loader2 className='animate-spin' /> : ('Add Member')
                        }
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default AddDepartmentMember;