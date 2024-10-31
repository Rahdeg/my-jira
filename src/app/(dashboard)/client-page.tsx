"use client"

import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import { Loader, TriangleAlertIcon } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'

export const ClientPage = () => {

    const { data, isLoading } = useGetWorkspaces();




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


    if (data?.total === 0) {
        redirect("/workspaces/create")
    } else {
        redirect(`/workspaces/${data?.documents[0].$id}`)
    }

    return (
        <div>ClientPage</div>
    )
}
