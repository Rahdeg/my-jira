"use client"

import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import { redirect } from 'next/navigation';
import React from 'react'

export const ClientPage = () => {

    const { data, isLoading } = useGetWorkspaces();




    if (isLoading) {
        return <PageLoader />
    }



    if (!data) {
        return <PageError message=' no workspace' />
    }


    if (data?.total === 0) {
        redirect("/workspaces/create")
    } else {
        redirect(`/workspaces/${data?.documents[0].$id}`)
    }


}
