import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { FilesList } from "../components/ui-custom/files";
import { ArrowUpToLine, ImageUpIcon, Pencil, PencilLine, Trash2 } from "lucide-react";
import { HEADER_HEIGHT, local, USER_PLACEHOLDER_IMG_URL } from "../lib/utils";
import { useEffect, useState } from "react";

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

interface ArmyStaff {
    id: string;
    date_created: string;
    date_updated: string;
    fullname: string;
    title: string;
    image: string;
    description: string;
    files: any[]; // Specify the type of files if known, e.g., string[] or File[]
    appointment_start_date: string | null;
    appointment_end_date: string | null;
    current: boolean;
}

const token = local("token");

const ChiefOfArmyStaff = () => {
    const [COAS, setCOAS] = useState<ArmyStaff | null>(null);
    const [pressRelease, setPressRelease] = useState<any>([]);
    const [liveEvents, setLiveEvents] = useState<any>([]);
    const [suggestions, setSuggestions] = useState<any>([]);
    const [numOfPR, setNumOfPR] = useState(0);
    const [numOfLV, setNumOfLV] = useState(0);
    const [numOfSuggestions, setNumOfSuggestions] = useState(0);
    const [isPREdit, setIsPREdit] = useState(false);
    const [isLVEdit, setIsLVEdit] = useState(false);
    const [editCOASModal, setEditCOASModal] = useState(false);
    const [tab, setTab] = useState("press release");
    const [featuredImg, setFeaturedImg] = useState('');
    const [rawImg, setRawImg] = useState('');
    const [tabValue, setTabValue] = useState([
        "press release",
        "live events",
        "suggestions",
    ]);

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
            if (rawImg) {
                handleFileUpload(rawImg, 'imageURL')
            }

        }
    })

    // get COAS
    const { isFetching: isFetchingCOAS, onFetch: onFetchCOAS } = useFetch(
        "/army-staffs/sa/",
        (data, status) => {
            if (status === 200) {
                const _data = data.data;
                const results = _data.results;
                setCOAS(results[0]);
                // setCOAS(results.filter((coa: ArmyStaff) => coa.current)[0]);
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
        "/events/sa/list-live-webinars",
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

    const { onPost: uploadFile } = useFetch(
        '/files/upload',
        (data,) => {
            console.log(data);

            return data;
        },
        (error, status) => {
            const { message, ...err } = error;
            toast({
                title: `${message} (${status})`,
                description: err.errors.error_message,
                variant: 'destructive',
            })
        },
        {},
        {
            'Content-Type': 'multipart/form-data'
        }
    );

    const { onPut, isFetching: isLoadingEdit } = useFetch(
        `/army-staffs/sa/${COAS?.id}/edit`,
        (data) => {
            toast({ description: data.message });
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

    // get Suggestions

    useEffect(() => {
        onFetchCOAS();
        onFetchPR();
        onFetchLV();
    }, []);

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

    const handleFileUpload = async (file: string) => {
        // const file = e.target.files?.[0];

        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            await uploadFile(formData).then((res: any) => {
                console.log("AFTER UPLOAD", res);
            });
        }
    };

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
                                            <FeaturedImg setFeaturedImg={setFeaturedImg} setRawImg={setRawImg} featuredImg={featuredImg} />
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
                                            {formik.values.files && <FilesList files={formik.values.files} showDelete={true} />}

                                            <div className="flex items-start justify-between mt-6">
                                                <Button variant="blue" type='submit' className="px-10">
                                                    <label className="flex items-center justify-center gap-2 w-full h-full cursor-pointer text-white">
                                                        <div className="bg-white rounded">
                                                            <ArrowUpToLine className="text-blue" />
                                                        </div>
                                                        Upload Files
                                                        <input type="file" accept="*/" onChange={handleFileChange} className="hidden" />
                                                    </label>
                                                </Button>
                                                <Button variant="default" type='submit' className="px-10">
                                                    Update
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
                        tab === "press release" && (
                            <>
                                <SubHeader title="Press Release" number={`${numOfPR} Release`}>
                                    <CreatePressRelease isPREdit={isPREdit} />
                                </SubHeader>
                                <div className="grid lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
                                    {
                                        pressRelease.map(item => (
                                            <GridView key={item.title} title={item.title} date={item.date} image={item.image} />
                                        ))
                                    }
                                </div>
                            </>
                        )
                    }
                    {
                        tab === "live events" && (
                            <>
                                <SubHeader title="Live Events" number={`${numOfPR} Events`} >
                                    <CreateLiveEvents isLVEdit={isLVEdit} />
                                </SubHeader>
                                <div className="grid lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
                                    {
                                        liveEvents.map(item => (
                                            <GridView key={item.title} title={item.title} image={item.image} />
                                        ))
                                    }
                                </div>

                            </>
                        )
                    }
                    {
                        tab === "suggestions" && <SubHeader title="Suggestions" />
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

export default ChiefOfArmyStaff;

const GridView = ({ title, date, image }: any) => {
    return (
        <div
            key={"id"}
            className="relative rounded-lg border overflow-hidden grid grid-cols-2 h-40 bg-foreground/5"
        >
            <img className='w-32 max-h-full min-h-full object-center object-cover' src={image} alt="" />

            <div className=" p-5 w-full flex flex-col justify-between">
                <h1 className="text-lg line-clamp-2 mb-5"> {title} </h1>

                <div className="flex justify-between items-center border">
                    <h1 className="text-sm opacity-50"> {date ? format(date, ' MMM dd, yyyy') : ''} </h1>

                    <Button size={"sm"} className="flex gap-3">
                        <Pencil />
                        Edit
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

export const FeaturedImg = ({ setFeaturedImg, setRawImg, featuredImg }: { setFeaturedImg: (img: string) => void, setRawImg: (img: string) => void, featuredImg: string }) => {

    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        setPreview(featuredImg)
    }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                setFeaturedImg(reader.result as string);
                setRawImg(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUnset = () => {
        setFeaturedImg('');
        setRawImg('');
        setPreview(null);
        const fileInput = document.getElementById('featImg') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    }

    return (
        <div className="max-w-full w-full h-64 rounded border flex items-center justify-center bg-black/30">
            {preview ? (
                <div
                    onClick={handleUnset}
                    style={{ backgroundImage: `url(${preview})` }}
                    className="max-w-full w-full h-full rounded border flex items-center justify-center bg-cover bg-center"
                />
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-white">
                    <ImageUpIcon className='mx-auto scale-125' />
                    <div className="mt-2">Featured Image</div>
                    <input id="featImg" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
            )}
        </div>
    );
};