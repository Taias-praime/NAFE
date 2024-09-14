import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { FilesList } from "../components/ui-custom/files";
import { HEADER_HEIGHT, USER_PLACEHOLDER_IMG_URL } from "../lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../components/ui/tooltip";
import useFetch from "../hooks/useFetch";
import { useToast } from "../components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import CreatePressRelease from "../components/ui-custom/createPressRelease";
import CreateLiveEvents from "../components/ui-custom/createLiveEvents";
import { ArmyStaff, ILiveEvent, IPressRelease, ISuggestions } from "../models/interfaces";
import LiveEvents from "../components/ui-custom/liveEvents";
import PressRelease from "../components/ui-custom/pressRelease";
import EditChiefOfStaff from "../components/ui-custom/edit-chief-of-staff";

const tabValue = ["press release", "live events", "suggestions"]

const ChiefOfArmyStaff = () => {
    const [COAS, setCOAS] = useState<ArmyStaff | null>(null);
    const [pressRelease, setPressRelease] = useState<IPressRelease[]>([]);
    const [liveEvents, setLiveEvents] = useState<ILiveEvent[]>([]);
    const [suggestions, setSuggestions] = useState<ISuggestions[]>([]);
    const [numOfPR, setNumOfPR] = useState(0);
    const [numOfLV, setNumOfLV] = useState(0);
    const [suggest, setSuggest] = useState<ISuggestions>(suggestions[0]);
    const [tab, setTab] = useState("press release");
    const [prId, setPrId] = useState('');
    const [reload, setReload] = useState(false);

    const { toast } = useToast();

    // get COAS
    const { isFetching: isFetchingCOAS, onFetch: onFetchCOAS } = useFetch(
        "/army-staffs/sa/",
        (data, status) => {
            if (status === 200) {
                const _data = data.data;
                const results = _data.results;
                setCOAS(results.filter((coa: ArmyStaff) => coa.current)[0]);
            }
        },
        (error, status) => {
            // on error
            const { message } = error;
            // notify
            toast({
                title: `${message} (${status})`,
                variant: "destructive",
            });
        },
    );

    // get Suggestions
    const { isFetching: isFetchingSuggestion, onFetch: onFetchSuggestion } = useFetch(
        "/army-staffs/sa/suggestions",
        (data, status) => {
            if (status === 200) {
                const _data = data.data;
                const results = _data.results;
                setSuggestions(results);
                setSuggest(results[0])
            }
        },
        (error, status) => {
            // on error
            const { message } = error;
            // notify
            toast({
                title: `${message} (${status})`,
                variant: "destructive",
            });
        },
    );

    // get Press Release (PR)
    const { isFetching: isFetchingPR, onFetch: onFetchPR } = useFetch(
        "/press-releases/sa/",
        (data, status) => {
            if (status === 200) {
                const _data = data.data;
                setPressRelease(_data.results)
                setNumOfPR(_data.number_of_items)
            }
        },
        (error, status) => {
            // on error
            const { message } = error;
            // notify
            toast({
                title: `${message} (${status})`,
                variant: "destructive",
            });
        },
    );

    // get Live Events (LV)
    const { isFetching: isFetchingLV, onFetch: onFetchLV } = useFetch(
        "/army-staffs/sa/list-live-event",
        (data, status) => {
            if (status === 200) {
                const _data = data.data;
                setLiveEvents(_data.results)
                setNumOfLV(_data.number_of_items)

            }
        },
        (error, status) => {
            // on error
            const { message } = error;
            // notify
            toast({
                title: `${message} (${status})`,
                variant: "destructive",
            });
        },
    );

    const PR = useMemo(() => {
        const PR = pressRelease.filter((item: any) => {
            return item.id === prId
        })
        return PR[0];
    }, [prId])

    useEffect(() => {
        onFetchCOAS();
        onFetchPR();
        onFetchLV();
        onFetchSuggestion();
        setReload(false);
    }, [reload]);

    const editPressRelease = (id: string) => {
        setPrId(id)
    }

    const viewSuggestion = (suggestion: ISuggestions) => {
        setSuggest(suggestion)
    }

    return (
        <div className="overflow-y-auto bg-foreground/5 grid md:grid-cols-[400px_1fr] gap-4"
            style={{
                height: `calc(100vh - ${HEADER_HEIGHT}px)`,
            }}>
            <aside className="col-span-1 border-r p-10 bg-white">
                {isFetchingCOAS ? (
                    <SkeletonCard />
                ) : (
                    COAS && (
                        <div className="flex flex-col gap-5">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div> <img className="rounded-lg w-full h-72" src={COAS.image || USER_PLACEHOLDER_IMG_URL} /> </div>
                                    </TooltipTrigger>
                                    <TooltipContent> <p>{COAS.fullname}</p> </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <div>
                                <Button size={"sm"} className="flex gap-3 px-5">
                                    <EditChiefOfStaff setReload={setReload} id={COAS.id} />
                                </Button>
                            </div>

                            <div className="overflow-hidden mb-10">
                                <h1 className="text-2xl truncate mb-2"> {COAS.fullname} </h1>
                                <p className="opacity-50 mb-5"> {COAS.title} </p>
                                <p className="line-clamp-6">{COAS.description}</p>
                            </div>
                        </div>
                    )
                )}

                {/* List of files */}
                {COAS?.files.length && <FilesList files={COAS.files} />}
            </aside >
            <div className="bg-white mt-6 mr-6">
                <div className="">
                    <Tabs
                        defaultValue={tab}
                        onValueChange={(e) => setTab(e)}
                        className="w-[400px]"
                    >
                        <TabsList>
                            {tabValue.map((item) => (
                                <TabsTrigger key={item} value={item}> {item} </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
                <div className="px-10">
                    {
                        isFetchingPR ? <Empty /> : (
                            tab === "press release" && (
                                <>
                                    <SubHeader title="Press Release" number={`${numOfPR} Release`}>
                                        <CreatePressRelease setReload={setReload} isPREdit={false} PR={null} title="Create Press Release" label="Upload Press Release" />
                                    </SubHeader>
                                    <div className="grid lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
                                        {
                                            pressRelease.map(item => (
                                                <PressRelease key={item.title} title={item.title} date={item.date} image={item.image} id={item.id} setReload={setReload} isPREdit={true} PR={PR} onClick={editPressRelease} />
                                            ))
                                        }
                                    </div>
                                </>
                            )

                        )
                    }

                    {
                        isFetchingLV ? <Empty /> : (
                            tab === "live events" && (
                                <>
                                    <SubHeader title="Live Events" number={`${numOfLV} Events`} >
                                        <CreateLiveEvents id={null} setReload={setReload} isLVEdit={false} title="Create Live Event" label="Create Live Event" />
                                    </SubHeader>
                                    <div className="grid lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
                                        {
                                            liveEvents.map(item => (
                                                <LiveEvents key={item.title} setReload={setReload} title={item.title} isLVEdit={true} date={item.date} image={item.image} lvId={item.id} id={item.id} />
                                            ))
                                        }
                                    </div>

                                </>
                            )
                        )
                    }
                    {isFetchingSuggestion ? <Empty /> : (
                        tab === "suggestions" && suggestions.length !== 0 && (
                            <>
                                <SubHeader title="Suggestions" />
                                <div className="flex py-4">
                                    <div className="w-64">
                                        {
                                            suggestions.map(item => (
                                                <button key={item.id} className={`p-3 border-b-2 flex flex-start flex-col gap-3 w-64 ${item.id === suggest.id && "bg-foreground/5"}`} onClick={() => viewSuggestion(item)} >
                                                    <div className="text-lg">Anonymous</div>
                                                    <div className="text-xs">{format(item.date_created, 'MMM dd, yyyy | p')} </div>
                                                </button>
                                            ))
                                        }
                                    </div>

                                    <div className="flex-1 p-3 flex flex-col gap-6 px-6 bg-foreground/5 h-fit">
                                        <div className="">
                                            <div className="text-lg">Anonymous</div>
                                            <div className="text-xs">{format(suggest.date_created, 'MMM dd, yyyy | p')} </div>
                                        </div>
                                        <div className="normal-case">{suggest.description} </div>
                                    </div>
                                </div>
                            </>

                        )
                    )

                    }
                </div>
            </div>
        </div >
    );
};

const SkeletonCard = () => {
    return (
        <div className="flex flex-col space-y-3 mb-10">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <div className="space-y-4">
                <Skeleton className="h-10 w-[100px]" /> {/* edit button */}
                <Skeleton className="h-5 w-full max-w-[300px]" /> {/* COA Name */}
                <Skeleton className="h-4 w-[150px]" /> {/* COA Position */}
                <br />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
            </div>
        </div>
    );
};

const Empty = () => {
    return (
        <div className="grid lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5 my-20">
            <div className="flex space-y-3 mb-10 gap-4">
                <Skeleton className="aspect-square w-32 rounded-xl" />
                <div className="space-y-4 w-full">
                    <Skeleton className="h-10 w-[100px]" />
                    <Skeleton className="h-5 w-full max-w-[300px]" />
                    <Skeleton className="h-4 w-[150px]" />
                </div>
            </div>
            <div className="flex space-y-3 mb-10 gap-4">
                <Skeleton className="aspect-square w-32 rounded-xl" />
                <div className="space-y-4 w-full">
                    <Skeleton className="h-10 w-[100px]" />
                    <Skeleton className="h-5 w-full max-w-[300px]" />
                    <Skeleton className="h-4 w-[150px]" />
                </div>
            </div>
        </div>

    );
};

export default ChiefOfArmyStaff;

const SubHeader = ({ title, number, children }: any) => {

    return (
        <div className="flex justify-between my-10">
            <div className="">
                <h4 className="mb-2 text-xl"> {title} </h4>
                {number && <p className="opacity-50 text-sm"> {number} </p>}
            </div>
            {children && (<Button className="flex gap-3" variant="secondary"> {children} </Button>)}
        </div>
    )
}