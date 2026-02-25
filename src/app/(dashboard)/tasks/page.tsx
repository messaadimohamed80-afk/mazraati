import { getTasks } from "@/lib/actions/crops";
import ClientTasks from "./ClientTasks";

export default async function TasksPage() {
    const tasks = await getTasks();
    return <ClientTasks initialTasks={tasks} />;
}
