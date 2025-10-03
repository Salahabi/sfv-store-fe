
import { UserButton } from "@clerk/nextjs";
import { auth } from '@clerk/nextjs/server';
import { redirect } from "next/navigation";

import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import { Store } from "lucide-react";

import prismadb from "@/lib/prismadb";
import { ThemeToggle } from "@/components/theme-toggle";

const Navbar = async () => {
    const { userId} = await auth();

    if(!userId) {
        redirect("/sign-in");
    }

    const stores = await prismadb.store.findMany({
        where: {
            userId,
        },
    });
    
    return ( 
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                    <StoreSwitcher items={stores} />
                    <div>
                        <MainNav className="mx-6"/>
                </div>
                <div className="ml-auto flex items-center space-x-4">
                    <ThemeToggle />
                <UserButton {...{
                    afterSignOutUrl: "/"
                    } as const} />
                    
                    </div>       
            </div>
        </div>
     );
}
 
export default Navbar;