import { useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';
import { cn } from "../lib/utils";
import { format } from "date-fns";
import { Calendar } from "../components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../components/ui/popover";

import { useToast } from '../components/ui/use-toast';
import useFetch from '../hooks/useFetch';
import { useFormik } from 'formik';
import { ImageUpIcon, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import AddUser from './AddUser';
import TimeInput from '../components/ui-custom/timeInput';
import { useDashboardContext } from '../contexts/dashboard.context';
import { useLocation } from 'react-router-dom';

const CreateEvent = ({ onCancel }: { onCancel: () => void }) => {

    const MAX_STEPS = 2;
    const DEFAULT_IMG = 'https://cdn.vectorstock.com/i/500p/07/19/planning-concept-entrepreneurship-and-calendar-vector-33900719.jpg';

    const { toast } = useToast();
    const [featuredImg, setFeaturedImg] = useState('');
    const [eventTypes, setEventTypes] = useState([]);
    const [step, setStep] = useState<number>(1);
    const [eventDate, setEventDate] = useState<Date>();
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');

    const [deps, setDeps] = useState([]);
    const [mods, setMods] = useState([]);
    const [speakers, setSpeakers] = useState([]);

    const handleEventTypeSelect = (eventType: string) => {
        formikForm.setFieldValue('type', eventType)
        setStep(step + 1);
    }

    const handleCancel = onCancel;

    const { reload } = useDashboardContext(); // reload function to refect dashboard data and statistics
    const { pathname } = useLocation();

    const handleNext = () => {
        if (step > MAX_STEPS) return;
        else if (step === MAX_STEPS) handleSubmit(); // submit logic
        else setStep(step + 1);
    }

    const handleSubmit = () => {
        const { department, ...data } = formikForm.values;
        const body = {
            ...data,
            tenants_ids: [department],
            image: formikForm.values.image || DEFAULT_IMG,
        };
        createEvent(body);
    }

    const formikForm = useFormik({
        initialValues: {
            type: '',
            image: '',
            title: '',
            venue: '',
            slots: [
                {
                    date: '',
                    start_time: '00:00:00',
                    end_time: '00:00:00'
                }
            ],
            description: '',
            department: '',
            event_link: '',
            moderators: [],
            keynote_speakers: [],
            adminInstructionsTitle: '',
            adminInstructionsUrl: '',
            programmeUrl: '',
        },
        onSubmit: handleSubmit,
    })

    // get event types
    const { onFetch: onFetchEventTypes, isFetching: isFetchingEventTypes } = useFetch(
        '/events/sa/types',
        (data, status) => {
            if (status === 200) setEventTypes(data.data.event_types);
        },
        (error, status) => {
            // on error
            const { message, ...err } = error;
            // notify
            toast({
                title: `${message} (${status})`,
                description: err.errors.error_message,
                variant: 'destructive',
            });
        },
        {} // options
    );

    const { onFetch: getDeps } = useFetch(
        '/tenants/sa/',
        (data) => {
            setDeps(data.data.results)
        },
        (error, status) => {
            const { message, ...err } = error;
            // notify
            toast({
                title: `${message} (${status})`,
                description: err.errors.error_message,
                variant: 'destructive',
            })
        },
    );

    // add event 
    const { onPost: createEvent, isFetching: isCreatingEvent } = useFetch(
        '/events/sa/add',
        (data, status) => {
            if (status === 200) {
                const notification = toast({
                    title: 'Success!',
                    description: data.message,
                    variant: 'default',
                });

                // Reset form and states
                formikForm.resetForm();
                setFeaturedImg('');
                setEventDate(undefined);
                setStartTime('');
                setEndTime('');
                setMods([]);
                setSpeakers([]);

                // refetch events data for dashboard
                if (pathname === '/dashboard') reload();

                // self delete notification after 5 seconds
                setTimeout(() => notification.dismiss(), 5_000)
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

    // File upload
    const { onPost: uploadFile } = useFetch(
        '/files/upload',
        (data, ) => {
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
        if (eventDate) {
            // set date
            const data = formikForm.values.slots;
            data[0].date = format(eventDate, 'yyyy-MM-dd');
            formikForm.setFieldValue('slots', data);
        }
        if (startTime) {
            // set start time
            const data = formikForm.values.slots;
            data[0].start_time = startTime;
            formikForm.setFieldValue('slots', data);
        }
        if (endTime) {
            // set end time
            const data = formikForm.values.slots;
            data[0].end_time = endTime;
            formikForm.setFieldValue('slots', data);
        }
        if (featuredImg) formikForm.setFieldValue('image', featuredImg.split('data:image/jpeg;')[1]);
        if (mods) formikForm.setFieldValue('moderators', mods.map((m: { id: string }) => m.id));
        if (speakers) formikForm.setFieldValue('keynote_speakers', speakers.map((s: { id: string }) => s.id));
    }, [
        startTime,
        endTime,
        eventDate,
        featuredImg,
        mods.length,
        speakers.length,
        featuredImg
    ]);

    useEffect(() => {
        getDeps();
        onFetchEventTypes();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0];

        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            await uploadFile(formData).then((res: any) => {
                console.log("AFTER UPLOAD", res);
                console.log("FIELD VAL", field);
                // if (res === 200) {
                //     formikForm.setFieldValue(field, data.url);
                // }
            });
        }
    };

    return (
        <>
            <div className="flex items-center justify-center" style={{ height: 'calc(100% - 80px)' }}>
                {step === 1 && (
                    <div className="max-w-[400px]">
                        <h3 className="text-xl mb-16">Select Event Type.</h3>

                        {isFetchingEventTypes && <div className='w-[300px] h-20'><Loader2 className='mx-auto animate-spin' /></div>}

                        {!!eventTypes.length && !isFetchingEventTypes && (
                            <Select onValueChange={handleEventTypeSelect}>
                                <label className="block pb-3">Event Type</label>

                                <SelectTrigger className="w-[300px]">
                                    <SelectValue placeholder="Select Here" />
                                </SelectTrigger>
                                <SelectContent>
                                    {eventTypes.map(
                                        (e: { name: string; value: string }) => (
                                            <SelectItem key={e.value} value={e.value}>
                                                {e.name}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="h-full w-full">
                        <div className="grid grid-cols-3 gap-5 h-full">
                            <div className="col-span-1">
                                <FeaturedImg setFeaturedImg={setFeaturedImg} />
                            </div>

                            <div className="col-span-2">
                                <div className="grid grid-cols-2 gap-5 gap-y-10">
                                    <div className="col-span-1">
                                        <Input label='Event Title' name='title' onChange={formikForm.handleChange} placeholder='Title for the event' />
                                    </div>
                                    <div className="col-span-1">
                                        <Input label='Venue' name='venue' onChange={formikForm.handleChange} placeholder='Location of the event' />
                                    </div>

                                    <div className="col-span-1">
                                        <label>Select Event Date</label>
                                        <div className='mt-2'>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full rounded-none border-0 border-b border-black justify-start text-left font-normal",
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
                                    </div>

                                    <div className="col-span-1">
                                        <TimeInput
                                            label='Start Time'
                                            name='startTime'
                                            onChange={(e) => setStartTime(e.target.value)}
                                            value={formikForm.values.slots[0].start_time}
                                        />
                                    </div>

                                    <div className="col-span-1">
                                        <TimeInput
                                            label='End Time'
                                            name='endTime'
                                            onChange={(e) => setEndTime(e.target.value)}
                                            value={formikForm.values.slots[0].end_time}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <Textarea label='About Event' name='description' onChange={formikForm.handleChange} value={formikForm.values.description} placeholder='Event details' />
                                    </div>

                                    <div className="col-span-1">
                                        <label>Select Department</label>

                                        <Select name='department' onValueChange={(selected: string) => formikForm.setFieldValue('department', selected)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {deps.map(
                                                    (d: { tenant_id: string; code: string; name: string }) => (
                                                        <SelectItem key={d.tenant_id} value={d.tenant_id}>
                                                            {d.name} ({d.code})
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="col-span-1">
                                        <Input type='url' label='Live link' placeholder='eg: meet.google.com/abc-def-gh' name='event_link' onChange={formikForm.handleChange} />
                                    </div>

                                </div>
                            </div>

                            {/* Moderator, Keynote Speaker, Upload Files */}

                            <div className="col-span-3 max-h-full h-[300px] mt-5">
                                <Tabs defaultValue="m" className="bg-slate-50 rounded-md pb-5">
                                    <TabsList>
                                        <TabsTrigger value="m">Moderators</TabsTrigger>
                                        <TabsTrigger value="k">Keynote Speakers</TabsTrigger>
                                        <TabsTrigger value="f">Upload Files</TabsTrigger>
                                    </TabsList>

                                    <TabsContent className='p-5 overflow-x-auto' value="m">
                                        <AddUser endpoint='/moderators/sa/' action='Add Moderator' setUsers={setMods} users={mods} />
                                    </TabsContent>

                                    <TabsContent className='p-5' value="k">
                                        <AddUser endpoint='/keynote-speakers/sa/' action='Add Speaker' setUsers={setSpeakers} users={speakers} />
                                    </TabsContent>

                                    <TabsContent className='p-5' value="f">
                                        <Input
                                            label='Admin instructions title'
                                            placeholder='title here'
                                            name='adminInstructionsTitle'
                                            value={formikForm.values.adminInstructionsTitle}
                                            onChange={formikForm.handleChange}
                                            className='max-w-[350px] mb-10'
                                        />

                                        <Input
                                            type='file'
                                            // disabled
                                            label='Upload admin instructions'
                                            onChange={(e) => handleFileUpload(e, 'adminInstructionsUrl')}
                                            className='max-w-[350px] mb-10 rounded border border-gray-300 bg-gray-100 px-4'
                                        />

                                        <Input
                                            type='file'
                                            // disabled
                                            label='Upload Programme'
                                            onChange={(e) => handleFileUpload(e, 'programmeUrl')}
                                            className='max-w-[350px] rounded border border-gray-300 bg-gray-100 px-4'
                                        />

                                    </TabsContent>
                                </Tabs>

                                {/* ----- footer ---- */}
                                <div className="flex justify-between py-5">
                                    <Button variant='ghost' onClick={handleCancel}>Cancel</Button>

                                    {step === MAX_STEPS && (
                                        <Button onClick={handleNext}>
                                            {isCreatingEvent ? <Loader2 className='animate-spin mx-8' /> : 'Create Event'}
                                        </Button>
                                    )}
                                </div>
                                {/* ----- footer ---- */}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

const FeaturedImg = ({ setFeaturedImg }: { setFeaturedImg: (img: string) => void }) => {

    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                setFeaturedImg(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUnset = () => {
        setFeaturedImg('');
        setPreview(null);
        const fileInput = document.getElementById('featImg') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    }

    return (
        <div className="max-w-full w-full h-full rounded border flex items-center justify-center bg-black/30">
            {preview ? (
                <div
                    onClick={handleUnset}
                    style={{ backgroundImage: `url(${preview})` }}
                    className="max-w-full w-full h-full rounded border flex items-center justify-center bg-cover bg-center"
                />
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-white">
                    <ImageUpIcon className='mx-auto scale-125' />
                    <div className="mt-2">Featured Image</div>
                    <input id="featImg" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
            )}
        </div>
    );
};

export default CreateEvent;
