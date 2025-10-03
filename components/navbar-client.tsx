// components/navbar-client.tsx
"use client"

import { UserButton } from "@clerk/nextjs";
import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Store } from "@prisma/client";

export default function NavbarClient({ stores }: { stores: Store[] }) {
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