"use client"

import { useState, useEffect } from 'react'
import * as z from 'zod'
import { Category, Color, Image, Product, Size } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/alert-modal';
import ImageUpload from '@/components/ui/image-upload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';


// Create a type that replaces Decimal with number
type ProductWithNumber = Omit<Product, 'price'> & {
    price: number;
};

interface ProductFromProps {
    initialData: ProductWithNumber & {
        images: Image[]
    } | null;
    categories: Category[]
    colors: Color[]
    sizes: Size[]
}


// Define a type for the image structure
// type ImageType = {
//     id?: string;
//     productId?: string;
//     url: string;
//     createdAt?: Date;
//     updatedAt?: Date;
// };


// Define proper types
interface ImageType {
    id?: string;
    productId?: string;
    url: string;
    createdAt?: Date;
    updatedAt?: Date;
}


const formSchema = z.object({
    name: z.string().min(1),
    images: z.array(z.object({
        id: z.string().optional(),
        productId: z.string().optional(),
        url: z.string(),
        createdAt: z.date().optional(),
        updatedAt: z.date().optional()
    })).nonempty("At least one image is required."),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional()
});


type ProductFormValues = z.infer<typeof formSchema>;

export const ProductForm: React.FC<ProductFromProps> = ({
    initialData,
    categories,
    colors,
    sizes
}) => {
    useEffect(() => {
        console.log("Initial Data received:", initialData);
        if (initialData?.images) {
            console.log("Initial images:", initialData.images);
        }
    }, [initialData]);
    

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit product' : 'Create product'
    const description = initialData ? 'Edit a product' : 'Add a new product'
    const toastMessage = initialData ? 'Product updated.' : 'Product created.'
    const action = initialData ? 'Save changes' : 'Create'


    // Create a state to ensure images persistence
    const [currentImages, setCurrentImages] = useState<ImageType[]>(initialData?.images || []);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,

            images: currentImages,  // Keep the full image objects

            price: parseFloat(String(initialData?.price)), // This ensures proper conversion from Decimal
        } : {
            name: '',
            images: [],
            price: 0,
            categoryId: '',
            colorId: '',
            sizeId: '',
            isFeatured: false,
            isArchived: false,
        }
    });

    // Update form whenever currentImages changes
    // Type-safe form update
    // Update form with proper type casting
    useEffect(() => {
        // Cast the images array to any to bypass the tuple type check
        form.setValue('images', currentImages as any, { 
            shouldValidate: true,
            shouldDirty: true 
        });
    }, [currentImages, form]);

    
    // useEffect(() => {
    //     const imagesArray: ImageType[] = currentImages;
    //     form.setValue('images', imagesArray, { 
    //             shouldValidate: true,
    //             shouldDirty: true
    //         });
    // }, [currentImages, form]);




    useEffect(() => {
        console.log("Current form values:", form.getValues());
        console.log("Current images state:", currentImages);
    }, [currentImages, form]);


    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true);

            if (currentImages.length === 0) {
                toast.error("At least one image is required.");
                return;
            }


            // Strip additional properties
            const sanitizedData = {
            ...data,
            images: data.images.map((image) => ({ url: image.url })),
            };


            if (initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, sanitizedData)
            } else {
                await axios.post(`/api/${params.storeId}/products`, sanitizedData)
            }
            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success(toastMessage)
        } catch(err) {
            toast.error("Something went wrong." );
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
            router.refresh();
            router.push(`/${params.storeId}/products`)
            toast.success("Product deleted.")
        } catch(err) {
            toast.error("Something Went Wrong.");
        } finally {
            setLoading(false)
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {initialData && (
                    <Button variant="destructive" size="sm" onClick={() => setOpen(true)} disabled={loading}>
                        <Trash className="w-4 h-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Images</FormLabel>
                        <FormControl>
                            <ImageUpload
                                value={currentImages.map(image => image.url)}
                                disabled={loading}
                                onChange={(urls: string[]) => {
                                    // Prevent duplicates by checking existing URLs
                                    const existingUrls = new Set(currentImages.map(img => img.url));
                                    const newUniqueImages: ImageType[] = urls
                                        .filter(url => !existingUrls.has(url))       
                                        .map(url => ({
                                            url: url,
                                            productId: initialData?.id,
                                            createdAt: new Date(),
                                            updatedAt: new Date()
                                        }));
                                    setCurrentImages(prevImages => [...prevImages, ...newUniqueImages]);
                                }}
                                onRemove={(url: string) => {
                                    setCurrentImages(prevImages => 
                                        prevImages.filter(image => image.url !== url)
                                    );
                                }}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField
                            control={form.control} 
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Product Name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control} 
                            name="price"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder='Product Price' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control} 
                            name="categoryId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder='Select a Category'
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map(category => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control} 
                            name="sizeId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Size</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder='Select a size'
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sizes.map(size => (
                                                <SelectItem key={size.id} value={size.id}>
                                                    {size.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control} 
                            name="colorId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder='Select a color'
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {colors.map(color => (
                                                <SelectItem style={{ display: 'flex' }} key={color.id} value={color.id}>
                                                    <span style={{ color: color.value }}>{color.name}</span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control} 
                            name="isFeatured"
                            render={({field}) => (
                                <FormItem className='flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md'>
                                    <FormControl>
                                        <Checkbox
                                            // @ts-ignore
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className='space-y-1 leading-none'>
                                        <FormLabel>
                                            Featured
                                        </FormLabel>
                                        <FormDescription>
                                            The product will appear on the home page.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control} 
                            name="isArchived"
                            render={({field}) => (
                                <FormItem className='flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md'>
                                    <FormControl>
                                        <Checkbox
                                            // @ts-ignore
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className='space-y-1 leading-none'>
                                        <FormLabel>
                                            Archived
                                        </FormLabel>
                                        <FormDescription>
                                            The product will appear anywhere in the store.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>{action}</Button>
                </form>
            </Form>
            {/* <Separator /> */}
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="text-sm font-medium">Current Images Count: {currentImages.length}</p>
                <pre className="mt-2 text-xs">
                    {JSON.stringify(currentImages, null, 2)}
                </pre>
            </div>
        </>
    )
}





// <ImageUpload
//     value={field.value.map((image) => image.url)} // Pass array of URLs
//     disabled={loading}
//     onChange={(urls: string[]) => {
//         // Convert array of URLs to array of objects with `url` property
//         field.onChange(urls.map((url) => ({ url })));
//     }}
//     onRemove={(url: string) => {
//         // Remove the URL from the array
//         field.onChange(field.value.filter((image) => image.url !== url));
//     }}
// />