import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-8xl md:text-9xl font-bold text-slate-200 font-serif">
        404
      </h1>
      <h2 className="text-xl md:text-2xl font-semibold mt-4 text-[var(--color-text-main)]">
        Sayfa bulunamadı
      </h2>
      <p className="text-[var(--color-text-secondary)] mt-2 max-w-md leading-relaxed">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center justify-center bg-[var(--color-text-main)] text-white font-semibold px-6 py-3.5 rounded-xl hover:opacity-90 transition-opacity"
      >
        Anasayfaya Dön
      </Link>
    </div>
  );
}
