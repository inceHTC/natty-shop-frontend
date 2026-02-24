import { Link } from "react-router-dom";
import { Package } from "lucide-react";

export default function ProfileOrders({ orders }) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
      <h2 className="font-semibold text-lg text-[var(--color-text-main)] mb-4">
        Siparişlerim
      </h2>
      {!orders?.length ? (
        <div className="text-center py-8">
          <Package className="w-12 h-12 mx-auto text-[var(--color-text-muted)] mb-3" />
          <p className="text-[var(--color-text-secondary)] mb-4">
            Henüz siparişiniz yok.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[var(--color-text-main)] text-white font-medium hover:opacity-90"
          >
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.slice(0, 5).map((order) => (
            <Link
              key={order.id}
              to="/siparislerim"
              className="block p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-text-main)] transition-colors"
            >
              <span className="font-medium">Sipariş #{order.id}</span>
              <span className="text-[var(--color-text-muted)] text-sm ml-2">
                {new Date(order.createdAt).toLocaleDateString("tr-TR")}
              </span>
            </Link>
          ))}
          {orders.length > 5 && (
            <Link
              to="/siparislerim"
              className="inline-block text-sm font-medium text-[var(--color-accent)] hover:underline"
            >
              Tüm siparişleri görüntüle →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
