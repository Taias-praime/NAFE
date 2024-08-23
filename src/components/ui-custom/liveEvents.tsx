import { Pencil } from "lucide-react";
import CreateLiveEvents from "./createLiveEvents";
import { Button } from "../ui/button";
import { format } from "date-fns";


// interface PressReleaseProps {
//     title: string;
//     date: string;
// }

const LiveEvents = ({ title, date, image, lvId, id, setReload, isLVEdit }: any) => {
    return (
        <div key={id} className="relative rounded-lg border overflow-hidden flex h-40 bg-foreground/5 max-w-100">
            <img className='w-32 h-full object-center object-cover' src={image} alt="" />
            <div className=" p-5">
                <h1 className="text-lg line-clamp-2 mb-5 text-ellipsis overflow-hidden"> {title} </h1>
                <div className="flex gap-3 justify-between items-center">
                    <h1 className="text-sm opacity-50 text-ellipsis  "> {date ? format(date, ' MMM dd, yyyy') : ''} </h1>
                    <CreateLiveEvents id={lvId} setReload={setReload} isLVEdit={isLVEdit} title="Create Live Event"  label={
                        <Button size={"sm"} className="flex gap-2" >
                            <Pencil className="w-4 h-4" /> <span className="text-sm">Edit</span>
                        </Button>
                    } />

                </div>
            </div>
        </div>
    );
};

export default LiveEvents;