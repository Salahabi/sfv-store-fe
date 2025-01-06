import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/product-form";


import { Product } from "@prisma/client";
// Create a type helper if needed
type ProductWithNumber = Omit<Product, 'price'> & {
    price: number;
};

const ProductPage = async ({ params }: { params: Promise<{ productId: string, storeId: string }> }) => {
    const { storeId, productId } = await params;
    const product = await prismadb.product.findUnique({ 
        where: {
            id: productId
        },
        include: {
            images: true
        }
    });
    // Convert Decimal to number before passing to client component
    const formattedProduct = product ? {
        ...product,
        price: parseFloat(product.price.toString())
    } : null;

    const categories = await prismadb.category.findMany({
        where: {
            storeId: storeId
        },
    })

    const sizes = await prismadb.size.findMany({
        where: {
            storeId: storeId
        },
    })

    const colors = await prismadb.color.findMany({
        where: {
            storeId: storeId
        },
    })

    console.log("Type of product.price is: ", typeof product?.price, " and value is: ", product?.price);


    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <ProductForm
                    initialData={formattedProduct}
                    colors={colors}
                    sizes={sizes}
                    categories={categories}
                />
            </div>
        </div>
    )
}

export default ProductPage;