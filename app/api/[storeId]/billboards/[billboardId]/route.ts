import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextFetchEvent, NextResponse } from "next/server";

export async function GET(
    //although it is not used but it has to be here as DELET use the second argument
    req: Request,
    props: { params: { billboardId: string }}
) {
    const { params } = props;
    try {
        // const {storeId} = await params
        
        if(!params.billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 });
        }

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId,
            }
        });
        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLOARD_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function PATCH(
    //although it is not used but it has to be here as DELET use the second argument
    req: Request,
    props: { params: Promise<{ storeId: string, billboardId: string }>}
) {
    const params = await props.params;
    try {
        const { userId } = await auth();
        const body = await req.json();

        // const { billboardId } = await params;
        
        const { label,imageUrl } = body;
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        if (!label) {
            return new NextResponse("Label is required", { status: 400});
        }
        if (!imageUrl) {
            return new NextResponse("Image url is required", { status: 400});
        }


        if(!params.billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 })
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403});
        }

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl
            }

        });
        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARD_PATCH]', error);
        return new NextResponse("Internal error", { status: 500});

    }
};

export async function DELETE(
    //although it is not used but it has to be here as DELET use the second argument
    req: Request,
    props: { params: Promise<{ storeId: string, billboardId: string }>}
) {
    const params = await props.params;
    try {
        const { userId } = await auth();
        // const {storeId} = await params
        
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403});
        }

        if(!params.billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403});
        }

        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardId,
            }
        });
        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLOARD_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};