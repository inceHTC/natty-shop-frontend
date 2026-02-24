import { useState } from "react";
import { API_URL } from "../../config";

export default function ProfileAddresses({ addresses, setAddresses }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("token");

  const resetForm = () => {
    setTitle("");
    setFullName("");
    setPhone("");
    setCity("");
    setDistrict("");
    setAddress("");
    setShowForm(false);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title || !fullName || !phone || !city || !district || !address) return;
    setSaving(true);
    fetch(`${API_URL}/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        fullName,
        phone,
        city,
        district,
        address,
      }),
    })
      .then((r) => r.json())
      .then((newAddr) => {
        setAddresses((prev) => [newAddr, ...(prev || [])]);
        resetForm();
      })
      .finally(() => setSaving(false));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bu adresi silmek istediğinize emin misiniz?")) return;
    fetch(`${API_URL}/addresses/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => setAddresses((prev) => (prev || []).filter((a) => a.id !== id)));
  };

  const handleSetDefault = (id) => {
    fetch(`${API_URL}/addresses/${id}/default`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((updated) => {
        setAddresses((prev) =>
          (prev || []).map((a) => ({
            ...a,
            isDefault: a.id === updated.id,
          }))
        );
      });
  };

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
      <h2 className="font-semibold text-lg text-[var(--color-text-main)] mb-4">
        Adreslerim
      </h2>
      {!addresses?.length && !showForm ? (
        <p className="text-[var(--color-text-secondary)] mb-4">
          Kayıtlı adresiniz yok.
        </p>
      ) : (
        <ul className="space-y-3 mb-6">
          {(addresses || []).map((a) => (
            <li
              key={a.id}
              className={`p-4 rounded-xl border ${
                a.isDefault
                  ? "border-[var(--color-text-main)] bg-slate-50"
                  : "border-[var(--color-border)]"
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="font-medium">{a.title}</span>
                  {a.isDefault && (
                    <span className="ml-2 text-xs bg-[var(--color-text-main)] text-white px-2 py-0.5 rounded">
                      Varsayılan
                    </span>
                  )}
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    {a.fullName} · {a.phone}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {a.address}, {a.district}, {a.city}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!a.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(a.id)}
                      className="text-xs font-medium text-[var(--color-accent)] hover:underline"
                    >
                      Varsayılan yap
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(a.id)}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {showForm ? (
        <form onSubmit={handleAdd} className="space-y-3 max-w-md border-t pt-4">
          <input
            type="text"
            placeholder="Adres başlığı (örn. Ev)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm"
            required
          />
          <input
            type="text"
            placeholder="Ad Soyad"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm"
            required
          />
          <input
            type="text"
            placeholder="Telefon"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm"
            required
          />
          <input
            type="text"
            placeholder="İl"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm"
            required
          />
          <input
            type="text"
            placeholder="İlçe"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm"
            required
          />
          <textarea
            placeholder="Açık adres"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm resize-none"
            rows={2}
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-[var(--color-text-main)] text-white text-sm font-medium disabled:opacity-60"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-sm"
            >
              İptal
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] font-medium text-sm hover:border-[var(--color-text-main)] transition-colors"
        >
          + Yeni adres ekle
        </button>
      )}
    </div>
  );
}
