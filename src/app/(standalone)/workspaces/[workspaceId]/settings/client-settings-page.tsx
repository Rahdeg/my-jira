"use client"

import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { Loader, TriangleAlertIcon } from "lucide-react";


export const ClientSettingsPage = () => {
    const workspaceId = useWorkspaceId();
    const { data: initialValues, isLoading } = useGetWorkspace({ workspaceId });



    if (isLoading) {
        return (<div className=' h-full flex items-center justify-center'>
            <Loader className=' size-6 animate-spin text-muted-foreground' />
        </div>)
    }



    if (!initialValues) {
        return (
            <div className=' h-full flex items-center justify-center'>
                <TriangleAlertIcon className=' size-6  text-muted-foreground' />
            </div>
        )
    }








    return (
        <div className="w-full lg:max-w-xl">
            <EditWorkspaceForm initialValues={initialValues} />

        </div>
    )
}
