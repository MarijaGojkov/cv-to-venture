import { Suspense } from "react";
import { login, signup } from "./actions";

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-16">
      <h1 className="text-2xl font-semibold">Log in or sign up</h1>

      {/* searchParams are only known per request, so they are read inside <Suspense>. */}
      <Suspense>
        <Notice searchParams={searchParams} />
      </Suspense>

      <form className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input name="email" type="email" required autoComplete="email" className="rounded border px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="current-password"
            className="rounded border px-3 py-2"
          />
        </label>

        {/* One form, two buttons: each button sends the form to a different Server Action. */}
        <button formAction={login} className="rounded bg-black px-4 py-2 text-white">
          Log in
        </button>
        <button formAction={signup} className="rounded border px-4 py-2">
          Sign up
        </button>
      </form>
    </main>
  );
}

// Shows the error or info message that the Server Actions put in the URL.
async function Notice({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const { error, message } = await searchParams;

  if (typeof error === "string") {
    return <p className="rounded bg-red-100 p-3 text-sm text-red-800">{error}</p>;
  }
  if (typeof message === "string") {
    return <p className="rounded bg-green-100 p-3 text-sm text-green-800">{message}</p>;
  }
  return null;
}
