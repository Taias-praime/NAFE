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
import { ImageUpIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import AddUser from './AddUser';


const CreateEvent = ({ onCancel }: { onCancel: () => void }) => {

    const MAX_STEPS = 2;

	const { toast } = useToast();
    const [featuredImg, setFeaturedImg] = useState('');
	const [eventTypes, setEventTypes] = useState([]);
    const [step, setStep] = useState<number>(1);
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [deps, setDeps] = useState([]);



    const handleEventTypeSelect = (eventType: string) => {
        formikForm.setFieldValue('eventType', eventType)
        setStep(step + 1);
    } 

    const handleCancel = () => {
        onCancel();
    }

    const handleNext = () => {
        if ( step > MAX_STEPS ) return;
        else if ( step === MAX_STEPS ) {
            // submit logic
        }
        else setStep(step + 1);
    }

    const handleSubmit = () => {
        // something huge
    }

    const formikForm = useFormik({
        initialValues: {
            eventType: '',
            eventTitle: '',
            venue: '',
            startDate: '',
            endDate: '',
            about: '',
            department: '',
            liveLink: '',
        },
        onSubmit: handleSubmit,
    })

	// get event types
	const { onFetch: onFetchEventTypes } = useFetch(
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

    useEffect(() => {
        if (endDate) formikForm.setFieldValue('endDate', endDate);
        if (startDate) formikForm.setFieldValue('startDate', startDate);
        if (featuredImg) formikForm.setFieldValue('featuredImg', featuredImg);
    }, [startDate, endDate, featuredImg])

	useEffect(() => {
        getDeps();
		onFetchEventTypes();
	}, []);

	return (
        <>
            <div className="flex items-center justify-center" style={{
                height: 'calc(100% - 100px)'
            }}>
                {
                    (step == 1) && <>                     
                        <div className="max-w-[400px]">
                            <h3 className="text-xl mb-16"> Select Event Type </h3>

                            {eventTypes && (
                                <Select onValueChange={handleEventTypeSelect}>
                                    <label className="block pb-3"> Event Type </label>

                                    <SelectTrigger className="w-[300px]">
                                        <SelectValue placeholder="Select Here" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {eventTypes.map(
                                            (e: { name: string; value: string }) => (
                                                <SelectItem value={e.value}>
                                                    {e.name}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </>
                }

            
                {
                    (step == 2) && <>
                        <div className="h-full w-full">
                            <div className="grid grid-cols-3 gap-5 h-full">
                                <div className="col-span-1">
                                    <FeaturedImg setFeaturedImg={setFeaturedImg} />
                                </div>

                                <div className="col-span-2">
                                    <div className="grid grid-cols-2 gap-5 gap-y-10">
                                        <div className="col-span-1">
                                            <Input label='Event Title' name='eventTitle' onChange={formikForm.handleChange} placeholder='Title for the event' />
                                        </div>
                                        <div className="col-span-1">
                                            <Input label='Venue' name='venue' onChange={formikForm.handleChange} placeholder='Location of the event' />
                                        </div>

                                        <div className="col-span-1">
                                            <label className='mb-2'> Select Start Date </label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full rounded-none border-0 border-b border-black justify-start text-left font-normal",
                                                            !startDate && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {startDate ? format(startDate, "dd/MM/yyyy") : <span>dd/mm/yyyy</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={startDate}
                                                        onSelect={setStartDate}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <div className="col-span-1">
                                            <label className='mb-2'> Select End Date </label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full rounded-none border-0 border-b border-black justify-start text-left font-normal",
                                                            !endDate && "text-black/50"
                                                        )}
                                                    >
                                                        {endDate ? format(endDate, "dd/MM/yyyy") : <span>dd/mm/yyyy</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={endDate}
                                                        onSelect={setEndDate}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <div className="col-span-2">
                                            <Textarea label='About Event' name='aboutEvent' onChange={formikForm.handleChange} placeholder='Event details' />
                                        </div>

                                        <div className="col-span-1">
                                            <label> Select Department </label>

                                            <Select name='department' onValueChange={(selected: string) => formikForm.setFieldValue('department', selected)}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Department" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {
                                                        deps.map(
                                                            (d: {
                                                                tenant_id: string;
                                                                code: string;
                                                                name: string;
                                                            }) => <SelectItem value={d.tenant_id}> {d.name} ({d.code}) </SelectItem>
                                                        )
                                                    }
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="col-span-1">
                                            <Input type='url' label='Live link' placeholder='eg: meet.google.com/abc-def-gh' name='liveLink' onChange={formikForm.handleChange} />
                                        </div>
                                        
                                    </div>
                                </div>


                                {/* Moderator, Keynote Speaker, Upload Files */}

                                <div className="col-span-3 max-h-full h-[300px] bg-slate-50 rounded-md">
                                    <Tabs defaultValue="m" className="">
                                        <TabsList>
                                            <TabsTrigger value="m">Moderators</TabsTrigger>
                                            <TabsTrigger value="k">Keynote Speakers</TabsTrigger>
                                            <TabsTrigger value="f">Upload Files</TabsTrigger>
                                        </TabsList>

                                        <TabsContent className='p-5 overflow-x-auto' value="m">
                                            <AddUser endpoint='/moderators/sa/' action='Add Moderator' />
                                        </TabsContent>

                                        <TabsContent className='p-5' value="k">
                                            <AddUser endpoint='/keynote-speakers/sa/' action='Add Speaker' />
                                        </TabsContent>

                                        <TabsContent className='p-5' value="f">
                                            <Input label='Upload admin instructions' placeholder='title here' className='max-w-[350px]' />
                                        </TabsContent>
                                    </Tabs>

                                </div>
                            </div>
                            
                        </div>
                    </>
                }

            </div>

            {/* ----- footer ---- */}
            <div className="flex justify-between">
                <Button variant='ghost' onClick={handleCancel}> Cancel </Button>

                {
                    (step === MAX_STEPS) &&
                    <Button onClick={handleNext}> 
                        Create Event
                    </Button>
                }
            </div>
            {/* ----- footer ---- */}

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
