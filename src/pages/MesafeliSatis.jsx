import BackLink from "../components/BackLink";

export default function MesafeliSatis() {
  return (
    <div className="page-container py-12 md:py-16 max-w-3xl mx-auto">
      <nav className="mb-6">
        <BackLink fallback="/checkout" />
      </nav>
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-text-main)] mb-6">
        Mesafeli Satış Sözleşmesi
      </h1>
      <div className="prose prose-slate text-[var(--color-text-secondary)] space-y-4">
        <p>
          Bu sayfa mesafeli satış sözleşmesi metnini içerecektir. İşletmenize
          özel hükümler buraya eklenebilir.
        </p>
        <p>
          Yasal zorunluluklar doğrultusunda cayma hakkı, iade koşulları ve
          teslimat süreleri gibi bilgiler burada yer almalıdır.
        </p>
      </div>
    </div>
  );
}
