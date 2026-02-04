import { formatPrice, getVATBreakdown } from "../utils/formatPrice";
import { Minus, Plus, Trash2 } from "lucide-react";
import { API_URL } from "../config";

function imageUrl(item) {
  const main = item?.images?.find((i) => i.isMain) || item?.images?.[0];
  const fn = main?.url || item?.image;
  if (!fn) return "";
  const gender = item?.gender || "kadin";
  const path = fn.includes("/") ? fn : `${gender}/${fn}`;
  return `${API_URL}/images/${path}`;
}

export default function CartItem({
  item,
  removeFromCart,
  updateQuantity,
  changeSize,
}) {


  // ✅ TEK KAYNAK: size
  const sizeParam = item.size ?? null;

  const increase = () => {
    updateQuantity(item.id, item.quantity + 1, sizeParam);
  };

  const decrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1, sizeParam);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id, sizeParam);
  };

  const src = imageUrl(item);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-5 rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
      {/* GÖRSEL */}
      <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-slate-50 border border-[var(--color-border)]">
        {src ? (
          <img
            src={src}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)] text-xs">
            —
          </div>
        )}
      </div>

      {/* BİLGİ */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-[var(--color-text-main)] text-sm sm:text-base line-clamp-2">
          {item.name}
        </h3>

        {/* 👟 NUMARA */}
        {item.size && (
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 font-medium">
            Numara:{" "}
            <span className="text-[var(--color-text-main)]">{item.size}</span>
          </p>
        )}

        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
          Birim: {formatPrice(item.price)}{" "}
          <span className="text-[var(--color-text-muted)]">(KDV dahil)</span>
        </p>
      </div>
      {item.sizes && item.sizes.length > 0 && (
        <div className="mt-2">
          <select
            value={item.size ?? ""}
            onChange={(e) =>
              changeSize(item.id, item.size ?? null, e.target.value)
            }
            className="border rounded-lg px-2 py-1 text-sm"
          >
            {item.sizes.map((s) => (
              <option key={s.size} value={s.size} disabled={s.stock <= 0}>
                {s.size} {s.stock <= 0 ? "(Stok yok)" : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ADET + FİYAT */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* ADET */}
        <div className="flex items-center gap-2 border border-[var(--color-border)] rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={decrease}
            disabled={item.quantity === 1}
            className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Azalt"
          >
            <Minus size={16} />
          </button>

          <span className="w-10 text-center font-semibold text-[var(--color-text-main)]">
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={increase}
            className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors"
            aria-label="Artır"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* FİYAT + KALDIR */}
        <div className="text-right min-w-[90px]">
          <p className="font-bold text-[var(--color-text-main)]">
            {formatPrice(item.price * item.quantity)}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            KDV:{" "}
            {formatPrice(
              getVATBreakdown(item.price * item.quantity, 1, 0.18).vatAmount,
            )}
          </p>

          <button
            type="button"
            onClick={handleRemove}
            className="flex items-center justify-end gap-1 text-[var(--color-danger)] text-xs font-medium hover:underline mt-1"
          >
            <Trash2 size={14} /> Kaldır
          </button>
        </div>
      </div>
    </div>
  );
}
