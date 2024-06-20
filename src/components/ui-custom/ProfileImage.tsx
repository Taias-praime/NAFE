import { ImageUpIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const ProfileImage = ({ setFeaturedImg, setRawImg, featuredImg, deleteImage }: { setFeaturedImg: (img: string) => void, setRawImg: (img: string) => void, featuredImg: string, deleteImage?: () => void }) => {

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
                setRawImg(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-full w-full h-64 rounded flex items-center justify-center bg-black/30 relative">
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-white">
                <div
                    style={{ backgroundImage: `url(${preview})` }}
                    className="max-w-full w-full h-full rounded flex items-center justify-center bg-cover bg-center"
                />
                <div className="absolute">
                    <ImageUpIcon className='mx-auto scale-125' />
                    <div className="">
                        {
                            preview ? 'Change ProfileImage' : 'Upload ProfileImage'
                        }
                    </div>
                </div>

                <input id="featImg" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            {
                preview && (
                    <div onClick={deleteImage} className="absolute right-2 top-1 bg-white p-2 rounded-full">
                        <Trash2 className="text-red-600" />
                    </div>
                )
            }

        </div>
    );
};

export default ProfileImage;