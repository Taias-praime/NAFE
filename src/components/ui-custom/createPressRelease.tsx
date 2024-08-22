import { useEffect, useState } from 'react'
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
    setEditPRModal: (value: boolean) => void;
    setReload: (value: boolean) => void;
    setIsPREdit: (value: boolean) => void;
    PR: any;
    open: boolean;
}

const CreatePressRelease = ({ isPREdit, setEditPRModal, setReload, setIsPREdit, PR, open, }: CreatePressReleaseProps) => {

    const [eventDate, setEventDate] = useState<Date | null>(new Date());
    const [featuredImg, setFeaturedImg] = useState('');
    const [id, setId] = useState('');
    const [disableEdit, setDisableEdit] = useState(true);

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
                console.log(data);
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
            setEditPRModal(false);
            setReload(true);
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
            setEditPRModal(false);
            setDisableEdit(true);
            setReload(true);
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
        if (isPREdit) {
            const pressRelease = PR[0]
            setId(pressRelease.id)
            setEventDate(pressRelease.date)
            setFeaturedImg(pressRelease.image)
            formik.setValues({
                image: pressRelease.image,
                date: pressRelease.date,
                title: pressRelease.title,
                description: pressRelease.description,
                files: pressRelease.files,
            })
        }
    }, [isPREdit])

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

    const prModal = (value: boolean) => {
        setEditPRModal(value);
        setIsPREdit(false);
        setFeaturedImg('');
        formik.resetForm();
        setEventDate(null);
        if (isPREdit) setDisableEdit(true);
    }

    const deleteImage = () => {
        setFeaturedImg('')
    }

    return (
        <Modal open={open} onOpenChange={(value) => prModal(value)} className="flex items-center gap-3 p-3"
            label="Upload Press Release"
        >
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
                    <div className="w-full">
                        <DatePicker
                            selected={eventDate}
                            onChange={(date) => {
                                setEventDate(date);
                                console.log(date);
                            }}
                            className="w-full block outline-none bg-none"
                            disabled={disableEdit}
                        />
                    </div>
                </div>
                <Textarea
                    rows={4}
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
                            <FileItem showDelete={true} onClick={(e: { preventDefault: () => void }) => removeFile(e, file)} file={file} />
                        ))}
                    </div>
                )}

                <div className="flex items-start justify-end gap-3 mt-6">
                    {disableEdit && <Button onClick={() => setDisableEdit(false)} type='button' className="px-10">Edit </Button>}
                    {
                        !disableEdit && (
                            <>
                                <Button variant="blue" type="button" className="px-8">
                                    <label className="flex items-center justify-center gap-2 w-full h-full cursor-pointer">
                                        <div className=" rounded"> <Paperclip className="text-white" /> </div>
                                        Attach File
                                        <input type="file" accept="*/" onChange={handleFileChange} className="hidden" />
                                    </label>
                                </Button>
                                <Button variant="default" type='submit' className="px-10">
                                    {isLoadingPut || isLoadingPost ? <Loader2 className='animate-spin' /> : (isPREdit ? 'Update' : 'Create')}
                                </Button>
                            </>
                        )
                    }

                </div>
            </form>
        </Modal>
    )
}

export default CreatePressRelease;