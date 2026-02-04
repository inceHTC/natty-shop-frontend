import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import BackLink from "../components/BackLink";
import { API_URL } from "../config";

export default function Favorites({ addToCart, toggleFavorite }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchFavorites = async () => {
    try {
      const res = await fetch(`${API_URL}/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const removeFavorite = (productId) => {
    toggleFavorite?.(productId);
    setProducts((p) => p.filter((x) => x.id !== productId));
  };

  if (loading) {
    return (
      <div className="page-container py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {[1, 2, 3, 4].map((i) => (
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
      </div>
    );
  }

  return (
    <div className="page-container py-10 md:py-14">
      <nav className="mb-6">
        <BackLink fallback="/" />
      </nav>
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-text-main)] mb-8">
        Favorilerim
      </h1>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-12 md:p-16 text-center">
          <p className="text-[var(--color-text-secondary)] text-lg mb-6">
            Henüz favori ürününüz yok.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-[var(--color-text-main)] text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
              isFavorite
              onToggleFavorite={() => removeFavorite(product.id)}
              user={{}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
