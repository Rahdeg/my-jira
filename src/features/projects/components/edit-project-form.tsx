"use client"

import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { useConfirm } from "@/hooks/use-confirm";
import { updateProjectSchema } from "../schema";
import { useUpdateProject } from "../api/use-update-project";
import { useDeleteProject } from "../api/use-delete-project";
import { Project } from "../types";

interface EditProjectFormProps {
    onCancel?: () => void;
    initialValues: Project;
};

export const EditProjectForm = ({ onCancel, initialValues }: EditProjectFormProps) => {

    const { mutate: updateProject, isPending: updatingProject } = useUpdateProject();

    const { mutate: deleteWorkspace, isPending: deletingProject } = useDeleteProject();


    const isPending = updatingProject || deletingProject;

    const [DeleteDialog, confirmDelete] = useConfirm(
        "Delete Project",
        "Are you sure you want to delete this project, its irreversible?",
        "destructive"
    );



    const router = useRouter();

    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof updateProjectSchema>>({
        resolver: zodResolver(updateProjectSchema),
        defaultValues: {
            ...initialValues,
            image: initialValues.imageUrl ?? "",
        }
    })

    const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {

        const finalValues = {
            ...values,
            image: values.image === undefined ? "" : values.image,
        }

        updateProject({ form: finalValues, param: { projectId: initialValues.$id } }, {
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

        deleteWorkspace({ param: { projectId: initialValues.$id } }, {
            onSuccess: () => {
                window.location.href = "/";
            }
        })
    }








    return (
        <div className=" flex flex-col gap-y-4">
            <DeleteDialog />
            <Card className=" w-full h-full border-none shadow-none">
                <CardHeader className=" flex flex-row items-center gap-x-4 p-7 space-y-0">
                    <Button size="sm" variant="primary" onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`)}>
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
                                                Project Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    type="text"
                                                    placeholder="Enter project name"
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
                                                    <p className=" text-sm">Project Icon</p>
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
                        <h3 className=" font-bold">Danger Zone</h3>
                        <p className=" text-sm text-muted-foreground">
                            Deleting a project is  irreversible and will remove all associated data
                        </p>
                        <Button
                            onClick={handelDelete}
                            className=" mt-6 w-fit ml-auto" size="sm" variant="destructive" type="button" disabled={isPending}>
                            Delete Project
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>

    )
}
