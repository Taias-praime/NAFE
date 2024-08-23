import { ReactNode, useEffect, useState } from 'react'
import { Paperclip, Loader2 } from 'lucide-react'
import { useFormik } from 'formik'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import Modal from './modal'
import { FileItem } from './files'
import { format } from 'date-fns'
import { local, removeBase64 } from '../../lib/utils'
import useFetch from '../../hooks/useFetch'
import { toast } from '../ui/use-toast'
import ProfileImage from './ProfileImage'

const token = local("token");

interface CreatePressReleaseProps {
    isPREdit: boolean;
    setReload: (value: boolean) => void;
    setIsPREdit: (value: boolean) => void;
    PR: any;
    label: ReactNode | string;
    title: string;
}

const CreatePressRelease = ({ isPREdit, setReload, setIsPREdit, PR, label, title }: CreatePressReleaseProps) => {
    const [eventDate, setEventDate] = useState<Date | null>(new Date());
    const [featuredImg, setFeaturedImg] = useState('');
    const [id, setId] = useState<string | null>(null);
    const [disableEdit, setDisableEdit] = useState(true);
    const [open, setOpen] = useState(false);

    const formik = useFormik({
        initialValues: {
            image: '',
            date: '',
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
            }

            if (isPREdit) {
                onPut(data);
            } else {
                onPost(data);
            }
        },
    })

    // add
    const { onPost, isFetching: isLoadingPost } = useFetch(
        `/press-releases/sa/add`,
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
        {
            "Authorization": `Bearer ${token}`,
        }
    );

    // edit
    const { onPut, isFetching: isLoadingPut } = useFetch(
        `/press-releases/sa/${id}/edit`,
        (data) => {
            toast({ description: data.message });
            formik.resetForm();
            setDisableEdit(true);
            setReload(true);
            setOpen(false);
            setId(null)
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
        formik.setFieldValue("date", eventDate)
    }, [eventDate])

    useEffect(() => {
        if (open) {
            if (PR) {
                const pressRelease = PR;
                setId(pressRelease.id);
                setEventDate(pressRelease.date);
                setFeaturedImg(pressRelease.image);
                formik.setValues({
                    image: pressRelease.image,
                    date: pressRelease.date,
                    title: pressRelease.title,
                    description: pressRelease.description,
                    files: pressRelease.files,
                })
            } else {
                setDisableEdit(false);
            }
        }
    }, [open])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                formik.setFieldValue('files', [...formik.values.files, (reader.result as string)]);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeFile = (e: { preventDefault: () => void }, id: string) => {
        e.preventDefault();
        const files = formik.values.files.filter((file) => file !== id);
        formik.setFieldValue("files", files)
    }

    const toggleOpen = (value: boolean) => {
        setIsPREdit(false);
        setFeaturedImg('');
        formik.resetForm();
        setEventDate(null);
        setOpen(value);
        if (id) setDisableEdit(true);
        if (!value) setId(null);
    }

    const deleteImage = () => {
        setFeaturedImg('')
    }

    return (
        <Modal open={open} onOpenChange={(value) => toggleOpen(value)} title={title} className="flex items-center gap-3 p-3" label={label}>
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
                <ProfileImage deleteImage={deleteImage} setFeaturedImg={setFeaturedImg} featuredImg={featuredImg} disabled={disableEdit} />
                <Input
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    name="title"
                    placeholder="title here"
                    className=""
                    label="Press Realease Title"
                    disabled={disableEdit}
                />
                <div className="w-full">
                    <label>Select Event Date</label>
                    <DatePicker
                        selected={eventDate}
                        onChange={(date) => {
                            setEventDate(date);
                        }}
                        className="w-full block outline-none bg-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={disableEdit}
                    />
                </div>
                <Textarea
                    rows={1}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    name="description"
                    placeholder="description here"
                    className="mb-10"
                    label="Description"
                    disabled={disableEdit}
                />
                {formik.values.files && (
                    <div className="flex flex-col gap-4">
                        {formik.values.files.map((file) => (
                            <FileItem key={file} showDelete={true} onClick={(e: { preventDefault: () => void }) => removeFile(e, file)} file={file} />
                        ))}
                    </div>
                )}

                <div className="flex items-start justify-end gap-3 mt-6">
                    <Button variant="blue" type="button" className="px-8">
                        <label className="flex items-center justify-center gap-2 w-full h-full cursor-pointer">
                            <div className=" rounded"> <Paperclip className="text-white" /> </div>
                            Attach File
                            <input type="file" accept="*/" onChange={handleFileChange} className="hidden" />
                        </label>
                    </Button>
                    {id && disableEdit && <Button onClick={() => setDisableEdit(false)} type='button' className="px-10">Edit </Button>}
                    {
                        id && !disableEdit && (
                            <Button variant="default" type='submit' className="px-10">
                                {isLoadingPut ? <Loader2 className='animate-spin' /> : 'Update'}
                            </Button>
                        )
                    }
                    {
                        !id && (
                            <Button variant="default" type='submit' className="px-10">
                                {isLoadingPost ? <Loader2 className='animate-spin' /> : 'Create'}
                            </Button>
                        )
                    }

                </div>
            </form>
        </Modal >
    )
}

export default CreatePressRelease;