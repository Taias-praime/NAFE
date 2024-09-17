import { LayoutGrid, ListFilter, ListOrdered, Loader2, Pencil, PlusCircle, Search, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useEffect, useState } from 'react';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { HEADER_HEIGHT, PLACEHOLDER_IMG_URL } from '../lib/utils';
import useFetch from '../hooks/useFetch';
import AddEvent from '../components/ui-custom/addEvent';
import { IEvent } from '../models/interfaces';
import { format } from 'date-fns';
import Paginate from '../components/ui/paginate';
import { NoEvents } from '../components/ui-custom/upcomingEvents';

const Events = () => {
    const [eventsCount, setEventsCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [numOfPages, setNumOfPages] = useState(0);

    const [events, setEvents] = useState<IEvent[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
    const [filterType, setFilterType] = useState([
        { type: "Registered", checked: false },
        { type: "Confidential", checked: false },
        { type: "General", checked: false },
        { type: "Restricted", checked: false },
    ])

    const [isList, setIsList] = useState<boolean>(false);
    const [isEditEvent, setIsEditEvent] = useState(false)
    const [reload, setReload] = useState(false);
    const [eventType, setEventType] = useState('today');
    const [searchValue, setSearchValue] = useState("");

    const { onFetch: getEvents, isFetching } = useFetch(
        `/events/sa/?event_type=${eventType}&page=${currentPage}&items_per_page=10`,
        (data) => {
            setEvents(data.data.results)
            setFilteredEvents(data.data.results);
            setEventsCount(data.data.number_of_items);
            setNumOfPages(data.data.number_of_pages);
        },
    );

    // search event
    const { onFetch: searchEvent, isFetching: isSearching } = useFetch(
        `/events/sa/?search_query${searchValue}`,
        (data) => {
            setEvents(data.data.results)
            setFilteredEvents(data.data.results);
            setEventsCount(data.data.number_of_items);

        },
    );

    const {
        onFetch: getLiveEvents,
    } = useFetch(
        `/events/sa/list-live-webinars`,
        (data) => {
            data.data.results.forEach((event: IEvent) => {
                event.start_date = event.date as string;
            });
            setEvents(data.data.results)
            setFilteredEvents(data.data.results);
            setEventsCount(data.data.number_of_items);
            setNumOfPages(data.data.number_of_pages);
        },
    );

    useEffect(() => {
        if (eventType === 'live') return;
        getEvents();
        setFilteredEvents([]);
        setReload(false);
    }, [reload, currentPage, eventType]);

    const handlePageClick = (event: { selected: number; }) => {
        setCurrentPage(event.selected + 1);
    };

    const updateEventType = (value: string) => {
        setEventType(value);
        if (value === 'live') {
            getLiveEvents();
        }
    }

    const handleSearch = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!searchValue) return;
        searchEvent();
    }

    const clearSearch = () => {
        setSearchValue("");
        getEvents();
    }

    const handleFilter = (type: string) => {
        let filterArr = [...selectedFilter]
        const updatedFilteredEvent = []
        const filterTypeCopy = filterType.map(filter => {
            if (filter.type.toLowerCase() === type.toLowerCase()) {
                filter.checked = !filter.checked
            }
            return filter
        })
        if (selectedFilter.includes(type)) {
            filterArr = selectedFilter.filter((filtercopy: string) => type !== filtercopy)
        } else {
            filterArr = [...selectedFilter, type]
        }
        setFilterType(filterTypeCopy);
        setSelectedFilter(filterArr);

        // if (filterArr.length === 0) {
        //     setFilteredEvents(events)
        //     return
        // }
        for (let i = 0; i < events.length; i++) {
            for (let j = 0; j < selectedFilter.length; j++) {
                if (events[i].type && events[i].type.toLowerCase() === selectedFilter[j].toLowerCase()) {
                    updatedFilteredEvent.push(events[i])
                    continue;
                }
            }
        }
        setFilteredEvents(updatedFilteredEvent);
    }

    return (
        <div className="overflow-y-auto pb-5 pt-10 px-10 relative" style={{
            height: `calc(100vh - ${HEADER_HEIGHT}px)`
        }}>
            <div className="flex justify-between py-5 ">
                <Button className="lg:absolute top-5 right-10 p-0">
                    <AddEvent currentStep={1} isEditEvent={isEditEvent} setIsEditEvent={setIsEditEvent} setReload={setReload}
                        className="flex items-center gap-3 p-3">
                        <PlusCircle />
                        Create Event
                    </AddEvent>
                </Button>
            </div>

            <div className="space-y-10">
                <div className="xl:flex justify-between items-end space-y-3">
                    <div className="">
                        <Tabs defaultValue={eventType} onValueChange={(e) => updateEventType(e)} className="w-[400px]">
                            <TabsList>
                                <TabsTrigger value="today">Ongoing Events</TabsTrigger>
                                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                                <TabsTrigger value="live">Live Events</TabsTrigger>
                                <TabsTrigger value="past">Past Events</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <div className="flex gap-5 items-center">
                        <div className="relative flex items-center w-fit">
                            <form onSubmit={handleSearch} className="relative flex items-center">
                                <Input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className='p-6 pe-12 border-transparent rounded-full bg-foreground/5 w-[250px]' />
                                <div className="absolute right-5 opacity-30">
                                    {
                                        searchValue ? <X role="button" onClick={clearSearch} /> : <Search />
                                    }
                                </div>
                            </form>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className='flex gap-3' variant={selectedFilter.length === 0 ? 'ghost' : 'secondary'}>
                                    {selectedFilter.length > 0 &&
                                        <Badge className='flex items-center justify-center p-0 w-5 h-5'>
                                            {selectedFilter.length}
                                        </Badge>}
                                    Filter
                                    <ListFilter />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                {
                                    filterType.map(filter => (
                                        <>
                                            <DropdownMenuCheckboxItem
                                                className='py-2'
                                                checked={filter.checked}
                                                onCheckedChange={() => handleFilter(filter.type)}
                                            >
                                                {filter.type} Event
                                            </DropdownMenuCheckboxItem>

                                            <DropdownMenuSeparator />
                                        </>
                                    ))
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button className='flex gap-3' variant={'ghost'} onClick={() => setIsList(!isList)}>
                            {
                                isList ?
                                    <ListOrdered /> :
                                    <LayoutGrid />
                            }
                        </Button>
                    </div>
                </div>

                <div className="">
                    <h5 className="text-xl capitalize">
                        {eventType} Events {`(${eventsCount})`}
                    </h5>
                </div>

                {
                    isFetching || isSearching ?
                        <div className='w-full h-[400px] flex justify-center items-center'>
                            <Loader2 className='animate-spin mx-auto' />
                        </div> : (
                            events.length > 0 ?
                                (
                                    isList ?
                                        <TableView events={filteredEvents} />
                                        :
                                        <GridView setReload={setReload} events={filteredEvents} isEditEvent={isEditEvent} setIsEditEvent={setIsEditEvent} eventType={eventType} />
                                ) : <NoEvents noEventsLabel={`No ${eventType === 'today' ? 'ongoing' : eventType} event`} />
                        )
                }
            </div>
            {
                <Paginate
                    handlePageClick={handlePageClick}
                    numOfPages={numOfPages}
                />
            }
        </div>
    );
};

const TableView = ({ events }: { events: IEvent[] }) => {
    return (
        <Table className="">
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {events.map((event: IEvent, index: number) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">
                            {event.title}
                        </TableCell>
                        <TableCell className='capitalize' >
                            {event.type ?? '-'}
                        </TableCell>
                        <TableCell>
                            {new Date(event.start_date).toDateString()}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

interface GridViewProps {
    events: IEvent[];
    setIsEditEvent: (value: boolean) => void;
    setReload: (value: boolean) => void;
    isEditEvent: boolean;
    eventType: string;
}

const GridView = ({ events, setIsEditEvent, setReload, isEditEvent }: GridViewProps) => {
    return (
        <div className='grid lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-10'>
            {
                events.map((event: IEvent) => // (e,k)
                    <div key={event.id} className='relative col-span-1 rounded-lg border overflow-hidden grid grid-cols-[160px_1fr] h-40 bg-foreground/5'>
                        <img className='w-full max-h-full min-h-full object-center object-cover' src={event.image || PLACEHOLDER_IMG_URL} alt="" />

                        <div className="overflow-hidden p-5 flex flex-col justify-between ">
                            <h1 className='text-lg line-clamp-2 mb-5'> {event.title} </h1>

                            <div className="flex justify-between items-center">
                                <p className='text-sm opacity-50'>
                                    {format(event.start_date, 'do MMMM yyyy')}
                                </p>
                                <Button onClick={() => { setIsEditEvent(true) }} size={'sm'} className="flex gap-3">
                                    <AddEvent currentStep={2} isEditEvent={isEditEvent} setIsEditEvent={setIsEditEvent} eventId={event.id} setReload={setReload} className="flex items-center gap-3 p-3">
                                        <Pencil />
                                        Edit
                                    </AddEvent>
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Events;
