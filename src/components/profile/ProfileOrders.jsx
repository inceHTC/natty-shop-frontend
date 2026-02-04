import { formatPrice } from "../../utils/formatPrice";

export default function ProfileOrders({ orders }) {
  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div
          key={o.id}
          className="bg-white rounded-xl border p-4 flex justify-between"
        >
          <div>
            <p className="font-semibold">#{o.id}</p>
            <p className="text-sm text-slate-500">{o.status}</p>
          </div>
          <div className="font-semibold">
            {formatPrice(o.total)}
          </div>
        </div>
      ))}
    </div>
  );
}
