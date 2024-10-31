"use client"

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";


export const WorkspaceClientPage = () => {

  const workspaceId = useWorkspaceId();

  return (
    <div>
      {workspaceId}
    </div>
  )
}
