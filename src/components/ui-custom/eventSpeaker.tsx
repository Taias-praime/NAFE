import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import Modal from './modal'
import { useState } from 'react'
import { useFormik } from 'formik'
import { IEventSpeaker } from '../../models/interfaces'
import ProfileImage from './ProfileImage'

interface AddKeynoteSpeakerProps {
    openModal: () => void;
    setUpdate: (speaker: IEventSpeaker) => void;
    setModalOpen: (value: boolean) => void;
    open: boolean;
    label: string;
    title: string;
}

const EventSpeaker = ({ openModal, setUpdate, setModalOpen, open, label, title}: AddKeynoteSpeakerProps) => {

    const [featuredImg, setFeaturedImg] = useState('');

    const formik = useFormik({
        initialValues: {
            image: '',
            position: '',
            name: '',
            description: '',
        },
        onSubmit: (obj) => {
            const data = {
                ...obj,
                image: featuredImg,
                id: name
            }
            setUpdate(data)

            formik.resetForm();
            setModalOpen(false);
        }
    })

    const prModal = (value: boolean) => {
        setModalOpen(value);
        setFeaturedImg('');
        formik.resetForm();
    }

    const deleteImage = () => {
        setFeaturedImg('')
    }

    return (
        <Modal open={open} openModal={openModal} onOpenChange={(value) => prModal(value)} className="flex items-center gap-3 p-3 border mb-4 bg-gray-300 text-gray-700 rounded py-2"
            label={title}
        >
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
                <ProfileImage deleteImage={deleteImage} setFeaturedImg={setFeaturedImg} featuredImg={featuredImg} />
                <Input
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    name="name"
                    placeholder="name here"
                    className=""
                    label={label}
                />

                <Input
                    value={formik.values.position}
                    onChange={formik.handleChange}
                    name="position"
                    placeholder="rank here"
                    className=""
                    label="Position"
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

                <div className="flex justify-end mt-6">
                    <Button variant="default" type='submit' className="px-10">
                        {/* <Loader2 className='animate-spin' /> */}
                        Create
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default EventSpeaker;