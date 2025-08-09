"use client";
import { authClient } from "@/lib/auth-client"; //import the auth client
import { redirect } from "next/navigation";
import { useState } from "react";

async function handleSignUp(form: { password: string; name: string , username: string }) {
  let userId: string | null = null;
  await authClient.signUp.email(
    {
      email: "example@example.com",
      password: form.password,
      name: form.name,
      username: form.username,
    },
    {
      onError: (ctx) => {
        alert(ctx.error.message);
      },
      onSuccess: async (ctx) => {
        userId = ctx.data?.user?.id;
        if (userId) {
          // Create profile for the new user
          await import("@/app/actions").then(({ createProfile }) =>
          createProfile({ userId: userId!, displayName: form.name })
          );
        }
        redirect("/");
      },
    }
  );
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    // email: "",
    password: "",
    name: "",
    username: "",
  });

  return (
    <div className="min-h-screen flex flex-col items-center pt-16 px-4">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await handleSignUp(form);
          }}
          className="flex flex-col gap-3"
        >
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            className="border rounded px-3 py-2"
          />
          {/* <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="border rounded px-3 py-2"
          /> */}
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="border rounded px-3 py-2"
          />
          <button type="submit" className="border rounded px-3 py-2 text-sm">
            Sign Up
          </button>
        </form>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
