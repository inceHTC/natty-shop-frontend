import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import BackLink from "../components/BackLink";
import { API_URL } from "../config";

export default function ProductList({
  addToCart,
  favoriteIds,
  toggleFavorite,
  user,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-[var(--color-bg-main)] min-h-screen">
      <div className="page-container py-8 md:py-12">
        <nav className="mb-6">
          <BackLink fallback="/" />
        </nav>
        <nav className="text-sm text-[var(--color-text-secondary)] mb-6">
          <Link to="/" className="hover:text-[var(--color-accent)] transition-colors">
            Anasayfa
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--color-text-main)] font-medium">Tüm Ürünler</span>
        </nav>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-text-main)] mb-8">
          Tüm Ürünler
        </h1>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-[var(--color-border)]"
              >
                <div className="aspect-[3/4] skeleton" />
                <div className="p-4 space-y-2">
                  <div className="h-4 skeleton w-3/4 rounded" />
                  <div className="h-5 skeleton w-1/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[var(--color-border)]">
            <p className="text-[var(--color-text-secondary)] text-lg mb-6">
              Henüz ürün yok.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center bg-[var(--color-text-main)] text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Anasayfaya Dön
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                addToCart={addToCart}
                isFavorite={favoriteIds?.has(p.id)}
                onToggleFavorite={toggleFavorite}
                user={user}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
