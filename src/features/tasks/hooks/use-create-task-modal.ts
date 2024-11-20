import { useQueryState } from "nuqs";
import { TaskStatus } from "../types";

// Custom parser to handle TaskStatus | null
const parseAsTaskStatus = {
  parse: (value: string | null): TaskStatus | null => {
    if (!value) return null; // Handle null or undefined
    if (Object.values(TaskStatus).includes(value as TaskStatus)) {
      return value as TaskStatus;
    }
    return null; // Fallback for invalid values
  },
};

export const useCreateTaskModal = () => {
  const [isOpen, setIsOpen] = useQueryState<TaskStatus | null>(
    "create-task",
    parseAsTaskStatus
  );

  const open = (initialStatus: TaskStatus) => setIsOpen(initialStatus);
  const close = () => setIsOpen(null);

  return {
    isOpen,
    open,
    close,
    setIsOpen,
  };
};
