import { LayoutGrid, ListFilter, ListOrdered, Pencil, PlusCircle, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useEffect, useState } from 'react';
import ProfileImg from '../components/ui-custom/profileImg';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Checkbox } from '../components/ui/checkbox';
import { HEADER_HEIGHT } from '../lib/utils';
import useFetch from '../hooks/useFetch';
import AddEvent from '../components/ui-custom/addEvent';

const Events = () => {
    const [events, setEvents] = useState([]);
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

    const { onFetch: getEvents, isFetching: isLoadingEvents } = useFetch(
        '/events/sa/upcoming',
        (data) => {
            setEvents(data.data.results)
            console.log(data.data.results)
        },
        () => { },
    );

    useEffect(() => {
        getEvents();
    }, [])

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
                            <Input className='p-6 pe-12 border-transparent rounded-full bg-foreground/5 w-[300px]' />
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
                        All Events ({events.length || 0})
                    </h5>
                </div>

                {
                    isList  ?
                    <TableView events={events} /> :
                    <GridView events={events} />
                }

			</div>
		</div>
	);
};

const TableView = ({ events }) => {
    return (
        <Table className="">
            <TableHeader>
                <TableRow>
                    <TableHead>Departments</TableHead>
                    <TableHead>No. of Users</TableHead>
                    <TableHead>Events</TableHead>
                    <TableHead className="text-center">
                        Live Webinars
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {events.map((e: number) => (
                    <TableRow key={e}>
                        <TableCell className="font-medium">
                            NCCQE
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center">
                                <ProfileImg
                                    url={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${Math.random()}`}
                                />
                                <ProfileImg
                                    url={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${Math.random()}`}
                                    className="-ml-4"
                                />
                                <ProfileImg
                                    url={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${Math.random()}`}
                                    className="-ml-4"
                                />
                                <span className="ms-2"> + 300 </span>
                            </div>
                        </TableCell>
                        <TableCell>30</TableCell>
                        <TableCell className="flex justify-center items-center gap-3">
                            <span>5</span>
                            <Badge variant={'destructive'}>
                                Live
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

const GridView = ({ events }) => {

    const SAMPLE_IMG = 'https://scontent.facc1-1.fna.fbcdn.net/v/t39.30808-6/440128026_279179215284777_2129238623055120663_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=q4IsD8czVyEQ7kNvgFSSf3s&_nc_oc=Adj2apt5hiLe3FAtky7rXBEQnbAUJokC87FI6bgRUWx_u1DqheqIEmoNWQ12EqsEdeU&_nc_ht=scontent.facc1-1.fna&oh=00_AfCnkDFP5RkNPfmx0k8xOYin6SM3x4wU7TTpMA6r83XmPw&oe=662F70BF'

    return (
        <div className='grid lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-10'>
            {
                events.map((e, k) => 
                    <div className='relative col-span-1 rounded-lg border grid grid-cols-[160px_1fr] h-40 bg-foreground/5'>
                        <img className='w-full h-full object-center object-cover' src={SAMPLE_IMG} alt="" />

                        <div className="overflow-hidden p-5">
                            <h1 className='text-xl line-clamp-2 mb-5'> Workshop on Aviation Emergency Response Preparedness </h1>

                            <div className="flex justify-between items-center">
                                <h1 className='text-10 opacity-50'> 12 December, 2025 </h1>

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

const CheckboxWithLabel = ({ label }: { label: string }) => {
    return (
        <div className = "flex items-center space-x-2" >
        <Checkbox id={label.replaceAll(' ', '')} />
        <label
            htmlFor={label.replaceAll(' ', '')}
            className="text-sm font-medium leading-none"
        >
            {label}
        </label>
        </div >
    )
}

export default Events;
