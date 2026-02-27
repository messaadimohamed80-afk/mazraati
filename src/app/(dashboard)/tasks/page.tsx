import { getTasks } from "@/lib/actions/crops";
import ClientTasks from "./ClientTasks";

export default async function TasksPage() {
    const tasksR = await getTasks();
    const tasks = tasksR.ok ? tasksR.data : [];
    return <ClientTasks initialTasks={tasks} />;
}
