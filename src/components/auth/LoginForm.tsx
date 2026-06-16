"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { login, type LoginActionState } from "@/actions/auth";

const initialState: LoginActionState = {
  success: false,
  message: "",
  errors: undefined,
};

export default function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/admin";
  const [state, formAction] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="redirect" value={redirect} />
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-zinc-700">Email</span>
        <input
          className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
          type="email"
          name="email"
          placeholder="admin@citychannel.in"
          autoComplete="email"
          required
        />
        {state.errors?.email?.[0] ? (
          <span className="text-xs text-red-600">{state.errors.email[0]}</span>
        ) : null}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-zinc-700">Password</span>
        <input
          className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
          type="password"
          name="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />
        {state.errors?.password?.[0] ? (
          <span className="text-xs text-red-600">{state.errors.password[0]}</span>
        ) : null}
      </label>

      <button
        type="submit"
        className="h-11 w-full rounded-lg bg-red-700 text-sm font-semibold text-white hover:bg-red-800"
      >
        Sign in
      </button>

      {state.message && !state.success ? (
        <p className="text-center text-sm text-red-600">{state.message}</p>
      ) : null}
    </form>
  );
}
