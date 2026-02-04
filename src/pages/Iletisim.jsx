import { useState } from "react";
import BackLink from "../components/BackLink";
import { API_URL } from "../config";
import { Link } from "react-router-dom";
const CONTACT_INFO = {
  address: {
    title: "Adres",
    lines: ["Örnek Mah. Alışveriş Cad. No: 1", "Şişli / İstanbul"],
    icon: "📍",
  },
  phone: {
    title: "Telefon",
    lines: ["+90 (212) 555 00 00", "Müşteri Hizmetleri: 7/24"],
    icon: "📞",
  },
  email: {
    title: "E-posta",
    lines: ["info@natty.com.tr", "destek@natty.com.tr"],
    icon: "✉️",
  },
  hours: {
    title: "Çalışma Saatleri",
    lines: [
      "Pazartesi – Cuma: 09:00 – 18:00",
      "Cumartesi: 10:00 – 16:00",
      "Pazar: Kapalı",
    ],
    icon: "🕐",
  },
};

const inputClass =
  "w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none transition";

export default function Iletisim() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "Genel Bilgi",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("success");
        setStatusMessage(data.message || "Mesajınız alındı.");
        setForm({ name: "", email: "", subject: "Genel Bilgi", message: "" });
      } else {
        setStatus("error");
        setStatusMessage(
          data.message || "Gönderilemedi. Lütfen tekrar deneyin."
        );
      }
    } catch {
      setStatus("error");
      setStatusMessage("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)]">
      <section className="bg-white border-b border-[var(--color-border)]">
        <div className="page-container py-14 md:py-20">
          <nav className="mb-6">
            <BackLink fallback="/" />
          </nav>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--color-text-main)]">
            İletişim
          </h1>
          <p className="mt-4 text-[var(--color-text-secondary)] max-w-2xl text-lg leading-relaxed">
            Sorularınız, önerileriniz veya iş birliği talepleriniz için bize
            ulaşın. En kısa sürede size dönüş yapacağız.
          </p>
        </div>
      </section>

      <div className="page-container py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {Object.entries(CONTACT_INFO).map(([key, info]) => (
            <div
              key={key}
              className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-soft)] flex items-center justify-center text-2xl mb-4">
                {info.icon}
              </div>
              <h3 className="font-semibold text-[var(--color-text-main)] mb-2">
                {info.title}
              </h3>
              <ul className="text-sm text-[var(--color-text-secondary)] space-y-1">
                {info.lines.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6 sticky top-24">
              <h2 className="font-semibold text-[var(--color-text-main)] text-lg mb-4">
                Neden bize yazmalısınız?
              </h2>
              <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
                <li className="flex gap-3">
                  <span className="text-[var(--color-accent)] shrink-0">✓</span>
                  Sipariş ve teslimat sorularınız için 24 saat içinde yanıt
                </li>
                <li className="flex gap-3">
                  <span className="text-[var(--color-accent)] shrink-0">✓</span>
                  İade ve değişim taleplerinizde hızlı çözüm
                </li>
                <li className="flex gap-3">
                  <span className="text-[var(--color-accent)] shrink-0">✓</span>
                  Ürün önerisi ve özel sipariş talepleri
                </li>
                <li className="flex gap-3">
                  <span className="text-[var(--color-accent)] shrink-0">✓</span>
                  Kurumsal ve toplu alım teklifleri
                </li>
              </ul>
              <Link
                to="/"
                className="mt-6 inline-block text-sm font-medium text-[var(--color-accent)] hover:underline"
              >
                ← Anasayfaya dön
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6 md:p-8">
              <h2 className="font-serif text-xl font-bold text-[var(--color-text-main)] mb-2">
                Bize mesaj gönderin
              </h2>
              <p className="text-[var(--color-text-secondary)] text-sm mb-6">
                Aşağıdaki formu doldurarak bize ulaşabilirsiniz.
              </p>

              {status === "success" && (
                <div className="mb-6 p-4 rounded-xl bg-green-50 text-[var(--color-success)] text-sm flex items-center gap-3">
                  ✓ {statusMessage}
                </div>
              )}
              {status === "error" && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 text-[var(--color-danger)] text-sm flex items-center gap-3">
                  ✕ {statusMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-[var(--color-text-main)] mb-1"
                    >
                      Ad Soyad *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Adınız Soyadınız"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[var(--color-text-main)] mb-1"
                    >
                      E-posta *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="ornek@email.com"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-[var(--color-text-main)] mb-1"
                  >
                    Konu
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className={inputClass + " bg-white"}
                  >
                    <option value="Genel Bilgi">Genel Bilgi</option>
                    <option value="Sipariş / Kargo">Sipariş / Kargo</option>
                    <option value="İade / Değişim">İade / Değişim</option>
                    <option value="Ürün Önerisi">Ürün Önerisi</option>
                    <option value="Kurumsal">Kurumsal</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-[var(--color-text-main)] mb-1"
                  >
                    Mesajınız *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Mesajınızı buraya yazın..."
                    className={inputClass + " resize-none"}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 rounded-xl font-semibold bg-[var(--color-text-main)] text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
                >
                  {loading ? "Gönderiliyor..." : "Gönder"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
