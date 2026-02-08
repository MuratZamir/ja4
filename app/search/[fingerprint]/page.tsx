import Link from "next/link";
import { notFound } from "next/navigation";
import { searchFingerprint } from "@/lib/search";
import { parseJA4 } from "@/lib/fingerprint-parser";
import SearchBar from "@/app/components/SearchBar";
import FingerprintHeader from "@/app/components/FingerprintHeader";
import TopRelatedFingerprints from "@/app/components/TopRelatedFingerprints";
import AssociationsPanel from "@/app/components/AssociationsPanel";
import ObservedSection from "@/app/components/ObservedSection";
import RelatedFingerprintCards from "@/app/components/RelatedFingerprintCards";

export default async function SearchPage({
  params,
}: {
  params: Promise<{ fingerprint: string }>;
}) {
  const { fingerprint } = await params;
  const decoded = decodeURIComponent(fingerprint);
  const result = searchFingerprint(decoded);

  if (!result) {
    notFound();
  }

  const parsed = parseJA4(decoded);

  return (
    <div className="min-h-screen">
      {/* Top nav bar */}
      <nav className="sticky top-0 z-40 border-b border-border bg-bg-primary/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <SearchBar initialValue={decoded} compact />
          <Link
            href="/"
            className="shrink-0 rounded-lg border border-border px-4 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:border-accent-orange hover:text-text-primary"
          >
            New Search
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8">
        <FingerprintHeader result={result} parsed={parsed} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TopRelatedFingerprints fingerprints={result.relatedFingerprints} />
          <AssociationsPanel result={result} />
        </div>

        <ObservedSection
          userAgents={result.userAgents}
          applications={result.applications}
        />

        <RelatedFingerprintCards fingerprints={result.relatedFingerprints} />
      </main>
    </div>
  );
}
