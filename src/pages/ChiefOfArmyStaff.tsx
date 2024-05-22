import { Button } from "../components/ui/button"
import { Skeleton } from "../components/ui/skeleton";
import { FilesList } from "../components/ui-custom/files";
import { PencilLine } from "lucide-react"
import { HEADER_HEIGHT, USER_PLACEHOLDER_IMG_URL } from "../lib/utils"
import { useEffect, useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import useFetch from "../hooks/useFetch";
import { useToast } from "../components/ui/use-toast";

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


const ChiefOfArmyStaff = () => {

    const [COAS, setCOAS] = useState<ArmyStaff | null>(null);

    const { toast } = useToast();

    
    // get COAS
    const { isFetching: isFetchingCOAS, onFetch: onFetchCOAS } = useFetch(
        '/army-staffs/sa/',
        (data, status) => {
            if (status === 200) {
                const _data = data.data;
                const results = _data.results;
                setCOAS(results.filter((coa: ArmyStaff) => coa.current)[0])
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


    useEffect(() => {
        onFetchCOAS();
    }, [])


  return (
      <div className="overflow-y-auto bg-foreground/5 grid md:grid-cols-[400px_1fr]" style={{
        height: `calc(100vh - ${HEADER_HEIGHT}px)`
    }}>
        <aside className="col-span-1 border-r p-10 bg-white">

            {
                 isFetchingCOAS 
                    ? <SkeletonCard />
                    :
                    (
                        COAS &&
                        <div className="flex flex-col gap-5">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <object className="rounded-lg w-full" data={USER_PLACEHOLDER_IMG_URL} type="image/png">
                                            <img className="rounded-lg w-full"  src={ COAS.image || USER_PLACEHOLDER_IMG_URL } />
                                        </object>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{ COAS.fullname }</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <div className="">
                                <Button size={'sm'} className="flex gap-3 px-5"> <PencilLine /> Edit </Button>
                            </div>

                            <div className="overflow-hidden mb-10">
                                <h1 className="text-2xl truncate mb-2"> { COAS.fullname } </h1>
                                <p className="opacity-50 mb-5"> { COAS.title } </p>
                                <p className="line-clamp-6">
                                    { COAS.description }
                                </p>
                            </div>
                        </div> 
                    )
            }

            {/* List of files */}
            {
                COAS?.files.length &&
                <FilesList files={COAS.files} />
            }
        </aside>
    </div>
  )
}


const SkeletonCard = () => {
    return (
        <div className="flex flex-col space-y-3 mb-10">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <div className="space-y-4">
                <Skeleton className="h-10 w-[100px]" /> {/* edit button */}
                <Skeleton className="h-5 w-full max-w-[300px]" />  {/* COA Name */}
                <Skeleton className="h-4 w-[150px]" /> {/* COA Position */}
                <br />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
            </div>
        </div>
    )
}

export default ChiefOfArmyStaff