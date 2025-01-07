"use client"

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, Trash } from 'lucide-react';
import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string[]) => void; // Accept an array of URLs
    onRemove: (value: string) => void;
    value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value,
}) => {

    const [isMounted, setIsMounted] = useState(false);

    const [cummulativeUrls, setCummulativeUrls] = useState<string[]>([]);

    useEffect(() => {
        setIsMounted(true);
        console.log("set Is Mounted..............."); 
    }, [])
    
     // Update the parent component whenever cummulativeUrls changes
     useEffect(() => {
        onChange(cummulativeUrls);
        console.log("Image cummulativeUrls length:", cummulativeUrls.length); // Log the image URLs
    }, [cummulativeUrls]); // Trigger when cummulativeUrls changes

    const onSuccess = (result: any) => {
        console.log("Cloudinary result:", result);

        if (result.event === "success") {
            const newUrl = result.info.secure_url;
            if (newUrl && typeof newUrl === "string") {
                // Update cummulativeUrls with the new URL
                setCummulativeUrls((prevUrls) => [...prevUrls, newUrl]);
            } else {
                console.error("Invalid image URL:", newUrl);
            }
        }
    };

    useEffect(() => {
        console.log("Image URLs length:", value.length); // Log the image URLs
    }, [value]);


    // const onSuccess = (result: any) => {

    //     console.log("Cloudinary result:", result); // Log the result object

    //     // Handle multiple uploaded files
    //     if (result.event === "success") {
    //         // Extract the secure URL of the uploaded image
    //         const newUrl = result.info.secure_url;
    
    //         // Ensure the URL is valid before adding it to the array
    //         if (newUrl && typeof newUrl === "string") {
    //             onChange([...value, newUrl]);
    //         } else {
    //             console.error("Invalid image URL:", newUrl);
    //         }
    //     }
    // };

    if (!isMounted) {
        return null;
    }


    return (
        <div>
            <div className='mb-4 flex items-center gap-4'>
                {value
                    .filter((url) => url && typeof url === "string") // Filter out invalid URLs
                    .map((url) => (
                    <div 
                        key={url} 
                        className='relative w-[200px] h-[200px] rounded-md overflow-hidden'
                    >
                        <div className='z-10 absolute top-2 right-2'>
                            <Button 
                                type='button' 
                                onClick={() => onRemove(url)} 
                                variant="destructive" 
                                size="icon"
                            >
                                <Trash className='w-4 h-4'/>
                            </Button>
                        </div>
                        <Image 
                            fill 
                            className='object-cover' 
                            alt='Image' 
                            src={url} 
                        />
                    </div>
                ))}
            </div>
            <CldUploadWidget 
                onSuccess={onSuccess} 
                uploadPreset='npqshzol'
                options={{
                    multiple: true, // Enable multiple file uploads
                    maxFiles: 10, // Optional: Limit the number of files
                  }}
            >
                {({ open }) => {
                    const onClick = () => {
                        open();
                    }

                    return (
                        <Button 
                            type='button' 
                            disabled={disabled} 
                            variant={'secondary'} 
                            onClick={onClick}
                        >
                            <ImagePlus className='h-4 w-4 mr-2' />
                            Upload an Image
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </div>
    )
};

export default ImageUpload