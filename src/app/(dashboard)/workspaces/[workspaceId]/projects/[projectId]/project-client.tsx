"use client"

import { Button } from "@/components/ui/button";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useProjectId } from "@/features/projects/hooks/use-project-id"
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { Loader, PencilIcon, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";

export const ProjectClient = () => {
    const projectId = useProjectId();
    const { data: project, isLoading } = useGetProject({ projectId });


    if (isLoading) {
        return (<div className=' h-full flex items-center justify-center'>
            <Loader className=' size-6 animate-spin text-muted-foreground' />
        </div>)
    }



    if (!project) {
        return (
            <div className=' h-full flex items-center justify-center'>
                <TriangleAlertIcon className=' size-6  text-muted-foreground' />
            </div>
        )
    }


    return (
        <div className=" flex flex-col gap-y-4">
            <div className=" flex items-center justify-between">
                <div className=" flex items-center gap-x-2">
                    <ProjectAvatar name={project.name} image={project.imageUrl} className=" size-8" />
                    <p className=" text-lg font-semibold">{project.name} </p>
                </div>
                <div>
                    <Button variant="secondary" size="sm" asChild>
                        <Link href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}>
                            <PencilIcon className=" size-4 mr-2" />
                            Edit Project
                        </Link>
                    </Button>
                </div>
            </div>
            <TaskViewSwitcher />
        </div>
    )
}
