"use client"

import { useGetProject } from "@/features/projects/api/use-get-project";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { Loader, TriangleAlertIcon } from "lucide-react";


export const ClientSettingsPage = () => {
    const workspaceId = useWorkspaceId();
    const projectId = useProjectId();
    const { data: initialValues, isLoading } = useGetProject({
        projectId
    });



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
            <EditProjectForm initialValues={initialValues} />

        </div>
    )
}
