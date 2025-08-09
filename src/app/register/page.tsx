"use client";
import { authClient } from "@/lib/auth-client"; //import the auth client
import { useState } from "react";

function handleSignUp(form: { email: string; password: string; name: string }) {
  authClient.signUp.email(
    {
      email: form.email,
      password: form.password,
      name: form.name,
    },
    {
      onError: (ctx) => {
        alert(ctx.error.message);
      },
    }
  );
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
  });

  return (
    <div className="min-h-screen flex flex-col items-center pt-16 px-4">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignUp(form);
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
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="border rounded px-3 py-2"
          />
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
    </div>
  );
}
