export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-64 rounded bg-slate-200" />
        <div className="h-40 rounded-2xl bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-52 rounded-2xl bg-slate-200" />
          <div className="h-52 rounded-2xl bg-slate-200" />
          <div className="h-52 rounded-2xl bg-slate-200" />
        </div>
      </div>
    </main>
  );
}
