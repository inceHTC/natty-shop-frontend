import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { API_URL } from "../config";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const location = useLocation();

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Siparişler alınamadı:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API_URL}/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, status } : order))
      );
    } catch (err) {
      console.error("Durum güncellenemedi:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <aside className="w-60 bg-slate-900 text-white flex-shrink-0" />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-slate-500">Yükleniyor...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-60 bg-slate-900 text-white flex-shrink-0 flex flex-col">
        <div className="p-5 border-b border-slate-700">
          <h1 className="text-lg font-semibold tracking-tight">Admin Panel</h1>
          <p className="text-slate-400 text-xs mt-1">Yönetim Paneli</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/admin"
                ? "bg-slate-700 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span className="text-slate-400">📦</span> Ürünler
          </Link>
          <Link
            to="/admin/orders"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/admin/orders"
                ? "bg-slate-700 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span className="text-slate-400">📋</span> Siparişler
          </Link>
        </nav>
        <div className="p-3 border-t border-slate-700">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            ← Siteye Dön
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6 lg:p-8">
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-semibold text-slate-800">
                Siparişler
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {orders.length} sipariş
              </p>
            </div>
            <div className="p-6">
              {orders.length === 0 ? (
                <p className="text-slate-500">Henüz sipariş yok.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                        <div>
                          <p className="font-semibold text-slate-800">
                            #{order.id} – {order.user?.firstName}{" "}
                            {order.user?.lastName}
                          </p>
                          <p className="text-sm text-slate-500">
                            {order.user?.email}
                          </p>
                        </div>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(order.id, e.target.value)
                          }
                          className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:ring-2 focus:ring-slate-300 outline-none"
                        >
                          <option value="Hazırlanıyor">Hazırlanıyor</option>
                          <option value="Kargoya Verildi">
                            Kargoya Verildi
                          </option>
                          <option value="Kargoda">Kargoda</option>
                          <option value="Teslim Edildi">Teslim Edildi</option>
                          <option value="Tamamlandı">Tamamlandı</option>
                          <option value="İptal Edildi">İptal Edildi</option>
                        </select>
                      </div>
                      <ul className="text-sm text-slate-600 mb-3 space-y-1">
                        {order.items?.map((item) => (
                          <li key={item.id}>
                            • {item.product}
                            {item.size && (
                              <span className="text-slate-500">
                                {" "}
                                (No: {item.size})
                              </span>
                            )}{" "}
                            × {item.quantity}
                          </li>
                        ))}
                      </ul>
                      {order.return && (
                        <p className="text-sm text-amber-700 mb-2">
                          İade kodu: <strong>{order.return.returnCode}</strong>{" "}
                          — {order.return.status}
                        </p>
                      )}
                      <p className="font-semibold text-slate-800">
                        Toplam: {Number(order.total).toFixed(2)} ₺
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
