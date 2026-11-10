import BackendStatus from "@/components/BackendStatus";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12 sm:py-20">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        ATHLETEX AI
      </h1>
      <p className="mt-3 max-w-prose text-[var(--muted)]">
        Cricket bowling analysis for athletes who have never had access to an
        academy. This page is the Milestone 1 setup check: it confirms the
        website and the server can talk to each other.
      </p>
      <div className="mt-10">
        <BackendStatus />
      </div>
    </main>
  );
}
