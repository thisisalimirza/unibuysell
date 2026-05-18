export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-6">
        <div className="space-y-2">
          <div className="h-9 w-52 rounded-xl bg-slate-200" />
          <div className="h-5 w-72 rounded-lg bg-slate-100" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04]">
              <div className="aspect-[4/3] bg-slate-200" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-3/4 rounded-lg bg-slate-200" />
                <div className="h-3 w-1/2 rounded-lg bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
