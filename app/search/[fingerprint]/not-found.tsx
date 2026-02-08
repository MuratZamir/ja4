import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-4xl font-bold text-text-primary">Not Found</h1>
      <p className="text-text-secondary">
        No matching fingerprint records were found in the database.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-lg bg-accent-orange px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-orange-dim"
      >
        Back to Search
      </Link>
    </div>
  );
}
