
import { useToast } from '../components/ui/use-toast';
import useFetch from './useFetch';

const useEvent = () => {

    const { toast } = useToast();

    // get events
    const { isFetching: isFetchingEvents, onFetch: onFetchEvents } = useFetch(
        'events/sa/',
        (data, status) => { 
            // navigate to dashboard
            if (status === 200) {
                return data.data;
            }
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

    // get event types
    const { isFetching: isFetchingEventTypes, onFetch: onFetchEventTypes } = useFetch(
        '/events/sa/types',
        (data, status) => { 
            if (status === 200) {
                return data.data;
            }
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