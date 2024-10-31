import { getCurrent } from "@/features/auth/queries";
import { WorkspaceClientPage } from "./workspace-client-page"
import { redirect } from "next/navigation";


const WorkspacesIdPage = async () => {
    const user = await getCurrent();


    if (!user) redirect("/sign-in");


    return <WorkspaceClientPage />;
}

export default WorkspacesIdPage