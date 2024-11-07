import { MoreHorizontal } from "lucide-react";
import { Task } from "../types"
import { TaskAction } from "./task-action";
import { DottedSeparator } from "@/components/dotted-separator";
import { MemberAvatar } from "@/features/members/components/member-avatar";

interface KanbanCardProps {
    task: Task;
}

export const KanbanCard = ({ task }: KanbanCardProps) => {
    return (
        <div className=" bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
            <div className=" flex items-start justify-between gap-x-2">
                <p>{task.name}</p>
                <TaskAction id={task.$id} projectId={task.projectId}>
                    <MoreHorizontal className=" size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
                </TaskAction>
            </div>
            <DottedSeparator />
            <div className=" flex items-center gap-x-1.5">
                <MemberAvatar name={task.assignee.name} fallbackClassName="text-[10px]" />
                <div className=" size-1 rounded-full bg-neutral-300" />
            </div>
        </div>
    )
}
