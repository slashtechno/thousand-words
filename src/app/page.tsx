import Image from "next/image";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client"; //import the auth client
import SignOutButton from "@/lib/components/signout";
import FaceAnalyzer from "@/lib/components/face-analyzer";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log("session", session);


  if (!session){
    return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
    <button>
      <a href="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Sign In
      </a>
    </button>
    </div>
    )
  } else {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mb-4">Welcome, {session.user?.name || session.user?.email}!</h1>
        <p className="mb-8">You are logged in with email: {session.user?.email}</p>
        <SignOutButton />
        <FaceAnalyzer/>
      </div>
    );
  }
}
