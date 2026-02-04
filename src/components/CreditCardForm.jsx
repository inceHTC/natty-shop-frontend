import { useState, useCallback } from "react";
import { CreditCard, Lock, Shield } from "lucide-react";
import { formatPrice } from "../utils/formatPrice";

const CARD_LOGOS = {
  visa: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
  mastercard:
    "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
  troy: "https://www.bkm.com.tr/wp-content/uploads/2021/11/troy-logo.svg",
};

function formatCardNumber(value) {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  const parts = [];
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  if (parts.length) {
    return parts.join(" ");
  }
  return value;
}

function formatExpiry(value) {
  const v = value.replace(/\D/g, "");
  if (v.length >= 2) {
    return v.substring(0, 2) + "/" + v.substring(2, 4);
  }
  return v;
}

export default function CreditCardForm({
  cardNumber,
  setCardNumber,
  expiry,
  setExpiry,
  cvv,
  setCvv,
  cardHolder,
  setCardHolder,
  installment,
  setInstallment,
  totalAmount,
  errors = {},
}) {
  const [cvvFocused, setCvvFocused] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const handleCardNumberChange = useCallback(
    (e) => {
      const val = e.target.value.replace(/\s/g, "");
      if (val.length <= 16 && /^\d*$/.test(val)) {
        setCardNumber(formatCardNumber(val));
      }
    },
    [setCardNumber]
  );

  const handleExpiryChange = useCallback(
    (e) => {
      const val = e.target.value.replace(/\D/g, "");
      if (val.length <= 4) {
        setExpiry(formatExpiry(val));
      }
    },
    [setExpiry]
  );

  const handleCvvChange = useCallback(
    (e) => {
      const val = e.target.value.replace(/\D/g, "").slice(0, 4);
      setCvv(val);
    },
    [setCvv]
  );

  const installments = [
    { value: 1, label: "Tek Çekim", commission: 0 },
    { value: 2, label: "2 Taksit", commission: 0 },
    { value: 3, label: "3 Taksit", commission: 1.5 },
    { value: 6, label: "6 Taksit", commission: 2.5 },
    { value: 9, label: "9 Taksit", commission: 3.5 },
    { value: 12, label: "12 Taksit", commission: 4.5 },
  ];

  const getInstallmentAmount = (opt) =>
    opt.value === 1
      ? totalAmount ?? 0
      : (totalAmount * (1 + (opt.commission || 0) / 100)) / opt.value;

  return (
    <div className="space-y-5">
      {/* Kart Görsel Önizleme */}
      <div
        className="relative  cursor-pointer"
        style={{ perspective: "1000px" }}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
      >
        <div
          className="relative w-100 h-50 rounded-2xl shadow-xl transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Ön yüz */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 p-5 flex flex-col justify-between"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex justify-between items-start">
              <CreditCard className="w-10 h-10 text-white/60" />
              <div className="flex gap-2">
                <img
                  src={CARD_LOGOS.visa}
                  alt="Visa"
                  className="h-8 object-contain opacity-80"
                />
                <img
                  src={CARD_LOGOS.mastercard}
                  alt="Mastercard"
                  className="h-8 object-contain opacity-80"
                />
              </div>
            </div>
            <div>
              <p className="text-white/90 font-mono text-lg tracking-widest mb-2">
                {cardNumber || "•••• •••• •••• ••••"}
              </p>
              <div className="flex justify-between text-white/70 text-sm">
                <span className="uppercase tracking-wider">
                  {cardHolder || "KART SAHİBİ"}
                </span>
                <span>{expiry || "MM/YY"}</span>
              </div>
            </div>
          </div>
          {/* Arka yüz */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 p-5 flex flex-col justify-end"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="h-10 bg-black/50 -mx-5 mt-4 mb-3" />
            <div className="flex justify-end">
              <span className="text-white/90 font-mono text-sm px-3 py-1 bg-white/20 rounded">
                CVV: {cvv ? "•".repeat(cvv.length) : "•••"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Alanları */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1.5">
            Kart Numarası
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={19}
            placeholder="0000 0000 0000 0000"
            value={cardNumber}
            onChange={handleCardNumberChange}
            className={`w-full px-4 py-3 rounded-xl border-2 font-mono text-lg tracking-widest transition-colors focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] ${
              errors.cardNumber
                ? "border-red-300 bg-red-50"
                : "border-[var(--color-border)] hover:border-slate-300"
            }`}
          />
          {errors.cardNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1.5">
            Kart Üzerindeki İsim
          </label>
          <input
            type="text"
            placeholder="AD SOYAD"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
            maxLength={40}
            className={`w-full px-4 py-3 rounded-xl border-2 uppercase transition-colors focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] ${
              errors.cardHolder
                ? "border-red-300 bg-red-50"
                : "border-[var(--color-border)] hover:border-slate-300"
            }`}
          />
          {errors.cardHolder && (
            <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1.5">
              Son Kullanma Tarihi
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              placeholder="MM/YY"
              value={expiry}
              onChange={handleExpiryChange}
              onFocus={() => setFlipped(false)}
              className={`w-full px-4 py-3 rounded-xl border-2 font-mono tracking-widest transition-colors focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] ${
                errors.expiry
                  ? "border-red-300 bg-red-50"
                  : "border-[var(--color-border)] hover:border-slate-300"
              }`}
            />
            {errors.expiry && (
              <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1.5">
              CVV / Güvenlik Kodu
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              placeholder="•••"
              value={cvv}
              onChange={handleCvvChange}
              onFocus={() => setCvvFocused(true) || setFlipped(true)}
              onBlur={() => setCvvFocused(false) || setFlipped(false)}
              className={`w-full px-4 py-3 rounded-xl border-2 font-mono transition-colors focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] ${
                errors.cvv
                  ? "border-red-300 bg-red-50"
                  : "border-[var(--color-border)] hover:border-slate-300"
              }`}
            />
            {errors.cvv && (
              <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
            )}
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              Kartın arkasındaki 3 haneli kod
            </p>
          </div>
        </div>

        {/* Taksit Seçenekleri */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-main)] mb-3">
            Taksit Seçenekleri
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {installments.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setInstallment(opt.value)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  installment === opt.value
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                    : "border-[var(--color-border)] hover:border-slate-300 bg-white"
                }`}
              >
                <span className="block font-semibold text-[var(--color-text-main)]">
                  {opt.label}
                </span>
                <span className="block text-xs text-[var(--color-text-secondary)] mt-0.5">
                  {opt.value === 1
                    ? formatPrice(totalAmount ?? 0)
                    : `${opt.value} x ${formatPrice(getInstallmentAmount(opt))}`}
                  {opt.commission > 0 && (
                    <span className="text-amber-600"> (+%{opt.commission})</span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Güvenlik Rozetleri */}
      <div className="flex items-center gap-4 py-3 px-4 rounded-xl bg-slate-50 border border-[var(--color-border)]">
        <Lock className="w-5 h-5 text-[var(--color-success)] flex-shrink-0" />
        <Shield className="w-5 h-5 text-[var(--color-success)] flex-shrink-0" />
        <p className="text-sm text-[var(--color-text-secondary)]">
          256-bit SSL ile güvenli ödeme. Kart bilgileriniz şifrelenir.
        </p>
      </div>
    </div>
  );
}
