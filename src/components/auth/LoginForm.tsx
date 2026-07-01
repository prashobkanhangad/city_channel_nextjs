"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { login, type LoginActionState } from "@/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-red-700 text-sm font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-80"
    >
      {pending ? (
        <>
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
          />
          Signing in...
        </>
      ) : (
        "Sign in"
      )}
    </button>
  );
}

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

      <SubmitButton />

      {state.message && !state.success ? (
        <p className="text-center text-sm text-red-600">{state.message}</p>
      ) : null}
    </form>
  );
}
