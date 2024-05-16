import { LoaderCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ProfileImg = ({ url, className = '' }: { url: string, className?: string }) => {
    return (
        <Avatar className={className + ' border-2 border-background'}>
            <AvatarImage className="bg-background/20 backdrop-blur-md" src={url} />
            <AvatarFallback className="">
                <LoaderCircle className="animate-spin" />
            </AvatarFallback>
        </Avatar>
    );
}

export default ProfileImg;