// components/navbar-server.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import NavbarClient from "./navbar-client";

export default async function NavbarServer() {
    const { userId } = await auth();

    if(!userId) {
        redirect("/sign-in");
    }

    const stores = await prismadb.store.findMany({
        where: {
            userId,
        },
    });
    
    return <NavbarClient stores={stores} />;
}