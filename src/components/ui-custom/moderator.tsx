import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import Modal from './modal'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import ProfileImage from './ProfileImage'
import { removeBase64 } from '../../lib/utils'
import useFetch from '../../hooks/useFetch'
import { toast } from '../ui/use-toast'
import { Loader2 } from 'lucide-react'
import ReactSelect from '../ui/multi-select'
import { IRanks } from '../../models/interfaces'

interface ModeratorProps {
    setModalOpen: (value: boolean) => void;
    setReload: (value: boolean) => void;
    open: boolean;
    label: string;
    title: string;
}

const Moderator = ({ setModalOpen, setReload, open, label, title }: ModeratorProps) => {

    const [featuredImg, setFeaturedImg] = useState('');
    const [ranks, setRanks] = useState<IRanks[]>([]);
    const [rank, setRank] = useState<IRanks>();

    const formik = useFormik({
        initialValues: {
            image: '',
            rank: '',
            name: '',
            description: '',
        },
        onSubmit: (obj) => {
            const data = {
                ...obj,
                image: removeBase64(featuredImg),
            }
            addModerator(data)
        }
    })

    // add event 
    const { onPost: addModerator, isFetching: isCreateLoading } = useFetch(
        '/moderators/sa/add',
        (data, status) => {
            if (status === 200) {

                toast({
                    title: 'Success!',
                    description: data.message,
                    variant: 'default',
                });

                formik.resetForm();
                setReload(true)
                setModalOpen(false);
                setFeaturedImg('');

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

    // fetch Rank
    const { onFetch: fetchRank } = useFetch(
        '/moderators/sa/ranks',
        (data, status) => {
            if (status === 200) {
                setRanks(data.data.ranks)
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
        fetchRank();
    }, [])

    const handleRank = (rank: IRanks) => {
        formik.setFieldValue('rank', rank.value);
        setRank(rank);
    }

    const prModal = (value: boolean) => {
        setModalOpen(value);
        setFeaturedImg('');
        formik.resetForm();
    }

    const deleteImage = () => {
        setFeaturedImg('')
    }

    return (
        <Modal open={open} onOpenChange={(value) => prModal(value)} className="flex items-center gap-3 px-2 border bg-gray-300 text-sm text-gray-700 rounded"
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
                <div className="w-full">
                    <ReactSelect
                        label="Select Rank"
                        options={ranks}
                        handleSelect={handleRank}
                        value={rank}
                        optionName="name"
                        optionValue="value"
                    />
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

                <div className="flex justify-end mt-6">
                    <Button variant="default" type='submit' className="px-10">
                        {
                            isCreateLoading ? <Loader2 className='animate-spin' /> : 'Create'
                        }
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default Moderator;