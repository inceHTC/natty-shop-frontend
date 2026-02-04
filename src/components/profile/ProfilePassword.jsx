import { useState } from "react";
import { API_URL } from "../../config";

const inputClass =
  "w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none transition";

export default function ProfilePassword() {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    newPasswordRepeat: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword.length < 6) {
      alert("Yeni şifre en az 6 karakter olmalıdır.");
      return;
    }

    if (form.newPassword !== form.newPasswordRepeat) {
      alert("Yeni şifreler birbiriyle uyuşmuyor.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/profile/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Şifre güncellenemedi");
      }

      alert("Şifreniz başarıyla güncellendi.");

      setForm({
        oldPassword: "",
        newPassword: "",
        newPasswordRepeat: "",
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden max-w-xl">
        {/* HEADER */}
        <div className="px-6 py-5 border-b bg-slate-50/50">
          <h2 className="font-semibold text-[var(--color-text-main)]">
            Şifre Değiştir
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Hesap güvenliğiniz için güçlü bir şifre belirleyin.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Mevcut Şifre
            </label>
            <input
              type="password"
              value={form.oldPassword}
              onChange={(e) =>
                setForm({ ...form, oldPassword: e.target.value })
              }
              className={inputClass}
              placeholder="Mevcut şifreniz"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Yeni Şifre
            </label>
            <input
              type="password"
              value={form.newPassword}
              onChange={(e) =>
                setForm({ ...form, newPassword: e.target.value })
              }
              className={inputClass}
              placeholder="En az 6 karakter"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Yeni Şifre (Tekrar)
            </label>
            <input
              type="password"
              value={form.newPasswordRepeat}
              onChange={(e) =>
                setForm({ ...form, newPasswordRepeat: e.target.value })
              }
              className={inputClass}
              placeholder="Yeni şifreyi tekrar girin"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl font-semibold bg-black text-white hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
          </button>
        </form>
      </div>
    </section>
  );
}
