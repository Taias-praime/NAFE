import { Input } from '../ui/input'
import { Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import Modal from './modal'
import { ReactNode, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { local, removeBase64 } from '../../lib/utils'
import useFetch from '../../hooks/useFetch'
import { toast } from '../ui/use-toast'
import ProfileImage from './ProfileImage'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const token = local("token");

interface CreateUserProps {
    label: ReactNode;
    tenantId: string;
}

const CreateUser = ({ label, tenantId }: CreateUserProps) => {
    const [featuredImg, setFeaturedImg] = useState('');
    const [departments, setDepartments] = useState([]);
    const [rank, setRank] = useState([]);
    const [open, setOpen] = useState(false);

    const formik = useFormik({
        initialValues: {
            image: featuredImg,
            rank: '',
            tenant_id: tenantId,
            first_name: '',
            last_name: '',
            email: '',
            phone_number: '',
        },
        onSubmit: (obj) => {
            const data = {
                ...obj,
                image: removeBase64(featuredImg),
            }
            onPost(data);
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
                title: `${message}`,
                variant: 'destructive',
            });
        },
        {},
        {
            "Authorization": `Bearer ${token}`,
        }
    );

    // fetch department
    const { onFetch: getDeps } = useFetch(
        `/tenants/sa/`,
        (data) => {
            setDepartments(data.data.results);
        },
        (error, status) => {
            const { message, ...err } = error;
            // notify
            toast({
                title: `${message} (${status})`,
                description: err.errors.error_message,
                variant: "destructive",
            });
        }
    );

        // fetch Rank
        const { onFetch: fetchRank } = useFetch(
            '/moderators/sa/ranks',
            (data, status) => {
                if (status === 200) {
                    setRank(data.data.ranks)
                }
            },
            (error, status) => {
                const { message } = error;
                // notify
                toast({
                    title: `Error: Failed to submit (${status})`,
                    description: message || '',
                    variant: 'destructive',
                });
            },
        );

    useEffect(() => {
        getDeps();
        fetchRank();
    }, []);

    const deleteImage = () => {
        setFeaturedImg('')
    }

    const handleDepartment = (value: string) => {
        formik.setFieldValue('tenant_id', value);
    }

    const handleRank = (rank: string) => {
        formik.setFieldValue('rank', rank)
    }

    return (
        <Modal open={open} onOpenChange={(value) => setOpen(value)} className="flex items-center gap-3"
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
                <div className="w-full">
                    <Select onValueChange={handleRank}>
                        <label className="block pb-3">Rank</label>

                        <SelectTrigger className="w-[330px]">
                            <SelectValue placeholder="Select Rank" />
                        </SelectTrigger>
                        <SelectContent>
                            {rank.map(
                                (e: { name: string; value: string }) => (
                                    <SelectItem key={e.value} value={e.value}>
                                        {e.name}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full">
                    <Select onValueChange={handleDepartment}>
                        <label className="block pb-3">Department</label>
                        <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder="Select Here" />
                        </SelectTrigger>
                        <SelectContent>
                            {departments.map(
                                (e: { name: string; tenant_id: string }) => (
                                    <SelectItem key={e.name} value={e.tenant_id}>
                                        {e.name}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                </div>

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

export default CreateUser;