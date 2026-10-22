export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center pt-[var(--header-h)]" role="status" aria-live="polite">
      <span className="sr-only">Chargement…</span>
      <svg viewBox="0 0 200 30" className="w-40 text-accent" aria-hidden>
        <path d="M0 15 C30 3 60 27 100 15 S170 3 200 15" fill="none" stroke="currentColor" strokeWidth="1.2" className="defile-trait" />
      </svg>
    </div>
  );
}
