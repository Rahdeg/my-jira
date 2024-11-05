import { getCurrent } from '@/features/auth/queries';
import { redirect } from 'next/navigation';
import React from 'react'
import { ClientSettingsPage } from './client-settings-page';

const ProjectIdSettingsPage = async () => {
  const user = await getCurrent();


  if (!user) redirect("/sign-in");
  return <ClientSettingsPage />;
}

export default ProjectIdSettingsPage