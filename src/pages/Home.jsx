import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { API_URL } from "../config";

// Son görüntülenen ürünleri oku
function getRecentProducts() {
  try {
    return JSON.parse(localStorage.getItem("recentProducts")) || [];
  } catch {
    return [];
  }
}

const COLLECTIONS = [
  {
    img: "/images/collection-2.png",
    title: "Kadın",
    subtitle: "Koleksiyon",
    to: "/kategori/kadin",
  },
  {
    img: "/images/collection-1.png",
    title: "Erkek",
    subtitle: "Koleksiyon",
    to: "/kategori/erkek",
  },
  {
    img: "/images/cantalar.png",
    title: "Çantalar",
    subtitle: "Kadın & Erkek",
    to: "/cantalar",
  },
];

const SHOP_BY_CATEGORY = [
  { label: "Kadın Ayakkabı", to: "/kategori/kadin/ayakkabi" },
  { label: "Erkek Ayakkabı", to: "/kategori/erkek/ayakkabi" },
  { label: "Kadın Çanta", to: "/kategori/kadin/canta" },
  { label: "Erkek Çanta", to: "/kategori/erkek/canta" },
];

const TRUST_ITEMS = [
  { img: "/images/2.png", title: "Kolay İade", sub: "14 gün" },
  { img: "/images/3.png", title: "Canlı Destek", sub: "7/24" },
  { img: "/images/4.png", title: "Güvenli Ödeme", sub: "256-bit SSL" },
  { img: "/images/6.png", title: "Hızlı Kargo", sub: "Aynı gün" },
];

function ProductGrid({
  products,
  loading,
  addToCart,
  favoriteIds,
  toggleFavorite,
  user,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl overflow-hidden border border-[var(--color-border)]"
          >
            <div className="aspect-[3/4] skeleton" />
            <div className="p-4 space-y-2">
              <div className="h-4 skeleton w-3/4" />
              <div className="h-5 skeleton w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          addToCart={addToCart}
          isFavorite={favoriteIds?.has(product.id)}
          onToggleFavorite={toggleFavorite}
          user={user}
        />
      ))}
    </div>
  );
}

export default function Home({ addToCart, favoriteIds, toggleFavorite, user }) {
  const [featured, setFeatured] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingNew, setLoadingNew] = useState(true);
  const [error, setError] = useState(null);
  const recentProducts = getRecentProducts();

  useEffect(() => {
    fetch(`${API_URL}/products/featured`)
      .then((res) => {
        if (!res.ok) throw new Error("Ürünler alınamadı");
        return res.json();
      })
      .then((data) => {
        setFeatured(Array.isArray(data) ? data : []);
        setLoadingFeatured(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoadingFeatured(false);
      });
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/products/new?limit=6`)
      .then((res) => res.json())
      .then((data) => {
        setNewProducts(Array.isArray(data) ? data : []);
        setLoadingNew(false);
      })
      .catch(() => setLoadingNew(false));
  }, []);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) setNewsletterDone(true);
  };

  return (
    <div className="bg-[var(--color-bg-main)]">
      {/* HERO */}
      <section className="bg-white border-b border-[var(--color-border)]">
        <div className="page-container py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <p className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
              Yeni Sezon
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl  leading-tight text-[var(--color-text-main)]">
              Premium Ürünler
            </h1>
            <p className="mt-5 text-[var(--color-text-secondary)] text-lg max-w-md leading-relaxed">
              Kaliteli tasarım, zamansız stil ve güvenli alışveriş Natty'de.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#products"
                className="inline-flex items-center justify-center bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-text-main)]  px-6 py-3.5 rounded-xl transition-colors shadow-md hover:shadow-lg"
              >
                Alışverişe Başla
              </a>
              <Link
                to="/kategori"
                className="inline-flex items-center justify-center border-2 border-[var(--color-border)] hover:border-[var(--color-text-main)] text-[var(--color-text-main)]  px-6 py-3.5 rounded-xl transition-colors"
              >
                Koleksiyonu Keşfet
              </Link>
            </div>
          </div>
       <div className="relative aspect-video max-h-[320px] md:max-h-[360px] rounded-2xl overflow-hidden bg-slate-100 shadow-xl">
  <video
    src="/videos/hero2.mp4"
    autoPlay
    muted
    loop
    playsInline
    className="w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
</div>
     

        </div>
      </section>
          
      {/* KATEGORİLER - Alışverişe Göre Keşfet */}
      <section className="page-container py-14 md:py-18">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-text-main)] mb-6">
          Kategorilere Göz At
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {SHOP_BY_CATEGORY.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-[var(--color-border)] bg-white hover:border-[var(--color-accent)] hover:shadow-md transition-all text-center"
            >
              <span className="font-medium text-[var(--color-text-main)] text-sm md:text-base">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* KOLEKSİYONLAR */}
      <section className="page-container py-16 md:py-20">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-text-main)] mb-8">
          Koleksiyonlar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {COLLECTIONS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group relative block h-72 md:h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-sm font-medium opacity-90">
                  {item.subtitle}
                </p>
                <h3 className="font-serif text-2xl font-bold mt-1">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ÖNE ÇIKAN ÜRÜNLER */}
      <section id="products" className="page-container py-16 md:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-text-main)]">
            Öne Çıkan Ürünler
          </h2>
          <Link
            to="/one-cikan-urunler"
            className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-main)] transition-colors"
          >
            Tümünü Gör →
          </Link>
        </div>
        {error && (
          <p className="text-center py-16 text-[var(--color-danger)] font-medium">
            {error}
          </p>
        )}
        {!error && (
          <ProductGrid
            products={featured}
            loading={loadingFeatured}
            addToCart={addToCart}
            favoriteIds={favoriteIds}
            toggleFavorite={toggleFavorite}
            user={user}
          />
        )}
      </section>

      {/* YENİ GELENLER */}
      <section className="bg-white border-y border-[var(--color-border)] py-16 md:py-24">
        <div className="page-container">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-text-main)]">
              Yeni Gelenler
            </h2>
            <Link
              to="/yeni-urunler"
              className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-main)] transition-colors"
            >
              Tümünü Gör →
            </Link>
          </div>
          <ProductGrid
            products={newProducts}
            loading={loadingNew}
            addToCart={addToCart}
            favoriteIds={favoriteIds}
            toggleFavorite={toggleFavorite}
            user={user}
          />
        </div>
      </section>

  
{/* SON GÖRÜNTÜLENENLER */}
{recentProducts.length > 0 && (
  <section className="page-container py-14 md:py-20">
    <h2 className="font-serif text-xl md:text-2xl font-bold text-[var(--color-text-main)] mb-6">
      Son Görüntülenenler
    </h2>

    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
      {recentProducts.map((product) => (
        <div
          key={product.id}
          className="
            scale-[0.75] origin-top
            [&>article>div:last-child]:hidden
          "
        >
          <ProductCard
            product={product}
            addToCart={addToCart}
            isFavorite={favoriteIds?.has(product.id)}
            onToggleFavorite={toggleFavorite}
            user={user}
          />
        </div>
      ))}
    </div>
  </section>
)}



      {/* KAMPANYA CTA */}
      <section className="bg-[var(--color-bg-dark)] text-white py-20 md:py-28">
        <div className="page-container text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">
            Outlet Ürünlerinde Kampanya
          </h2>
          <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
            Seçili ürünlerde indirim fırsatları. Hemen keşfedin.
          </p>
          <Link
            to="/indirim"
            className="inline-flex items-center justify-center bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-text-main)] font-semibold px-8 py-4 rounded-xl transition-colors shadow-lg"
          >
            İndirimlere Git
          </Link>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-slate-100 border-y border-[var(--color-border)] py-16 md:py-20">
        <div className="page-container max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-text-main)] mb-2">
            Bültenimize Abone Olun
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-8">
            Yeni ürünler, kampanyalar ve fırsatlardan ilk siz haberdar olun.
          </p>
          {newsletterDone ? (
            <p className="text-[var(--color-success)] font-medium">
              Teşekkürler! Kaydınız alındı.
            </p>
          ) : (
            <form
              onSubmit={handleNewsletter}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="E-posta adresiniz"
                className="flex-1 border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-accent)]/30 outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl font-semibold bg-[var(--color-text-main)] text-white hover:opacity-90 transition-opacity"
              >
                Abone Ol
              </button>
            </form>
          )}
        </div>
      </section>

      {/* GÜVEN BANDI */}
      <section className="bg-white border-t border-[var(--color-border)] py-16 md:py-20">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 md:w-18 md:h-18 rounded-2xl bg-[var(--color-accent-soft)] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-10 h-10 md:w-12 md:h-12 object-contain"
                  />
                </div>
                <p className="font-semibold text-[var(--color-text-main)]">
                  {item.title}
                </p>
                <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
