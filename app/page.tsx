"use client";

import GoogleSignInButton from "@/components/google-signin-button";
import { LoginForm } from "@/components/login-form";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TbLoader2 } from "react-icons/tb";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push('/task')
    }
  }, [status, router]);


  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="p-8 rounded-lg flex flex-col items-center">
          <TbLoader2 className="w-10 h-10 animate-spin text-blue-500" />
          <p className="mt-4 text-lg font-medium text-gray-700">
             Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-lg text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Welcome to Your TODO</h1>
        <p className="text-gray-600 mb-6 text-lg">A simple way to organize your tasks</p>

        <div className="flex flex-col gap-4">
          <Link
            href="/auth/login"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold transition duration-300 hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg text-lg font-semibold transition duration-300 hover:bg-gray-300"
          >
            Register
          </Link>
        </div>
      </div>
    </div>

  );
}