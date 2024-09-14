import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import Modal from './modal'
import { ReactNode, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { format } from 'date-fns'
import { removeBase64 } from '../../lib/utils'
import { toast } from '../ui/use-toast'
import useFetch from '../../hooks/useFetch'
import ProfileImage from './ProfileImage'

interface CreateLiveEventsProps {
    isLVEdit: boolean;
    setReload: (value: boolean) => void;
    label: string | ReactNode;
    title: string;
    id: string | null;
}

const CreateLiveEvents = ({ isLVEdit, setReload, title, label, id }: CreateLiveEventsProps) => {
    const [eventDate, setEventDate] = useState<Date | null>(new Date());
    const [featuredImg, setFeaturedImg] = useState('');
    const [disableEdit, setDisableEdit] = useState(true);
    const [open, setOpen] = useState(false);

    const validate = (values: any) => {
        const errors: any = {};
        if (!values.image && !disableEdit) {
            errors.image = 'Image is required';
        }
        if (values.date < 5) {
            errors.date = 'Date is required';
        }
        else if (values.title < 5) {
            errors.title = 'Title must be more that 5 characters';
        }
        else if (values.event_link < 5) {
            errors.title = 'Title must be more that 5 characters';
        }
        else if (values.description < 5) {
            errors.description = 'Description be more that 5 characters';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            image: '',
            date: '',
            event_link: '',
            title: '',
            description: '',
            files: [] as string[]
        },
        validate,
        onSubmit: (obj) => {
            const date = format((eventDate as Date), "yyyy-MM-dd");

            const data = {
                ...obj,
                date: date,
                image: removeBase64(featuredImg),
                start_time: "01:50:00",
                end_time: "02:50:00",
            }

            if (isLVEdit) {
                onPut(data);
            } else {
                onPost(data);
            }
        }
    })

    // Create
    const { onPost, isFetching: isLoadingCreate } = useFetch(
        `/army-staffs/sa/add-live-event`,
        (data) => {
            toast({ description: data.message });
            formik.resetForm();
            setReload(true);
            setOpen(false);
        },
        (e) => {
            const { message, } = e;
            // notify
            toast({
                title: `${message} (${status})`,
                variant: 'destructive',
            });
        },
        {},
    );

    // edit
    const { onPut, isFetching: isLoadingEdit } = useFetch(
        `/army-staffs/sa/${id}/edit-live-event`,
        (data) => {
            toast({ description: data.message });
            formik.resetForm();
            setDisableEdit(true);
            setReload(true);
            setOpen(false);
        },
        (e) => {
            const { message, } = e;
            // notify
            toast({
                title: `${message} (${status})`,
                variant: 'destructive',
            });
        },
        {},
    );

    const { onFetch, isFetching } = useFetch(
        `/army-staffs/sa/${id}/live-event-detail`,
        (data, status) => {
            if (status === 200) {
                const _data = data.data;
                setEventDate(_data.date)
                setFeaturedImg(_data.image)
                formik.setValues({
                    image: _data.image,
                    date: _data.date,
                    event_link: _data.event_link,
                    title: _data.title,
                    description: _data.description,
                    files: _data.files,
                })

            }
        },
        (error, status) => {
            // on error
            const { message } = error;
            // notify
            toast({
                title: `${message} (${status})`,
                variant: "destructive",
            });
        },
        {} // options
    );

    useEffect(() => {
        formik.setFieldValue("date", eventDate)
    }, [eventDate])

    const toggleOpen = (value: boolean) => {
        setFeaturedImg('');
        formik.resetForm();
        setEventDate(null);
        setOpen(value);
        if (id) {
            onFetch()
        } else setDisableEdit(false);
    }

    return (
        <Modal open={open} onOpenChange={(value) => toggleOpen(value)} title={title} className="flex items-center gap-3 p-3"
            label={label}
        >
            {
                isFetching ? <Loader2 className='animate-spin m-auto' /> : (
                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
                        <ProfileImage setFeaturedImg={setFeaturedImg} featuredImg={featuredImg} disabled={disableEdit}  error={formik.errors.image} />
                        <Input
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            name="title"
                            placeholder="title"
                            className=""
                            label="Event Title"
                            disabled={disableEdit}
                            error={formik.errors.title}
                        />
                        <div className="w-full">
                            <label>Select Event Date</label>
                            <DatePicker
                                minDate={new Date()}
                                selected={eventDate}
                                onChange={(date) => {
                                    setEventDate(date);
                                }}
                                className="w-full block outline-none bg-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={disableEdit}
                                // error={formik.errors.date}
                            />
                        </div>
                        <Input
                            value={formik.values.event_link}
                            onChange={formik.handleChange}
                            name="event_link"
                            placeholder="paste your event_link here"
                            className=""
                            label="Live Link"
                            disabled={disableEdit}
                            error={formik.errors.event_link}
                        />
                        <Textarea
                            rows={4}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            name="description"
                            placeholder="description"
                            className="mb-10"
                            label="Description"
                            disabled={disableEdit}
                            error={formik.errors.description}
                        />

                        <div className="flex items-start justify-end mt-6">
                            {
                                id && !disableEdit && (
                                    <Button variant={`${formik.values.date === '' || formik.values.event_link === "" || featuredImg === '' || formik.values.title === '' || formik.values.description === '' ? 'disabled' : 'default'}`} type='submit' className="px-10">
                                        {isLoadingEdit ? <Loader2 className='animate-spin' /> : 'Update'}
                                    </Button>
                                )
                            }
                            {
                                !id && (
                                    <Button variant={`${formik.values.date === '' || formik.values.event_link === "" || featuredImg === '' || formik.values.title === '' || formik.values.description === '' ? 'disabled' : 'default'}`} type='submit' className="px-10">
                                        {isLoadingCreate ? <Loader2 className='animate-spin' /> : 'Create'}
                                    </Button>
                                )
                            }
                            {id && disableEdit && <Button onClick={() => setDisableEdit(false)} type='button' className="px-10">Edit </Button>}
                        </div>
                    </form>
                )
            }

        </Modal>
    )
}

export default CreateLiveEvents;