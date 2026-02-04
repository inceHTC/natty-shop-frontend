import { Link, useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import { formatPrice, getVATBreakdown } from "../utils/formatPrice";

const SHIPPING_FEE = 79;
const FREE_SHIPPING_LIMIT = 1000;
const VAT_RATE = 0.18;

export default function Cart({
  cart,
  removeFromCart,
  updateQuantity,
  changeCartItemSize,
}) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = subtotal >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_FEE;
  const vatBreakdown = getVATBreakdown(subtotal + shipping, 1, VAT_RATE);
  const total = vatBreakdown.total;

  const freeShippingRemaining = Math.max(
    FREE_SHIPPING_LIMIT - subtotal,
    0
  );

  const progressPercent = Math.min(
    (subtotal / FREE_SHIPPING_LIMIT) * 100,
    100
  );

  const handleCheckout = () => {
    if (!token) {
      navigate("/auth", { state: { from: { pathname: "/checkout" } } });
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="page-container py-10 md:py-14">
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-text-main)] mb-8">
        Sepetiniz
      </h1>

      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        {/* SEPET LİSTESİ */}
        <div className="md:col-span-2">
          {cart.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[var(--color-border)] p-12 md:p-16 text-center">
              <h2 className="font-serif text-xl font-semibold text-[var(--color-text-main)] mb-2">
                Sepetiniz boş
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-8">
                Hemen alışverişe başlayabilirsiniz.
              </p>
              <Link
                to="/"
                className="inline-flex items-center justify-center bg-[var(--color-text-main)] text-white font-semibold px-6 py-3.5 rounded-xl hover:opacity-90 transition-opacity"
              >
                Alışverişe Başla
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <CartItem
                  key={`${item.id}-${item.size ?? "nosize"}`}
                  item={item}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                  changeSize={changeCartItemSize}
                />
              ))}
            </div>
          )}
        </div>

        {/* SİPARİŞ ÖZETİ */}
        {cart.length > 0 && (
          <div className="md:sticky md:top-24 h-fit">
            <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
              <h2 className="font-semibold text-[var(--color-text-main)] mb-4 text-lg">
                Sipariş Özeti
              </h2>

              {/* BEDAVA KARGO BAR */}
              {shipping > 0 ? (
                <div className="mb-5">
                  <p className="text-xs text-[var(--color-accent)] mb-2">
                    🚚 Kargo bedava için{" "}
                    <strong>
                      {formatPrice(freeShippingRemaining)}
                    </strong>{" "}
                    daha ekleyin
                  </p>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-accent)] transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="mb-5 text-sm font-medium text-green-600">
                  🎉 Tebrikler! Kargonuz ücretsiz
                </div>
              )}

              <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
                <div className="flex justify-between">
                  <span>Ara Toplam</span>
                  <span className="text-[var(--color-text-main)] font-medium">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Kargo</span>
                  <span className="text-[var(--color-text-main)] font-medium">
                    {shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}
                  </span>
                </div>
              </div>

              <hr className="my-5 border-[var(--color-border)]" />

              <div className="space-y-1.5 text-sm mb-6">
                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span>KDV (%18 dahil)</span>
                  <span className="text-[var(--color-text-main)]">
                    {formatPrice(vatBreakdown.vatAmount)}
                  </span>
                </div>

                <div className="flex justify-between font-bold text-[var(--color-text-main)] text-lg pt-1">
                  <span>Toplam</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <p className="text-xs text-[var(--color-text-muted)]">
                  Tüm fiyatlar KDV dahildir
                </p>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-4 rounded-xl font-semibold bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-text-main)] transition-colors shadow-sm hover:shadow"
              >
                Satın Al
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
