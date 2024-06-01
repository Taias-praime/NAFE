import { LayoutGrid, ListFilter, ListOrdered, Pencil, PlusCircle, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useEffect, useState } from 'react';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { HEADER_HEIGHT } from '../lib/utils';
import useFetch from '../hooks/useFetch';
import AddEvent from '../components/ui-custom/addEvent';
import { IEvent } from '../models/interfaces';

const Events = () => {
    const [events, setEvents] = useState<IEvent[]>([]);
    const [eventsCount, setEventsCount] = useState<number>(0);
    const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([]);
    const [isList, setIsList] = useState<boolean>(false);
    const [tab, setTab] = useState<string>('all');

    const [showNormalEvent, setShowNormalEvent] = useState<boolean>(false);
    const [showRestrictedEvent, setShowRestrictedEvent] = useState<boolean>(false);
    const [showSecretEvent, setShowSecretEvent] = useState<boolean>(false);

    const count = (): number => {
        let num = 0;
        if (showNormalEvent) num += 1;
        if (showRestrictedEvent) num += 1;
        if (showSecretEvent) num += 1;
        return num;
    }

    const { onFetch: getEvents } = useFetch(
        '/events/sa/',
        (data) => {
            setEvents(data.data.results)
            setEventsCount(data.data.number_of_items);
        },
        () => { },
    );

    const handleSearch = () => {

    }

    useEffect(() => {
        getEvents();
    }, [])

    useEffect(() => {
        if ( tab === 'all' ) setFilteredEvents(events)
        else if ( tab === 'ongoing' ) setFilteredEvents([])
        else if ( tab === 'live' ) setFilteredEvents(events.filter(e => e.event_link))
    }, [tab]);


    useEffect(() => {
        setFilteredEvents([]);
        if (showNormalEvent) setFilteredEvents([...filteredEvents, ...events.filter(e => e.type === 'general')])
        if (showRestrictedEvent) setFilteredEvents([...filteredEvents, ...events.filter(e => e.type === 'restricted')])
        if (showSecretEvent) setFilteredEvents([...filteredEvents, ...events.filter(e => e.type === 'registered')])
    }, [ showNormalEvent, showRestrictedEvent, showSecretEvent, events]);


	return (
		<div className="overflow-y-auto pb-5 pt-10 px-10" style={{
            height: `calc(100vh - ${HEADER_HEIGHT}px)`
        }}>
			<div className="flex justify-between">
				<div className=""></div>
				<Button className="lg:absolute top-5 right-10 p-0">
                    <AddEvent className="flex items-center gap-3 p-3">
                        <PlusCircle />
                        Create Event
                    </AddEvent>
				</Button>
			</div>

			<div className="space-y-10">
				<div className="xl:flex justify-between items-center space-y-3">
					<div className="">
                        <Tabs defaultValue={tab} onValueChange={(e) => setTab(e)} className="w-[400px]">
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                                <TabsTrigger value="live">Live</TabsTrigger>
                                <TabsTrigger value="past">Past</TabsTrigger>
                            </TabsList>
                        </Tabs>

					</div>
                    <div className="flex gap-5 items-center">
                        <div className="relative flex items-center w-fit">
                            <Input className='p-6 pe-12 border-transparent rounded-full bg-foreground/5 w-[300px]' onChange={handleSearch} />
                            <Search className='absolute right-5 opacity-30' />
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className='flex gap-3' variant={!count() ? 'ghost' : 'secondary'}>
                                    { !!count() && 
                                        <Badge className='flex items-center justify-center p-0 w-5 h-5'>
                                            { count() }
                                        </Badge>}
                                    Filter
                                    <ListFilter />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuCheckboxItem
                                    className='py-2'
                                    checked={showNormalEvent}
                                    onCheckedChange={setShowNormalEvent}
                                >
                                    Normal Event
                                </DropdownMenuCheckboxItem>

                                <DropdownMenuSeparator />
                                
                                <DropdownMenuCheckboxItem
                                    className='py-2'
                                    checked={showRestrictedEvent}
                                    onCheckedChange={setShowRestrictedEvent}
                                >
                                    Restricted Event
                                </DropdownMenuCheckboxItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuCheckboxItem
                                    className='py-2'
                                    checked={showSecretEvent}
                                    onCheckedChange={setShowSecretEvent}
                                >
                                    Secret Event
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button className='flex gap-3' variant={'ghost'}> 
                                    Filter 
                                    <ListFilter />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem> <CheckboxWithLabel label="Normal Event" /> </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem> <CheckboxWithLabel label="Restricted Event" /> </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem> <CheckboxWithLabel label="Secret Event" /> </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu> */}


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
                    <h5 className="text-xl">
                        All Events {`(${eventsCount})`}
                    </h5>
                </div>

                {
                    isList  ?
                    <TableView events={filteredEvents} /> :
                    <GridView events={filteredEvents} />
                }

			</div>
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
                        <TableCell>
                            {event.type}
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

const GridView = ({ events }: { events: IEvent[] }) => {

    return (
        <div className='grid lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-10'>
            {
                events.map((event: IEvent) => // (e,k)
                    <div className='relative col-span-1 rounded-lg border overflow-hidden grid grid-cols-[160px_1fr] h-40 bg-foreground/5'>
                        <img className='w-full max-h-full min-h-full object-center object-cover' src={event.image} alt="" />

                        <div className="overflow-hidden p-5">
                            <h1 className='text-xl line-clamp-2 mb-5'> { event.title } </h1>

                            <div className="flex justify-between items-center">
                                <h1 className='text-sm opacity-50'> { new Date(event.start_date).toDateString() }  </h1>

                                <Button size={'sm'} className="flex gap-3">
                                    <Pencil />
                                    Edit
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

// const CheckboxWithLabel = ({ label }: { label: string }) => {
//     return (
//         <div className = "flex items-center space-x-2" >
//         <Checkbox id={label.replaceAll(' ', '')} />
//         <label
//             htmlFor={label.replaceAll(' ', '')}
//             className="text-sm font-medium leading-none"
//         >
//             {label}
//         </label>
//         </div >
//     )
// }

export default Events;
