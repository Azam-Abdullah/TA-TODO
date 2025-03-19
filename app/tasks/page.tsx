"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiLoader, BiCheck, BiPlus } from "react-icons/bi";
import { TbLoader2 } from "react-icons/tb";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

export default function TasksPage() {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingTasks, setFetchingTasks] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchTasks();
    }
  }, [status]);

  const fetchTasks = async () => {
    setFetchingTasks(true);
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setFetchingTasks(false);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify({ title }),
      });
      
      if (res.ok) {
        setTitle("");
        fetchTasks();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add task");
      }
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = async (taskId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify({ completed: !currentStatus }),
      });

      if (res.ok) {
        setTasks(
          tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        );
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <TbLoader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="mt-2 text-lg">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <p className="text-xl font-medium text-gray-800">Unauthorized. Please log in.</p>
        <Link href="/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome, {session?.user?.name}!</h1>
        <p className="text-gray-600 mb-6">Manage your tasks below</p>
        
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter task..."
            className="px-4 py-2 border rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <button
            onClick={addTask}
            disabled={loading || !title.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <TbLoader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <BiPlus className="w-5 h-5 mr-1" /> Add
              </>
            )}
          </button>
        </div>
        
        {fetchingTasks ? (
          <div className="flex justify-center py-8">
            <TbLoader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No tasks yet. Add one to get started!</p>
          </div>
        ) : (
          <div className="space-y-3 mt-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 border rounded-lg flex items-center justify-between ${
                  task.completed ? "bg-green-50 border-green-100" : "bg-white"
                } transition-all hover:shadow-sm`}
              >
                <div className="flex items-center flex-1 min-w-0">
                  <button
                    onClick={() => toggleTaskCompletion(task.id, task.completed)}
                    className={`p-2 rounded-full mr-3 transition-all ${
                      task.completed
                        ? "bg-green-500 text-white"
                        : "border border-gray-300 hover:bg-gray-100"
                    }`}
                    aria-label={`Mark task "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
                  >
                    {task.completed && <BiCheck className="w-4 h-4" />}
                  </button>

                  <span 
                    className={`truncate ${task.completed ? "line-through text-gray-500" : "text-gray-800"}`}
                    title={task.title}
                  >
                    {task.title}
                  </span>
                </div>

                <div className="flex space-x-2 ml-4">
                  <Link 
                    href={`/tasks/${task.id}`}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100"
                    title="Edit task"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors rounded-full hover:bg-gray-100"
                    title="Delete task"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <button 
      className="w-64 my-10 cursor-pointer bg-red-600 text-white py-3 rounded-lg text-lg font-semibold transition duration-300 hover:bg-red-700"
      onClick={()=> signOut({redirectTo:'/'})}>
        signout
      </button>
    </div>
  );
}