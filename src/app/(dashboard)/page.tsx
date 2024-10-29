import { getCurrent } from "@/features/auth/queries";
import { CreateWorkSpaceForm } from "@/features/workspaces/components/create-workspace-form";
import { redirect } from "next/navigation";



export default async function Home() {

  const user = await getCurrent();


  if (!user) redirect("/sign-in");



  return (
    <div className="  border-gray-700 border-8 ">
      <CreateWorkSpaceForm />
    </div>
  );
}
