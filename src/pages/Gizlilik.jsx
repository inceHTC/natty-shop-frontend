import BackLink from "../components/BackLink";

export default function Gizlilik() {
  return (
    <div className="page-container py-12 md:py-16 max-w-3xl mx-auto">
      <nav className="mb-6">
        <BackLink fallback="/checkout" />
      </nav>
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-text-main)] mb-6">
        Gizlilik Politikası
      </h1>
      <div className="prose prose-slate text-[var(--color-text-secondary)] space-y-4">
        <p>
          Bu sayfa gizlilik politikası metnini içerecektir. Kişisel verilerin
          işlenmesi ve KVKK uyumu ile ilgili bilgiler buraya eklenebilir.
        </p>
      </div>
    </div>
  );
}
