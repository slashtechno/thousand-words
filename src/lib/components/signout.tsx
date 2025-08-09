"use client";

import { authClient } from "@/lib/auth-client"; //import the auth client
import { redirect } from "next/navigation";

async function handleSignOut() {
  await authClient.signOut();
  redirect("/login"); // Redirect to the login page after signing out
}


export default function SignOutButton() {
  return (
    <button
      onClick={async () => {
        await handleSignOut();
      }}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
    >
      Sign Out
    </button>
  );
}