import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";
import { API_URL } from "../config";
import BackLink from "../components/BackLink";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
  Copy,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const STATUS_CONFIG = {
  Hazırlanıyor: {
    label: "Hazırlanıyor",
    icon: Package,
    className: "bg-amber-50 text-amber-800 border border-amber-200",
    canCancel: true,
    canReturn: false,
  },
  "Kargoya Verildi": {
    label: "Kargoya Verildi",
    icon: Truck,
    className: "bg-blue-50 text-blue-800 border border-blue-200",
    canCancel: false,
    canReturn: false,
  },
  Kargoda: {
    label: "Kargoda",
    icon: Truck,
    className: "bg-blue-50 text-blue-800 border border-blue-200",
    canCancel: false,
    canReturn: false,
  },
  "Teslim Edildi": {
    label: "Teslim Edildi",
    icon: CheckCircle,
    className: "bg-green-50 text-green-800 border border-green-200",
    canCancel: false,
    canReturn: true,
  },
  Tamamlandı: {
    label: "Teslim Edildi",
    icon: CheckCircle,
    className: "bg-green-50 text-green-800 border border-green-200",
    canCancel: false,
    canReturn: true,
  },
  "İptal Edildi": {
    label: "İptal Edildi",
    icon: XCircle,
    className: "bg-slate-100 text-slate-600 border border-slate-200",
    canCancel: false,
    canReturn: false,
  },
};

const RETURN_STATUS_LABELS = {
  TalepEdildi: "Talep Alındı",
  IadeKoduVerildi: "İade Kodu Verildi",
  Kargoda: "Kargoya Verildi",
  Tamamlandı: "İade Tamamlandı",
};

export default function Siparislerim() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [returningId, setReturningId] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [showReturnModal, setShowReturnModal] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const fetchOrders = () => {
    fetch(`${API_URL}/orders/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const getStatusConfig = (status) =>
    STATUS_CONFIG[status] || {
      label: status,
      icon: Package,
      className: "bg-slate-100 text-slate-700 border border-slate-200",
      canCancel: false,
      canReturn: false,
    };

  const handleCancel = async (orderId) => {
    if (
      !window.confirm(
        "Bu siparişi iptal etmek istediğinize emin misiniz? Bu işlem geri alınamaz."
      )
    )
      return;
    setError(null);
    setCancellingId(orderId);
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "İptal işlemi başarısız");
      fetchOrders();
    } catch (err) {
      setError(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  const handleReturnRequest = (order) => {
    setShowReturnModal(order);
    setReturnReason("");
  };

  const submitReturnRequest = async () => {
    if (!showReturnModal) return;
    setError(null);
    setReturningId(showReturnModal.id);
    try {
      const res = await fetch(
        `${API_URL}/orders/${showReturnModal.id}/return-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason: returnReason.trim() || undefined }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(data.message || "İade talebi oluşturulamadı");
      const orderId = showReturnModal.id;
      setShowReturnModal(null);
      fetchOrders();
      setExpandedOrder(orderId);
    } catch (err) {
      setError(err.message);
    } finally {
      setReturningId(null);
    }
  };

  const copyReturnCode = (code) => {
    navigator.clipboard?.writeText(code);
    // Toast could be used here
  };

  if (loading) {
    return (
      <div className="page-container py-20 text-center text-[var(--color-text-secondary)]">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="page-container py-10 md:py-14 max-w-3xl mx-auto">
      <nav className="mb-6">
        <BackLink fallback="/profile" />
      </nav>
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-text-main)] mb-2">
        Siparişlerim
      </h1>
      <p className="text-[var(--color-text-secondary)] text-sm mb-8">
        Siparişlerinizi takip edin, iptal veya iade talebi oluşturun
      </p>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-12 md:p-16 text-center">
          <Package className="w-16 h-16 mx-auto text-[var(--color-text-muted)] mb-4" />
          <p className="text-[var(--color-text-secondary)] text-lg mb-6">
            Henüz siparişiniz yok.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-[var(--color-text-main)] text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const config = getStatusConfig(order.status);
            const StatusIcon = config.icon;
            const isExpanded = expandedOrder === order.id;
            const hasReturn = order.return;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden"
              >
                {/* Sipariş başlığı */}
                <div
                  className="p-6 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[var(--color-text-main)]">
                        Sipariş #{order.id}
                      </span>
                      <span className="text-[var(--color-text-secondary)] text-sm">
                        {new Date(order.createdAt).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${config.className}`}
                    >
                      <StatusIcon className="w-4 h-4" />
                      {config.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="font-semibold text-lg text-[var(--color-text-main)]">
                      {formatPrice(order.total)}
                    </p>
                    <span className="text-[var(--color-text-muted)]">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </span>
                  </div>
                </div>

                {/* Açılır detay */}
                {isExpanded && (
                  <div className="border-t border-[var(--color-border)] bg-slate-50/30 p-6">
                    <ul className="text-sm text-[var(--color-text-secondary)] mb-6 space-y-2">
                      {order.items?.map((item) => (
                        <li key={item.id} className="flex justify-between">
                          <span>
                            {item.product}
                            {item.size && (
                              <span className="text-[var(--color-text-muted)] font-normal ml-1">
                                (No: {item.size})
                              </span>
                            )}{" "}
                            × {item.quantity}
                          </span>
                          <span className="font-medium text-[var(--color-text-main)]">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* İade kodu kutusu (varsa) */}
                    {hasReturn && (
                      <div className="mb-6 p-4 rounded-xl bg-white border-2 border-dashed border-[var(--color-accent)]">
                        <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                          İade Kodu
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                          <code className="text-lg font-mono font-bold text-[var(--color-text-main)] bg-slate-100 px-3 py-2 rounded-lg">
                            {order.return.returnCode}
                          </code>
                          <button
                            type="button"
                            onClick={() =>
                              copyReturnCode(order.return.returnCode)
                            }
                            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] hover:underline"
                          >
                            <Copy className="w-4 h-4" />
                            Kopyala
                          </button>
                        </div>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-3">
                          İade durumu:{" "}
                          <span className="font-medium text-[var(--color-text-main)]">
                            {RETURN_STATUS_LABELS[order.return.status] ||
                              order.return.status}
                          </span>
                        </p>
                        <div className="mt-3 p-3 rounded-lg bg-amber-50 text-amber-800 text-xs">
                          <strong>İade adımları:</strong> Ürünü orijinal
                          kutusunda, iade kodu ile birlikte kargoya verin. Kargo
                          takip numarasını müşteri hizmetlerine iletin.
                        </div>
                      </div>
                    )}

                    {/* Aksiyonlar */}
                    <div className="flex flex-wrap gap-3">
                      {config.canCancel && (
                        <button
                          type="button"
                          disabled={cancellingId === order.id}
                          onClick={() => handleCancel(order.id)}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                          {cancellingId === order.id
                            ? "İptal ediliyor..."
                            : "Siparişi İptal Et"}
                        </button>
                      )}
                      {config.canReturn && !hasReturn && (
                        <button
                          type="button"
                          onClick={() => handleReturnRequest(order)}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-[var(--color-accent)] bg-[var(--color-accent-soft)] hover:bg-amber-100 border border-amber-200 transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                          İade Talebi Oluştur / İade Kodu Al
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* İade talebi modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="font-serif text-xl font-bold text-[var(--color-text-main)] mb-2">
              İade Talebi Oluştur
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              Sipariş #{showReturnModal.id} için iade kodu alacaksınız. Ürünü
              orijinal kutusunda bu kod ile kargoya verebilirsiniz.
            </p>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
              İade nedeni (isteğe bağlı)
            </label>
            <textarea
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              placeholder="Örn: Ürün beklentimi karşılamadı"
              className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm resize-none h-24 mb-6 focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowReturnModal(null)}
                className="flex-1 py-3 rounded-xl font-medium border-2 border-[var(--color-border)] text-[var(--color-text-main)] hover:bg-slate-50 transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="button"
                disabled={returningId !== null}
                onClick={submitReturnRequest}
                className="flex-1 py-3 rounded-xl font-medium bg-[var(--color-accent)] text-[var(--color-text-main)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors"
              >
                {returningId ? "Oluşturuluyor..." : "İade Kodu Al"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
