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

const CreateEvent = () => {

    const MAX_STEPS = 2;

	const { toast } = useToast();
	const [eventTypes, setEventTypes] = useState([]);
    const [step, setStep] = useState<number>(1);
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [deps, setDeps] = useState([]);



    const handleEventTypeSelect = (eventType: string) => {
        formikForm.setFieldValue('eventType', eventType)
        setStep(step + 1);
    } 

    // const handleCancel = () => {

    // }

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
            eventType: ''
        },
        onSubmit: handleSubmit,
    })

	// get event types
	const { onFetch: onFetchEventTypes } =
		useFetch(
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
                                        {
                                            true &&
                                            <div className="max-w-full w-full h-full rounded bg-black/30 flex items-center justify-center">
                                                <div className="text-white">
                                                    <ImageUpIcon className='mx-auto scale-125' />
                                                    <div className="mt-2">Featured Image</div>
                                                </div>
                                            </div>
                                        }
                                    </div>

                                    <div className="col-span-2">
                                        <div className="grid grid-cols-2 gap-5 gap-y-10">
                                            <div className="col-span-1">
                                                <Input label='Event Title' placeholder='Title for the event' />
                                            </div>
                                            <div className="col-span-1">
                                                <Input label='Venue' placeholder='Location of the event' />
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
                                                <Textarea label='About Event' placeholder='Event details' />
                                            </div>

                                            <div className="col-span-1">
                                                <label> Select Department </label>

                                                <Select>
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
                                                <Input label='Live link' />
                                            </div>
                                            
                                        </div>
                                    </div>


                                    <div className="col-span-3 bg-gray-100 max-h-full h-[300px]">
                                        
                                    </div>
                                </div>
                                
                            </div>
                        </>
                    }

            </div>

            {/* ----- footer ---- */}
            <div className="flex justify-between">
                <Button variant='ghost'> Cancel </Button>

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

export default CreateEvent;
