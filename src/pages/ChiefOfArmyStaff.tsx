import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { FileItem, FilesList } from "../components/ui-custom/files";
import { Paperclip, Loader2, Pencil, PencilLine } from "lucide-react";
import { HEADER_HEIGHT, local, removeBase64, USER_PLACEHOLDER_IMG_URL } from "../lib/utils";
import { useEffect, useMemo, useState } from "react";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../components/ui/tooltip";
import useFetch from "../hooks/useFetch";
import { useToast } from "../components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { format } from "date-fns";
import Modal from "../components/ui-custom/modal";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import CreatePressRelease from "../components/ui-custom/createPressRelease";
import CreateLiveEvents from "../components/ui-custom/createLiveEvents";
import { useFormik } from "formik";
import { ArmyStaff, ILiveEvent, IPressRelease, ISuggestions } from "../models/interfaces";
import ProfileImage from "../components/ui-custom/ProfileImage";

const token = local("token");
const tabValue = ["press release", "live events", "suggestions"]

const ChiefOfArmyStaff = () => {
    const [COAS, setCOAS] = useState<ArmyStaff | null>(null);
    const [pressRelease, setPressRelease] = useState<IPressRelease[]>([]);
    const [liveEvents, setLiveEvents] = useState<ILiveEvent[]>([]);
    const [suggestions, setSuggestions] = useState<ISuggestions[]>([]);
    const [numOfPR, setNumOfPR] = useState(0);
    const [numOfLV, setNumOfLV] = useState(0);
    const [suggest, setSuggest] = useState<ISuggestions>(suggestions[0]);
    const [isPREdit, setIsPREdit] = useState(false);
    const [isLVEdit, setIsLVEdit] = useState(false);
    const [editCOASModal, setEditCOASModal] = useState(false);
    const [editLVModal, setEditLVModal] = useState(false);
    const [editPRModal, setEditPRModal] = useState(false);
    const [tab, setTab] = useState("press release");
    const [featuredImg, setFeaturedImg] = useState('');
    const [prId, setPrId] = useState('');
    const [lvId, setLvId] = useState<string | null>(null);
    const [reload, setReload] = useState(false);

    const { toast } = useToast();

    const formik = useFormik({
        initialValues: {
            image: featuredImg,
            fullname: '',
            title: '',
            description: '',
            files: [] as string[]
        },
        onSubmit: (obj) => {
            const baseData = {
                description: obj.description,
                files: obj.files,
                fullname: obj.fullname,
                title: obj.title,
            };
        
            const data = featuredImg.startsWith('http')
                ? baseData
                : { ...baseData, image: removeBase64(featuredImg) };
        
            onPut(data);
        }
    })

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
            const { message, ...err } = error;
            // notify
            toast({
                title: `${message} (${status})`,
                description: err.errors.error_message,
                variant: "destructive",
            });
        },
        {} // options
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
            const { message, ...err } = error;
            // notify
            toast({
                title: `${message} (${status})`,
                description: err.errors.error_message,
                variant: "destructive",
            });
        },
        {} // options
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
            const { message, ...err } = error;
            // notify
            toast({
                title: `${message} (${status})`,
                description: err.errors.error_message,
                variant: "destructive",
            });
        },
        {} // options
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
            const { message, ...err } = error;
            // notify
            toast({
                title: `${message} (${status})`,
                description: err.errors.error_message,
                variant: "destructive",
            });
        },
        {} // options
    );

    // edit COAS
    const { onPut, isFetching: isLoadingEdit } = useFetch(
        `/army-staffs/sa/${COAS?.id}/edit`,
        (data) => {
            toast({ description: data.message });
            setEditCOASModal(!editCOASModal)
        },
        (e) => {
            const { message, ...err } = e;
            // notify
            toast({
                title: `${message} (${status})`,
                description: err.errors.error_message,
                variant: 'destructive',
            });
        },
        {},
        {
            "Authorization": `Bearer ${token}`,
        }
    );

    const PR = useMemo(() => {
        const PR = pressRelease.filter((item: any) => {
            return item.id === prId
        })
        return PR;
    }, [prId])

    useEffect(() => {
        onFetchCOAS();
        onFetchPR();
        onFetchLV();
        onFetchSuggestion();
        setReload(false);
        setLvId(null);
    }, [reload]);

    useEffect(() => {
        if (featuredImg) formik.setFieldValue('image', featuredImg.split('data:image/jpeg;')[1]);
    }, [featuredImg])

    const editCOAS = () => {
        setEditCOASModal(!editCOASModal)

        if (!COAS) return;
        formik.setValues({
            image: COAS.image,
            fullname: COAS.fullname,
            title: COAS.title,
            description: COAS.description,
            files: [...COAS.files],
        })
        setFeaturedImg(COAS.image)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                formik.setFieldValue('files', [...formik.values.files, (reader.result as string)]);
            };
            reader.readAsDataURL(file);
        }
    };

    const editLiveEvents = (id: string) => {
        setLvId(id)
        setIsLVEdit(true);
        setEditLVModal(true);
    }

    const editPressRelease = (id: string) => {
        setPrId(id)
        setIsPREdit(true);
        setEditPRModal(true);
    }

    const removeFile = (e: { preventDefault: () => void }, id: string) => {
        e.preventDefault();
        const files = formik.values.files.filter((file) => file !== id);
        formik.setFieldValue("files", files)
    }
    const togglePRModal = () => {
        setEditPRModal(!editPRModal)
    }

    const toggleLVModal = () => {
        setEditLVModal(!editLVModal)
    }

    const viewSuggestion = (suggestion: ISuggestions) => {
        setSuggest(suggestion)
    }

    const deleteImage = () => {
        setFeaturedImg('')
    }

    return (
        <div
            className="overflow-y-auto bg-foreground/5 grid md:grid-cols-[400px_1fr] gap-4"
            style={{
                height: `calc(100vh - ${HEADER_HEIGHT}px)`,
            }}
        >
            <aside className="col-span-1 border-r p-10 bg-white">
                {isFetchingCOAS ? (
                    <SkeletonCard />
                ) : (
                    COAS && (
                        <div className="flex flex-col gap-5">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <object
                                            className="rounded-lg w-full"
                                            data={COAS.image || USER_PLACEHOLDER_IMG_URL}
                                            type="image/png"
                                        >
                                            <img
                                                className="rounded-lg w-full"
                                                src={COAS.image || USER_PLACEHOLDER_IMG_URL}
                                            />
                                        </object>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{COAS.fullname}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <div className="">
                                <Button size={"sm"} className="flex gap-3 px-5">
                                    <Modal open={editCOASModal} openModal={editCOAS} title="Chief of Army Staff" onOpenChange={(value) => setEditCOASModal(value)} className="flex items-center gap-3 p-3"
                                        label={
                                            <>
                                                <PencilLine /> Edit
                                            </>
                                        }
                                    >
                                        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
                                            <ProfileImage setFeaturedImg={setFeaturedImg} deleteImage={deleteImage} featuredImg={featuredImg} />
                                            <Input
                                                value={formik.values.fullname}
                                                onChange={formik.handleChange}
                                                name="fullname"
                                                placeholder="title here"
                                                className=""
                                                label="Full Name"
                                            />
                                            <Input
                                                value={formik.values.title}
                                                onChange={formik.handleChange}
                                                name="title"
                                                placeholder="title here"
                                                className=""
                                                label="Title"
                                            />
                                            <Textarea
                                                rows={4}
                                                value={formik.values.description}
                                                onChange={formik.handleChange}
                                                name="philosophy"
                                                placeholder="details of the event here"
                                                className="mb-10"
                                                label="Philosophy"
                                            />
                                            {formik.values.files && (
                                                <div className="flex flex-col gap-4">
                                                    {formik.values.files.map((file) => (
                                                        <FileItem showDelete={true} onClick={(e: { preventDefault: () => void; }) => removeFile(e, file)} file={file} />
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-start justify-between mt-6">
                                                <Button variant="blue" className="px-10">
                                                    <label className="flex items-center justify-center gap-2 w-full h-full cursor-pointer">
                                                        <div className=" rounded">
                                                            <Paperclip className="text-white" />
                                                        </div>
                                                        Attach File
                                                        <input type="file" accept="*/" onChange={handleFileChange} className="hidden" />
                                                    </label>
                                                </Button>
                                                <Button variant="default" type='submit' className="px-10">
                                                    {
                                                        isLoadingEdit ? <Loader2 className='animate-spin' /> : 'Update'
                                                    }
                                                </Button>
                                            </div>
                                        </form>
                                    </Modal>
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
            </aside>
            <div className=" bg-white mt-6 mr-6">
                <div className="">
                    <Tabs
                        defaultValue={tab}
                        onValueChange={(e) => setTab(e)}
                        className="w-[400px]"
                    >
                        <TabsList>
                            {tabValue.map((item) => (
                                <TabsTrigger key={item} value={item}>
                                    {item}
                                </TabsTrigger>
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
                                        <CreatePressRelease setReload={setReload} isPREdit={isPREdit} setIsPREdit={setIsPREdit} PR={PR} open={editPRModal} openModal={togglePRModal} setEditPRModal={setEditPRModal} />
                                    </SubHeader>
                                    <div className="grid lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
                                        {
                                            pressRelease.map(item => (
                                                <GridView key={item.title} title={item.title} date={item.date} image={item.image} id={item.id} onClick={editPressRelease} />
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
                                        <CreateLiveEvents lvId={lvId} setReload={setReload} isLVEdit={isLVEdit} setIsLVEdit={setIsLVEdit} open={editLVModal} openModal={toggleLVModal} setEditLVModal={setEditLVModal} />
                                    </SubHeader>
                                    <div className="grid lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
                                        {
                                            liveEvents.map(item => (
                                                <GridView key={item.title} title={item.title} date={item.date} image={item.image} onClick={editLiveEvents} id={item.id} />
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
                                                <button className={`p-3 border-b-2 flex flex-start flex-col gap-3 w-64 ${item.id === suggest.id && "bg-foreground/5"}`} onClick={() => viewSuggestion(item)} >
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
        </div>
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

const GridView = ({ title, date, image, id, onClick }: any) => {
    return (
        <div
            key={"id"}
            className="relative rounded-lg border overflow-hidden flex h-40 bg-foreground/5 max-w-100"
        >
            <img className='w-32 h-full object-center object-cover' src={image} alt="" />

            <div className=" p-5">
                <h1 className="text-lg line-clamp-2 mb-5 text-ellipsis overflow-hidden"> {title} </h1>

                <div className="flex gap-3 justify-between items-center">
                    <h1 className="text-sm opacity-50 text-ellipsis  "> {date ? format(date, ' MMM dd, yyyy') : ''} </h1>

                    <Button size={"sm"} className="flex gap-2" onClick={() => onClick(id)} >
                        <Pencil className="w-4 h-4" />
                        <span className="text-sm">Edit</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

const SubHeader = ({ title, number, children }: any) => {

    return (
        <div className="flex justify-between my-10">
            <div className="">
                <h4 className="mb-2 text-xl"> {title} </h4>
                {
                    number && <p className="opacity-50 text-sm"> {number} </p>
                }
            </div>
            {
                children && (
                    <Button className="flex gap-3" variant="secondary">
                        {children}
                    </Button>
                )
            }

        </div>
    )
}