"use client"

import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateWorkspaceSchema } from "../schemas";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Workspace } from "../types";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { toast } from "sonner";
import { useResetInviteCode } from "../api/use-reset-invite-code";

interface CreateWorkSpaceFormProps {
    onCancel?: () => void;
    initialValues: Workspace;
};

export const EditWorkspaceForm = ({ onCancel, initialValues }: CreateWorkSpaceFormProps) => {

    const { mutate: updateWorkspace, isPending: updatingWorkspace } = useUpdateWorkspace();

    const { mutate: deleteWorkspace, isPending: deletingWorkspace } = useDeleteWorkspace();

    const { mutate: resetInviteCode, isPending: resettingInviteCode } = useResetInviteCode()

    const isPending = updatingWorkspace || deletingWorkspace || resettingInviteCode;

    const [DeleteDialog, confirmDelete] = useConfirm(
        "Delete Workspace",
        "Are you sure you want to delete this workspace, its irreversible?",
        "destructive"
    );

    const [ResetCodeDialog, confirmReset] = useConfirm(
        "Reset Invite Link",
        "This will invalidate the current invite link ",
        "destructive"
    );

    const router = useRouter();

    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
        resolver: zodResolver(updateWorkspaceSchema),
        defaultValues: {
            ...initialValues,
            image: initialValues.imageUrl ?? "",
        }
    })

    const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {

        const finalValues = {
            ...values,
            image: values.image === undefined ? "" : values.image,
        }

        updateWorkspace({ form: finalValues, param: { workspaceId: initialValues.$id } }, {
            onSuccess: () => {
                // form.reset();
                // onCancel?.();
                // router.push(`/workspaces/${data.$id}`)
            }
        });
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue("image", file)
        }
    }

    const handelDelete = async () => {
        const ok = await confirmDelete();

        if (!ok) return

        deleteWorkspace({ param: { workspaceId: initialValues.$id } }, {
            onSuccess: () => {
                window.location.href = "/";
            }
        })
    }

    const handleResetInviteCode = async () => {
        const ok = await confirmReset();

        if (!ok) return

        console.log("resetting...")

        resetInviteCode({ param: { workspaceId: initialValues.$id } }, {
            // onSuccess: () => {
            //     window.location.href = "/";
            // }
        })
    }

    const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`

    const HandleInviteLink = () => {
        navigator.clipboard.writeText(fullInviteLink).then(() => toast.success("Invite link copied to the clipboard"))
    }


    return (
        <div className=" flex flex-col gap-y-4">
            <DeleteDialog />
            <ResetCodeDialog />
            <Card className=" w-full h-full border-none shadow-none">
                <CardHeader className=" flex flex-row items-center gap-x-4 p-7 space-y-0">
                    <Button size="sm" variant="primary" onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.$id}`)}>
                        <ArrowLeftIcon className="size-4 mr-1" />
                        Back
                    </Button>
                    <CardTitle className=" text-xl font-bold">
                        {initialValues.name}
                    </CardTitle>
                </CardHeader>
                <div className=" px-7">
                    <DottedSeparator />
                </div>
                <CardContent className=" p-7">
                    <Form {...form}  >
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className=" flex flex-col gap-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Workspace Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    type="text"
                                                    placeholder="Enter workspace name"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>

                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <div className=" flex flex-col gap-y-2">
                                            <div className=" flex items-center gap-x-5">
                                                {
                                                    field.value ? (
                                                        <div className=" size-[72px] relative rouded-md overflow-hidden">
                                                            <Image
                                                                fill
                                                                className=" object-cover"
                                                                src={field.value instanceof File ? URL.createObjectURL(field.value) : field.value}
                                                                alt="logo"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <Avatar className=" size-[72px]">
                                                            <AvatarFallback>
                                                                <ImageIcon className=" size-[36px] text-neutral-400" />
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    )
                                                }
                                                <div className=" flex flex-col">
                                                    <p className=" text-sm">Workspace Icon</p>
                                                    <p className=" text-sm text-muted-foreground">JPG,PNG,SVG or JPEG, max 1mb</p>
                                                    <input
                                                        className="hidden"
                                                        accept=".jpeg, .png, .jpg, .svg"
                                                        type="file"
                                                        ref={inputRef}
                                                        title="image"
                                                        disabled={isPending}
                                                        onChange={handleImageChange}
                                                    />
                                                    {
                                                        field.value ? (
                                                            <Button type="button" disabled={isPending} variant="destructive" size="xs" className="w-fit mt-2" onClick={() => {
                                                                field.onChange("");
                                                                if (inputRef.current) {
                                                                    inputRef.current.value = "";
                                                                }
                                                            }}>
                                                                Remove Image
                                                            </Button>
                                                        ) : (
                                                            <Button type="button" disabled={isPending} variant="teritrary" size="xs" className="w-fit mt-2" onClick={() => inputRef.current?.click()}>
                                                                Upload Image
                                                            </Button>
                                                        )
                                                    }


                                                </div>
                                            </div>
                                        </div>

                                    )}
                                />
                            </div>

                            <DottedSeparator className="py-7" />
                            <div className=" flex items-center justify-between">

                                <Button
                                    className={cn(!onCancel && "invisible")}
                                    onClick={onCancel} disabled={isPending} size="lg" type="button" variant="secondary">
                                    Cancel
                                </Button>
                                <Button disabled={isPending} size="lg" type="submit" >
                                    Save Changes
                                </Button>
                            </div>

                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card className=" w-full h-full border-none shadow-none">
                <CardContent className="p-7">
                    <div className="flex flex-col">
                        <h3 className=" font-bold">Invite Members</h3>
                        <p className=" text-sm text-muted-foreground">
                            Use the invite link to add members to your workspace
                        </p>
                        <div className=" mt-4">
                            <div className=" flex items-center gap-x-2">
                                <Input disabled value={fullInviteLink} />
                                <Button onClick={HandleInviteLink} variant="secondary" className=" size-12">
                                    <CopyIcon className=" size-5" />
                                </Button>
                            </div>
                        </div>
                        <DottedSeparator className=" py-7" />
                        <Button
                            onClick={handleResetInviteCode}
                            className="  w-fit ml-auto" size="sm" variant="destructive" type="button" disabled={isPending}>
                            Reset Invite link
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className=" w-full h-full border-none shadow-none">
                <CardContent className="p-7">
                    <div className="flex flex-col">
                        <h3 className=" font-bold">Danger Zone</h3>
                        <p className=" text-sm text-muted-foreground">
                            Deleting a workspace is a irreversible and will remove all associated data
                        </p>
                        <Button
                            onClick={handelDelete}
                            className=" mt-6 w-fit ml-auto" size="sm" variant="destructive" type="button" disabled={isPending}>
                            Delete Workspace
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>

    )
}
