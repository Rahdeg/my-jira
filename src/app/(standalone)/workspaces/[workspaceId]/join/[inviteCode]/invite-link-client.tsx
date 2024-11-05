"use client"

import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info"
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader, TriangleAlertIcon } from "lucide-react";

export const InviteLinkClient = () => {
    const workspaceId = useWorkspaceId();

    const { data, isLoading } = useGetWorkspaceInfo({ workspaceId });


    if (isLoading) {
        return (<div className=' h-full flex items-center justify-center'>
            <Loader className=' size-6 animate-spin text-muted-foreground' />
        </div>)
    }



    if (!data) {
        return (
            <div className=' h-full flex items-center justify-center'>
                <TriangleAlertIcon className=' size-6  text-muted-foreground' />
            </div>
        )
    }

    return (
        <div>
            <JoinWorkspaceForm initialValues={data} />
        </div>
    )
}
