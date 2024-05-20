import { cn } from "../../lib/utils";
import {
    Sheet,
    SheetContent,
    // SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../ui/sheet";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"

import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import useFetch from "../../hooks/useFetch";



const AddEvent = ({children, className}) => {

    const [eventTypes, setEventTypes] = useState([]);

    const { toast } = useToast();

    // get event types
    const { isFetching: isFetchingEventTypes, onFetch: onFetchEventTypes } = useFetch(
        '/events/sa/types',
        (data, status) => {
            if (status === 200) 
                setEventTypes(data.data.event_types);
        },
        (error, status) => { // on error
            const { message, ...err } = error;
            // notify
            toast({
                title: `${message} (${status})`,
                description: err.errors.error_message,
                variant: 'destructive',
            })
        },
        {}, // options
    );


    useEffect(() => {
        onFetchEventTypes();
    }, []);


  return (
      <Sheet>
          <SheetTrigger className={cn(className, 'outline-none')}> { children } </SheetTrigger>
          <SheetContent className="!max-w-full w-full md:w-[1200px]">
              <SheetHeader>
                  <SheetTitle> Create Event </SheetTitle>
                  {/* <SheetDescription></SheetDescription> */}
              </SheetHeader>

              <div className="h-full flex items-center justify-center">
                <div className="max-w-[400px]">
                    <h3 className="text-xl mb-16"> Select Event Type </h3>

                    {
                        eventTypes && 

                        <Select>
                            <label className="block pb-3"> Event Type </label>
                            
                            <SelectTrigger className="w-[300px]">
                                <SelectValue placeholder="Select Here" />
                            </SelectTrigger>
                            <SelectContent>
                                { eventTypes.map(
                                    (e: {name: string, value: string}) => 
                                        <SelectItem value={e.value}> {e.name} </SelectItem> 
                                    ) 
                                }
                            </SelectContent>
                        </Select>
                    }

                </div>
              </div>
          </SheetContent>
      </Sheet>

  )
}

export default AddEvent;