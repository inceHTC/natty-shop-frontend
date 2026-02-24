import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";
import { API_URL } from "../../config";
import { Heart } from "lucide-react";

export default function ProfileFavorites({
  favorites,
  favoriteIds,
  addToCart,
  toggleFavorite,
  setFavorites,
}) {
  const token = localStorage.getItem("token");

  const handleRemove = (productId) => {
    fetch(`${API_URL}/favorites/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      setFavorites((prev) => (prev || []).filter((p) => p.id !== productId));
    });
  };

  if (!favorites?.length) {
    return (
      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-12 text-center shadow-sm">
        <Heart className="w-14 h-14 mx-auto text-[var(--color-text-muted)] mb-4" />
        <p className="text-[var(--color-text-secondary)] mb-4">
          Favori ürününüz yok.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[var(--color-text-main)] text-white font-medium hover:opacity-90"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
      <h2 className="font-semibold text-lg text-[var(--color-text-main)] mb-6">
        Favorilerim
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((product) => (
          <div key={product.id} className="relative group">
            <ProductCard
              product={product}
              addToCart={addToCart}
              isFavorite={favoriteIds?.has(product.id)}
              onToggleFavorite={toggleFavorite}
              user={{}}
            />
            <button
              type="button"
              onClick={() => handleRemove(product.id)}
              className="absolute top-2 right-2 z-10 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-red-500 hover:bg-white text-sm"
              aria-label="Favoriden çıkar"
            >
              <Heart className="w-5 h-5 fill-current" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
