import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { CalendarOff, Loader2 } from "lucide-react";
import useFetch from "../../hooks/useFetch";

const UpcomingEvents = () => {

    const [events, setEvents] = useState([]);


    const { onFetch: getEvents, isFetching: isLoadingEvents } = useFetch(
        '/events/sa/upcoming',
        (data) => {
            setEvents(data.data.results);
        },
        () => { },
    );

    useEffect(() => {
        getEvents();
    }, [])

	return (
        <div className="bg-background/70 h-full w-full">
			<div className="bg-foreground text-background p-5">
				<h5 className="text-lg"> Upcoming Events </h5>
			</div>

			<ul className="overflow-auto h-full pb-20">
                {
                    isLoadingEvents ? 
                        <div className="flex items-center justify-center h-full w-full">
                            <Loader2 className="animate-spin" /> 
                        </div>
                        
                        : 

                        events.length ?
                        events.map((e, k: number) => (
                            <Event key={k} event={e} />
                        )) :
                        <NoEvents noEventsLabel="No upcoming  events" />
                }
			</ul>
		</div>
	);
};

export const Event = ({event}: {event: any}) => {

    const rand = Math.random();

    return (
        <li className="flex items-center justify-start gap-3 p-5 text-foreground bg-background/70">
            <Avatar className="w-20 h-20">
                <AvatarImage src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${rand}`} />
                <AvatarFallback className="bg-background">
                    <Loader2 className="animate-spin" />
                </AvatarFallback>
            </Avatar>

            <div className="overflow-hidden">
                <h5 className="text-md m-0 text-ellipsis line-clamp-2">
                    {event.description || `[check description attribute]`}
                </h5>
                <small className="opacity-50 text-xs">
                    {event.location || '[check location attribute]'}
                </small>
                <p className="text-sm mt-2"> {event.date || `[check date attribute]`} </p>
            </div>
        </li>
    )
}


export const NoEvents = ({noEventsLabel} : {noEventsLabel: string}) => {
    return (
        <div className="flex justify-center items-center h-full">
            <div className="text-center">
                <CalendarOff className="mb-4 mx-auto" />
                <b> {noEventsLabel} </b>
            </div>
        </div>
    )
}

export default UpcomingEvents;
