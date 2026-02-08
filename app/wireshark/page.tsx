import Link from "next/link";
import PcapDropZone from "@/app/components/PcapDropZone";

export default function WiresharkPage() {
  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-40 border-b border-border bg-bg-primary/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-text-primary"
          >
            JA4<span className="text-accent-orange">+</span>
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-border px-4 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:border-accent-orange hover:text-text-primary"
          >
            Back to Search
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Wireshark Analysis
          </h1>
          <p className="mt-2 text-text-secondary">
            Upload a packet capture file to extract JA4+ fingerprints
          </p>
        </div>

        <PcapDropZone />
      </main>
    </div>
  );
}
