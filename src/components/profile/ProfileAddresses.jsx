import { useState } from "react";
import { API_URL } from "../../config";

const inputClass =
  "w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-accent)]/30 outline-none";

export default function ProfileAddresses({ addresses, setAddresses }) {
  const token = localStorage.getItem("token");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    fullName: "",
    phone: "",
    city: "",
    district: "",
    address: "",
  });

  const addAddress = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.message || "Adres eklenemedi");
      return;
    }

    setAddresses((prev) => [...prev, data]);
    setShowForm(false);
    setForm({
      title: "",
      fullName: "",
      phone: "",
      city: "",
      district: "",
      address: "",
    });
  };

  const setDefaultAddress = async (id) => {
    const res = await fetch(`${API_URL}/addresses/${id}/default`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      alert("Varsayılan adres ayarlanamadı");
      return;
    }

    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  return (
    <section>
      <div className="bg-white rounded-2xl border shadow-sm">
        {/* HEADER */}
        <div className="px-6 py-5 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Adreslerim</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Teslimat adreslerinizi yönetin
            </p>
          </div>
          <button
            onClick={() => setShowForm((p) => !p)}
            className="text-sm font-medium text-[var(--color-accent)] hover:underline"
          >
            {showForm ? "Vazgeç" : "+ Yeni Adres Ekle"}
          </button>
        </div>

        {/* FORM */}
        {showForm && (
          <form
            onSubmit={addAddress}
            className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 border-b"
          >
            {Object.keys(form).map((key) => (
              <div key={key} className={key === "address" ? "md:col-span-2" : ""}>
                <label className="block text-xs font-medium mb-1 capitalize">
                  {key}
                </label>
                <input
                  value={form[key]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            ))}

            <button
              type="submit"
              className="md:col-span-2 mt-2 py-3 rounded-xl font-semibold bg-black text-white hover:opacity-90"
            >
              Adresi Kaydet
            </button>
          </form>
        )}

        {/* ADDRESS LIST */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((a) => (
            <div
              key={a.id}
              className="relative border rounded-xl p-4 bg-slate-50 hover:shadow transition"
            >
              {a.isDefault && (
                <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-black text-white">
                  Varsayılan
                </span>
              )}

              <div className="font-semibold mb-1">{a.title}</div>
              <div className="text-sm">{a.fullName}</div>
              <div className="text-sm">{a.phone}</div>
              <div className="text-sm text-[var(--color-text-secondary)] mt-1">
                {a.city} / {a.district}
              </div>
              <div className="text-sm text-[var(--color-text-secondary)]">
                {a.address}
              </div>

              {!a.isDefault && (
                <button
                  onClick={() => setDefaultAddress(a.id)}
                  className="mt-3 text-xs font-medium text-[var(--color-accent)] hover:underline"
                >
                  Varsayılan Yap
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
