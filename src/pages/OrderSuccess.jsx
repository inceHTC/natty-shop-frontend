import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import CheckoutSteps from "../components/CheckoutSteps";
import { API_URL } from "../config";
import { formatPrice } from "../utils/formatPrice";

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setOrder)
      .catch(() => setError(true));
  }, [id]);

  if (error) {
    return (
      <div className="page-container py-20 text-center">
        <h1 className="text-xl font-semibold">Sipariş bulunamadı</h1>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page-container py-20 text-center">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="page-container py-20 max-w-3xl mx-auto">
      <CheckoutSteps currentStep={3} />

      <div className="text-center mb-10">
        <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">
          Siparişiniz Başarıyla Oluşturuldu
        </h1>
        <p className="text-gray-500">
          Sipariş No: <strong>#{order.id}</strong>
        </p>
      </div>

      <div className="bg-white rounded-2xl border p-6 space-y-4">
        <p><strong>Durum:</strong> {order.status}</p>
        <p><strong>Telefon:</strong> {order.phone}</p>
        <p><strong>Adres:</strong> {order.addressText}</p>

        <hr />

        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>
              {item.product}
              {item.size && ` (No: ${item.size})`} × {item.quantity}
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}

        <hr />

        <div className="flex justify-between font-bold text-lg">
          <span>Toplam</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="flex gap-4 justify-center mt-10">
        <Link
          to="/siparislerim"
          className="px-6 py-3 rounded-xl bg-black text-white"
        >
          Siparişlerimi Gör
        </Link>

        <Link
          to="/"
          className="px-6 py-3 rounded-xl border"
        >
          Anasayfaya Dön
        </Link>
      </div>
    </div>
  );
}
