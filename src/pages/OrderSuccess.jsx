import { Link, useParams } from "react-router-dom";

export default function OrderSuccess() {
  const { id } = useParams();

  return (
    <div className="bg-[var(--color-bg-main)] min-h-screen">
      <div className="page-container py-16 md:py-24 text-center">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--color-text-main)] mb-4">
          Siparişiniz Alındı
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-6">
          Teşekkürler! Siparişiniz başarıyla oluşturuldu.
        </p>
        {id && (
          <p className="text-sm text-[var(--color-text-muted)] mb-8">
            Sipariş numaranız: <span className="font-semibold">{id}</span>
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/siparislerim"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[var(--color-text-main)] text-white font-medium hover:opacity-90 transition"
          >
            Siparişlerimi Görüntüle
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-text-main)] hover:border-[var(--color-text-main)] transition"
          >
            Alışverişe Devam Et
          </Link>
        </div>
      </div>
    </div>
  );
}

