import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";
import { API_URL } from "../config";
import { HiOutlineHeart, HiHeart } from "react-icons/hi";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faCartArrowDown,
} from "@fortawesome/free-solid-svg-icons";

function imageUrl(product) {
  const main = product?.images?.find((i) => i.isMain) || product?.images?.[0];
  const fn = main?.url || product?.image;
  if (!fn) return "";
  const gender = product?.gender || "kadin";
  const path = fn.includes("/") ? fn : `${gender}/${fn}`;
  return `${API_URL}/images/${path}`;
}

export default function ProductCard({
  product,
  addToCart,
  isFavorite = false,
  onToggleFavorite,
  user,
}) {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  const src = imageUrl(product);
  const isShoe = product.type === "ayakkabi";
  const canAdd = !isShoe || selectedSize;

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/auth", {
        state: { from: { pathname: window.location.pathname } },
      });
      return;
    }

    onToggleFavorite?.(product.id);
  };

const handleAddToCart = (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (!product.isActive) return;
  if (isShoe && !selectedSize) return;
  if (adding) return;

  setAdding(true);

  addToCart({
    ...product,
    selectedSize: isShoe ? selectedSize : null,
  });

  setTimeout(() => {
    setAdding(false);
  }, 1200);
};


  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-sm hover:shadow-lg transition-all flex flex-col">
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-[3/4] bg-slate-50"
      >
        {src && (
          <img
            src={src}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        )}

        {/* FAVORİ */}
        <button
          type="button"
          onClick={handleFavorite}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white shadow border flex items-center justify-center text-red-500 z-10"
        >
          {isFavorite ? <HiHeart size={20} /> : <HiOutlineHeart size={20} />}
        </button>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link
          to={`/product/${product.id}`}
          className="text-sm font-medium line-clamp-2 text-[var(--color-text-main)] hover:text-[var(--color-accent)] transition-colors"
        >
          {product.name}
        </Link>

        {/* AYAKKABI NUMARA */}
        {isShoe && Array.isArray(product.sizes) && product.sizes.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">
              Numara
            </p>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((s) => {
                const outOfStock = s.stock <= 0;
                const active = selectedSize === s.size;

                return (
                  <button
                    key={s.size}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (outOfStock) return;
                      setSelectedSize(s.size);
                    }}
                    className={`min-w-[2.25rem] py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all
                      ${
                        outOfStock
                          ? "bg-slate-100 text-slate-400 opacity-50 cursor-not-allowed"
                          : active
                          ? "bg-[var(--color-text-main)] text-white border-[var(--color-text-main)]"
                          : "bg-white border-[var(--color-border)] text-[var(--color-text-main)] hover:border-[var(--color-text-main)]"
                      }`}
                  >
                    {s.size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* FİYAT + SEPET */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-3">
          <span className="text-lg font-bold text-[var(--color-text-main)]">
            {formatPrice(product.price)}
          </span>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.isActive || !canAdd || adding}
            aria-label="Sepete ekle"
            className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all
              ${
                adding
                  ? "bg-slate-800 text-white border-slate-800"
                  : !canAdd
                  ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                  : "bg-white text-slate-800 border-slate-300 hover:bg-black hover:text-white"
              }
            `}
          >
            <FontAwesomeIcon
              icon={adding ? faCartArrowDown : faCartShopping}
              className="text-lg"
            />
          </button>
        </div>
      </div>
    </article>
  );
}
