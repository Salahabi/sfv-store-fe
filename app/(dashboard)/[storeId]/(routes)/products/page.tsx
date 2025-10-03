import { format } from 'date-fns'
import prismadb from '@/lib/prismadb'
import { ProductClient } from './components/client'
import { ProductColumn } from './components/columns'
import { formatter } from '@/lib/utils'

const ProductsPage = async ({ 
    params
}: { 
    params: Promise<{ storeId: string }>
}) => {

    const { storeId } = await params;
    const products = await prismadb.product.findMany({
        where: {
            storeId: storeId,
        },
        include: {
            category: true,
            size: true,
            color: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    // DEBUG: Log products and their categories
    console.log('=== PRODUCTS DEBUG ===');
    console.log('Total products found:', products.length);
    products.forEach((product, index) => {
        console.log(`Product ${index + 1}:`, {
            name: product.name,
            categoryId: product.categoryId,
            categoryName: product.category?.name,
            category: product.category
        });
    });
    
    // DEBUG: Log unique categories
    const uniqueCategories = Array.from(new Set(products.map(p => p.category?.name)));
    console.log('Unique categories found:', uniqueCategories);

    const formattedProducts: ProductColumn[] = products.map(item => ({
        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price: formatter.format(Number(item.price)),
        category: item.category.name,
        size: item.size.name,
        color: item.color.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <ProductClient data={formattedProducts} />
            </div>
        </div>
    )
}

export default ProductsPage;