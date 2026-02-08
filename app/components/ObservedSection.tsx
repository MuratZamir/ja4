import type { CountedItem } from "@/lib/types";

function CountedList({
  title,
  items,
}: {
  title: string;
  items: CountedItem[];
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="mb-3 text-base font-semibold text-text-primary">
        {title}
      </h3>
      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item.value}
            className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-bg-card-hover"
          >
            <span className="truncate text-sm text-text-secondary">
              {item.value}
            </span>
            <span className="ml-3 shrink-0 text-sm font-medium text-text-primary">
              {item.count.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ObservedSection({
  userAgents,
  applications,
}: {
  userAgents: CountedItem[];
  applications: CountedItem[];
}) {
  if (userAgents.length === 0 && applications.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-bg-card p-6">
      <h2 className="mb-6 text-lg font-semibold text-text-primary">
        Observed
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <CountedList title="User Agent String" items={userAgents} />
        <CountedList title="Application" items={applications} />
      </div>
    </div>
  );
}
