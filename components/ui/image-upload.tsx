
"use client";

import exp from "constants";
import { useEffect, useState } from "react";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";


import { Button } from "@/components/ui/button";
import { CldUploadWidget } from "next-cloudinary"; // Replace "some-library" with the actual library name



interface ImageUploadProps { 
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
}
const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value
}) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);

    }, []);

    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    }
    // const onRemoveImage = (url: string) => {
    //     onRemove(url);
    // }

    if(!isMounted) {
        return null;
    }

                                                                                            
  return (                                                    
   <div>
    <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (       //p-2 bg-white bg-opacity-50 rounded-bl-md
            <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                <div className="z-10 absolute top-2 right-2 "> 
                    <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                        <Trash className="h-4 w-4"/>
                    </Button>
                </div>
                    <Image 
                    fill
                    className="object-cover"
                    alt="Image"
                    src={url}
                    />
            </div>
        ))}
    </div>
    <CldUploadWidget 
        onSuccess={onUpload} 
        uploadPreset="npqshzol"
        options={{
            maxFiles: 5,
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        }}
        >
        {({ open }) => {
            const onClick = () => {
                open();
            }
            return (
                <Button 
                type="button"
                disabled={disabled} 
                variant="secondary"
                onClick={onClick} 
                >
                    <ImagePlus className="h-4 w-4 mr-2"/>
                    Upload an Image
                </Button>   
            );
        }
        }
    </CldUploadWidget>
   </div>          
  );                                                             
}

export default ImageUpload;