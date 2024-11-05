"use client"

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeftIcon, Loader, MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";
import { DottedSeparator } from "./dotted-separator";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { Fragment } from "react";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Separator } from "./ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { useUpdateMemberRole } from "@/features/members/api/use-update-member-role";
import { MemberRole } from "@/features/members/types";
import { useConfirm } from "@/hooks/use-confirm";

export const MemberList = () => {
    const workspaceId = useWorkspaceId();
    const { data, isLoading } = useGetMembers({ workspaceId });
    const { mutate: deleteMember, isPending: deletingMember } = useDeleteMember();
    const { mutate: changeRole, isPending: changingRole } = useUpdateMemberRole();

    const isPending = deletingMember || changingRole;

    const [ConfirmDeleteDialog, confirmDelete] = useConfirm(
        "Remove member",
        "This member role will be removed from the workspace",
        "destructive"
    )

    const [ConfirmRoleDialog, confirmRole] = useConfirm(
        "Change role",
        "This member will be changed",
        "destructive"
    )

    const handleDeleteMember = async (memberId: string) => {
        const ok = await confirmDelete();
        if (!ok) return;
        deleteMember({
            param: { memberId }
        }, {
            onSuccess: () => {
                window.location.reload();
            }
        })
    }

    const handleChangeRole = async (memberId: string, role: MemberRole) => {

        const ok = await confirmRole();
        if (!ok) return;
        changeRole({
            json: { role },
            param: { memberId }
        })
    }

    if (isLoading) {
        return (<div className=' h-full flex items-center justify-center'>
            <Loader className=' size-6 animate-spin text-muted-foreground' />
        </div>)
    }

    return (
        <Card className=" w-full h-full border-none shadow-none">
            <ConfirmDeleteDialog />
            <ConfirmRoleDialog />
            <CardHeader className=" flex flex-row items-center gap-x-4 p-7 space-y-0">
                <Button variant="secondary" size="sm" asChild>
                    <Link href={`/workspaces/${workspaceId}`}>
                        <ArrowLeftIcon className=" size-4 mr-2" />
                        Back
                    </Link>

                </Button>
                <CardTitle className=" text-xl font-bold">
                    Members List
                </CardTitle>
            </CardHeader>
            <div className=" px-7">
                <DottedSeparator />
            </div>

            <CardContent className=" p-7">
                {
                    data?.documents.map((member, index) => (
                        <Fragment key={member.$id}>
                            <div className=" flex items-center gap-2">
                                {
                                    isPending ? (
                                        <div className=' h-full flex items-center justify-center'>
                                            <Loader className=' size-6 animate-spin text-muted-foreground' />
                                        </div>
                                    ) : (
                                        <>
                                            <MemberAvatar name={member.name} className="size-10" fallbackClassName="text-lg" />
                                            <div className=" flex flex-col">
                                                <p className=" text-sm font-medium">{member.name} </p>
                                                <p className=" text-xs  text-muted-foreground">{member.email} </p>
                                            </div>
                                        </>
                                    )
                                }

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className=" ml-auto" variant="secondary" size="icon">
                                            <MoreHorizontalIcon className=" size-4 text-muted-foreground" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="bottom" align="end">
                                        <DropdownMenuItem
                                            className=" font-medium"
                                            onClick={() => handleChangeRole(member.$id, MemberRole.ADMIN)}
                                            disabled={isPending}
                                        >
                                            Set as Administrator
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className=" font-medium"
                                            onClick={() => handleChangeRole(member.$id, MemberRole.MEMBER)}
                                            disabled={isPending}
                                        >
                                            Set as Member
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className=" font-medium text-amber-700"
                                            onClick={() => handleDeleteMember(member.$id)}
                                            disabled={isPending}
                                        >
                                            Remove {member.name}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            {
                                index < data.documents.length - 1 && <Separator className=" my-2.5" />
                            }
                        </Fragment>
                    ))
                }
            </CardContent>
        </Card>
    )
}
