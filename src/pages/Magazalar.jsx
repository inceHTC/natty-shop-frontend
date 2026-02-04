import BackLink from "../components/BackLink";

export default function Magazalar() {
  return (
    <div className="page-container py-16 md:py-24">
      <nav className="mb-6">
        <BackLink fallback="/" />
      </nav>
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--color-text-main)] mb-4">
          Mağazalar
        </h1>
        <p className="text-[var(--color-text-secondary)] text-lg mb-8 leading-relaxed">
          Mağaza adresleri ve çalışma saatleri yakında eklenecek.
        </p>
      </div>
    </div>
  );
}
