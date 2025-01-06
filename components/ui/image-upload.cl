"use client"

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, Trash } from 'lucide-react';
import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string[]) => void; // Changed to accept string array
    onRemove: (value: string) => void;
    value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value = [] // Ensure default value
}) => {

    const [isMounted, setIsMounted] = useState(false);

    // Then, place all useEffect hooks together
    useEffect(() => {
        console.log("Current value state:", value);
    }, [value]);




    useEffect(() => {
        setIsMounted(true);
    }, [])
    
    const onSuccess = (result: any) => {




        // Debug log to see the full result
        console.log("Upload Result:", result);
        // Ensure we're working with the correct structure. Handle both single and multiple uploads
        const uploadResults = Array.isArray(result.info) ? result.info : [result.info];
    
        // Extract the secure_url directly
        const newUrl = uploadResults[0].secure_url;
        // const newUrls = uploadResults
        // .map((upload: { secure_url: string }) => upload.secure_url)
        // .filter((url: string) => !value.includes(url)); // Prevent duplicates






        // Just pass the URL string - the parent component will handle the object structure
        onChange(newUrl);

        //onChange([...value, ...newUrl]);
        //onChange(result.info.secure_url);
    }
    // const onSuccess = (result: any) => {
    //     // Check if result is an array
    //     if (Array.isArray(result)) {
    //         const urls = result.map(item => item.info.secure_url);
    //         onChange(urls);
    //     } else {
    //         onChange([result.info.secure_url]);
    //     }
    // }
    if (!isMounted) {
        return null;
    }

    return (
        <div>
            <div className='mb-4 flex items-center gap-4 flex-wrap'>
                {value.map((url) => {
                    console.log("URL: ", url); // Debug log
                    return url && (
                        <div key={url} className='relative w-[200px] h-[200px] rounded-md overflow-hidden'>
                            <div className='z-10 absolute top-2 right-2'>
                                <Button 
                                    type='button' 
                                    onClick={() => onRemove(url)} 
                                    variant="destructive" 
                                    size="icon">
                                    <Trash className='w-4 h-4'/>
                                </Button>
                            </div>
                            <Image 
                                fill 
                                className='object-cover' 
                                alt='Image' 
                                src={url} 
                                sizes="(max-width: 200px) 100vw, 200px"
                            />
                        </div>
                    );
                })}
            </div>
            <CldUploadWidget 
                onSuccess={onSuccess} 
                uploadPreset='npqshzol'
                options={{
                    maxFiles: 5,
                    multiple: true,
                    resourceType: 'image',
                    clientAllowedFormats: ['image'],
                    maxImageFileSize: 5000000 // 5MB
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