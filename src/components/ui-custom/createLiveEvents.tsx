import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import Modal from './modal'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { format } from 'date-fns'
import { Calendar } from '../ui/calendar'
import { cn, local, removeBase64 } from '../../lib/utils'
import { toast } from '../ui/use-toast'
import useFetch from '../../hooks/useFetch'
import ProfileImage from './ProfileImage'

const token = local("token");

interface CreateLiveEventsProps {
    isLVEdit: boolean;
    openModal: () => void;
    setEditLVModal: (value: boolean) => void;
    setIsLVEdit: (value: boolean) => void;
    LV: any;
    open: boolean;
}

const CreateLiveEvents = ({ isLVEdit, openModal, setEditLVModal, setIsLVEdit, LV, open }: CreateLiveEventsProps) => {
    const [eventDate, setEventDate] = useState<Date>();
    const [featuredImg, setFeaturedImg] = useState('');
    const [id, setId] = useState('');

    const formik = useFormik({
        initialValues: {
            image: '',
            date: '',
            link: '',
            title: '',
            description: '',
            files: [] as string[]
        },
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
            setEditLVModal(false);
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

    // edit
    const { onPut, isFetching: isLoadingEdit } = useFetch(
        `/army-staffs/sa/${id}/edit-live-event`,
        (data) => {
            toast({ description: data.message });
            formik.resetForm();
            setEditLVModal(false);
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

    useEffect(() => {
        if (LV.length !== 0) {
            const liveEvent = LV[0]
            setId(liveEvent.id)
            setEventDate(liveEvent.date)
            setFeaturedImg(liveEvent.image)
            formik.setValues({
                image: liveEvent.image,
                date: liveEvent.date,
                link: liveEvent.event_link,
                title: liveEvent.title,
                description: liveEvent.theme_description,
                files: liveEvent.files,
            })
        }
    }, [isLVEdit, LV])

    useEffect(() => {
        formik.setFieldValue("date", eventDate)
    }, [eventDate])

    const lvModal = (value: boolean) => {
        setEditLVModal(value);
        setIsLVEdit(false);
        setFeaturedImg('');
        formik.resetForm();
        setEventDate(undefined);
    }

    return (
        <Modal open={open} openModal={openModal} onOpenChange={(value) => lvModal(value)} className="flex items-center gap-3 p-3"
            label="Create Live Event"
        >
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
                <ProfileImage setFeaturedImg={setFeaturedImg} featuredImg={featuredImg} />
                <Input
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    name="title"
                    placeholder="title here"
                    className=""
                    label="Event Title"
                />
                <div className="">
                    <label>Select Event Date</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full rounded-none border-0 border-b border-black justify-start text-left font-normal my-2 px-0",
                                    !eventDate && "text-muted-foreground"
                                )}
                            >
                                {eventDate ? format(eventDate, "dd/MM/yyyy") : <span>dd/mm/yyyy</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={eventDate}
                                onSelect={setEventDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <Input
                    value={formik.values.link}
                    onChange={formik.handleChange}
                    name="link"
                    placeholder="paste your link here"
                    className=""
                    label="Live Link"
                />
                <Textarea
                    rows={4}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    name="description"
                    placeholder="description here"
                    className="mb-10"
                    label="Description"
                />

                <div className="flex items-start justify-end mt-6">
                    <Button variant="default" type='submit' className="px-10">
                        {
                            isLoadingEdit || isLoadingCreate ? <Loader2 className='animate-spin' /> : (isLVEdit ? 'Update' : 'Create')
                        }
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default CreateLiveEvents;