import { ChangeEvent, useEffect, useState } from 'react';
import { format } from "date-fns";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { removeBase64 } from "../lib/utils";
import { useToast } from '../components/ui/use-toast';
import useFetch from '../hooks/useFetch';
import { useFormik } from 'formik';
import { Loader2 } from 'lucide-react';
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
import ProfileImage from '../components/ui-custom/ProfileImage';

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
    const [eventDate, setEventDate] = useState<Date | null>();
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [eventType, setEventType] = useState<any>();
    const [event, setEvent] = useState<any>(null);
    const [disableEdit, setDisableEdit] = useState(false);

    const [tenants, setTenants] = useState<ITenants[]>([]);
    const [tenantsId, setEditTenantsId] = useState<ITenants[]>([]);
    const [moderators, setModerators] = useState<{ id: string; image: string; name: string, position: string }[]>([]);
    const [keynoteSpeakers, setKeynoteSpeakers] = useState<{ id: string; image: string; name: string; position: string }[]>([]);


    const [mods, setMods] = useState<{ id: string; image: string; name: string, position: string }[]>([]);
    const [speakers, setSpeakers] = useState<{ id: string; image: string; name: string, position: string }[]>([]);

    const handleSubmit = () => {
        const data = formik.values;
        const body = {
            ...data,
            image: removeBase64(formik.values.image)
        };
        if (isEditEvent) {
            editEvent(body)
            setDisableEdit(true);
        } else {
            createEvent(body);
            setDisableEdit(true);
        }
    }

    const validate = (values: any) => {
        const errors: any = {};
        if (!values.image && !featuredImg) {
            errors.image = 'Image is required';
        }
        if (values.venue < 5) {
            errors.venue = 'Name be more that 5 characters';
        }
        else if (values.title < 5) {
            errors.title = 'Title be more that 5 characters';
        }
        else if (values.description < 5) {
            errors.description = 'Description be more that 5 characters';
        }
        else if (values.slots.date < 5) {
            errors.description = 'Description be more that 5 characters';
        }
        else if (values.slots.end_time < 5) {
            errors.slots.end_time = 'Description be more that 5 characters';
        }
        else if (values.slots.start_time < 5) {
            errors.slots.start_time = 'Description be more that 5 characters';
        }
        else if (values.department < 5) {
            errors.department = 'Description be more that 5 characters';
        }
        else if (values.event_link < 5) {
            errors.event_link = 'Description be more that 5 characters';
        }
        else if (values.moderators.length < 1) {
            errors.moderators = 'Description be more that 5 characters';
        }
        else if (values.keynote_speakers < 5) {
            errors.keynote_speakers = 'Description be more that 5 characters';
        }
        else if (values.adminInstructionsTitle < 1) {
            errors.adminInstructionsTitle = 'Description be more that 5 characters';
        }
        return errors;
    };

    const formik = useFormik({
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
                    date: "",
                    start_time: "",
                    end_time: ""
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
        validate,
        onSubmit: handleSubmit,
    })

    const isDisabled = formik.values.image === "" ||
        formik.values.venue === "" ||
        formik.values.title === "" ||
        formik.values.description === "" ||
        formik.values.slots[0].date === "" ||
        formik.values.slots[0].end_time === "" ||
        formik.values.slots[0].start_time === "" ||
        formik.values.department === "" ||
        formik.values.event_link === "" ||
        formik.values.moderators.length === 0 ||
        formik.values.keynote_speakers.length === 0 ||
        formik.values.adminInstructionsTitle === ""

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
            setDisableEdit(true);
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
                formik.resetForm();
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
                formik.resetForm();
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
            const data = formik.values.slots;
            data[0].date = format(eventDate, 'yyyy-MM-dd');
            formik.setFieldValue('slots', data);
        }
        if (startTime) {
            // set start time
            const data = formik.values.slots;
            data[0].start_time = startTime;
            formik.setFieldValue('slots', data);
        }
        if (endTime) {
            // set end time
            const data = formik.values.slots;
            data[0].end_time = endTime;
            formik.setFieldValue('slots', data);
        }

        // const matchedTenants = matchedItem(formik.values, tenants, "tenant_ids", "tenant_id");
        if (featuredImg) formik.setFieldValue('image', featuredImg);
        if (mods) formik.setFieldValue('moderators', mods.map((m: { id: string }) => m.id));
        if (speakers) formik.setFieldValue('keynote_speakers', speakers.map((s: { id: string }) => s.id));
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
            setDisableEdit(true);
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
            formik.setValues(event)
            setEventDate(event.start_date)
        }
    }, [event])

    const handleEventTypeSelect = (eventType: { name: string; value: string; }) => {
        formik.setFieldValue('type', eventType.value)
        setStep(step + 1);
        setEventType(eventType)
    }

    const handleCancel = onCancel;

    const { reload } = useDashboardContext(); // reload function to refect dashboard data and statistics
    const { pathname } = useLocation();

    const handleNext = () => {
        if (step > MAX_STEPS) return;
        else if (step === MAX_STEPS) handleSubmit(); // submit logic
        else setStep(step + 1);
    }

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
        formik.setFieldValue('tenant_ids', tenants)
    }

    const removeFile = (e: { preventDefault: () => void }, name: string) => {
        e.preventDefault();
        const files = formik.values.files.filter((file) => file.name !== name);
        formik.setFieldValue("files", files)
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

        formik.setFieldValue("files", [...formik.values.files, data])
    }

    return (
        <>
            <div className="flex items-center justify-center" style={{ height: 'calc(100% - 80px)' }}>
                {step === 1 && (
                    <div className="max-w-[400px]">
                        <h3 className="text-xl mb-10">Select Event Type.</h3>

                        {isFetchingEventTypes && <div className='w-[300px] h-20'><Loader2 className='mx-auto animate-spin' /></div>}

                        {!!eventTypes.length && !isFetchingEventTypes && (
                            <div className=" w-[300px] ">
                                <ReactSelect
                                    label="Event Type"
                                    options={eventTypes}
                                    handleSelect={handleEventTypeSelect}
                                    value={eventType}
                                    optionName="name"
                                    optionValue="name"
                                />
                            </div>

                        )}
                    </div>
                )}

                {step === 2 && (
                    isFetchingEvent ? <Loader2 className='animate-spin mx-8' /> :
                        <div className="h-full w-full">
                            <div className="grid grid-cols-3 gap-5 h-full">
                                <div className="col-span-1">
                                    <ProfileImage disabled={disableEdit} setFeaturedImg={setFeaturedImg} featuredImg={featuredImg} error={formik.errors.image} height="h-full" />
                                </div>

                                <div className="col-span-2">
                                    <div className="grid grid-cols-2 gap-5 gap-y-10">
                                        <div className="col-span-1">
                                            <Input
                                                label='Event Title'
                                                name='title'
                                                value={formik.values.title}
                                                onChange={formik.handleChange}
                                                placeholder='Title for the event'
                                                error={formik.errors.title}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Input
                                                label='Venue'
                                                name='venue'
                                                value={formik.values.venue}
                                                onChange={formik.handleChange}
                                                placeholder='Location of the event'
                                                error={formik.errors.venue}
                                            />
                                        </div>

                                        <div className="col-span-1">
                                            <label>Select Event Date</label>
                                            <DatePicker
                                                minDate={new Date()}
                                                selected={eventDate}
                                                onChange={(date) => {
                                                    setEventDate(date);
                                                }}
                                                className="w-full block outline-none bg-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                            // disabled={disableEdit}
                                            // error={formik.errors.slots.date}
                                            />
                                        </div>

                                        <div className="col-span-1">
                                            <TimeInput
                                                label='Start Time'
                                                name='startTime'
                                                onChange={(e) => setStartTime(e.target.value)}
                                                value={formik.values.slots[0].start_time}
                                            // error={formik.errors.slots[0].start_time}
                                            />
                                        </div>

                                        <div className="col-span-1">
                                            <TimeInput
                                                label='End Time'
                                                name='endTime'
                                                onChange={(e) => setEndTime(e.target.value)}
                                                value={formik.values.slots[0].end_time}
                                            // error={formik.errors.slots[0].end_time}
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <Textarea
                                                label='About Event'
                                                name='description'
                                                onChange={formik.handleChange}
                                                value={formik.values.description}
                                                placeholder='Event details'
                                                error={formik.errors.description}
                                            />
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
                                            // error={formik.errors}
                                            />
                                        </div>

                                        <div className="col-span-1">
                                            <Input
                                                type='url'
                                                label='Live link'
                                                value={formik.values.event_link}
                                                placeholder='eg: meet.google.com/abc-def-gh'
                                                name='event_link'
                                                onChange={formik.handleChange}
                                                error={formik.errors.event_link}
                                            />
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
                                            <AddUser endpoint='/moderators/sa/?items_per_page=20' action='Moderator' setUsers={setMods} users={mods} />
                                        </TabsContent>

                                        <TabsContent className='p-5' value="k">
                                            <AddUser endpoint='/keynote-speakers/sa/?items_per_page=20' action='Speaker' setUsers={setSpeakers} users={speakers} />
                                        </TabsContent>

                                        <TabsContent className='p-5' value="f">
                                            <div className="flex gap-24">
                                                <div className="">
                                                    <Input
                                                        label='Admin instructions title'
                                                        placeholder='title here'
                                                        name='adminInstructionsTitle'
                                                        value={formik.values.adminInstructionsTitle}
                                                        onChange={formik.handleChange}
                                                        className='max-w-[350px] mb-10'
                                                        error={formik.errors.adminInstructionsTitle}
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
                                                    {formik.values.files && (
                                                        <div className="flex flex-col gap-4 my-6">
                                                            {formik.values.files.map((file) => (
                                                                <FileItem key={file} showDelete={true} onClick={(e: { preventDefault: () => void; }) => removeFile(e, file.name)} file={`${file.name} - ${file.document_type}`} />
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
                                            <Button variant={isDisabled ? 'disabled' : 'default'} onClick={handleNext}>
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

export default CreateEvent;
