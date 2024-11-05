import { MemberList } from "@/components/members-list";
import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";



const MembersPage = async () => {

    const user = await getCurrent();
    if (!user) redirect("/sign-in");

    return (
        <div className=" w-full lg:max-w-xl">
            <MemberList />
        </div>
    )
}

export default MembersPage