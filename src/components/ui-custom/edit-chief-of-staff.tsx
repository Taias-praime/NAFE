import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Modal from "./modal";
import ProfileImage from "./ProfileImage";
import { Loader2, Paperclip, PencilLine } from "lucide-react";
import { FileItem } from "./files";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { removeBase64 } from "../../lib/utils";
import useFetch from "../../hooks/useFetch";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";

interface EditChiefOfStaffProps {
    id: string;
    setReload: (value: boolean) => void;
}

const EditChiefOfStaff = ({ id, setReload }: EditChiefOfStaffProps) => {
    const [open, setOpen] = useState(false);
    const [disableEdit, setDisableEdit] = useState(true);

    const [featuredImg, setFeaturedImg] = useState("");

    const validate = (values: any) => {
        const errors: any = {};
        if (!values.image && !disableEdit && !featuredImg) {
            errors.image = 'Image is required';
        }
        if (values.fullname < 5) {
            errors.fullname = 'Name be more that 5 characters';
        }
        else if (values.title < 5) {
            errors.title = 'Title be more that 5 characters';
        }
        else if (values.description < 5) {
            errors.description = 'Description be more that 5 characters';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            image: featuredImg,
            fullname: '',
            title: '',
            description: '',
            files: [] as string[]
        },
        validate,
        onSubmit: (obj) => {
            const data = { ...obj, image: removeBase64(featuredImg) };
            onPut(data);
        }
    })

    // get COAS
    const { onFetch, isFetching } = useFetch(
        `/army-staffs/sa/${id}/details`,
        (data) => {
            const _data = data.data
            toast({ description: data.message });
            setDisableEdit(true);
            formik.setValues({
                image: _data.image,
                fullname: _data.fullname,
                title: _data.title,
                description: _data.description,
                files: [..._data.files],
            })
            setFeaturedImg(_data.image)
        },
        (e) => {
            const { message } = e;
            // notify
            toast({
                title: `${message} (${status})`,
                variant: 'destructive',
            });
        },
    );

    // edit COAS
    const { onPut, isFetching: isLoadingEdit } = useFetch(
        `/army-staffs/sa/${id}/edit`,
        (data) => {
            toast({ description: data.message });
            setOpen(!open)
            setDisableEdit(false);
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
    );

    useEffect(() => {
        if (featuredImg) formik.setFieldValue('image', featuredImg.split('data:image/jpeg;')[1]);
    }, [featuredImg])

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
        if (value && id) {
            onFetch();
        } 
        setDisableEdit(true);
        setOpen(value)
    }

    const deleteImage = () => {
        setFeaturedImg("");
        formik.setFieldValue("image", "")
    }

    return (
        <Modal open={open} onOpenChange={(value) => toggleOpen(value)} title="Chief of Army Staff" className="flex items-center gap-3 p-3"
            label={<> <PencilLine /> Edit </>}
        >
            {
                isFetching ? <Loader2 className="animate-spin" /> : (
                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
                        <ProfileImage disabled={disableEdit} setFeaturedImg={setFeaturedImg} deleteImage={deleteImage} featuredImg={featuredImg} error={formik.errors.image} />
                        <Input
                            value={formik.values.fullname}
                            onChange={formik.handleChange}
                            name="fullname"
                            placeholder="name"
                            className=""
                            label="Full Name"
                            disabled={disableEdit}
                            error={formik.errors.fullname}
                        />
                        <Input
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            name="title"
                            placeholder="title"
                            className=""
                            label="Title"
                            disabled={disableEdit}
                            error={formik.errors.title}
                        />
                        <Textarea
                            rows={4}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            name="philosophy"
                            placeholder="philosophy"
                            className="mb-10"
                            label="Philosophy"
                            disabled={disableEdit}
                            error={formik.errors.description}
                        />
                        {formik.values.files && (
                            <div className="flex flex-col gap-4">
                                {formik.values.files.map((file) => (
                                    <FileItem key={file} disabled={disableEdit} showDelete={true} onClick={(e: { preventDefault: () => void; }) => removeFile(e, file)} file={file} />
                                ))}
                            </div>
                        )}
                        <div className="flex items-start gap-3 justify-end mt-6">
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
                                        <Button variant={`${formik.values.fullname === '' || featuredImg === '' || formik.values.title === '' || formik.values.description === '' ? 'disabled' : 'default'}`} type='submit' className="px-10">
                                            {isLoadingEdit ? <Loader2 className='animate-spin' /> : 'Update'}
                                        </Button>
                                    </>
                                )
                            }
                        </div>
                    </form>
                )
            }

        </Modal>
    )
}

export default EditChiefOfStaff;