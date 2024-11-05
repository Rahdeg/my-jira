import { getCurrent } from '@/features/auth/queries'
import { redirect } from 'next/navigation';
import React from 'react'
import { InviteLinkClient } from './invite-link-client';

const WorkspaceIdJoinPage = async () => {

    const user = await getCurrent();
    if (!user) redirect("/sign-in");


    return <InviteLinkClient />
}

export default WorkspaceIdJoinPage