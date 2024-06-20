import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Paperclip, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import Modal from './modal'
import { useEffect, useState } from 'react'
import { FileItem } from './files'
import { useFormik } from 'formik'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Calendar } from '../ui/calendar'
import { format } from 'date-fns'
import { cn, local } from '../../lib/utils'
import { FeaturedImg } from '../../pages/ChiefOfArmyStaff'
import useFetch from '../../hooks/useFetch'
import { toast } from '../ui/use-toast'

const token = local("token");

interface CreatePressReleaseProps {
    isPREdit: boolean;
    openModal: () => void;
    setEditPRModal: (value: boolean) => void;
    setIsPREdit: (value: boolean) => void;
    PR: any;
    open: boolean;
}

const CreatePressRelease = ({ isPREdit, openModal, setEditPRModal, setIsPREdit, PR, open, }: CreatePressReleaseProps) => {

    const [eventDate, setEventDate] = useState<Date>();
    const [featuredImg, setFeaturedImg] = useState('');
    const [rawImg, setRawImg] = useState('');
    const [id, setId] = useState('');

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
            if (rawImg) {
                handleFileUpload(rawImg)
            }
            const data = {
                ...obj,
                date: date
            }
            if (isPREdit) {
                onPut(data);
            } else {
                onPost(data);
            }
            formik.resetForm();
            setEditPRModal(false);
        }
    })

    // edit
    const { onPost, isFetching: isLoadingPost } = useFetch(
        `/press-releases/sa/add`,
        (data) => {
            toast({ description: data.message });
            formik.resetForm();
            setEditPRModal(false);
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
    const { onPut, isFetching: isLoadingPut } = useFetch(
        `/press-releases/sa/${id}/edit`,
        (data) => {
            toast({ description: data.message });
            formik.resetForm();
            setEditPRModal(false);
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

    // upload file
    const { onPost: uploadFile } = useFetch(
        '/files/upload',
        (data,) => {
            console.log(data);
            return data;
        },
        (error, status) => {
            const { message, ...err } = error;
            toast({
                title: `${message} (${status})`,
                description: err.errors.error_message,
                variant: 'destructive',
            })
        },
        {},
        {
            'Content-Type': 'multipart/form-data'
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

    const handleFileUpload = async (file: string) => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            await uploadFile(formData).then((res: any) => {
                console.log("AFTER UPLOAD", res);
            });
        }
    };

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
        setEventDate(undefined);
    }

    const deleteImage = () => {
        setFeaturedImg('')
    }

    return (
        <Modal open={open} openModal={openModal} onOpenChange={(value) => prModal(value)} className="flex items-center gap-3 p-3"
            label="Upload Press Release"
        >
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
                <FeaturedImg deleteImage={deleteImage} setFeaturedImg={setFeaturedImg} setRawImg={setRawImg} featuredImg={featuredImg} />
                <Input
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    name="title"
                    placeholder="title here"
                    className=""
                    label="Press Realease Title"
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
                <Textarea
                    rows={4}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    name="description"
                    placeholder="description here"
                    className="mb-10"
                    label="Description"
                />
                {formik.values.files && (
                    <div className="flex flex-col gap-4">
                        {formik.values.files.map((file) => (
                            <FileItem showDelete={true} onClick={(e: { preventDefault: () => void }) => removeFile(e, file)} file={file} />
                        ))}
                    </div>
                )}

                <div className="flex items-start justify-between mt-6">
                    <Button variant="blue" className="px-10">
                        <label className="flex items-center justify-center gap-2 w-full h-full cursor-pointer">
                            <div className=" rounded">
                                <Paperclip className="text-white" />
                            </div>
                            Attach File
                            <input type="file" accept="*/" onChange={handleFileChange} className="hidden" />
                        </label>
                    </Button>
                    <Button variant="default" type='submit' className="px-10">
                        {
                            isLoadingPut || isLoadingPost ? <Loader2 className='animate-spin' /> : (isPREdit ? 'Update' : 'Create')
                        }
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default CreatePressRelease;