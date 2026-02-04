import ProductCard from "../ProductCard";

export default function ProfileFavorites({
  favorites,
  favoriteIds,
  addToCart,
  toggleFavorite,
  setFavorites,
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {favorites.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          addToCart={addToCart}
          isFavorite={favoriteIds?.has(p.id)}
          onToggleFavorite={(id) => {
            toggleFavorite(id);
            setFavorites((f) => f.filter((x) => x.id !== id));
          }}
        />
      ))}
    </div>
  );
}
