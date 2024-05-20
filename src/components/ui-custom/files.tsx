import { Paperclip } from "lucide-react"

export const FilesList = () => {
    return (
        <ul className="flex flex-col gap-4">
            <FileItem />
            <FileItem />
        </ul>
    )
}

export const FileItem = () => {
    return (
        <li className="py-3 px-5 bg-muted grid grid-cols-[30px_1fr] items-center gap-3 rounded-lg overflow-hidden min-h-16">
            <div className="text-center">
                <Paperclip className="text-foreground" size={25} />
            </div>
            <p className="line-clamp-2"> Lorem ipsum dolor sit amet. </p>
        </li>
    )
}
