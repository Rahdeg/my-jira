import { getCurrent } from '@/features/auth/queries';
import { redirect } from 'next/navigation';
import { ClientSettingsPage } from './client-settings-page';




const WorkspaceIdSettingsPage = async () => {
    const user = await getCurrent();


    if (!user) redirect("/sign-in");
    return <ClientSettingsPage />;
}

export default WorkspaceIdSettingsPage