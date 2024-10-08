import { ReactNode, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { Input } from '../ui/input'
import { Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import Modal from './modal'
import { removeBase64 } from '../../lib/utils'
import useFetch from '../../hooks/useFetch'
import { toast } from '../ui/use-toast'
import ProfileImage from './ProfileImage'
import ReactSelect from '../ui/multi-select'
import { IDepartment, IRanks } from '../../models/interfaces'

interface CreateUserProps {
    label: ReactNode;
    tenantId: string;
}

const CreateUser = ({ label, tenantId }: CreateUserProps) => {
    const [featuredImg, setFeaturedImg] = useState('');
    const [departments, setDepartments] = useState<IDepartment[]>([]);
    const [ranks, setRanks] = useState<IRanks[]>([]);
    const [rank, setRank] = useState<IRanks>();
    const [department, setDepartment] = useState<IDepartment>();
    const [open, setOpen] = useState(false);
    const [disableEdit, setDisableEdit] = useState(true);
    const [id, setId] = useState('');
    const [user, setUser] = useState<any>();

    const validate = (values: any) => {
        const errors: any = {};
        if (!values.image && !disableEdit && !featuredImg) {
            errors.image = 'Image is required';
        }
        if (values.first_name < 5) {
            errors.first_name = 'Firstname must be more that 5 characters';
        }
        else if (values.last_name < 5) {
            errors.last_name = 'Lastname must be more that 5 characters';
        }
        else if (values.email < 5) {
            errors.email = 'Email must be more that 5 characters';
        }
        else if (values.phone_number < 5) {
            errors.phone_number = 'Phone number must be more that 5 characters';
        }
        else if (values.department < 5) {
            errors.department = 'Department must be more that 5 characters';
        }
        else if (!values.rank) {
            errors.rank = 'Rank is required';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            image: featuredImg,
            rank: '',
            department: '',
            first_name: '',
            last_name: '',
            email: '',
            phone_number: '',
        },
        validate,
        onSubmit: (obj) => {
            const data = {
                ...obj,
                image: removeBase64(featuredImg),
            }
            if (id) {
                const user = {
                    ...data,
                    tenant_id: department?.tenant_id
                }
                onPut(user)
            } else {
                onPost(data);
            }
        }
    })

    const isDisabled = formik.values.first_name === '' ||
        formik.values.last_name === '' ||
        featuredImg === '' ||
        formik.values.rank === '' ||
        formik.values.department === '' ||
        formik.values.email === '' ||
        formik.values.phone_number === '';

    // add
    const { onPost, isFetching: isLoadingPost } = useFetch(
        `/users/sa/add-to-tenant`,
        (data) => {
            formik.resetForm();
            setOpen(false);
            toast({ description: data.message });
        },
        (e) => {
            const { message, } = e;
            
            toast({
                title: `${message}`,
                variant: 'destructive',
            });
        },
        {},
    );

    // edit
    const { onPut, isFetching: isLoadingPut } = useFetch(
        `/users/sa/${id}/edit`,
        (data) => {
            formik.resetForm();
            setOpen(false);
            setId('');
            setDisableEdit(true);
            toast({ description: data.message });
        },
        (e) => {
            const { message, } = e;
            
            toast({
                title: `${message}`,
                variant: 'destructive',
            });
        },
        {},
    );

    // get user details
    const { onFetch, isFetching } = useFetch(
        `/users/sa/${id}/details`,
        (data) => {
            const names = data.data.full_name.split(' ');
            formik.setValues({
                image: data.data.image,
                rank: data.data.rank,
                department: data.data.department_name,
                first_name: names[0],
                last_name: names[1],
                email: data.data.email,
                phone_number: data.data.phone_number,
            });
            setFeaturedImg(data.data.profile_picture);
            setUser(data.data)
            toast({ description: data.message });
        },
        (e) => {
            const { message, } = e;
            
            toast({
                title: `${message}`,
                variant: 'destructive',
            });
        },
        {},
    );

    // fetch department
    const { onFetch: getDeps, isFetching: isLoadingDepartments } = useFetch(
        `/tenants/sa/`,
        (data) => {
            setDepartments(data.data.results);
        },
        (error) => {
            const { message } = error;
            
            toast({
                title: `${message}`,
                variant: "destructive",
            });
        }
    );

    // fetch Rank
    const { onFetch: fetchRank, isFetching: isLoadingRanks } = useFetch(
        '/moderators/sa/ranks',
        (data, status) => {
            if (status === 200) {
                setRanks(data.data.ranks)
            }
        },
        (error) => {
            const { message } = error;
            
            toast({
                title: `${message}`,
                variant: "destructive",
            });
        },
    );

    useEffect(() => {
        getDeps();
        fetchRank();
    }, []);

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

    useEffect(() => {
        if (user && ranks.length > 0 && isLoadingRanks === false) {
            const getRank = getSelectValue(user.rank, ranks, "name");
            setRank(getRank)
        }
    }, [user, isLoadingRanks])

    useEffect(() => {
        if (user && departments.length > 0 && isLoadingDepartments === false) {
            const getDepartment = getSelectValue(user.department_name, departments, "name");
            setDepartment(getDepartment)
        }
    }, [user, isLoadingDepartments])

    const deleteImage = () => {
        setFeaturedImg('')
    }

    const handleRankSelect = (rank: IRanks) => {
        setRank(rank);
        formik.setFieldValue('rank', rank.name)
    }

    const handleDepartmentSelect = (department: IDepartment) => {
        setDepartment(department);
        formik.setFieldValue('department', department.name)
    }

    const enableEdit = () => {
        setDisableEdit(false);
    }

    const getSelectValue = (name: string, arr: any[], value: string) => {
        if (!name) return;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][value] === name) {
                return arr[i];
            }
        }
    }

    const toggleOpen = (value: boolean) => {
        if (value) {
            setId('')
            setDisableEdit(true);
        }
        setOpen(value)
    }

    return (
        <Modal open={open} onOpenChange={toggleOpen} className="flex items-center gap-3"
            label={label}
        >
            {
                isFetching ? (
                    <Loader2 className='animate-spin m-auto' />
                ) : (
                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
                        <ProfileImage deleteImage={deleteImage} setFeaturedImg={setFeaturedImg} featuredImg={featuredImg} error={formik.errors.image} />
                        <Input
                            value={formik.values.first_name}
                            onChange={formik.handleChange}
                            name="first_name"
                            placeholder="first name"
                            className=""
                            label="First Name"
                            disabled={disableEdit}
                            error={formik.errors.first_name}
                        />
                        <Input
                            value={formik.values.last_name}
                            onChange={formik.handleChange}
                            name="last_name"
                            placeholder="last name"
                            className=""
                            label="Last Name"
                            disabled={disableEdit}
                            error={formik.errors.last_name}
                        />
                        <ReactSelect
                            label="Select Rank"
                            options={ranks}
                            handleSelect={handleRankSelect}
                            value={rank}
                            optionName="name"
                            optionValue="value"
                            disabled={disableEdit}
                            error={formik.errors.rank}
                        />
                        <ReactSelect
                            label="Select Department"
                            options={departments}
                            handleSelect={handleDepartmentSelect}
                            value={department}
                            optionName="name"
                            optionValue="name"
                            disabled={disableEdit}
                            error={formik.errors.department}
                        />
                        <Input
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            name="email"
                            placeholder="email address"
                            className=""
                            label="Email"
                            disabled={disableEdit}
                            error={formik.errors.email}
                        />
                        <Input
                            value={formik.values.phone_number}
                            onChange={formik.handleChange}
                            name="phone_number"
                            placeholder="phone number"
                            className=""
                            label="Phone Number"
                            disabled={disableEdit}
                            error={formik.errors.phone_number}
                        />

                        <div className="flex items-start gap-3 justify-end mt-6">
                            <Button variant="outline" onClick={() => toggleOpen(false)} type='button' className="px-10">Cancel </Button>
                            {
                                id && disableEdit && <Button onClick={enableEdit} type='button' className="px-10">Edit User </Button>
                            }
                            {
                                id && !disableEdit && <Button variant={isDisabled ? 'disabled' : 'default'} type='submit' className="px-10">
                                    {isLoadingPut ? <Loader2 className='animate-spin' /> : 'Update'}
                                </Button>
                            }
                            {
                                !id && (
                                    <Button variant={isDisabled ? 'disabled' : 'default'} type='submit' className="px-10">
                                        {isLoadingPost ? <Loader2 className='animate-spin' /> : 'Add User'}
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

export default CreateUser;