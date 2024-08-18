import { ChangeEvent, useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';
import { cn, removeBase64 } from "../lib/utils";
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
import TimeInput from '../components/ui-custom/timeInput';
import { useDashboardContext } from '../contexts/dashboard.context';
import { useLocation } from 'react-router-dom';
import { IEventSpeaker, ITenants } from '../models/interfaces';
import AddUser from './AddUser';
import ReactSelect from '../components/ui/multi-select';
import { FileItem } from '../components/ui-custom/files';

interface CreateEventProps {
    onCancel: () => void;
    setIsOpen: (value: boolean) => void;
    setReload: (value: boolean) => void;
    currentStep: number;
    isEditEvent: boolean;
    eventId: string | null;
}

type File = {
    name: string;
    url: string;
    document_type: string;
    id: string;
}

const CreateEvent = ({ onCancel, setIsOpen, setReload, currentStep, isEditEvent, eventId }: CreateEventProps) => {

    const MAX_STEPS = 2;

    const { toast } = useToast();
    const [featuredImg, setFeaturedImg] = useState('');
    const [eventTypes, setEventTypes] = useState([]);
    const [step, setStep] = useState<number>(currentStep);
    const [eventDate, setEventDate] = useState<Date>();
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');

    const [event, setEvent] = useState<any>(null);

    const [tenants, setTenants] = useState<ITenants[]>([]);
    const [tenantsId, setEditTenantsId] = useState<ITenants[]>([]);
    const [moderators, setModerators] = useState<{ id: string; image: string; name: string, position: string }[]>([]);
    const [keynoteSpeakers, setKeynoteSpeakers] = useState<{ id: string; image: string; name: string; position: string }[]>([]);


    const [mods, setMods] = useState<{ id: string; image: string; name: string, position: string }[]>([]);
    const [speakers, setSpeakers] = useState<{ id: string; image: string; name: string, position: string }[]>([]);

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
        const data = formikForm.values;
        const body = {
            ...data,
            image: removeBase64(formikForm.values.image)
        };
        if (isEditEvent) {
            editEvent(body)
        } else {
            createEvent(body);
        }
    }

    const formikForm = useFormik({
        initialValues: {
            type: '',
            image: '',
            title: '',
            venue: '',
            access_code: '',
            theme_description: "",
            theme_title: "",
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
            files: [] as File[] | [],
            moderators: [] as IEventSpeaker[],
            keynote_speakers: [] as IEventSpeaker[],
            adminInstructionsTitle: '',
            adminInstructionsUrl: '',
            programmeUrl: '',
            participants: [],
        },
        onSubmit: handleSubmit,
    })

    // get event types
    const { onFetch: onFetchEventTypes, isFetching: isFetchingEventTypes } = useFetch(
        '/events/sa/types',
        (data, status) => {
            if (status === 200) setEventTypes(data.data.event_types);
        },
        (error) => {
            // on error
            const { message } = error;
            // notify
            toast({
                title: `${message}`,
                variant: "destructive",
            });
        },
        {} // options
    );

    // get single event
    const { onFetch: getEvent, isFetching: isFetchingEvent } = useFetch(
        `/events/sa/${eventId}/details`,
        (data) => {
            setEvent(data.data)

        },
        () => { },
    );

    // get tenants
    const { onFetch: getTenants } = useFetch(
        '/tenants/sa/',
        (data) => {
            setTenants(data.data.results)
        },
        (error) => {
            const { message } = error;
            // notify
            toast({
                title: `${message}`,
                variant: "destructive",
            });
        },
    );

    // get Moderators
    const { onFetch: getMorderators } = useFetch(
        '/moderators/sa/',
        (data) => {
            setModerators(data.data.results)
        },
        (error) => {
            const { message } = error;
            // notify
            toast({
                title: `${message}`,
                variant: "destructive",
            });
        },
    );

    // get Keynote speakers
    const { onFetch: getSpeakers } = useFetch(
        '/keynote-speakers/sa/',
        (data) => {
            setKeynoteSpeakers(data.data.results)
        },
        (error) => {
            const { message } = error;
            toast({
                title: `${message}`,
                variant: "destructive",
            });
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
                setIsOpen(false);
                setReload(true);
                formikForm.resetForm();
                setFeaturedImg('');
                setEventDate(undefined);
                setStartTime('');
                setEndTime('');
                setMods([]);
                setSpeakers([]);
                setEditTenantsId([]);

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

    // edit event 
    const { onPut: editEvent, isFetching: isUpdatingEvent } = useFetch(
        `/events/sa/${eventId}/edit`,
        (data, status) => {
            if (status === 200) {
                const notification = toast({
                    title: 'Success!',
                    description: data.message,
                    variant: 'default',
                });

                // Reset form and states
                setReload(true);
                setIsOpen(false);
                formikForm.resetForm();
                setFeaturedImg('');
                setEventDate(undefined);
                setStartTime('');
                setEndTime('');
                setMods([]);
                setSpeakers([]);
                setEditTenantsId([]);

                // refetch events data for dashboard
                reload();

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

        // const matchedTenants = matchedItem(formikForm.values, tenants, "tenant_ids", "tenant_id");
        if (featuredImg) formikForm.setFieldValue('image', featuredImg);
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
        getTenants();
        onFetchEventTypes();
        getMorderators();
        getSpeakers();
        if (eventId) {
            getEvent();
        }
    }, []);

    const matchedItem = (event: any, moderators: any, value: string, Id: string) => {
        const matched = []

        if (event[value]) {
            for (const id of event[value]) {
                for (const mod of moderators) {
                    if (mod[Id] === id) {
                        matched.push(mod);
                        break;
                    }
                }
            }
        }

        return matched;
    }

    useEffect(() => {
        if (event) {
            const matchedTenants = matchedItem(event, tenants, "tenant_ids", "tenant_id");
            const matchedModerators = matchedItem(event, moderators, "moderators", "id");
            const matchedSpeakers = matchedItem(event, keynoteSpeakers, "keynote_speakers", "id");

            setMods(matchedModerators)
            setSpeakers(matchedSpeakers)
            setEditTenantsId(matchedTenants);
            formikForm.setValues(event)
            setEventDate(event.start_date)
        }
    }, [event])

    const getIdsFromTenants = (tenant_ids: any) => {
        const tenants = []
        for (const department of tenant_ids) {
            tenants.push(department.tenant_id);
        }
        return tenants;
    }

    const handleSelect = (tenant_ids: ITenants[]) => {
        setEditTenantsId(tenant_ids)
        const tenants = getIdsFromTenants(tenant_ids)
        formikForm.setFieldValue('tenant_ids', tenants)
    }

    const removeFile = (e: { preventDefault: () => void }, name: string) => {
        e.preventDefault();
        const files = formikForm.values.files.filter((file) => file.name !== name);
        formikForm.setFieldValue("files", files)
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>, document_type: string) => {
        const value = event.target.value;
        const file = event.target.files?.[0];

        // Extract filename without path
        const cleanFilename = value.replace(/.*\\/g, ''); // remove path on Windows systems (backslashes)
        const name = cleanFilename.replace(/^.*\/|\?/g, ''); // For other systems (forward slashes) or query strings

        // Extract file extension (type)
        const data = {
            name,
            url: "",
            document_type
        }

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                data.url = removeBase64(reader.result as string)
            };
            reader.readAsDataURL(file);
        }

        formikForm.setFieldValue("files", [...formikForm.values.files, data])
    }

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
                    isFetchingEvent ? <Loader2 className='animate-spin mx-8' /> :
                        <div className="h-full w-full">
                            <div className="grid grid-cols-3 gap-5 h-full">
                                <div className="col-span-1">
                                    <FeaturedImg setFeaturedImg={setFeaturedImg} />
                                </div>

                                <div className="col-span-2">
                                    <div className="grid grid-cols-2 gap-5 gap-y-10">
                                        <div className="col-span-1">
                                            <Input label='Event Title' name='title' value={formikForm.values.title} onChange={formikForm.handleChange} placeholder='Title for the event' />
                                        </div>
                                        <div className="col-span-1">
                                            <Input
                                                label='Venue'
                                                name='venue'
                                                value={formikForm.values.venue}
                                                onChange={formikForm.handleChange}
                                                placeholder='Location of the event' />
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
                                            <ReactSelect
                                                label="Select Department"
                                                options={tenants}
                                                handleSelect={handleSelect}
                                                value={tenantsId}
                                                isMulti={true}
                                                optionName="name"
                                                optionValue="tenant_id"
                                            />
                                        </div>

                                        <div className="col-span-1">
                                            <Input
                                                type='url'
                                                label='Live link'
                                                value={formikForm.values.event_link}
                                                placeholder='eg: meet.google.com/abc-def-gh'
                                                name='event_link'
                                                onChange={formikForm.handleChange} />
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
                                            <AddUser endpoint='/moderators/sa/' action='Moderator' setUsers={setMods} users={mods} />
                                        </TabsContent>

                                        <TabsContent className='p-5' value="k">
                                            <AddUser endpoint='/keynote-speakers/sa/' action='Speaker' setUsers={setSpeakers} users={speakers} />
                                        </TabsContent>

                                        <TabsContent className='p-5' value="f">
                                            <div className="flex gap-24">
                                                <div className="">
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
                                                        label='Upload admin instructions'
                                                        accept="application/pdf"
                                                        onChange={(e) => handleFileChange(e, "instruction")}
                                                        className='max-w-[350px] mb-10 rounded border border-gray-300 bg-gray-100 px-4'
                                                    />

                                                    <Input
                                                        type='file'
                                                        label='Upload Programme'
                                                        accept="application/pdf"
                                                        onChange={(e) => handleFileChange(e, "program")}
                                                        className='max-w-[350px] rounded border border-gray-300 bg-gray-100 px-4'
                                                    />
                                                </div>
                                                <div className="max-w-[400px]">
                                                    {formikForm.values.files && (
                                                        <div className="flex flex-col gap-4 my-6">
                                                            {formikForm.values.files.map((file) => (
                                                                <FileItem showDelete={true} onClick={(e: { preventDefault: () => void; }) => removeFile(e, file.name)} file={`${file.name} - ${file.document_type}`} />
                                                            ))}
                                                        </div>
                                                    )}</div>
                                            </div>
                                        </TabsContent>
                                    </Tabs>

                                    {/* ----- footer ---- */}
                                    <div className="flex justify-between py-5">
                                        <Button variant='ghost' onClick={handleCancel}>Cancel</Button>

                                        {step === MAX_STEPS && (
                                            <Button onClick={handleNext}>
                                                {isCreatingEvent || isUpdatingEvent ? <Loader2 className='animate-spin mx-8' /> : (isEditEvent ? 'Update Event' : 'Create Event')}
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
                const image = reader.result as string;
                setPreview(image);
                setFeaturedImg(image);
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
