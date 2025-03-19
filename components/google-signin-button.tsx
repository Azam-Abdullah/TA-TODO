"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function GoogleSignInButton({className}:{className:any}) {
  return (
    <button
      onClick={() => signIn("google",{redirectTo:"/tasks"})}
      className={`flex items-center gap-3 px-6 py-3 text-lg font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 hover:shadow-lg transition-all ${className}`}
    >
      <FcGoogle className="text-2xl" />
      Sign in with Google
    </button>
  );
}
