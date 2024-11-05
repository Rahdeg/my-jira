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
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createProjectSchema } from "../schema";
import { useCreateProject } from "../api/use-create-project";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

interface CreateProjectFormProps {
    onCancel?: () => void;
}

export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {

    const workspaceId = useWorkspaceId();

    const { mutate, isPending } = useCreateProject();

    const router = useRouter();

    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof createProjectSchema>>({
        resolver: zodResolver(createProjectSchema.omit({ workspaceId: true })),
        defaultValues: {
            name: "",
        }
    })

    const onSubmit = (values: z.infer<typeof createProjectSchema>) => {
        const finalValues = {
            ...values,
            image: values.image instanceof File ? values.image : "",
            workspaceId,
        }

        mutate({ form: finalValues }, {
            onSuccess: ({ data }) => {
                form.reset();
                // onCancel?.();
                router.push(`/workspaces/${workspaceId}/projects/${data.$id}`)
            }
        });
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue("image", file)
        }
    }


    return (
        <Card className=" w-full h-full border-none shadow-none">
            <CardHeader className=" flex p-7">
                <CardTitle className=" text-xl font-bold">
                    Create a new project
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
                                Create Project
                            </Button>
                        </div>

                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
