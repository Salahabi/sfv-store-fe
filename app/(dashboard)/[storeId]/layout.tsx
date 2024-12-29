import { auth } from '@clerk/nextjs/server';
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import Navbar from "@/components/navbar";

import React from "react";

export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: {storeId: string}
}) {
    const {userId} = await auth();

    if (!userId) {
        redirect('/sign-in')
    }

    const { storeId } = await params; // Await params before accessing storeId


    if (!storeId) {
        redirect("/");
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: storeId,
            userId
        }
    });

    if (!store) {
        redirect('/')
    }

    return (
        <>
        <Navbar />
        {children}
        </>
    );
};