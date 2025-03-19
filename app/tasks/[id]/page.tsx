"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { BiLoader, BiSave } from "react-icons/bi";
import { BsArrowLeft } from "react-icons/bs";
import { TbLoader2 } from "react-icons/tb";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;
  
  const { data: session, status } = useSession();
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session && taskId) {
      fetchTask();
    }
  }, [session, taskId]);

  const fetchTask = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/tasks/${taskId}`);
      
      if (res.ok) {
        const data = await res.json();
        setTask(data.task);
        setTitle(data.task.title);
        setCompleted(data.task.completed);
      } else {
        if (res.status === 404) {
          setError("Task not found");
        } else {
          setError("Failed to load task");
        }
      }
    } catch (error) {
      console.error("Error fetching task:", error);
      setError("An error occurred while loading the task");
    } finally {
      setLoading(false);
    }
  };

  const saveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError("Title cannot be empty");
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify({ title, completed }),
      });
      
      if (res.ok) {
        router.push("/tasks");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setError("An error occurred while saving the task");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <TbLoader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="mt-2 text-lg">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-semibold text-red-600">Unauthorized</h2>
          <p className="mt-2 text-gray-700">Please log in to access your tasks.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Link href="/tasks" className="flex items-center text-blue-500 mb-6">
          <BsArrowLeft className="w-4 h-4 mr-2" />
          Back to Tasks
        </Link>
        
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <p className="mt-2 text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link href="/tasks" className="flex items-center text-blue-500 mb-6">
        <BsArrowLeft className="w-4 h-4 mr-2" />
        Back to Tasks
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Task</h1>
      </div>

      <form onSubmit={saveTask} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Task Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Enter task title"
          />
        </div>
        
        <div className="flex items-center">
          <input
            id="completed"
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="completed" className="ml-2 block text-sm text-gray-700">
            Mark as completed
          </label>
        </div>
        
        <div className="flex pt-4">
          <button
            type="submit"
            disabled={saving || !title.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 flex items-center"
          >
            {saving ? (
              <TbLoader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <BiSave className="w-5 h-5 mr-2" />
            )}
            Save Changes
          </button>
          
          <Link href="/tasks" className="ml-4 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}