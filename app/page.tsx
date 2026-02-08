import Link from "next/link";
import SearchBar from "./components/SearchBar";
import { getTotalRecords } from "@/lib/search";

export default function Home() {
  const totalRecords = getTotalRecords();

  return (
    <div className="flex min-h-screen flex-col items-center px-4">
      <div className="flex w-full justify-center pt-4">
        <Link
          href="/wireshark"
          className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:border-accent-orange hover:text-text-primary"
        >
          Wireshark Analysis
        </Link>
      </div>
      <div className="flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-text-primary">
            JA4<span className="text-accent-orange">+</span>
          </h1>
          <p className="mt-3 text-text-secondary">
            Search across{" "}
            <span className="font-semibold text-text-primary">
              {totalRecords.toLocaleString()}
            </span>{" "}
            fingerprint records
          </p>
        </div>
        <SearchBar />
      </div>
    </div>
  );
}
