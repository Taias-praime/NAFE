import { Building2, CalendarDays, PlusCircle, RadioTower } from "lucide-react";

import CalImg from "/icons/cal.svg";
import Card from "../components/ui-custom/card";
import UpcomingEvents from "../components/ui-custom/upcomingEvents";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { Badge } from "../components/ui/badge";
import { HEADER_HEIGHT, USER_PLACEHOLDER_IMG_URL } from "../lib/utils";
import ProfileImg from "../components/ui-custom/profileImg";
import useFetch from "../hooks/useFetch";
import { Skeleton } from "../components/ui/skeleton";
import { Link } from "react-router-dom";

const Dashboard = () => {

    const { onFetch: getEvents, isFetching: isLoadingEvents } = useFetch(
        '/events/sa/upcoming',
        (data) => {
            setEvents(data.data.results);
            setEventsCount(data.data.number_of_items);
        },
        () => {},
    );

    const { onFetch: getWebinars, isFetching: isLoadingWebinars } = useFetch(
        '/events/sa/list-live-webinars',
        (data) => {
            setWebinars(data.data.results);
            setWebinarsCount(data.data.number_of_items);
        },
        () => {},
    );

    const { onFetch: getDeps, isFetching: isLoadingDeps } = useFetch(
        '/tenants/sa/',
        (data) => {
            setDeps(data.data.results)
            setDepsCount(data.data.number_of_items);
        },
        () => {},
    );

    const [deps, setDeps] = useState([]);
    const [depsCount, setDepsCount] = useState(0);

    const [, setEvents] = useState([]);
    const [eventsCount, setEventsCount] = useState(0);

    const [, setWebinars] = useState([]);
    const [webinarsCount, setWebinarsCount] = useState(0);

    // on component mount
    useEffect(() => {
        getDeps();
        getEvents();
        getWebinars();
    }, [])

    return (
        <div className="overflow-y-auto pb-5 pt-10 px-10 bg-foreground/5" style={{
            height: `calc(100vh - ${HEADER_HEIGHT}px)`
        }}>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="col-span-2">

                    <div className="flex flex-col lg:grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <Card img={CalImg} cta="Create Event" ctaIcon={<PlusCircle size={18} />} />
                        </div>
                        <div className="col-span-1">
                            {
                                isLoadingEvents ? 
                                <CardSkeleton /> :
                                <Card title="Events" stat={eventsCount} img={<CalendarDays size={40} />} />
                            }
                        </div>
                        <div className="col-span-1">
                            {
                                isLoadingWebinars ?
                                <CardSkeleton /> :
                                <Card title="Live Webinars" stat={webinarsCount} img={<RadioTower size={40} color="red" />} />
                            }
                        </div>
                        <div className="col-span-1">
                            {
                                isLoadingDeps ?
                                <CardSkeleton /> :
                                <Card title="Departments" stat={depsCount} img={<Building2 size={40} />} />
                            }
                        </div>

                        <div className="col-span-2 bg-background/70">
                            <div className="flex justify-between items-center p-5">
                                <div className="">
                                    <h5 className="text-xl"> List of Departments </h5>
                                    <small className="text-muted-foreground"> {depsCount} Departments </small>
                                </div>
                                <div className="">
                                    <Link to='/departments'>
                                        <Button variant={"ghost"}> View All </Button>
                                    </Link>
                                </div>
                            </div>

                            <Table className="">
                                {/* <TableCaption className="py-5">A list of your recent invoices.</TableCaption> */}
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Departments</TableHead>
                                        <TableHead>No. of Users</TableHead>
                                        <TableHead>Events</TableHead>
                                        <TableHead className="text-center">Live Webinars</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        deps.slice(0,4).map((d: any) => (
                                            <TableRow key={d.tenant_id}>
                                                <TableCell className="font-medium"> 
                                                    {d.code} 
                                                </TableCell>

                                                <TableCell>
                                                    <div className="flex items-center">
                                                        {[...Array(d.total_members).keys()].map((_,i) =>
                                                            <ProfileImg className={i ? "-ml-4" : ''} url={USER_PLACEHOLDER_IMG_URL} />
                                                        ).slice(0, 3)}
                                                        <span className="ms-2"> 
                                                            { (d.total_members > 3) ? '+ ' + (d.total_members - 3) : '' } 
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell> {d.total_events} </TableCell>

                                                <TableCell className="flex justify-center items-center gap-3">
                                                    <span> {d.webinars} </span>
                                                    <Badge variant={"destructive"}> Live </Badge>
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
                        <UpcomingEvents />
                    </div>
                </div>
            </div>
        </div>
    )
}


const CardSkeleton = () => {
    return (
        <Skeleton className="min-h-[200px] w-full px-5 2xl:px-10 py-5 rounded" />
    );
}


export default Dashboard;