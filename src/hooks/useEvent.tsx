
import { useToast } from '../components/ui/use-toast';
import useFetch from './useFetch';

const useEvent = () => {

    const { toast } = useToast();

    // get events
    const { isFetching: isFetchingEvents, onFetch: onFetchEvents } = useFetch(
        'events/sa/',
        (data, status) => { 
            if (status === 200) {
                return data.data;
            }
        },
        (error, status) => {
            const { message} = error;
            toast({
                title: `${message} (${status})`,
               
                variant: 'destructive',
            })
        }
    );

    // get event types
    const { isFetching: isFetchingEventTypes, onFetch: onFetchEventTypes } = useFetch(
        '/events/sa/types',
        (data, status) => { 
            if (status === 200) {
                return data.data;
            }
        },
        (error, status) => {
            const { message} = error;
            toast({
                title: `${message} (${status})`,
               
                variant: 'destructive',
            })
        }
    );

    const getEventTypes = () => onFetchEventTypes();
    
    const getEvents = () => onFetchEvents();

    return {
        getEvents,
        isFetchingEvents,
        getEventTypes,
        isFetchingEventTypes,
    }
}

export default useEvent;