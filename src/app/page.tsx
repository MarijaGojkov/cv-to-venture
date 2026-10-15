import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-4 py-16">
      <h1 className="text-4xl font-semibold">CV to Venture</h1>
      <p className="text-lg text-gray-600">
        Upload your CV, get a business idea built around your skills.
      </p>
      <div className="flex gap-3">
        <Link href="/login" className="rounded bg-black px-4 py-2 text-white">
          Get started
        </Link>
        <Link href="/dashboard" className="rounded border px-4 py-2">
          Dashboard
        </Link>
      </div>
    </main>
  );
}
