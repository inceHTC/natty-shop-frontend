import { useState } from "react";
import { API_URL } from "../../config";

export default function ProfilePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);
    if (newPassword !== confirm) {
      setMessage("Yeni şifreler eşleşmiyor.");
      return;
    }
    if (newPassword.length < 6) {
      setMessage("Yeni şifre en az 6 karakter olmalı.");
      return;
    }
    setLoading(true);
    fetch(`${API_URL}/profile/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        oldPassword,
        newPassword,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.message) {
          setMessage(data.message);
          setOldPassword("");
          setNewPassword("");
          setConfirm("");
        } else {
          setMessage(data.message || "Şifre güncellendi.");
        }
      })
      .catch(() => setMessage("Bir hata oluştu."))
      .finally(() => setLoading(false));
  };

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
      <h2 className="font-semibold text-lg text-[var(--color-text-main)] mb-4">
        Şifre Değiştir
      </h2>
      {message && (
        <p
          className={`mb-4 text-sm ${
            message.includes("güncellendi")
              ? "text-[var(--color-success)]"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
            Mevcut şifre
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border border-[var(--color-border)] rounded-xl px-4 py-2.5"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
            Yeni şifre
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-[var(--color-border)] rounded-xl px-4 py-2.5"
            required
            minLength={6}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
            Yeni şifre (tekrar)
          </label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border border-[var(--color-border)] rounded-xl px-4 py-2.5"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-[var(--color-text-main)] text-white font-medium hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
        </button>
      </form>
    </div>
  );
}
