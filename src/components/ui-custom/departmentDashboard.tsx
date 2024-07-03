import { Loader2, PlusCircle, Search } from "lucide-react";

import CalImg from "/icons/cal.svg";
import Card from "../ui-custom/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useEffect, useState } from "react";
import { HEADER_HEIGHT } from "../../lib/utils";
import useFetch from "../../hooks/useFetch";
import { Input } from "../ui/input";
import { NoEvents, Event } from "./upcomingEvents";
import AddDepartmentMember from "./addDepartmentMember";
import { Button } from "../ui/button";

interface DepartmentDashboard {
    tenantId: string
}

const DepartmentDashboard = ({ tenantId }: DepartmentDashboard) => {

    const [members, setMembers] = useState<any>([]);
    const [ongoingEvents, setOngoingEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [filterMembers, setFilterMembers] = useState([]);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);

    const { onFetch: getTenant, isFetching: isLoadingEvents } = useFetch(
        `/tenants/sa/${tenantId}/details`,
        (data) => {
            setMembers(data.data.members.results)
            setFilterMembers(data.data.members.results)
            setOngoingEvents(data.data.ongoing_events.results)
            setUpcomingEvents(data.data.upcoing_events.results)
        },
        () => { },
    );


    // on component mount
    useEffect(() => {
        getTenant();
    }, []);

    useEffect(() => {
        const filter = members.filter((item: any) => item.full_name.includes(search))
        setFilterMembers(filter)
    }, [search])

    return (
        <div className="overflow-y-auto pb-5 pt-10 px-10 bg-foreground/5" style={{
            height: `calc(100vh - ${HEADER_HEIGHT}px)`
        }}>
            {
                isLoadingEvents ? <Loader2 className='animate-spin mx-auto'/> : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        <div className="col-span-2">

                            <div className="flex flex-col lg:grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <Card currentStep={1} img={CalImg} cta="Create Event" ctaIcon={<PlusCircle size={18} />} />
                                </div>
                                <div className="col-span-1">
                                    <AddDepartmentMember tenantId={tenantId} open={open} openModal={() => setOpen(!open)} setOpen={setOpen}
                                        label={
                                            <div className=" bg-background/70 min-h-[200px] w-full px-5 2xl:px-10 py-5 flex items-center justify-between overflow-hidden rounded">
                                                <div className="flex">
                                                    <Button size={"sm"} className="gap-3">
                                                        <PlusCircle size={18} />
                                                        Add A Member
                                                    </Button>
                                                </div>

                                                <div className="">
                                                    <img className="w-full min-w-[130px] max-w-[180px]" src={CalImg} alt="" />
                                                </div>
                                            </div>
                                        }
                                    />
                                </div>
                                <div className="col-span-2 bg-background/70">
                                    <div className="flex justify-between items-center p-5">
                                        <div className="">
                                            <h5 className="text-xl">Departments Members </h5>
                                            <small className="text-muted-foreground"> {members.length} Members </small>
                                        </div>
                                        <div className="relative flex items-center w-fit">
                                            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="search" className="p-6 pe-12 border-transparent rounded-full bg-foreground/5 w-[400px] max-w-full" />
                                            <Search className="absolute right-5 opacity-30" />
                                        </div>
                                    </div>

                                    <Table className="">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Gender</TableHead>
                                                <TableHead>Rank</TableHead>
                                                <TableHead className="text-center">Email</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {
                                                filterMembers.map((member: any) => (
                                                    <TableRow key={member.tenant_id}>
                                                        <TableCell className="font-medium">
                                                            {member.full_name}
                                                        </TableCell>

                                                        <TableCell>
                                                            {member.gender}
                                                        </TableCell>

                                                        <TableCell> {member.rank} </TableCell>

                                                        <TableCell className="flex justify-center items-center gap-3">
                                                            {member.email}
                                                        </TableCell>

                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>

                                </div>
                            </div>
                        </div>

                        <div className="w-full col-span-2 xl:col-span-1">
                            <div className="h-full bg-black/5 rounded overflow-hidden" style={{
                                height: `calc(100vh - ${HEADER_HEIGHT}px - ${70}px)`
                            }}>
                                <EventType events={ongoingEvents} label="Ongoing Events" noEventsLabel="No ongoing  events" />
                            </div>
                            <div className="h-full bg-black/5 rounded overflow-hidden" style={{
                                height: `calc(100vh - ${HEADER_HEIGHT}px - ${70}px)`
                            }}>
                                <EventType events={upcomingEvents} label="Upcoming Events" noEventsLabel="No upcoming  events" />
                            </div>
                        </div>
                    </div>
                )
            }


        </div>
    )
}

const EventType = ({ events, label, noEventsLabel }: any) => {

    return (
        <div className="bg-background/70 h-full w-full">
            <div className="bg-foreground text-background p-5">
                <h5 className="text-lg"> {label} </h5>
            </div>

            <ul className="overflow-auto h-full pb-20">


                {events.length ?
                    events.map((e: any, k: number) => (
                        <Event key={k} event={e} />
                    )) :
                    <NoEvents noEventsLabel={noEventsLabel} />
                }
            </ul>
        </div>
    );
};


export default DepartmentDashboard;