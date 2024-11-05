import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface useGetprojectsProps {
  workspaceId: string;
}

export const useGetprojects = ({ workspaceId }: useGetprojectsProps) => {
  const query = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await client.api.projects["$get"]({
        query: {
          workspaceId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
