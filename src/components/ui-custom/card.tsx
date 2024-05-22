import { cn } from "../../lib/utils";
import { ICard } from "../../models/interfaces";
import { Button } from "../ui/button";
import AddEvent from "./addEvent";

const Card = ({
    img,
    cta,
    stat,
    title,
    ctaIcon,
    className = '',
    // type = 'default',
}: ICard) => {
    return (
        <div className={cn("bg-background/70 min-h-[200px] w-full px-5 2xl:px-10 py-5 flex items-center justify-between overflow-hidden rounded", className)}>
            <div className="z-10">
                
                {cta && <Button className="p-0" size={"sm"}> <AddEvent className="flex gap-3 p-3"> {ctaIcon} {cta} </AddEvent> </Button>}
                {title && <p className="mb-10"> {title} </p>}
                {!!stat?.toString() && <span className="stat text-4xl font-extrabold"> {stat} </span>}
            </div>

            <div className="">
                {
                    img && (
                        (typeof (img) === 'string')
                            ? <img className="w-full min-w-[130px] max-w-[180px]" src={img} alt="" />
                            : img
                    )
                }
            </div>
        </div>
    )
}

export default Card;