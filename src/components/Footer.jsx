import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-bg-dark)] text-slate-300 mt-24">
      <div className="page-container py-14 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
        {/* MARKA */}
        <div>
          <Link
            to="/"
            className="brand-logo text-2xl md:text-3xl text-white hover:opacity-90 transition-opacity"
          >
            NATTY
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed mt-3 max-w-xs">
            Güvenli alışveriş, hızlı teslimat ve kaliteli ürünleri tek bir çatı
            altında.
          </p>
        </div>

        {/* KURUMSAL */}
        <div>
          <h3 className="text-white font-semibold mb-4">Kurumsal</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                to="/iletisim"
                className="hover:text-white transition-colors"
              >
                İletişim
              </Link>
            </li>
            <li>
              <Link
                to="/magazalar"
                className="hover:text-white transition-colors"
              >
                Mağazalar
              </Link>
            </li>
          </ul>
        </div>

        {/* MÜŞTERİ */}
        <div>
          <h3 className="text-white font-semibold mb-4">Müşteri Hizmetleri</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                to="/siparislerim"
                className="hover:text-white transition-colors"
              >
                Siparişlerim
              </Link>
            </li>
            <li>
              <Link
                to="/iletisim"
                className="hover:text-white transition-colors"
              >
                İade & Değişim
              </Link>
            </li>
          </ul>
        </div>

        {/* GÜVEN */}
        <div>
          <h3 className="text-white font-semibold mb-4">Güvenli Alışveriş</h3>
          <p className="text-sm text-slate-400 mb-4">
            256-bit SSL ile korunan ödeme altyapısı.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs font-semibold px-3 py-1.5 rounded-lg">
              SSL Secure
            </span>
            <span className="bg-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs font-semibold px-3 py-1.5 rounded-lg">
              3D Secure
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700">
        <div className="page-container py-5 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>© {currentYear} Natty. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <Link to="/iletisim" className="hover:text-white transition-colors">
              Gizlilik
            </Link>
            <Link to="/iletisim" className="hover:text-white transition-colors">
              Kullanım Koşulları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
