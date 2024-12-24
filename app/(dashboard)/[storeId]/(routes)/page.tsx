import prismadb from "@/lib/prismadb";
import React from "react";

interface DashboardPageProps {
    params: {storeId: String}
};
const DashboardPage: React.FC<DashboardPageProps> = async ( {
    params
}) => {
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId
        }

    });

    return (
        <div>
            Activate Store: {store?.name}
        </div>
    );
}
export default DashboardPage;