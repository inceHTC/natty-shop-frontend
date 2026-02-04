import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import BackLink from "../components/BackLink";
import { API_URL } from "../config";

export default function YeniUrunler({
  addToCart,
  favoriteIds,
  toggleFavorite,
  user,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/products/new?limit=20`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="page-container py-10 md:py-14">
      <nav className="mb-6">
        <BackLink fallback="/" />
      </nav>
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-text-main)] mb-8">
        Son Eklenen Ürünler
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
          <p className="text-[var(--color-text-secondary)] text-lg">
            Henüz ürün bulunmuyor.
          </p>
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
  );
}
