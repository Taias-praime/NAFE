import { Button } from "../components/ui/button"
import { Skeleton } from "../components/ui/skeleton";
import { FilesList } from "../components/custom/files";
import { PencilLine } from "lucide-react"
import { HEADER_HEIGHT, USER_PLACEHOLDER_IMG_URL } from "../lib/utils"
import { useEffect, useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import ArmyGeneral from '/images/general.jpg';

const ChiefOfArmyStaff = () => {

    const name = "LT. General P.A. Adortey Korley";
    const [profileImg, setProfileImg] = useState<string>('');

    useEffect(() => {
        setTimeout(() => setProfileImg(ArmyGeneral), 1000)
    }, [])


  return (
      <div className="overflow-y-auto bg-foreground/5 grid md:grid-cols-[400px_1fr]" style={{
        height: `calc(100vh - ${HEADER_HEIGHT}px)`
    }}>
        <aside className="col-span-1 border-r p-10 bg-white">

            {
                profileImg 
                    ? <div className="flex flex-col gap-5">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <img className="rounded-lg" src={profileImg || USER_PLACEHOLDER_IMG_URL} />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{name}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <div className="">
                            <Button size={'sm'} className="flex gap-3 px-5"> <PencilLine /> Edit </Button>
                        </div>

                        <div className="overflow-hidden mb-10">
                            <h1 className="text-2xl truncate mb-2"> {name} </h1>
                            <p className="opacity-50 mb-5"> Chief of Army Staff </p>
                            <p className="line-clamp-6">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt sint exercitationem dolorum, similique molestiae corporis veritatis ea ullam laudantium qui earum impedit officia placeat mollitia nobis ab voluptas velit voluptatum? lorem
                            </p>
                        </div>
                    </div>
                    : <SkeletonCard />
            }

            {/* List of files */}
            <FilesList />
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