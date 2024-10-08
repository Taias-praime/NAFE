import { ImageUpIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import ErrorMessage from "../ui/error";

interface ProfileImageProps {
    setFeaturedImg: (img: string) => void;
    featuredImg: string;
    deleteImage?: () => void;
    disabled?: boolean
    error?: string
    height?: string;
}

const ProfileImage = ({ setFeaturedImg, featuredImg, deleteImage, disabled, error, height = "h-72" }: ProfileImageProps) => {

    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        setPreview(featuredImg)
    }, [featuredImg])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                setFeaturedImg(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <div className={`max-w-full w-full rounded flex items-center justify-center bg-black/30 relative ${height} `}>
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-white">
                    <div style={{ backgroundImage: `url(${preview})` }}
                        className="max-w-full w-full h-full rounded flex items-center justify-center bg-cover bg-center"
                    />
                    {
                        !disabled && (
                            <div className="absolute">
                                <ImageUpIcon className='mx-auto scale-125' />
                                <div className=""> {preview ? 'Change Profile Image' : 'Upload Profile Image'}     </div>
                            </div>
                        )
                    }
                    <input disabled={disabled} id="featImg" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
                {
                    preview && !disabled && (
                        <div onClick={deleteImage} className="absolute right-2 top-1 bg-white p-2 rounded-full">
                            <Trash2 className="text-red-600" />
                        </div>
                    )
                }
            </div>
            <ErrorMessage error={error} />
        </>
    );
};

export default ProfileImage;