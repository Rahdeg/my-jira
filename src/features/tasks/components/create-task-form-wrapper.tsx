import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetprojects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import { CreateTaskForm } from "./create-task-form";
import { TaskStatus } from "../types";

interface CreateTaskFormWrapperProps {
    onCancel: () => void;
    initialValue?: TaskStatus | null;
}

export const CreateTaskFormWrapper = ({ onCancel, initialValue }: CreateTaskFormWrapperProps) => {

    const workspaceId = useWorkspaceId();
    const { data: projects, isLoading: loadingProjects } = useGetprojects({ workspaceId });
    const { data: members, isLoading: loadingMembers } = useGetMembers({ workspaceId });

    const projectOptions = projects?.documents.map((project) => ({
        id: project.$id,
        name: project.name,
        imageUrl: project.imageUrl,
    }));

    const memberOptions = members?.documents.map((member) => ({
        id: member.$id,
        name: member.name,
    }));

    const isLoading = loadingProjects || loadingMembers;

    if (isLoading) {
        <Card className=" w-full h-[714px] border-none shadow-none">
            <CardContent className=" flex items-center  justify-center h-full">
                <Loader className=" size-5 animate-spin text-muted-foreground" />
            </CardContent>
        </Card>
    }


    return (
        <CreateTaskForm onCancel={onCancel} projectOptions={projectOptions ?? []} memberOptions={memberOptions ?? []} initialValue={initialValue} />
    )
}
