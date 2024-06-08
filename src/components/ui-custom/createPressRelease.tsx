import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { ArrowUpToLine } from 'lucide-react'
import { Button } from '../ui/button'
import Modal from './modal'
import { useEffect, useState } from 'react'
import { FilesList } from './files'
import { useFormik } from 'formik'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Calendar } from '../ui/calendar'
import { format } from 'date-fns'
import { cn } from '../../lib/utils'
import { FeaturedImg } from '../../pages/ChiefOfArmyStaff'

const CreatePressRelease = ({ isPREdit }: { isPREdit: boolean }) => {

    const [editPRModal, setEditPRModal] = useState(false);
    const [eventDate, setEventDate] = useState<Date>();
    const [featuredImg, setFeaturedImg] = useState('');
    const [rawImg, setRawImg] = useState('');

    const formik = useFormik({
        initialValues: {
            image: '',
            date: '',
            title: '',
            description: '',
            files: [] as string[]
        },
        onSubmit: (obj) => {
            console.log(obj);
        }
    })

    useEffect(() => {
        formik.setFieldValue("date", eventDate)
    }, [eventDate])

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

    return (
        <Modal open={editPRModal} openModal={() => setEditPRModal(!editPRModal)} onOpenChange={(value) => setEditPRModal(value)} className="flex items-center gap-3 p-3"
            label="Upload Press Release"
        >
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            <FeaturedImg setFeaturedImg={setFeaturedImg} setRawImg={setRawImg} featuredImg={featuredImg} />
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
                {formik.values.files && <FilesList files={formik.values.files} showDelete={true} />}

                <div className="flex items-start justify-between mt-6">
                    <Button variant="blue" type='submit' className="px-10">
                        <label className="flex items-center justify-center gap-2 w-full h-full cursor-pointer text-white">
                            <div className="bg-white rounded">
                                <ArrowUpToLine className="text-blue" />
                            </div>
                            Upload Files
                            <input type="file" accept="*/" onChange={handleFileChange} className="hidden" />
                        </label>
                    </Button>
                    <Button variant="default" type='submit' className="px-10">
                        {isPREdit ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default CreatePressRelease;