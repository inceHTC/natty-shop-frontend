import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { formatPrice, getVATBreakdown } from "../utils/formatPrice";
import { API_URL } from "../config";
import CreditCardForm from "../components/CreditCardForm";
import {
  CreditCard,
  Building2,
  Banknote,
  Truck,
  Check,
} from "lucide-react";
import CheckoutSteps from "../components/CheckoutSteps";

const SHIPPING_FEE = 79;
const FREE_SHIPPING_LIMIT = 1000;
const VAT_RATE = 0.18;

const PAYMENT_METHODS = [
  { id: "credit_card", label: "Kredi Kartı", icon: CreditCard },
  { id: "bank_transfer", label: "Havale / EFT", icon: Building2 },
  { id: "cash_on_delivery", label: "Kapıda Ödeme", icon: Banknote },
];

function validateCard(cardNumber, expiry, cvv, cardHolder) {
  const err = {};
  const rawNumber = cardNumber.replace(/\s/g, "");
  if (rawNumber.length < 16) err.cardNumber = "Geçerli kart numarası girin";
  if (!cardHolder?.trim()) err.cardHolder = "Kart sahibi adını girin";
  const [mm, yy] = (expiry || "").split("/");
  if (!mm || !yy || mm.length !== 2 || yy.length !== 2)
    err.expiry = "Geçerli son kullanma tarihi (MM/YY)";
  else if (+mm < 1 || +mm > 12) err.expiry = "Geçersiz ay";
  if ((cvv || "").length < 3) err.cvv = "CVV 3 veya 4 haneli olmalı";
  return err;
}

export default function Checkout({ cart, setCart }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [installment, setInstallment] = useState(1);

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardErrors, setCardErrors] = useState({});

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const shipping = subtotal >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_FEE;
  const vatBreakdown = getVATBreakdown(subtotal + shipping, 1, VAT_RATE);
  const total = vatBreakdown.total;

  useEffect(() => {
    fetch(`${API_URL}/addresses`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAddresses(Array.isArray(data) ? data : []))
      .catch(() => setAddresses([]));
  }, [token]);
// ⭐ Varsayılan adresi otomatik seç
useEffect(() => {
  if (!selectedAddress && addresses.length > 0) {
    const def = addresses.find((a) => a.isDefault);
    if (def) {
      setSelectedAddress(def.id);
    }
  }
}, [addresses, selectedAddress]);

  const handleNextStep = () => {
    if (selectedAddress) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

const handleOrder = async () => {
  if (!selectedAddress) return alert("Adres seçin");

  if (paymentMethod === "credit_card") {
    const err = validateCard(cardNumber, expiry, cvv, cardHolder);
    if (Object.keys(err).length) {
      setCardErrors(err);
      return;
    }
  }

  if (!agreeTerms) {
    alert("Sözleşmeyi kabul etmelisiniz");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        cart,
        total,
        address: addresses.find(a => a.id === selectedAddress),
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    setCart([]);
    localStorage.removeItem("cart");

    // 🔴 ÖNEMLİ KISIM
    navigate(`/siparis-basarili/${data.id}`);
  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};

  if (cart.length === 0 && !loading) {
    return (
      <div className="page-container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Sepetiniz boş</h1>
        <Link to="/" className="underline">
          Anasayfaya dön
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container py-10 md:py-14">
      <CheckoutSteps currentStep={step - 1} />

      {/* TESLİMAT ADRESİ */}
      <section className="bg-white rounded-2xl border mb-6">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2">
            <Truck className="w-5 h-5" /> Teslimat Adresi
          </h2>
        </div>
        <div className="p-6 space-y-3">
        {addresses.length === 0 && (
  <div className="p-6 rounded-xl border border-dashed text-center">
    <p className="text-slate-600 mb-4">
      Kayıtlı adresiniz bulunmuyor.
    </p>

  <Link
  to="/profile"
  state={{ tab: "addresses" }}
  className="inline-block px-6 py-3 rounded-xl bg-black text-white font-medium"
>
  Adres Ekle
</Link>


  </div>
)}

          {addresses.map((a) => (
            <label
              key={a.id}
              className={`block p-4 rounded-xl border cursor-pointer ${
                selectedAddress === a.id
                  ? "border-black bg-slate-50"
                  : "border-slate-200"
              }`}
            >
              <input
                type="radio"
                checked={selectedAddress === a.id}
                onChange={() => setSelectedAddress(a.id)}
                className="mr-2"
              />
              <strong>{a.title}</strong>
              <div className="text-sm text-slate-600">{a.address}</div>
            </label>
          ))}

          {step === 1 && (
            <button
              onClick={handleNextStep}
              disabled={!selectedAddress}
              className="w-full mt-4 py-3 rounded-xl bg-black text-white disabled:opacity-40"
            >
              Devam Et
            </button>
          )}
        </div>
      </section>

      {/* ÖDEME */}
      {step === 2 && (
        <>
          <section className="bg-white rounded-2xl border mb-6 p-6">
            <div className="grid sm:grid-cols-3 gap-3 mb-6">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm.id}
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`p-4 rounded-xl border ${
                    paymentMethod === pm.id
                      ? "border-black bg-slate-50"
                      : "border-slate-200"
                  }`}
                >
                  <pm.icon className="mx-auto mb-2" />
                  {pm.label}
                </button>
              ))}
            </div>

            {paymentMethod === "credit_card" && (
              <CreditCardForm
                cardNumber={cardNumber}
                setCardNumber={setCardNumber}
                expiry={expiry}
                setExpiry={setExpiry}
                cvv={cvv}
                setCvv={setCvv}
                cardHolder={cardHolder}
                setCardHolder={setCardHolder}
                installment={installment}
                setInstallment={setInstallment}
                totalAmount={total}
                errors={cardErrors}
              />
            )}

            <label className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span className="text-sm">
                Mesafeli satış sözleşmesini kabul ediyorum
              </span>
            </label>
          </section>

          <button
            onClick={handleOrder}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-green-600 text-white font-semibold"
          >
            {loading ? "İşleniyor..." : "Siparişi Tamamla"}
          </button>
        </>
      )}
    </div>
  );
}
